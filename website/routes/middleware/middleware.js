const { getMutualGuilds, getGuildFromBot, isUserAdminInGuild } = require('../../../functions/api');

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

    res.locals.renderData = {
        baseURL: process.env.WB_BASE_URL,
        port: process.env.WB_PORT,
        bot_icon: bot.user.avatarURL(),
        selectedGuildId: selectedGuildID,
        guild: guild,
        guildName: guild?.name || '',
        guilds: mutualGuilds,
        loggedInUser: loggedInUser,
        isAdmin: isUserAdminInGuild(req.user?.discordID, guild),
    }
    next();
}

module.exports = { isAlreadyLoggedIn, isAuthorized, centralizedData };
