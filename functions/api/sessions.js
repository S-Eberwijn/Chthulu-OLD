const { MessageEmbed } = require("discord.js");

const { GameSession } = require("../../database/models/GameSession");
const { GeneralInfo } = require("../../database/models/GeneralInfo");
const { PlayerCharacter } = require("../../database/models/PlayerCharacter");

const { MESSAGE_COMPONENTS } = require("../messageComponents");

const { getGuildFromBot, isDungeonMaster } = require("./guild");
const { getUserFromBot, getBot } = require("./bot");
const { getUserCharacter } = require("./characters");
const { getPrettyDateString } = require("./misc");
const { editAllGameSessionsForWebsite } = require("../website");

const DATE_REGEX_PATTERN =
	/[0-3]\d\/(0[1-9]|1[0-2])\/\d{4} [0-2]\d:[0-5]\d(?:\.\d+)?Z?/g;

async function getAllGameSessions() {
	return GameSession.findAll();
} 

/**
 * @param {"532525442201026580"} serverID - The ID of a Discord server.
 */
async function getAllServerGameSessions(serverID) {
	return GameSession.findAll({ where: { server: serverID } });
}

/**
 * @param {{}} sessionData - The data for a Game-Session.
 * @param {""} serverID - The ID of a Discord server.
 * @param {""} userID - The ID of a Discord user.
 */

async function fetchGameSessionMessage(
	SESSION_REQUEST_CHANNEL,
	PLANNED_SESSIONS_CHANNEL,
	messageID,
) {
	try {
		let foundMessage = await SESSION_REQUEST_CHANNEL.messages
			.fetch(messageID)
			.catch(() => console.log("Message not found"));
		foundMessage =
			foundMessage != null
				? foundMessage
				: await PLANNED_SESSIONS_CHANNEL.messages
					.fetch(messageID)
					.catch(() => console.log("Message not found"));
		return foundMessage;
	} catch (error) {
		console.log(error);
	}
}

function editRequestSessionEmbedToPlannedSessionEmbed(
	dungeonMasterId,
	sessionNumber,
	editedEmbed,
) {
	editedEmbed.fields[2].value = `<@!${dungeonMasterId}>`;
	editedEmbed.setTitle(`**Session ${sessionNumber}: **`);
	return editedEmbed;
}

function updatePartyNextSessionId(party, next_session_id, serverId) {
	//TODO: change to for of loop
	party.forEach(async (player) => {
		await PlayerCharacter.findOne({
			where: { player_id_discord: player, alive: 1, server: serverId },
		}).then((character) => {
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

async function createGameSession(sessionData, serverID, userID) {
	const BOT = getBot();
	const GUILD = getGuildFromBot(serverID);
	const DISCORD_USER = getUserFromBot(userID);
	let session_party;
	return new Promise(async (resolve, reject) => {
		const USER_CHARACTER = await getUserCharacter(userID, serverID);
		if (!USER_CHARACTER) return reject("No playable character found for user");
		const SESSIONS_CATEGORY = GUILD?.channels.cache.find(
			(c) => c.name == "--SESSIONS--" && c.type == "GUILD_CATEGORY",
		);
		const SESSION_REQUEST_CHANNEL = GUILD?.channels.cache.find(
			(c) => c.name.includes("session-request") && c.type == "GUILD_TEXT",
		);

		const session_objective = sessionData.session_objective,
			session_date_text = sessionData.session_date_text,
			session_location = sessionData.session_location || `Roll20 (online)`;

		if (session_date_text.match(DATE_REGEX_PATTERN) === null)
			return reject(`Invalid date format, ${session_date_text} does not comply with the regex pattern.`);
		let date_year = session_date_text.split(" ")[0].split("/")[2],
			date_month = session_date_text.split(" ")[0].split("/")[1],
			date_day = session_date_text.split(" ")[0].split("/")[0],
			date_hour = session_date_text.split(" ")[1].split(":")[0],
			date_minutes = session_date_text.split(" ")[1].split(":")[1];

		const session_date = new Date(
			Date.UTC(date_year, date_month - 1, date_day, date_hour, date_minutes),
		).getTime();

		if (sessionData.session_party && !sessionData.session_party?.includes(userID)) { session_party = [userID, ...session_party];}
		
		// Makes a request channel for the message author
		GUILD.channels
			.create(`${DISCORD_USER.username}s-request`, "text")
			.then(async (CREATED_CHANNEL) => {
				// Puts the channel under the "--SESSIONS--" category
				CREATED_CHANNEL.setParent(SESSIONS_CATEGORY, {
					lockPermissions: false,
				});

				// Update channel permissions so everyone can't see it.
				await CREATED_CHANNEL.permissionOverwrites.create(
					CREATED_CHANNEL.guild.roles.everyone,
					{ VIEW_CHANNEL: false },
				);

				// Update channel permissions so Dungeon Masters can see it.
				CREATED_CHANNEL.permissionOverwrites.edit(
					GUILD.roles.cache.find((role) =>
						role.name.toLowerCase().includes("dungeon master"),
					),
					{
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
					},
				);

				// Update channel permissions so every party member can see it.
				for (const playerID of sessionData.session_party) {
					CREATED_CHANNEL.permissionOverwrites.create(
						BOT.users.cache.get(playerID),
						{
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
						},
					);
				}
				

				CREATED_CHANNEL.send({
					content: `${DISCORD_USER}, welcome to your session request channel!`,
				}).then(async () => { });

				SESSION_REQUEST_CHANNEL.send({
					embeds: [
						createSessionChannelEmbed(
							DISCORD_USER,
							session_date,
							sessionData.session_party,
							session_objective,
							USER_CHARACTER.picture_url,
							session_location,
						),
					],
					components: [MESSAGE_COMPONENTS.REQUEST_SESSION],
				}).then(async (MESSAGE) => {
					const GAME_SESSION = await createSession(
						userID,
						serverID,
						session_objective,
						session_location,
						session_date,
						MESSAGE.id,
						CREATED_CHANNEL.id,
						sessionData.session_party,
					);
					// Add the session to a json database.
					BOT.sessionAddUserRequest["sessions"][
						BOT.sessionAddUserRequest["sessions"].length
					] = {
						session_channel_id: CREATED_CHANNEL.id,
						requested: [],
						denied: [],
					};
					writeToJsonDb(
						"./bot/jsonDb/sessionAddUserRequest.json",
						BOT.sessionAddUserRequest,
					);
					resolve(
						(await editAllGameSessionsForWebsite([GAME_SESSION.__old]))[0],
					);
				});
			});
		DISCORD_USER.send({
			content: `Session request created! You can find it back in this channel: ${SESSION_REQUEST_CHANNEL}`,
		});
	});
}

async function approveGameSession(sessionData, serverID, userID) {
	const { editAllGameSessionsForWebsite } = require("../website");
	//TODO: Change to a resolve or reject state
	// if (!isDungeonMaster(userID, serverID)) console.log("You are not allowed to approve a game session - not a dungeon master")

	// if(!sessionData.gameSessionID) throw Error("No gameSessionID provided");
	// if(!userID) throw Error("No userID provided");
	// if(!sessionData.serverID) throw Error("No serverID provided");

	let GAME_SESSION = await GameSession.findOne({
		where: { id: sessionData.gameSessionID, server: serverID },
	});
	const GENERAL_SERVER_INFO = await GeneralInfo.findOne({
		where: { server: serverID },
	});

	const SESSION_REQUEST_CHANNEL = getGuildFromBot(
		serverID,
	)?.channels.cache.find(
		(c) => c.name.includes("session-request") && c.type == "GUILD_TEXT",
	);
	const PLANNED_SESSIONS_CHANNEL = getGuildFromBot(
		serverID,
	)?.channels.cache.find(
		(c) => c.name.includes("planned-session") && c.type == "GUILD_TEXT",
	);

	const GAME_SESSION_MESSAGE = await fetchGameSessionMessage(
		SESSION_REQUEST_CHANNEL,
		PLANNED_SESSIONS_CHANNEL,
		GAME_SESSION.message_id_discord,
	);

	return new Promise((resolve, reject) => {
		if (!GAME_SESSION) return reject();

		PLANNED_SESSIONS_CHANNEL?.send({
			embeds: [
				editRequestSessionEmbedToPlannedSessionEmbed(
					userID,
					GENERAL_SERVER_INFO.session_number,
					GAME_SESSION_MESSAGE.embeds[0],
				),
			],
			components: [MESSAGE_COMPONENTS.PLANNED_SESSION],
		}).then(async (PLANNED_SESSION_MESSAGE) => {
			getGuildFromBot(serverID)
				?.channels.cache.get(GAME_SESSION.session_channel)
				?.setName(`session-${GENERAL_SERVER_INFO.session_number}`);
			updatePartyNextSessionId(
				GAME_SESSION.session_party,
				PLANNED_SESSION_MESSAGE.id,
				serverID,
			);

			await updateGameSessionMessageId(
				GAME_SESSION,
				PLANNED_SESSION_MESSAGE.id,
			);
			await updateGameSessionStatus(GAME_SESSION, "PLANNED");
			await updateGameSessionNumber(
				GAME_SESSION,
				GENERAL_SERVER_INFO.session_number,
			);
			await updateGameSessionDungeonMaster(GAME_SESSION, userID);

			updateGeneralServerSessionNumber(
				GENERAL_SERVER_INFO,
				GENERAL_SERVER_INFO.session_number + 1,
			);

			GAME_SESSION_MESSAGE.delete();

			GAME_SESSION = await editAllGameSessionsForWebsite([GAME_SESSION]);
			GAME_SESSION[0].data.message =
				"The session has been successfully approved.";
			return resolve(GAME_SESSION[0].data);
		});
	});
}

async function declineGameSession(sessionData, serverID, userID) {
	// if (!isDungeonMaster(userID, serverID)) console.log("You are not allowed to approve a game session - not a dungeon master")
	let GAME_SESSION = await GameSession.findOne({
		where: { id: sessionData.gameSessionID, server: serverID },
	});
	// console.log(GAME_SESSION.data)
	return new Promise(async (resolve, reject) => {
		if (!GAME_SESSION) return reject();

		const GUILD = getGuildFromBot(serverID);
		const SESSION_REQUEST_CHANNEL = GUILD?.channels.cache.find(
			(c) => c.name.includes("session-request") && c.type == "GUILD_TEXT",
		);

		const SESSION_EMBED = await SESSION_REQUEST_CHANNEL.messages
			.fetch(GAME_SESSION.message_id_discord)
			.catch(() => console.log("Message not found"));
		// Delete session channel.
		GUILD?.channels.cache.get(GAME_SESSION.session_channel)?.delete();
		// Update the session status in the database.
		await updateGameSessionStatus(GAME_SESSION, "DECLINED");

		// Edit session embed to show the session has been declined.
		SESSION_EMBED?.edit({
			embeds: [
				await editRequestSessionEmbedTitle(
					SESSION_EMBED?.embeds[0],
					"DECLINED",
				),
			],
			components: [],
		});

		getUserFromBot(userID)?.send("Session request declined!");
		// button.reply({ content: , ephemeral: true })
		GAME_SESSION.data.message = "The session has been successfully declined.";
		return resolve(GAME_SESSION.data);
	});
}

async function joinGameSession(sessionData, serverID, userID) {
	return new Promise(async (resolve, reject) => {
		const USER_ID = sessionData.userID ? sessionData.userID : userID;

		if (!sessionData.gameSessionID) return reject("No gameSessionID provided");
		if (!USER_ID) return reject("No userID provided");

		const DISCORD_USER = getUserFromBot(USER_ID);

		let GAME_SESSION = await GameSession.findOne({
			where: { id: sessionData.gameSessionID, server: serverID },
		});
		if (!GAME_SESSION) return reject("Session can not be found in the database!");

		if (isDungeonMaster(USER_ID, getGuildFromBot(serverID))) return reject("Dungeon Masters can not join a sessions party!");

		const isPlayerAlreadyInParty = GAME_SESSION.session_party.includes(USER_ID);
		if (isPlayerAlreadyInParty) return reject("Player is already in the party!");
		const isPartyFull = GAME_SESSION.session_party.length >= 5;
		if (isPartyFull) return reject("The party capacity has reached the limit!");
		const USER_CHARACTER = await getUserCharacter(USER_ID, serverID);
		if (!USER_CHARACTER) return reject("No character found in the database!");
		const BOT = getBot();

		const SESSION_REQUEST_CHANNEL = getGuildFromBot(
			serverID,
		)?.channels.cache.find(
			(c) => c.name.includes("session-request") && c.type == "GUILD_TEXT",
		);
		const PLANNED_SESSIONS_CHANNEL = getGuildFromBot(
			serverID,
		)?.channels.cache.find(
			(c) => c.name.includes("planned-session") && c.type == "GUILD_TEXT",
		);
		const GAME_SESSION_MESSAGE = await fetchGameSessionMessage(
			SESSION_REQUEST_CHANNEL,
			PLANNED_SESSIONS_CHANNEL,
			GAME_SESSION?.message_id_discord,
		);
		const GAME_SESSION_CHANNEL = getGuildFromBot(serverID)?.channels.cache.get(
			GAME_SESSION.session_channel,
		);

		if (!sessionData.userID) {
			// Request to join the party.

			// Return if the user already requested to join the session.
			if (
				playerAlreadyRequestedForSession(
					BOT.sessionAddUserRequest["sessions"],
					USER_ID,
					GAME_SESSION.session_channel,
				)
			)
				return reject(
					`You already requested to join this session, please be patient!`,
				);
			// Return if the user already has been denied for the session.
			if (
				playerAlreadyDenied(
					BOT.sessionAddUserRequest["sessions"],
					USER_ID,
					GAME_SESSION.session_channel,
				)
			)
				return reject(
					`Your request to join this session has already been declined by the session commander, better luck next time!`,
				);
			// Give user feedback on asking the session commander if he/she may join the session.
			GAME_SESSION_CHANNEL?.send({
				content: `Hello, ${getUserFromBot(
					GAME_SESSION.session_commander,
				)}. <@!${USER_ID}> (${USER_CHARACTER?.name.trim()}) is requesting to join your session!`,
				components: [MESSAGE_COMPONENTS.JOIN_SESSION],
			}).then(async (JOIN_MESSAGE) => {
				// Add REQUESTED-status to user in json database.
				giveUserRequestedStatus(
					BOT.sessionAddUserRequest["sessions"],
					GAME_SESSION.session_channel,
					USER_ID,
					BOT.sessionAddUserRequest,
				);
			});

			DISCORD_USER?.send(
				"You have successfully requested to join the session! The session commander will decide if you will be able to join the party!",
			);
			GAME_SESSION.data.message =
				"The session has been successfully requested to join.";
		} else {
			// Directly add the user to the party.
			const isSessionCommander = GAME_SESSION?.session_commander === userID;
			if (!isSessionCommander)
				return reject("Only session commanders can add players to the party!");
			// Send the person who wants to join the session he / she got accepted.
			DISCORD_USER?.send({
				content: `You have been added by ${BOT.users.cache.get(GAME_SESSION.session_commander).username
					} to a session`,
			});
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
			removeUserRequestStatus(
				BOT.sessionAddUserRequest["sessions"],
				GAME_SESSION.session_channel,
				USER_ID,
				BOT.sessionAddUserRequest,
			);
			// Update session party database entry.
			updateGameSessionParty(GAME_SESSION, [
				...GAME_SESSION.session_party,
				USER_ID,
			]);
			GAME_SESSION.data.message = "Added to the session party!";
		}

		// Edit the session message embed.
		GAME_SESSION_MESSAGE.edit({
			embeds: [
				(
					await updatePartyOnSessionEmbed(
						GAME_SESSION_MESSAGE,
						GAME_SESSION.session_party,
					)
				).embeds[0],
			],
		});
		return resolve(GAME_SESSION.data);
	});
}

async function editRequestSessionEmbedTitle(editedEmbed, status) {
	editedEmbed.title = `${editedEmbed.title} [${status}]`;
	switch (status) {
		case "PLAYED":
			editedEmbed.setColor("#78b159");
			break;
		case "CANCELED":
			editedEmbed.setColor("#dd2e44");
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
			sessions[i].requested[sessions[i].requested.length] = {
				user_id: `${userID}`,
			};
			break;
		}
	}
	// Write the edited data to designated JSON database.
	writeToJsonDb("./bot/jsonDb/sessionAddUserRequest.json", jsonDB);
}

function removeUserRequestStatus(sessions, gameSessionChannel, userID, jsonDB) {
	for (let session of sessions) {
		if (session.session_channel === gameSessionChannel) {
			for (let requested of session.requested) {
				if (requested.user_id === userID) {
					session.requested[session.requested.length] = {
						user_id: `${userID}`,
					};
					break;
				}
			}
		}
	}
	// Write the edited data to designated JSON database. -> doet dit iets?
	writeToJsonDb("./bot/jsonDb/sessionAddUserRequest.json", jsonDB);
}
// ./bot/jsonDb/sessionAddUserRequest.json

function writeToJsonDb(location, data) {
	const fs = require("fs");
	fs.writeFile(`${location}`, JSON.stringify(data, null, 4), (err) => {
		if (err) throw err;
	});
}

function playerAlreadyRequestedForSession(sessions, userID, sessionChannelID) {
	// TODO: Make this per server.
	for (let session of sessions) {
		if (session.session_channel === sessionChannelID) {
			for (let requested of session.requested) {
				if (requested.user_id === userID) {
					return true;
				}
			}
		}
	}
	return false;
}

function playerAlreadyDenied(sessions, userID, sessionChannelID) {
	// TODO: Make this per server.
	for (let session of sessions) {
		if (session.session_channel === sessionChannelID) {
			for (let denied of session.denied) {
				if (denied.user_id === userID) {
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
	message.embeds[0].fields[1].value = `${sessionParty
		.map((id) => `<@!${id}>`)
		.join(", ")}`;
	return message;
}

function createSessionChannelEmbed(
	messageAuthor,
	sessionDate,
	sessionParticipants,
	sessionObjective,
	sessionCommanderAvatar,
	sessionLocation,
) {
	return new MessageEmbed()
		.setThumbnail(sessionCommanderAvatar)
		.setColor(0x333333)
		.setTitle(`**Session Request**`)
		.addFields(
			{
				name: `**Session Commander:**`,
				value: `<@!${messageAuthor.id}>\n`,
				inline: false,
			},
			{
				name: `**Players(${sessionParticipants.length}/5):**`,
				value: `${sessionParticipants.map((id) => `<@!${id}>`).join(", ")}`,
				inline: false,
			},
			{ name: `**DM:**`, value: `*TBD*`, inline: false },
			{ name: `**Location:**`, value: `*${sessionLocation}*`, inline: false },
			{
				name: `**Date & Time:**`,
				value: `\`${getPrettyDateString(new Date(sessionDate))}\``,
				inline: false,
			},
			{
				name: `**Objective:**`,
				value: `>>> *${sessionObjective}*`,
				inline: false,
			},
		)
		.setTimestamp()
		.setFooter({
			text: `Requested by ${messageAuthor.username}`,
			iconURL: messageAuthor.avatarURL(),
		});
}

async function createSession(
	userID,
	guildID,
	objective,
	session_location,
	date,
	message_id,
	session_channel_id,
	session_party,
) {
	const TIMESTAMP = Date.now();
	return GameSession.create({
		id: `GS${TIMESTAMP}`,
		message_id_discord: message_id,
		session_commander: userID,
		session_party: session_party,
		date: date,
		dungeon_master_id_discord: "",
		objective: objective,
		location: session_location,
		session_number: 0,
		session_channel: session_channel_id,
		session_status: "CREATED",
		server: guildID,
	});
}

module.exports = {
	getAllGameSessions,
	getAllServerGameSessions,
	createGameSession,
	approveGameSession,
	declineGameSession,
	joinGameSession,
	fetchGameSessionMessage,
	updateGameSessionStatus,
	updateGameSessionMessageId,
	updateGameSessionNumber,
	updateGameSessionParty,
	updateGameSessionDungeonMaster,
	updateGeneralServerSessionNumber,
	editRequestSessionEmbedToPlannedSessionEmbed,
	updatePartyNextSessionId,
};
