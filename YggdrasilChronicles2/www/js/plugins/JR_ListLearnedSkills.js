/*:
 * @plugindesc Lists learned skills for an actor.
 * @help
 * This plugin adds a method to the Actor class that lists all learned skills.
 * Use the following script call to see the list of learned skills:
 *
 *   $gameActors.actor(actorId).listLearnedSkills();
 *
 * This will return a string containing the actor's name followed by the names
 * of all learned skills.
 */

(function() {
    // Adding a method to the Actor class
    Game_Actor.prototype.listLearnedSkills = function() {
        const actorName = this.name(); // Get the actor's name
        const skills = this.skills(); // Get the array of learned skills
        let skillList = `${actorName}:\n`; // Initialize the list with the actor's name

        // Append each skill's name to the skillList
        skills.forEach(function(skill) {
            skillList += `${skill.name}\n`; // Add skill name to the list
        });

        return skillList.trim(); // Trim any trailing newline
    };
})();
