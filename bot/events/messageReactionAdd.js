// const { MessageEmbed } = require('discord.js');
const SessionRequest = require('../../database/models/SessionRequest');
const PlannedSession = require('../../database/models/PlannedSession');
const PlayerCharacter = require('../../database/models/PlayerCharacter.js');
const GeneralInfo = require('../../database/models/GeneralInfo.js');
// const PastSession = require('../../database/models/PastSession.js');
// const fs = require("fs");



module.exports = async (bot, messageReaction, user) => {
    const { message, emoji } = messageReaction;

    // When we receive a reaction we check if the reaction is partial or not
    if (messageReaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await messageReaction.fetch();
        } catch (error) {
            return console.log('Something went wrong when fetching the message: ', error);
        }
    }

    if (user.bot) return;
    if (message.guild === null) return;

    // CHANNELS
    const SESSION_REQUEST_CHANNEL = message.member.guild.channels.cache.find(c => c.name.includes("session-request") && c.type == "text");
    const PLANNED_SESSIONS_CHANNEL = message.member.guild.channels.cache.find(c => c.name.includes("planned-session") && c.type == "text");
    const PAST_SESSIONS_CHANNEL = message.member.guild.channels.cache.find(c => c.name.includes("past-session") && c.type == "text");

    // ROLES
    const DUNGEON_MASTER_ROLE = messageReaction.message.guild.roles.cache.find(role => role.name.includes('Dungeon Master'));
    // let playerRole = messageReaction.message.guild.roles.cache.find(role => role.name === 'Player');

    const USER_CHARACTER = await PlayerCharacter.findOne({ where: { player_id: user.id, alive: 1, server_id: message.guild.id } })
    // Enter if the server has a "session-request" channel.
    if (SESSION_REQUEST_CHANNEL) {
        // Enter when the message is in the "session-request" channel.
        if (message.channel.id === SESSION_REQUEST_CHANNEL.id) {
            // Return if the message is not an embed.
            if (!message.embeds[0]) return;
            // Find the session request in the database.
            const FOUND_SESSION_REQUEST = await SessionRequest.findOne({ where: { message_id: message.id } });
            const GENERAL_SERVER_INFO = await GeneralInfo.findOne({ where: { server_id: messageReaction.message.guild.id } });

            // Return if no session request has been found in the database corresponding to the server id.
            if (!FOUND_SESSION_REQUEST) return message.channel.send('Something went wrong; Cannot find this session request in the database!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
            // Return if no general server info has been found in the database corresponding to the server id.
            if (!GENERAL_SERVER_INFO) return message.channel.send('Something went wrong; Cannot find general info of this server in the database!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
            if (!message.guild.member(user.id)) return console.log('message.guild.member(user.id) is undefined!');
            // Enter if the user has a Dungeon Master role on the server.
            if (message.guild.member(user.id).roles.cache.has(DUNGEON_MASTER_ROLE.id)) {
                // Return if there is no "planned-session" channel on the server.
                if (!PLANNED_SESSIONS_CHANNEL) return message.channel.send(`No channel named "planned-session" found! Please create one.`).then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
                switch (emoji.name) {
                    case '✅':
                        // Send a planned session embed to the "session-planned" channel.
                        PLANNED_SESSIONS_CHANNEL.send(createPlannedSessionEmbed(user.id, GENERAL_SERVER_INFO.get('session_number'), message.embeds[0])).then(async plannedSessionEmbedMessage => {
                            // Edit session channel name.
                            bot.channels.cache.find(c => c.id == FOUND_SESSION_REQUEST.get('session_channel_id') && c.type == "text").setName(`session-${GENERAL_SERVER_INFO.get('session_number')}`);
                            // Create a planned session in the databse.
                            createPlannedSessionDatabaseEntry(plannedSessionEmbedMessage.id, FOUND_SESSION_REQUEST, GENERAL_SERVER_INFO, user.id, message.guild.id);
                            // Add the next session ID to each character of the party.
                            updatePartyNextSessionId(FOUND_SESSION_REQUEST.get('session_party'), plannedSessionEmbedMessage.id, message.guild.id);
                            // Delete the session request in the database.
                            deleteSessionRequestDatabaseEntry(message.id, message.guild.id);
                            return message.delete();
                        });
                    case '❌':
                        // Delete session channel.
                        bot.channels.cache.find(c => c.id == FOUND_SESSION_REQUEST.get('session_channel_id') && c.type == "text").delete();
                        // Delete the session request in the database.
                        deleteSessionRequestDatabaseEntry(message.id, message.guild.id);
                        return message.delete();

                    case '🙋‍♂️':
                        // Alert user that Dungeon Masters cant join session party.
                        message.channel.send('Dungeon Masters can not join the sessions party of players!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
                    default:
                        // Delete the user reaction a.k.a. emoji.
                        try {
                            for (const reaction of message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id)).values()) {
                                await reaction.users.remove(user.id);
                            }
                        } catch (error) {
                            console.error('Failed to remove reactions.');
                        }
                        return
                }
            } else if (USER_CHARACTER) {
                switch (emoji.name) {
                    case '🙋‍♂️':
                        return console.log('TODO: Add user to session')
                    case '✅':

                    case '❌':
                        // Alert user that Dungeon Masters cant join session party.
                        message.channel.send('You do not have permission to accept or decline a session request!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
                    default:
                        // Delete the user reaction a.k.a. emoji.
                        try {
                            for (const reaction of message.reactions.cache.filter(reaction => reaction.users.cache.has(user.id)).values()) {
                                await reaction.users.remove(user.id);
                            }
                        } catch (error) {
                            console.error('Failed to remove reactions.');
                        }
                        return
                }
            } else {
                console.log('user does not have a character in database')

            }
        }
    }

    //         if (message.guild.member(user).roles.cache.has(dmRole.id)) {
    //             if (emoji.name === '✔️') {
    //                 let foundSessionRequest = await SessionRequest.findOne({ where: { message_id: message.id } });
    //                 let generalInfo = await GeneralInfo.findOne({ where: { server_id: messageReaction.message.guild.id } });
    //                 if (generalInfo) {
    //                     if (foundSessionRequest) {
    //                         updatePartyNextSessionId(foundSessionRequest.get('session_party'), message.id, message.guild.id);
    //                         plannedSessionsChannel.send(createPlannedSessionEmbed(user.id, generalInfo.get('session_number'), message.embeds[0])).then(async message => {
    //                             createPlannedSessionDatabaseEntry(message.id, foundSessionRequest, generalInfo, user.id, message.guild.id);
    //                             await message.react('🟢');
    //                             await message.react('🔴');
    //                             let foundPlannedSession = await PlannedSession.findOne({ where: { message_id: message.id, server_id: message.guild.id } })
    //                             bot.channels.cache.find(c => c.id == foundSessionRequest.get('session_channel_id') && c.type == "text").setName(`session-${foundPlannedSession.get('session_number')}`);

    //                         });

    //                         foundSessionRequest.destroy();
    //                         message.delete();
    //                         return;
    //                     } else return message.channel.send('Something went wrong; Cannot find the right session request in the database!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
    //                 } else return message.channel.send('Something went wrong; Cannot find this server in the database!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
    //             } else if (emoji.name === '✖️') {
    //                 await deleteSessionRequestChannel(message, message.id, message.guild.id)
    //                 await deleteSessionRequest(message.id, message.guild.id);
    //                 message.delete();
    //                 return;
    //             } else return message.reactions.resolve(emoji.id).users.remove(user.id).catch(err => console.log(err));
    //         } else if (message.guild.member(user).roles.cache.has(playerRole)) {
    //             if (emoji.name.includes('adduser')) {
    //                 message.reactions.resolve(emoji.id).users.remove(user.id).catch(err => console.log(err));
    //                 await SessionRequest.findOne({ where: { message_id: message.id } }).then(async sessionRequest => {
    //                     if (!checkIfPlayerIsAlreadyInParty(sessionRequest.get('session_party'), user.id)) {
    //                         if (sessionRequest.get('session_party').length < 5) {
    //                             if (!checkIfPlayerAlreadyRequestedOrDenied(bot, user.id, message, sessionRequest.get('session_channel_id'))) {
    //                                 for (let i = 0; i < bot.sessionAddUserRequest['sessions'].length; i++) {
    //                                     if (bot.sessionAddUserRequest['sessions'][i].session_channel_id === sessionRequest.get('session_channel_id')) {
    //                                         bot.sessionAddUserRequest['sessions'][i].requested[bot.sessionAddUserRequest['sessions'][i].requested.length] = { "user_id": `${user.id}` };
    //                                         break;
    //                                     }
    //                                 }
    //                                 fs.writeFile("./jsonDb/sessionAddUserRequest.json", JSON.stringify(bot.sessionAddUserRequest, null, 4), err => {
    //                                     if (err) throw err;
    //                                 });
    //                             } else return;
    //                             try {
    //                                 const createdChannel = bot.channels.cache.find(c => c.id == sessionRequest.get('session_channel_id') && c.type == "text");
    //                                 createdChannel.send(`Hello, ${bot.users.cache.get(sessionRequest.get('session_commander_id'))}. ${user.username} is requesting to join your session!`).then(async msg => {
    //                                     await msg.react('✔️');
    //                                     await msg.react('✖️');

    //                                     const emojiFilter = (reaction, user) => {
    //                                         if (user.bot === true) return false;
    //                                         return (reaction.emoji.name === '✔️' || reaction.emoji.name === '✖️') && user.id === sessionRequest.get('session_commander_id');
    //                                     };
    //                                     msg.awaitReactions(emojiFilter, {
    //                                         max: 1,
    //                                         time: 86400000,
    //                                         errors: ['time'],
    //                                     }).then(collected => {
    //                                         msg.delete().catch();
    //                                         if (collected.first().emoji.name === '✔️') {
    //                                             user.send(`Your request to join ${bot.users.cache.get(sessionRequest.get('session_commander_id')).username}'s session has been **ACCEPTED**`);
    //                                             createdChannel.updateOverwrite(user, {
    //                                                 VIEW_CHANNEL: true,
    //                                             });
    //                                             for (let i = 0; i < bot.sessionAddUserRequest['sessions'].length; i++) {
    //                                                 if (bot.sessionAddUserRequest['sessions'][i].session_channel_id === sessionRequest.get('session_channel_id')) {
    //                                                     for (let j = 0; j < bot.sessionAddUserRequest['sessions'][i].requested.length; j++) {
    //                                                         if (bot.sessionAddUserRequest['sessions'][i].requested[j].user_id === user.id) {
    //                                                             bot.sessionAddUserRequest['sessions'][i].requested[j].user_id = "";
    //                                                             break;
    //                                                         }
    //                                                     }
    //                                                 }
    //                                             }
    //                                             fs.writeFile("./jsonDb/sessionAddUserRequest.json", JSON.stringify(bot.sessionAddUserRequest, null, 4), err => {
    //                                                 if (err) throw err;
    //                                             });
    //                                             message.edit(updateSessionRequestEmbedPartyMembers(message, sessionRequest.get('session_party'), user.id).embeds[0]);
    //                                             updateDatabaseSessionRequestParty(sessionRequest, user.id);
    //                                         } else if (collected.first().emoji.name === '✖️') {
    //                                             user.send(`Your request to join ${bot.users.cache.get(sessionRequest.get('session_commander_id')).username}'s session has been **DECLINED**`);
    //                                             for (let i = 0; i < bot.sessionAddUserRequest['sessions'].length; i++) {
    //                                                 if (bot.sessionAddUserRequest['sessions'][i].session_channel_id === sessionRequest.get('session_channel_id')) {
    //                                                     for (let j = 0; j < bot.sessionAddUserRequest['sessions'][i].requested.length; j++) {
    //                                                         if (bot.sessionAddUserRequest['sessions'][i].requested[j].user_id === user.id) {
    //                                                             bot.sessionAddUserRequest['sessions'][i].requested[j].user_id = "";
    //                                                             bot.sessionAddUserRequest['sessions'][i].denied[bot.sessionAddUserRequest['sessions'][i].denied.length] = { "user_id": `${user.id}` };
    //                                                             break;
    //                                                         }
    //                                                     }
    //                                                 }
    //                                             }
    //                                             fs.writeFile("./jsonDb/sessionAddUserRequest.json", JSON.stringify(bot.sessionAddUserRequest, null, 4), err => {
    //                                                 if (err) throw err;
    //                                             });
    //                                         }
    //                                     }).catch(() => {
    //                                         msg.delete().catch();
    //                                         user.send(`Your request to join ${bot.users.cache.get(sessionRequest.get('session_commander_id')).username}'s session has **NOT BEEN ANSWERED**`);
    //                                     });
    //                                 });
    //                             } catch (error) {
    //                                 console.log(error)
    //                             }
    //                             return;
    //                         } else return message.channel.send('A session can only have 5 players!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
    //                     } else return message.channel.send('You are already in this session request!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
    //                 }).catch(error => console.error(error));
    //             }
    //         } else return message.reactions.cache.get(emoji.name).remove().catch(error => console.error('Failed to remove reactions: ', error));
    //     }
    // }
    // if (plannedSessionsChannel) {
    //     if (message.channel.id === plannedSessionsChannel.id) {
    //         if (message.guild.member(user).roles.cache.has(dmRole.id)) {
    //             let editedEmbed = new MessageEmbed(message.embeds[0]);
    //             let foundPlannedSession = await PlannedSession.findOne({ where: { message_id: message.id, server_id: message.guild.id } });
    //             if (foundPlannedSession) {
    //                 let sessionStatus;
    //                 if (emoji.name === '🟢') {
    //                     sessionStatus = 'PLAYED';
    //                     editedEmbed.setTitle(`${editedEmbed.title} [${sessionStatus}]`);
    //                     createPastSessionDatabaseEntry(message.id, foundPlannedSession, sessionStatus, message.guild.id).then(() => {
    //                         foundPlannedSession.destroy();
    //                         pastSessionsChannel.send(editedEmbed);
    //                         message.delete();
    //                         bot.channels.cache.find(c => c.id == foundPlannedSession.get('session_channel_id') && c.type == "text").delete();
    //                     });
    //                 } else if (emoji.name === '🔴') {
    //                     sessionStatus = 'CANCELED';
    //                     editedEmbed.setTitle(`${editedEmbed.title} [${sessionStatus}]`);
    //                     createPastSessionDatabaseEntry(message.id, foundPlannedSession, sessionStatus, message.guild.id).then(() => {
    //                         foundPlannedSession.destroy();
    //                         pastSessionsChannel.send(editedEmbed);
    //                         message.delete();
    //                         bot.channels.cache.find(c => c.id == foundPlannedSession.get('session_channel_id') && c.type == "text").delete();
    //                     });
    //                 } else return message.reactions.resolve(emoji.id).users.remove(user.id).catch(err => console.log(err));
    //             } else return message.channel.send('Could not find the planned session in the database!').then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));
    //         }
    //     }
    // }
}

// String.prototype.replaceAt = function (index, replacement) {
//     if (index >= this.length) {
//         return this.valueOf();
//     }
//     return this.substring(0, index) + replacement + this.substring(index + 1);
// }
function createPlannedSessionDatabaseEntry(sessionId, foundSessionRequest, generalInfo, dungeonMasterId, serverId) {
    PlannedSession.create({
        message_id: sessionId,
        session_commander_id: foundSessionRequest.get('session_commander_id'),
        session_party: foundSessionRequest.get('session_party'),
        date: foundSessionRequest.get('date'),
        objective: foundSessionRequest.get('objective'),
        session_number: generalInfo.get('session_number'),
        dungeon_master_id: dungeonMasterId,
        session_channel_id: foundSessionRequest.get('session_channel_id'),
        session_status: 'NOT PLAYED YET',
        server_id: serverId
    }).then(() => {
        generalInfo.session_number += 1;
        generalInfo.save();
    });
}
function updatePartyNextSessionId(party, next_session_id, serverId) {
    party.forEach(player => {
        PlayerCharacter.update(
            { next_session_id: next_session_id },
            { where: { player_id: player, alive: 1, server_id: serverId } });
    });
}
function createPlannedSessionEmbed(dungeonMasterId, sessionNumber, editedEmbed) {
    editedEmbed.fields[2].value = `<@!${dungeonMasterId}>`;
    editedEmbed.setTitle(`**Session_${sessionNumber}: **`);
    return editedEmbed;
}
async function deleteSessionRequestDatabaseEntry(sessionId, serverId) {
    await SessionRequest.findOne({ where: { message_id: sessionId, server_id: serverId } }).then(sessionRequest => {
        sessionRequest.destroy();
    });
}
// async function deleteSessionRequestChannel(message, sessionId, serverId) {
//     await SessionRequest.findOne({ where: { message_id: sessionId, server_id: serverId } }).then(sessionRequest => {
//         message.guild.channels.cache.find(r => r.id === sessionRequest.get('session_channel_id')).delete();
//     });
// }
// function updateDatabaseSessionRequestParty(sessionRequest, playerId) {
//     let partyMembers = sessionRequest.get('session_party');
//     partyMembers.push(playerId);
//     sessionRequest.session_party = partyMembers;
//     sessionRequest.save();
// }
// function updateSessionRequestEmbedPartyMembers(message, party, playerId) {
//     message.embeds[0].fields[1].value += `, <@${playerId}>`;
//     message.embeds[0].fields[1].name = message.embeds[0].fields[1].name.replace(`${party.length}`, `${party.length + 1}`);
//     return message;
// }
// function checkIfPlayerIsAlreadyInParty(party, playerId) {
//     if (party.includes(playerId)) {
//         return true;
//     } else return false;
// }
// function checkIfPlayerAlreadyRequestedOrDenied(bot, userId, message, sessionChannelId) {
//     for (let i = 0; i < bot.sessionAddUserRequest['sessions'].length; i++) {
//         if (bot.sessionAddUserRequest['sessions'][i].session_channel_id === sessionChannelId) {
//             for (let j = 0; j < bot.sessionAddUserRequest['sessions'][i].requested.length; j++) {
//                 if (bot.sessionAddUserRequest['sessions'][i].requested[j].user_id === userId) {
//                     message.channel.send(`${bot.users.cache.get(userId)}, you already requested to join this session, please be patient!`).then(msg => msg.delete({ timeout: 3000 })).catch(err => console.log(err));;
//                     return true;
//                 }
//             }
//             for (let j = 0; j < bot.sessionAddUserRequest['sessions'][i].denied.length; j++) {
//                 if (bot.sessionAddUserRequest['sessions'][i].denied[j].user_id === userId) {
//                     message.channel.send(`${bot.users.cache.get(userId)}, your request to join this session was declined by the session commander, better luck next time!`).then(msg => msg.delete({ timeout: 5000 })).catch(err => console.log(err));;
//                     return true;
//                 }
//             }
//             break;
//         }
//     }
//     return false;
// }
// async function createPastSessionDatabaseEntry(id, foundPlannedSession, sessionStatus, serverId) {
//     return new Promise(async function (resolve, reject) {
//         await PastSession.create({
//             message_id: id,
//             session_commander_id: foundPlannedSession.get('session_commander_id'),
//             session_party: foundPlannedSession.get('session_party'),
//             date: foundPlannedSession.get('date'),
//             objective: foundPlannedSession.get('objective'),
//             session_number: foundPlannedSession.get('session_number'),
//             dungeon_master_id: foundPlannedSession.get('dungeon_master_id'),
//             session_status: sessionStatus,
//             server_id: serverId
//         }).then(() => { resolve() }).catch(err => console.log(err));
//     })
// }