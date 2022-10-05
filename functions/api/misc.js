const { logger } = require(`../logger`)

const NAME_OF_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

async function loadAllJSONFiles(bot) {
    bot.stupidQuestionTracker = await require("../../bot/jsonDb/stupidQuestionTracker.json");
    bot.ressurection = await require("../../bot/jsonDb/ressurection.json");
    bot.sessionAddUserRequest = await require("../../bot/jsonDb/sessionAddUserRequest.json");
    logger.debug(`All local JSON databases have been loaded.`)
}

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function getPrettyDateString(date) {
    return `${NAME_OF_DAYS[date.getUTCDay()]} (${getDoubleDigitNumber(date.getUTCDate())}/${getDoubleDigitNumber(date.getUTCMonth() + 1)}/${date.getYear() + 1900}) ${getDoubleDigitNumber(date.getUTCHours())}:${getDoubleDigitNumber(date.getUTCMinutes())}`;
}

function getSimpleDateString(date) {
    return `${getDoubleDigitNumber(date.getUTCDate())}/${getDoubleDigitNumber(date.getUTCMonth() + 1)}/${date.getYear() + 1900}`;
}

function getDoubleDigitNumber(number) {
    if (!(typeof number === 'number' || typeof number === 'string')) return '00';
    if (parseInt(number) < 10) return `0${number}`;
    return `${number}`;
}

function addCreatedDate(array) {
    for (const object of array) {
        object.data.created_date = getSimpleDateString(new Date(parseInt(object.data.quest_identifier.slice(1))));
    }
    return array
}

module.exports = {
    loadAllJSONFiles,
    getDoubleDigitNumber,
    getPrettyDateString,
    onlyUnique, 
    addCreatedDate,
};