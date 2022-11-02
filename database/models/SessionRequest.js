const { defineModel } = require("firestore-sequelizer");
const SessionRequest = defineModel("session_requests", {
    id: {
        type: 'string',
        required: true,
    },
    message_id_discord: {
        type: 'string',
        required: true
    },
    session_channel: {
        type: 'string',
        required: false
    },
    session_commander: {
        type: 'string',
        required: true
    },
    session_party: {
        type: 'array',
        required: true,
    },
    date: {
        type: 'string',
        required: true
    },
    objective: {
        type: 'string',
        required: false
    },
    server: {
        type: 'string',
        required: true,
    }
});

module.exports = { SessionRequest };