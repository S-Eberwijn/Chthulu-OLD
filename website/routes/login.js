const router = require('express').Router(),
    { loginPage, } = require('../controllers/login');
const passport = require('passport');

router.get('/', passport.authenticate('discord'));
router.get('/redirect', passport.authenticate('discord', {
    failureRedirect: '/error',
    successRedirect: '/chthulu'
}), (req, res) => {
    res.redirect('/')
});

module.exports = router;