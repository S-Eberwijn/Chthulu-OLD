const { logger } = require(`../../../functions/logger`)
const { Modal, TextInputComponent, MessageActionRow } = require('discord.js');

const { PlayerCharacter } = require('../../../database/models/PlayerCharacter');

const MODAL_ID = 'session-request-modal';

module.exports.run = async (interaction) => {
    const SESSION_MODAL = createModal(MODAL_ID);
    const SESSIONS_CATEGORY = interaction.member.guild.channels.cache.find(c => c.name == "--SESSIONS--" && c.type == "GUILD_CATEGORY");
    let messageAuthorCharacter = await PlayerCharacter.findOne({ where: { player_id_discord: interaction.user.id, alive: 1, server: interaction.guild.id } });

    if (!messageAuthorCharacter) return interaction.reply({ content: `You do not have a character in the database!\nCreate one by using the "/createcharacter" command.` }).then(() => { setTimeout(() => interaction.deleteReply(), 3000) }).catch(err => logger.error(err));
    if (!SESSIONS_CATEGORY) return interaction.reply({ content: `There is no category named \"--SESSIONS--\"!` }).then(() => { setTimeout(() => interaction.deleteReply(), 3000) }).catch(err => logger.error(err));

    await interaction.showModal(SESSION_MODAL);
}

function createModal(MODAL_ID) {
    const modal = new Modal()
        .setCustomId(MODAL_ID)
        .setTitle('Session Request');

    const sessionObjective = new TextInputComponent()
        .setCustomId('sessionObjective')
        .setLabel("Objective")
        .setPlaceholder('e.g. "Defeat the BBEG at his lair."')
        .setStyle('PARAGRAPH')
        .setRequired(true)

    const sessionDate = new TextInputComponent()
        .setCustomId('sessionDate')
        .setLabel("Date - Time ~> [DD/MM/YYYY HH:MM]")
        .setStyle('SHORT')
        .setRequired(true)
        .setPlaceholder(`20/12/${(new Date).getFullYear()} 15:30`)
        .setMaxLength(16)

    const sessionLocation = new TextInputComponent()
        .setCustomId('sessionLocation')
        .setLabel("Location")
        .setStyle('SHORT')
        .setPlaceholder('Roll20 (online)')
        .setRequired(false)

    const secondActionRow = new MessageActionRow().addComponents(sessionObjective),
        thirdActionRow = new MessageActionRow().addComponents(sessionDate),
        fourthActionRow = new MessageActionRow().addComponents(sessionLocation);

    modal.addComponents(secondActionRow, fourthActionRow, thirdActionRow,);
    return modal;
}

module.exports.help = {
    category: "Dungeons & Dragons",
    name: "session-request",
    description: "Request a session",
}

