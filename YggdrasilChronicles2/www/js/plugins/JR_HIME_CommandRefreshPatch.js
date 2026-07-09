/*:
 * @plugindesc Fixes HIME Battle Commands to update notetags when loading old save files.
 * @author JR (With the help of Gemini)
 *
 * @help
 * This simple patch automatically refreshes the battle commands for all
 * actors whenever a save file is loaded.
 * * This ensures that if you change notetags (like adding conditions
 * or changing symbols) in the Database, those changes will apply
 * immediately to your existing save files.
 * * Place this plugin BELOW HIME_ActorBattleCommands in your plugin manager.
 */

(function() {
    
    // Store the original Load function
    var _DataManager_extractSaveContents = DataManager.extractSaveContents;
    
    // Overwrite with our new version
    DataManager.extractSaveContents = function(contents) {
        
        // Run the original loading process first
        _DataManager_extractSaveContents.call(this, contents);
        
        // After loading, force a refresh on all existing actors
        if ($gameActors && $gameActors._data) {
            $gameActors._data.forEach(function(actor) {
                // Check if actor exists and has the Hime function available
                if (actor && typeof actor.refreshBattleCommands === 'function') {
                    actor.refreshBattleCommands();
                }
            });
        }
    };

})();