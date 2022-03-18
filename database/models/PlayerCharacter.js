// const { DataTypes, Model } = require('sequelize');

// module.exports = class PlayerCharacter extends Model {
//     static init(sequelize) {
//         return super.init({
//             character_id: {
//                 type: DataTypes.INTEGER,
//                 autoIncrement: true,
//                 primaryKey: true
//             },
//             player_id: {
//                 type: DataTypes.STRING(32),
//                 allowNull: false
//             },
//             name: {
//                 type: DataTypes.STRING(32),
//                 allowNull: true
//             },
//             title: {
//                 type: DataTypes.STRING(64),
//                 allowNull: true
//             },
//             description: {
//                 type: DataTypes.TEXT,
//                 allowNull: true
//             },
//             race: {
//                 type: DataTypes.STRING(32),
//                 allowNull: true
//             },
//             class: {
//                 type: DataTypes.STRING(32),
//                 allowNull: true
//             },
//             background: {
//                 type: DataTypes.STRING(32),
//                 allowNull: true
//             },
//             age: {
//                 type: DataTypes.INTEGER,
//                 allowNull: true
//             },
//             level: {
//                 type: DataTypes.INTEGER,
//                 allowNull: true
//             },
//             next_session_id: {
//                 type: DataTypes.STRING(32),
//                 allowNull: true
//             },
//             last_session_id: {
//                 type: DataTypes.STRING(32),
//                 allowNull: true
//             },
//             picture_url: {
//                 type: DataTypes.STRING(255),
//                 allowNull: true
//             },
//             alive: {
//                 type: DataTypes.INTEGER,
//                 allowNull: true
//             },
//             server_id: {
//                 type: DataTypes.STRING(32),
//                 allowNull: false,
//             },
//             status: {
//                 type: DataTypes.STRING(32),
//                 allowNull: true,
//             }
//         }, {
//             tableName: 'player_character',
//             modelName: 'PlayerCharacter',
//             timestamps: true,
//             sequelize
//         })
//     }
// }


const { defineModel } = require("firestore-sequelizer");
const PlayerCharacter = defineModel("player_characters", {
    character_id: {
        type: 'string',
        required: true,
    },
    player_id_discord: {
        type: 'string',
        required: true,
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
    level: {
        type: 'number',
        required: false,
    },
    next_session: {
        type: 'string',
        required: false,
    },
    last_session: {
        type: 'string',
        required: false,
    },
    picture_url: {
        type: 'string',
        required: false,
    },
    alive: {
        type: 'number',
        required: false,
    },
    server: {
        type: 'string',
        required: true,
    },
    status: {
        type: 'string',
        required: true,
    }
});

module.exports = { PlayerCharacter };