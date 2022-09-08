const express = require('express');
const router = express.Router();
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const { validateQuery } = require('../utils/middleware');
const { makeid } = require('../utils/utils');

router.get('/send-support', validateQuery('message'), (req, res) => {
	const hook = new Webhook(process.env.WEBHOOK);

	const IMAGE_URL = 'https://whisper.gg/images/whisper.png';
	hook.setUsername('Support Message');
	hook.setAvatar(IMAGE_URL);

	const embed = new MessageBuilder()
	.setColor('#34aeeb')
	.setDescription(req.query.message)
	.setTimestamp();

	hook.send(embed);

	res.redirect('https://whisper.gg/contact');
})

module.exports = router;