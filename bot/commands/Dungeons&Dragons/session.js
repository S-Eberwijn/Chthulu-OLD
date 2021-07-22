const { MessageEmbed } = require('discord.js');
const SessionRequest = require('../../../database/models/SessionRequest');
const PlayerCharacter = require('../../../database/models/PlayerCharacter');
const fs = require("fs");


const COMMAND_OPTIONS = ['request'];
const AWAIT_MESSAGE_OPTIONS = {
    max: 1,
    time: 300000,
    errors: ['time'],
};
const QUESTIONS_ARRAY = require('../../jsonDb/sessionChannelQuestion.json');
const NAME_OF_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

module.exports.run = async (bot, message, args) => {
    message.delete();

    // VARIABLES
    const SESSIONS_CATEGORY = message.member.guild.channels.cache.find(c => c.name == "--SESSIONS--" && c.type == "category");
    const SESSION_REQUEST_CHANNEL = message.member.guild.channels.cache.find(c => c.name.includes("session-request") && c.type == "text");
    let messageAuthorCharacter = await PlayerCharacter.findOne({ where: { player_id: message.author.id, alive: 1, server_id: message.guild.id } });
    if (!messageAuthorCharacter) return message.reply(`You do not have a character in the database!\nCreate one by using the "!createcharacter" command.`).then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
    if (!SESSIONS_CATEGORY) return message.reply(`There is no category named \"--SESSIONS--\"!`).then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
    if (!args[0]) return message.reply("Not enough valid arguments\nCorrect format: !session [request]");
    if (!COMMAND_OPTIONS.includes(args[0])) return message.reply("Not a valid session option\nCorrect format: !session [request]");

    switch (args[0]) {
        case 'request':
            let sessionDate, sessionObjective, sessionParticipants = [message.author.id];

            // Makes a request channel for the message author
            message.guild.channels.create(`${message.author.username}s-request`, "text").then(async createdChannel => {
                // TODO: Add right permission to the right people (DM'S, Players, Session Part)

                // Puts the channel under the "--SESSIONS--" category
                createdChannel.setParent(SESSIONS_CATEGORY, { lockPermission: false });

                // Update channel permissions so everyone can't see it.
                createdChannel.updateOverwrite(message.channel.guild.roles.everyone, {
                    VIEW_CHANNEL: false,
                });
                
                // Update channel permissions so Dungeon Masters can see it.
                createdChannel.updateOverwrite(message.guild.roles.cache.find(role => role.name.toLowerCase().includes('dungeon master')), {
                    VIEW_CHANNEL: true,
                });
                // sessionRequest.get('session_party').forEach(playerId => {
                //     createdChannel.updateOverwrite(bot.users.cache.get(playerId), {
                //         VIEW_CHANNEL: true,
                //     });
                // });

                createdChannel.send(`<@!${message.author.id}>, welcome to your session request channel!`).then(async () => {

                    for (const QUESTION_OBJECT of QUESTIONS_ARRAY) {
                        console.log(QUESTION_OBJECT)
                        await createdChannel.send(QUESTION_OBJECT.question).then(async function () {
                            let dateRegExp = new RegExp(QUESTION_OBJECT.regex);
                            const filter = response => {
                                if (response.author.id === bot.user.id) {
                                    return false;
                                } else if (dateRegExp.exec(response.content) === null) {
                                    createdChannel.send(QUESTION_OBJECT.errorMessage);
                                    return false;
                                } else return true;
                            };
                            await createdChannel.awaitMessages(filter, AWAIT_MESSAGE_OPTIONS).then((collected) => {
                                if (QUESTION_OBJECT.question.includes('date')) {
                                    let day = collected.first().content.split('/')[0];
                                    let month = collected.first().content.split('/')[1];
                                    try {
                                        sessionDate = new Date(new Date().getFullYear(), month - 1, day);
                                    } catch (error) {
                                        console.log(error)
                                        // TODO: Ask question again
                                    }
                                } else if (QUESTION_OBJECT.question.includes('time')) {
                                    let hours = collected.first().content.split(':')[0];
                                    let minutes = collected.first().content.split(':')[1];
                                    try {
                                        sessionDate.setHours(hours);
                                        sessionDate.setMinutes(minutes);
                                        console.log(sessionDate.toString())
                                    } catch (error) {
                                        console.log(error)
                                        // TODO: Ask question again
                                    }
                                } else if (QUESTION_OBJECT.question.includes('players')) {
                                    collected.first().mentions.users.first(4).forEach(user => {
                                        sessionParticipants.push(user.id)
                                    });
                                } else if (QUESTION_OBJECT.question.includes('objective')) {
                                    sessionObjective = collected.first().content;
                                }
                            }).catch(function () {
                                return createdChannel.delete().then(() => {
                                    message.author.send('Times up! You took too long to respond. Try again by requesting a new session request channel.');
                                });
                            })
                        });
                    };

                    SESSION_REQUEST_CHANNEL.send(createSessionChannelEmbed(message.author, sessionDate, sessionParticipants, sessionObjective, messageAuthorCharacter['picture_url'])).then(async sessionChannelEmbedMessage => {
                        await createSessionRequestDatabaseEntry(sessionChannelEmbedMessage.id, sessionDate, sessionParticipants, sessionObjective, createdChannel.id, message.guild.id)
                        bot.sessionAddUserRequest['sessions'][bot.sessionAddUserRequest['sessions'].length] = {
                            session_channel_id: createdChannel.id,
                            requested: [],
                            denied: []
                        }
                        writeToJsonDb("./bot/jsonDb/sessionAddUserRequest.json", bot.sessionAddUserRequest);
                        await sessionChannelEmbedMessage.react('✅');
                        await sessionChannelEmbedMessage.react('❌');
                        await sessionChannelEmbedMessage.react('🙋‍♂️');
                    })
                });
            });
            break;

        default:
            break;
    }
}



module.exports.help = {
    name: "session",
    alias: [],
    description: "Handles actions around sessions",
    category: "Dungeons & Dragons"
}

function createSessionChannelEmbed(messageAuthor, sessionDate, sessionParticipants, sessionObjective, sessionCommanderAvatar) {
    return new MessageEmbed()
        .setThumbnail(sessionCommanderAvatar)
        .setColor(0x333333)
        .setTitle(`**Session Request**`)
        .addFields(
            { name: `**Session Commander:**`, value: `<@!${sessionParticipants[0]}>\n`, inline: false },
            { name: `**Players(${sessionParticipants.length}/5):**`, value: `${sessionParticipants.map(id => `<@!${id}>`).join(', ')}`, inline: false },
            { name: `**DM:**`, value: `*TBD*`, inline: false },
            { name: `**Time:**`, value: `*${NAME_OF_DAYS[sessionDate.getDay()]} (${getDoubleDigitNumber(sessionDate.getDate())}/${getDoubleDigitNumber(sessionDate.getMonth() + 1)}) ${getDoubleDigitNumber(sessionDate.getHours())}:${getDoubleDigitNumber(sessionDate.getMinutes())}*`, inline: false },
            { name: `**Location:**`, value: `*Roll20 (online)*`, inline: false },
            { name: `**Objective:**`, value: `*${sessionObjective}*`, inline: false },
        )
        .setTimestamp()
        .setFooter(`Requested by ${messageAuthor.username}`, messageAuthor.avatarURL());
}

function createSessionRequestDatabaseEntry(sessionRequestEmbedId, sessionDate, sessionParticipants, sessionObjective, sessionChannelId, serverId) {
    SessionRequest.create({
        message_id: sessionRequestEmbedId,
        session_channel_id: sessionChannelId,
        session_commander_id: sessionParticipants[0],
        session_party: sessionParticipants,
        date: sessionDate.toString(),
        objective: sessionObjective,
        server_id: serverId
    });
}

function getDoubleDigitNumber(number) {
    if (number < 10) return `0${number}`;
    return `${number}`;
}

// TODO: Centralize this code
function writeToJsonDb(location, data) {
    fs.writeFile(`${location}`, JSON.stringify(data, null, 4), err => {
        if (err) throw err;
    });
}