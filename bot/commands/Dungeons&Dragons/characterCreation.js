const Player = require('../../../database/models/Player');
const PlayerCharacter = require('../../../database/models/PlayerCharacter');
const { MessageEmbed } = require('discord.js');
const QUESTIONS_ARRAY = require('../../jsonDb/characterCreationQuestions.json');

module.exports.run = async (bot, message, args) => {
    const characterCreateCategory = message.guild.channels.cache.find(c => c.name == "--CHARACTER CREATION--" && c.type == "GUILD_CATEGORY")
    let alreadyCreatedChannel = false;
    let newCharacterArray = [];
    let reactedEmoji = '';

    if (!characterCreateCategory) return message.channel.send({ content: 'There is no category named \"--CHARACTER CREATION--\"!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
    message.guild.channels.cache.forEach(channel => {
        if (channel.name == `${message.author.username.toLowerCase()}-${message.author.discriminator}`) alreadyCreatedChannel = true;
    });
    if (message.member.roles.cache.has(message.guild.roles.cache.find(role => role.name.includes('Dungeon Master')).id)) return message.channel.send({ content: 'You\'re not a player, get lost kid!' }).then(msg => { setTimeout(() => msg.delete(), 5000) }).catch(err => console.log(err));
    if (alreadyCreatedChannel) return message.channel.send({ content: 'You already created a channel before!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));

    message.guild.channels.create(`${message.author.username}-${message.author.discriminator}`, "text").then(async createdChannel => {
        createdChannel.setParent(characterCreateCategory, { lockPermission: false });
        doesSeeChannel(createdChannel, message.channel.guild.roles.everyone, false);
        doesSeeChannel(createdChannel, message.guild.roles.cache.find(role => role.name.includes('Dungeon Master')), true);
        doesSeeChannel(createdChannel, message.author, true);

        createdChannel.send({ embeds: [createCreatedChannelEmbed(message)] }).then(async () => {
            for (let index = 0; index < QUESTIONS_ARRAY.length; index++) {
                await characterCreationQuestion(QUESTIONS_ARRAY[index], createdChannel, newCharacterArray, message, bot.user.id)
            }
            createdChannel.send({ content: 'Is this correct?', embeds: [createNewCharacterEmbed(newCharacterArray)] }).then(async newCharacterEmbed => {
                await newCharacterEmbed.react('✔️');
                await newCharacterEmbed.react('✖️');
                const filter = (reaction, user) => {
                    reactedEmoji = reaction.emoji.name;
                    return (reaction.emoji.name === '✔️' || reaction.emoji.name === '✖️') && user.id === message.author.id;
                };
                newCharacterEmbed.awaitReactions({
                    filter,
                    max: 1,
                    time: 300000000,
                    errors: ['time'],
                }).then(async () => {
                    if (reactedEmoji === '✔️') {
                        await createdChannel.setName(newCharacterArray[0].toString());
                        let foundPlayer = await Player.findOne({ where: { player_id: message.author.id, server_id: message.guild.id } })
                        if (foundPlayer) {
                            let foundCharacter = await PlayerCharacter.findOne({ where: { player_id: message.author.id, alive: 1, server_id: message.guild.id } });
                            if (foundCharacter) {
                                foundCharacter.alive = 0;
                                await foundCharacter.save();
                            }
                        } else {
                            await Player.create({
                                player_id: message.author.id,
                                player_name: message.author.username,
                                server_id: message.guild.id
                            });
                        }
                        await PlayerCharacter.create({
                            player_id: message.author.id,
                            description: newCharacterArray[5],
                            race: newCharacterArray[1],
                            class: newCharacterArray[2],
                            background: newCharacterArray[3],
                            name: newCharacterArray[0],
                            picture_url: newCharacterArray[newCharacterArray.length - 1],
                            age: newCharacterArray[4],
                            alive: 1,
                            server_id: message.guild.id
                        });
                        createdChannel.permissionOverwrites.edit(message.author, {
                            SEND_MESSAGES: false,
                            ADD_REACTIONS: false
                        });
                        return;
                    } else if (reactedEmoji === '✖️') {
                        createdChannel.delete().catch();
                        return;
                    }
                });
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

async function characterCreationQuestion(QUESTION_OBJECT, createdChannel, newCharacterArray, message, botID) {
    await createdChannel.send({ content: QUESTION_OBJECT.question, fetchReply: true }).then(async () => {

        let regExp = new RegExp(QUESTION_OBJECT.regex);
        const filter = response => {
            if (response.author.id === botID) return false;
            if (regExp.exec(response.content) === null) {
                createdChannel.send({ content: QUESTION_OBJECT.errorMessage });
                return false;
            }
            if (QUESTION_OBJECT.answers.length > 0) {
                if (!QUESTION_OBJECT.answers.some(answer => answer.toLowerCase() === response.content.toLowerCase())) {
                    createdChannel.send({ content: QUESTION_OBJECT.errorMessage, embeds: [createAnswerEmbed(QUESTION_OBJECT)] });
                    return false;
                }
            }
            return true;
        };
        await createdChannel.awaitMessages({
            filter,
            max: 1,
            time: 300000,
            errors: ['time'],
        }).then((collected) => {
            newCharacterArray.push(collected.first().content.charAt(0).toUpperCase() + collected.first().content.slice(1));
        }).catch(function () {
            createdChannel.delete().then(() => {
                message.author.send({ content: 'Times up! You took too long to respond. Try again by requesting a new character creation channel.' });
            });
        })
    });
}
function createCreatedChannelEmbed(message) {
    let embedCreatedChannel = new MessageEmbed()
        .addField(`Hello traveler!`, `<@${message.author.id.toString()}>, welcome to your character creation channel!`, true);
    return embedCreatedChannel;
}

function createNewCharacterEmbed(newCharacterArray) {
    console.log(newCharacterArray)
    const newCharacterEmbed = new MessageEmbed()
        .setColor(0x333333)
        .setTitle(`${newCharacterArray[0]}(${newCharacterArray[4]})`)
        //Set default size for image (if possible)??
        .setImage(newCharacterArray[newCharacterArray.length - 1])
        .setDescription(newCharacterArray[5])
        .addFields(
            { name: '\*\*RACE\*\*', value: `${newCharacterArray[1]}`, inline: true },
            { name: '\*\*CLASS\*\*', value: `${newCharacterArray[2]}`, inline: true },
            { name: '\*\*BACKGROUND\*\*', value: `${newCharacterArray[3]}`, inline: true },
        );
    return newCharacterEmbed;
}

function doesSeeChannel(channel, user, status) {
    channel.permissionOverwrites.edit(user, {
        VIEW_CHANNEL: status,
    });
}

function createAnswerEmbed(QUESTION_OBJECT) {
    let awnserCount = 0;
    let awnsersEmbed = new MessageEmbed()
        .setTitle('ALL POSSIBLE ANSWERS!');
    for (let index = 0; index < 3; index++) {
        let awnserString = '';
        for (let indexRaces = 0; indexRaces < QUESTION_OBJECT.answers.length / 3; indexRaces++) {
            if (QUESTION_OBJECT.answers[awnserCount] != undefined) {
                awnserString += `${QUESTION_OBJECT.answers[awnserCount]}\n`;
                awnserCount++;
            }
        }
        awnsersEmbed.addField('\u200b', awnserString, true);
    }
    return awnsersEmbed;
}