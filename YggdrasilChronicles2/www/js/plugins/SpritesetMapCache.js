//=============================================================================
// SpritesetMapCache.js
//=============================================================================

/*:
 * @plugindesc Spriteset_Map caching system. Optimises CPU usage and memory allocations.
 * @author Felix "Xilefian" Jones
 *
 * @param Cache Size
 * @desc How many spritesets can be stored in the cache.
 * @default 5
 *
 * @help
 *
 * This Plugin optimises the way spritesets are handled by Scene_Map by caching them.
 * By using a cache, the memory usage and CPU usage is reduced massively.
 * If you are transferring between different maps frequently, increase the Cache Size.
 *
 * Plugin Command:
 *   SpritesetMapCache flush    # Flushes the cache
 *
 * JS API:
 *   $gameSystem.flushSpritesetMapCache();
 *
 * Created for Brandos
 *
 * Version 1.5
 * Website http://www.hbgames.org
 *
 * Change log:
 *   Version 1.5:
 *     Fixed flush crashing with cache size 0.
 *   Version 1.4:
 *     Fixed Spriteset_Map_Cache.createSpriteset crashing with cache size 0.
 *   Version 1.3:
 *     Character sprites are now reset when loading from cache.
 *     Added cleaning the PIXI.BaseTextureCache.
 *   Version 1.2:
 *     Fixed events persisting across save files.
 *     Scene_Map.createSpriteset is now more robust.
 *   Version 1.1:
 *     Fixed events disappearing after battles.
 *     Added memory leak cleanup with parallaxes.
 *   Version 1.0:
 *     Initial version.
 *
 */

(function() {

    var parameters = PluginManager.parameters( 'SpritesetMapCache' );
    var cacheSize = Number( parameters['Cache Size'] || 5 );
    var spritesetMapTemp; // Holds the Spriteset_Map class

    function Spriteset_Map_Cache() {
        throw new Error( 'This is a static class' );
    };

    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function( command, args ) {
        _Game_Interpreter_pluginCommand.call( this, command, args );
        if ( command === 'SpritesetMapCache' ) {
            switch ( args[0] ) {
            case 'flush':
                $gameSystem.flushSpritesetMapCache();
                break;
            }
        }
    };

    if ( cacheSize == 0 ) {

        Spriteset_Map_Cache._cache = {};

        Game_System.prototype.flushSpritesetMapCache = function() {
            var currentKey = $gameMap.mapId();
            var currentSpriteSet = Spriteset_Map_Cache._cache[currentKey];
            for ( var key in Spriteset_Map_Cache._cache ) {
                if ( key == currentKey ) {
                    continue;
                }
                var remove = Spriteset_Map_Cache._cache[key];
                remove.cleanupLeaks();
            }
            Spriteset_Map_Cache._cache = {};
            if ( currentSpriteSet ) {
                Spriteset_Map_Cache._cache[currentKey] = currentSpriteSet;
            }
        };

        /**
         * Checks cache for spriteset
         * If it's not found, add to cache
         */
        Spriteset_Map_Cache.createSpriteset = function( key ) {
            if ( !this._cache[key] ) {
                this._cache[key] = new Spriteset_Map();
            } else if ( SceneManager.isPreviousScene( Scene_Battle ) ) {
                this._cache[key].showCharacters();
            } else {
                this._cache[key].removeCharacters();
                this._cache[key].createCharacters();
            }
            return this._cache[key];
        };

    } else {

        Spriteset_Map_Cache._cache = [];

        Game_System.prototype.flushSpritesetMapCache = function() {
            var currentKey = $gameMap.mapId();
            var current = null;
            for ( var ii = 0; ii < Spriteset_Map_Cache._cache.length; ii++ ) {
                var remove = Spriteset_Map_Cache._cache[ii];
                if ( remove.key == currentKey ) {
                    current = remove;
                    continue;
                }
                remove.spriteset.cleanupLeaks();
            }
            Spriteset_Map_Cache._cache = [];
            if ( current ) {
                Spriteset_Map_Cache._cache[0] = current;
            }
        };

        /**
         * Checks cache for spriteset
         * If it's found, moved to top of cache
         * If it's not found, add to cache
         * If cache is full, remove the last item
         */
        Spriteset_Map_Cache.createSpriteset = function( key ) {
            // Search cache for key
            for ( var ii = 0; ii < Spriteset_Map_Cache._cache.length; ii++ ) {
                var item = Spriteset_Map_Cache._cache[ii];
                if ( item.key == key ) {
                    if ( ii > 0 ) {
                        Spriteset_Map_Cache._cache.splice( ii, 1 );
                        Spriteset_Map_Cache._cache.unshift( item );
                    }
                    if ( SceneManager.isPreviousScene( Scene_Battle ) ) {
                        item.spriteset.showCharacters();
                    } else {
                        item.spriteset.removeCharacters();
                        item.spriteset.createCharacters();
                    }
                    return item.spriteset;
                }
            }
            // Create cache entry
            var item = {
                key : key,
                spriteset : new Spriteset_Map()
            };
            // Remove last item if cache is full
            if ( Spriteset_Map_Cache._cache.length + 1 > cacheSize ) {
                var remove = Spriteset_Map_Cache._cache.pop();
                remove.spriteset.cleanupLeaks();
            }
            // Add new entry to top of cache
            Spriteset_Map_Cache._cache.unshift( item );

            return item.spriteset;
        };

    }

    /**
     * Spriteset_Map.cleanupLeaks
     */
    Spriteset_Map.prototype.cleanupLeaks = function() {
        if ( this._parallax.tilingTexture && this._parallax.tilingTexture.canvasBuffer ) {
            PIXI.BaseTextureCache[this._parallax.tilingTexture.canvasBuffer.canvas._pixiId].destroy( true );
            delete PIXI.BaseTextureCache[this._parallax.tilingTexture.canvasBuffer.canvas._pixiId];
        }
        this._parallax.tilingTexture.destroy( true );
        this._parallax.tilingTexture = null;
    };

    /**
     * Spriteset_Map.showCharacters
     */
    Spriteset_Map.prototype.showCharacters = function() {
        for ( var ii = 0; ii < this._characterSprites.length; ii++ ) {
            var sprite = this._characterSprites[ii];
            if ( !sprite.isTile() ) {
                sprite.show();
            }
        }
    };

    /**
     * Spriteset_Map.removeCharacters
     */
    Spriteset_Map.prototype.removeCharacters = function() {
        for ( var ii = 0; ii < this._characterSprites.length; ii++ ) {
            this._tilemap.removeChild( this._characterSprites[ii] );
        }
    };

    /**
     * Spriteset_Map overload
     * This will replace the new Spriteset_Map function!
     */
    var Spriteset_Map_Create = function() {
        // We use the mapId as our cache key
        Spriteset_Map = spritesetMapTemp;
        var spriteSet = Spriteset_Map_Cache.createSpriteset( $gameMap.mapId() );
        Spriteset_Map = Spriteset_Map_Create;
        return spriteSet;
    };

    /**
     * Scene_Map.createSpriteset overload
     */
    var _Scene_Map_createSpriteset = Scene_Map.prototype.createSpriteset;
    Scene_Map.prototype.createSpriteset = function() {
        spritesetMapTemp = Spriteset_Map;
        Spriteset_Map = Spriteset_Map_Create;
        _Scene_Map_createSpriteset.call( this );
        Spriteset_Map = spritesetMapTemp;
    };

    /**
     * DataManager.createGameObjects overload
     * This will flush any cached spritesets
     */
    var _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call( this );
        $gameSystem.flushSpritesetMapCache();
    };

})();
