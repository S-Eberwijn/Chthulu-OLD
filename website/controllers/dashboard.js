const PlayerCharacter = require('../../database/models/PlayerCharacter');

exports.dashboardPage = async (req, res) => {
    const bot = require('../../index');
    let characters = await getAliveCharacters();

    res.render('dashboardPage', { isDashboardPage: true, bot: bot, headerTitle: 'Chthulu', guildName: '', characters: characters });
}

exports.guildDashboardPage = async (req, res) => {
    const bot = require('../../index');
    const guildId = req.params.id;
    const guild = bot.guilds.cache.get(guildId);
    console.log(guild.name)
    let characters = await getAliveCharacters(guildId);

    res.render('dashboardPage', { isGuildDashboardPage: true, bot: bot, headerTitle: guild.name, guild: guild, selectedGuildId: guildId, guildName: guild.name, characters: characters });
}

exports.constructionDashboardPage = async (req, res) => {
    const bot = require('../../index');
    const guildId = req.params.id;
    const guild = bot.guilds.cache.get(guildId);


    res.render('constructionPage', { isGuildDashboardPage: true, bot: bot, headerTitle: guild.name, guild: guild, selectedGuildId: guildId, guildName: guild.name });
}

exports.guildInformationalCharactersDashboardPage = async (req, res) => {
    const bot = require('../../index');
    const guildId = req.params.id;
    const guild = bot.guilds.cache.get(guildId);

    let characters = await getAliveCharacters(guildId);

    res.render('charactersPage', { isGuildDashboardPage: true, bot: bot, headerTitle: `${guild.name} Characters`, guild: guild, selectedGuildId: guildId, guildName: guild.name, characters: characters.reverse() });
}

async function getAliveCharacters(guildId = null) {
    if (guildId === null) {
        return await PlayerCharacter.findAll({ where: { alive: 1 } })
    } else {
        return await PlayerCharacter.findAll({ where: { alive: 1, server_id: guildId } })
    }
}