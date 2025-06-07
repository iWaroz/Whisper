import { Server, Socket } from 'socket.io';
import http from 'http';
import type { Express } from 'express';
import type { joinRoomRequest, adminUpdateRequest, updateIgnRequest, WhisperSocket, } from './types';
import formatMessage from './utils/messages';
import { userJoin } from './utils/users';
import { randomColor, randomIcon } from './utils/utils';

export default (app: Express): WhisperSocket => {
	const server = http.createServer(app);
	const io = new Server(server);
	const adapter = io.of("/").adapter;

	io.on('connection', (socket: Socket) => {
		socket.on('joinRoom', (info: joinRoomRequest) => {
			// console.log('join room', info);
			const username = info.username;
			const room = info.room;
			const color = info.color || randomColor();
			const icon = info.icon || randomIcon();
			const auth = (info.auth || null) === process.env.BADGE_KEY;

			let user = userJoin(socket.id, username, room, color, icon, auth);
			// console.log('socket joiner is dev:', user.isDev, auth)

			(async () => {await socket.join(room)})().then(() => { // It works tho
				socket.emit('botmessage', {
					'username': process.env.BOT_NAME || 'Whisper',
					"text": "Welcome to this chat room. If any messages were sent prior to this, you do not have access to them. This room's code is: " + (room && room)
				});
				socket.emit('userState', user)

				socket.on('updateIgn', (ign: updateIgnRequest) => {
					if (!("ign" in ign)) return
					if (typeof ign.ign !== "string") return
					if (ign.ign.length >= 1 && ign.ign.length <= 24) {
						user.username = ign.ign;
						user.color = randomColor();
						user.icon = randomIcon();
					} else {
						user.username = "[Invalid Username]";
						user.color = randomColor();
						user.icon = randomIcon();
					}
					socket.emit('userState', { user })
				})

				socket.on('adminUpdate', (data: adminUpdateRequest) => {
					if (user.isDev) {
						user = {...user, ...data};
						socket.emit('userState', { user })
					}
				})
				const users = adapter.rooms;

				for (const [key, value] of users.entries()) {
					if (key === user.room) {
						io.to(user.room).emit('userConnect', {
							count: value.size
						})
					}
				}

				// This listens for messages Which are Emitted in public/js/main.js and then handles the UI to see the message
				socket.on('chatMessage', (msg: string) => {
					if (typeof msg !== "string") return
					if (/^\s+$/.test(msg) || msg === "") {return}

					io.to(user.room).emit('message', formatMessage(user.username, msg, user.color, user.icon, user.isDev));
				})

				socket.on('disconnect', () => {
					for (const [key, value] of users.entries()) {
						if (key === user.room) {
							io.to(user.room).emit('userConnect', {
								count: value.size
							})
						}
					}
				})
			}).catch((e) => {
				throw e
			})
		})
	});
	return server;
}
