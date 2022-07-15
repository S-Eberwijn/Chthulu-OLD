// const { logger } = require(`../../functions/logger`)

const { GameSession } = require('../../database/models/GameSession');
const { GeneralInfo } = require('../../database/models/GeneralInfo');
const { PlayerCharacter } = require('../../database/models/PlayerCharacter');

const { MESSAGE_COMPONENTS } = require('../messageComponents');

const { getGuildFromBot, isDungeonMaster } = require('./guild');
const { getUserFromBot, getBot } = require('./bot');
const { getUserCharacter } = require('./characters');

async function getAllGameSessions() {
    return await GameSession.findAll();
}

/**
 * @param {""} serverID - The ID of a Discord server.
 */
async function getAllServerGameSessions(serverID) {
    return await GameSession.findAll({ where: { server: serverID } });
}

/**
 * @param {{}} sessionData - The data for a Game-Session.
 * @param {""} serverID - The ID of a Discord server.
 * @param {""} userID - The ID of a Discord user.
 */


async function fetchGameSessionMessage(SESSION_REQUEST_CHANNEL, PLANNED_SESSIONS_CHANNEL, messageID) {
    try {
        let foundMessage = await SESSION_REQUEST_CHANNEL.messages.fetch(messageID).catch(() => console.log('Message not found'));
        foundMessage = foundMessage != null ? foundMessage : await PLANNED_SESSIONS_CHANNEL.messages.fetch(messageID).catch(() => console.log('Message not found'));
        return foundMessage;
    } catch (error) {
        console.log(error);
    }
}

function editRequestSessionEmbedToPlannedSessionEmbed(dungeonMasterId, sessionNumber, editedEmbed) {
    editedEmbed.fields[2].value = `<@!${dungeonMasterId}>`;
    editedEmbed.setTitle(`**Session ${sessionNumber}: **`);
    return editedEmbed;
}

function updatePartyNextSessionId(party, next_session_id, serverId) {
    //TODO: change to for of loop
    party.forEach(async player => {
        await PlayerCharacter.findOne({ where: { player_id_discord: player, alive: 1, server: serverId } }).then(character => {
            character.next_session = next_session_id;
            character.save();
        });
    });
}

async function updateGameSessionStatus(session, session_status) {
    session.session_status = session_status;
    await session.save();
}
async function updateGameSessionMessageId(session, new_message_id) {
    session.message_id_discord = new_message_id;
    await session.save();
}
async function updateGameSessionNumber(session, session_number) {
    session.session_number = session_number;
    await session.save();
}
async function updateGameSessionParty(session, session_party) {
    session.session_party = session_party;
    await session.save();
}
async function updateGameSessionDungeonMaster(session, dungeon_master_id) {
    session.dungeon_master_id_discord = dungeon_master_id;
    await session.save();
}
async function updateGeneralServerSessionNumber(server, next_session_number) {
    server.session_number = next_session_number;
    await server.save();
}

async function approveGameSession(sessionData, serverID, userID) {

    const { editAllGameSessionsForWebsite } = require('../website');
    //TODO: Change to a resolve or reject state
    // if (!isDungeonMaster(userID, serverID)) console.log("You are not allowed to approve a game session - not a dungeon master")

    // if(!sessionData.gameSessionID) throw Error("No gameSessionID provided");
    // if(!userID) throw Error("No userID provided");
    // if(!sessionData.serverID) throw Error("No serverID provided");

    let GAME_SESSION = await GameSession.findOne({ where: { id: sessionData.gameSessionID, server: serverID } });
    const GENERAL_SERVER_INFO = await GeneralInfo.findOne({ where: { server: serverID } });

    const SESSION_REQUEST_CHANNEL = getGuildFromBot(serverID)?.channels.cache.find(c => c.name.includes("session-request") && c.type == "GUILD_TEXT");
    const PLANNED_SESSIONS_CHANNEL = getGuildFromBot(serverID)?.channels.cache.find(c => c.name.includes("planned-session") && c.type == "GUILD_TEXT");

    const GAME_SESSION_MESSAGE = await fetchGameSessionMessage(SESSION_REQUEST_CHANNEL, PLANNED_SESSIONS_CHANNEL, GAME_SESSION.message_id_discord)

    return new Promise((resolve, reject) => {
        if (!GAME_SESSION) return reject();

        PLANNED_SESSIONS_CHANNEL?.send({ embeds: [editRequestSessionEmbedToPlannedSessionEmbed(userID, GENERAL_SERVER_INFO.session_number, GAME_SESSION_MESSAGE.embeds[0])], components: [MESSAGE_COMPONENTS.PLANNED_SESSION] }).then(async PLANNED_SESSION_MESSAGE => {
            getGuildFromBot(serverID)?.channels.cache.get(GAME_SESSION.session_channel)?.setName(`session-${GENERAL_SERVER_INFO.session_number}`)
            updatePartyNextSessionId(GAME_SESSION.session_party, PLANNED_SESSION_MESSAGE.id, serverID);

            await updateGameSessionMessageId(GAME_SESSION, PLANNED_SESSION_MESSAGE.id);
            await updateGameSessionStatus(GAME_SESSION, 'PLANNED')
            await updateGameSessionNumber(GAME_SESSION, GENERAL_SERVER_INFO.session_number)
            await updateGameSessionDungeonMaster(GAME_SESSION, userID)

            updateGeneralServerSessionNumber(GENERAL_SERVER_INFO, GENERAL_SERVER_INFO.session_number + 1)

            GAME_SESSION_MESSAGE.delete();

            GAME_SESSION = await editAllGameSessionsForWebsite([GAME_SESSION]);
            GAME_SESSION[0].data.message = 'The session has been successfully approved.'
            return resolve(GAME_SESSION[0].data);
        })
    });
}

async function declineGameSession(sessionData, serverID, userID) {
    // if (!isDungeonMaster(userID, serverID)) console.log("You are not allowed to approve a game session - not a dungeon master")
    let GAME_SESSION = await GameSession.findOne({ where: { id: sessionData.gameSessionID, server: serverID } });
    // console.log(GAME_SESSION.data)
    return new Promise(async (resolve, reject) => {
        if (!GAME_SESSION) return reject();

        const GUILD = getGuildFromBot(serverID);
        const SESSION_REQUEST_CHANNEL = GUILD?.channels.cache.find(c => c.name.includes("session-request") && c.type == "GUILD_TEXT");

        const SESSION_EMBED = await SESSION_REQUEST_CHANNEL.messages.fetch(GAME_SESSION.message_id_discord).catch(() => console.log('Message not found'));
        // Delete session channel.
        GUILD?.channels.cache.get(GAME_SESSION.session_channel)?.delete();
        // Update the session status in the database.
        await updateGameSessionStatus(GAME_SESSION, 'DECLINED');

        // Edit session embed to show the session has been declined.
        SESSION_EMBED?.edit({ embeds: [await editRequestSessionEmbedTitle(SESSION_EMBED?.embeds[0], 'DECLINED')], components: [] })

        getUserFromBot(userID)?.send('Session request declined!');
        // button.reply({ content: , ephemeral: true })
        GAME_SESSION.data.message = 'The session has been successfully declined.'
        return resolve(GAME_SESSION.data);
    })
}

async function joinGameSession(sessionData, serverID, userID) {
    // console.log(sessionData)
    const USER_ID = sessionData.userID ? sessionData.userID : userID;
    const DISCORD_USER = getUserFromBot(USER_ID);
    let GAME_SESSION = await GameSession.findOne({ where: { id: sessionData.gameSessionID, server: serverID } });
    const isPlayerAlreadyInParty = GAME_SESSION.session_party.includes(USER_ID);
    return new Promise(async (resolve, reject) => {
        if (!GAME_SESSION) return reject('Session can not be found in the database!');
        if (isDungeonMaster(USER_ID, getGuildFromBot(serverID))) return reject('Dungeon Masters can not join a sessions party!');
        if (isPlayerAlreadyInParty) return reject('Player is already in the party!');
        const isPartyFull = GAME_SESSION.session_party.length >= 5;
        if (isPartyFull) return reject('The party capacity has reached the limit!');
        const USER_CHARACTER = await getUserCharacter(USER_ID, serverID);
        if (!USER_CHARACTER) return reject('No character found in the database!');
        const BOT = getBot();


        const SESSION_REQUEST_CHANNEL = getGuildFromBot(serverID)?.channels.cache.find(c => c.name.includes("session-request") && c.type == "GUILD_TEXT");
        const PLANNED_SESSIONS_CHANNEL = getGuildFromBot(serverID)?.channels.cache.find(c => c.name.includes("planned-session") && c.type == "GUILD_TEXT");
        const GAME_SESSION_MESSAGE = await fetchGameSessionMessage(SESSION_REQUEST_CHANNEL, PLANNED_SESSIONS_CHANNEL, GAME_SESSION?.message_id_discord)
        const GAME_SESSION_CHANNEL = getGuildFromBot(serverID)?.channels.cache.get(GAME_SESSION.session_channel)

        if (!sessionData.userID) {
            // Request to join the party. 

            // Return if the user already requested to join the session.
            if (playerAlreadyRequestedForSession(BOT.sessionAddUserRequest['sessions'], USER_ID, GAME_SESSION.session_channel)) return reject(`You already requested to join this session, please be patient!`);
            // Return if the user already has been denied for the session.
            if (playerAlreadyDenied(BOT.sessionAddUserRequest['sessions'], USER_ID, GAME_SESSION.session_channel)) return reject(`Your request to join this session has already been declined by the session commander, better luck next time!`);
            // Give user feedback on asking the session commander if he/she may join the session.
            GAME_SESSION_CHANNEL?.send({ content: `Hello, ${getUserFromBot(GAME_SESSION.session_commander)}. <@!${USER_ID}> (${USER_CHARACTER?.name.trim()}) is requesting to join your session!`, components: [MESSAGE_COMPONENTS.JOIN_SESSION] }).then(async JOIN_MESSAGE => {
                // Add REQUESTED-status to user in json database. 
                await giveUserRequestedStatus(BOT.sessionAddUserRequest['sessions'], GAME_SESSION.session_channel, USER_ID, BOT.sessionAddUserRequest);
            })

            DISCORD_USER?.send('You have successfully requested to join the session! The session commander will decide if you will be able to join the party!');
            GAME_SESSION.data.message = 'The session has been successfully requested to join.'
        } else {
            // Directly add the user to the party.
            const isSessionCommander = GAME_SESSION?.session_commander === userID;
            if (!isSessionCommander) return reject('Only session commanders can add players to the party!');
            // Send the person who wants to join the session he / she got accepted.
            DISCORD_USER?.send({ content: `You have been added by ${BOT.users.cache.get(GAME_SESSION.session_commander).username} to a session` });
            // // Add user to session channel.
            GAME_SESSION_CHANNEL?.permissionOverwrites.edit(DISCORD_USER, {
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
            });
            // Remove user REQUESTED-status in JSON database. 
            removeUserRequestStatus(BOT.sessionAddUserRequest['sessions'], GAME_SESSION.session_channel, USER_ID, BOT.sessionAddUserRequest);
            // Update session party database entry.
            updateGameSessionParty(GAME_SESSION, [...GAME_SESSION.session_party, USER_ID]);
            GAME_SESSION.data.message = 'Added to the session party!'
        }

        // Edit the session message embed.
        GAME_SESSION_MESSAGE.edit({ embeds: [(await updatePartyOnSessionEmbed(GAME_SESSION_MESSAGE, GAME_SESSION.session_party)).embeds[0]] });
        return resolve(GAME_SESSION.data);
    })
}

async function editRequestSessionEmbedTitle(editedEmbed, status) {
    editedEmbed.title = `${editedEmbed.title} [${status}]`;
    switch (status) {
        case 'PLAYED':
            editedEmbed.setColor('#78b159')
            break;
        case 'CANCELED':
            editedEmbed.setColor('#dd2e44')
            break;
        default:
            break;
    }
    return editedEmbed;
}

function giveUserRequestedStatus(sessions, gameSessionChannel, userID, jsonDB) {
    // console.log('inside 2')
    for (let i = 0; i < sessions.length; i++) {
        if (sessions[i].session_channel_id === gameSessionChannel) {
            // console.log('inside')
            sessions[i].requested[sessions[i].requested.length] = { "user_id": `${userID}` };
            break;
        }
    }
    // Write the edited data to designated JSON database.
    writeToJsonDb("./bot/jsonDb/sessionAddUserRequest.json", jsonDB);
}

function removeUserRequestStatus(sessions, gameSessionChannel, userID, jsonDB) {
    for (let i = 0; i < sessions.length; i++) {
        if (sessions[i].session_channel_id === gameSessionChannel) {
            for (let j = 0; j < sessions[i].requested.length; j++) {
                if (sessions[i].requested[j].user_id === userID) {
                    // bot.sessionAddUserRequest['sessions'][i].requested[j].user_id = "";
                    sessions[i].requested.splice(j, 1);
                    break;
                }
            }
        }
    }
    // Write the edited data to designated JSON database.
    writeToJsonDb("./bot/jsonDb/sessionAddUserRequest.json", jsonDB);
}
// ./bot/jsonDb/sessionAddUserRequest.json

function writeToJsonDb(location, data) {
    const fs = require("fs");
    fs.writeFile(`${location}`, JSON.stringify(data, null, 4), err => {
        if (err) throw err;
    });
}

function playerAlreadyRequestedForSession(sessions, userID, sessionChannelID) {
    // TODO: Make this per server.
    for (let i = 0; i < sessions.length; i++) {
        if (sessions[i].session_channel_id === sessionChannelID) {
            // console.log('inside')
            for (let j = 0; j < sessions[i].requested.length; j++) {
                if (sessions[i].requested[j].user_id === userID) {
                    return true;
                }
            }
        }
    }
    return false;
}

function playerAlreadyDenied(sessions, userID, sessionChannelID) {
    // TODO: Make this per server.
    for (let i = 0; i < sessions.length; i++) {
        if (sessions[i].session_channel_id === sessionChannelID) {
            for (let j = 0; j < sessions[i].denied.length; j++) {
                if (sessions[i].denied[j].user_id === userID) {
                    return true;
                }
            }
            break;
        }
    }
    return false;
}

async function updatePartyOnSessionEmbed(message, sessionParty) {
    message.embeds[0].fields[1].name = `**Players(${sessionParty.length}/5)**`;
    message.embeds[0].fields[1].value = `${sessionParty.map(id => `<@!${id}>`).join(', ')}`
    return message;
}

module.exports = {
    getAllGameSessions, getAllServerGameSessions,
    approveGameSession, declineGameSession, joinGameSession,
    fetchGameSessionMessage,
    updateGameSessionStatus, updateGameSessionMessageId, updateGameSessionNumber, updateGameSessionParty, updateGameSessionDungeonMaster, updateGeneralServerSessionNumber,
    editRequestSessionEmbedToPlannedSessionEmbed, updatePartyNextSessionId
};