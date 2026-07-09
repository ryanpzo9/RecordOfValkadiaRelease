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
	//var number = 1;
	//var temp = 900 + actorid * 10 + number;
	//var displayinfo = $gameVariables.value(temp);
	actor._jpSpent = actor._jpSpent || 0;
	//HP & MP
	actor._bonusHp = actor._bonusHp || 0;
	actor._bonusMp = actor._bonusMp || 0;
	//Main Params
	actor._bonusAtk = actor._bonusAtk || 0;
	actor._bonusDef = actor._bonusDef || 0;
	actor._bonusMat = actor._bonusMat || 0;
	actor._bonusMdf = actor._bonusMdf || 0;
	actor._bonusAgi = actor._bonusAgi || 0;
	actor._bonusLuk = actor._bonusLuk || 0;
	//Ex-Params
	actor._bonusHit = actor._bonusHit || 0;
	actor._bonusEva = actor._bonusEva || 0;
	actor._bonusCri = actor._bonusCri || 0;
	actor._bonusCev = actor._bonusCev || 0;
	actor._bonusCnt = actor._bonusCnt || 0;
	actor._bonusMev = actor._bonusMev || 0;
	actor._bonusMrf = actor._bonusMrf || 0;
	actor._bonusMrg = actor._bonusMrg || 0;
	//Sp-Params
	actor._bonusTgr = actor._bonusTgr || 0;
	actor._bonusMcr = actor._bonusMcr || 0;
	//Main Stats
	actor._vitPoints = actor._vitPoints || 0;
	actor._strPoints = actor._strPoints || 0;
	actor._dexPoints = actor._dexPoints || 0;
	actor._intPoints = actor._intPoints || 0;
	actor._sprPoints = actor._sprPoints || 0;
	this.drawText("VIT: " + actor._vitPoints + "/" + max, x-2, y, width, 'left');
	//number +=1;
	//temp = 900 + actorid * 10 + number;
	//displayinfo = $gameVariables.value(temp);
	this.drawText("STR: " + actor._strPoints + "/" + max, x+79, y, width, 'left');
    //number +=1;
	//temp = 900 + actorid * 10 + number;
	//displayinfo = $gameVariables.value(temp);
	this.drawText("DEX: " + actor._dexPoints + "/" + max, x-2, y+this.lineHeight()*.55, width, 'left');
	//number +=1;
	//temp = 900 + actorid * 10 + number;
	//displayinfo = $gameVariables.value(temp);
	this.drawText("INT: " + actor._intPoints + "/" + max, x+81, y+this.lineHeight()*.55, width, 'left');
	//number +=1;
	//temp = 900 + actorid * 10 + number;
	//displayinfo = $gameVariables.value(temp);
	this.drawText("SPR: " + actor._sprPoints + "/" + max, x+40, y+this.lineHeight()*1.1, width, 'left');
	this.makeFontBigger();
};
})();