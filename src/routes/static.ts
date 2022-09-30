import { Router } from 'express';
import path from 'path';

import type { Request, Response } from 'express';

const router = Router();

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

Object.keys(staticFiles).forEach(
	(route: string) => {
		router.get(
			route,
			(req: Request, res: Response) => {
				res.sendFile(path.join(__dirname + "/.." + staticFiles[route as keyof typeof staticFiles]))
		});
	}
);
Object.keys(redirects).forEach(
	(route: string) => router.get(route, (req: Request, res: Response) => res.redirect(redirects[route as keyof typeof redirects]))
);

router.get('/chat/:room', (req: Request, res: Response) => {
    res.redirect(`/c/${req.params.room}`)
})

/*
router.get(`/chat/:room`, (req, res) => {
	const room = req.query.room;
  if(room === null) {
		res.redirect('https://whisper.gg');
	} else {
		res.redirect(`/c/${res.room}`);
	}
})
*/

export default router;
