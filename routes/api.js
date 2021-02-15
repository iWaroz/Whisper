const express = require('express');
const { formatMessage } = require('../utils/messages');
const { validateQuery, apiKey } = require('../utils/middleware');
const router = express.Router();


module.exports = (socket) => {

    router.get('/rooms', apiKey('list_rooms'), (req, res) => {
        const data = {};
        for (let [name, clients] of socket.rooms().entries()) data[name] = clients.size;
        res.json(data);
    })

    router.post('/rooms/:id/messages', [validateQuery('username', 'content'), apiKey('send_messages')], (req, res) => {
        const payload = formatMessage(req.payload.username, req.payload.content);
        socket.send(req.params.id, payload);
        res.status(201).json(payload);
    })

    router.post('/broadcast', [validateQuery('username', 'content'), apiKey('broadcast_messages')], (req, res) => {
        const payload = formatMessage(req.payload.username, req.payload.content);
        socket.broadcast(payload);
        res.status(201).json(payload);
    })

    router.get('/basicstats', (req, res) => {
        const data = {
            rooms: 0,
            users: 0,
        };
        for (let [,clients] of socket.rooms().entries()) {
            data.rooms++;
            data.users += clients.size;
        }
        res.json(data);
    })

    return router;
}