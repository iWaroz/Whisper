require('dotenv').config();
const path = require('path');
const express = require('express');

const websocket = require('./websocket');

const app = express();
const socket = websocket(app);

// routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/static'));
app.use('/', require('./routes/handlers'));

const PORT = process.env.PORT || 3000;
socket.server.listen(PORT, () => console.log(`Server running on ${PORT}`)); 