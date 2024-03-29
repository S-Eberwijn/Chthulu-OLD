require('dotenv').config();
require('./website/routes/strategies/discordStrategy');
const { logger } = require(`./functions/logger`)
const { wakeDyno, wakeDynos } = require('heroku-keep-awake');
const DYNO_URL = process.env.DYNO_URL;

const express = require('express');

const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

const session = require('express-session')
const passport = require('passport');
const FirestoreStore = require("firestore-store")(session);

const fs = require("fs");
const { loadAllJSONFiles } = require('./functions/api/misc');
const { cacheAllUsers } = require('./functions/api/guild');


//Firebase database modules
const admin = require("firebase-admin");
const firebaseSequelizer = require("firestore-sequelizer");

//!export this bit to external file
//Initialize Firebase database
const firebase = admin.initializeApp({
    credential: admin.credential.cert({
        "type": "service_account",
        "project_id": process.env.FS_PROJECT_ID,
        "private_key_id": process.env.FS_PRIVATE_KEY_ID,
        "private_key": process.env.APP_ENV === 'PROD' ? JSON.parse(process.env.FS_PRIVATE_KEY).replace(/\n/gm, '\n') : process.env.FS_PRIVATE_KEY,
        "client_email": process.env.FS_CLIENT_EMAIL,
        "client_id": process.env.FS_CLIENT_ID,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token", 
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": process.env.FS_CERT_URL || ""
    }),
    databaseURL: `https://${process.env.FS_DATABASE_NAME}.firebaseio.com`,
    storageBucket: process.env.FS_DB_URL,
});
firebaseSequelizer.initializeApp(admin);

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const WB_BASE_URL = process.env.WB_BASE_URL || '';
const WB_PORT = process.env.PORT || process.env.WB_PORT || 5000;

// Initialize Webapp
const app = express();
app.use(bodyParser.json({ limit: '50mb',type:'application/json' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(favicon(path.join(__dirname, 'website', 'public', 'favicon.ico')));
app.use(bodyParser.text({ type: "*/*" }));

//Load View Engine
app.set('views', path.join(__dirname, 'website', 'views'));
app.set('view engine', 'pug');

// Set-up paths for static images
app.use(express.static(path.join(__dirname, 'website', 'public')));
app.use(express.static(path.join(__dirname, 'bot', 'images', 'DnD', 'ClassIcons')));
app.use(express.static(path.join(__dirname, 'bot', 'images', 'DnD', 'CharacterLevel')));

// Set-up Express Session (in combination with Firestore database)
app.use(session({
    store: new FirestoreStore({
        database: firebase.firestore(),
    }),
    name: '__session',
    resave: true,
    saveUninitialized: true,
    secret: process.env.SECRET_KEY || '',
    cookie: { maxAge: 100 * 365 * 24 * 60 * 60000 }
}));
app.use(passport.initialize())
app.use(passport.session())

// Routes
app.use('/', require('./website/routes/home'));
app.use('/dashboard/', require('./website/routes/dashboard'));
app.use('/auth', require('./website/routes/auth'));

app.post("/refresh", async (req, res) => {
    let readline = require('readline');
    let rl = readline.createInterface(
        process.stdin, process.stdout);
    console.log("repl.deploy" + req?.body + req?.get("Signature"))
    rl.on('line', async (result) => {
        result = JSON.parse(result)
        res.status(result.status || 500).end(result.body || "Internal Server Error").then(console.log("repl.deploy-success"))
    });
})

// Initialize Discord Bot
const { Client, Intents } = require('discord.js');
const bot = new Client({ restTimeOffset: 0, partials: ['MESSAGE', 'CHANNEL', 'REACTION'], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS] });

const Enmap = require('enmap');
const { getBotGuilds } = require('./functions/api/misc');
const { getItem } = require('./functions/api/items');
bot.commands = new Enmap();
bot.slashCommands = new Enmap();

// Read and log slash command files
fs.readdir("./bot/commands/", async (err, dirs) => {
    if (err) console.log(err);
    if (dirs.length <= 0) {
        logger.warn("Found no dirs files!");
        return;
    }
    dirs.forEach((d, i) => {
        fs.readdir(`./bot/commands/${d}`, async (err, files) => {
            if (err) console.log(err);
            let jsFiles = files.filter(f => f.split(".").pop() === "js");
            if (dirs.length <= 0) {
                logger.warn("Empty folder in bot/commands!");
                return;
            }
            jsFiles.forEach((f, i) => {
                let fileGet = require(`./bot/commands/${d}/${f}`);
                logger.info(`Command ${f} is loaded`);
                let commandName = fileGet.help.name;
                let commandAlias = fileGet.help.alias;
                bot.slashCommands.set(commandName.toLowerCase(), fileGet);
                commandAlias?.forEach(alias => {
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
        logger.info(`Event ${evtName}.js is loaded`);
        bot.on(evtName, evt.bind(null, bot));
    });
});

// Login Discord Bot 'Chthulu'
bot.login(BOT_TOKEN).then(async () => {
    await cacheAllUsers(bot);
    await loadAllJSONFiles(bot)

    // Start Webserver
    app.listen(WB_PORT, () => {
        // const HEROKU_OPTIONS = {
        //     interval: 29,
        //     logging: false,
        //     stopTimes: { start: '04:00', end: '23:00' }
        // }
        // wakeDyno(DYNO_URL, HEROKU_OPTIONS); // Use this function when only needing to wake a single Heroku app.
        logger.info(`Website is up and running at ${WB_BASE_URL}:${WB_PORT || 5000}`)
        module.exports = bot;
    })
});
