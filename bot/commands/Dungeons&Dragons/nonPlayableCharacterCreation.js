const { Player } = require('../../../database/models/Player');
const { NonPlayableCharacter } = require('../../../database/models/NonPlayableCharacter');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

const QUESTIONS_ARRAY = require('../../jsonDb/npcCreationQuestions.json');
const { sendNPCEmbedMessageInChannel } = require('../../otherFunctions/characterEmbed')


module.exports.run = async (interaction) => {
    const bot = require('../../../index');

    const characterCreateCategory = interaction.guild.channels.cache.find(c => c.name == "--CHARACTER CREATION--" && c.type == "GUILD_CATEGORY")
    if (!interaction.member.roles.cache.has(interaction.guild.roles.cache.find(role => role.name.includes('Dungeon Master')).id)) return interaction.reply({ content: 'You\'re not a dm, get lost kid!' }).then(() => { setTimeout(() => interaction.deleteReply(), 5000) }).catch(err => console.log(err));

    await NonPlayableCharacter.findOne({ where: { creator: interaction.user.id, server: interaction.guild.id, status: "CREATING" } }).then((character) => {
        let name = interaction.user.username + "-" + interaction.user.discriminator;
        let tmpchannel = interaction.guild.channels.cache.find(channel => channel.name == name.toLowerCase());
        if (!tmpchannel) {
            if (character) {
                tmpchannel = interaction.guild.channels.cache.find(channel => channel.name == character.get("name"));
            }
        }
        if (tmpchannel) { tmpchannel.delete(); }
        if (character) { character.destroy() }
    });
    let timestamp = Date.now();
    if (!characterCreateCategory) {
        return interaction.reply({ content: 'There is no category named \"--CHARACTER CREATION--\"!' }).then(() => { setTimeout(() => interaction.deleteReply(), 3000) }).catch(err => console.log(err));
    }
    interaction.guild.channels.cache.forEach(channel => {
        if (channel.name == `${interaction.user.username.toLowerCase()}-${interaction.user.discriminator}`) return interaction.reply({ content: 'You already created a channel before!' }).then(() => { setTimeout(() => interaction.deleteReply(), 3000) }).catch(err => console.log(err));
    });

    await NonPlayableCharacter.create({
        id: `N${timestamp}`,
        character_id: `N${timestamp}`,
        creator: interaction.user.id,
        server: interaction.guild.id,
        status: "CREATING"
    }).then(async () => {
        let newCharacter = await NonPlayableCharacter.findOne({ where: { id: `N${timestamp}`, server: interaction.guild.id, creator: interaction.user.id } });;

        interaction.guild.channels.create(`${interaction.user.username}-${interaction.user.discriminator}`, "text").then(async createdChannel => {
            createdChannel.setParent(characterCreateCategory, { lockPermission: false });
            createdChannel.permissionOverwrites.set([{ id: interaction.user, allow: ['VIEW_CHANNEL'] }, { id: interaction.guild.roles.cache.find(role => role.name.includes('Dungeon Master')), allow: ['VIEW_CHANNEL'] }, { id: interaction.channel.guild.roles.everyone, deny: ['VIEW_CHANNEL'] }]);
            createdChannel.send({ embeds: [createCreatedChannelEmbed(bot, interaction)] }).then(async () => {
                for (let index = 0; index < QUESTIONS_ARRAY.length; index++) {
                    await characterCreationQuestion(QUESTIONS_ARRAY[index], createdChannel, newCharacter, interaction, bot, index)
                }

                const messageComponents = new MessageActionRow()
                    .addComponents(
                        new MessageButton()
                            .setCustomId('approve-npc-button')
                            .setLabel('Approve')
                            .setStyle('SUCCESS'),
                        new MessageButton()
                            .setCustomId('decline-npc-button')
                            .setLabel('Decline')
                            .setStyle('DANGER')
                    );
                await sendNPCEmbedMessageInChannel(createdChannel, newCharacter, 'Is this correct?', [messageComponents])
                    .then(async () => { await createdChannel.setName('NPC-' + newCharacter.name); });
            });
        });
    })

}

module.exports.help = {
    // name: "create-npc",
    // alias: ["cNPC"],
    // description: "Creates a new channel with questions about your new NPC",
    category: "Dungeons & Dragons",
    name: "create-npc",
    // alias: [],
    description: "Creates a new channel with questions about your new NPC",
    options: [],
}

async function characterCreationQuestion(QUESTION_OBJECT, createdChannel, newCharacter, interaction, bot, index) {
    let questionEmbed = new MessageEmbed()
        .setAuthor({name: `${bot.user.username}`, iconURL: bot.user.displayAvatarURL()})
        .setColor("GREEN")
        .setDescription(QUESTION_OBJECT.question)

    if (QUESTION_OBJECT.answers.length > 0) {
        let messageComponentsArray = [];
        let categorySelectionId = '';

        if (typeof QUESTION_OBJECT.answers[0] === 'object' && !Array.isArray(QUESTION_OBJECT.answers[0])) {
            let messageSelectMenuOptionsArray = [];
            QUESTION_OBJECT.answers[0].values.forEach(async key => {
                await messageSelectMenuOptionsArray.push({
                    label: `${key}`,
                    value: `${key}`
                })
            })

            messageComponentsArray.push(new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId(`characterRaceCategorySelection`)
                    .setPlaceholder('Select a category...')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setDisabled(false)
                    .addOptions(Object.keys(QUESTION_OBJECT.answers).map(function (key, index) { return { label: `${QUESTION_OBJECT.answers[key].category}`, value: `${QUESTION_OBJECT.answers[key].category}` } }))
            ))
            messageComponentsArray.push(new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId(`characterQuestion${index}`)
                    .setPlaceholder('Select a value...')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setDisabled(true)
                    .addOptions(messageSelectMenuOptionsArray)
            ))
            categorySelectionId = messageComponentsArray[0].components[0].customId;
        } else if (QUESTION_OBJECT.answers.length > 25) {
            for (let index = 0; index < Math.ceil(QUESTION_OBJECT.answers.length / 25); index++) {
                const elements = QUESTION_OBJECT.answers.slice(index * 25, 25 * (index + 1));
                messageComponentsArray.push(new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`characterQuestion${index}`)
                        .setPlaceholder('Select a value...')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .setDisabled(false)
                        .addOptions(Object.keys(elements).map(function (key) { return { label: `${elements[key]}`, value: `${elements[key]}` } }))
                ))
            }
        } else {
            messageComponentsArray.push(new MessageActionRow().addComponents(
                new MessageSelectMenu()
                    .setCustomId(`characterQuestion${index}`)
                    .setPlaceholder('Select a value...')
                    .setMinValues(1)
                    .setMaxValues(1)
                    .setDisabled(false)
                    .addOptions(Object.keys(QUESTION_OBJECT.answers).map(function (key) { return { label: `${QUESTION_OBJECT.answers[key]}`, value: `${QUESTION_OBJECT.answers[key]}` } }))
            ))
        }


        const filter = response => {
            if (response.user.id === bot.user.id) return false;
            if (response.customId === categorySelectionId) {
                let newSelectionMenu = response.message;
                newSelectionMenu.components[0].components[0].placeholder = response.values[0];
                newSelectionMenu.components[1] = new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`characterQuestion${index}`)
                        .setPlaceholder('Select a value...')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .setDisabled(false)
                        .addOptions(Object.keys(QUESTION_OBJECT.answers[Object.keys(QUESTION_OBJECT.answers).filter(function (key, index) { return QUESTION_OBJECT.answers[key].category === response.values[0] })[0]].values).map(function (key) { return { label: `${QUESTION_OBJECT.answers[Object.keys(QUESTION_OBJECT.answers).filter(function (key, index) { return QUESTION_OBJECT.answers[key].category === response.values[0] })[0]].values[key]}`, value: `${QUESTION_OBJECT.answers[Object.keys(QUESTION_OBJECT.answers).filter(function (key, index) { return QUESTION_OBJECT.answers[key].category === response.values[0] })[0]].values[key]}` } }))
                )
                response.deferUpdate();
                response.message.edit({ components: newSelectionMenu.components })
                return false;
            }
            return true;
        };
        await createdChannel.send({ embeds: [questionEmbed], components: messageComponentsArray, fetchReply: true }).then(async () => {
            await createdChannel.awaitMessageComponent({
                filter,
                max: 1,
                time: 300000,
                errors: ['time'],
            }).then(async (interaction) => {
                interaction.deferUpdate();
                newCharacter[`${QUESTION_OBJECT.databaseTable}`] = interaction.values[0];
                newCharacter.save();
            }).catch(function (error) {
                console.error(error)
                // createdChannel.delete().then(() => {
                //     interaction.user.send({ content: 'Times up! You took too long to respond. Try again by requesting a new character creation channel.' });
                // });
            })
        });
    } else {
        await createdChannel.send({ embeds: [questionEmbed], fetchReply: true }).then(async () => {
            let regExp = new RegExp(QUESTION_OBJECT.regex);
            const filter = response => {
                if (response.author.id === bot.user.id) return false;
                if (QUESTION_OBJECT.question.includes('picture')) {
                    if (response.attachments.size > 0) {
                        return true;
                    }
                }
                if (regExp.exec(response.content) === null) {
                    createdChannel.send({ content: QUESTION_OBJECT.errorMessage });
                    return false;
                }
                return true;
            };
            await createdChannel.awaitMessages({
                filter,
                max: 1,
                time: 300000,
                errors: ['time'],
            }).then(async (collected) => {
                if (QUESTION_OBJECT.question.includes('picture')) {
                    if (collected.first().attachments.size > 0) {
                        newCharacter[`${QUESTION_OBJECT.databaseTable}`] = collected.first().attachments?.first()?.url;
                    } else {
                        newCharacter[`${QUESTION_OBJECT.databaseTable}`] = collected.first().content;
                    }
                } else {
                    newCharacter[`${QUESTION_OBJECT.databaseTable}`] = collected.first().content;
                }
                newCharacter.save();
            }).catch(function (error) {
                console.error(error)
                // createdChannel.delete().then(() => {
                //     interaction.author.send({ content: 'Times up! You took too long to respond. Try again by requesting a new character creation channel.' });
                // });
            })
        });
    }
}

function createCreatedChannelEmbed(bot, interaction) {
    let embedCreatedChannel = new MessageEmbed()
        .setAuthor({name: `${bot.user.username}`, iconURL: bot.user.displayAvatarURL()})
        .setColor("GREEN")
        .addField(`Hello traveler!`, `<@${interaction.user.id.toString()}>, welcome to your character creation channel!`, true);
    return embedCreatedChannel;
}
