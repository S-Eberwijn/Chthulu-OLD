const { getPrettyDateString, getDoubleDigitNumber } = require("./api/misc");
const { getUserCharacter, getAliveCharacters } = require("./api/characters");

const { getGuildFromBot, getUserFromGuild, getUsersFromGuild } = require("./api/guild");

/**
 * @param {[]} sessions - An array of game sessions.
 */
async function editAllGameSessionsForWebsite(sessions) {
    for (const session of sessions) {

        const guild = await getGuildFromBot(session.server);

        // Get the user information from each party member.
        for (const key in session.session_party) {
            if (Object.hasOwnProperty.call(session.session_party, key)) {
                const playerID = session.session_party[key];
                session.session_party[key] = (await getUserFromGuild(playerID, guild)).user || { username: 'Unknown' };
            }
        }

        // Set session commander player character.
        session.session_commander = await getUserCharacter(session.session_commander, guild.id);
        session.session_commander.player = (await getUserFromGuild(session.session_commander.player_id_discord, guild)).user;
        // Get the user information from the DM.
        session.dungeon_master_id_discord = await getUserFromGuild(session.dungeon_master_id_discord, guild);
        // Get the correct date string output.
        session.date = getPrettyDateString(new Date(session.date))
        // Get created date of game session.
        let createdDate = new Date(parseInt(session.id.slice(2)))
        // console.log(createdDate.split("T")[0].split("-"))
        session.created = `${getDoubleDigitNumber(createdDate.getUTCDate())}/${getDoubleDigitNumber(createdDate.getUTCMonth() + 1)}/${createdDate.getUTCFullYear()}`;

    }
    // console.log(sessions)
    return sessions
}

async function getPlayersData(guildID){
    const CHARACTER_INFO = (await getAliveCharacters(guildID)).map(character => {return {id:character.player_id_discord, name:character.name}})
    const PLAYER_IDS = CHARACTER_INFO.map(character => character.id)
    return getUsersFromGuild(guildID).filter(user => user.user.bot == false && PLAYER_IDS.includes(user.id)).map(user => {return {id: user.id, username: user.user.username, avatarURL: user.displayAvatarURL({dynamic: true}), characterName: CHARACTER_INFO.find(character => character.id == user.id).name}});
} 


module.exports = {
    editAllGameSessionsForWebsite, getPlayersData
};