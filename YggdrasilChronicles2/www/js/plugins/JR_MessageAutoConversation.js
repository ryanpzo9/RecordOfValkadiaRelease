//=============================================================================
// JR_MessageAutoConversation.js
//=============================================================================

var Imported = Imported || {};
Imported.JR_MessageAutoConversation = true;

var JR = JR || {};
JR.MAC = JR.MAC || {};
JR.MAC.version = 1.42;

//=============================================================================
/*:
 * @plugindesc v1.42 Adds an "Auto Conversation" option to auto-advance messages with icon-based status display and toggle.
 * Requires YEP_MessageCore.js.
 * @author James Ryan
 *
 * @param Auto Conversation Label
 * @desc The text displayed for the Auto Conversation option in the Options menu.
 * @default Auto Conversation
 *
 * @param Auto Delay
 * @desc Delay in frames between auto-advancing messages (60 frames = 1 second).
 * @type number
 * @min 1
 * @default 60
 *
 * @param Play Enabled Button
 * @desc Filename (without .png) for the Play button when auto-conversation is enabled (in img/system/).
 * @default AltEnabled
 *
 * @param Play Disabled Button
 * @desc Filename (without .png) for the Play button when auto-conversation is disabled (in img/system/).
 * @default AltDisabled
 *
 * @param Play Button Width
 * @desc Width of the Play button (in pixels). Resizes the icon to this width.
 * @type number
 * @min 1
 * @default 32
 *
 * @param Play Button Height
 * @desc Height of the Play button (in pixels). Resizes the icon to this height.
 * @type number
 * @min 1
 * @default 32
 *
 * @param Play Button X Offset
 * @desc X offset of the Play button relative to the name box's right edge (positive = right, negative = left).
 * @type number
 * @min -9999
 * @default 10
 *
 * @param Play Button Y Offset
 * @desc Y offset of the Play button relative to the name box's top (positive = down, negative = up).
 * @type number
 * @min -9999
 * @default 0
 *
 * @param Fast-Forward Enabled Button
 * @desc Filename (without .png) for the Fast-Forward button when Shift is held (in img/system/).
 * @default ShiftEnabled
 *
 * @param Fast-Forward Disabled Button
 * @desc Filename (without .png) for the Fast-Forward button when Shift is not held (in img/system/).
 * @default ShiftDisabled
 *
 * @param Fast-Forward Button Width
 * @desc Width of the Play button (in pixels). Resizes the icon to this width.
 * @type number
 * @min 1
 * @default 32
 *
 * @param Fast-Forward Button Height
 * @desc Height of the Play button (in pixels). Resizes the icon to this height.
 * @type number
 * @min 1
 * @default 32
 *
 * @param Fast-Forward Button X Offset
 * @desc X offset of the Fast-Forward button relative to the Play button's right edge (positive = right, negative = left).
 * @type number
 * @min -9999
 * @default 5
 *
 * @param Fast-Forward Button Y Offset
 * @desc Y offset of the Fast-Forward button relative to the Play button's top (positive = down, negative = up).
 * @type number
 * @min -9999
 * @default 0
 *
 * @param Message Box Above X Offset
 * @desc X offset of the Play button when placed above the message box (no namebox, message box at bottom).
 * @type number
 * @min -9999
 * @default 10
 *
 * @param Message Box Above Y Offset
 * @desc Y offset of the Play button when placed above the message box (no namebox, message box at bottom).
 * @type number
 * @min -9999
 * @default -10
 *
 * @param Message Box Below X Offset
 * @desc X offset of the Play button when placed below the message box (no namebox, message box not at bottom).
 * @type number
 * @min -9999
 * @default 10
 *
 * @param Message Box Below Y Offset
 * @desc Y offset of the Play button when placed below the message box (no namebox, message box not at bottom).
 * @type number
 * @min -9999
 * @default 10
 *
 * @param Breathing Time
 * @desc Time in seconds for one complete breathing cycle (max to min opacity and back) for enabled buttons.
 * @type number
 * @min 0.1
 * @decimals 1
 * @default 2.0
 *
 * @param Min Breathing Opacity
 * @desc Minimum opacity of the breathing effect for enabled buttons (0-255).
 * @type number
 * @min 0
 * @max 255
 * @default 100
 *
 * @param Max Breathing Opacity
 * @desc Maximum opacity of the breathing effect for enabled buttons (0-255).
 * @type number
 * @min 0
 * @max 255
 * @default 255
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin requires YEP_MessageCore.js to function. Place 
 * JR_MessageAutoConversation.js below YEP_MessageCore.js in the plugin list.
 *
 * This plugin adds an "Auto Conversation" option to auto-advance messages, 
 * with an icon-based status display next to the YEP_MessageCore name box. 
 * - Play Button: Shows the auto-conversation state (enabled/disabled).
 * - Fast-Forward Button: Shows the fast-forward state (enabled when holding Shift, disabled otherwise).
 * The "Auto Conversation" option in the Options menu acts as a master switch:
 * - ON: Enables the plugin, allowing auto-advance, Alt toggle, and showing buttons.
 * - OFF: Disables the plugin entirely (no auto-advance, no Alt toggle, no buttons), but does not interfere with YEP_MessageCore's Shift fast-forward feature.
 *
 * ============================================================================
 * Instructions
 * ============================================================================
 *
 * - "Auto Conversation Label": Customize the text in the Options menu.
 * - "Auto Delay": Set the delay (in frames). Default is 60 frames.
 * - "Play Enabled Button": Filename for the Play button when auto-conversation is enabled (default: AltEnabled).
 * - "Play Disabled Button": Filename for the Play button when auto-conversation is disabled (default: AltDisabled).
 * - "Play Button Width": Width of the Play button (default: 32 pixels).
 * - "Play Button Height": Height of the Play button (default: 32 pixels).
 * - "Play Button X Offset": X offset from the right edge of the name box (default: 10).
 * - "Play Button Y Offset": Y offset from the top of the name box (default: 0).
 * - "Fast-Forward Enabled Button": Filename for the Fast-Forward button when Shift is held (default: ShiftEnabled).
 * - "Fast-Forward Disabled Button": Filename for the Fast-Forward button when Shift is not held (default: ShiftDisabled).
 * - "Fast-Forward Button Width": Width of the Fast-Forward button (default: 32 pixels).
 * - "Fast-Forward Button Height": Height of the Fast-Forward button (default: 32 pixels).
 * - "Fast-Forward Button X Offset": X offset from the right edge of the Play button (default: 5).
 * - "Fast-Forward Button Y Offset": Y offset from the top of the Play button (default: 0).
 * - "Message Box Above X Offset": X offset when buttons are above the message box (default: 10).
 * - "Message Box Above Y Offset": Y offset when buttons are above the message box (default: -10).
 * - "Message Box Below X Offset": X offset when buttons are below the message box (default: 10).
 * - "Message Box Below Y Offset": Y offset when buttons are below the message box (default: 10).
 * - "Breathing Time": Time in seconds for one breathing cycle of enabled buttons (default: 2.0 seconds).
 * - "Min Breathing Opacity": Minimum opacity for the breathing effect (default: 100).
 * - "Max Breathing Opacity": Maximum opacity for the breathing effect (default: 255).
 *
 * Place the icon files (e.g., AltEnabled.png, AltDisabled.png, ShiftEnabled.png, ShiftDisabled.png) 
 * in the `img/system/` folder of your project.
 *
 * ============================================================================
 * Controls
 * ============================================================================
 *
 * - Options Menu: Toggle "Auto Conversation" ON/OFF to enable/disable the plugin.
 * - Press Alt: Toggles auto-advance on/off during a conversation (only when plugin is enabled; does not affect Options menu setting).
 * - Hold Shift: Fast-forwards the conversation (handled by this plugin when enabled; falls back to YEP_MessageCore when disabled).
 *
 * ============================================================================
 * Compatibility
 * ============================================================================
 *
 * Designed for YEP_MessageCore.js. Compatible with YEP_X_MessageBacklog.js.
 * Test with other message plugins (e.g., YEP_X_ExtMesPack1.js) for compatibility.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.42:
 * - Changed "Auto Conversation" option to act as a master switch: ON enables the plugin fully; OFF disables the plugin entirely (no auto-advance, no Alt toggle, no buttons), but does not interfere with YEP_MessageCore's Shift fast-forward feature.
 * - Modified Alt key to toggle auto-advance during conversations without affecting the Options menu setting.
 *
 * Version 1.41:
 * - Fixed button overlap when the message box is at the bottom and no namebox: buttons are now positioned fully above the message box by accounting for button height.
 *
 * Version 1.40:
 * - Added configurable X and Y offsets for button positioning when the namebox is absent (above/below message box).
 *
 * Version 1.39:
 * - Fixed button positioning: ensures buttons reposition dynamically when the namebox disappears and the message box changes position.
 *
 * Version 1.38:
 * - Updated button positioning when namebox is absent: if the message box is at the bottom, buttons are placed above (Y-10 from top, X+10 from left edge); otherwise, below (Y+10 from bottom, X+10 from left edge).
 *
 * Version 1.37:
 * - Updated button anchoring: prioritizes namebox if it exists; otherwise, anchors to the message box (X to right edge, Y to top).
 *
 * Version 1.36:
 * - Fixed issue where the message backlog could be opened even when no conversation was active.
 *
 * Version 1.35:
 * - Fixed issue where conversations stopped after disabling auto-conversation.
 * - Ensured backlog can be opened with Tab when auto-conversation is disabled, without halting message progression.
 *
 * Version 1.34:
 * - Fixed issue where the message backlog could not be opened after enabling/disabling auto-conversation.
 * - Added logic to disable backlog input when auto-conversation is enabled, and re-enable it when auto-conversation is disabled.
 *
 * Version 1.33:
 * - Fixed issue where the message backlog (e.g., using Tab key) could not be reopened after toggling auto-conversation.
 *
 * Version 1.32:
 * - Updated Breathing Time parameter to accept float values (e.g., 1.5 seconds).
 *
 * Version 1.31:
 * - Changed Fast-Forward button X/Y offsets to be relative to the Play button instead of the name box.
 * - Added Min Breathing Opacity and Max Breathing Opacity parameters to control the breathing effect range.
 *
 * Version 1.30:
 * - Added breathing effect (opacity flashing) for enabled buttons (Play and Fast-Forward).
 * - Added Breathing Time parameter to configure the breathing cycle duration.
 *
 * Version 1.29:
 * - Added parameters to control the size (width/height) of the Play and Fast-Forward buttons.
 * - Added separate X/Y offset parameters for the Play and Fast-Forward buttons, replacing the single Icon X/Y Offset.
 * - Removed Icon Spacing parameter as individual X/Y offsets provide more control.
 *
 * Version 1.28:
 * - Replaced status text with two icons: Play button (for auto-conversation state) and Fast-Forward button (for Shift key fast-forward state).
 * - Added parameters for icon filenames, X/Y offsets, and icon spacing.
 * - Added fast-forward functionality when holding Shift during a conversation.
 *
 * Version 1.27:
 * - Removed debug logs; allowed negative X/Y offsets; disabled plugin during battle.
 *
 * Version 1.26:
 * - Fixed opacity settings by correcting parameter reading for falsy values.
 *
 * Version 1.25:
 * - Fixed text size by overriding Window_Base font size; fixed opacity settings.
 *
 * Version 1.24:
 * - Fixed text size by setting font size on tempWindow in drawTextEx.
 *
 * Version 1.23:
 * - Fixed text size application with debug log; removed other debug logs.
 *
 * Version 1.22:
 * - Fixed text size application; added max opacity parameter; hid text during backlog.
 *
 * Version 1.21:
 * - Fixed text cutoff with word wrap; fixed text size; allowed negative offsets; fixed toggle during choices.
 *
 * Version 1.20:
 * - Removed window border; added text opacity and breathing effect.
 *
 * Version 1.19:
 * - Added configurable text content, opacity, and colors; fixed text visibility when no messages.
 *
 * Version 1.18:
 * - Fixed status text visibility by using global coordinates and adding to scene.
 *
 * Version 1.17:
 * - Fixed status text visibility by adjusting coordinate system and z-order.
 *
 * Version 1.16:
 * - Positioned status text to the right of YEP_MessageCore name box by default.
 *
 * Version 1.15:
 * - Fixed status text visibility; fixed message replay on toggle.
 *
 * Version 1.14:
 * - Changed toggle to press Alt; adjusted status text position; added configurable text size, X/Y offsets.
 *
 * Version 1.13:
 * - Added status text above message window and Alt hold toggle during conversations.
 *
 * Version 1.12:
 * - Ensured terminateMessage is called before startMessage to advance queue.
 *
 * Version 1.11:
 * - Forced queue advance in terminateMessage to prevent looping.
 *
 * Version 1.10:
 * - Fixed message looping by ensuring startMessage advances the queue.
 *
 * Version 1.09:
 * - Fixed looping first message by ensuring proper advance when _textState is null.
 *
 * Version 1.08:
 * - Fixed auto-advance by handling null _textState after message termination.
 *
 * Version 1.07:
 * - Added debug logging and forced message advance by resetting wait states.
 *
 * Version 1.06:
 * - Simulated input trigger to bypass manual input requirement.
 *
 * Version 1.05:
 * - Removed updateInput override to prevent game freeze; simplified auto-advance logic.
 *
 * Version 1.04:
 * - Overhauled auto-advance to force message progression without player input.
 *
 * Version 1.03:
 * - Fixed "Cannot set property '_autoTimer' of undefined" error during startup.
 *
 * Version 1.02:
 * - Reworked auto-advance logic to ensure message sequence continues.
 *
 * Version 1.01:
 * - Fixed issue where messages didn’t auto-advance past the first message.
 *
 * Version 1.00:
 * - Initial release.
 */
//=============================================================================

if (Imported.YEP_MessageCore) {

//=============================================================================
// Parameter Variables
//=============================================================================

JR.Parameters = PluginManager.parameters('JR_MessageAutoConversation');
JR.Param = JR.Param || {};

JR.Param.MACAutoLabel = String(JR.Parameters['Auto Conversation Label']) || 'Auto Conversation';
JR.Param.MACAutoDelay = Number(JR.Parameters['Auto Delay']) || 60;
JR.Param.MACPlayEnabledButton = String(JR.Parameters['Play Enabled Button']) || 'AltEnabled';
JR.Param.MACPlayDisabledButton = String(JR.Parameters['Play Disabled Button']) || 'AltDisabled';
JR.Param.MACPlayButtonWidth = Number(JR.Parameters['Play Button Width']) || 32;
JR.Param.MACPlayButtonHeight = Number(JR.Parameters['Play Button Height']) || 32;
JR.Param.MACPlayButtonXOffset = Number(JR.Parameters['Play Button X Offset']) || 10;
JR.Param.MACPlayButtonYOffset = Number(JR.Parameters['Play Button Y Offset']) || 0;
JR.Param.MACFastForwardEnabledButton = String(JR.Parameters['Fast-Forward Enabled Button']) || 'ShiftEnabled';
JR.Param.MACFastForwardDisabledButton = String(JR.Parameters['Fast-Forward Disabled Button']) || 'ShiftDisabled';
JR.Param.MACFastForwardButtonWidth = Number(JR.Parameters['Fast-Forward Button Width']) || 32;
JR.Param.MACFastForwardButtonHeight = Number(JR.Parameters['Fast-Forward Button Height']) || 32;
JR.Param.MACFastForwardButtonXOffset = Number(JR.Parameters['Fast-Forward Button X Offset']) || 5;
JR.Param.MACFastForwardButtonYOffset = Number(JR.Parameters['Fast-Forward Button Y Offset']) || 0;
JR.Param.MACMessageBoxAboveXOffset = Number(JR.Parameters['Message Box Above X Offset']) || 10;
JR.Param.MACMessageBoxAboveYOffset = Number(JR.Parameters['Message Box Above Y Offset']) || -10;
JR.Param.MACMessageBoxBelowXOffset = Number(JR.Parameters['Message Box Below X Offset']) || 10;
JR.Param.MACMessageBoxBelowYOffset = Number(JR.Parameters['Message Box Below Y Offset']) || 10;
JR.Param.MACBreathingTime = Number(JR.Parameters['Breathing Time']) || 2.0;
JR.Param.MACMinBreathingOpacity = Number(JR.Parameters['Min Breathing Opacity']) || 100;
JR.Param.MACMaxBreathingOpacity = Number(JR.Parameters['Max Breathing Opacity']) || 255;

//=============================================================================
// ConfigManager
//=============================================================================

ConfigManager.autoConversationEnabled = false; // Master switch for the plugin
ConfigManager.autoConversationActive = false; // Tracks whether auto-advance is active during conversations

JR.MAC.ConfigManager_makeData = ConfigManager.makeData;
ConfigManager.makeData = function() {
    var config = JR.MAC.ConfigManager_makeData.call(this);
    config.autoConversationEnabled = this.autoConversationEnabled;
    config.autoConversationActive = this.autoConversationActive;
    return config;
};

JR.MAC.ConfigManager_applyData = ConfigManager.applyData;
ConfigManager.applyData = function(config) {
    JR.MAC.ConfigManager_applyData.call(this, config);
    this.autoConversationEnabled = this.readAutoConversation(config, 'autoConversationEnabled');
    this.autoConversationActive = this.readAutoConversation(config, 'autoConversationActive');
};

ConfigManager.readAutoConversation = function(config, key) {
    if (config.hasOwnProperty(key)) {
        return config[key];
    } else {
        return false; // Default to off for new games or old saves
    }
};

//=============================================================================
// Window_Options
//=============================================================================

JR.MAC.Window_Options_addGeneralOptions = Window_Options.prototype.addGeneralOptions;
Window_Options.prototype.addGeneralOptions = function() {
    JR.MAC.Window_Options_addGeneralOptions.call(this);
    this.addCommand(JR.Param.MACAutoLabel, 'autoConversationEnabled');
};

//=============================================================================
// Scene_Map
//=============================================================================

JR.MAC.Scene_Map_createAllWindows = Scene_Map.prototype.createAllWindows;
Scene_Map.prototype.createAllWindows = function() {
    JR.MAC.Scene_Map_createAllWindows.call(this);
    this._autoConversationStatusSprite = new Sprite_AutoConversationStatus(this._messageWindow);
    this.addChild(this._autoConversationStatusSprite);
};

//=============================================================================
// Window_Message
//=============================================================================

JR.MAC.Window_Message_initialize = Window_Message.prototype.initialize;
Window_Message.prototype.initialize = function() {
    JR.MAC.Window_Message_initialize.call(this);
    this._autoTimer = 0;
    this._isFastForwarding = false; // Track fast-forward state for this plugin
};

JR.MAC.Window_Message_update = Window_Message.prototype.update;
Window_Message.prototype.update = function() {
    JR.MAC.Window_Message_update.call(this);
    // Only apply plugin logic if the plugin is enabled and not in a battle scene
    if (ConfigManager.autoConversationEnabled && !(SceneManager._scene instanceof Scene_Battle) && this.isOpen() && this.active) {
        this.updateAutoToggle();
        this.updateFastForward(); // Check for Shift key to fast-forward (plugin-specific)
        if (ConfigManager.autoConversationActive) {
            this.updateAutoConversation();
        } else {
            this._autoTimer = 0;
        }
    } else {
        this._autoTimer = 0;
        this._isFastForwarding = false;
    }
    // Update the status sprite through the scene, but only if the plugin is enabled and not in battle
    if (ConfigManager.autoConversationEnabled && !(SceneManager._scene instanceof Scene_Battle) && SceneManager._scene._autoConversationStatusSprite) {
        SceneManager._scene._autoConversationStatusSprite.updatePositionAndIcons(this);
    }
};

Window_Message.prototype.updateAutoToggle = function() {
    if (Input.isTriggered('alt')) {
        var wasActive = ConfigManager.autoConversationActive;
        ConfigManager.autoConversationActive = !ConfigManager.autoConversationActive;
        SoundManager.playOk();
        // If re-enabling auto-conversation, ensure the current message doesn't advance if waiting for input
        if (!wasActive && ConfigManager.autoConversationActive) {
            if ((this.isMessageFullyDisplayed() || !this._textState) && !this.isWaitingForInput()) {
                this.advanceMessage();
            }
        }
        // If disabling auto-conversation, ensure the message window is active for manual input
        if (!ConfigManager.autoConversationActive && this.isOpen() && !this.isAnySubWindowActive()) {
            this.activate();
        }
    }
};

Window_Message.prototype.updateFastForward = function() {
    // Check if Shift is held to enable fast-forward (plugin-specific)
    this._isFastForwarding = Input.isPressed('shift');
    if (this._isFastForwarding) {
        // Speed up message display by reducing wait times
        this._showFast = true;
        this._waitCount = 0;
    } else {
        this._showFast = false;
    }
};

Window_Message.prototype.updateAutoConversation = function() {
    if (this.isWaitingForInput()) {
        this._autoTimer = 0;
        return;
    }

    this.pause = false;
    if (this.isMessageFullyDisplayed() || (!this._textState && $gameMessage.hasText())) {
        // Adjust delay based on fast-forward state
        var effectiveDelay = this._isFastForwarding ? Math.floor(JR.Param.MACAutoDelay / 4) : JR.Param.MACAutoDelay;
        this._autoTimer++;
        if (this._autoTimer >= effectiveDelay) {
            this._autoTimer = 0;
            this._waitCount = 0;
            this.advanceMessage();
        }
    }
};

Window_Message.prototype.isWaitingForInput = function() {
    return $gameMessage.isChoice() || $gameMessage.isNumberInput() || 
           $gameMessage.isItemChoice() || this._choiceWindow.active || 
           this._numberWindow.active || this._itemWindow.active;
};

Window_Message.prototype.isMessageFullyDisplayed = function() {
    return this._textState && this._textState.index >= this._textState.text.length;
};

Window_Message.prototype.advanceMessage = function() {
    this.terminateMessage();
    if ($gameMessage.hasText()) {
        this.startMessage();
    }
};

JR.MAC.Window_Message_terminateMessage = Window_Message.prototype.terminateMessage;
Window_Message.prototype.terminateMessage = function() {
    JR.MAC.Window_Message_terminateMessage.call(this);
    this._textState = null;
    if ((ConfigManager.autoConversationEnabled && ConfigManager.autoConversationActive) && $gameMessage.hasText()) {
        $gameMessage._texts.shift();
    }
    // Ensure the message window is active for manual input after terminating a message
    if (!(ConfigManager.autoConversationEnabled && ConfigManager.autoConversationActive) && this.isOpen() && !this.isAnySubWindowActive()) {
        this.activate();
    }
};

// Override updateBacklogInput to disable backlog when auto-conversation is enabled and active
JR.MAC.Window_Message_updateBacklogInput = Window_Message.prototype.updateBacklogInput;
Window_Message.prototype.updateBacklogInput = function() {
    // Call the original method to preserve YEP_MessageCore behavior
    JR.MAC.Window_Message_updateBacklogInput.call(this);
    // Only apply plugin-specific backlog logic if the plugin is enabled
    if (ConfigManager.autoConversationEnabled) {
        // Only allow backlog input if a conversation is active
        if (!this.isOpen() || !$gameMessage.hasText()) return;
        // Disable backlog input when auto-conversation is active
        if (ConfigManager.autoConversationActive) return;
        // Allow backlog input when auto-conversation is disabled, without affecting message progression
        if (this.isAnySubWindowActive()) return;
        if (!$gameSystem.isMessageBacklogKeyEnabled()) return;
        if (Input.isTriggered(Yanfly.Param.MsgBacklogKeyButton)) {
            this.openBacklogWindow();
        }
    }
};

//=============================================================================
// Sprite_AutoConversationStatus
//=============================================================================

function Sprite_AutoConversationStatus() {
    this.initialize.apply(this, arguments);
}

Sprite_AutoConversationStatus.prototype = Object.create(Sprite.prototype);
Sprite_AutoConversationStatus.prototype.constructor = Sprite_AutoConversationStatus;

Sprite_AutoConversationStatus.prototype.initialize = function(messageWindow) {
    Sprite.prototype.initialize.call(this);
    this._messageWindow = messageWindow;
    // Load the icon bitmaps
    this._playEnabledBitmap = ImageManager.loadSystem(JR.Param.MACPlayEnabledButton);
    this._playDisabledBitmap = ImageManager.loadSystem(JR.Param.MACPlayDisabledButton);
    this._fastForwardEnabledBitmap = ImageManager.loadSystem(JR.Param.MACFastForwardEnabledButton);
    this._fastForwardDisabledBitmap = ImageManager.loadSystem(JR.Param.MACFastForwardDisabledButton);
    // Create sprites for the icons
    this._playSprite = new Sprite();
    this._fastForwardSprite = new Sprite();
    this.addChild(this._playSprite);
    this.addChild(this._fastForwardSprite);
    // Initialize breathing effect variables
    this._breathTimer = 0;
    this._breathCycle = JR.Param.MACBreathingTime * 60; // Convert seconds to frames (60 FPS)
    this.visible = false; // Hidden by default
    this.updatePositionAndIcons(messageWindow);
};

Sprite_AutoConversationStatus.prototype.update = function() {
    Sprite.prototype.update.call(this);
    // Update icon states, sizes, and breathing effect only if the plugin is enabled
    if (ConfigManager.autoConversationEnabled) {
        this.updateIconStates();
        this.updateBreathing();
    }
};

Sprite_AutoConversationStatus.prototype.updateIconStates = function() {
    // Update Play button state and size
    this._playSprite.bitmap = ConfigManager.autoConversationActive ? this._playEnabledBitmap : this._playDisabledBitmap;
    if (this._playSprite.bitmap) {
        this._playSprite.scale.x = JR.Param.MACPlayButtonWidth / this._playSprite.bitmap.width;
        this._playSprite.scale.y = JR.Param.MACPlayButtonHeight / this._playSprite.bitmap.height;
    }
    // Update Fast-Forward button state and size
    this._fastForwardSprite.bitmap = this._messageWindow._isFastForwarding ? this._fastForwardEnabledBitmap : this._fastForwardDisabledBitmap;
    if (this._fastForwardSprite.bitmap) {
        this._fastForwardSprite.scale.x = JR.Param.MACFastForwardButtonWidth / this._fastForwardSprite.bitmap.width;
        this._fastForwardSprite.scale.y = JR.Param.MACFastForwardButtonHeight / this._fastForwardSprite.bitmap.height;
    }
};

Sprite_AutoConversationStatus.prototype.updateBreathing = function() {
    if (!this.visible) return;
    this._breathTimer = (this._breathTimer + 1) % this._breathCycle;
    var t = (this._breathTimer / this._breathCycle) * Math.PI * 2; // One full cycle
    var amplitude = (JR.Param.MACMaxBreathingOpacity - JR.Param.MACMinBreathingOpacity) / 2;
    var offset = JR.Param.MACMinBreathingOpacity + amplitude;
    var newOpacity = Math.round(offset + amplitude * Math.sin(t));

    // Apply breathing effect only when the button is in the enabled state
    this._playSprite.opacity = ConfigManager.autoConversationActive ? newOpacity : 255;
    this._fastForwardSprite.opacity = this._messageWindow._isFastForwarding ? newOpacity : 255;
};

Sprite_AutoConversationStatus.prototype.updatePositionAndIcons = function(messageWindow) {
    // Check if the backlog window is open (from YEP_X_MessageBacklog)
    var isBacklogOpen = false;
    if (Imported.YEP_X_MessageBacklog && messageWindow._backlogWindow) {
        isBacklogOpen = messageWindow._backlogWindow.isOpenAndActive();
    }

    // Only show the icons if the plugin is enabled, the message window is open, and the backlog window is not open
    if (ConfigManager.autoConversationEnabled && messageWindow.isOpen() && !isBacklogOpen) {
        // Position the entire sprite at (0, 0) and let the individual offsets handle positioning
        this.x = 0;
        this.y = 0;

        // Check if the namebox exists and is visible
        var nameWindowVisible = messageWindow._nameWindow && messageWindow._nameWindow.visible && messageWindow._nameWindow.isOpen();
        if (nameWindowVisible) {
            // Anchor to the namebox
            var nameWindow = messageWindow._nameWindow;
            // Position the Play button relative to the namebox
            this._playSprite.x = nameWindow.x + nameWindow.width + JR.Param.MACPlayButtonXOffset;
            this._playSprite.y = nameWindow.y + JR.Param.MACPlayButtonYOffset;
        } else {
            // Check if the message box is at the bottom of the screen
            var messageBoxBottom = messageWindow.y + messageWindow.height;
            var isAtBottom = messageBoxBottom >= Graphics.boxHeight - 10; // Threshold of 10 pixels from the bottom

            // Position the Play button
            if (isAtBottom) {
                // Place above the message box, ensuring no overlap by accounting for button height
                this._playSprite.x = JR.Param.MACMessageBoxAboveXOffset;
                this._playSprite.y = messageWindow.y - JR.Param.MACPlayButtonHeight + JR.Param.MACMessageBoxAboveYOffset;
            } else {
                // Place below the message box
                this._playSprite.x = JR.Param.MACMessageBoxBelowXOffset;
                this._playSprite.y = messageBoxBottom + JR.Param.MACMessageBoxBelowYOffset;
            }
        }

        // Position the Fast-Forward button relative to the Play button
        this._fastForwardSprite.x = this._playSprite.x + JR.Param.MACPlayButtonWidth + JR.Param.MACFastForwardButtonXOffset;
        this._fastForwardSprite.y = this._playSprite.y + JR.Param.MACFastForwardButtonYOffset;

        // Ensure the icons don't go off-screen
        var playRightEdge = this._playSprite.x + JR.Param.MACPlayButtonWidth;
        if (playRightEdge > Graphics.boxWidth) {
            this._playSprite.x = Graphics.boxWidth - JR.Param.MACPlayButtonWidth;
        }
        if (this._playSprite.y < 0) {
            this._playSprite.y = 0;
        }

        var ffRightEdge = this._fastForwardSprite.x + JR.Param.MACFastForwardButtonWidth;
        if (ffRightEdge > Graphics.boxWidth) {
            this._fastForwardSprite.x = Graphics.boxWidth - JR.Param.MACFastForwardButtonWidth;
        }
        if (this._fastForwardSprite.y < 0) {
            this._fastForwardSprite.y = 0;
        }

        this.visible = true;
    } else {
        this.visible = false;
        this._playSprite.x = 0;
        this._playSprite.y = 0;
        this._fastForwardSprite.x = 0;
        this._fastForwardSprite.y = 0;
    }
};

//=============================================================================
// Game_Message
//=============================================================================

JR.MAC.Game_Message_clear = Game_Message.prototype.clear;
Game_Message.prototype.clear = function() {
    JR.MAC.Game_Message_clear.call(this);
    if (SceneManager._scene && SceneManager._scene._messageWindow) {
        SceneManager._scene._messageWindow._autoTimer = 0;
        SceneManager._scene._messageWindow._isFastForwarding = false;
    }
};

//=============================================================================
// End of File
//=============================================================================

} else {
    console.error('JR_MessageAutoConversation.js requires YEP_MessageCore.js to be installed and loaded.');
}