(function() {
Sprite_Actor.prototype.updateMotionCount = function() {
    if (this._motion && ++this._motionCount >= this.motionSpeed()) {
        if (this.hasOwnProperty("_maxPattern") && this._pattern === this._maxPattern) {this.refreshMotion(); return}
        if (this._motion.loop) {
            this._pattern = (this._pattern + 1) % 4;
        } else if (this._pattern < 2) {
            this._pattern++;
        } else {
            this.refreshMotion();
        }
        this._motionCount = 0;
    }
};

var alias2 = Sprite_Weapon.prototype.updatePattern
Sprite_Weapon.prototype.updatePattern = function() {
    if (this.parent.hasOwnProperty("_maxPattern") && this._pattern === this.parent._maxPattern) {return}
   alias2.call(this);
};

var alias = Sprite_Actor.prototype.refreshMotion
Sprite_Actor.prototype.refreshMotion = function() {
    var actor = this._actor;
    if (actor) {
        if (this.hasOwnProperty("_maxPattern") && this._pattern === this._maxPattern) {return}
    }
    alias.call(this)
}

Sprite_Actor.prototype.setMaxFrame = function(num) {
    this._maxPattern = num;
}

Sprite_Actor.prototype.removeMaxFrame = function() {
    delete this._maxPattern
}

Sprite_Actor.prototype.setFrame = function(motion,num) {
    if (motion === "attack") {this._actor.performAttack()} else {this._actor.requestMotion(motion)}
   if (motion === "attack" && this.hasOwnProperty("_weaponSprite")) {
       var wpn = this._weaponSprite;
       wpn._pattern = num - 1;
       wpn._motionCount = 0;
       wpn.updatePattern();
   }
   this._pattern = num;
   this._motionCount = 0;
   this.setMaxFrame(num)
}

})()