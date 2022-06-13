const { getMutualGuilds, getGuildFromBot, isUserAdminInGuild, isDungeonMaster } = require('../../../functions/api');

function isAlreadyLoggedIn(req, res, next) {
    if (req.user) return res.redirect('/dashboard/chthulu');
    next();
}

function isAuthorized(req, res, next) {
    if (req.user) return next();
    res.redirect('/')
}

async function centralizedData(req, res, next) {
    const bot = require('../../../index');
    const selectedGuildID = req.params.id || '';
    const guild = getGuildFromBot(selectedGuildID);
    const mutualGuilds = getMutualGuilds(req.user?.discordID);
    const loggedInUser = req.user ? { username, discriminator, avatar } = req.user : undefined;

    updateGuildsToAddNotification(req.user?.guildsToAddNotification, selectedGuildID).then(guildArray => { req.user.guildsToAddNotification = guildArray; req.session.save() }).catch(() => { });

    res.locals.renderData = {
        baseURL: process.env.APP_ENV === 'PROD' ? process.env.WB_BASE_URL : `${process.env.WB_BASE_URL}:${process.env.WB_PORT}`,
        bot_icon: bot.user.avatarURL(),
        selectedGuildId: selectedGuildID,
        guild: guild,
        guildName: guild?.name || '',
        guilds: mutualGuilds,
        guildsToAddNotification: req.user?.guildsToAddNotification,
        loggedInUser: loggedInUser,
        isAdmin: isUserAdminInGuild(req.user?.discordID, guild),
        isDungeonMaster: isDungeonMaster(req.user?.discordID, guild),
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
