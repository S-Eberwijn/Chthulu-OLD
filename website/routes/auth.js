const router = require('express').Router(),
    { loginPage, } = require('../controllers/login');
const passport = require('passport');

//TODO: Handle error route (e.g. when a user presses twice on authorize in discord oath2 link)
router.get('/login', passport.authenticate('discord'));
router.get('/login/redirect', passport.authenticate('discord', {
    failureRedirect: '/',
}), async (req, res) => {
    setTimeout(async () => {await new Promise((resolve, reject) => req.session.save(err => (err ? reject(err) : res.redirect('/chthulu'))))}, 500)
});
router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => err ? res.redirect('/') : res.redirect('/chthulu'));
    } else {
        res.redirect('/')
    }
})

module.exports = router;