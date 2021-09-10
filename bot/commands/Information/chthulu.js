const { MessageActionRow, MessageButton } = require('discord.js');
const { getBotEmbed } = require('../../otherFunctions/botEmbed')

module.exports.run = async (bot, message, args) => {
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
            // new MessageButton()
            //     .setCustomId('refresh-bot-button')
            //     .setLabel('Refresh')
            //     .setStyle('PRIMARY')
            //     .setEmoji('🔄'),
            new MessageButton()
                .setCustomId('help-bot-button')
                .setLabel('Help')
                .setStyle('SECONDARY'),
        );
    await message.channel.send({ embeds: [await getBotEmbed(bot)], components: [messageComponents] });
}

module.exports.help = {
    name: "chthulu",
    alias: ["bot", "chthulhu", "cthulu", "chtulu", "chtulhu", "cthulhu"],
    description: "Information about the bot",
    category: "Information"
}
