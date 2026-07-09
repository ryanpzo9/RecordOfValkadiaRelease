/*:
 * @plugindesc v1.1 Dynamically changes class names via script calls with persistence and old save compatibility.
 * @author James Ryan
 *
 * @help
 * This plugin allows you to permanently change the name of a class using script calls,
 * ensuring the changes persist across saves, loads, and new games. It is compatible
 * with old save files that did not previously include this plugin.
 *
 * Script Calls:
 *   $gameSystem.setClassName(classId, "New Class Name");
 * Example:
 *   $gameSystem.setClassName(2, "Shadow Blade Dancer");
 *
 * To reset to the original class name (from the database):
 *   $gameSystem.resetClassName(classId);
 *
 * Notes:
 * - classId is the ID of the class you want to rename (e.g., 2 for Blade Dancer).
 * - Changes are global and affect all actors using the specified class.
 * - Works safely with existing save files by initializing defaults if needed.
 * - The original class names are stored in the database and can be restored using resetClassName.
 */

(function() {
    // Add class name overrides to Game_System with default empty object
    Game_System.prototype.classNameOverrides = Game_System.prototype.classNameOverrides || {};

    // Method to set a new class name
    Game_System.prototype.setClassName = function(classId, newName) {
        if ($dataClasses[classId]) {
            this.classNameOverrides[classId] = newName;
            $dataClasses[classId].name = newName;
        } else {
            console.warn("Class ID " + classId + " does not exist in $dataClasses.");
        }
    };

    // Method to reset a class name to its original database value
    Game_System.prototype.resetClassName = function(classId) {
        if ($dataClasses[classId] && this.classNameOverrides[classId]) {
            delete this.classNameOverrides[classId];
            $dataClasses[classId].name = $dataClasses[classId].name; // Revert to database name
        }
    };

    // Apply overrides at game startup
    const _DataManager_createGameObjects = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects.call(this);
        // Apply any stored overrides
        for (let classId in $gameSystem.classNameOverrides) {
            if ($dataClasses[classId]) {
                $dataClasses[classId].name = $gameSystem.classNameOverrides[classId];
            }
        }
    };

    // Ensure persistence in saves
    const _DataManager_makeSaveContents = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        const contents = _DataManager_makeSaveContents.call(this);
        contents.classNameOverrides = $gameSystem.classNameOverrides;
        return contents;
    };

    const _DataManager_extractSaveContents = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents.call(this, contents);
        // Initialize or load class name overrides for old saves
        if (contents.classNameOverrides) {
            $gameSystem.classNameOverrides = contents.classNameOverrides;
        } else {
            $gameSystem.classNameOverrides = {}; // Default to empty for old saves
        }
        // Reapply overrides after loading to ensure persistence
        for (let classId in $gameSystem.classNameOverrides) {
            if ($dataClasses[classId]) {
                $dataClasses[classId].name = $gameSystem.classNameOverrides[classId];
            }
        }
    };
})();