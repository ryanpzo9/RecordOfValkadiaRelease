//=============================================================================
// JR_RecipeCrafting_YEPWordWrapFix.js
//=============================================================================

/*:
 * @plugindesc v1.0 Fixes text overflow in Recipe Crafting MV by applying Yanfly's Word Wrap to the Help Window.
 * @author JR
 *
 * @help
 * This is a simple patch that ensures the top message box (Help Window)
 * in Vlue's Recipe Crafting MV properly utilizes Yanfly's Word Wrap feature.
 * 
 * * Requirements:
 * - YEP_MessageCore
 * - RecipeCrafting
 * 
 * * Make sure to place this plugin BELOW both of the above plugins in your
 * Plugin Manager. Also, ensure "Description Wrap" is set to ON in your 
 * YEP_MessageCore plugin parameters!
 */

(function() {
    // Alias the setText function of the Help Window
    var _Window_Help_setText = Window_Help.prototype.setText;
    
    Window_Help.prototype.setText = function(text) {
        // Only apply this fix if the player is currently inside the Crafting Scene
        if (SceneManager._scene instanceof Scene_Crafting) {
            
            // Check if YEP Message Core is installed and Description Wrap is enabled
            if (Imported && Imported.YEP_MessageCore && eval(Yanfly.Param.MSGDescWrap)) {
                
                // Prepend <WordWrap> if it isn't already there and the text is not blank
                if (text && !text.match(/<WordWrap>/i)) {
                    text = '<WordWrap>' + text;
                }
            }
        }
        
        // Execute the original text drawing function
        _Window_Help_setText.call(this, text);
    };

})();