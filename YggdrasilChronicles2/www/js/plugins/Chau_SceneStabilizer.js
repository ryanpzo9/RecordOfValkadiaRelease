/*:
@author Chaucer
@plugindesc | Scene Stabilizer : Version - 2.0.1 | Stabilizes scenes on scene transfer.
@help
===============================================================================
 Introduction :
===============================================================================

 This plugin pauses a scene once it starts to render, when the scene is paused
 all update methods are postponed. The scene will only begin to update once
 the scene is at a stable fps to ensure a smoother transition between scenes.

 Normally when changing scenes in MV( especially when entering a new scene for
 the first time ) it takes a bit more processing power to render all elements
 to the screen, this plugins purpose is to make those transitions less laggy
 by slightly prolonging the loading process in order to allow the game enough
 time to render all elements, and stabilize its draw cycles.

 As of 2.0.0, this plugin now has the ability to preload bgm for title, and
 battle scenes, as well as bgm & bgs for map scenes( thanks to Oscar92player
 for helping out with testing/debugging ). This is an optional feature and is
 disabled by default, if you choose to enable it, it WILL increase loading
 time between scenes since the scene will not load until the bgm/bgs are ready,
 this is to ensure that the audio plays immediately when the scene starts. This
 plugin does NOT preload se/me's and will NOT load custom audio that is added
 through other plugins. You cannot add custom audio files to be loaded between
 scene transfers at this time.

===============================================================================
 Requirements :
===============================================================================

---------------------------------------
 None.
---------------------------------------

===============================================================================
 Instructions :
===============================================================================

---------------------------------------
 N/A.
---------------------------------------

===============================================================================
 Terms Of Use :
===============================================================================

  This Plugin may be used commercially, or non commercially so long as credit
 is given, either in the games credit section, or in a text file alongside
 the game. This plugin may NOT be sold, or Plagiarized. This plugin may
 be extended upon, and shared freely.


===============================================================================
 Version History :
===============================================================================

 ● Version : 1.0.0
 ● Date : 13/01/2018
   ★ Release.

 ● Version : 1.4.0
 ● Date : 17/01/2018
   ★ Added the option to attempt to stabilize animations.

 ● Version : 1.5.0
 ● Date : 17/01/2018
   ★ Upload Animations to GPU before playing.
   ✩ Fixed issue with picture stabilization.

 ● Version : 1.5.1
 ● Date : 17/01/2018
   ✩ Accidentally deleted code to shorten pause time.

 ● Version : 2.0.0
 ● Date : 17/01/2018
   ★ Added preload function for BGM and BGS( map, battle & title scene only ).

 ● Version : 2.0.1
 ● Date : 17/01/2018
   ✩ Fixed a bug which can cause the game to freeze.

===============================================================================
 Contact Me :
===============================================================================

  If you have questions, about this plugin, or commissioning me, or have
 a bug to report, please feel free to contact me by any of the below
 methods.

 rmw : https://forums.rpgmakerweb.com/index.php?members/chaucer.44456
 patreon : https://www.patreon.com/chaucer91
 discord : chaucer#7538
 skypeId : chaucer1991
 gmail : chaucer91

 ()()
 (^.^)
 c(")(")

===============================================================================

 @param stabilize_animations
 @desc should animations should trigger scene stabilizer( true or false if MV Version is below 1.5.X ).
 @default false
 @type boolean
 @on Enabled
 @off Disabled

 @param stabilize_pictures
 @desc should show picture commands should trigger scene stabilizer( true or false if MV Version is below 1.5.X ).
 @default false
 @type boolean
 @on Enabled
 @off Disabled

 @param preload_audio
 @desc should audio be preloaded before scenes start( true or false if MV Version is below 1.5.X ).
 @default false
 @type boolean
 @on Enabled
 @off Disabled

*/

//=============================================================================
var Imported = Imported || new Object();
Imported['CHAU_SceneStabilizer'] = true;
//=============================================================================
var Chaucer = Chaucer || new Object();
Chaucer.sceneStabilizer = new Object();
//=============================================================================


( function ( $ ) { //IIFE
  $ = $ || {};

//Create plugin information.
//=============================================================================
  var regxp = /Scene Stabilizer : Version - \d+\.\d+\.\d+/;
  for ( var i = 0; i < $plugins.length; i++ )
  { // setup plugin data.
    var desc = $plugins[i].description.match( regxp );
    if ( !desc ) continue;
    $.alias = new Object();
    $.params = Parse( Object.create( $plugins[i].parameters ) );
    $.name = desc[0].split(":")[0].trim();
    $.version = desc[0].split("-")[1].trim();
    break;
  };

//=============================================================================
  //--------------------------------------------------------------------------
  function Parse( object )
  { // parse all data in an object
  //--------------------------------------------------------------------------
    try {
      object = JSON.parse( object );
     } catch (e) {
      object = object;
     } finally {
      if ( typeof object === 'object' ) {
        if ( Array.isArray( object ) ) {
          for ( var i = 0; i < object.length; i++ ) {
            object[i] = Parse( object[i] );
          };
        } else {
          for ( var key in object ) {
            object[key] = Parse( object[key] );
          }
        }
      }
     }
     return object;
  };

//=============================================================================
  var audioCache, activeScene, stable, count;

  var clearAudioCache = function()
  { // reset the audioCache.
    audioCache = {};
    $.audioCache = audioCache;
  };

  var preloadBgm = function( audio )
  { // cache a new bgm.
    if ( audio.name === '' ) return;
    var currentBgm = AudioManager._currentBgm;
    if ( currentBgm && audio.name === currentBgm.name ) return;
    audioCache['bgm' + audio.name] = {
      audio : AudioManager.createBuffer( 'bgm', audio.name ),
      name : 'bgm' + audio.name,
      obj : audio,
      type : 'bgm'
    };
  };

  var preloadBgs = function( audio )
  { // cache a new bgs.
    if ( audio.name === '' ) return;
    var currentBgs = AudioManager._currentBgs;
    if ( currentBgs && audio.name === currentBgs.name ) return;
    audioCache['bgs' + audio.name] = {
      audio : AudioManager.createBuffer( 'bgs', audio.name ),
      name : 'bgs' + audio.name,
      obj : audio,
      type : 'bgs'
    };
  };

  var audioCacheIsReady = function()
  { // return true when the cache is ready.
    var ready = true;
    for ( var key in audioCache ) {
      if ( !audioCache[key].audio.isReady() ) ready = false;
    };
    return ready;
  };

  var assignAudioToBuffers = function()
  { // assign loaded audio to correct variable.
    for ( var key in audioCache ) {
      var entry = audioCache[key];
      if ( entry.type === 'bgm' )
      { // assign bgm.
        AudioManager.stopBgm();
        AudioManager._currentBgm = entry.obj;
        AudioManager._bgmBuffer = entry.audio;
      };
      if ( entry.type === 'bgs' )
      { // assign bgs.
        AudioManager.stopBgs();
        AudioManager._currentBgs = entry.obj;
        AudioManager._bgsBuffer = entry.audio;
      };
    };
    audioCache[key] = null;
    clearAudioCache();
  };

  var checkStability = function()
  { // tell our scene it's unstable.
    count = 0;
    stable = false;
  };

  checkStability();
  clearAudioCache();
//=============================================================================

//=============================================================================
// Graphics :
//=============================================================================
  /**
   * @static
   * @method _createFPSMeter
   * @private
   */
  Graphics._createFPSMeter = function() {
      var options = { graph: 1,
        decimals: 0,
        theme: 'transparent',
        toggleOn: null,
        smoothing: 1
      };
      this._fpsMeter = new FPSMeter( options );
      this._fpsMeter.hide();
  };

//=============================================================================
// SceneManager :
//=============================================================================

//-----------------------------------------------------------------------------
  $.alias.SM_p_updateScene = SceneManager.updateScene;
//-----------------------------------------------------------------------------
  SceneManager.updateScene = function ()
  { // Alias of updateScene
//-----------------------------------------------------------------------------
    if ( this._sceneStarted && !stable )
    { // prevent scene update if scene is unstable.
      var meter = Graphics._fpsMeter;
      if ( this._scene.constructor !== Scene_Boot )
      { // run for all scenes except scene boot.
        count++;
        return stable = (
          Math.round( meter.fps ) >= meter.options.maxFps || count > 21
        );
      }
    }
    $.alias.SM_p_updateScene.call( this );
  };

//=============================================================================
// AudioManager :
//=============================================================================

//-----------------------------------------------------------------------------
  $.alias.AM_playBgm = AudioManager.playBgm;
//-----------------------------------------------------------------------------
  AudioManager.playBgm = function ( bgm, pos )
  { // Alias of playBgm
//-----------------------------------------------------------------------------
    $.alias.AM_playBgm.call( this, bgm, pos );
    if ( this.isCurrentBgm( bgm ) && !this._bgmBuffer.isPlaying() )
    { // if this is the current bgm, but it's not currently playing.
      this._bgmBuffer.play( true, pos || 0 );
    }
  };

//-----------------------------------------------------------------------------
  $.alias.AM_playBgs = AudioManager.playBgs;
//-----------------------------------------------------------------------------
  AudioManager.playBgs = function ( bgs, pos )
  { // Alias of playBgs
//-----------------------------------------------------------------------------
    $.alias.AM_playBgs.call( this, bgs, pos );
    if ( this.isCurrentBgs( bgs ) && !this._bgsBuffer.isPlaying() )
    { // if this is the current bgs, but it's not currently playing.
      this._bgsBuffer.play( true, pos || 0 );
    }
  };

//=============================================================================
// Scene_Base :
//=============================================================================

//-----------------------------------------------------------------------------
  $.alias.SB_p_start = Scene_Base.prototype.start;
//-----------------------------------------------------------------------------
  Scene_Base.prototype.start = function ()
  { // Alias of start
//-----------------------------------------------------------------------------
    if ( activeScene !== this.constructor )
    { // once scene starts, reset stabilizer.
      activeScene = this.constructor;
      checkStability();
    }
    $.alias.SB_p_start.call( this );
  };

//=============================================================================
// Scene_Title :
//=============================================================================

//-----------------------------------------------------------------------------
  $.alias.ST_p_create = Scene_Title.prototype.create;
//-----------------------------------------------------------------------------
  Scene_Title.prototype.create = function ()
  { // Alias of initialize
//-----------------------------------------------------------------------------
    $.alias.ST_p_create.call( this );
    if ( Chaucer.sceneStabilizer.params.preload_audio )
    { // cache the title bgm.
      preloadBgm( $dataSystem.titleBgm );
    }
  };


  //-----------------------------------------------------------------------------
    $.alias.ST_p_isReady = Scene_Title.prototype.isReady;
  //-----------------------------------------------------------------------------
    Scene_Title.prototype.isReady = function ()
    { // Alias of isReady
  //-----------------------------------------------------------------------------
      if ( Chaucer.sceneStabilizer.params.preload_audio )
      { // when preload audio is enabled.
        var audioReady = audioCacheIsReady();
        if ( !audioReady ) return false;
        if ( audioReady )
        { // assign audio to correct buffers.
          assignAudioToBuffers();
        }
      }
      return $.alias.ST_p_isReady.call( this );
    };


//=============================================================================
// Scene_Map :
//=============================================================================

//-----------------------------------------------------------------------------
  $.alias.SM_p_isReady = Scene_Map.prototype.isReady;
//-----------------------------------------------------------------------------
  Scene_Map.prototype.isReady = function ()
  { // Alias of isReady
//-----------------------------------------------------------------------------
    if ( Chaucer.sceneStabilizer.params.preload_audio )
    { // if preload audio is turned on.
      if ( !this._mapLoaded && DataManager.isMapLoaded() )
      { // when the map is finished loading.
        if ( $dataMap.autoplayBgm && !audioCache['bgm' + $dataMap.bgm.name] )
        { // cache the bgm of the map if not already cached.
          preloadBgm( $dataMap.bgm );

        }
        if ( $dataMap.autoplayBgs && !audioCache['bgs' + $dataMap.bgs.name] )
        { // cache bgs of map if not already cached.
          preloadBgs( $dataMap.bgs );
        }
      };
      var ready = $.alias.SM_p_isReady.call( this );
      var audioIsReady = audioCacheIsReady();
      if ( audioIsReady && ready )
      { // when the audio is ready, set audio to correct buffer.
        assignAudioToBuffers();
      }
      return ready && audioIsReady;
    } else
    { // when not preloading audio.
      return $.alias.SM_p_isReady.call( this );
    }
  };

//=============================================================================
// Scene_Battle :
//=============================================================================

//-----------------------------------------------------------------------------
  $.alias.SB_p_create = Scene_Battle.prototype.create;
//-----------------------------------------------------------------------------
  Scene_Battle.prototype.create = function ()
  { // Alias of initialize
//-----------------------------------------------------------------------------
    $.alias.SB_p_create.call( this );
    if ( Chaucer.sceneStabilizer.params.preload_audio ) {
      preloadBgm( $gameSystem.battleBgm() );
    }
  };


//-----------------------------------------------------------------------------
  $.alias.SB_p_isReady = Scene_Battle.prototype.isReady;
//-----------------------------------------------------------------------------
  Scene_Battle.prototype.isReady = function ()
  { // Alias of isReady
//-----------------------------------------------------------------------------
    if ( Chaucer.sceneStabilizer.params.preload_audio )
    { // preload the audio for battle when needed.
      var audioReady = audioCacheIsReady();
      if ( !audioReady ) return false;
      if ( audioReady ) assignAudioToBuffers();
    }
    return $.alias.SB_p_isReady.call( this );

  };

//=============================================================================
// Sprite_Base :
//=============================================================================

//-----------------------------------------------------------------------------
  $.alias.SB_p_startAnimation = Sprite_Base.prototype.startAnimation;
//-----------------------------------------------------------------------------
  Sprite_Base.prototype.startAnimation = function ( animation, mirror, delay )
  { // Alias of startAnimation
//-----------------------------------------------------------------------------
    if (  $.params.stabilize_animations )
    { // when stabilize aniamtions is active.
      var bitmaps = [
        ImageManager.loadAnimation(animation.animation1Name),
        ImageManager.loadAnimation(animation.animation2Name)
      ];
      bitmaps.forEach( function( bitmap )
      { // iterate through all bitmaps.
        bitmap.addLoadListener( function ()
        { // add a load listener to this resource.
          var completed = bitmaps[0].isReady() && bitmaps[1].isReady();
          if ( completed )
          { // when both files have finished loading.
            var renderer = Graphics._renderer;
            // upload the image to the gpu, and reset stabilizer.
            renderer.bindTexture( new PIXI.Texture( bitmaps[0].baseTexture ) );
            renderer.bindTexture( new PIXI.Texture( bitmaps[1].baseTexture ) );
            checkStability();
          }
        }.bind( this ) );
      }, this );
    };
    // run the default start animation.
    $.alias.SB_p_startAnimation.call( this, animation, mirror, delay );
  };

//=============================================================================
// Sprite_Picture :
//=============================================================================

//-----------------------------------------------------------------------------
  $.alias.SP_p_loadBitmap = Sprite_Picture.prototype.loadBitmap;
//-----------------------------------------------------------------------------
  Sprite_Picture.prototype.loadBitmap = function ()
  { // Alias of loadBitmap
//-----------------------------------------------------------------------------
    $.alias.SP_p_loadBitmap.call( this );
    // When picture is added with "Show Picture...", reset stabilizer.
    if ( $.params.stabilize_pictures ) checkStability();
  };

//=============================================================================
} )( Chaucer.sceneStabilizer );
//=============================================================================
