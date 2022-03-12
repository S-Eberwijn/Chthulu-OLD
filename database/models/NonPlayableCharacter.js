// const { DataTypes, Model } = require('sequelize');

// module.exports = class NonPlayableCharacter extends Model {
//     static init(sequelize) {
//         return super.init({
//             character_id: {
//                 type: DataTypes.INTEGER,
//                 autoIncrement: true,
//                 primaryKey: true
//             },
//             creator_id: {
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
//             picture_url: {
//                 type: DataTypes.STRING(255),
//                 allowNull: true
//             },
//             status: {
//                 type: DataTypes.STRING(32),
//                 allowNull: true,
//             },
//             using_npc: {
//                 type: DataTypes.STRING(255),
//                 allowNull: true,
//             },
//             server_id: {
//                 type: DataTypes.STRING(32),
//                 allowNull: false,
//             }
//         }, {
//             tableName: 'non_playable_character',
//             modelName: 'NonPlayableCharacter',
//             timestamps: true,
//             sequelize
//         })
//     }
// }

const { defineModel } = require("firestore-sequelizer");
const NonPlayableCharacter = defineModel("non_playable_characters", {
    character_id: {
        type: 'string',
        required: true,
    },
    creator_id: {
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
    server_id: {
        type: 'string',
        required: true,   
    }
});

module.exports = { NonPlayableCharacter };