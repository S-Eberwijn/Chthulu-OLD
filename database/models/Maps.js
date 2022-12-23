const { defineModel } = require("firestore-sequelizer");
const Map = defineModel("maps", {
    id: {
        type: 'string',
        required: true,
    },
    description: {
        type: 'string',
        required: true,
    },
    mapName: {
        type: 'string',
        required: true,
    },
    map_url: {
        type: 'string',
        required: true,
    },
    locations: {
        type: 'array',
        required: false,
    },
    server: {
        type: 'string',
        required: true,
    }
});

module.exports = { Map };