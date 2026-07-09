//=============================================================================
// MOG_TitlePictureCom.js
//=============================================================================

/*:
 * @plugindesc (v1.6) Replaces the title window with picture commands.
 * @author Moghunter
 *
 * @param Title Sprite
 * @desc Enable the title name as a sprite.
 * Requires the file Title.png in the folder img/titles2/
 * @default true
 * * @param Title Sprite X-Axis
 * @desc X-axis position of the title text/sprite.
 * @default 0
 *
 * @param Title Sprite Y-Axis
 * @desc Y-axis position of the title text/sprite.
 * @default 0 
 * * @param Cursor Visible
 * @desc Enable cursor visibility.
 * @default true
 *
 * @param Cursor Wave Animation
 * @desc Enable the sliding wave animation for the cursor.
 * @default true
 * * @param Cursor X-Axis
 * @desc X-axis offset for the cursor.
 * @default 8
 *
 * @param Cursor Y-Axis
 * @desc Y-axis offset for the cursor.
 * @default -10  
 *
 * @param Command Pos 1
 * @desc Position of command 1 (New Game).
 * E.g -     32,32
 * @default 650,460
 *
 * @param Command Pos 2
 * @desc Position of command 2 (Continue).
 * E.g -     32,32
 * @default 660,490
 *
 * @param Command Pos 3
 * @desc Position of command 3 (Options).
 * E.g -     32,32
 * @default 665,520
 *
 * @param Command Pos 4
 * @desc Position of command 4.
 * E.g -     32,32
 * @default 670,550
 *
 * @param Command Pos 5
 * @desc Position of command 5.
 * E.g -     32,32
 * @default 345,498  
 *
 * @param Command Pos 6
 * @desc Position of command 6.
 * E.g -     32,32
 * @default 345,530
 *
 * @param Command Pos 7
 * @desc Position of command 7.
 * E.g -     32,32
 * @default 0,192
 *
 * @param Command Pos 8
 * @desc Position of command 8.
 * E.g -     32,32
 * @default 0,224
 *
 * @param Command Pos 9
 * @desc Position of command 9.
 * E.g -     32,32
 * @default 0,256
 *
 * @param Command Pos 10
 * @desc Position of command 10.
 * E.g -     32,32
 * @default 0,288  
 *
 * @help  
 * =============================================================================
 * +++ MOG - Title Picture Commands (v1.6) +++
 * By Moghunter 
 * https://atelierrgss.wordpress.com/
 * =============================================================================
 * Replaces the default window commands with picture commands.
 * The following files are required:
 *
 * Command_0.png, Command_1.png, Command_2.png , Command_3.png ... 
 *
 * Save the images in the folder:
 *
 * img/titles2/
 * ============================================================================= 
 * An image representing the cursor is also required:
 *
 * Cursor.png
 *
 * =============================================================================
 * ** History **
 * =============================================================================
 * v1.6 - Added cursor sound effect when using Mouse Scroll.
 * v1.5 - Added Mouse Scroll (Wheel) support.
 * v1.4 - Code improvements.  
 * v1.3 - Added Cursor. 
 * v1.2 - Ability to define positions for multiple commands.
 * - Fixed lag when switching commands.
 * v1.1 - Fixed glitch allowing clicks on commands during fade.
 *
 */

//=============================================================================
// ** PLUGIN PARAMETERS
//=============================================================================
　　var Imported = Imported || {};
　　Imported.MOG_Picture_Command = true;
　　var Moghunter = Moghunter || {}; 

  　Moghunter.parameters = PluginManager.parameters('MOG_TitlePictureCom');
	Moghunter.title_sprite = (Moghunter.parameters['Title Sprite'] || false);
	Moghunter.title_x = Number(Moghunter.parameters['Title Sprite X-Axis'] || 0);
	Moghunter.title_y = Number(Moghunter.parameters['Title Sprite Y-Axis'] || 0);
	Moghunter.title_cursorVisible = String(Moghunter.parameters['Cursor Visible'] || "true");
	Moghunter.title_cursorSlide = String(Moghunter.parameters['Cursor Wave Animation'] || "true");
	Moghunter.title_cursorX = Number(Moghunter.parameters['Cursor X-Axis'] || 8);
	Moghunter.title_cursorY = Number(Moghunter.parameters['Cursor Y-Axis'] || -10);	
	Moghunter.title_com_pos = [];
	for (var i = 0; i < 10; i++) {
		Moghunter.title_com_pos[i] = (Moghunter.parameters['Command Pos ' + String(i + 1)] || null);
	};	
	
//=============================================================================
// ** Window_TitleCommand
//=============================================================================	

//==============================
// * updatePlacement
//==============================
var _alias_mog_title_picture_commands_updatePlacement = Scene_Title.prototype.updatePlacement;
Window_TitleCommand.prototype.updatePlacement = function() {
   this.x = -Graphics.boxWidth;
   this.y = -Graphics.boxheight;
   this.visible = false;
};

//=============================================================================
// ** Scene Title
//=============================================================================	

//==============================
// * Create
//==============================
var _alias_mog_title_picture_commands_create = Scene_Title.prototype.create;
Scene_Title.prototype.create = function() {
    _alias_mog_title_picture_commands_create.call(this);
    this.create_picture_commands();
	if (String(Moghunter.title_cursorVisible) === "true") {this.createCursorCommand()};
	this._comSave = this._commandWindow.isContinueEnabled();
};

//==============================
// * set tcp
//==============================
Scene_Title.prototype.set_tcp = function(value) {
	if (!value) {return null};
	var s = value.split(',');
	if (!s[0] || !s[1]) {return null};
	return  [Number(s[0]),Number(s[1])];
};

//==============================
// * Update
//==============================
var _alias_mog_title_picture_commands_update = Scene_Title.prototype.update;
Scene_Title.prototype.update = function() {
    _alias_mog_title_picture_commands_update.call(this);
	this.update_picture_commands();
};

//==============================
// * Create Cursor Command
//==============================
Scene_Title.prototype.createCursorCommand = function() {
	this._cursorSlide = [0,0,0,false];
	if (String(Moghunter.title_cursorSlide) === "true") {this._cursorSlide[3] = true};
    this._cursor = new Sprite(ImageManager.loadTitle2("Cursor"));
	this._cursor.anchor.x = 0.5;
	this._cursor.anchor.y = 0.5;
	this._cursor.opacity = 0;
	this.addChild(this._cursor);
};

//==============================
// * Com Sprite
//==============================
Scene_Title.prototype.comSprite = function() {
    return this._com_sprites[this._commandWindow._index];
};

//==============================
// * update Cursor
//==============================
Scene_Title.prototype.updateCursor = function() {
	 if (this._cursorSlide[3]) {this.updateCursorSlide()};
   	 this._cursor.opacity += 10;
 	 var nx = this.comSprite().x - (this._cursor.width / 2) + Moghunter.title_cursorX + this._cursorSlide[0];
	 var ny = this.comSprite().y + (this._cursor.height / 2) + Moghunter.title_cursorY;
     this._cursor.x = this.cursorMoveto(this._cursor.x, nx, 20);
	 this._cursor.y = this.cursorMoveto(this._cursor.y, ny, 20);
};

//==============================
// * update Cursor Slide
//==============================
Scene_Title.prototype.updateCursorSlide = function() {
     this._cursorSlide[1] ++
	 if (this._cursorSlide[1] < 3) {return};
	 this._cursorSlide[1] = 0
	 this._cursorSlide[2] ++
	 if (this._cursorSlide[2] < 15) {
		 this._cursorSlide[0] ++;
	 } else if (this._cursorSlide[2] < 30) {
		 this._cursorSlide[0] --;
	 } else {
		 this._cursorSlide[0] = 0;
		 this._cursorSlide[2] = 0;
	 };
};

//==============================
// * Sprite Move To
//==============================
Scene_Title.prototype.cursorMoveto = function(value,real_value,speed) {
	if (value == real_value) {return value};
	var dnspeed = 5 + (Math.abs(value - real_value) / speed);
	if (value > real_value) {value -= dnspeed;
	    if (value < real_value) {value = real_value};}
    else if (value < real_value) {value  += dnspeed;
    	if (value  > real_value) {value  = real_value};		
    };
	return Math.floor(value);
};

//==============================
// * Create Picture Commands
//==============================
Scene_Title.prototype.create_picture_commands = function() {
	this._com_position = [];
	for (var i = 0; i < 10; i++) {
	    this._com_position[i] = this.set_tcp(Moghunter.title_com_pos[i]);
    };	
	var _com_index_old = -2;
	this._csel = false;
	this._com_pictures = [];
	this._com_sprites = [];	
	this._com_pictures_data = [];
	for (i = 0; i < this._commandWindow._list.length; i++){
        // Check for IAVRA translation plugin support (optional safety check)
        if (typeof IAVRA !== 'undefined' && IAVRA.I18N.language === 'vi'){
            this._com_pictures.push(ImageManager.loadTitle2("CommandVi_" + i));
        } else {
            this._com_pictures.push(ImageManager.loadTitle2("Command_" + i));
        }
		this._com_sprites.push(new Sprite(this._com_pictures[i]));
	    this.addChild(this._com_sprites[i]);	
	};
};

//==============================
// * Refresh Picture Command
//==============================
Scene_Title.prototype.refresh_picture_command = function() {
	this._com_index_old = this._commandWindow._index;
	for (i = 0; i < this._com_sprites.length; i++){
		if (this._commandWindow._index != i) {
        var ch = this._com_pictures[i].height / 2;
		}
		else {
		var ch = 0;
      	}
		this.cpsx = [this._com_position[i][0],this._com_position[i][1]];
		if (this._commandWindow._list[i].symbol === 'continue' && !this._comSave) {this._com_sprites[i].opacity = 160};
		this._com_sprites[i].setFrame(0, ch, this._com_pictures[i].width, this._com_pictures[i].height / 2);
		this._com_sprites[i].x = this.cpsx[0];
		this._com_sprites[i].y = this.cpsx[1];
		this._com_pictures_data[i] = [this._com_sprites[i].x,this._com_pictures[i].width ,this._com_sprites[i].y,this._com_pictures[i].height / 2 ];
	}; 
};
  
//==============================
// * Update Picture Commands
//==============================
Scene_Title.prototype.update_picture_commands = function() {
	if (this._com_index_old != this._commandWindow._index) { this.refresh_picture_command()};
	
    // --- Mouse Wheel Support + Sound ---
    if (TouchInput.wheelY !== 0 && !this._csel) {
        var lastIndex = this._commandWindow.index(); // Capture index before moving
        
        if (TouchInput.wheelY > 0) {
            this._commandWindow.cursorDown();
        } else {
            this._commandWindow.cursorUp();
        }
        
        // If index actually changed, play sound
        if (this._commandWindow.index() !== lastIndex) {
            SoundManager.playCursor();
        }
    }
    // -----------------------------------

	if (TouchInput.isTriggered()) {
		for (i = 0; i < this._com_sprites.length; i++){
			if (this.on_picture_com(i) && !this._csel ) {				
				this._commandWindow._index = i;	 this._commandWindow.processOk();
	            if (this._commandWindow.isCommandEnabled(i)) {this._csel = true};
		   };		
		};
	};
	if (this._cursor) {this.updateCursor()};
};

//==============================
// * On Picture Com
//==============================
Scene_Title.prototype.on_picture_com = function(index) {
	 if (TouchInput.x < this._com_pictures_data[index][0]) { return false};
	 if (TouchInput.x > this._com_pictures_data[index][0] + this._com_pictures_data[index][1]) { return false};
	 if (TouchInput.y < this._com_pictures_data[index][2]) { return false};
	 if (TouchInput.y > this._com_pictures_data[index][2] + this._com_pictures_data[index][3]) { return false};
	 return true;	 
};

//==============================
// * Create Foreground
//==============================
var _mog_titlecom_createForeground = Scene_Title.prototype.createForeground;
Scene_Title.prototype.createForeground = function() {
	_mog_titlecom_createForeground.call(this);
	if (String(Moghunter.title_sprite) === "true") {this.createTitleSprite();}
};

//==============================
// * Create Title Sprite
//==============================
Scene_Title.prototype.createTitleSprite = function() {
	if (this._gameTitleSprite) {this.removeChild(this._gameTitleSprite)};
    this._gameTitleSprite = new Sprite(ImageManager.loadTitle2("Title"));
    this.addChild(this._gameTitleSprite);
	this._gameTitleSprite.x = Moghunter.title_x;
	this._gameTitleSprite.y = Moghunter.title_y;
};