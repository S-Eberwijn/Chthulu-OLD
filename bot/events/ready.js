const fs = require("fs");
const { GeneralInfo } = require('../../database/models/GeneralInfo');
const { Map } = require('../../database/models/Maps');

// const { createCmd } = require("../../dataHandler")

module.exports = async bot => {
    // Check to see if bot is ready
    console.log(`\n${bot.user.username} is online!\n`);

    // Set activity status of the bot
    bot.user.setActivity(`Khthonios`, { type: "LISTENING" });

    // const JUST_A_CHANNEL = bot.guilds.cache.get('532525442201026580').channels.cache.find(c => c.id === '634844140500418570' && c.type == "text");
    // JUST_A_CHANNEL.send('Bot is online');

    //Initialize databases
    bot.stupidQuestionTracker = require("../jsonDb/stupidQuestionTracker.json");
    bot.ressurection = require("../jsonDb/ressurection.json");
    bot.sessionAddUserRequest = require("../jsonDb/sessionAddUserRequest.json");

    //Update resurrection database
    bot.ressurection['resurrections'] = {
        count: bot.ressurection['resurrections'].count + 1
    };
    fs.writeFile("./bot/jsonDb/ressurection.json", JSON.stringify(bot.ressurection, null, 4), err => {
        if (err) throw err;
    });

    //setting slash command for all guilds
    bot.guilds.cache.forEach(async guild => {
        await GeneralInfo.findOne({ where: { id: guild.id } }).then(async server => {
            try {
                if (server) {
                    await bot.guilds.cache.get(guild.id)?.commands.set(bot.slashCommands.filter(cmd => !server?.disabled_commands?.includes(cmd.help.name)).map(cmd => cmd.help))
                }
            } catch (error) {
                console.log(error)
            }
            // await bot.guilds.cache.get(guild.id)?.commands.set(bot.slashCommands.map(cmd => cmd.help))
            // await bot.guilds.cache.get(guild.id)?.commands.set(bot.slashCommands.filter(cmd => !server.disabled_commands.includes(cmd.help.name)).map(cmd => cmd.help))

        });


    })

    // let timestamp = Date.now();
    // await Map.findOne({ where: { id: '532525442201026580' } }).then((map) => {
    //     if (!map) return;
    //     map.locations.push({
    //         id: `L${timestamp}`,
    //         type: 'players',
    //         description: 'Players',
    //         visited: false,
    //         x: 0,
    //         y: 0,
    //         status: 'idk'
    //     })
    //     map.save()
    // })


    // await Map.create({
    //     id: `532525442201026580`,
    //     map_url: `https://cdn.discordapp.com/attachments/711689970456461372/953023259044098058/The_Homebrew_Campaign.jpg`,
    //     locations: [
    //         {
    //             id: `L${timestamp}`,
    //             type: 'city',
    //             description: 'Testing purpose',
    //             visited: false,
    //             x: -0.7984395318595578 ,
    //             y: -0.23737466794266943,
    //             status: 'idk'
    //         }
    //     ],
    //     server: `532525442201026580`
    // })
}