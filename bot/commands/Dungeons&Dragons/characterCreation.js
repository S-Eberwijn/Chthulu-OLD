const Player = require('../../../database/models/Player');
const PlayerCharacter = require('../../../database/models/PlayerCharacter');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

const QUESTIONS_ARRAY = require('../../jsonDb/characterCreationQuestions.json');
const { getCharacterEmbed, getCharacterLevelImage } = require('../../otherFunctions/characterEmbed')

module.exports.run = async (bot, message, args) => {
    const characterCreateCategory = message.guild.channels.cache.find(c => c.name == "--CHARACTER CREATION--" && c.type == "GUILD_CATEGORY")
    let foundPlayer = await Player.findOne({ where: { player_id: message.author.id, server_id: message.guild.id } })
    if (!foundPlayer) {
        await Player.create({
            player_id: message.author.id,
            player_name: message.author.username,
            server_id: message.guild.id
        });
    } else {
        await PlayerCharacter.findOne({ where: { player_id: message.author.id, server_id: message.guild.id, status: "CREATING" } })
        .then((character) => {
            let name = message.author.username + "-" + message.author.discriminator;
            let tmpchannel = message.guild.channels.cache.find(channel => channel.name == name.toLowerCase());
            if (!tmpchannel){if (character) {tmpchannel = message.guild.channels.cache.find(channel => channel.name == character.get("name"));}}
            if(tmpchannel){tmpchannel.delete();}
            if (character) { character.destroy();} });
    }
    let newCharacter = await PlayerCharacter.create({
        player_id: message.author.id,
        server_id: message.guild.id,
        status: "CREATING"
    });

    if (!characterCreateCategory) {
    return message.channel.send({ content: 'There is no category named \"--CHARACTER CREATION--\"!' })
        .then(msg => { setTimeout(() => msg.delete(), 3000) })
        .catch(err => console.log(err));
    }
    message.guild.channels.cache.forEach(channel => {
        if (channel.name == `${message.author.username.toLowerCase()}-${message.author.discriminator}`)  return message.channel.send({ content: 'You already created a channel before!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
    });

    if (message.member.roles.cache.has(message.guild.roles.cache.find(role => role.name.includes('Dungeon Master')).id)) {
        return message.channel.send({ content: 'You\'re not a player, get lost kid!' })
            .then(msg => { setTimeout(() => msg.delete(), 5000) })
            .catch(err => console.log(err));
    }
    message.guild.channels.create(`${message.author.username}-${message.author.discriminator}`, "text").then(async createdChannel => {
        createdChannel.setParent(characterCreateCategory, { lockPermission: false });
        createdChannel.permissionOverwrites.set([{ id: message.author, allow: ['VIEW_CHANNEL'] }, { id: message.guild.roles.cache.find(role => role.name.includes('Dungeon Master')), allow: ['VIEW_CHANNEL'] }, { id: message.channel.guild.roles.everyone, deny: ['VIEW_CHANNEL'] }]);
        createdChannel.send({ embeds: [createCreatedChannelEmbed(bot, message)] }).then(async () => {
            for (let index = 0; index < QUESTIONS_ARRAY.length; index++) {
                await characterCreationQuestion(QUESTIONS_ARRAY[index], createdChannel, newCharacter, message, bot, index)
            }
            const messageComponents = new MessageActionRow()
                .addComponents(
                    new MessageButton()
                        .setCustomId('approve-character-button')
                        .setLabel('Approve')
                        .setStyle('SUCCESS'),
                    new MessageButton()
                        .setCustomId('decline-character-button')
                        .setLabel('Decline')
                        .setStyle('DANGER')
                );
            createdChannel.send({ content: 'Is this correct?', embeds: [await getCharacterEmbed(newCharacter)], components: [messageComponents], files: [await getCharacterLevelImage(newCharacter)] }).then(async newCharacterEmbed => {
                await createdChannel.setName(newCharacter.get('name'));
            });
        });
    });
}

module.exports.help = {
    name: "createCharacter",
    alias: ["cc"],
    description: "Creates a new channel with questions about your new character",
    category: "Dungeons & Dragons"
}

async function characterCreationQuestion(QUESTION_OBJECT, createdChannel, newCharacter, message, bot, index) {
    let questionEmbed = new MessageEmbed()
        .setAuthor(`${bot.user.username}`, bot.user.displayAvatarURL())
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
                    .addOptions(Object.keys(QUESTION_OBJECT.answers).map(function (key) { return { label: `${QUESTION_OBJECT.answers[key].category}`, value: `${QUESTION_OBJECT.answers[key].category}` } }))
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
                // console.log(elements)
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
                newCharacter.set(QUESTION_OBJECT.databaseTable, interaction.values[0])
                newCharacter.save();
            }).catch(function () {
                createdChannel.delete().then(() => {
                    message.author.send({ content: 'Times up! You took too long to respond. Try again by requesting a new character creation channel.' });
                });
            })
        });
    } else {
        await createdChannel.send({ embeds: [questionEmbed], fetchReply: true }).then(async () => {
            let regExp = new RegExp(QUESTION_OBJECT.regex);
            const filter = response => {
                if (response.author.id === bot.user.id) return false;
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
                newCharacter.set(QUESTION_OBJECT.databaseTable, collected.first().content.charAt(0).toUpperCase() + collected.first().content.slice(1))
                newCharacter.save();
            }).catch(function () {
                createdChannel.delete().then(() => {
                    message.author.send({ content: 'Times up! You took too long to respond. Try again by requesting a new character creation channel.' });
                });
            })
        });
    }
}

function createCreatedChannelEmbed(bot, message) {
    let embedCreatedChannel = new MessageEmbed()
        .setAuthor(`${bot.user.username}`, bot.user.displayAvatarURL())
        .setColor("GREEN")
        .addField(`Hello traveler!`, `<@${message.author.id.toString()}>, welcome to your character creation channel!`, true);
    return embedCreatedChannel;
}
