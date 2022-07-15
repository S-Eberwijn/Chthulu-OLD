const { logger } = require(`../../functions/logger`)

const { getBot } = require(`./bot`);
const { GeneralInfo } = require('../../database/models/GeneralInfo');


function getBotGuilds() {
    return getBot().guilds.cache;
}

function getGuildFromBot(guildID) {
    return getBot().guilds.cache.get(guildID);
}

async function cacheAllUsers(bot) {
    for (const guild of bot.guilds.cache.map(guild => guild)) {
        await guild.members.fetch();
        logger.debug(`Users from guild "${guild.name}" are loaded.`)
    }
}

async function getServerDisabledCommands(serverID) {
    return (await getServerGeneralInfo(serverID)).disabled_commands
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

async function getServerGeneralInfo(serverID) {
    return await GeneralInfo.findOne({ where: { id: serverID } })
}

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

module.exports = {
    getBotGuilds, getGuildFromBot, cacheAllUsers, getServerDisabledCommands, getServerGeneralInfo,
    getMutualGuilds, isUserInGuild, isUserAdminInGuild, getUserFromGuild, isDungeonMaster, editServerCommands
};