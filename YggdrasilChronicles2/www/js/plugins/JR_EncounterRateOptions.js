/*:
 * @plugindesc [v1.4] Adds an "Encounter Rate" setting to the Options menu.
 * @author JR
 *
 * @param Option Name
 * @desc The text displayed in the Options menu.
 * @default Encounter Rate
 *
 * @param Rate Values
 * @desc The percentage values available (comma separated). 100 is always included automatically.
 * @default 50, 75, 125, 150
 *
 * @param Default Suffix
 * @desc Text added next to the 100% option to show it is the baseline. Leave blank for nothing.
 * @default  (Default)
 *
 * @help
 * ============================================================================
 * JR_EncounterRateOptions
 * ============================================================================
 * This plugin adds a configurable Encounter Rate multiplier to your Options.
 * * * Features:
 * - 100% is always the default baseline.
 * - Custom suffix for the 100% option (e.g., "100% (Default)").
 * - Selecting 50% means twice as many steps to find a battle.
 * - Selecting 200% means half as many steps.
 * - Works safely with existing save files.
 * - Updates instantly the moment you change the setting.
 */

(function() {
    var parameters = PluginManager.parameters('JR_EncounterRateOptions');
    var optionName = String(parameters['Option Name'] || "Encounter Rate");
    var rawValues = String(parameters['Rate Values'] || "50, 75, 125, 150");
    var defaultSuffix = String(parameters['Default Suffix'] || "");

    // Process and sort the rates
    var rateList = [];
    var parts = rawValues.split(',');
    for (var i = 0; i < parts.length; i++) {
        var val = parseInt(parts[i].trim(), 10);
        if (!isNaN(val) && rateList.indexOf(val) === -1) {
            rateList.push(val);
        }
    }
    if (rateList.indexOf(100) === -1) rateList.push(100);
    rateList.sort(function(a, b) { return a - b; });

    // --- Config Manager ---
    ConfigManager.encounterRate = 100;

    var _ConfigManager_makeData = ConfigManager.makeData;
    ConfigManager.makeData = function() {
        var config = _ConfigManager_makeData.call(this);
        config.encounterRate = this.encounterRate;
        return config;
    };

    var _ConfigManager_applyData = ConfigManager.applyData;
    ConfigManager.applyData = function(config) {
        _ConfigManager_applyData.call(this, config);
        this.encounterRate = this.readEncounterRate(config, 'encounterRate');
    };

    ConfigManager.readEncounterRate = function(config, name) {
        var value = config[name];
        if (value !== undefined && !isNaN(value)) {
            return Number(value);
        } else {
            return 100;
        }
    };

    // --- Window_Options ---
    var _Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
    Window_Options.prototype.makeCommandList = function() {
        _Window_Options_makeCommandList.call(this);
        this.addCommand(optionName, 'encounterRate');
    };

    var _Window_Options_statusText = Window_Options.prototype.statusText;
    Window_Options.prototype.statusText = function(index) {
        var symbol = this.commandSymbol(index);
        var value = this.getConfigValue(symbol);
        if (symbol === 'encounterRate') {
            // Check if the current value is 100, and add the suffix if it is!
            if (value === 100) {
                return value + "%" + defaultSuffix;
            } else {
                return value + "%";
            }
        } else {
            return _Window_Options_statusText.call(this, index);
        }
    };

    var _Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        if (symbol === 'encounterRate') {
            var value = this.getConfigValue(symbol);
            var currentIndex = rateList.indexOf(value);
            if (currentIndex === -1) currentIndex = rateList.indexOf(100);
            var nextIndex = (currentIndex + 1) % rateList.length;
            this.changeValue(symbol, rateList[nextIndex]);
        } else {
            _Window_Options_processOk.call(this);
        }
    };

    var _Window_Options_cursorRight = Window_Options.prototype.cursorRight;
    Window_Options.prototype.cursorRight = function(wrap) {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        if (symbol === 'encounterRate') {
            var value = this.getConfigValue(symbol);
            var currentIndex = rateList.indexOf(value);
            if (currentIndex === -1) currentIndex = rateList.indexOf(100);
            var nextIndex = (currentIndex + 1) % rateList.length;
            this.changeValue(symbol, rateList[nextIndex]);
        } else {
            _Window_Options_cursorRight.call(this, wrap);
        }
    };

    var _Window_Options_cursorLeft = Window_Options.prototype.cursorLeft;
    Window_Options.prototype.cursorLeft = function(wrap) {
        var index = this.index();
        var symbol = this.commandSymbol(index);
        if (symbol === 'encounterRate') {
            var value = this.getConfigValue(symbol);
            var currentIndex = rateList.indexOf(value);
            if (currentIndex === -1) currentIndex = rateList.indexOf(100);
            var prevIndex = (currentIndex - 1 + rateList.length) % rateList.length;
            this.changeValue(symbol, rateList[prevIndex]);
        } else {
            _Window_Options_cursorLeft.call(this, wrap);
        }
    };

    // --- INSTANT UPDATE LOGIC ---
    var _Window_Options_changeValue = Window_Options.prototype.changeValue;
    Window_Options.prototype.changeValue = function(symbol, value) {
        var oldValue = this.getConfigValue(symbol);
        
        _Window_Options_changeValue.call(this, symbol, value);
        
        if (symbol === 'encounterRate' && $gamePlayer && oldValue !== value) {
            var oldRate = oldValue || 100;
            var newRate = value || 100;
            
            if (newRate <= 0) {
                $gamePlayer._encounterCount = 9999999; 
            } else if (oldRate > 0 && $gamePlayer._encounterCount < 999999) {
                var currentSteps = $gamePlayer._encounterCount;
                var baseSteps = currentSteps * (oldRate / 100);
                $gamePlayer._encounterCount = Math.max(1, Math.round(baseSteps * (100 / newRate)));
            } else {
                $gamePlayer.makeEncounterCount();
            }
        }
    };

    // --- Game_Player Logic ---
    var _Game_Player_makeEncounterCount = Game_Player.prototype.makeEncounterCount;
    Game_Player.prototype.makeEncounterCount = function() {
        _Game_Player_makeEncounterCount.call(this);
        var rate = ConfigManager.encounterRate;
        
        if (rate === undefined || isNaN(rate)) rate = 100;

        if (rate <= 0) {
            this._encounterCount = 9999999;
        } else {
            var multiplier = 100 / rate;
            this._encounterCount = Math.max(1, Math.round(this._encounterCount * multiplier));
        }
    };

})();