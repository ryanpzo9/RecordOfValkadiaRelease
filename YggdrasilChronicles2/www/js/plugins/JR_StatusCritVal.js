/*:
 * @plugindesc v1.0 Adds 'critval' attribute to Status Menu Core to show the Critical Bonus Flat Value.
 * @author JR
 *
 * @param Attribute Label
 * @desc The text displayed for the Critical Flat Value attribute.
 * @default Critical Flat Bonus
 *
 * @help
 * ============================================================================
 * Instructions
 * ============================================================================
 * * 1. Place this plugin BELOW YEP_StatusMenuCore and YEP_X_CriticalControl.
 * 2. Open the Plugin Manager > YEP_StatusMenuCore > Parameters.
 * 3. Go to the "---Attributes---" section.
 * 4. Add the word 'critval' (without quotes) to any of the 
 * "Attributes Column" lists (1, 2, 3, or 4).
 * * Example: 
 * Attributes Column 1: exr hit eva cri critval
 * * ============================================================================
 * Mechanics
 * ============================================================================
 * * This displays the "Flat Critical Bonus" derived from YEP_X_CriticalControl.
 * It calculates the sum of all <Flat Critical: +x> notetags found on the
 * Actor, Class, Equipment, and States.
 *
 * It uses the Standard Color rules from StatusMenuCore:
 * - Label: System Color (Blue-ish)
 * - Value: Normal Color (White)
 *
 */

(function() {

    // Verify dependencies are loaded
    if (!Imported.YEP_StatusMenuCore || !Imported.YEP_X_CriticalControl) {
        console.warn("JR_StatusCritVal requires YEP_StatusMenuCore and YEP_X_CriticalControl.");
        return;
    }

    // Get Parameters
    var parameters = PluginManager.parameters('JR_StatusCritVal');
    var labelText = String(parameters['Attribute Label'] || 'Critical Flat Bonus');

    // Alias the drawAttributeData function from YEP_StatusMenuCore
    var _Window_StatusInfo_drawAttributeData = Window_StatusInfo.prototype.drawAttributeData;
    Window_StatusInfo.prototype.drawAttributeData = function(attr, dx, dy, dw) {
        // Check if the requested attribute is our custom 'critval'
        if (attr === 'critval') {
            this.drawCritFlatVal(dx, dy, dw);
        } else {
            // Otherwise, run the original code for standard attributes
            _Window_StatusInfo_drawAttributeData.call(this, attr, dx, dy, dw);
        }
    };

    // Define the custom drawing logic for Crit Flat Value
    Window_StatusInfo.prototype.drawCritFlatVal = function(dx, dy, dw) {
        // 1. Draw the Label Name
        // In StatusMenuCore, this automatically uses the System Color.
        this.drawAttributeName(labelText, dx, dy, dw);

        // 2. Calculate the Value
        // This pulls the static bonus from notetags <Flat Critical: +x>
        var value = this._actor.flatCriticalBonus();

        // 3. Format the text 
        // We removed the "+" prefix logic as requested.
        var valueText = String(value);

        // 4. Draw the Value
        // We enforce the Normal Color (Standard White) to match the other values.
        // (We do not use 'setRateColor' because that is calculated for percentages).
        this.changeTextColor(this.normalColor());
        
        // Draw the value aligned to the right
        this.drawAttributeValue(valueText, dx, dy, dw);
    };

})();