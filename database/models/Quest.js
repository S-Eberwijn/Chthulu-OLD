// const { DataTypes, Model } = require('sequelize');

// module.exports = class Quest extends Model {
//     static init(sequelize) {
//         return super.init({
//             quest_id: {
//                 type: DataTypes.INTEGER,
//                 allowNull: false,
//                 autoIncrement: true,
//                 primaryKey: true
//             },
//             quest_giver: {
//                 type: DataTypes.STRING(32),
//                 allowNull: false
//             },
//             quest_description: {
//                 type: DataTypes.TEXT,
//                 allowNull: false
//             },
//             quest_name: {
//                 type: DataTypes.STRING(32),
//                 allowNull: false
//             },
//             quest_importance: {
//                 type: DataTypes.STRING(32),
//                 allowNull: false
//             },
//             quest_importance_value: {
//                 type: DataTypes.INTEGER,
//                 allowNull: false
//             },
//             quest_status: {
//                 type: DataTypes.STRING(32),
//                 allowNull: false
//             },
//             server_id: {
//                 type: DataTypes.STRING(32),
//                 allowNull: false,
//             }

//         }, {
//             tableName: 'quest',
//             modelName: 'Quest',
//             timestamps: true,
//             sequelize
//         })
//     }
// }

const { defineModel } = require("firestore-sequelizer");
const Quest = defineModel("quests", {
    quest_identifier: {
        type: 'string',
        required: true,
    },
    quest_giver: {
        type: 'string',
        required: true
    },
    quest_description: {
        type: 'string',
        required: true
    },
    quest_name: {
        type: 'string',
        required: true
    },
    quest_importance: {
        type: 'string',
        required: true
    },
    quest_importance_value: {
        type: 'number',
        required: true
    },
    quest_status: {
        type: 'string',
        required: true
    },
    server: {
        type: 'string',
        required: true,
    }
});

module.exports = { Quest };