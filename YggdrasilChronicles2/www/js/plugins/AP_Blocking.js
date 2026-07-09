//=============================================================================
// Alistair Plugins - Blocking
// AP_Blocking.js
//=============================================================================
var Imported = Imported || {};
Imported.AP_Blocking = true;
//=============================================================================
 /*:
 * @plugindesc v1.02a Allows Actors and Enemies to block attacks
 * @author Alistair Plugins
 *
 * @param --- General ---
 * @desc
 * @default
 *
 * @param Physical Block Rate Formula
 * @desc The formula used to calculate a battler's physical block rate. Default: (user.def + user.agi) * 0.05;
 * @default (user.def + user.agi) * 0.05
 *
 * @param Magical Block Rate Formula
 * @desc The formula used to calculate a battler's magical block rate. Default: (user.mdf + user.agi) * 0.05;
 * @default (user.mdf + user.agi) * 0.05
 *
 * @param Certain Block Rate Formula
 * @desc The formula used to calculate a battler's certain block rate. Default: user.luk * 0.05;
 * @default user.luk * 0.05
 *
 * @param Block Damage Reduction
 * @desc Incoming damage will be reduced by this !PERCENTAGE! if the block is successful. Default: 30
 * @default 30
 *
 * @param Flat Damage Reduction
 * @desc Incoming damage will be reduced by this amount if the block is successful. Default: 0
 * @default 0
 *
 * @param Show Block Message
 * @desc Show a message if Blocking is successful? Default: true
 * @default true
 *
 * @param Block Message
 * @desc The message that's displayed if Show Block Message is true. Variables: user, blockedDamage
 * @default user + " has blocked " + blockedDamage + " damage!"
 * 
 * @param Physical Block Rate Name
 * @desc The term used for "Physical Block Rate". Needed for Yanfly's Status Menu. Default: Physical Block Rate
 * @default Physical Block Rate
 *
 * @param Magical Block Rate Name
 * @desc The term used for "Magical Block Rate". Needed for Yanfly's Status Menu. Default: Magical Block Rate
 * @default Magical Block Rate
 *
 * @param Certain Block Rate Name
 * @desc The term used for "Certain Block Rate". Needed for Yanfly's Status Menu. Default: Certain Block Rate
 * @default Certain Block Rate
 *
 * @param Block Reduction Name
 * @desc The term used for "Block Damage Reduction". Needed for Yanfly's Status Menu. Default: Block Damage Redution
 * @default Block Damage Reduction
 *
 * @param Flat Reduction Name
 * @desc The term used for "Flat Damage Reduction". Needed for Yanfly's Status Menu. Default: Flat Damage Redution
 * @default Flat Damage Reduction
 *
 * @param --- Sound Effects ---
 * @desc
 * @default
 *
 * @param Play SE
 * @desc Play a Sound Effect when blocking occurs? Default: true
 * @default true
 *
 * @param SE Filename
 * @desc The name of the SE to play. Default: Skill2
 * @default Skill2
 *
 * @param SE Volume
 * @desc The volume of the played SE. Default: 100
 * @default 100
 *
 * @param SE Pitch
 * @desc The pitch of the played SE. Default: 100
 * @default 100
 *
 * @param SE Pan
 * @desc The pan of the played SE. Default: 0
 * @default 0
 *
 * @help
 * ============================================================================
 * Alistair Plugins - Blocking
 * ============================================================================
 * 
 * Blocking incoming attacks is a mechanic found in many RPGs. Unfortunately
 * RPG Maker MV does not contain anything similar. Here comes a plugin
 * to the rescue!
 *
 * You can use this plugin with Yanfly's Status Menu! If you want to add the
 * Block Rate and Block Reduction to the Attributes List just use "PhyBlockRate",
 * "MagBlockRate", "CerBlockRate", "blockReduction" and "flatReduction".
 *
 * The plugin itself can be considered Plug & Play.
 * Place it below all of Yanfly's Plugins!
 *
 * ============================================================================
 *
 * Thanks to Yanfly for his plugins. If you ever want to learn more about
 * scripting be sure to check his plugins out.
 *
 * ============================================================================
 * Notetags
 * ============================================================================
 * 
 * ► ACTORS, ENEMIES
 *
 * <Physical Block Rate: x%>
 * Sets this actor's or enemy's physical block rate to x%.
 * It will then further be augmented by equipment etc.
 * This notetag will ignore the default plugin parameter setting.
 *
 * <Magical Block Rate: x%>
 * Sets this actor's or enemy's magical block rate to x%.
 * It will then further be augmented by equipment etc.
 * This notetag will ignore the default plugin parameter setting.
 *
 * <Certain Block Rate: x%>
 * Sets this actor's or enemy's certain block rate to x%.
 * It will then further be augmented by equipment etc.
 * This notetag will ignore the default plugin parameter setting.
 *
 * <Block Reduction: x%>
 * Sets this actor's or enemy's block damage reduction to x%.
 * It will then further be augmented by equipment etc.
 * This notetag will ignore the default plugin parameter setting.
 *
 * <Block Flat: x>
 * Sets this actor's or enemy's flat damage reduction to x.
 * It will then further be augmented by equipment etc.
 * This notetag will ignore the default plugin parameter setting.
 *
 * You can use a formula with the variables: user, v[x], s[x].
 * User refers to the battler in question, s[x] to switch x and
 * v[x] to variable x.
 *
 * ► CLASSES, WEAPONS, ARMOURS, STATES
 *
 * <Physical Block Rate: +x%> or <Physical Block Rate: -x%>
 * Increases or decreases physical Block Rate by x%. Note that this is an additive
 * alteration of the value. It's simply added onto the current value.
 *
 * <Magical Block Rate: +x%> or <Magical Block Rate: -x%>
 * Increases or decreases magical Block Rate by x%. Note that this is an additive
 * alteration of the value. It's simply added onto the current value.
 *
 * <Certain Block Rate: +x%> or <Certain Block Rate: -x%>
 * Increases or decreases certain Block Rate by x%. Note that this is an additive
 * alteration of the value. It's simply added onto the current value.
 *
 * <Block Reduction: +x%> or <Block Reduction: -x%>
 * Increases or decreases the Block Damage Reduction by x%. Note that this is an
 * additive alteration of the value. It's simply added onto the current value.
 *
 * <Block Flat: +x> or <Block Flat: -x>
 * Increases or decreases the Flat Damage Reduction by x. Note that this is an
 * additive alteration of the value. It's simply added onto the current value.
 *
 * You can use a formula with the variables: user, v[x], s[x].
 * User refers to the battler in question, s[x] to switch x and
 * v[x] to variable x.
 *
 * ► ITEMS, SKILLS
 *
 * <Ignore Blocking>
 * This item/skill cannot be blocked.
 *
 * ============================================================================
 * Update History
 * ============================================================================
 * V1.02a
 * - Introduced flat damage reduction
 *   (Note: % Block Reduction will be applied before Flat Reduction) 
 * - Added Flat Block Reduction as a possibility for Yanfly's Status Menu Core
 * - Fixed rates not updating properly
 *
 * V1.01a
 * - Fixed calculations only happening once
 * - Healing will no longer be blocked
 * - Block Rates will now never go below 0% or above 100%
 * - Block Reduction cannot exceed 100% anymore
 * - Added Plugin parameters for Sound Effects and block rates
 * - Changed some notetags for blocking specific hit types
 * - Removed the following plugin parameters: Block Physical, Block Magical,
 *   Block Certain
 * - Won't overwrite the default Yanfly function from Status Menu Core
 *   anymore.
 * - For coders: Added Object properties to Game_Actor
 *   phyb, magb and cerb for the three block rates respectively

 *
 * V1.0
 * - First version
 */
//=============================================================================
// (function() {
	
	var parameters = PluginManager.parameters('AP_Blocking');
	// General
	var APPhyBlockRate = String(parameters['Physical Block Rate Formula']);
	var APMagBlockRate = String(parameters['Magical Block Rate Formula']);
	var APCerBlockRate = String(parameters['Certain Block Rate Formula']);
	var APBlockReduction = String(parameters['Block Damage Reduction']);
	var APFlatReduction = String(parameters['Flat Damage Reduction']);
	var APShowBlockMessage = String(parameters['Show Block Message']);
	var APBlockMessage = String(parameters['Block Message']);
	var APPhyBlockRateName = String(parameters['Physical Block Rate Name']);
	var APMagBlockRateName = String(parameters['Magical Block Rate Name']);
	var APCerBlockRateName = String(parameters['Certain Block Rate Name']);
	var APBlockReductionName = String(parameters['Block Reduction Name']);
	var APFlatReductionName = String(parameters['Flat Reduction Name']);
	// SEs
	var APBlockingPlaySE = String(parameters['Play SE']);
	var APBlockingSEFilename = String(parameters['SE Filename']);
	var APBlockingSEVolume = Number(parameters['SE Volume']);
	var APBlockingSEPitch = Number(parameters['SE Pitch']);
	var APBlockingSEPan = Number(parameters['SE Pan']);

// RegExp Handling
	AP_Blocking_DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
	DataManager.isDatabaseLoaded = function() {
		if (!AP_Blocking_DataManager_isDatabaseLoaded.call(this)) return false;
		this.processAPBN1($dataActors);
		this.processAPBN1($dataEnemies);
		this.processAPBN2($dataClasses);
		this.processAPBN2($dataWeapons);
		this.processAPBN2($dataArmors);
		this.processAPBN2($dataStates);
		this.processAPBN2($dataItems);
		this.processAPBN2($dataSkills);
		return true;
	};

	DataManager.processAPBN1 = function(dataGroup) {
		var APBN1_1 = /<(physical|magical|certain)[ ](?:Block Rate):[ ](.*)%>/i;
		var APBN1_2 = /<(?:Block Reduction):[ ](.*)%>/i;
		var APBN1_3 = /<(?:Block Flat):[ ](.*)>/i;
		for (var i = 1; i < dataGroup.length; i++) {
			var object = dataGroup[i];
			var noteData = object.note.split(/[\r\n]+/);

			object.phyBlockRate = String(APPhyBlockRate);
			object.magBlockRate = String(APMagBlockRate);
			object.cerBlockRate = String(APCerBlockRate);
			object.blockReduction = String(APBlockReduction);
			object.flatReduction = String(APFlatReduction);

			for (var n = 0; n < noteData.length; n++) {
				var line = noteData[n];
				if (line.match(APBN1_1)) {
					if (String(RegExp.$1.toLowerCase()) === "physical") {
						object.phyBlockRate = String(RegExp.$2);
					} else if (String(RegExp.$1.toLowerCase()) === "magical") {
						object.magBlockRate = String(RegExp.$2);
					} else if (String(RegExp.$1.toLowerCase()) === "certain") {
						object.cerBlockRate = String(RegExp.$2);
					};
				} else if (line.match(APBN1_2)) {
					object.blockReduction = String(RegExp.$1);
				} else if (line.match(APBN1_3)) {
					object.flatReduction = String(RegExp.$1);
				};
			};
		};
	};

	DataManager.processAPBN2 = function(dataGroup) {
		var APBN2_1 = /<(physical|magical|certain)[ ](?:Block Rate):[ ]([-+].*)%>/i;
		var APBN2_2 = /<(?:Block Reduction):[ ]([-+].*)%>/i;
		var APBN2_3 = /<(?:Ignore Blocking)>/i;
		var APBN2_4 = /<(?:Block Flat):[ ]([-+].*)>/i;
		for (var i = 1; i < dataGroup.length; i++) {
			var object = dataGroup[i];
			var noteData = object.note.split(/[\r\n]+/);

			object.phyBlockRateMod = 0;
			object.magBlockRateMod = 0;
			object.cerBlockRateMod = 0;
			object.blockReductionMod = 0;
			object.flatReductionMod = 0;
			object.ignoreBlocking = false;

			for (var n = 0; n < noteData.length; n++) {
				var line = noteData[n];
				if (line.match(APBN2_1)) {
					if (String(RegExp.$1.toLowerCase()) === "physical") {
						object.phyBlockRateMod = String(RegExp.$2);
					} else if (String(RegExp.$1.toLowerCase()) === "magical") {
						object.magBlockRateMod = String(RegExp.$2);
					} else if (String(RegExp.$1.toLowerCase()) === "certain") {
						object.cerBlockRateMod = String(RegExp.$2);
					};
				} else if (line.match(APBN2_2)) {
					object.blockReductionMod = String(RegExp.$1);
				} else if (line.match(APBN2_3)) {
					object.ignoreBlocking = true;
			    } else if (line.match(APBN2_4)) {
				    object.flatReductionMod = String(RegExp.$1);
				};
		    };
	    };
	 };
// End of RegExp Handling

// Game_Actor

AP_Blocking_Game_Actor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId) {
	AP_Blocking_Game_Actor_setup.call(this, actorId);
	var user = this;
	var a = this;
	var s = $gameSwitches._data;
	var v = $gameVariables._data;
	this._phyBlockRate = eval($dataActors[actorId].phyBlockRate);
	this._magBlockRate = eval($dataActors[actorId].magBlockRate);
	this._cerBlockRate = eval($dataActors[actorId].cerBlockRate);
	this._blockReduction = eval($dataActors[actorId].blockReduction);
	this._flatReduction = eval($dataActors[actorId].flatReduction);
};

Game_Actor.prototype.refreshAllRates = function() {
	var actorId = this._actorId;
	this._phyBlockRate = 0
	this._magBlockRate = 0
	this._cerBlockRate = 0
	this._blockReduction = 0
	this._flatReduction = 0
	// Refresh now
	var user = this;
	var a = this;
	var s = $gameSwitches._data;
	var v = $gameVariables._data;
	this._phyBlockRate = eval($dataActors[actorId].phyBlockRate);
	this._magBlockRate = eval($dataActors[actorId].magBlockRate);
	this._cerBlockRate = eval($dataActors[actorId].cerBlockRate);
	this._blockReduction = eval($dataActors[actorId].blockReduction);
	this._flatReduction = eval($dataActors[actorId].flatReduction);
};

// 1.01a
Object.defineProperties(Game_Actor.prototype, {
	// Physical Block Rate
	phyb: { get: function() { return this.blockRate(0); }, configurable: true },
	// Magical Block Rate
	magb: { get: function() { return this.blockRate(1); }, configurable: true },
	// Certain Block Rate
	cerb: { get: function() { return this.blockRate(2); }, configurable: true }
});

Game_Actor.prototype.blockRateMod = function(flag) {
	var user = this;
	var a = this;
	var s = $gameSwitches._data;
	var v = $gameVariables._data;
	var blockRateMod = 0;
	var flag = flag;
	this._phyBlockRate = eval($dataActors[this._actorId].phyBlockRate);
	this._magBlockRate = eval($dataActors[this._actorId].magBlockRate);
	this._cerBlockRate = eval($dataActors[this._actorId].cerBlockRate);
	for (var i = 0; i < this.states().length; i++) {
		var state = this.states()[i];
		if (state && flag === 0) blockRateMod += eval(state.phyBlockRateMod);
		if (state && flag === 1) blockRateMod += eval(state.magBlockRateMod);
		if (state && flag === 2) blockRateMod += eval(state.cerBlockRateMod);
	};
	for (var i = 0; i < this.equips().length; i++) {
		var equip = this.equips()[i];
		if (equip && flag === 0) blockRateMod += eval(equip.phyBlockRateMod);
		if (equip && flag === 1) blockRateMod += eval(equip.magBlockRateMod);
		if (equip && flag === 2) blockRateMod += eval(equip.cerBlockRateMod);
	};
	return blockRateMod;
};

Game_Actor.prototype.blockReductionMod = function() {
	var user = this;
	var a = this;
	var s = $gameSwitches._data;
	var v = $gameVariables._data;
	var blockReductionMod = 0;
	this._blockReduction = eval($dataActors[this._actorId].blockReduction);
	for (var i = 0; i < this.states().length; i++) {
		var state = this.states()[i];
		if (state) blockReductionMod += eval(state.blockReductionMod);
	};
	for (var i = 0; i < this.equips().length; i++) {
		var equip = this.equips()[i];
		if (equip) blockReductionMod += eval(equip.blockReductionMod);
	};
	return blockReductionMod;
};

Game_Actor.prototype.flatReductionMod = function() {
	var user = this;
	var a = this;
	var s = $gameSwitches._data;
	var v = $gameVariables._data;
	var flatReductionMod = 0;
	this._flatReduction = eval($dataActors[this._actorId].flatReduction);
	for (var i = 0; i < this.states().length; i++) {
		var state = this.states()[i];
		if (state) flatReductionMod += eval(state.flatReductionMod);
	};
	for (var i = 0; i < this.equips().length; i++) {
		var equip = this.equips()[i];
		if (equip) flatReductionMod += eval(equip.flatReductionMod);
	};
	return flatReductionMod;
};

Game_Actor.prototype.blockRate = function(flag) {
	var user = this;
	var a = this;
	var s = $gameSwitches._data;
	var v = $gameVariables._data;
	var flag = flag;
	switch (flag) {
		case 0:
		var rate = Math.floor(this._phyBlockRate + eval($dataClasses[this._classId].phyBlockRateMod) + this.blockRateMod(0));
		rate = Math.max(0, rate);
		rate = Math.min(100, rate);
		return rate;
		break;
		case 1:
		var rate = Math.floor(this._magBlockRate + eval($dataClasses[this._classId].magBlockRateMod) + this.blockRateMod(1));
		rate = Math.max(0, rate);
		rate = Math.min(100, rate);
		return rate;
		break;
		case 2:
		var rate = Math.floor(this._cerBlockRate + eval($dataClasses[this._classId].cerBlockRateMod) + this.blockRateMod(2));
		rate = Math.max(0, rate);
		rate = Math.min(100, rate);
		return rate;
		break;
		default:
		return 0;
		break;
	};
};

Game_Actor.prototype.blockReduction = function() {
	var user = this;
	var a = this;
	var s = $gameSwitches._data;
	var v = $gameVariables._data;
	var block = this._blockReduction + eval($dataClasses[this._classId].blockReductionMod) + this.blockReductionMod();
	block = Math.min(block, 100);
	block = Math.max(0, block);
	return block;
}

Game_Actor.prototype.flatReduction = function() {
	var user = this;
	var a = this;
	var s = $gameSwitches._data;
	var v = $gameVariables._data;
	var block = this._flatReduction + eval($dataClasses[this._classId].flatReductionMod) + this.flatReductionMod();
	block = Math.max(0, block);
	return block;
}

// Game_Enemy

AP_Blocking_Game_Enemy_setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function(enemyId, x, y) {
	AP_Blocking_Game_Enemy_setup.call(this, enemyId, x, y);
	var user = this;
	var a = this;
	var s = $gameSwitches._data;
	var v = $gameVariables._data;
	this._phyBlockRate = eval($dataEnemies[enemyId].phyBlockRate);
	this._magBlockRate = eval($dataEnemies[enemyId].magBlockRate);
	this._cerBlockRate = eval($dataEnemies[enemyId].cerBlockRate);
	this._blockReduction = eval($dataEnemies[enemyId].blockReduction);
	this._flatReduction = eval($dataEnemies[enemyId].flatReduction);
};

Game_Enemy.prototype.blockRateMod = function(flag) {
	var user = this;
	var a = this;
	var s = $gameSwitches._data;
	var v = $gameVariables._data;
	var blockRateMod = 0;
	var flag = flag;
	for (var i = 0; i < this.states().length; i++) {
		var state = this.states()[i];
		if (state && flag === 0) blockRateMod += eval(state.phyBlockRateMod);
		if (state && flag === 1) blockRateMod += eval(state.magBlockRateMod);
		if (state && flag === 2) blockRateMod += eval(state.cerBlockRateMod);
	};
	return blockRateMod;
};

Game_Enemy.prototype.blockReductionMod = function() {
	var user = this;
	var a = this;
	var s = $gameSwitches._data;
	var v = $gameVariables._data;
	var blockReductionMod = 0;
	for (var i = 0; i < this.states().length; i++) {
		var state = this.states()[i];
		if (state) blockReductionMod += eval(state.blockReductionMod);
	};
	return blockReductionMod;
};

Game_Enemy.prototype.flatReductionMod = function() {
	var user = this;
	var a = this;
	var s = $gameSwitches._data;
	var v = $gameVariables._data;
	var flatReductionMod = 0;
	for (var i = 0; i < this.states().length; i++) {
		var state = this.states()[i];
		if (state) flatReductionMod += eval(state.flatReductionMod);
	};
	return flatReductionMod;
};

Game_Enemy.prototype.blockRate = function(flag) {
	var flag = flag;
	switch (flag) {
		case 0:
		var rate = Math.floor(this._phyBlockRate + this.blockRateMod(0));
		rate = Math.max(0, rate);
		rate = Math.min(100, rate);
		return rate;
		break;
		case 1:
		var rate = Math.floor(this._magBlockRate + this.blockRateMod(1));
		rate = Math.max(0, rate);
		rate = Math.min(100, rate);
		return rate;
		break;
		case 2:
		var rate = Math.floor(this._cerBlockRate + this.blockRateMod(2));
		rate = Math.max(0, rate);
		rate = Math.min(100, rate);
		return rate;
		break;
		default:
		return 0;
		break;
	};
};

Game_Enemy.prototype.blockReduction = function() {
	var block = this._blockReduction + this.blockReductionMod();
	block = Math.min(block, 100);
	block = Math.max(0, block);
	return block;
};

Game_Enemy.prototype.flatReduction = function() {
	var block = this._flatReduction + this.flatReductionMod();
	block = Math.max(0, block);
	return block;
};

// Game_Action

// Default Function Overwritten
Game_Action.prototype.makeDamageValue = function(target, critical) {
    var item = this.item();
	// Begin of Imported

	if (Imported.YEP_DamageCore) {
	var a = this.subject();
    var b = target;
	var user = this.subject();
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
    var baseDamage = this.evalDamageFormula(target);
    var value = baseDamage;
	eval(Yanfly.DMG.DamageFlow);

	} else {

    var baseValue = this.evalDamageFormula(target);
    var value = baseValue * this.calcElementRate(target);
    if (this.isPhysical()) {
        value *= target.pdr;
    }
    if (this.isMagical()) {
        value *= target.mdr;
    }
    if (baseValue < 0) {
        value *= target.rec;
    }
    if (critical) {
        value = this.applyCritical(value);
    }
    value = this.applyVariance(value, item.damage.variance);
    value = this.applyGuard(value, target);
	}; 
	// End of Imported

    // Compatibility with AP_EquipmentExtraDamage
	var a = this.subject();
    var b = target;
    var s = $gameSwitches._data;
    var v = $gameVariables._data;
	if (Imported.AP_EquipmentExtraDamage) {
	value = this.makeExtraDamage(value, a, b, s, v);
	};
	// Compatibility with AP_ZombieVampiricState
	var user = this.subject();
	if (Imported.AP_ZombieVampiricState) {
	value = this.makeZombieState(value, target);
	};
	// Compatibility with AP_ManaShield
	if (Imported.AP_ManaShield) {
	value = this.makeManaShield(value, target, critical);
	};
	// Blocking
	value = this.makeBlocking(value, target, item);
	// Compatibility with AP_ZombieVampiricState
	if (Imported.AP_ZombieVampiricState) {
	this.makeVampiricState(value, target, user);
	};
	// Compatibility with AP_CatNip
	if (Imported.AP_CatNip) {
	value = this.makeCatNip(value, a, b, s, v);
    };
    return Math.round(value);
};

Game_Action.prototype.makeBlocking = function(value, target, item) {
	if (value <= 0) return value;
	var value = value;
	var target = target;
	var item = item;
	var blockedDamage = Math.floor(value * target.blockReduction() / 100 + target.flatReduction());
	var dmgReduction = 1.0 - target.blockReduction() / 100;
	var flatReduction = target.flatReduction();
	var blockPossible = true;
	var playSound = eval(APBlockingPlaySE);
	var SE = {name:APBlockingSEFilename,volume:APBlockingSEVolume,pitch:APBlockingSEPitch,pan:APBlockingSEPan};
	if (item.ignoreBlocking) blockPossible = false;
	if (blockPossible) {
		switch (item.hitType) {
			case 0:
			if (Math.random() < target.blockRate(2) * 0.01) {
			value = (value * dmgReduction);
			value - flatReduction < 0 ? value = 0 : value = value - flatReduction;
				if (eval(APShowBlockMessage)) {
				var user = target.name();
				var message = eval(APBlockMessage);
				SceneManager._scene._logWindow.addText(message);
				};
				if (playSound) AudioManager.playSe(SE);
			};
			break;
			case 1:
			if (Math.random() < target.blockRate(0) * 0.01) {
			value = (value * dmgReduction);
			value - flatReduction < 0 ? value = 0 : value = value - flatReduction;
				if (eval(APShowBlockMessage)) {
				var user = target.name();
				var message = eval(APBlockMessage);
				SceneManager._scene._logWindow.addText(message);
				};
				if (playSound) AudioManager.playSe(SE);
			};
			break;
			case 2:
			if (Math.random() < target.blockRate(1) * 0.01) {
			value = (value * dmgReduction);
			value - flatReduction < 0 ? value = 0 : value = value - flatReduction;
				if (eval(APShowBlockMessage)) {
				var user = target.name();
				var message = eval(APBlockMessage);
				SceneManager._scene._logWindow.addText(message);
				};
				if (playSound) AudioManager.playSe(SE);
			};
			break;
			default:
			return;
			break;
		};
	};
	return value;
};

// Compatibility with YEP - Status Menu Core

AP_Blocking_Window_StatusInfo_drawAttributeData = Window_StatusInfo.prototype.drawAttributeData;
Window_StatusInfo.prototype.drawAttributeData = function(attr, dx, dy, dw) {
	var actor = this._actor;
	actor.refreshAllRates();
	AP_Blocking_Window_StatusInfo_drawAttributeData.call(this, attr, dx, dy, dw);
	var actor = this._actor;
	this.contents.fontSize = Yanfly.Param.StatusAttrSize;
	switch (attr) {
    case 'phyblockrate':
      this.drawAttributeName(APPhyBlockRateName, dx, dy, dw);
      this.drawAttributeRate(actor.blockRate(0) / 100, dx, dy, dw);
      break;
    case 'magblockrate':
      this.drawAttributeName(APMagBlockRateName, dx, dy, dw);
      this.drawAttributeRate(actor.blockRate(1) / 100, dx, dy, dw);
      break;
    case 'cerblockrate':
      this.drawAttributeName(APCerBlockRateName, dx, dy, dw);
      this.drawAttributeRate(actor.blockRate(2) / 100, dx, dy, dw);
      break;
    case 'blockreduction':
      this.drawAttributeName(APBlockReductionName, dx, dy, dw);
      this.drawAttributeRate(actor.blockReduction() / 100, dx, dy, dw);
      break;
    case 'flatreduction':
      this.drawAttributeName(APFlatReductionName, dx, dy, dw);
      this.drawAttributeValue(actor.flatReduction().toFixed(3), dx, dy, dw);
    default:
      break;
    };
};

// })();
//=============================================================================
// End of Plugin
//=============================================================================
