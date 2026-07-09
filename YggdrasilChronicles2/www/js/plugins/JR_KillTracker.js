//=============================================================================
// JR_KillTracker.js
//=============================================================================

/*:
 * @plugindesc v2.0.0 Track kill counts for specific enemies by ID.
 * Supports named quest trackers and shared kill pools.
 * @author JR
 *
 * @help
 * ============================================================================
 * INTRODUCTION
 * ============================================================================
 * This plugin lets you track how many times specific enemies have been killed,
 * useful for kill-count quests (e.g. "Defeat 10 Slimes").
 *
 * It supports named quest trackers and optional shared pools, so multiple
 * quests can track the same enemy either independently or together.
 *
 * ============================================================================
 * SCRIPT CALLS
 * ============================================================================
 *
 * Start tracking kills for a quest:
 *   startTrackingKills(questKey, enemyId)
 *   startTrackingKills(questKey, enemyId, poolKey)
 *
 *   questKey  — a unique string identifying this quest tracker
 *   enemyId   — the enemy database ID to watch
 *   poolKey   — (optional) a shared pool name; if omitted, the questKey
 *               itself is used as the pool (i.e. fully independent tracking)
 *
 *   Examples:
 *     startTrackingKills("quest1", 5)
 *       Quest 1 gets its own private pool, watching enemy #5.
 *
 *     startTrackingKills("quest1", 5, "slime_pool")
 *     startTrackingKills("quest2", 5, "slime_pool")
 *       Both quests share the "slime_pool" counter for enemy #5.
 *       Kills count toward both simultaneously.
 *
 * Stop tracking kills for a quest:
 *   stopTrackingKills(questKey)
 *   Example: stopTrackingKills("quest1")
 *
 *   Unsubscribes the quest from its pool. If this was the last quest
 *   subscribed to that pool, the pool is destroyed and the count resets.
 *   Other quests on the same pool are unaffected.
 *
 * Get the current kill count for a quest:
 *   countTrackingKills(questKey)
 *   Example: countTrackingKills("quest1")
 *   Returns: number (0 if quest is not active or pool is gone)
 *
 * ============================================================================
 * USAGE EXAMPLES
 * ============================================================================
 *
 * -- Independent tracking (two quests, same enemy, separate counters) --
 *   startTrackingKills("quest1", 5)
 *   startTrackingKills("quest2", 5)
 *   countTrackingKills("quest1")  → Quest 1's own count
 *   countTrackingKills("quest2")  → Quest 2's own count (starts fresh)
 *   stopTrackingKills("quest1")   → Quest 1 done, Quest 2 unaffected
 *
 * -- Shared tracking (two quests share the same kill pool) --
 *   startTrackingKills("quest1", 5, "slime_pool")
 *   startTrackingKills("quest2", 5, "slime_pool")
 *   countTrackingKills("quest1")  → shared count
 *   countTrackingKills("quest2")  → same shared count
 *   stopTrackingKills("quest1")   → Quest 1 done; pool survives for Quest 2
 *   stopTrackingKills("quest2")   → last subscriber; pool is now destroyed
 *
 * -- Conditional Branch check --
 *   countTrackingKills("quest1") >= 10
 *
 * ============================================================================
 * NOTES
 * ============================================================================
 * - All data persists through save/load automatically.
 * - questKey and poolKey are case-sensitive strings.
 * - Calling startTrackingKills with the same questKey again is safe — it
 *   unsubscribes from the old pool first, then joins/creates the new one.
 * - A pool's count is never reset while at least one quest is subscribed.
 *
 * ============================================================================
 * TERMS OF USE
 * ============================================================================
 * Free for use in commercial and non-commercial projects.
 */

(function () {
    'use strict';

    // -------------------------------------------------------------------------
    // Data structures (stored in $gameSystem for save/load persistence)
    //
    //  _killPools   : { poolKey: { enemyId: number, count: number, refs: number } }
    //                 poolKey  → the shared pool name
    //                 enemyId  → which enemy this pool watches
    //                 count    → running kill count
    //                 refs     → number of quests currently subscribed
    //
    //  _killQuests  : { questKey: poolKey }
    //                 maps each active quest to the pool it is reading from
    // -------------------------------------------------------------------------

    var _Game_System_initialize = Game_System.prototype.initialize;
    Game_System.prototype.initialize = function () {
        _Game_System_initialize.call(this);
        this._killPools  = {};
        this._killQuests = {};
    };

    // Safe accessor — guards against saves that predate this plugin
    Game_System.prototype.killTrackerData = function () {
        if (!this._killPools)  this._killPools  = {};
        if (!this._killQuests) this._killQuests = {};
        return { pools: this._killPools, quests: this._killQuests };
    };

    // -------------------------------------------------------------------------
    // Core logic: intercept enemy death and increment all matching pools
    // -------------------------------------------------------------------------

    var _Game_Enemy_die = Game_Enemy.prototype.die;
    Game_Enemy.prototype.die = function () {
        _Game_Enemy_die.call(this);
        var enemyId = this.enemyId();
        var pools   = $gameSystem.killTrackerData().pools;
        // Iterate every active pool and increment those watching this enemy
        Object.keys(pools).forEach(function (poolKey) {
            if (pools[poolKey].enemyId === enemyId) {
                pools[poolKey].count += 1;
            }
        });
    };

    // -------------------------------------------------------------------------
    // Internal helpers
    // -------------------------------------------------------------------------

    function _validateQuestKey(questKey, fnName) {
        if (typeof questKey !== 'string' || questKey.trim() === '') {
            console.warn('JR_KillTracker: ' + fnName + ' — questKey must be a non-empty string. Got:', questKey);
            return false;
        }
        return true;
    }

    function _validateEnemyId(enemyId, fnName) {
        enemyId = parseInt(enemyId, 10);
        if (isNaN(enemyId) || enemyId <= 0) {
            console.warn('JR_KillTracker: ' + fnName + ' — enemyId must be a positive integer. Got:', enemyId);
            return NaN;
        }
        return enemyId;
    }

    // -------------------------------------------------------------------------
    // Global script-call functions
    // -------------------------------------------------------------------------

    /**
     * Subscribe a quest tracker to a kill pool.
     *
     * @param {string} questKey  Unique identifier for this quest.
     * @param {number} enemyId   Enemy database ID to watch.
     * @param {string} [poolKey] Shared pool name. Defaults to questKey
     *                           (fully independent tracking).
     */
    window.startTrackingKills = function (questKey, enemyId, poolKey) {
        if (!_validateQuestKey(questKey, 'startTrackingKills')) return;
        enemyId = _validateEnemyId(enemyId, 'startTrackingKills');
        if (isNaN(enemyId)) return;

        // Default pool = private pool named after the quest itself
        if (typeof poolKey !== 'string' || poolKey.trim() === '') {
            poolKey = questKey;
        }

        var data = $gameSystem.killTrackerData();

        // If this quest is already subscribed to something, unsubscribe first
        if (data.quests.hasOwnProperty(questKey)) {
            _unsubscribe(questKey, data);
        }

        // Create the pool if it doesn't exist yet
        if (!data.pools.hasOwnProperty(poolKey)) {
            data.pools[poolKey] = { enemyId: enemyId, count: 0, refs: 0 };
        }

        // Subscribe
        data.pools[poolKey].refs += 1;
        data.quests[questKey] = poolKey;
    };

    /**
     * Unsubscribe a quest from its pool.
     * If this was the last subscriber, the pool is destroyed.
     *
     * @param {string} questKey  The quest identifier passed to startTrackingKills.
     */
    window.stopTrackingKills = function (questKey) {
        if (!_validateQuestKey(questKey, 'stopTrackingKills')) return;
        var data = $gameSystem.killTrackerData();
        if (!data.quests.hasOwnProperty(questKey)) {
            console.warn('JR_KillTracker: stopTrackingKills — questKey not active:', questKey);
            return;
        }
        _unsubscribe(questKey, data);
    };

    /**
     * Return the current kill count for a quest's pool.
     * Returns 0 if the quest is not active.
     *
     * @param  {string} questKey  The quest identifier.
     * @return {number}           Kill count.
     */
    window.countTrackingKills = function (questKey) {
        if (!_validateQuestKey(questKey, 'countTrackingKills')) return 0;
        var data    = $gameSystem.killTrackerData();
        var poolKey = data.quests[questKey];
        if (!poolKey || !data.pools.hasOwnProperty(poolKey)) return 0;
        return data.pools[poolKey].count;
    };

    // -------------------------------------------------------------------------
    // Private: remove a quest subscription and clean up its pool if empty
    // -------------------------------------------------------------------------

    function _unsubscribe(questKey, data) {
        var poolKey = data.quests[questKey];
        delete data.quests[questKey];
        if (poolKey && data.pools.hasOwnProperty(poolKey)) {
            data.pools[poolKey].refs -= 1;
            // Destroy the pool when no quests are reading it anymore
            if (data.pools[poolKey].refs <= 0) {
                delete data.pools[poolKey];
            }
        }
    }

})();