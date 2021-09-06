const { writeToJsonDb } = require('../otherFunctions/writeToJsonDb')
const { getBotEmbed } = require('../otherFunctions/botEmbed')

module.exports = async (bot, interaction) => {
    // console.log(interaction)

    //TODO: Might change later when applying buttons to character creation 
    // if (!(interaction.user.id === interaction.message.author.id)) return interaction.reply({ content: `These buttons are not meant for you!`, ephemeral: true})
    try {
        switch (interaction.customId) {
            // !chthulu
            case 'like-bot-button':
                let likesAndDislikes = require('../jsonDb/likesAndDislikes.json')
                likesAndDislikes['likes'].push({ userID: `${interaction.user.id}` })
                writeToJsonDb('likesAndDislikes', likesAndDislikes);
                interaction.message.edit({ embeds: [await getBotEmbed(bot)] })
                return interaction.deferUpdate();
            case 'dislike-bot-button':
                return interaction.reply({ content: `This button does nothing, you better press on the \`♥️ Like\` button!`, ephemeral: true })
            case 'refresh-bot-button':
                interaction.message.edit({ embeds: [await getBotEmbed(bot)] });
                return interaction.deferUpdate();

            case 'help-bot-button':
                const { sendHelpEmbedFunction } = require('../otherFunctions/sendHelpEmbedFunction.js')
                sendHelpEmbedFunction(bot, interaction.guildId, interaction.channelId, interaction.user.id);
                return interaction.deferUpdate();


            // default:
            //     console.log(interaction.customId)
            //     break;
        }
    } catch (error) {
        console.log(error)
    } finally {
        // interaction.deferUpdate();
    }

};