/*:
 * @plugindesc Lists all participated members, reserved members, JP stats, custom and regular stats, detailed enemy stats, party's gold, and learned skills after a battle.
 * @help
 * This plugin adds a method to display participated actors with their JP stats (Available JP, Spent JP, Total JP),
 * custom stats (_vitPoints, _strPoints, etc.), regular stats, reserved members, detailed enemy stats, the party's gold,
 * and a list of learned skills for each actor. 
 * Use the following script call to display the information:
 *
 *   getParticipatedMembers();
 *
 * This will return a formatted string containing the names, JP stats, custom stats, and regular stats of participated members,
 * reserved members, detailed enemy stats (HP, MP, ATK, DEF, MAT, MDF, AGI, LUK), the party's current gold, and learned skills.
 */

/*:
 * @plugindesc Displays participated members, reserved members, stats, and more after a battle.
 * @help Use getParticipatedMembers() to retrieve battle info.
 */

/*:
 * @plugindesc Displays participated members, reserved members, stats, and more after a battle.
 * @help Use getParticipatedMembers() to retrieve battle info.
 */

/*:
 * @plugindesc Displays participated members, reserved members, stats, and more after a battle.
 * @help Use getParticipatedMembers() to retrieve battle info.
 */

/*:
 * @plugindesc Displays participated members, reserved members, stats, and more after a battle.
 * @help Use getParticipatedMembers() to retrieve battle info.
 */

(function() {
    this.getParticipatedMembers = function() {
        let battleInfo = "Participated Members:\n";
        
        // Get the participated actors (only actors who are in the battle)
        $gameParty.battleMembers().forEach(actor => {
            // Add actor name and level
            battleInfo += `- ${actor.name()} Level ${actor.level}:\n`;

            // Add JP stats (Available JP, Spent JP, Total JP) from JR_StatsDistribution
            const availableJP = actor.getCurrentJp ? actor.getCurrentJp() : 0;
            const spentJP = actor.getSpentJp ? actor.getSpentJp() : 0;
            const totalJP = availableJP + spentJP;
            battleInfo += `  Available JP: ${availableJP}\n`;
            battleInfo += `  Spent JP: ${spentJP}\n`;
            battleInfo += `  Total JP: ${totalJP}\n`;

            // Add custom stats using JR_StatsDistribution's getCurrentStats()
            const currentStats = actor.getCurrentStats ? actor.getCurrentStats() : { Vitality: 0, Strength: 0, Dexterity: 0, Intelligence: 0, Spirit: 0 };
            battleInfo += `  VIT: ${currentStats.Vitality}, STR: ${currentStats.Strength}, DEX: ${currentStats.Dexterity}, `;
            battleInfo += `INT: ${currentStats.Intelligence}, SPR: ${currentStats.Spirit}\n`;

            // Add regular parameters using standard methods (includes JR_StatsDistribution bonuses)
            battleInfo += `  HP: ${actor.hp}, MP: ${actor.mp}, `;
            battleInfo += `ATK: ${actor.atk}, DEF: ${actor.def}, `;
            battleInfo += `MAT: ${actor.mat}, MDF: ${actor.mdf}, `;
            battleInfo += `AGI: ${actor.agi}, LUK: ${actor.luk}\n`;

            // Add ex-parameters using standard methods, converted to percentages with 3 decimal places
            battleInfo += `  Ex-Parameters:\n`;
            battleInfo += `    HIT: ${(actor.hit * 100).toFixed(3)}%\n`;
            battleInfo += `    EVA: ${(actor.eva * 100).toFixed(3)}%\n`;
            battleInfo += `    CRI: ${(actor.cri * 100).toFixed(3)}%\n`;
            battleInfo += `    CEV: ${(actor.cev * 100).toFixed(3)}%\n`;
            battleInfo += `    MEV: ${(actor.mev * 100).toFixed(3)}%\n`;
            battleInfo += `    MRF: ${(actor.mrf * 100).toFixed(3)}%\n`;
            battleInfo += `    CNT: ${(actor.cnt * 100).toFixed(3)}%\n`;
            battleInfo += `    HRG: ${(actor.hrg * 100).toFixed(3)}%\n`;
            battleInfo += `    MRG: ${(actor.mrg * 100).toFixed(3)}%\n`;
            battleInfo += `    TRG: ${(actor.trg * 100).toFixed(3)}%\n`;

            // Add sp-parameters using standard methods, converted to percentages with 3 decimal places
            battleInfo += `  Sp-Parameters:\n`;
            battleInfo += `    TGR: ${(actor.tgr * 100).toFixed(3)}%\n`;
            battleInfo += `    GRD: ${(actor.grd * 100).toFixed(3)}%\n`;
            battleInfo += `    REC: ${(actor.rec * 100).toFixed(3)}%\n`;
            battleInfo += `    PHA: ${(actor.pha * 100).toFixed(3)}%\n`;
            battleInfo += `    MCR: ${(actor.mcr * 100).toFixed(3)}%\n`;
            battleInfo += `    TCR: ${(actor.tcr * 100).toFixed(3)}%\n`;
            battleInfo += `    PDR: ${(actor.pdr * 100).toFixed(3)}%\n`;
            battleInfo += `    MDR: ${(actor.mdr * 100).toFixed(3)}%\n`;
            battleInfo += `    FDR: ${(actor.fdr * 100).toFixed(3)}%\n`;
            battleInfo += `    EXR: ${(actor.exr * 100).toFixed(3)}%\n`;

            // Add learned skills
            const learnedSkills = actor.skills().map(skill => skill.name).join(", ");
            battleInfo += `  Skills Learned: [${learnedSkills}]\n\n`;
        });
        
        // Get the reserved actors (actors in the party but not participating in battle)
        let reservedMembers = $gameParty.allMembers().filter(actor => !$gameParty.battleMembers().includes(actor));
        
        battleInfo += "Reserved Members:\n";
        
        reservedMembers.forEach(actor => {
            // Add reserved actor name and level
            battleInfo += `- ${actor.name()} Level ${actor.level}:\n`;

            // Add JP stats (Available JP, Spent JP, Total JP) from JR_StatsDistribution
            const availableJP = actor.getCurrentJp ? actor.getCurrentJp() : 0;
            const spentJP = actor.getSpentJp ? actor.getSpentJp() : 0;
            const totalJP = availableJP + spentJP;
            battleInfo += `  Available JP: ${availableJP}\n`;
            battleInfo += `  Spent JP: ${spentJP}\n`;
            battleInfo += `  Total JP: ${totalJP}\n`;

            // Add custom stats using JR_StatsDistribution's getCurrentStats()
            const currentStats = actor.getCurrentStats ? actor.getCurrentStats() : { Vitality: 0, Strength: 0, Dexterity: 0, Intelligence: 0, Spirit: 0 };
            battleInfo += `  VIT: ${currentStats.Vitality}, STR: ${currentStats.Strength}, DEX: ${currentStats.Dexterity}, `;
            battleInfo += `INT: ${currentStats.Intelligence}, SPR: ${currentStats.Spirit}\n`;

            // Add regular parameters using standard methods (includes JR_StatsDistribution bonuses)
            battleInfo += `  HP: ${actor.hp}, MP: ${actor.mp}, `;
            battleInfo += `ATK: ${actor.atk}, DEF: ${actor.def}, `;
            battleInfo += `MAT: ${actor.mat}, MDF: ${actor.mdf}, `;
            battleInfo += `AGI: ${actor.agi}, LUK: ${actor.luk}\n`;

            // Add ex-parameters using standard methods, converted to percentages with 3 decimal places
            battleInfo += `  Ex-Parameters:\n`;
            battleInfo += `    HIT: ${(actor.hit * 100).toFixed(3)}%\n`;
            battleInfo += `    EVA: ${(actor.eva * 100).toFixed(3)}%\n`;
            battleInfo += `    CRI: ${(actor.cri * 100).toFixed(3)}%\n`;
            battleInfo += `    CEV: ${(actor.cev * 100).toFixed(3)}%\n`;
            battleInfo += `    MEV: ${(actor.mev * 100).toFixed(3)}%\n`;
            battleInfo += `    MRF: ${(actor.mrf * 100).toFixed(3)}%\n`;
            battleInfo += `    CNT: ${(actor.cnt * 100).toFixed(3)}%\n`;
            battleInfo += `    HRG: ${(actor.hrg * 100).toFixed(3)}%\n`;
            battleInfo += `    MRG: ${(actor.mrg * 100).toFixed(3)}%\n`;
            battleInfo += `    TRG: ${(actor.trg * 100).toFixed(3)}%\n`;

            // Add sp-parameters using standard methods, converted to percentages with 3 decimal places
            battleInfo += `  Sp-Parameters:\n`;
            battleInfo += `    TGR: ${(actor.tgr * 100).toFixed(3)}%\n`;
            battleInfo += `    GRD: ${(actor.grd * 100).toFixed(3)}%\n`;
            battleInfo += `    REC: ${(actor.rec * 100).toFixed(3)}%\n`;
            battleInfo += `    PHA: ${(actor.pha * 100).toFixed(3)}%\n`;
            battleInfo += `    MCR: ${(actor.mcr * 100).toFixed(3)}%\n`;
            battleInfo += `    TCR: ${(actor.tcr * 100).toFixed(3)}%\n`;
            battleInfo += `    PDR: ${(actor.pdr * 100).toFixed(3)}%\n`;
            battleInfo += `    MDR: ${(actor.mdr * 100).toFixed(3)}%\n`;
            battleInfo += `    FDR: ${(actor.fdr * 100).toFixed(3)}%\n`;
            battleInfo += `    EXR: ${(actor.exr * 100).toFixed(3)}%\n`;

            // Add learned skills
            const learnedSkills = actor.skills().map(skill => skill.name).join(", ");
            battleInfo += `  Skills Learned: [${learnedSkills}]\n\n`;
        });
        
        battleInfo += "Enemies:\n";

        // Get the enemies that were present in the battle
        $gameTroop.members().forEach(enemy => {
            battleInfo += `- ${enemy.name()}: [HP: ${enemy.hp}, MP: ${enemy.mp}, `;
            battleInfo += `ATK: ${enemy.atk}, DEF: ${enemy.def}, `;
            battleInfo += `MAT: ${enemy.mat}, MDF: ${enemy.mdf}, `;
            battleInfo += `AGI: ${enemy.agi}, LUK: ${enemy.luk}]\n`;
        });

        // Add party's current gold
        const partyGold = $gameParty.gold();
        battleInfo += `\nParty's Gold: ${partyGold}`;

        return battleInfo.trim(); // Return the complete battle information
    };
})();
