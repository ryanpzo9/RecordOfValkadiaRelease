// Extend .hasTag to also check active states
(function() {

  const _Game_Actor_hasTag = Game_Actor.prototype.hasTag;
  Game_Actor.prototype.hasTag = function(tag) {
    // Check actor's own tags first
    if (_Game_Actor_hasTag.call(this, tag)) return true;
    // Then check state tags
    return this.states().some(state => state.hasTag(tag));
  };

  const _Game_Enemy_hasTag = Game_Enemy.prototype.hasTag;
  Game_Enemy.prototype.hasTag = function(tag) {
    // Check enemy's own tags first
    if (_Game_Enemy_hasTag.call(this, tag)) return true;
    // Then check state tags
    return this.states().some(state => state.hasTag(tag));
  };

})();
