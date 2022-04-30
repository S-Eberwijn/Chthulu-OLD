const { logger } = require(`../../../functions/logger`)
const { NonPlayableCharacter } = require('../../../database/models/NonPlayableCharacter');
const { getNonPlayableCharacterEmbed } = require('../../otherFunctions/characterEmbed')

const { MessageEmbed, MessageButton } = require('discord.js');
const { createNPCPaginationEmbedInChannel } = require('../../otherFunctions/characterEmbed')
const { paginationEmbed } = require('../../otherFunctions/paginationEmbed')


module.exports.run = async (interaction) => {
    const button1 = new MessageButton()
        .setCustomId("npc_previous_button")
        .setLabel("Previous")
        .setStyle("SECONDARY");

    const button2 = new MessageButton()
        .setCustomId("npc_next_button")
        .setLabel("Next")
        .setStyle("SECONDARY");

    const buttonList = [button1, button2];

    if (interaction.options.get('name')) {

    } else {
        const nonPlayerCharacters = await NonPlayableCharacter.findAll({ where: { server: interaction.guild.id } })
        // console.log(nonPlayerCharacters)
        if (nonPlayerCharacters.length <= 0) return interaction.reply({ content: 'There are no NPC\'s to be found.' }).then(() => { setTimeout(() => interaction.deleteReply(), 3000) }).catch(err => logger.error(err));

        await createNPCPaginationEmbedInChannel(interaction.channel, nonPlayerCharacters, buttonList)
    }

}

module.exports.help = {
    // name: "npc",
    // alias: [],
    // description: "Displays your character!",
    category: "Dungeons & Dragons",
    name: "npc",
    // alias: [],
    description: "Displays your character!",
    options: [{
        name: 'name',
        type: 'STRING',
        description: `Name of the NPC you're trying to find`,
        required: false
    }],
}
