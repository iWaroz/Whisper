import express from 'express';
const router = express.Router();
import { Webhook, MessageBuilder } from 'discord-webhook-node';
import { validateQuery } from '../utils/middleware';

router.get('/send-support', validateQuery('message'), async (req, res) => {
	const hook = new Webhook(process.env.WEBHOOK);

	const IMAGE_URL = 'https://whisper.gg/images/whisper.png';
	hook.setUsername('Support Message');
	hook.setAvatar(IMAGE_URL);

	const embed = new MessageBuilder()
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore // For some reason setColor() is typed incorrectly
		.setColor('#34aeeb')
		.setDescription(req.query.message as string)
		.setTimestamp();

	await hook.send(embed);
	res.redirect('https://whisper.gg/contact');
})

export default router;
