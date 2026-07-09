//=============================================================================
// MenuStats.js
//=============================================================================

/*:
 * @plugindesc Displays stats on menu for actors
 * @author James Ryan
 *
 * @help Displays stats on menu for actors
 *
 *
 *
 * @param MaxStat
 * @desc Set actor's max stat
 * @default 0
*/


(function(){
var copyOfDrawActorSimpleStatus = Window_Base.prototype.drawActorSimpleStatus;

Window_Base.prototype.drawActorSimpleStatus = function(actor, x, y, width) {
	copyOfDrawActorSimpleStatus.call(this,actor,x,y,width);
	this.drawActorExp(actor, x, y + this.lineHeight()*1.6);
};
var parameters = PluginManager.parameters('MenuStatInfoWithParam');
var max = Number(parameters['MaxStat'] || 0);
Window_Base.prototype.drawActorExp = function(actor, x, y, width) {
    width = width || 150;
    this.changeTextColor(this.normalColor());
	this.makeFontSmaller();
	var actorid = actor.actorId();
	var number = 1;
	var temp = 900 + actorid * 10 + number;
	var displayinfo = $gameVariables.value(temp);
	this.drawText("Vitality: " + displayinfo + "/" + max, x, y, width, 'left');
	number +=1;
	temp = 900 + actorid * 10 + number;
	displayinfo = $gameVariables.value(temp);
	this.drawText("Strength: " + displayinfo + "/" + max, x, y+this.lineHeight()*.42, width, 'left');
    	number +=1;
	temp = 900 + actorid * 10 + number;
	displayinfo = $gameVariables.value(temp);
	this.drawText("Dexterity: " + displayinfo + "/" + max, x, y+this.lineHeight()*.84, width, 'left');
	number +=1;
	temp = 900 + actorid * 10 + number;
	displayinfo = $gameVariables.value(temp);
	this.drawText("Intelligence: " + displayinfo + "/" + max, x, y+this.lineHeight()*1.26, width, 'left');
	number +=1;
	temp = 900 + actorid * 10 + number;
	displayinfo = $gameVariables.value(temp);
	this.drawText("Spirit: " + displayinfo + "/" + max, x, y+this.lineHeight()*1.68, width, 'left');
	this.makeFontBigger();
};
})();