const { PlayerCharacter } = require('../../database/models/PlayerCharacter');
const { NonPlayableCharacter } = require('../../database/models/NonPlayableCharacter');

const { getUserFromBot } = require(`./bot`);


async function getAliveCharacters(guildId = null) {
    if (guildId === null) return PlayerCharacter.findAll({ where: { alive: 1 } })
    const characters = await PlayerCharacter.findAll({ where: { alive: 1, server: guildId } })
    if (!characters) return []
    for (const character of characters) {   
        character.playerIcon = getUserFromBot(character.player_id_discord)?.displayAvatarURL();
    }
    return characters
}

async function getUserCharacter(userID, guildID) {
    return PlayerCharacter.findOne({ where: { player_id_discord: userID, server: guildID, alive: 1 } })
}

async function getDeadCharacters(guildId = null) {
    if (guildId === null) return PlayerCharacter.findAll({ where: { alive: 0 } })
    return PlayerCharacter.findAll({ where: { alive: 0, server: guildId } })
}

async function getNonPlayableCharacters(guildId = null) {
    if (guildId === null) return NonPlayableCharacter.findAll({ where: { status: "VISIBLE" } })
    return NonPlayableCharacter.findAll({ where: { status: "VISIBLE", server: guildId } })
}

module.exports = {
    getAliveCharacters, getNonPlayableCharacters, getDeadCharacters, getUserCharacter,
};

