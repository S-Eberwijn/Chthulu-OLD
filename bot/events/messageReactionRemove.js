//const Player = require('../database/models/Player.js');
//const SessionRequest = require('../database/models/SessionRequest.js');
const SessionRequest = require('../../database/models/SessionRequest');


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

    if (SESSION_REQUEST_CHANNEL) {
        // Enter when the message is in the "session-request" channel.
        if (message.channel.id === SESSION_REQUEST_CHANNEL.id) {
            // Return if the message is not an embed.
            if (!message.embeds[0]) return;
            let FOUND_SESSION_REQUEST = await SessionRequest.findOne({ where: { message_id: message.id } });
            if (!FOUND_SESSION_REQUEST) return;
            try {
                switch (emoji.name) {
                    case '🙋‍♂️':
                        if (user.id === FOUND_SESSION_REQUEST.get('session_commander_id')) return message.channel.send({ content: 'Session commanders can not leave their own session!' }).then(msg => { setTimeout(() => msg.delete(), 3000) }).catch(err => console.log(err));
                        if (!FOUND_SESSION_REQUEST.get('session_party').includes(user.id)) return;
                        await removePlayerFromDatabaseSessionParty(FOUND_SESSION_REQUEST, user.id);
                        message.edit(updateSessionEmbedParty(message, FOUND_SESSION_REQUEST.get('session_party')).embeds[0]);
                }
            } catch (error) {
                console.log(error);
            }
        }
    }

    /*
    if (roleSelectionChannel) {
        if (message.channel.id === roleSelectionChannel.id) {
            switch (emoji.name) {
                case 'LoL':
                    messageReaction.message.guild.members.cache.get(user.id).roles.remove(messageReaction.message.guild.roles.cache.find(role => role.name === 'League of Legends'));
                    break;
                case '🐉':
                    messageReaction.message.guild.members.cache.get(user.id).roles.remove(messageReaction.message.guild.roles.cache.find(role => role.name === 'Player'));
                    await Player.findOne({ where: { player_id: user.id } }).then(player => {
                        player.destroy();
                    });
                    break;
                case 'minecraft':
                    messageReaction.message.guild.members.cache.get(user.id).roles.remove(messageReaction.message.guild.roles.cache.find(role => role.name === 'Minecraft'));
                    break;
                default:
                    break;
            }
        }
    }
    */
    /*
    if (sessionRequestChannel) {
        if (message.channel.id === sessionRequestChannel.id) {
            if (message.guild.member(user).roles.cache.has(playerRole.id)) {
                if (emoji.name.includes('adduser')) {
                    let newEmbed = message.embeds[0];
                    if (newEmbed.fields[1].value.includes(user.id)) {
                        if (newEmbed.fields[1].value.charAt(user.id.length + 3) === ',' && newEmbed.fields[1].value.charAt(user.id.length + 4) === ' ') {
                            newEmbed.fields[1].value = newEmbed.fields[1].value.replace(`<@${user.id}>, `, '');
                            newEmbed.fields[1].value = newEmbed.fields[1].value.replace(`, <@${user.id}>`, '');
                        }
                        var count = await (newEmbed.fields[1].value.match(/,/g) || []).length + 1;
                        newEmbed.fields[1].name = newEmbed.fields[1].name.replace(`${count + 1}`, `${count}`);

                        SessionRequest.findOne({ where: { message_id: message.id } }).then(sessionRequest => {
                            let partyMembers = sessionRequest.get('session_party');
                            partyMembers.splice(partyMembers.indexOf(user.id), 1)
                            sessionRequest.session_party = partyMembers;
                            sessionRequest.save();

                        })
                        message.edit(newEmbed);
                    }


                } else {
                    message.reactions.cache.get(emoji.id).remove().catch(error => console.error('Failed to remove reactions: ', error));
                }

            } else {
                message.reactions.cache.get(emoji.name).remove().catch(error => console.error('Failed to remove reactions: ', error));
            }
        }
    }
    */
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


