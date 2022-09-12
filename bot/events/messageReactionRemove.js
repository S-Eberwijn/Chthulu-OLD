const { logger } = require(`../../functions/logger`)
const { SessionRequest } = require('../../database/models/SessionRequest');


module.exports = async (bot, messageReaction, user) => {
    const { message, emoji } = messageReaction;
    // When we receive a reaction we check if the reaction is partial or not
    if (messageReaction.partial) {
        // If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
        try {
            await messageReaction.fetch();
        } catch (error) {
            return logger.error('Something went wrong when fetching the message: ', error);
        }
    }

    if (user.bot) return;
    if (message.guild === null) return;
    // Return if the message is not an embed.
    if (!message.embeds[0]) return;
    // Enter when the message is in the "session-request" channel.
    let FOUND_SESSION_REQUEST = await SessionRequest.findOne({ where: { message_id_discord: message.id } });
    if (!FOUND_SESSION_REQUEST) return;

    // CHANNELS
    const SESSION_REQUEST_CHANNEL = message.member?.guild.channels.cache.find(c => c.name.includes("session-request") && c.type == "text");

    try {
        if(SESSION_REQUEST_CHANNEL && message.channel.id === SESSION_REQUEST_CHANNEL.id && emoji.name == '🙋‍♂️') {
            if (user.id === FOUND_SESSION_REQUEST.session_commander) return message.channel.send({ content: 'Session commanders can not leave their own session!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => logger.error(err));
            if (!FOUND_SESSION_REQUEST.get('session_party').includes(user.id)) return;
            removePlayerFromDatabaseSessionParty(FOUND_SESSION_REQUEST, user.id);
            message.edit(updateSessionEmbedParty(message, FOUND_SESSION_REQUEST.get('session_party')).embeds[0]);
        }
    } catch (error) {
        logger.error(error);
    }
}

function removePlayerFromDatabaseSessionParty(sessionRequest, playerId) {
    let partyMembers = sessionRequest.get('session_party').filter(id => id != playerId);
    sessionRequest.session_party = partyMembers;
    sessionRequest.save();
}

function updateSessionEmbedParty(message, sessionParty) {
    message.embeds[0].fields[1].name = `**Players(${sessionParty.length}/5)**`;
    message.embeds[0].fields[1].value = `${sessionParty.map(id => `<@!${id}>`).join(', ')}`
    return message;
}


