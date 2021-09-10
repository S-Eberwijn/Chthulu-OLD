const { MessageEmbed, MessageAttachment } = require('discord.js');
const PlayerCharacter = require('../../../database/models/PlayerCharacter');
const { getCharacterEmbed, getCharacterLevelImage } = require('../../otherFunctions/characterEmbed')

module.exports.run = async (bot, message, args) => {
    //Returns the character of the message author or the mentioned user
    const user = message.mentions.users.first() || message.author;
    //Searches the database for a valid character
    let character = await PlayerCharacter.findOne({ where: { player_id: user.id, alive: 1, server_id: message.guild.id } })
    //If no character is linked to the user, return an error message
    if (!character) return message.channel.send({ content: 'This user does not have a character!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));

    message.channel.send({ embeds: [await getCharacterEmbed(character)], files: [await getCharacterLevelImage(character)] });
}

module.exports.help = {
    name: "character",
    alias: ["c", "char"],
    description: "Displays your character!",
    category: "Dungeons & Dragons"
}
