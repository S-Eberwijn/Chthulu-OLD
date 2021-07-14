const express = require('express'),
    router = express.Router(),
    { dashboardPage, guildDashboardPage, constructionDashboardPage, guildInformationalCharactersDashboardPage } = require('../controllers/dashboard');
//Maybe change later
router.get('/', function (req, res) {
    res.redirect('/dashboard');
});

router.get('/dashboard', dashboardPage);
router.get('/dashboard/:id', guildDashboardPage);
// Informational
router.get('/dashboard/:id/informational/characters', guildInformationalCharactersDashboardPage);
router.get('/dashboard/:id/informational/nonplayercharacters', constructionDashboardPage);
router.get('/dashboard/:id/informational/quests', constructionDashboardPage);
// Sessions
router.get('/dashboard/:id/sessions/overview', constructionDashboardPage);
router.get('/dashboard/:id/sessions/request', constructionDashboardPage);
// Settings
router.get('/dashboard/:id/settings/dnd', constructionDashboardPage);
router.get('/dashboard/:id/settings/general', constructionDashboardPage);
router.get('/dashboard/:id/settings/information', constructionDashboardPage);
router.get('/dashboard/:id/settings/miscellaneous', constructionDashboardPage);






module.exports = router;