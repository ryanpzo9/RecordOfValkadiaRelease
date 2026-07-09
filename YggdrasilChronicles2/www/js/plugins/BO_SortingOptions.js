//=============================================================================
//  Burning Orca Plugins
//  BO_SortingOptions.js
//  Version: 1.2
//=============================================================================

var Imported = Imported || {};
Imported.BO_SortingOptions = true;

var BurningOrca = BurningOrca || {};
BurningOrca.SortingOptions = BurningOrca.SortingOptions || {};

/*~struct~SortOption:
 * @param Name
 * @type text
 * @desc The name of the sorting option to be displayed in game
 *
 * @param Use
 * @type boolean
 * @on Yes
 * @off No
 * @desc Determines whether the sorting options is available in game
 */

 /*~struct~ParamSortOption:
  * @param Name
  * @type text
  * @desc The name of the sorting option to be displayed in game
  * 
  * @param Params
  * @type number[]
  * @desc The different parameters included in this sorting option
  * 
  * @param Use
  * @type boolean
  * @on Yes
  * @off No
  * @desc Determines whether the sorting options is available in game
  */

/*~struct~CustomSortOption:
 * @param Name
 * @type text
 * @desc The name of the sorting option to be displayed in game
 *
 * @param Use
 * @type boolean
 * @on Yes
 * @off No
 * @desc Determines whether the sorting options is available in game
 * 
 * @param Function
 * @type text
 * @desc Name of javascript function to be called by the sort if
 * option is active, e.g. CustomSortFunction(a,b);
 */

/*~struct~ItemSorting:
 * @param Default
 * @type struct<SortOption>
 * 
 * @param Lexicographically
 * @type struct<SortOption>
 * 
 * @param ByPrice
 * @text By Price
 * @type struct<SortOption>
 * 
 * @param ByPossession
 * @text By amount in possession
 * @type struct<SortOption>
 * 
 * @param Custom
 * @type struct<CustomSortOption>[]
 * @desc Define your custom sorting options here using javascript function calls.
 * 
 * @param DefaultSortMethod
 * @text Default Sort Method
 * @type number
 * @desc Index of the default method: 0 for default, 1 for lexicographically and so on
 * The use flag of this method must be set to true.
 * 
 * @param Descending
 * @type boolean
 * @on Descending
 * @off Ascending
 * @desc Determines whether items should be sorted descending
 */

/*~struct~SkillSorting:
 * @param Default
 * @type struct<SortOption>
 * 
 * @param Lexicographically
 * @type struct<SortOption>
 * 
 * @param ByElement
 * @text By element
 * @type struct<SortOption>
 * 
 * @param ByMpCost
 * @text By mp cost
 * @type struct<SortOption>
 * 
 * @param ByTpCost
 * @text By tp cost
 * @type struct<SortOption>
 * 
 * @param Custom
 * @type struct<CustomSortOption>[]
 * @desc Define your custom sorting options here using javascript function calls.
 * 
 * @param DefaultSortMethod
 * @text Default Sort Method
 * @type number
 * @desc Index of the default method: 0 for default, 1 for lexicographically and so on
 * The use flag of this method must be set to true.
 * 
 * @param Descending
 * @type boolean
 * @on Descending
 * @off Ascending
 * @desc Determines whether items should be sorted descending
 */

/*~struct~GoodsSorting:
 * @param Default
 * @type struct<SortOption>
 * 
 * @param Lexicographically
 * @type struct<SortOption>
 * 
 * @param ByPrice
 * @text By price
 * @type struct<SortOption>
 * 
 * @param ByType
 * @text By type
 * @type struct<SortOption>
 * 
 * @param Custom
 * @type struct<CustomSortOption>[]
 * @desc Define your custom sorting options here using javascript function calls.
 * 
 * @param DefaultSortMethod
 * @text Default Sort Method
 * @type number
 * @desc Index of the default method: 0 for default, 1 for lexicographically and so on
 * The use flag of this method must be set to true.
 * 
 * @param Descending
 * @type boolean
 * @on Descending
 * @off Ascending
 * @desc Determines whether items should be sorted descending
 */

/*~struct~EquipmentSorting:
 * @param Default
 * @type struct<SortOption>
 * 
 * @param Lexicographically
 * @type struct<SortOption>
 * 
 * @param ByType
 * @text By type
 * @type struct<SortOption>
 * 
 * @param NrOfTraits
 * @type struct<SortOption>
 * 
 * @param ByPossession
 * @text By amount in possession
 * @type struct<SortOption>
 * 
 * @param ByEquipmentType
 * @text By equipment type
 * @type struct<SortOption>
 * 
 * @param Parameters
 * @type struct<ParamSortOption>
 * 
 * @param Custom
 * @type struct<CustomSortOption>[]
 * @desc Define your custom sorting options here using javascript function calls.
 * 
 * @param DefaultSortMethod
 * @text Default Sort Method
 * @type number
 * @desc Index of the default method: 0 for default, 1 for lexicographically and so on
 * The use flag of this method must be set to true.
 * 
 * @param Descending
 * @type boolean
 * @on Descending
 * @off Ascending
 * @desc Determines whether items should be sorted descending
 */

//=============================================================================
/*:
 * @plugindesc v1.2 Integrates sort options for items, weapons, armor, skills and shop goods
 *             into your game.
 * @author BurningOrca
 * 
 * @param Items
 * @type struct<ItemSorting>
 * @desc Different Options for item window sorting
 * Affects Items, Key Items
 * @default {"Default":"{\"Name\":\"Unsorted\",\"Use\":\"true\"}","Lexicographically":"{\"Name\":\"By name\",\"Use\":\"true\"}","ByPrice":"{\"Name\":\"By price\",\"Use\":\"true\"}","ByPossession":"{\"Name\":\"By amount\",\"Use\":\"true\"}","Custom":"[\"{\\\"Name\\\":\\\"By amount and name\\\",\\\"Use\\\":\\\"true\\\",\\\"Function\\\":\\\"BurningOrca.SortingOptions.SortByAmountAndName(a,b);\\\"}\"]","DefaultSortMethod":"0","Descending":"false"}
 * 
 * @param Weapons
 * @type struct<EquipmentSorting>
 * @desc Different Options for item window sorting of weapons
 * @default {"Default":"{\"Name\":\"Unsorted\",\"Use\":\"true\"}","Lexicographically":"{\"Name\":\"By name\",\"Use\":\"true\"}","ByType":"{\"Name\":\"By type\",\"Use\":\"true\"}","NrOfTraits":"{\"Name\":\"By # traits\",\"Use\":\"true\"}","ByPossession":"{\"Name\":\"By amount\",\"Use\":\"true\"}","ByEquipmentType":"{\"Name\":\"By equipment type\",\"Use\":\"true\"}","Parameters":"{\"Name\":\"By %1\",\"Params\":\"[\\\"1\\\",\\\"2\\\",\\\"4\\\",\\\"6\\\",\\\"7\\\"]\",\"Use\":\"true\"}","Custom":"[\"{\\\"Name\\\":\\\"By amount and name\\\",\\\"Use\\\":\\\"true\\\",\\\"Function\\\":\\\"BurningOrca.SortingOptions.SortByAmountAndName(a,b);\\\"}\"]","DefaultSortMethod":"0","Descending":"false"}
 * 
 * @param Armor
 * @type struct<EquipmentSorting>
 * @desc Different Options for item window sorting of armor
 * @default {"Default":"{\"Name\":\"Unsorted\",\"Use\":\"true\"}","Lexicographically":"{\"Name\":\"By name\",\"Use\":\"true\"}","ByType":"{\"Name\":\"By type\",\"Use\":\"true\"}","NrOfTraits":"{\"Name\":\"By # traits\",\"Use\":\"true\"}","ByPossession":"{\"Name\":\"By amount\",\"Use\":\"true\"}","ByEquipmentType":"{\"Name\":\"By equipment type\",\"Use\":\"true\"}","Parameters":"{\"Name\":\"By %1\",\"Params\":\"[\\\"0\\\",\\\"1\\\",\\\"3\\\",\\\"5\\\",\\\"6\\\",\\\"7\\\"]\",\"Use\":\"true\"}","Custom":"[\"{\\\"Name\\\":\\\"By amount and name\\\",\\\"Use\\\":\\\"true\\\",\\\"Function\\\":\\\"BurningOrca.SortingOptions.SortByAmountAndName(a,b);\\\"}\"]","DefaultSortMethod":"0","Descending":"false"}
 * 
 * @param Skills
 * @type struct<SkillSorting>
 * @desc Different Options for skill window sorting
 * @default {"Default":"{\"Name\":\"Unsorted\",\"Use\":\"true\"}","Lexicographically":"{\"Name\":\"By name\",\"Use\":\"true\"}","ByElement":"{\"Name\":\"By element\",\"Use\":\"true\"}","ByMpCost":"{\"Name\":\"By MP cost\",\"Use\":\"true\"}","ByTpCost":"{\"Name\":\"By TP cost\",\"Use\":\"true\"}","Custom":"[\"{\\\"Name\\\":\\\"By element, cost and name\\\",\\\"Use\\\":\\\"true\\\",\\\"Function\\\":\\\"BurningOrca.SortingOptions.SortByElementCostAndName(a,b);\\\"}\"]","DefaultSortMethod":"0","Descending":"false"}
 * 
 * @param Goods
 * @type struct<GoodsSorting>
 * @desc Different Options for shop buy window sorting
 * @default {"Default":"{\"Name\":\"Unsorted\",\"Use\":\"true\"}","Lexicographically":"{\"Name\":\"By name\",\"Use\":\"true\"}","ByPrice":"{\"Name\":\"By price\",\"Use\":\"true\"}","ByType":"{\"Name\":\"By type\",\"Use\":\"true\"}","Custom":"[\"{\\\"Name\\\":\\\"By type, price and name\\\",\\\"Use\\\":\\\"true\\\",\\\"Function\\\":\\\"BurningOrca.SortingOptions.SortByTypePriceAndName(a,b);\\\"}\"]","DefaultSortMethod":"0","Descending":"false"}
 * 
 * @param Sorting Rules Text
 * @type text
 * @desc The text for the new sorting rules option
 * @default Sorting Rules
 * 
 * @param Sorting Rules Help Text
 * @type text
 * @desc The text displayed in the help window for the sorting rules
 * @default Change default sorting rules for %1.
 * 
 * @param Goods Text
 * @type text
 * @desc The text that should be displayed in the sorting rules options for goods
 * @default Goods
 * 
 * @param Ascending Text
 * @type text
 * @desc The text that should be displayed in the sorting rules options for ascending order
 * @default Ascending
 * 
 * @param Descending Text
 * @type text
 * @desc The text that should be displayed in the sorting rules options for descending order
 * @default Descending
 * 
 * @param Sort Text
 * @type text
 * @desc The text to be shown for the sort command in the sort info window
 * @default Sort
 * 
 * @param Sorting Method Command
 * @type text
 * @desc The text that should be displayed for the sorting method command in the sorting rules options
 * @default Sorting Method
 * 
 * @param Sort Order Command
 * @type text
 * @desc The text that should be displayed for the sorting order command in the sorting rules options
 * @default Sort Order
 * 
 * @param Sort Key
 * @type select
 * @option A
 * @value 65
 * @option B
 * @value 66
 * @option C
 * @value 67
 * @option D
 * @value 68
 * @option E
 * @value 69
 * @option F
 * @value 70
 * @option G
 * @value 71
 * @option H
 * @value 72
 * @option I
 * @value 73
 * @option J
 * @value 74
 * @option K
 * @value 75
 * @option L
 * @value 76
 * @option M
 * @value 77
 * @option N
 * @value 78
 * @option O
 * @value 79
 * @option P
 * @value 80
 * @option Q
 * @value 81
 * @option R
 * @value 82
 * @option S
 * @value 83
 * @option T
 * @value 84
 * @option U
 * @value 85
 * @option V
 * @value 86
 * @option W
 * @value 87
 * @option X
 * @value 88
 * @option Y
 * @value 89
 * @option Z
 * @value 90
 * @default 83
 * @desc Defines the key which will be used for sorting on different windows
 * 
 * @param Sort Order Key
 * @type select
 * @option A
 * @value 65
 * @option B
 * @value 66
 * @option C
 * @value 67
 * @option D
 * @value 68
 * @option E
 * @value 69
 * @option F
 * @value 70
 * @option G
 * @value 71
 * @option H
 * @value 72
 * @option I
 * @value 73
 * @option J
 * @value 74
 * @option K
 * @value 75
 * @option L
 * @value 76
 * @option M
 * @value 77
 * @option N
 * @value 78
 * @option O
 * @value 79
 * @option P
 * @value 80
 * @option Q
 * @value 81
 * @option R
 * @value 82
 * @option S
 * @value 83
 * @option T
 * @value 84
 * @option U
 * @value 85
 * @option V
 * @value 86
 * @option W
 * @value 87
 * @option X
 * @value 88
 * @option Y
 * @value 89
 * @option Z
 * @value 90
 * @default 79
 * @desc Defines the key which will be used for toggling the sort order on different windows
 * 
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * Many RPGs offer the player at least 2 different sort options for different types
 * of lists (e.g. skills, items, etc.).
 * This plugin provides you a opportunity to implement multiple sort methods into
 * your game.
 * 
 * ============================================================================
 * Plugin Parameters
 * ============================================================================
 * The first 5 plugin parameters are all structs that define the various sorting rules:
 * 
 * Items: Sorting Rules for items include
 *        - Default:             Unsorted (by database id)
 *        - Lexicographically:   Sorted by name
 *        - By Price             At least useful in shop sell window, I guess
 *        - ByPossession         By the amount the party currently has in the inventory
 *        - Custom               Here you can define custom rules via javascript
 *        
 *   These sorting rules are all structs themselves and offer the following options:
 *           * Name: The name which will be displayed in the options menu
 *           * Use:  Define whether this option is available in your game
 *           
 *   The Custom option is array of such structs that offers a third option:
 *           * Function: Type in a function name of javascript function to be called upon sort
 *                       It has to have the following syntax: FunctionName(a, b);
 *           
 *   The following plugin parameters only offer the defaults for your game once
 *   it has been started with the plugin active. They are copied to your config.rpgsave file
 *   and are stored globally with your game. Any later adjustments won't be synchronized with your game:
 *   
 *   - Default Sort Method: The above mentioned plugin parameters will be converted into an array
 *                          by this plugin. This is the index in the array which defines the
 *                          default sorting method, e.g.
 *                          
 *                          0: Default
 *                          1: Lexicographically
 *                          2: By Price
 *                          3: By Possession
 *                          4: Custom 1
 *                          5: Custom 2
 *                          ...
 *                          
 *   - Descending: Determines the default sort order for the items.
 *   
 * Weapons, Armor: Sorting Rules for equipment include
 *        - Default:             Unsorted (by database id)
 *        - Lexicographically:   Sorted by name
 *        - By Type              Sorted by weapon type or armor type
 *        - NrOfTraits           Sorted by # traits set for the equipment in the database
 *        - ByPossession         By the amount the party currently has in the inventory
 *        - ByEquipmentType      Weapons always have equipment type 1 unless changed by any plugin.
 *                               There this is also provided for weapons.
 *        - Parameters           Here you can adjust by which stats the equipment can be sorted
 *        - Custom               Here you can define custom rules via javascript
 *        
 *        Parameters:
 *        Additionally to the name and use option this defines another option Params, which is an array of numbers.
 *        The numbers correspond to the following stats:
 *                    0 - MaxHP
 *                    1 - MaxMP
 *                    2 - Attack
 *                    3 - Defense
 *                    4 - Magic Attack
 *                    5 - Magic Defense
 *                    6 - Agility
 *                    7 - Luck
 *        Please do not input any invalid numbers here. The plugin won't handle them correctly and may not work at all
 *        if you do so.
 *        Please do not change this if you already have a global configuration with a sort method index that is within
 *        the Parameters or Custom section saved with your game.
 *        
 *        Default Sort Method and Descending are the same as for Items.
 *        
 *  Skills: Sorting Rules for skills include
 *        - Default:             Unsorted (by database id)
 *        - Lexicographically:   Sorted by name
 *        - ByElement            Uses the skills element id to sort the skills
 *        - ByMpCost             By amount of MP the skills consumes
 *        - ByTpCost             By amount of TP the skills consumes
 *        - ByType               By it's type category, e.g. physical, special, healing
 *        - Custom
 *        
 *        Default Sort Method and Descending are the same as for Items.
 *        
 *  Goods: Sorting Rules for shop goods include
 *       - Default              Unsorted (by order to add them to the shop)
 *       - Lexicographically    Sorted by name
 *       - By Price             Sorted by buying price (includes database price and
 *                              custom prizes set in the shop processing event).
 *       - By Type              Sorts the goods by type (Item, Weapon, Armor)
 *       - Custom
 *       
 *       Default Sort Method and Descending are the same as for Items.
 *       
 *  The next plugin parameters defines various texts to be shown in games option menu:
 *
 *    - Sorting Rules Help Text: The text to be shown in help window for the sorting rule options
 *    - Goods Text:              The text to be shown for the goods option in sorting rule options
 *    - Ascending Text:          The text to be shown for ascending sort order
 *    - Descending Text:         The text to be shown for descending sort order
 *    - Sorting Method Command : The text for the sort method option in the sorting rule options
 *    - Sort Order Command:      The text for the sort order option in the sorting rule options
 *    - Sort Text:               The text to be shown in sort info window for the sort command
 *    
 * =============================================================================================
 * The new options
 * =============================================================================================
 * This plugins adds a new command to your options menu, which opens a new scene where you
 * can define the default sorting rules applied to the windows.
 * 
 * If these options are ajdusted from the title screen the options will be save globally within
 * your config.rpgsave file and will affect newly created save files.
 * 
 * if these options are adjusted within your game they will only affect the current save file.
 * ==============================================================================================
 * 
 * Version 1.2: Fixed a bug, that the use flag actually didn't work in the appropriate windows.
 * It only worked in the options.
 */
if (Utils.RPGMAKER_VERSION && Utils.RPGMAKER_VERSION >= "1.5.0") {

// Plugin Parameters
BurningOrca.SortingOptions.Parameters = PluginManager.parameters('BO_SortingOptions');
BurningOrca.SortingOptions.Param = BurningOrca.SortingOptions.Param || {}

BurningOrca.SortingOptions.Param.SortingRulesText = String(BurningOrca.SortingOptions.Parameters['Sorting Rules Text']);
BurningOrca.SortingOptions.Param.SortingRulesHelpText = String(BurningOrca.SortingOptions.Parameters['Sorting Rules Help Text']);
BurningOrca.SortingOptions.Param.GoodsText = String(BurningOrca.SortingOptions.Parameters['Goods Text']);
BurningOrca.SortingOptions.Param.AscendingText = String(BurningOrca.SortingOptions.Parameters['Ascending Text']);
BurningOrca.SortingOptions.Param.DescendingText = String(BurningOrca.SortingOptions.Parameters['Descending Text']);
BurningOrca.SortingOptions.Param.SortingMethodCommand = String(BurningOrca.SortingOptions.Parameters['Sorting Method Command']);
BurningOrca.SortingOptions.Param.SortOrderCommand = String(BurningOrca.SortingOptions.Parameters['Sort Order Command']);
BurningOrca.SortingOptions.Param.SortText = String(BurningOrca.SortingOptions.Parameters['Sort Text']);
BurningOrca.SortingOptions.Param.SortKey = String(BurningOrca.SortingOptions.Parameters['Sort Key']);
BurningOrca.SortingOptions.Param.SortOrderKey = String(BurningOrca.SortingOptions.Parameters['Sort Order Key']);

// -------------------------------------------------------------------------------------------
// Items
// -------------------------------------------------------------------------------------------
BurningOrca.SortingOptions.Param.Items = BurningOrca.SortingOptions.Parameters['Items'];
BurningOrca.SortingOptions.Param.Items = JSON.parse(BurningOrca.SortingOptions.Param.Items);

BurningOrca.SortingOptions.Items = {};
BurningOrca.SortingOptions.Items.Default = JSON.parse(BurningOrca.SortingOptions.Param.Items.Default);
BurningOrca.SortingOptions.Items.Lexicographically = JSON.parse(BurningOrca.SortingOptions.Param.Items.Lexicographically);
BurningOrca.SortingOptions.Items.ByPrice = JSON.parse(BurningOrca.SortingOptions.Param.Items.ByPrice);
BurningOrca.SortingOptions.Items.ByPossession = JSON.parse(BurningOrca.SortingOptions.Param.Items.ByPossession);
BurningOrca.SortingOptions.Items.Descending = eval(BurningOrca.SortingOptions.Param.Items.Descending);
BurningOrca.SortingOptions.Items.DefaultSortMethod = Number(BurningOrca.SortingOptions.Param.Items.DefaultSortMethod);
BurningOrca.SortingOptions.Items.Custom = [];
    
JSON.parse(BurningOrca.SortingOptions.Param.Items.Custom).forEach(function(jsonDataObj) 
{
   BurningOrca.SortingOptions.Items.Custom.push(JSON.parse(jsonDataObj));
});

// -------------------------------------------------------------------------------------------
// Weapons
// -------------------------------------------------------------------------------------------
BurningOrca.SortingOptions.Param.Weapons = BurningOrca.SortingOptions.Parameters['Weapons'];
BurningOrca.SortingOptions.Param.Weapons = JSON.parse(BurningOrca.SortingOptions.Param.Weapons);
BurningOrca.SortingOptions.Param.Weapons.Parameters = JSON.parse(BurningOrca.SortingOptions.Param.Weapons.Parameters)

BurningOrca.SortingOptions.Weapons = {};
BurningOrca.SortingOptions.Weapons.Default = JSON.parse(BurningOrca.SortingOptions.Param.Weapons.Default);
BurningOrca.SortingOptions.Weapons.Lexicographically = JSON.parse(BurningOrca.SortingOptions.Param.Weapons.Lexicographically);
BurningOrca.SortingOptions.Weapons.ByType = JSON.parse(BurningOrca.SortingOptions.Param.Weapons.ByType);
BurningOrca.SortingOptions.Weapons.NrOfTraits = JSON.parse(BurningOrca.SortingOptions.Param.Weapons.NrOfTraits);
BurningOrca.SortingOptions.Weapons.ByPossession = JSON.parse(BurningOrca.SortingOptions.Param.Weapons.ByPossession);
BurningOrca.SortingOptions.Weapons.ByEquipmentType = JSON.parse(BurningOrca.SortingOptions.Param.Weapons.ByEquipmentType);

BurningOrca.SortingOptions.Weapons.Params = {};
BurningOrca.SortingOptions.Weapons.Params.Name        =  BurningOrca.SortingOptions.Param.Weapons.Parameters.Name;
BurningOrca.SortingOptions.Weapons.Params.ActorParams =  JSON.parse(BurningOrca.SortingOptions.Param.Weapons.Parameters.Params);
BurningOrca.SortingOptions.Weapons.Params.Use =  BurningOrca.SortingOptions.Param.Weapons.Parameters.Use;

BurningOrca.SortingOptions.Weapons.Descending = eval(BurningOrca.SortingOptions.Param.Items.Descending);
BurningOrca.SortingOptions.Weapons.DefaultSortMethod = Number(BurningOrca.SortingOptions.Param.Items.DefaultSortMethod);
BurningOrca.SortingOptions.Weapons.Custom = [];
    
JSON.parse(BurningOrca.SortingOptions.Param.Weapons.Custom).forEach(function(jsonDataObj) 
{
   BurningOrca.SortingOptions.Weapons.Custom.push(JSON.parse(jsonDataObj));
});

// -------------------------------------------------------------------------------------------
// Armor
// -------------------------------------------------------------------------------------------
BurningOrca.SortingOptions.Param.Armor = BurningOrca.SortingOptions.Parameters['Armor'];
BurningOrca.SortingOptions.Param.Armor = JSON.parse(BurningOrca.SortingOptions.Param.Armor);
BurningOrca.SortingOptions.Param.Armor.Parameters = JSON.parse(BurningOrca.SortingOptions.Param.Armor.Parameters)

BurningOrca.SortingOptions.Armor = {};
BurningOrca.SortingOptions.Armor.Default = JSON.parse(BurningOrca.SortingOptions.Param.Armor.Default);
BurningOrca.SortingOptions.Armor.Lexicographically = JSON.parse(BurningOrca.SortingOptions.Param.Armor.Lexicographically);
BurningOrca.SortingOptions.Armor.ByType = JSON.parse(BurningOrca.SortingOptions.Param.Armor.ByType);
BurningOrca.SortingOptions.Armor.NrOfTraits = JSON.parse(BurningOrca.SortingOptions.Param.Armor.NrOfTraits);
BurningOrca.SortingOptions.Armor.ByPossession = JSON.parse(BurningOrca.SortingOptions.Param.Armor.ByPossession);
BurningOrca.SortingOptions.Armor.ByEquipmentType = JSON.parse(BurningOrca.SortingOptions.Param.Armor.ByEquipmentType);

BurningOrca.SortingOptions.Armor.Params = {};
BurningOrca.SortingOptions.Armor.Params.Name        =  BurningOrca.SortingOptions.Param.Armor.Parameters.Name;
BurningOrca.SortingOptions.Armor.Params.ActorParams =  JSON.parse(BurningOrca.SortingOptions.Param.Armor.Parameters.Params);
BurningOrca.SortingOptions.Armor.Params.Use =  BurningOrca.SortingOptions.Param.Armor.Parameters.Use;

BurningOrca.SortingOptions.Armor.Descending = eval(BurningOrca.SortingOptions.Param.Items.Descending);
BurningOrca.SortingOptions.Armor.DefaultSortMethod = Number(BurningOrca.SortingOptions.Param.Items.DefaultSortMethod);
BurningOrca.SortingOptions.Armor.Custom = [];
    
JSON.parse(BurningOrca.SortingOptions.Param.Armor.Custom).forEach(function(jsonDataObj) 
{
   BurningOrca.SortingOptions.Armor.Custom.push(JSON.parse(jsonDataObj));
});

// -------------------------------------------------------------------------------------------
// Skills
// -------------------------------------------------------------------------------------------
BurningOrca.SortingOptions.Param.Skills = BurningOrca.SortingOptions.Parameters['Skills'];
BurningOrca.SortingOptions.Param.Skills = JSON.parse(BurningOrca.SortingOptions.Param.Skills);

BurningOrca.SortingOptions.Skills = {};
BurningOrca.SortingOptions.Skills.Default = JSON.parse(BurningOrca.SortingOptions.Param.Skills.Default);
BurningOrca.SortingOptions.Skills.Lexicographically = JSON.parse(BurningOrca.SortingOptions.Param.Skills.Lexicographically);
BurningOrca.SortingOptions.Skills.ByElement = JSON.parse(BurningOrca.SortingOptions.Param.Skills.ByElement);
BurningOrca.SortingOptions.Skills.ByMpCost = JSON.parse(BurningOrca.SortingOptions.Param.Skills.ByMpCost);
BurningOrca.SortingOptions.Skills.ByTpCost = JSON.parse(BurningOrca.SortingOptions.Param.Skills.ByTpCost);
BurningOrca.SortingOptions.Skills.Descending = eval(BurningOrca.SortingOptions.Param.Skills.Descending);
BurningOrca.SortingOptions.Skills.DefaultSortMethod = Number(BurningOrca.SortingOptions.Param.Skills.DefaultSortMethod);
BurningOrca.SortingOptions.Skills.Custom = [];

JSON.parse(BurningOrca.SortingOptions.Param.Skills.Custom).forEach(function(jsonDataObj) 
{
   BurningOrca.SortingOptions.Skills.Custom.push(JSON.parse(jsonDataObj));
});

// -------------------------------------------------------------------------------------------
// Shop Goods
// -------------------------------------------------------------------------------------------
BurningOrca.SortingOptions.Param.Goods = BurningOrca.SortingOptions.Parameters['Goods'];
BurningOrca.SortingOptions.Param.Goods = JSON.parse(BurningOrca.SortingOptions.Param.Goods);

BurningOrca.SortingOptions.Goods = {};
BurningOrca.SortingOptions.Goods.Default = JSON.parse(BurningOrca.SortingOptions.Param.Goods.Default);
BurningOrca.SortingOptions.Goods.Lexicographically = JSON.parse(BurningOrca.SortingOptions.Param.Goods.Lexicographically);
BurningOrca.SortingOptions.Goods.ByPrice = JSON.parse(BurningOrca.SortingOptions.Param.Goods.ByPrice);
BurningOrca.SortingOptions.Goods.ByType = JSON.parse(BurningOrca.SortingOptions.Param.Goods.ByType);
BurningOrca.SortingOptions.Goods.Descending = eval(BurningOrca.SortingOptions.Param.Goods.Descending);
BurningOrca.SortingOptions.Goods.DefaultSortMethod = Number(BurningOrca.SortingOptions.Param.Goods.DefaultSortMethod);
BurningOrca.SortingOptions.Goods.Custom = [];

BurningOrca.SortingOptions.UseLocalConfig = false;

JSON.parse(BurningOrca.SortingOptions.Param.Goods.Custom).forEach(function(jsonDataObj) 
{
   BurningOrca.SortingOptions.Goods.Custom.push(JSON.parse(jsonDataObj));
});

$gameSortOptions = null;

// Global Utility Functions
BurningOrca.SortingOptions.GetAllSortMethods = function(type) {
    var sortOrders = [];

    if( type === 'Item' ) 
    {
        sortOrders.push(BurningOrca.SortingOptions.Items.Default);
        sortOrders.push(BurningOrca.SortingOptions.Items.Lexicographically);
        sortOrders.push(BurningOrca.SortingOptions.Items.ByPrice);
        sortOrders.push(BurningOrca.SortingOptions.Items.ByPossession);
        for( var i = 0; i < BurningOrca.SortingOptions.Items.Custom.length; i++ )
        {
            sortOrders.push(BurningOrca.SortingOptions.Items.Custom[i]);
        }
    }
    else if( type === 'Weapon' ) 
    {
        sortOrders.push(BurningOrca.SortingOptions.Weapons.Default);
        sortOrders.push(BurningOrca.SortingOptions.Weapons.Lexicographically);
        sortOrders.push(BurningOrca.SortingOptions.Weapons.ByType);
        sortOrders.push(BurningOrca.SortingOptions.Weapons.NrOfTraits);
        sortOrders.push(BurningOrca.SortingOptions.Weapons.ByPossession);
        sortOrders.push(BurningOrca.SortingOptions.Weapons.ByEquipmentType);
        for( var i = 0; i < BurningOrca.SortingOptions.Weapons.Params.ActorParams.length; i++ )
        {
            var paramSort = {};
            paramSort.Name = BurningOrca.SortingOptions.Weapons.Params.Name.format(TextManager.param(BurningOrca.SortingOptions.Weapons.Params.ActorParams[i]));
            paramSort.Use = BurningOrca.SortingOptions.Weapons.Params.Use;
            sortOrders.push(paramSort);
        }
        for( var i = 0; i < BurningOrca.SortingOptions.Weapons.Custom.length; i++ )
        {
            sortOrders.push(BurningOrca.SortingOptions.Weapons.Custom[i]);
        }
    }
    else if( type === 'Armor' ) 
    {
        sortOrders.push(BurningOrca.SortingOptions.Armor.Default);
        sortOrders.push(BurningOrca.SortingOptions.Armor.Lexicographically);
        sortOrders.push(BurningOrca.SortingOptions.Weapons.ByType);
        sortOrders.push(BurningOrca.SortingOptions.Armor.NrOfTraits);
        sortOrders.push(BurningOrca.SortingOptions.Armor.ByPossession);
        sortOrders.push(BurningOrca.SortingOptions.Armor.ByEquipmentType);
        for( var i = 0; i < BurningOrca.SortingOptions.Armor.Params.ActorParams.length; i++ )
        {
            var paramSort = {};
            paramSort.Name = BurningOrca.SortingOptions.Armor.Params.Name.format(TextManager.param(BurningOrca.SortingOptions.Armor.Params.ActorParams[i]));
            paramSort.Use = BurningOrca.SortingOptions.Armor.Params.Use;
            sortOrders.push(paramSort);
        }
        for( var i = 0; i < BurningOrca.SortingOptions.Armor.Custom.length; i++ )
        {
            sortOrders.push(BurningOrca.SortingOptions.Armor.Custom[i]);
        }
    }
    else if( type === 'Skill' ) 
    {
        sortOrders.push(BurningOrca.SortingOptions.Skills.Default);
        sortOrders.push(BurningOrca.SortingOptions.Skills.Lexicographically);
        sortOrders.push(BurningOrca.SortingOptions.Skills.ByElement);
        sortOrders.push(BurningOrca.SortingOptions.Skills.ByMpCost);
        sortOrders.push(BurningOrca.SortingOptions.Skills.ByTpCost);
        for( var i = 0; i < BurningOrca.SortingOptions.Skills.Custom.length; i++ )
        {
            sortOrders.push(BurningOrca.SortingOptions.Skills.Custom[i]);
        }
    }
    else if( type === 'Goods' ) 
    {
        sortOrders.push(BurningOrca.SortingOptions.Goods.Default);
        sortOrders.push(BurningOrca.SortingOptions.Goods.Lexicographically);
        sortOrders.push(BurningOrca.SortingOptions.Goods.ByPrice);
        sortOrders.push(BurningOrca.SortingOptions.Goods.ByType);
        for( var i = 0; i < BurningOrca.SortingOptions.Skills.Custom.length; i++ )
        {
            sortOrders.push(BurningOrca.SortingOptions.Skills.Custom[i]);
        }
    }
    return sortOrders;
}

BurningOrca.SortingOptions.AllItemSortMethods = BurningOrca.SortingOptions.AllItemSortMethods || [];
BurningOrca.SortingOptions.AllWeaponSortMethods = BurningOrca.SortingOptions.AllWeaponSortMethods || [];
BurningOrca.SortingOptions.AllArmorSortMethods = BurningOrca.SortingOptions.AllArmorSortMethods || [];
BurningOrca.SortingOptions.AllSkillSortMethods = BurningOrca.SortingOptions.AllSkillSortMethods || [];
BurningOrca.SortingOptions.AllGoodsSortMethods = BurningOrca.SortingOptions.AllGoodsSortMethods || [];

BurningOrca.SortingOptions.GetFunctionArray = function(type) {
    if( type === 'Item' )
        return BurningOrca.SortingOptions.AllItemSortMethods;
    else if( type === 'Weapon' )
        return BurningOrca.SortingOptions.AllWeaponSortMethods;
    else if( type === 'Armor' )
        return BurningOrca.SortingOptions.AllArmorSortMethods;
    else if( type === 'Skill' )
        return BurningOrca.SortingOptions.AllSkillSortMethods;
    else if( type === 'Goods' )
        return BurningOrca.SortingOptions.AllGoodsSortMethods;
    else
        throw new Error("BurningOrca.SortingOptions: Type of sortable object not defined!");
}

BurningOrca.SortingOptions.GetDefaultSortMethod = function(type) {
    var sortMethods = BurningOrca.SortingOptions.GetFunctionArray(type);
    var i;

    if( type === 'Item' )
        i = BurningOrca.SortingOptions.Items.DefaultSortMethod;
    else if( type === 'Weapon' )
        return BurningOrca.SortingOptions.Weapons.DefaultSortMethod;
    else if( type === 'Armor' )
        return BurningOrca.SortingOptions.Armor.DefaultSortMethod;
    else if( type === 'Skill' )
        i = BurningOrca.SortingOptions.Skills.DefaultSortMethod;
    else if( type === 'Goods' )
        i = BurningOrca.SortingOptions.Goods.DefaultSortMethod;
    else
        throw new Error("BurningOrca.SortingOptions: Type of sortable object not defined!");

    if( i >= sortMethods.length || !eval(sortMethods[i].Use) )
       throw new Error("BurningOrca.SortingOptions: Either the default sort method is not defined, or it's use flag is set to false");

    return i;
}

BurningOrca.SortingOptions.GetSortConfig = function(name) {
    if( $gameSortOptions ) 
    {
        return $gameSortOptions[name];
    }
    else 
    {
        return ConfigManager[name];
    }
}

BurningOrca.SortingOptions.SetSortConfig = function(name, value) {
    if( $gameSortOptions ) 
    {
        $gameSortOptions[name] = value;
    }
    else 
    {
        ConfigManager[name] = value;
    }
}

BurningOrca.SortingOptions.GetDefaultSortOrder = function(type) {
    if( type === 'Item' )
        return BurningOrca.SortingOptions.Items.Descending ? 1 : 0;
    else if( type === 'Weapon' )
        return BurningOrca.SortingOptions.Weapons.Descending ? 1 : 0;
    else if( type === 'Armor' )
        return BurningOrca.SortingOptions.Armor.Descending ? 1 : 0;
    else if( type === 'Skill' )
        return BurningOrca.SortingOptions.Skills.Descending ? 1 : 0;
    else if( type === 'Goods' )
        return BurningOrca.SortingOptions.Goods.Descending ? 1 : 0;
    else
        throw new Error("BurningOrca.SortingOptions: Type of sortable object not defined!");
}

/////////////////////////////////////////////////////////////////////////////////////
// Scene_Title
/////////////////////////////////////////////////////////////////////////////////////
BurningOrca.SortingOptions.Scene_Title_commandOptions = Scene_Title.prototype.commandOptions;
Scene_Title.prototype.commandOptions = function() {
    BurningOrca.SortingOptions.UseLocalConfig = false;
    BurningOrca.SortingOptions.Scene_Title_commandOptions.call(this);
};

/////////////////////////////////////////////////////////////////////////////////////
// Scene_Menu
/////////////////////////////////////////////////////////////////////////////////////
BurningOrca.SortingOptions.Scene_Menu_commandOptions = Scene_Menu.prototype.commandOptions;
Scene_Menu.prototype.commandOptions = function() {
    BurningOrca.SortingOptions.UseLocalConfig = ($gameSortOptions !== null);
    BurningOrca.SortingOptions.Scene_Menu_commandOptions.call(this);
};

/////////////////////////////////////////////////////////////////////////////////////
// ConfigManager
/////////////////////////////////////////////////////////////////////////////////////
ConfigManager.ItemSortMethod   = -1;
ConfigManager.ItemSortOrder    = BurningOrca.SortingOptions.GetDefaultSortOrder('Item');
ConfigManager.WeaponSortMethod = -1;
ConfigManager.WeaponSortOrder  = BurningOrca.SortingOptions.GetDefaultSortOrder('Weapon');
ConfigManager.ArmorSortMethod  = -1;
ConfigManager.ArmorSortOrder   = BurningOrca.SortingOptions.GetDefaultSortOrder('Armor');
ConfigManager.SkillSortMethod  = -1;
ConfigManager.SkillSortOrder   = BurningOrca.SortingOptions.GetDefaultSortOrder('Skill');
ConfigManager.GoodsSortMethod  = -1;
ConfigManager.GoodsSortOrder   = BurningOrca.SortingOptions.GetDefaultSortOrder('Goods');

BurningOrca.SortingOptions.ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
  var config = BurningOrca.SortingOptions.ConfigManager_makeData.call(this);
  config.ItemSortMethod = this.ItemSortMethod;
  config.ItemSortOrder  = this.ItemSortOrder;
  config.WeaponSortMethod = this.WeaponSortMethod;
  config.WeaponSortOrder  = this.WeaponSortOrder;
  config.ArmorSortMethod = this.ArmorSortMethod;
  config.ArmorSortOrder  = this.ArmorSortOrder;
  config.SkillSortMethod = this.SkillSortMethod;
  config.SkillSortOrder  = this.SkillSortOrder;
  config.GoodsSortMethod = this.GoodsSortMethod;
  config.GoodsSortOrder = this.GoodsSortOrder;
  return config;
};

BurningOrca.SortingOptions.ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
  BurningOrca.SortingOptions.ConfigManager_applyData.call(this, config);
  if( config['ItemSortMethod'] !== undefined) {
     this.ItemSortMethod = config.ItemSortMethod;
  }
  if( config['WeaponSortMethod'] !== undefined) {
     this.WeaponSortMethod = config.WeaponSortMethod;
  }
  if( config['ArmorSortMethod'] !== undefined) {
     this.ArmorSortMethod = config.ArmorSortMethod;
  }
  if( config['SkillSortMethod'] !== undefined) {
     this.SkillSortMethod = config.SkillSortMethod;
  }
  if( config['GoodsSortMethod'] !== undefined) {
     this.GoodsSortMethod = config.GoodsSortMethod;
  }
  if( config['ItemSortOrder'] !== undefined) {
     this.ItemSortOrder = config.ItemSortOrder;
  }
  if( config['WeaponSortOrder'] !== undefined) {
     this.WeaponSortOrder = config.WeaponSortOrder;
  }
  if( config['ArmorSortOrder'] !== undefined) {
     this.ArmorSortOrder = config.ArmorSortOrder;
  }
  if( config['SkillSortOrder'] !== undefined) {
     this.SkillSortOrder = config.SkillSortOrder;
  }
  if( config['GoodsSortOrder'] !== undefined) {
     this.GoodsSortOrder = config.GoodsSortOrder;
  }
};

/////////////////////////////////////////////////////////////////////////////////////
// Data_Manager
/////////////////////////////////////////////////////////////////////////////////////
BurningOrca.SortingOptions.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function()
{
    if( !BurningOrca.SortingOptions.DataManager_isDatabaseLoaded.call(this) )
        return false;

    if( BurningOrca.SortingOptions.AllItemSortMethods.length === 0 )
    {
        BurningOrca.SortingOptions.AllItemSortMethods = BurningOrca.SortingOptions.GetAllSortMethods('Item');
        BurningOrca.SortingOptions.AllWeaponSortMethods = BurningOrca.SortingOptions.GetAllSortMethods('Weapon');
        BurningOrca.SortingOptions.AllArmorSortMethods = BurningOrca.SortingOptions.GetAllSortMethods('Armor');
        BurningOrca.SortingOptions.AllSkillSortMethods = BurningOrca.SortingOptions.GetAllSortMethods('Skill');
        BurningOrca.SortingOptions.AllGoodsSortMethods = BurningOrca.SortingOptions.GetAllSortMethods('Goods');
    }
    if( ConfigManager.ItemSortMethod === -1 )
    {
        ConfigManager.ItemSortMethod = BurningOrca.SortingOptions.GetDefaultSortMethod('Item');
        ConfigManager.WeaponSortMethod = BurningOrca.SortingOptions.GetDefaultSortMethod('Weapon');
        ConfigManager.ArmorSortMethod = BurningOrca.SortingOptions.GetDefaultSortMethod('Armor');
        ConfigManager.SkillSortMethod = BurningOrca.SortingOptions.GetDefaultSortMethod('Skill');
        ConfigManager.GoodsSortMethod = BurningOrca.SortingOptions.GetDefaultSortMethod('Goods');
    }
    return true;
}

BurningOrca.SortingOptions.DataManager_createGameObjects = DataManager.createGameObjects;
DataManager.createGameObjects = function() {
    BurningOrca.SortingOptions.DataManager_createGameObjects.call(this);
    $gameSortOptions = new Game_SortOptions();
}

BurningOrca.SortingOptions.DataManager_makeSaveContents = DataManager.makeSaveContents
DataManager.makeSaveContents = function () {
    var contents = BurningOrca.SortingOptions.DataManager_makeSaveContents.call(this);
    contents.SortOptions = $gameSortOptions;
    return contents;
}

BurningOrca.SortingOptions.DataManager_extractSaveContents = DataManager.extractSaveContents
DataManager.extractSaveContents = function (contents) {
    BurningOrca.SortingOptions.DataManager_extractSaveContents.call(this, contents);
    if (!contents.SortOptions) {
        $gameSortOptions = new Game_SortOptions();
    }
    else {
        $gameSortOptions = contents.SortOptions;
    }
}

/////////////////////////////////////////////////////////////////////////////////////
// Game_SortOptions
/////////////////////////////////////////////////////////////////////////////////////
Game_SortOptions = function() {
    this.initialize.apply(this, arguments);
}

Game_SortOptions.prototype = Object.create(Object.prototype);
Game_SortOptions.prototype.constructor = Game_SortOptions;

Game_SortOptions.prototype.initialize = function(arguments) {
  this.ItemSortMethod = ConfigManager.ItemSortMethod;
  this.ItemSortOrder  = ConfigManager.ItemSortOrder;
  this.WeaponSortMethod = ConfigManager.WeaponSortMethod;
  this.WeaponSortOrder  = ConfigManager.WeaponSortOrder;
  this.ArmorSortMethod = ConfigManager.ArmorSortMethod;
  this.ArmorSortOrder  = ConfigManager.ArmorSortOrder;
  this.SkillSortMethod = ConfigManager.SkillSortMethod;
  this.SkillSortOrder  = ConfigManager.SkillSortOrder;
  this.GoodsSortMethod = ConfigManager.GoodsSortMethod;
  this.GoodsSortOrder = ConfigManager.GoodsSortOrder;
}

/////////////////////////////////////////////////////////////////////////////////////
// Window_Options
/////////////////////////////////////////////////////////////////////////////////////
BurningOrca.SortingOptions.Window_Options_makeCommandList = Window_Options.prototype.makeCommandList;
Window_Options.prototype.makeCommandList = function() {
    BurningOrca.SortingOptions.Window_Options_makeCommandList.call(this);
    if (!Imported.YEP_OptionsCore) this.addCommand(BurningOrca.SortingOptions.Param.SortingRulesText, "SortingRules");
}

if (!Imported.YEP_OptionsCore) {
    BurningOrca.SortingOptions.Window_Options_processOk = Window_Options.prototype.processOk;
    Window_Options.prototype.processOk = function() {
        if (this.commandSymbol(this.index()) === 'SortingRules') {
		    Window_Command.prototype.processOk.call(this);
	    } else {
		    BurningOrca.SortingOptions.Window_Options_processOk.call(this);
	    }
    };

    BurningOrca.SortingOptions.Window_Options_drawItem = Window_Options.prototype.drawItem;
    Window_Options.prototype.drawItem = function(index) 
    {
        if (this.commandSymbol(index) === 'SortingRules') 
        {
			var rect = this.itemRectForText(index);
			var text = this.commandName(index);
	        this.resetTextColor();
	        this.changePaintOpacity(this.isCommandEnabled(index));
	        this.drawText(text, rect.x, rect.y, rect.width, 'left');
	    } 
        else 
        {
		    BurningOrca.SortingOptions.Window_Options_drawItem.call(this, index);
	    }
    };
}

////////////////////////////////////////////////////////////////////////////////////
// Scene_Options
////////////////////////////////////////////////////////////////////////////////////
BurningOrca.SortingOptions.Scene_Options_createOptionsWindow = Scene_Options.prototype.createOptionsWindow;
Scene_Options.prototype.createOptionsWindow = function() {
  BurningOrca.SortingOptions.Scene_Options_createOptionsWindow.call(this);
  this._optionsWindow.setHandler('SortingRules', this.commandSortingConfig.bind(this));
};

Scene_Options.prototype.commandSortingConfig = function() {
	SceneManager.push(Scene_SortingConfiguration);
};

/////////////////////////////////////////////////////////////////////////////////////
// Scene_SortingConfiguration
/////////////////////////////////////////////////////////////////////////////////////
function Scene_SortingConfiguration() {
    this.initialize.apply(this, arguments);
}

Scene_SortingConfiguration.prototype = Object.create(Scene_MenuBase.prototype);
Scene_SortingConfiguration.prototype.constructor = Scene_Options;

Scene_SortingConfiguration.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_SortingConfiguration.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);
    this.createHelpWindow();
    this.createSortingConfigWindow();
    this.createSortableObjectsWindow();
};

Scene_SortingConfiguration.prototype.terminate = function() {
    Scene_MenuBase.prototype.terminate.call(this);
};

Scene_SortingConfiguration.prototype.createSortingConfigWindow = function() {
   this._sortingConfigWindow = new Window_SortingConfiguration(this._helpWindow);
   this._sortingConfigWindow.setHandler('cancel', this.onSortingConfigCancel.bind(this));
   this.addWindow(this._sortingConfigWindow);
}

Scene_SortingConfiguration.prototype.createSortableObjectsWindow = function() {
   this._sortableObjectsWindow = new Window_SortableObjects(this._helpWindow, this._sortingConfigWindow);
   this._sortableObjectsWindow.setHandler('Item', this.onSortableObjectOK.bind(this));
   this._sortableObjectsWindow.setHandler('Weapon', this.onSortableObjectOK.bind(this));
   this._sortableObjectsWindow.setHandler('Armor', this.onSortableObjectOK.bind(this));
   this._sortableObjectsWindow.setHandler('Skill', this.onSortableObjectOK.bind(this));
   this._sortableObjectsWindow.setHandler('Goods', this.onSortableObjectOK.bind(this));
   this._sortableObjectsWindow.setHandler('cancel', this.popScene.bind(this));
   this.addWindow(this._sortableObjectsWindow);
}

Scene_SortingConfiguration.prototype.onSortableObjectOK = function() {
  this._sortingConfigWindow.activate();
  this._sortingConfigWindow.select(0);
}

Scene_SortingConfiguration.prototype.onSortingConfigCancel = function() {
  this._sortingConfigWindow.deselect();
  this._sortableObjectsWindow.activate();
}

/////////////////////////////////////////////////////////////////////////////////////
// Window_SortableObjects
/////////////////////////////////////////////////////////////////////////////////////
Window_SortableObjects = function() {
    this.initialize.apply(this, arguments);
}

Window_SortableObjects.prototype = Object.create(Window_Command.prototype);
Window_SortableObjects.prototype.constructor = Window_SortableObjects;

Window_SortableObjects.prototype.initialize = function(helpWindow, sortingConfigWindow)
{
    this._sortingConfigWindow = sortingConfigWindow;
    var x = 0;
    var y = helpWindow.y + helpWindow.height;
    this._width = 200;
    this._height = Graphics.boxHeight - y;
    Window_Command.prototype.initialize.call(this, x, y);
    this.setHelpWindow(helpWindow);
    this.refresh();
    this.select(0);
    this.activate();
}

Window_SortableObjects.prototype.windowWidth = function() {
    return this._width;
};

Window_SortableObjects.prototype.windowHeight = function() {
    return this._height;
};

Window_SortableObjects.prototype.makeCommandList = function() {
    this.addCommand(TextManager.item, 'Item', true, 0);
    this.addCommand(TextManager.weapon, 'Weapon', true, 0);
    this.addCommand(TextManager.armor, 'Armor', true, 0);
    this.addCommand(TextManager.skill, 'Skill', true, 1);
    this.addCommand(BurningOrca.SortingOptions.Param.GoodsText, 'Goods', true, 2);
    this.addCommand(TextManager.cancel, 'cancel', true, -1);
};

Window_SortableObjects.prototype.updateHelp = function() {
    if (!this._helpWindow) return;

    if (this.currentExt() !== -1) 
    {
        this._helpWindow.setText(BurningOrca.SortingOptions.Param.SortingRulesHelpText.format(this.commandName(this._index)));
        this._sortingConfigWindow.setObjectType(this.commandSymbol(this._index));
    } 
    else 
    {
        this._helpWindow.clear();
        this._sortingConfigWindow.setObjectType("");
    }
};

/////////////////////////////////////////////////////////////////////////////////////
// Window_SortingConfiguration
/////////////////////////////////////////////////////////////////////////////////////
Window_SortingConfiguration = function() {
    this.initialize.apply(this, arguments);
}

Window_SortingConfiguration.prototype = Object.create(Window_Command.prototype);
Window_SortingConfiguration.prototype.constructor = Window_SortingConfiguration;

Window_SortingConfiguration.prototype.initialize = function(helpWindow)
{
    this._objectType = "";
    var x = 200;
    var y = helpWindow.y + helpWindow.height;
    this._width = Graphics.boxWidth - 200;
    this._height = Graphics.boxHeight - y;
    Window_Command.prototype.initialize.call(this, x, y);
    this.refresh();
    this.deactivate();
    this.deselect();
}

Window_SortingConfiguration.prototype.makeCommandList = function() {
   if( this._objectType !== "" )
   {
        this.addCommand(BurningOrca.SortingOptions.Param.SortingMethodCommand, 'Method');
        this.addCommand(BurningOrca.SortingOptions.Param.SortOrderCommand, 'Order');
   }
};

Window_SortingConfiguration.prototype.setObjectType = function(objectType) {
    this._objectType = objectType;
    this.clearCommandList();
    this.createContents();
    this.refresh();
}

Window_SortingConfiguration.prototype.windowWidth = function() {
  return this._width;
};

Window_SortingConfiguration.prototype.windowHeight = function() {
  return this._height;
};

Window_SortingConfiguration.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var statusWidth = 200;
    var titleWidth = rect.width - statusWidth;
    this.resetTextColor();
    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x, rect.y, titleWidth, 'left');
    this.drawText(this.statusText(index), titleWidth, rect.y, statusWidth, 'right');
};

Window_SortingConfiguration.prototype.statusText = function(index) {
    var configValue = this.getConfigValue(index);
    if( index === 1 ) // Order
        return configValue === 0 ? BurningOrca.SortingOptions.Param.AscendingText : BurningOrca.SortingOptions.Param.DescendingText;
    else // Method
        return BurningOrca.SortingOptions.GetFunctionArray(this._objectType)[configValue].Name;
}

Window_SortingConfiguration.prototype.processOk = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(index);
    this.changeValue(index, this.DetermineNewConfigValue(index, value, "next"));
};

Window_SortingConfiguration.prototype.cursorRight = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(index);
    this.changeValue(index, this.DetermineNewConfigValue(index, value, "next"));
};

Window_SortingConfiguration.prototype.cursorLeft = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    var value = this.getConfigValue(index);
    this.changeValue(index, this.DetermineNewConfigValue(index, value, "prev"));
};

Window_SortingConfiguration.prototype.changeValue = function(index, value) {
    var lastValue = this.getConfigValue(index);
    if (lastValue !== value) {
        this.setConfigValue(index, value);
        this.redrawItem(index);
        SoundManager.playCursor();
    }
};

Window_SortingConfiguration.prototype.getConfigValue = function(index) {
    if( BurningOrca.SortingOptions.UseLocalConfig )
        return $gameSortOptions[this.getConfigName(index)];
    else
        return ConfigManager[this.getConfigName(index)];
};

Window_SortingConfiguration.prototype.setConfigValue = function(index, value) {
    if( BurningOrca.SortingOptions.UseLocalConfig )
        $gameSortOptions[this.getConfigName(index)] = value;
    else
        ConfigManager[this.getConfigName(index)] = value;
};

Window_SortingConfiguration.prototype.getConfigName = function(index) {
    return this._objectType + "Sort" + (index === 0 ? "Method" : "Order");
}

Window_SortingConfiguration.prototype.DetermineNewConfigValue = function(index, prevValue, direction)
{
    var value = prevValue;
    if( direction === "next" )
    {
        do {
            value++;
            if( value > this.getMaximumValue(index) )
                value = 0;
        }
        while( !this.isUsableConfig(index, value) );
    }
    else
    {
        do {
            value--;
            if( value < 0 )
                value = this.getMaximumValue(index);
        }
        while( !this.isUsableConfig(index, value) );
    }
    return value;
}

Window_SortingConfiguration.prototype.getMaximumValue = function(index) {
    if( index === 0 ) // Method
        return BurningOrca.SortingOptions.GetFunctionArray(this._objectType).length - 1;
    else // Order
        return 1;
}

Window_SortingConfiguration.prototype.isUsableConfig = function(optionIndex, sortingMethodIndex) {
    if( optionIndex === 0 ) // Method
        return eval(BurningOrca.SortingOptions.GetFunctionArray(this._objectType)[sortingMethodIndex].Use);
    else // Order
        return true;
}

////////////////////////////////////////////////////////////////////////////////////
// Plugin provided custom sort functions as examples
////////////////////////////////////////////////////////////////////////////////////
BurningOrca.SortingOptions.SortByAmountAndName = function(itemA, itemB) {
    var amountComp = $gameParty.numItems(itemA) - $gameParty.numItems(itemB);
    if( amountComp !== 0 ) return amountComp;
    return itemA.name.localeCompare(itemB.name);
}

BurningOrca.SortingOptions.SortByElementCostAndName = function(skillA, skillB) {
    var elementComp = skillA.damage.elementId - skillB.damage.elementId;
    if( elementComp !== 0 ) return elementComp;
    var mpCostComp = skillA.mpCost - skillB.mpCost;
    if( mpCostComp !== 0 ) return mpCostComp;
    var tpCostComp = skillA.tpCost - skillB.tpCost;
    if( tpCostComp !== 0 ) return tpCostComp;
    return skillA.name.localeCompare(skillB.name);
}

BurningOrca.SortingOptions.GetDataObjectForGoods = function(type, index) {
   if( type === 0 ) {
       return $dataItems[index];
   }
   else if( type === 1 ) {
       return $dataWeapons[index];
   }
   else {
       return $dataArmors[index];
   }
}

BurningOrca.SortingOptions.SortByTypePriceAndName = function(goodsA, goodsB) {
    var typeCompare = goodsA[0] - goodsB[0];
    if( typeCompare !== 0 ) return typeCompare;
    var priceA = goodsA[2] ? goodsA[3] : BurningOrca.SortingOptions.GetDataObjectForGoods(goodsA[0], goodsA[1]).price;
    var priceB = goodsB[2] ? goodsB[3] : BurningOrca.SortingOptions.GetDataObjectForGoods(goodsB[0], goodsB[1]).price;
    var priceComp = priceA - priceB;
    if( priceComp !== 0 ) return priceComp;
    return BurningOrca.SortingOptions.GetDataObjectForGoods(goodsA[0], goodsA[1]).name.localeCompare(BurningOrca.SortingOptions.GetDataObjectForGoods(goodsB[0], goodsB[1]).name);
}

////////////////////////////////////////////////////////////////////////////////////
// Input
////////////////////////////////////////////////////////////////////////////////////
BurningOrca.SortingOptions.Input_initialize = Input.initialize;
Input.initialize = function() {
    BurningOrca.SortingOptions.Input_initialize.call(this);
    this._sortOrderKey = null;
    this._sortMethodKey = null;
    this.SetupKeysForSorting();
}

Input.SetupKeysForSorting = function() {
    
    this._sortMethodKey = Number(BurningOrca.SortingOptions.Param.SortKey);
    this._sortOrderKey  = Number(BurningOrca.SortingOptions.Param.SortOrderKey);

    if( this._sortOrderKey ) 
    {
        this.keyMapper[this._sortOrderKey] = 'toggleSortOrder';
    }
    if( this._sortMethodKey ) 
    {
        this.keyMapper[this._sortMethodKey] = 'showSortOptions';
    }
}

Input.getSortOrderKey = function() {
    if( !this._sortOrderKey ) return null;
    return String.fromCharCode(this._sortOrderKey);
}

Input.getSortMethodKey = function() {
    if( !this._sortMethodKey ) return null;
    return String.fromCharCode(this._sortMethodKey);
}

////////////////////////////////////////////////////////////////////////////////////
// Window_SortOptions
////////////////////////////////////////////////////////////////////////////////////
Window_SortOptions = function() {
    this.initialize.apply(this, arguments);
}

Window_SortOptions.prototype = Object.create(Window_Command.prototype);
Window_SortOptions.prototype.constructor = Window_SortOptions;

Window_SortOptions.prototype.initialize = function()
{
    this._toBeSortedParent = null;
    var x = Graphics.boxWidth - 200;
    var y = Graphics.boxHeight - 200;
    this._width = 200;
    this._height = 200;
    Window_Command.prototype.initialize.call(this, x, y);
    this.refresh();
    this.deactivate();
    this.hide();
}

Window_SortOptions.prototype.windowWidth = function() {
    return this._width;
};

Window_SortOptions.prototype.windowHeight = function() {
    return this._height;
};

Window_SortOptions.prototype.makeCommandList = function() {
    if( this._toBeSortedParent ) {
        var options = BurningOrca.SortingOptions.GetFunctionArray(this._toBeSortedParent.getSortOptionType());
        for( var i = 0; i < options.length; i++ ) 
        {
            if( eval(options[i].Use) )
            {
                this.addCommand(options[i].Name, 'sort', true, i);
            }
        }
    }
    this.addCommand(TextManager.cancel, 'cancel', true, -1);
};

Window_SortOptions.prototype.activate = function() {
    Window_Command.prototype.activate.call(this);
    if( this._toBeSortedParent ) {
        this.select(this._toBeSortedParent.getActiveSortMethod());
    }
 }

Window_SortOptions.prototype.setToBeSortedWindow = function(window) {
    if( this._toBeSortedParent !== window ) {
        this._toBeSortedParent = window;
        this.x = this._toBeSortedParent.width - 200 + this._toBeSortedParent.x;
        this.y = this._toBeSortedParent.height - 200 + this._toBeSortedParent.y;
        this.clearCommandList();
        this.createContents();
        this.refresh();
    }
}

////////////////////////////////////////////////////////////////////////////////////
// Window_SortInfo
////////////////////////////////////////////////////////////////////////////////////
Window_SortInfo = function() {
    this.initialize.apply(this, arguments);
}

Window_SortInfo.prototype = Object.create(Window_Base.prototype);
Window_SortInfo.prototype.constructor = Window_SortInfo;

Window_SortInfo.prototype.initialize = function(parent) {
    if( parent.width !== Graphics.boxWidth ) 
    {
        Window_Base.prototype.initialize.call(this, parent.x, parent.y + parent.height - 120, parent.width, 120);
        this.paintInHeightDir = true;
    }
    else
    {
        Window_Base.prototype.initialize.call(this, parent.x, parent.y + parent.height - 70, parent.width, 70);
        this.paintInHeightDir = false;
    }
    this._parent = parent;
    this._parent._sortInfoWindow = this;
    this.refresh();
    this.hide();
}

Window_SortInfo.prototype.refresh = function() {
    this.contents.clear();
    var rectSort = this.itemRectForText(0);
    var rectToggle = this.itemRectForText(1);

    this.changeTextColor(this.normalColor());

    this.drawText(Input.getSortMethodKey() + ":", rectSort.x, rectSort.y, 40, 'left');
    this.drawText(BurningOrca.SortingOptions.Param.SortText, rectSort.x + 50, rectSort.y, this.paintInHeightDir ? this.width - 60 : rectSort.width - 60, 'left');

    this.drawText(Input.getSortOrderKey() + ":", rectToggle.x, rectToggle.y, 40, 'left');
    this.drawText(this._parent._sortOrder === 0 ? BurningOrca.SortingOptions.Param.DescendingText : BurningOrca.SortingOptions.Param.AscendingText, rectToggle.x + 50, rectToggle.y, this.paintInHeightDir ? this.width - 60 : rectToggle.width - 60, 'left');
}

Window_SortInfo.prototype.itemRectForText = function(index) {
    var rect = this.itemRect(index);
    rect.x += this.textPadding();
    rect.width -= this.textPadding() * 2;
    return rect;
};

Window_SortInfo.prototype.itemRect = function(index) {
    var rect = new Rectangle();
    if( this.paintInHeightDir ) 
    {
        rect.width = 150;
        rect.height = 40;
        rect.x = this.spacing();
        rect.y = index * rect.height;
    }
    else
    {
        rect.width = this.width / 2 - this.spacing();
        rect.height = 40;
        rect.x = index % 2 * (rect.width + this.spacing());
        rect.y = 0;
    }
    return rect;
};

Window_SortInfo.prototype.spacing = function() {
    return 10;
};

////////////////////////////////////////////////////////////////////////////////////
// Window_Selectable
////////////////////////////////////////////////////////////////////////////////////
BurningOrca.SortingOptions.Window_Selectable_initialize = Window_Selectable.prototype.initialize;
Window_Selectable.prototype.initialize = function(x, y, width, height) {
    BurningOrca.SortingOptions.Window_Selectable_initialize.call(this, x, y, width, height);
}

BurningOrca.SortingOptions.Window_Selectable_activate = Window_Selectable.prototype.activate;
Window_Selectable.prototype.activate = function() {
    if( this._sortOptionsWindow ) {
        if( this._sortOptionsWindow._toBeSortedParent !== this ) {
            this._sortOptionsWindow.setToBeSortedWindow(this);
        }
    }
    if( this._sortInfoWindow ) {
        this.height -= this._sortInfoWindow.height;
        this._sortInfoWindow.show();
    }
    BurningOrca.SortingOptions.Window_Selectable_activate.call(this);
}

BurningOrca.SortingOptions.Window_Selectable_deactivate = Window_Selectable.prototype.deactivate;
Window_Selectable.prototype.deactivate = function() {
    if( this._sortInfoWindow ) {
        this.height += this._sortInfoWindow.height;
        this._sortInfoWindow.hide();
    }
    BurningOrca.SortingOptions.Window_Selectable_deactivate.call(this);
}

Window_Selectable.prototype.onSortOptionsSort = function() {
    if( this._sortOptionsWindow ) {
        this.setSortMethod(this._sortOptionsWindow.currentExt());
        this._sortOptionsWindow.deactivate();
        this._sortOptionsWindow.hide();
    }
}

Window_Selectable.prototype.onSortOptionsCancel = function() {
    if( this._sortOptionsWindow ) {
        this.activate();
        this.refresh();
        this.select(0);
        this._sortOptionsWindow.hide();
    }
}

BurningOrca.SortingOptions.Window_Selectable_update = Window_Selectable.prototype.update;
Window_Selectable.prototype.update = function() 
{
    BurningOrca.SortingOptions.Window_Selectable_update.call(this);
    if( this.visible && this.active && this._sortOptionsWindow )
    {
        if( Input.isTriggered('toggleSortOrder') ) 
        {
            this.toggleSortOrder();
            if( this._sortInfoWindow )
            {
                this._sortInfoWindow.refresh();
            }
        }
        else if( Input.isTriggered('showSortOptions') ) 
        {
            this.deactivate();
            this.deselect();
            this._sortOptionsWindow.show();
            this._sortOptionsWindow.activate();
        }
    }
}

Window_Selectable.prototype.setSortMethod = function(method)
{
    this._sortMethod = method;
    this.activate();
    this.refresh();
    this.select(0);
}

Window_Selectable.prototype.toggleSortOrder = function()
{
    if( this._sortOrder === 0 )
    {
        this._sortOrder = 1;
    }
    else
    {
        this._sortOrder = 0;
    }

    this.refresh();
    this.select(0);
}

Window_Selectable.prototype.getActiveSortMethod = function()
{
    return this._sortMethod;
}

Window_Selectable.prototype.getSortOrderValue = function(value) {
    if( this._sortOrder === 0 )
        return value;
    else
        return -1 * value;
}

////////////////////////////////////////////////////////////////////////////////////
// Window_ItemList
////////////////////////////////////////////////////////////////////////////////////
BurningOrca.SortingOptions.Window_ItemList_initialize = Window_ItemList.prototype.initialize;
Window_ItemList.prototype.initialize = function(x, y, width, height) {
    BurningOrca.SortingOptions.Window_ItemList_initialize.call(this, x, y, width, height);
    this._sortOptionsWindow = null;
    this._sortMethod = BurningOrca.SortingOptions.GetSortConfig('ItemSortMethod');
    this._sortOrder = BurningOrca.SortingOptions.GetSortConfig('ItemSortOrder');
}

BurningOrca.SortingOptions.Window_ItemList_setCategory = Window_ItemList.prototype.setCategory;
Window_ItemList.prototype.setCategory = function(category) 
{
    if( this._category !== category )
    {
        var sortOption = this.getSortOptionForCategory(category);
        this._sortMethod = BurningOrca.SortingOptions.GetSortConfig(sortOption + 'SortMethod');
        this._sortOrder = BurningOrca.SortingOptions.GetSortConfig(sortOption + 'SortOrder');
    }
    BurningOrca.SortingOptions.Window_ItemList_setCategory.call(this, category);
}

Window_ItemList.prototype.setSortOptionsWindow = function(sortOptionsWindow) 
{
   this._sortOptionsWindow = sortOptionsWindow;
   this._sortOptionsWindow.setHandler('sort', this.onSortOptionsSort.bind(this));
   this._sortOptionsWindow.setHandler('cancel', this.onSortOptionsCancel.bind(this));
}

Window_ItemList.prototype.getSortOptionForCategory = function(category) {
    if( category === 'weapon' )
    {
        return 'Weapon';
    }
    else if( category === 'armor' )
    {
        return 'Armor';
    }
    else
    {
        return 'Item';
    }
}

Window_ItemList.prototype.getSortOptionType = function() {
    return this.IsForWeapon() ? 'Weapon'
                              : this.IsForArmor() ? 'Armor'
                                                  : 'Item';
}

BurningOrca.SortingOptions.Window_ItemList_makeItemList = Window_ItemList.prototype.makeItemList;
Window_ItemList.prototype.makeItemList = function() {
    BurningOrca.SortingOptions.Window_ItemList_makeItemList.call(this);
    this.sortItemList();
}

Window_ItemList.prototype.sortItemList = function() {
    if( this.IsForWeapon() )
    {
       this.SortByWeaponRules();
    }
    else if( this.IsForArmor() )
    {
       this.SortByArmorRules();
    }
    else
    {
       this.SortByItemRules();
    }
}

Window_ItemList.prototype.IsForWeapon = function() {
    return this._category === 'weapon';
}

Window_ItemList.prototype.IsForArmor = function() {
    return this._category === 'armor';
}

Window_ItemList.prototype.SortByItemRules = function() 
{
    if( this._sortMethod !== 0 ) // Default unsorted
    {
        this._data = this._data.sort(function(a, b) {
            // Place null value always last
            if( a === null ) 
            {
                return 1;
            }
            else if( b === null )
            {
                return -1;
            }
            else if( this._sortMethod > 3 ) // Custom sorting function
            {
                var config = BurningOrca.SortingOptions.Items.Custom[this._sortMethod - 4];
                return this.getSortOrderValue(eval(config.Function));
            }
            else 
            {
                switch( this._sortMethod ) 
                {
                    case 1: // By name
                        return this.getSortOrderValue(a.name.localeCompare(b.name));
                    case 2: // By price
                        return this.getSortOrderValue(a.price - b.price);
                    case 3: // By amount in possession
                        return this.getSortOrderValue($gameParty.numItems(a) - $gameParty.numItems(b));
                }
            }
        }.bind(this));
    }
}

Window_ItemList.prototype.SortByWeaponRules = function() 
{
    if( this._sortMethod !== 0 ) // Default unsorted
    {
        this._data = this._data.sort(function(a, b) {
            // Place null value always last
            if( a === null ) 
            {
                return 1;
            }
            else if( b === null )
            {
                return -1;
            }
            else if( this._sortMethod <= 5 )
            {
                return this.getSortOrderValue(this.EquipmentSortValue(a, b, this._sortMethod));
            }
            else if( this._sortMethod < 5 + BurningOrca.SortingOptions.Weapons.Params.ActorParams.length )
            {
                var paramId = Number(BurningOrca.SortingOptions.Weapons.Params.ActorParams[this._sortMethod-6]);
                return this.getSortOrderValue(this.ParamSortValue(a, b, paramId));
            }
            else 
            {
                var config = BurningOrca.SortingOptions.Weapons.Custom[this._sortMethod - 6 - BurningOrca.SortingOptions.Weapons.Params.ActorParams.length];
                return this.getSortOrderValue(eval(config.Function));
            }
        }.bind(this));
    }
}

Window_ItemList.prototype.SortByArmorRules = function() 
{
    if( this._sortMethod !== 0 ) // Default unsorted
    {
        this._data = this._data.sort(function(a, b) {
            // Place null value always last
            if( a === null ) 
            {
                return 1;
            }
            else if( b === null )
            {
                return -1;
            }
            else if( this._sortMethod <= 5 )
            {
                return this.getSortOrderValue(this.EquipmentSortValue(a, b, this._sortMethod));
            }
            else if( this._sortMethod < 5 + BurningOrca.SortingOptions.Armor.Params.ActorParams.length ) // Custom sorting function
            {
                var paramId = Number(BurningOrca.SortingOptions.Armor.Params.ActorParams[this._sortMethod-6]);
                return this.getSortOrderValue(this.ParamSortValue(a, b, paramId));
            }
            else 
            {
                var config = BurningOrca.SortingOptions.Armor.Custom[this._sortMethod - 6 - BurningOrca.SortingOptions.Armor.Params.ActorParams.length];
                return this.getSortOrderValue(eval(config.Function));
            }
        }.bind(this));
    }
}

Window_ItemList.prototype.EquipmentSortValue = function(itemA, itemB, sortMethod)
{
    switch( sortMethod )
    {
        case 1: // By name
            return itemA.name.localeCompare(itemB.name);
        case 2: // By Type
            if( DataManager.isWeapon(itemA) ) {
                if( !DataManager.isWeapon(itemB) )
                    throw new Error("The items are not of the same type. One is a weapon and the other one isn't");
                return itemA.wtypeId - itemB.wtypeId;
            }
            else if( DataManager.isArmor(itemA) ) {
                if( !DataManager.isArmor(itemB) )
                    throw new Error("The items are not of the same type. One is a armor and the other one isn't");
                return itemA.atypeId - itemB.atypeId;
            }
            else {
                throw new Error("This function has only to be called for weapons and armors");
            }
       case 3: // By # traits
            return itemA.traits.length - itemB.traits.length;
       case 4: // By amount in possession
            return $gameParty.numItems(itemA) - $gameParty.numItems(itemB);
       case 5: // By equipment type
            return itemA.etypeId - itemB.etypeId;
    }
}

Window_ItemList.prototype.ParamSortValue = function(itemA, itemB, paramId)
{
    if( !this._actor ) // Sort by raw stats, if actor is not given.
    {
        return itemA.params[paramId] - itemB.params[paramId];
    }
    else if( this._slotId ) // Sort by actual effect on actor
    {
        var itemADif = 0, itemBDif = 0;
        var actor = JsonEx.makeDeepCopy(this._actor);
        
        actor.forceChangeEquip(this._slotId, itemA);
        itemADif = actor.param(paramId) - this._actor.param(paramId);
        actor.forceChangeEquip(this._slotId, itemB);
        itemBDif = actor.param(paramId) - this._actor.param(paramId);

        return itemADif - itemBDif;
    }
    else // Don't know how to sort, so don't sort at all.
    {
        return 0;
    }
}

////////////////////////////////////////////////////////////////////////////////////
// Window_SkillList
////////////////////////////////////////////////////////////////////////////////////
BurningOrca.SortingOptions.Window_SkillList_initialize = Window_SkillList.prototype.initialize;
Window_SkillList.prototype.initialize = function(x, y, width, height) {
    BurningOrca.SortingOptions.Window_SkillList_initialize.call(this, x, y, width, height);
    this._sortOptionsWindow = null;
    this._sortMethod = BurningOrca.SortingOptions.GetSortConfig('SkillSortMethod');
    this._sortOrder = BurningOrca.SortingOptions.GetSortConfig('SkillSortOrder');
}

BurningOrca.SortingOptions.Window_SkillList_makeItemList = Window_SkillList.prototype.makeItemList;
Window_SkillList.prototype.makeItemList = function() {
    BurningOrca.SortingOptions.Window_SkillList_makeItemList.call(this);
   
    if( this._sortMethod !== 0 ) // Default unsorted
    {
        this._data = this._data.sort(function(a, b) {
            if( this._sortMethod > 4 ) // Custom sorting function
            {
                var config = BurningOrca.SortingOptions.Skills.Custom[this._sortMethod - 5];
                return this.getSortOrderValue(eval(config.Function));
            }
            else 
            {
                switch( this._sortMethod ) 
                {
                    case 1:
                        return this.getSortOrderValue(a.name.localeCompare(b.name));
                    case 2:
                        return this.getSortOrderValue(a.damage.elementId - b.damage.elementId);
                    case 3:
                        return this.getSortOrderValue(a.mpCost - b.mpCost);
                    case 4:
                        return this.getSortOrderValue(a.tpCost - b.tpCost);
                }
            }
        }.bind(this));
    }
};

Window_SkillList.prototype.setSortOptionsWindow = function(sortOptionsWindow) 
{
   this._sortOptionsWindow = sortOptionsWindow;
   this._sortOptionsWindow.setHandler('sort', this.onSortOptionsSort.bind(this));
   this._sortOptionsWindow.setHandler('cancel', this.onSortOptionsCancel.bind(this));
}

Window_SkillList.prototype.getSortOptionType = function()
{
   return 'Skill';
}

////////////////////////////////////////////////////////////////////////////////////
// Window_ShopBuy
////////////////////////////////////////////////////////////////////////////////////
BurningOrca.SortingOptions.Window_ShopBuy_initialize = Window_ShopBuy.prototype.initialize;
Window_ShopBuy.prototype.initialize = function(x, y, width, height) {
    BurningOrca.SortingOptions.Window_ShopBuy_initialize.call(this, x, y, width, height);
    this._sortOptionsWindow = null;
    this._sortMethod = BurningOrca.SortingOptions.GetSortConfig('GoodsSortMethod');
    this._sortOrder = BurningOrca.SortingOptions.GetSortConfig('GoodsSortOrder');
}

BurningOrca.SortingOptions.Window_ShopBuy_makeItemList = Window_ShopBuy.prototype.makeItemList;
Window_ShopBuy.prototype.makeItemList = function() {
    if( this._sortMethod !== 0 ) // Default unsorted
    {
        this._shopGoods = this._shopGoods.sort(function(a, b) {
            var dataObjA, dataObjB;
            dataObjA = BurningOrca.SortingOptions.GetDataObjectForGoods(a[0], a[1]);
            dataObjB = BurningOrca.SortingOptions.GetDataObjectForGoods(b[0], b[1]);
            if( this._sortMethod > 3 ) // Custom sorting function
            {
                var config = BurningOrca.SortingOptions.Goods.Custom[this._sortMethod - 4];
                return this.getSortOrderValue(eval(config.Function));
            }
            else 
            {
                switch( this._sortMethod ) 
                {
                    case 1: // By name
                        return this.getSortOrderValue(dataObjA.name.localeCompare(dataObjB.name));
                    case 2: // By price
                        var priceA = a[2] ? a[3] : dataObjA.price;
                        var priceB = b[2] ? b[3] : dataObjB.price;
                        return this.getSortOrderValue(priceA - priceB);
                    case 3: // By type
                        return this.getSortOrderValue(a[0] - b[0]);
                }
            }
        }.bind(this));
    }
    BurningOrca.SortingOptions.Window_ShopBuy_makeItemList.call(this);
}

Window_ShopBuy.prototype.setSortOptionsWindow = function(sortOptionsWindow) 
{
   this._sortOptionsWindow = sortOptionsWindow;
   this._sortOptionsWindow.setHandler('sort', this.onSortOptionsSort.bind(this));
   this._sortOptionsWindow.setHandler('cancel', this.onSortOptionsCancel.bind(this));
}

Window_ShopBuy.prototype.getSortOptionType = function()
{
   return 'Goods';
}

////////////////////////////////////////////////////////////////////////////////////////////
// Window_EquipItem
////////////////////////////////////////////////////////////////////////////////////////////
BurningOrca.SortingOptions.Window_EquipItem_setSlotId = Window_EquipItem.prototype.setSlotId;
Window_EquipItem.prototype.setSlotId = function(slotId) {
    if (this._slotId !== slotId) {
        var option = (slotId === 0 ? 'WeaponSort' : 'ArmorSort');
        this._sortMethod = BurningOrca.SortingOptions.GetSortConfig(option + 'Method');
        this._sortOrder = BurningOrca.SortingOptions.GetSortConfig(option + 'Order');
    }
    BurningOrca.SortingOptions.Window_EquipItem_setSlotId.call(this, slotId);
};

Window_EquipItem.prototype.IsForWeapon = function() {
    return this._slotId === 0;
}

Window_EquipItem.prototype.IsForArmor = function() {
    return !this.IsForWeapon();
}

////////////////////////////////////////////////////////////////////////////////////////////
// Window_Message
////////////////////////////////////////////////////////////////////////////////////////////
BurningOrca.SortingOptions.Window_Message_subWindows = Window_Message.prototype.subWindows;
Window_Message.prototype.subWindows = function() {
    var subWindows = BurningOrca.SortingOptions.Window_Message_subWindows.call(this);
    subWindows = subWindows.concat([this._sortOptionsWindow, this._sortInfoWindow]);
    return subWindows;
};

BurningOrca.SortingOptions.Window_Message_createSubWindows = Window_Message.prototype.createSubWindows;
Window_Message.prototype.createSubWindows = function() {
    BurningOrca.SortingOptions.Window_Message_createSubWindows.call(this);
    this._sortOptionsWindow = new Window_SortOptions;
    this._sortInfoWindow = new Window_SortInfo(this._itemWindow);
    this._itemWindow.setSortOptionsWindow(this._sortOptionsWindow);
};

BurningOrca.SortingOptions.Window_Message_isAnySubWindowActive = Window_Message.prototype.isAnySubWindowActive;
Window_Message.prototype.isAnySubWindowActive = function() {
    var active = BurningOrca.SortingOptions.Window_Message_isAnySubWindowActive.call(this);
    return active || this._sortOptionsWindow.active;
};

////////////////////////////////////////////////////////////////////////////////////
// Scene_Item
////////////////////////////////////////////////////////////////////////////////////
BurningOrca.SortingOptions.Scene_Item_create = Scene_Item.prototype.create;
Scene_Item.prototype.create = function() {
    BurningOrca.SortingOptions.Scene_Item_create.call(this);
    this.createSortOptionsWindow();
    this.createSortInfoWindow();
}

Scene_Item.prototype.createSortOptionsWindow = function() {
    this._sortOptionsWindow = new Window_SortOptions();
    this._itemWindow.setSortOptionsWindow(this._sortOptionsWindow);
    this.addWindow(this._sortOptionsWindow);
}

Scene_Item.prototype.createSortInfoWindow = function() {
    this._sortInfoWindow = new Window_SortInfo(this._itemWindow);
    this.addWindow(this._sortInfoWindow);
}

////////////////////////////////////////////////////////////////////////////////////
// Scene_Equip
////////////////////////////////////////////////////////////////////////////////////
BurningOrca.SortingOptions.Scene_Equip_create = Scene_Equip.prototype.create;
Scene_Equip.prototype.create = function() {
    BurningOrca.SortingOptions.Scene_Equip_create.call(this);
    this.createSortOptionsWindow();
    this.createSortInfoWindow();
}

Scene_Equip.prototype.createSortOptionsWindow = function() {
    this._sortOptionsWindow = new Window_SortOptions();
    this._itemWindow.setSortOptionsWindow(this._sortOptionsWindow);
    this.addWindow(this._sortOptionsWindow);
}

Scene_Equip.prototype.createSortInfoWindow = function() {
    this._sortInfoWindow = new Window_SortInfo(this._itemWindow);
    this.addWindow(this._sortInfoWindow);
}

////////////////////////////////////////////////////////////////////////////////////
// Scene_Skill
////////////////////////////////////////////////////////////////////////////////////
BurningOrca.SortingOptions.Scene_Skill_create = Scene_Skill.prototype.create;
Scene_Skill.prototype.create = function() {
    BurningOrca.SortingOptions.Scene_Skill_create.call(this);
    this.createSortOptionsWindow();
    this.createSortInfoWindow();
}

Scene_Skill.prototype.createSortOptionsWindow = function() {
    this._sortOptionsWindow = new Window_SortOptions();
    this._itemWindow.setSortOptionsWindow(this._sortOptionsWindow);
    this.addWindow(this._sortOptionsWindow);
}

Scene_Skill.prototype.createSortInfoWindow = function() {
    this._sortInfoWindow = new Window_SortInfo(this._itemWindow);
    this.addWindow(this._sortInfoWindow);
}

////////////////////////////////////////////////////////////////////////////////////
// Scene_Shop
////////////////////////////////////////////////////////////////////////////////////
BurningOrca.SortingOptions.Scene_Shop_create = Scene_Shop.prototype.create;
Scene_Shop.prototype.create = function() {
    BurningOrca.SortingOptions.Scene_Shop_create.call(this);
    this.createSortOptionsWindows();
    this.createSortInfoWindows();
}

Scene_Shop.prototype.createSortOptionsWindows = function() {
    this._sellSortWindow = new Window_SortOptions();
    this._sellWindow.setSortOptionsWindow(this._sellSortWindow);
    this.addWindow(this._sellSortWindow);

    this._buySortWindow = new Window_SortOptions();
    this._buyWindow.setSortOptionsWindow(this._buySortWindow);
    this.addWindow(this._buySortWindow);
}

Scene_Shop.prototype.createSortInfoWindows = function() {
    this._sortInfoWindowShopBuy = new Window_SortInfo(this._buyWindow);
    this.addWindow(this._sortInfoWindowShopBuy);
    this._sortInfoWindowShopSell = new Window_SortInfo(this._sellWindow);
    this.addWindow(this._sortInfoWindowShopSell);
}

////////////////////////////////////////////////////////////////////////////////////
// Scene_Battle
////////////////////////////////////////////////////////////////////////////////////
BurningOrca.SortingOptions.Scene_Battle_create = Scene_Battle.prototype.create;
Scene_Battle.prototype.create = function() {
    BurningOrca.SortingOptions.Scene_Battle_create.call(this);
    this.createSortOptionsWindows();
    this.createSortInfoWindows();
}

Scene_Battle.prototype.createSortOptionsWindows = function() {
    this._itemSortWindow = new Window_SortOptions();
    this._itemWindow.setSortOptionsWindow(this._itemSortWindow);
    this.addWindow(this._itemSortWindow);

    this._skillSortWindow = new Window_SortOptions();
    this._skillWindow.setSortOptionsWindow(this._skillSortWindow);
    this.addWindow(this._skillSortWindow);
}

Scene_Battle.prototype.createSortInfoWindows = function() {
    this._sortInfoWindowItem = new Window_SortInfo(this._itemWindow);
    this.addWindow(this._sortInfoWindowItem);
    this._sortInfoWindowSkill = new Window_SortInfo(this._skillWindow);
    this.addWindow(this._sortInfoWindowSkill);
}

BurningOrca.SortingOptions.Scene_Battle_isAnyInputWindowActive = Scene_Battle.prototype.isAnyInputWindowActive;
Scene_Battle.prototype.isAnyInputWindowActive = function () {
    var isInputWindowActive = BurningOrca.SortingOptions.Scene_Battle_isAnyInputWindowActive.call(this);
    return isInputWindowActive || this._itemSortWindow.active || this._skillSortWindow.active;
}

} else {

    var text = '';
    text += 'You are getting this error because you are trying to run ';
    text += 'BO_SortingOptions while your project files are lower than version ';
    text += '1.5.0.\n\nPlease visit this thread for instructions on how to update ';
    text += 'your project files to 1.5.0 or higher: \n\n';
    text += 'https://forums.rpgmakerweb.com/index.php?threads/';
    text += 'rpg-maker-mv-1-5-0-update.79677/';
    console.log(text);
    require('nw.gui').Window.get().showDevTools();
}