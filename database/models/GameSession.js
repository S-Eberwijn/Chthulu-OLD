// const { DataTypes, Model } = require('sequelize');

// module.exports = class SessionRequest extends Model {
//     static init(sequelize) {
//         return super.init({
// id: {
//     type: DataTypes.INTEGER,
//     autoIncrement: true,
//     primaryKey: true
// },
// message_id: {
//     type: DataTypes.STRING(32),
//     allowNull: false
// },
// session_channel_id: {
//     type: DataTypes.STRING(32),
//     allowNull: true
// },
// session_commander_id: {
//     type: DataTypes.STRING(32),
//     allowNull: false
// },
// session_party: {
//     type: DataTypes.STRING(255),
//     allowNull: false,
//     get(){
//         return this.getDataValue('session_party').split(';');
//     },
//     set(val) {
//         this.setDataValue('session_party', val.join(';'));
//     }
// },
// date: {
//     type: DataTypes.STRING(128),
//     allowNull: false
// },
// objective: {
//     type: DataTypes.STRING(255),
//     allowNull: true
// },
// server_id: {
//     type: DataTypes.STRING(32),
//     allowNull: false,
// }
//         }, {
//             tableName: 'session_request',
//             modelName: 'SessionRequest',
//             timestamps: false,
//             sequelize
//         })
//     }
// }

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