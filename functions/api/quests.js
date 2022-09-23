const { logger } = require(`../../functions/logger`)

const { Quest } = require('../../database/models/Quest');
const Importance = Object.freeze({ 1: 'Very low', 2: 'Low', 3: 'Normal', 4: 'High', 5: 'Very high', });


async function getServerQuestsPerStatus(serverID, status) {
    return await Quest.findAll({ where: { quest_status: status, server: serverID } })
}

async function getServerQuestsByStatuses(serverID, statuses) {
    let quests = [];
    for (let index = 0; index < statuses.length; index++) {
        quests = quests.concat(await getServerQuestsPerStatus(serverID, statuses[index]));
        if (index === statuses.length - 1) return quests.sort((a, b) => sortByImportanceValue(a, b));
    }
}

async function getQuestsPerStatus(status) {
    return await Quest.findAll({ where: { quest_status: status, } })
}

async function getQuestsByStatuses(statuses) {
    let quests = [];
    for (let index = 0; index < statuses.length; index++) {
        quests = quests.concat(await getQuestsPerStatus(statuses[index]));
        if (index === statuses.length - 1) return quests.sort((a, b) => sortByImportanceValue(a, b));
    }
}


async function createQuest(quest, guildID, creatorID) {
    let timestamp = Date.now();
    return await Quest.create({
        id: `Q${timestamp}`,
        quest_identifier: `Q${timestamp}`,
        quest_giver: creatorID,
        quest_description: quest.description,
        quest_name: quest.title,
        quest_importance_value: quest.priority,
        quest_importance: Importance[quest.priority],
        quest_status: 'OPEN',
        server: guildID
    })
}

async function deleteQuest(questID, serverID) {
    let quest = await Quest.findOne({ where: { quest_identifier: questID, server: serverID } });
    return new Promise((resolve, reject) => {
        if (!quest) return reject()
        quest.quest_status = 'DELETED';
        quest.save();
        return resolve()
    });
}

async function updateQuest(questData, serverID) {
    const QUEST = await Quest.findOne({ where: { quest_identifier: questData?.quest_id, server: serverID } })
    return new Promise((resolve, reject) => {
        if (!QUEST) return reject()
        if (questData.status) {
            QUEST.quest_status = questData?.status;
            QUEST.save();
            return resolve();
        } else if (!questData.status) {
            QUEST.quest_name = questData?.title;
            QUEST.quest_description = questData?.description;
            QUEST.quest_importance_value = questData?.priority;
            QUEST.quest_importance = Importance[questData?.priority];
            QUEST.save();
            return resolve();
        }
        return reject();
    });
}


function sortByImportanceValue(a, b) {
    a = a.quest_importance_value
    b = b.quest_importance_value
    return a - b;
}

module.exports = {
    getServerQuestsByStatuses, getQuestsByStatuses, createQuest, deleteQuest, updateQuest,
};