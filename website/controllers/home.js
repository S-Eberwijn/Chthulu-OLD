const fetch = require('node-fetch');

const passport = require('passport');


exports.homePage = async (req, res) => {
    const bot = require('../../index');
    res.render('homePage', {
        bot_icon: bot.user.avatarURL(),
    });
    
}