//=============================================================================
// EquipmentRarityColors.js
//=============================================================================
//v1.2
/*:
 * @plugindesc Changes the weapons color based on rarity value you assign.
 * @author Jeremy Cannady
 *
 * @param Rarity 1 Color
 * @desc Select the color.
 * @default 3
 *
 * @param Rarity 2 Color
 * @desc Select the color.
 * @default 1
 *
 * @param Rarity 3 Color
 * @desc Select the color.
 * @default 20
 *
 * @param Rarity 4 Color
 * @desc Select the color.
 * @default 10
 *
 * @param Rarity 5 Color
 * @desc Select the color.
 * @default 30
 *
 * @help Changes the Items color based on the rarity you assign in the note field.
 *
 *
 <itemRarity:1> Uncommon
 <itemRarity:2>
 <itemRarity:3>
 <itemRarity:4>
 <itemRarity:5> Super Rare Mega Death Thingy
*/

(function(){
var parameters = PluginManager.parameters('EquipmentRarityColors');
var rarity1color = parameters['Rarity 1 Color'];
var rarity2color = parameters['Rarity 2 Color'];
var rarity3color = parameters['Rarity 3 Color'];
var rarity4color = parameters['Rarity 4 Color'];
var rarity5color = parameters['Rarity 5 Color'];

var copyOfDrawItemName = Window_Base.prototype.drawItemName;
Window_Base.prototype.drawItemName = function(item, x, y, width) {
	copyOfDrawItemName.call(this,item, x, y, width);
	width = width || 312;
	var iconBoxWidth = this.lineHeight();
	var padding = (iconBoxWidth - Window_Base._iconWidth) / 2;
	if(item){
		var rarity = parseInt(item.meta.itemRarity);
		if(rarity == 1){this.changeTextColor(this.textColor(rarity1color))
		}else if (rarity == 2){this.changeTextColor(this.textColor(rarity2color))
		}else if (rarity == 3){this.changeTextColor(this.textColor(rarity3color))
		}else if (rarity == 4){this.changeTextColor(this.textColor(rarity4color))
		}else if (rarity == 5){this.changeTextColor(this.textColor(rarity5color))
		}else{this.resetTextColor();};
		this.drawText(item.name, x + iconBoxWidth, y, width - iconBoxWidth);
	};
};
})();