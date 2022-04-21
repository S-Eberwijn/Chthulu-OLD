const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');
const { encrypt } = require('../../../functions/cryptography');

passport.serializeUser(function (user, done) {
    done(null, user);
})

passport.deserializeUser(function (user, done) {
    done(null, user);
})

passport.use(new DiscordStrategy({
    clientID: process.env.OATH2_CLIENT_ID,
    clientSecret: process.env.OATH2_CLIENT_SECRET,
    callbackURL: `${process.env.WB_BASE_URL}:${process.env.WB_PORT}/auth/login/redirect`, 
    scope: ['identify', 'guilds']
},async (accessToken, refreshToken, profile, done) => {
    if (profile) {
        const bot = require('../../../index');
        const { id, username, discriminator, avatar } = profile;
        const user = {
            discordID: id,
            username: username,
            discriminator: discriminator,
            avatar: await (await bot.users.fetch(id))?.avatarURL() || avatar,
            accT: encrypt(accessToken),
            refT: encrypt(refreshToken)
        }
        done(null, user)
    } else {
        done('Error during authentication', null)
    }
}))