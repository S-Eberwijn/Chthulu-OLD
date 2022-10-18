const pug = require('pug');

const TEMPLATE_PATH = './website/views/components/';
const TEMPLATE_FILE_EXTENSION = '.pug';

/**
 * @param {} quest - Needs a quest object ferom the database
 */
const QUEST_ELEMENT_TEMPLATE = pug.compileFile(TEMPLATE_PATH + 'quest' + TEMPLATE_FILE_EXTENSION)

/**
 * @param {} session - Needs a session object ferom the database
 */
 const SESSION_EMBED_ELEMENT_TEMPLATE = pug.compileFile(TEMPLATE_PATH + 'discordSessionEmbed' + TEMPLATE_FILE_EXTENSION)

module.exports = {
    QUEST_ELEMENT_TEMPLATE,
    SESSION_EMBED_ELEMENT_TEMPLATE
}