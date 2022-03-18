const { defineModel } = require("firestore-sequelizer");
const DungeonMaster = defineModel("dungeon_masters", {
    id: {
        type: 'string',
        required: true,
    },
    dungeon_master_id_discord: {
        type: 'string',
        required: true,
    },
    dungeon_master_name: {
        type: 'string',
        required: true,
    },
    server: {
        type: 'string',
        required: true,
    },
});

module.exports = { DungeonMaster };
