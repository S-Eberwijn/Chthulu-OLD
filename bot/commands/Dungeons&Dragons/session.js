//TODO: Refactor? Make less api calls?

const { logger } = require(`../../../functions/logger`)
const { MessageEmbed, Modal, TextInputComponent, MessageActionRow, MessageButton } = require('discord.js');

const { GameSession } = require('../../../database/models/GameSession');
const { PlayerCharacter } = require('../../../database/models/PlayerCharacter');
const { GeneralInfo } = require('../../../database/models/GeneralInfo');

const fs = require("fs");

const DATE_REGEX_PATTERN = /[0-3]\d\/(0[1-9]|1[0-2])\/\d{4} [0-2]\d:[0-5]\d(?:\.\d+)?Z?/g;
const COMMAND_OPTIONS = ['request', 'b'];
const QUESTIONS_ARRAY = require('../../jsonDb/sessionChannelQuestion.json');
const NAME_OF_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MODAL_IDS = ['myModal'];
const BUTTON_IDS = ['approve-session-request-button', 'decline-session-request-button', 'join-session-button', 'played-session-button', 'cancel-session-button', 'test1', 'test2']

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

module.exports.run = async (interaction) => {
    const SESSION_MODAL = await createModal(MODAL_IDS[0]);

    // VARIABLES
    const SESSIONS_CATEGORY = interaction.member.guild.channels.cache.find(c => c.name == "--SESSIONS--" && c.type == "GUILD_CATEGORY");

    let messageAuthorCharacter = await PlayerCharacter.findOne({ where: { player_id_discord: interaction.user.id, alive: 1, server: interaction.guild.id } });
    messageAuthorCharacter ? logger.debug(`Character found: ${messageAuthorCharacter.name} `) : logger.debug("Character not found.");
    if (!messageAuthorCharacter) return interaction.reply({ content: `You do not have a character in the database!\nCreate one by using the "/createcharacter" command.` }).then(() => { setTimeout(() => interaction.deleteReply(), 3000) }).catch(err => logger.error(err));

    if (!SESSIONS_CATEGORY) return interaction.reply({ content: `There is no category named \"--SESSIONS--\"!` }).then(() => { setTimeout(() => interaction.deleteReply(), 3000) }).catch(err => logger.error(err));
    // if (!interaction.options.get('action').value) return interaction.channel.send({ content: "Not enough valid arguments\nCorrect format: !session [request]" });
    if (!COMMAND_OPTIONS.includes(interaction.options.get('action').value)) return interaction.channel.send({ content: `Not a valid session option\nCorrect format: !session [${COMMAND_OPTIONS.map(option => option).join(', ')}]` });

    switch (interaction.options.get('action').value) {
        case 'request':
            await interaction.showModal(SESSION_MODAL);
            break;

        case 'b':

            break;

        default:
            interaction.reply({ content: "Not a valid session option!", ephemeral: true });
            break;
    }
}



module.exports.help = {
    category: "Dungeons & Dragons",
    name: "session",
    // alias: [],
    description: "Handles actions around sessions",
    options: [{
        name: 'action',
        type: 'STRING',
        description: `Type of action you want to do: "${COMMAND_OPTIONS.join(', ')}"`,
        required: true
    }],
    modalIds: MODAL_IDS,
    buttonIds: BUTTON_IDS
}

module.exports.modalSubmit = async (modal) => {
    const bot = require('../../../index');

    const USER_CHARACTER = await PlayerCharacter.findOne({ where: { player_id_discord: modal.user.id, alive: 1, server: modal.guild.id } })

    const SESSIONS_CATEGORY = modal.guild.channels.cache.find(c => c.name == "--SESSIONS--" && c.type == "GUILD_CATEGORY");
    const SESSION_REQUEST_CHANNEL = modal.guild.channels.cache.find(c => c.name.includes("session-request") && c.type == "GUILD_TEXT");

    const session_objective = modal.fields?.getTextInputValue('sessionObjective'),
        session_date_text = modal.fields?.getTextInputValue('sessionDate');
        session_location = modal.fields?.getTextInputValue('sessionLocation') || `Roll20 (online)`;
    // console.log(session_date_text)
    if (session_date_text.match(DATE_REGEX_PATTERN) === null) return;
    const session_date = new Date(session_date_text.split(' ')[0].split('/')[2], session_date_text.split(' ')[0].split('/')[0] - 1, session_date_text.split(' ')[0].split('/')[1], session_date_text.split(' ')[1].split(':')[0], session_date_text.split(' ')[1].split(':')[1])

    // console.log({ session_objective, session_date, })
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
            createSession(modal, session_objective, session_date, MESSAGE.id, CREATED_CHANNEL.id)
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
    const targetUser = (Array.from(button.message.mentions.users.values()))[1];

    // Return if no session request has been found in the database corresponding to the server id.
    if (!FOUND_GAME_SESSION) return button.message.channel.send({ content: 'Something went wrong; Cannot find this session request in the database!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
    // Return if no server info has been found in the database corresponding to the server id.
    if (!GENERAL_SERVER_INFO) return message.channel.send({ content: 'Something went wrong; Cannot find general info of this server in the database!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));


    if (!BUTTON_IDS.includes(button.customId)) return console.log("Something went wrong")
    switch (button.customId) {
        // 'approved'
        case BUTTON_IDS[0]:
            if (!isDungeonMaster) return button.reply({ content: 'Only Dungeon Masters can approve sessions!', ephemeral: true })
            PLANNED_SESSIONS_CHANNEL.send({ embeds: [editRequestSessionEmbedToPlannedSessionEmbed(button.user.id, GENERAL_SERVER_INFO.session_number, button.message.embeds[0])], components: [MESSAGE_COMPONENTS_PLANNED] }).then(async PLANNED_SESSION_MESSAGE => {
                // Edit session channel name.
                button.message.guild.channels.cache.get(FOUND_GAME_SESSION.session_channel)?.setName(`session-${GENERAL_SERVER_INFO.session_number}`)
                updatePartyNextSessionId(FOUND_GAME_SESSION.session_party, PLANNED_SESSION_MESSAGE.id, button.message.guild.id);

                updateGameSessionMessageId(FOUND_GAME_SESSION, PLANNED_SESSION_MESSAGE.id);
                updateGameSessionStatus(FOUND_GAME_SESSION, 'PLANNED')
                updateGameSessionNumber(FOUND_GAME_SESSION, GENERAL_SERVER_INFO.session_number)

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
            button.message.edit({ embeds: [await editRequestSessionEmbedTitle(button.message.embeds[0], 'DECLINED')], components: [] })
            button.reply({ content: 'Session request declined!', ephemeral: true })
            break;
        // 'join'
        case BUTTON_IDS[2]:
            if (isDungeonMaster) return button.reply({ content: 'Dungeon Masters can not join a sessions party!', ephemeral: true });
            const isPlayerAlreadyInParty = FOUND_GAME_SESSION.session_party.includes(button.user.id);
            if(!USER_CHARACTER) return button.reply({ content: 'You do not have a character in the database, use **/createCharacter** to create one!', ephemeral: true });
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
            if (!isDungeonMaster) return console.log("You are not a dungeon master!")
            // Update session database status.
            updateGameSessionStatus(FOUND_GAME_SESSION, 'PLAYED')
            // Delete session channel.
            button.message.guild.channels.cache.get(FOUND_GAME_SESSION.session_channel)?.delete();
            // Send the edited session embed to the "past-sessions" channel.
            PAST_SESSIONS_CHANNEL?.send({ embeds: [await editRequestSessionEmbedTitle(button.message.embeds[0], 'PLAYED')], components: [] })
            // Delete the planned session embed.
            button.message.delete();
            break;
        // 'cancel'
        case BUTTON_IDS[4]:
            if (!isDungeonMaster) return console.log("You are not a dungeon master!")
            // Update session database status.
            updateGameSessionStatus(FOUND_GAME_SESSION, 'CANCELED')
            // Delete session channel.
            button.message.guild.channels.cache.get(FOUND_GAME_SESSION.session_channel)?.delete();
            // Send the edited session embed to the "past-sessions" channel.
            PAST_SESSIONS_CHANNEL?.send({ embeds: [await editRequestSessionEmbedTitle(button.message.embeds[0], 'CANCELED')], components: [] })
            // Delete the planned session embed.
            button.message.delete();
            break;
        // 'join accepted'
        case BUTTON_IDS[5]:
            if (!isSessionCommander) return console.log("You are not the session commander!")
            if (!targetUser) return console.log("No target user!")
            if (!(FOUND_GAME_SESSION.session_party.length < 5)) return button.reply({ content: 'The session party has reached its maximum allowed players. This user is not added to the party!' });
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
            const GAME_SESSION_MESSAGE = await fetchGameSessionMessage(SESSION_REQUEST_CHANNEL, PLANNED_SESSIONS_CHANNEL, FOUND_GAME_SESSION?.message_id_discord)
            GAME_SESSION_MESSAGE.edit({ embeds: [(await updatePartyOnSessionEmbed(GAME_SESSION_MESSAGE, FOUND_GAME_SESSION.session_party)).embeds[0]] });

            button.message.delete();
            break;
        // 'join denied'
        case BUTTON_IDS[6]:
            // const FOUND_GAME_SESSION = await GameSession.findOne({ where: { message_id_discord: button.message.id } });
            // const isSessionCommander = FOUND_GAME_SESSION.session_commander === button.user.id;
            if (!isSessionCommander) return console.log("You are not the session commander!")
            if (!targetUser) return console.log("No target user!")

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

async function createSession(modal, objective, date, message_id, session_channel_id) {
    const TIMESTAMP = Date.now();
    // const GENERAL_INFO = await GeneralInfo.findOne({ where: { server: modal.guildId } });
    await GameSession.create({
        id: `GS${TIMESTAMP}`,
        message_id_discord: message_id,
        session_commander: modal.user.id,
        session_party: [modal.user.id],
        date: date,
        dungeon_master_id_discord: '',
        objective: objective,
        session_number: 0,
        session_channel: session_channel_id,
        session_status: 'CREATED',
        server: modal.guild.id,
    }).then(async () => {
        // GENERAL_INFO.session_number += 1; 
        // await GENERAL_INFO.save() 
    })
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
            { name: `**Time:**`, value: `*${NAME_OF_DAYS[sessionDate.getDay()]} (${getDoubleDigitNumber(sessionDate.getDate())}/${getDoubleDigitNumber(sessionDate.getMonth() + 1)}/${sessionDate.getYear() + 1900}) ${getDoubleDigitNumber(sessionDate.getHours())}:${getDoubleDigitNumber(sessionDate.getMinutes())}*`, inline: false },
            { name: `**Location:**`, value: `*${sessionLocation}*`, inline: false },
            { name: `**Objective:**`, value: `*${sessionObjective}*`, inline: false },
        )
        .setTimestamp()
        .setFooter({ text: `Requested by ${messageAuthor.username}`, iconURL: messageAuthor.avatarURL() });
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

async function createModal(MODAL_ID) {
    // Create the modal
    const modal = new Modal()
        .setCustomId(MODAL_ID)
        .setTitle('Session Request');

    const sessionTitle = new TextInputComponent()
        .setCustomId('sessionTitle')
        // The label is the prompt the user sees for this input
        .setLabel("Title")
        // Short means only a single line of text
        .setStyle('SHORT')
        .setRequired(true)
    const sessionObjective = new TextInputComponent()
        .setCustomId('sessionObjective')
        .setLabel("Objective")
        // Paragraph means multiple lines of text.
        .setStyle('PARAGRAPH')
        .setRequired(true)

    const sessionDate = new TextInputComponent()
        .setCustomId('sessionDate')
        // The label is the prompt the user sees for this input
        .setLabel("Date - Time")
        // Short means only a single line of text
        .setStyle('SHORT')
        .setRequired(true)
        .setPlaceholder('20/12/2022 15:30')
        .setMaxLength(16)

    const sessionLocation = new TextInputComponent()
        .setCustomId('sessionLocation')
        // The label is the prompt the user sees for this input
        .setLabel("Location")
        // Short means only a single line of text
        .setStyle('SHORT')
        .setPlaceholder('Roll20 (online)')
        .setRequired(false)

    // An action row only holds one text input,
    const firstActionRow = new MessageActionRow().addComponents(sessionTitle),
        secondActionRow = new MessageActionRow().addComponents(sessionObjective),
        thirdActionRow = new MessageActionRow().addComponents(sessionDate),
        fourthActionRow = new MessageActionRow().addComponents(sessionLocation);

    // Add inputs to the modal
    modal.addComponents(secondActionRow, fourthActionRow, thirdActionRow,);
    return modal;
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

async function updateGeneralServerSessionNumber(server, next_session_number) {
    server.session_number = next_session_number;
    await server.save();
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

function giveUserRequestedStatus(sessions, gameSessionChannel, userID, jsonDB) {
    // const bot = require('../../../index');

    // console.log(gameSessionChannel, userID);
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

function giveUserDeniedStatus(sessions, gameSessionChannel, userID, jsonDB) {
    console.log(gameSessionChannel, userID);
    for (let i = 0; i < sessions.length; i++) {
        if (sessions[i].session_channel_id === gameSessionChannel) {
            for (let j = 0; j < sessions[i].requested.length; j++) {
                if (sessions[i].requested[j].user_id === userID) {
                    sessions[i].requested.splice(j, 1);
                    sessions[i].denied[sessions[i].denied.length] = { "user_id": `${userID}` };
                    break;
                }
            }
        }
    }
    // Write the edited data to designated JSON database.
    writeToJsonDb("./bot/jsonDb/sessionAddUserRequest.json", jsonDB);
}

async function updatePartyOnSessionEmbed(message, sessionParty) {
    message.embeds[0].fields[1].name = `**Players(${sessionParty.length}/5)**`;
    message.embeds[0].fields[1].value = `${sessionParty.map(id => `<@!${id}>`).join(', ')}`
    return message;
}

async function fetchGameSessionMessage(SESSION_REQUEST_CHANNEL, PLANNED_SESSIONS_CHANNEL, messageID) {
    try {
        let foundMessage = await SESSION_REQUEST_CHANNEL.messages.fetch(messageID).catch(() => console.log('Message not found'));
        foundMessage = foundMessage != null ? foundMessage : await PLANNED_SESSIONS_CHANNEL.messages.fetch(messageID).catch(() => console.log('Message not found'));
        return foundMessage;
    } catch (error) {
        console.log(error);
    }
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