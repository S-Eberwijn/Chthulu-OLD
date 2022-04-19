const { getBotGuilds, getUserGuilds, getMutualGuilds, getGuildFromBot } = require('../../../functions/api');

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

    // const userGuilds = await getUserGuilds(req.user?.accT);
    // const botGuilds = getBotGuilds();

    // const mutualGuilds = getMutualGuilds(await getUserGuilds(req.user?.accT), getBotGuilds());
    const mutualGuilds = getMutualGuilds(req.user?.discordID);

    const loggedInUser = req.user ? { username, discriminator, avatar } = req.user : undefined;

    res.locals.renderData = {
        bot_icon: bot.user.avatarURL(),
        selectedGuildId: selectedGuildID,
        guild: guild,
        guildName: guild?.name || '',
        guilds: mutualGuilds,
        loggedInUser: loggedInUser,
        isAdmin: true,
    }
    // console.log(await (await guild.members.fetch(req.user?.id)).permissions.has('ADMINISTRATOR'))
    next();
}

module.exports = { isAlreadyLoggedIn, isAuthorized, centralizedData };
