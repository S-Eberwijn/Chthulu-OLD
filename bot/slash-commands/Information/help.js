const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const { sendHelpEmbedFunction } = require('../../otherFunctions/sendHelpEmbedFunction.js')
module.exports.run = async (interaction) => {
    interaction.reply('works');
    const bot = require('../../../index');

    if (!interaction.options?.get('command')) {
        sendHelpEmbedFunction(bot, interaction.guild.id, interaction.channel.id, interaction.user.id)
    } else {
        let commandName = interaction.options.get('command').value;
        console.log(commandName.name)
        if (commandName.includes('!')) commandName = commandName.slice(1)
        if (!bot.slashCommands.has(commandName)) return interaction.channel.send({ content: 'I do not posses that command...' })

        let command = bot.commands.get(commandName);

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
        await interaction.reply({ embeds: [helpEmbed] }, { ephemeral: true })
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