const { logger } = require(`../../functions/logger`)

const { addCreatedDate } = require('../../functions/api/misc');
const { getServerMap, getAllMaps } = require('../../functions/api/maps');
const { getServerDisabledCommands, editServerCommands } = require('../../functions/api/guild');
const { getAliveCharacters, getNonPlayableCharacters } = require('../../functions/api/characters');
const { getServerQuestsByStatuses, getQuestsByStatuses, createQuest, deleteQuest, updateQuest } = require('../../functions/api/quests');
const { getBotCommandsByCategory } = require('../../functions/api/bot');
const { createGameSession, approveGameSession, declineGameSession, joinGameSession, updateGameSession, getAllGameSessions, getAllServerGameSessions } = require('../../functions/api/sessions');
const { editAllGameSessionsForWebsite, getPlayersData } = require('../../functions/website');
const { QUEST_ELEMENT_TEMPLATE, SESSION_EMBED_ELEMENT_TEMPLATE } = require('../../functions/templating');
const { getAllItems,getAllItemImagesNames } = require('../../functions/api/items');

exports.dashboardPage = async (req, res) => {
    res.render('dashboardPage', {
        ...res.locals.renderData,
        ...{
            isDashboardPage: true,
            headerTitle: 'Chthulu',
            characters: await getAliveCharacters(),
            allQuests: await getQuestsByStatuses(["OPEN", "DONE", "EXPIRED", "FAILED"]),
            sessions: await getAllGameSessions(),
            locations: await getAllMaps(),
        }
    });
}

exports.guildDashboardPage = async (req, res) => {
    res.render('dashboardPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: '',
            characters: await getAliveCharacters(res.locals.renderData?.selectedGuildId),
            allQuests: await getServerQuestsByStatuses(res.locals.renderData?.selectedGuildId, ["OPEN", "DONE", "EXPIRED", "FAILED"]),
            sessions: await getAllServerGameSessions(res.locals.renderData?.selectedGuildId),
            locations: await getServerMap(res.locals.renderData?.selectedGuildId),
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
    res.render('charactersPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: `Characters`,
            characters: (await getAliveCharacters(res.locals.renderData?.selectedGuildId)).reverse(),
        }
    });
}

//NPC'S PAGE
exports.guildInformationalNonPlayableCharactersDashboardPage = async (req, res) => {
    res.render('nonPlayableCharactersPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: `NPC's`,
            npcs: (await getNonPlayableCharacters(res.locals.renderData?.selectedGuildId)).reverse(),
        }
    });
}

//QUESTS PAGE
exports.guildInformationalQuestsDashboardPage = async (req, res) => {
    res.render('questsPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: `Quests`,
            uncompletedQuests: (await addCreatedDate((await getServerQuestsByStatuses(res.locals.renderData?.selectedGuildId, ["OPEN"])))).reverse(),
            completedQuests: (await getServerQuestsByStatuses(res.locals.renderData?.selectedGuildId, ["DONE", "EXPIRED", "FAILED"])).reverse(),
        }
    });
}

//CREATE QUEST POST
// TODO add validator on backend level
exports.createQuestPost = async (req, res) => {
    createQuest(req.body, req.params?.id, req.user?.discordID).then((quest) => {
        quest.HTMLElement = QUEST_ELEMENT_TEMPLATE({ quest: quest });
        res.json(quest);
    }).catch((error) => { res.status(400).send({ message: `${error.message}` }) });
}

exports.deleteQuestRequest = async (req, res) => {
    await deleteQuest(req.body?.quest_id, req.params?.id).then(() => { return res.sendStatus(200) }).catch(() => { return res.sendStatus(400) });
}

//TODO: Add validation with express validation
exports.editQuestRequest = async (req, res) => {
    await updateQuest(req.body, req.params?.id).then((quest) => {
        quest.HTMLElement = QUEST_ELEMENT_TEMPLATE({ quest: quest });
        res.json(quest);
    }).catch((error) => { res.status(400).send({ message: `${error.message}` }) });
}

exports.guildInformationalMapDashboardPage = async (req, res) => {
    res.render('mapPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: `Map`,
            databaseMap: await getServerMap(res.locals.renderData?.selectedGuildId),
        }
    });
}

//Sessions Page
exports.sessionsPage = async (req, res) => {
    res.render('sessionsPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: `Sessions`,
            sessions: await editAllGameSessionsForWebsite(await getAllServerGameSessions(res.locals.renderData?.selectedGuildId)),
            possiblePlayers: await getPlayersData(req.params?.id),
        }
    });
}

exports.createGameSession = async (req, res) => {
    await createGameSession(req.body, req.params?.id, req.user?.discordID).then(async session => {
        session = (await editAllGameSessionsForWebsite([session]))[0];
        session.HTMLElement = SESSION_EMBED_ELEMENT_TEMPLATE({ session: session });
        return res.json(session);
    }).catch((err) => { console.log(err); return res.status(400).json(err) });
}

//TODO: Add validation with express validation
exports.approveGameSession = async (req, res) => {
    await approveGameSession(req.body, req.params?.id, req.user?.discordID).then(async session => {
        session = (await editAllGameSessionsForWebsite([session]))[0];
        session.HTMLElement = SESSION_EMBED_ELEMENT_TEMPLATE({ session: session });
        return res.json(session);
    }).catch((error) => { res.status(400).send({ message: `${error}` }) });
}

//TODO: Add validation with express validation
exports.declineGameSession = async (req, res) => {
    await declineGameSession(req.body, req.params?.id, req.user?.discordID).then(async session => {
        session = (await editAllGameSessionsForWebsite([session]))[0];
        session.HTMLElement = SESSION_EMBED_ELEMENT_TEMPLATE({ session: session });
        return res.json(session);

    }).catch((error) => { console.log(error); res.status(400).send({ message: `${error}` }) });
}

//TODO: Add validation with express validation
exports.joinGameSession = async (req, res) => {
    await joinGameSession(req.body, req.params?.id, req.user?.discordID).then(message => { return res.json(message); }).catch((err) => { return res.status(400).json(err) });
}

//TODO: Add validation with express validation
exports.updateGameSession = async (req, res) => {
    await updateGameSession(req.body, req.params?.id, req.user?.discordID).then(async session => {
        session = (await editAllGameSessionsForWebsite([session]))[0];
        session.HTMLElement = SESSION_EMBED_ELEMENT_TEMPLATE({ session: session });
        return res.json(session);

    }).catch((error) => { res.status(400).send({ message: `${error}` }) });
}

//ITEMS PAGE
exports.guildLookupItemsDashboardPage = async (req, res) => {
    res.render('itemsPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: `Items`,
            allItems: await getAllItems(),
            IMG_NAMES: await getAllItemImagesNames(),
        }
    });
}


//SETTINGS PAGE
exports.guildSettingsPage = async (req, res) => {
    res.render('settingsPage', {
        ...res.locals.renderData,
        ...{
            isGuildDashboardPage: true,
            headerTitle: `Settings`,
            commands: getBotCommandsByCategory(req.url.split('/')[req.url.split('/').length - 1]),
            disabled_commands: await getServerDisabledCommands(res.locals.renderData?.selectedGuildId),
        }
    });
}

exports.editSettingsRequest = async (req, res) => {
    editServerCommands(res.locals.renderData?.selectedGuildId, req.body).then(() => { return res.sendStatus(201) }).catch(() => { return res.sendStatus(400) });
}