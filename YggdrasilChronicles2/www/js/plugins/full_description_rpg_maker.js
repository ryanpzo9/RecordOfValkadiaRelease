//=============================================================================
// FullDescription.js
//=============================================================================

/*:
@author Icaro10100 / FrozenPhoenix
@plugindesc Press shift in the Item or Skill window to see the full description
@help

*********************************************************************************

This script will let you add a full description to items and skills.

Press shift to open/close the full description window.

Use the tag <fdesc:> in the item/skill notebox to do so. Use \n to jump a line. 
You can use the same codes you can in the message window: 
\c[1]Text is written in color 1\c[0]

The description window will not show if the item/skill doesn't have the
<fdesc:> tag

To call the full description scene outside the item/skill menu use:
SceneManager.sceneFullDesc(item);
Example: SceneManager.sceneFullDesc($dataItems[1]);

Free to use for both free and paid games, just give credit.


Changelog:

-1.1
	Fixed a bug when openning the full description when the actor selection
	for item window was also open.
*********************************************************************************


*/



(function() {
	
//Parameters	
var parameters = PluginManager.parameters('FullDescription');
var defaultMessage = " ";

//******************************************************************
//
// Full Desc window will display the full description
//
//******************************************************************

function Window_FullDesc() {
    this.initialize.apply(this, arguments);
}

Window_FullDesc.prototype = Object.create(Window_Help.prototype);
Window_FullDesc.prototype.constructor = Window_FullDesc;


Window_FullDesc.prototype.initialize = function(y, height) {
	var width = Graphics.boxWidth;
	Window_Base.prototype.initialize.call(this, 0, y, width, height);
    this._text = '';
}


Window_FullDesc.prototype.setItem = function(item) {
	if (!item) {
		this.setText('');
		return;
	}
	var fulldesc = item.meta.fdesc;
	fulldesc = fulldesc ? fulldesc : defaultMessage;
    this.setText(fulldesc);
};



//******************************************************************
//
// Window Invisible, just to use handlers
//
//******************************************************************

function Window_Invisible() {
    this.initialize.apply(this, arguments);
}

Window_Invisible.prototype = Object.create(Window_Selectable.prototype);
Window_Invisible.prototype.constructor = Window_Invisible;

Window_Invisible.prototype.initialize = function() {
	Window_Selectable.prototype.initialize.call(this, 0, 0, 0, 0);
}

Window_Invisible.prototype.isCancelEnabled = function() {
    return this.isHandled('cancel') || this.isHandled('shift');
};

Window_Invisible.prototype.isCancelTriggered = function() {
    return Input.isRepeated('cancel') || Input.isRepeated('shift');
};




//******************************************************************
//
// Scene FullDesc
//
//******************************************************************


function Scene_FullDesc() {
    this.initialize.apply(this, arguments);
}

Scene_FullDesc.prototype = Object.create(Scene_MenuBase.prototype);
Scene_FullDesc.prototype.constructor = Scene_FullDesc;

Scene_FullDesc.prototype.initialize = function(item) {
	this._item = item;
    Scene_MenuBase.prototype.initialize.call(this);
};


Scene_FullDesc.prototype.create = function() {
	this.createBackground();
	this.createWindowLayer();
    this.createHelpWindow(this._item);
	this.createDescWindow(this._item);
	this.createInviWindow();
};

Scene_FullDesc.prototype.createInviWindow = function() {
	this._inviWindow = new Window_Invisible();
	this._inviWindow.setHandler('cancel', this.popScene.bind(this));
	this._inviWindow.setHandler('shift', this.popScene.bind(this));
	this._inviWindow.activate();
	this.addWindow(this._inviWindow);
}

Scene_FullDesc.prototype.start = function() {
    Scene_MenuBase.prototype.start.call(this);
};

Scene_FullDesc.prototype.createHelpWindow = function(item) {
	this._helpWindow = new Window_Help();
    this.addWindow(this._helpWindow);
	this._helpWindow.setItem(item);
}

Scene_FullDesc.prototype.createDescWindow = function(item) {
	this._descWindow = new Window_FullDesc(this._helpWindow.height, Graphics.boxHeight - this._helpWindow.height);
	this._descWindow.setItem(item);
	this.addWindow(this._descWindow);
}


//******************************************************************
//
// Changes Window_SkillList & Window_ItemList
//
//******************************************************************

Window_ItemList.prototype.update = function() {
	Window_Selectable.prototype.update.call(this);
	this.processShift();
}

Window_ItemList.prototype.processShift = function() {
	if (this.isHandled('shift') && Input.isTriggered('shift')) {
		this.callHandler('shift');
	}
}

Window_SkillList.prototype.update = function() {
	Window_Selectable.prototype.update.call(this);
	this.processShift();
}

Window_SkillList.prototype.processShift = function() {
	if (this.isHandled('shift') && Input.isTriggered('shift')) {
		this.callHandler('shift');
	}
}

//******************************************************************
//
// Changes to Scene_ItemBase
//
//******************************************************************


_SceneItemBaseCreate = Scene_ItemBase.prototype.create;
Scene_ItemBase.prototype.create = function() {
    _SceneItemBaseCreate.call(this);
	this.createInviWindow();
	this.createDescWindow();
};

Scene_ItemBase.prototype.createInviWindow = function() {
	this._inviWindow = new Window_Invisible();
	this._inviWindow.setHandler('cancel', this.hideFullDesc.bind(this));
	this._inviWindow.setHandler('shift', this.hideFullDesc.bind(this));
	this.addWindow(this._inviWindow);
	this._inviWindow.hide();
}

Scene_ItemBase.prototype.createDescWindow = function() {
	this._descWindow = new Window_FullDesc(this._inviWindow.fittingHeight(2), Graphics.boxHeight - this._inviWindow.fittingHeight(2));
	this.addWindow(this._descWindow);
	this._descWindow.hide();
}

Scene_ItemBase.prototype.determineItem = function() {
	if (!this._inviWindow.isOpenAndActive()) {
		var action = new Game_Action(this.user());
		var item = this.item();
		action.setItemObject(item);
		if (action.isForFriend()) {
			this.showSubWindow(this._actorWindow);
			this._actorWindow.selectForItem(this.item());
		} else {
			this.useItem();
			this.activateItemWindow();
		}
	}
}

Scene_ItemBase.prototype.hideFullDesc = function() {
	
}

//******************************************************************
//
// Changes to Scene_Item
//
//******************************************************************

_SceneItemItemWindow = Scene_Item.prototype.createItemWindow;
Scene_Item.prototype.createItemWindow = function() {
	_SceneItemItemWindow.call(this);
	this._itemWindow.setHandler('shift', this.showFullDesc.bind(this));
}

Scene_Item.prototype.showFullDesc = function() {
	if (this.item() && !this._actorWindow.isOpenAndActive()) {
		if (this.item().meta.fdesc) {
			this._descWindow.setItem(this.item());
			this._itemWindow.hide();
			this._categoryWindow.hide();
			this._inviWindow.show();
			this._descWindow.show();
			this._inviWindow.activate();
		}
	}
}

Scene_Item.prototype.hideFullDesc = function() {
	this._inviWindow.deactivate();
	this._inviWindow.hide();
	this._descWindow.hide();
	this._itemWindow.show();
	this._categoryWindow.show();
	this._itemWindow.activate();
}

//******************************************************************
//
// Changes to Scene_Skill
//
//******************************************************************

_SceneSkillItemWindow = Scene_Skill.prototype.createItemWindow;
Scene_Skill.prototype.createItemWindow = function() {
	_SceneSkillItemWindow.call(this);
	this._itemWindow.setHandler('shift', this.showFullDesc.bind(this));
}

Scene_Skill.prototype.showFullDesc = function() {
	if (this.item() && !this._actorWindow.isOpenAndActive()) {
		if (this.item().meta.fdesc) {
			this._descWindow.setItem(this.item());
			this._skillTypeWindow.hide();
			this._statusWindow.hide();
			this._itemWindow.hide();
			this._inviWindow.show();
			this._descWindow.show();
			this._inviWindow.activate();
		}
	}
}

Scene_Skill.prototype.hideFullDesc = function() {
	this._inviWindow.deactivate();
	this._inviWindow.hide();
	this._descWindow.hide();
	this._itemWindow.show();
	this._statusWindow.show();
	this._skillTypeWindow.show();
	this._itemWindow.activate();
}

//******************************************************************
//
// SceneManager call to create the full desc scene from a script call
//
//******************************************************************

SceneManager.sceneFullDesc = function(item) {
	this._stack.push(this._scene.constructor);
	if (Scene_FullDesc) {
        this._nextScene = new Scene_FullDesc(item);
    }
    if (this._scene) {
        this._scene.stop();
    }
}
	
})();