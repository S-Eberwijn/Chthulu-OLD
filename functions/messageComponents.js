const { MessageActionRow, MessageButton } = require('discord.js');

const SESSION_BUTTON_IDS = ['approve-session-request-button', 'decline-session-request-button', 'join-session-button', 'played-session-button', 'cancel-session-button', 'join-accepted-button', 'join-denied-button']

const MESSAGE_COMPONENTS = {
    PLANNED_SESSION: new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(SESSION_BUTTON_IDS[3])
                .setLabel('Played')
                .setStyle('SUCCESS'),
            // .setEmoji('👍'),
            new MessageButton()
                .setCustomId(SESSION_BUTTON_IDS[4])
                .setLabel('Cancel')
                .setStyle('DANGER'),
            // .setEmoji('✖️'),
            new MessageButton()
                .setCustomId(SESSION_BUTTON_IDS[2])
                .setLabel('Join')
                .setStyle('SECONDARY')
                .setEmoji('🙋‍♂️'),
        ),
    JOIN_SESSION: new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId(SESSION_BUTTON_IDS[5])
                .setLabel('Yes, gear up!')
                .setStyle('SUCCESS')
                .setEmoji('🦾'),
            new MessageButton()
                .setCustomId(SESSION_BUTTON_IDS[6])
                .setLabel('No, stay away!')
                .setStyle('DANGER')
                .setEmoji('✖️'),
        ),
}

module.exports = {
    MESSAGE_COMPONENTS
};