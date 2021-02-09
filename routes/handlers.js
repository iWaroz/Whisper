const express = require('express');
const { makeid, validateQuery } = require('../utils/utils');
const router = express.Router();

router.get('/connect', validateQuery(['username']), (req, res) => {
    const room = req.query.room || makeid(15);
    res.cookie('usernameRedirect', req.query.username, { maxAge: 15000000, path: "/chat/" + room });
    res.redirect(`/chat/${room}`)
})

module.exports = router;