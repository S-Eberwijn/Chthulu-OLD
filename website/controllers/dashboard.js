const PlayerCharacter = require('../../database/models/PlayerCharacter');
const NonPlayableCharacter = require('../../database/models/NonPlayableCharacter');
const Quest = require('../../database/models/Quest');

exports.dashboardPage = async (req, res) => {
    const bot = require('../../index');
    let characters = await getAliveCharacters();

    res.render('dashboardPage', { isDashboardPage: true, bot: bot, headerTitle: 'Chthulu', guildName: '', characters: characters });
}

exports.guildDashboardPage = async (req, res) => {
    const bot = require('../../index');
    const guildId = req.params.id;
    const guild = bot.guilds.cache.get(guildId);
    let characters = await getAliveCharacters(guildId);

    res.render('dashboardPage', { isGuildDashboardPage: true, bot: bot, headerTitle: '', guild: guild, selectedGuildId: guildId, guildName: guild.name, characters: characters });
}

//CONSTRUCTION PAGE
exports.constructionDashboardPage = async (req, res) => {
    const bot = require('../../index');
    const guildId = req.params.id;
    const guild = bot.guilds.cache.get(guildId);


    res.render('constructionPage', { isGuildDashboardPage: true, bot: bot, headerTitle: '', guild: guild, selectedGuildId: guildId, guildName: guild.name });
}

//CHARACTERS PAGE
exports.guildInformationalCharactersDashboardPage = async (req, res) => {
    const bot = require('../../index');
    const guildId = req.params.id;
    const guild = bot.guilds.cache.get(guildId);

    let characters = await getAliveCharacters(guildId);

    res.render('charactersPage', { isGuildDashboardPage: true, bot: bot, headerTitle: `Characters`, guild: guild, selectedGuildId: guildId, guildName: guild.name, characters: characters.reverse() });
}

async function getAliveCharacters(guildId = null) {
    if (guildId === null) {
        return await PlayerCharacter.findAll({ where: { alive: 1 } })
    } else {
        return await PlayerCharacter.findAll({ where: { alive: 1, server_id: guildId } })
    }
}

//NPC'S PAGE
exports.guildInformationalNonPlayableCharactersDashboardPage = async (req, res) => {
    const bot = require('../../index');
    const guildId = req.params.id;
    const guild = bot.guilds.cache.get(guildId);

    let npcs = await getNonPlayableCharacters(guildId);
    res.render('nonPlayableCharactersPage', { isGuildDashboardPage: true, bot: bot, headerTitle: `NPC's`, guild: guild, selectedGuildId: guildId, guildName: guild.name, npcs: npcs.reverse() });
}

async function getNonPlayableCharacters(guildId = null) {
    if (guildId === null) {
        return await NonPlayableCharacter.findAll({ where: { status: "VISIBLE" } })
    } else {
        return await NonPlayableCharacter.findAll({ where: { status: "VISIBLE", server_id: guildId } })
    }
}

//QUESTS PAGE
exports.guildInformationalQuestsDashboardPage = async (req, res) => {
    const bot = require('../../index');
    const guildId = req.params.id;
    const guild = bot.guilds.cache.get(guildId);

    let completedQuests = await getQuests(guildId, "COMPLETED");
    let uncompletedQuests = await getQuests(guildId, "OPEN");

    res.render('questsPage', { isGuildDashboardPage: true, bot: bot, headerTitle: `Quests`, guild: guild, selectedGuildId: guildId, guildName: guild.name, uncompletedQuests: uncompletedQuests.reverse(), completedQuests: completedQuests.reverse() });
}

async function getQuests(guildId = null, status) {
    if (guildId === null) {
        let quests = await Quest.findAll();
        quests.sort(function (a, b) {
            a = a.get('quest_importance_value')
            b = b.get('quest_importance_value')
            return a - b;
        })
        return quests;
    } else {
        let quests = await Quest.findAll({ where: { quest_status: status, server_id: guildId } });
        quests.sort(function (a, b) {
            a = a.get('quest_importance_value')
            b = b.get('quest_importance_value')
            return a - b;
        })
        return quests;
    }
}

//CREATE QUEST POST
exports.createQuestPost = async (req, res) => {
    console.log(req.body);
    res.sendStatus(200)
}