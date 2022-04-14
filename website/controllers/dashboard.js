const { PlayerCharacter } = require('../../database/models/PlayerCharacter');
const { NonPlayableCharacter } = require('../../database/models/NonPlayableCharacter');
const { Quest } = require('../../database/models/Quest');
const { GeneralInfo } = require('../../database/models/GeneralInfo');
const { Map } = require('../../database/models/Maps');

exports.dashboardPage = async (req, res) => {
    req.session.lastVisitedPage = req.url;
    // console.log(req.user)

    const bot = require('../../index');
    let characters = await getAliveCharacters();
    let deadCharacters = await getDeadCharacters();
    const allQuests = await getQuests();
    const userGuilds = bot.guilds.cache.filter(guild => req.user?.guilds.map(guild => guild.id).includes(guild.id))

    res.render('dashboardPage', {
        isDashboardPage: true,
        bot: bot,
        guilds:
            userGuilds || [],
        // await bot.guilds.cache.filter(async (guild) => {
        //     foundUser = await guild.members.fetch(req.session.loggedInUserID)
        //     if (foundUser) {
        //         return guild.members.cache.has(req.session.loggedInUserID);
        //     }
        // }),
        headerTitle: 'Chthulu',
        guildName: '',
        characters: characters,
        deadCharactersCount: deadCharacters.length,
        allQuests: allQuests,
        userLoggedIn: req.user ? true : false,
    });
}

exports.guildDashboardPage = async (req, res) => {
    req.session.lastVisitedPage = req.url;

    const bot = require('../../index');
    const guildId = req.params.id;
    // console.log(guildId);
    const guild = bot.guilds.cache.get(guildId);
    let characters = await getAliveCharacters(guildId);
    let deadCharacters = await getDeadCharacters(guildId);
    const allGuildQuests = await getQuests(guildId, ["OPEN", "DONE", "EXPIRED", "FAILED"]);
    const userGuilds = bot.guilds.cache.filter(guild => req.user?.guilds.map(guild => guild.id).includes(guild.id))

    res.render('dashboardPage', {
        isGuildDashboardPage: true,
        bot: bot,
        guilds: userGuilds || [],
        headerTitle: '',
        guild: guild,
        selectedGuildId: guildId,
        guildName: guild?.name,
        characters: characters,
        deadCharactersCount: deadCharacters.length,
        allQuests: allGuildQuests,
        userLoggedIn: req.user ? true : false,
    });
}

//CONSTRUCTION PAGE
exports.constructionDashboardPage = async (req, res) => {
    req.session.lastVisitedPage = req.url;

    const bot = require('../../index');
    const guildId = req.params.id || '';
    const guild = bot.guilds.cache.get(guildId);
    // req.user?.guilds.filter(guild => bot.guilds.cache.has(guild.id))
    const userGuilds = bot.guilds.cache.filter(guild => req.user?.guilds.map(guild => guild.id).includes(guild.id))

    res.render('constructionPage', {
        isGuildDashboardPage: true,
        bot: bot,
        guilds:
            userGuilds || [],
        // await bot.guilds.cache.filter(async (guild) => {
        //     foundUser = await guild.members.fetch(req.session.loggedInUserID)
        //     if (foundUser) {
        //         return guild.members.cache.has(req.session.loggedInUserID);
        //     }
        // }),
        headerTitle: '',
        guild: guild,
        selectedGuildId: guildId,
        guildName: guild?.name || '',
        userLoggedIn: req.user ? true : false,
    });
}


//CHARACTERS PAGE
exports.guildInformationalCharactersDashboardPage = async (req, res) => {
    req.session.lastVisitedPage = req.url;

    const bot = require('../../index');
    const guildId = req.params.id;
    const guild = bot.guilds.cache.get(guildId);

    let characters = await getAliveCharacters(guildId);
    console.log(req.session.isLoggedIn)

    res.render('charactersPage', {
        isGuildDashboardPage: true,
        bot: bot,
        guilds: await bot.guilds.cache.filter(async (guild) => {
            foundUser = await guild.members.fetch(req.session.loggedInUserID)
            if (foundUser) {
                return guild.members.cache.has(req.session.loggedInUserID);
            }
        }),
        headerTitle: `Characters`,
        guild: guild,
        selectedGuildId: guildId,
        guildName: guild.name,
        characters: characters.reverse(),
        userLoggedIn: req.user ? true : false,
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
    req.session.lastVisitedPage = req.url;

    const bot = require('../../index');
    const guildId = req.params.id;
    const guild = bot.guilds.cache.get(guildId);

    let npcs = await getNonPlayableCharacters(guildId);
    res.render('nonPlayableCharactersPage', {
        isGuildDashboardPage: true,
        bot: bot,
        guilds: await bot.guilds.cache.filter(async (guild) => {
            foundUser = await guild.members.fetch(req.session.loggedInUserID)
            if (foundUser) {
                return guild.members.cache.has(req.session.loggedInUserID);
            }
        }),
        headerTitle: `NPC's`,
        guild: guild,
        selectedGuildId: guildId,
        guildName: guild.name,
        npcs: npcs.reverse(),
        userLoggedIn: req.user ? true : false,
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
    req.session.lastVisitedPage = req.url;

    const bot = require('../../index');
    const guildId = req.params.id;
    const guild = bot.guilds.cache.get(guildId);

    let completedQuests = await getQuests(guildId, ["DONE", "EXPIRED", "FAILED"]);
    let uncompletedQuests = await getQuests(guildId, ["OPEN"]);

    res.render('questsPage', {
        isGuildDashboardPage: true,
        bot: bot,
        guilds: await bot.guilds.cache.filter(async (guild) => {
            foundUser = await guild.members.fetch(req.session.loggedInUserID)
            if (foundUser) {
                return guild.members.cache.has(req.session.loggedInUserID);
            }
        }),
        headerTitle: `Quests`,
        guild: guild,
        selectedGuildId: guildId,
        guildName: guild.name,
        uncompletedQuests: uncompletedQuests.reverse(),
        completedQuests: completedQuests.reverse(),
        userLoggedIn: req.user ? true : false,
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
            // console.log(await Quest.findAll({ where: { quest_status: element, server_id: guildId } }))

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
            // console.log(quest);
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
    // console.log(req.body.status)
    if (!req.body?.status) {
        let quest_id = req.body?.quest_id;
        let server_id = req.params?.id || '0';
        console.log(quest_id)
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
    req.session.lastVisitedPage = req.url;

    const bot = require('../../index');
    const guildId = req.params.id;
    const guild = bot.guilds.cache.get(guildId);

    const map = await Map.findOne({ where: { id: guildId } });
    // console.log(map)

    res.render('mapPage', {
        isGuildDashboardPage: true,
        bot: bot,
        guilds: await bot.guilds.cache.filter(async (guild) => {
            foundUser = await guild.members.fetch(req.session.loggedInUserID)
            if (foundUser) {
                return guild.members.cache.has(req.session.loggedInUserID);
            }
        }),
        headerTitle: `Map`,
        guild: guild,
        selectedGuildId: guildId,
        guildName: guild.name,
        databaseMap: map,
        userLoggedIn: req.user ? true : false,
    });
}

//SETTINGS PAGE
exports.guildSettingsPage = async (req, res) => {
    req.session.lastVisitedPage = req.url;

    const bot = require('../../index');
    const guildId = req.params.id;
    const guild = bot.guilds.cache.get(guildId);

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

    const guildCommands = await guild.commands.cache.map(command => command.name)
    const possibleCommands = bot.slashCommands.filter(cmd => guildCommands.includes(cmd.help.name) && cmd.help.category == category).map(cmd => cmd.help)
    const allCommands = bot.slashCommands.filter(cmd => cmd.help.category == category).map(cmd => cmd.help)
    const server = await GeneralInfo.findOne({ where: { id: guildId } })
    res.render('settingsPage', {
        isGuildDashboardPage: true,
        bot: bot,
        guilds: await bot.guilds.cache.filter(async (guild) => {
            foundUser = await guild.members.fetch(req.session.loggedInUserID)
            if (foundUser) {
                return guild.members.cache.has(req.session.loggedInUserID);
            }
        }),
        headerTitle: `Settings`,
        guild: guild,
        selectedGuildId: guildId,
        guildName: guild.name,
        commands: allCommands,
        disabled_commands: server.disabled_commands,
        userLoggedIn: req.user ? true : false,
    });
}

exports.editSettingsRequest = async (req, res) => {
    const bot = require('../../index');

    const guildId = req.params.id;

    await GeneralInfo.findOne({ where: { id: guildId } }).then(async server => {
        try {
            if (server) {
                server.disabled_commands = server.disabled_commands.concat(req.body?.disabled_commands_array).filter(cmd => !req.body?.enabled_commands_array.includes(cmd)).filter(onlyUnique);
                server.save().then(() => {
                    // Takes a few seconds to adjust this before users can use the command in the server
                    bot.guilds.cache.get(guildId)?.commands.set(bot.slashCommands.filter(cmd => !server.disabled_commands.includes(cmd.help.name)).map(cmd => cmd.help))
                    res.sendStatus(201)

                });
                // server.disabled_commands.forEach(cmd_name => {
                //     bot.guilds.cache.get(guildId).commands.cache.find(c => c.name === `${cmd_name}`)?.delete() 
                // })

            }
        } catch (error) {
            console.log(error)
        }
    })
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}


