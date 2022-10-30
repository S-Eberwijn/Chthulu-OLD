const paginationEmbed = require('discordjs-button-pagination');
const { GameSession } = require('../../../database/models/GameSession');
const { MessageEmbed, MessageButton } = require('discord.js');
const { getBot } = require('../../../functions/api/bot');
const { getPrettyDateString } = require('../../../functions/api/misc');

const previousButton = new MessageButton()
    .setCustomId('previousbtn')
    .setLabel('Previous')
    .setStyle('SECONDARY');

const nextButton = new MessageButton()
    .setCustomId('nextbtn')
    .setLabel('Next')
    .setStyle('SECONDARY');

module.exports.run = async (interaction) => {
    const ALL_SERVER_PLANNED_SESSIONS = await GameSession.findAll({ where: { session_status: 'PLANNED', server: interaction.guild.id } });
    !ALL_SERVER_PLANNED_SESSIONS.length ? interaction.reply({ content: `There are no planned sessions.`, ephemeral: true }) : paginationEmbed(interaction, createSessionsOverviewEmbedPages(ALL_SERVER_PLANNED_SESSIONS), [previousButton, nextButton]);
}

function createSessionsOverviewEmbedPages(sessions) {
    const MAX_SESSIONS_SHOWN_PER_PAGE = 5;
    let pages = [];
    for (let index = 0; index < Math.ceil(sessions.length / MAX_SESSIONS_SHOWN_PER_PAGE); index++) {
        pages.push(new MessageEmbed()
            .setAuthor({ name: 'Session board', iconURL: getBot().user.displayAvatarURL() })
            .setDescription(`${sessions.slice(index * 5, 5 * (index + 1))
                ?.map(session => `> **Session ${session.session_number}:** \u200b \` ${getPrettyDateString(new Date(session.date))}\` \n\`\`\`${session.objective}\`\`\` `).join('\n\n')}`)
            .setFooter({ text: `${1}/${Math.ceil(sessions.length / MAX_SESSIONS_SHOWN_PER_PAGE)} page` })
            .setTimestamp())
    }
    return pages
}

module.exports.help = {
    category: "Dungeons & Dragons",
    name: 'session-board',
    description: 'Returns a board of the sessions',
    ephemeral: true,
}