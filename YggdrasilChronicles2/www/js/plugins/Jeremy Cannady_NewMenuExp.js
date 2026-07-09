//=============================================================================
// MenuNextExp.js
//=============================================================================

/*:
 * @plugindesc Displays actors required exp to next level in the main menu.
 * @author Jeremy Cannady
 *
 * @help Displays actors required exp to next level in the main menu.
 *
 *
 *
*/

(function(){
var copyOfDrawActorSimpleStatus = Window_Base.prototype.drawActorSimpleStatus;

Window_Base.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
	copyOfDrawActorSimpleStatus.call(this,actor,x,y,width);
	this.drawActorExp(actor, x, y + this.lineHeight()*2);
};

Window_Base.prototype.drawActorExp = function(actor, x, y, width) {
    width = width || 150;
    this.changeTextColor(this.hpColor(actor));
	this.makeFontSmaller();
	var actorcurrentlevel = actor.level;
	var actorlevelcheck = actor.maxLevel();
	if (actorcurrentlevel >= actorlevelcheck){
	this.drawText("Maximum Level Exceeded ", x, y, width, 'left');
	}
	else{
	var actorcheckexp = actor.nextRequiredExp();
	this.drawText("Next level: " + actorcheckexp, x, y, width, 'left');
	this.drawText("Experience Points ", x, y+this.lineHeight
		()*.5, width, 'left');
	}
    
		this.makeFontBigger();
};
})();