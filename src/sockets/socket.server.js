const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const aiService = require("../services/ai.service");

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

    console.log(socket.user);
    
    socket.on("ai-message", async (messagePayload) => {
        
        try {
            console.log(messagePayload);
            const response = await aiService.generateResponse(messagePayload.content);

            socket.emit("ai-response", { 
                content: response,
                chat: messagePayload.chat
            });
        } catch (error) {
            console.error("AI Service Error:", error.message);
            socket.emit("ai-error", {
                message: "Failed to generate response",
                error: error.message,
                chat: messagePayload.chat
            });
        }

    })
})

}

module.exports = initSocketServer;