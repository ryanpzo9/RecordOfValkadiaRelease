
/*
#=============================================================================
# Battle Auto Target Skills
# Nina_AutoTargetSkills.js
# By Ninakoru
# Version 1.0
#-----------------------------------------------------------------------------
# TERMS OF USE
#-----------------------------------------------------------------------------
# - Credit to author is optional, but appreciated :)
# - Free for non-commercial & commercial use
#=============================================================================
*/

var Imported = Imported || {};
Imported.Nina_AutoTargetSkills = true;
/*:
 * @plugindesc Skip the selection window when the skill is for user or for all, configurable.
 * @author Ninakoru
 * @version 1.0
 
 * @param ---General---
 * @default
 
 * @param Self Skills
 * @parent ---General---
 * @type boolean
 * @on Skip
 * @off Choose
 * @desc Skip character selection for self (user) skills.
 * Skip - true    Choose - false     Default: true
 * @default true
 
 * @param All Allies Skills
 * @parent ---General---
 * @type boolean
 * @on Skip
 * @off Choose
 * @desc Skip character selection for skills that target all allies.
 * Skip - true    Choose - false     Default: true
 * @default true  
 
 * @param All Enemies Skills
 * @parent ---General---
 * @type boolean
 * @on Skip
 * @off Choose
 * @desc Skip character selection for skills that target all enemies.
 * Skip - true    Choose - false     Default: true
 * @default true 
 
  
 * @param Random Skills
 * @parent ---General---
 * @type boolean
 * @on Skip
 * @off Choose
 * @desc Skip character selection for random targeting skills
 * Skip - true    Choose - false     Default: true
 * @default true 
 
 * @help This is a simple quality of life improvement to avoid double clicking to 
 * use certain skills.
 *
 * Skip the target selection for skills that really doesn't have real options in
 * the targeting phase. These skills can be configured to either have the selection
 * phase or are used automatically when you select the skill.
 *
 * The effect is against all skills that use the following scopes (configurable):
 * The User (self)
 * All Allies
 * All Enemies
 * X Random Enemies
 *
 * Should be highly compatible with most battle selection related plugins,
 * as the override is done before the selection window popup.

*/

//#=============================================================================

(function() {

var pluginParams = PluginManager.parameters('Nina_AutoTargetSkills');
var applySelf = eval(pluginParams['Self Skills']);
var applyAllAllies = eval(pluginParams['All Allies Skills']);
var applyAllEnemies = eval(pluginParams['All Enemies Skills']);
var applyRandom = eval(pluginParams['Random Skills']);

var autoSkills_Scene_Battle_onSelectAction = Scene_Battle.prototype.onSelectAction;
Scene_Battle.prototype.onSelectAction = function() {
    
	var action = BattleManager.inputtingAction();
	var skipSelf = applySelf && action.isForUser();
	var skipAllAllies = applyAllAllies && action.isForAll() && action.isForFriend();
	var skipAllEnemies = applyAllEnemies && action.isForAll() && action.isForOpponent();
	var skipRandomSkills = applyRandom && action.isForRandom();
	
	if (skipSelf || skipAllAllies || skipAllEnemies || skipRandomSkills) {
		this._actorWindow.hide();
		this._skillWindow.hide();
		this._itemWindow.hide();		
		this.selectNextCommand();
	}
	else {
		autoSkills_Scene_Battle_onSelectAction.call(this);	
	}
};

})();