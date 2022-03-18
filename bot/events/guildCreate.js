const {GeneralInfo} = require('../../database/models/GeneralInfo');


module.exports = async (client, guild) => {
    await GeneralInfo.create({
        id: guild.id,
        server_name: guild.name,
        server: guild.id,
        session_number: 1,
        in_character_channels: ''
    })
};