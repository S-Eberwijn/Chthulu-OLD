module.exports = async (bot, messageReaction, user) => {
    const { message } = messageReaction;
    //chro When we receive a reaction we check if the reaction is partial or not
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
}