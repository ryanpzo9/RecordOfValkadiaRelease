//=============================================================================
// More state Overlay
// MoreStateOverlay.js
//=============================================================================

var Imported = Imported || {};
Imported.MoreStateOverlay = true;

var Hakuryo = Hakuryo || {};
Hakuryo.Core = Hakuryo.Core || {};

//=============================================================================
 /*:
 * @plugindesc v1.04 Adding the possibility to add new State overlay
 * @author Hakuryo
 *
 * @param EnemyOverlay
 * @desc Activate the enemy state overlay or not.
 true = activate orverlay, false = disable overlay.
 * Default: true
 * @default true
 * @help
 * ============================================================================
 * Introduction and Instructions
 * ============================================================================
 *
 * The main goal of this plugin is to provide the possibility to add more state 
 * overlay than the default set.
 *
 * To add a new overlay put a new line in the State.png file located in 
 * YourGameFolder/img/sytem/
 * Then use <STATE OVERLAY: x> in the note of a state and replace the 'x' 
 * by the line number of your new overlay.
 *
 * Exemple : 
 * 
 * <STATE OVERLAY: 11>
 * 
 * this will choose the 11nth ligne of State.png
 * 
 * ============================================================================
 * Enemy overlay
 * ============================================================================
 *
 * The plugins actually overide the rpg default system.
 * Please don't hesitate to contact me in case of constating bugs.
 *
 * The plugin only display one overlay at a time on an enemy. it work with state priority.
 * Exemple :
 * poison have 50 priority 
 * bleed have 80 priority
 * 
 * if a enemy have poison and bleed state you only see bleed overlay
 *
 * Exemple 2:
 * poison have 50 priority 
 * bleed have 50 priority
 *
 * if a enemy have poison and bleed state you will see the orverlay that have the smallest id.
 *
 *
 * ============================================================================
 * Tips & Tricks
 * ============================================================================
 * An animation ligne of the State.png file is made of 8 frame of 96x96 pixels
 * Be sure to respect the ligne format in order to make the plugin work.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
* Version 1.04:
 * - Fixed the incompatibility problem with Yanfly's Animated Battlers
 *
 * Version 1.03:
 * - Change the way how enemy animation overlay is activated.
 * - if you're using Yanfly's Animated Battlers plugin please set EnemyOverlay to false
 *   in order avoid conflict between Yep plugins an mine. ( i will try to fix this quickly)
 *
 * Version 1.02:
 * - Add an enemy overlay possibility.
 * - Add a param to activate or not enemy overlay.
 *
 * Version 1.01:
 * - Fixed a bug setting default state overlay to none.
 *
 * Version 1.00:
 * - Plugin release.
 *
 */
//=============================================================================

//=============================================================================
// Parameter Variables
//=============================================================================

Hakuryo.Parameters = PluginManager.parameters('MoreStateOverlay');
Hakuryo.Param = Hakuryo.Param || {};

Hakuryo.Param.EnemyOverlay = String(Hakuryo.Parameters['EnemyOverlay']);
//=============================================================================
// DataManager
//=============================================================================

Hakuryo.Core.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
	if (!Hakuryo.Core.DataManager_isDatabaseLoaded.call(this)) return false;
	DataManager.processCoreNotetags1($dataStates);
	return true;
};

DataManager.processCoreNotetags1 = function(group) {
	for (var n = 1; n < group.length; n++) {
		var obj = group[n];
		var notedata = obj.note.split(/[\r\n]+/);
		for (var i = 0; i < notedata.length; i++) {
			var line = notedata[i];
			if (line.match(/<STATE OVERLAY: (\d+)>/i)) {
				obj.overlay = parseInt(RegExp.$1);
			}
		}
	}
};

//=============================================================================
// Plugin Code
//=============================================================================

Hakuryo.Core.setBattler = Yanfly.SVE.Sprite_Enemy_setBattler;
Sprite_Enemy.prototype.setBattler = function(battler) {
    Hakuryo.Core.setBattler.call(this, battler);    
    if(Hakuryo.Param.EnemyOverlay === 'true') this._stateSprite.setup(battler);
};

//=============================================================================
// End of File
//=============================================================================