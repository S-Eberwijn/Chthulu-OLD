const { MessageEmbed } = require('discord.js');
const { SessionRequest } = require('../../../database/models/SessionRequest');
const { PlayerCharacter } = require('../../../database/models/PlayerCharacter');
const fs = require("fs");

const COMMAND_OPTIONS = ['request'];
const QUESTIONS_ARRAY = require('../../jsonDb/sessionChannelQuestion.json');
const NAME_OF_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

module.exports.run = async (interaction) => {
    const bot = require('../../../index');

    // VARIABLES
    const SESSIONS_CATEGORY = interaction.member.guild.channels.cache.find(c => c.name == "--SESSIONS--" && c.type == "GUILD_CATEGORY");
    const SESSION_REQUEST_CHANNEL = interaction.member.guild.channels.cache.find(c => c.name.includes("session-request") && c.type == "GUILD_TEXT");
    let messageAuthorCharacter = await PlayerCharacter.findOne({ where: { player_id_discord: interaction.user.id, alive: 1, server: interaction.guild.id } });
    if (!messageAuthorCharacter) return interaction.reply({ content: `You do not have a character in the database!\nCreate one by using the "!createcharacter" command.` }).then(() => { setTimeout(() => interaction.deleteReply(), 3000) }).catch(err => console.log(err));
    if (!SESSIONS_CATEGORY) return interaction.reply({ content: `There is no category named \"--SESSIONS--\"!` }).then(() => { setTimeout(() => interaction.deleteReply(), 3000) }).catch(err => console.log(err));
    if (!interaction.options.get('action').value) return interaction.channel.send({ content: "Not enough valid arguments\nCorrect format: !session [request]" });
    if (!COMMAND_OPTIONS.includes(interaction.options.get('action').value)) return interaction.channel.send({ content: "Not a valid session option\nCorrect format: !session [request]" });

    switch (interaction.options.get('action').value) {
        case 'request':
            let sessionDate, sessionObjective, sessionParticipants = [interaction.user.id];

            // Makes a request channel for the message author
            interaction.guild.channels.create(`${interaction.user.username}s-request`, "text").then(async createdChannel => {
                // TODO: Add right permission to the right people (DM'S, Players, Session Part)

                // Puts the channel under the "--SESSIONS--" category
                createdChannel.setParent(SESSIONS_CATEGORY, { lockPermission: false });

                // Update channel permissions so everyone can't see it.
                createdChannel.permissionOverwrites.edit(interaction.channel.guild.roles.everyone, {
                    CREATE_INSTANT_INVITE: false,
                    KICK_MEMBERS: false,
                    BAN_MEMBERS: false,
                    ADMINISTRATOR: false,
                    MANAGE_CHANNELS: false,
                    MANAGE_GUILD: false,
                    ADD_REACTIONS: false,
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: false,
                    SEND_TTS_MESSAGES: false,
                    MANAGE_MESSAGES: false,
                    EMBED_LINKS: false,
                    ATTACH_FILES: false,
                    READ_MESSAGE_HISTORY: false,
                    MENTION_EVERYONE: false,
                    USE_EXTERNAL_EMOJIS: false,
                    VIEW_GUILD_INSIGHTS: false,
                    CHANGE_NICKNAME: false,
                    MANAGE_NICKNAMES: false,
                    MANAGE_ROLES: false,
                    MANAGE_WEBHOOKS: false,
                    MANAGE_THREADS: false,
                    USE_PUBLIC_THREADS: false,
                });

                // Update channel permissions so Dungeon Masters can see it.
                createdChannel.permissionOverwrites.edit(interaction.guild.roles.cache.find(role => role.name.toLowerCase().includes('dungeon master')), {
                    CREATE_INSTANT_INVITE: false,
                    KICK_MEMBERS: false,
                    BAN_MEMBERS: false,
                    ADMINISTRATOR: false,
                    MANAGE_CHANNELS: false,
                    MANAGE_GUILD: false,
                    ADD_REACTIONS: true,
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                    SEND_TTS_MESSAGES: false,
                    MANAGE_MESSAGES: true,
                    EMBED_LINKS: true,
                    ATTACH_FILES: true,
                    READ_MESSAGE_HISTORY: true,
                    MENTION_EVERYONE: false,
                    USE_EXTERNAL_EMOJIS: true,
                    VIEW_GUILD_INSIGHTS: false,
                    CHANGE_NICKNAME: true,
                    MANAGE_NICKNAMES: true,
                    MANAGE_ROLES: true,
                    MANAGE_WEBHOOKS: true,
                    MANAGE_THREADS: false,
                    USE_PUBLIC_THREADS: false,
                });

                // Update channel permissions so session commander can see it.
                createdChannel.permissionOverwrites.edit(bot.users.cache.get(interaction.user.id), {
                    CREATE_INSTANT_INVITE: false,
                    KICK_MEMBERS: false,
                    BAN_MEMBERS: false,
                    ADMINISTRATOR: false,
                    MANAGE_CHANNELS: false,
                    MANAGE_GUILD: false,
                    ADD_REACTIONS: true,
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                    SEND_TTS_MESSAGES: false,
                    MANAGE_MESSAGES: false,
                    EMBED_LINKS: true,
                    ATTACH_FILES: true,
                    READ_MESSAGE_HISTORY: true,
                    MENTION_EVERYONE: false,
                    USE_EXTERNAL_EMOJIS: true,
                    VIEW_GUILD_INSIGHTS: false,
                    CHANGE_NICKNAME: true,
                    MANAGE_NICKNAMES: false,
                    MANAGE_ROLES: false,
                    MANAGE_WEBHOOKS: false,
                    MANAGE_THREADS: false,
                    USE_PUBLIC_THREADS: false,
                });

                createdChannel.send({ content: `<@!${interaction.user.id}>, welcome to your session request channel!` }).then(async () => {

                    for (const QUESTION_OBJECT of QUESTIONS_ARRAY) {
                        await createdChannel.send({ content: QUESTION_OBJECT.question, fetchReply: true }).then(async () => {
                            let regExp = new RegExp(QUESTION_OBJECT.regex);
                            const filter = response => {
                                if (response.author.id === bot.user.id) {
                                    return false;
                                } else if (regExp.exec(response.content) === null) {
                                    createdChannel.send({ content: QUESTION_OBJECT.errorMessage });
                                    return false;
                                } else return true;
                            };
                            await createdChannel.awaitMessages({ filter, max: 1, time: 300000, errors: ['time'] }).then((collected) => {
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
                                        // Update channel permissions so session commander can see it.
                                        createdChannel.permissionOverwrites.edit(bot.users.cache.get(user.id), {
                                            CREATE_INSTANT_INVITE: false,
                                            KICK_MEMBERS: false,
                                            BAN_MEMBERS: false,
                                            ADMINISTRATOR: false,
                                            MANAGE_CHANNELS: false,
                                            MANAGE_GUILD: false,
                                            ADD_REACTIONS: true,
                                            VIEW_CHANNEL: true,
                                            SEND_MESSAGES: true,
                                            SEND_TTS_MESSAGES: false,
                                            MANAGE_MESSAGES: false,
                                            EMBED_LINKS: true,
                                            ATTACH_FILES: true,
                                            READ_MESSAGE_HISTORY: true,
                                            MENTION_EVERYONE: false,
                                            USE_EXTERNAL_EMOJIS: true,
                                            VIEW_GUILD_INSIGHTS: false,
                                            CHANGE_NICKNAME: true,
                                            MANAGE_NICKNAMES: false,
                                            MANAGE_ROLES: false,
                                            MANAGE_WEBHOOKS: false,
                                            MANAGE_THREADS: false,
                                            USE_PUBLIC_THREADS: false,
                                        });
                                    });
                                    // Take away permission for everyone else than the party and DM's to see the session channel
                                    createdChannel.permissionOverwrites.edit(interaction.channel.guild.roles.everyone, {
                                        VIEW_CHANNEL: false,
                                    });
                                } else if (QUESTION_OBJECT.question.includes('objective')) {
                                    sessionObjective = collected.first().content;
                                }
                            }).catch(function () {
                                return createdChannel.delete().then(() => {
                                    interaction.user.send({ content: 'Times up! You took too long to respond. Try again by requesting a new session request channel.' });
                                });
                            })
                        });
                    };

                    SESSION_REQUEST_CHANNEL.send({ embeds: [createSessionChannelEmbed(interaction.user, sessionDate, sessionParticipants, sessionObjective, messageAuthorCharacter['picture_url'])] }).then(async sessionChannelEmbedMessage => {
                        await createSessionRequestDatabaseEntry(sessionChannelEmbedMessage.id, sessionDate, sessionParticipants, sessionObjective, createdChannel.id, interaction.guild.id)
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
    let timestamp = Date.now();
    SessionRequest.create({
        id: `S${timestamp}`,
        message_id_discord: sessionRequestEmbedId,
        session_channel: sessionChannelId,
        session_commander: sessionParticipants[0],
        session_party: sessionParticipants,
        date: sessionDate.toString(),
        objective: sessionObjective,
        server: serverId
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