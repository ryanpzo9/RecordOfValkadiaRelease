//=============================================================================
// JR_SameCategoryPriority.js
//=============================================================================

/*:
 * @plugindesc v1.20 Restricts passive states of specific categories. Supports float priorities (e.g., 2.1).
 * @author JR
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This extension bridges YEP_AutoPassiveStates and YEP_X_StateCategories.
 * It prevents actors from stacking multiple passive states of the same 
 * category. If an actor has multiple passives competing in the same category, 
 * only the one with the highest priority will be applied. 
 *
 * Priorities can be floats (e.g., 2.1, 2.2). The integer (first index) 
 * determines the main tier, and the decimal (second index) acts as a sub-tier.
 *
 * If priorities are exactly tied (e.g., 2.2 and 2.2), the state with the 
 * highest Database ID wins.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 *
 * State Notetags:
 *
 *   <SameCategoryPriority: CategoryName - x>
 *   Assigns a priority level to this state for a specific category.
 *   Replace 'CategoryName' with the target category and 'x' with a number 
 *   (integers or floats are accepted). Higher numbers take precedence.
 *
 * --- Example ---
 *
 * State 400 (Common Tier 2):
 * <Category: AidAugment>
 * <SameCategoryPriority: AidAugment - 2.1>
 *
 * State 401 (Rare Tier 2):
 * <Category: AidAugment>
 * <SameCategoryPriority: AidAugment - 2.2>
 *
 * If an actor equips augments granting both State 400 and 401, State 401 
 * will automatically suppress State 400 because 2.2 is greater than 2.1.
 */

var Imported = Imported || {};
Imported.JR_SameCategoryPriority = true;

var JR = JR || {};
JR.SameCategoryPriority = JR.SameCategoryPriority || {};

if (Imported.YEP_AutoPassiveStates && Imported.YEP_X_StateCategories) {

    //=============================================================================
    // DataManager
    //=============================================================================
    var _JR_DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
    DataManager.isDatabaseLoaded = function() {
        if (!_JR_DataManager_isDatabaseLoaded.call(this)) return false;
        if (!JR._loaded_SameCategoryPriority) {
            JR.ProcessSameCategoryPriority($dataStates);
            JR._loaded_SameCategoryPriority = true;
        }
        return true;
    };

    JR.ProcessSameCategoryPriority = function(group) {
        for (var n = 1; n < group.length; n++) {
            var obj = group[n];
            if (!obj) continue;
            var notedata = obj.note.split(/[\r\n]+/);
            
            // Object to hold multiple category competitions for a single state
            obj.sameCategoryPriority = {}; 

            for (var i = 0; i < notedata.length; i++) {
                var line = notedata[i];
                // Updated Regex to support floats (e.g., 2, 2.1, 2.15)
                if (line.match(/<(?:SAME CATEGORY PRIORITY|SAMECATEGORYPRIORITY):[ ]*(.*)[ ]*-[ ]*(\d+(?:\.\d+)?)>/i)) {
                    var catName = String(RegExp.$1).toUpperCase().trim();
                    var priorityVal = parseFloat(RegExp.$2); // Parses as a float instead of integer
                    obj.sameCategoryPriority[catName] = priorityVal;
                }
            }
        }
    };

    //=============================================================================
    // Game_Actor and Game_Enemy
    //=============================================================================
    var _JR_Game_Actor_passiveStatesRaw = Game_Actor.prototype.passiveStatesRaw;
    Game_Actor.prototype.passiveStatesRaw = function() {
        if (this._passiveStatesRaw !== undefined) return this._passiveStatesRaw;
        _JR_Game_Actor_passiveStatesRaw.call(this);
        this._passiveStatesRaw = JR.FilterCategoryPriorities(this._passiveStatesRaw);
        return this._passiveStatesRaw;
    };

    var _JR_Game_Enemy_passiveStatesRaw = Game_Enemy.prototype.passiveStatesRaw;
    Game_Enemy.prototype.passiveStatesRaw = function() {
        if (this._passiveStatesRaw !== undefined) return this._passiveStatesRaw;
        _JR_Game_Enemy_passiveStatesRaw.call(this);
        this._passiveStatesRaw = JR.FilterCategoryPriorities(this._passiveStatesRaw);
        return this._passiveStatesRaw;
    };

    //=============================================================================
    // Core Logic: Filtering the Categories
    //=============================================================================
    JR.FilterCategoryPriorities = function(rawArray) {
        var losers = [];
        var categoryContestants = {}; 

        // 1. Map out the contestants per category based on their specific tags
        for (var i = 0; i < rawArray.length; i++) {
            var id = rawArray[i];
            var state = $dataStates[id];
            
            if (state && state.sameCategoryPriority) {
                var competingCats = Object.keys(state.sameCategoryPriority);
                for (var k = 0; k < competingCats.length; k++) {
                    var cat = competingCats[k];
                    if (!categoryContestants[cat]) {
                        categoryContestants[cat] = [];
                    }
                    categoryContestants[cat].push(state);
                }
            }
        }

        // 2. Resolve competitions for each targeted category
        var activeCategories = Object.keys(categoryContestants);
        for (var i = 0; i < activeCategories.length; i++) {
            var cat = activeCategories[i];
            var contestants = categoryContestants[cat];
            
            // Only compete if there is more than 1 state targeting this category
            if (contestants.length > 1) {
                var highestPriority = -Infinity; // Safely handles any float range
                
                // Find highest float priority in this specific bracket
                for (var j = 0; j < contestants.length; j++) {
                    var pri = contestants[j].sameCategoryPriority[cat];
                    if (pri > highestPriority) highestPriority = pri;
                }
                
                var tiedContestants = [];
                for (var j = 0; j < contestants.length; j++) {
                    if (contestants[j].sameCategoryPriority[cat] === highestPriority) {
                        tiedContestants.push(contestants[j]);
                    } else {
                        // Priority is lower, flag for removal
                        if (!losers.contains(contestants[j].id)) {
                            losers.push(contestants[j].id);
                        }
                    }
                }
                
                // Resolve exact float ties (e.g. 2.2 === 2.2) by selecting the Highest State ID
                if (tiedContestants.length > 1) {
                    var winnerId = -1;
                    for (var j = 0; j < tiedContestants.length; j++) {
                        if (tiedContestants[j].id > winnerId) {
                            winnerId = tiedContestants[j].id;
                        }
                    }
                    
                    // Add the remaining tied contestants to the loser pile
                    for (var j = 0; j < tiedContestants.length; j++) {
                        if (tiedContestants[j].id !== winnerId) {
                            if (!losers.contains(tiedContestants[j].id)) {
                                losers.push(tiedContestants[j].id);
                            }
                        }
                    }
                }
            }
        }

        // 3. Build the final array of states allowed to remain active
        var finalArray = [];
        for (var i = 0; i < rawArray.length; i++) {
            if (!losers.contains(rawArray[i])) {
                finalArray.push(rawArray[i]);
            }
        }

        return finalArray;
    };

} else {
    console.warn("JR_SameCategoryPriority requires YEP_AutoPassiveStates and YEP_X_StateCategories to be installed.");
}