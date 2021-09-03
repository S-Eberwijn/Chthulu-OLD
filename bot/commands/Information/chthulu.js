const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { writeToJsonDb } = require('../../otherFunctions/writeToJsonDb')
module.exports.run = async (bot, message, args) => {
    let likesAndDislikes = require('../../jsonDb/likesAndDislikes.json')
    let botOwner;
    try {
        botOwner = await bot.users.fetch(`${process.env.AUTHOR}`);
    } catch (error) {
        botOwner = { username: 'Chthulu', discriminator: '6727' };
    }

    const messageComponents = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('like-bot-button')
                .setLabel('Like')
                .setStyle('SUCCESS')
                .setEmoji('♥️'),
            new MessageButton()
                .setCustomId('dislike-bot-button')
                .setLabel('Dislike')
                .setStyle('DANGER')
                .setEmoji('😭'),
            new MessageButton()
                .setCustomId('help-bot-button')
                .setLabel('Help')
                .setStyle('SECONDARY'),
            new MessageButton()
                .setCustomId('delete-bot-button')
                .setLabel('Delete')
                .setStyle('SECONDARY'),
        );

    const sendMessage = await message.channel.send({ content: `Buttons will be gone after 15 seconds!`, embeds: [createBotEmbed(bot, botOwner)], components: [messageComponents] });
    const collector = sendMessage.createMessageComponentCollector({ componentType: 'BUTTON', time: 15000 });

    collector.on('end', collected => {
        for (const [key, value] of collected) {
            if (value.customId === 'delete-bot-button') return sendMessage.delete();
        }
        return sendMessage.edit({ content: null, components: [] })
    });

    collector.on('collect', i => {
        if (!(i.message.id === sendMessage.id)) return
        if (!(i.user.id === message.author.id)) return sendMessage.reply({ content: `These buttons aren't for you!`}).then(msg => { setTimeout(() => msg.delete(), 1000) }).catch(err => console.log(err));

        switch (i.customId) {
            case 'like-bot-button':
                likesAndDislikes['likes'].push({ userID: `${message.author.id}` })
                writeToJsonDb('likesAndDislikes', likesAndDislikes);
                sendMessage.edit({ embeds: [createBotEmbed(bot, botOwner)] })
                break;
            case 'dislike-bot-button':
                sendMessage.reply(`This button does nothing, you better press on the \`♥️ Like\` button!`).then(msg => { setTimeout(() => msg.delete(), 3000) });;
                break;
            case 'help-bot-button':
                const { sendHelpEmbedFunction } = require('../../otherFunctions/sendHelpEmbedFunction.js')
                sendHelpEmbedFunction(bot, message.channel, message.author)// i.reply({ content: `Maybe I should show you the help command`, ephemeral: true });
                break;
            case 'delete-bot-button':
                collector.stop();
                break;
        }
        i.deferUpdate();

    });

}

module.exports.help = {
    name: "chthulu",
    alias: ["bot", "chthulhu", "cthulu", "chtulu", "chtulhu", "cthulhu"],
    description: "Information about the bot",
    category: "Information"
}


function createBotEmbed(bot, botOwner) {
    return new MessageEmbed()
        .setAuthor(`${bot.user.username}#${bot.user.discriminator} `, bot.user.avatarURL())
        .setDescription(`
        \*\*Cthulhu\*\* is a Great Old One of great power who lies in a death-like slumber beneath the \*\*Pacific Ocean\*\* in his sunken city of \*\*R'lyeh\*\*. He remains a dominant presence in the eldrich dealings on our world.
        \*\*\`\`\`I've been awake for ${calculateUptimeBot(bot)}\`\`\`\*\*
        `)
        .setColor("GREEN")
        // .setThumbnail(bot.user.displayAvatarURL())
        .addFields(
            {
                name: `Info:`, value: `
            💻 \*\*Developer:\*\* \`${botOwner.username}#${botOwner.discriminator}\`
            🕸 \*\*Website:\*\* [chthulu.online](https://github.com/S-Eberwijn/Chthulu)
            🚧 \*\*Test Server:\*\* [discord.gg/hYt5hYmkSv](https://discord.gg/hYt5hYmkSv)
            ✏ \*\*Design:\*\* Looking for new one!
            `, inline: true
            },
            {
                name: `Stats:`, value: `
            🗄️ \*\*Servers:\*\* \`${bot.guilds.cache.size}\`
            👤 \*\*Users:\*\* \`${bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0)}\`
            🗣️ \*\*Channels:\*\* \`${bot.channels.cache.size}\`
            🤖 \*\*Commands:\*\* \`${[... new Set(bot.commands.map((o) => o.help.name))].length}\`
            `, inline: true
            }
        )
        .setFooter(`💗 ${require('../../jsonDb/likesAndDislikes.json')['likes'].length}`)
}

function calculateUptimeBot(bot) {
    let totalSeconds = (bot.uptime / 1000);
    let days = Math.floor(totalSeconds / 86400);
    let hours = Math.floor(totalSeconds / 3600);
    totalSeconds %= 3600;
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = Math.floor(totalSeconds % 60);

    let uptime = `${seconds} seconds`;

    if (minutes != 0) {
        uptime = `${minutes} minutes and ${seconds} seconds`;
    }
    if (hours != 0) {
        uptime = `${hours} hours, ${minutes} minutes and ${seconds} seconds`;
    }
    if (days != 0) {
        uptime = `${days} days, ${hours} hours, ${minutes} minutes and ${seconds} seconds`;
    }

    return uptime;

}
