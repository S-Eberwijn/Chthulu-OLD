const { defineModel } = require("firestore-sequelizer");
const GameSession = defineModel("game_session", {
    id: {
        type: 'string',
        required: true,
    },
    message_id_discord: {
        type: 'string',
        required: false,
    },
    session_commander: {
        type: 'string',
        required: true,
    },
    session_party: {
        type: 'array',
        required: false,
    },
    date: {
        type: 'timestamp',
        required: true,
    },
    dungeon_master_id_discord: {
        type: 'string',
        required: false,
    },
    objective: {
        type: 'string',
        required: true,
    },
    location: {
        type: 'string',
        required: false,
    },
    session_number: {
        type: 'number',
        required: false,
    },
    session_channel: {
        type: 'string',
        required: false,
    },
    session_status: {
        type: 'string',
        required: true,
    },
    server: {
        type: 'string',
        required: true,
    }
});

module.exports = { GameSession };