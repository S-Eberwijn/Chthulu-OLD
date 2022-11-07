const { defineModel } = require("firestore-sequelizer");
const Quest = defineModel("quests", {
    quest_identifier: {
        type: 'string',
        required: true,
    },
    quest_giver: {
        type: 'string',
        required: true
    },
    quest_description: {
        type: 'string',
        required: true
    },
    quest_name: {
        type: 'string',
        required: true
    },
    quest_importance: {
        type: 'string',
        required: true
    },
    quest_importance_value: {
        type: 'number',
        required: true
    },
    quest_status: {
        type: 'string',
        required: true
    },
    server: {
        type: 'string',
        required: true,
    }
});

module.exports = { Quest };