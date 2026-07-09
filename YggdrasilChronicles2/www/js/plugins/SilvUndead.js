//=============================================================================
// SilvUndead.js
// Version: 1.00
//=============================================================================
/*:
 * @plugindesc v1.00 Silvers Undead Plugin. Allows heals to damage undead-characters and (optionally) vice versa. <SilverUndead>
 * @author Silver
 *
 * @param Undead State ID
 * @desc ID of the undead-state in the database. Use the value -1 to disable the undead state. This state is purely for other plugins and effects.
 * @default -1
 *
 * @help
 *
 *--------------------------------------
 * Notetags
 *--------------------------------------
 * The following notetag can be placed in the Actors, Enemies and Classes note-fields in order to mark them as undead:
 * <is_undead>
 *
 * The following notetag can be placed in the skills and item note-fields:
 * <invert_for_undead>
 * Placing this notetag in that field will turn healing into damage and damage into healing (for undead). This only applies to items&skills tagged with this notetag.
 *
 *--------------------------------------
 * Dev Notes
 *--------------------------------------
 * You can check if an actor/enemy is an undead either by checking for the undeadState or through: $gameActors._data[actorId].isUndead
 *
 *--------------------------------------
 * Version History
 *--------------------------------------
 *
 * v1.00 (21 December 2015)
 * - First release
 */

// Imported
var Imported = Imported || {};
Imported.SILV_Undead = 1.00;

// Get Plugin #Parameters
var Silv = Silv || {};
Silv.Undead = Silv.Undead || {};
Silv.Parameters = $plugins.filter(function(p) { return p.description.contains('<SilverUndead>'); })[0].parameters;
Silv.Undead.StateID = parseInt(Silv.Parameters['Undead State ID']);

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Utilities
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
Silv.Undead.SetUndeadState = function(target)
{
	if (Silv.Undead.StateID != -1) { (target.isUndead) ? target.addState(Silv.Undead.StateID) : target.removeState(Silv.Undead.StateID); }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Game Actor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var alias_silv_undead_Game_Actor_setup = Game_Actor.prototype.setup;
Game_Actor.prototype.setup = function(actorId)
{
	alias_silv_undead_Game_Actor_setup.apply(this, arguments);
	this.setUndead();
}; 

// This alias is required to prevent RM from clearing the undead-state after they have been set in the Actor.setup()
var alias_silv_undead_Game_BattlerBase_clearStates = Game_BattlerBase.prototype.clearStates;
Game_BattlerBase.prototype.clearStates = function()
{
	if (!this._states)
	{
		alias_silv_undead_Game_BattlerBase_clearStates.apply(this, arguments);
	}
	else
	{
		var addUndeadStateAgain = false;
		if (this._states.indexOf(Silv.Undead.StateID) > -1) { addUndeadStateAgain = true; }
		alias_silv_undead_Game_BattlerBase_clearStates.apply(this, arguments);
		if (addUndeadStateAgain) { this.addState(Silv.Undead.StateID); }
	}
};

// This alias is required because the undead state must be added even when a character is dead,  the undead state should never be resisted, etc.
var alias_silv_undead_Game_Battler_isStateAddable = Game_Battler.prototype.isStateAddable;
Game_Battler.prototype.isStateAddable = function(stateId)
{
	return (stateId == Silv.Undead.StateID) || alias_silv_undead_Game_Battler_isStateAddable.apply(this, arguments);
};

Game_Actor.prototype.setUndead = function()
{
	(('is_undead' in $dataActors[this._actorId].meta) || ('is_undead' in $dataClasses[this._classId].meta)) ? this.isUndead = true : this.isUndead = false;
	Silv.Undead.SetUndeadState(this);
};

// Re-rest the undead-state if the actor's class changes. Because the undead-state could have originated from the actor's class.
var alias_test = Game_Actor.prototype.changeClass;
Game_Actor.prototype.changeClass = function(classId, keepExp)
{
	alias_test.apply(this, arguments);
	this.setUndead();
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Game Enemy
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var alias_silv_undead_Game_Enemy_setup = Game_Enemy.prototype.setup;
Game_Enemy.prototype.setup = function(enemyId, x, y)
{
	alias_silv_undead_Game_Enemy_setup.apply(this, arguments);
	this.setUndead();
};

// Note that unlike the Game_Actor.prototype.setUndead(), this method isn't required to delete the undead state if it's not an undead because enemies can't change class
Game_Enemy.prototype.setUndead = function()
{
	('is_undead' in $dataEnemies[this._enemyId].meta) ? this.isUndead = true : this.isUndead = false;
	Silv.Undead.SetUndeadState(this);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Game Action
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var alias_silv_undead_Game_Action_executeHpDamage = Game_Action.prototype.executeHpDamage;
Game_Action.prototype.executeHpDamage = function(target, value)
{
	if (target.isUndead && (('invert_for_undead' in this.item().meta))) { value *= -1; }
	alias_silv_undead_Game_Action_executeHpDamage.call(this, target, value);
};

var alias_silv_undead_Game_Action_itemEffectRecoverHp = Game_Action.prototype.itemEffectRecoverHp;
Game_Action.prototype.itemEffectRecoverHp = function(target, effect)
{
	var newEffect = JsonEx.makeDeepCopy(effect);
	if (target.isUndead && ('invert_for_undead' in this.item().meta))
	{
		newEffect.value1 *= -1;
		newEffect.value2 *= -1;
	}

	alias_silv_undead_Game_Action_itemEffectRecoverHp.call(this, target, newEffect);	
};

// Make sure that tagged healing-potions and healing-skills can be used on undead-characters which have full hp
var alias_silv_undead_Game_Action_hasItemAnyValidEffects = Game_Action.prototype.hasItemAnyValidEffects;
Game_Action.prototype.hasItemAnyValidEffects = function(target)
{
	var item = this.item(); // cloning is not required because these items are new objects and are not the database itself. // var item = JsonEx.makeDeepCopy(this.item());
	if (target.isUndead && ('invert_for_undead' in item.meta)) //target.isStateAffected(Silv.Undead.StateID)
	{
		if (item.effects.some(function (effect) { return effect.code == Game_Action.EFFECT_RECOVER_HP; } ) || item.damage.type == 3) // 3 == HP Recover
		{
			return true;
		}
	}
	
	return alias_silv_undead_Game_Action_hasItemAnyValidEffects.apply(this, arguments);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This is the end of this awesome script!
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////