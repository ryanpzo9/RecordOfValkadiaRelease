/*:
* @plugindesc Allows you to create custom variables aside from the engine defaults.
* @author Soulpour777 - soulxregalia.wordpress.com
*
* @param Custom Variable Max
* @desc How many variables do you want to be created for your game?
* @default 999
*

@help

SOUL_CustomVariables
by: Soulpour777

What's with this plugin?

This plugin allows you to create extra variables that are not handled by the
default engine variables. This means these are variables you can manipulate
aside from the default variables you have by default. You can create as
many as you can.

It stores the variables in a list, starting from 0 on its counting.

To just access the value of a custom variable, do this on a script command:

this.cv(id)

where id is the id of the custom variable.

or do this on a plugin command:

cv val id

where id is the id of the custom variable.

Main Plugin Commands:

cv set index value

where index would be the number of the variable. Remember that counting starts
from 0, not 1.
where value is the value of the variable.

For example:

cv set 0 10

this will set Custom Variable 0's value as 10.

Other commands for other operations:

cv add index value
cv sub index value
cv mult index value
cv div index value
cv mod index value

where add = add custom variable with value
where sub = subtract custom variable with value
where mult = multiply custom variable with value
where div = divide custom variable with value
where mod = apply modulus on custom variable with value

If you want to check it via conditional branch, use the Conditional Branch and
use the script option from tab 4 and write:

this.isEqualTo(index, value)
this.isGreaterThanOrEqual(index, value)
this.isLesserThanOrEqual(index, value)
this.isGreater(index, value)
this.isLesser(index, value)
this.isNotEqual(index, value)

where index is the number of the custom variable
and value is the value you want the custom variable's value to be compared of.

For example:

this.isEqualTo(0, 10)

What you are doing here is that you're comparing the value of Custom Variable 0
to 10. Is custom variable 0's value equal to 10?

You can also do this for string (only works for isEqualTo command)

this.isEqualTo(0, 'Hi There')

This will check if the value is equal to 'Hi There'.

If you are going to place the custom variable's value as a string or a word,
use '' marks to it. Example:

cv set 0 'Tifa'

this would set Custom Variable 0's value as Tifa.

==================================================
TERMS OF USE
==================================================

Free to use for Commercial and Non Commercial Use.

==================================================
SPECIAL THANKS:
==================================================
Necromedes for the idea of this plugin.

==================================================
PATREON: https://www.patreon.com/Soulpour777
==================================================

*/

var Imported = Imported || {};
Imported.SOUL_CustomVariables = true;

var Soulpour777 = Soulpour777 || {};
Soulpour777.CV = Soulpour777.CV || {};

var cvparams = PluginManager.parameters('SOUL_CustomVariables');

var variableLimit = Number(cvparams['Custom Variable Max']);

Soulpour777.CV.GameSystem_initialize = Game_System.prototype.initialize;
Game_System.prototype.initialize = function() {
    Soulpour777.CV.GameSystem_initialize.call(this);
    this.customVariables = [];
    this.createCustomVariables();
};

Game_System.prototype.createCustomVariables = function() {
    for (var i = 0; i < variableLimit; i++) {
        var variable = null;
        this.customVariables.push(variable);
    }
}

Game_System.prototype.setCustomVariable = function(index, value) {
    this.customVariables[index] = value;
}

Game_System.prototype.addCustomVariable = function(index, value) {
    this.customVariables[index] += value;
}

Game_System.prototype.decCustomVariable = function(index, value) {
    this.customVariables[index] -= value;
}

Game_System.prototype.mulCustomVariable = function(index, value) {
    this.customVariables[index] *= value;
}

Game_System.prototype.divCustomVariable = function(index, value) {
    this.customVariables[index] /= value;
}

Game_System.prototype.modCustomVariable = function(index, value) {
    this.customVariables[index] %= value;
}

Soulpour777.CV.GameInterpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Soulpour777.CV.GameInterpreter_pluginCommand.call(this, command, args);
    if (command === 'cv') {
        if (args[0] === 'val') {
            return $gameSystem.customVariables[Number(args[1])];
        } 
        if (args[0] === 'set') {
            var index = Number(args[1]);
            var value = eval(args[2]);
            $gameSystem.setCustomVariable(index, value);
        }
        if (args[0] === 'add') {
            var index = Number(args[1]);
            var value = eval(args[2]);
            $gameSystem.addCustomVariable(index, value);
        }
        if (args[0] === 'sub') {
            var index = Number(args[1]);
            var value = eval(args[2]);
            $gameSystem.decCustomVariable(index, value);
        }        
        if (args[0] === 'mult') {
            var index = Number(args[1]);
            var value = eval(args[2]);
            $gameSystem.mulCustomVariable(index, value);
        }        
        if (args[0] === 'div') {
            var index = Number(args[1]);
            var value = eval(args[2]);
            $gameSystem.divCustomVariable(index, value);
        }        
        if (args[0] === 'mod') {
            var index = Number(args[1]);
            var value = eval(args[2]);
            $gameSystem.modCustomVariable(index, value);
        }        
    }
};

Game_Interpreter.prototype.isEqualTo = function(index, value) {
    return $gameSystem.customVariables[index] === value;
}


Game_Interpreter.prototype.isGreaterThanOrEqual = function(index, value) {
    return $gameSystem.customVariables[index] >= value;
}

Game_Interpreter.prototype.isLesserThanOrEqual = function(index, value) {
    return $gameSystem.customVariables[index] <= value;
}

Game_Interpreter.prototype.isGreater = function(index, value) {
    return $gameSystem.customVariables[index] > value;
}

Game_Interpreter.prototype.isLesser = function(index, value) {
    return $gameSystem.customVariables[index] < value;
}

Game_Interpreter.prototype.isNotEqual = function(index, value) {
    return $gameSystem.customVariables[index] != value;
}

Game_Interpreter.prototype.cv = function(index) {
    return $gameSystem.customVariables[index];
}