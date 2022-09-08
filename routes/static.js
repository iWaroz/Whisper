const express = require('express');
const router = express.Router();
const path = require('path');
const staticFiles = {
    "/": "/public/html/index.html",
		"/c/beta": "/public/html/beta.html",
    "/c/:room": "/public/html/chat.html",
    "/about": "/public/html/static/about.html",
    "/login": "/public/html/account/login.html",
    "/signup": "/public/html/account/signup.html",
		"/stats": "/public/html/stats.html",
		"/contact": "/public/html/contact.html",
		"/whisper.js": "/public/js/main.js",

		"/beta.js": "/public/js/beta.js"
};

const redirects = {
    "/discord": process.env.DISCORD_INVITE || "https://discord.com/invite/kwyMkUDXZt",
    "/twitter": process.env.TWITTER_LINK || "https://twitter.com/TheWhisperCafe",
		"/c": "https://whisper.gg",
		"/code": "https://replit.com/@iWaroz/Whisper"
}

Object.keys(staticFiles).forEach(route => router.get(route, (req, res) => res.sendFile(path.join(__dirname + "/.." + staticFiles[route]))));
Object.keys(redirects).forEach(route => router.get(route, (req, res) => res.redirect(redirects[route])));

router.get('/chat/:room', (req, res) => {
    res.redirect(`/c/${req.params.room}`)
})

/*router.get(`/chat/:room`, (req, res) => {
	const room = req.query.room;
  if(room === null) {
		res.redirect('https://whisper.gg');
	} else {
		res.redirect(`/c/${res.room}`);
	}
})*/

module.exports = router;