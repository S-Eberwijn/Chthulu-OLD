const express = require('express'),
    router = express.Router(),
    { loginPage } = require('../controllers/login');

router.get('/login', loginPage);

module.exports = router;