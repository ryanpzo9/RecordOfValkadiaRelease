//=============================================================================
// JR_AugmentBlocking.js
//=============================================================================

/*:
 * @plugindesc v1.10 Extension for YEP_X_AttachAugments and AP_Blocking. Adds streamlined blocking effects.
 * @author JR
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin bridges Yanfly's Attachable Augments and Alistair's Blocking
 * plugins. It allows you to modify a battler's block rates and damage 
 * reductions using a unified, clean syntax.
 *
 * You can use flat numbers or complex formulas based on the user's
 * parameters (e.g., user.def, user.mdf, etc.).
 *
 * ============================================================================
 * Augment Effect List
 * ============================================================================
 *
 * Use the following effects in your <Augment: type> notetags. The 'x' can
 * be a flat number or a formula. The '%' sign is optional and will be parsed
 * appropriately. You must include the + or - sign.
 *
 * Physical Block Rate: +x% or -x%
 * Magical Block Rate: +x% or -x%
 * Certain Block Rate: +x% or -x%
 * Block Damage Reduction: +x% or -x%
 * Flat Damage Reduction: +x or -x
 *
 * --- Examples ---
 *
 * <Augment: Glyph>
 *  Physical Block Rate: +50%
 *  Magical Block Rate: -25%
 *  Flat Damage Reduction: +(user.def + user.mdf)
 * </Augment: Glyph>
 */

var Imported = Imported || {};
Imported.JR_AugmentBlocking = true;

var JR = JR || {};
JR.AugmentBlocking = JR.AugmentBlocking || {};

if (Imported.YEP_ItemCore && Imported.YEP_X_AttachAugments && Imported.AP_Blocking) {

    //=============================================================================
    // DataManager
    //=============================================================================
    // We bypass Yanfly's auto-reversal for these specific tags so that formulas 
    // and percentages aren't mangled by YEP_X_AttachAugments' regex limitations.
    var _JR_DataManager_reverseAugmentAutoLine = DataManager.reverseAugmentAutoLine;
    DataManager.reverseAugmentAutoLine = function(line) {
        if (line.match(/(PHYSICAL BLOCK RATE|MAGICAL BLOCK RATE|CERTAIN BLOCK RATE|BLOCK DAMAGE REDUCTION|FLAT DAMAGE REDUCTION):/i)) {
            return line; 
        }
        return _JR_DataManager_reverseAugmentAutoLine.call(this, line);
    };

    //=============================================================================
    // ItemManager
    //=============================================================================
    var _JR_ItemManager_processAugmentEffect = ItemManager.processAugmentEffect;
    ItemManager.processAugmentEffect = function(line, mainItem, effectItem, slot) {
        
        if (line.match(/(PHYSICAL BLOCK RATE|MAGICAL BLOCK RATE|CERTAIN BLOCK RATE|BLOCK DAMAGE REDUCTION|FLAT DAMAGE REDUCTION):[ ]([\+\-])(.*)/i)) {
            var statNameStr = String(RegExp.$1).toUpperCase().trim();
            var sign = String(RegExp.$2);
            var value = String(RegExp.$3).replace(/[%％]$/g, '').trim();
            
            // Check if Yanfly's ItemManager is currently attaching or detaching
            var isAttach = ($gameTemp._augmentSetting !== 'detach');
            
            // Determine if we should ultimately Add or Subtract
            var isAdd = (sign === '+');
            if (!isAttach) isAdd = !isAdd; // Flip the mathematical operation when detaching
            
            var statKey = '';
            if (statNameStr === 'PHYSICAL BLOCK RATE') statKey = 'phyBlockRateMod';
            if (statNameStr === 'MAGICAL BLOCK RATE') statKey = 'magBlockRateMod';
            if (statNameStr === 'CERTAIN BLOCK RATE') statKey = 'cerBlockRateMod';
            if (statNameStr === 'BLOCK DAMAGE REDUCTION') statKey = 'blockReductionMod';
            if (statNameStr === 'FLAT DAMAGE REDUCTION') statKey = 'flatReductionMod';

            this.applyAugmentBlockStat(mainItem, statKey, value, isAdd);
            return;
        }

        // Call original Yanfly logic for any other standard effects
        return _JR_ItemManager_processAugmentEffect.call(this, line, mainItem, effectItem, slot);
    };

    ItemManager.applyAugmentBlockStat = function(mainItem, statName, value, isAdd) {
        if (mainItem[statName] === undefined) {
            mainItem[statName] = 0;
        }

        // Optimization: If both the current stat and the new value are numerical, calculate the math directly
        // to avoid creating bloated eval strings over long play sessions.
        if (!isNaN(Number(value)) && !isNaN(Number(mainItem[statName]))) {
            if (isAdd) {
                mainItem[statName] = Number(mainItem[statName]) + Number(value);
            } else {
                mainItem[statName] = Number(mainItem[statName]) - Number(value);
            }
        } else {
            // If it's a dynamic formula (like user.def), append it to the evaluation string.
            if (isAdd) {
                mainItem[statName] = String(mainItem[statName]) + " + (" + value + ")";
            } else {
                mainItem[statName] = String(mainItem[statName]) + " - (" + value + ")";
            }
        }
    };

} else {
    console.warn("JR_AugmentBlocking requires YEP_ItemCore, YEP_X_AttachAugments, and AP_Blocking to be installed.");
}