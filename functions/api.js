const { logger } = require(`../functions/logger`)
const { MessageEmbed, Modal, TextInputComponent, MessageActionRow, MessageButton } = require('discord.js');

const { PlayerCharacter } = require('../database/models/PlayerCharacter');
const { NonPlayableCharacter } = require('../database/models/NonPlayableCharacter');
const { Map } = require('../database/models/Maps');
const { Quest } = require('../database/models/Quest');
const { GeneralInfo } = require('../database/models/GeneralInfo');
const { GameSession } = require('../database/models/GameSession');



const Importance = Object.freeze({ 1: 'Very low', 2: 'Low', 3: 'Normal', 4: 'High', 5: 'Very high', });
const Category = Object.freeze({ 'information': 'Information', 'dnd': 'Dungeons & Dragons', 'general': 'General', 'miscellaneous': 'Miscellaneous', });
const NAME_OF_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

//TODO: better naming, this is soley for sessions
const BUTTON_IDS = ['approve-session-request-button', 'decline-session-request-button', 'join-session-button', 'played-session-button', 'cancel-session-button', 'join-accepted-button', 'join-denied-button']

const MESSAGE_COMPONENTS_PLANNED = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId(BUTTON_IDS[3])
            .setLabel('Played')
            .setStyle('SUCCESS'),
        // .setEmoji('👍'),
        new MessageButton()
            .setCustomId(BUTTON_IDS[4])
            .setLabel('Cancel')
            .setStyle('DANGER'),
        // .setEmoji('✖️'),
        new MessageButton()
            .setCustomId(BUTTON_IDS[2])
            .setLabel('Join')
            .setStyle('SECONDARY')
            .setEmoji('🙋‍♂️'),
    );

function getBot() {
    return require('../index');
}

function getBotGuilds() {
    return getBot().guilds.cache;
}

function getBotCommands() {
    return getBot().slashCommands;
}

function getBotCommandsByCategory(category) {
    return getBotCommands().filter(cmd => cmd.help.category == Category[`${category}`]).map(cmd => cmd.help)
}

async function getServerDisabledCommands(serverID) {
    return (await getServerGeneralInfo(serverID)).disabled_commands
}

function getGuildFromBot(guildID) {
    return getBot().guilds.cache.get(guildID);
}

// For buffering the user cache (takes some time on start-up)
// IMPORTANT: It needs the bot directly since the export is not done yet before this function is called.
async function cacheAllUsers(bot) {
    for (const guild of bot.guilds.cache.map(guild => guild)) {
        await guild.members.fetch();
        logger.debug(`Users from guild "${guild.name}" are loaded.`)
    }
}

async function loadAllJSONFiles(bot) {
    bot.stupidQuestionTracker = await require("../bot/jsonDb/stupidQuestionTracker.json");
    bot.ressurection = await require("../bot/jsonDb/ressurection.json");
    bot.sessionAddUserRequest = await require("../bot/jsonDb/sessionAddUserRequest.json");
    logger.debug(`All local JSON databases have been loaded.`)
}

function getUserFromBot(userID) {
    return getBot().users.cache.get(userID);
}

//TODO: I think the cache is cleared after some time, might need a fix?
function getMutualGuilds(userID) {
    return getBotGuilds().filter(guild => guild.members.cache.has(userID));
}

async function isUserInGuild(userID, guild) {
    return guild.members.cache.has(userID);
}

function isUserAdminInGuild(userID, guild) {
    return guild?.members.cache.get(userID)?.permissions.has('ADMINISTRATOR') || false;
}
function getUserFromGuild(userID, guild) {
    return guild?.members?.cache.get(userID)
}

function isDungeonMaster(userID, guild) {
    const DUNGEON_MASTER_ROLE = guild?.roles.cache.find(role => role.name.toLowerCase().includes('dungeon master'));
    return guild?.members.cache.get(userID)?.roles.cache.has(DUNGEON_MASTER_ROLE?.id) || false;
}

async function getAliveCharacters(guildId = null) {
    if (guildId === null) return await PlayerCharacter.findAll({ where: { alive: 1 } })
    const characters = await PlayerCharacter.findAll({ where: { alive: 1, server: guildId } })
    if (!characters) return []
    // console.log(characters)
    for (let index = 0; index < characters.length; index++) {
        const character = characters[index];
        // await console.log(character.name)
        character.playerIcon = await getUserFromBot(character.player_id_discord)?.displayAvatarURL();
        // await console.log(character.playerIcon)
    }
    return characters
    // return 
}

async function getUserCharacter(userID, guildID) {
    return PlayerCharacter.findOne({ where: { player_id_discord: userID, server: guildID, alive: 1 } })
}

async function getDeadCharacters(guildId = null) {
    if (guildId === null) return await PlayerCharacter.findAll({ where: { alive: 0 } })
    return await PlayerCharacter.findAll({ where: { alive: 0, server: guildId } })
}

async function getNonPlayableCharacters(guildId = null) {
    if (guildId === null) return await NonPlayableCharacter.findAll({ where: { status: "VISIBLE" } })
    return await NonPlayableCharacter.findAll({ where: { status: "VISIBLE", server: guildId } })
}

async function getServerMap(serverID) {
    const map = await Map.findOne({ where: { id: serverID } })
    return map ? [map] : []
}

async function getAllMaps() {
    return await Map.findAll()
}

async function getServerGeneralInfo(serverID) {
    return await GeneralInfo.findOne({ where: { id: serverID } })
}


async function getServerQuestsPerStatus(serverID, status) {
    return await Quest.findAll({ where: { quest_status: status, server: serverID } })
}

async function getServerQuestsByStatuses(serverID, statuses) {
    let quests = [];
    for (let index = 0; index < statuses.length; index++) {
        quests = quests.concat(await getServerQuestsPerStatus(serverID, statuses[index]));
        if (index === statuses.length - 1) return quests.sort((a, b) => sortByImportanceValue(a, b));
    }
}

async function getQuestsPerStatus(status) {
    return await Quest.findAll({ where: { quest_status: status, } })
}

async function getQuestsByStatuses(statuses) {
    let quests = [];
    for (let index = 0; index < statuses.length; index++) {
        quests = quests.concat(await getQuestsPerStatus(statuses[index]));
        if (index === statuses.length - 1) return quests.sort((a, b) => sortByImportanceValue(a, b));
    }
}


async function createQuest(quest, guildID, creatorID) {
    let timestamp = Date.now();
    return await Quest.create({
        id: `Q${timestamp}`,
        quest_identifier: `Q${timestamp}`, quest_giver: creatorID,
        quest_description: quest.description,
        quest_name: quest.title,
        quest_importance_value: quest.priority,
        quest_importance: Importance[quest.priority],
        quest_status: 'OPEN',
        server: guildID
    })
}

async function deleteQuest(questID, serverID) {
    let quest = await Quest.findOne({ where: { quest_identifier: questID, server: serverID } });
    return new Promise((resolve, reject) => {
        if (!quest) return reject()
        quest.quest_status = 'DELETED';
        quest.save();
        return resolve()
    });
}

async function updateQuest(questData, serverID) {
    const quest = await Quest.findOne({ where: { quest_identifier: questData?.quest_id, server: serverID } })
    return new Promise((resolve, reject) => {
        if (!quest) return reject()
        if (questData.status) {
            quest.quest_status = questData?.status;
            quest.save();
            return resolve();
        } else if (!questData.status) {
            quest.quest_name = questData?.title;
            quest.quest_description = questData?.description;
            quest.quest_importance_value = questData?.priority;
            quest.quest_importance = Importance[questData?.priority];
            quest.save();
            return resolve();
        }
        return reject();
    });
}

async function editServerCommands(serverID, commands) {
    const server = await getServerGeneralInfo(serverID);
    return new Promise((resolve, reject) => {
        if (!server) return reject()
        server.disabled_commands = server.disabled_commands.concat(commands?.disabled_commands_array).filter(cmd => !commands?.enabled_commands_array.includes(cmd)).filter(onlyUnique);
        server.save().then(() => {
            getBot().guilds.cache.get(serverID)?.commands.set(getBot().slashCommands.filter(cmd => !server.disabled_commands.includes(cmd.help.name)).map(cmd => cmd.help));
            return resolve();
        }).catch(() => {
            return reject();
        });
    });
}

async function getAllGameSessions() {
    return await GameSession.findAll();
}

async function getAllServerGameSessions(serverID) {
    return await GameSession.findAll({ where: { server: serverID } });
}

async function approveGameSession(sessionData, serverID, userID) {

    const { editAllGameSessionsForWebsite } = require('./website');
    //TODO: Change to a resolve or reject state
    // if (!isDungeonMaster(userID, serverID)) console.log("You are not allowed to approve a game session - not a dungeon master")

    // if(!sessionData.gameSessionID) throw Error("No gameSessionID provided");
    // if(!userID) throw Error("No userID provided");
    // if(!sessionData.serverID) throw Error("No serverID provided");

    let GAME_SESSION = await GameSession.findOne({ where: { id: sessionData.gameSessionID, server: serverID } });
    const GENERAL_SERVER_INFO = await GeneralInfo.findOne({ where: { server: serverID } });

    const SESSION_REQUEST_CHANNEL = getGuildFromBot(serverID)?.channels.cache.find(c => c.name.includes("session-request") && c.type == "GUILD_TEXT");
    const PLANNED_SESSIONS_CHANNEL = getGuildFromBot(serverID)?.channels.cache.find(c => c.name.includes("planned-session") && c.type == "GUILD_TEXT");

    const GAME_SESSION_MESSAGE = await fetchGameSessionMessage(SESSION_REQUEST_CHANNEL, PLANNED_SESSIONS_CHANNEL, GAME_SESSION.message_id_discord)

    return new Promise((resolve, reject) => {
        if (!GAME_SESSION) return reject();

        PLANNED_SESSIONS_CHANNEL?.send({ embeds: [editRequestSessionEmbedToPlannedSessionEmbed(userID, GENERAL_SERVER_INFO.session_number, GAME_SESSION_MESSAGE.embeds[0])], components: [MESSAGE_COMPONENTS_PLANNED] }).then(async PLANNED_SESSION_MESSAGE => {
            getGuildFromBot(serverID)?.channels.cache.get(GAME_SESSION.session_channel)?.setName(`session-${GENERAL_SERVER_INFO.session_number}`)
            updatePartyNextSessionId(GAME_SESSION.session_party, PLANNED_SESSION_MESSAGE.id, serverID);

            await updateGameSessionMessageId(GAME_SESSION, PLANNED_SESSION_MESSAGE.id);
            await updateGameSessionStatus(GAME_SESSION, 'PLANNED')
            await updateGameSessionNumber(GAME_SESSION, GENERAL_SERVER_INFO.session_number)
            await updateGameSessionDungeonMaster(GAME_SESSION, userID)

            updateGeneralServerSessionNumber(GENERAL_SERVER_INFO, GENERAL_SERVER_INFO.session_number + 1)

            GAME_SESSION_MESSAGE.delete();

            GAME_SESSION = await editAllGameSessionsForWebsite([GAME_SESSION]);

            // console.log(GAME_SESSION[0])

            GAME_SESSION[0].data.message = 'The session has been successfully approved.'
            return resolve(GAME_SESSION[0].data);
        })
    });
}

async function declineGameSession() {

}

async function joinGameSession() {

}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function sortByImportanceValue(a, b) {
    a = a.quest_importance_value
    b = b.quest_importance_value
    return a - b;
}

function getPrettyDateString(date) {
    return `${NAME_OF_DAYS[date.getUTCDay()]} (${getDoubleDigitNumber(date.getUTCDate())}/${getDoubleDigitNumber(date.getUTCMonth() + 1)}/${date.getYear() + 1900}) ${getDoubleDigitNumber(date.getUTCHours())}:${getDoubleDigitNumber(date.getUTCMinutes())}`;
}

function getSimpleDateString(date) {
    return `${getDoubleDigitNumber(date.getUTCDate())}/${getDoubleDigitNumber(date.getUTCMonth() + 1)}/${date.getYear() + 1900}`;
}

function getDoubleDigitNumber(number) {
    if (!(typeof number === 'number' || typeof number === 'string')) return '00';
    if (parseInt(number) < 10) return `0${number}`;
    return `${number}`;
}


async function addCreatedDate(array) {
    for (const object of array) {
        object.data.created_date = await getSimpleDateString(new Date(parseInt(object.data.quest_identifier.slice(1))));
    }
    return array
}

async function fetchGameSessionMessage(SESSION_REQUEST_CHANNEL, PLANNED_SESSIONS_CHANNEL, messageID) {
    try {
        let foundMessage = await SESSION_REQUEST_CHANNEL.messages.fetch(messageID).catch(() => console.log('Message not found'));
        foundMessage = foundMessage != null ? foundMessage : await PLANNED_SESSIONS_CHANNEL.messages.fetch(messageID).catch(() => console.log('Message not found'));
        return foundMessage;
    } catch (error) {
        console.log(error);
    }
}

function editRequestSessionEmbedToPlannedSessionEmbed(dungeonMasterId, sessionNumber, editedEmbed) {
    editedEmbed.fields[2].value = `<@!${dungeonMasterId}>`;
    editedEmbed.setTitle(`**Session ${sessionNumber}: **`);
    return editedEmbed;
}

function updatePartyNextSessionId(party, next_session_id, serverId) {
    //TODO: change to for of loop
    party.forEach(async player => {
        await PlayerCharacter.findOne({ where: { player_id_discord: player, alive: 1, server: serverId } }).then(character => {
            character.next_session = next_session_id;
            character.save();
        });
    });
}

async function updateGameSessionStatus(session, session_status) {
    session.session_status = session_status;
    await session.save();
}
async function updateGameSessionMessageId(session, new_message_id) {
    session.message_id_discord = new_message_id;
    await session.save();
}

async function updateGameSessionNumber(session, session_number) {
    session.session_number = session_number;
    await session.save();
}

async function updateGameSessionParty(session, session_party) {
    session.session_party = session_party;
    await session.save();
}

async function updateGameSessionDungeonMaster(session, dungeon_master_id) {
    session.dungeon_master_id_discord = dungeon_master_id;
    await session.save();
}


async function updateGeneralServerSessionNumber(server, next_session_number) {
    server.session_number = next_session_number;
    await server.save();
}

module.exports = {
    getBot,
    getBotGuilds, getMutualGuilds, getGuildFromBot, getBotCommandsByCategory,
    isUserInGuild, isUserAdminInGuild, isDungeonMaster, cacheAllUsers, loadAllJSONFiles,
    getAliveCharacters, getNonPlayableCharacters, getDeadCharacters, getUserFromBot, getUserFromGuild, getUserCharacter,
    getServerMap, getAllMaps, getAllGameSessions, getAllServerGameSessions, getDoubleDigitNumber,
    getServerQuestsByStatuses, getQuestsByStatuses, createQuest, deleteQuest, updateQuest,
    getServerGeneralInfo, getServerDisabledCommands, editServerCommands,
    getPrettyDateString, onlyUnique, addCreatedDate,
    approveGameSession, declineGameSession, joinGameSession, fetchGameSessionMessage, editRequestSessionEmbedToPlannedSessionEmbed,
    updatePartyNextSessionId, updateGameSessionStatus, updateGameSessionMessageId, updateGameSessionNumber, updateGameSessionParty, updateGeneralServerSessionNumber,
    updateGameSessionDungeonMaster,
};