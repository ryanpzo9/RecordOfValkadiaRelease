// ------------------------------------------------
// Heal When Level Up.js
// ------------------------------------------------
/*:
*
* @plugindesc Recover when the character levels up. (Tutorial Plugin)
* @author Soulpour777
*
*/

var alias_actor_levelUp = Game_Actor.prototype.levelUp;
Game_Actor.prototype.levelUp = function() {
    alias_actor_levelUp.call(this);
    this.recoverAll();
};