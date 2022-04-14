require('dotenv').config();
const express = require('express')
const app = express();

const path = require('path');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');

// app.use(cookieParser('My secret'));

// var cookieParser = require('cookie-parser');
const session = require('express-session')
const passport = require('passport');
const discordStrategy = require('./website/routes/strategies/discordStrategy')
const FirebaseStore = require('connect-session-firebase')(session);

const fs = require("fs");

//Firebase Database
const admin = require("firebase-admin");
const firebaseSequelizer = require("firestore-sequelizer");

const ref = admin.initializeApp({
    credential: admin.credential.cert({
        "type": "service_account",
        "project_id": process.env.FS_PROJECT_ID,
        "private_key_id": process.env.FS_PRIVATE_KEY_ID,
        "private_key": process.env.FS_PRIVATE_KEY,
        "client_email": process.env.FS_CLIENT_EMAIL,
        "client_id": process.env.FS_CLIENT_ID,
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": process.env.FS_CERT_URL || ""
    }),
    databaseURL: `https://${process.env.FS_DATABASE_NAME}.firebaseio.com`
});
firebaseSequelizer.initializeApp(admin);


express()
    .use(session({
        store: new FirebaseStore({
            database: ref.database()
        }),
        secret: 'keyboard cat',
        name: '__session',
        resave: true,
        saveUninitialized: true
    }));
// app.use(session({
//     store: new FirestoreStore({
//         database: ref.firestore()
//     }),
//     secret: 'Change later',
//     resave: true,
//     saveUninitialized: true,
//     cookie: {
//         maxAge: 60000 * 60 * 24,
//         // secure: false,
//         // httpOnly: false
//     }
// }));


const BOT_TOKEN = process.env.BOT_TOKEN || '';
const WB_PORT = process.env.WB_PORT || 8080;

// Initialize Webapp
app.use(favicon(path.join(__dirname, 'website', 'public', 'favicon.ico')));
app.use(bodyParser.json());

//Load View Engine
app.set('views', path.join(__dirname, 'website', 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'website', 'public')));
app.use(express.static(path.join(__dirname, 'bot', 'images', 'DnD', 'ClassIcons')));

// // Set-up Express Session
app.use(session({ name: 'discord.oath2', resave: false, saveUninitialized: false, secret: 'XCR3rsasa%RDHHH', cookie: { maxAge: 60000 * 60 * 24 } }));
app.use(passport.initialize())
app.use(passport.session())

// Home Route
app.use('/', require('./website/routes/home'));
app.use('/dashboard/', require('./website/routes/dashboard'));
app.use('/login', require('./website/routes/login'));



// app.use(cookieParser());
// app.use(session({secret: "Test"}));
// //TODO: ADJUST THE SECRET

// Initialize Discord Bot
const { Client, Intents } = require('discord.js');
const bot = new Client({ restTimeOffset: 0, partials: ['MESSAGE', 'CHANNEL', 'REACTION'], intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS] });

const Enmap = require('enmap');
bot.commands = new Enmap();
bot.slashCommands = new Enmap();

// Read and log slash command files
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
                console.log(`--{ Slash Command ${f} is loaded }--`);
                var commandName = fileGet.help.name;
                var commandAlias = fileGet.help.alias;
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
        console.log(`--{ Event ${evtName} is loaded }--`);
        bot.on(evtName, evt.bind(null, bot));
    });
});

// Login Discord Bot 'Chthulu'
bot.login(BOT_TOKEN).then(() => {
    // Start Webserver
    app.listen(WB_PORT, () => {
        console.log(`App listening at http://localhost:${WB_PORT || 8080}`)
        module.exports = bot;
    })
});
