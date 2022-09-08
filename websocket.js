const socketio = require('socket.io');
const http = require('http');

const { formatMessage } = require('./utils/messages');
const { userJoin, getCurrentUser } = require('./utils/users');
const { randomColor, randomIcon } = require('./utils/utils');

module.exports = (app) => {
	let sock;
	const server = http.createServer(app);
	const io = socketio(server);
	
	io.on('connection', socket => {
		sock = socket;
		socket.on('joinRoom', (info) => {
			//console.log('join room', info);
			username = info['username'];
			room = info['room'];
			color = info['color'] || randomColor();
			icon = info['icon'] || randomIcon();
			auth = (info['auth'] || null) === process.env.BADGE_KEY;
			
			const user = userJoin(socket.id, username, room, color, icon, auth);

			socket.join(room);

			//console.log('socket joiner is dev:', user.isDev, auth)

			if (info['color'] == null) {
				socket.emit('botmessage', {
					'username': process.env.BOT_NAME || 'Whisper',
					"text": "Welcome to this chat room. If any messages were sent prior to this, you do not have access to them. This room's code is: " + (room && room)
				});
				socket.emit('userState', user)
			}

			socket.on('updateIgn', (ign) => {
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

			socket.on('adminUpdate', (data) => {
				if (user.isDev) {
					for (i in data) {
						user[i] = data[i];
					}
					socket.emit('userState', { user })
				}
			})

			var users = socket.adapter.rooms;

			for (const [key, value] of users.entries()) {
				if (key == user.room) {
					io.to(user.room).emit('userConnect', {
						count: value.size
					})
				}
			}

			// This listens for messages Which are Emitted in public/js/main.js and then handles the UI to see the message
			socket.on('chatMessage', (msg) => {
				if (typeof msg !== "string") return
				if (/^\s+$/.test(msg) || msg === "") {return}
				
				io.to(user.room).emit('message', formatMessage(user.username, msg, user.color, user.icon, user.isDev));
			})
			
			socket.on('disconnect', () => {
				for (const [key, value] of users.entries()) {
					if (key == user.room) {
						io.to(user.room).emit('userConnect', {
							count: value.size
						})
					}
				}
			})

		})
	})
	
	return {
		send(room, message) {
			io.to(room).emit('message', message);
		},
		broadcast(message) {
			io.send(message);
		},
		rooms() {
			return sock.adapter.rooms;
		},
		server,
	}
}
