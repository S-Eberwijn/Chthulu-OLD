const { defineModel } = require("firestore-sequelizer");
const NonPlayableCharacter = defineModel("non_playable_characters", {
    character_identifier: {
        type: 'string',
        required: true,
    },
    creator: {
        type: 'string',
        allowNull: true,
    },
    name: {
        type: 'string',
        required: false,
    },
    title: {
        type: 'string',
        required: false,
    },
    description: {
        type: 'string',
        required: false,
    },
    race: {
        type: 'string',
        required: false,
    },
    class: {
        type: 'string',
        required: false,
    },
    background: {
        type: 'string',
        required: false,
    },
    age: {
        type: 'number',
        required: false,
    },
    picture_url: {
        type: 'string',
        required: false,
    },
    status: {
        type: 'string',
        required: true,
    },
    using_npc: {
        type: 'string',
        required: false,
    },
    server: {
        type: 'string',
        required: true,   
    }
});

module.exports = { NonPlayableCharacter };