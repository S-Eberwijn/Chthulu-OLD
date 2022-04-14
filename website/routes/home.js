const router = require('express').Router(),
    { constructionDashboardPage, dashboardPage, } = require('../controllers/dashboard');

router.get('/', constructionDashboardPage);
router.get('/chthulu', dashboardPage);


module.exports = router;