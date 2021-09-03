const { DataTypes, Model } = require('sequelize');

module.exports = class PlayerCharacter extends Model {
    static init(sequelize) {
        return super.init({
            character_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            creator_id: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            title: {
                type: DataTypes.STRING(64),
                allowNull: true
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            race: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            class: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            background: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            age: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            level: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            picture_url: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            server_id: {
                type: DataTypes.STRING(32),
                allowNull: false,
            }
        }, {
            tableName: 'non_playable_character',
            modelName: 'NonPlayableCharacter',
            timestamps: true,
            sequelize
        })
    }
}