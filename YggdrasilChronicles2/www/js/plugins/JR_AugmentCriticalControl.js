//=============================================================================
// JR_AugmentCriticalControl.js
//=============================================================================

/*:
 * @plugindesc v1.01 Extension for YEP_X_AttachAugments to support YEP_X_CriticalControl effects natively in augment notetags.
 * @author JR
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin requires:
 * - YEP_ItemCore
 * - YEP_X_AttachAugments
 * - YEP_DamageCore
 * - YEP_X_CriticalControl
 * Place this plugin below all four of them in the Plugin Manager.
 *
 * It allows you to use the following syntaxes directly inside an <Augment: X>
 * notetag to control critical hit damage:
 *
 * Static Percentage:
 * Critical Multiplier: +50%
 * Critical Multiplier: -20%
 *
 * Static Flat:
 * Flat Critical: +35
 * Flat Critical: -10
 *
 * Formula Percentage (Must be enclosed in parentheses):
 * Critical Multiplier: +(user.atk)%
 * Critical Multiplier: -(user.mat / 2)%
 *
 * Formula Flat (Must be enclosed in parentheses):
 * Flat Critical: +(user.level)
 * Flat Critical: -(user.def)
 *
 * ============================================================================
 */

if (Imported.YEP_X_AttachAugments && Imported.YEP_X_CriticalControl) {

    // Alias the main Augment Effect processing function
    var _ItemManager_processAugmentEffect_Crit = ItemManager.processAugmentEffect;
    ItemManager.processAugmentEffect = function(line, mainItem, effectItem, slot) {
        
        // 1. Formula Rate: Critical Multiplier: +(user.atk)%
        if (line.match(/CRITICAL MULTIPLIER:[ ]([\+\-])\((.*)\)([%％])/i)) {
            var sign = String(RegExp.$1);
            var formula = String(RegExp.$2);
            this.applyAugmentCritEval(mainItem, 'critMultEval', sign, formula, true);
            return;
        }
        
        // 2. Formula Flat: Flat Critical: +(user.atk)
        if (line.match(/FLAT CRITICAL:[ ]([\+\-])\((.*)\)/i)) {
            var sign = String(RegExp.$1);
            var formula = String(RegExp.$2);
            this.applyAugmentCritEval(mainItem, 'flatCritEval', sign, formula, false);
            return;
        }
        
        // 3. Static Rate: Critical Multiplier: +50%
        if (line.match(/CRITICAL MULTIPLIER:[ ]([\+\-]\d+)([%％])/i)) {
            var value = parseFloat(RegExp.$1) * 0.01;
            this.applyAugmentCritMult(mainItem, value);
            return;
        }
        
        // 4. Static Flat: Flat Critical: +35
        if (line.match(/FLAT CRITICAL:[ ]([\+\-]\d+)/i)) {
            var value = parseInt(RegExp.$1);
            this.applyAugmentFlatCrit(mainItem, value);
            return;
        }

        // Pass any unmatched line back to the default Yanfly parser
        _ItemManager_processAugmentEffect_Crit.call(this, line, mainItem, effectItem, slot);
    };

    // Safety check: ensure the item has the Critical Control parameters initialized
    ItemManager.checkCritObjects = function(item) {
        if (item.critMultBonus === undefined) item.critMultBonus = 0;
        if (item.flatCritBonus === undefined) item.flatCritBonus = 0;
        if (item.critMultEval === undefined) item.critMultEval = '';
        if (item.flatCritEval === undefined) item.flatCritEval = '';
    };

    ItemManager.applyAugmentCritMult = function(mainItem, value) {
        this.checkCritObjects(mainItem);
        // Yanfly disabled % string reversal for augment detachment, so we subtract manually 
        var add = $gameTemp._augmentSetting === 'attach';
        if (add) {
            mainItem.critMultBonus += value;
        } else {
            mainItem.critMultBonus -= value;
        }
        
        // FLOATING-POINT FIX: Round to 4 decimal places to prevent infinite microscopic decimals
        mainItem.critMultBonus = parseFloat(mainItem.critMultBonus.toFixed(4));
    };

    ItemManager.applyAugmentFlatCrit = function(mainItem, value) {
        this.checkCritObjects(mainItem);
        // Yanfly's reverseAugmentAutoLine automatically flips the sign of flat integers
        // upon detachment. So we just ALWAYS += the value passed from the parser.
        mainItem.flatCritBonus += value;
    };

    ItemManager.applyAugmentCritEval = function(mainItem, property, sign, formula, isRate) {
        this.checkCritObjects(mainItem);
        var add = $gameTemp._augmentSetting === 'attach';
        var code = "bonus " + sign + "= (" + formula + ")";
        
        if (isRate) {
            code += " * 0.01;\n";
        } else {
            code += ";\n";
        }
        
        // If attaching, append the JS formula. If detaching, remove it.
        if (add) {
            mainItem[property] += code;
        } else {
            mainItem[property] = mainItem[property].replace(code, '');
        }
    };

    //=============================================================================
    // Game_Actor
    //=============================================================================
    
    // Inject the formula evaluation into the Actor's Critical Multiplier Bonus calculations
    var _Game_Actor_criticalMultiplierBonus = Game_Actor.prototype.criticalMultiplierBonus;
    Game_Actor.prototype.criticalMultiplierBonus = function() {
        var multiplier = _Game_Actor_criticalMultiplierBonus.call(this);
        var a = this;
        var user = this;
        var subject = this;
        var s = $gameSwitches._data;
        var v = $gameVariables._data;
        
        for (var i = 0; i < this.equips().length; ++i) {
            var equip = this.equips()[i];
            if (equip && equip.critMultEval) {
                var bonus = 0;
                try {
                    eval(equip.critMultEval);
                    multiplier += bonus;
                } catch (e) {
                    console.error("Augment Crit Mult Eval Error", e);
                }
            }
        }
        return multiplier;
    };

    // Inject the formula evaluation into the Actor's Flat Critical Bonus calculations
    var _Game_Actor_flatCriticalBonus = Game_Actor.prototype.flatCriticalBonus;
    Game_Actor.prototype.flatCriticalBonus = function() {
        var value = _Game_Actor_flatCriticalBonus.call(this);
        var a = this;
        var user = this;
        var subject = this;
        var s = $gameSwitches._data;
        var v = $gameVariables._data;
        
        for (var i = 0; i < this.equips().length; ++i) {
            var equip = this.equips()[i];
            if (equip && equip.flatCritEval) {
                var bonus = 0;
                try {
                    eval(equip.flatCritEval);
                    value += bonus;
                } catch (e) {
                    console.error("Augment Flat Crit Eval Error", e);
                }
            }
        }
        return value;
    };

    //=============================================================================
    // Game_Enemy (Fallback compatibility for YEP_EquipEnemies)
    //=============================================================================

    var _Game_Enemy_criticalMultiplierBonus = Game_Enemy.prototype.criticalMultiplierBonus;
    Game_Enemy.prototype.criticalMultiplierBonus = function() {
        var multiplier = _Game_Enemy_criticalMultiplierBonus.call(this);
        if (this.equips) {
            var a = this;
            var user = this;
            var subject = this;
            var s = $gameSwitches._data;
            var v = $gameVariables._data;
            for (var i = 0; i < this.equips().length; ++i) {
                var equip = this.equips()[i];
                if (equip && equip.critMultEval) {
                    var bonus = 0;
                    try { eval(equip.critMultEval); multiplier += bonus; } catch (e) {}
                }
            }
        }
        return multiplier;
    };

    var _Game_Enemy_flatCriticalBonus = Game_Enemy.prototype.flatCriticalBonus;
    Game_Enemy.prototype.flatCriticalBonus = function() {
        var value = _Game_Enemy_flatCriticalBonus.call(this);
        if (this.equips) {
            var a = this;
            var user = this;
            var subject = this;
            var s = $gameSwitches._data;
            var v = $gameVariables._data;
            for (var i = 0; i < this.equips().length; ++i) {
                var equip = this.equips()[i];
                if (equip && equip.flatCritEval) {
                    var bonus = 0;
                    try { eval(equip.flatCritEval); value += bonus; } catch (e) {}
                }
            }
        }
        return value;
    };

}