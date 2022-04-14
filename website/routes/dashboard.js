const router = require('express').Router(),
    { dashboardPage, guildDashboardPage, constructionDashboardPage, guildInformationalCharactersDashboardPage, guildInformationalNonPlayableCharactersDashboardPage, guildInformationalQuestsDashboardPage, guildInformationalMapDashboardPage, createQuestPost, deleteQuestRequest, editQuestRequest, guildSettingsPage, editSettingsRequest } = require('../controllers/dashboard');

//TODO add this to the routes like this
// router.get('/:id', isAuthorized, guildDashboardPage);

function isAuthorized(req, res, next) {
    if (req.user) {
        console.log('User is logged in.')
        next();
    } else {
        console.log('User is not logged in.');
        res.redirect('/')
    }
}
//Maybe change later
// router.get('/', function (req, res) {
//     // res.redirect('/dashboard');
// });

// router.get('/', constructionDashboardPage)

router.get('/:id', isAuthorized, guildDashboardPage);

// Informational
router.get('/:id/informational/characters', isAuthorized, guildInformationalCharactersDashboardPage);
router.get('/:id/informational/nonplayercharacters', isAuthorized, guildInformationalNonPlayableCharactersDashboardPage);

router.get('/:id/informational/quests', isAuthorized, guildInformationalQuestsDashboardPage);
router.post('/:id/informational/quests', isAuthorized, createQuestPost);
router.delete('/:id/informational/quests', isAuthorized, deleteQuestRequest);
router.put('/:id/informational/quests', isAuthorized, editQuestRequest);

router.get('/:id/informational/map', isAuthorized, guildInformationalMapDashboardPage);

router.get('/:id/informational/sessions', isAuthorized, constructionDashboardPage);
// router.get('/dashboard/:id/sessions/request', constructionDashboardPage);

//Lookup
router.get('/:id/lookup/item', isAuthorized, constructionDashboardPage);
router.get('/:id/lookup/condition', isAuthorized, constructionDashboardPage);
router.get('/:id/lookup/spell', isAuthorized, constructionDashboardPage);

// Settings
router.get('/:id/settings/dnd', isAuthorized, guildSettingsPage);
router.get('/:id/settings/general', isAuthorized, guildSettingsPage);
router.get('/:id/settings/information', isAuthorized, guildSettingsPage);
router.get('/:id/settings/miscellaneous', isAuthorized, guildSettingsPage);
router.put('/:id/settings', isAuthorized, editSettingsRequest);


module.exports = router;