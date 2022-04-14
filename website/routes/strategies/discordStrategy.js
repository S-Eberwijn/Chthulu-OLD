const DiscordStrategy = require('passport-discord').Strategy;
const passport = require('passport');

passport.serializeUser(function (user, done) {
    // console.log('Serializing user.')
    done(null, user);
})

passport.deserializeUser(function (user, done) {
    // console.log('Deserializing user.')
    done(null, user);
})

passport.use(new DiscordStrategy({
    clientID: process.env.OATH2_CLIENT_ID,
    clientSecret: process.env.OATH2_CLIENT_SECRET,
    callbackURL: `http://localhost:${process.env.WB_PORT}/login/redirect`,
    scope: ['identify', 'guilds']
}, (accessToken, refreshToken, profile, done) => {
    if (profile) {
        done(null, profile)
    } else {
        done('Error during authentication', null)
    }
    // console.log(profile)
    // console.log(profile.id)
}))