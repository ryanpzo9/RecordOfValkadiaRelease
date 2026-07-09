//=============================================================================
// JR_LifeStealStatusMenu.js
//=============================================================================

/*:
 * @plugindesc An extension for YEP_StatusMenuCore and YEP_LifeSteal to display life steal stats in the Attributes column.
 * @author JR
 *
 * @param ---Colors---
 * @default
 *
 * @param Color Zero
 * @parent ---Colors---
 * @type number
 * @desc Text color ID for 0% and 0 flat. (Default: 0 - White)
 * @default 0
 *
 * @param Color Positive Percent
 * @parent ---Colors---
 * @type number
 * @desc Text color ID for > 0% and <= 100%. (Default: 3 - Green)
 * @default 3
 *
 * @param Color High Percent
 * @parent ---Colors---
 * @type number
 * @desc Text color ID for > 100%. (Default: 13 - Purple)
 * @default 13
 *
 * @param Color Positive Flat
 * @parent ---Colors---
 * @type number
 * @desc Text color ID for > 0 flat. (Default: 3 - Green)
 * @default 3
 *
 * @param Color Negative
 * @parent ---Colors---
 * @type number
 * @desc Text color ID for < 0% and < 0 flat. (Default: 18 - Red)
 * @default 18
 *
 * @param ---HP Steal Percent---
 * @default
 *
 * @param phplifesteal Name
 * @parent ---HP Steal Percent---
 * @desc The text name used for HP Life Steal Physical Percentage.
 * @default Phys HP Steal %
 *
 * @param mhplifesteal Name
 * @parent ---HP Steal Percent---
 * @desc The text name used for HP Life Steal Magical Percentage.
 * @default Mag HP Steal %
 *
 * @param chplifesteal Name
 * @parent ---HP Steal Percent---
 * @desc The text name used for HP Life Steal Certain Percentage.
 * @default Cert HP Steal %
 *
 * @param ---HP Steal Flat---
 * @default
 *
 * @param fphplifesteal Name
 * @parent ---HP Steal Flat---
 * @desc The text name used for HP Life Steal Physical Flat value.
 * @default Phys HP Steal
 *
 * @param fmhplifesteal Name
 * @parent ---HP Steal Flat---
 * @desc The text name used for HP Life Steal Magical Flat value.
 * @default Mag HP Steal
 *
 * @param fchplifesteal Name
 * @parent ---HP Steal Flat---
 * @desc The text name used for HP Life Steal Certain Flat value.
 * @default Cert HP Steal
 *
 * @param ---MP Steal Percent---
 * @default
 *
 * @param pmplifesteal Name
 * @parent ---MP Steal Percent---
 * @desc The text name used for MP Life Steal Physical Percentage.
 * @default Phys MP Steal %
 *
 * @param mmplifesteal Name
 * @parent ---MP Steal Percent---
 * @desc The text name used for MP Life Steal Magical Percentage.
 * @default Mag MP Steal %
 *
 * @param cmplifesteal Name
 * @parent ---MP Steal Percent---
 * @desc The text name used for MP Life Steal Certain Percentage.
 * @default Cert MP Steal %
 *
 * @param ---MP Steal Flat---
 * @default
 *
 * @param fpmplifesteal Name
 * @parent ---MP Steal Flat---
 * @desc The text name used for MP Life Steal Physical Flat value.
 * @default Phys MP Steal
 *
 * @param fmmplifesteal Name
 * @parent ---MP Steal Flat---
 * @desc The text name used for MP Life Steal Magical Flat value.
 * @default Mag MP Steal
 *
 * @param fcmplifesteal Name
 * @parent ---MP Steal Flat---
 * @desc The text name used for MP Life Steal Certain Flat value.
 * @default Cert MP Steal
 *
 * @help
 * ============================================================================
 * Introduction
 * ============================================================================
 * * This plugin extends Yanfly's Status Menu Core to display Life Steal
 * attributes provided by Yanfly's Life Steal plugin, with custom color coding.
 *
 * * To display these stats, add the following shortcodes to the 
 * "Attributes Column X" parameters in YEP_StatusMenuCore:
 *
 * * --- HP Life Steal Rates (Percentage) ---
 * phplifesteal  : HP Life Steal Physical Percentage
 * mhplifesteal  : HP Life Steal Magical Percentage
 * chplifesteal  : HP Life Steal Certain Percentage
 *
 * * --- HP Life Steal Flat (Exact Value) ---
 * fphplifesteal : HP Life Steal Physical Flat
 * fmhplifesteal : HP Life Steal Magical Flat
 * fchplifesteal : HP Life Steal Certain Flat
 *
 * * --- MP Life Steal Rates (Percentage) ---
 * pmplifesteal  : MP Life Steal Physical Percentage
 * mmplifesteal  : MP Life Steal Magical Percentage
 * cmplifesteal  : MP Life Steal Certain Percentage
 *
 * * --- MP Life Steal Flat (Exact Value) ---
 * fpmplifesteal : MP Life Steal Physical Flat
 * fmmplifesteal : MP Life Steal Magical Flat
 * fcmplifesteal : MP Life Steal Certain Flat
 */

var Imported = Imported || {};
Imported.JR_LifeStealStatusMenu = true;

var JR = JR || {};
JR.LSS = JR.LSS || {};

if (Imported.YEP_StatusMenuCore && Imported.YEP_LifeSteal) {

    JR.Parameters = PluginManager.parameters('JR_LifeStealStatusMenu');
    JR.Param = JR.Param || {};

    // Colors
    JR.Param.LSS_ColorZero = Number(JR.Parameters['Color Zero']);
    JR.Param.LSS_ColorPosPct = Number(JR.Parameters['Color Positive Percent']);
    JR.Param.LSS_ColorHighPct = Number(JR.Parameters['Color High Percent']);
    JR.Param.LSS_ColorPosFlat = Number(JR.Parameters['Color Positive Flat']);
    JR.Param.LSS_ColorNeg = Number(JR.Parameters['Color Negative']);

    // HP Percentage Names
    JR.Param.LSS_phplifesteal = String(JR.Parameters['phplifesteal Name']);
    JR.Param.LSS_mhplifesteal = String(JR.Parameters['mhplifesteal Name']);
    JR.Param.LSS_chplifesteal = String(JR.Parameters['chplifesteal Name']);
    
    // HP Flat Names
    JR.Param.LSS_fphplifesteal = String(JR.Parameters['fphplifesteal Name']);
    JR.Param.LSS_fmhplifesteal = String(JR.Parameters['fmhplifesteal Name']);
    JR.Param.LSS_fchplifesteal = String(JR.Parameters['fchplifesteal Name']);

    // MP Percentage Names
    JR.Param.LSS_pmplifesteal = String(JR.Parameters['pmplifesteal Name']);
    JR.Param.LSS_mmplifesteal = String(JR.Parameters['mmplifesteal Name']);
    JR.Param.LSS_cmplifesteal = String(JR.Parameters['cmplifesteal Name']);

    // MP Flat Names
    JR.Param.LSS_fpmplifesteal = String(JR.Parameters['fpmplifesteal Name']);
    JR.Param.LSS_fmmplifesteal = String(JR.Parameters['fmmplifesteal Name']);
    JR.Param.LSS_fcmplifesteal = String(JR.Parameters['fcmplifesteal Name']);

    //=============================================================================
    // Window_StatusInfo
    //=============================================================================

    // Custom drawing for Life Steal Rate logic
    Window_StatusInfo.prototype.drawLifeStealRate = function(rate, dx, dy, dw) {
        var valueText = (rate * 100).toFixed(Yanfly.Param.StatusAttrDec) + '%';
        if (rate === 0) {
            this.changeTextColor(this.textColor(JR.Param.LSS_ColorZero));
        } else if (rate > 0 && rate <= 1.0) {
            this.changeTextColor(this.textColor(JR.Param.LSS_ColorPosPct));
        } else if (rate > 1.0) {
            this.changeTextColor(this.textColor(JR.Param.LSS_ColorHighPct));
        } else if (rate < 0) {
            this.changeTextColor(this.textColor(JR.Param.LSS_ColorNeg));
        }
        this.drawAttributeValue(valueText, dx, dy, dw);
    };

    // Custom drawing for Life Steal Flat logic
    Window_StatusInfo.prototype.drawLifeStealFlat = function(value, dx, dy, dw) {
        if (value === 0) {
            this.changeTextColor(this.textColor(JR.Param.LSS_ColorZero));
        } else if (value > 0) {
            this.changeTextColor(this.textColor(JR.Param.LSS_ColorPosFlat));
        } else if (value < 0) {
            this.changeTextColor(this.textColor(JR.Param.LSS_ColorNeg));
        }
        this.drawAttributeValue(String(value), dx, dy, dw);
    };

    var _Window_StatusInfo_drawAttributeData = Window_StatusInfo.prototype.drawAttributeData;
    Window_StatusInfo.prototype.drawAttributeData = function(attr, dx, dy, dw) {
        var actor = this._actor;
        this.contents.fontSize = Yanfly.Param.StatusAttrSize;
        
        switch (attr) {
        // --- HP Percentages ---
        case 'phplifesteal':
            this.drawAttributeName(JR.Param.LSS_phplifesteal, dx, dy, dw);
            this.drawLifeStealRate(actor.getLifeStealRate('hpPhysicalRate', null), dx, dy, dw);
            break;
        case 'mhplifesteal':
            this.drawAttributeName(JR.Param.LSS_mhplifesteal, dx, dy, dw);
            this.drawLifeStealRate(actor.getLifeStealRate('hpMagicalRate', null), dx, dy, dw);
            break;
        case 'chplifesteal':
            this.drawAttributeName(JR.Param.LSS_chplifesteal, dx, dy, dw);
            this.drawLifeStealRate(actor.getLifeStealRate('hpCertainRate', null), dx, dy, dw);
            break;

        // --- HP Flats ---
        case 'fphplifesteal':
            this.drawAttributeName(JR.Param.LSS_fphplifesteal, dx, dy, dw);
            this.drawLifeStealFlat(actor.getLifeStealFlat('hpPhysicalFlat', null), dx, dy, dw);
            break;
        case 'fmhplifesteal':
            this.drawAttributeName(JR.Param.LSS_fmhplifesteal, dx, dy, dw);
            this.drawLifeStealFlat(actor.getLifeStealFlat('hpMagicalFlat', null), dx, dy, dw);
            break;
        case 'fchplifesteal':
            this.drawAttributeName(JR.Param.LSS_fchplifesteal, dx, dy, dw);
            this.drawLifeStealFlat(actor.getLifeStealFlat('hpCertainFlat', null), dx, dy, dw);
            break;

        // --- MP Percentages ---
        case 'pmplifesteal':
            this.drawAttributeName(JR.Param.LSS_pmplifesteal, dx, dy, dw);
            this.drawLifeStealRate(actor.getLifeStealRate('mpPhysicalRate', null), dx, dy, dw);
            break;
        case 'mmplifesteal':
            this.drawAttributeName(JR.Param.LSS_mmplifesteal, dx, dy, dw);
            this.drawLifeStealRate(actor.getLifeStealRate('mpMagicalRate', null), dx, dy, dw);
            break;
        case 'cmplifesteal':
            this.drawAttributeName(JR.Param.LSS_cmplifesteal, dx, dy, dw);
            this.drawLifeStealRate(actor.getLifeStealRate('mpCertainRate', null), dx, dy, dw);
            break;

        // --- MP Flats ---
        case 'fpmplifesteal':
            this.drawAttributeName(JR.Param.LSS_fpmplifesteal, dx, dy, dw);
            this.drawLifeStealFlat(actor.getLifeStealFlat('mpPhysicalFlat', null), dx, dy, dw);
            break;
        case 'fmmplifesteal':
            this.drawAttributeName(JR.Param.LSS_fmmplifesteal, dx, dy, dw);
            this.drawLifeStealFlat(actor.getLifeStealFlat('mpMagicalFlat', null), dx, dy, dw);
            break;
        case 'fcmplifesteal':
            this.drawAttributeName(JR.Param.LSS_fcmplifesteal, dx, dy, dw);
            this.drawLifeStealFlat(actor.getLifeStealFlat('mpCertainFlat', null), dx, dy, dw);
            break;

        // --- Default fallback for Yanfly's original attributes ---
        default:
            _Window_StatusInfo_drawAttributeData.call(this, attr, dx, dy, dw);
            break;
        }
    };

} else {
    console.warn("JR_LifeStealStatusMenu requires YEP_StatusMenuCore and YEP_LifeSteal to be installed and active.");
}