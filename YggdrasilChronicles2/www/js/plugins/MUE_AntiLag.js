/*:
@plugindesc |v1.1.0.0| This plugin helps remove some of the lag, 
although some of the added features are experimental and only 
slightly help
@author Mutation Industries(MuteDay)

@param -----Animated Tiles-------
@desc ==========================================================
@default ==========================================================

@param Use Animation Edits
@desc This tells the game to or not to antilag animated tiles
(Default false)
@default false

@param Animation Loop
@desc This tells the game to what animation loop to use for
animated tiles (Default 1)
@default 1

@param No Animated Tiles
@desc This tells the game to draw the tile like a normal tile
(default false)
@default false

@help
------------------------------------------------------------------------
youtube Video
------------------------------------------------------------------------
-None Currently-

========================================================================
Important
========================================================================
Always check the Website mutationengine.altervista.org/changelog.html 
For updates

========================================================================
Info
========================================================================
This plugin helps remove some of the lag, although some of the added
features are experimental and only slightly help

========================================================================
Required Plugins
========================================================================
----------------------
Layout
----------------------
Plugin Name +Link
Reason it is Required
----------------------
-NONE-

========================================================================
Optinal Plugins
========================================================================
----------------------
Layout
----------------------
Plugin Name +Link
Features added
----------------------
-NONE-

========================================================================
Plugin Params
========================================================================
----------------------
Layout
----------------------
Param Name
Default
Description
Note ID
blank space as sperator
----------------------
Use Animation Edits
false
This tells the game weithe or not you wish to antilag animated tiles
1

Animation Loop
1
This tells the game to what animation loop to use for animated tiles
1

No Animated Tiles
false
This tells the game to draw the tile like a normal tile
1

------------------------------------------------------------------------
Plugin Param Notes
------------------------------------------------------------------------
1: experimental use only if you wish to beta test or to try to improve
FPS

========================================================================
Updates History
========================================================================
1.0:
Initial Release

1.1.0.0: 
-added ability to modify animated tiles
-added secruity layer
-formatted help file
-formatted the plugin
-Normalized version system

========================================================================
Note Tag Data
========================================================================
-NONE-

------------------------------------------------------------------------
NoteTag Data Notes
------------------------------------------------------------------------
When using the note tags always surround with a opening < bracket
then the note tag
then the closing >

========================================================================
Plugin Commands
========================================================================
----------------------
Layout
----------------------
Plugin Command
Variables will be surrounded
By | |'s replace the all 
|+variable+| with your varaible
----------------------
-NONE-

========================================================================
Script Calls
========================================================================
----------------------
Layout
----------------------
Script Call
Variables will be surrounded
By | |'s replace the all 
|+variable+| with your varaible
----------------------
-NONE-

========================================================================
Extra Data
========================================================================
More Features will be added over time

========================================================================
ScreenShots
========================================================================
-None Non Visual-

========================================================================
Important Links and Notes
========================================================================
Patreon: https://www.patreon.com/MutationIndustries?ty=h

Notes: If you like any of the mutation engine plugins
consider supporting me, your support will allow me to
 build you more of what you want

========================================================================
Credits and Inportant info
========================================================================
Credits:
Myself
The rpg maker team for creating mv


Info:
Feel free to use this for any type of project some limits apply
1) Do not claim the work as your own
2) Do not post anywhere without my constent
3) Do not Make edits and then post anywhere

========================================================================
*/

//#region Namespace and Imported
var Imported=Imported||{};
Imported.MUE_AntiLag=true;
var MUE=MUE||{};
MUE.AntiLag=MUE.AntiLag||{};
//#endregion

(function($) {
    //#region varables
    var param=PluginManager.parameters('MUE_AntiLag');
    $.UseAniTileFix=eval(String(param['Use Animation Edits']));
    $.AniValue=Number(param['Animation Loop']||1);
    $.ChangeToNormalDraw=eval(String(param['No Animated Tiles']));
    //#endregion

    // Replaces the original refreshTileEvents to filter the _events array directly
    Game_Map.prototype.refreshTileEvents=function() {
        this.tileEvents=this._events.filter(function(event) {
            return !!event&&event.isTile();
        });
    };

    // Replaces the original eventsXy to filter the _events array directly
    Game_Map.prototype.eventsXy=function(x,y) {
        return this._events.filter(function(event) {
            return !!event&&event.pos(x,y);
        });
    };

    // Replaces the original eventsXyNt to filter the _events array directly
    Game_Map.prototype.eventsXyNt=function(x,y) {
        return this._events.filter(function(event) {
            return !!event&&event.posNt(x,y);
        });
    };

    if($.UseAniTileFix) {
        $.SceneUpdateCount=0;
        /**
     * @method _paintAllTiles
     * @param {Number} startX
     * @param {Number} startY
     * @private
     */
        Tilemap.prototype._paintAllTiles=function(startX,startY) {
            var tileCols=Math.ceil(this._width/this._tileWidth)+1;
            var tileRows=Math.ceil(this._height/this._tileHeight)+1;
            for(var y=0;y<tileRows;y++) {
                for(var x=0;x<tileCols;x++) {
                    if(this.animationCount>10)
                        if(this.animationCount/$.AniValue!=Math.floor(this.animationCount/$.AniValue)) return;
                    this._paintTiles(startX,startY,x,y);
                }
            }
        };
        Scene_Base.prototype.updateChildren=function() {
            this.children.forEach(function(child) {
                if(typeof child==Spriteset_Map) {
                    if($.SceneUpdateCount==1) {

                    } else if($.SceneUpdateCount<3)
                        return;
                    else {
                        $.SceneUpdateCount=0;
                        return;
                    }
                }
                if(child.update) {

                    child.update();
                }
            });
        };
        Scene_Map.prototype.update=function() {
            this.updateDestination();
            this.updateMainMultiply();
            if(this.isSceneChangeOk()) {
                this.updateScene();
            } else if(SceneManager.isNextScene(Scene_Battle)) {
                this.updateEncounterEffect();
            }

            this.updateWaitCount();
            $.SceneUpdateCount++;

            Scene_Base.prototype.update.call(this);
        };
        //replace the games drawing of animated tiles
        /**
         * @method _drawAutotile
         * @param {Bitmap} bitmap
         * @param {Number} tileId
         * @param {Number} dx
         * @param {Number} dy
         * @private
         */
        Tilemap.prototype._drawAutotile=function(bitmap,tileId,dx,dy) {
            var autotileTable=Tilemap.FLOOR_AUTOTILE_TABLE;
            var kind=Tilemap.getAutotileKind(tileId);
            var shape=Tilemap.getAutotileShape(tileId);
            var tx=kind%8;
            var ty=Math.floor(kind/8);
            var bx=0;
            var by=0;
            var setNumber=0;
            var isTable=false;
            var temp1=4;
            var temp2=3;
            if($.ChangeToNormalDraw) {
                temp1=1;
                temp2=1;
            }
            if(Tilemap.isTileA1(tileId)) {
                var waterSurfaceIndex=[0,1,2,1][this._animationFrame%temp1];
                setNumber=0;
                if(kind===0) {
                    bx=waterSurfaceIndex*2;
                    by=0;
                } else if(kind===1) {
                    bx=waterSurfaceIndex*2;
                    by=3;
                } else if(kind===2) {
                    bx=6;
                    by=0;
                } else if(kind===3) {
                    bx=6;
                    by=3;
                } else {
                    bx=Math.floor(tx/4)*8;
                    by=ty*6+Math.floor(tx/2)%2*3;
                    if(kind%2===0) {
                        bx+=waterSurfaceIndex*2;
                    }
                    else {
                        bx+=6;
                        autotileTable=Tilemap.WATERFALL_AUTOTILE_TABLE;
                        by+=this._animationFrame%temp2;
                    }
                }
            } else if(Tilemap.isTileA2(tileId)) {
                setNumber=1;
                bx=tx*2;
                by=(ty-2)*3;
                isTable=this._isTableTile(tileId);
            } else if(Tilemap.isTileA3(tileId)) {
                setNumber=2;
                bx=tx*2;
                by=(ty-6)*2;
                autotileTable=Tilemap.WALL_AUTOTILE_TABLE;
            } else if(Tilemap.isTileA4(tileId)) {
                setNumber=3;
                bx=tx*2;
                by=Math.floor((ty-10)*2.5+(ty%2===1?0.5:0));
                if(ty%2===1) {
                    autotileTable=Tilemap.WALL_AUTOTILE_TABLE;
                }
            }

            var table=autotileTable[shape];
            var source=this.bitmaps[setNumber];

            if(table&&source) {
                var w1=this._tileWidth/2;
                var h1=this._tileHeight/2;
                for(var i=0;i<4;i++) {
                    var qsx=table[i][0];
                    var qsy=table[i][1];
                    var sx1=(bx*2+qsx)*w1;
                    var sy1=(by*2+qsy)*h1;
                    var dx1=dx+(i%2)*w1;
                    var dy1=dy+Math.floor(i/2)*h1;
                    if(isTable&&(qsy===1||qsy===5)) {
                        var qsx2=qsx;
                        var qsy2=3;
                        if(qsy===1) {
                            qsx2=[0,3,2,1][qsx];
                        }
                        var sx2=(bx*2+qsx2)*w1;
                        var sy2=(by*2+qsy2)*h1;
                        bitmap.blt(source,sx2,sy2,w1,h1,dx1,dy1,w1,h1);
                        dy1+=h1/2;
                        bitmap.blt(source,sx1,sy1,w1,h1/2,dx1,dy1,w1,h1/2);
                    } else {
                        bitmap.blt(source,sx1,sy1,w1,h1,dx1,dy1,w1,h1);
                    }
                }
            }
        };
        Game_Event.prototype.update=function() {
            Game_Character.prototype.update.call(this);
            if(!this._animationDisabled) {
                if(this._moveType==0) {
                    this._walkAnime=false;
                    this._stepAnime=false;
                    this._animationDisabled=true;
                }
            }
            this.checkEventTriggerAuto();
            this.updateParallel();
        };
    }
})(MUE.AntiLag);