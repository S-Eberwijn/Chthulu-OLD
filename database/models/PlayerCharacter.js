const { DataTypes, Model } = require('sequelize');

module.exports = class PlayerCharacter extends Model {
    static init(sequelize) {
        return super.init({
            character_id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            player_id: {
                type: DataTypes.STRING(32),
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(32),
                allowNull: true
            },
            title: {
                type: DataTypes.STRING(64),
                allowNull: true
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            race: {
                type: DataTypes.STRING(32),
                allowNull: true
            },
            class: {
                type: DataTypes.STRING(32),
                allowNull: true
            },
            background: {
                type: DataTypes.STRING(32),
                allowNull: true
            },
            age: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            level: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            next_session_id: {
                type: DataTypes.STRING(32),
                allowNull: true
            },
            last_session_id: {
                type: DataTypes.STRING(32),
                allowNull: true
            },
            picture_url: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            alive: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            server_id: {
                type: DataTypes.STRING(32),
                allowNull: false,
            },
            status: {
                type: DataTypes.STRING(32),
                allowNull: true,
            }
        }, {
            tableName: 'player_character',
            modelName: 'PlayerCharacter',
            timestamps: true,
            sequelize
        })
    }
}