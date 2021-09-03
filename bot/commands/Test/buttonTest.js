const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { writeToJsonDb } = require('../../otherFunctions/writeToJsonDb')
// const { MessageMenuOption, MessageMenu } = require('discord-buttons')
// const NonPlayableCharacter = require('../../../database/models/NonPlayableCharacter');

module.exports.run = async (bot, message, args) => {
    



    // const filter = response => {
    //     return true;
    // };

    // message.channel.send({ content: "QUESTION", fetchReply: true })
    //     .then(msg => {
    //         message.channel.awaitMessages({ filter, max: 1, time: 30000, errors: ['time'] })
    //             .then(collected => {
    //                 msg.reply(`${collected.first().author} got the correct answer!`);
    //             })
    //             .catch(collected => {
    //                 msg.reply('Looks like nobody got the answer this time.');
    //             });
    //     });
    // let cmduser = message.author;

    // let menuoptions = await NonPlayableCharacter.findAll({ where: { server_id: message.guild.id } });
    // //define the selection
    // let Selection = new MessageMenu()
    //     .setID('MenuSelection')
    //     .setMaxValues(1) //OPTIONAL, this is how many values you can have at each selection
    //     .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
    //     .setPlaceholder('Select a quest-giver...');  //message in the content placeholder

    // menuoptions.forEach(option => {
    //     let row = new MessageMenuOption()
    //         .setLabel(option.label ? option.label : option.name)
    //         .setValue(option.name)
    //         .setDescription(`${option.race} - ${option.class} - ${option.background}`)
    //         .setDefault()
    //     // if (option.emoji) row.setEmoji(option.emoji)
    //     // row.setEmoji('🧛')
    //     Selection.addOption(row)
    // })

    // //define the embed
    // let MenuEmbed = new MessageEmbed()
    //     .setColor("GREEN")
    //     .setAuthor(`${bot.user.username}`, bot.user.displayAvatarURL())
    //     .setDescription("***Select the quest-giver in the `Selection`***")


    // const filter = i => {
    //     i.deferUpdate();
    //     return i.user.id === message.user.id;
    // };

    // //send the menu msg
    // let menumsg = await message.channel.send(MenuEmbed, Selection)
    // console.log(menumsg)
    // // let test = await message.channel.send('test');
    // menumsg.awaitMessageComponent({ filter, componentType: 'SELECT_MENU', time: 60000 })
    //     .then(message => message.editReply(`You selected ${message.values.join(', ')}!`))
    //     .catch(err => console.log(`No messages were collected.`));

    // const collector = menumsg.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 3000 });
    // collector.on('collect', i => {
    //     if (i.user.id === message.user.id) {
    //         i.reply(`${i.user.id} clicked on the ${i.customId} button.`);
    //     } else {
    //         i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
    //     }
    // });

    // collector.on('end', collected => {
    //     console.log(`Collected ${collected.size} messages.`);
    // });

    //function to handle the menuselection
    // function menuselection(menu) {
    //     menu.reply.send("You have chosen option: `" + menu.values[0] + "`", true);
    // }

    // //Event
    // bot.on('clickMenu', (menu) => {
    //     if (menu.message.id === menumsg.id) {
    //         if (menu.clicker.user.id === cmduser.id) menuselection(menu);
    //         else menu.reply.send(`:x: You are not allowed to do that! Only: <@${cmduser.id}>`, true);
    //     }
    // });
}

module.exports.help = {
    name: "test",
    alias: [],
    description: "Testing the new MessageOptions (BUTTONS) in v13",
    category: "Test"
}
