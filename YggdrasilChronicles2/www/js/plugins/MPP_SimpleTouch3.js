//=============================================================================
// MPP_SimpleTouch3.js
//=============================================================================
// Copyright (c) 2017 Mokusei Penguin
// Released under the MIT license
// http://opensource.org/licenses/mit-license.php
//=============================================================================

/*:
 * @plugindesc 【ver.3.6】マウスやタッチ操作を変更します。
 * @author 木星ペンギン
 *
 * @help プラグインコマンド:
 *   CancelOff           # 次の[選択肢の表示]でキャンセルSEを鳴らさない
 * 
 * 
 *  デフォルトではタッチした時にタッチ位置とカーソル位置が合っていれば【決定】、
 *  違っている場合は【カーソル移動】となっています。
 *  
 *  本プラグインを導入した場合、以下のように機能が変更・追加されます
 *  
 * ●カーソル移動
 *  項目をタッチした時点で【カーソル移動】します。
 *  
 * ●スクロール
 *  ウィンドウをタッチしたまま上下にスライドすると、スクロールを行います。
 *  フリック操作でしばらく自動でスクロールを行います。
 * 
 * ●決定操作
 *  項目をタッチした後（この時点で【カーソル移動】）にすぐ離すと【決定】を行います。
 *  
 *  決定操作をダブルタップにしている場合、
 *  同じ項目で上記の動作を二度行うことで【決定】となります。
 * 
 *  項目をタッチした後、すぐに離さなかった場合は何も行いません。
 *  
 *  この他にも上下のスライドや左右へのスワイプを行った際も何も行いません。
 *  
 * ●キャンセル操作
 *  アクティブなウィンドウの外側をタッチすると【キャンセル】を行います。
 *  
 * ●ページ切り替え
 *  画面をタッチした後、左右にスワイプすると【ページ切り替え】を行います。
 * 
 * -------------------------------
 * その他補足
 * 
 * ●キャンセル無効(Cancel Enabled?)
 *  プラグインパラメータ[Cancel Enabled?]は右クリックや二本指タップによる
 *  ウィンドウのキャンセルを無効する機能で、メニュー呼び出しには影響しません。
 *  ゲームパッドやキーボードによるキャンセル操作にも影響しません。
 *  
 * ●ステータス画面での操作追加
 *  ステータス画面で画面をタッチすると【キャンセル】を行います。
 * 
 * ================================
 * 制作 : 木星ペンギン
 * URL : http://woodpenguin.blog.fc2.com/
 * 
 * @param Cancel Enabled?
 * @desc 右クリックまたは二本指タップによるキャンセルの有効/無効
 * @default true
 * 
 * @param Long Press Time
 * @desc 決定を取り消すまでの長押しの時間 (フレーム数)
 * @default 15
 * 
 * @param Ok Type Default
 * @desc [決定操作]のデフォルト値
 * (0:シングルタップ, 1:ダブルタップ)
 * @default 0
 * 
 * @param Ok Type Name
 * @desc オプション画面に表示する[決定操作]の名前
 * (空の場合は表示しない)
 * @default 決定操作
 * 
 * @param Ok Type Status
 * @desc オプション画面に表示する[決定操作]のステータス名
 * (カンマで区切ってください)
 * @default シングル,ダブル
 * 
 * @param Double Tap Interval
 * @desc ダブルタップの間隔
 * @default 30
 * 
 * @param Cursor SE Always?
 * @desc タッチした際、常にカーソルSEを鳴らすかどうか
 * @default false
 * 
 * @param Outside Tap Default
 * @desc [外側タップ]のデフォルト値
 * (0:無効, 1:キャンセル)
 * @default 1
 * 
 * @param Outside Tap Name
 * @desc オプション画面に表示する[外側タップ]の名前
 * (空の場合は表示しない)
 * @default 
 * 
 * @param Outside Tap Status
 * @desc オプション画面に表示する[外側タップ]のステータス名
 * (カンマで区切ってください)
 * @default 無効,キャンセル
 * 
 * 
 * 
 */

//=============================================================================
// Main
//=============================================================================

(function() {

var MPPlugin = { params: PluginManager.parameters('MPP_SimpleTouch3') };

MPPlugin.CancelEnabled = !!eval(MPPlugin.params['Cancel Enabled?']);
MPPlugin.LongPressTime = Number(MPPlugin.params['Long Press Time'] || 15);
MPPlugin.DoubleTapInterval = Number(MPPlugin.params['Double Tap Interval'] || 30);
MPPlugin.CursorSeAlways = !!eval(MPPlugin.params['Cursor SE Always?']);

var Alias = {};

//-----------------------------------------------------------------------------
// Window

//6718
Window.prototype._refreshCursor = function() {
    var w = this._cursorRect.width;
    var h = this._cursorRect.height;
    var m = 4;
    var bitmap = new Bitmap(w, h);

    this._windowCursorSprite.bitmap = bitmap;

    if (w > 0 && h > 0 && this._windowskin) {
        var skin = this._windowskin;
        var p = 96;
        var q = 48;
        bitmap.blt(skin, p+m, p+m, q-m*2, q-m*2, m, m, w-m*2, h-m*2);
        bitmap.blt(skin, p+m, p+0, q-m*2, m, m, 0, w-m*2, m);
        bitmap.blt(skin, p+m, p+q-m, q-m*2, m, m, h-m, w-m*2, m);
        bitmap.blt(skin, p+0, p+m, m, q-m*2, 0, m, m, h-m*2);
        bitmap.blt(skin, p+q-m, p+m, m, q-m*2, w-m, m, m, h-m*2);
        bitmap.blt(skin, p+0, p+0, m, m, 0, 0, m, m);
        bitmap.blt(skin, p+q-m, p+0, m, m, w-m, 0, m, m);
        bitmap.blt(skin, p+0, p+q-m, m, m, 0, h-m, m, m);
        bitmap.blt(skin, p+q-m, p+q-m, m, m, w-m, h-m, m, m);
    }
    this._updateCursorPos();
};

//6804
Alias.Wi_updateCursor = Window.prototype._updateCursor;
Window.prototype._updateCursor = function() {
    Alias.Wi_updateCursor.call(this);
    this._updateCursorPos();
};

Window.prototype._updateCursorPos = function() {
    var pad = this._padding;
    var x = this._cursorRect.x + pad - this.origin.x;
    var y = this._cursorRect.y + pad - this.origin.y;
    var w = this._cursorRect.width;
    var h = this._cursorRect.height;
    var x2 = Math.max(x, pad);
    var y2 = Math.max(y, pad);
    var ox = x2 - x;
    var oy = y2 - y;
    var w2 = Math.min(w, this._width - pad - x2);
    var h2 = Math.min(h, this._height - pad - y2);
    
    this._windowCursorSprite.setFrame(ox, oy, w2, h2);
    this._windowCursorSprite.move(x2, y2);
};

//-----------------------------------------------------------------------------
// SoundManager

SoundManager.cancelOff = false;

//37
Alias.SoMa_playCancel = SoundManager.playCancel;
SoundManager.playCancel = function() {
    if (!this.cancelOff) Alias.SoMa_playCancel.call(this);
};

//-----------------------------------------------------------------------------
// Game_Message

//15
Alias.GaMe_clear = Game_Message.prototype.clear;
Game_Message.prototype.clear = function() {
    Alias.GaMe_clear.call(this);
    this.cancelOff = false;
};

//-----------------------------------------------------------------------------
// Game_Interpreter

//1739
Alias.GaIn_pluginCommand = Game_Interpreter.prototype.pluginCommand;
Game_Interpreter.prototype.pluginCommand = function(command, args) {
    Alias.GaIn_pluginCommand.call(this, command, args);
    if (command === 'CancelOff') {
        $gameMessage.cancelOff = true;
    }
};

//-----------------------------------------------------------------------------
// Window_Selectable

//13
Alias.WiSe_initialize = Window_Selectable.prototype.initialize;
Window_Selectable.prototype.initialize = function(x, y, width, height) {
    Alias.WiSe_initialize.call(this, x, y, width, height);
    this._touchInterval = -1;
    this._touchInsided = false;
    this._originYSpeed = [];
};

if (Window_Selectable.prototype.hasOwnProperty('contentsHeight')) {
    Alias.WiSe_contentsHeight = Window_Selectable.prototype.contentsHeight;
}
Window_Selectable.prototype.contentsHeight = function() {
    if (Alias.WiSe_contentsHeight) {
        return Alias.WiSe_contentsHeight.call(this) + this.itemHeight();
    } else {
        return Window_Base.prototype.contentsHeight.call(this) + this.itemHeight();
    }
};

//119
Alias.WiSe_resetScroll = Window_Selectable.prototype.resetScroll;
Window_Selectable.prototype.resetScroll = function() {
    Alias.WiSe_resetScroll.call(this);
    this.resetOy();
    
};

Window_Selectable.prototype.resetOy = function() {
    this.origin.y = 0;
    this._originYSpeed = [];
};

//280
Alias.WiSe_updateArrows = Window_Selectable.prototype.updateArrows;
Window_Selectable.prototype.updateArrows = function() {
    Alias.WiSe_updateArrows.call(this);
    this.upArrowVisible = (this.upArrowVisible || this.origin.y > 0);
};

//340
Window_Selectable.prototype.processTouch = function() {
    if (this.isOpenAndActive()) {
        if (TouchInput.isTriggered()) {
            this._touching = true;
            this._selecting = true;
            this._touchCount = 0;
            this._touchX = TouchInput.x;
            this._touchY = TouchInput.y;
            this._touchInsided = this.isTouchedInsideFrame();
            this._originYSpeed = [];
        } else if (TouchInput.isCancelled()) {
            if (MPPlugin.CancelEnabled && this.isCancelEnabled()) {
                this.processCancel();
            }
        }
        if (this._touching) {
            if (TouchInput.isTriggered()) {
                this.onTouch(false);
            } else if (TouchInput.isPressed()) {
                this._touchCount++;
                if (this.touchScroll() || this._touchCount >= MPPlugin.LongPressTime) {
                    this._selecting = false;
                    this._touchInterval = -1;
                }
            } else {
                if (!this.touchSwipe() && this._selecting) {
                    this.onTouch(true);
                } else {
                    this._touchInterval = -1;
                }
                this._touching = false;
                this._selecting = false;
            }
        }
        if (!this._touching && this._originYSpeed.length > 0) {
            this.addOriginYSpeed(this._originYSpeed[0] * 0.9);
            if (Math.abs(this.originYSpeed()) < 2) this._originYSpeed = [];
        }
        if (this._touchInterval >= 0) {
            this._touchInterval++;
        }
        this.updateTouchScroll();
    } else {
        this._touching = false;
        this._selecting = false;
        this._touchCount = 0;
        this._touchX = 0;
        this._touchY = 0;
        this._touchInterval = -1;
    }
};

Window_Selectable.prototype.addOriginYSpeed = function(speed) {
    this._originYSpeed.push(speed);
    if (this._originYSpeed.length > 3) {
        this._originYSpeed.shift();
    }
};

Window_Selectable.prototype.originYSpeed = function() {
    var speed = 0;
    for (var i = 0; i < this._originYSpeed.length; i++) {
        speed += this._originYSpeed[i];
    }
    return speed / (this._originYSpeed.length || 1);
};

Window_Selectable.prototype.touchScroll = function() {
    if (!this._touchInsided) return false;
    this.addOriginYSpeed(this._touchY - TouchInput.y);
    this._touchY = TouchInput.y;
    return Math.abs(this.originYSpeed()) > 3;
};

Window_Selectable.prototype.touchSwipe = function() {
    if (this._touchInsided && this._touchCount > 0 &&
            Math.abs(TouchInput.x - this._touchX) > 32) {
        var sx = (TouchInput.x - this._touchX) / this._touchCount;
        if (sx < -6 && this.isHandled('pageup')) {
            this.processPageup();
            return true;
        } else if (sx > 6 && this.isHandled('pagedown')) {
            this.processPagedown();
            return true;
        }
    }
    return false;
};

Window_Selectable.prototype.updateTouchScroll = function() {
    if (this._touchInsided && this._originYSpeed.length > 0) {
        var topRow = this.topRow();
        var height = this.itemHeight();
        var oy = Math.floor(this.origin.y + this.originYSpeed());
        var sr = Math.floor(oy / height);
        if (sr !== 0) {
            this.setTopRow(topRow + sr);
        }
        if ((topRow <= 0 && oy < 0) || 
                (this.topRow() >= this.maxTopRow() && oy > 0)) {
            this.resetOy();
            this.setTopRow(this.topRow());
        } else {
            this.origin.y = oy.mod(height);
        }
    }
};

//368
Alias.WiSe_onTouch = Window_Selectable.prototype.onTouch;
Window_Selectable.prototype.onTouch = function(triggered) {
    if (triggered) {
        if (ConfigManager.outsideTap === 1 &&
                !this._touchInsided && !this.isTouchedInsideFrame()) {
            if (this.isCancelEnabled())     this.processCancel();
        } else {
            var type = ConfigManager.okType;
            var value = MPPlugin.DoubleTapInterval;
            var interval = this._touchInterval;
            if (type === 0 || (interval >= 0 && interval < value)) {
                this._touchInterval = -1;
                this._stayCount = 0;
                Alias.WiSe_onTouch.call(this, triggered);
            } else {
                this._touchInterval = 0;
            }
        }
    } else {
        var lastIndex = this.index();
        this._stayCount = 0;
        Alias.WiSe_onTouch.call(this, triggered);
        if (this.index() !== lastIndex) {
            this._touchInterval = -1;
        } else if (MPPlugin.CursorSeAlways) {
            var x = this.canvasToLocalX(TouchInput.x);
            var y = this.canvasToLocalY(TouchInput.y);
            if (this.isContentsArea(x, y)) {
                SoundManager.playCursor();
            }
        }
    }
};

//393
Window_Selectable.prototype.hitTest = function(x, y) {
    if (this.isContentsArea(x, y)) {
        var cx = x - this.padding;
        var cy = y - this.padding + this.origin.y;
        var topIndex = this.topIndex();
        var maxPageItems = this.maxPageItems() + this.maxCols();
        for (var i = 0; i < maxPageItems; i++) {
            var index = topIndex + i;
            if (index < this.maxItems()) {
                var rect = this.itemRect(index);
                var right = rect.x + rect.width;
                var bottom = rect.y + rect.height;
                if (cx >= rect.x && cy >= rect.y && cx < right && cy < bottom) {
                    return index;
                }
            }
        }
    }
    return -1;
};

//494
Alias.WiSe_updateCursor = Window_Selectable.prototype.updateCursor;
Window_Selectable.prototype.updateCursor = function() {
    Alias.WiSe_updateCursor.call(this);
    if (this._cursorAll) this.resetOy();
};

//507
Window_Selectable.prototype.isCursorVisible = function() {
    var row = this.row();
    return row >= this.topRow() && row <= this.bottomRow() + 1;
};

//512
Alias.WiSe_ensureCursorVisible = Window_Selectable.prototype.ensureCursorVisible;
Window_Selectable.prototype.ensureCursorVisible = function() {
    var row = this.row();
    if (row <= this.topRow() || row > this.bottomRow()) this.resetOy();
    Alias.WiSe_ensureCursorVisible.call(this);
};

//541
Alias.WiSe_drawAllItems = Window_Selectable.prototype.drawAllItems;
Window_Selectable.prototype.drawAllItems = function() {
    Alias.WiSe_drawAllItems.call(this);
    var topIndex = this.topIndex() + this.maxPageItems();
    for (var i = 0; i < this.maxCols(); i++) {
        var index = topIndex + i;
        if (index < this.maxItems()) {
            this.drawItem(index);
        }
    }
};

//-----------------------------------------------------------------------------
// Window_ChoiceList

//99
Alias.WiChLi_contentsHeight = Window_ChoiceList.prototype.contentsHeight;
Window_ChoiceList.prototype.contentsHeight = function() {
    return Alias.WiChLi_contentsHeight.call(this) + this.itemHeight();
};

if (Window_ChoiceList.prototype.hasOwnProperty('processCancel')) {
    Alias.WiChLi_processCancel = Window_ChoiceList.prototype.processCancel;
}
Window_ChoiceList.prototype.processCancel = function() {
    SoundManager.cancelOff = $gameMessage.cancelOff;
    if (Alias.WiChLi_processCancel) {
        Alias.WiChLi_processCancel.call(this);
    } else {
        Window_Command.prototype.processCancel.call(this);
    }
    SoundManager.cancelOff = false;
};

//-----------------------------------------------------------------------------
// Window_Status

Window_Status.prototype.isTouchedInsideFrame = function() {
    return false;
};

//-----------------------------------------------------------------------------
// Window_ShopStatus

//48
Alias.WiShSt_changePage = Window_ShopStatus.prototype.changePage;
Window_ShopStatus.prototype.changePage = function() {
    Alias.WiShSt_changePage.call(this);
    Input.update();
    TouchInput.update();
};

})();


//=============================================================================
// Option
//=============================================================================

(function() {

var MPPlugin = { params : PluginManager.parameters('MPP_SimpleTouch3') };

MPPlugin.OkTypeDefault = Number(MPPlugin.params['Ok Type Default'] || 0);
MPPlugin.OkTypeName = MPPlugin.params['Ok Type Name'] || '';
MPPlugin.OkTypeStatus = (MPPlugin.params['Ok Type Status'] || 'シングル,ダブル').split(",");
MPPlugin.OutsideTapDefault = Number(MPPlugin.params['Outside Tap Default'] || 1);
MPPlugin.OutsideTapName = MPPlugin.params['Outside Tap Name'] || '';
MPPlugin.OutsideTapStatus = (MPPlugin.params['Outside Tap Status'] || '無効,キャンセル').split(",");

var Alias = {};

//-----------------------------------------------------------------------------
// ConfigManager

ConfigManager.okType = MPPlugin.OkTypeDefault;
ConfigManager.outsideTap = MPPlugin.OutsideTapDefault;

//71
Alias.CoMa_makeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
    var config = Alias.CoMa_makeData.call(this);
    config.okType = this.okType;
    config.outsideTap = this.outsideTap;
    return config;
};

//82
Alias.CoMa_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
    Alias.CoMa_applyData.call(this, config);
    this.okType = (config['okType'] === undefined ? MPPlugin.OkTypeDefault : config['okType']);
    this.outsideTap = (config['outsideTap'] === undefined ? MPPlugin.OutsideTapDefault : config['outsideTap']);
};

//-----------------------------------------------------------------------------
// Window_Options

//31
Alias.WiOp_makeCommandList = Window_Options.prototype.makeCommandList;
Window_Options.prototype.makeCommandList = function() {
    if (MPPlugin.OkTypeName) {
        this.addCommand(MPPlugin.OkTypeName, 'okType');
    }
    if (MPPlugin.OutsideTapName) {
        this.addCommand(MPPlugin.OutsideTapName, 'outsideTap');
    }
    Alias.WiOp_makeCommandList.call(this);
};

Alias.WiOp_isMppSymbol = Window_Options.prototype.isMppSymbol;
Window_Options.prototype.isMppSymbol = function(symbol) {
    if (Alias.WiOp_isMppSymbol && Alias.WiOp_isMppSymbol.call(this, symbol)) {
        return true;
    }
    return (symbol === 'okType' || symbol === 'outsideTap');
};

Alias.WiOp_getMppStatus = Window_Options.prototype.getMppStatus;
Window_Options.prototype.getMppStatus = function(symbol) {
    if (symbol === 'okType') {
        return MPPlugin.OkTypeStatus;
    } else if (symbol === 'outsideTap') {
        return MPPlugin.OutsideTapStatus;
    } else if (Alias.WiOp_getMppStatus) {
        return Alias.WiOp_getMppStatus.call(this, symbol);
    } else {
        return [];
    }
};

if (!Window_Options.MPP_Option || Window_Options.MPP_Option < 1.0) {

//62
Alias.WiOp_statusText = Window_Options.prototype.statusText;
Window_Options.prototype.statusText = function(index) {
    var symbol = this.commandSymbol(index);
    if (this.isMppSymbol(symbol)) {
        var status = this.getMppStatus(symbol);
        var value = this.getConfigValue(symbol);
        return status[value];
    } else {
        return Alias.WiOp_statusText.call(this, index);
    }
};

//84
Alias.WiOp_processOk = Window_Options.prototype.processOk;
Window_Options.prototype.processOk = function() {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (this.isMppSymbol(symbol)) {
        var status = this.getMppStatus(symbol);
        var value = this.getConfigValue(symbol);
        value++;
        if (value >= status.length) {
            value = 0;
        }
        value = value.clamp(0, status.length - 1);
        this.changeValue(symbol, value);
    } else {
        Alias.WiOp_processOk.call(this);
    }
};

//100
Alias.WiOp_cursorRight = Window_Options.prototype.cursorRight;
Window_Options.prototype.cursorRight = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (this.isMppSymbol(symbol)) {
        var status = this.getMppStatus(symbol);
        var value = this.getConfigValue(symbol);
        value++;
        value = value.clamp(0, status.length - 1);
        this.changeValue(symbol, value);
    } else {
        Alias.WiOp_cursorRight.call(this, wrap);
    }
};

//113
Alias.WiOp_cursorLeft = Window_Options.prototype.cursorLeft;
Window_Options.prototype.cursorLeft = function(wrap) {
    var index = this.index();
    var symbol = this.commandSymbol(index);
    if (this.isMppSymbol(symbol)) {
        var status = this.getMppStatus(symbol);
        var value = this.getConfigValue(symbol);
        value--;
        value = value.clamp(0, status.length - 1);
        this.changeValue(symbol, value);
    } else {
        Alias.WiOp_cursorLeft.call(this, wrap);
    }
};

Window_Options.MPP_Option = 1.0;
} //if (!Window_Options.MPP_Option || Window_Options.MPP_Option < 1.0)


})();
