require('dotenv').config();
const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io');  
const io = socketio(server);
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser } = require('./utils/users');

// Customise the Bot name Here
const botName = process.env.BOTNAME;

function makeid(length) {
var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

function validateQuery(fields) {
  return (req, res, next) => {
    for(const field of fields) {
      if(!req.query[field]) { // Field isn't present, end request
        return res
          .status(400)
          .send(`${field} is missing`);
        }
      }
      next(); // All fields are present, proceed
    };
}

app.get('/connect', validateQuery(['username']), (req, res) => {
  // If it reaches here, you can be sure that all the fields are not empty.
	if (req.query.room == '') {
		room = makeid(15);
	} else {
		room = req.query.room
	}
	res.cookie('usernameRedirect',req.query.username, { maxAge: 15000000, path: "/chat/" + room });
	res.redirect(`https://whisper.gg/chat/${room}`)
})

app.use(express.static(path.join(__dirname, 'public')));

app.get('/discord', function(req, res) {
	res.redirect('https://discord.com/invite/kwyMkUDXZt')
})

app.get('/twitter', function(req, res) {
	res.redirect('https://twitter.com/TheWhisperCafe')
})

app.get('/chat/:room', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/chat.html'));
});

io.on('connection', socket => {
  socket.on('joinRoom', ({username,room}) => {
    const user = userJoin(socket.id, username, room);
    
		socket.join(room);
    
		socket.emit('botmessage', {
      'username': botName,
      "text": "Welcome to this chat room. If any messages were sent prior to this, you do not have access to them."
    });

		socket.on('updateIgn', (ign) => {
			user.username = ign.ign;
		})

		// console.log('ok ' + Object.keys(io.sockets.sockets).length);

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
      io.to(user.room).emit('message', formatMessage(user.username, msg));
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

const PORT = process.env.PORT;
server.listen(PORT, () => console.log(`Server running on ${PORT}`)); 