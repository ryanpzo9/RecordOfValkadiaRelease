/*:
 * @plugindesc (v1.2) [VISUAL] Attaches overlay sprites to events with animation, index, z-layer, and offset. [Ten_CharacterOverlay.js]
 * @author Tendev2d
 *
 * @target MV
 *
 * @param Sprites
 * @type struct<Sprite>[]
 * @desc Configuration for each overlay sprite (image, offset, z-layer).
 * @default []
 *
* @help
 * ============================================================================
 * ■ DESCRIPTION:
 * This plugin lets you attach character-like overlay sprites (e.g. hats, icons, effects)
 * to events. These overlays can be positioned, animated, and layered.
 * 
 * ============================================================================
 * ■ USAGE:
 *
 * ① COMMENT TAGS (on first page of event):
 *     characterSprites: NAME show
 *     characterSprites: NAME hide
 * → Automatically attaches overlay sprite named "NAME" (must be defined in plugin param).
 * 
 * ② SCRIPT CALLS (anywhere during runtime):
 *     $gameMap.event(ID).showOverlay("NAME")
 *     $gameMap.event(ID).hideOverlay("NAME")
 *     $gamePlayer.showOverlay("NAME")
 *     $gamePlayer.hideOverlay("NAME")
 * → Dynamically show/hide overlay by event ID.
 * → Use `this.character(0).showOverlay("NAME")` inside event for "This Event".
 * → Player now supported via $gamePlayer API.
 * 
 * ============================================================================
 * ■ PLUGIN PARAM – Each sprite config must include:
 * - name         : unique ID used in tags and script calls
 * - filename     : sprite sheet file from img/characters/
 * - characterIndex : (0–7) choose character from 8-set sheet
 * - offsetX / offsetY : pixel offset from event
 * - z-layer      : "above" or "below" the event
 * - animated     : true = 3-frame stepping animation
 *
 * ============================================================================
 * ■ NOTES:
 * - Image file must follow RPG Maker MV character sheet format.
 * - No plugin commands required.
 */
/*~struct~Sprite:
 * @param name
 * @desc Unique name used in comment tags (e.g., characterSprites: name show)
 *
 * @param filename
 * @type file
 * @dir img/characters/
 * @desc Character sprite file (with 8 characters per sheet)
 *
 * @param characterIndex
 * @type number
 * @min 0
 * @max 7
 * @default 0
 * @desc Index of character in spritesheet (0–7)
 *
 * @param layer
 * @type select
 * @option above
 * @option below
 * @default above
 * @desc Whether to render overlay above or below the event
 *
 * @param offsetX
 * @type text
 * @default 0
 * @desc Horizontal offset in pixels
 *
 * @param offsetY
 * @type text
 * @default 0
 * @desc Vertical offset in pixels
 *
 * @param animated
 * @type boolean
 * @default false
 * @desc Whether this overlay animates with 3-frame stepping
 */(()=>{
/*:
 * @plugindesc (v1.2) [VISUAL] Attaches overlay sprites to events with animation, index, z-layer, and offset. [Ten_CharacterOverlay.js]
 * @author Tendev2d
 *
 * @target MV
 *
 * @param Sprites
 * @type struct<Sprite>[]
 * @desc Configuration for each overlay sprite (image, offset, z-layer).
 * @default []
 *
* @help
 * ============================================================================
 * ■ DESCRIPTION:
 * This plugin lets you attach character-like overlay sprites (e.g. hats, icons, effects)
 * to events. These overlays can be positioned, animated, and layered.
 * 
 * ============================================================================
 * ■ USAGE:
 *
 * ① COMMENT TAGS (on first page of event):
 *     characterSprites: NAME show
 *     characterSprites: NAME hide
 * → Automatically attaches overlay sprite named "NAME" (must be defined in plugin param).
 * 
 * ② SCRIPT CALLS (anywhere during runtime):
 *     $gameMap.event(ID).showOverlay("NAME")
 *     $gameMap.event(ID).hideOverlay("NAME")
 *     $gamePlayer.showOverlay("NAME")
 *     $gamePlayer.hideOverlay("NAME")
 * → Dynamically show/hide overlay by event ID.
 * → Use `this.character(0).showOverlay("NAME")` inside event for "This Event".
 * → Player now supported via $gamePlayer API.
 * 
 * ============================================================================
 * ■ PLUGIN PARAM – Each sprite config must include:
 * - name         : unique ID used in tags and script calls
 * - filename     : sprite sheet file from img/characters/
 * - characterIndex : (0–7) choose character from 8-set sheet
 * - offsetX / offsetY : pixel offset from event
 * - z-layer      : "above" or "below" the event
 * - animated     : true = 3-frame stepping animation
 *
 * ============================================================================
 * ■ NOTES:
 * - Image file must follow RPG Maker MV character sheet format.
 * - No plugin commands required.
 */
/*~struct~Sprite:
 * @param name
 * @desc Unique name used in comment tags (e.g., characterSprites: name show)
 *
 * @param filename
 * @type file
 * @dir img/characters/
 * @desc Character sprite file (with 8 characters per sheet)
 *
 * @param characterIndex
 * @type number
 * @min 0
 * @max 7
 * @default 0
 * @desc Index of character in spritesheet (0–7)
 *
 * @param layer
 * @type select
 * @option above
 * @option below
 * @default above
 * @desc Whether to render overlay above or below the event
 *
 * @param offsetX
 * @type text
 * @default 0
 * @desc Horizontal offset in pixels
 *
 * @param offsetY
 * @type text
 * @default 0
 * @desc Vertical offset in pixels
 *
 * @param animated
 * @type boolean
 * @default false
 * @desc Whether this overlay animates with 3-frame stepping
 */
const t=PluginManager.parameters("Ten_CharacterOverlay"),e=JSON.parse(t.Sprites||"[]").map((t=>JSON.parse(t))),a={};e.forEach((t=>{a[t.name]={filename:t.filename,characterIndex:Number(t.characterIndex||0),layer:"below"===t.layer?"below":"above",offsetX:Number(t.offsetX||0),offsetY:Number(t.offsetY||0),animated:"true"===t.animated}})),Game_Event.prototype.setupOverlayStates=function(){this._overlayStates={};const t=this.event().pages[0];if(t&&t.list)for(const e of t.list)if(108===e.code||408===e.code){const t=e.parameters[0].match(/^characterSprites:\s*(\w+)\s+(show|hide)$/i);if(t){const[,e,a]=t;this._overlayStates[e]="show"===a}}};const i=Game_Event.prototype.initialize;Game_Event.prototype.initialize=function(t,e){i.call(this,t,e),this.setupOverlayStates()};const r=Spriteset_Map.prototype.createCharacters;Spriteset_Map.prototype.createCharacters=function(){r.call(this),this._characterSprites.forEach((t=>{const e=t._character;if(e&&e._overlayStates)for(const i in e._overlayStates){const r=e._overlayStates[i],s=a[i];if(r&&s){const a=new o(e,{...s,name:i});if(e._overlays||(e._overlays={}),"above"===s.layer)t.addChild(a);else{const e=t.parent||this._tilemap,i=Math.max(0,e.children.indexOf(t));e.addChildAt(a,i)}e._overlays[i]=a}}}))};const s=Game_Player.prototype.initialize;function o(t,e){this.initialize(t,e)}Game_Player.prototype.initialize=function(){s.call(this),this._overlayStates||(this._overlayStates={}),this._overlays||(this._overlays={})},o.prototype=Object.create(Sprite.prototype),o.prototype.constructor=o,o.prototype.initialize=function(t,e){Sprite.prototype.initialize.call(this),this._event=t,this._config=e,this.anchor.x=.5,this.anchor.y=1,this._framePattern=1,this._animationCount=0;const a=ImageManager.loadCharacter(e.filename);a.addLoadListener((()=>{this.bitmap=a,this._frameWidth=a.width/4,this._frameHeight=a.height/2,this._characterIndex=e.characterIndex,this.updateCharacterFrame()})),this.updatePosition()},o.prototype.update=function(){if(Sprite.prototype.update.call(this),this._event._erased)return this.parent&&this.parent.removeChild(this),void(this._event._overlays&&this._config&&this._config.name&&delete this._event._overlays[this._config.name]);this.updatePosition(),this.updateAnimation()},o.prototype.updatePosition=function(){if(this.parent instanceof Sprite_Character)this.x=this._config.offsetX,this.y=this._config.offsetY;else if(this.x=this._event.screenX()+this._config.offsetX,this.y=this._event.screenY()+this._config.offsetY,"function"==typeof this._event.screenZ){const t=this._event.screenZ();"below"===this._config.layer?this.z=t-.5:this.z=t+.5}},o.prototype.updateAnimation=function(){this._config.animated&&(this._animationCount++,this._animationCount>=15&&(this._framePattern=(this._framePattern+1)%3,this._animationCount=0,this.updateCharacterFrame()))},o.prototype.updateCharacterFrame=function(){if(!this.bitmap)return;const t=this._characterIndex%4,e=Math.floor(this._characterIndex/4),a=this.bitmap.width,i=this.bitmap.height,r=/^\$/.test(this._config.filename),s=a/(r?1:4),o=i/(r?1:2),n=s/3,h=o/4,c=t*s+this._framePattern*n,p=e*o+0*h;this.setFrame(c,p,n,h)},Game_CharacterBase.prototype.showOverlay=function(t){this._overlayStates||(this._overlayStates={}),this._overlayStates[t]=!0,this.refreshOverlaySprite(t)},Game_CharacterBase.prototype.hideOverlay=function(t){this._overlayStates||(this._overlayStates={}),this._overlayStates[t]=!1,this.refreshOverlaySprite(t)},Game_CharacterBase.prototype.refreshOverlaySprite=function(t){if(!SceneManager._scene||!SceneManager._scene._spriteset)return;const e=SceneManager._scene._spriteset,i=e._characterSprites.find((t=>t._character===this));if(!i)return;this._overlays||(this._overlays={});const r=this._overlays[t];r&&r.parent&&r.parent.removeChild(r),delete this._overlays[t];const s=a[t];if(!s||!this._overlayStates[t])return;const n=new o(this,{...s,name:t});if("above"===s.layer)i.addChild(n);else{const t=i.parent||e._tilemap,a=Math.max(0,t.children.indexOf(i));t.addChildAt(n,a)}this._overlays[t]=n}})();