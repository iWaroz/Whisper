const express = require('express');
const router = express.Router();
const path = require('path');

const staticFiles = {
    "/": "/public/html/index.html",
    "/chat": "/public/html/index.html",
    "/chat/:room": "/public/html/chat.html",
    "/about": "/public/html/static/about.html",
    "/login": "/public/html/account/login.html",
    "/signup": "/public/html/account/signup.html",
		"/stats": "/public/html/stats.html"
};

const redirects = {
    "/discord": process.env.DISCORD_INVITE || "https://discord.com/invite/kwyMkUDXZt",
    "/twitter": process.env.TWITTER_LINK || "https://twitter.com/TheWhisperCafe",
}

Object.keys(staticFiles).forEach(route => router.get(route, (req, res) => res.sendFile(path.join(__dirname + "/.." + staticFiles[route]))));
Object.keys(redirects).forEach(route => router.get(route, (req, res) => res.redirect(redirects[route])));


module.exports = router;