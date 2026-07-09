/*:
 * @plugindesc v1.9 Adds a Stats Distribution system. Update: Auto-detects Critical Formula (Base & Luck) from YEP_X_CriticalControl.
 * @author James Ryan
 *
 * @help
 * This plugin adds a Stats Distribution system to the main menu, allowing players to allocate JP to improve actor stats.
 *
 * ============================================================================
 * v1.9 Update: Auto-Formula Detection
 * ============================================================================
 * This plugin now automatically reads the "Critical Multiplier Formula" from
 * YEP_X_CriticalControl.
 *
 * It will automatically detect:
 * 1. The Base Multiplier (e.g., 1.5 in "value *= 1.5 ...")
 * 2. The Luck Multiplier (e.g., 0.002 in "user.luk * 0.002")
 *
 * You do not need to configure these values manually.
 *
 * ============================================================================
 * v1.5 Update: Custom Layouts
 * ============================================================================
 * You can now customize the two bottom tables using the "Left Column Layout"
 * and "Right Column Layout" parameters.
 * Use the following keywords (separated by spaces):
 *
 * -- Ex-Parameters --
 * HIT (Hit Rate)       EVA (Evasion Rate)    CRI (Critical Rate)
 * CEV (Crit Evasion)   MEV (Magic Evasion)   MRF (Magic Reflect)
 * CNT (Counter Rate)   HRG (HP Regen)        MRG (MP Regen)
 * TRG (TP Regen)
 *
 * -- Sp-Parameters --
 * TGR (Aggro Rate)     GRD (Guard Effect)    REC (Recovery Effect)
 * PHA (Pharmacology)   MCR (MP Cost Rate)    TCR (TP Charge Rate)
 * PDR (Phys Dmg Rate)  MDR (Magic Dmg Rate)  FDR (Floor Dmg Rate)
 * EXR (Exp Rate)
 *
 * -- Custom --
 * CRITDMG (Critical Damage Multiplier)
 *
 * ============================================================================
 *
 * == Script Commands ==
 * - Get Total Possessed JP (Current JP + Spent JP):
 * $gameActors.actor(actorId).getTotalPossessedJp()
 * Example: $gameActors.actor(1).getTotalPossessedJp() // Returns 150 (if Current JP is 50 and Spent JP is 100)
 *
 * - Get Current JP:
 * $gameActors.actor(actorId).getCurrentJp()
 * Example: $gameActors.actor(1).getCurrentJp() // Returns 50
 *
 * - Get Spent JP:
 * $gameActors.actor(actorId).getSpentJp()
 * Example: $gameActors.actor(1).getSpentJp() // Returns 100
 *
 * - Get Bonus Parameters from Stats:
 * $gameActors.actor(actorId).getBonusParameters()
 * Example: $gameActors.actor(1).getBonusParameters() // Returns { params: { mhp: 50, ... }, exParams: { hit: 0.1, ... }, spParams: { tgr: 0.05, ... } }
 *
 * - Get Current Stat Values:
 * $gameActors.actor(actorId).getCurrentStats()
 * Example: $gameActors.actor(1).getCurrentStats() // Returns { Vitality: 10, Strength: 15, ... }
 *
 * - Get Current Specific Stat Values:
 * $gameActors.actor(actorId)._customStats["Vitality"]
 *
 * - Reset All Stats and Bonus Parameters (Returns Spent JP):
 * $gameActors.actor(actorId).resetStatsDistribution()
 * Example: $gameActors.actor(1).resetStatsDistribution() // Resets all stats, bonus params, ex-params, sp-params, and returns spent JP to the actor
 *
 * == Compatibility ==
 * - This plugin is compatible with YEP_MainMenuManager. If using YEP_MainMenuManager, add the "Stats Distribution" option as follows:
 * 1. Open YEP_MainMenuManager plugin parameters.
 * 2. Find an unused "Menu X" slot (e.g., Menu 1).
 * 3. Set:
 * - Menu X Name: "Stats Distribution" (or your custom name)
 * - Menu X Symbol: "statsDistribution"
 * - Menu X Show: true
 * - Menu X Enabled: true
 * - Menu X Ext: ""
 * - Menu X Main Bind: this.commandPersonal.bind(this)
 * - Menu X Actor Bind: SceneManager.push(Scene_StatsDistribution)
 * 4. Save and test your game.
 * Note: If added via YEP_MainMenuManager, the default "Stats Distribution" option will not be displayed to avoid duplicates.
 *
 * - This plugin is compatible with YEP_MessageCore for word wrapping in the description window.
 *
 * == Dependencies ==
 * - This plugin requires a JP (Job Points) system to function, such as YEP_JobPoints by Yanfly. If no JP system is present, the plugin will assume 0 JP for all actors.
 * - This plugin modifies actor parameters (paramBase, xparam, sparam) to apply bonus stats. If other plugins modify these methods, you may need to adjust the plugin load order to ensure compatibility.
 * - JR_CritDmgMultiplierImplement.js (Required for critical damage display logic)
 *
 * == Table Styling ==
 * You can configure the background height, row spacing, and padding for the Parameters, Ex-Parameters, and Sp-Parameters windows using the plugin parameters below.
 *
 * @param Show In Menu
 * @desc Show the "Stats Distribution" option in the main menu? (Set to false if using YEP_MainMenuManager)
 * @type boolean
 * @default true
 *
 * @param Menu Option Text
 * @desc The text for the "Stats Distribution" option in the main menu.
 * @default Stats Distribution
 *
 * @param Left Column Layout
 * @desc Stats for bottom-left window. Supports: HIT EVA CRI CRITDMG CEV MEV MRF CNT HRG MRG TRG TGR GRD REC PHA MCR TCR PDR MDR FDR EXR
 * @default HIT EVA CRI CRITDMG CEV MEV MRF CNT HRG MRG
 *
 * @param Right Column Layout
 * @desc Stats for bottom-right window. Supports: HIT EVA CRI CRITDMG CEV MEV MRF CNT HRG MRG TRG TGR GRD REC PHA MCR TCR PDR MDR FDR EXR
 * @default TRG TGR GRD REC PHA MCR TCR PDR MDR FDR EXR
 *
 * @param Crit Dmg Label
 * @desc Label for Critical Damage Multiplier in the stats window.
 * @default Crit Dmg Mult
 *
 * @param Stat Names
 * @desc Names of the five stats (Vitality, Strength, Dexterity, Intelligence, Spirit).
 * @type struct<StatNames>
 * @default {"Vitality":"Vitality","Strength":"Strength","Dexterity":"Dexterity","Intelligence":"Intelligence","Spirit":"Spirit"}
 *
 * @param Stat Effects
 * @desc Effects of each stat on Parameters, Ex-Parameters, and Sp-Parameters.
 * @type struct<StatEffects>[]
 * @default []
 *
 * @param Stat Description Prefix
 * @desc Prefix text for stat descriptions (use [Stat] for the stat name).
 * @default Each [Stat] increases:
 *
 * @param Stat Description By Text
 * @desc The "by" text used in stat descriptions (e.g., "MHP by 10").
 * @default by
 *
 * @param Stat Description Help Text
 * @desc Additional help text to display in the Description Window below stat effects.
 * @default Use the arrows to increase or decrease stats.
 *
 * @param Leave Option Help Text
 * @desc Help text to display in the Description Window when selecting the "Leave" option.
 * @default Are you sure you want to leave without saving changes?
 *
 * @param Max Stat Values
 * @desc Maximum values for each stat.
 * @type struct<MaxStatValues>
 * @default {"Vitality":"100","Strength":"100","Dexterity":"100","Intelligence":"100","Spirit":"100"}
 *
 * @param JP Cost Per Stat
 * @desc JP cost to increase each stat by 1.
 * @type struct<JPCost>
 * @default {"Vitality":"10","Strength":"10","Dexterity":"10","Intelligence":"10","Spirit":"10"}
 *
 * @param Hold Delay
 * @desc Delay in seconds before holding a key or mouse click triggers continuous stat changes.
 * @type number
 * @decimals 1
 * @default 2.0
 *
 * @param Change Rate
 * @desc Number of frames between stat changes when holding a key or mouse (higher = slower).
 * @type number
 * @default 10
 *
 * @param Current JP Text
 * @desc Text for displaying Current JP in the Actor Info window.
 * @default Current JP:
 *
 * @param Spent JP Text
 * @desc Text for displaying Spent JP in the Actor Info window.
 * @default Spent JP:
 *
 * @param Confirm Text
 * @desc Text to display in the description window when highlighting the Confirm option.
 * @default Confirm changes?
 *
 * @param Level Text
 * @desc Text for displaying the actor's level in the Actor Info window (e.g., "Level:").
 * @default Level:
 *
 * @param Parameter Names
 * @desc Custom names for Parameters (MHP, MMP, ATK, DEF, MAT, MDF, AGI, LUK).
 * @type struct<ParameterNames>
 * @default {"MHP":"MHP","MMP":"MMP","ATK":"ATK","DEF":"DEF","MAT":"MAT","MDF":"MDF","AGI":"AGI","LUK":"LUK"}
 *
 * @param Show Parameters
 * @desc Choose which Parameters to show (MHP, MMP, ATK, DEF, MAT, MDF, AGI, LUK).
 * @type struct<ShowParameters>
 * @default {"MHP":"true","MMP":"true","ATK":"true","DEF":"true","MAT":"true","MDF":"true","AGI":"true","LUK":"true"}
 *
 * @param Ex-Parameter Names
 * @desc Custom names for Ex-Parameters (HIT, EVA, CRI, CEV, MEV, MRF, CNT, HRG, MRG, TRG).
 * @type struct<ExParameterNames>
 * @default {"HIT":"HIT","EVA":"EVA","CRI":"CRI","CEV":"CEV","MEV":"MEV","MRF":"MRF","CNT":"CNT","HRG":"HRG","MRG":"MRG","TRG":"TRG"}
 *
 * @param Show Ex-Parameters
 * @desc Choose which Ex-Parameters to show (HIT, EVA, CRI, CEV, MEV, MRF, CNT, HRG, MRG, TRG).
 * @type struct<ShowExParameters>
 * @default {"HIT":"true","EVA":"true","CRI":"true","CEV":"true","MEV":"true","MRF":"true","CNT":"true","HRG":"true","MRG":"true","TRG":"true"}
 *
 * @param Sp-Parameter Names
 * @desc Custom names for Sp-Parameters (TGR, GRD, REC, PHA, MCR, TCR, PDR, MDR, FDR, EXR).
 * @type struct<SpParameterNames>
 * @default {"TGR":"TGR","GRD":"GRD","REC":"REC","PHA":"PHA","MCR":"MCR","TCR":"TCR","PDR":"PDR","MDR":"MDR","FDR":"FDR","EXR":"EXR"}
 *
 * @param Show Sp-Parameters
 * @desc Choose which Sp-Parameters to show (TGR, GRD, REC, PHA, MCR, TCR, PDR, MDR, FDR, EXR).
 * @type struct<ShowSpParameters>
 * @default {"TGR":"TGR","GRD":"GRD","REC":"REC","PHA":"PHA","MCR":"MCR","TCR":"TCR","PDR":"PDR","MDR":"MDR","FDR":"FDR","EXR":"EXR"}
 *
 * @param Description Text Size
 * @desc Text size for the description window.
 * @type number
 * @default 28
 *
 * @param Parameters Text Size
 * @desc Text size for names and values in the Parameters window.
 * @type number
 * @default 28
 *
 * @param Ex-Parameters Text Size
 * @desc Text size for names and values in the Ex-Parameters window.
 * @type number
 * @default 28
 *
 * @param Sp-Parameters Text Size
 * @desc Text size for names and values in the Sp-Parameters window.
 * @type number
 * @default 28
 *
 * @param Background Height
 * @desc Height of the background for each row in the Parameters, Ex-Parameters, and Sp-Parameters windows (in pixels).
 * @type number
 * @default 44
 *
 * @param Parameters Row Width
 * @desc Width of the background for each row in the Parameters window (affects column width, in pixels).
 * @type number
 * @default 360
 *
 * @param Row Spacing
 * @desc Space between rows in the Parameters, Ex-Parameters, and Sp-Parameters windows (in pixels).
 * @type number
 * @default 1
 *
 * @param Name Left Padding
 * @desc Left padding for parameter names in pixels.
 * @type number
 * @default 20
 *
 * @param Value Right Padding
 * @desc Right padding for parameter values in pixels.
 * @type number
 * @default 40
 *
 * @param Parameters Left Column Padding
 * @desc Distance between the left column and the left edge of the Parameters window (in pixels).
 * @type number
 * @default 0
 *
 * @param Parameters Right Column Padding
 * @desc Distance between the right edge of the right column and the right edge of the Parameters window (in pixels).
 * @type number
 * @default 0
 *
 * @param Name Vertical Padding
 * @desc Top and bottom padding for parameter names in pixels.
 * @type struct<VerticalPadding>
 * @default {"Top":"8","Bottom":"8"}
 *
 * @param Value Vertical Padding
 * @desc Top and bottom padding for parameter values in pixels.
 * @type struct<VerticalPadding>
 * @default {"Top":"8","Bottom":"8"}
 *
 * @param Center Left Column
 * @desc Center the content vertically in the bottom-left window?
 * @type boolean
 * @default true
 *
 * @param Center Right Column
 * @desc Center the content vertically in the bottom-right window?
 * @type boolean
 * @default true
 */

/*~struct~StatNames:
 * @param Vitality
 * @desc Name of the Vitality stat.
 * @default Vitality
 *
 * @param Strength
 * @desc Name of the Strength stat.
 * @default Strength
 *
 * @param Dexterity
 * @desc Name of the Dexterity stat.
 * @default Dexterity
 *
 * @param Intelligence
 * @desc Name of the Intelligence stat.
 * @default Intelligence
 *
 * @param Spirit
 * @desc Name of the Spirit stat.
 * @default Spirit
 */

/*~struct~StatEffects:
 * @param Stat
 * @desc The stat this effect applies to.
 * @type select
 * @option Vitality
 * @option Strength
 * @option Dexterity
 * @option Intelligence
 * @option Spirit
 * @default Vitality
 *
 * @param Parameters
 * @desc Parameter effects (e.g., {"mhp":"10","def":"1"}).
 * @type struct<ParameterEffects>
 * @default {"mhp":"0","mmp":"0","atk":"0","def":"0","mat":"0","mdf":"0","agi":"0","luk":"0"}
 *
 * @param Ex-Parameters
 * @desc Ex-Parameter effects (e.g., {"hit":"0.01"}).
 * @type struct<ExParameterEffects>
 * @default {"hit":"0","eva":"0","cri":"0","cev":"0","mev":"0","mrf":"0","cnt":"0","hrg":"0","mrg":"0","trg":"0"}
 *
 * @param Sp-Parameters
 * @desc Sp-Parameter effects (e.g., {"tgr":"0.01"}).
 * @type struct<SpParameterEffects>
 * @default {"tgr":"0","grd":"0","rec":"0","pha":"0","mcr":"0","tcr":"0","pdr":"0","mdr":"0","fdr":"0","exr":"0"}
 */

/*~struct~ParameterEffects:
 * @param mhp
 * @desc Max HP increase per stat point.
 * @default 0
 * @param mmp
 * @desc Max MP increase per stat point.
 * @default 0
 * @param atk
 * @desc Attack increase per stat point.
 * @default 0
 * @param def
 * @desc Defense increase per stat point.
 * @default 0
 * @param mat
 * @desc Magic Attack increase per stat point.
 * @default 0
 * @param mdf
 * @desc Magic Defense increase per stat point.
 * @default 0
 * @param agi
 * @desc Agility increase per stat point.
 * @default 0
 * @param luk
 * @desc Luck increase per stat point.
 * @default 0
 */

/*~struct~ExParameterEffects:
 * @param hit
 * @desc Hit Rate increase per stat point.
 * @default 0
 * @param eva
 * @desc Evasion Rate increase per stat point.
 * @default 0
 * @param cri
 * @desc Critical Rate increase per stat point.
 * @default 0
 * @param cev
 * @desc Critical Evasion increase per stat point.
 * @default 0
 * @param mev
 * @desc Magic Evasion increase per stat point.
 * @default 0
 * @param mrf
 * @desc Magic Reflection increase per stat point.
 * @default 0
 * @param cnt
 * @desc Counter Rate increase per stat point.
 * @default 0
 * @param hrg
 * @desc HP Regen increase per stat point.
 * @default 0
 * @param mrg
 * @desc MP Regen increase per stat point.
 * @default 0
 * @param trg
 * @desc TP Regen increase per stat point.
 * @default 0
 */

/*~struct~SpParameterEffects:
 * @param tgr
 * @desc Target Rate increase per stat point.
 * @default 0
 * @param grd
 * @desc Guard Rate increase per stat point.
 * @default 0
 * @param rec
 * @desc Recovery Rate increase per stat point.
 * @default 0
 * @param pha
 * @desc Pharmacology increase per stat point.
 * @default 0
 * @param mcr
 * @desc MP Cost Rate increase per stat point.
 * @default 0
 * @param tcr
 * @desc TP Cost Rate increase per stat point.
 * @default 0
 * @param pdr
 * @desc Physical Damage Rate increase per stat point.
 * @default 0
 * @param mdr
 * @desc Magical Damage Rate increase per stat point.
 * @default 0
 * @param fdr
 * @desc Floor Damage Rate increase per stat point.
 * @default 0
 * @param exr
 * @desc Experience Rate increase per stat point.
 * @default 0
 */

/*~struct~MaxStatValues:
 * @param Vitality
 * @desc Maximum value for Vitality.
 * @default 100
 * @param Strength
 * @desc Maximum value for Strength.
 * @default 100
 * @param Dexterity
 * @desc Maximum value for Dexterity.
 * @default 100
 * @param Intelligence
 * @desc Maximum value for Intelligence.
 * @default 100
 * @param Spirit
 * @desc Maximum value for Spirit.
 * @default 100
 */

/*~struct~JPCost:
 * @param Vitality
 * @desc JP cost to increase Vitality by 1.
 * @default 10
 * @param Strength
 * @desc JP cost to increase Strength by 1.
 * @default 10
 * @param Dexterity
 * @desc JP cost to increase Dexterity by 1.
 * @default 10
 * @param Intelligence
 * @desc JP cost to increase Intelligence by 1.
 * @default 10
 * @param Spirit
 * @desc JP cost to increase Spirit by 1.
 * @default 10
 */

/*~struct~ParameterNames:
 * @param MHP
 * @desc Name for Max HP.
 * @default MHP
 * @param MMP
 * @desc Name for Max MP.
 * @default MMP
 * @param ATK
 * @desc Name for Attack.
 * @default ATK
 * @param DEF
 * @desc Name for Defense.
 * @default DEF
 * @param MAT
 * @desc Name for Magic Attack.
 * @default MAT
 * @param MDF
 * @desc Name for Magic Defense.
 * @default MDF
 * @param AGI
 * @desc Name for Agility.
 * @default AGI
 * @param LUK
 * @desc Name for Luck.
 * @default LUK
 */

/*~struct~ShowParameters:
 * @param MHP
 * @desc Show Max HP.
 * @type boolean
 * @default true
 * @param MMP
 * @desc Show Max MP.
 * @type boolean
 * @default true
 * @param ATK
 * @desc Show Attack.
 * @type boolean
 * @default true
 * @param DEF
 * @desc Show Defense.
 * @type boolean
 * @default true
 * @param MAT
 * @desc Show Magic Attack.
 * @type boolean
 * @default true
 * @param MDF
 * @desc Show Magic Defense.
 * @type boolean
 * @default true
 * @param AGI
 * @desc Show Agility.
 * @type boolean
 * @default true
 * @param LUK
 * @desc Show Luck.
 * @type boolean
 * @default true
 */

/*~struct~ExParameterNames:
 * @param HIT
 * @desc Name for Hit Rate.
 * @default HIT
 * @param EVA
 * @desc Name for Evasion Rate.
 * @default EVA
 * @param CRI
 * @desc Name for Critical Rate.
 * @default CRI
 * @param CEV
 * @desc Name for Critical Evasion.
 * @default CEV
 * @param MEV
 * @desc Name for Magic Evasion.
 * @default MEV
 * @param MRF
 * @desc Name for Magic Reflection.
 * @default MRF
 * @param CNT
 * @desc Name for Counter Rate.
 * @default CNT
 * @param HRG
 * @desc Name for HP Regen.
 * @default HRG
 * @param MRG
 * @desc Name for MP Regen.
 * @default MRG
 * @param TRG
 * @desc Name for TP Regen.
 * @default TRG
 */

/*~struct~ShowExParameters:
 * @param HIT
 * @desc Show Hit Rate.
 * @type boolean
 * @default true
 * @param EVA
 * @desc Show Evasion Rate.
 * @type boolean
 * @default true
 * @param CRI
 * @desc Show Critical Rate.
 * @type boolean
 * @default true
 * @param CEV
 * @desc Show Critical Evasion.
 * @type boolean
 * @default true
 * @param MEV
 * @desc Show Magic Evasion.
 * @type boolean
 * @default true
 * @param MRF
 * @desc Show Magic Reflection.
 * @type boolean
 * @default true
 * @param CNT
 * @desc Show Counter Rate.
 * @type boolean
 * @default true
 * @param HRG
 * @desc Show HP Regen.
 * @type boolean
 * @default true
 * @param MRG
 * @desc Show MP Regen.
 * @type boolean
 * @default true
 * @param TRG
 * @desc Show TP Regen.
 * @type boolean
 * @default true
 */

/*~struct~SpParameterNames:
 * @param TGR
 * @desc Name for Target Rate.
 * @default TGR
 * @param GRD
 * @desc Name for Guard Rate.
 * @default GRD
 * @param REC
 * @desc Name for Recovery Rate.
 * @default REC
 * @param PHA
 * @desc Name for Pharmacology.
 * @default PHA
 * @param MCR
 * @desc Name for MP Cost Rate.
 * @default MCR
 * @param TCR
 * @desc Name for TP Cost Rate.
 * @default TCR
 * @param PDR
 * @desc Name for Physical Damage Rate.
 * @default PDR
 * @param MDR
 * @desc Name for Magical Damage Rate.
 * @default MDR
 * @param FDR
 * @desc Name for Floor Damage Rate.
 * @default FDR
 * @param EXR
 * @desc Name for Experience Rate.
 * @default EXR
 */

/*~struct~ShowSpParameters:
 * @param TGR
 * @desc Show Target Rate.
 * @type boolean
 * @default true
 * @param GRD
 * @desc Show Guard Rate.
 * @type boolean
 * @default true
 * @param REC
 * @desc Show Recovery Rate.
 * @type boolean
 * @default true
 * @param PHA
 * @desc Show Pharmacology.
 * @type boolean
 * @default true
 * @param MCR
 * @desc Show MP Cost Rate.
 * @type boolean
 * @default true
 * @param TCR
 * @desc Show TP Cost Rate.
 * @type boolean
 * @default true
 * @param PDR
 * @desc Show Physical Damage Rate.
 * @type boolean
 * @default true
 * @param MDR
 * @desc Show Magical Damage Rate.
 * @type boolean
 * @default true
 * @param FDR
 * @desc Show Floor Damage Rate.
 * @type boolean
 * @default true
 * @param EXR
 * @desc Show Experience Rate.
 * @type boolean
 * @default true
 */

/*~struct~VerticalPadding:
 * @param Top
 * @desc Top padding in pixels.
 * @type number
 * @default 8
 *
 * @param Bottom
 * @desc Bottom padding in pixels.
 * @type number
 * @default 8
 */
 
(function() {
    window.$gameStatsDistribution = window.$gameStatsDistribution || {};

    var parameters = PluginManager.parameters('JR_StatsDistribution');
    var showInMenu = String(parameters['Show In Menu'] || 'true') === 'true';
    var menuOptionText = String(parameters['Menu Option Text'] || 'Stats Distribution');
    
    // v1.6: Centering Logic
    var centerLeftColumn = String(parameters['Center Left Column'] || 'true') === 'true';
    var centerRightColumn = String(parameters['Center Right Column'] || 'true') === 'true';

    // v1.5: Configurable Layouts
    var leftColumnLayout = String(parameters['Left Column Layout'] || 'HIT EVA CRI CRITDMG CEV MEV MRF CNT HRG MRG');
    var rightColumnLayout = String(parameters['Right Column Layout'] || 'TRG TGR GRD REC PHA MCR TCR PDR MDR FDR EXR');
    var critDmgLabel = String(parameters['Crit Dmg Label'] || 'Crit Dmg Mult');

    var holdDelaySeconds = Number(parameters['Hold Delay'] || 2.0);
    var holdDelayFrames = holdDelaySeconds * 60;
    var changeRate = Number(parameters['Change Rate'] || 10);
    var currentJpText = String(parameters['Current JP Text'] || 'Current JP:');
    var spentJpText = String(parameters['Spent JP Text'] || 'Spent JP:');
    var confirmText = String(parameters['Confirm Text'] || 'Confirm changes?');
    var levelText = String(parameters['Level Text'] || 'Level:');
    var statDescriptionPrefix = String(parameters['Stat Description Prefix'] || 'Each [Stat] increases:');
    var statDescriptionByText = String(parameters['Stat Description By Text'] || 'by');
    var statDescriptionHelpText = String(parameters['Stat Description Help Text'] || 'Use the arrows to increase or decrease stats.');
    var leaveOptionHelpText = String(parameters['Leave Option Help Text'] || 'Are you sure you want to leave without saving changes?');
    var descriptionTextSize = Number(parameters['Description Text Size'] || 28);
    var parametersTextSize = Number(parameters['Parameters Text Size'] || 28);
    var exParametersTextSize = Number(parameters['Ex-Parameters Text Size'] || 28);
    var spParametersTextSize = Number(parameters['Sp-Parameters Text Size'] || 28);
    var backgroundHeight = Number(parameters['Background Height'] || 44);
    var parametersRowWidth = Number(parameters['Parameters Row Width'] || 360);
    var rowSpacing = Number(parameters['Row Spacing'] || 1);
    var nameLeftPadding = Number(parameters['Name Left Padding'] || 20);
    var valueRightPadding = Number(parameters['Value Right Padding'] || 40);
    var parametersLeftColPadding = Number(parameters['Parameters Left Column Padding'] || 0);
    var parametersRightColPadding = Number(parameters['Parameters Right Column Padding'] || 0);
    var nameVerticalPadding = JSON.parse(parameters['Name Vertical Padding'] || '{"Top":"8","Bottom":"8"}');
    var valueVerticalPadding = JSON.parse(parameters['Value Vertical Padding'] || '{"Top":"8","Bottom":"8"}');
    var nameTopPadding = Number(nameVerticalPadding['Top'] || 8);
    var nameBottomPadding = Number(nameVerticalPadding['Bottom'] || 8);
    var valueTopPadding = Number(valueVerticalPadding['Top'] || 8);
    var valueBottomPadding = Number(valueVerticalPadding['Bottom'] || 8);

    var statNames = JSON.parse(parameters['Stat Names'] || '{}');
    var statEffects = JSON.parse(parameters['Stat Effects'] || '[]').map(e => JSON.parse(e));
    var maxStatValues = JSON.parse(parameters['Max Stat Values'] || '{}');
    var jpCostPerStat = JSON.parse(parameters['JP Cost Per Stat'] || '{}');
    var paramNames = JSON.parse(parameters['Parameter Names'] || '{}');
    var showParams = JSON.parse(parameters['Show Parameters'] || '{}');
    var exParamNames = JSON.parse(parameters['Ex-Parameter Names'] || '{}');
    var showExParams = JSON.parse(parameters['Show Ex-Parameters'] || '{}');
    var spParamNames = JSON.parse(parameters['Sp-Parameter Names'] || '{}');
    var showSpParams = JSON.parse(parameters['Show Sp-Parameters'] || '{}');

    // -------------------------------------------------------------------------
    // Helper Maps for Parameter IDs
    // -------------------------------------------------------------------------
    var EX_PARAMS_MAP = {
        'HIT': 0, 'EVA': 1, 'CRI': 2, 'CEV': 3, 'MEV': 4,
        'MRF': 5, 'CNT': 6, 'HRG': 7, 'MRG': 8, 'TRG': 9
    };
    
    var SP_PARAMS_MAP = {
        'TGR': 0, 'GRD': 1, 'REC': 2, 'PHA': 3, 'MCR': 4,
        'TCR': 5, 'PDR': 6, 'MDR': 7, 'FDR': 8, 'EXR': 9
    };

    statEffects.forEach(effect => {
        effect['Parameters'] = JSON.parse(effect['Parameters'] || '{}');
        effect['Ex-Parameters'] = JSON.parse(effect['Ex-Parameters'] || '{}');
        effect['Sp-Parameters'] = JSON.parse(effect['Sp-Parameters'] || '{}');
    });

    var statKeys = ['Vitality', 'Strength', 'Dexterity', 'Intelligence', 'Spirit'];

    var formatPercentage = function(value) {
        var num = Number(value);
        if (num === 0) return "0%";
        var str = (num * 100).toString();
        if (str.includes('.')) {
            var parts = str.split('.');
            var decimal = parts[1].replace(/0+$/, '');
            return decimal === '' ? parts[0] + '%' : parts[0] + '.' + decimal + '%';
        }
        return str + '%';
    };

    var statDescriptions = {};
    statKeys.forEach(stat => {
        var effect = statEffects.find(e => e.Stat === stat);
        if (!effect) return;

        var descriptionLines = [];
        var params = effect['Parameters'] || {};
        var exParams = effect['Ex-Parameters'] || {};
        var spParams = effect['Sp-Parameters'] || {};

        for (var param in params) {
            var value = Number(params[param]);
            if (value !== 0) {
                var paramName = paramNames[param.toUpperCase()] || param.toUpperCase();
                descriptionLines.push(`${paramName} ${statDescriptionByText} \\C[3]${value}\\C[0]`);
            }
        }

        for (var exParam in exParams) {
            var value = Number(exParams[exParam]);
            if (value !== 0) {
                var exParamName = exParamNames[exParam.toUpperCase()] || exParam.toUpperCase();
                var formattedValue = formatPercentage(value);
                descriptionLines.push(`${exParamName} ${statDescriptionByText} \\C[3]${formattedValue}\\C[0]`);
            }
        }

        for (var spParam in spParams) {
            var value = Number(spParams[spParam]);
            if (value !== 0) {
                var spParamName = spParamNames[spParam.toUpperCase()] || spParam.toUpperCase();
                var formattedValue = formatPercentage(value);
                var color = 3;
                if (spParam.toUpperCase() === 'MCR' && value < 0) {
                    color = 3;
                } else if (['TGR', 'PDR', 'MDR'].includes(spParam.toUpperCase()) && value > 0) {
                    color = 18;
                }
                descriptionLines.push(`${spParamName} ${statDescriptionByText} \\C[${color}]${formattedValue}\\C[0]`);
            }
        }

        var prefix = statDescriptionPrefix.replace('[Stat]', statNames[stat] || stat);
        var effectsText = descriptionLines.length > 0 ? `${prefix}\n${descriptionLines.join(', ')}.` : 'No effects defined.';
        statDescriptions[stat] = `${effectsText}\n${statDescriptionHelpText}`;
    });

    var preloadIcons = function() {
        ImageManager.loadSystem('IncreaseArrow');
        ImageManager.loadSystem('DecreaseArrow');
        ImageManager.loadSystem('DisabledIncreasedArrow');
        ImageManager.loadSystem('DisabledDecreasedArrow');
    };
    preloadIcons();

    var isYEPMenuManagerActive = typeof Yanfly !== 'undefined' && Yanfly.MMM;
    var isStatsDistributionInYEP = false;
    if (isYEPMenuManagerActive) {
        var yepParams = PluginManager.parameters('YEP_MainMenuManager');
        for (var i = 1; i <= 20; i++) {
            var menuSymbol = yepParams['Menu ' + i + ' Symbol'] || '';
            if (menuSymbol === 'statsDistribution') {
                isStatsDistributionInYEP = true;
                break;
            }
        }
    }

    var _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        $gameStatsDistribution = $gameStatsDistribution || {};
        for (var actorId = 1; actorId < $dataActors.length; actorId++) {
            if (!$gameActors.actor(actorId)) continue;
            if (!$gameStatsDistribution[actorId]) {
                $gameStatsDistribution[actorId] = {
                    stats: { Vitality: 0, Strength: 0, Dexterity: 0, Intelligence: 0, Spirit: 0 },
                    totalJpSpent: 0
                };
            }
        }
    };

    var _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        var contents = _DataManager_makeSaveContents.call(this);
        contents.statsDistribution = JSON.parse(JSON.stringify($gameStatsDistribution));
        return contents;
    };

    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        $gameStatsDistribution = contents.statsDistribution || {};
        for (var actorId = 1; actorId < $dataActors.length; actorId++) {
            if (!$gameActors.actor(actorId)) continue;
            if (!$gameStatsDistribution[actorId]) {
                $gameStatsDistribution[actorId] = {
                    stats: { Vitality: 0, Strength: 0, Dexterity: 0, Intelligence: 0, Spirit: 0 },
                    totalJpSpent: 0
                };
            }
            var actor = $gameActors.actor(actorId);
            actor._customStats = JSON.parse(JSON.stringify($gameStatsDistribution[actorId].stats));
            actor._totalJpSpent = $gameStatsDistribution[actorId].totalJpSpent || 0;
            actor._tempStats = { Vitality: 0, Strength: 0, Dexterity: 0, Intelligence: 0, Spirit: 0 };
            actor._tempJpSpent = 0;
            actor._originalJp = 0;
            actor._bonusParams = { mhp: 0, mmp: 0, atk: 0, def: 0, mat: 0, mdf: 0, agi: 0, luk: 0 };
            actor._bonusExParams = { hit: 0, eva: 0, cri: 0, cev: 0, mev: 0, mrf: 0, cnt: 0, hrg: 0, mrg: 0, trg: 0 };
            actor._bonusSpParams = { tgr: 0, grd: 0, rec: 0, pha: 0, mcr: 0, tcr: 0, pdr: 0, mdr: 0, fdr: 0, exr: 0 };
            actor._cachedBonuses = null;
            actor._lastStatsHash = null;
            var bonuses = actor.calculateBonusParams(actor._customStats);
            actor._bonusParams = bonuses.params;
            actor._bonusExParams = bonuses.exParams;
            actor._bonusSpParams = bonuses.spParams;
            actor.refresh();
        }
    };

    var _Game_Actor_initMembers = Game_Actor.prototype.initMembers;
    Game_Actor.prototype.initMembers = function() {
        _Game_Actor_initMembers.call(this);
        var actorId = this._actorId;
        if (!$gameStatsDistribution[actorId]) {
            $gameStatsDistribution[actorId] = {
                stats: { Vitality: 0, Strength: 0, Dexterity: 0, Intelligence: 0, Spirit: 0 },
                totalJpSpent: 0
            };
        }
        this._customStats = JSON.parse(JSON.stringify($gameStatsDistribution[actorId].stats));
        this._totalJpSpent = $gameStatsDistribution[actorId].totalJpSpent || 0;
        this._tempStats = { Vitality: 0, Strength: 0, Dexterity: 0, Intelligence: 0, Spirit: 0 };
        this._tempJpSpent = 0;
        this._originalJp = 0;
        this._bonusParams = { mhp: 0, mmp: 0, atk: 0, def: 0, mat: 0, mdf: 0, agi: 0, luk: 0 };
        this._bonusExParams = { hit: 0, eva: 0, cri: 0, cev: 0, mev: 0, mrf: 0, cnt: 0, hrg: 0, mrg: 0, trg: 0 };
        this._bonusSpParams = { tgr: 0, grd: 0, rec: 0, pha: 0, mcr: 0, tcr: 0, pdr: 0, mdr: 0, fdr: 0, exr: 0 };
        this._cachedBonuses = null;
        this._lastStatsHash = null;
        this._onRefreshCallback = null;
    };

    Game_Actor.prototype.setOnRefreshCallback = function(callback) {
        this._onRefreshCallback = callback;
    };

    Game_Actor.prototype.calculateBonusParams = function(stats) {
        var statsHash = JSON.stringify(stats);
        if (this._lastStatsHash === statsHash && this._cachedBonuses) {
            return this._cachedBonuses;
        }

        var bonusParams = { mhp: 0, mmp: 0, atk: 0, def: 0, mat: 0, mdf: 0, agi: 0, luk: 0 };
        var bonusExParams = { hit: 0, eva: 0, cri: 0, cev: 0, mev: 0, mrf: 0, cnt: 0, hrg: 0, mrg: 0, trg: 0 };
        var bonusSpParams = { tgr: 0, grd: 0, rec: 0, pha: 0, mcr: 0, tcr: 0, pdr: 0, mdr: 0, fdr: 0, exr: 0 };

        statKeys.forEach(stat => {
            var value = stats[stat] || 0;
            var effect = statEffects.find(e => e.Stat === stat);
            if (effect) {
                var params = effect['Parameters'] || {};
                var exParams = effect['Ex-Parameters'] || {};
                var spParams = effect['Sp-Parameters'] || {};
                for (var param in params) {
                    bonusParams[param] = Math.round((bonusParams[param] || 0) + (Number(params[param]) || 0) * value);
                }
                for (var exParam in exParams) {
                    bonusExParams[exParam] = (bonusExParams[exParam] || 0) + (Number(exParams[exParam]) || 0) * value;
                }
                for (var spParam in spParams) {
                    bonusSpParams[spParam] = (bonusSpParams[spParam] || 0) + (Number(spParams[spParam]) || 0) * value;
                }
            }
        });

        this._cachedBonuses = { params: bonusParams, exParams: bonusExParams, spParams: bonusSpParams };
        this._lastStatsHash = statsHash;
        return this._cachedBonuses;
    };

    var _Game_Actor_refresh = Game_Actor.prototype.refresh;
    Game_Actor.prototype.refresh = function() {
        this._cachedBonuses = null;
        _Game_Actor_refresh.call(this);
        var statsToUse = this._tempStats && Object.keys(this._tempStats).some(key => this._tempStats[key] !== 0) ? this._tempStats : this._customStats;
        var bonuses = this.calculateBonusParams(statsToUse);
        this._bonusParams = bonuses.params;
        this._bonusExParams = bonuses.exParams;
        this._bonusSpParams = bonuses.spParams;
        if (this._onRefreshCallback) {
            this._onRefreshCallback();
        }
    };

    Game_Actor.prototype.getTotalPossessedJp = function() {
        var currentJp = typeof this.jp === 'function' ? this.jp() : 0;
        return currentJp + (this._totalJpSpent + (this._tempJpSpent || 0));
    };

    Game_Actor.prototype.getCurrentJp = function() {
        return typeof this.jp === 'function' ? this.jp() : 0;
    };

    Game_Actor.prototype.getSpentJp = function() {
        return this._totalJpSpent + (this._tempJpSpent || 0);
    };

    Game_Actor.prototype.getBonusParameters = function() {
        return {
            params: JSON.parse(JSON.stringify(this._bonusParams || { mhp: 0, mmp: 0, atk: 0, def: 0, mat: 0, mdf: 0, agi: 0, luk: 0 })),
            exParams: JSON.parse(JSON.stringify(this._bonusExParams || { hit: 0, eva: 0, cri: 0, cev: 0, mev: 0, mrf: 0, cnt: 0, hrg: 0, mrg: 0, trg: 0 })),
            spParams: JSON.parse(JSON.stringify(this._bonusSpParams || { tgr: 0, grd: 0, rec: 0, pha: 0, mcr: 0, tcr: 0, pdr: 0, mdr: 0, fdr: 0, exr: 0 }))
        };
    };

    Game_Actor.prototype.getCurrentStats = function() {
        return JSON.parse(JSON.stringify(this._customStats || { Vitality: 0, Strength: 0, Dexterity: 0, Intelligence: 0, Spirit: 0 }));
    };

    Game_Actor.prototype.gainJpSafe = function(value) {
        if (typeof this.gainJp === 'function') {
            this.gainJp(value);
        }
    };

    Game_Actor.prototype.resetStatsDistribution = function() {
        var hpRate = this.hpRate();
        var mpRate = this.mpRate();
        var spentJp = this._totalJpSpent + (this._tempJpSpent || 0);

        for (var stat in this._customStats) {
            this._customStats[stat] = 0;
            this._tempStats[stat] = 0;
        }
        $gameStatsDistribution[this._actorId].stats = JSON.parse(JSON.stringify(this._customStats));

        this._totalJpSpent = 0;
        this._tempJpSpent = 0;
        $gameStatsDistribution[this._actorId].totalJpSpent = 0;
        this.gainJpSafe(spentJp);

        this._bonusParams = { mhp: 0, mmp: 0, atk: 0, def: 0, mat: 0, mdf: 0, agi: 0, luk: 0 };
        this._bonusExParams = { hit: 0, eva: 0, cri: 0, cev: 0, mev: 0, mrf: 0, cnt: 0, hrg: 0, mrg: 0, trg: 0 };
        this._bonusSpParams = { tgr: 0, grd: 0, rec: 0, pha: 0, mcr: 0, tcr: 0, pdr: 0, mdr: 0, fdr: 0, exr: 0 };
        this._cachedBonuses = null;
        this._lastStatsHash = null;

        this.refresh();

        this.setHp(Math.round(this.mhp * hpRate));
        this.setMp(Math.round(this.mmp * mpRate));
    };

    var _Game_Actor_paramBase = Game_Actor.prototype.paramBase;
    Game_Actor.prototype.paramBase = function(paramId) {
        var base = Math.floor(_Game_Actor_paramBase.call(this, paramId));
        var paramKey = ['mhp', 'mmp', 'atk', 'def', 'mat', 'mdf', 'agi', 'luk'][paramId];
        if (!this._bonusParams) {
            return base;
        }
        return base + (this._bonusParams[paramKey] || 0);
    };

    var _Game_Actor_xparam = Game_Actor.prototype.xparam;
    Game_Actor.prototype.xparam = function(xparamId) {
        var base = _Game_Actor_xparam.call(this, xparamId);
        var xparamKey = ['hit', 'eva', 'cri', 'cev', 'mev', 'mrf', 'cnt', 'hrg', 'mrg', 'trg'][xparamId];
        if (!this._bonusExParams) {
            return base;
        }
        return base + (this._bonusExParams[xparamKey] || 0);
    };

    var _Game_Actor_sparam = Game_Actor.prototype.sparam;
    Game_Actor.prototype.sparam = function(sparamId) {
        var base = _Game_Actor_sparam.call(this, sparamId);
        var sparamKey = ['tgr', 'grd', 'rec', 'pha', 'mcr', 'tcr', 'pdr', 'mdr', 'fdr', 'exr'][sparamId];
        if (!this._bonusSpParams) {
            return base;
        }
        return base + (this._bonusSpParams[sparamKey] || 0);
    };

    var _Scene_Menu_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function() {
        _Scene_Menu_createCommandWindow.call(this);
        if (showInMenu && !isStatsDistributionInYEP) {
            this._commandWindow.setHandler('statsDistribution', this.commandPersonal.bind(this));
        }
    };

    Scene_Menu.prototype.commandStatsDistribution = function() {
        SceneManager.push(Scene_StatsDistribution);
    };

    var _Scene_Menu_onPersonalOk = Scene_Menu.prototype.onPersonalOk;
    Scene_Menu.prototype.onPersonalOk = function() {
        if (this._commandWindow.currentSymbol() === 'statsDistribution') {
            this.commandStatsDistribution();
        } else {
            _Scene_Menu_onPersonalOk.call(this);
        }
    };

    var _Window_MenuCommand_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function() {
        _Window_MenuCommand_addOriginalCommands.call(this);
        if (showInMenu && !isStatsDistributionInYEP) {
            this.addCommand(menuOptionText, 'statsDistribution', true);
        }
    };

    function Scene_StatsDistribution() {
        this.initialize.apply(this, arguments);
    }

    Scene_StatsDistribution.prototype = Object.create(Scene_MenuBase.prototype);
    Scene_StatsDistribution.prototype.constructor = Scene_StatsDistribution;

    Scene_StatsDistribution.prototype.initialize = function() {
        Scene_MenuBase.prototype.initialize.call(this);
    };

    Scene_StatsDistribution.prototype.create = function() {
        Scene_MenuBase.prototype.create.call(this);
        this.createDescriptionWindow();
        this.createActorInfoWindow();
        this.createStatsWindow();
        this.createParametersWindow();
        this.createExParametersWindow();
        this.createSpParametersWindow();
        this._actorInfoWindow.setActor(this._actor);
        this._statsWindow.setActor(this._actor);
        this._parametersWindow.setActor(this._actor);
        this._exParametersWindow.setActor(this._actor);
        this._spParametersWindow.setActor(this._actor);
        this._actor.setOnRefreshCallback(this.onActorRefresh.bind(this));
        this._statsWindow.activate();
        this._statsWindow.select(0);
        this._descriptionWindow.setText(statDescriptions[statKeys[0]] || 'No description available.');
    };

    Scene_StatsDistribution.prototype.onActorRefresh = function() {
        this._parametersWindow.refresh();
        this._exParametersWindow.refresh();
        this._spParametersWindow.refresh();
        this._actorInfoWindow.refresh();
    };

    Scene_StatsDistribution.prototype.createDescriptionWindow = function() {
        this._descriptionWindow = new Window_StatsHelp(3);
        this._descriptionWindow.setTextSize(descriptionTextSize);
        this.addWindow(this._descriptionWindow);
    };

    Scene_StatsDistribution.prototype.createActorInfoWindow = function() {
        var x = 0;
        var y = this._descriptionWindow.height;
        var width = Graphics.boxWidth / 4;
        var height = Window_Base._faceHeight + (3 * new Window_Base().lineHeight()) + 20;
        this._actorInfoWindow = new Window_ActorInfo(x, y, width, height);
        this.addWindow(this._actorInfoWindow);
    };

    Scene_StatsDistribution.prototype.createStatsWindow = function() {
        var x = 0;
        var y = this._descriptionWindow.height + this._actorInfoWindow.height;
        var width = Graphics.boxWidth / 4;
        var height = Graphics.boxHeight - this._descriptionWindow.height - this._actorInfoWindow.height;
        this._statsWindow = new Window_Stats(x, y, width, height, this);
        this._statsWindow.setHandler('ok', this.onStatsOk.bind(this));
        this._statsWindow.setHandler('cancel', this.onStatsCancel.bind(this));
        this.addWindow(this._statsWindow);
    };

    Scene_StatsDistribution.prototype.createParametersWindow = function() {
        var x = this._actorInfoWindow.width;
        var y = this._descriptionWindow.height;
        var width = Graphics.boxWidth - this._actorInfoWindow.width;
        var paramKeysLeft = ['MHP', 'ATK', 'MAT', 'AGI'];
        var paramKeysRight = ['MMP', 'DEF', 'MDF', 'LUK'];
        var maxRows = Math.max(paramKeysLeft.length, paramKeysRight.length);
        var height = (maxRows * backgroundHeight) + ((maxRows - 1) * rowSpacing) + 2 * this._descriptionWindow.padding;
        this._parametersWindow = new Window_Parameters(x, y, width, height);
        this.addWindow(this._parametersWindow);
    };

    Scene_StatsDistribution.prototype.createExParametersWindow = function() {
        var x = this._actorInfoWindow.width;
        var y = this._descriptionWindow.height + this._parametersWindow.height;
        var width = (Graphics.boxWidth - this._actorInfoWindow.width) / 2;
        var height = Graphics.boxHeight - this._descriptionWindow.height - this._parametersWindow.height;
        this._exParametersWindow = new Window_ExParameters(x, y, width, height);
        this.addWindow(this._exParametersWindow);
    };

    Scene_StatsDistribution.prototype.createSpParametersWindow = function() {
        var x = this._actorInfoWindow.width + this._exParametersWindow.width;
        var y = this._descriptionWindow.height + this._parametersWindow.height;
        var width = (Graphics.boxWidth - this._actorInfoWindow.width) / 2;
        var height = Graphics.boxHeight - this._descriptionWindow.height - this._parametersWindow.height;
        this._spParametersWindow = new Window_SpParameters(x, y, width, height);
        this.addWindow(this._spParametersWindow);
    };

    Scene_StatsDistribution.prototype.onStatsOk = function() {
        var index = this._statsWindow.index();
        if (index < statKeys.length) {
            this._statsWindow.activate();
        } else if (index === statKeys.length && this._statsWindow.hasStatChanges()) {
            this._statsWindow.applyChanges();
            this._statsWindow.activate();
        } else {
            this.onStatsCancel();
        }
    };

    Scene_StatsDistribution.prototype.onStatsCancel = function() {
        this._statsWindow.resetTempStats();
        this.popScene();
    };

    function Window_StatsHelp() {
        this.initialize.apply(this, arguments);
    }

    Window_StatsHelp.prototype = Object.create(Window_Base.prototype);
    Window_StatsHelp.prototype.constructor = Window_StatsHelp;

    Window_StatsHelp.prototype.initialize = function(numLines) {
        var width = Graphics.boxWidth;
        var height = this.fittingHeight(numLines || 3);
        Window_Base.prototype.initialize.call(this, 0, 0, width, height);
        this._text = '';
        this._customTextSize = descriptionTextSize;
    };

    Window_StatsHelp.prototype.setTextSize = function(size) {
        this._customTextSize = size;
    };

    Window_StatsHelp.prototype.setText = function(text) {
        var formattedText = text;
        // Apply WordWrap before comparison to prevent the infinite refresh loop
        if (Imported.YEP_MessageCore && $gameSystem.wordWrap() && !formattedText.includes('<WordWrap>')) {
            formattedText = '<WordWrap>' + formattedText;
        }

        if (this._text !== formattedText) {
            this._text = formattedText;
            this.refresh();
        }
    };

    Window_StatsHelp.prototype.clear = function() {
        this.setText('');
    };

    Window_StatsHelp.prototype.setItem = function(item) {
        this.setText(item ? item.description : '');
    };

    Window_StatsHelp.prototype.refresh = function() {
        this.contents.clear();
        this.changeFontSize(this._customTextSize);
        this.drawTextEx(this._text, this.textPadding(), 0);
        this.resetFontSize();
    };

    Window_StatsHelp.prototype.changeFontSize = function(size) {
        this.contents.fontSize = size;
    };

    Window_StatsHelp.prototype.resetFontSize = function() {
        this.contents.fontSize = this.standardFontSize();
    };

    Window_StatsHelp.prototype.standardFontFace = function() {
        return $gameSystem.getMessageFontName ? $gameSystem.getMessageFontName() : Window_Base.prototype.standardFontFace.call(this);
    };

    Window_StatsHelp.prototype.standardFontSize = function() {
        return $gameSystem.getMessageFontSize ? $gameSystem.getMessageFontSize() : Window_Base.prototype.standardFontSize.call(this);
    };

    function Window_ActorInfo() {
        this.initialize.apply(this, arguments);
    }

    Window_ActorInfo.prototype = Object.create(Window_Base.prototype);
    Window_ActorInfo.prototype.constructor = Window_ActorInfo;

    Window_ActorInfo.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._actor = null;
    };

    Window_ActorInfo.prototype.setActor = function(actor) {
        this._actor = actor;
        this.refresh();
    };

    Window_ActorInfo.prototype.adjustFontSizeForText = function(text, maxWidth) {
        this.contents.fontSize = this.standardFontSize();
        while (this.textWidth(text) > maxWidth && this.contents.fontSize > 12) this.contents.fontSize -= 2;
    };

    Window_ActorInfo.prototype.refresh = function() {
        this.contents.clear();
        if (!this._actor) return;

        var faceWidth = Window_Base._faceWidth;
        var faceHeight = Window_Base._faceHeight;
        var bitmap = ImageManager.loadFace(this._actor.faceName());
        bitmap.addLoadListener(() => {
            this.drawFace(this._actor.faceName(), this._actor.faceIndex(), 0, this.padding, faceWidth, faceHeight);
        });

        var textX = faceWidth + 10;
        var textWidth = this.contentsWidth() - textX;
        var textY = this.padding;

        this.adjustFontSizeForText(this._actor.name(), textWidth);
        this.drawText(this._actor.name(), textX, textY, textWidth, 'left');
        this.resetFontSize();

        textY += this.lineHeight();
        this.adjustFontSizeForText(this._actor.currentClass().name, textWidth);
        this.drawText(this._actor.currentClass().name, textX, textY, textWidth, 'left');
        this.resetFontSize();

        textY += this.lineHeight();
        var levelDisplay = levelText + ' ' + this._actor.level;
        this.adjustFontSizeForText(levelDisplay, textWidth);
        this.drawText(levelDisplay, textX, textY, textWidth, 'left');
        this.resetFontSize();

        textY = faceHeight + this.padding + 5;
        var jpTextLeft = currentJpText + ' ' + this._actor.getCurrentJp();
        this.adjustFontSizeForText(jpTextLeft, this.contentsWidth());
        this.changeTextColor(this.textColor(29));
        this.drawText(jpTextLeft, 0, textY, this.contentsWidth(), 'center');
        this.resetTextColor();
        this.resetFontSize();

        textY += this.lineHeight();
        var jpTextRight = spentJpText + ' ' + this._actor.getSpentJp();
        this.adjustFontSizeForText(jpTextRight, this.contentsWidth());
        this.changeTextColor(this.textColor(18));
        this.drawText(jpTextRight, 0, textY, this.contentsWidth(), 'center');
        this.resetTextColor();
        this.resetFontSize();
    };

    Window_ActorInfo.prototype.changeFontSize = function(size) {
        this.contents.fontSize = size;
    };

    Window_ActorInfo.prototype.resetFontSize = function() {
        this.contents.fontSize = this.standardFontSize();
    };
    function Window_Stats() {
        this.initialize.apply(this, arguments);
    }

    Window_Stats.prototype = Object.create(Window_Selectable.prototype);
    Window_Stats.prototype.constructor = Window_Stats;

    Window_Stats.prototype.initialize = function(x, y, width, height, scene) {
        Window_Selectable.prototype.initialize.call(this, x, y, width, height);
        this._actor = null;
        this._scene = scene;
        this._originalStats = null;
        this._jpSpent = 0;
        this._lastInput = { right: false, left: false };
        this._clickFeedback = { plus: {}, minus: {} };
        this._holdTimer = { right: 0, left: 0, plus: {}, minus: {} };
        this._isHolding = { right: false, left: false, plus: {}, minus: {} };
        this._changeCounter = { right: 0, left: 0, plus: {}, minus: {} };
        this._isPressed = { plus: {}, minus: {} };
    };

    Window_Stats.prototype.setActor = function(actor) {
        this._actor = actor;
        if (this._actor) {
            var actorId = this._actor._actorId;
            if (!$gameStatsDistribution[actorId]) {
                $gameStatsDistribution[actorId] = {
                    stats: { Vitality: 0, Strength: 0, Dexterity: 0, Intelligence: 0, Spirit: 0 },
                    totalJpSpent: 0
                };
            }
            this._actor._tempStats = JSON.parse(JSON.stringify($gameStatsDistribution[actorId].stats));
            this._actor._totalJpSpent = $gameStatsDistribution[actorId].totalJpSpent || 0;
            this._actor._tempJpSpent = 0;
            this._actor._originalJp = this._actor.getCurrentJp();
            this._originalStats = JSON.parse(JSON.stringify($gameStatsDistribution[actorId].stats));
            this._jpSpent = 0;
            statKeys.forEach((stat, index) => {
                this._clickFeedback.plus[index] = false;
                this._clickFeedback.minus[index] = false;
                this._holdTimer.plus[index] = 0;
                this._holdTimer.minus[index] = 0;
                this._isHolding.plus[index] = false;
                this._isHolding.minus[index] = false;
                this._changeCounter.plus[index] = 0;
                this._changeCounter.minus[index] = 0;
                this._isPressed.plus[index] = false;
                this._isPressed.minus[index] = false;
            });
            var bonuses = this._actor.calculateBonusParams(this._actor._tempStats);
            this._actor._bonusParams = bonuses.params;
            this._actor._bonusExParams = bonuses.exParams;
            this._actor._bonusSpParams = bonuses.spParams;
        }
        this.refresh();
    };

    Window_Stats.prototype.maxItems = function() {
        return statKeys.length + 2;
    };

    Window_Stats.prototype.itemRect = function(index) {
        var rect = Window_Selectable.prototype.itemRect.call(this, index);
        if (index < statKeys.length) {
            rect.width = this.contentsWidth();
        } else {
            var lineHeight = this.lineHeight();
            var statHeight = statKeys.length * lineHeight;
            rect.y = statHeight + (index - statKeys.length) * lineHeight;
            rect.width = this.contentsWidth();
        }
        return rect;
    };

    Window_Stats.prototype.drawCustomIcon = function(imageName, x, y, type, index) {
        var bitmap = ImageManager.loadSystem(imageName);
        var pw = Window_Base._iconWidth;
        var ph = Window_Base._iconHeight;
        var offsetY = (type === 'plus' && this._isPressed.plus[index]) || (type === 'minus' && this._isPressed.minus[index]) ? 4 : 0;
        bitmap.addLoadListener(() => {
            this.contents.blt(bitmap, 0, 0, pw, ph, x, y + offsetY, pw, ph);
        });
    };

    Window_Stats.prototype.canIncreaseStat = function(stat) {
        return this._actor && this._actor._tempStats[stat] < maxStatValues[stat] && this._actor.getCurrentJp() >= Number(jpCostPerStat[stat]);
    };

    Window_Stats.prototype.canDecreaseStat = function(stat) {
        return this._actor && this._actor._tempStats[stat] > this._actor._customStats[stat];
    };

    Window_Stats.prototype.hasStatChanges = function() {
        return this._actor && statKeys.some(stat => this._actor._tempStats[stat] !== this._actor._customStats[stat]);
    };

    Window_Stats.prototype.drawItem = function(index) {
        var rect = this.itemRectForText(index);
        if (index < statKeys.length) {
            var stat = statKeys[index];
            var current = this._actor ? this._actor._tempStats[stat] : 0;
            var original = this._actor ? this._originalStats[stat] : 0;
            var max = maxStatValues[stat];
            var y = index * this.lineHeight();
            this.changeFontSize(18);
            this.drawText(statNames[stat] || stat, rect.x, y, this.textWidth(statNames[stat]));
            var iconWidth = Window_Base._iconWidth;
            var spacing = 8;
            var fixedValueWidth = this.textWidth('100/100');
            var groupWidth = iconWidth + spacing + fixedValueWidth + spacing + iconWidth;
            var startX = this.contentsWidth() - groupWidth - this.padding;
            var iconY = y + (this.lineHeight() - Window_Base._iconHeight) / 2;
            var canDecrease = this.canDecreaseStat(stat);
            var canIncrease = this.canIncreaseStat(stat);
            this.changeTextColor(this._clickFeedback.minus[index] ? this.textColor(2) : this.normalColor());
            this.drawCustomIcon(canDecrease ? 'DecreaseArrow' : 'DisabledDecreasedArrow', startX, iconY, 'minus', index);
            if (current > original) this.changeTextColor(this.textColor(3));
            else this.resetTextColor();
            this.drawText(current + '/' + max, startX + iconWidth + spacing, y, fixedValueWidth, 'center');
            this.changeTextColor(this._clickFeedback.plus[index] ? this.textColor(2) : this.normalColor());
            this.drawCustomIcon(canIncrease ? 'IncreaseArrow' : 'DisabledIncreasedArrow', startX + iconWidth + spacing + fixedValueWidth + spacing, iconY, 'plus', index);
            this.resetFontSize();
            this.resetTextColor();
        } else {
            var text = index === statKeys.length ? 'Confirm' : 'Leave';
            var y = (statKeys.length + (index - statKeys.length)) * this.lineHeight();
            if (index === statKeys.length && this.hasStatChanges()) this.changeTextColor(this.textColor(16));
            else if (index === statKeys.length) this.changeTextColor(this.textColor(8));
            else this.resetTextColor();
            this.drawText(text, rect.x, y, rect.width, 'center');
        }
    };

    Window_Stats.prototype.changeFontSize = function(size) {
        this.contents.fontSize = size;
    };

    Window_Stats.prototype.resetFontSize = function() {
        this.contents.fontSize = this.standardFontSize();
    };

    Window_Stats.prototype.changeStat = function(amount) {
        if (this.index() >= statKeys.length || !this._actor) return;
        var stat = statKeys[this.index()];
        var current = this._actor._tempStats[stat];
        var confirmed = this._actor._customStats[stat];
        var max = maxStatValues[stat];
        var jpCost = Number(jpCostPerStat[stat]);
        var newValue = current + amount;
        
        if (amount < 0 && newValue < confirmed) return;
        
        if (newValue >= 0 && newValue <= max && (this._actor.getCurrentJp() >= jpCost * amount || amount < 0)) {
            var hpRate = this._actor.hpRate();
            var mpRate = this._actor.mpRate();
            
            this._actor._tempStats[stat] = newValue;
            this._actor.gainJpSafe(-jpCost * amount);
            this._actor._tempJpSpent += jpCost * amount;
            this._jpSpent += jpCost * amount;
            
            var bonuses = this._actor.calculateBonusParams(this._actor._tempStats);
            this._actor._bonusParams = bonuses.params;
            this._actor._bonusExParams = bonuses.exParams;
            this._actor._bonusSpParams = bonuses.spParams;
            
            if (typeof this._actor.clearParamCache === 'function') this._actor.clearParamCache();
            if (typeof this._actor.clearParamPlus === 'function') this._actor.clearParamPlus();
            if (typeof this._actor.clearXParamCache === 'function') this._actor.clearXParamCache();
            if (typeof this._actor.clearSParamCache === 'function') this._actor.clearSParamCache();
            
            if (this._actor._paramCache) this._actor._paramCache = {};
            if (this._actor._baseParamCache) this._actor._baseParamCache = {};
            if (this._actor._paramPlusCache) this._actor._paramPlusCache = {};
            if (this._actor._paramRateCache) this._actor._paramRateCache = {};
            if (this._actor._paramFlatCache) this._actor._paramFlatCache = {};
            if (this._actor._paramBuffRateCache) this._actor._paramBuffRateCache = {};
            
            this._actor.setHp(Math.round(this._actor.mhp * hpRate));
            this._actor.setMp(Math.round(this._actor.mmp * mpRate));
            
            this.refresh();
            this._scene._parametersWindow.refresh();
            this._scene._exParametersWindow.refresh();
            this._scene._spParametersWindow.refresh();
            this._scene._actorInfoWindow.refresh();
        }
    };

    Window_Stats.prototype.update = function() {
        Window_Selectable.prototype.update.call(this);
        this.updateTouch();

        if (!TouchInput.isPressed() && !TouchInput.isTriggered()) {
            var wasPressed = false;
            statKeys.forEach((_, index) => {
                if (this._isPressed.plus[index] || this._isPressed.minus[index]) {
                    wasPressed = true;
                    this._isPressed.plus[index] = false;
                    this._isPressed.minus[index] = false;
                    this._clickFeedback.plus[index] = false;
                    this._clickFeedback.minus[index] = false;
                    this._holdTimer.plus[index] = 0;
                    this._holdTimer.minus[index] = 0;
                    this._isHolding.plus[index] = false;
                    this._isHolding.minus[index] = false;
                    this._changeCounter.plus[index] = 0;
                    this._changeCounter.minus[index] = 0;
                }
            });
            if (wasPressed) {
                this.refresh();
            }
        }

        if (!this.isOpenAndActive() || !this._actor) return;
        if (Input.isTriggered('right') && this.index() < statKeys.length && !this._lastInput.right) {
            this._lastInput.right = true;
            this.changeStat(1);
            SoundManager.playCursor();
        }
        if (!Input.isPressed('right')) {
            this._lastInput.right = false;
            this._holdTimer.right = 0;
            this._isHolding.right = false;
            this._changeCounter.right = 0;
        } else if (Input.isPressed('right') && this.index() < statKeys.length) {
            this._holdTimer.right++;
            if (this._holdTimer.right >= holdDelayFrames && this._changeCounter.right++ >= changeRate) {
                this.changeStat(1);
                SoundManager.playCursor();
                this._changeCounter.right = 0;
            }
        }
        if (Input.isTriggered('left') && this.index() < statKeys.length && !this._lastInput.left) {
            this._lastInput.left = true;
            this.changeStat(-1);
            SoundManager.playCursor();
        }
        if (!Input.isPressed('left')) {
            this._lastInput.left = false;
            this._holdTimer.left = 0;
            this._isHolding.left = false;
            this._changeCounter.left = 0;
        } else if (Input.isPressed('left') && this.index() < statKeys.length) {
            this._holdTimer.left++;
            if (this._holdTimer.left >= holdDelayFrames && this._changeCounter.left++ >= changeRate) {
                this.changeStat(-1);
                SoundManager.playCursor();
                this._changeCounter.left = 0;
            }
        }
        if (TouchInput.isCancelled()) this.processCancel();
        if (this._lastHelpIndex !== this.index()) {
            this._lastHelpIndex = this.index();
            
            if (this.index() < statKeys.length) {
                this._scene._descriptionWindow.setText(statDescriptions[statKeys[this.index()]] || 'No description available.');
            } else if (this.index() === statKeys.length) {
                this._scene._descriptionWindow.setText(confirmText);
            } else {
                this._scene._descriptionWindow.setText(leaveOptionHelpText);
            }
        }
    };

    Window_Stats.prototype.updateTouch = function() {
        if (!this.isOpenAndActive()) return;
        if (TouchInput.isReleased()) {
            statKeys.forEach((_, index) => {
                this._isPressed.plus[index] = false;
                this._isPressed.minus[index] = false;
                this._clickFeedback.plus[index] = false;
                this._clickFeedback.minus[index] = false;
                this._holdTimer.plus[index] = 0;
                this._holdTimer.minus[index] = 0;
                this._isHolding.plus[index] = false;
                this._isHolding.minus[index] = false;
                this._changeCounter.plus[index] = 0;
                this._changeCounter.minus[index] = 0;
            });
            this.refresh();
        }
    };

    Window_Stats.prototype.processTouch = function() {
        if (!this.isOpenAndActive() || !this._actor) return;

        if (TouchInput.isReleased()) {
            statKeys.forEach((_, index) => {
                this._isPressed.plus[index] = false;
                this._isPressed.minus[index] = false;
                this._clickFeedback.plus[index] = false;
                this._clickFeedback.minus[index] = false;
                this._holdTimer.plus[index] = 0;
                this._holdTimer.minus[index] = 0;
                this._isHolding.plus[index] = false;
                this._isHolding.minus[index] = false;
                this._changeCounter.plus[index] = 0;
                this._changeCounter.minus[index] = 0;
            });
            this.refresh();
            return;
        }

        var x = this.canvasToLocalX(TouchInput.x);
        var y = this.canvasToLocalY(TouchInput.y);
        var lineHeight = this.lineHeight();
        var hitIndex = Math.floor((y - this.padding) / lineHeight);
        if (hitIndex >= 0 && hitIndex < statKeys.length) {
            var stat = statKeys[hitIndex];
            var startY = hitIndex * lineHeight + this.padding;
            var iconWidth = Window_Base._iconWidth;
            var spacing = 8;
            var fixedValueWidth = this.textWidth('100/100');
            var groupWidth = iconWidth + spacing + fixedValueWidth + spacing + iconWidth;
            var startX = this.contentsWidth() - groupWidth - this.padding;
            var minusX = startX + 48;
            var plusX = startX + iconWidth + spacing + fixedValueWidth + spacing + 20;
            
            if (x >= minusX && x <= minusX + iconWidth && y >= startY && y <= startY + lineHeight && this.canDecreaseStat(stat)) {
                this.select(hitIndex);
                if (TouchInput.isPressed()) {
                    if (!this._isPressed.minus[hitIndex]) {
                        this._clickFeedback.minus[hitIndex] = true;
                        this._isPressed.minus[hitIndex] = true;
                        this.refresh();
                    }
                    if (TouchInput.isTriggered()) { this.changeStat(-1); SoundManager.playCursor(); }
                    if (this._holdTimer.minus[hitIndex]++ >= holdDelayFrames && this._changeCounter.minus[hitIndex]++ >= changeRate) {
                        this.changeStat(-1);
                        SoundManager.playCursor();
                        this._changeCounter.minus[hitIndex] = 0;
                    }
                }
                return;
            }
            if (x >= plusX && x <= plusX + iconWidth && y >= startY && y <= startY + lineHeight && this.canIncreaseStat(stat)) {
                this.select(hitIndex);
                if (TouchInput.isPressed()) {
                    if (!this._isPressed.plus[hitIndex]) {
                        this._clickFeedback.plus[hitIndex] = true;
                        this._isPressed.plus[hitIndex] = true;
                        this.refresh();
                    }
                    if (TouchInput.isTriggered()) { this.changeStat(1); SoundManager.playCursor(); }
                    if (this._holdTimer.plus[hitIndex]++ >= holdDelayFrames && this._changeCounter.plus[hitIndex]++ >= changeRate) {
                        this.changeStat(1);
                        SoundManager.playCursor();
                        this._changeCounter.plus[hitIndex] = 0;
                    }
                }
                return;
            }
            if (x >= 0 && x <= this.textWidth(statNames[stat]) + 20 && y >= startY && y <= startY + lineHeight && TouchInput.isTriggered()) {
                this.select(hitIndex);
                this.refresh();
                return;
            }
        }
        var statHeight = statKeys.length * lineHeight + this.padding;
        if (y >= statHeight && y <= statHeight + lineHeight && x >= 0 && x <= this.contentsWidth() && TouchInput.isTriggered()) {
            if (this.index() === statKeys.length && this.hasStatChanges()) {
                this.applyChanges();
                SoundManager.playOk();
            } else if (this.index() !== statKeys.length) {
                this.select(statKeys.length);
            } else {
                SoundManager.playBuzzer();
            }
            this.refresh();
            return;
        }
        if (y >= statHeight + lineHeight && y <= statHeight + 2 * lineHeight && x >= 0 && x <= this.contentsWidth() && TouchInput.isTriggered()) {
            if (this.index() === statKeys.length + 1) {
                this.processCancel();
                SoundManager.playCancel();
            } else {
                this.select(statKeys.length + 1);
                this._scene._descriptionWindow.setText(leaveOptionHelpText);
            }
            this.refresh();
        }
    };

    Window_Stats.prototype.applyChanges = function() {
        if (!this._actor) return;
        var hpRate = this._actor.hpRate();
        var mpRate = this._actor.mpRate();
        for (var stat in this._actor._tempStats) this._actor._customStats[stat] = this._actor._tempStats[stat];
        $gameStatsDistribution[this._actor._actorId].stats = JSON.parse(JSON.stringify(this._actor._customStats));
        this._actor._totalJpSpent += this._actor._tempJpSpent;
        $gameStatsDistribution[this._actor._actorId].totalJpSpent = this._actor._totalJpSpent;
        this._jpSpent = 0;
        this._actor._tempJpSpent = 0;
        var bonuses = this._actor.calculateBonusParams(this._actor._customStats);
        this._actor._bonusParams = bonuses.params;
        this._actor._bonusExParams = bonuses.exParams;
        this._actor._bonusSpParams = bonuses.spParams;
        this._actor.refresh();
        this._actor.setHp(Math.round(this._actor.mhp * hpRate));
        this._actor.setMp(Math.round(this._actor.mmp * mpRate));
        this._originalStats = JSON.parse(JSON.stringify(this._actor._customStats));
        this.refresh();
        this._scene._parametersWindow.resetOriginalValues();
        this._scene._exParametersWindow.resetOriginalValues();
        this._scene._spParametersWindow.resetOriginalValues();
        this._scene._parametersWindow.refresh();
        this._scene._exParametersWindow.refresh();
        this._scene._spParametersWindow.refresh();
        this._scene._actorInfoWindow.refresh();
    };

    Window_Stats.prototype.resetTempStats = function() {
        if (!this._actor) return;
        var hpRate = this._actor.hpRate();
        var mpRate = this._actor.mpRate();
        this._actor.gainJpSafe(this._jpSpent);
        this._actor._tempStats = JSON.parse(JSON.stringify(this._actor._customStats));
        this._actor._tempJpSpent = 0;
        this._jpSpent = 0;
        var bonuses = this._actor.calculateBonusParams(this._actor._customStats);
        this._actor._bonusParams = bonuses.params;
        this._actor._bonusExParams = bonuses.exParams;
        this._actor._bonusSpParams = bonuses.spParams;
        this._actor.refresh();
        this._actor.setHp(Math.round(this._actor.mhp * hpRate));
        this._actor.setMp(Math.round(this._actor.mmp * mpRate));
        this.refresh();
        this._scene._parametersWindow.refresh();
        this._scene._exParametersWindow.refresh();
        this._scene._spParametersWindow.refresh();
        this._scene._actorInfoWindow.refresh();
    };
    function Window_Parameters() {
        this.initialize.apply(this, arguments);
    }

    Window_Parameters.prototype = Object.create(Window_Base.prototype);
    Window_Parameters.prototype.constructor = Window_Parameters;

    Window_Parameters.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._actor = null;
        this._originalParams = null;
    };

	Window_Parameters.prototype.setActor = function(actor) {
		this._actor = actor;
		if (this._actor) this._originalParams = Array(8).fill(0).map((_, i) => this._actor.param(i));
		this.refresh();
	};
	
	Window_Parameters.prototype.resetOriginalValues = function() {
		if (this._actor) this._originalParams = Array(8).fill(0).map((_, i) => this._actor.param(i));
	};

    Window_Parameters.prototype.drawDarkRect = function(dx, dy, dw, dh) {
        var color = this.gaugeBackColor();
        this.changePaintOpacity(false);
        this.contents.fillRect(dx + 1, dy + 1, dw - 2, dh - 2, color);
        this.changePaintOpacity(true);
    };

    Window_Parameters.prototype.lineHeight = function() {
        return backgroundHeight;
    };

    Window_Parameters.prototype.rowSpacing = function() {
        return rowSpacing;
    };

    Window_Parameters.prototype.refresh = function() {
		this.contents.clear();
		if (!this._actor) return;
	
		var paramKeysLeft = ['MHP', 'ATK', 'MAT', 'AGI'];
		var paramKeysRight = ['MMP', 'DEF', 'MDF', 'LUK'];
		var visibleParamsLeft = paramKeysLeft.filter(key => showParams[key] === true || showParams[key] === 'true');
		var visibleParamsRight = paramKeysRight.filter(key => showParams[key] === true || showParams[key] === 'true');
	
		var colWidth = parametersRowWidth;
		var startXLeft = parametersLeftColPadding;
		var startXRight = this.contentsWidth() - colWidth - parametersRightColPadding;
	
		var tableHeight = (Math.max(paramKeysLeft.length, paramKeysRight.length) * (this.lineHeight() + this.rowSpacing())) - this.rowSpacing();
		var offsetY = (this.contentsHeight() - tableHeight) / 2;
	
		paramKeysLeft.forEach((key, index) => {
			var y = offsetY + (index * (this.lineHeight() + this.rowSpacing()));
			var padding = 8;
			this.drawDarkRect(startXLeft + padding, y, colWidth - padding * 2, this.lineHeight());
		});
	
		paramKeysRight.forEach((key, index) => {
			var y = offsetY + (index * (this.lineHeight() + this.rowSpacing()));
			var padding = 8;
			this.drawDarkRect(startXRight + padding, y, colWidth - padding * 2, this.lineHeight());
		});
	
		visibleParamsLeft.forEach((key, index) => {
			var y = offsetY + (index * (this.lineHeight() + this.rowSpacing()));
			var paramIndex = ['MHP', 'MMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI', 'LUK'].indexOf(key);
			this.changeFontSize(parametersTextSize);
			var textHeight = this.contents.fontSize + nameTopPadding + nameBottomPadding;
			var textY = y + (this.lineHeight() - textHeight) / 2 + nameTopPadding;
			this.changeTextColor(this.systemColor());
			this.drawText(paramNames[key], startXLeft + nameLeftPadding, textY, colWidth - nameLeftPadding, 'left');
			var newValue = this._actor.param(paramIndex); // Changed to param()
			var originalValue = this._originalParams[paramIndex];
			if (newValue > originalValue) this.changeTextColor(this.textColor(3));
			else this.resetTextColor();
			var valueTextHeight = this.contents.fontSize + valueTopPadding + valueBottomPadding;
			var valueTextY = y + (this.lineHeight() - valueTextHeight) / 2 + valueTopPadding;
			this.drawText(newValue, startXLeft, valueTextY, colWidth - valueRightPadding, 'right');
			this.resetTextColor();
			this.resetFontSize();
		});
	
		visibleParamsRight.forEach((key, index) => {
			var y = offsetY + (index * (this.lineHeight() + this.rowSpacing()));
			var paramIndex = ['MHP', 'MMP', 'ATK', 'DEF', 'MAT', 'MDF', 'AGI', 'LUK'].indexOf(key);
			this.changeFontSize(parametersTextSize);
			var textHeight = this.contents.fontSize + nameTopPadding + nameBottomPadding;
			var textY = y + (this.lineHeight() - textHeight) / 2 + nameTopPadding;
			this.changeTextColor(this.systemColor());
			this.drawText(paramNames[key], startXRight + nameLeftPadding, textY, colWidth - nameLeftPadding, 'left');
			var newValue = this._actor.param(paramIndex); // Changed to param()
			var originalValue = this._originalParams[paramIndex];
			if (newValue > originalValue) this.changeTextColor(this.textColor(3));
			else this.resetTextColor();
			var valueTextHeight = this.contents.fontSize + valueTopPadding + valueBottomPadding;
			var valueTextY = y + (this.lineHeight() - valueTextHeight) / 2 + valueTopPadding;
			this.drawText(newValue, startXRight, valueTextY, colWidth - valueRightPadding, 'right');
			this.resetTextColor();
			this.resetFontSize();
		});
	};

    Window_Parameters.prototype.changeFontSize = function(size) {
        this.contents.fontSize = size;
    };

    Window_Parameters.prototype.resetFontSize = function() {
        this.contents.fontSize = this.standardFontSize();
    };

    // =========================================================================
    // MODIFIED WINDOW_EXPARAMETERS (Flexible Left Table)
    // =========================================================================

    function Window_ExParameters() {
        this.initialize.apply(this, arguments);
    }

    Window_ExParameters.prototype = Object.create(Window_Base.prototype);
    Window_ExParameters.prototype.constructor = Window_ExParameters;

    Window_ExParameters.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._actor = null;
        this._originalExParams = null;
        this._originalSpParams = null;
        this._originalCritDmg = 0; 
    };

    Window_ExParameters.prototype.setActor = function(actor) {
        this._actor = actor;
        if (this._actor) {
             this._originalExParams = Array(10).fill(0).map((_, i) => this._actor.xparam(i));
             this._originalSpParams = Array(10).fill(0).map((_, i) => this._actor.sparam(i));
             
             // Snapshot Original Critical Damage (Bonus + Luk)
             // v1.9: Auto-detect formula logic
             var formula = Yanfly.Param.critMult || "value *= 3.0 + bonus";
             // Default luck multiplier if parsing fails: 0.001
             var luckMult = 0.001;
             
             // Simple regex to catch user.luk * 0.002 pattern
             var match = formula.match(/user\.luk\s*\*\s*(\d*\.?\d+)/i) || formula.match(/(\d*\.?\d+)\s*\*\s*user\.luk/i);
             if (match) {
                 luckMult = parseFloat(match[1]);
             }

             var bonus = (typeof this._actor.criticalMultiplierBonus === 'function') ? this._actor.criticalMultiplierBonus() : 0;
             var luk = this._actor.luk || 0;
             this._originalCritDmg = (bonus + (luk * luckMult)) * 100;
        }
        this.refresh();
    };

    Window_ExParameters.prototype.resetOriginalValues = function() {
        if (this._actor) {
            this._originalExParams = Array(10).fill(0).map((_, i) => this._actor.xparam(i));
            this._originalSpParams = Array(10).fill(0).map((_, i) => this._actor.sparam(i));

            // Snapshot Original Critical Damage (Bonus + Luk)
             var formula = Yanfly.Param.critMult || "value *= 3.0 + bonus";
             var luckMult = 0.001;
             var match = formula.match(/user\.luk\s*\*\s*(\d*\.?\d+)/i) || formula.match(/(\d*\.?\d+)\s*\*\s*user\.luk/i);
             if (match) {
                 luckMult = parseFloat(match[1]);
             }

            var bonus = (typeof this._actor.criticalMultiplierBonus === 'function') ? this._actor.criticalMultiplierBonus() : 0;
            var luk = this._actor.luk || 0;
            this._originalCritDmg = (bonus + (luk * luckMult)) * 100;
        }
    };

    Window_ExParameters.prototype.drawDarkRect = function(dx, dy, dw, dh) {
        var color = this.gaugeBackColor();
        this.changePaintOpacity(false);
        this.contents.fillRect(dx + 1, dy + 1, dw - 2, dh - 2, color);
        this.changePaintOpacity(true);
    };

    Window_ExParameters.prototype.lineHeight = function() {
        return backgroundHeight;
    };

    Window_ExParameters.prototype.rowSpacing = function() {
        return rowSpacing;
    };

    Window_ExParameters.prototype.refresh = function() {
        this.contents.clear();
        if (!this._actor) return;
        
        // Parse Left Column Layout
        var layout = leftColumnLayout.split(' ').filter(function(k) { return k.length > 0; });

        var tableHeight = (layout.length * (this.lineHeight() + this.rowSpacing())) - this.rowSpacing();
        var offsetY = 0;
        
        // v1.6: Centering Logic
        if (centerLeftColumn) {
            offsetY = (this.contentsHeight() - tableHeight) / 2;
            if (offsetY < 0) offsetY = 0;
        }

        layout.forEach((key, index) => {
            var y = offsetY + (index * (this.lineHeight() + this.rowSpacing()));
            var padding = 8;
            this.drawDarkRect(padding, y, this.contentsWidth() - padding * 2, this.lineHeight());
        });

        layout.forEach((key, index) => {
            var y = offsetY + (index * (this.lineHeight() + this.rowSpacing()));
            this.drawGenericParam(key, y);
        });
    };

    // Generic Drawing Function for Left Table
    Window_ExParameters.prototype.drawGenericParam = function(key, y) {
        // 1. Critical Damage Special Case
        if (key === 'CRITDMG') {
            this.drawCritDmgRow(y);
            return;
        }

        var label = "";
        var value = 0;
        var originalValue = 0;
        var isGoodHigher = true; // Most stats are better if higher
        var isGoodLower = false; // For MCR etc.

        // 2. Ex-Params
        if (EX_PARAMS_MAP.hasOwnProperty(key)) {
            var id = EX_PARAMS_MAP[key];
            label = exParamNames[key];
            value = this._actor.xparam(id);
            originalValue = this._originalExParams[id];
        } 
        // 3. Sp-Params
        else if (SP_PARAMS_MAP.hasOwnProperty(key)) {
            var id = SP_PARAMS_MAP[key];
            label = spParamNames[key];
            value = this._actor.sparam(id);
            originalValue = this._originalSpParams[id];
            
            // Special color logic for Sp-Params
            if (key === 'MCR') isGoodLower = true; isGoodHigher = false;
            if (['TGR', 'PDR', 'MDR'].includes(key)) { isGoodLower = false; isGoodHigher = false; } // Neutral or bad if high? 
            // Original logic for TGR/PDR/MDR: Red if > Original.
            // Let's stick to standard Comparison Logic below.
        } else {
            return; // Unknown Key
        }

        this.changeFontSize(exParametersTextSize);
        var textHeight = this.contents.fontSize + nameTopPadding + nameBottomPadding;
        var textY = y + (this.lineHeight() - textHeight) / 2 + nameTopPadding;
        
        this.changeTextColor(this.systemColor());
        this.drawText(label, nameLeftPadding, textY, this.contentsWidth() - nameLeftPadding, 'left');
        
        var formattedValue = (value * 100).toFixed(3);
        
        // Color Logic
        if (key === 'MCR') {
             if (value < originalValue) this.changeTextColor(this.textColor(3)); // Green (Lower is good)
             else if (value > originalValue) this.changeTextColor(this.textColor(18)); // Red
             else this.resetTextColor();
        } else if (['TGR', 'PDR', 'MDR'].includes(key)) {
             // For these, usually lower is better (dmg reduction), but high aggro might be wanted.
             // Original plugin logic: Red if > Original.
             if (value > originalValue) this.changeTextColor(this.textColor(18));
             else if (value < originalValue) this.changeTextColor(this.textColor(3));
             else this.resetTextColor();
        } else {
             // Standard: Higher is better
             if (value > originalValue) this.changeTextColor(this.textColor(3));
             else if (value < originalValue) this.changeTextColor(this.textColor(18));
             else this.resetTextColor();
        }

        var valueTextHeight = this.contents.fontSize + valueTopPadding + valueBottomPadding;
        var valueTextY = y + (this.lineHeight() - valueTextHeight) / 2 + valueTopPadding;
        this.drawText(formattedValue + '%', 0, valueTextY, this.contentsWidth() - valueRightPadding, 'right');
        this.resetTextColor();
        this.resetFontSize();
    };

    // Helper to draw Crit Dmg Row
    Window_ExParameters.prototype.drawCritDmgRow = function(y) {
        this.changeFontSize(exParametersTextSize);
        var textHeight = this.contents.fontSize + nameTopPadding + nameBottomPadding;
        var textY = y + (this.lineHeight() - textHeight) / 2 + nameTopPadding;

        // Draw Label
        this.changeTextColor(this.systemColor());
        this.drawText(critDmgLabel, nameLeftPadding, textY, this.contentsWidth() - nameLeftPadding, 'left');

        var formula = Yanfly.Param.critMult || "value *= 3.0 + bonus";
        
        // 1. Detect Base (e.g. 1.5)
        var basePercentage = 150; // Default if not found
        // Look for "value *= 1.5" or "value *= 3.0"
        var baseMatch = formula.match(/value\s*\*=\s*(\d*\.?\d+)/i);
        if (baseMatch) {
            basePercentage = parseFloat(baseMatch[1]) * 100;
        }

        // 2. Detect Luck Mult (e.g. 0.002)
        var luckMult = 0.001; // Default
        var luckMatch = formula.match(/user\.luk\s*\*\s*(\d*\.?\d+)/i) || formula.match(/(\d*\.?\d+)\s*\*\s*user\.luk/i);
        if (luckMatch) {
            luckMult = parseFloat(luckMatch[1]);
        }

        var bonusMult = 0;
        if (typeof this._actor.criticalMultiplierBonus === 'function') {
            bonusMult = this._actor.criticalMultiplierBonus();
        }
        var luk = this._actor.luk || 0;
        
        // Calculate Total Bonus (Luck + Items + States)
        var totalBonusRaw = bonusMult + (luk * luckMult);
        var totalBonusPercent = totalBonusRaw * 100;
        
        var currentTotal = totalBonusPercent;
        var originalTotal = this._originalCritDmg;

        var text = basePercentage + "%";
        
        if (totalBonusPercent >= 0) {
            text += " + " + totalBonusPercent.toFixed(2) + "%";
            
            if (currentTotal > originalTotal + 0.0001) {
                this.changeTextColor(this.textColor(3)); 
            } else if (currentTotal < originalTotal - 0.0001) {
                this.changeTextColor(this.textColor(18)); 
            } else {
                this.resetTextColor(); 
            }
            
        } else {
            text += " - " + Math.abs(totalBonusPercent).toFixed(2) + "%";
            
            if (currentTotal < originalTotal - 0.0001) {
                 this.changeTextColor(this.textColor(18)); 
            } else {
                 this.resetTextColor(); 
            }
        }

        var valueTextHeight = this.contents.fontSize + valueTopPadding + valueBottomPadding;
        var valueTextY = y + (this.lineHeight() - valueTextHeight) / 2 + valueTopPadding;

        this.drawText(text, 0, valueTextY, this.contentsWidth() - valueRightPadding, 'right');
        this.resetTextColor();
        this.resetFontSize();
    };

    Window_ExParameters.prototype.changeFontSize = function(size) {
        this.contents.fontSize = size;
    };

    Window_ExParameters.prototype.resetFontSize = function() {
        this.contents.fontSize = this.standardFontSize();
    };

    // =========================================================================
    // MODIFIED WINDOW_SPPARAMETERS (Flexible Right Table)
    // =========================================================================

    function Window_SpParameters() {
        this.initialize.apply(this, arguments);
    }

    Window_SpParameters.prototype = Object.create(Window_Base.prototype);
    Window_SpParameters.prototype.constructor = Window_SpParameters;

    Window_SpParameters.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._actor = null;
        this._originalExParams = null;
        this._originalSpParams = null;
    };

    Window_SpParameters.prototype.setActor = function(actor) {
        this._actor = actor;
        if (this._actor) {
            this._originalExParams = Array(10).fill(0).map((_, i) => this._actor.xparam(i));
            this._originalSpParams = Array(10).fill(0).map((_, i) => this._actor.sparam(i));
        }
        this.refresh();
    };

    Window_SpParameters.prototype.resetOriginalValues = function() {
        if (this._actor) {
            this._originalExParams = Array(10).fill(0).map((_, i) => this._actor.xparam(i));
            this._originalSpParams = Array(10).fill(0).map((_, i) => this._actor.sparam(i));
        }
    };

    Window_SpParameters.prototype.drawDarkRect = function(dx, dy, dw, dh) {
        var color = this.gaugeBackColor();
        this.changePaintOpacity(false);
        this.contents.fillRect(dx + 1, dy + 1, dw - 2, dh - 2, color);
        this.changePaintOpacity(true);
    };

    Window_SpParameters.prototype.lineHeight = function() {
        return backgroundHeight;
    };

    Window_SpParameters.prototype.rowSpacing = function() {
        return rowSpacing;
    };

    Window_SpParameters.prototype.refresh = function() {
        this.contents.clear();
        if (!this._actor) return;

        // Parse Right Column Layout
        var layout = rightColumnLayout.split(' ').filter(function(k) { return k.length > 0; });

        var tableHeight = (layout.length * (this.lineHeight() + this.rowSpacing())) - this.rowSpacing();
        var offsetY = 0;
        
        // v1.6: Centering Logic
        if (centerRightColumn) {
            offsetY = (this.contentsHeight() - tableHeight) / 2;
            if (offsetY < 0) offsetY = 0; 
        }

        layout.forEach((key, index) => {
            var y = offsetY + (index * (this.lineHeight() + this.rowSpacing()));
            var padding = 8;
            this.drawDarkRect(padding, y, this.contentsWidth() - padding * 2, this.lineHeight());
        });

        layout.forEach((key, index) => {
            var y = offsetY + (index * (this.lineHeight() + this.rowSpacing()));
            // Reuse logic? No, copy-paste is safer here because `this` context differs
            this.drawGenericParam(key, y);
        });
    };

    // Generic Drawing Function for Right Table (Identical to Left Table logic)
    Window_SpParameters.prototype.drawGenericParam = function(key, y) {
        if (key === 'CRITDMG') {
            this.drawCritDmgRow(y); // Added support for CritDmg in Right Table
            return; 
        }

        var label = "";
        var value = 0;
        var originalValue = 0;

        if (EX_PARAMS_MAP.hasOwnProperty(key)) {
            var id = EX_PARAMS_MAP[key];
            label = exParamNames[key];
            value = this._actor.xparam(id);
            originalValue = this._originalExParams[id];
        } else if (SP_PARAMS_MAP.hasOwnProperty(key)) {
            var id = SP_PARAMS_MAP[key];
            label = spParamNames[key];
            value = this._actor.sparam(id);
            originalValue = this._originalSpParams[id];
        } else {
            return; 
        }

        this.changeFontSize(spParametersTextSize);
        var textHeight = this.contents.fontSize + nameTopPadding + nameBottomPadding;
        var textY = y + (this.lineHeight() - textHeight) / 2 + nameTopPadding;
        
        this.changeTextColor(this.systemColor());
        this.drawText(label, nameLeftPadding, textY, this.contentsWidth() - nameLeftPadding, 'left');
        
        var formattedValue = (value * 100).toFixed(3);
        
        if (key === 'MCR') {
             if (value < originalValue) this.changeTextColor(this.textColor(3)); 
             else if (value > originalValue) this.changeTextColor(this.textColor(18));
             else this.resetTextColor();
        } else if (['TGR', 'PDR', 'MDR'].includes(key)) {
             if (value > originalValue) this.changeTextColor(this.textColor(18));
             else if (value < originalValue) this.changeTextColor(this.textColor(3));
             else this.resetTextColor();
        } else {
             if (value > originalValue) this.changeTextColor(this.textColor(3));
             else if (value < originalValue) this.changeTextColor(this.textColor(18));
             else this.resetTextColor();
        }

        var valueTextHeight = this.contents.fontSize + valueTopPadding + valueBottomPadding;
        var valueTextY = y + (this.lineHeight() - valueTextHeight) / 2 + valueTopPadding;
        this.drawText(formattedValue + '%', 0, valueTextY, this.contentsWidth() - valueRightPadding, 'right');
        this.resetTextColor();
        this.resetFontSize();
    };

    // Copied Helper to Right Window for full support
    Window_SpParameters.prototype.drawCritDmgRow = function(y) {
        this.changeFontSize(spParametersTextSize);
        var textHeight = this.contents.fontSize + nameTopPadding + nameBottomPadding;
        var textY = y + (this.lineHeight() - textHeight) / 2 + nameTopPadding;

        this.changeTextColor(this.systemColor());
        this.drawText(critDmgLabel, nameLeftPadding, textY, this.contentsWidth() - nameLeftPadding, 'left');

        var formula = Yanfly.Param.critMult || "value *= 3.0 + bonus";
        
        // 1. Detect Base (e.g. 1.5)
        var basePercentage = 150; // Default
        var baseMatch = formula.match(/value\s*\*=\s*(\d*\.?\d+)/i);
        if (baseMatch) {
            basePercentage = parseFloat(baseMatch[1]) * 100;
        }

        // 2. Detect Luck Mult (e.g. 0.002)
        var luckMult = 0.001; // Default
        var luckMatch = formula.match(/user\.luk\s*\*\s*(\d*\.?\d+)/i) || formula.match(/(\d*\.?\d+)\s*\*\s*user\.luk/i);
        if (luckMatch) {
            luckMult = parseFloat(luckMatch[1]);
        }

        var bonusMult = 0;
        if (typeof this._actor.criticalMultiplierBonus === 'function') {
            bonusMult = this._actor.criticalMultiplierBonus();
        }
        var luk = this._actor.luk || 0;

        var totalBonusRaw = bonusMult + (luk * luckMult);
        var totalBonusPercent = totalBonusRaw * 100;
        
        var originalTotal = (this._originalCritDmg !== undefined) ? this._originalCritDmg : totalBonusPercent; 
        
        var currentTotal = totalBonusPercent;

        var text = basePercentage + "%";
        
        if (totalBonusPercent >= 0) {
            text += " + " + totalBonusPercent.toFixed(2) + "%";
            if (currentTotal > originalTotal + 0.0001) this.changeTextColor(this.textColor(3)); 
            else if (currentTotal < originalTotal - 0.0001) this.changeTextColor(this.textColor(18)); 
            else this.resetTextColor(); 
        } else {
            text += " - " + Math.abs(totalBonusPercent).toFixed(2) + "%";
            if (currentTotal < originalTotal - 0.0001) this.changeTextColor(this.textColor(18)); 
            else this.resetTextColor(); 
        }

        var valueTextHeight = this.contents.fontSize + valueTopPadding + valueBottomPadding;
        var valueTextY = y + (this.lineHeight() - valueTextHeight) / 2 + valueTopPadding;
        this.drawText(text, 0, valueTextY, this.contentsWidth() - valueRightPadding, 'right');
        this.resetTextColor();
        this.resetFontSize();
    };

    Window_SpParameters.prototype.changeFontSize = function(size) {
        this.contents.fontSize = size;
    };

    Window_SpParameters.prototype.resetFontSize = function() {
        this.contents.fontSize = this.standardFontSize();
    };

    // Ensure the plugin is properly closed
})();