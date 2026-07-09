//=============================================================================
// SurpS_CtbSpeedIcons.js
//=============================================================================

/*:
 * @plugindesc v1.0 (Requires YEP_X_BattleSysCTB.js)
 * Adds a speed indicator to the character icons.
 * @author Surprising Sandwich (Michael Mitchell)
 *
 * @help This plugin does not provide plugin commands. 
 * Tested with YEP_X_BattleSysCTB.js v1.14a.
 * 
 * Character icons "fill up" as they become ready for a turn. 
 * Intended to be used with skills that depend on the current speed level. 
 * (For example an interrupt that reduces readiness to 0%, 
 * but only works if the enemy is at > 75% readiness).
 * 
 * Free for both commercial and non-commercial use.
 */

Window_CTBIcon.prototype.updateOverlay = function() {
    if (!this.offscreenBaseBitmap || this.offscreenBaseBitmap.width <= 0) return;
	// Return early if nothing has changed
	if (this._speed && this._speed === this._battler._ctbSpeed) return;
	this._speed = this._battler._ctbSpeed;
	// Replace contents (offscreenBaseBitmap + overlay) with just offscreenBaseBitmap (as we need to redo the overlay)
	this.contents.blt(this.offscreenBaseBitmap, 0, 0, this.contents.width, this.contents.height, 0, 0, this.contents.width, this.contents.height);
	var overlay = this.contents;
	var height = overlay.height - 8;
	var width = overlay.width - 8;
	var speedRatio = this._battler._ctbSpeed > BattleManager.ctbTarget() ? 1 : this._battler._ctbSpeed / BattleManager.ctbTarget();
	var speedHeight = Math.floor(speedRatio * height);
	// Draw solid yellow meter on the left side of the icon
	overlay.fillRect(4, 4 + (height - speedHeight), 2, speedHeight, "rgb(255, 255, 0)");
	// Show a dark overlay over the rest of the icon
	overlay.fillRect(4, 4, width, height - speedHeight, "rgba(0, 0, 0, 0.25)");
}

// Overriding redrawLetter because redrawLetter is called at end of updateRedraw
// (so this new function can take advantage of all of updateRedraw's early-return functionality).
SurprisingSandwich_Window_CTBIcon_redrawLetter =
    Window_CTBIcon.prototype.redrawLetter;
Window_CTBIcon.prototype.redrawLetter = function() {
	SurprisingSandwich_Window_CTBIcon_redrawLetter.call(this);
	// offscreenBaseBitmap only updates during a redraw
	if (!this.offscreenBaseBitmap) this.offscreenBaseBitmap = new Bitmap(this.contents.width, this.contents.height);
	this.offscreenBaseBitmap.clear();
	this.offscreenBaseBitmap.blt(this.contents, 0, 0, this.contents.width, this.contents.height, 0, 0, this.contents.width, this.contents.height);
};

SurprisingSandwich_Window_CTBIcon_updateRedraw =
    Window_CTBIcon.prototype.updateRedraw;
Window_CTBIcon.prototype.updateRedraw = function() {
	SurprisingSandwich_Window_CTBIcon_updateRedraw.call(this);
	this.updateOverlay();
}

SurprisingSandwich_Window_CTBIcon_removeCTBIcon =
    Window_CTBIcon.prototype.updateRedraw;
Window_CTBIcon.prototype.removeCTBIcon = function() {
	SurprisingSandwich_Window_CTBIcon_removeCTBIcon.call(this);
	this.offscreenBaseBitmap.clear();
	this.offscreenBaseBitmap = null;
};

