const express  = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth.routes');
const chatRoutes = require('./routes/chat.routes');
const path = require('path');

const app = express(); //Server Instance

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({
    origin: CLIENT_URL,
    credentials: true
}));

//middelewares
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../public')));


app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);


app.get('*name', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

module.exports = app;