
const router = require('express').Router(),
    { constructionDashboardPage, dashboardPage, } = require('../controllers/dashboard'),
    { homePage } = require('../controllers/home');
const { isAlreadyLoggedIn } = require('./middleware/middleware');


router.get('/',isAlreadyLoggedIn, homePage);
//TODO: adjust page below
// router.get('/chthulu', dashboardPage);


module.exports = router;