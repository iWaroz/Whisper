const express = require('express');
const { validateQuery } = require('../utils/middleware');
const { makeid } = require('../utils/utils');
const router = express.Router();

router.get('/connect', validateQuery('username'), (req, res) => {
    const room = req.query.room || makeid(6);
    // res.cookie('usernameRedirect', req.query.username, { maxAge: 15000000, path: "/c/" + room });
    res.redirect(`/c/${room}?u=${req.query.username}`)
})

router.get('/v2/:anything', (req, res) => {
    res.redirect(`/c/beta`)
})

module.exports = router;