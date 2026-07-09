//=============================================================================
// Alistair Plugins - Zombie/Vampiric State
// AP_ZombieVampiricState.js
//=============================================================================
var Imported = Imported || {};
Imported.AP_ZombieVampiricState = true;
//=============================================================================
 /*:
 * @plugindesc v1.03 Allows you to create Zombie and Vampiric States
 * @author Alistair Plugins
 *
 * @param Zombie Damage to Healing
 * @desc While a Zombie state will turn Healing into Damage, would you like the opposite to apply too? Default: false
 * @default false
 *
 * @param HP-Regen to DMG
 * @desc Whether or not to turn HP-Regeneration to Damage as well. Default: true
 * @default true
 *
 * @param Cap Vampiric
 * @desc Enabling this will cap the percentage of damage that'll be drained. Default: false
 * @default false
 *
 * @param Cap Value
 * @desc If you enabled capping, this value will be the maximum percentage of damage that can be drained. Default: 999
 * @default 999
 *
 *
 * @help
 * ============================================================================
 * Alistair Plugins - Zombie/Vampiric State
 * ============================================================================
 * 
 * This Plugin will allow you to use easy notetags to create Zombie and Vampiric
 * States/Equipments.
 * To quickly explain these: Zombie will turn Healing into Damage (and the other
 * way around if you desire) and Vampiric will allow you to drain HP/MP/TP with 
 * each of your hits.
 *
 * Place this below all of Yanfly's Battle Scripts or it WON'T work.
 * ============================================================================
 * Notetags
 * ============================================================================
 * These only work for: Weapons, Armours, States and Enemies
 * 
 * <zv_zombie>
 * This will enable Zombie Capability.
 *
 * <zv_zombie_DMGtoHealing>
 * Damage will be converted to Healing even if the default 
 * value defined earlier says otherwise.
 *
 * <zv_vampiric_HP Rate: x%>
 * Replace x with any number.
 * This will define the percentage of the damage that will be absorbed.
 * Example: <zv_vampiric_HP Rate: 50%>. This will drain 50% of the damage dealt to
 * an enemy as HP.
 *
 * <zv_vampiric_MP Rate: x%>
 * Replace x with any number.
 * This will define the percentage of the damage that will be absorbed.
 * Example: <zv_vampiric_MP Rate: 50%>. This will drain 50% of the damage dealt to
 * an enemy as MP.
 *
 * <zv_vampiric_TP Rate: x%>
 * Replace x with any number.
 * This will define the percentage of the damage that will be absorbed.
 * Example: <zv_vampiric_TP Rate: 50%>. This will drain 50% of the damage dealt to
 * an enemy as TP.
 *
 * Please note: This is the exact way these notetags have to be written down.
 * No white spaces!
 * ============================================================================
 * Update History
 * ============================================================================
 * V1.03
 * - Updated Notetags
 *
 * V1.02
 * - Added the HP-Regen to DMG Parameter which allows HP Regeneration to be
 *   converted to damage
 *
 * V1.01
 * - Recovery rate (rec) will now be considered when using Vampiric State
 * - TP Charge rate (tcr) will now be considered when using Vampiric State
 * - Fixed "Zombie" and "Zombie DMG to Healing" canceling each other
 *
 * V1.0
 * - First version
 */
//=============================================================================

(function() {

var parameters = PluginManager.parameters('AP_ZombieVampiricState');
var ZV_DMGtoHealing = String(parameters['Zombie Damage to Healing']);
var ZV_Cap = String(parameters['Cap Vampiric']);
var ZV_CapValue = String(parameters['Cap Value']);
var ZV_HRGtoDMG = String(parameters['HP-Regen to DMG']);

// RegExp Handling

AP_ZombieVampiricState_DataManager_isDatabaseLoaded = DataManager.isDatabaseLoaded;
DataManager.isDatabaseLoaded = function() {
	if (!AP_ZombieVampiricState_DataManager_isDatabaseLoaded.call(this)) return false;
	this.processAPZVSN1($dataWeapons);
	this.processAPZVSN1($dataArmors);
	this.processAPZVSN1($dataStates);
	this.processAPZVSN1($dataEnemies);
	return true;
};

DataManager.processAPZVSN1 = function(dataGroup) {
	var APZVSN1_1 = /<(?:ZV_ZOMBIE)>/i;
	var APZVSN1_2 = /<(?:ZV_ZOMBIE_DMGTOHEALING)>/i;
	var APZVSN1_3 = /<(?:ZV_VAMPIRIC_)(HP|MP|TP)[ ]Rate:[ ](\d+)%>/i;
	for (var i = 1; i < dataGroup.length; i++) {
		var object = dataGroup[i];
		var noteData = object.note.split(/[\r\n]+/);

		object.zombie = false;
		object.zombieDMGtoHealing = false;
		object.vampiric_HP = 0;
		object.vampiric_MP = 0;
		object.vampiric_TP = 0;

		for (var n = 0; n < noteData.length; n++) {
			var line = noteData[n];
			if (line.match(APZVSN1_1)) {
				object.zombie = true;
			} else if (line.match(APZVSN1_2)) {
				object.zombieDMGtoHealing = true;
			} else if (line.match(APZVSN1_3)) {
				var param = String(RegExp.$1).toUpperCase();
				var value = parseFloat(RegExp.$2 * 0.01);
				if (param === "HP") object.vampiric_HP += value;
				if (param === "MP") object.vampiric_MP += value;
				if (param === "TP") object.vampiric_TP += value;
			};
		};
	};
};
// End of RegExp Handling

// Default Function Overwritten
Game_Action.prototype.makeDamageValue = function(target, critical) {
    var item = this.item();
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
	// Zombie State
	var user = this.subject();
	value = this.makeZombieState(value, target);
	// AP_ManaShield
	if (Imported.AP_ManaShield) {
	value = this.makeManaShield(value, target, critical);
	};
	// Vampiric State
	this.makeVampiricState(value, target, user);
    return Math.round(value);
};

// Default Function Overwritten
Game_Action.prototype.itemEffectRecoverHp = function(target, effect) {
    var value = (target.mhp * effect.value1 + effect.value2) * target.rec;
    if (this.isItem()) {
        value *= this.subject().pha;
    }
    value = Math.floor(value);
	
	if (target.zv_Zombie("isZombie")) {
	value = -value;
	};
	
    if (value !== 0) {
        target.gainHp(value);
        this.makeSuccess(target);
    }
};

Game_Action.prototype.makeZombieState = function(value, target) {
	var applied = 0;
	if (target.zv_Zombie("isZombie") && value < 0 && applied < 1) {
		value = Math.abs(value);
		applied++;
	};
	if (target.zv_Zombie("DMGtoHealing") && value > 0 && applied < 1) {
		value = -value;
		applied++;
	};
	return value;
};

Game_Battler.prototype.regenerateHp = function() {
    var value = Math.floor(this.mhp * this.hrg);
    value = Math.max(value, -this.maxSlipDamage());
    if (value !== 0) {
		if (this.zv_Zombie("isZombie") && value > 0 && eval(ZV_HRGtoDMG)) {
			value = -value;
		};
        this.gainHp(value);
    };
};

Game_Action.prototype.makeVampiricState = function(value, target, user) {
	var ZV_HealHp = 0;
	var ZV_HealMp = 0;
	var ZV_HealTp = 0;
	// HP Drain
	var Vamp_HpPercent = user.zv_Vampiric("Vamp_Hp%");
	var ZV_HealHp = (value * Vamp_HpPercent) * user.rec;
	// MP Drain
	var Vamp_MpPercent = user.zv_Vampiric("Vamp_Mp%");
	var ZV_HealMp = (value * Vamp_MpPercent) * user.rec;
	// TP Drain
	var Vamp_TpPercent = user.zv_Vampiric("Vamp_Tp%");
	var ZV_HealTp = (value * Vamp_TpPercent) * user.tcr;
	// Perform Healing
	if (ZV_HealHp > 0) {
	user.gainHp(Math.round(ZV_HealHp));
	};
	if (ZV_HealMp > 0) {
	user.gainMp(Math.round(ZV_HealMp));
	};
	if (ZV_HealTp > 0) {
	user.gainTp(Math.round(ZV_HealTp));
	};
};

// Vampiric State
Game_BattlerBase.prototype.zv_Vampiric = function(arg) {
	var arg = arg;
	var cap = eval(ZV_Cap);
	var capValue = eval(ZV_CapValue);
	var Vamp_HpPercent = 0;
	var Vamp_MpPercent = 0;
	var Vamp_TpPercent = 0;

	if (this.isActor()) {
		for (var i = 0; i < this.equips().length; i++) {
		var item = this.equips()[i];
			if (item) {
			Vamp_HpPercent += item.vampiric_HP;
			Vamp_MpPercent += item.vampiric_MP;
			Vamp_TpPercent += item.vampiric_TP;
			};
		};
	};

	if (this.isEnemy()) {
		var enemy = this.enemy();
		Vamp_HpPercent += enemy.vampiric_HP;
		Vamp_MpPercent += enemy.vampiric_MP;
		Vamp_TpPercent += enemy.vampiric_TP;
	};
	
	var state = this.states();
	for (var i = 0; i < state.length; i++) {
		var item = state[i];
		if (item) {
			Vamp_HpPercent += item.vampiric_HP;
			Vamp_MpPercent += item.vampiric_MP;
			Vamp_TpPercent += item.vampiric_TP;
		};
	};
	
	// Cap Values
	if (cap) {
		var Vamp_HpPercent = Math.min(capValue, Vamp_HpPercent);
		var Vamp_MpPercent = Math.min(capValue, Vamp_MpPercent);
		var Vamp_TpPercent = Math.min(capValue, Vamp_TpPercent);
	};

	switch (arg) {
		case "cap": return cap;
		case "capValue": return capValue;
		case "Vamp_Hp%": return Vamp_HpPercent;
		case "Vamp_Mp%": return Vamp_MpPercent;
		case "Vamp_Tp%": return Vamp_TpPercent;
		default: return;
	};

};

// Zombie State
Game_BattlerBase.prototype.zv_Zombie = function(arg) {
	var arg = arg;
	var isZombie = false;
	var DMGtoHealing = eval(ZV_DMGtoHealing);

	if (this.isActor()) {
	var equip = this.equips();
		for (var i = 0; i < equip.length; i++) {
		var item = equip[i];
			if (item && item.meta.zv_zombie !== undefined) {
			var isZombie = eval(item.meta.zv_zombie);
			};
			if (item && item.meta.zv_zombie_DMGtoHealing !== undefined) {
			var DMGtoHealing = eval(item.meta.zv_zombie_DMGtoHealing);
			};
		};
	};

	if (this.isEnemy()) {
		if (this.enemy().meta.zv_zombie !== undefined) {
			var isZombie = eval(this.enemy().meta.zv_zombie);
		};
		if (this.enemy().meta.zv_zombie_DMGtoHealing !== undefined) {
		var DMGtoHealing = eval(this.enemy().meta.zv_zombie_DMGtoHealing);
		};
	};

	var state = this.states();
	for (var i = 0; i < state.length; i++) {
		var item = state[i];
			if (item && item.meta.zv_zombie !== undefined) {
				var isZombie = eval(item.meta.zv_zombie);
			};
			if (item && item.meta.zv_zombie_DMGtoHealing !== undefined) {
				var DMGtoHealing = eval(item.meta.zv_zombie_DMGtoHealing);
			};
	};
	switch (arg) {
		case "isZombie": return isZombie;
		case "DMGtoHealing": return DMGtoHealing;
		default: return;
	};
};

})();
//=============================================================================
// End of Plugin
//=============================================================================
