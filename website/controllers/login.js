exports.loginPage = (req, res) => {
    const bot = require('../../index');
    //TODO: CHANGE TO LOGIN PAGE
    res.render('dashboardPage', { isDashboardPage: true, bot: bot, headerTitle: 'Chthulu Dashboard' });
}