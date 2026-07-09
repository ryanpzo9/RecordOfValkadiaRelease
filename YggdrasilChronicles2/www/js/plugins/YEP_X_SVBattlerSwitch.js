//=============================================================================
// Yanfly Engine Plugins - Animated Sideview Enemies Extension - Battler Switch
// YEP_X_SVBattlerSwitch.js
//=============================================================================

var Imported = Imported || {};
Imported.YEP_X_SVBattlerSwitch = true;

var Yanfly = Yanfly || {};
Yanfly.SVBS = Yanfly.SVBS || {};
Yanfly.SVBS.version = 1.05;

//=============================================================================
 /*:
 * @plugindesc v1.05 (Requires YEP_BattleEngineCore.js and YEP_X_AnimatedSVEnemies.js)
 * Adds functionality to dynamically change and reset enemy sideview battler images during battle.
 * @author JR + GrokAI (Based on Yanfly Engine Plugins)
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin requires YEP_BattleEngineCore.js and YEP_X_AnimatedSVEnemies.js.
 * Place this plugin below both in the Plugin Manager to ensure compatibility.
 *
 * This extension plugin allows you to dynamically change the sideview battler image
 * of an enemy during battle using a script call, and reset it to the original image
 * defined in the enemy's <Sideview Battler: filename> notetag. This is useful for
 * creating dynamic visual effects, such as enemies transforming or swapping appearances
 * mid-battle.
 *
 * ============================================================================
 * Script Calls
 * ============================================================================
 *
 * Use the following script calls in battle events or scripts:
 *
 *   $gameTroop.members()[index].changesideview("filename")
 *   - Changes the sideview battler image of the enemy at the specified index to
 *     the given filename (without the .png extension) from the img/sv_actors/ folder.
 *     Example: $gameTroop.members()[0].changesideview("sv_goblin")
 *
 *   $gameTroop.members()[index].resetsideview()
 *   - Resets the sideview battler image of the enemy at the specified index to the
 *     original image defined in its <Sideview Battler: filename> notetag.
 *     Example: $gameTroop.members()[0].resetsideview()
 *
 * ============================================================================
 * Notes
 * ============================================================================
 *
 * - The filename used in changesideview() must correspond to a valid image in
 *   the img/sv_actors/ folder.
 * - If the enemy does not have a <Sideview Battler: filename> notetag, the reset
 *   function will revert to the default enemy sprite.
 * - All images in the img/sv_actors/ folder are preloaded at battle start to ensure
 *   instant battler switching.
 * - The preload cache is cleared after battles to minimize memory usage.
 *
 * ============================================================================
 * Setup Instructions
 * ============================================================================
 *
 * In the plugin code, update the `svActorFiles` array in Scene_Battle.prototype.preloadSVBattlers
 * with the filenames of all PNG files in your img/sv_actors/ folder (without the .png extension).
 * For example, if your folder contains sv_goblin.png and sv_dragon.png, set:
 *   var svActorFiles = ['sv_goblin', 'sv_dragon'];
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.05:
 * - Removed example 'sv_skeleton' from svActorFiles array to avoid confusion.
 * - Added instructions to list all img/sv_actors/ filenames in svActorFiles.
 *
 * Version 1.04:
 * - Modified preloading to include all PNG files in img/sv_actors/ for instant
 *   battler switching with any filename.
 * - Retained cache clearing after battles to minimize memory impact.
 *
 * Version 1.03:
 * - Optimized preloading to only include current troop battlers and a minimal set
 *   of additional battlers.
 * - Added cache clearing after battles.
 *
 * Version 1.02:
 * - Added image preloading at battle start to reduce delays when changing battlers.
 * - Optimized sprite update logic for faster rendering.
 *
 * Version 1.01:
 * - Added null checks to prevent TypeError when accessing enemy properties.
 * - Improved error handling during battle initialization.
 *
 * Version 1.00:
 * - Initial release with support for changing and resetting sideview battler images.
 */
//=============================================================================

if (Imported.YEP_BattleEngineCore && Imported.YEP_X_AnimatedSVEnemies) {
if (Yanfly.BEC.version && Yanfly.BEC.version >= 1.42 && Yanfly.SVE.version >= 1.18) {

//=============================================================================
// ImageManager
//=============================================================================

// Preload sideview battler images with cache tracking
Yanfly.SVBS.ImageManager_loadSvActor = ImageManager.loadSvActor;
ImageManager.loadSvActor = function(filename) {
    if (!filename) return null;
    var bitmap = Yanfly.SVBS.ImageManager_loadSvActor.call(this, filename);
    bitmap.addLoadListener(function() {
        Yanfly.SVBS.preloadedSvBattlers = Yanfly.SVBS.preloadedSvBattlers || {};
        Yanfly.SVBS.preloadedSvBattlers[filename] = bitmap;
    });
    return bitmap;
};

//=============================================================================
// DataManager
//=============================================================================

// Reinitialize enemies when loading a save file
Yanfly.SVBS.DataManager_loadGame = DataManager.loadGame;
DataManager.loadGame = function(savefileId) {
    var result = Yanfly.SVBS.DataManager_loadGame.call(this, savefileId);
    if (result && $gameTroop && $gameTroop.members()) {
        $gameTroop.members().forEach(function(enemy) {
            if (enemy && enemy.isEnemy()) {
                enemy.initMembers(); // Ensure _originalSVBattlerName is set
            }
        });
    }
    return result;
};

//=============================================================================
// Game_Enemy
//=============================================================================

// Store the original sideview battler for reset functionality
Yanfly.SVBS.Game_Enemy_initMembers = Game_Enemy.prototype.initMembers;
Game_Enemy.prototype.initMembers = function() {
    Yanfly.SVBS.Game_Enemy_initMembers.call(this);
    this._originalSVBattlerName = this.svBattlerName() || '';
};

// Change the sideview battler image
Game_Enemy.prototype.changesideview = function(filename) {
    if (!filename || typeof filename !== 'string') return;
    this._svBattlerName = filename;
    if (this.battler()) {
        this.battler().setSVBattler(this);
        this.battler().updateSVBitmapFast();
    }
};

// Reset the sideview battler to the original notetag-defined image
Game_Enemy.prototype.resetsideview = function() {
    this._svBattlerName = this._originalSVBattlerName;
    if (this.battler()) {
        this.battler().setSVBattler(this);
        this.battler().updateSVBitmapFast();
    }
};

// Override svBattlerName to handle dynamic changes while preserving random selection
Game_Enemy.prototype.svBattlerName = function() {
    if (this._svBattlerName) return this._svBattlerName;
    var array = this.enemy() && this.enemy().sideviewBattler ? this.enemy().sideviewBattler : [];
    this._svBattlerName = Yanfly.Util.getRandomElement(array) || '';
    return this._svBattlerName;
};

// Override hasSVBattler to ensure proper checking
Yanfly.SVBS.Game_Enemy_hasSVBattler = Game_Enemy.prototype.hasSVBattler;
Game_Enemy.prototype.hasSVBattler = function() {
    return this.enemy() && this.svBattlerName() !== '';
};

//=============================================================================
// Scene_Battle
//=============================================================================

// Preload all PNG files in img/sv_actors/
Yanfly.SVBS.Scene_Battle_create = Scene_Battle.prototype.create;
Scene_Battle.prototype.create = function() {
    Yanfly.SVBS.Scene_Battle_create.call(this);
    this.preloadSVBattlers();
};

Scene_Battle.prototype.preloadSVBattlers = function() {
    Yanfly.SVBS.preloadedSvBattlers = Yanfly.SVBS.preloadedSvBattlers || {};
    var filenames = [];

    // Since we can't directly access the filesystem in RPG Maker MV,
    // you must manually list all PNG filenames in img/sv_actors/ (without .png extension).
    var svActorFiles = [
        // Add all filenames from img/sv_actors/ here, e.g.:
        // 'sv_goblin',
        // 'sv_dragon',
        // 'sv_bat',
        // 'sv_slime'
    ];

    // Include battlers from enemy notetags
    $dataEnemies.forEach(function(enemy) {
        if (enemy && enemy.sideviewBattler) {
            enemy.sideviewBattler.forEach(function(filename) {
                if (filename && !filenames.contains(filename)) {
                    filenames.push(filename);
                }
            });
        }
    });

    // Add all sv_actors files
    svActorFiles.forEach(function(filename) {
        if (filename && !filenames.contains(filename)) {
            filenames.push(filename);
        }
    });

    // Preload collected filenames
    filenames.forEach(function(filename) {
        if (!Yanfly.SVBS.preloadedSvBattlers[filename]) {
            ImageManager.loadSvActor(filename);
        }
    });
};

// Clear preload cache after battle
Yanfly.SVBS.Scene_Battle_terminate = Scene_Battle.prototype.terminate;
Scene_Battle.prototype.terminate = function() {
    Yanfly.SVBS.Scene_Battle_terminate.call(this);
    Yanfly.SVBS.preloadedSvBattlers = {}; // Clear cache to reduce memory usage
};

//=============================================================================
// Sprite_Enemy
//=============================================================================

// Update setBattler to include null checks
Yanfly.SVBS.Sprite_Enemy_setBattler = Sprite_Enemy.prototype.setBattler;
Sprite_Enemy.prototype.setBattler = function(battler) {
    this._svBattlerEnabled = false;
    this.initSVSprites();
    Yanfly.SVBS.Sprite_Enemy_setBattler.call(this, battler);
    if (battler && battler.isEnemy()) {
        this.setSVBattler(battler);
    }
};

// Optimized bitmap update for faster rendering
Sprite_Enemy.prototype.updateSVBitmapFast = function() {
    if (!this._enemy) {
        this._svBattlerEnabled = false;
        return Yanfly.SVBS.Sprite_Enemy_updateSVBitmap.call(this);
    }
    var name = this._enemy.svBattlerName();
    if (this._svBattlerEnabled && this._svBattlerName !== name) {
        this._createdDummyMainSprite = false;
        this._svBattlerName = name;
        var bitmap = Yanfly.SVBS.preloadedSvBattlers && Yanfly.SVBS.preloadedSvBattlers[name];
        if (name && bitmap && bitmap.isReady()) {
            this._mainSprite.bitmap = bitmap;
        } else if (name) {
            this._mainSprite.bitmap = ImageManager.loadSvActor(name);
        } else {
            this._mainSprite.bitmap = ImageManager.loadEnemy(this._enemy.battlerName());
        }
        this.adjustAnchor();
        this.refreshMotion();
        this.updateScale();
    } else if (!this._svBattlerEnabled && !name) {
        Yanfly.SVBS.Sprite_Enemy_updateSVBitmap.call(this);
    }
};

// Update the bitmap (fallback for compatibility)
Yanfly.SVBS.Sprite_Enemy_updateSVBitmap = Sprite_Enemy.prototype.updateSVBitmap;
Sprite_Enemy.prototype.updateSVBitmap = function() {
    this.updateSVBitmapFast();
};

//=============================================================================
// End of File
//=============================================================================

} else {
var text = '================================================================\n';
text += 'YEP_X_SVBattlerSwitch requires YEP_BattleEngineCore (v1.42+) and ';
text += 'YEP_X_AnimatedSVEnemies (v1.18+) to be at the latest versions to run properly.\n\n';
text += 'Please go to www.yanfly.moe and update to the latest versions for these plugins.\n';
text += '================================================================\n';
console.log(text);
require('nw.gui').Window.get().showDevTools();
}

} // Imported.YEP_BattleEngineCore && Imported.YEP_X_AnimatedSVEnemies