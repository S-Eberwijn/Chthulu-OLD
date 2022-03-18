const { defineModel } = require("firestore-sequelizer");
const GeneralInfo = defineModel("general_info", {
    server: {
        type: 'string',
        required: true,
    },
    server_name: {
        type: 'string',
        required: true,
    },
    session_number: {
        type: 'number',
        required: true,
    },
    in_character_channels: {
        type: 'string',
        required: true,
    },
});

module.exports = { GeneralInfo };