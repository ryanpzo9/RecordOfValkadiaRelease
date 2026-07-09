//=============================================================================
// EISTeleportationSystem.js                                                             
//=============================================================================

/*:
* @author Kino
* @plugindesc This is a plugin that creates a new teleportation scene in your game.
*
* @help
* Version: 1.03
* 
* Notetag:
*  <teleportMap: <picturename> <x> <y> <direction> >
* - Displays a picture, plus changes the player direction after teleporting.
* Example: <teleportMap: TestShot 3 6 6>
*  <teleportMap: <x> <y> >
* - The default direction will be right.
* Example: <teleportMap: 3 6 >
*  <teleportMap: <x> <y> <direction> >
* Example: <teleportMap: 4 6 2>
* - Changes the direction of the player.
* - The two numbers are the x and y values of your teleport on that map.
* 
* Functions
* KR.Helpers.startTeleportScene()
* - Starts the teleportation system Scene.
* 
* KR.Helpers.enableTeleport(mapName, mapId)
* - Enables a teleport map on the menu -- you can use either mapname or Id.
* - Example: KR.Helpers.enableTeleport("Deep Dungeon");
*
* KR.Helpers.disableTeleport(mapName, mapId)
* - Disables a teleport map on the command menu.
* - Example: KR.Helpers.disableTeleport("Deep Dungeon");
*
* KR.Helpers.enableAllTeleports()
* - Enables all teleports on the command menu.
*
* KR.Helpers.disableAllTeleports()
* - Disables all teleports on the command menu.
* KR.Helpers.changeBackground(imageName)
* - Adds a picture to the background of the Teleportation Scene.
* Example: KR.Helpers.changeBackground("SplashBackground");
* - This will load the image, and change the background in the scene when you call it.
* 
* Follow me on twitter: EISKino
* Contact me on the forums for any issues. 
* 
* http://forums.rpgmakerweb.com/ 
* username: Kino
* 
* For any ideas to make the plugin better feel free to contact me also!
* Hope this plugin helps, and enjoy!
*/

//=============================================================================
// Namespace Initialization                                                             
//=============================================================================

var KR = KR || {};
KR.Plugins = KR.Plugins || {};
KR.Helpers = KR.Helpers || {};

(function($){
//=============================================================================
// Plugin Variables
//=============================================================================
  var parameters = PluginManager.parameters('EISTeleportationSystem');
  
  $.Plugins.TeleportationSystem = function() {

//=============================================================================
// TeleportManager
//=============================================================================
    function TeleportManager() {
      
    }
    
    TeleportManager.teleportRe = /\W*<teleportMap:\W*([A-Z]+\d*)?\W+(\d*)\W?(\d*)\W?(\d*)?\W*>/ig;

    TeleportManager.mapList = [];
    
    TeleportManager.updateMapList = function(mapObject) {
      mapObject.process = true;
      if(this.checkIfDuplicate(mapObject.mapId) === false) {
        this.mapList.push(mapObject);  
        this.updated = true;
      }                
    };

    TeleportManager.getTeleportInfo = function(mapName, mapId) {
      var map = null;
      this.mapList.forEach(function(currentMap){
        if(currentMap.mapId === mapId || currentMap.mapName === mapName) {
          map = currentMap;
        }
      });
      return map;
    };

    TeleportManager.checkIfDuplicate = function(mapId) { 
      for(var i = 0; i < this.mapList.length; i++) {
        if(this.mapList[i].mapId === mapId) {
          return true;
        }
      }
      return false;
    };
    
    TeleportManager.disableTeleport = function(mapName, mapId) {
      var map = this.getTeleportInfo(mapName, mapId);
      map.process = false; 
    };

    TeleportManager.disableAllTeleports = function() {
      this.mapList.forEach(function(map) {
        map.process = false;
      });
    };

    TeleportManager.enableAllTeleports = function() {
      this.mapList.forEach(function(map){
        map.process = true;
      });
    };
    
    TeleportManager.enableTeleport = function(mapName, mapId) {
      var map = this.getTeleportInfo(mapName, mapId);
      map.process = true;
    };

    TeleportManager.setBackground = function(imageName) {
     this.teleportSceneBackground = ImageManager.loadPicture(imageName); 
     this.hasBackground = true;
    };

    TeleportManager.getBackground = function() {
      return this.teleportSceneBackground;
    };

    TeleportManager.hasBackground = false;

    TeleportManager.teleportSceneBackground = null;

    TeleportManager.reservedTransfer = false;

    TeleportManager.executeTransfer = null;

    TeleportManager.transferComplete = false;
 
//=============================================================================
// Scene_Map
//=============================================================================
    
    var EISSceneMap_initialize = Scene_Map.prototype.initialize;
    Scene_Map.prototype.initialize = function() {
      EISSceneMap_initialize.call(this);
      this.extracted = false;
    };

    var EISSceneMap_update = Scene_Map.prototype.update;
    Scene_Map.prototype.update = function() {
      EISSceneMap_update.call(this);
      this.processTransfer();
      this.processNewTeleportMap();
    };

    Scene_Map.prototype.processTransfer = function() {  
      if(TeleportManager.reservedTransfer === true){   
        TeleportManager.executeTransfer();
        TeleportManager.transferComplete = false;
        TeleportManager.reservedTransfer = false; 
      }
      if(TeleportManager.reservedTransfer === false && $gamePlayer.isMoving() && TeleportManager.transferComplete === false) {
        $gamePlayer.moveForward();
        TeleportManager.transferComplete = true;
      }
    };
    
    Scene_Map.prototype.processNewTeleportMap = function() {
      if(this._fadeDuration === 0 && this.extracted === false) {
        this.extractNoteContents();
        this.extracted = true;
      }
    };

    Scene_Map.prototype.addTeleportMap = function(teleportInfo) {
      TeleportManager.teleportRe.lastIndex = 0;
      var temp = {
        mapId: $gameMap.mapId(),
        mapName: $gameMap.displayName(),
        pictureName: teleportInfo[1],
        x: teleportInfo[2],
        y: teleportInfo[3],
        direction:teleportInfo[4]
      };
      TeleportManager.updateMapList(temp);
     };

     Scene_Map.prototype.extractNoteContents = function() {
      var noteContents = TeleportManager.teleportRe.exec($dataMap.note);
      if( noteContents !== null) {
        this.addTeleportMap(noteContents);
      }
      TeleportManager.teleportRe.lastIndex = 0;
    };

//=============================================================================
// Scene_Teleport 
//=============================================================================
    
    function Scene_Teleport() {
      this.initialize.apply(this, arguments);
    }
    
    Scene_Teleport.prototype = Object.create(Scene_Base.prototype);
    Scene_Teleport.prototype.constructor = Scene_Teleport;
    
    Scene_Teleport.prototype.initialize = function() {
      Scene_Base.prototype.initialize.call(this);
      this.originalmapList = TeleportManager.mapList.slice(0);
      this.currentmapList = TeleportManager.mapList;
      
    };
    
    Scene_Teleport.prototype.create = function() {
      Scene_Base.prototype.create.call(this);
      this.createBackground();
      this.createWindowLayer();
      this.createAllWindows();
    };

    Scene_Teleport.prototype.createBackground = function() {
      if(TeleportManager.hasBackground) {
        this.background = new Sprite();
        this.background.bitmap = TeleportManager.getBackground();
        this.addChild(this.background);
      }
    };
    
    Scene_Teleport.prototype.createAllWindows = function() {
      this.createMapSelectWindow();
      this.createMapPictureWindow();
    };
    
    Scene_Teleport.prototype.update = function() {
      Scene_Base.prototype.update.call(this);
      this.refresh();
    };
    
    Scene_Teleport.prototype.refresh = function() {
      this.processInput();
      this.processPicture();
    };
    
    Scene_Teleport.prototype.createMapSelectWindow = function() {
      this.mapSelectWindow = new Window_MapSelect(0, 0);
      this.mapSelectWindow.setHandler('Transfer', this.commandTransfer.bind(this));
      this.addWindow(this.mapSelectWindow);
    };
    
    Scene_Teleport.prototype.createMapPictureWindow = function() {
      this.mapPictureWindow = new Window_MapPicture(201, 0, Graphics.width - 200, Graphics.height / 2 );
      this.addWindow(this.mapPictureWindow);
    };
    
    Scene_Teleport.prototype.processInput = function() {
      if(this.mapSelectWindow.isCancelTriggered()) {
        SceneManager.pop();
      }     
    };

    Scene_Teleport.prototype.processPicture = function() {
      this.mapPictureWindow.getIndex(this.mapSelectWindow.index());
    };
    
    
//=============================================================================
// Scene_Teleport Commands
//=============================================================================
    
    Scene_Teleport.prototype.commandTransfer = function() {
      //direction = look at NumPad  fade type = 0-Black, 1-White, 2-None
      var executeableTransfer = function(teleportInfo) {
        var direction = null;
        direction = (typeof teleportInfo.direction === 'undefined') ? 2 : teleportInfo.direction;
        $gamePlayer.reserveTransfer(teleportInfo.mapId, teleportInfo.x, teleportInfo.y, $gamePlayer.setDirection(direction), 0);
      };

      TeleportManager.executeTransfer = executeableTransfer.bind(this, this.mapSelectWindow.currentExt());
      TeleportManager.reservedTransfer = true; 
      SceneManager.goto(Scene_Map);
    };
    
//=============================================================================
// Window_MapSelect
//=============================================================================
    
    function Window_MapSelect() {
      this.initialize.apply(this, arguments);
    }
    
    Window_MapSelect.prototype = Object.create(Window_Command.prototype);
    Window_MapSelect.prototype.constructor  = Window_MapSelect;
    
    Window_MapSelect.prototype.initialize = function(x, y, width, height) {
      Window_Command.prototype.initialize.call(this, x, y);
    };
    
    Window_MapSelect.prototype.windowWidth = function() {
      return 200;
    };
    
    Window_MapSelect.prototype.windowHeight = function() {
      return Graphics.height;
    };
    
    Window_MapSelect.prototype.maxItems = function() {
      return TeleportManager.mapList.length;
    };
    
    Window_MapSelect.prototype.makeCommandList = function() {
      this.addTeleportMaps();
    };
    
    Window_MapSelect.prototype.addTeleportMaps = function() {
      var that = this;
       TeleportManager.mapList.forEach(function(map) {
        that.addCommand(map.mapName, 'Transfer', map.process, map);
      });
    };
    
//=============================================================================
// Window_MapPicture
//=============================================================================
    
    function Window_MapPicture() {
      this.initialize.apply(this, arguments);
    }
    
    Window_MapPicture.prototype = Object.create(Window_Base.prototype);
    Window_MapPicture.prototype.constructor = Window_MapPicture;
    
    Window_MapPicture.prototype.initialize = function(x, y, width, height) {
      Window_Base.prototype.initialize.call(this, x, y, width, height);
      this.width = width;
      this.height = height;
      this.index = 0;
      this.pictureSprite = new Sprite();
      this.pictureList = [];
      this.preloadImages();
      this.pictureSprite.move(this.standardPadding() - 3, this.standardPadding());         
      this.addChildToBack(this.pictureSprite);  
    };

    Window_MapPicture.prototype.preloadImages = function() {
      // Loading information
      for(var i= 0; i < TeleportManager.mapList.length; i++ ) {
        var bitmap = ImageManager.loadPicture(TeleportManager.mapList[i].pictureName);
        this.pictureList.push(bitmap);
      }
    };
    
    Window_MapPicture.prototype.update = function() {
     this.refresh();
    };
   
    Window_MapPicture.prototype.refresh = function() {
      this.refreshPicture();
    };
   
    Window_MapPicture.prototype.refreshPicture = function() {
      if(this.pictureList !== null) {
        if(this.pictureList[this.index] !== null) {
          this.pictureSprite.bitmap = new Bitmap(Graphics.width, Graphics.height);
          this.pictureSprite.bitmap = this.pictureList[this.index];
          this.pictureSprite.scale = new Point(0.55, 0.45);
          this.pictureSprite.setFrame(0, 0, this.pictureSprite.bitmap.width, this.pictureSprite.bitmap.height);
        }        
      } 
    };
    
    Window_MapPicture.prototype.getIndex = function(index) {
      this.index = index;
    };

//=============================================================================
// Data Manager                                                             
//=============================================================================
  
  var DataManager_makeSaveContents = DataManager.makeSaveContents;
  DataManager.makeSaveContents = function() {
    // A save data does not contain $gameTemp, $gameMessage, and $gameTroop.
    var contents = {};
    contents = DataManager_makeSaveContents.call(this);
    contents.teleportList = TeleportManager.mapList;
    return contents;
  };

  var DataManager_extractSaveContents = DataManager.extractSaveContents;
  DataManager.extractSaveContents = function(contents) {
    DataManager_extractSaveContents.call(this, contents);
    TeleportManager.mapList = contents.teleportList;
  };
    
//=============================================================================
// Helper Functions
//=============================================================================
    $.Helpers.startTeleportScene = function() {
      SceneManager.push(Scene_Teleport);
    };

    $.Helpers.disableTeleport = function(mapName, mapId) {
      TeleportManager.disableTeleport(mapName, mapId);
    };

    $.Helpers.enableTeleport = function(mapName, mapId) {
      TeleportManager.enableTeleport(mapName, mapId);
    };

    $.Helpers.disableAllTeleports = function() {
      TeleportManager.disableAllTeleports();
    };

    $.Helpers.enableAllTeleports = function() {
      TeleportManager.enableAllTeleports();
    };

    $.Helpers.changeBackground = function(imageName) {
      TeleportManager.setBackground(imageName);
    };
    
  };
  $.Plugins.TeleportationSystem();
})(KR);