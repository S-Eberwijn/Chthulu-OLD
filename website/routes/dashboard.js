const router = require('express').Router();
const { dashboardPage, guildDashboardPage, constructionDashboardPage, guildInformationalCharactersDashboardPage, guildInformationalNonPlayableCharactersDashboardPage, guildInformationalQuestsDashboardPage, guildInformationalMapDashboardPage, createQuestPost, deleteQuestRequest, editQuestRequest, guildSettingsPage, editSettingsRequest } = require('../controllers/dashboard');
const {isAuthorized, centralizedData} = require('./middleware/middleware');

router.get('/chthulu', isAuthorized, centralizedData, dashboardPage);
router.get('/:id', isAuthorized, centralizedData, guildDashboardPage);

// Informational
router.get('/:id/informational/characters', isAuthorized, centralizedData, guildInformationalCharactersDashboardPage);
router.get('/:id/informational/nonplayercharacters', isAuthorized, centralizedData, guildInformationalNonPlayableCharactersDashboardPage);

router.get('/:id/informational/quests', isAuthorized, centralizedData, guildInformationalQuestsDashboardPage);
router.post('/:id/informational/quests', isAuthorized, centralizedData, createQuestPost);
router.delete('/:id/informational/quests', isAuthorized, centralizedData, deleteQuestRequest);
router.put('/:id/informational/quests', isAuthorized, centralizedData, editQuestRequest);

router.get('/:id/informational/map', isAuthorized, centralizedData, guildInformationalMapDashboardPage);

router.get('/:id/informational/sessions', isAuthorized, centralizedData, constructionDashboardPage);
// router.get('/dashboard/:id/sessions/request', constructionDashboardPage);

//Lookup
router.get('/:id/lookup/item', isAuthorized, centralizedData, constructionDashboardPage);
router.get('/:id/lookup/condition', isAuthorized, centralizedData, constructionDashboardPage);
router.get('/:id/lookup/spell', isAuthorized, centralizedData, constructionDashboardPage);

// Settings
router.get('/:id/settings/dnd', isAuthorized, centralizedData, guildSettingsPage);
router.get('/:id/settings/general', isAuthorized, centralizedData, guildSettingsPage);
router.get('/:id/settings/information', isAuthorized, centralizedData, guildSettingsPage);
router.get('/:id/settings/miscellaneous', isAuthorized, centralizedData, guildSettingsPage);
router.put('/:id/settings', isAuthorized, centralizedData, editSettingsRequest);


module.exports = router;