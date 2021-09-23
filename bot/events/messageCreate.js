const PREFIX = process.env.PREFIX;
const { Op } = require("sequelize");
const GeneralInfo = require('../../database/models/GeneralInfo.js');
const PlayerCharacter = require('../../database/models/PlayerCharacter.js');
const NonPlayableCharacter = require('../../database/models/NonPlayableCharacter.js');
const { MessageEmbed, Permissions } = require('discord.js');



module.exports = async (bot, message) => {
    //Do nothing when bot sends message
    if (message.author.bot) return;
    //Do nothing when message is a direct message 
    if (message.channel.type === "dm") return;

    var messageArray = message.content.split(" ");
    var command = messageArray[0].toLowerCase();
    var arguments = messageArray.slice(1);
    var commands = bot.commands.get(command.slice(PREFIX.length));

    let in_character_channels;
    await GeneralInfo.findOne({ where: { server_id: message.guild.id } }).then(info => { if (info) in_character_channels = info.get('in_character_channels') })

    if (messageArray[0].charAt(0) === PREFIX.charAt(0)) {
        if (commands) {
            if (message.guild.me.permissionsIn(message.channel).has(Permissions.FLAGS.MANAGE_MESSAGES)) message.delete();
            commands.run(bot, message, arguments);
        }
    } else if (!(message.guild.id === `679595021317832704`) && in_character_channels.includes(message.channel.id)) {
        if (message.guild.me.permissionsIn(message.channel).has(Permissions.FLAGS.MANAGE_MESSAGES)) message.delete();

        //Person must have a character in the Chthulu database in order to type messages in the 'in-character'-text channels.
        let character = await PlayerCharacter.findOne({ where: { server_id: message.guild.id, player_id: message.author.id, alive: 1 } });
        if (!character) return message.channel.send('Did not find a suitable character in the database!').then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
        //DM must have selected a NPC in order to type messages in the 'in-character'-text channels.
        if (message.member.roles.cache.some(role => role.name.toLowerCase().includes(`dungeon master`))) character = await NonPlayableCharacter.findOne({
            where: {
                server_id: message.guild.id, using_npc: {
                    [Op.substring]: message.author.id
                }
            }
        });
        if (!character) return message.channel.send('Select an NPC before you speak, almighty mister DM!').then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));

        //TODO: Maybe make a conversation implementation, so it looks like character are really speaking.
        const characterText = new MessageEmbed()
            .setColor(`#2f3136`)
            .setAuthor(character.get('name'), character.get('picture_url'))
            .setDescription(`\>\>\> ${message.content}`)
        message.channel.send({ embeds: [characterText] });
    }

    //else if ((await GeneralInfo.findOne({ where: { server_id: message.guild.id } }))['dataValues']['in_character_channels'].split(';').includes(message.channel.id)) {
    //Person must have a character in the Chthulu database in order to type messages in the 'in-character'-text channels.

    //let character = await PlayerCharacter.findOne({ where: { server_id: message.guild.id, player_id: message.author.id, alive: 1 } });
    // if (!character) return message.reply('Did not find a suitable character in the database!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));

    //TODO: Maybe make a conversation implementation, so it looks like character are really speaking.
    // const characterText = new MessageEmbed()
    //     .setColor(0x333333)
    //     .setAuthor(character.get('name'), character.get('picture_url'))
    //     .setDescription(`${'testing'}`)
    // message.channel.send(characterText);
}
