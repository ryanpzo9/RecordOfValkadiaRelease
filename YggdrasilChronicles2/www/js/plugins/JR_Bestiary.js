/*:
 * @plugindesc v2.26 - Creates a dynamic bestiary system for RPG Maker MV, displaying enemy info with images and drops, compatible with HIME_EnemyReinforcements.
 * @author James Ryan
 *
 * @param Title Text
 * @desc The text to display in the title window at the top.
 * @default Bestiary
 *
 * @param Unlocked Label
 * @desc The label text for the "Unlocked" part in the title (e.g., "Unlocked: X/Y").
 * @default Unlocked
 *
 * @param Unlocked Color
 * @desc The color index for the unlocked count (X) in "Unlocked: X/Y". Default: 4 (green)
 * @default 4
 *
 * @param Total Color
 * @desc The color index for the total count (Y) in "Unlocked: X/Y". Default: 2 (red)
 * @default 2
 *
 * @param No Information Text
 * @desc The text to display when no information is available for an enemy.
 * @default NO INFORMATION
 *
 * @param Parameters Text
 * @desc The text to display for the Parameters section.
 * @default Parameters
 *
 * @param Drops Label
 * @desc The label text for the drops section.
 * @default Drops
 *
 * @param Location Label
 * @desc The label text for the location section (e.g., "Location" or "Found In").
 * @default Location
 *
 * @param Element Label
 * @desc The label text for the element section (e.g., "Element" or "Type").
 * @default Element
 *
 * @param Show Element
 * @desc Show the Element row in the bestiary status window? (true/false)
 * @default true
 *
 * @param Unknown Location Text
 * @desc The text to display when an enemy's location is not specified.
 * @default Unknown
 *
 * @param Level Label
 * @desc The label text for the Level parameter.
 * @default Level
 *
 * @param Max HP Label
 * @desc The label text for the Max HP (MHP) parameter.
 * @default Max HP (MHP)
 *
 * @param Max MP Label
 * @desc The label text for the Max MP (MMP) parameter.
 * @default Max MP (MMP)
 *
 * @param Attack Label
 * @desc The label text for the Attack (ATK) parameter.
 * @default Attack (ATK)
 *
 * @param Defense Label
 * @desc The label text for the Defense (DEF) parameter.
 * @default Defense (DEF)
 *
 * @param M.Attack Label
 * @desc The label text for the Magic Attack (MAT) parameter.
 * @default M.Attack (MAT)
 *
 * @param M.Defense Label
 * @desc The label text for the Magic Defense (MDF) parameter.
 * @default M.Defense (MDF)
 *
 * @param Agility Label
 * @desc The label text for the Agility (AGI) parameter.
 * @default Agility (AGI)
 *
 * @param Luck Label
 * @desc The label text for the Luck (LUK) parameter.
 * @default Luck (LUK)
 *
 * @param Scroll Wait Time
 * @desc Time (in seconds) before auto-scrolling starts. Default: 3
 * @default 3
 *
 * @param Auto Scroll Time
 * @desc Total time (in seconds) for auto-scrolling to reach the end. Default: 3
 * @default 3
 *
 * @param Auto Scroll Cooldown
 * @desc Wait time (in seconds) after scrolling ends before returning to top. Default: 3
 * @default 3
 *
 * @param Bestiary Menu Text
 * @desc The text to display for the Bestiary command in the main menu.
 * @default Bestiary
 *
 * @param Show Bestiary Menu
 * @desc Show the Bestiary option in the main menu by default? (true/false)
 * @default true
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * This plugin creates a bestiary system that displays information about enemies
 * encountered in the game. It integrates with Hime's Enemy Levels, Enemy Classes,
 * and Enemy Classes Parameter Tables plugins for level and stat management, and
 * with Yanfly's Extra Enemy Drops for extended drop handling. Now also compatible
 * with HIME_EnemyReinforcements for tracking enemies added mid-battle.
 *
 * ============================================================================
 * Usage
 * ============================================================================
 * - Add the note tag <Mob Bestiary> to any enemy in the database to include it
 * in the bestiary.
 * - Use <Sideview Battler: FILENAME> in the enemy's note box to specify the
 * sideview battler image (e.g., <Sideview Battler: SV_CactusGladiator>). The image
 * should be located in img/sv_actors/ and the first frame will be shown.
 * - Use <enemy level: FORMULA /> for dynamic levels (optional, overridden by Hime's Enemy Levels).
 * - Use <enemy class: CLASS_ID /> to assign a class (optional, overridden by Hime's Enemy Classes).
 * - Use <Tags: Boss> to indicate a boss enemy with dynamic stats based on level.
 * - Use <EnemyLocation: MapName> to specify the enemy's location (e.g., <EnemyLocation: Forest>).
 * - Use <Element: Fire, Ice> to specify one or more elements for the enemy (e.g., <Element: Wind>).
 * - Use drop note tags like <Item x: y%> (e.g., <Item 305: 60%>) to specify
 * drops with their drop chances.
 *
 * ============================================================================
 * Script Commands
 * ============================================================================
 * - Show/Hide Bestiary in Main Menu:
 * $gameSystem.setBestiaryMenuVisible(true);  // Show Bestiary in menu
 * $gameSystem.setBestiaryMenuVisible(false); // Hide Bestiary in menu
 *
 * - Unlock/Hide All Enemy Information in Bestiary:
 * $gameSystem.unlockAllBestiaryEntries(); // Unlock all enemy info
 * $gameSystem.hideAllBestiaryEntries();   // Hide all enemy info
 *
 * - Get Number of Unlocked Enemies:
 * $gameSystem.getUnlockedEnemyCount();    // Returns the number of unlocked enemies
 *
 * - Unlock a Range of Enemies:
 * $gameSystem.unlockBestiaryRange(first, last); // Unlocks enemies from list position first to last (e.g., $gameSystem.unlockBestiaryRange(2, 3))
 *
 * ============================================================================
 * Compatibility
 * ============================================================================
 * - Requires Hime's Enemy Levels, Enemy Classes, and Enemy Classes Parameter
 * Tables plugins.
 * - Compatible with Yanfly's Extra Enemy Drops and YEP_StatusMenuCore plugins.
 * - Compatible with cellicom_RarityItemColor plugin for coloring drop items based on rarity.
 * - Compatible with HIME_EnemyReinforcements for tracking enemies added mid-battle.
 * - Compatible with old save files (initializes encounter data on first load).
 *
 * ============================================================================
 * Terms of Use
 * ============================================================================
 * Free for use in both commercial and non-commercial projects with credit.
 * ============================================================================
 */

var Imported = Imported || {};
Imported.BestiarySystem = true;
var Bestiary = Bestiary || {};

(function() {
    // Load plugin parameters with explicit type conversion
    var parameters = PluginManager.parameters('JR_Bestiary');

    // String parameters
    var titleText = String(parameters['Title Text'] || 'Bestiary');
    var unlockedLabel = String(parameters['Unlocked Label'] || 'Unlocked');
    var noInformationText = String(parameters['No Information Text'] || 'NO INFORMATION');
    var parametersText = String(parameters['Parameters Text'] || 'Parameters');
    var dropsLabel = String(parameters['Drops Label'] || 'Drops');
    var locationLabel = String(parameters['Location Label'] || 'Location');
    var elementLabel = String(parameters['Element Label'] || 'Element');
    var showElement = (String(parameters['Show Element'] || 'true').toLowerCase() === 'true');
    var unknownLocationText = String(parameters['Unknown Location Text'] || 'Unknown');
    var statLabels = [
        String(parameters['Level Label'] || 'Level'),
        String(parameters['Max HP Label'] || 'Max HP (MHP)'),
        String(parameters['Max MP Label'] || 'Max MP (MMP)'),
        String(parameters['Attack Label'] || 'Attack (ATK)'),
        String(parameters['Defense Label'] || 'Defense (DEF)'),
        String(parameters['M.Attack Label'] || 'M.Attack (MAT)'),
        String(parameters['M.Defense Label'] || 'M.Defense (MDF)'),
        String(parameters['Agility Label'] || 'Agility (AGI)'),
        String(parameters['Luck Label'] || 'Luck (LUK)')
    ];
    var bestiaryMenuText = String(parameters['Bestiary Menu Text'] || 'Bestiary');

    // Number parameters
    var scrollWaitTime = Number(parameters['Scroll Wait Time'] || 3);
    var autoScrollTime = Number(parameters['Auto Scroll Time'] || 3);
    var autoScrollCooldown = Number(parameters['Auto Scroll Cooldown'] || 3);
    var unlockedColor = Number(parameters['Unlocked Color'] || 4); // Default to green (index 4)
    var totalColor = Number(parameters['Total Color'] || 2); // Default to red (index 2)

    // Boolean parameter
    var showBestiaryMenu = (String(parameters['Show Bestiary Menu'] || 'true').toLowerCase() === 'true');

    // Hardcode the title font size
    var titleFontSize = 28; // Slightly larger than the default 24

    // Function to get the total number of bestiary enemies
    Bestiary.getTotalBestiaryEnemies = function() {
        var total = 0;
        for (var i = 1; i < $dataEnemies.length; i++) {
            var enemy = $dataEnemies[i];
            if (enemy && Bestiary.getEnemyData(enemy).isBestiary) {
                total++;
            }
        }
        return total;
    };

    // Preload all enemy battler images
    Bestiary.preloadEnemyBattlers = function() {
        for (var i = 1; i < $dataEnemies.length; i++) {
            var enemy = $dataEnemies[i];
            if (enemy) {
                var enemyData = Bestiary.getEnemyData(enemy);
                if (enemyData.isBestiary && enemyData.sideviewBattler) {
                    ImageManager.loadSvActor(enemyData.sideviewBattler, 0);
                }
            }
        }
    };

    // Call the preload function when the game starts
    var _Scene_Boot_start = Scene_Boot.prototype.start;
    Scene_Boot.prototype.start = function() {
        _Scene_Boot_start.call(this);
        Bestiary.preloadEnemyBattlers();
    };

    // Ensure compatibility with old save files
    var _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        if (!$gameSystem._bestiaryEncountered) {
            $gameSystem._bestiaryEncountered = {};
        }
        // Ensure Bestiary menu is visible by default for new games
        $gameSystem._bestiaryMenuVisible = true;
    };

    // Ensure $gameSystem._bestiaryEncountered and _bestiaryMenuVisible are initialized when loading old save files
    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        if (!$gameSystem._bestiaryEncountered) {
            $gameSystem._bestiaryEncountered = {};
        }
        // Ensure Bestiary menu is visible by default for loaded saves
        if ($gameSystem._bestiaryMenuVisible === undefined) {
            $gameSystem._bestiaryMenuVisible = true;
        }
    };

    // Add methods to $gameSystem for script commands
    Game_System.prototype.setBestiaryMenuVisible = function(visible) {
        this._bestiaryMenuVisible = !!visible;
        SceneManager._scene.refreshCommandWindow && SceneManager._scene.refreshCommandWindow();
    };

    Game_System.prototype.isBestiaryMenuVisible = function() {
        return this._bestiaryMenuVisible !== false;
    };

    Game_System.prototype.unlockAllBestiaryEntries = function() {
        for (var i = 1; i < $dataEnemies.length; i++) {
            if ($dataEnemies[i] && Bestiary.getEnemyData($dataEnemies[i]).isBestiary) {
                this._bestiaryEncountered[i] = true;
            }
        }
    };

    Game_System.prototype.hideAllBestiaryEntries = function() {
        this._bestiaryEncountered = {};
    };

    Game_System.prototype.getUnlockedEnemyCount = function() {
        var count = 0;
        for (var id in this._bestiaryEncountered) {
            if (this._bestiaryEncountered[id] === true) {
                // FIXED: Only count if the enemy actually exists in database AND still has the Bestiary tag
                var enemy = $dataEnemies[id];
                if (enemy && Bestiary.getEnemyData(enemy).isBestiary) {
                    count++;
                }
            }
        }
        return count;
    };

    Game_System.prototype.unlockBestiaryRange = function(first, last) {
        // Create a temporary list to map list positions to enemy IDs
        var enemyList = [];
        for (var i = 1; i < $dataEnemies.length; i++) {
            var enemy = $dataEnemies[i];
            if (enemy && Bestiary.getEnemyData(enemy).isBestiary) {
                enemyList.push(i);
            }
        }

        // Adjust first and last to be within valid list positions (1-based)
        first = Math.max(1, Math.floor(first));
        last = Math.min(enemyList.length, Math.floor(last));
        if (first > last) {
            var temp = first;
            first = last;
            last = temp;
        }

        // Unlock enemies based on their list positions
        for (var pos = first; pos <= last; pos++) {
            var listIndex = pos - 1; // Convert to 0-based index for array access
            if (listIndex >= 0 && listIndex < enemyList.length) {
                var enemyId = enemyList[listIndex];
                if ($dataEnemies[enemyId] && Bestiary.getEnemyData($dataEnemies[enemyId]).isBestiary) {
                    this._bestiaryEncountered[enemyId] = true;
                }
            }
        }

        // Refresh the bestiary list if the scene is active
        if (SceneManager._scene instanceof Scene_Bestiary) {
            SceneManager._scene._listWindow.refresh();
            SceneManager._scene._statusWindow.refresh();
            SceneManager._scene._titleWindow.refresh(); // Refresh the title window to update the unlocked count
        }
    };

    // Regex for note tags
    Bestiary.Regex = {
        MOB_BESTIARY: /<Mob Bestiary>/i,
        SIDEVIEW_BATTLER: /<Sideview Battler:\s*(.+?)>/i,
        ENEMY_LEVEL: /<enemy[-_ ]level:\s*(.+?)\s*(\/>|>)/i,
        ENEMY_CLASS: /<enemy[-_ ]class:\s*(\d+)\s*(\/>|>)/i,
        ENEMY_LOCATION: /<EnemyLocation:\s*(.+?)>/i,
        TAGS: /<Tags:\s*(.+?)>/i,
        ELEMENT: /<Element:\s*(.+?)>/i,
        DROPS: /<(Item|Weapon|Armor)[ ](\d+):[ ](\d+)([%％])>/gi,
        PARAMETER_TABLE: /<parameter[-_ ]table:\s*(.+?)\s*(\/>|>)/i
    };

    // Extract enemy data from note tags
    Bestiary.getEnemyData = function(enemy) {
        var data = {
            isBestiary: enemy && Bestiary.Regex.MOB_BESTIARY.test(enemy.note),
            sideviewBattler: '',
            levelFormula: '1',
            classId: 0,
            location: unknownLocationText, // Use the configurable text
            isBoss: false,
            elements: [],
            drops: []
        };

        if (data.isBestiary) {
            var match = Bestiary.Regex.SIDEVIEW_BATTLER.exec(enemy.note);
            if (match) data.sideviewBattler = match[1];
            match = Bestiary.Regex.ENEMY_LEVEL.exec(enemy.note);
            if (match) data.levelFormula = match[1];
            match = Bestiary.Regex.ENEMY_CLASS.exec(enemy.note);
            if (match) data.classId = Math.floor(match[1]);
            match = Bestiary.Regex.ENEMY_LOCATION.exec(enemy.note);
            if (match) data.location = match[1];
            match = Bestiary.Regex.TAGS.exec(enemy.note);
            if (match && match[1].toLowerCase().includes('boss')) data.isBoss = true;
            match = Bestiary.Regex.ELEMENT.exec(enemy.note);
            if (match) {
                data.elements = match[1].split(',').map(function(e) { return e.trim(); }).filter(function(e) { return e.length > 0; });
            }
            while ((match = Bestiary.Regex.DROPS.exec(enemy.note)) !== null) {
                data.drops.push({
                    type: match[1],
                    id: parseInt(match[2]),
                    chance: parseFloat(match[3])
                });
            }
        }
        return data;
    };

    // Extract parameter table name from class note tag
    Bestiary.getParameterTableName = function(classId) {
        if (!$dataClasses[classId]) return null;
        var note = $dataClasses[classId].note;
        var match = Bestiary.Regex.PARAMETER_TABLE.exec(note);
        if (match) {
            return match[1].trim();
        }
        return null;
    };

    // Evaluate level range using HIME_EnemyLevels logic
    Bestiary.evalLevelRange = function(enemy) {
        var enemyData = Bestiary.getEnemyData(enemy);
        var formula = enemyData.levelFormula;

        if (Imported.HIME_EnemyLevels) {
            var res = TH.EnemyLevels.Regex.exec(enemy.note);
            if (res) {
                formula = res[1];
            } else {
                formula = '1'; // Default to level 1 if no formula is found
            }
        }

        if (!formula || typeof formula !== 'string') {
            return { min: 1, max: 1 };
        }

        try {
            // Check if formula contains Math.random()
            if (formula.includes('Math.random()')) {
                // Simulate multiple random evaluations to find min and max
                let min = Infinity, max = -Infinity;
                const samples = 1000; // Number of samples for approximation
                for (let i = 0; i < samples; i++) {
                    let v = $gameVariables;
                    let value = Math.floor(eval(formula));
                    min = Math.min(min, value);
                    max = Math.max(max, value);
                }
                return { min: min === Infinity ? 1 : min, max: max === -Infinity ? 1 : max };
            }
            // If no Math.random(), evaluate directly as a single value
            let v = $gameVariables;
            let value = Math.floor(eval(formula));
            return { min: value, max: value };
        } catch (e) {
            return { min: 1, max: 1 };
        }
    };

    // Evaluate parameter range based on level range and class
    Bestiary.evalParamRange = function(enemy, paramId, levelRange) {
        var minLevel = levelRange.min;
        var maxLevel = levelRange.max;

        // Ensure levels are within valid range (1 to 110, as CSV supports up to 110)
        minLevel = Math.max(1, Math.min(110, minLevel));
        maxLevel = Math.max(1, Math.min(110, maxLevel));

        // Extract class ID from note tag
        var enemyData = Bestiary.getEnemyData(enemy);
        var classId = enemyData.classId;

        var minParam, maxParam;

        try {
            // Create Game_Enemy instances at minLevel and maxLevel
            var enemyMin = new Game_Enemy(enemy.id, 0, 0);
            var enemyMax = new Game_Enemy(enemy.id, 0, 0);

            // Set the class ID using HIME_EnemyClasses if available
            if (Imported.HIME_EnemyClasses && enemyMin.setClass) {
                enemyMin.setClass(classId);
                enemyMax.setClass(classId);
            }

            // Set the level using HIME_EnemyLevels if available
            if (Imported.HIME_EnemyLevels && enemyMin.setLevel) {
                enemyMin.setLevel(minLevel);
                enemyMax.setLevel(maxLevel);
            } else {
                // Fallback: manually set the level property if the plugin provides it
                enemyMin._level = minLevel;
                enemyMax._level = maxLevel;
            }

            // Fetch parameter values using paramBase
            minParam = enemyMin.paramBase(paramId);
            maxParam = enemyMax.paramBase(paramId);
        } catch (e) {
            // Fallback to default enemy params if something goes wrong
            minParam = enemy.params[paramId] || 0;
            maxParam = minParam;
        }

        return { min: minParam, max: maxParam };
    };

    // Game_Enemy extension to set up bestiary data
    var _GameEnemy_setup = Game_Enemy.prototype.setup;
    Game_Enemy.prototype.setup = function(enemyId, x, y) {
        _GameEnemy_setup.call(this, enemyId, x, y);
        var enemyData = Bestiary.getEnemyData($dataEnemies[enemyId]);
        if (enemyData.isBestiary) {
            this._bestiaryData = enemyData;
        }
    };

    // Track initial encounters at the start of battle
    var _BattleManager_displayStartMessages = BattleManager.displayStartMessages;
    BattleManager.displayStartMessages = function() {
        _BattleManager_displayStartMessages.call(this);
        var enemies = $gameTroop.members();
        enemies.forEach(function(enemy) {
            if (enemy._bestiaryData && enemy._bestiaryData.isBestiary) {
                $gameSystem._bestiaryEncountered[enemy.enemyId()] = true;
            }
        });
    };

    // Track enemies added mid-battle via HIME_EnemyReinforcements
    var _BattleManager_refreshEnemyReinforcements = BattleManager.refreshEnemyReinforcements;
    BattleManager.refreshEnemyReinforcements = function() {
        _BattleManager_refreshEnemyReinforcements.call(this);
        var enemies = $gameTroop.members();
        enemies.forEach(function(enemy) {
            if (enemy._bestiaryData && enemy._bestiaryData.isBestiary) {
                $gameSystem._bestiaryEncountered[enemy.enemyId()] = true;
            }
        });
    };

    // Title Window
    function Window_BestiaryTitle() {
        this.initialize.apply(this, arguments);
    }

    Window_BestiaryTitle.prototype = Object.create(Window_Base.prototype);
    Window_BestiaryTitle.prototype.constructor = Window_BestiaryTitle;

    Window_BestiaryTitle.prototype.initialize = function() {
        var width = Graphics.boxWidth;
        // Calculate height based on the hardcoded title font size plus padding
        var height = titleFontSize + this.standardPadding() * 2 + 8; // Add extra padding for better spacing
        Window_Base.prototype.initialize.call(this, 0, 0, width, height);
        this.refresh();
    };

    Window_BestiaryTitle.prototype.refresh = function() {
        this.contents.clear();
        // Resize the contents to match the window's new dimensions
        this.createContents();
        this.contents.fontSize = titleFontSize; // Use the hardcoded font size

        // Calculate unlocked and total counts
        var unlockedCount = $gameSystem.getUnlockedEnemyCount();
        var totalCount = Bestiary.getTotalBestiaryEnemies();

        // Split the title into parts for coloring
        var part1 = titleText + ' (' + unlockedLabel + ': ';
        var part2 = unlockedCount.toString();
        var part3 = '/';
        var part4 = totalCount.toString();
        var part5 = ')';

        // Calculate the total width of the text to center it
        var totalText = part1 + part2 + part3 + part4 + part5;
        var totalWidth = this.textWidth(totalText);
        var startX = (this.contents.width - totalWidth) / 2;
        var textY = (this.height - this.standardPadding() * 2 - this.contents.fontSize) / 2 - 4; // Shift up by 4 pixels

        // Draw each part with appropriate colors
        var x = startX;

        // Part 1: "Monster Bestiary (Unlocked: "
        this.changeTextColor(this.textColor(0)); // Normal color (white)
        this.drawText(part1, x, textY, this.contents.width);
        x += this.textWidth(part1);

        // Part 2: Unlocked count (X) in the specified color
        this.changeTextColor(this.textColor(unlockedColor)); // Use the configured color for X
        this.drawText(part2, x, textY, this.contents.width);
        x += this.textWidth(part2);

        // Part 3: "/"
        this.changeTextColor(this.textColor(0)); // Normal color (white)
        this.drawText(part3, x, textY, this.contents.width);
        x += this.textWidth(part3);

        // Part 4: Total count (Y) in the specified color
        this.changeTextColor(this.textColor(totalColor)); // Use the configured color for Y
        this.drawText(part4, x, textY, this.contents.width);
        x += this.textWidth(part4);

        // Part 5: ")"
        this.changeTextColor(this.textColor(0)); // Normal color (white)
        this.drawText(part5, x, textY, this.contents.width);
    };

    // Bestiary List Window
    function Window_BestiaryList() {
        this.initialize.apply(this, arguments);
    }

    Window_BestiaryList.prototype = Object.create(Window_Selectable.prototype);
    Window_BestiaryList.prototype.constructor = Window_BestiaryList;

    Window_BestiaryList.prototype.initialize = function(x, y, width, height) {
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this._data = [];
        this.refresh();
        this.select(0); // Automatically select the first enemy
    };

    Window_BestiaryList.prototype.maxItems = function() {
        return this._data ? this._data.length : 0;
    };

    Window_BestiaryList.prototype.item = function() {
        return this._data && this.index() >= 0 ? this._data[this.index()].enemy : null;
    };

    Window_BestiaryList.prototype.makeItemList = function() {
        this._data = [];
        for (var i = 1; i < $dataEnemies.length; i++) {
            var enemy = $dataEnemies[i];
            if (enemy && Bestiary.getEnemyData(enemy).isBestiary) {
                this._data.push({ enemy: enemy, id: i });
            }
        }
    };

    Window_BestiaryList.prototype.refresh = function() {
        this.makeItemList();
        this.createContents();
        this.drawAllItems();
    };

    Window_BestiaryList.prototype.drawItem = function(index) {
        var data = this._data[index];
        if (!data) return;
        var enemy = data.enemy;
        var enemyId = data.id;
        var rect = this.itemRect(index);
        var name = $gameSystem._bestiaryEncountered && $gameSystem._bestiaryEncountered[enemyId] ? enemy.name : '???';
        var enemyData = Bestiary.getEnemyData(enemy);
        var indent = 20; // Base indentation for the entire line
        var nameGap = 2; // Reduced gap between index and name
        // Use a fixed width for the index to ensure consistent alignment (e.g., enough for "999.")
        var indexText = (index + 1) + '.';
        var fixedIndexWidth = this.textWidth('999.'); // Fixed width based on the largest possible index
        var maxWidth = rect.width - indent - fixedIndexWidth - nameGap; // Adjusted available width for the name

        // Reset color before drawing the index to prevent colorization
        this.resetTextColor();
        this.changePaintOpacity($gameSystem._bestiaryEncountered && $gameSystem._bestiaryEncountered[enemyId]);
        this.drawText(indexText, rect.x + indent, rect.y, fixedIndexWidth, 'left');

        // Set color for the name if the enemy is a boss
        if (enemyData.isBoss && $gameSystem._bestiaryEncountered && $gameSystem._bestiaryEncountered[enemyId]) {
            this.changeTextColor(this.textColor(2)); // Red color for bosses
        } else {
            this.resetTextColor();
        }

        // Adjust font size if the name is too long
        var originalFontSize = this.contents.fontSize;
        this.contents.fontSize = originalFontSize;
        var textWidth = this.textWidth(name);
        while (textWidth > maxWidth && this.contents.fontSize > 12) { // Minimum font size of 12
            this.contents.fontSize -= 2;
            textWidth = this.textWidth(name);
        }

        // Draw the name at a fixed position after the index
        this.drawText(name, rect.x + indent + fixedIndexWidth + nameGap, rect.y, maxWidth);
        this.changePaintOpacity(true);

        // Reset font size and text color
        this.contents.fontSize = originalFontSize;
        this.resetTextColor();
    };

    Window_BestiaryList.prototype.updateHelp = function() {
        if (this._helpWindow && this.item()) {
            this._helpWindow.setEnemy(this.item());
        }
    };

    // Bestiary Status Window
    function Window_BestiaryStatus() {
        this.initialize.apply(this, arguments);
    }

    Window_BestiaryStatus.prototype = Object.create(Window_Selectable.prototype);
    Window_BestiaryStatus.prototype.constructor = Window_BestiaryStatus;

    Window_BestiaryStatus.prototype.initialize = function(x, y, width, height) {
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this._enemy = null;
        this._scrollY = 0;
        this._autoScroll = true; // Enable auto-scroll by default
        this._scrollTimer = 0;
        this._scrollPhase = 0; // 0: waiting, 1: scrolling down, 2: cooldown, 3: scrolling up
        this._wasActive = false; // Track previous active state
    };

    Window_BestiaryStatus.prototype.maxItems = function() {
        return 1;
    };

    Window_BestiaryStatus.prototype.item = function() {
        return this._enemy;
    };

    // Override to prevent drawing the highlight bar
    Window_BestiaryStatus.prototype.drawSelection = function() {
        // Do nothing to disable the highlight bar
    };

    // Override to prevent cursor drawing
    Window_BestiaryStatus.prototype.drawAllItems = function() {
        // Skip default drawing of items with cursor
        this.drawContent();
    };

    // Override to disable cursor visibility
    Window_BestiaryStatus.prototype.cursorVisible = function() {
        return false; // Never show the cursor
    };

    // Override to prevent cursor updates
    Window_BestiaryStatus.prototype.updateCursor = function() {
        // Do nothing to prevent cursor from being drawn
    };

    // Custom method to draw the content without cursor
    Window_BestiaryStatus.prototype.drawContent = function() {
        if (!this.contents) {
            this.createContents();
        }
        this.contents.clear();
        if (!this._enemy) return;

        var enemyData = Bestiary.getEnemyData(this._enemy);
        var gameEnemy = new Game_Enemy(this._enemy.id, 0, 0); // Create Game_Enemy instance
        var x = this.standardPadding();
        var y = -this._scrollY;
        var lineHeight = this.lineHeight();
        var centerX = (this.contents.width - this.standardPadding() * 2) / 2 + this.standardPadding();
        var statColumnWidth = (this.contents.width - this.standardPadding() * 24) / 3; // Further increased padding to reduce table width

        // Draw Image (First Frame Only) - Centered, at original size
        if ($gameSystem._bestiaryEncountered && $gameSystem._bestiaryEncountered[this._enemy.id] && gameEnemy.hasSVBattler()) {
            var filename = gameEnemy.svBattlerName();
            var bitmap = ImageManager.loadSvActor(filename, 0); // Load from img/sv_actors
            if (bitmap.isReady()) {
                // Step 1: Get the total resolution of the sprite sheet
                var totalWidth = bitmap.width;
                var totalHeight = bitmap.height;

                // Step 2: Calculate the dimensions of a single frame (9x6 grid, each cell is one frame)
                var frameWidth = totalWidth / 9; // 9 columns
                var frameHeight = totalHeight / 6; // 6 rows

                // Step 3: Extract the first frame at position (0, 0)
                var sx = 0; // First frame (column 0)
                var sy = 0; // First frame (row 0)

                // Step 4: Draw the first frame at its original size (no scaling)
                this.contents.blt(bitmap, sx, sy, frameWidth, frameHeight, centerX - frameWidth / 2, y, frameWidth, frameHeight);

                // Update y position based on the actual frame height
                y += frameHeight + lineHeight;
            } else {
                var self = this;
                bitmap.addLoadListener(function() {
                    self.contents.clear();
                    self.refresh();
                });
                this.drawText('Loading...', centerX - this.textWidth('Loading...') / 2, y, this.contents.width, 'center');
                y += lineHeight * 2; // Fallback spacing if loading
            }
        } else {
            this.drawText(noInformationText, 0, y, this.contents.width, 'center'); // Use configurable text
            y += lineHeight * 2;
        }

        // Draw Location - Centered with colored text
        if ($gameSystem._bestiaryEncountered && $gameSystem._bestiaryEncountered[this._enemy.id]) {
            var locationText = locationLabel + ': ' + enemyData.location;
            this.changeTextColor(this.textColor(29)); // Light green
            this.drawText(locationText, 0, y, this.contents.width, 'center');
            y += lineHeight;
            this.changeTextColor(this.normalColor());
        } else {
            var locationText = locationLabel + ': ???';
            this.changeTextColor(this.textColor(29)); // Light green
            this.drawText(locationText, 0, y, this.contents.width, 'center');
            y += lineHeight;
            this.changeTextColor(this.normalColor());
        }

        // Draw Element - Centered with colored text
        if (showElement) {
            if ($gameSystem._bestiaryEncountered && $gameSystem._bestiaryEncountered[this._enemy.id]) {
                var elementText = elementLabel + ': ' + (enemyData.elements.length > 0 ? enemyData.elements.join(', ') : '—');
                this.changeTextColor(this.textColor(6)); // Orange
                this.drawText(elementText, 0, y, this.contents.width, 'center');
                y += lineHeight;
                this.changeTextColor(this.normalColor());
            } else {
                this.changeTextColor(this.textColor(6)); // Orange
                this.drawText(elementLabel + ': ???', 0, y, this.contents.width, 'center');
                y += lineHeight;
                this.changeTextColor(this.normalColor());
            }
            // Add one line space between Element and Parameters
            y += lineHeight;
        }

        // Draw Parameters Title - Centered
        this.changeTextColor(this.systemColor());
        this.drawText(parametersText, 0, y, this.contents.width, 'center'); // Use configurable text
        this.changeTextColor(this.normalColor());
        y += lineHeight;

        // Draw Level - Centered with colored text (right above the parameter table)
        if ($gameSystem._bestiaryEncountered && $gameSystem._bestiaryEncountered[this._enemy.id]) {
            var levelRange = this._params[0] || { min: 1, max: 1 }; // Fallback if _params[0] is undefined
            var levelText = statLabels[0].trim() + ': ' + (levelRange.min === levelRange.max ? levelRange.min.toString() : levelRange.min + ' - ' + levelRange.max);
            this.changeTextColor(this.textColor(20)); // Light blue
            this.drawText(levelText, 0, y, this.contents.width, 'center');
            y += lineHeight;
            this.changeTextColor(this.normalColor());
        } else {
            var levelText = statLabels[0].trim() + ': ??? - ???';
            this.changeTextColor(this.textColor(20)); // Light blue
            this.drawText(levelText, 0, y, this.contents.width, 'center');
            y += lineHeight;
            this.changeTextColor(this.normalColor());
        }

        // Draw Stats (excluding Level, since it's already drawn above)
        if ($gameSystem._bestiaryEncountered && $gameSystem._bestiaryEncountered[this._enemy.id]) {
            for (var i = 1; i < statLabels.length; i++) { // Start from 1 to skip Level
                var label = statLabels[i].trim();
                var paramRange = this._params[i] || { min: 0, max: 0 }; // Fallback if _params[i] is undefined
                var value = paramRange.min === paramRange.max ? paramRange.min.toString() : paramRange.min + ' - ' + paramRange.max;
                var rectX = centerX - statColumnWidth;
                this.changeTextColor(this.systemColor());
                this.drawText(label, rectX, y, statColumnWidth, 'left');
                this.changeTextColor(this.normalColor());
                this.drawText(value, rectX + statColumnWidth, y, statColumnWidth, 'right');
                y += lineHeight;
            }
        } else {
            for (var i = 1; i < statLabels.length; i++) { // Start from 1 to skip Level
                var label = statLabels[i].trim();
                var rectX = centerX - statColumnWidth;
                this.changeTextColor(this.systemColor());
                this.drawText(label, rectX, y, statColumnWidth, 'left');
                this.changeTextColor(this.normalColor());
                this.drawText('??? - ???', rectX + statColumnWidth, y, statColumnWidth, 'right');
                y += lineHeight;
            }
        }

        // Draw Drops with yellow-gold color for the label
        y += lineHeight;
        this.changeTextColor(this.textColor(14)); // Yellow-gold color
        this.drawText(dropsLabel + ':', x, y, this.contents.width, 'left');
        this.changeTextColor(this.normalColor()); // Reset to normal color for subsequent text
        y += lineHeight;

        if ($gameSystem._bestiaryEncountered && $gameSystem._bestiaryEncountered[this._enemy.id]) {
            var dropMap = {};
            enemyData.drops.forEach(function(drop) {
                var item = null;
                if (drop.type === 'Item') item = $dataItems[drop.id];
                else if (drop.type === 'Weapon') item = $dataWeapons[drop.id];
                else if (drop.type === 'Armor') item = $dataArmors[drop.id];
                if (item) {
                    var key = item.name + ':' + drop.chance + '%';
                    dropMap[key] = dropMap[key] || { count: 0, item: item };
                    dropMap[key].count += 1;
                }
            });

            var dropKeys = Object.keys(dropMap);
            var dropCount = dropKeys.length;
            var halfCount = Math.ceil(dropCount / 2); // Number of items in the left column
            var columnWidth = (this.contents.width - this.standardPadding() * 2 - 20) / 2; // Width of each column, with a small gap
            var columnGap = 20; // Gap between columns

            for (var i = 0; i < halfCount; i++) {
                var yPos = y + (i * lineHeight);

                // Left column
                if (i < dropKeys.length) {
                    var key = dropKeys[i];
                    var data = dropMap[key];
                    var parts = key.split(':');
                    var name = parts[0];
                    var chance = parts[1];
                    var count = data.count;
                    var item = data.item;

                    // Draw the icon
                    this.drawIcon(item.iconIndex, x, yPos);

                    // Apply rarity color if cellicom_RarityItemColor plugin is present
                    if (Imported.cellicom_RarityItemColor && typeof item.meta.rarity !== "undefined") {
                        var rarity = parseInt(item.meta.rarity);
                        if (rarity < cellicom.rarityColors.length) {
                            this.changeTextColor(this.textColor(cellicom.rarityColors[rarity]));
                        } else {
                            this.resetTextColor();
                        }
                    } else {
                        this.resetTextColor();
                    }

                    // Draw the item name with count and chance
                    this.drawText(
                        name + ': x' + count + ' (' + chance + ')',
                        x + Window_Base._iconWidth + 4,
                        yPos,
                        columnWidth - Window_Base._iconWidth - 4,
                        'left'
                    );

                    // Reset the text color after drawing
                    this.resetTextColor();
                }

                // Right column
                var rightIndex = i + halfCount;
                if (rightIndex < dropKeys.length) {
                    var key = dropKeys[rightIndex];
                    var data = dropMap[key];
                    var parts = key.split(':');
                    var name = parts[0];
                    var chance = parts[1];
                    var count = data.count;
                    var item = data.item;

                    // Draw the icon
                    this.drawIcon(item.iconIndex, x + columnWidth + columnGap, yPos);

                    // Apply rarity color if cellicom_RarityItemColor plugin is present
                    if (Imported.cellicom_RarityItemColor && typeof item.meta.rarity !== "undefined") {
                        var rarity = parseInt(item.meta.rarity);
                        if (rarity < cellicom.rarityColors.length) {
                            this.changeTextColor(this.textColor(cellicom.rarityColors[rarity]));
                        } else {
                            this.resetTextColor();
                        }
                    } else {
                        this.resetTextColor();
                    }

                    // Draw the item name with count and chance
                    this.drawText(
                        name + ': x' + count + ' (' + chance + ')',
                        x + columnWidth + columnGap + Window_Base._iconWidth + 4,
                        yPos,
                        columnWidth - Window_Base._iconWidth - 4,
                        'left'
                    );

                    // Reset the text color after drawing
                    this.resetTextColor();
                }
            }

            // Update y position based on the number of rows
            y += halfCount * lineHeight;
        } else {
            this.drawText('???', x, y, this.contents.width, 'left');
            y += lineHeight;
        }
    };

    Window_BestiaryStatus.prototype.setEnemy = function(enemy) {
        if (this._enemy !== enemy) {
            this._enemy = enemy;
            this._scrollY = 0; // Reset scroll position when changing enemy
            this._scrollTimer = 0;
            this._scrollPhase = 0; // Reset auto-scroll phase
            this._autoScroll = true; // Reset auto-scroll state
            // Pre-calculate parameters to prevent random changes
            if (enemy) {
                var levelRange = Bestiary.evalLevelRange(enemy);
                this._params = [
                    levelRange, // Store level range for dynamic display
                    Bestiary.evalParamRange(enemy, 0, levelRange), // MHP
                    Bestiary.evalParamRange(enemy, 1, levelRange), // MMP
                    Bestiary.evalParamRange(enemy, 2, levelRange), // ATK
                    Bestiary.evalParamRange(enemy, 3, levelRange), // DEF
                    Bestiary.evalParamRange(enemy, 4, levelRange), // MAT
                    Bestiary.evalParamRange(enemy, 5, levelRange), // MDF
                    Bestiary.evalParamRange(enemy, 6, levelRange), // AGI
                    Bestiary.evalParamRange(enemy, 7, levelRange)  // LUK
                ];
            } else {
                this._params = [
                    { min: 1, max: 1 }, // Default level range
                    { min: 0, max: 0 }, // MHP
                    { min: 0, max: 0 }, // MMP
                    { min: 0, max: 0 }, // ATK
                    { min: 0, max: 0 }, // DEF
                    { min: 0, max: 0 }, // MAT
                    { min: 0, max: 0 }, // MDF
                    { min: 0, max: 0 }, // AGI
                    { min: 0, max: 0 }  // LUK
                ];
            }
            this.refresh();
        }
    };

    Window_BestiaryStatus.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);

        // Detect transition from active to inactive (returning to the list)
        if (this._wasActive && !this.active) {
            this._autoScroll = true; // Re-enable auto-scroll
            this._scrollY = 0; // Reset scroll position
            this._scrollTimer = 0;
            this._scrollPhase = 0; // Reset to waiting phase
            this.refresh();
        }
        this._wasActive = this.active; // Update the previous state

        // Auto-scroll when the status window is not active (i.e., when highlighting an enemy)
        if (!this.active && this._autoScroll) {
            var maxScroll = this.maxScrollY();
            if (maxScroll > 0) {
                if (this._scrollPhase === 0) {
                    // Waiting phase
                    this._scrollTimer += 1 / 60; // Increment timer (assuming 60 FPS)
                    if (this._scrollTimer >= scrollWaitTime) {
                        this._scrollPhase = 1; // Start scrolling down
                        this._scrollTimer = 0;
                    }
                } else if (this._scrollPhase === 1) {
                    // Scrolling down phase
                    this._scrollTimer += 1 / 60;
                    var progress = this._scrollTimer / autoScrollTime;
                    this._scrollY = Math.min(maxScroll, progress * maxScroll);
                    this.refresh();
                    if (this._scrollY >= maxScroll) {
                        this._scrollPhase = 2; // Start cooldown
                        this._scrollTimer = 0;
                    }
                } else if (this._scrollPhase === 2) {
                    // Cooldown phase
                    this._scrollTimer += 1 / 60;
                    if (this._scrollTimer >= autoScrollCooldown) {
                        this._scrollPhase = 3; // Start scrolling up
                        this._scrollTimer = 0;
                    }
                } else if (this._scrollPhase === 3) {
                    // Scrolling up phase
                    this._scrollTimer += 1 / 60;
                    var progress = this._scrollTimer / autoScrollTime;
                    this._scrollY = Math.max(0, maxScroll * (1 - progress));
                    this.refresh();
                    if (this._scrollY <= 0) {
                        this._scrollPhase = 0; // Back to waiting
                        this._scrollTimer = 0;
                    }
                }
            }
        }

        // Manual scrolling when the status window is active
        if (this.active) {
            this._autoScroll = false; // Disable auto-scroll when manually scrolling
            var scrollStep = this.lineHeight() * 6; // Further increased scroll step for better coverage
            if (Input.isRepeated('down') && this._scrollY < this.maxScrollY()) {
                this._scrollY = Math.min(this.maxScrollY(), this._scrollY + scrollStep);
                this.refresh();
            } else if (Input.isRepeated('up') && this._scrollY > 0) {
                this._scrollY = Math.max(0, this._scrollY - scrollStep);
                this.refresh();
            } else if (TouchInput.wheelY !== 0) {
                this._scrollY = Math.max(0, Math.min(this.maxScrollY(), this._scrollY + TouchInput.wheelY * this.lineHeight()));
                this.refresh();
            }
        }
    };

    Window_BestiaryStatus.prototype.maxScrollY = function() {
        var contentHeight = this.getContentHeight();
        // Adjust to account for the visible area, excluding padding
        var visibleHeight = this.height - this.standardPadding() * 2;
        return Math.max(0, contentHeight - visibleHeight);
    };

    Window_BestiaryStatus.prototype.getContentHeight = function() {
        var enemyData = Bestiary.getEnemyData(this._enemy || {});
        var gameEnemy = this._enemy ? new Game_Enemy(this._enemy.id, 0, 0) : null;
        var y = 0;
        var lineHeight = this.lineHeight();
        var imageHeight = 96; // Default height for "No Information" case

        // Image or "No Information" section
        if (gameEnemy && this._enemy && $gameSystem._bestiaryEncountered && $gameSystem._bestiaryEncountered[this._enemy.id] && gameEnemy.hasSVBattler()) {
            var filename = gameEnemy.svBattlerName();
            var bitmap = ImageManager.loadSvActor(filename, 0);
            if (bitmap.isReady()) {
                var totalHeight = bitmap.height;
                var frameHeight = totalHeight / 6; // 6 rows
                imageHeight = frameHeight; // Use the actual frame height
            }
            y += imageHeight + lineHeight; // Image + spacing
        } else {
            y += lineHeight * 2; // "NO INFORMATION" + spacing
        }

        // Location section
        y += lineHeight; // "Location" line

        // Element section
        if (showElement) {
            y += lineHeight; // "Element" line
            y += lineHeight; // Space between Element and Parameters
        }

        // Parameters section
        y += lineHeight; // "Parameters" title
        y += lineHeight; // "Level" line (under Parameters)
        y += (statLabels.length - 1) * lineHeight; // Stats (excluding Level)

        // Drops section
        y += lineHeight; // "Drops" title
        if (this._enemy && $gameSystem._bestiaryEncountered && $gameSystem._bestiaryEncountered[this._enemy.id]) {
            // Calculate unique drops for height
            var dropMap = {};
            enemyData.drops.forEach(function(drop) {
                var item = null;
                if (drop.type === 'Item') item = $dataItems[drop.id];
                else if (drop.type === 'Weapon') item = $dataWeapons[drop.id];
                else if (drop.type === 'Armor') item = $dataArmors[drop.id];
                if (item) {
                    var key = item.name + ':' + drop.chance + '%';
                    dropMap[key] = dropMap[key] || { count: 0, item: item };
                    dropMap[key].count += 1;
                }
            });
            var dropCount = Object.keys(dropMap).length;
            // Calculate the number of rows needed for two columns
            var rows = Math.ceil(dropCount / 2);
            y += rows * lineHeight; // Height based on rows in two columns
        } else {
            y += lineHeight; // "???" placeholder
        }

        // Add extra line height for spacing at the bottom
        y += lineHeight;

        return y;
    };

    Window_BestiaryStatus.prototype.refresh = function() {
        this.drawContent();
    };

    // Bestiary Scene
    function Scene_Bestiary() {
        this.initialize.apply(this, arguments);
    }

    Scene_Bestiary.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_Bestiary.prototype.constructor = Scene_Bestiary;

    Scene_Bestiary.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_Bestiary.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        // Calculate title height based on the hardcoded font size
        var titleHeight = titleFontSize + Window_Base.prototype.standardPadding() * 2 + 8;
        var listWidth = Graphics.boxWidth * 0.25;
        var statusWidth = Graphics.boxWidth - listWidth;
        this._titleWindow = new Window_BestiaryTitle();
        this._listWindow = new Window_BestiaryList(0, titleHeight, listWidth, Graphics.boxHeight - titleHeight);
        this._statusWindow = new Window_BestiaryStatus(listWidth, titleHeight, statusWidth, Graphics.boxHeight - titleHeight);
        this._listWindow.setHelpWindow(this._statusWindow);
        this.addWindow(this._titleWindow);
        this.addWindow(this._listWindow);
        this.addWindow(this._statusWindow);
        this._listWindow.activate();
        this._listWindow.updateHelp();
    };

    Scene_Bestiary.prototype.update = function() {
        Scene_MenuBase.prototype.update.call(this);
        if (this._listWindow.active) {
            if (Input.isTriggered('ok') || TouchInput.isTriggered()) { // "Confirm" (Enter) or left mouse click
                SoundManager.playOk();
                this._listWindow.deactivate();
                this._statusWindow.activate();
            } else if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
                SoundManager.playCancel();
                SceneManager.pop();
            }
        } else if (this._statusWindow.active) {
            if (Input.isTriggered('cancel') || TouchInput.isCancelled()) {
                SoundManager.playCancel();
                this._statusWindow.deactivate();
                this._listWindow.activate();
            }
        }
    };

    // Add Bestiary to the Main Menu directly (above Save, or Load if Save is not found)
    var _Window_MenuCommand_makeCommandList = Window_MenuCommand.prototype.makeCommandList;
    Window_MenuCommand.prototype.makeCommandList = function() {
        // Call the original method to add the default commands
        _Window_MenuCommand_makeCommandList.call(this);

        // Find the index of the "Save" command
        var saveIndex = this._list.findIndex(function(command) {
            return command.symbol === 'save';
        });

        // If Save is found, insert Bestiary before it
        if (saveIndex !== -1) {
            this._list.splice(saveIndex, 0, {
                name: bestiaryMenuText, // Use the configurable text
                symbol: 'bestiary',
                enabled: true,
                ext: null
            });
        } else {
            // If Save is not found, look for the "Load" command
            var loadIndex = this._list.findIndex(function(command) {
                return command.symbol === 'load';
            });

            // If Load is found, insert Bestiary before it
            if (loadIndex !== -1) {
                this._list.splice(loadIndex, 0, {
                    name: bestiaryMenuText,
                    symbol: 'bestiary',
                    enabled: true,
                    ext: null
                });
            } else {
                // Fallback: if neither Save nor Load is found, add Bestiary at the end
                this.addCommand(bestiaryMenuText, 'bestiary', true);
            }
        }
    };

    // Define the commandBestiary function for Scene_Menu
    Scene_Menu.prototype.commandBestiary = function() {
        SceneManager.push(Scene_Bestiary);
    };

    // Set up the handler for the 'bestiary' command
    var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        this._commandWindow.setHandler('bestiary', this.commandBestiary.bind(this));
    };

    // Add a method to refresh the command window when visibility changes
    Scene_Menu.prototype.refreshCommandWindow = function() {
        if (this._commandWindow) {
            this._commandWindow.refresh();
        }
    };

})();