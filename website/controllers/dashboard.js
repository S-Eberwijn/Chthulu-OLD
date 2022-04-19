const { PlayerCharacter } = require('../../database/models/PlayerCharacter');
const { NonPlayableCharacter } = require('../../database/models/NonPlayableCharacter');
const { Quest } = require('../../database/models/Quest');
const { GeneralInfo } = require('../../database/models/GeneralInfo');
const { Map } = require('../../database/models/Maps');

exports.dashboardPage = async (req, res) => {
    // TODO: Rate limiter is activated when I move from login to this screen.
    // TODO Maybe in stead of using discord api, use the existing bot to find the guilds the user is in.

    let characters = await getAliveCharacters();
    const allQuests = await getQuests();

    res.render('dashboardPage', {
        ...res.locals.renderData,
        ...{
            isDashboardPage: true,
            headerTitle: 'Chthulu',
            characters: characters,
            allQuests: allQuests,
        }
    });
}

exports.guildDashboardPage = async (req, res) => {
    const characters = await getAliveCharacters(res.locals.renderData?.selectedGuildId);
    const allGuildQuests = await getQuests(res.locals.renderData?.selectedGuildId, ["OPEN", "DONE", "EXPIRED", "FAILED"]);

    res.render('dashboardPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: '',
            characters: characters,
            allQuests: allGuildQuests,
        }
    });
}

//CONSTRUCTION PAGE
exports.constructionDashboardPage = async (req, res) => {
    res.render('constructionPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: '',
        }
    });
}


//CHARACTERS PAGE
exports.guildInformationalCharactersDashboardPage = async (req, res) => {
    let characters = await getAliveCharacters(res.locals.renderData?.selectedGuildId);

    res.render('charactersPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: `Characters`,
            characters: characters.reverse(),
        }
    });
}

async function getAliveCharacters(guildId = null) {
    if (guildId === null) {
        return await PlayerCharacter.findAll({ where: { alive: 1 } })
    } else {
        return await PlayerCharacter.findAll({ where: { alive: 1, server: guildId } })
    }
}

async function getDeadCharacters(guildId = null) {
    if (guildId === null) {
        return await PlayerCharacter.findAll({ where: { alive: 0 } })
    } else {
        return await PlayerCharacter.findAll({ where: { alive: 0, server: guildId } })
    }
}

//NPC'S PAGE
exports.guildInformationalNonPlayableCharactersDashboardPage = async (req, res) => {
    let npcs = await getNonPlayableCharacters(res.locals.renderData?.selectedGuildId);

    res.render('nonPlayableCharactersPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: `NPC's`,
            npcs: npcs.reverse(),
        }
    });
}

async function getNonPlayableCharacters(guildId = null) {
    if (guildId === null) {
        return await NonPlayableCharacter.findAll({ where: { status: "VISIBLE" } })
    } else {
        return await NonPlayableCharacter.findAll({ where: { status: "VISIBLE", server: guildId } })
    }
}

//QUESTS PAGE
exports.guildInformationalQuestsDashboardPage = async (req, res) => {
    let completedQuests = await getQuests(res.locals.renderData?.selectedGuildId, ["DONE", "EXPIRED", "FAILED"]);
    let uncompletedQuests = await getQuests(res.locals.renderData?.selectedGuildId, ["OPEN"]);

    res.render('questsPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: `Quests`,
            uncompletedQuests: uncompletedQuests.reverse(),
            completedQuests: completedQuests.reverse(),
        }
    });
}

async function getQuests(guildId = null, status) {
    if (guildId === null) {
        let quests = await Quest.findAll();
        quests.sort(function (a, b) {
            a = a.quest_importance_value
            b = b.quest_importance_value
            return a - b;
        })
        return quests;
    } else {
        let quests = [];
        // TODO new ORM cant handle arrays; fix this
        for (let index = 0; index < status.length; index++) {
            const element = status[index];
            quests = quests.concat(await Quest.findAll({ where: { quest_status: element, server: guildId } }))
            if (index === status.length - 1) {
                quests.sort(function (a, b) {
                    a = a.quest_importance_value
                    b = b.quest_importance_value
                    return a - b;
                })
                return quests;
            }
        }
    }
}

//CREATE QUEST POST
exports.createQuestPost = async (req, res) => {
    // TODO add validator on backend level
    let priority_value = Math.floor(parseInt(req.body.priority));
    if (priority_value < 1) {
        priority_value = 1;
    } else if (priority_value > 5) {
        priority_value = 5;
    }
    let importance = await getImportanceText(priority_value);
    let title = req.body.title?.substring(0, 30);
    let description = req.body.description?.substring(0, 400);

    let timestamp = Date.now();
    await Quest.create({
        id: `Q${timestamp}`,
        quest_id: `Q${timestamp}`,
        quest_giver: 'WEBSITE',
        quest_description: description,
        quest_name: title,
        quest_importance_value: priority_value,
        quest_importance: importance,
        quest_status: 'OPEN',
        server: req.params.id
    }).then(() => {
        res.sendStatus(201)
    })
}

async function getImportanceText(priority_value) {
    switch (priority_value) {
        case 5:
            return 'Very high'
        case 4:
            return 'High'
        case 3:
            return 'Normal'
        case 2:
            return 'Low'
        case 1:
            return 'Very low'
    }
}

exports.deleteQuestRequest = async (req, res) => {
    let quest_id = req.body?.quest_id;
    let server_id = req.params?.id || '0';
    if (quest_id) {

        await Quest.findOne({ where: { id: quest_id, server: server_id } }).then(async quest => {
            if (quest) {
                quest.quest_status = 'DELETED';
                await quest.save();
                res.sendStatus(201)
            }
        });
    }
}

//TODO: Add validation
exports.editQuestRequest = async (req, res) => {
    if (!req.body?.status) {
        let quest_id = req.body?.quest_id;
        let server_id = req.params?.id || '0';
        if (quest_id) {
            await Quest.findOne({ where: { id: quest_id, server: server_id } }).then(async quest => {
                console.log(quest);
                if (quest) {
                    quest.quest_name = req.body?.title;
                    quest.quest_description = req.body?.description;
                    quest.quest_importance_value = req.body?.priority;
                    quest.quest_importance = await getImportanceText(parseInt(req.body?.priority))
                    await quest.save();
                    res.sendStatus(201)
                }
            });
        }
    } else if (req.body?.status) {
        let quest_id = req.body?.quest_id;
        let server_id = req.params?.id || '0';
        if (quest_id) {
            await Quest.findOne({ where: { id: quest_id, server: server_id } }).then(async quest => {
                console.log(quest);
                if (quest) {
                    quest.quest_status = req.body?.status;
                    await quest.save();
                    res.sendStatus(201)
                }
            });
        }
    }
}

exports.guildInformationalMapDashboardPage = async (req, res) => {
    const map = await Map.findOne({ where: { id: res.locals.renderData?.selectedGuildId } });

    res.render('mapPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: `Map`,
            databaseMap: map,
        }
    });
}

//SETTINGS PAGE
exports.guildSettingsPage = async (req, res) => {
    const bot = require('../../index');

    let category = '';
    switch (req.url.split('/')[req.url.split('/').length - 1]) {
        case 'information':
            category = 'Information';
            break;
        case 'dnd':
            category = 'Dungeons & Dragons';
            break;
        case 'general':
            category = 'General';
            break;
        case 'miscellaneous':
            category = 'Miscellaneous';
            break;
        default:
            break;
    }

    const guildCommands = await res.locals.renderData?.guild.commands.cache.map(command => command.name)
    const possibleCommands = bot.slashCommands.filter(cmd => guildCommands.includes(cmd.help.name) && cmd.help.category == category).map(cmd => cmd.help)
    const allCommands = bot.slashCommands.filter(cmd => cmd.help.category == category).map(cmd => cmd.help)
    const server = await GeneralInfo.findOne({ where: { id: res.locals.renderData?.selectedGuildId } })

    // const userGuilds = bot.guilds.cache.filter(guild => req.user?.guilds.map(guild => guild.id).includes(guild.id))
    // const userGuilds = await getUserGuilds(req.user?.accT);
    // const botGuilds = getBotGuilds();
    // const mutualGuilds = getMutualGuilds(userGuilds, botGuilds)
    // const loggedInUser = req.user ? { username, discriminator, avatar } = req.user : undefined;


    res.render('settingsPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: `Settings`,
            commands: allCommands,
            disabled_commands: server.disabled_commands,
        }
    });
}

exports.editSettingsRequest = async (req, res) => {
    const bot = require('../../index');

    await GeneralInfo.findOne({ where: { id: res.locals.renderData?.selectedGuildId } }).then(async server => {
        try {
            if (server) {
                server.disabled_commands = server.disabled_commands.concat(req.body?.disabled_commands_array).filter(cmd => !req.body?.enabled_commands_array.includes(cmd)).filter(onlyUnique);
                server.save().then(() => {
                    // Takes a few seconds to adjust this before users can use the command in the server
                    bot.guilds.cache.get(res.locals.renderData?.selectedGuildId)?.commands.set(bot.slashCommands.filter(cmd => !server.disabled_commands.includes(cmd.help.name)).map(cmd => cmd.help))
                    res.sendStatus(201)
                });
            }
        } catch (error) {
            console.log(error)
        }
    })
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


