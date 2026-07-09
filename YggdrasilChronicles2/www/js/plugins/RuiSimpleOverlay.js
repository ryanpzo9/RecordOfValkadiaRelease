/*:
* @plugindesc Display image layers on screen. Version: 1.0
* @author Rui
* @help
* ----------------------------------------
* SimpleOverlay AddLayer layerName imageFileName isBindToScreen zIndex opacity xPosition yPosition
* ----------------------------------------
* add image layer. layers are saved with map, only need to add once per map. place images in parallaxes folder.
* isBindToScreen: if set to "true", image will stay on screen.
* xPosition/yPosition: top-left position of layer.
* zIndex: if set to "-1", layer is below everything else. if set to 10 or above, layer is above everything else.
* opacity: 0-255
* eg. SimpleOverlay AddLayer layer1 Fog false 11 100 0 0
*
*
* ----------------------------------------
* SimpleOverlay AddTilingLayer layerName imageFileName isBindToScreen zIndex opacity xPosition yPosition width height xMovement yMovement
* ----------------------------------------
* add image layer. layers are saved with map, only need to add once per map. place images in parallaxes folder.
* isBindToScreen: if set to "true", image will stay in screen position.
* xPosition/yPosition: top-left position of layer.
* width/height: width and height of layer
* xMovement/yMovement: animating layer
* zIndex: if set to "-1", layer is below everything else. if set to 10 or above, layer is above everything else.
* opacity: 0-255
* eg. SimpleOverlay AddTilingLayer layer2 Fog true 11 100 0 0 800 800 1 0
*
*
* ----------------------------------------
* SimpleOverlay Clear
* ----------------------------------------
* clear all layers on this map
*
*
* ----------------------------------------
* SimpleOverlay Clear layerName
* ----------------------------------------
* clear layer with layerName
*
*
* License: Free for non-commercial and commercial use
*/


(function() {
    //SimpleOverlayObj
    function SimpleOverlay() {
        this.simpleOverlayObjList = {};    //dictionary with mapID as key
    }

    SimpleOverlay.prototype.getSimpleOverlayObjListByMapID = function() {
        var mapID = $gameMap.mapId().toString();
        if (DataManager.___simpleOverlay___.simpleOverlayObjList.hasOwnProperty(mapID)) {
            return DataManager.___simpleOverlay___.simpleOverlayObjList[mapID];
        }
        else {
            DataManager.___simpleOverlay___.simpleOverlayObjList[mapID] = [];
            return DataManager.___simpleOverlay___.simpleOverlayObjList[mapID];
        }       
    };

    SimpleOverlay.prototype.hasLayer = function(layerName) {
        var simpleOverlayObjList = DataManager.___simpleOverlay___.getSimpleOverlayObjListByMapID();
        for (var i = simpleOverlayObjList.length - 1; i >= 0; i--) {
            if (simpleOverlayObjList[i].layerName === layerName)
                return true;
        }

        return false;
    }
  
    //SimpleOverlayObj object
    function SimpleOverlayObj(layerName, imageFileName, isBindToScreen, zIndex, opacity, xPosition, yPosition, width, height, xMovement, yMovement, isTiling) {
        this.layerName = layerName;
        this.imageFileName = imageFileName;
        this.isBindToScreen = isBindToScreen.toUpperCase() === "TRUE";
        this.zIndex = parseInt(zIndex);
        this.opacity = parseInt(opacity);
        this.xPosition = parseInt(xPosition);
        this.yPosition = parseInt(yPosition);
        this.width = parseInt(width);
        this.height = parseInt(height);
        this.xMovement = parseInt(xMovement);
        this.xMovement *= -1;
        this.yMovement = parseInt(yMovement);
        this.isTiling = isTiling.toUpperCase() === "TRUE";

        this.delete = false;

        DataManager.___simpleOverlay___.getSimpleOverlayObjListByMapID().push(this);
    }

    //add sprite when creating text or starting scene
    SimpleOverlayObj.prototype.addSprite = function(spriteset_Map, x, y) {
        if (this.isTiling == false) {
            var sprite = new Sprite();
            sprite.anchor.x = 0;
            sprite.anchor.y = 0;
            sprite.z = this.zIndex;
            sprite.opacity = this.opacity;
            sprite.bitmap = ImageManager.loadParallax(this.imageFileName);
            sprite.___simpleOverlayObjRef___ = this;

            spriteset_Map._tilemap.addChild(sprite);

            sprite.x = x;
            sprite.y = y;
        }
        else {
            var sprite = new TilingSprite();
            sprite.anchor.x = 0;
            sprite.anchor.y = 0;
            sprite.z = this.zIndex;
            sprite.opacity = this.opacity;
            sprite.bitmap = ImageManager.loadParallax(this.imageFileName);
            sprite.___simpleOverlayObjRef___ = this;

            spriteset_Map._tilemap.addChild(sprite);

            sprite.move(x, y, this.width, this.height);
        }
    };

    //update function
    SimpleOverlayObj.prototype.update = function(index, spriteset_Map) {
        var foundSprite = false;
        var child = null;

        for (var i = spriteset_Map._tilemap.children.length - 1; i >= 0; i--) {
            child = spriteset_Map._tilemap.children[i];

            if (typeof(child.___simpleOverlayObjRef___)==='undefined') {
                continue;
            }
            else {
                if (child.___simpleOverlayObjRef___ == this) {
                    foundSprite = true;
                  
                    if (this.delete == true) {
                        child.bitmap = null;
                        spriteset_Map._tilemap.removeChildAt(i);
                    }

                    break;
                }
            }
        }

        if (this.delete == true) {
            DataManager.___simpleOverlay___.getSimpleOverlayObjListByMapID().splice(index, 1);
            return;
        }

        //get center position
        var centerX = this.xPosition;
        var centerY = this.yPosition;

        if (this.isBindToScreen == false) {
            var tw = $gameMap.tileWidth();
            var th = $gameMap.tileHeight();

            var scrolledX = $gameMap.adjustX(this.xPosition / tw);
            var scrolledY = $gameMap.adjustY(this.yPosition / th);

            var screenX = Math.round(scrolledX * tw);
            var screenY = Math.round(scrolledY * th + th);

            centerX = screenX;
            centerY = screenY - $gameMap.tileHeight();
        }

        //update sprite position
        if (foundSprite == false) {
            child = this.addSprite(spriteset_Map, centerX, centerY);
        }
        else {
            if (this.isTiling == false) {
                child.x = centerX;
                child.y = centerY;
            }
            else {
                child.move(centerX, centerY, this.width, this.height);
                child.origin.x += this.xMovement;
                child.origin.y += this.yMovement;
            }
        }
    };

    //create SimpleOverlay in DataManager
    var _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);

        if (typeof(DataManager.___simpleOverlay___)==='undefined')
            DataManager.___simpleOverlay___ = new SimpleOverlay();
    };

    //add sprites on createTilemap
    var _Spriteset_Map_prototype_createTilemap = Spriteset_Map.prototype.createTilemap;
    Spriteset_Map.prototype.createTilemap = function() {
        _Spriteset_Map_prototype_createTilemap.call(this);

        //remove all layer sprites if exits
        for (var i = this._tilemap.children.length - 1; i >= 0; i--) {
            var child = this._tilemap.children[i];

            if (typeof(child.___simpleOverlayObjRef___)==='undefined') {
                continue;
            }
            else {
                child.bitmap = null;
                this._tilemap.removeChildAt(i);
            }
        }
    }
  
    //update SimpleOverlayObjList
    var _Spriteset_Map_prototype_updateTilemap = Spriteset_Map.prototype.updateTilemap;
    Spriteset_Map.prototype.updateTilemap = function() {
        _Spriteset_Map_prototype_updateTilemap.call(this);

        var simpleOverlayObjList = DataManager.___simpleOverlay___.getSimpleOverlayObjListByMapID();
        for (var i = simpleOverlayObjList.length - 1; i >= 0; i--)
            simpleOverlayObjList[i].update(i, this);
    };

    //read plugin command
    var _Game_Interpreter_prototype_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_prototype_pluginCommand.call(this, command, args);
      
        //only work with Scene_Map
        if (SceneManager._scene instanceof Scene_Map == false)
            return;

        var argsLength = args.length;
        var action = args[0].toUpperCase();
        if (action == "ADDLAYER") {
            if (argsLength == 8) {
                var layerName = args[1];
                if (DataManager.___simpleOverlay___.hasLayer(layerName) == true)
                    return;

                var simpleOverlayObj = new SimpleOverlayObj(args[1], args[2], args[3], args[4], args[5], args[6], args[7], "0", "0", "0", "0", "FALSE");
            }
        }
        else if (action == "ADDTILINGLAYER") {
            if (argsLength == 12) {
                var layerName = args[1];
                if (DataManager.___simpleOverlay___.hasLayer(layerName) == true)
                    return;

                var simpleOverlayObj = new SimpleOverlayObj(args[1], args[2], args[3], args[4], args[5], args[6], args[7], args[8], args[9], args[10], args[11], "TRUE");
            }
        }
        else if (action == "CLEAR") {
            if (argsLength == 2) {
                var layerName = args[1];
                var simpleOverlayObjList = DataManager.___simpleOverlay___.getSimpleOverlayObjListByMapID();
                for (var i = simpleOverlayObjList.length - 1; i >= 0; i--) {
                    if (simpleOverlayObjList[i].layerName === layerName)
                        simpleOverlayObjList[i].delete = true;   
                }
            }
            else if (argsLength == 1) {
                var simpleOverlayObjList = DataManager.___simpleOverlay___.getSimpleOverlayObjListByMapID();
                for (var i = simpleOverlayObjList.length - 1; i >= 0; i--) {
                    simpleOverlayObjList[i].delete = true; 
                }
            }
        }
    };
})();