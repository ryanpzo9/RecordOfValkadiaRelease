/*:
 * @plugindesc Adds a silent version of setStateCounter to prevent lag loops in Passive Conditions.
 * @author JR (With the help of Gemini)
 *
 * @help
 * Use this script call inside <Custom Passive Condition> notetags:
 * * user.setStateCounterSilent(stateId, value);
 *
 * This updates the counter variable WITHOUT triggering a battler Refresh.
 * This prevents the "Double Calculation" lag spike when checking passives.
 */

(function() {
    // Check if YEP_BuffsStatesCore is loaded
    if (Imported.YEP_BuffsStatesCore) {
        
        Game_BattlerBase.prototype.setStateCounterSilent = function(stateId, value) {
            if (this._stateCounter === undefined) this.initStateCounter();
            
            // Only update if the value is actually different (Micro-optimization)
            if (this._stateCounter[stateId] !== value) {
                this._stateCounter[stateId] = value;
                // We purposefully do NOT call this.refresh() here.
            }
        };

    }
})();