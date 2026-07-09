//=============================================================================
// JR_AugmentLifeSteal.js
//=============================================================================

/*:
 * @plugindesc v1.02 Extension for YEP_X_AttachAugments to support YEP_LifeSteal effects natively.
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
 * - YEP_LifeSteal
 * Place this plugin below all three of them in the Plugin Manager.
 *
 * It allows you to use the following syntaxes directly inside an <Augment: X>
 * notetag. (Works identically for both HP and MP):
 *
 * Static Percentage:
 * HP Life Steal Physical: +50%
 * MP Life Steal Magical: -20%
 * HP Life Steal Not Magical: +25%
 *
 * Static Flat:
 * HP Life Steal Certain: +35
 * MP Life Steal Physical: -10
 * MP Life Steal Not Physical: +15
 *
 * Formula Percentage (Must be enclosed in parentheses):
 * HP Life Steal Physical: +(user.atk)%
 * MP Life Steal Not Certain: -(user.mat / 2)%
 *
 * Formula Flat (Must be enclosed in parentheses):
 * HP Life Steal Certain: +(user.level)
 * MP Life Steal Not Magical: -(user.def)
 *
 * ============================================================================
 */

if (Imported.YEP_X_AttachAugments && Imported.YEP_LifeSteal) {

    // ============================================================================
    // Yanfly Math.floor Overwrites (Ensures minimum 1 HP/MP if > 0)
    // ============================================================================

    Game_Battler.prototype.lifeSteal = function(damage, type, target, rate, flat) {
        if (!type) return;
        rate = 1 - (rate || 0);
        flat = flat || 0;
        rate *= 1 - this.getLifeStealRate(type + 'Rate', target);
        flat += this.getLifeStealFlat(type + 'Flat', target);
        
        // REPLACED Math.floor with Math.ceil
        if (Yanfly.Param.LSHPNeg) {
          var lifeSteal = Math.ceil(damage * (1 - rate) + flat);
        } else {
          var lifeSteal = Math.max(0, Math.ceil(damage * (1 - rate) + flat));
        }
        
        if (Yanfly.Param.LSHPOver) lifeSteal = Math.min(lifeSteal, damage);
        if (lifeSteal <= 0) return;
        this.gainHp(lifeSteal);
    };

    Game_Battler.prototype.magicSteal = function(damage, type, target, rate, flat) {
        if (!type) return;
        rate = 1 - (rate || 0);
        flat = flat || 0;
        rate *= 1 - this.getLifeStealRate(type + 'Rate', target);
        flat += this.getLifeStealFlat(type + 'Flat', target);
        
        // REPLACED Math.floor with Math.ceil
        if (Yanfly.Param.LSMPNeg) {
          var lifeSteal = Math.ceil(damage * (1 - rate) + flat);
        } else {
          var lifeSteal = Math.max(0, Math.ceil(damage * (1 - rate) + flat));
        }
        
        if (Yanfly.Param.LSMPOver) lifeSteal = Math.min(lifeSteal, damage);
        if (lifeSteal <= 0) return;
        this.gainMp(lifeSteal);
    };

    // ============================================================================
    // Augment Parsing Code
    // ============================================================================

    // Alias the main Augment Effect processing function
    var _ItemManager_processAugmentEffect = ItemManager.processAugmentEffect;
    ItemManager.processAugmentEffect = function(line, mainItem, effectItem, slot) {
        
        // 1. Formula Rate: HP Life Steal Physical: +(user.atk)%
        if (line.match(/(HP|MP)[ ]LIFE STEAL[ ](PHYSICAL|MAGICAL|CERTAIN|NOT PHYSICAL|NOT MAGICAL|NOT CERTAIN):[ ]([\+\-])\((.*)\)([%％])/i)) {
            var type = String(RegExp.$1).toLowerCase();
            var hitStr = String(RegExp.$2);
            var sign = String(RegExp.$3);
            var formula = String(RegExp.$4);
            
            var hits = this.getLifeStealHitKeys(hitStr);
            for (var i = 0; i < hits.length; i++) {
                this.applyAugmentLifeStealEval(mainItem, type, hits[i], 'Rate', sign, formula);
            }
            return;
        }
        
        // 2. Formula Flat: HP Life Steal Physical: +(user.atk)
        if (line.match(/(HP|MP)[ ]LIFE STEAL[ ](PHYSICAL|MAGICAL|CERTAIN|NOT PHYSICAL|NOT MAGICAL|NOT CERTAIN):[ ]([\+\-])\((.*)\)/i)) {
            var type = String(RegExp.$1).toLowerCase();
            var hitStr = String(RegExp.$2);
            var sign = String(RegExp.$3);
            var formula = String(RegExp.$4);
            
            var hits = this.getLifeStealHitKeys(hitStr);
            for (var i = 0; i < hits.length; i++) {
                this.applyAugmentLifeStealEval(mainItem, type, hits[i], 'Flat', sign, formula);
            }
            return;
        }
        
        // 3. Static Rate: HP Life Steal Physical: +50%
        if (line.match(/(HP|MP)[ ]LIFE STEAL[ ](PHYSICAL|MAGICAL|CERTAIN|NOT PHYSICAL|NOT MAGICAL|NOT CERTAIN):[ ]([\+\-]\d+)([%％])/i)) {
            var type = String(RegExp.$1).toLowerCase();
            var hitStr = String(RegExp.$2);
            var value = parseFloat(RegExp.$3) * 0.01;
            
            var hits = this.getLifeStealHitKeys(hitStr);
            for (var i = 0; i < hits.length; i++) {
                this.applyAugmentLifeStealRate(mainItem, type, hits[i], value);
            }
            return;
        }
        
        // 4. Static Flat: HP Life Steal Physical: +35
        if (line.match(/(HP|MP)[ ]LIFE STEAL[ ](PHYSICAL|MAGICAL|CERTAIN|NOT PHYSICAL|NOT MAGICAL|NOT CERTAIN):[ ]([\+\-]\d+)/i)) {
            var type = String(RegExp.$1).toLowerCase();
            var hitStr = String(RegExp.$2);
            var value = parseInt(RegExp.$3);
            
            var hits = this.getLifeStealHitKeys(hitStr);
            for (var i = 0; i < hits.length; i++) {
                this.applyAugmentLifeStealFlat(mainItem, type, hits[i], value);
            }
            return;
        }

        // Pass any unmatched line back to the default Yanfly parser
        _ItemManager_processAugmentEffect.call(this, line, mainItem, effectItem, slot);
    };

    // Safety check: ensure the item has a LifeSteal object container before modifying it
    ItemManager.checkLifeStealObject = function(item) {
        if (item.lifeSteal === undefined) {
            item.lifeSteal = {
                hpPhysicalRate: 0, hpMagicalRate: 0, hpCertainRate: 0,
                hpPhysicalFlat: 0, hpMagicalFlat: 0, hpCertainFlat: 0,
                mpPhysicalRate: 0, mpMagicalRate: 0, mpCertainRate: 0,
                mpPhysicalFlat: 0, mpMagicalFlat: 0, mpCertainFlat: 0,
                allGuard: false, hpGuard: false, mpGuard: false,
                allNull: false, hpNull: false, mpNull: false
            };
        }
    };

    // Formats the hit string into an array of targets to support the "NOT" variants
    ItemManager.getLifeStealHitKeys = function(hit) {
        hit = hit.toUpperCase();
        if (hit === 'PHYSICAL') return ['Physical'];
        if (hit === 'MAGICAL') return ['Magical'];
        if (hit === 'CERTAIN') return ['Certain'];
        if (hit === 'NOT PHYSICAL') return ['Magical', 'Certain'];
        if (hit === 'NOT MAGICAL') return ['Physical', 'Certain'];
        if (hit === 'NOT CERTAIN') return ['Physical', 'Magical'];
        return [];
    };

    ItemManager.applyAugmentLifeStealRate = function(mainItem, type, hitKey, value) {
        this.checkLifeStealObject(mainItem);
        var key = type + hitKey + 'Rate';
        
        var add = $gameTemp._augmentSetting === 'attach';
        if (add) {
            mainItem.lifeSteal[key] += value;
        } else {
            mainItem.lifeSteal[key] -= value;
        }
    };

    ItemManager.applyAugmentLifeStealFlat = function(mainItem, type, hitKey, value) {
        this.checkLifeStealObject(mainItem);
        var key = type + hitKey + 'Flat';
        
        mainItem.lifeSteal[key] += value;
    };

    ItemManager.applyAugmentLifeStealEval = function(mainItem, type, hitKey, param, sign, formula) {
        this.checkLifeStealObject(mainItem);
        var key = type + hitKey + param + 'Eval';
        var add = $gameTemp._augmentSetting === 'attach';
        
        var varName = param.toLowerCase(); 
        var code = varName + " " + sign + "= (" + formula + ")";
        
        if (param === 'Rate') {
            code += " * 0.01;\n";
        } else {
            code += ";\n";
        }
        
        mainItem.lifeSteal[key] = mainItem.lifeSteal[key] || '';
        
        if (add) {
            mainItem.lifeSteal[key] += code;
        } else {
            mainItem.lifeSteal[key] = mainItem.lifeSteal[key].replace(code, '');
        }
    };

}