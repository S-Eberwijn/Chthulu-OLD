const { logger } = require(`../../functions/logger`)
const { writeToJsonDb } = require('../otherFunctions/writeToJsonDb')
const { getBotEmbed } = require('../otherFunctions/botEmbed')
const { PlayerCharacter } = require('../../database/models/PlayerCharacter');
const { NonPlayableCharacter } = require('../../database/models/NonPlayableCharacter');
const QUESTIONS_ARRAY = require('../jsonDb/npcCreationQuestions.json');
const CHARACTER_QUESTIONS_ARRAY = require('../jsonDb/characterCreationQuestions.json');
const { sendNPCEmbedMessageInChannel, sendNPCCharacterEmbedMessageFromInteraction, sendCharacterEmbedMessageInChannel } = require('../otherFunctions/characterEmbed');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

//characterbuttons
const messageComponents1 = new MessageActionRow().addComponents(
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
const messageComponents2 = new MessageActionRow().addComponents(
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
const messageComponents3 = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId('change-character-picture-button')
        .setLabel('Change Picture')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('delete-character-button')
        .setLabel('Delete Character')
        .setStyle('DANGER')
);

//npcbuttons
const messageComponents4 = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId('change-npc-name-button')
        .setLabel('Change Name')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('change-npc-age-button')
        .setLabel('Change Age')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('change-npc-description-button')
        .setLabel('Change Short-Story')
        .setStyle('SECONDARY'),
);
const messageComponents5 = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId('change-npc-race-button')
        .setLabel('Change Race')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('change-npc-class-button')
        .setLabel('Change Class')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('change-npc-title-button')
        .setLabel('Change Occupation')
        .setStyle('SECONDARY'),
);
const messageComponents6 = new MessageActionRow().addComponents(
    new MessageButton()
        .setCustomId('change-npc-picture-button')
        .setLabel('Change Picture')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('change-npc-visibility-button')
        .setLabel('Edit Visibility')
        .setStyle('SECONDARY'),
    new MessageButton()
        .setCustomId('delete-npc-button')
        .setLabel('Delete Character')
        .setStyle('DANGER')
);


module.exports = async (bot, interaction) => {

    if (interaction.isCommand()) {
        const slashCommands = bot.slashCommands.get(interaction.commandName)
        if (slashCommands) slashCommands.run(interaction)
    }
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
        logger.error(error);
    }
    try {
        //!createCharacter
        switch (interaction.customId) {
            case 'approve-character-button':
                await PlayerCharacter.findOne({ where: { player_id_discord: interaction.user.id, server: interaction.guildId, alive: 1, status: "CREATED" } }).then((character) => { if (character) { character.alive = 0; character.save() } });
                await PlayerCharacter.findOne({ where: { player_id_discord: interaction.user.id, server: interaction.guildId, status: "CREATING" } }).then((character) => {
                    if (character) {
                        character.status = 'CREATED';
                        character.alive = 1;
                        character.save().then(() => interaction.message.edit({ content: null, components: [messageComponents1, messageComponents2, messageComponents3] }))
                    }
                });
                return interaction.reply({ content: `Approved this character`, ephemeral: true })
            case 'decline-character-button':
                return interaction.message.channel.delete().catch(err => logger.error(err));
        }
        //!createnpc
        switch (interaction.customId) {
            case 'approve-npc-button':
                //await NonPlayableCharacter.findOne({ where: { creator_id: interaction.guild.roles.cache.find(role => role.name === "Dungeon Master").id, server_id: interaction.guildId, status: "CREATED" } });
                await NonPlayableCharacter.findOne({ where: { creator: interaction.user.id, server: interaction.guildId, status: "CREATING" } }).then((character) => {
                    if (character) {
                        character.status = 'INVISIBLE';
                        character.save().then(() => interaction.message.edit({ content: null, components: [messageComponents4, messageComponents5, messageComponents6] }))
                    }
                });
                return interaction.reply({ content: `Approved this character`, ephemeral: true })
            case 'decline-npc-button':
                return interaction.message.channel.delete().catch(err => logger.error(err));
        }
    } catch (error) {
        logger.error(error)
    } finally {
        // interaction.deferUpdate();
    }
    //edit npc buttons
    try {
        let charId = "";
        switch (interaction.customId) {
            case 'change-npc-visibility-button':
                interaction.deferUpdate();
                if (!interaction.member.roles.cache.has(interaction.guild.roles.cache.find(role => role.name.includes('Dungeon Master')).id)) {
                    interaction.channel.send("Only Dm's can set NPC's to visible").then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => logger.error(err));
                    return;
                }
                //TODO may need some revision
                charId = interaction.channel.name.split("⼁")[0];
                await NonPlayableCharacter.findOne({ where: { id: charId, server: interaction.guildId } }).then((character) => {
                    if (character) {
                        if (character.status == "VISIBLE") {
                            character.status = 'INVISIBLE';
                            character.save()
                        } else if (character.status == "INVISIBLE") {
                            character.status = 'VISIBLE';
                            character.save()
                        }
                        interaction.channel.send(`${character.name} is now  ${character.status.toLowerCase()} for all players`)
                            .then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => logger.error(err));
                    }
                });
                return;
            case 'change-npc-name-button':
                await npcEditTextField(interaction, interaction.channel.name.split("⼁")[0], QUESTIONS_ARRAY[0], bot)
                await NonPlayableCharacter.findOne({ where: { id: interaction.channel.name.split("⼁")[0], server: interaction.guildId } }).then((character) => {
                    if (character) {
                        interaction.channel.setName("NPC-" + character.name)
                    }
                });
                return;
            case 'change-npc-race-button':
                await npcEditTextField(interaction, interaction.channel.name.split("⼁")[0], QUESTIONS_ARRAY[1], bot)
                return;
            case 'change-npc-class-button':
                if (!interaction.member.roles.cache.has(interaction.guild.roles.cache.find(role => role.name.includes('Dungeon Master')).id)) {
                    interaction.channel.send("How did you even get here? regardless you need the Dungeon Master role to edit npcs")
                        .then(msg => { setTimeout(() => msg.delete(), 3000) })
                        .catch(err => logger.error(err));
                    return;
                }
                charId = interaction.channel.name.split("⼁")[0];
                interaction.deferUpdate();
                let questionEmbed = new MessageEmbed()
                    .setAuthor(`${bot.user.username}`, bot.user.displayAvatarURL())
                    .setColor("GREEN")
                    .setDescription(QUESTIONS_ARRAY[2].question);
                let messageComponentsArray = [];
                messageComponentsArray.push(new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`characterQuestion${2}`)
                        .setPlaceholder('Select a value...')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .setDisabled(false)
                        .addOptions(Object.keys(QUESTIONS_ARRAY[2].answers).map(function (key) { return { label: `${QUESTIONS_ARRAY[2].answers[key]}`, value: `${QUESTIONS_ARRAY[2].answers[key]}` } }))
                ))
                let createdChannel = interaction.channel;
                await createdChannel.send({ embeds: [questionEmbed], components: messageComponentsArray, fetchReply: true }).then(async () => {
                    await createdChannel.awaitMessageComponent({
                        max: 1,
                        time: 300000,
                        errors: ['time'],
                    }).then(async (interaction) => {
                        interaction.deferUpdate();
                        await NonPlayableCharacter.findOne({ where: { id: charId, server: interaction.guildId } }).then((character) => {
                            if (character) {
                                character[`${QUESTIONS_ARRAY[2].databaseTable}`] = interaction.values[0];
                                character.save().then(async () => {
                                    try {
                                        interaction.channel.bulkDelete(30);
                                    } catch (e) {
                                        logger.error("Problem with deleting messages after updating character.");
                                    }
                                    interaction.channel.send("The " + QUESTIONS_ARRAY[2].databaseTable + " of " + character.name + " has been changed.")
                                        .then(msg => { setTimeout(() => msg.delete(), 3000) })
                                        .catch(err => logger.error(err));
                                    sendNPCEmbedMessageInChannel(interaction.channel, character, " ", [messageComponents4, messageComponents5, messageComponents6]).catch(err => logger.error(err));
                                });
                            } else {
                                interaction.channel.send("This character has been deleted from our database.")
                                    .then(msg => { setTimeout(() => msg.delete(), 3000) })
                                    .catch(err => logger.error(err));
                            }
                        });
                    }).catch(function () {
                        interaction.channel.send("Times up! You took too long to respond. Field remains unchanged.")
                            .then(msg => { setTimeout(() => msg.delete(), 3000) })
                            .catch(err => logger.error(err));
                    });
                });
                return;
            case 'change-npc-title-button':
                await npcEditTextField(interaction, interaction.channel.name.split("⼁")[0], QUESTIONS_ARRAY[3], bot)
                return;
            case 'change-npc-age-button':
                await npcEditTextField(interaction, interaction.channel.name.split("⼁")[0], QUESTIONS_ARRAY[4], bot)
                return;
            case 'change-npc-description-button':
                await npcEditTextField(interaction, interaction.channel.name.split("⼁")[0], QUESTIONS_ARRAY[5], bot)
                return;
            case 'change-npc-picture-button':
                await npcEditTextField(interaction, interaction.channel.name.split("⼁")[0], QUESTIONS_ARRAY[6], bot)
                return;
            case 'delete-npc-button':
                interaction.deferUpdate();
                if (!interaction.member.roles.cache.has(interaction.guild.roles.cache.find(role => role.name.includes('Dungeon Master')).id)) {
                    interaction.channel.send("How did you even get here? regardless you need the Dungeon Master role to edit npcs")
                        .then(msg => { setTimeout(() => msg.delete(), 3000) })
                        .catch(err => logger.error(err));
                    return;
                }
                charId = interaction.channel.name.split("⼁")[0];
                await NonPlayableCharacter.findOne({ where: { id: charId, server: interaction.guildId } }).then((character) => {
                    try {
                        character.destroy().then(async () => {
                            interaction.channel.delete().then(() => {
                                interaction.user.send({ content: 'Times up! You took too long to respond. Try again by requesting a new character creation channel.' });
                            });
                        });
                    } catch (err) {
                        logger.error(err);
                    }
                });
                return;
        }
    } catch (error) {
        logger.error(error)
    }
    //edit character buttons
    try {
        let questionEmbed;
        let messageComponentsArray = [];
        let createdChannel = interaction.channel;
        switch (interaction.customId) {
            case 'change-character-name-button':
                await characterEditTextField(interaction, CHARACTER_QUESTIONS_ARRAY[0], bot)
                await PlayerCharacter.findOne({ where: { player_discord: interaction.user.id, alive: 1, server: interaction.guildId } }).then((character) => {
                    if (character) {
                        interaction.channel.setName(character.name)
                    }
                });
                return;
            case 'change-character-age-button':
                await characterEditTextField(interaction, CHARACTER_QUESTIONS_ARRAY[4], bot)
                return;
            case 'change-character-short-story-button':
                await characterEditTextField(interaction, CHARACTER_QUESTIONS_ARRAY[5], bot)
                return;
            case 'change-character-race-button':
                interaction.deferUpdate();
                let messageSelectMenuOptionsArray = [];
                CHARACTER_QUESTIONS_ARRAY[1].answers[0].values.forEach(async key => {
                    await messageSelectMenuOptionsArray.push({
                        label: `${key}`,
                        value: `${key}`
                    })
                })
                questionEmbed = new MessageEmbed()
                    .setAuthor(`${bot.user.username}`, bot.user.displayAvatarURL())
                    .setColor("GREEN")
                    .setDescription(CHARACTER_QUESTIONS_ARRAY[1].question);
                messageComponentsArray.push(new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`characterRaceCategorySelection`)
                        .setPlaceholder('Select a category...')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .setDisabled(false)
                        .addOptions(Object.keys(CHARACTER_QUESTIONS_ARRAY[1].answers)
                            .map(function (key) {
                                return {
                                    label: `${CHARACTER_QUESTIONS_ARRAY[1].answers[key].category}`,
                                    value: `${CHARACTER_QUESTIONS_ARRAY[1].answers[key].category}`
                                }
                            }))
                ))
                messageComponentsArray.push(new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`characterQuestion${1}`)
                        .setPlaceholder('Select a value...')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .setDisabled(true)
                        .addOptions(messageSelectMenuOptionsArray)
                ))
                categorySelectionId = messageComponentsArray[0].components[0].customId;
                const filter = response => {
                    if (response.user.id === bot.user.id) return false;
                    if (response.customId === categorySelectionId) {
                        let newSelectionMenu = response.message;
                        newSelectionMenu.components[0].components[0].placeholder = response.values[0];
                        newSelectionMenu.components[1] = new MessageActionRow().addComponents(
                            new MessageSelectMenu()
                                .setCustomId(`characterQuestion${1}`)
                                .setPlaceholder('Select a value...')
                                .setMinValues(1)
                                .setMaxValues(1)
                                .setDisabled(false)
                                .addOptions(Object.keys(CHARACTER_QUESTIONS_ARRAY[1].answers[Object.keys(CHARACTER_QUESTIONS_ARRAY[1].answers)
                                    .filter(function (key) {
                                        return CHARACTER_QUESTIONS_ARRAY[1].answers[key].category === response.values[0]
                                    })[0]].values)
                                    .map(function (key) {
                                        return {
                                            label: `${CHARACTER_QUESTIONS_ARRAY[1]
                                                .answers[Object.keys(CHARACTER_QUESTIONS_ARRAY[1].answers)
                                                    .filter(function (key) {
                                                        return CHARACTER_QUESTIONS_ARRAY[1].answers[key].category === response.values[0]
                                                    })[0]]
                                                .values[key]}`, value: `${CHARACTER_QUESTIONS_ARRAY[1].answers[Object.keys(CHARACTER_QUESTIONS_ARRAY[1].answers)
                                                    .filter(function (key) {
                                                        return CHARACTER_QUESTIONS_ARRAY[1].answers[key].category === response.values[0]
                                                    })[0]].values[key]}`
                                        }
                                    })
                                )
                        )
                        response.deferUpdate();
                        response.message.edit({ components: newSelectionMenu.components })
                        return false;
                    }
                    return true;
                }
                await createdChannel.send({ embeds: [questionEmbed], components: messageComponentsArray, fetchReply: true }).then(async () => {
                    await createdChannel.awaitMessageComponent({
                        filter,
                        max: 1,
                        time: 300000,
                        errors: ['time'],
                    }).then(async (interaction) => {
                        interaction.deferUpdate();
                        await PlayerCharacter.findOne({ where: { player_id_discord: interaction.user.id, alive: 1, server: interaction.guildId } }).then((character) => {
                            if (character) {
                                character[`${CHARACTER_QUESTIONS_ARRAY[1].databaseTable}`] = interaction.values[0];
                                character.save().then(async () => {
                                    try {
                                        interaction.channel.bulkDelete(30);
                                    } catch (e) {
                                        // console.log(e);
                                        logger.log("Problem with deleting messages after updating character.");
                                    }
                                    interaction.channel.send("The " + CHARACTER_QUESTIONS_ARRAY[1].databaseTable + " of " + interaction.values[0] + " has been changed.")
                                        .then(msg => { setTimeout(() => msg.delete(), 3000) })
                                        .catch(err => logger.error(err));
                                    sendCharacterEmbedMessageInChannel(interaction.channel, character, " ", [messageComponents1, messageComponents2, messageComponents3]).catch(err => logger.error(err));
                                });
                            } else {
                                interaction.channel.send("This character has been deleted from our database.")
                                    .then(msg => { setTimeout(() => msg.delete(), 3000) })
                                    .catch(err => logger.error(err));
                            }
                        });
                    }).catch(function () {
                        interaction.channel.send("Times up! You took too long to respond. Field remains unchanged.")
                            .then(msg => { setTimeout(() => msg.delete(), 3000) })
                            .catch(err => logger.error(err));
                    });
                });
                return;
            case 'change-character-class-button':
                interaction.deferUpdate();
                questionEmbed = new MessageEmbed()
                    .setAuthor(`${bot.user.username}`, bot.user.displayAvatarURL())
                    .setColor("GREEN")
                    .setDescription(CHARACTER_QUESTIONS_ARRAY[2].question);
                messageComponentsArray.push(new MessageActionRow().addComponents(
                    new MessageSelectMenu()
                        .setCustomId(`characterQuestion${2}`)
                        .setPlaceholder('Select a value...')
                        .setMinValues(1)
                        .setMaxValues(1)
                        .setDisabled(false)
                        .addOptions(Object.keys(CHARACTER_QUESTIONS_ARRAY[2].answers).map(function (key) { return { label: `${CHARACTER_QUESTIONS_ARRAY[2].answers[key]}`, value: `${CHARACTER_QUESTIONS_ARRAY[2].answers[key]}` } }))
                ))
                await createdChannel.send({ embeds: [questionEmbed], components: messageComponentsArray, fetchReply: true }).then(async () => {
                    await createdChannel.awaitMessageComponent({
                        max: 1,
                        time: 300000,
                        errors: ['time'],
                    }).then(async (interaction) => {
                        interaction.deferUpdate();
                        await PlayerCharacter.findOne({ where: { player_id_discord: interaction.user.id, alive: 1, server: interaction.guildId } }).then((character) => {
                            if (character) {
                                character[`${CHARACTER_QUESTIONS_ARRAY[2].databaseTable}`] = interaction.values[0];
                                character.save().then(async () => {
                                    try {
                                        interaction.channel.bulkDelete(30);
                                    } catch (e) {
                                        // console.log(e);
                                        logger.error("Problem with deleting messages after updating character.");
                                    }
                                    interaction.channel.send("The " + CHARACTER_QUESTIONS_ARRAY[2].databaseTable + " of " + character.name + " has been changed.")
                                        .then(msg => { setTimeout(() => msg.delete(), 3000) })
                                        .catch(err => logger.error(err));
                                    sendCharacterEmbedMessageInChannel(interaction.channel, character, " ", components = [messageComponents1, messageComponents2, messageComponents3]).catch(err => logger.error(err));
                                });
                            } else {
                                interaction.channel.send("This character has been deleted from our database.")
                                    .then(msg => { setTimeout(() => msg.delete(), 3000) })
                                    .catch(err => logger.error(err));
                            }
                        });
                    }).catch(function () {
                        interaction.channel.send("Times up! You took too long to respond. Field remains unchanged.")
                            .then(msg => { setTimeout(() => msg.delete(), 3000) })
                            .catch(err => logger.error(err));
                    });
                });
                return;
            case 'change-character-background-button':
                interaction.deferUpdate();
                questionEmbed = new MessageEmbed()
                    .setAuthor(`${bot.user.username}`, bot.user.displayAvatarURL())
                    .setColor("GREEN")
                    .setDescription(CHARACTER_QUESTIONS_ARRAY[2].question);
                messageComponentsArray = [];
                for (let index = 0; index < Math.ceil(CHARACTER_QUESTIONS_ARRAY[3].answers.length / 25); index++) {
                    const elements = CHARACTER_QUESTIONS_ARRAY[3].answers.slice(index * 25, 25 * (index + 1));
                    messageComponentsArray.push(new MessageActionRow().addComponents(
                        new MessageSelectMenu()
                            .setCustomId(`characterQuestion${index}`)
                            .setPlaceholder('Select a value...')
                            .setMinValues(1)
                            .setMaxValues(1)
                            .setDisabled(false)
                            .addOptions(Object.keys(elements)
                                .map(function (key) { return { label: `${elements[key]}`, value: `${elements[key]}` } }))
                    ))
                }
                await createdChannel.send({ embeds: [questionEmbed], components: messageComponentsArray, fetchReply: true }).then(async () => {
                    await createdChannel.awaitMessageComponent({
                        max: 1,
                        time: 300000,
                        errors: ['time'],
                    }).then(async (interaction) => {
                        interaction.deferUpdate();
                        await PlayerCharacter.findOne({ where: { player_id_discord: interaction.user.id, alive: 1, server: interaction.guildId } }).then((character) => {
                            if (character) {
                                character[`${CHARACTER_QUESTIONS_ARRAY[3].databaseTable}`] = interaction.values[0];
                                character.save().then(async () => {
                                    try {
                                        interaction.channel.bulkDelete(30);
                                    } catch (e) {
                                        // console.log(e);
                                        logger.error("Problem with deleting messages after updating character.");
                                    }
                                    interaction.channel.send("The " + CHARACTER_QUESTIONS_ARRAY[3].databaseTable + " of " + character.name + " has been changed.")
                                        .then(msg => { setTimeout(() => msg.delete(), 3000) })
                                        .catch(err => logger.error(err));
                                    sendCharacterEmbedMessageInChannel(interaction.channel, character, " ", [messageComponents1, messageComponents2, messageComponents3]).catch(err => logger.error(err));
                                });
                            } else {
                                interaction.channel.send("This character has been deleted from our database.")
                                    .then(msg => { setTimeout(() => msg.delete(), 3000) })
                                    .catch(err => logger.error(err));
                            }
                        });
                    }).catch(function () {
                        interaction.channel.send("Times up! You took too long to respond. Field remains unchanged.")
                            .then(msg => { setTimeout(() => msg.delete(), 3000) })
                            .catch(err => logger.error(err));
                    });
                });
                return;
            case 'change-character-picture-button':
                await characterEditTextField(interaction, CHARACTER_QUESTIONS_ARRAY[6], bot)
                return;
            case 'delete-character-button':
                await PlayerCharacter.findOne({ where: { player_id_discord: interaction.user.id, alive: 1, server: interaction.guildId } }).then((character) => {
                    if (character) {
                        character.alive = 0;
                        character.status = "DELETED";
                        character.save().then(async () => {
                            try {
                                interaction.channel.bulkDelete(30);
                            } catch (e) {
                                logger.log("Problem with deleting messages after updating character.");
                            }
                            interaction.channel.send(`${character.name} has been deleted, the character is no longer editable.`)
                            sendCharacterEmbedMessageInChannel(interaction.channel, character).catch(err => logger.error(err));
                        });
                    } else {
                        interaction.channel.send("This character has been deleted from our database.")
                            .then(msg => { setTimeout(() => msg.delete(), 3000) })
                            .catch(err => logger.error(err));
                    }
                })
                return;
        }
    } catch (err) { logger.error(err) }


};

async function npcEditTextField(interaction, charId, QUESTION_OBJECT, bot) {
    interaction.deferUpdate();
    if (!interaction.member.roles.cache.has(interaction.guild.roles.cache.find(role => role.name.includes('Dungeon Master')).id)) {
        interaction.channel.send("How did you even get here? regardless you need the Dungeon Master role to edit npcs")
            .then(msg => { setTimeout(() => msg.delete(), 3000) })
            .catch(err => logger.error(err));
        return;
    }
    let questionEmbed = new MessageEmbed()
        .setAuthor(`${bot.user.username}`, bot.user.displayAvatarURL())
        .setColor("GREEN")
        .setDescription(QUESTION_OBJECT.question)
    let createdChannel = interaction.channel;
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
            await NonPlayableCharacter.findOne({ where: { id: charId, server: interaction.guildId } }).then((character) => {
                if (character) {
                    if (QUESTION_OBJECT.question.includes('picture')) {
                        if (collected.first().attachments.size > 0) {
                            character[`${QUESTION_OBJECT.databaseTable}`] = collected.first().attachments?.first()?.url;
                        } else {
                            character[`${QUESTION_OBJECT.databaseTable}`] = collected.first().content;
                        }
                    } else {
                        character[`${QUESTION_OBJECT.databaseTable}`] = collected.first().content;
                    }
                    character.save().then(async () => {
                        try {
                            interaction.channel.bulkDelete(30);
                        } catch (e) {
                            // console.log(e);
                            logger.error("Problem with deleting messages after updating npc.");
                        }
                        interaction.channel.send("The " + QUESTION_OBJECT.databaseTable + " of " + character.name + " has been changed to.")
                            .then(msg => { setTimeout(() => msg.delete(), 3000) })
                            .catch(err => logger.error(err));
                        sendNPCEmbedMessageInChannel(interaction.channel, character, "NPC", [messageComponents4, messageComponents5, messageComponents6]).catch(err => logger.error(err));
                    });
                } else {
                    interaction.channel.send("This character has been deleted from our database.")
                        .then(msg => { setTimeout(() => msg.delete(), 3000) })
                        .catch(err => logger.error(err));
                }
            })
        }).catch(function () {
            interaction.channel.send("Times up! You took too long to respond. Field remains unchanged.")
                .then(msg => { setTimeout(() => msg.delete(), 3000) })
                .catch(err => logger.error(err));
        });
    });
}
async function characterEditTextField(interaction, QUESTION_OBJECT, bot) {
    interaction.deferUpdate();
    let questionEmbed = new MessageEmbed()
        .setAuthor(`${bot.user.username}`, bot.user.displayAvatarURL())
        .setColor("GREEN")
        .setDescription(QUESTION_OBJECT.question)
    let createdChannel = interaction.channel;
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
            await PlayerCharacter.findOne({ where: { player_id_discord: interaction.user.id, alive: 1, server: interaction.guildId } }).then((character) => {
                if (character) {
                    if (QUESTION_OBJECT.question.includes('picture')) {
                        if (collected.first().attachments.size > 0) {
                            character[`${QUESTION_OBJECT.databaseTable}`] = collected.first().attachments?.first()?.url;
                        } else {
                            character[`${QUESTION_OBJECT.databaseTable}`] = collected.first().content;
                        }
                    } else {
                        character[`${QUESTION_OBJECT.databaseTable}`] = collected.first().content;
                    }
                    character.save().then(async () => {
                        // // try {character[`${CHARACTER_QUESTIONS_ARRAY[1].databaseTable}`]
                        // //     interaction.channel.bulkDelete(30);
                        // // } catch (e) {
                        // //     console.log(e);
                        // //     console.log("problem with deleting messages");
                        // // }
                        interaction.channel.send("The " + QUESTION_OBJECT.databaseTable + " of " + character.name + " has been changed")
                            .then(msg => { setTimeout(() => msg.delete(), 3000) })
                            .catch(err => logger.error(err));
                        sendCharacterEmbedMessageInChannel(interaction.channel, character, " ", [messageComponents1, messageComponents2, messageComponents3]).catch(err => logger.error(err));
                    });
                } else {
                    interaction.channel.send("This character has been deleted from our database.")
                        .then(msg => { setTimeout(() => msg.delete(), 3000) })
                        .catch(err => logger.error(err));
                }
            })
        }).catch(function () {
            interaction.channel.send("Times up! You took too long to respond. Field remains unchanged.")
                .then(msg => { setTimeout(() => msg.delete(), 3000) })
                .catch(err => logger.error(err));
        });
    });
}