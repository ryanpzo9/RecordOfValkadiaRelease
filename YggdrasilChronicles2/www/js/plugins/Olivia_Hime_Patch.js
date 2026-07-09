/*:
 * @plugindesc Compatibility patch for Olivia_WeaknessDisplay and HIME_EnemyReinforcements.
 * @author JR
 * @help Place this below both plugins.
 */

(function() {
    if (!Imported.EnemyReinforcements || !Imported.Olivia_OctoBattle) return;

    var _Spriteset_Battle_removeEnemies = Spriteset_Battle.prototype.removeEnemies;
    Spriteset_Battle.prototype.removeEnemies = function() {
        // Check for and remove the old weakness windows before deleting the sprites
        if (this._enemySprites) {
            for (var i = 0; i < this._enemySprites.length; i++) {
                var sprite = this._enemySprites[i];
                if (sprite && sprite._weaknessWindow && this._baseSprite) {
                    this._baseSprite.removeChild(sprite._weaknessWindow);
                }
            }
        }
        // Proceed with Hime's original sprite removal
        _Spriteset_Battle_removeEnemies.call(this);
    };
})();