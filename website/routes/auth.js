const router = require('express').Router(),
    { loginPage, } = require('../controllers/home');
const passport = require('passport');

//TODO: Handle error route (e.g. when a user presses twice on authorize in discord oath2 link)
router.get('/login', passport.authenticate('discord'));
router.get('/login/redirect', passport.authenticate('discord', {
    failureRedirect: '/',
}), async (req, res) => {
    setTimeout(async () => { await new Promise((resolve, reject) => req.session.save(err => (err ? reject(err) : res.redirect('/dashboard/chthulu')))) }, 500)
});
router.get('/logout', (req, res) => {
    if (req.session) {
        req.session.destroy(err => res.redirect('/'));
    } else {
        res.redirect('/')
    }
})

module.exports = router;