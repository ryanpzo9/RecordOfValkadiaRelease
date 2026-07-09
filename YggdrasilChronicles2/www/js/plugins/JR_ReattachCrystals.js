//=============================================================================
// JR_ReattachCrystals.js
//=============================================================================

/*:
 * @plugindesc v1.30 A utility script to detach and reattach Glyphs/Runes, with an ID-based exclusion list.
 * @author JR
 *
 * @param Excluded Item IDs
 * @desc A comma-separated list of database Item IDs that should NOT be reattached (e.g. 15, 22, 105).
 * @default 
 *
 * @help
 * ============================================================================
 * Overview
 * ============================================================================
 * The reattachCrystals() script is a utility tool designed to bridge the gap 
 * between old save files and new plugin updates. 
 * 
 * It forces the game to recognize new Life Steal and Critical Control notetags 
 * added to augments (like Glyphs and Runes) that are already equipped by 
 * party members in an existing save file.
 * 
 * ============================================================================
 * How to Use It
 * ============================================================================
 * Create an event (such as an update NPC or an invisible autorun event that 
 * triggers once per save file) and use the Script command:
 * 
 *     reattachCrystals();
 *
 * ============================================================================
 */

// Initialize parameters
var JR = JR || {};
JR.Parameters = PluginManager.parameters('JR_ReattachCrystals');

// Parse the comma-separated exclusion list into an array of integers
JR.ExcludeCrystalsRaw = String(JR.Parameters['Excluded Item IDs'] || '');
JR.ExcludeCrystalsList = JR.ExcludeCrystalsRaw.split(',').map(function(id) {
    return parseInt(id.trim(), 10);
}).filter(function(id) {
    return !isNaN(id) && id > 0;
});

window.reattachCrystals = function() {
    // Safety check to ensure the augment plugin is loaded[cite: 2]
    if (!Imported.YEP_X_AttachAugments) return;

    var count = 0;

    // Loop through all active party members
    $gameParty.members().forEach(function(actor) {
        var needsRefresh = false;

        // Loop through everything the actor currently has equipped
        actor.equips().forEach(function(item) {
            // Skip empty slots or items that do not have independent augment data[cite: 1, 2]
            if (!item || !item.augmentSlots || !item.augmentSlotItems) return;

            // Iterate through the available augment slots on the item[cite: 2]
            for (var i = 0; i < item.augmentSlots.length; ++i) {
                var slotType = item.augmentSlots[i].toUpperCase().trim();

                // Check if the slot matches your target crystals
                if (slotType === 'GLYPH' || slotType === 'RUNE') {
                    
                    // Identify the crystal currently sitting in this slot[cite: 2]
                    var augment = ItemManager.augmentInSlot(item, i);
                    
                    if (augment) {
                        // Check if this specific crystal's Database ID is on the exclusion list
                        if (JR.ExcludeCrystalsList.contains(augment.id)) {
                            continue; // Skip detaching/reattaching this crystal
                        }

                        // 1. Detach the crystal[cite: 2]
                        ItemManager.removeAugmentFromSlot(item, i);
                        
                        // 2. Immediately reattach the crystal to apply new notetags[cite: 2]
                        ItemManager.installAugmentToSlot(item, augment, i);
                        
                        needsRefresh = true;
                        count++;
                    }
                }
            }
        });

        // Refresh the actor's stats so their new properties update visually
        if (needsRefresh) actor.refresh();
    });

    // Optional audio/console feedback so you know the script executed successfully
    if (count > 0) {
        SoundManager.playEquip();
        console.log("Successfully detached and reattached " + count + " Glyphs and Runes!");
    } else {
        SoundManager.playBuzzer();
        console.log("No valid Glyphs or Runes were found, or all equipped crystals were excluded.");
    }
};