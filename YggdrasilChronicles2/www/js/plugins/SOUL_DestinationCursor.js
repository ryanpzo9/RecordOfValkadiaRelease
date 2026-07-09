'use strict';

// ------------------------------------------------------------------------------------
// SOUL_DestinationCursor.js
// ------------------------------------------------------------------------------------
/*:
* @plugindesc Changes your white blinking cursor into an image during mouse movement.
* @author Soulpour777 - soulxregalia.wordpress.com
* 
*
* @param Blending Style
* @desc (0 - Normal, 1 - Additive, 2 - Multiply, 3 - Screen) Default: 0
* @default 0
*
* @param Cursor Image
* @desc Image name of the cursor sprite you are using. (img / system)
* @default destination_cursor
*
* @param Cursor Width
* @desc Width of the cursor.
* @default 48
*
* @param Cursor Height
* @desc Height of the cursor.
* @default 48
*
* @param Blink Speed
* @desc Speed of the blinking behavior for the cursor.
* @default 20
*
* @param Fade Effect
* @desc Do you want to use the fade in / fade out effect in the cursor when active?
* @default false
*
* @param Fade Speed
* @desc Speed of the fade behavior for the cursor.
* @default 20
*
* @param Scale Value
* @desc Scale value of the cursor when it appears. (1 + this._frameCount / Scale Value).
* @default 20
*
* @param Rotation Speed
* @desc The rotation speed of the cursor when used. (pos - clockwise / neg - counterclockwise)
* @default 0.3
*

@help

SOUL_DestinationCursor.js
By: Soul - soulxregalia.wordpress.com

This plugin is currently updated in terms of ES2015 code.

This plugin does not have any Plugin Commands.

All images must be inside img / system / cursors folder.

Latest Update Date: 1 / 17 / 2017

Note:

With the newest addition of the plugin's feature comes the 'Rotate' function.
Not only can you change the cursors in your game but you can also control the
entirety of it's animation, even its rotation and blending.

Thank you for your constant support.

Please considering supporting me on Patreon:
https://www.patreon.com/Soulpour777

*/

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

ImageManager.loadDestCurs = function (filename, hue) {
	return this.loadBitmap('img/system/cursors/', filename, hue, true);
};

var Imported = Imported || {};
Imported.SOUL_DestinationCursor = true;

var Soul = Soul || {};
Soul.DestinationCursor = Soul.DestinationCursor || {};

Soul.DestinationCursor.params = PluginManager.parameters('SOUL_DestinationCursor');

function destCursor(param) {
	if (param === 'Blending Style') return Number(Soul.DestinationCursor.params['Blending Style']);
	if (param === 'Cursor Image') return String(Soul.DestinationCursor.params['Cursor Image']);
	if (param === 'Cursor Width') return eval(Soul.DestinationCursor.params['Cursor Width']);
	if (param === 'Cursor Height') return eval(Soul.DestinationCursor.params['Cursor Height']);
	if (param === 'Blink Speed') return Number(Soul.DestinationCursor.params['Blink Speed']);
	if (param === 'Scale Value') return Number(Soul.DestinationCursor.params['Scale Value']);
	if (param === 'Fade Speed') return Number(Soul.DestinationCursor.params['Fade Speed']);
	if (param === 'Fade Effect') return eval(Soul.DestinationCursor.params['Fade Effect']);
	if (param === 'Rotation Speed') return eval(Soul.DestinationCursor.params['Rotation Speed']);
}

(function () {

	Spriteset_Map.prototype.createDestination = function () {
		this._destinationSprite = new Sprite_DestinationES6();
		this._destinationSprite.z = 9;
		this._tilemap.addChild(this._destinationSprite);
	};
})();

var Sprite_DestinationES6 = function (_Sprite) {
	_inherits(Sprite_DestinationES6, _Sprite);

	function Sprite_DestinationES6() {
		_classCallCheck(this, Sprite_DestinationES6);

		return _possibleConstructorReturn(this, (Sprite_DestinationES6.__proto__ || Object.getPrototypeOf(Sprite_DestinationES6)).call(this));
	}

	_createClass(Sprite_DestinationES6, [{
		key: 'initialize',
		value: function initialize() {
			Sprite.prototype.initialize.call(this);
			this.createBitmap();
			this._frameCount = 0;
		}
	}, {
		key: 'update',
		value: function update() {
			Sprite.prototype.update.call(this);
			if ($gameTemp.isDestinationValid()) {
				this.updatePosition();
				this.updateAnimation();
				this.visible = true;
			} else {
				this._frameCount = 0;
				this.visible = false;
			}
		}
	}, {
		key: 'createBitmap',
		value: function createBitmap() {
			var tileWidth = destCursor('Cursor Width');
			var tileHeight = destCursor('Cursor Height');
			this.bitmap = new Bitmap(tileWidth, tileHeight);
			this.bitmap = ImageManager.loadDestCurs(destCursor('Cursor Image'));
			this.anchor.x = 0.5;
			this.anchor.y = 0.5;
			switch(destCursor('Blending Style')) {
				case 0:
					this.blendMode = Graphics.BLEND_NORMAL;
					break;
				case 1:
					this.blendMode = Graphics.BLEND_ADD;
					break;
				case 2:
					this.blendMode = Graphics.BLEND_MULTIPLY;
					break;
				case 3:
					this.blendMode = Graphics.BLEND_SCREEN;
			}
			
		}
	}, {
		key: 'updatePosition',
		value: function updatePosition() {
			var tileWidth = $gameMap.tileWidth();
			var tileHeight = $gameMap.tileHeight();
			var x = $gameTemp.destinationX();
			var y = $gameTemp.destinationY();
			this.x = ($gameMap.adjustX(x) + 0.5) * tileWidth;
			this.y = ($gameMap.adjustY(y) + 0.5) * tileHeight;
			this.rotation += destCursor('Rotation Speed');
		}
	}, {
		key: 'updateAnimation',
		value: function updateAnimation() {
			this._frameCount++;
			this._frameCount %= destCursor('Blink Speed');
			if (destCursor('Fade Effect')) {
				this.opacity = (destCursor('Fade Speed') - this._frameCount) * 6;
			}
			this.scale.x = 1 + this._frameCount / destCursor('Scale Value');
			this.scale.y = this.scale.x;
		}
	}]);

	return Sprite_DestinationES6;
}(Sprite);