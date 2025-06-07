import express from 'express';
import { validateQuery } from '../utils/middleware';
import { makeid } from '../utils/utils';
const router = express.Router();


router.get('/connect', validateQuery('username'), (req, res) => {
    const room = (req.query.room || makeid(6)) as string;
    const username = req.query.username as string;
    // res.cookie('usernameRedirect', username, { maxAge: 15000000, path: "/c/" + room });
    res.redirect(`/c/${room}?u=${username}`);
})

router.get('/v2/:anything', (req, res) => {
    res.redirect(`/c/beta`)
})

router.get('/v2', (req, res) => {
    res.redirect(`/c/beta`)
})

export default router;
