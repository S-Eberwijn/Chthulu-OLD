
const router = require('express').Router(),
    { constructionDashboardPage, dashboardPage, } = require('../controllers/dashboard'),
    { homePage } = require('../controllers/home');

function isAuthorized(req, res, next) {
    if (req.user) {
        // console.log('User is logged in.')
        res.redirect('/chthulu');
    } else {
        // console.log('User is not logged in.');
        next();
    }
}

router.get('/',isAuthorized, homePage);
//TODO: adjust page below
router.get('/chthulu', dashboardPage);


module.exports = router;