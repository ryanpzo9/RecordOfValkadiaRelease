/*:
@plugindesc [v1.0] JR Auto Battle Plugin with Toggle and Configurable Status Texts
Allows toggling auto-battle and displays status text above the battle status window. Many thanks to Solar Flares Games for the original plugin (AFG_AutoBattle)
@author JR + Grok (Based on Solar Flare Games' Autobattle. Thank you!)

@param optionText
@text Option Menu Text
@desc Text to show in the options menu and battle command.
@type text
@default Auto Battle

@param statusText
@text Primary Status Text
@desc Text to display the primary status of Auto Battle.
@type text
@default Auto Battle: ON

@param statusText2
@text Secondary Status Text
@desc Text to display the secondary status of Auto Battle.
@type text
@default Press ESC to stop

@param statusX
@text Status Text X Position
@desc X coordinate for the status text position (default: 0 for right side).
@type number
@default 0

@param fontSize
@text Font Size
@desc Set the size of the status text. (default: 28)
@type number
@default 28

@param textAlign
@text Text Alignment
@desc Choose alignment for the status texts (right, left, center).
@type select
@option left
@option center
@option right
@default right

@param onText
@text Auto Battle ON Text
@desc Text to display when Auto Battle is ON.
@type text
@default ON

@param offText
@text Auto Battle OFF Text
@desc Text to display when Auto Battle is OFF.
@type text
@default OFF

@help
This plugin adds an option to toggle auto-battle for all actors in the options menu.
It allows the player to toggle auto-battle on and off during a battle, starting auto-battle
immediately when enabled. Players can turn off auto-battle with the Escape key.
The status of Auto Battle is displayed above the battle status window when active, lowered by 73 pixels.

The Auto Battle command in the battle command list is selectable (not grayed out) by default for new games and old save files.
Use script calls to enable or disable its selectability.

Plugin Commands:
    ToggleAutoBattle     # Toggle auto-battle in events

Script Calls:
    EnableAutoBattleCommand()    # Enable the Auto Battle command in the battle command list (make it selectable)
    DisableAutoBattleCommand()   # Disable (gray out) the Auto Battle command in the battle command list
    TurnOnAutoBattle()           # Turn on the Auto Battle feature
    TurnOffAutoBattle()          # Turn off the Auto Battle feature
    CheckAutoBattleCommandState() # Log the current state of the Auto Battle command (for debugging)

Troubleshooting:
If the Auto Battle option in the Options menu is blank:
1. Check the Plugin Manager to ensure 'optionText' is set (default: 'Auto Battle').
2. Disable other plugins to test for conflicts, especially those modifying Window_Options or TextManager.
3. Test in a new project with only JR_AutoBattle.js.

If the Auto Battle command is grayed out in battle:
1. Search for DisableAutoBattleCommand() in events or scripts.
2. Disable other plugins and test with only JR_AutoBattle.js.
3. Test in a new project with only JR_AutoBattle.js.
*/
(function() {
    // Use the parameters for the option and status text
    var params = PluginManager.parameters('JR_AutoBattle');
    var autoBattleOptionText = String(params['optionText'] || 'Auto Battle');
    var autoBattleStatusText = String(params['statusText'] || 'Auto Battle: ON');
    var autoBattleStatusText2 = String(params['statusText2'] || 'Press ESC to stop');
    var statusX = Number(params['statusX'] || 0);
    var fontSize = Number(params['fontSize'] || 28);
    var textAlign = String(params['textAlign'] || 'right');
    var onText = String(params['onText'] || 'ON');
    var offText = String(params['offText'] || 'OFF');

    // Define TextManager.optionAutoBattle with fallback
    Object.defineProperty(TextManager, 'optionAutoBattle', {
        get: function() {
            return autoBattleOptionText || 'Auto Battle';
        },
        configurable: true
    });

    // Define autoBattleCommandEnabled
    ConfigManager._autoBattleCommandEnabled = true;
    Object.defineProperty(ConfigManager, 'autoBattleCommandEnabled', {
        get: function() {
            return this._autoBattleCommandEnabled === true;
        },
        set: function(value) {
            this._autoBattleCommandEnabled = value;
        },
        configurable: true
    });

    // Ensure default enabled state at game start
    const _DataManager_setupNewGame = DataManager.setupNewGame;
    DataManager.setupNewGame = function() {
        _DataManager_setupNewGame.call(this);
        ConfigManager._autoBattleCommandEnabled = true;
    };

    // Debug script call to check the state
    window.CheckAutoBattleCommandState = function() {
        console.log('AutoBattleCommandEnabled:', ConfigManager.autoBattleCommandEnabled);
        console.log('Raw _autoBattleCommandEnabled:', ConfigManager._autoBattleCommandEnabled);
    };

    // Script calls to enable/disable the Auto Battle command
    window.EnableAutoBattleCommand = function() {
        ConfigManager.autoBattleCommandEnabled = true;
        if (SceneManager._scene instanceof Scene_Battle) {
            SceneManager._scene._partyCommandWindow.refresh();
        }
    };

    window.DisableAutoBattleCommand = function() {
        ConfigManager.autoBattleCommandEnabled = false;
        if (SceneManager._scene instanceof Scene_Battle) {
            SceneManager._scene._partyCommandWindow.refresh();
        }
    };

    // Script calls to turn on/off Auto Battle
    window.TurnOnAutoBattle = function() {
        ConfigManager.autoBattle = true;
        if (SceneManager._scene instanceof Scene_Battle) {
            SceneManager._scene._partyCommandWindow.refresh();
            SceneManager._scene._autoBattleStatusSprite.visible = true;
            SceneManager._scene.startAutoBattle();
        }
    };

    window.TurnOffAutoBattle = function() {
        ConfigManager.autoBattle = false;
        if (SceneManager._scene instanceof Scene_Battle) {
            SceneManager._scene._partyCommandWindow.refresh();
            SceneManager._scene._autoBattleStatusSprite.visible = false;
            SceneManager._scene.stopAutoBattle();
        }
    };

    // Create a new sprite to display Auto Battle status text
    function Sprite_AutoBattleStatus() {
        this.initialize.apply(this, arguments);
    }

    Sprite_AutoBattleStatus.prototype = Object.create(Sprite.prototype);
    Sprite_AutoBattleStatus.prototype.constructor = Sprite_AutoBattleStatus;

    Sprite_AutoBattleStatus.prototype.initialize = function() {
        Sprite.prototype.initialize.call(this);
        this.bitmap = new Bitmap(400, 128);
        this.x = Graphics.width - 410 + statusX;
        this.visible = false;
        this.opacity = 0;
        this.fadeSpeed = 5;
        this.fadeIn = false;
        this.bitmap.fontSize = fontSize;
    };

    Sprite_AutoBattleStatus.prototype.update = function() {
        Sprite.prototype.update.call(this);
        if (ConfigManager.autoBattle) {
            this.visible = true;
            this.y = this.calculateYPosition();
            if (this.fadeIn) {
                this.opacity += this.fadeSpeed;
                if (this.opacity >= 255) {
                    this.opacity = 255;
                    this.fadeIn = false;
                }
            } else {
                this.opacity -= this.fadeSpeed;
                if (this.opacity <= 0) {
                    this.opacity = 0;
                    this.fadeIn = true;
                }
            }
            this.bitmap.clear();
            this.drawStatusText(autoBattleStatusText, 0);
            this.drawStatusText(autoBattleStatusText2, fontSize + 5);
        } else {
            this.visible = false;
        }
    };

    Sprite_AutoBattleStatus.prototype.drawStatusText = function(text, y) {
        const lineHeight = this.bitmap.fontSize;
        this.bitmap.drawText(text, 0, y, this.bitmap.width, lineHeight, textAlign);
    };

    Sprite_AutoBattleStatus.prototype.calculateYPosition = function() {
        const battleStatusWindow = SceneManager._scene._statusWindow;
        if (battleStatusWindow && battleStatusWindow.visible) {
            return battleStatusWindow.y - this.bitmap.height - 5 + 73;
        }
        return 10;
    };

    // Extend options menu to include Auto Battle toggle
    const old_addOptions = Window_Options.prototype.addGeneralOptions;
    Window_Options.prototype.addGeneralOptions = function() {
        old_addOptions.call(this);
        this.addCommand(TextManager.optionAutoBattle, 'autoBattle');
    };

    // Include autoBattleCommandEnabled in config load
    const old_cfgLoad = ConfigManager.applyData;
    ConfigManager.applyData = function(cfg) {
        old_cfgLoad.call(this, cfg);
        if(cfg.autoBattle === undefined) {
            this.autoBattle = false;
        } else {
            this.autoBattle = cfg.autoBattle;
        }
        if(cfg.autoBattleCommandEnabled === undefined) {
            this.autoBattleCommandEnabled = true;
        } else {
            this.autoBattleCommandEnabled = cfg.autoBattleCommandEnabled;
        }
    };

    // Include autoBattleCommandEnabled in config save
    const old_cfgSave = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        var cfg = old_cfgSave.call(this);
        cfg.autoBattle = this.autoBattle;
        cfg.autoBattleCommandEnabled = this.autoBattleCommandEnabled;
        return cfg;
    };

    Game_Actor.prototype.isAutoBattle = function() {
        return ConfigManager.autoBattle || Game_BattlerBase.prototype.isAutoBattle.call(this);
    };

    // Automatically select actions after selecting "Fight" when Auto Battle is ON
    const _Scene_Battle_commandFight = Scene_Battle.prototype.commandFight;
    Scene_Battle.prototype.commandFight = function() {
        if (ConfigManager.autoBattle) {
            this._partyCommandWindow.close();
            this.autoSelectActions();
        } else {
            _Scene_Battle_commandFight.call(this);
        }
    };

    Scene_Battle.prototype.autoSelectActions = function() {
        $gameParty.members().forEach(actor => {
            if (actor.canInput() && !actor.isDead()) {
                actor.setAction(0, new Game_Action(actor));
                actor.currentAction().setAttack();
            }
        });
        BattleManager.startTurn();
    };

    // Add Auto Battle command
    const _Window_PartyCommand_makeCommandList = Window_PartyCommand.prototype.makeCommandList;
    Window_PartyCommand.prototype.makeCommandList = function() {
        _Window_PartyCommand_makeCommandList.call(this);
        const fightIndex = this._list.findIndex(command => command.symbol === 'fight');
        if (fightIndex >= 0) {
            const isEnabled = ConfigManager._autoBattleCommandEnabled !== false;
            this.addCommand(autoBattleOptionText + ': ' + (ConfigManager.autoBattle ? onText : offText), 'toggleAutoBattle', isEnabled);
            this._list.splice(fightIndex + 1, 0, this._list.pop());
        }
    };

    const _Scene_Battle_createPartyCommandWindow = Scene_Battle.prototype.createPartyCommandWindow;
    Scene_Battle.prototype.createPartyCommandWindow = function() {
        _Scene_Battle_createPartyCommandWindow.call(this);
        this._partyCommandWindow.setHandler('toggleAutoBattle', this.commandToggleAutoBattle.bind(this));
    };

    Scene_Battle.prototype.commandToggleAutoBattle = function() {
        ConfigManager.autoBattle = !ConfigManager.autoBattle;
        this._partyCommandWindow.refresh();
        if (ConfigManager.autoBattle) {
            this.startAutoBattle();
        } else {
            this.stopAutoBattle();
        }
        this._autoBattleStatusSprite.visible = ConfigManager.autoBattle;
        this._partyCommandWindow.activate();
    };

    Scene_Battle.prototype.startAutoBattle = function() {
        this.updateAutoBattle();
    };

    Scene_Battle.prototype.stopAutoBattle = function() {
    };

    Scene_Battle.prototype.updateAutoBattle = function() {
        if (ConfigManager.autoBattle) {
            for (const actor of $gameParty.members()) {
                if (actor.canInput() && !actor.isDead()) {
                    this.processAutoBattleAction(actor);
                }
            }
        }
    };

    Scene_Battle.prototype.processAutoBattleAction = function(actor) {
        const action = actor.currentAction();
        if (!action) {
            actor.setAction(0, new Game_Action(actor));
            action.setAttack();
            action.applyGlobal();
            action.prepare();
            actor.performAction(action);
        }
    };

    // Hook into the input processing to allow ESC to turn off auto battle
    const _Scene_Battle_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
        _Scene_Battle_update.call(this);
        if (Input.isRepeated('cancel')) {
            if (ConfigManager.autoBattle) {
                ConfigManager.autoBattle = false;
                this._partyCommandWindow.refresh();
                this._autoBattleStatusSprite.visible = false;
            }
        }
    };

    // Add the status sprite to the battle scene
    const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
    Scene_Battle.prototype.createAllWindows = function() {
        _Scene_Battle_createAllWindows.call(this);
        this.createAutoBattleStatusSprite();
    };

    Scene_Battle.prototype.createAutoBattleStatusSprite = function() {
        this._autoBattleStatusSprite = new Sprite_AutoBattleStatus();
        this.addChild(this._autoBattleStatusSprite);
    };
})();