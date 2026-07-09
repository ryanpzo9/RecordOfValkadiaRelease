//=============================================================================
// Ramza Plugins - Block Chance
// Ramza_BlockChance.js
// v2.11
//=============================================================================

var Ramza = Ramza || {};
Ramza.BC = Ramza.BC || {};

//=============================================================================
 /*:
 * @plugindesc v2.11 Adds block chance as an exparam, which can be on armor or on a state. You need a custom state to make use of this.
 * @author Ramza
 *
 * @param Block Animation
 * @desc The default animation that plays when a block occurs
 * @default 161
 *
 * @param Slam Animation
 * @desc The default animation used for a shield slam attack
 * @default 162
 *
 * @param Physical Block
 * @desc Will all physical skills be automatically blockable?
 * Default: true
 * @default true
 *
 * @param Block State Id
 * @desc The Id number of your block state
 * Default: 36
 * @default 36 
 * 
 * @param Hide Popup
 * @desc Hides the default damage popup if a block reduces incoming damage to 0
 * Default: true
 * @default true
 * 
 * @param Flat Block Value
 * @desc Reduces incoming damage by a flat amount for all shields
 * Default: 0
 * @default 0
 *
 * @param Block Percentage
 * @desc Reduces incoming damage froma  blocked attack by a % on a shield
 * Default: 100
 * @default 100
 *
 * @param Partial Block Effect
 * @desc If an attack's damage is only partially reduced, still apply added effects from that attack?
 * Default: true
 * @default true
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * Thank you for downloading this plugin. I don't often make plugins, I'm more
 * of a state man, myself. Speaking of which, this plugin by itself will not
 * do anything in your project. But it adds the following functionality:
 * 
 * ============================================================================
 * Dependencies
 * ============================================================================
 * You will require battle engine core from the YEP Engine to use this plugin:
 * YEP_BattleEngineCore - http://yanfly.moe/2015/10/10/yep-3-battle-engine-core/
 * PLACE THIS PLUGIN BELOW BATTLE ENGINE CORE IN YOUR PLUGIN LIST, BUT ABOVE
 * ANY OTHER BATTLE RELATED YEP PLUGINS FOR MAXIMUM COMPATIBILITY
 * -----------------------------New in v2.10-----------------------------------
 * -Added plugin parameter to hide the damage popup if a block causes an 
 *  incoming attack to deal 0 damage
 * -Added note tag for armor and enemies to reduce the damage from a blocked 
 *  attack by a flat value, instead of completely negating the incoming damage
 * -----------------------------New in v2.00-----------------------------------
 * -Blocking is now handled within an action result
 * -If an attack was successfully blocked, it will not show a damage popup
 * -If a skill is blocked, it will no longer apply any states that it would have
 *  if the effect had been a normal hit (ie: poison applied on hit)
 * -States that are set to auto-remove after being hit will not be removed
 *  if the hit was blocked
 * -Custom states that use a react effect to check if the target took a hit 
 *  before removing themselves will need to also check against 
 *  target.result().isblocked() to see if the attack was blocked before removing.
 * -Block chance now properly parses as a value between 0 and 1, not 0-100.
 * ---------------------------------------------------------------------------- 
 * -Armors and states can add or subtract to a 'block chance' trait
 * -You can set special animations for your actors when a block happens
 * -You can also set a special animation for use with a shield slam type attack 
 * -You can gate this state behind actually having a shield equipped
 * -You can create passive states that increase this block chance
 * -You can add block chance to yanfly's status menu core plugin
 * -Enemies can also have block chances and animations for slamming and blocking
 * -You can now decide on an individual basis if a skill can be blocked or not
 *
 * How to use it:
 * 
 * On a state, enemy or armor, you can use the following note tag:
 * 
 * <BLOCK CHANCE: X>
 * Where 'x' is a whole number equal to the percent chance you want to block
 * eg: <Block Chance: 15>
 * This tag will give a 15% block chance
 *
 * The following two note tags work only on shield or an enemy:
 *
 * <BLOCK ANIMATION: X>
 * X is the animationId you want to display on your battler when they block 
 * successfully. Use this to customize how your shields appear in battle.
 * eg: <BLOCK ANIMATION: 165>
 * This tag will show animation 165 on the battler when he blocks an attack
 *
 * <SLAM ANIMATION: X>
 * X is the animationId you want to appear when the battler is using the shield 
 * as a weapon. Note that you will need to use an action sequence to have 
 * this work at all (and an if condition to sort it out).
 * eg: <SLAM ANIMATION: 164>
 * This tag will show animation 164 on the battler attacking with his shield.
 *
 * The following note tags are for use on skills:
 *
 * <BLOCKABLE>
 * A skill with this note tag will always be blockable, whether physical,
 * certain hit, or magical in nature.
 *
 * <UNBLOCKABLE>
 * A skill with this note tag will always be unblockable. This overrides 
 * the default parameter above for physical skills always being blockable.
 *
 * The following two tags are for use on an Armor, or Enemy only:
 *
 * <BLOCK VALUE: x>
 * Causes the damage of a successfully blocked incoming attack to be reduced
 * by x. This is a flat value
 *
 * <BLOCK PERCENT: x>
 * Reduces the incoming damage of a successfully blocked attack by x%
 *
 * <REDUCE BLOCK CHANCE: x>
 * Can be placed on states, enemies, or equipment. Reduces the block chance 
 *  by x in percent. This needs to be a whole number
 *
 * Custom State Effect:
 * In order to make proper use of this plugin, you need to be able to block.
 * RMMV doesn't have a built in way for this to happen yet, but I have come
 * come up with the next best thing - a custom state!
 *
 * Using this state, a physical attack that would've hit your actor, can be 
 * blocked, as long as the random number is lower than your block chance.
 * Just paste the following code into a passive state. For maximum effect,
 * make it so that the passive state is given by a shield equipped!
 * Make sure that you set the Id of the state you're using in the plugin 
 * parameters of this plugin, otherwise actors or enemies who have block 
 * chance, but no shield to block with will hide their damage popups.
 
<Custom React Effect>
var blockValue = (target.isEnemy() ? target.enemy().blockValue : target.equips()[1].blockValue)
var blockPercent = (target.isEnemy() ? target.enemy().blockPercent : target.equips()[1].blockPercent)
if (target.result().isBlocked()) {
    value -= Math.round(value * (blockPercent/100));
    value -= blockValue
    value = Math.max(value, 0)
    var blockAnim = (target.isEnemy() ? target.enemy().blockAnimation : target.equips()[1].blockAnimation)
      target.startAnimation(blockAnim, true, 0);
      target.requestMotion('guard')
}
</Custom React Effect>
<Custom Deselect Effect>
setTimeout(function () {
 target.requestMotion('walk')
}, 180);
</Custom Deselect Effect>

* Notes about Yanfly's status menu core plugin and compatibility:
* This plugin uses xparam(10) to store block chance. I define that in this
* plugin, so Yanfly's status menu plugin will have no idea what it is.
* I will also include a modified version of this plugin, to support my own.
* you can get it here:
* https://www.dropbox.com/s/d3ejjqlh9r10duy/YEP_StatusMenuCore.js?dl=0
*
* If you somehow managed to get this plugin from somewhere other than the 
* RPGMakerweb forums, you should also check out my thread there for this 
* plugin, as it contains a much better custom state, and an action sequence 
* that uses the shield slam animation from this plugin. Also a demo project is
* posted there, that you can use to quickly set up your own state.
*
* ============================================================================
* Change Log
* ============================================================================
* v2.11
* -Added <Reduce Block Chance: x> note tag support, to allow for states or 
*  equipment to reduce the block chance on the wearer/afflicted
* v2.10
* -Added plugin parameter to disable the automatic hiding of damage popups when
*  a block is successful
* -Changed the functionality of automatic popup hiding to only do so if the 
*  the blocked attack dealt zero damage
* -Added note tag support to block a flat amount of damage from an incoming skill
* -Added note tag support to block a percentage of incoming damage from a skill
*  that has been blocked
* -Better documented compatibility with YEP plugins
* -Attacks that are partially blocked (EX: result is > 0) still have their effects
*  applied as if the attack had been successful (EX: poison on melee attack)
* -Plugin Parameter added to disable the above effect if desired
* -Block state code is updated to allow for flat and % block values on shields
* v2.00
* -Added functionality to action.result() to check for a blocked skill
* -React effects can reference target.result().isBlocked to check if an effect
*  that triggered the react effect was blocked
* -Damage popup is hidden on a successful block
* -States that would have been applied on successful hit will no longer be 
*  if the attack was blocked
* -States that would be removed on hit will not be removed if the hit was 
*  blocked. (NOTE: custom react effects that check if damage was taken will 
*  need to be modified to check if the effect was blocked)
*  eg: if (value > 0 && this.isHpEffect() && this.isDamage()) becomes -> 
*  if (value > 0 && this.isHpEffect() && this.isDamage() && !target.result().isBlocked())
* -New plugin paramter to tell the plugin what state Id your block state is
* -New Custom block state paste-code in help file
* ----------------------------------------------------------------------------
* v1.10
* -Added note tag parsing on enemies to allow for animations and blocks on them
* -Added note tag for skills to allows specific skills to be blockable, even
*  if they weren't physical
* -Added plugin parameter to set if all physical skills would be blockable by
*  by default or not
* ----------------------------------------------------------------------------
* v1.02
* -Added a compatibility check with YEP_ExtraParamFormula
* ----------------------------------------------------------------------------
* v1.01
* -Fixed a bootcrash issue due to using a YEP specific function call
* ----------------------------------------------------------------------------
* v1.00
* -Initial Release
*/
//=============================================================================
// Parameter Variables
//=============================================================================
var Param = PluginManager.parameters('Ramza_BlockChance')
Ramza.BlockParams = Ramza.BlockParams || {};
Ramza.BlockParams.defaultBlockChance = Number(Param['Block Chance']);
Ramza.BlockParams.defaultBlockAnimation = Number(Param['Block Animation']);
Ramza.BlockParams.defaultSlamAnimation = Number(Param['Slam Animation']);
Ramza.BlockParams.physicalBlocking = String(Param['Physical Block']);
Ramza.BlockParams.physicalBlocking = eval(Ramza.BlockParams.physicalBlocking);
Ramza.BlockParams.blockStateId = Number(Param['Block State Id']);
Ramza.BlockParams.hidePopup = String(Param['Hide Popup']);
Ramza.BlockParams.hidePopup = eval(Ramza.BlockParams.hidePopup);
Ramza.BlockParams.flatBlockValue = Number(Param['Flat Block Value']);
Ramza.BlockParams.blockPercent = Number(Param['Block Percentage']);
Ramza.BlockParams.partialEffect = String(Param['Partial Block Effect']);
Ramza.BlockParams.partialEffect = eval(Ramza.BlockParams.partialEffect);

//=============================================================================
// DataManager
//=============================================================================

Ramza.DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
  if (!Ramza.DataManager_isDatabaseLoaded.call(this)) return false;
  if (!Ramza._loaded_Shield_Block) {
//    this.setDatabaseLengths();
    this.processShieldBlockNotetags($dataStates);
	this.processShieldBlockNotetags($dataArmors);
	this.processShieldBlockNotetags($dataEnemies);
	this.processShieldBlockNotetags($dataSkills);
	Ramza._loaded_Shield_Block = true;
  }
  return true;
};
DataManager.processShieldBlockNotetags = function(group) {
  var note1 = /<(?:BLOCK CHANCE):[ ](\d+)>/i;
  var note2 = /<(?:BLOCK ANIMATION):[ ](\d+)>/i;
  var note3 = /<(?:SLAM ANIMATION):[ ](\d+)>/i;
  var note4 = /<(?:BLOCKABLE)>/i
  var note5 = /<(?:UNBLOCKABLE)>/i
  var note6 = /<(?:BLOCK VALUE):[ ](\d+)>/i;
  var note7 = /<(?:BLOCK PERCENT):[ ](\d+)>/i;
  var note8 = /<(?:LOWER BLOCK CHANCE):[ ](\d+)>/i;
  for (var n = 1; n < group.length; n++) {
    var obj = group[n];
    var notedata = obj.note.split(/[\r\n]+/);

    obj.blockAnimation = Ramza.BlockParams.defaultBlockAnimation
    obj.slamAnimation = Ramza.BlockParams.defaultSlamAnimation
	obj.blockChance = 0
	obj.blockable = (obj.hitType == 1 ? Ramza.BlockParams.physicalBlocking : undefined)
	obj.blockValue = Ramza.BlockParams.flatBlockValue
	obj.blockPercent = Ramza.BlockParams.blockPercent
	

	for (var i = 0; i < notedata.length; i++) {
     var line = notedata[i];
     if (line.match(note1)) {
	   var traitAdd = (obj.traits.length)
	   obj.traits[traitAdd] = {}
	   obj.traits[traitAdd].code = 22
	   obj.traits[traitAdd].dataId = 10
       obj.traits[traitAdd].value = (parseInt(RegExp.$1)/100);
      } else if (line.match(note8)) {
	   var traitAdd = (obj.traits.length)
	   obj.traits[traitAdd] = {}
	   obj.traits[traitAdd].code = 22
	   obj.traits[traitAdd].dataId = 10
       obj.traits[traitAdd].value = -(parseInt(RegExp.$1)/100);
      } else if (line.match(note2)) {
        obj.blockAnimation = parseInt(RegExp.$1);
      } else if (line.match(note3)) {
        obj.slamAnimation = parseInt(RegExp.$1);
	  } else if (line.match(note4)) {
        obj.blockable = true;
	  } else if (line.match(note5)) {
        obj.blockable = false;
	  } else if (line.match(note6)) {
        obj.blockValue = parseInt(RegExp.$1);
	  } else if (line.match(note7)) {
        obj.blockPercent = parseInt(RegExp.$1);
	  } 
    }
  }
};

Object.defineProperties(Game_BattlerBase.prototype, {
    // Hit Points
    hp: { get: function() { return this._hp; }, configurable: true },
    // Magic Points
    mp: { get: function() { return this._mp; }, configurable: true },
    // Tactical Points
    tp: { get: function() { return this._tp; }, configurable: true },
    // Maximum Hit Points
    mhp: { get: function() { return this.param(0); }, configurable: true },
    // Maximum Magic Points
    mmp: { get: function() { return this.param(1); }, configurable: true },
    // ATtacK power
    atk: { get: function() { return this.param(2); }, configurable: true },
    // DEFense power
    def: { get: function() { return this.param(3); }, configurable: true },
    // Magic ATtack power
    mat: { get: function() { return this.param(4); }, configurable: true },
    // Magic DeFense power
    mdf: { get: function() { return this.param(5); }, configurable: true },
    // AGIlity
    agi: { get: function() { return this.param(6); }, configurable: true },
    // LUcK
    luk: { get: function() { return this.param(7); }, configurable: true },
    // HIT rate
    hit: { get: function() { return this.xparam(0); }, configurable: true },
    // EVAsion rate
    eva: { get: function() { return this.xparam(1); }, configurable: true },
    // CRItical rate
    cri: { get: function() { return this.xparam(2); }, configurable: true },
    // Critical EVasion rate
    cev: { get: function() { return this.xparam(3); }, configurable: true },
    // Magic EVasion rate
    mev: { get: function() { return this.xparam(4); }, configurable: true },
    // Magic ReFlection rate
    mrf: { get: function() { return this.xparam(5); }, configurable: true },
    // CouNTer attack rate
    cnt: { get: function() { return this.xparam(6); }, configurable: true },
    // Hp ReGeneration rate
    hrg: { get: function() { return this.xparam(7); }, configurable: true },
    // Mp ReGeneration rate
    mrg: { get: function() { return this.xparam(8); }, configurable: true },
    // Tp ReGeneration rate
    trg: { get: function() { return this.xparam(9); }, configurable: true },
    // TarGet Rate
    tgr: { get: function() { return this.sparam(0); }, configurable: true },
    // GuaRD effect rate
    grd: { get: function() { return this.sparam(1); }, configurable: true },
    // RECovery effect rate
    rec: { get: function() { return this.sparam(2); }, configurable: true },
    // PHArmacology
    pha: { get: function() { return this.sparam(3); }, configurable: true },
    // Mp Cost Rate
    mcr: { get: function() { return this.sparam(4); }, configurable: true },
    // Tp Charge Rate
    tcr: { get: function() { return this.sparam(5); }, configurable: true },
    // Physical Damage Rate
    pdr: { get: function() { return this.sparam(6); }, configurable: true },
    // Magical Damage Rate
    mdr: { get: function() { return this.sparam(7); }, configurable: true },
    // Floor Damage Rate
    fdr: { get: function() { return this.sparam(8); }, configurable: true },
    // EXperience Rate
    exr: { get: function() { return this.sparam(9); }, configurable: true },
	// BLocK chance
	blk: { get: function() { return this.xparam(10); }, configurable: true }
});

Game_ActionResult.prototype.clear = function() {
    this.used = false;
    this.missed = false;
    this.evaded = false;
    this.physical = false;
	this.blocked = false;
    this.drain = false;
    this.critical = false;
    this.success = false;
    this.hpAffected = false;
    this.hpDamage = 0;
    this.mpDamage = 0;
    this.tpDamage = 0;
    this.addedStates = [];
    this.removedStates = [];
    this.addedBuffs = [];
    this.addedDebuffs = [];
    this.removedBuffs = [];
};

Game_Action.prototype.itemBlk = function(target) {
    if (this.isBlockable() && target.isStateAffected(Ramza.BlockParams.blockStateId)) {
        return target.blk;
    } else {
        return 0;
    }
};

Game_Action.prototype.isBlockable = function() {
    return this.item().blockable === true;
};


Game_Action.prototype.apply = function(target) {
    var result = target.result();
    this.subject().clearResult();
    result.clear();
    result.used = this.testApply(target);
    result.missed = (result.used && Math.random() >= this.itemHit(target));
    result.evaded = (!result.missed && Math.random() < this.itemEva(target));
	result.blocked = (!result.missed && Math.random() < this.itemBlk(target));
	result.physical = this.isPhysical();
    result.drain = this.isDrain();
    if (result.isHit()) {
        if (this.item().damage.type > 0) {
            result.critical = (Math.random() < this.itemCri(target));
            var value = this.makeDamageValue(target, result.critical);
            this.executeDamage(target, value);
        }
		if (!result.isBlocked() || (result.isBlocked() && target._result.hpDamage > 0 && Ramza.BlockParams.partialEffect)){
		    this.item().effects.forEach(function(effect) {
				this.applyItemEffect(target, effect);
			}, this);
		}	
        this.applyItemUserEffect(target);
    }
};


Game_ActionResult.prototype.isBlocked = function() {
    return this.used && !this.missed && !this.evaded && this.blocked;
};


/*Game_Action.prototype.executeDamage = function(target, value) {
    var result = target.result();
    if (value === 0) {
        result.critical = false;
    }
    if (this.isHpEffect()) {
        this.executeHpDamage(target, value);
    }
    if (this.isMpEffect()) {
        this.executeMpDamage(target, value);
    }
};
*/
var yepBECImported = Yanfly.BEC ? true : false
if (yepBECImported == true){
	Yanfly.BEC.Game_Action_apply = Game_Action.prototype.apply;
	Game_Action.prototype.apply = function(target) {
		target._result = null;
		target._result = new Game_ActionResult();
		this.subject()._result = null;
		this.subject()._result = new Game_ActionResult();
		Yanfly.BEC.Game_Action_apply.call(this, target);
		if ($gameParty.inBattle()){
			if (Ramza.BlockParams.hidePopup == true){
				if (!target.result().blocked || target._result.hpDamage > 0){
					target.startDamagePopup();
				 }
			}else{
				target.startDamagePopup();
			}
		target.performResultEffects();
		if (target !== this.subject()) this.subject().startDamagePopup();
		}
};
}
/*Yanfly.BSC.Game_Action_apply = Game_Action.prototype.apply;
Game_Action.prototype.apply = function(target) {
    this.onApplyStateEffects(target);
    this.onSelectStateEffects(target);
    Yanfly.BSC.Game_Action_apply.call(this, target);
    this.onDeselectStateEffects(target);
    this.offApplyStateEffects(target);
};
*/
var yepXparamImported = Yanfly.XParam ? true : false
if (yepXparamImported == true) {
	Yanfly.Param.XParamFormula.push(String('base'));
};
