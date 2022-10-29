const { logger } = require(`../../../functions/logger`)
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

const { GameSession } = require('../../../database/models/GameSession');
const { PlayerCharacter } = require('../../../database/models/PlayerCharacter');
const { GeneralInfo } = require('../../../database/models/GeneralInfo');

const fs = require("fs");

const { getPrettyDateString } = require('../../../functions/api/misc');

const { fetchGameSessionMessage, editRequestSessionEmbedToPlannedSessionEmbed, updatePartyNextSessionId, updateGameSessionStatus, updateGameSessionMessageId, updateGameSessionNumber, updateGameSessionParty, updateGeneralServerSessionNumber, updateGameSessionDungeonMaster } = require('../../../functions/api/sessions');

const DATE_REGEX_PATTERN = /[0-3]\d\/(0[1-9]|1[0-2])\/\d{4} [0-2]\d:[0-5]\d(?:\.\d+)?Z?/g;

const MODAL_IDS = ['session-request-modal'];
const BUTTON_IDS = ['approve-session-request-button', 'decline-session-request-button', 'join-session-button', 'played-session-button', 'cancel-session-button', 'join-accepted-button', 'join-denied-button']

const MESSAGE_COMPONENTS_REQUEST = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId(BUTTON_IDS[0])
            .setLabel('Approve')
            .setStyle('SUCCESS')
            .setEmoji('👍'),
        new MessageButton()
            .setCustomId(BUTTON_IDS[1])
            .setLabel('Decline')
            .setStyle('DANGER')
            .setEmoji('✖️'),
        new MessageButton()
            .setCustomId(BUTTON_IDS[2])
            .setLabel('Join')
            .setStyle('SECONDARY')
            .setEmoji('🙋‍♂️'),
    );
const MESSAGE_COMPONENTS_PLANNED = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId(BUTTON_IDS[3])
            .setLabel('Played')
            .setStyle('SUCCESS'),
        // .setEmoji('👍'),
        new MessageButton()
            .setCustomId(BUTTON_IDS[4])
            .setLabel('Cancel')
            .setStyle('DANGER'),
        // .setEmoji('✖️'),
        new MessageButton()
            .setCustomId(BUTTON_IDS[2])
            .setLabel('Join')
            .setStyle('SECONDARY')
            .setEmoji('🙋‍♂️'),
    );

const MESSAGE_COMPONENTS_JOIN = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId(BUTTON_IDS[5])
            .setLabel('Yes, gear up!')
            .setStyle('SUCCESS')
            .setEmoji('🦾'),
        new MessageButton()
            .setCustomId(BUTTON_IDS[6])
            .setLabel('No, stay away!')
            .setStyle('DANGER')
            .setEmoji('✖️'),
    );


module.exports.help = {
    name:"Session",
    category: "Dungeons & Dragons",
    description: "DiscordJs Session helper",
    modalIds: MODAL_IDS,
    buttonIds: BUTTON_IDS
}

module.exports.modalSubmit = async (modal) => {
    const bot = require('../../../index');

    const USER_CHARACTER = await PlayerCharacter.findOne({ where: { player_id_discord: modal.user.id, alive: 1, server: modal.guild.id } })

    const SESSIONS_CATEGORY = modal.guild.channels.cache.find(c => c.name == "--SESSIONS--" && c.type == "GUILD_CATEGORY");
    const SESSION_REQUEST_CHANNEL = modal.guild.channels.cache.find(c => c.name.includes("session-request") && c.type == "GUILD_TEXT");

    const session_objective = modal.fields?.getTextInputValue('sessionObjective'),
        session_date_text = modal.fields?.getTextInputValue('sessionDate'),
        session_location = modal.fields?.getTextInputValue('sessionLocation') || `Roll20 (online)`;

    if (session_date_text.match(DATE_REGEX_PATTERN) === null) return logger.debug(`Invalid date format, ${session_date_text} does not comply with the regex pattern.`);
    let date_year = session_date_text.split(' ')[0].split('/')[2],
        date_month = session_date_text.split(' ')[0].split('/')[1],
        date_day = session_date_text.split(' ')[0].split('/')[0],
        date_hour = session_date_text.split(' ')[1].split(':')[0],
        date_minutes = session_date_text.split(' ')[1].split(':')[1];

    const session_date = new Date(Date.UTC(date_year, date_month - 1, date_day, date_hour, date_minutes)).getTime()

    // Makes a request channel for the message author
    modal.guild.channels.create(`${modal.user.username}s-request`, "text").then(async CREATED_CHANNEL => {
        // Puts the channel under the "--SESSIONS--" category
        CREATED_CHANNEL.setParent(SESSIONS_CATEGORY, { lockPermissions: false });

        // Update channel permissions so everyone can't see it.
        await CREATED_CHANNEL.permissionOverwrites.create(CREATED_CHANNEL.guild.roles.everyone, { VIEW_CHANNEL: false });
        // Update channel permissions so Dungeon Masters can see it.
        CREATED_CHANNEL.permissionOverwrites.edit(modal.guild.roles.cache.find(role => role.name.toLowerCase().includes('dungeon master')), {
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
        CREATED_CHANNEL.permissionOverwrites.create(bot.users.cache.get(modal.user.id), {
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

        CREATED_CHANNEL.send({ content: `${modal.user}, welcome to your session request channel!` }).then(async () => {
        })

        SESSION_REQUEST_CHANNEL.send({ embeds: [createSessionChannelEmbed(modal.user, session_date, [modal.user.id], session_objective, USER_CHARACTER.picture_url, session_location)], components: [MESSAGE_COMPONENTS_REQUEST] }).then(async MESSAGE => {
            createSession(modal, session_objective, session_location, session_date, MESSAGE.id, CREATED_CHANNEL.id)
            // Add the session to a json database.
            bot.sessionAddUserRequest['sessions'][bot.sessionAddUserRequest['sessions'].length] = {
                session_channel_id: CREATED_CHANNEL.id,
                requested: [],
                denied: []
            }
            writeToJsonDb("./bot/jsonDb/sessionAddUserRequest.json", bot.sessionAddUserRequest);
        })
    })
    modal.reply({ content: `Session request created! You can find it back in this channel: ${SESSION_REQUEST_CHANNEL}`, ephemeral: true });
}

module.exports.buttonSubmit = async (button) => {
    const bot = require('../../../index');

    // Channels
    const SESSION_REQUEST_CHANNEL = button.message.guild?.channels.cache.find(c => c.name.includes("session-request") && c.type == "GUILD_TEXT");
    const PLANNED_SESSIONS_CHANNEL = button.message.guild?.channels.cache.find(c => c.name.includes("planned-session") && c.type == "GUILD_TEXT");
    const PAST_SESSIONS_CHANNEL = button.message.guild?.channels.cache.find(c => c.name.includes("past-session") && c.type == "GUILD_TEXT");

    // Roles
    const DUNGEON_MASTER_ROLE = button.message.guild.roles.cache.find(role => role.name.toLowerCase().includes('dungeon master'));
    const isDungeonMaster = button.message.guild.members.cache.get(button.user.id).roles.cache.has(DUNGEON_MASTER_ROLE.id)

    // Variables
    const USER_CHARACTER = await PlayerCharacter.findOne({ where: { player_id_discord: button.user.id, alive: 1, server: button.message.guild.id } })
    const FOUND_GAME_SESSION = button.message.embeds[0] != null ? await GameSession.findOne({ where: { message_id_discord: button.message.id } }) : await GameSession.findOne({ where: { session_channel: button.message.channel.id } });
    const isSessionCommander = FOUND_GAME_SESSION?.session_commander === button.user.id;
    const GAME_SESSION_CHANNEL = button.message.guild.channels.cache.get(FOUND_GAME_SESSION?.session_channel);
    const GENERAL_SERVER_INFO = await GeneralInfo.findOne({ where: { server: button.guildId } });
    const USER_MENTION_ARRAY = Array.from(button.message.mentions.users.values())
    const targetUser = USER_MENTION_ARRAY[1] ? USER_MENTION_ARRAY[1] : USER_MENTION_ARRAY[0];
    // Return if no session request has been found in the database corresponding to the server id.
    if (!FOUND_GAME_SESSION) return button.message.channel.send({ content: 'Something went wrong; Cannot find this session request in the database!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.error(err));
    // Return if no server info has been found in the database corresponding to the server id.
    if (!GENERAL_SERVER_INFO) return message.channel.send({ content: 'Something went wrong; Cannot find general info of this server in the database!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.error(err));

    if (!BUTTON_IDS.includes(button.customId)) return console.error("Something went wrong")
    switch (button.customId) {//put switch case into new method
        // approved
        case BUTTON_IDS[0]:
            if (!isDungeonMaster) return button.reply({ content: 'Only Dungeon Masters can approve sessions!', ephemeral: true })
            PLANNED_SESSIONS_CHANNEL.send({ embeds: [editRequestSessionEmbedToPlannedSessionEmbed(button.user.id, GENERAL_SERVER_INFO.session_number, button.message.embeds[0])], components: [MESSAGE_COMPONENTS_PLANNED] }).then(async PLANNED_SESSION_MESSAGE => {
                // Edit session channel name.
                button.message.guild.channels.cache.get(FOUND_GAME_SESSION.session_channel)?.setName(`session-${GENERAL_SERVER_INFO.session_number}`)
                updatePartyNextSessionId(FOUND_GAME_SESSION.session_party, PLANNED_SESSION_MESSAGE.id, button.message.guild.id);

                await updateGameSessionMessageId(FOUND_GAME_SESSION, PLANNED_SESSION_MESSAGE.id);
                await updateGameSessionStatus(FOUND_GAME_SESSION, 'PLANNED')
                await updateGameSessionNumber(FOUND_GAME_SESSION, GENERAL_SERVER_INFO.session_number)
                await updateGameSessionDungeonMaster(FOUND_GAME_SESSION, button.user.id)

                updateGeneralServerSessionNumber(GENERAL_SERVER_INFO, GENERAL_SERVER_INFO.session_number + 1)

                button.message.delete();
            })
            break;
        // 'declined'
        case BUTTON_IDS[1]:
            if (!isDungeonMaster) return button.reply({ content: 'Only Dungeon Masters can decline sessions!', ephemeral: true })
            // Delete session channel.
            button.message.guild.channels.cache.get(FOUND_GAME_SESSION.session_channel)?.delete();
            // Delete the session request in the database.
            updateGameSessionStatus(FOUND_GAME_SESSION, 'DECLINED')
            // Update the session request embed.
            button.message.edit({ embeds: [editRequestSessionEmbedTitle(button.message.embeds[0], 'DECLINED')], components: [] })
            button.reply({ content: 'Session request declined!', ephemeral: true })
            break;
        // 'join'
        case BUTTON_IDS[2]:
            if (isDungeonMaster) return button.reply({ content: 'Dungeon Masters can not join a sessions party!', ephemeral: true });
            const isPlayerAlreadyInParty = FOUND_GAME_SESSION.session_party.includes(button.user.id);
            if (!USER_CHARACTER) return button.reply({ content: 'You do not have a character in the database, use **/createCharacter** to create one!', ephemeral: true });
            if (isPlayerAlreadyInParty) return button.reply({ content: 'You are already in the party!', ephemeral: true });
            const isPartyFull = FOUND_GAME_SESSION.session_party.length >= 5;
            if (isPartyFull) return button.reply({ content: 'The party is full!', ephemeral: true });
            // Return if the user already requested to join the session.
            if (playerAlreadyRequestedForSession(bot.sessionAddUserRequest['sessions'], button.user.id, FOUND_GAME_SESSION.session_channel)) return button.reply({ content: `You already requested to join this session, please be patient!`, ephemeral: true });
            // Return if the user already has been denied for the session.
            if (playerAlreadyDenied(bot.sessionAddUserRequest['sessions'], button.user.id, FOUND_GAME_SESSION.session_channel)) return button.reply({ content: `Your request to join this session has already been declined by the session commander, better luck next time!`, ephemeral: true });
            // Give user feedback on asking the session commander if he/she may join the session.
            GAME_SESSION_CHANNEL?.send({ content: `Hello, ${bot.users.cache.get(FOUND_GAME_SESSION.session_commander)}. <@!${button.user.id}> (${USER_CHARACTER?.name.trim()}) is requesting to join your session!`, components: [MESSAGE_COMPONENTS_JOIN] }).then(JOIN_MESSAGE => {
                // Add REQUESTED-status to user in json database. 
                giveUserRequestedStatus(bot.sessionAddUserRequest['sessions'], FOUND_GAME_SESSION.session_channel, button.user.id, bot.sessionAddUserRequest);
            })
            button.reply({ content: 'You have successfully **requested** to join the session!', ephemeral: true })
            break;
        // 'played'
        case BUTTON_IDS[3]:
            if (!isDungeonMaster) return button.reply({ content: "You are not a dungeon master!"});
            // Update session database status.
            updateGameSessionStatus(FOUND_GAME_SESSION, 'PLAYED')
            // Delete session channel.
            button.message.guild.channels.cache.get(FOUND_GAME_SESSION.session_channel)?.delete();
            // Send the edited session embed to the "past-sessions" channel.
            PAST_SESSIONS_CHANNEL?.send({ embeds: [editRequestSessionEmbedTitle(button.message.embeds[0], 'PLAYED')], components: [] })
            // Delete the planned session embed.
            button.message.delete();
            break;
        // 'cancel'
        case BUTTON_IDS[4]:
            if (!isDungeonMaster) return button.reply({ content: "You are not a dungeon master!"});
            // Update session database status.
            updateGameSessionStatus(FOUND_GAME_SESSION, 'CANCELED')
            // Delete session channel.
            button.message.guild.channels.cache.get(FOUND_GAME_SESSION.session_channel)?.delete();
            // Send the edited session embed to the "past-sessions" channel.
            PAST_SESSIONS_CHANNEL?.send({ embeds: [editRequestSessionEmbedTitle(button.message.embeds[0], 'CANCELED')], components: [] })
            // Delete the planned session embed.
            button.message.delete();
            break;
        // 'join accepted'
        case BUTTON_IDS[5]:
            if (!isSessionCommander) return button.reply({ content: "You are not the session commander!"})
            if (!targetUser) return console.error("No target user!")
            if (FOUND_GAME_SESSION.session_party.length >= 5) return button.reply({ content: 'The session party has reached its maximum allowed players. This user is not added to the party!' });
            // Send the person who wants to join the session he / she got accepted.
            targetUser.send({ content: `Your request to join ${bot.users.cache.get(FOUND_GAME_SESSION.session_commander).username}'s session has been **ACCEPTED**` });
            // Add user to session channel.
            GAME_SESSION_CHANNEL.permissionOverwrites.edit(bot.users.cache.get(targetUser.id), {
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
            removeUserRequestStatus(bot.sessionAddUserRequest['sessions'], FOUND_GAME_SESSION.session_channel, targetUser.id, bot.sessionAddUserRequest);
            // Update session party database entry.
            updateGameSessionParty(FOUND_GAME_SESSION, [...FOUND_GAME_SESSION.session_party, targetUser.id]);
            // Edit the session message embed.
            const GAME_SESSION_MESSAGE = fetchGameSessionMessage(SESSION_REQUEST_CHANNEL, PLANNED_SESSIONS_CHANNEL, FOUND_GAME_SESSION?.message_id_discord)
            GAME_SESSION_MESSAGE.edit({ embeds: [(updatePartyOnSessionEmbed(GAME_SESSION_MESSAGE, FOUND_GAME_SESSION.session_party)).embeds[0]] });

            button.message.delete();
            break;
        // 'join denied'
        case BUTTON_IDS[6]:
            //- const FOUND_GAME_SESSION = await GameSession.findOne({ where: { message_id_discord: button.message.id } });
            //- const isSessionCommander = FOUND_GAME_SESSION.session_commander === button.user.id;
            if (!isSessionCommander) return console.error("You are not the session commander!")
            if (!targetUser) return console.error("No target user!")

            // Send the person who requested to join the session, he/she got declined.
            targetUser.send({ content: `Your request to join ${bot.users.cache.get(FOUND_GAME_SESSION.session_commander).username}'s session has been **DECLINED**` });
            // Give the user a DENIED-status in the JSON database.
            giveUserDeniedStatus(bot.sessionAddUserRequest['sessions'], FOUND_GAME_SESSION.session_channel, targetUser.id, bot.sessionAddUserRequest);

            button.message.delete();
            break;
        default:
            break;
    }
}

async function createSession(modal, objective, session_location, date, message_id, session_channel_id) {
    const TIMESTAMP = Date.now();
    //- const GENERAL_INFO = await GeneralInfo.findOne({ where: { server: modal.guildId } });
    await GameSession.create({
        id: `GS${TIMESTAMP}`,
        message_id_discord: message_id,
        session_commander: modal.user.id,
        session_party: [modal.user.id],
        date: date,
        dungeon_master_id_discord: '',
        objective: objective,
        location: session_location,
        session_number: 0,
        session_channel: session_channel_id,
        session_status: 'CREATED',
        server: modal.guild.id,
    });
}

function createSessionChannelEmbed(messageAuthor, sessionDate, sessionParticipants, sessionObjective, sessionCommanderAvatar, sessionLocation) {
    return new MessageEmbed()
        .setThumbnail(sessionCommanderAvatar)
        .setColor(0x333333)
        .setTitle(`**Session Request**`)
        .addFields(
            { name: `**Session Commander:**`, value: `<@!${sessionParticipants[0]}>\n`, inline: false },
            { name: `**Players(${sessionParticipants.length}/5):**`, value: `${sessionParticipants.map(id => `<@!${id}>`).join(', ')}`, inline: false },
            { name: `**DM:**`, value: `*TBD*`, inline: false },
            { name: `**Location:**`, value: `*${sessionLocation}*`, inline: false },
            { name: `**Date & Time:**`, value: `\`${getPrettyDateString(new Date(sessionDate))}\``, inline: false },
            { name: `**Objective:**`, value: `>>> *${sessionObjective}*`, inline: false },
        )
        .setTimestamp()
        .setFooter({ text: `Requested by ${messageAuthor.username}`, iconURL: messageAuthor.avatarURL() });
}

// TODO: Centralize this code
function writeToJsonDb(location, data) {
    fs.writeFile(`${location}`, JSON.stringify(data, null, 4), err => {
        if (err) throw err;
    });
}

//this method seems realy simular to the next method, refacator posible.
function playerAlreadyRequestedForSession(sessions, userID, sessionChannelID) {
    // TODO: Make this per server.
    for(let session of sessions) {
        if (session.session_channel === sessionChannelID) {
            for(sessionRequest of session.requested){
                if(sessionRequest.user_id === userID) return true;
            }
        }
    }
    return false;
}

function playerAlreadyDenied(sessions, userID, sessionChannelID) {
    // TODO: Make this per server.
    for(let session of sessions) {
        if (session.session_channel === sessionChannelID) {
            for(sessionDenied of session.denied){
                if(sessionDenied.user_id === userID) return true;
            }
        }
    }
    return false;
}

function giveUserRequestedStatus(sessions, gameSessionChannel, userID, jsonDB) {
    for(let session of sessions) {
        if (session.session_channel === gameSessionChannel) {
            session.requested.push({ user_id: userID });
            writeToJsonDb('./sessionAddUserRequest.json', jsonDB);
            return;
        }
    }
}

function removeUserRequestStatus(sessions, gameSessionChannel, userID, jsonDB) {
    for(let session of sessions) {
        if (session.session_channel === gameSessionChannel) {
            session.requested = session.requested.filter(request => request.user_id !== userID);//remove user from requested list
            writeToJsonDb("./bot/jsonDb/sessionAddUserRequest.json", jsonDB);
            return;
        }
    }
}

function giveUserDeniedStatus(sessions, gameSessionChannel, userID, jsonDB) {
    for(let session of sessions) {
        if (session.session_channel === gameSessionChannel) {
            session.requested = session.requested.filter(request => request.user_id !== userID);//remove user from requested list
            session.denied.push({ user_id: userID });//add user to denied list
            writeToJsonDb("./bot/jsonDb/sessionAddUserRequest.json", jsonDB);
            return;
        }
    }
}

function updatePartyOnSessionEmbed(message, sessionParty) {
    message.embeds[0].fields[1].name = `**Players(${sessionParty.length}/5)**`;
    message.embeds[0].fields[1].value = `${sessionParty.map(id => `<@!${id}>`).join(', ')}`
    return message;
}

function editRequestSessionEmbedTitle(editedEmbed, status) {
    editedEmbed.title = `${editedEmbed.title} [${status}]`;
    switch (status) {
        case 'PLAYED':
            editedEmbed.setColor(0x78b159)
            break;
        case 'CANCELED':
            editedEmbed.setColor(0xdd2e44)
            break;
        default:
            break; 
    }
    return editedEmbed;
}

module.exports.exportedForTesting = {
    createSessionChannelEmbed,
    playerAlreadyRequestedForSession,
    playerAlreadyDenied,
    editRequestSessionEmbedTitle
}
