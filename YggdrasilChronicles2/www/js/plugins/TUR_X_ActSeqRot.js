//=============================================================================
// Action Sequence Rotation
// TUR_X_ActSeqRot.js
//=============================================================================

window.Imported = window.Imported || {};
Imported.TUR_X_ActSeqRot = true;

window.TUR = window.TUR || {};
TUR.ActSeqRot = TUR.ActSeqRot || {};
TUR.ActSeqRot.version = 1.4;

/*:
 * @plugindesc Provides a rotate command for Yanfly's Action Sequences.
 * @author ATT_Turan
 * @url https://forums.rpgmakerweb.com/index.php?threads/action-sequence-rotation-extension.166579/
 * @version 1.4
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin provides a command for rotating battlers to users of Yanfly's
 * Action Sequences plugins. 
 *
 *=============================================================================
 *
 *=============================================================================
 * ROTATE target: args
 * ----------------------------------------------------------------------------
 * ROTATE target: degrees, (direction), (frames)
 * ----------------------------------------------------------------------------
 *
 * Degrees is an integer value representing how many clockwise degrees to 
 * rotate the sprite. Entering 0 from no rotation will do a circle.
 *
 * The direction argument can be RIGHT or LEFT, indicating a clockwise or
 * counterclockwise rotation. Omitting it defaults to clockwise (RIGHT).
 *
 * The frames argument is optional; omitting it will make the rotation
 * instantaneous.
 *
 * ============================================================================
 * Changelog
 * ============================================================================
 *
 * Version 1.4:
 * - Corrected placement of animations on battlers that are rotating and jumping
 *
 * Version 1.3:
 * - Fixed more facing and prevented users from breaking their sprites with bad
 *   timing.
 *
 * Version 1.2:
 * - Adjusted for facing commands
 *
 * Version 1.1:
 * - Corrected positioning issues
 *
 * Version 1.0:
 * - Release version
 *
 */
 
if (Imported.YEP_BattleEngineCore)
{
	TUR.processActionSequence = BattleManager.processActionSequence;
	BattleManager.processActionSequence = function(actionName, actionArgs)
	{
		if (actionName.match(/ROTATE[ ](.*)/i)) 
		{
			let string = String(RegExp.$1);
			if (this.makeActionTargets(string).length > 0) 
				return this.actionRotate(string, actionArgs);
		}
		return TUR.processActionSequence.call(this, actionName, actionArgs);
	};
	
	BattleManager.actionRotate = function(name, actionArgs)
	{
		let spinners = this.makeActionTargets(name);

		if (!spinners.length)
			return true;

		if (!spinners[0].battler()._mainSprite)
			return true;

		let degrees = Number(actionArgs[0]);

		if (isNaN(degrees) || degrees < 0)
			return true;

		let frames = 0;
		
		if (actionArgs[1] && isNaN(actionArgs[1]))
		{
			if (actionArgs[1].toUpperCase() == "LEFT")
				spinners.forEach(spinner => spinner.battler()._mainSprite.rotateDir = "left");
			else if (actionArgs[1].toUpperCase() == "RIGHT")
				spinners.forEach(spinner => spinner.battler()._mainSprite.rotateDir = "right");
			else
				return true;
			
			frames = Number(actionArgs[2]) || 0;
		}
		else
		{
			spinners.forEach(spinner => spinner.battler()._mainSprite.rotateDir = "right");
			frames = Number(actionArgs[1]) || 0;
		}

		if (!frames)
			spinners.forEach(spinner => spinner.battler()._mainSprite.rotation = degrees * (Math.PI / 180));
		else
			spinners.forEach(spinner => {let sprite = spinner.battler()._mainSprite; 
				if (sprite.rotateTo == undefined)
				{
					sprite.rotateTo = degrees; 
					sprite.rotateFrames = frames; 
					sprite.oldPivot = sprite.pivot.y; 
					sprite.pivot.y = -sprite.height / 2; 
					sprite.y += sprite.pivot.y
				}});
		
		return true;
	};
	
	TUR.updateBattlerPosition = Sprite_Animation.prototype.updateBattlerPosition;
	Sprite_Animation.prototype.updateBattlerPosition = function() 
	{
		TUR.updateBattlerPosition.call(this);
		if (this._target.parent instanceof Sprite_Battler && this._target.parent._mainSprite 
			&& this._target.parent._mainSprite.bitmap && this._target.parent._mainSprite.rotateTo != undefined)
			this.y -= this._target.parent._mainSprite.y - this._target.parent.bitmap.height;
	};
	
	Sprite_Base.prototype._refresh = function() 
	{
		var frameX = Math.floor(this._frame.x);
		var frameY = Math.floor(this._frame.y);
		var frameW = Math.floor(this._frame.width);
		var frameH = Math.floor(this._frame.height);
		var bitmapW = this._bitmap ? this._bitmap.width : 0;
		var bitmapH = this._bitmap ? this._bitmap.height : 0;
		var realX = frameX.clamp(0, bitmapW);
		var realY = frameY.clamp(0, bitmapH);
		var realW = (frameW - realX + frameX).clamp(0, bitmapW - realX);
		var realH = (frameH - realY + frameY).clamp(0, bitmapH - realY);

		this._realFrame.x = realX;
		this._realFrame.y = realY;
		this._realFrame.width = realW;
		this._realFrame.height = realH;
		this.pivot.x = frameX - realX;
		if (this.rotateTo == undefined)
			this.pivot.y = frameY - realY;

		if (realW > 0 && realH > 0) 
		{
			if (this._needsTint()) 
			{
				this._createTinter(realW, realH);
				this._executeTint(realX, realY, realW, realH);
				this._tintTexture.update();
				this.texture.baseTexture = this._tintTexture;
				this.texture.frame = new Rectangle(0, 0, realW, realH);
			}
			else
			{
				if (this._bitmap)
					this.texture.baseTexture = this._bitmap.baseTexture;
				this.texture.frame = this._realFrame;
			}
		}
		else if (this._bitmap) 
			this.texture.frame = Rectangle.emptyRectangle;
		else 
		{
			this.texture.baseTexture.width = Math.max(this.texture.baseTexture.width, this._frame.x + this._frame.width);
			this.texture.baseTexture.height = Math.max(this.texture.baseTexture.height, this._frame.y + this._frame.height);
			this.texture.frame = this._frame;
		}
		this.texture._updateID++;
	};
	
	Sprite_Battler.prototype.updateFloat = function() 
	{
		if (!this._battler) return;
		if (this._floatDur > 0) this._floatDur--;
		if (this._jumpDur > 0) this._jumpDur--;
		var baseY = this._battler.anchorY();
		var floatHeight = this.getFloatHeight();
		var jumpHeight = this.getJumpHeight();
		var height = floatHeight + jumpHeight;
		if (this._mainSprite && this._mainSprite.bitmap)
		{
			var rate = this._battler.spriteHeight() / this._mainSprite.height;
			this._mainSprite.anchor.y = (baseY + height * rate);
			if (this._mainSprite.rotateTo != undefined)
			{
				let oldPivot = this._mainSprite.pivot.y;
				this._mainSprite.pivot.y = (0.5 - this._mainSprite.anchor.y) * this._mainSprite.height; 
				this._mainSprite.y += this._mainSprite.pivot.y - oldPivot;
			}
		this._weaponSprite.anchor.y = this._mainSprite.anchor.y;
		}
		else
			this.anchor.y = (baseY + height);
	};
	
	TUR.updateMove = Sprite_Battler.prototype.updateMove;
	Sprite_Battler.prototype.updateMove = function()
	{
		TUR.updateMove.call(this);

		if (this._mainSprite && this._mainSprite.rotateTo != undefined)
		{
			let sprite = this._mainSprite;
			sprite.rotateFrames--;
			
			if (sprite.rotateFrames <= 0)
			{
				sprite.rotation = sprite.rotateTo * (Math.PI / 180);

				sprite.y -= sprite.pivot.y;
				sprite.pivot.y = sprite.oldPivot;
				delete sprite.oldPivot;
				delete sprite.rotateTo;
				delete sprite.rotateFrames;
			}
			else
			{
				let toDegrees = sprite.rotateTo;
				let currDegrees = sprite.rotation * (180 / Math.PI);
				if (sprite.rotateDir == "right" && this.scale.x >= 0 || sprite.rotateDir == "left" && this.scale.x < 0)
				{
					let degrees = toDegrees > currDegrees ? toDegrees - currDegrees : 360 + toDegrees - currDegrees;
					degrees = Math.round(degrees / sprite.rotateFrames);
					sprite.rotation += degrees * (Math.PI / 180);
				}
				else
				{
					let degrees = currDegrees > toDegrees ? currDegrees - toDegrees : 360 + toDegrees - currDegrees;
					degrees = Math.round(degrees / sprite.rotateFrames);
					sprite.rotation = ((currDegrees > 0 ? currDegrees : 360) - degrees) * (Math.PI / 180);
				}
			}
		}
		else if (this._mainSprite && this._mainSprite.oldPivot != undefined)
		{
			this._mainSprite.y -= this._mainSprite.pivot.y;
			this._mainSprite.pivot.y = this._mainSprite.oldPivot;
			delete this._mainSprite.oldPivot;
		}
	};
	
	TUR.isMoving = Sprite_Battler.prototype.isMoving;
	Sprite_Battler.prototype.isMoving = function()
	{
		if (!TUR.isMoving.call(this))
			return !!this._mainSprite && this._mainSprite.oldPivot != undefined;
		else
			return true;
	};
}