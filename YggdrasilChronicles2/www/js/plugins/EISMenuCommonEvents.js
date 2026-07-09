'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//=============================================================================
//  EISMenuCommonEvents.js
//=============================================================================

/*:
*
* @author Kino
* @plugindesc A plugin that allows you to run common events within the menu.
*
* @help
* Version 1.01
* ChangeLog:
* * Add Script Calls
* * Made plugin mode flexible
* * Made common events execute more effectively
//=============================================================================
//  Introduction
//=============================================================================
* You can now run common events within the menu. Also, when using items in the item scene
* common events will run directly in the item scene with some limitations.
* This means you can activate your items common events with little disability.
//=============================================================================
//  Script Calls
//=============================================================================
*
* EISCommon.requestEvent(eventId, sceneName);
* Example:
* EISCommon.requestEvent(2, 'Scene_Item');
* This will run common event 2 when you open up scene Item.
* You can use this script call in another common event to go from scene
* to scene executing common event commands!
*
//=============================================================================
//  Contact Information
//=============================================================================
*
* Contact me via twitter: EISKino, or on the rpg maker forums.
* Username on forums: Kino.
*
* Forum Link: http://forums.rpgmakerweb.com/index.php?/profile/75879-kino/
* Twitter Link: https://twitter.com/EISKino
* Website: http://endlessillusoft.com/
* Patreon Link: https://www.patreon.com/EISKino
*
* Hope this plugin helps, and enjoy!
* --Kino
*/
//TODO:
//FIX looping error on updates
// Make it possible to properly observe common event changes


var EISCommon = EISCommon || {};
(function ($) {

  function setup($) {
    //=============================================================================
    //  CommonEventSys
    //=============================================================================
    var CommonEventSys = function () {
      function CommonEventSys() {
        _classCallCheck(this, CommonEventSys);
      }

      _createClass(CommonEventSys, null, [{
        key: 'start',
        value: function start() {
          this.linkComponents();
        }
      }, {
        key: 'linkComponents',
        value: function linkComponents() {
          this._cmmnEventObserver = new CommonEventObserver();
          this._cmmnEventRequester = new CommonEventRequester();
          this._cmmnEventRequestHandler = new CommonEventRequestHandler();
        }
      }, {
        key: 'requestCommonEvent',
        value: function requestCommonEvent(eventId, sceneName) {
          this._cmmnEventRequestHandler.setRequest(this._cmmnEventRequester.createRequest(eventId, sceneName));
        }
      }, {
        key: 'processRequest',
        value: function processRequest() {
          this._cmmnEventRequestHandler.checkRequestConditions();
        }
      }]);

      return CommonEventSys;
    }();
    //=============================================================================
    //  CommonEventObserver
    //=============================================================================


    var CommonEventObserver = function () {
      function CommonEventObserver() {
        _classCallCheck(this, CommonEventObserver);

        this._interpreter = new Game_Interpreter();
        this.update();
      }

      _createClass(CommonEventObserver, [{
        key: 'update',
        value: function update() {
          if (SceneManager._scene instanceof Scene_MenuBase) this.processCommonEvents();
          this.requestUpdate();
        }
      }, {
        key: 'processCommonEvents',
        value: function processCommonEvents() {
          var _this = this;

          if ($gameTemp.isCommonEventReserved()) {
            this._interpreter.setupReservedCommonEvent($gameTemp.reservedCommonEvent().list);
            this._interpreter._list.forEach(function (command, index) {
              if (_this._interpreter.currentCommand() !== undefined && _this._interpreter.currentCommand() !== null) {
                _this._interpreter.executeCommand();
              }
            });
            this._interpreter.terminate();
            this._interpreter.clear();
            $gameTemp.clearCommonEvent();
            console.log($gameTemp.isCommonEventReserved());
          }
        }
      }, {
        key: 'requestUpdate',
        value: function requestUpdate() {
          requestAnimationFrame(this.update.bind(this));
        }
      }]);

      return CommonEventObserver;
    }();
    //=============================================================================
    //  CommonEventRequester
    //=============================================================================


    var CommonEventRequester = function () {
      function CommonEventRequester() {
        _classCallCheck(this, CommonEventRequester);
      }

      _createClass(CommonEventRequester, [{
        key: 'createRequest',
        value: function createRequest(eventId, sceneName) {
          var fnc = function fnc() {
            $gameTemp.reserveCommonEvent(eventId);
          };
          if (sceneName === undefined) sceneName = 'Scene_Menu';
          return { execute: fnc, scene: sceneName };
        }
      }]);

      return CommonEventRequester;
    }();
    //=============================================================================
    //  CommonEventRequestHandler
    //=============================================================================


    var CommonEventRequestHandler = function () {
      function CommonEventRequestHandler() {
        _classCallCheck(this, CommonEventRequestHandler);

        this._request = null;
      }

      _createClass(CommonEventRequestHandler, [{
        key: 'handleRequest',
        value: function handleRequest(request) {
          console.log(request, "Request Executed");
          request.execute();
          request = null;
          console.log(request);
        }
      }, {
        key: 'checkRequestConditions',
        value: function checkRequestConditions() {
          if (this._request !== null && new RegExp(this._request.scene, 'ig').test(SceneManager._scene.constructor.name)) {
            this.handleRequest(this._request);
          }
        }
      }, {
        key: 'setRequest',
        value: function setRequest(request) {
          this._request = request;
        }
      }]);

      return CommonEventRequestHandler;
    }();
    //=============================================================================
    //  Scene_MenuBase
    //=============================================================================


    var _SceneMenuBase_create = Scene_MenuBase.prototype.create;
    Scene_MenuBase.prototype.create = function () {
      var _this2 = this;

      _SceneMenuBase_create.call(this);
      setTimeout(function () {
        _this2.createMessageWindow();
      }, 100);
    };

    Scene_MenuBase.prototype.createMessageWindow = function () {
      this._messageWindow = new Window_Message();
      this.addWindow(this._messageWindow);
    };

    var _SceneMenuBase_start = Scene_MenuBase.prototype.start;
    Scene_MenuBase.prototype.start = function () {
      _SceneMenuBase_start.call(this);
      CommonEventSys.processRequest();
    };

    Scene_MenuBase.prototype.createCommonEventObserver = function () {
      this._cmmnEventObserver = new CommonEventObserver();
    };

    var _SceneMenuBase_update = Scene_MenuBase.prototype.update;
    Scene_MenuBase.prototype.update = function () {
      _SceneMenuBase_update.call(this);
      CommonEventSys.processRequest();
    };
    //=============================================================================
    //  Scene_ItemBase
    //=============================================================================
    Scene_ItemBase.prototype.checkCommonEvent = function () {
      if ($gameTemp.isCommonEventReserved()) {
        //Do Nothing
      }
    };
    //=============================================================================
    //  System
    //=============================================================================
    CommonEventSys.start();
    //=============================================================================
    //  API
    //=============================================================================
    Object.assign($, {
      requestEvent: function requestEvent(eventId, sceneName) {
        CommonEventSys.requestCommonEvent(eventId, sceneName);
      }
    });
  }

  setup($);
})(EISCommon);