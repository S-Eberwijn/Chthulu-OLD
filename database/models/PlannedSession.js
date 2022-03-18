// const { DataTypes, Model } = require('sequelize');

// module.exports = class PlannedSession extends Model {
//     static init(sequelize) {
//         return super.init({
//             id: {
//                 type: DataTypes.INTEGER,
//                 autoIncrement: true,
//                 primaryKey: true
//             },
//             message_id: {
//                 type: DataTypes.STRING(),
//                 allowNull: false
//             },
//             session_commander_id: {
//                 type: DataTypes.STRING(32),
//                 allowNull: false
//             },
//             session_party: {
//                 type: DataTypes.STRING(255),
//                 allowNull: false,
//                 get() {
//                     return this.getDataValue('session_party').split(';');
//                 },
//                 set(val) {
//                     this.setDataValue('session_party', val.join(';'));
//                 }
//             },
//             date: {
//                 type: DataTypes.STRING(128),
//                 allowNull: false
//             },
//             dungeon_master_id: {
//                 type: DataTypes.STRING(),
//                 allowNull: false
//             },
//             objective: {
//                 type: DataTypes.TEXT,
//                 allowNull: true
//             },
//             session_number: {
//                 type: DataTypes.INTEGER,
//                 allowNull: true
//             },
//             session_channel_id: {
//                 type: DataTypes.STRING(32),
//                 allowNull: true
//             },
//             session_status: {
//                 type: DataTypes.STRING(16),
//                 allowNull: true
//             },
//             server_id: {
//                 type: DataTypes.STRING(32),
//                 allowNull: false,
//             }
//         }, {
//             tableName: 'planned_session',
//             modelName: 'PlannedSession',
//             timestamps: true,
//             sequelize
//         })
//     }
// }


const { defineModel } = require("firestore-sequelizer");
const PlannedSession = defineModel("planned_sessions", {
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
    session_channel: {
        type: 'string',
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

module.exports = { PlannedSession };