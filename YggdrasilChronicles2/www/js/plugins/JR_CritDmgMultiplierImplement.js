/*:
 * @plugindesc v1.9 Adds 'critdmg' to Status Menu. Update: Auto-detects Base & Luck Multipliers from YEP_X_CriticalControl formula.
 * @author JR
 *
 * @param Crit Dmg Name
 * @text Critical Damage Name
 * @desc The name of the Critical Damage Multiplier displayed in the Status Menu.
 * @default Crit Dmg Mult
 * * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 *
 * This plugin requires YEP_StatusMenuCore.js and YEP_X_CriticalControl.js.
 * Place this plugin below both of them.
 *
 * It adds a new attribute called 'critdmg' to the Status Menu.
 *
 * ============================================================================
 * v1.9 Update: Auto-Formula Detection
 * ============================================================================
 * This plugin now automatically reads your "Critical Multiplier Formula" from
 * YEP_X_CriticalControl.
 *
 * It detects:
 * 1. Base Multiplier (e.g. 1.5 in "value *= 1.5")
 * 2. Luck Multiplier (e.g. 0.002 in "user.luk * 0.002")
 *
 * You do not need to edit any code if you change your Yanfly formula.
 *
 * Display Format:
 * "150% + 25.50%" (Base + Bonus)
 *
 * ============================================================================
 * Instructions
 * ============================================================================
 *
 * 1. Open YEP_StatusMenuCore plugin parameters.
 * 2. Add 'critdmg' (without quotes) to any "Attributes Column".
 * * Example:
 * Attributes Column 2: critdmg tcr pdr mdr fdr
 * */

var Imported = Imported || {};
Imported.JR_CritDmgMultiplierImplement = true;

(function() {

    // Dependencies Check
    if (!Imported.YEP_StatusMenuCore || !Imported.YEP_X_CriticalControl) {
        console.warn("JR_CritDmgMultiplierImplement requires YEP_StatusMenuCore and YEP_X_CriticalControl.");
        return;
    }

    // Parameters
    var parameters = PluginManager.parameters('JR_CritDmgMultiplierImplement');
    var critDmgName = String(parameters['Crit Dmg Name'] || 'Crit Dmg Mult');

    //=============================================================================
    // Alias drawAttributeData to add 'critdmg' support
    //=============================================================================
    
    var _Window_StatusInfo_drawAttributeData = Window_StatusInfo.prototype.drawAttributeData;
    Window_StatusInfo.prototype.drawAttributeData = function(attr, dx, dy, dw) {
        if (attr === 'critdmg') {
            this.drawCritDmgData(dx, dy, dw);
        } else {
            _Window_StatusInfo_drawAttributeData.call(this, attr, dx, dy, dw);
        }
    };

    //=============================================================================
    // Draw the Critical Damage Multiplier (Split Format)
    //=============================================================================
    
    Window_StatusInfo.prototype.drawCritDmgData = function(dx, dy, dw) {
        // 1. Draw the Label
        this.drawAttributeName(critDmgName, dx, dy, dw);

        // 2. Auto-Detect Formula Values from Yanfly Params
        var formula = Yanfly.Param.critMult || "value *= 3.0 + bonus";
        
        // A. Detect Base (e.g. 1.5 or 3.0)
        var basePercentage = 150; // Default fallback (Yanfly Default is 3.0, but your formula is 1.5)
        var baseMatch = formula.match(/value\s*\*=\s*(\d*\.?\d+)/i);
        if (baseMatch) {
            basePercentage = parseFloat(baseMatch[1]) * 100;
        }

        // B. Detect Luck Mult (e.g. 0.002 or 0.001)
        var luckMult = 0.001; // Default fallback
        // Look for "user.luk * 0.002" OR "0.002 * user.luk"
        var luckMatch = formula.match(/user\.luk\s*\*\s*(\d*\.?\d+)/i) || formula.match(/(\d*\.?\d+)\s*\*\s*user\.luk/i);
        if (luckMatch) {
            luckMult = parseFloat(luckMatch[1]);
        }

        // 3. Calculate Bonuses
        var bonusMult = this._actor.criticalMultiplierBonus(); // Items/States
        var lukMult   = this._actor.luk * luckMult;            // Luck Stats
        var totalBonusRaw = bonusMult + lukMult;
        
        var totalBonusPercent = totalBonusRaw * 100;

        // 4. Construct the Display String
        // Format: "150% + 45.20%"
        var text = basePercentage + "%";
        
        if (totalBonusPercent >= 0) {
            text += " + " + totalBonusPercent.toFixed(2) + "%";
            
            // If they have a bonus, color the text Green (PowerUp)
            if (totalBonusPercent > 0) this.changeTextColor(this.powerUpColor());
            else this.changeTextColor(this.normalColor()); // If 0% bonus, keep white
            
        } else {
            // Handle negative bonuses (e.g., "150% - 10%")
            text += " - " + Math.abs(totalBonusPercent).toFixed(2) + "%";
            this.changeTextColor(this.powerDownColor()); // Red
        }

        // 5. Draw the Value
        this.drawAttributeValue(text, dx, dy, dw);
    };

})();