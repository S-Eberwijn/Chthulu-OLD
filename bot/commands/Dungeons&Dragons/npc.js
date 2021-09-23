const NonPlayableCharacter = require('../../../database/models/NonPlayableCharacter');
const { getNonPlayableCharacterEmbed } = require('../../otherFunctions/characterEmbed')

const { MessageEmbed,MessageButton } = require('discord.js');

const {paginationEmbed} = require('../../otherFunctions/paginationEmbed')


module.exports.run = async (bot, message, args) => {
    // TODO FINISH FUNCTION
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
        //Searches the database for a valid character
        const nonPlayerCharacters = await NonPlayableCharacter.findAll({ where: { server_id: message.guild.id } })
        //If no character is linked to the user, return an error message
        if (!nonPlayerCharacters) return message.channel.send({ content: 'There are no NPC\'s to be found.' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
        let npcArray = [];
        for (const npc of nonPlayerCharacters) {
            npcArray.push(await getNonPlayableCharacterEmbed(npc))
        }

        await paginationEmbed(message, npcArray, buttonList)
        // message.channel.send({ embeds: [] });

    }

}

module.exports.help = {
    name: "npc",
    alias: [],
    description: "Displays your character!",
    category: "Dungeons & Dragons"
}
