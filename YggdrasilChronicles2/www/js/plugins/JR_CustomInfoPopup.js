/*:
 * @plugindesc Creates a customizable pop-up window with images, descriptions, pagination, and swipe controls.
 * @author JR
 * @version 1.19.0
 *
 * @param Popups
 * @text Pop-up Configuration
 * @type struct<Popup>[]
 * @desc Add your pop-ups here.
 *
 * @param General Settings
 * @text --- General Settings ---
 *
 * @param Popup Width
 * @parent General Settings
 * @type number
 * @min 100
 * @default 600
 * @desc Width of the pop-up window. (Default: 600)
 *
 * @param Popup Height
 * @parent General Settings
 * @type number
 * @min 100
 * @default 550
 * @desc Height of the pop-up window. (Default: 550)
 *
 * @param Center Popup
 * @parent General Settings
 * @type boolean
 * @default true
 * @desc If true, ignores X and Y parameters and centers the window.
 *
 * @param Popup X
 * @parent General Settings
 * @type number
 * @default 0
 * @desc X position if Center Popup is false.
 *
 * @param Popup Y
 * @parent General Settings
 * @type number
 * @default 0
 * @desc Y position if Center Popup is false.
 *
 * @param Title Settings
 * @text --- Title Styling ---
 * * @param Title Text Color
 * @parent Title Settings
 * @type text
 * @default #ffffff
 * @desc Hex code for the title text color.
 * * @param Title Text Size
 * @parent Title Settings
 * @type number
 * @default 28
 * @desc Font size for the title text. (Default: 28)
 * * @param Use Default Title Size
 * @parent Title Settings
 * @type boolean
 * @default true
 * @desc True: Full width, Height 40. False: Use Custom Width/Height below.
 * * @param Title Bar Width
 * @parent Title Settings
 * @type number
 * @default 500
 * @desc Custom Width of the title bar. (Default: 500)
 * * @param Title Bar Height
 * @parent Title Settings
 * @type number
 * @default 40
 * @desc Custom Height of the title bar. (Default: 40)
 * * @param Use Default Title BG
 * @parent Title Settings
 * @type boolean
 * @default true
 * @desc True: Use solid color. False: Use custom image below.
 * * @param Title BG Image
 * @parent Title Settings
 * @type file
 * @dir img/system
 * @desc Image to use for title background (if above is false).
 * * @param Title Bar Color
 * @parent Title Settings
 * @type text
 * @default #000000
 * @desc Hex code for the background behind the title (e.g., #000000).
 * * @param Title Bar Opacity
 * @parent Title Settings
 * @type number
 * @min 0
 * @max 255
 * @default 100
 * @desc Opacity of the title background (0 = transparent, 255 = solid).
 * * @param Title BG Fade Edges
 * @parent Title Settings
 * @type boolean
 * @default false
 * @desc If true, the default BG fades out on left/right sides (Gradient).
 * * @param Show Title Border
 * @parent Title Settings
 * @type boolean
 * @default true
 * @desc If false, hides the border (and disables border animation) for Default BG.
 * * @param Title Border Color
 * @parent Title Settings
 * @type text
 * @default #FFD700
 * @desc Hex color for the border around the title bar.
 * * @param Title Border Thickness
 * @parent Title Settings
 * @type number
 * @default 2
 * @desc Thickness of the border in pixels.
 *
 * @param Title Animation Settings
 * @text --- Title Border Animation ---
 * * @param Use Border Animation
 * @parent Title Animation Settings
 * @type boolean
 * @default false
 * @desc Enable a flashy animation for the title border? (Default BG only)
 * * @param Border Animation Type
 * @parent Title Animation Settings
 * @type select
 * @option Pulse
 * @option Flash
 * @option Rainbow
 * @option Marching Ants
 * @option Snake
 * @option Elastic
 * @default Pulse
 * @desc Choose the animation style.
 *
 * @param Image Settings
 * @text --- Image Settings ---
 *
 * @param Image Width
 * @parent Image Settings
 * @type number
 * @default 400
 * @desc Maximum width of the image area. (Default: 400)
 *
 * @param Image Height
 * @parent Image Settings
 * @type number
 * @default 200
 * @desc Maximum height of the image area. (Default: 200)
 *
 * @param Text Settings
 * @text --- Text & CTA Settings ---
 *
 * @param Description Padding
 * @parent Text Settings
 * @type number
 * @default 20
 * @desc Left/Right padding for the description text. (Default: 20)
 *
 * @param Scroll Speed
 * @parent Text Settings
 * @type number
 * @decimals 1
 * @default 0.5
 * @desc Speed of the description auto-scroll (pixels per frame).
 *
 * @param Scroll Start Delay
 * @parent Text Settings
 * @type number
 * @default 90
 * @desc Frames to wait before scrolling starts (60 = 1 second). (Default: 90)
 *
 * @param CTA Next Text
 * @parent Text Settings
 * @type text
 * @default Next
 * @desc Button text when there are more pages.
 *
 * @param CTA Close Text
 * @parent Text Settings
 * @type text
 * @default Close
 * @desc Button text when on the last page.
 *
 * @param Next Hint Text
 * @parent Text Settings
 * @type text
 * @default Press Left/Right to switch pages
 * @desc Small text shown below CTA when pages remain.
 *
 * @param Close Hint Text
 * @parent Text Settings
 * @type text
 * @default Press Cancel to Close
 * @desc Small text shown below CTA on the last page.
 *
 * @param Hint Text Color
 * @parent Text Settings
 * @type text
 * @default #888888
 * @desc Hex code for the text below the CTA.
 *
 * @param Hint Text Opacity
 * @parent Text Settings
 * @type number
 * @min 0
 * @max 255
 * @default 255
 * @desc Opacity of the text below the CTA (0-255).
 *
 * @param CTA Art Settings
 * @text --- CTA Appearance ---
 * * @param Use Default CTA Style
 * @parent CTA Art Settings
 * @type boolean
 * @default true
 * @desc True: Use drawn border. False: Use custom image below.
 *
 * @param Custom CTA Image
 * @parent CTA Art Settings
 * @type file
 * @dir img/system
 * @desc Image to use for the button background (if above is false).
 * * @param Use Default CTA Size
 * @parent CTA Art Settings
 * @type boolean
 * @default true
 * @desc True: Use standard size (220x50). False: Use sizes below.
 *
 * @param Custom CTA Width
 * @parent CTA Art Settings
 * @type number
 * @default 220
 * @desc Custom width for the CTA button. (Default: 220)
 *
 * @param Custom CTA Height
 * @parent CTA Art Settings
 * @type number
 * @default 50
 * @desc Custom height for the CTA button. (Default: 50)
 *
 * @param Indicator Settings
 * @text --- Page Indicators ---
 *
 * @param Active Dot Color
 * @parent Indicator Settings
 * @type text
 * @default #ff9900
 * @desc Hex color code for the current page dot.
 *
 * @param Inactive Dot Color
 * @parent Indicator Settings
 * @type text
 * @default #888888
 * @desc Hex color code for the inactive page dots.
 *
 * @help
 * ============================================================================
 * JR Custom Info Popup
 * ============================================================================
 *
 * Script Call:
 * callCustomPopup("YOUR_ID_HERE");
 *
 */

/*~struct~Popup:
 * @param id
 * @text Popup ID
 * @type text
 * @desc The unique ID used to call this popup.
 *
 * @param pages
 * @text Pages
 * @type struct<Page>[]
 * @desc The list of pages for this popup.
 */

/*~struct~Page:
 * @param title
 * @text Title
 * @type text
 * @desc Title of the page.
 *
 * @param image
 * @text Image Filename
 * @type file
 * @dir img/pictures
 * @desc The image to display (from img/pictures).
 *
 * @param description
 * @text Description
 * @type note
 * @desc Description text.
 */

(function() {
    'use strict';

    var parameters = PluginManager.parameters('JR_CustomInfoPopup');
    
    function parseParameters(param) {
        if (param === undefined || param === null) return [];
        try {
            var parsed = JSON.parse(param);
            if (Array.isArray(parsed)) {
                return parsed.map(p => parseParameters(p));
            } else if (typeof parsed === 'object') {
                for (var key in parsed) {
                    parsed[key] = parseParameters(parsed[key]);
                }
                return parsed;
            }
            return parsed;
        } catch (e) {
            return param;
        }
    }

    var popupData = parseParameters(parameters['Popups'] || "[]");

    // General
    var popupWidth = Number(parameters['Popup Width'] || 600);
    var popupHeight = Number(parameters['Popup Height'] || 550);
    var isCentered = (parameters['Center Popup'] === 'true');
    var popupX = Number(parameters['Popup X'] || 0);
    var popupY = Number(parameters['Popup Y'] || 0);
    
    // Title Styling
    var titleTextColor = parameters['Title Text Color'] || "#ffffff";
    var titleTextSize = Number(parameters['Title Text Size'] || 28);
    var useDefaultTitleSize = (parameters['Use Default Title Size'] === 'true');
    var titleBarWidth = Number(parameters['Title Bar Width'] || 500); 
    var titleBarHeight = Number(parameters['Title Bar Height'] || 40);
    var useDefaultTitleBG = (parameters['Use Default Title BG'] === 'true');
    var titleBgImage = parameters['Title BG Image'] || "";
    var titleBarColor = parameters['Title Bar Color'] || "#000000";
    var titleBarOpacity = Number(parameters['Title Bar Opacity'] || 100);
    var titleBGFadeEdges = (parameters['Title BG Fade Edges'] === 'true'); 
    
    // Title Border & Animation
    var showTitleBorder = (parameters['Show Title Border'] === 'true'); 
    var titleBorderColor = parameters['Title Border Color'] || "#FFD700";
    var titleBorderThickness = Number(parameters['Title Border Thickness'] || 2);
    var useBorderAnim = (parameters['Use Border Animation'] === 'true');
    var borderAnimType = parameters['Border Animation Type'] || "Pulse";

    // Image
    var imgWidth = Number(parameters['Image Width'] || 400);
    var imgHeight = Number(parameters['Image Height'] || 200);
    
    // Text
    var descPadding = Number(parameters['Description Padding'] || 20); 
    var scrollSpeed = Number(parameters['Scroll Speed'] || 0.5);
    var scrollStartDelay = Number(parameters['Scroll Start Delay'] || 90);
    
    var txtNext = parameters['CTA Next Text'] || "Next";
    var txtClose = parameters['CTA Close Text'] || "Close";
    var txtNextHint = parameters['Next Hint Text'] || "Press Left/Right to switch pages";
    var txtCloseHint = parameters['Close Hint Text'] || "Press Cancel to Close";
    
    var hintTextColor = parameters['Hint Text Color'] || "#888888";
    var hintTextOpacity = Number(parameters['Hint Text Opacity'] || 255);

    // CTA Appearance
    var useDefaultCTAStyle = (parameters['Use Default CTA Style'] === 'true');
    var ctaImageName = parameters['Custom CTA Image'] || "";
    var useDefaultCTASize = (parameters['Use Default CTA Size'] === 'true');
    var customCTAWidth = Number(parameters['Custom CTA Width'] || 220);
    var customCTAHeight = Number(parameters['Custom CTA Height'] || 50);

    // Indicators
    var activeDotColor = parameters['Active Dot Color'] || "#ff9900";
    var inactiveDotColor = parameters['Inactive Dot Color'] || "#888888";

    // ======================================================================
    // Input Blocking Logic & Event Pausing
    // ======================================================================

    var _Game_Player_canMove = Game_Player.prototype.canMove;
    Game_Player.prototype.canMove = function() {
        if (SceneManager._scene._customPopup && SceneManager._scene._customPopup.isOpen()) {
            return false;
        }
        return _Game_Player_canMove.call(this);
    };

    var _Scene_Map_processMapTouch = Scene_Map.prototype.processMapTouch;
    Scene_Map.prototype.processMapTouch = function() {
        if (this._customPopup && this._customPopup.isOpen()) {
            return; 
        }
        _Scene_Map_processMapTouch.call(this);
    };

    var _Scene_Map_isMenuEnabled = Scene_Map.prototype.isMenuEnabled;
    Scene_Map.prototype.isMenuEnabled = function() {
        if (this._customPopup && this._customPopup.isOpen()) {
            return false;
        }
        return _Scene_Map_isMenuEnabled.call(this);
    };

    // Force all Selectable Windows (Battle/Command/Menu) to ignore input if Popup is open
    var _Window_Selectable_isOpenAndActive = Window_Selectable.prototype.isOpenAndActive;
    Window_Selectable.prototype.isOpenAndActive = function() {
        var scene = SceneManager._scene;
        if (scene && scene._customPopup && scene._customPopup.isOpen()) {
            return false; 
        }
        return _Window_Selectable_isOpenAndActive.call(this);
    };

    // NEW (v1.19.0): Prevent Event Interpreter from executing commands while Popup is open
    // This stops the interpreter from rushing to the next line (Text Message) until the popup closes.
    var _Game_Interpreter_executeCommand = Game_Interpreter.prototype.executeCommand;
    Game_Interpreter.prototype.executeCommand = function() {
        var scene = SceneManager._scene;
        if (scene && scene._customPopup && scene._customPopup.isOpen()) {
            return false; // Tells the interpreter "Stop, I'm busy"
        }
        return _Game_Interpreter_executeCommand.call(this);
    };

    // ======================================================================
    // Global Access
    // ======================================================================

    window.callCustomPopup = function(id) {
        popupData = parseParameters(PluginManager.parameters('JR_CustomInfoPopup')['Popups'] || "[]");
        var data = popupData.find(p => p.id === id);
        if (data && data.pages && data.pages.length > 0) {
            var scene = SceneManager._scene;
            // Support Map AND Battle Scenes
            if (scene instanceof Scene_Map || (typeof Scene_Battle !== 'undefined' && scene instanceof Scene_Battle)) {
                var win = new Window_CustomPopup(data);
                scene.addChild(win);
                scene._customPopup = win;
            }
        }
    };

    // ======================================================================
    // Window_PopupCTA
    // ======================================================================
    
    function Window_PopupCTA() {
        this.initialize.apply(this, arguments);
    }
    Window_PopupCTA.prototype = Object.create(Window_Base.prototype);
    Window_PopupCTA.prototype.constructor = Window_PopupCTA;

    Window_PopupCTA.prototype.initialize = function(x, y, width, height) {
        Window_Base.prototype.initialize.call(this, x, y, width, height);
        this._text = "";
        this.opacity = 0; 
        this.contentsOpacity = 255;
    };

    Window_PopupCTA.prototype.standardPadding = function() { return 8; };

    Window_PopupCTA.prototype.setText = function(text) {
        if (this._text !== text) {
            this._text = text;
            this.refresh();
        }
    };

    Window_PopupCTA.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        if (!this.visible) return;
        if (TouchInput.isPressed()) {
            var x = this.canvasToLocalX(TouchInput.x);
            var y = this.canvasToLocalY(TouchInput.y);
            if (x >= 0 && y >= 0 && x < this.width && y < this.height) {
                this.contentsOpacity = 160; 
            } else {
                this.contentsOpacity = 255;
            }
        } else {
            this.contentsOpacity = 255;
        }
    };

    Window_PopupCTA.prototype.refresh = function() {
        this.contents.clear();
        var w = this.contentsWidth();
        var h = this.contentsHeight();

        if (!useDefaultCTAStyle && ctaImageName) {
            var bitmap = ImageManager.loadSystem(ctaImageName);
            bitmap.addLoadListener(function() {
                this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, w, h);
                this.drawCtaText(w, h);
            }.bind(this));
        } else {
            this.contents.fillRect(0, 0, w, h, 'rgba(0, 0, 0, 0.5)');
            var ctx = this.contents.context;
            ctx.save();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2;
            ctx.strokeRect(1, 1, w-2, h-2); 
            ctx.restore();
            this.drawCtaText(w, h);
        }
    };

    Window_PopupCTA.prototype.drawCtaText = function(w, h) {
        this.resetFontSettings();
        var y = (h - this.lineHeight()) / 2;
        this.drawText(this._text, 0, y, w, 'center');
    };

    // ======================================================================
    // Window_CustomPopup
    // ======================================================================

    function Window_CustomPopup() {
        this.initialize.apply(this, arguments);
    }
    Window_CustomPopup.prototype = Object.create(Window_Base.prototype);
    Window_CustomPopup.prototype.constructor = Window_CustomPopup;

    Window_CustomPopup.prototype.initialize = function(data) {
        var x = isCentered ? (Graphics.boxWidth - popupWidth) / 2 : popupX;
        var y = isCentered ? (Graphics.boxHeight - popupHeight) / 2 : popupY;
        
        Window_Base.prototype.initialize.call(this, x, y, popupWidth, popupHeight);
        
        this._data = data;
        this._pageIndex = 0;
        this._maxPages = data.pages.length;
        this._touchStartX = null;
        this._swipeThreshold = 50;
        this._animFrame = 0; 

        // Dedicated Sprite for Border Animation 
        this._borderSprite = new Sprite();
        this.addChildToBack(this._borderSprite); 

        // Scrolling Description Vars
        this._descBitmap = null;
        this._scrollY = 0;
        this._scrollWait = 0;
        this._scrollMode = 0; 

        // CTA Logic
        var btnWidth = useDefaultCTASize ? 220 : customCTAWidth;
        var btnHeight = useDefaultCTASize ? 50 : customCTAHeight;
        var globalBtnX = 0 + (this.width - btnWidth) / 2;
        var globalBtnY = this.height - btnHeight - 45;

        this._ctaWindow = new Window_PopupCTA(globalBtnX, globalBtnY, btnWidth, btnHeight);
        this.addChild(this._ctaWindow); 

        this.refresh();
        this.open();
        this._ctaWindow.open();
    };

    Window_CustomPopup.prototype.refresh = function() {
        this.contents.clear();
        
        this._scrollY = 0;
        this._scrollWait = 0;
        this._scrollMode = 0;
        if (this._descBitmap) {
            this._descBitmap.clear();
        }

        var page = this._data.pages[this._pageIndex];
        
        // Determine Title Bar Dimensions First
        var currentTitleHeight = useDefaultTitleSize ? 40 : titleBarHeight;

        this.drawPopupTitle(page.title, currentTitleHeight);
        this.drawPopupImage(page.image, currentTitleHeight);
        
        // --- DYNAMIC HEIGHT CALCULATION ---
        var ctaBtnHeight = useDefaultCTASize ? 50 : customCTAHeight;
        
        // 1. Calculate where elements sit
        var titleBottom = currentTitleHeight + 20; 
        var imgBottom = titleBottom + imgHeight + 20; 
        
        // 2. The Y coordinate where page indicators start (approx)
        var indicatorsY = this.contentsHeight() - ctaBtnHeight - 35; 
        
        // 3. Define the usable area for text
        var descStartY = imgBottom;
        var descEndY = indicatorsY - 10; 
        
        var availableHeight = descEndY - descStartY;
        
        this.preparePopupDesc(page.description, descStartY, availableHeight); 
        
        if (this._maxPages > 1) {
            this.drawPageIndicators();
        }
        
        var ctaText = (this._pageIndex < this._maxPages - 1) ? txtNext : txtClose;
        this._ctaWindow.setText(ctaText);
        
        this.drawFooterHint();
    };

    Window_CustomPopup.prototype.drawPopupTitle = function(title, h) {
        this.resetFontSettings();
        this.contents.fontSize = titleTextSize; 
        
        var rectHeight = h;
        var rectWidth = useDefaultTitleSize ? this.contentsWidth() : titleBarWidth;
        var dx = (this.contentsWidth() - rectWidth) / 2;

        // --- Store Rect for Animation ---
        this._titleRect = { x: dx, y: 0, w: rectWidth, h: rectHeight };
        this.setupBorderSprite(); 

        if (!useDefaultTitleBG && titleBgImage) {
            var bmp = ImageManager.loadSystem(titleBgImage);
            bmp.addLoadListener(function() {
                this.contents.blt(bmp, 0, 0, bmp.width, bmp.height, dx, 0, rectWidth, rectHeight);
                this.resetFontSettings();
                this.contents.fontSize = titleTextSize; 
                this.changeTextColor(titleTextColor);
                var textY = (rectHeight - this.lineHeight()) / 2 - 2; 
                this.drawText(title, dx, textY, rectWidth, 'center');
            }.bind(this));
        } else {
            this.contents.paintOpacity = titleBarOpacity;
            if (titleBGFadeEdges) {
                this.contents.gradientFillRect(dx, 0, rectWidth / 2, rectHeight, 'rgba(0,0,0,0)', titleBarColor, false);
                this.contents.gradientFillRect(dx + rectWidth / 2, 0, rectWidth / 2, rectHeight, titleBarColor, 'rgba(0,0,0,0)', false);
            } else {
                this.contents.fillRect(dx, 0, rectWidth, rectHeight, titleBarColor);
            }
            
            if (showTitleBorder && titleBorderThickness > 0 && !useBorderAnim) {
                var ctx = this.contents.context;
                ctx.save();
                ctx.lineWidth = titleBorderThickness;
                ctx.strokeStyle = titleBorderColor;
                var offset = titleBorderThickness / 2;
                ctx.strokeRect(dx + offset, offset, rectWidth - titleBorderThickness, rectHeight - titleBorderThickness);
                ctx.restore();
            }

            this.contents.paintOpacity = 255;
            this.changeTextColor(titleTextColor);
            var textY = (rectHeight - this.lineHeight()) / 2 - 2; 
            this.drawText(title, dx, textY, rectWidth, 'center');
        }
    };

    // ======================================================================
    // Title Border Animation
    // ======================================================================

    Window_CustomPopup.prototype.setupBorderSprite = function() {
        if (!useBorderAnim || !this._titleRect || !useDefaultTitleBG || !showTitleBorder) {
            this._borderSprite.visible = false;
            return;
        }
        
        var w = this.contentsWidth();
        var h = this.contentsHeight(); 

        if (!this._borderSprite.bitmap) {
            this._borderSprite.bitmap = new Bitmap(w, h);
        } else {
            this._borderSprite.bitmap.clear();
            if (this._borderSprite.bitmap.width !== w) this._borderSprite.bitmap.resize(w, h);
        }
        
        this._borderSprite.x = this.standardPadding();
        this._borderSprite.y = this.standardPadding();
        this._borderSprite.visible = true;
    };

    Window_CustomPopup.prototype.updateBorderAnimation = function() {
        if (!useBorderAnim || !this._borderSprite.visible || !this._titleRect || !useDefaultTitleBG || !showTitleBorder) return;

        this._animFrame++;
        var rect = this._titleRect;
        var ctx = this._borderSprite.bitmap.context;
        var thickness = titleBorderThickness;
        var offset = thickness / 2;

        this._borderSprite.bitmap.clear();
        ctx.save();
        ctx.lineWidth = thickness;
        
        // Base Path
        ctx.beginPath();
        ctx.rect(rect.x + offset, rect.y + offset, rect.w - thickness, rect.h - thickness);

        // --- ANIMATION TYPES ---
        if (borderAnimType === "Pulse") {
            var alpha = 0.6 + 0.4 * Math.sin(this._animFrame * 0.1);
            ctx.globalAlpha = alpha;
            ctx.strokeStyle = titleBorderColor;
            ctx.stroke();

        } else if (borderAnimType === "Flash") {
            var t = (Math.sin(this._animFrame * 0.1) + 1) / 2; 
            ctx.strokeStyle = titleBorderColor;
            ctx.stroke();
            ctx.globalAlpha = t; 
            ctx.strokeStyle = "#ffffff";
            ctx.stroke();

        } else if (borderAnimType === "Rainbow") {
            var hue = (this._animFrame * 2) % 360;
            ctx.strokeStyle = 'hsl(' + hue + ', 100%, 50%)';
            ctx.stroke();

        } else if (borderAnimType === "Marching Ants") {
            ctx.strokeStyle = titleBorderColor;
            ctx.setLineDash([10, 5]); 
            ctx.lineDashOffset = -this._animFrame; 
            ctx.stroke();
            
        } else if (borderAnimType === "Snake") {
            var perimeter = 2 * (rect.w + rect.h);
            var len = Math.min(rect.w, rect.h) / 2; 
            
            ctx.strokeStyle = titleBorderColor;
            ctx.setLineDash([len, perimeter - len]); 
            ctx.lineDashOffset = -this._animFrame * 4; 
            ctx.stroke();
            
        } else if (borderAnimType === "Elastic") {
            var wave = Math.sin(this._animFrame * 0.1);
            var extra = 2; 
            
            ctx.lineWidth = Math.max(1, thickness + (wave * extra));
            ctx.strokeStyle = titleBorderColor;
            ctx.stroke();
        }

        ctx.restore();
        this._borderSprite.bitmap._setDirty();
    };


    // ======================================================================

    Window_CustomPopup.prototype.drawPopupImage = function(filename, titleH) {
        if (!filename) return;
        var bitmap = ImageManager.loadPicture(filename);
        var targetY = titleH + 20; 
        var targetW = imgWidth;
        var targetH = imgHeight;

        bitmap.addLoadListener(function() {
            var rw = targetW / bitmap.width;
            var rh = targetH / bitmap.height;
            var scale = Math.min(rw, rh);
            var dw = Math.floor(bitmap.width * scale);
            var dh = Math.floor(bitmap.height * scale);
            var dx = (this.contentsWidth() - dw) / 2;
            var dy = targetY + (targetH - dh) / 2;
            this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, dx, dy, dw, dh);
        }.bind(this));
    };

    // ======================================================================
    // Description Scrolling Logic
    // ======================================================================

    Window_CustomPopup.prototype.preparePopupDesc = function(text, startY, heightCap) {
        if (!text) return;
        
        this._xPadding = descPadding; 
        var usableWidth = this.contentsWidth() - (this._xPadding * 2);
        
        this.resetFontSettings();
        this.contents.fontSize = 22;
        
        if (!this._descBitmap) {
            this._descBitmap = new Bitmap(usableWidth, 2000); 
        }
        
        var tempContents = this.contents;
        this.contents = this._descBitmap;
        this.contents.clear(); 
        this.resetFontSettings(); 
        this.contents.fontSize = 22;

        var textState = { index: 0, x: 0, y: 0, left: 0 };
        textState.text = this.convertEscapeCharacters(text);
        textState.height = this.calcTextHeight(textState, false);
        
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
        }
        
        this._descTotalHeight = textState.y + textState.height;

        this.contents = tempContents;
        
        this._descArea = { x: this._xPadding, y: startY, w: usableWidth, h: heightCap };
        
        this.updateScroll(); 
    };

    Window_CustomPopup.prototype.updateScroll = function() {
        if (!this._descBitmap || !this._descArea) return;

        var viewH = this._descArea.h;
        var fullH = this._descTotalHeight;

        if (fullH <= viewH) {
             this.contents.clearRect(this._descArea.x, this._descArea.y, this._descArea.w, this._descArea.h);
             this.contents.blt(this._descBitmap, 0, 0, this._descArea.w, viewH, this._descArea.x, this._descArea.y);
             return;
        }

        if (this._scrollMode === 0) { // Wait Top
            this._scrollWait++;
            if (this._scrollWait > scrollStartDelay) {
                this._scrollWait = 0;
                this._scrollMode = 1;
            }
        } else if (this._scrollMode === 1) { // Scroll Down
            this._scrollY += scrollSpeed;
            if (this._scrollY >= fullH - viewH) {
                this._scrollY = fullH - viewH;
                this._scrollMode = 2;
            }
        } else if (this._scrollMode === 2) { // Wait Bottom
            this._scrollWait++;
            if (this._scrollWait > 60) {
                this._scrollWait = 0;
                this._scrollMode = 3;
            }
        } else if (this._scrollMode === 3) { // Scroll Up
            this._scrollY -= scrollSpeed * 2; 
            if (this._scrollY <= 0) {
                this._scrollY = 0;
                this._scrollMode = 0;
            }
        }

        this.contents.clearRect(this._descArea.x, this._descArea.y, this._descArea.w, this._descArea.h);
        this.contents.blt(this._descBitmap, 0, this._scrollY, this._descArea.w, viewH, this._descArea.x, this._descArea.y);
    };

    // ======================================================================

    Window_CustomPopup.prototype.drawPageIndicators = function() {
        var dotSize = 10;
        var spacing = 15;
        var totalWidth = (this._maxPages * dotSize) + ((this._maxPages - 1) * spacing);
        var startX = (this.contentsWidth() - totalWidth) / 2;
        
        var btnHeight = useDefaultCTASize ? 50 : customCTAHeight;
        var y = this.contentsHeight() - btnHeight - 35; 

        for (var i = 0; i < this._maxPages; i++) {
            var color = (i === this._pageIndex) ? activeDotColor : inactiveDotColor;
            this.contents.drawCircle(startX + (i * (dotSize + spacing)) + dotSize/2, y, dotSize/2, color);
        }
    };

    Window_CustomPopup.prototype.drawFooterHint = function() {
        var y = this.contentsHeight() - 30; 
        var hintText = (this._pageIndex < this._maxPages - 1) ? txtNextHint : txtCloseHint;
        this.resetFontSettings();
        this.contents.fontSize = 16;
        
        this.changeTextColor(hintTextColor);
        this.contents.paintOpacity = hintTextOpacity;
        this.drawText(hintText, 0, y - 5, this.contentsWidth(), 'center');
        this.contents.paintOpacity = 255;
    };

    // ======================================================================
    // Input Handling
    // ======================================================================

    Window_CustomPopup.prototype.update = function() {
        Window_Base.prototype.update.call(this);
        
        // Sync Border Opacity
        if (this._borderSprite) {
            this._borderSprite.opacity = this.openness;
            this._borderSprite.visible = (this.openness > 0);
        }

        if (this.isOpen()) {
            this.processTouch();
            this.processKeyboard();
            this.updateScroll();
            this.updateBorderAnimation(); 
        }
    };

    Window_CustomPopup.prototype.processTouch = function() {
        if (TouchInput.isTriggered()) {
            this._touchStartX = TouchInput.x;
            var cta = this._ctaWindow;
            var tx = TouchInput.x;
            var ty = TouchInput.y;
            var gx = this.x + cta.x;
            var gy = this.y + cta.y;

            if (tx >= gx && tx <= gx + cta.width &&
                ty >= gy && ty <= gy + cta.height) {
                this.onCtaClick();
            }
        }
        if (TouchInput.isCancelled()) {
            this.closePopup();
        }
        if (TouchInput.isReleased()) {
            if (this._touchStartX !== null) {
                var diffX = TouchInput.x - this._touchStartX;
                if (Math.abs(diffX) > this._swipeThreshold) {
                    if (diffX > 0) this.prevPage(); 
                    else this.nextPage(); 
                }
                this._touchStartX = null;
            }
        }
    };

    Window_CustomPopup.prototype.processKeyboard = function() {
        if (Input.isTriggered('right')) this.nextPage();
        else if (Input.isTriggered('left')) this.prevPage();
        else if (Input.isTriggered('cancel') || Input.isTriggered('menu')) this.closePopup();
        else if (Input.isTriggered('ok')) {
            if (this._pageIndex < this._maxPages - 1) this.nextPage();
            else this.closePopup();
        }
    };

    Window_CustomPopup.prototype.nextPage = function() {
        if (this._pageIndex < this._maxPages - 1) {
            this._pageIndex++;
            SoundManager.playCursor();
            this.refresh();
        }
    };

    Window_CustomPopup.prototype.prevPage = function() {
        if (this._pageIndex > 0) {
            this._pageIndex--;
            SoundManager.playCursor();
            this.refresh();
        }
    };

    Window_CustomPopup.prototype.onCtaClick = function() {
        if (this._pageIndex < this._maxPages - 1) {
            this.nextPage();
        } else {
            this.closePopup();
        }
    };

    Window_CustomPopup.prototype.closePopup = function() {
        SoundManager.playOk();
        this.close();
        this._ctaWindow.close();
        
        // Immediately hide border sprite to be safe
        if (this._borderSprite) this._borderSprite.visible = false;
        
        var self = this;
        setTimeout(function() {
            if (self.parent) self.parent.removeChild(self);
            if (SceneManager._scene._customPopup === self) {
                SceneManager._scene._customPopup = null;
            }
        }, 500);
    };

})();