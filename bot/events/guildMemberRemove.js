const { logger } = require(`../../functions/logger`)

module.exports = async (bot, member) => {
    // Update Server Stats channels
    //updateServerStatChannels(bot, member);

    logger.info(`${member.user.tag} has left ${member.guild.name}`);
}