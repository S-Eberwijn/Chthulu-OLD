require('dotenv').config();
const express = require('express')
const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

const fs = require("fs");

//Firebase Database
const admin = require("firebase-admin");
const firebaseSequelizer = require("firestore-sequelizer");
const serviceAccount = require(`${process.env.GOOGLE_APPLICATION_CREDENTIALS}`);
// const serviceAccount = {
//     "type": "service_account",
//     "project_id": process.env.FS_PROJECT_ID || "",
//     "private_key_id": process.env.FS_PRIVATE_KEY_ID || "",
//     "private_key": process.env.FS_PRIVATE_KEY || "",
//     "client_email": process.env.FS_CLIENT_EMAIL || "",
//     "client_id": process.env.FS_CLIENT_ID || "",
//     "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//     "token_uri": "https://oauth2.googleapis.com/token",
//     "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//     "client_x509_cert_url": process.env.FS_CERT_URL || ""
// };
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${process.env.DATABASE_NAME || 'null'}.firebaseio.com`
});
firebaseSequelizer.initializeApp(admin);

// //Raspberry Pi Database
// const db = require('./database/database');
// const { initializeDB } = require('./database/initializeDB');

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const WB_PORT = process.env.WB_PORT || 8080;

// Initialize Webapp
const app = express();
app.use(favicon(path.join(__dirname, 'website', 'public', 'favicon.ico')));
app.use(bodyParser.json());

//Load View Engine
app.set('views', path.join(__dirname, 'website', 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'website', 'public')));
app.use(express.static(path.join(__dirname, 'bot', 'images', 'DnD', 'ClassIcons')));


// console.log(path.join(__dirname, 'bot', 'images', 'ClassIcons'))

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

// const {PlayerCharacter} = require('./database/models/PlayerCharacter')
// PlayerCharacter.findOne({where: {id: 'C1647626995287'}}).then((char) => {console.log(char)})

// // Read and log command files
// fs.readdir("./bot/commands/", async (err, dirs) => {
//     if (err) console.log(err);
//     if (dirs.length <= 0) {
//         console.log("Found no dirs files!");
//         return;
//     }
//     dirs.forEach((d, i) => {
//         fs.readdir(`./bot/commands/${d}`, async (err, files) => {
//             if (err) console.log(err);
//             var jsFiles = files.filter(f => f.split(".").pop() === "js");
//             if (dirs.length <= 0) {
//                 console.log("Found no dirs files!");
//                 return;
//             }
//             jsFiles.forEach((f, i) => {
//                 var fileGet = require(`./bot/commands/${d}/${f}`);
//                 console.log(`--{ Command ${f} is loaded }--`);
//                 var commandName = fileGet.help.name;
//                 var commandAlias = fileGet.help.alias;
//                 bot.commands.set(commandName.toLowerCase(), fileGet);
//                 commandAlias.forEach(alias => {
//                     bot.commands.set(alias.toLowerCase(), fileGet);
//                 });
//                 // console.log(bot.commands)
//             });
//         });
//     });
// });

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
// db.authenticate().then(() => {
//     console.log(`Succesfully connected to database ${db.config.database}`);
//     initializeDB(db);
// }).catch(err => console.log(err));

// Login Discord Bot 'Chthulu'
bot.login(BOT_TOKEN).then(() => {
    // Start Webserver
    app.listen(WB_PORT, () => {
        console.log(`App listening at http://localhost:${WB_PORT}`)
        module.exports = bot;
    })
});
