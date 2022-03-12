const { defineModel } = require("firestore-sequelizer");
const DungeonMaster = defineModel("dungeon_masters", {
    id: {
        type: 'string',
        required: true,
    },
    dungeon_master_id: {
        type: 'string',
        required: true,
    },
    dungeon_master_name: {
        type: 'string',
        required: true,
    },
    server_id: {
        type: 'string',
        required: true,
    },
});

module.exports = { DungeonMaster };
