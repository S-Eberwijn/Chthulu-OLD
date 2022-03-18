const { defineModel } = require("firestore-sequelizer");
const PastSession = defineModel("past_sessions", {
    id: {
        type: 'string',
        required: true,
    },
    message_id_discord: {
        type: 'string',
        required: true,
    },
    session_commander: {
        type: 'string',
        required: true,
    },
    session_party: {
        type: 'string',
        required: false,
    },
    date: {
        type: 'string',
        required: true,
    },
    dungeon_master_id_discord: {
        type: 'string',
        required: true,
    },
    objective: {
        type: 'string',
        required: false,
    },
    session_number: {
        type: 'number',
        required: false,
    },
    session_status: {
        type: 'string',
        required: false,
    },
    server: {
        type: 'string',
        required: true,
    }
});

module.exports = { PastSession };