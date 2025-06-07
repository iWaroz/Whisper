import dotenv from 'dotenv';
import path from 'path';
import express from 'express';
import websocket from './websocket';
import staticRouter from './routes/static';
import handlerRouter from './routes/handlers';
import contactRouter from './routes/contact';
dotenv.config();

const app = express();
const socket = websocket(app);

app.use(express.json());

// routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', staticRouter);
app.use('/', handlerRouter);
app.use('/', contactRouter);

const PORT = process.env.PORT || 3000;
socket.listen(PORT, () => console.log(`Server running on ${PORT}`));
