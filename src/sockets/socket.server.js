const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const messageModel = require("../models/message.model");
const aiService = require("../services/ai.service");
const { createMemory, queryMemory } = require('../services/vector.service.js');

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
            // Parse payload if it's a string
            const payload = typeof messagePayload === 'string' ? JSON.parse(messagePayload) : messagePayload;
            
            console.log("Parsed payload:", payload);

            // Run MongoDB save and vector generation in parallel
            const [savedMessage, userVector] = await Promise.all([
                messageModel.create({
                    user: socket.user._id,
                    chat: payload.chat,
                    content: payload.content,
                    role: "user"
                }),
                aiService.generateVector(payload.content)
            ]);

            console.log("USER VECTOR LENGTH:", userVector.length);
            
            await createMemory({
               vectors: userVector,
               metadata: {
               content: payload.content,
               user: socket.user._id.toString(),
               chat: payload.chat,
               role: "user"
    },
    messageId: new Date().toISOString()
});

           // Option 2: Get memories from ALL CHATS of the same user (Cross-chat memory)
           const memories = await queryMemory({
           queryVector: userVector,
           limit: 10,
           metadata: {
               user: socket.user._id.toString()
           }
           });

console.log("Retrieved memories count:", memories?.length || 0);

const memoryContext = memories && memories.length > 0
    ? memories
        .map(memory => memory.metadata?.content)
        .filter(Boolean)
        .join("\n")
    : "";



const recentMessages = await messageModel
    .find({ chat: payload.chat })
    .sort({ createdAt: -1 })
    .limit(5);

const shortTermContext = recentMessages
    .reverse()
    .map(msg => `${msg.role}: ${msg.content}`)
    .join("\n");

            const response = await aiService.generateResponse(
    payload.content,
    memoryContext,
    shortTermContext
);

            // Emit response to client immediately
            socket.emit("ai-response", { 
                content: response,
                chat: payload.chat
            });

            // Save AI response to DB and generate vector in the BACKGROUND (don't wait)
            Promise.all([
                messageModel.create({
                    user: socket.user._id,
                    chat: payload.chat,
                    content: response,
                    role: "model"
                }),
                aiService.generateVector(response)
            ]).then(async ([responseMessage, responseVector]) => {
                // Store vector in Pinecone after DB save is complete
                await createMemory({
                    vectors: responseVector,
                    metadata: {
                        content: response,
                        user: socket.user._id.toString(),
                        chat: payload.chat,
                        role: "model"
                    },
                    messageId: responseMessage._id.toString()
                });
                console.log("Response saved to DB and vector stored in Pinecone");
            }).catch(error => {
                console.error("Error saving response in background:", error.message);
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