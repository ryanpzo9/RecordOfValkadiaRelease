//=============================================================================
// JR_ListEquipmentWithGems.js
//=============================================================================

/*:
 * @plugindesc Adds a method to list all equipped equipment and their attachments for an actor.
 * @help
 * To use this plugin, call the following script call:
 * 
 *   $gameActors.actor(actorId).listEquipmentWithGems()
 * 
 * This will return a string listing all equipped weapons and armors with their attachments.
 */

(function() {
    // Extend the Game_Actor class
    Game_Actor.prototype.listEquipmentWithGems = function() {
        var equippedItems = this.equips().filter(equip => equip); // Get all equipped items, excluding nulls
        var equipmentWithAttachments = {
            Weapons: [],
            Armors: [] // Group all armor types together
        };

        // Loop through each equipped item
        equippedItems.forEach(item => {
            if (item && item.augmentSlotItems) {
                // Check if there are attachments
                var augments = item.augmentSlotItems
                    .filter(aug => aug !== 'none') // Get all valid attachments
                    .map(augment => { // Map augment identifiers to names
                        if (augment.match(/ITEM[ ](\d+)/i)) {
                            return $dataItems[parseInt(RegExp.$1)].name;
                        } else if (augment.match(/WEAPON[ ](\d+)/i)) {
                            return $dataWeapons[parseInt(RegExp.$1)].name;
                        } else if (augment.match(/ARMOR[ ](\d+)/i)) {
                            return $dataArmors[parseInt(RegExp.$1)].name;
                        }
                        return 'Unknown Attachment';
                    });

                // Create the formatted string for the equipment and its attachments
                var equipmentName = item.name;
                var attachments = augments.length > 0 ? augments.join(', ') : 'No Attachments'; // Join attachments or show 'No Attachments'

                // Categorize equipment by type
                if (DataManager.isWeapon(item)) {
                    equipmentWithAttachments.Weapons.push(`${equipmentName}: [${attachments}]\n`);
                } else if (DataManager.isArmor(item)) {
                    equipmentWithAttachments.Armors.push(`${equipmentName}: [${attachments}]\n`);
                }
            } else {
                // Handle cases where there are no attachment slots
                var equipmentName = item.name;
                if (DataManager.isWeapon(item)) {
                    equipmentWithAttachments.Weapons.push(`${equipmentName}: [No Attachments]\n`);
                } else if (DataManager.isArmor(item)) {
                    equipmentWithAttachments.Armors.push(`${equipmentName}: [No Attachments]\n`);
                }
            }
        });

        // Combine results into a single string
        var result = '';
        if (equipmentWithAttachments.Weapons.length > 0) {
            result += "Weapons:\n" + equipmentWithAttachments.Weapons.join('') + "\n";
        }
        if (equipmentWithAttachments.Armors.length > 0) {
            result += "Armors:\n" + equipmentWithAttachments.Armors.join('') + "\n";
        }

        // Check if there are any items in each category
        if (result.trim() === '') {
            result = "No equipped items found.";
        }

        return result; // Return the formatted string
    };
})();
