require('dotenv').config();
const path = require('path');
const express = require('express');

const websocket = require('./websocket');

const app = express();
const socket = websocket(app);

app.use(express.json());

// routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/static'));
app.use('/', require('./routes/handlers'));
app.use('/api', require('./routes/api')(socket));
app.use('/', require('./routes/contact'));

const PORT = process.env.PORT || 3000;
socket.server.listen(PORT, () => console.log(`Server running on ${PORT}`)); 