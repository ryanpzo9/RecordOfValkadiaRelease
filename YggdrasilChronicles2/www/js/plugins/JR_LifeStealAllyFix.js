//=============================================================================
// JR_LifeStealAllyFix.js
//=============================================================================

/*:
 * @plugindesc v1.11 Prevents YEP_LifeSteal from triggering on allies under any circumstances.
 * @author JR
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * 
 * YEP_LifeSteal natively evaluates life steal by checking if the damage dealt 
 * is greater than zero[cite: 3]. This allows battlers to accidentally lifesteal 
 * off of their own allies (via AoE friendly fire or self-damage). 
 * 
 * This patch intercepts the life steal condition checks and restricts it 
 * using proper faction logic. 
 * 
 * Lifesteal is ONLY granted if the target is an active opponent 
 * (Actor vs Enemy or Enemy vs Actor). Friendly fire, even under confusion 
 * or charm, will never trigger life steal.
 * 
 * Place this plugin anywhere BELOW YEP_LifeSteal.js in the Plugin Manager.
 * 
 * ============================================================================
 */

if (Imported.YEP_LifeSteal) {

    // Helper function to check if lifesteal should be allowed based on faction
    Game_Action.prototype.isLifeStealFactionValid = function(target) {
        // Only allow if the target is actively in the opposing unit
        return this.subject().opponentsUnit().members().contains(target);
    };

    // Alias HP Life Steal Check
    var _Game_Action_canLifeStealHp = Game_Action.prototype.canLifeStealHp;
    Game_Action.prototype.canLifeStealHp = function(damage, target, value) {
        if (!this.isLifeStealFactionValid(target)) return false;
        
        // Otherwise, process normal Yanfly logic[cite: 3]
        return _Game_Action_canLifeStealHp.call(this, damage, target, value);
    };

    // Alias MP Life Steal Check
    var _Game_Action_canLifeStealMp = Game_Action.prototype.canLifeStealMp;
    Game_Action.prototype.canLifeStealMp = function(damage, target, value) {
        if (!this.isLifeStealFactionValid(target)) return false;
        
        // Otherwise, process normal Yanfly logic[cite: 3]
        return _Game_Action_canLifeStealMp.call(this, damage, target, value);
    };

}