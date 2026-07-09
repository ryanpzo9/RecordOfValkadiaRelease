// Make Yanfly barrier block indirect damage
Game_Battler.prototype.gainHp = function(value) {
    var blocked=false;
    if (value<0 && !BattleManager._subject && this.barrierPoints()>0)
    {
        var damage=-value;
        damage = this.loseBarrier(damage, 1, 0);
        if (!damage)
            blocked=true;
        else
            value=-damage;
    }
    if (!blocked)
    {
        this._result.hpDamage = -value;
        this._result.hpAffected = true;
        this.setHp(this.hp + value);
    }
};