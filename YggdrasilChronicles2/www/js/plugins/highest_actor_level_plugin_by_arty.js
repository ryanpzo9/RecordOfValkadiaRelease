//=============================================================================
// Arty - Highest Actor Level
// Arty_HighestActorLevel.js
// by: Arty
//=============================================================================

//=============================================================================
 /*:
 * @plugindesc Assigns the party's highest level to a variable.
 * @author Arty
 * @param Variable
 * @desc ID of the variable that you want to save the level to.
 * @default 1
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin assigns the party's highest actor level to a variable.
 * That's all.
 * It's up to you what you do with it - maybe check in a conditional branch
 * if it's below or above a certain level and do something with that info.
 *
 * ============================================================================
 * Usage
 * ============================================================================
 *
 * Use the plugin command
 *
 * GetPartyLevel
 *
 * to assign the highest level to the variable you chose in the plugin setup.
 *
 * ============================================================================
 * Support
 * ============================================================================
 *
 * This should be pretty straightforward...if something doesn't work,
 * just tell me and I'll try to help.
 *
 * ============================================================================
 * Note
 * ============================================================================
 *
 * You can use this plugin in your free and commercial projects as long as
 * you credit me. Please don't remove the header or claim you wrote this.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.0:
 * - release
 *
 */
//=============================================================================

(function() {
  var parameters = PluginManager.parameters('Arty_HighestActorLevel');
	
	arty_pluginCommand = Game_Interpreter.prototype.pluginCommand;
	Game_Interpreter.prototype.pluginCommand = function(command, args) {
		arty_pluginCommand.call(this, command, args);
		if (command === "GetPartyLevel")
		{
			var partysize = $gameParty.allMembers().length;
			var temp = 0;
			var tempnew = 0;
			var result = 0;
			var actorID = 0;
			for (i = 0; i < partysize; i++)
			{
				actorID = $gameParty.allMembers()[i].actorId();
				tempnew = $gameActors.actor(actorID).level;
				if (tempnew > temp)
				{
					temp = tempnew;
				}
			}
			result = temp;
			$gameVariables.setValue(parameters["Variable"], result);
		}
	};
  })();