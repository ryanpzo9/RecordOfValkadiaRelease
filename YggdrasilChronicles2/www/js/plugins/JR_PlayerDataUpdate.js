/*:
 * @plugindesc Updates player data variables and map switches.
 * @author JR
 * @help 
 * To turn ON Switch 1034 for a map, either:
 * 1. Add the Map ID to the 'mapIds' array in this script.
 * 2. OR: Type <TriggerSwitch1034> in the Note box of the Map Properties.
 */

window.MyGame_UpdatePlayerData = function() {
    // 1. Map Check (Array + Note Tag)
    const mapIds = [5,6,8,9,10,11,12,14,15,16,18,19,21,22,23,25,26,28,29,30,31,34,35,36,37,38,39,40,41,44,46,47,51,52,53,54,55,56,57,58,60,61,62,63,64,65,67,70,71,73,74,75,76,77,78,80,81,82,83,84,85,86,87,90,92,95,96,97,98,99,100,102,104,105,106,107,108,109,110,111,112,113,115,117,118,119,120,121,122];
    
    // This checks if the ID is in the list OR if the map note contains the tag
    const hasNoteTag = $dataMap && $dataMap.note.includes("<TriggerSwitch1034>");
    const isInList = mapIds.indexOf($gameMap.mapId()) !== -1;

    $gameSwitches.setValue(1034, isInList || hasNoteTag);

    // 2. Max Stats Setup (Loops 1-6)
    for (let i = 1; i < 7; i++) {
        let base = 1490 + (i * 10);
        if ($gameVariables.value(base + 5) <= 0) $gameVariables.setValue(base + 5, 3);
        if ($gameVariables.value(base + 6) <= 0) $gameVariables.setValue(base + 6, 8);
        if ($gameVariables.value(base + 7) <= 0) $gameVariables.setValue(base + 7, 1);
        $gameVariables.setValue(base + 8, "#{yepactorvar.unlimited}");
    }

    // 3. Highest Level & Highest JP
    let maxLvl = 0;
    let maxJp = 0;
    $gameParty.allMembers().forEach(actor => {
        if (actor.level > maxLvl) maxLvl = actor.level;
        if (typeof actor.getCurrentJp === 'function') {
            let totalJp = actor.getCurrentJp() + actor.getSpentJp();
            if (totalJp > maxJp) maxJp = totalJp;
        }
    });
    $gameVariables.setValue(897, maxLvl);
    $gameVariables.setValue(921, maxJp);

    // 4. Battle Member Levels & Averages
    let bMembers = $gameParty.battleMembers();
    let totalLvl = 0;
    for (let j = 0; j < 4; j++) {
        let lvl = (bMembers[j]) ? bMembers[j].level : 0;
        $gameVariables.setValue(901 + j, lvl);
        totalLvl += lvl;
    }
    let count = bMembers.length;
    $gameVariables.setValue(907, count);
    $gameVariables.setValue(905, totalLvl);
    let avg = (count > 0) ? Math.ceil(totalLvl / count) : 0;
    $gameVariables.setValue(906, avg);
};