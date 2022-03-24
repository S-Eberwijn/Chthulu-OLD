const express = require('express'),
    router = express.Router(),
    { dashboardPage, guildDashboardPage, constructionDashboardPage, guildInformationalCharactersDashboardPage, guildInformationalNonPlayableCharactersDashboardPage, guildInformationalQuestsDashboardPage, guildInformationalMapDashboardPage, createQuestPost, deleteQuestRequest,editQuestRequest, guildSettingsPage, editSettingsRequest} = require('../controllers/dashboard');

//Maybe change later
router.get('/', function (req, res) {
    res.redirect('/dashboard');
});

router.get('/dashboard', dashboardPage);
router.get('/dashboard/:id', guildDashboardPage);
// Informational
router.get('/dashboard/:id/informational/characters', guildInformationalCharactersDashboardPage);
router.get('/dashboard/:id/informational/nonplayercharacters', guildInformationalNonPlayableCharactersDashboardPage);

router.get('/dashboard/:id/informational/quests', guildInformationalQuestsDashboardPage);
router.post('/dashboard/:id/informational/quests', createQuestPost);
router.delete('/dashboard/:id/informational/quests', deleteQuestRequest);
router.put('/dashboard/:id/informational/quests', editQuestRequest);

router.get('/dashboard/:id/informational/map', guildInformationalMapDashboardPage);

// Sessions
router.get('/dashboard/:id/sessions/overview', constructionDashboardPage);
router.get('/dashboard/:id/sessions/request', constructionDashboardPage);
// Settings
router.get('/dashboard/:id/settings/dnd', guildSettingsPage);
router.get('/dashboard/:id/settings/general', guildSettingsPage);
router.get('/dashboard/:id/settings/information', guildSettingsPage);
router.get('/dashboard/:id/settings/miscellaneous', guildSettingsPage);
router.put('/dashboard/:id/settings', editSettingsRequest);







module.exports = router;