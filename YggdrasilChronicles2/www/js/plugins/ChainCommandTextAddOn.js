//==============================================================================
// ChainCommandTextAddOn.js
//==============================================================================

/*:
* @plugindesc Add-on for ChainCommand.js to display centered text below the command area.
* @author James Ryan
*
* @param ---Command Text---
*
* @param Command Text
* @desc Text to display below the command area. Use \c[n] for colors. Leave blank to disable.
* @default Press the keys in order!
*
* @param Text Y Shift
* @desc Y position shift below the button sequence.
* @default 60
*
* @param Text Font Size
* @desc Font size of the command text.
* @default 28
*
* @help 
* ------------------------------------------------------------------------------
*   ChainCommandTextAddOn v1.0
*   Free for both commercial and non-commercial use, with credit.
* ------------------------------------------------------------------------------
*   Requirements: Must be placed BELOW ChainCommand.js in the plugin list.
*
*   This plugin extends ChainCommand.js by adding a centered text display
*   below the command button sequence. It does not modify the original plugin
*   and can be disabled without affecting the base functionality.
*
*   To use:
*   1. Install ChainCommand.js (required)
*   2. Place this plugin below ChainCommand.js in the plugin manager
*   3. Configure the text parameters as desired
*
*   The text will appear centered below the button sequence during the
*   ChainCommand minigame, if the Command Text parameter is not empty.
*
*   Text Formatting:
*   - Use \c[n] for color changes (n = 0-31, MV color codes).
*   - Example: "Press \c[2]keys\c[0] in order!" (red "keys", white rest).
* ------------------------------------------------------------------------------
*/

(function() {
    // Check if ChainCommand is loaded
    if (!Imported.ChainCommand) {
        console.error("ChainCommandTextAddOn.js requires ChainCommand.js to be loaded first!");
        return;
    }

    var params = PluginManager.parameters("ChainCommandTextAddOn");

    var commandText = {
        text: params["Command Text"] || "",
        shiftY: parseInt(params["Text Y Shift"]) || 60,
        fontSize: parseInt(params["Text Font Size"]) || 28
    };

    // Alias the original create method
    var alias_Scene_ChainCommand_create = Scene_ChainCommand.prototype.create;
    Scene_ChainCommand.prototype.create = function() {
        alias_Scene_ChainCommand_create.call(this);
        this.createCommandText();
    };

    // Add new method to display the text
    Scene_ChainCommand.prototype.createCommandText = function() {
        if (!commandText.text) return;

        // Create a temporary Window_Base to process escape codes
        var tempWindow = new Window_Base(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        tempWindow.contents.fontSize = commandText.fontSize; // Set font size for accurate measurement

        // Create bitmap for text rendering with enough height for text
        this._commandText = new Sprite(new Bitmap(Graphics.boxWidth, commandText.fontSize * 2));
        this._commandText.bitmap.fontSize = commandText.fontSize;

        // Set the bitmap as the contents of the tempWindow for drawTextEx
        tempWindow.contents = this._commandText.bitmap;

        // Measure the actual rendered width using drawTextEx (it returns the width)
        var textWidth = tempWindow.drawTextEx(commandText.text, 0, commandText.fontSize * 2); // Draw off-screen to measure

        // Clear the bitmap to redraw the text at the correct position
        this._commandText.bitmap.clear();

        // Calculate the starting x position to center the text on the bitmap
        var startX = (Graphics.boxWidth - textWidth) / 2;

        // Draw the text with escape codes, starting at the centered x position
        tempWindow.drawTextEx(commandText.text, startX, 0);

        // Position the sprite below the buttons
        var y = (Graphics.boxHeight - button.height) / 2 + button.height + commandText.shiftY;
        this._commandText.x = 0; // Sprite starts at x=0, text is already centered on the bitmap
        this._commandText.y = y;
        this.addChild(this._commandText);
    };

    // Ensure button object is accessible (assuming it's available from ChainCommand)
    var button = {
        width: parseInt(PluginManager.parameters("ChainCommand")["Button Width"]) || 31,
        height: parseInt(PluginManager.parameters("ChainCommand")["Button Height"]) || 31,
        spacing: parseInt(PluginManager.parameters("ChainCommand")["Button Spacing"]) || 15
    };

})();