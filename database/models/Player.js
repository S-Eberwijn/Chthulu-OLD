// const { DataTypes, Model } = require('sequelize');

// module.exports = class Player extends Model {
//     static init(sequelize) {
//         return super.init({
//             id: {
//                 type: DataTypes.INTEGER,
//                 autoIncrement: true,
//                 primaryKey: true
//             },
//             player_id: {
//                 type: DataTypes.STRING(32),
//                 allowNull: false
//             },
//             player_name: {
//                 type: DataTypes.STRING(32),
//                 allowNull: false
//             },
//             server_id: {
//                 type: DataTypes.STRING(32),
//                 allowNull: false,
//             }
//         }, {
//             tableName: 'player',          
//             modelName: 'Player',
//             timestamps: true,
//             sequelize
//         })
//     }
// }

const { defineModel } = require("firestore-sequelizer");
const Player = defineModel("players", {
    id: {
        type: 'string',
        required: true,
    },
    player_id_discord: {
        type: 'string',
        required: false
    },
    player_name: {
        type: 'string',
        required: false
    },
    server: {
        type: 'string',
        required: false,
    }
});

module.exports = { Player };