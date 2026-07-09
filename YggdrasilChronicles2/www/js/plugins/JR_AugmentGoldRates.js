//=============================================================================
// JR_AugmentGoldRates.js
//=============================================================================

/*:
 * @plugindesc Connects YEP_X_AttachAugments with AP_GoldItemRate to allow for dynamic and flat augment rate changes.
 * @author JR
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * This extension allows you to use AP_GoldItemRate properties inside 
 * Yanfly's Attachable Augments. 
 *
 * You can use standard flat percentages or dynamic JavaScript evaluations 
 * based on the actor currently holding the weapon/armor.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 * You can insert the following effects into your <Augment: type> blocks:
 *
 * Gold Rate: +x%
 * Gold Rate: -x%
 * Gold Rate: +(formula)%
 * Gold Rate: -(formula)%
 *
 * Item Rate: +x%
 * Item Rate: -x%
 * Item Rate: +(formula)%
 * Item Rate: -(formula)%
 *
 * Examples:
 * <Augment: Glyph>
 * Gold Rate: +20%
 * Item Rate: +(user.luk)%
 * </Augment: Glyph>
 *
 * "user" and "a" both refer to the specific actor holding the augmented gear.
 */

(function() {

    if (!Imported.YEP_X_AttachAugments || !Imported.AP_GoldItemRate) {
        console.warn("JR_AugmentGoldRates requires both YEP_X_AttachAugments and AP_GoldItemRate to be installed.");
        return;
    }

    //=============================================================================
    // ItemManager (YEP_X_AttachAugments hook)
    //=============================================================================
    var _ItemManager_processAugmentEffect = ItemManager.processAugmentEffect;
    ItemManager.processAugmentEffect = function(line, mainItem, effectItem, slot) {

        // Hook for GOLD RATE
        if (line.match(/GOLD RATE:[ ]([\+\-])(.*)([%％])/i)) {
            var sign = String(RegExp.$1);
            var valStr = String(RegExp.$2).trim();
            if (!isNaN(valStr)) {
                var value = parseFloat(valStr);
                if (sign === '-') value = -value;
                return this.applyAugmentGoldRate(mainItem, value);
            } else {
                var formula = valStr;
                if (sign === '-') formula = '-(' + formula + ')';
                return this.applyAugmentGoldRateEval(mainItem, formula);
            }
        }

        // Hook for ITEM RATE
        if (line.match(/ITEM RATE:[ ]([\+\-])(.*)([%％])/i)) {
            var sign = String(RegExp.$1);
            var valStr = String(RegExp.$2).trim();
            if (!isNaN(valStr)) {
                var value = parseFloat(valStr);
                if (sign === '-') value = -value;
                return this.applyAugmentItemRate(mainItem, value);
            } else {
                var formula = valStr;
                if (sign === '-') formula = '-(' + formula + ')';
                return this.applyAugmentItemRateEval(mainItem, formula);
            }
        }

        // Continue with normal Yanfly augment processing
        _ItemManager_processAugmentEffect.call(this, line, mainItem, effectItem, slot);
    };

    // Apply Flat Gold Rate
    ItemManager.applyAugmentGoldRate = function(mainItem, value) {
        var add = $gameTemp._augmentSetting === 'attach';
        if (mainItem.goldFlat === undefined) mainItem.goldFlat = 0;
        if (add) {
            mainItem.goldFlat += (value * 0.01);
        } else {
            mainItem.goldFlat -= (value * 0.01);
        }
    };

    // Apply Dynamic Gold Rate Formula
    ItemManager.applyAugmentGoldRateEval = function(mainItem, formula) {
        var add = $gameTemp._augmentSetting === 'attach';
        mainItem.goldFlatEvals = mainItem.goldFlatEvals || [];
        if (add) {
            mainItem.goldFlatEvals.push(formula);
        } else {
            var index = mainItem.goldFlatEvals.indexOf(formula);
            if (index >= 0) mainItem.goldFlatEvals.splice(index, 1);
        }
    };

    // Apply Flat Item Rate
    ItemManager.applyAugmentItemRate = function(mainItem, value) {
        var add = $gameTemp._augmentSetting === 'attach';
        if (mainItem.itemFlat === undefined) mainItem.itemFlat = 0;
        if (add) {
            mainItem.itemFlat += (value * 0.01);
        } else {
            mainItem.itemFlat -= (value * 0.01);
        }
    };

    // Apply Dynamic Item Rate Formula
    ItemManager.applyAugmentItemRateEval = function(mainItem, formula) {
        var add = $gameTemp._augmentSetting === 'attach';
        mainItem.itemFlatEvals = mainItem.itemFlatEvals || [];
        if (add) {
            mainItem.itemFlatEvals.push(formula);
        } else {
            var index = mainItem.itemFlatEvals.indexOf(formula);
            if (index >= 0) mainItem.itemFlatEvals.splice(index, 1);
        }
    };

    //=============================================================================
    // Game_Troop (AP_GoldItemRate hook for Gold)
    //=============================================================================
    var _Game_Troop_goldRate = Game_Troop.prototype.goldRate;
    Game_Troop.prototype.goldRate = function() {
        var addedValues = [];
        
        // 1. Temporarily evaluate and inject dynamic formulas into the gear right before AP checks it
        var members = $gameParty.members();
        for (var i = 0; i < members.length; i++) {
            var actor = members[i];
            var user = actor; // Mapped for 'user' evaluations
            var a = actor;    // Mapped for 'a' evaluations
            
            var equips = actor.equips();
            for (var j = 0; j < equips.length; j++) {
                var equip = equips[j];
                if (equip && equip.goldFlatEvals && equip.goldFlatEvals.length > 0) {
                    var dynamicTotal = 0;
                    if (equip.goldFlat === undefined) equip.goldFlat = 0;
                    
                    for (var k = 0; k < equip.goldFlatEvals.length; k++) {
                        try {
                            var val = eval(equip.goldFlatEvals[k]);
                            dynamicTotal += (parseFloat(val) * 0.01);
                        } catch (e) {
                            console.error("JR_AugmentGoldRates: Gold Eval Error", e);
                        }
                    }
                    
                    // Backup the static value to prevent floating point drift and save file bloat
                    addedValues.push({ equip: equip, original: equip.goldFlat });
                    equip.goldFlat += dynamicTotal;
                }
            }
        }
        
        // 2. Run the actual AP Gold Calculation
        var result = _Game_Troop_goldRate.call(this);
        
        // 3. Clean up the dynamic additions
        for (var idx = 0; idx < addedValues.length; idx++) {
            addedValues[idx].equip.goldFlat = addedValues[idx].original;
        }
        
        return result;
    };

    //=============================================================================
    // Game_Enemy (AP_GoldItemRate hook for Drops)
    //=============================================================================
    var _Game_Enemy_dropItemRate = Game_Enemy.prototype.dropItemRate;
    Game_Enemy.prototype.dropItemRate = function() {
        var addedValues = [];
        
        var members = $gameParty.members();
        for (var i = 0; i < members.length; i++) {
            var actor = members[i];
            var user = actor; 
            var a = actor;    
            
            var equips = actor.equips();
            for (var j = 0; j < equips.length; j++) {
                var equip = equips[j];
                if (equip && equip.itemFlatEvals && equip.itemFlatEvals.length > 0) {
                    var dynamicTotal = 0;
                    if (equip.itemFlat === undefined) equip.itemFlat = 0;
                    
                    for (var k = 0; k < equip.itemFlatEvals.length; k++) {
                        try {
                            var val = eval(equip.itemFlatEvals[k]);
                            dynamicTotal += (parseFloat(val) * 0.01);
                        } catch (e) {
                            console.error("JR_AugmentGoldRates: Item Eval Error", e);
                        }
                    }
                    
                    addedValues.push({ equip: equip, original: equip.itemFlat });
                    equip.itemFlat += dynamicTotal;
                }
            }
        }
        
        var result = _Game_Enemy_dropItemRate.call(this);
        
        for (var idx = 0; idx < addedValues.length; idx++) {
            addedValues[idx].equip.itemFlat = addedValues[idx].original;
        }
        
        return result;
    };

})();