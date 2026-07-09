//-----------------------------------------------------------------------------
// OcRam plugins - OcRam_Weather_EX.js
//=============================================================================

var Imported = Imported || {};
Imported.OcRam_Weather_EX = true;
var OcRam_Weather_EX = OcRam_Weather_EX || {};

/*:
 * @plugindesc v1.00 Weather Extensions to default weather system.
 * @author OcRam
 * 
 * @param Battle Weather
 * @desc 1 = Inherits weather to battle screen.
 * Default: 1
 * @default 1
 * 
 * @param Lightning wait
 * @desc Adjusts the minimum time next lightning can appear.
 * 0 = No lightnings
 * Default: 4
 * @default 4
 * 
 * @param Lightning frequency
 * @desc Adjusts the BASE frequency of lightnings.
 * Percent chance per second with storm power 5.
 * 0 = No lightnings
 * Default: 10
 * @default 10
 * 
 * @param Min storm power
 * @desc Adjusts the minimum storm power where lightnings appear.
 * 0 = Always on
 * Default: 4
 * @default 4
 * 
 * @param Lightning variation
 * @desc Adjusts the thunder power variation (volume and pan).
 * 0 = No variation at all, 1 = Mute
 * Default: 0.25
 * @default 0.25
 * 
 * @param Thunder SE
 * @desc Thunder sound effect.
 * Leave empty to have no SE
 * Default: thunder9
 * @default thunder9
 * 
 * @param Rain BGS
 * @desc Rain background sound.
 * Leave empty to have no BGS
 * Default: rain3
 * @default rain3
 * 
 * @param Storm BGS
 * @desc Storm background sound.
 * Leave empty to have no BGS
 * Default: storm2
 * @default storm2
 * 
 * @help
 * ----------------------------------------------------------------------------
 * Introduction
 * ============================================================================
 * Weather Extensions to default weather system. This is what this plugin does:
 *      - Weather can be inherited to battle scene
 *      - Storm and rain may have BGS (volume varied by power)
 *      - Dynamic lightnings to storm (on desired power via auto pan / pitch)
 *      - Storm and rain BGS is DEDICATED, so it won't interfere other BGS
 *
 * Sources: W3Schools & RMMV
 *
 * ----------------------------------------------------------------------------
 * Usage
 * ============================================================================
 * No scripts or plugin commands (use in-game weather command).
 *
 * ----------------------------------------------------------------------------
 * Terms of use
 * ============================================================================
 * Non-commercial & commercial use:
 * Free to use with credits to 'OcRam' for using 'Weather_EX' plugin.
 *
 * Edits are allowed as long as "Terms of use" is not changed in any way.
 *
 * https://forums.rpgmakerweb.com/index.php?threads/???
 *
 * DO NOT COPY, RESELL OR CLAIM THIS PIECE OF SOFTWARE AS YOUR OWN!
 * Copyright (c) 2017, Marko Paakkunainen
 *
 * ----------------------------------------------------------------------------
 * Version History
 * ============================================================================
 * 2018/01/10 v1.00 - Initial release
 */
/*
 * ----------------------------------------------------------------------------
 * RMMV CORE function overrides (destructive) are listed here
 * ============================================================================
 *     Game_Interpreter.prototype.command236
 */

(function ($) {

    // Additional (3rd) sound channel from OcRam_Audio_EX -plugin (as it is)
    // ===================================================================================
    var OC_emptyAudioObj = AudioManager.makeEmptyAudioObject();

    AudioManager._bgs3Volume = 100; AudioManager._currentBgs3 = null; AudioManager._bgs3Buffer = null;

    Object.defineProperty(AudioManager, 'bgs3Volume', {
        get: function () {
            return this._bgs3Volume;
        },
        set: function (value) {
            this._bgs3Volume = value;
            this.updateBgs3Parameters(this._currentBgs3);
        },
        configurable: true
    });
    AudioManager.playBgs3 = function (bgs3, pos) {
        if (this.isCurrentBgs3(bgs3)) {
            this.updateBgs3Parameters(bgs3);
        } else {
            this.stopBgs3();
            if (bgs3.name) {
                this._bgs3Buffer = this.createBuffer('bgs', bgs3.name);
                this.updateBgs3Parameters(bgs3);
                this._bgs3Buffer.play(true, pos || 0);
                this.fadeInBgs3(4);
            }
        }
        this.updateCurrentBgs3(bgs3, pos);
    };
    AudioManager.replayBgs3 = function (bgs3) {
        if (this.isCurrentBgs3(bgs3)) {
            this.updateBgs3Parameters(bgs3);
        } else {
            this.playBgs3(bgs3, bgs3.pos);
            if (this._bgs3Buffer) {
                this._bgs3Buffer.fadeIn(this._replayFadeTime);
            }
        }
    };
    AudioManager.isCurrentBgs3 = function (bgs3) {
        return (this._currentBgs3 && this._bgs3Buffer &&
            this._currentBgs3.name === bgs3.name);
    };
    AudioManager.updateBgs2Parameters = function (bgs2) {
        this.updateBufferParameters(this._bgs2Buffer, this._bgs2Volume, bgs2);
    };
    AudioManager.updateBgs3Parameters = function (bgs3) {
        this.updateBufferParameters(this._bgs3Buffer, this._bgs3Volume, bgs3);
    };
    AudioManager.updateCurrentBgs3 = function (bgs3, pos) {
        this._currentBgs3 = {
            name: bgs3.name,
            volume: bgs3.volume,
            pitch: bgs3.pitch,
            pan: bgs3.pan,
            pos: pos
        };
    };
    AudioManager.stopBgs3 = function () {
        if (this._bgs3Buffer) {
            this._bgs3Buffer.stop();
            this._bgs3Buffer = null;
            this._currentBgs3 = null;
        }
    };
    AudioManager.fadeOutBgs3 = function (duration) {
        if (this._bgs3Buffer && this._currentBgs3) {
            this._bgs3Buffer.fadeOut(duration);
            this._currentBgs3 = null;
        }
    };
    AudioManager.fadeInBgs3 = function (duration) {
        if (this._bgs3Buffer && this._currentBgs3) {
            this._bgs3Buffer.fadeIn(duration);
        }
    };
    AudioManager.saveBgs3 = function () {
        if (this._currentBgs3) {
            var bgs3 = this._currentBgs3;
            return {
                name: bgs3.name,
                volume: bgs3.volume,
                pitch: bgs3.pitch,
                pan: bgs3.pan,
                pos: this._bgs3Buffer ? this._bgs3Buffer.seek() : 0
            };
        } else {
            return OC_emptyAudioObj;
        }
    };

    // Plugin parameters
    // ===================================================================================
    
    OcRam_Weather_EX.parameters = PluginManager.parameters('OcRam_Weather_EX');

    var par_battleweather = Number(OcRam_Weather_EX.parameters['Battle Weather']);
    var par_lightning_wait = Number(OcRam_Weather_EX.parameters['Lightning wait']);
    var par_lightning_frequency = Number(OcRam_Weather_EX.parameters['Lightning frequency']);
    var par_min_storm_power = Number(OcRam_Weather_EX.parameters['Min storm power']);
    var par_lightning_variation = parseFloat(OcRam_Weather_EX.parameters['Lightning variation']);
    var par_thunder_se = String(OcRam_Weather_EX.parameters['Thunder SE']);
    var par_rain_bgs = String(OcRam_Weather_EX.parameters['Rain BGS']);
    var par_storm_bgs = String(OcRam_Weather_EX.parameters['Storm BGS']);

    // Battle Weather // rpg_sprites.js
    // ===================================================================================
    var OC_Spriteset_Battle_createLowerLayer = Spriteset_Battle.prototype.createLowerLayer;
    Spriteset_Battle.prototype.createLowerLayer = function () {
        OC_Spriteset_Battle_createLowerLayer.call(this); this.createWeather();
    }

    var OC_Spriteset_Battle_update = Spriteset_Battle.prototype.update;
    Spriteset_Battle.prototype.update = function () {
        this.updateWeather(); OC_Spriteset_Battle_update.call(this);
    };

    // Add new methods
    // ===================================================================================
    Spriteset_Battle.prototype.createWeather = function () {
        this._weather = new Weather();
        this._baseSprite.addChild(this._weather);
    };

    Spriteset_Battle.prototype.updateWeather = function () {
        if (par_battleweather == 1) {
            this._weather.type = $gameScreen.weatherType();
            this._weather.power = $gameScreen.weatherPower();
        } else {
            this._weather.type = 0; this._weather.power = 0;
        }
        this._weather.origin.x = 0; this._weather.origin.y = 0;
    };

    // Do not check if is battle screen. Also play bgs, if specified. (rpg_objects.js)
    // ===================================================================================
    Game_Interpreter.prototype.command236 = function () {
        $gameScreen.changeWeather(this._params[0], this._params[1], this._params[2]);
        var this_bgs = { name: '', volume: 0, pitch: 100, pan: 0, pos: 0 };
        switch (this._params[0]) {
            case 'none':
                AudioManager.playBgs3(this_bgs); break;
            case 'snow':
                AudioManager.playBgs3(this_bgs); break;
            case 'rain':
                this_bgs = { name: par_rain_bgs, volume: (this._params[1] * 10 + 10), pitch: 100, pan: 0, pos: 0 };
                AudioManager.playBgs3(this_bgs); break;
            case 'storm':
                this_bgs = { name: par_storm_bgs, volume: 100, pitch: 100, pan: 0, pos: 0 };
                AudioManager.playBgs3(this_bgs); break;
        }
        if (this._params[3]) {
            this.wait(this._params[2]);
        }
        return true;
    };

    // Do 'storm flashing' with given parameters.
    // ===================================================================================
    var frames_passed = 0; var lightning_timer = 0;
    
    // Snap to Weather_update - rpg_core.js
    // ===================================================================================
    var _OcRam_Weather_EX_Weather_update = Weather.prototype.update;
    Weather.prototype.update = function () {
        _OcRam_Weather_EX_Weather_update.call(this);
        if (this.type == 'storm') {
            this._updateFlash();
        }
    };

    // Add new method
    // ===================================================================================
    Weather.prototype._updateFlash = function () {

        frames_passed++;

        if (frames_passed > 60) {

            frames_passed = 0;
            lightning_timer++;

            if (lightning_timer > par_lightning_wait) {
                
                if (100 * Math.random() < par_lightning_frequency + (this.power - 5)) {

                    var variation = 1 - par_lightning_variation; variation += par_lightning_variation * Math.random();
                    if (variation < 0) { variation = 0; } if (variation > 1) { variation = 1; }

                    // startFlash: command224
                    $gameScreen.startFlash([255, 255, 255, 255 * variation], [60]);
                    
                    // playSe: command250
                    var this_se = { name: par_thunder_se, volume: 90 * variation, pitch: 60, pan: 0, pos: 0 };
                    AudioManager.playSe(this_se);

                    lightning_timer = 0;

                }

            }

        }

    };

})(OcRam_Weather_EX);