/*:
 * @plugindesc (v1.0) Reveals target stats using a skill with <Show Stats Eval> note tag.
 * @author James Ryan
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * This plugin works as an extension to `ADRI_InBattleEnemyStatus.js`.
 * It allows skills to use the note tag `<Show Stats Eval>` to reveal the 
 * target's stats when used in battle.
 *
 * ============================================================================
 * Usage
 * ============================================================================
 * Add the note tag `<Show Stats Eval>` to a skill's note box.
 * When that skill is used in battle, the stats of the target enemy will be 
 * displayed based on the "Show Stats Eval" setting in `ADRI_InBattleEnemyStatus`.
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 * Free to use with credits to YourName.
 * ============================================================================
 */

var Imported = Imported || {};
Imported.JR_StatsRevealSkill = true;

var JR = JR || {};
JR.StatsRevealSkill = JR.StatsRevealSkill || {};

(function() {

    // Extend the apply method of Game_Action
    const _Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
        _Game_Action_apply.call(this, target);
        this.revealStatsIfApplicable(target);
    };

    // Check and reveal stats if the skill has <Show Stats Eval> note tag
    Game_Action.prototype.revealStatsIfApplicable = function(target) {
        if (!target.isEnemy()) return; // Only applies to enemies
        const note = this.item().note || '';
        if (note.includes('<Show Stats Eval>')) {
            target._showStatsEval = true;
            if (SceneManager._scene instanceof Scene_Battle) {
                const scene = SceneManager._scene;
                if (scene._enemyStatusWindow) {
                    scene._enemyStatusWindow.refresh();
                }
            }
        }
    };

    // Initialize the new flag in Game_BattlerBase
    const _Game_BattlerBase_initMembers = Game_BattlerBase.prototype.initMembers;
    Game_BattlerBase.prototype.initMembers = function() {
        _Game_BattlerBase_initMembers.call(this);
        this._showStatsEval = false;
    };

    // Modify Window_InBattleEnemyStatus to consider the new flag
    const _Window_InBattleEnemyStatus_refreshSimpleVersion =
        Window_InBattleEnemyStatus.prototype.refreshSimpleVersion;
    Window_InBattleEnemyStatus.prototype.refreshSimpleVersion = function(showStats) {
        const shouldShowStats = showStats || this._battler._showStatsEval;
        _Window_InBattleEnemyStatus_refreshSimpleVersion.call(this, shouldShowStats);
    };

})();
