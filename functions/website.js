const { getPrettyDateString, getDoubleDigitNumber } = require("./api/misc");
const { getUserCharacter } = require("./api/characters");

const { getGuildFromBot, getUserFromGuild } = require("./api/guild");

/**
 * @param {[]} sessions - An array of game sessions.
 */
async function editAllGameSessionsForWebsite(sessions) {
    for (const session of sessions) {
        const guild = await getGuildFromBot(session.server);

        // Get the user information from each party member.
        for (const key in session.session_party) {
            if (Object.hasOwnProperty.call(session.session_party, key)) {
                const element = session.session_party[key];
                session.session_party[key] = (await getUserFromGuild(element, guild)) || { username: 'Unknown' };
            }
        }

        // Set session commander player character.
        session.session_commander = await getUserCharacter(session.session_commander, guild.id);

        // Get the user information from the DM.
        session.dungeon_master_id_discord = await getUserFromGuild(session.dungeon_master_id_discord, guild);
        // Get the correct date string output.
        session.date = getPrettyDateString(new Date(session.date))
        // Get created date of game session.
        let createdDate = new Date(parseInt(session.id.slice(2)))
        // console.log(createdDate.split("T")[0].split("-"))
        session.created = `${getDoubleDigitNumber(createdDate.getUTCDate())}/${getDoubleDigitNumber(createdDate.getUTCMonth() + 1)}/${createdDate.getUTCFullYear()}`;

    }
    return sessions
}



module.exports = {
    editAllGameSessionsForWebsite
};