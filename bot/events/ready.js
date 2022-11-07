const fs = require("fs");
const { GeneralInfo } = require('../../database/models/GeneralInfo');

const { logger } = require(`../../functions/logger`)


module.exports = async bot => {
    // Check to see if bot is ready
    logger.info(`${bot.user.username} bot is online!`);

    // Set activity status of the bot
    // bot.user.setActivity(`Khthonios`, { type: "LISTENING" });
    // bot.user.setPresence({
    //     status: 'dnd',
    //     activity: {
    //         name: 'https://www.youtube.com/watch?v=JodDG6bcsdE',
    //         type: 'WATCHING' // STREAMING, WATCHING, CUSTOM_STATUS, PLAYING, COMPETING
    //     }
    // });


    // Set the presence
    const activity = {
        name: 'Me',
        type: "WATCHING",
        // url: 'Test',
        // emoji: '💩',
        // state: state,
        // timestamps: {
        //     start: Date.now(),
        // },
    };
    bot.user.setPresence({
        // pid: process.pid,
        activities: [activity],
        status: 'online',
    });

    // const JUST_A_CHANNEL = bot.guilds.cache.get('532525442201026580').channels.cache.find(c => c.id === '634844140500418570' && c.type == "text");
    // JUST_A_CHANNEL.send('Bot is online');
    //Initialize databases


    //Update resurrection database
    // bot.ressurection['resurrections'] = {
    //     count: bot.ressurection['resurrections'].count + 1
    // };
    // fs.writeFile("./bot/jsonDb/ressurection.json", JSON.stringify(bot.ressurection, null, 4), err => {
    //     if (err) throw err;
    // });

    //setting slash command for all guilds

    bot.guilds.cache.forEach(async guild => {
        await GeneralInfo.findOne({ where: { id: guild.id } }).then(async server => {
            try {
                if (server) await bot.guilds.cache.get(guild.id)?.commands.set(bot.slashCommands.filter(cmd => !server?.disabled_commands?.includes(cmd.help.name)).map(cmd => cmd.help))
            } catch (error) {
                logger.error(error)
            }
        });
    })

}


