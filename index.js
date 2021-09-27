require('dotenv').config();
const express = require('express')
const path = require('path');
const favicon = require('serve-favicon');

const fs = require("fs");

const db = require('./database/database');
const { initializeDB } = require('./database/initializeDB');

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const WB_PORT = process.env.WB_PORT || 8080;

// Initialize Webapp
const app = express();
app.use(favicon(path.join(__dirname, 'website', 'public', 'favicon.ico')));

//Load View Engine
app.set('views', path.join(__dirname, 'website', 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'website', 'public')));

// Home Route
app.use('/', require('./website/routes/dashboard'));
app.use('/', require('./website/routes/login'));


// Initialize Discord Bot
const { Client, Intents } = require('discord.js');
const bot = new Client({ restTimeOffset: 0, partials: ['MESSAGE', 'CHANNEL', 'REACTION'], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });
// const discordButtons = require("discord-buttons");
// discordButtons(bot);
const Enmap = require('enmap');
bot.commands = new Enmap();
bot.slashCommands = new Enmap();


// Read and log command files
fs.readdir("./bot/commands/", async (err, dirs) => {
    if (err) console.log(err);
    if (dirs.length <= 0) {
        console.log("Found no dirs files!");
        return;
    }
    dirs.forEach((d, i) => {
        fs.readdir(`./bot/commands/${d}`, async (err, files) => {
            if (err) console.log(err);
            var jsFiles = files.filter(f => f.split(".").pop() === "js");
            if (dirs.length <= 0) {
                console.log("Found no dirs files!");
                return;
            }
            jsFiles.forEach((f, i) => {
                var fileGet = require(`./bot/commands/${d}/${f}`);
                console.log(`--{ Command ${f} is loaded }--`);
                var commandName = fileGet.help.name;
                var commandAlias = fileGet.help.alias;
                bot.commands.set(commandName.toLowerCase(), fileGet);
                commandAlias.forEach(alias => {
                    bot.commands.set(alias.toLowerCase(), fileGet);
                });
            });
        });
    });
});

// Read and log slash command files
fs.readdir("./bot/slash-commands/", async (err, dirs) => {
    if (err) console.log(err);
    if (dirs.length <= 0) {
        console.log("Found no dirs files!");
        return;
    }
    dirs.forEach((d, i) => {
        fs.readdir(`./bot/slash-commands/${d}`, async (err, files) => {
            if (err) console.log(err);
            var jsFiles = files.filter(f => f.split(".").pop() === "js");
            if (dirs.length <= 0) {
                console.log("Found no dirs files!");
                return;
            }
            jsFiles.forEach((f, i) => {
                var fileGet = require(`./bot/slash-commands/${d}/${f}`);
                console.log(`--{ Slash Command ${f} is loaded }--`);
                var commandName = fileGet.help.name;
                var commandAlias = fileGet.help.alias;
                bot.slashCommands.set(commandName.toLowerCase(), fileGet);
                commandAlias.forEach(alias => {
                    bot.slashCommands.set(alias.toLowerCase(), fileGet);
                });
            });
        });
    });
});

// Read and log event files
fs.readdir('./bot/events/', (err, files) => {
    if (err) console.log(err);
    files.forEach(file => {
        if (!file.endsWith('.js')) return;
        const evt = require(`./bot/events/${file}`);
        let evtName = file.split('.')[0];
        console.log(`--{ Event ${evtName} is loaded }--`);
        bot.on(evtName, evt.bind(null, bot));
    });
});

// Make connection to the database
db.authenticate().then(() => {
    console.log(`Succesfully connected to database ${db.config.database}`);
    initializeDB(db);
}).catch(err => console.log(err));

// Login Discord Bot 'Chthulu'
bot.login(BOT_TOKEN).then(() => {
    // Start Webserver
    app.listen(WB_PORT, () => {
        console.log(`App listening at http://localhost:${WB_PORT}`)
        module.exports = bot;
    })
});

// bot.on('raw', packet => {
//     // We don't want this to run on unrelated packets
//     if (!['MESSAGE_REACTION_ADD', 'MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
//     // Grab the channel to check the message from
//     const channel = client.channels.cache.get(packet.d.channel_id);
//     // There's no need to emit if the message is cached, because the event will fire anyway for that
//     if (channel.messages.cache.has(packet.d.message_id)) return;
//     // Since we have confirmed the message is not cached, let's fetch it
//     channel.messages.fetch(packet.d.message_id).then(message => {
//         // Emojis can have identifiers of name:id format, so we have to account for that case as well
//         const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;
//         // This gives us the reaction we need to emit the event properly, in top of the message object
//         const reaction = message.reactions.cache.get(emoji);
//         // Adds the currently reacting user to the reaction's users collection.
//         if (reaction) reaction.users.cache.set(packet.d.user_id, client.users.cache.get(packet.d.user_id));
//         // Check which type of event it is before emitting
//         if (packet.t === 'MESSAGE_REACTION_ADD') {
//             client.emit('messageReactionAdd', reaction, client.users.cache.get(packet.d.user_id));
//         }
//         if (packet.t === 'MESSAGE_REACTION_REMOVE') {
//             client.emit('messageReactionRemove', reaction, client.users.cache.get(packet.d.user_id));
//         }
//     });
// });

//TODO: CHECK FOR PERMISSION TO REMOVE MESSAGES