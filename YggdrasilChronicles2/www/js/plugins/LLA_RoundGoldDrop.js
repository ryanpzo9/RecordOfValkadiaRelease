// START OF FILE //
/*:
* @plugindesc v1.0 - Rounds battle gold drops to the nearest integer. Intended for use with plugins that alter the gold drop rate.
*
* @author Llareian/Carrie McCormick
*
* @help
* Llareian's Round Gold Drop v1.0
* LLA_RoundGoldDrop.js
* 
* This plugin is free to use in all commercial and non-commercial works.
* Credit is appreciated, but not required.
*
* For best results, place this plugin below any others that alter the gold
* drop rate.
*/

LLA_RoundGoldDrop_GoldTotal = Game_Troop.prototype.goldTotal;
Game_Troop.prototype.goldTotal = function() {
    return Math.round(LLA_RoundGoldDrop_GoldTotal.call(this));
};

// END OF FILE //