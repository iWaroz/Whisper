const socketio = require('socket.io');
const http = require('http');

const { formatMessage } = require('./utils/messages');
const { userJoin } = require('./utils/users');

module.exports = (app) => {
    let sock;
    const server = http.createServer(app);
    const io = socketio(server);
    io.on('connection', socket => {
        sock = socket;
        socket.on('joinRoom', ({ username, room }) => {
            const user = userJoin(socket.id, username, room);
    
            socket.join(room);
    
            socket.emit('botmessage', {
                'username': process.env.BOT_NAME || 'Whisper',
                "text": "Welcome to this chat room. If any messages were sent prior to this, you do not have access to them."
            });
    
            socket.on('updateIgn', (ign) => {
                user.username = ign.ign;
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
