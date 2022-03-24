const { Quest } = require('../../../database/models/Quest');
const { MessageEmbed } = require('discord.js');

module.exports.run = async (interaction) => {
    const bot = require('../../../index');

    let questEmbed = new MessageEmbed()
        .setAuthor(`${bot.user.username}#${bot.user.discriminator} `, bot.user.avatarURL())
        .setColor("GREEN")
        .setFooter(`0 quests`)
    await Quest.findAll({ where: { server: interaction.guild.id, quest_status: 'OPEN' } }).then(ALL_SERVER_QUESTS => {
        if (!ALL_SERVER_QUESTS) return;
        ALL_SERVER_QUESTS.sort((a, b) => b.get('quest_importance_value') - a.get('quest_importance_value'))
        // .setThumbnail(`https://images.squarespace-cdn.com/content/v1/5cabfe148dfc8c07a688849e/1599878650736-K68SBTX8CQOTZJ2TRR9W/The+Quest+Board+1.png`)
        // .setTimestamp()
        ALL_SERVER_QUESTS.forEach((QUEST) => {
            questEmbed.addField(`${getRightEmoji(QUEST.quest_importance_value)} - ${QUEST.quest_name}`, `\>\>\> \`\`\`${QUEST.quest_description}\`\`\``, false)
        })
        questEmbed.setFooter(`Create new quests on the Chthulu website!`)

    })
    return await interaction.reply({ embeds: [questEmbed] })
}

module.exports.help = {
    // name: 'quests',
    // permission: [],
    // alias: [],
    category: "Dungeons & Dragons",
    name: 'quests',
    description: 'Get information of quests in this campaign (server).',
    options: [],
}

function getRightEmoji(quest_importance_value) {
    switch (quest_importance_value) {
        case 5:
            return '🔴';
        case 4:
            return '🟠';
        case 3:
            return '🟡';
        case 2:
            return '🟢';
        case 1:
            return '🟢';
        case 0:
            return '⚪';
        default:
            return '⚫';
    }
}