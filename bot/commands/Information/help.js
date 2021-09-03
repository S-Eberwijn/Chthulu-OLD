const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const {sendHelpEmbedFunction} = require('../../otherFunctions/sendHelpEmbedFunction.js')
module.exports.run = async (bot, message, args) => {

    if (!args[0]) {
        sendHelpEmbedFunction(bot, message.channel, message.author)
    } else {
        if (args[0].includes('!')) args[0] = args[0].slice(1)
        if (!bot.commands.has(args[0])) return message.channel.send({ content: 'I do not posses that command...' })

        let command = bot.commands.get(args[0]);

        let helpEmbed = new MessageEmbed()
            .setAuthor(`${bot.user.username}`, bot.user.displayAvatarURL())
            .setColor("GREEN")
            .setThumbnail(`https://media.giphy.com/media/l0ExsgrTuACbtPaqQ/giphy.gif`)
            .setDescription(`
    **__Command name:__** ${process.env.PREFIX}${command.help.name}
    **__Command description:__** ${command.help.description}
    **__Command usage:__** ${command.help.usage || `No additional parameter(s)`}
    **__Command permissions:__** ${command.help.permissions || `No additional permissions needed`}
    `)
        await message.channel.send({ embeds: [helpEmbed] }, true)
    }
}


module.exports.help = {
    name: "help",
    alias: ["hlp"],
    description: "Gives all possible commands",
    category: "Information"
}


function setEmoji(categoryName) {
    if (categoryName.toLowerCase().includes('general')) {
        return '⚙️'
    } else if (categoryName.toLowerCase().includes('misc')) {
        return '🎊'
    } else if (categoryName.toLowerCase().includes('dungeons')) {
        return '🐉'
    } else if (categoryName.toLowerCase().includes('info')) {
        return '🗃️'
    } else if (categoryName.toLowerCase().includes('test')) {
        return '🧪'
    } else {
        return '🚩'
    }
}