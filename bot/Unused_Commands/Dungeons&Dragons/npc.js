const {NonPlayableCharacter} = require('../../../database/models/NonPlayableCharacter');
const { getNonPlayableCharacterEmbed } = require('../../otherFunctions/characterEmbed')

const { MessageEmbed, MessageButton } = require('discord.js');
const {createNPCPaginationEmbedInChannel} = require('../../otherFunctions/characterEmbed')
const { paginationEmbed } = require('../../otherFunctions/paginationEmbed')


module.exports.run = async (bot, message, args) => {
    const button1 = new MessageButton()
        .setCustomId("npc_previous_button")
        .setLabel("Previous")
        .setStyle("SECONDARY");

    const button2 = new MessageButton()
        .setCustomId("npc_next_button")
        .setLabel("Next")
        .setStyle("SECONDARY");

    const buttonList = [button1, button2];

    if (args[0]) {

    } else {
        const nonPlayerCharacters = await NonPlayableCharacter.findAll({ where: { server_id: message.guild.id } })
        if (!nonPlayerCharacters) return message.channel.send({ content: 'There are no NPC\'s to be found.' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
        
        await createNPCPaginationEmbedInChannel(message.channel,nonPlayerCharacters,buttonList)
    }

}

module.exports.help = {
    name: "npc",
    alias: [],
    description: "Displays your character!",
    category: "Dungeons & Dragons"
}
