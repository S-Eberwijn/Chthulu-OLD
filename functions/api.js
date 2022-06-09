const { logger } = require(`../functions/logger`)

const { PlayerCharacter } = require('../database/models/PlayerCharacter');
const { NonPlayableCharacter } = require('../database/models/NonPlayableCharacter');
const { Map } = require('../database/models/Maps');
const { Quest } = require('../database/models/Quest');
const { GeneralInfo } = require('../database/models/GeneralInfo');
const { GameSession } = require('../database/models/GameSession');


const Importance = Object.freeze({ 1: 'Very low', 2: 'Low', 3: 'Normal', 4: 'High', 5: 'Very high', });
const Category = Object.freeze({ 'information': 'Information', 'dnd': 'Dungeons & Dragons', 'general': 'General', 'miscellaneous': 'Miscellaneous', });

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

async function getDeadCharacters(guildId = null) {
    if (guildId === null) return await PlayerCharacter.findAll({ where: { alive: 0 } })
    return await PlayerCharacter.findAll({ where: { alive: 0, server: guildId } })
}

async function getNonPlayableCharacters(guildId = null) {
    if (guildId === null) return await NonPlayableCharacter.findAll({ where: { status: "VISIBLE" } })
    return await NonPlayableCharacter.findAll({ where: { status: "VISIBLE", server: guildId } })
}

async function getServerMap(serverID) {
    return await Map.findOne({ where: { id: serverID } })
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

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function sortByImportanceValue(a, b) {
    a = a.quest_importance_value
    b = b.quest_importance_value
    return a - b;
}

module.exports = {
    getBot,
    getBotGuilds, getMutualGuilds, getGuildFromBot, getBotCommandsByCategory,
    isUserInGuild, isUserAdminInGuild, cacheAllUsers, loadAllJSONFiles,
    getAliveCharacters, getNonPlayableCharacters, getDeadCharacters,
    getServerMap, getAllGameSessions, getAllServerGameSessions,
    getServerQuestsByStatuses, getQuestsByStatuses, createQuest, deleteQuest, updateQuest,
    getServerGeneralInfo, getServerDisabledCommands, editServerCommands
};