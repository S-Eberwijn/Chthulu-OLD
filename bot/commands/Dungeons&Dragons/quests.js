const Quest = require('../../../database/models/Quest');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports.run = async (bot, message, args) => {
    await Quest.findAll({ where: { server_id: message.guild.id } }).then(ALL_SERVER_QUESTS => {
        if (!ALL_SERVER_QUESTS) return;
        let questEmbed = new MessageEmbed()
            .setAuthor(`${bot.user.username}#${bot.user.discriminator} `, bot.user.avatarURL())
            .setColor("GREEN")
            // .setFooter('Homebrew Campaign', message.author.avatarURL())
            // .setThumbnail(`https://images.squarespace-cdn.com/content/v1/5cabfe148dfc8c07a688849e/1599878650736-K68SBTX8CQOTZJ2TRR9W/The+Quest+Board+1.png`)
            // .setTimestamp()
        ALL_SERVER_QUESTS.forEach((QUEST) => {
            questEmbed.addField(`${getRightEmoji(QUEST)} - ${QUEST.get(`quest_name`)}`, `\>\>\> \`\`\`${QUEST.get(`quest_description`)}\`\`\``, false)
        })
        message.channel.send({ embeds: [questEmbed] })
    })
}

module.exports.help = {
    name: "quests",
    alias: ['q'],
    description: "Get quest information of this campaign (server).",
    category: "Dungeons & Dragons"
}

function getRightEmoji(QUEST) {
    switch (QUEST.get(`quest_importance`).toLowerCase()) {
        case 'important':
            return '🔴';
        case 'medium':
            return '🟠';
        case 'low':
            return '🟢';
        default:
            return '⚪';
    }
}