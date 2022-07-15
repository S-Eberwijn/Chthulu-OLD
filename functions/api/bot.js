const { logger } = require(`../../functions/logger`)

const Category = Object.freeze({ 'information': 'Information', 'dnd': 'Dungeons & Dragons', 'general': 'General', 'miscellaneous': 'Miscellaneous', });

function getBot() {
    return require('../../index');
}
function getUserFromBot(userID) {
    return getBot().users.cache.get(userID);
}
function getBotCommands() {
    return getBot().slashCommands;
}
function getBotCommandsByCategory(category) {
    return getBotCommands().filter(cmd => cmd.help.category == Category[`${category}`]).map(cmd => cmd.help)
}

module.exports = {
    getBot, getBotCommands, getUserFromBot, getBotCommandsByCategory
};