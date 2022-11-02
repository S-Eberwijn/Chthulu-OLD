//TODO: revese logic of updateGuildsToAddNotification function
//TODO: remake access and refresh token system in sessions (website)
//TODO: When cache is cleared, users are loaded, but the guild icon still remains empty (website)

const { getBot } = require('../../../functions/api/bot');
const { getUserCharacter } = require('../../../functions/api/characters');
const { getMutualGuilds, isUserAdminInGuild, isDungeonMaster, getGuildFromBot, cacheAllUsers } = require('../../../functions/api/guild');

function isAlreadyLoggedIn(req, res, next) {
    if (req.user) return res.redirect('/dashboard/chthulu');
    next();
}

function isAuthorized(req, res, next) {
    if (req.user) return next();
    res.redirect('/')
}

async function centralizedData(req, res, next) {
    const bot = getBot();
    const selectedGuildID = req.params.id || '';

    // Reload cache, if no members can be found in guilds (or if chthulu is selected), might take a while in PROD environment.
    if (bot.guilds.cache.get(selectedGuildID)?.members.cache.size < 2 || bot.guilds.cache.get(selectedGuildID)?.members.cache.size === undefined) await cacheAllUsers(bot)

    const guild = getGuildFromBot(selectedGuildID);
    const mutualGuilds = getMutualGuilds(req.user?.discordID);



    updateGuildsToAddNotification(req.user?.guildsToAddNotification, selectedGuildID).then(guildArray => { req.user.guildsToAddNotification = guildArray; req.session.save() }).catch(() => { });

    res.locals.renderData = {
        baseURL: process.env.APP_ENV === 'PROD' ? process.env.WB_BASE_URL : `${process.env.WB_BASE_URL}:${process.env.WB_PORT}`,
        bot_icon: bot.user.avatarURL(),
        selectedGuildId: selectedGuildID,
        guild: guild,
        guildName: guild?.name || '',
        guilds: mutualGuilds,
        guildsToAddNotification: req.user?.guildsToAddNotification,
        loggedInUser: req.user ? { username, discriminator, avatar, discordID } = req.user : undefined,
        isAdmin: isUserAdminInGuild(req.user?.discordID, guild),
        isDungeonMaster: isDungeonMaster(req.user?.discordID, guild),
        userCharacter: isDungeonMaster(req.user?.discordID, guild) ? undefined : await getUserCharacter(req.user?.discordID, selectedGuildID),
    }
    next();
}

function updateGuildsToAddNotification(guildsArray, selectedGuildID) {
    if (guildsArray === []) return;
    return new Promise((resolve, reject) => {
        guildsArray.includes(selectedGuildID) ? reject() : guildsArray.push(selectedGuildID);
        resolve(guildsArray);
    })
}

module.exports = { isAlreadyLoggedIn, isAuthorized, centralizedData };
