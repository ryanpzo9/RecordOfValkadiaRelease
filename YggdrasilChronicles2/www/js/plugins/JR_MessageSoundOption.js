//=============================================================================
// JR_MessageSoundOption.js
//=============================================================================

var Imported = Imported || {};
Imported.JR_MessageSoundOption = true;

var JR = JR || {};
JR.MSO = JR.MSO || {};
JR.MSO.version = 1.02;

//=============================================================================
/*:
 * @plugindesc v1.02 Adds an option to the Options menu to enable/disable message letter sounds.
 * Requires YEP_MessageCore.js and YEP_X_ExtMesPack1.js.
 * @author James Ryan
 *
 * @param Message Sound Label
 * @desc The text displayed for the Message Sound option in the Options menu.
 * @default Message Sound
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin requires YEP_MessageCore.js and YEP_X_ExtMesPack1.js to function.
 * Place JR_MessageSoundOption.js below both YEP_MessageCore.js and 
 * YEP_X_ExtMesPack1.js in the plugin list.
 *
 * This plugin adds a "Message Sound" option to the in-game Options menu, 
 * allowing players to toggle the letter-by-letter sound effect introduced by 
 * YEP_X_ExtMesPack1.js on or off during gameplay. The label for this option 
 * can be customized via the "Message Sound Label" parameter in the Plugin 
 * Manager.
 *
 * ============================================================================
 * Instructions
 * ============================================================================
 *
 * In the Plugin Manager, configure the "Message Sound Label" parameter to 
 * change the text displayed in the Options menu. For example, you could set 
 * it to "Text Sound" or "Letter Audio" instead of the default "Message Sound".
 *
 * ============================================================================
 * Compatibility
 * ============================================================================
 *
 * This plugin is designed to work with YEP_MessageCore.js and 
 * YEP_X_ExtMesPack1.js. Ensure both are installed and active for this plugin 
 * to work correctly.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.02:
 * - Added "Message Sound Label" parameter to customize the Options menu text.
 *
 * Version 1.01:
 * - Fixed "Cannot set property '_msgSoundEnable' of null" error by ensuring 
 *   $gameSystem is initialized before accessing it.
 *
 * Version 1.00:
 * - Initial release.
 */
//=============================================================================

if (Imported.YEP_MessageCore && Imported.YEP_X_ExtMesPack1) {

//=============================================================================
// Parameter Variables
//=============================================================================

JR.Parameters = PluginManager.parameters('JR_MessageSoundOption');
JR.Param = JR.Param || {};

JR.Param.MSOMessageSoundLabel = String(JR.Parameters['Message Sound Label']) || 'Message Sound';

//=============================================================================
// ConfigManager
//=============================================================================

// Store the sound setting locally until $gameSystem is ready
ConfigManager._messageSoundEnabled = Yanfly.Param.EMP1LetterSound;

JR.MSO.ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
    var config = JR.MSO.ConfigManager_makeData.call(this);
    config.messageSoundEnabled = this._messageSoundEnabled;
    return config;
};

JR.MSO.ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
    JR.MSO.ConfigManager_applyData.call(this, config);
    this._messageSoundEnabled = this.readMessageSound(config);
    // Apply to $gameSystem only if it exists
    if ($gameSystem) {
        $gameSystem._msgSoundEnable = this._messageSoundEnabled;
    }
};

ConfigManager.readMessageSound = function(config) {
    if (config.hasOwnProperty('messageSoundEnabled')) {
        return config['messageSoundEnabled'];
    } else {
        return Yanfly.Param.EMP1LetterSound; // Default from ExtMesPack1
    }
};

// Define the property with safe access
Object.defineProperty(ConfigManager, 'messageSoundEnabled', {
    get: function() {
        return $gameSystem ? $gameSystem.isMessageSoundEnabled() : this._messageSoundEnabled;
    },
    set: function(value) {
        this._messageSoundEnabled = value;
        if ($gameSystem) {
            $gameSystem._msgSoundEnable = value;
        }
    },
    configurable: true
});

//=============================================================================
// Scene_Boot
//=============================================================================

// Ensure the setting is applied once $gameSystem is initialized
JR.MSO.Scene_Boot_start = Scene_Boot.prototype.start;
Scene_Boot.prototype.start = function() {
    JR.MSO.Scene_Boot_start.call(this);
    if ($gameSystem) {
        // Only set _msgSoundEnable from config if it wasn't already set in the save
        if ($gameSystem._msgSoundEnable === undefined) {
            $gameSystem._msgSoundEnable = ConfigManager._messageSoundEnabled;
        }
    }
};

//=============================================================================
// Window_Options
//=============================================================================

JR.MSO.Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
Window_Options.prototype.addGeneralOptions = function() {
    JR.MSO.Window_Options_addGeneralOptions.call(this);
    this.addCommand(JR.Param.MSOMessageSoundLabel, 'messageSoundEnabled');
};

//=============================================================================
// End of File
//=============================================================================

} else {
    console.error('JR_MessageSoundOption.js requires YEP_MessageCore.js and YEP_X_ExtMesPack1.js to be installed and loaded.');
}