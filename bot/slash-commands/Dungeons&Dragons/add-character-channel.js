//Firestore change done
const {GeneralInfo} = require('../../../database/models/GeneralInfo');

module.exports.run = async (interaction) => {
    if (!interaction.guild.channels.cache.find(channel => channel.name === `${interaction.options.getString('channel-name')}`)) return interaction.reply({ content: "**ERROR**: There is no such channel. Maybe you made a typo?" });
    let channelID = interaction.guild.channels.cache.find(channel => channel.name === `${interaction.options.getString('channel-name')}`).id;
    let foundServer = await GeneralInfo.findOne({ where: { server_id: interaction.guild.id } })
    if (!foundServer) return interaction.reply({ content: "**ERROR**: Could not find server in the database!" });

    if (foundServer.in_character_channels != null) {
        let inCharacterChannels = foundServer.in_character_channels;
        inCharacterChannels.push(channelID)
        foundServer.in_character_channels = inCharacterChannels;
        foundServer.save();
    } else {
        foundServer.in_character_channels = [channelID];
        foundServer.save();
    }

    interaction.reply({ content: 'Done! Added the channel to the list!', ephemeral: true })
}

module.exports.help = {
    name: 'add-character-channel',
    permission: [],
    alias: [],
    category: "Dungeons & Dragons"
}