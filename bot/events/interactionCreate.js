const { writeToJsonDb } = require('../otherFunctions/writeToJsonDb')
const { getBotEmbed } = require('../otherFunctions/botEmbed')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const PlayerCharacter = require('../../database/models/PlayerCharacter');


module.exports = async (bot, interaction) => {
    //TODO: Might change later when applying buttons to character creation 
    // if (!(interaction.user.id === interaction.message.author.id)) return interaction.reply({ content: `These buttons are not meant for you!`, ephemeral: true})
    try {
        // !chthulu
        switch (interaction.customId) {
            case 'like-bot-button':
                let likesAndDislikes = require('../jsonDb/likesAndDislikes.json')
                likesAndDislikes['likes'].push({ userID: `${interaction.user.id}` })
                writeToJsonDb('likesAndDislikes', likesAndDislikes);
                interaction.message.edit({ embeds: [await getBotEmbed(bot)] })
                return interaction.deferUpdate();
            case 'dislike-bot-button':
                return interaction.reply({ content: `This button does nothing, you better press on the \`♥️ Like\` button!`, ephemeral: true })
            case 'help-bot-button':
                const { sendHelpEmbedFunction } = require('../otherFunctions/sendHelpEmbedFunction.js')
                sendHelpEmbedFunction(bot, interaction.guildId, interaction.channelId, interaction.user.id);
                return interaction.deferUpdate();

        }
    } catch (error) {
        console.log(error);
    }
    try {
        //!createCharacter
        switch (interaction.customId) {
            case 'approve-character-button':
                const messageComponents1 = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('change-character-name-button')
                            .setLabel('Change Name')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('change-character-age-button')
                            .setLabel('Change Age')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('change-character-short-story-button')
                            .setLabel('Change Short-Story')
                            .setStyle('SECONDARY'),
                    );
                const messageComponents2 = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('change-character-race-button')
                            .setLabel('Change Race')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('change-character-class-button')
                            .setLabel('Change Class')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('change-character-background-button')
                            .setLabel('Change Background')
                            .setStyle('SECONDARY'),
                    );
                const messageComponents3 = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('change-character-picture-button')
                            .setLabel('Change Picture')
                            .setStyle('SECONDARY'),
                        new MessageButton()
                            .setCustomId('delete-character-button')
                            .setLabel('Delete Character')
                            .setStyle('DANGER')
                    );

                await PlayerCharacter.findOne({ where: { player_id: interaction.user.id, server_id: interaction.guildId, alive: 1, status: "CREATED" } }).then((character) => { if (character) { character['alive'] = 0; character.save() } });
                await PlayerCharacter.findOne({ where: { player_id: interaction.user.id, server_id: interaction.guildId, status: "CREATING" } }).then((character) => {
                    if (character) {
                        character['status'] = 'CREATED';
                        character['alive'] = 1;
                        character.save().then(() => interaction.message.edit({ content: null, components: [messageComponents1, messageComponents2, messageComponents3] }))
                    }
                });
                return interaction.reply({ content: `Approved this character`, ephemeral: true })
            case 'decline-character-button':
                return interaction.message.channel.delete().catch(err => console.error(err));
        }
    } catch (error) {
        console.log(error)
    } finally {
        // interaction.deferUpdate();
    }

};