const { GeneralInfo } = require('../../database/models/GeneralInfo.js');
const { PlayerCharacter } = require('../../database/models/PlayerCharacter.js');
const { NonPlayableCharacter } = require('../../database/models/NonPlayableCharacter.js');
const { MessageEmbed, Permissions } = require('discord.js');



module.exports = async (bot, message) => {
    //Do nothing when bot sends message
    if (message.author.bot) return;
    //Do nothing when message is a direct message 
    if (message.channel.type === "dm") return;

    // let in_character_channels;

    // if (in_character_channels) {
    //     if (!(message.guild.id === `679595021317832704`) && in_character_channels.includes(message.channel.id)) {
    //         if (message.guild.me.permissionsIn(message.channel).has(Permissions.FLAGS.MANAGE_MESSAGES)) message.delete();

    //         //Person must have a character in the Chthulu database in order to type messages in the 'in-character'-text channels.
    //         let character = await PlayerCharacter.findOne({ where: { server: message.guild.id, player_id_discord: message.author.id, alive: 1 } });
    //         if (!character) return message.channel.send('Did not find a suitable character in the database!').then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
    //         //DM must have selected a NPC in order to type messages in the 'in-character'-text channels.
    //         if (message.member.roles.cache.some(role => role.name.toLowerCase().includes("dungeon master"))) character = await NonPlayableCharacter.findOne({
    //             where: {
    //                 server: message.guild.id,
    //                 using_npc: {
    //                     'in': message.author.id
    //                 }
    //             }
    //         });
    //         if (!character) return message.channel.send('Select an NPC before you speak, almighty mister DM!').then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));

    //         //TODO: Maybe make a conversation implementation, so it looks like character are really speaking.
    //         const characterText = new MessageEmbed()
    //             .setColor(`#2f3136`)
    //             .setAuthor(character.name, character.picture_url)
    //             .setDescription(`\>\>\> ${message.content}`)
    //         message.channel.send({ embeds: [characterText] });
    //     }
    // }
}
