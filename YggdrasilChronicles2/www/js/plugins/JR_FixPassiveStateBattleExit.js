// Fix_PassiveStateBattleExit.js
Yanfly.APS.Scene_Battle_terminate = Scene_Battle.prototype.terminate;
Scene_Battle.prototype.terminate = function() {
    Yanfly.APS.Scene_Battle_terminate.call(this);
    $gameParty.refreshMembers();
};