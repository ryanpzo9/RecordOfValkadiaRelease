//=============================================================================
// WindowMessageFade.js v1.0.1
//=============================================================================

//-----------------------------------------------------------------------------
// v1.0.1
//-----------------------------------------------------------------------------
// fixed bug preventing dim and transparent backgrounds from displaying
// properly. this bug was discovered by JamesRyan.

/*:
 * @plugindesc Performs fade processing in place of the message window's default open and close animations.
 * @author Derek Chestnut (dbchest)
 *
 * @help This plugin does not provide plugin commands.
 *
 * Recommended Fade Speeds:
 *   8   - 1/4 normal speed (very slow)
 *   16  - 1/2 normal speed (slow)
 *   32  - 1 * normal speed (normal)
 *   64  - 2 * normal speed (fast)
 *   128 - 4 * normal speed (very fast)
 *
 * @param Fade Speed
 * @desc The increment of opacity each frame.
 * Default: 32
 * @default 32
 *
 */

WindowMessageFade = {};
WindowMessageFade.Parameters = PluginManager.parameters('WindowMessageFade');

WindowMessageFade.FadeSpeed = Number(WindowMessageFade.Parameters["Fade Speed"]) || 32;

(function() {
    
    //-----------------------------------------------------------------------------
    // Window_Message
    //
    // The window for displaying text messages.
    
    Object.defineProperty(Window_Message.prototype, 'openness', {
        get: function() {
            return this._openness;
        },
        set: function(value) {
            if (this._openness !== value) {
                this._openness = value.clamp(0, 255);
                this.opacity = this._background === 0 ? this._openness : 0;
            }
        },
        configurable: true
    });
    
    Window_Message.prototype.updateOpen = function() {
        if (this._opening) {
            this.openness += WindowMessageFade.FadeSpeed;
            if (this.isOpen()) {
                this._opening = false;
            }
        }
    };
    
    Window_Message.prototype.updateClose = function() {
        if (this._closing) {
            this.openness -= WindowMessageFade.FadeSpeed;
            if (this.isClosed()) {
                this._closing = false;
            }
        }
    };
    
})();
