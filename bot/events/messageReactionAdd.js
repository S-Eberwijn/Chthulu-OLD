// const { MessageEmbed } = require('discord.js');
const { SessionRequest } = require('../../database/models/SessionRequest');
const { PlannedSession } = require('../../database/models/PlannedSession');
const { PlayerCharacter } = require('../../database/models/PlayerCharacter.js');
const { GeneralInfo } = require('../../database/models/GeneralInfo.js');
const { PastSession } = require('../../database/models/PastSession.js');
const fs = require("fs");

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
    const SESSION_REQUEST_CHANNEL_ID = message.guild?.channels.cache.find(c => c.name.includes("session-request") && c.type == "GUILD_TEXT") ? message.guild.channels.cache.find(c => c.name.includes("session-request") && c.type == "GUILD_TEXT").id : '';
    const PLANNED_SESSIONS_CHANNEL = message.guild?.channels.cache.find(c => c.name.includes("planned-session") && c.type == "GUILD_TEXT");
    const PLANNED_SESSIONS_CHANNEL_ID = message.guild?.channels.cache.find(c => c.name.includes("planned-session") && c.type == "GUILD_TEXT") ? message.guild.channels.cache.find(c => c.name.includes("planned-session") && c.type == "GUILD_TEXT").id : '';
    const PAST_SESSIONS_CHANNEL = message.guild?.channels.cache.find(c => c.name.includes("past-session") && c.type == "GUILD_TEXT");

    // ROLES
    const DUNGEON_MASTER_ROLE = messageReaction.message.guild.roles.cache.find(role => role.name.includes('Dungeon Master'));

    // console.log(DUNGEON_MASTER_ROLE);
    // Enter when the message is in the "session-request" channel.
    if (message.channel.id === SESSION_REQUEST_CHANNEL_ID) {
        const USER_CHARACTER = await PlayerCharacter.findOne({ where: { player_id_discord: user.id, alive: 1, server: message.guild.id } })

        // Return if the message is not an embed.
        if (!message.embeds[0]) return;
        // Find the session request in the database.
        let FOUND_SESSION_REQUEST = await SessionRequest.findOne({ where: { message_id_discord: message.id } });
        // Find the server in the database.
        const GENERAL_SERVER_INFO = await GeneralInfo.findOne({ where: { server: messageReaction.message.guild.id } });
        // Return if no session request has been found in the database corresponding to the server id.
        if (!FOUND_SESSION_REQUEST) return message.channel.send({ content: 'Something went wrong; Cannot find this session request in the database!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
        // Return if no general server info has been found in the database corresponding to the server id.
        if (!GENERAL_SERVER_INFO) return message.channel.send({ content: 'Something went wrong; Cannot find general info of this server in the database!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
        if (!message.guild.members.cache.get(user.id)) return console.log({ content: 'message.guild.members.cache.get(user.id) is undefined!' });
        // Enter if the user has a Dungeon Master role on the server.
        if (message.guild.members.cache.get(user.id).roles.cache.has(DUNGEON_MASTER_ROLE.id)) {
            // Return if there is no "planned-session" channel on the server.
            if (!PLANNED_SESSIONS_CHANNEL) return message.channel.send({ content: `No channel named "planned-sessions" found! Please create one first.` }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
            try {
                switch (emoji.name) {
                    case '✅':
                        // Send a planned session embed to the "session-planned" channel.
                        PLANNED_SESSIONS_CHANNEL.send({ embeds: [createPlannedSessionEmbed(user.id, GENERAL_SERVER_INFO.session_number, message.embeds[0])] }).then(async plannedSessionEmbedMessage => {
                            // Edit session channel name.
                            message.guild.channels.cache.get(FOUND_SESSION_REQUEST.session_channel).setName(`session-${GENERAL_SERVER_INFO.session_number}`)
                            // Create a planned session in the databse.
                            createPlannedSessionDatabaseEntry(plannedSessionEmbedMessage.id, FOUND_SESSION_REQUEST, GENERAL_SERVER_INFO, user.id, message.guild.id);
                            // Add the next session ID to each character of the party.
                            updatePartyNextSessionId(FOUND_SESSION_REQUEST.session_party, plannedSessionEmbedMessage.id, message.guild.id);
                            // Delete the session request in the database.
                            deleteSessionRequestDatabaseEntry(message.id, message.guild.id);

                            await plannedSessionEmbedMessage.react('🟢');
                            await plannedSessionEmbedMessage.react('🔴');
                            await plannedSessionEmbedMessage.react('🙋‍♂️');

                            message.delete();
                        });
                        break;
                    case '❌':
                        // Delete session channel.
                        message.guild.channels.cache.get(FOUND_SESSION_REQUEST.session_channel).delete();
                        // Delete the session request in the database.
                        deleteSessionRequestDatabaseEntry(message.id, message.guild.id);
                        // Delete the session request embed.
                        message.delete();
                        break;

                    case '🙋‍♂️':
                        // Alert user that Dungeon Masters cant join session party.
                        message.channel.send({ content: 'Dungeon Masters can not join the sessions party of players!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
                    default:
                        // Delete the user reaction a.k.a. emoji.
                        return await deleteReactionFromUser(message, user.id);
                }
            } catch (error) {
                console.log(error);
            }
        } else if (USER_CHARACTER) {
            try {
                switch (emoji.name) {
                    case '🙋‍♂️':
                        //Return if player is already in the session.
                        if (isPlayerAlreadyInSessionParty(FOUND_SESSION_REQUEST.session_party, user.id)) return message.channel.send({ content: 'You are already in this session!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
                        // Return if session is full and no more players can fit.
                        if (!(FOUND_SESSION_REQUEST.session_party.length < 5)) return message.channel.send({ content: 'This session is full! Only 5 players are allowed!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
                        // Return if the user already requested for the session.
                        if (playerAlreadyRequestedForSession(bot, user.id, message, FOUND_SESSION_REQUEST.session_channel)) return message.channel.send({ content: `You already requested to join this session, please be patient!` }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
                        // Return if the user already has been denied for the session.
                        if (playerAlreadyBeenDenied(bot, user.id, message, FOUND_SESSION_REQUEST.session_channel)) return message.channel.send({ content: `Your request to join this session has already been declined by the session commander, better luck next time!` }).then(msg => { setTimeout(() => msg.delete(), 5000) }).catch(err => console.log(err));
                        // Give user feedback on asking the session commander if he/she may join the session.
                        message.channel.send({ content: `${user}, I have asked the session commander if you may join the session. Please give him/her some time to decide!` }).then(msg => { setTimeout(() => msg.delete(), 5000) }).catch(err => console.log(err));
                        // Add REQUESTED-status to user in designated database. 
                        giveUserRequestedStatus(bot, FOUND_SESSION_REQUEST, user)
                        // Send a message in the session channel to ask the session commander if the user may join the session.
                        const SESSION_CHANNEL = bot.channels.cache.find(c => c.id == FOUND_SESSION_REQUEST.session_channel && c.type == "text");
                        SESSION_CHANNEL.send({ content: `Hello, ${bot.users.cache.get(FOUND_SESSION_REQUEST.session_commander)}. <@!${user.id}> (${USER_CHARACTER.name.trim()}) is requesting to join your session!` }).then(async msg => {
                            await msg.react('✔️');
                            await msg.react('✖️');

                            const emojiFilter = (reaction, user) => {
                                if (user.bot === true) return false;
                                return (reaction.emoji.name === '✔️' || reaction.emoji.name === '✖️') && user.id === FOUND_SESSION_REQUEST.session_commander;
                            };
                            msg.awaitReactions(emojiFilter, {
                                max: 1,
                                time: 86400000,
                                errors: ['time'],
                            }).then(async collected => {
                                msg.delete().catch(err => console.error(err));
                                switch (collected.first().emoji.name) {
                                    case '✔️':
                                        // Check again if in the meantime the sessions party is already full.
                                        FOUND_SESSION_REQUEST = await SessionRequest.findOne({ where: { message_id_discord: message.id } });
                                        if (!(FOUND_SESSION_REQUEST.session_party.length < 5)) return msg.channel.send({ content: 'This session is full! Only 5 players are allowed!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
                                        // Send the person who wants to join the session he/she got accepted.
                                        user.send({ content: `Your request to join ${bot.users.cache.get(FOUND_SESSION_REQUEST.session_commander).username}'s session has been **ACCEPTED**` });
                                        // Adjust permissions of session channel so the newly allowed player can see the channel.
                                        SESSION_CHANNEL.permissionOverwrites.edit(bot.users.cache.get(user.id), {
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
                                            MANAGE_EMOJIS: false,
                                            USE_SLASH_COMMANDS: false,
                                            MANAGE_THREADS: false,
                                            USE_PUBLIC_THREADS: false,
                                        });
                                        // Remove user REQUESTED-status in JSON database. 
                                        removeUserRequestStatus(bot, FOUND_SESSION_REQUEST, user)
                                        // Update session party database entry.
                                        updateDatabaseSessionParty(FOUND_SESSION_REQUEST, user.id);
                                        // Edit the session message embed.
                                        message.edit(updateSessionEmbedParty(message, FOUND_SESSION_REQUEST.session_party).embeds[0]);
                                        break;
                                    case '✖️':
                                        // Send the person who requested to join the session, he/she got declined.
                                        user.send({ content: `Your request to join ${bot.users.cache.get(FOUND_SESSION_REQUEST.session_commander).username}'s session has been **DECLINED**` });
                                        // Give the user a DENIED-status in the JSON database.
                                        giveUserDeniedStatus(bot, FOUND_SESSION_REQUEST, user)
                                        break;
                                }
                            }).catch(err => {
                                console.error(err);
                                // Send the person who wants to join the session his/her request has not been answered.
                                user.send({ content: `Your request to join ${bot.users.cache.get(FOUND_SESSION_REQUEST.session_commander).username}'s session has **NOT BEEN ANSWERED**` });
                                // Remove user REQUESTED-status in JSON database. 
                                removeUserRequestStatus(bot, FOUND_SESSION_REQUEST, user)
                            })
                        })
                        return;
                    case '✅':

                    case '❌':
                        // Alert user that Dungeon Masters cant join session party.
                        message.channel.send({ content: 'You do not have permission to accept or decline a session request!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
                    default:
                        // Delete the user reaction a.k.a. emoji.
                        return await deleteReactionFromUser(message, user.id)
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            message.channel.send({ content: 'You do not have a character in the database of this server! Please create one by typing "!createCharacter".' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
            return await deleteReactionFromUser(message, user.id)
        }
    } else if (message.channel.id === PLANNED_SESSIONS_CHANNEL_ID) {
        const USER_CHARACTER = await PlayerCharacter.findOne({ where: { player_id_discord: user.id, alive: 1, server: message.guild.id } })

        // Return if the message is not an embed.
        if (!message.embeds[0]) return;
        // Find the session request in the database.
        let FOUND_PLANNED_SESSION = await PlannedSession.findOne({ where: { message_id_discord: message.id } });
        // Find the server in the database.
        const GENERAL_SERVER_INFO = await GeneralInfo.findOne({ where: { server: messageReaction.message.guild.id } });
        // Return if no session request has been found in the database corresponding to the server id.
        if (!FOUND_PLANNED_SESSION) return message.channel.send({ content: 'Something went wrong; Cannot find this session request in the database!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
        // Return if no general server info has been found in the database corresponding to the server id.
        if (!GENERAL_SERVER_INFO) return message.channel.send({ content: 'Something went wrong; Cannot find general info of this server in the database!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
        if (!message.guild.members.cache.get(user.id)) return console.log('message.guild.members.cache.get(user.id) is undefined!');

        if (message.guild.members.cache.get(user.id).roles.cache.has(DUNGEON_MASTER_ROLE.id)) {
            // Return if there is no "planned-session" channel on the server.
            if (!PAST_SESSIONS_CHANNEL) return message.channel.send({ content: `No channel named "past-sessions" found! Please create one first.` }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
            try {
                let sessionStatus = '';
                switch (emoji.name) {
                    case '🟢':
                        sessionStatus = 'PLAYED';
                        break;
                    case '🔴':
                        sessionStatus = 'CANCELED';
                        break;
                    case '🙋‍♂️':
                        // Delete the user reaction a.k.a. emoji.
                        await deleteReactionFromUser(message, user.id);
                        // // Alert user that Dungeon Masters cant join session party.
                        return message.channel.send({ content: 'Dungeon Masters can not join the sessions party of players!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
                    default:
                        // Delete the user reaction a.k.a. emoji.
                        return await deleteReactionFromUser(message, user.id);
                }
                // Send a past session embed to the "past-sessions" channel.
                PAST_SESSIONS_CHANNEL.send({ embeds: [createPastSessionEmbed(message.embeds[0], sessionStatus)] }).then(async pastSessionEmbedMessage => {
                    // Create a past session in the databse.
                    createPastSessionDatabaseEntry(pastSessionEmbedMessage.id, FOUND_PLANNED_SESSION, sessionStatus, message.guild.id);
                    // Delete the planned session in the databse.
                    deletePlannedSessionDatabaseEntry(message.id, message.guild.id);
                    // Delete session channel.
                    message.guild.channels.cache.get(FOUND_PLANNED_SESSION.session_channel).delete();
                    // Delete the planned session embed.
                    message.delete();
                })
            } catch (error) {
                console.log(error);
            }
        } else if (USER_CHARACTER) {
            try {
                switch (emoji.name) {
                    case '🙋‍♂️':
                        //Return if player is already in the session.
                        if (isPlayerAlreadyInSessionParty(FOUND_PLANNED_SESSION.session_party, user.id)) return message.channel.send({ content: 'You are already in this session!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
                        // Return if session is full and no more players can fit.
                        if (!(FOUND_PLANNED_SESSION.session_party.length < 5)) return message.channel.send({ content: 'This session is full! Only 5 players are allowed!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
                        // Return if the user already requested for the session.
                        if (playerAlreadyRequestedForSession(bot, user.id, message, FOUND_PLANNED_SESSION.session_channel)) return message.channel.send({ content: `You already requested to join this session, please be patient!` }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
                        // Return if the user already has been denied for the session.
                        if (playerAlreadyBeenDenied(bot, user.id, message, FOUND_PLANNED_SESSION.session_channel)) return message.channel.send({ content: `Your request to join this session has already been declined by the session commander, better luck next time!` }).then(msg => { setTimeout(() => msg.delete(), 5000) }).catch(err => console.log(err));
                        // Give user feedback on asking the session commander if he/she may join the session.
                        message.channel.send({ content: `${user}, I have asked the session commander if you may join the session. Please give him/her some time to decide!` }).then(msg => { setTimeout(() => msg.delete(), 5000) }).catch(err => console.log(err));
                        // Add REQUESTED-status to user in designated database. 
                        giveUserRequestedStatus(bot, FOUND_PLANNED_SESSION, user)
                        // Send a message in the session channel to ask the session commander if the user may join the session.
                        const SESSION_CHANNEL = bot.channels.cache.find(c => c.id == FOUND_PLANNED_SESSION.session_channel && c.type == "text");
                        SESSION_CHANNEL.send({ content: `Hello, ${bot.users.cache.get(FOUND_PLANNED_SESSION.session_commander)}. <@!${user.id}> (${USER_CHARACTER.name.trim()}) is requesting to join your session!` }).then(async msg => {
                            await msg.react('✔️');
                            await msg.react('✖️');

                            const emojiFilter = (reaction, user) => {
                                if (user.bot === true) return false;
                                return (reaction.emoji.name === '✔️' || reaction.emoji.name === '✖️') && user.id === FOUND_PLANNED_SESSION.session_commander;
                            };
                            msg.awaitReactions(emojiFilter, {
                                max: 1,
                                time: 86400000,
                                errors: ['time'],
                            }).then(async collected => {
                                msg.delete().catch(err => console.error(err));
                                switch (collected.first().emoji.name) {
                                    case '✔️':
                                        // Check again if in the meantime the sessions party is already full.
                                        FOUND_PLANNED_SESSION = await PlannedSession.findOne({ where: { message_id_discord: message.id } });
                                        if (!(FOUND_PLANNED_SESSION.session_party.length < 5)) return msg.channel.send({ content: 'This session is full! Only 5 players are allowed!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
                                        // Send the person who wants to join the session he/she got accepted.
                                        user.send({ content: `Your request to join ${bot.users.cache.get(FOUND_PLANNED_SESSION.session_commander).username}'s session has been **ACCEPTED**` });
                                        // Adjust permissions of session channel so the newly allowed player can see the channel.
                                        SESSION_CHANNEL.permissionOverwrites.edit(bot.users.cache.get(user.id), {
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
                                            MANAGE_EMOJIS: false,
                                            USE_SLASH_COMMANDS: false,
                                            MANAGE_THREADS: false,
                                            USE_PUBLIC_THREADS: false,
                                        });
                                        // Remove user REQUESTED-status in JSON database. 
                                        removeUserRequestStatus(bot, FOUND_PLANNED_SESSION, user)
                                        // Update session party database entry.
                                        updateDatabaseSessionParty(FOUND_PLANNED_SESSION, user.id);
                                        // Edit the session message embed.
                                        message.edit(updateSessionEmbedParty(message, FOUND_PLANNED_SESSION.session_party).embeds[0]);
                                        break;
                                    case '✖️':
                                        // Send the person who requested to join the session, he/she got declined.
                                        user.send({ content: `Your request to join ${bot.users.cache.get(FOUND_PLANNED_SESSION.session_commander).username}'s session has been **DECLINED**` });
                                        // Give the user a DENIED-status in the JSON database.
                                        giveUserDeniedStatus(bot, FOUND_PLANNED_SESSION, user)
                                        break;
                                }
                            }).catch(err => {
                                console.error(err);
                                // Send the person who wants to join the session his/her request has not been answered.
                                user.send({ content: `Your request to join ${bot.users.cache.get(FOUND_PLANNED_SESSION.session_commander).username}'s session has **NOT BEEN ANSWERED**` });
                                // Remove user REQUESTED-status in JSON database. 
                                removeUserRequestStatus(bot, FOUND_PLANNED_SESSION, user)
                            })
                        })
                        return;
                    case '✅':

                    case '❌':
                        // Alert user that Dungeon Masters cant join session party.
                        message.channel.send({ content: 'You do not have permission to accept or decline a session request!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
                    default:
                        // Delete the user reaction a.k.a. emoji.
                        return await deleteReactionFromUser(message, user.id)
                }
            } catch (error) {
                console.log(error)
            }
        }

    }
}

// String.prototype.replaceAt = function (index, replacement) {
//     if (index >= this.length) {
//         return this.valueOf();
//     }
//     return this.substring(0, index) + replacement + this.substring(index + 1);
// }
function createPlannedSessionDatabaseEntry(sessionId, foundSessionRequest, generalInfo, dungeonMasterId, serverId) {
    let timestamp = Date.now()
    PlannedSession.create({
        id: `P${timestamp}`,
        message_id_discord: sessionId,
        session_commander: foundSessionRequest.session_commander_id,
        session_party: foundSessionRequest.session_party,
        date: foundSessionRequest.date,
        objective: foundSessionRequest.objective,
        session_number: generalInfo.session_number,
        dungeon_master: dungeonMasterId,
        session_channel: foundSessionRequest.session_channel_id,
        session_status: 'NOT PLAYED YET',
        server: serverId
    }).then(() => {
        generalInfo.session_number += 1;
        generalInfo.save();
    });
}
function updatePartyNextSessionId(party, next_session_id, serverId) {
    party.forEach(async player => {
        await PlayerCharacter.findOne({ where: { player_id_discord: player, alive: 1, server: serverId } }).then(character => {
            setTimeout
            character.next_session = next_session_id;
            character.save();
        });
    });
}
function createPlannedSessionEmbed(dungeonMasterId, sessionNumber, editedEmbed) {
    editedEmbed.fields[2].value = `<@!${dungeonMasterId}>`;
    editedEmbed.setTitle(`**Session_${sessionNumber}: **`);
    return editedEmbed;
}
function createPastSessionEmbed(editedEmbed, status) {
    editedEmbed.title = editedEmbed.title.replace(' ', ` [${status}]`);
    switch (status) {
        case 'PLAYED':
            editedEmbed.setColor('#78b159')
            break;
        case 'CANCELED':
            editedEmbed.setColor('#dd2e44');
            break;
        default:
            break;
    }
    console.log(editedEmbed);
    console.log(status);
    return editedEmbed;
}
async function deleteSessionRequestDatabaseEntry(sessionId, serverId) {
    await SessionRequest.findOne({ where: { message_id_discord: sessionId, server: serverId } }).then(sessionRequest => {
        sessionRequest.destroy();
    });
}

async function deletePlannedSessionDatabaseEntry(sessionId, serverId) {
    await PlannedSession.findOne({ where: { message_id_discord: sessionId, server: serverId } }).then(plannedSession => {
        plannedSession.destroy();
    });
}

function updateDatabaseSessionParty(sessionRequest, playerId) {
    let partyMembers = sessionRequest.session_party;
    partyMembers.push(playerId);
    sessionRequest.session_party = partyMembers;
    sessionRequest.save();
}

function isPlayerAlreadyInSessionParty(sessionParty, playerID) {
    return sessionParty.includes(playerID);
}
function playerAlreadyBeenDenied(bot, userID, message, sessionChannelID) {
    // TODO: Make this per server.
    for (let i = 0; i < bot.sessionAddUserRequest['sessions'].length; i++) {
        if (bot.sessionAddUserRequest['sessions'][i].session_channel === sessionChannelID) {
            for (let j = 0; j < bot.sessionAddUserRequest['sessions'][i].denied.length; j++) {
                if (bot.sessionAddUserRequest['sessions'][i].denied[j].user_id === userID) {
                    return true;
                }
            }
            break;
        }
    }
    return false;
}
function playerAlreadyRequestedForSession(bot, userID, message, sessionChannelID) {
    // TODO: Make this per server.
    for (let i = 0; i < bot.sessionAddUserRequest['sessions'].length; i++) {
        if (bot.sessionAddUserRequest['sessions'][i].session_channel === sessionChannelID) {
            for (let j = 0; j < bot.sessionAddUserRequest['sessions'][i].requested.length; j++) {
                if (bot.sessionAddUserRequest['sessions'][i].requested[j].user_id === userID) {
                    return true;
                }
            }
        }
    }
    return false;
}
function createPastSessionDatabaseEntry(messageId, foundPlannedSession, sessionStatus, serverId) {
    let timestamp = Date.now();
    PastSession.create({
        id: `L${timestamp}`,
        message_id_discord: messageId,
        session_commander: foundPlannedSession.session_commander,
        session_party: foundPlannedSession.session_party,
        date: foundPlannedSession.date,
        objective: foundPlannedSession.objective,
        session_number: foundPlannedSession.session_number,
        dungeon_master: foundPlannedSession.dungeon_master,
        session_status: sessionStatus,
        server: serverId
    })

}

async function deleteReactionFromUser(message, userID) {
    try {
        for (const reaction of message.reactions.cache.filter(reaction => reaction.users.cache.has(userID)).values()) {
            await reaction.users.remove(userID);
        }
    } catch (error) {
        console.error('Failed to remove reactions.');
    }
}

function writeToJsonDb(location, data) {
    fs.writeFile(`${location}`, JSON.stringify(data, null, 4), err => {
        if (err) throw err;
    });
}

function giveUserRequestedStatus(bot, FOUND_SESSION_REQUEST, user) {
    for (let i = 0; i < bot.sessionAddUserRequest['sessions'].length; i++) {
        if (bot.sessionAddUserRequest['sessions'][i].session_channel === FOUND_SESSION_REQUEST.session_channel) {
            bot.sessionAddUserRequest['sessions'][i].requested[bot.sessionAddUserRequest['sessions'][i].requested.length] = { "user_id": `${user.id}` };
            break;
        }
    }
    // Write the edited data to designated JSON database.
    writeToJsonDb("./bot/jsonDb/sessionAddUserRequest.json", bot.sessionAddUserRequest);
}

function giveUserDeniedStatus(bot, FOUND_SESSION_REQUEST, user) {
    for (let i = 0; i < bot.sessionAddUserRequest['sessions'].length; i++) {
        if (bot.sessionAddUserRequest['sessions'][i].session_channel === FOUND_SESSION_REQUEST.session_channel) {
            for (let j = 0; j < bot.sessionAddUserRequest['sessions'][i].requested.length; j++) {
                if (bot.sessionAddUserRequest['sessions'][i].requested[j].user_id === user.id) {
                    bot.sessionAddUserRequest['sessions'][i].requested.splice(j, 1);
                    bot.sessionAddUserRequest['sessions'][i].denied[bot.sessionAddUserRequest['sessions'][i].denied.length] = { "user_id": `${user.id}` };
                    break;
                }
            }
        }
    }
    // Write the edited data to designated JSON database.
    writeToJsonDb("./bot/jsonDb/sessionAddUserRequest.json", bot.sessionAddUserRequest);
}

function removeUserRequestStatus(bot, FOUND_SESSION_REQUEST, user) {
    for (let i = 0; i < bot.sessionAddUserRequest['sessions'].length; i++) {
        if (bot.sessionAddUserRequest['sessions'][i].session_channel === FOUND_SESSION_REQUEST.session_channel) {
            for (let j = 0; j < bot.sessionAddUserRequest['sessions'][i].requested.length; j++) {
                if (bot.sessionAddUserRequest['sessions'][i].requested[j].user_id === user.id) {
                    // bot.sessionAddUserRequest['sessions'][i].requested[j].user_id = "";
                    bot.sessionAddUserRequest['sessions'][i].requested.splice(j, 1);
                    break;
                }
            }
        }
    }
    // Write the edited data to designated JSON database.
    writeToJsonDb("./bot/jsonDb/sessionAddUserRequest.json", bot.sessionAddUserRequest);
}

function updateSessionEmbedParty(message, sessionParty) {
    message.embeds[0].fields[1].name = `**Players(${sessionParty.length}/5)**`;
    message.embeds[0].fields[1].value = `${sessionParty.map(id => `<@!${id}>`).join(', ')}`
    return message;
}