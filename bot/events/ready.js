const fs = require("fs");

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
}