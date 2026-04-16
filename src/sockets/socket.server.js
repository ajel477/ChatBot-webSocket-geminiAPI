const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

function initSocketServer(httpServer) {

    const io = new Server(httpServer, {});

//socket.io auth middlware
    io.use(async(socket, next) => {

        const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

        if(!cookies.token) {
           return next(new Error("Authentication error: No token provided"));
        }

        try {

            const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);
            const user = await userModel.findById(decoded.id);
            socket.user = user;
            next();

        }catch (error) {
            console.log("JWT ERROR:", error.message);
            next(new Error("Authentication error: Invalid token"));
        }

});

  io.on("connection", (socket) => {
    console.log("User connected: " + socket.user);
        console.log("New socket connection: " + socket.id);
    });
}

module.exports = initSocketServer;