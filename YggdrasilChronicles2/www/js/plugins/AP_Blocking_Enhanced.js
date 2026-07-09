//=============================================================================
// AP_Blocking_Enhanced.js
//=============================================================================
/*:
 * @plugindesc v1.00 Adds functionality to check if a successful block occurs via .isSuccessfulBlocked() script call.
 * @author James Ryan
 * 
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * This plugin extends the AP_Blocking plugin to provide a script call
 * `.isSuccessfulBlocked()` to check if the last attack on a battler was
 * successfully blocked.
 * 
 * Place this plugin below AP_Blocking.js in the Plugin Manager.
 * 
 * ============================================================================
 * Usage
 * ============================================================================
 * Use the script call:
 *   battler.isSuccessfulBlocked();
 * 
 * Example:
 *   if ($gameActors.actor(1).isSuccessfulBlocked()) {
 *     console.log("Actor 1 successfully blocked the last hit!");
 *   }
 * 
 * You can also retrieve the remaining incoming damage after blocking
 * (or the unmodified damage if no block occurred) via:
 *   battler.getRemainingDamageTaken();
 * 
 * And the amount of damage that was successfully blocked via:
 *   battler.getBlockedDamage();
 * 
 * Example:
 *   var actor = $gameActors.actor(1);
 *   if (actor.isSuccessfulBlocked()) {
 *     console.log("Actor 1 blocked " + actor.getBlockedDamage() + " damage! Remaining: " + actor.getRemainingDamageTaken());
 *   }
 * 
 * ============================================================================
 * Terms of Use
 * ============================================================================
 * Free for use in commercial and non-commercial projects with credit.
 * 
 * ============================================================================
 */

// Ensure dependency
if (Imported.AP_Blocking) {

(function() {
    // Store successful block status
    Game_BattlerBase.prototype._successfulBlock = false;
    // Store remaining damage taken after a block (or the unmodified value if no block occurred)
    Game_BattlerBase.prototype._remainingDamageTaken = 0;
    // Store the amount of damage successfully blocked (0 if no block occurred)
    Game_BattlerBase.prototype._blockedDamage = 0;

    /**
     * Check if the last hit was successfully blocked.
     * @returns {boolean} True if the last attack was blocked, false otherwise.
     */
    Game_BattlerBase.prototype.isSuccessfulBlocked = function() {
        return this._successfulBlock;
    };

    /**
     * Get the remaining incoming damage after blocking was applied.
     * Only meaningful right after isSuccessfulBlocked() fires; reflects
     * the damage value as of the end of makeBlocking (later compatibility
     * hooks in AP_Blocking.js, e.g. AP_CatNip, may still adjust it further
     * before the hit actually lands).
     * @returns {number} The remaining damage value.
     */
    Game_BattlerBase.prototype.getRemainingDamageTaken = function() {
        return this._remainingDamageTaken;
    };

    /**
     * Get the amount of damage that was successfully blocked on the last hit.
     * Returns 0 if isSuccessfulBlocked() is false.
     * @returns {number} The amount of damage blocked.
     */
    Game_BattlerBase.prototype.getBlockedDamage = function() {
        return this._blockedDamage;
    };

    // Extend makeBlocking to track successful blocks
    const AP_Blocking_Game_Action_makeBlocking = Game_Action.prototype.makeBlocking;
    Game_Action.prototype.makeBlocking = function(value, target, item) {
        // Call the original method
        const newValue = AP_Blocking_Game_Action_makeBlocking.call(this, value, target, item);

        // Determine if a block occurred
        const blockOccurred = (value > newValue); // Value was reduced by blocking
        target._successfulBlock = blockOccurred;
        target._remainingDamageTaken = Math.round(newValue);
        target._blockedDamage = blockOccurred ? Math.round(value - newValue) : 0;

        return newValue; // Return modified damage value
    };

})();
} else {
    console.error("AP_Blocking_Enhanced.js requires AP_Blocking.js to function.");
}