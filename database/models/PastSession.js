const { defineModel } = require("firestore-sequelizer");
const PastSession = defineModel("past_sessions", {
    id: {
        type: 'string',
        required: true,
    },
    message_id: {
        type: 'string',
        required: true,
    },
    session_commander_id: {
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
    dungeon_master_id: {
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
    server_id: {
        type: 'string',
        required: true,
    }
});

module.exports = { PastSession };