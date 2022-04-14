const router = require('express').Router(),
    { loginPage, } = require('../controllers/login');
const passport = require('passport');

router.get('/login', passport.authenticate('discord'));
router.get('/login/redirect', passport.authenticate('discord', {
    failureRedirect: '/',
}), async (req, res) => {
    console.log(req.user)
    await new Promise((resolve, reject) => req.session.save(err => (err ? reject(err) : resolve())))
    res.redirect('/chthulu')
});
router.get('/logout', (req, res) => {
    console.log(req.user)
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.redirect('/chthulu')
            } else {
                res.redirect('/')
            }
        });
    } else {
        res.redirect('/')
    }
})

module.exports = router;