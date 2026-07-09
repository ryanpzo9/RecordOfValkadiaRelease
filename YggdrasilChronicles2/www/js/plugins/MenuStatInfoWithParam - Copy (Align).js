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
	this.drawActorExp(actor, x, y + this.lineHeight()*1.65);
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
	this.drawText("VIT: " + displayinfo + "/" + max, x-2, y, width, 'left');
	number +=1;
	temp = 900 + actorid * 10 + number;
	displayinfo = $gameVariables.value(temp);
	this.drawText("STR: " + displayinfo + "/" + max, x+75, y, width, 'left');
    	number +=1;
	temp = 900 + actorid * 10 + number;
	displayinfo = $gameVariables.value(temp);
	this.drawText("DEX: " + displayinfo + "/" + max, x-2, y+this.lineHeight()*.55, width, 'left');
	number +=1;
	temp = 900 + actorid * 10 + number;
	displayinfo = $gameVariables.value(temp);
	this.drawText("INT: " + displayinfo + "/" + max, x+75, y+this.lineHeight()*.55, width, 'left');
	number +=1;
	temp = 900 + actorid * 10 + number;
	displayinfo = $gameVariables.value(temp);
	this.drawText("SPR: " + displayinfo + "/" + max, x+38, y+this.lineHeight()*1.1, width, 'left');
	this.makeFontBigger();
};
})();