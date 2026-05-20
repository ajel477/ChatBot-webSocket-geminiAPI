const chatModel = require('../models/chat.model');

async function createChat(req, res) {
    const { title, } = req.body;
    const user = req.user;

    const chat = await chatModel.create({
        user: user._id,
        title
    });

     res.status(201).json({
        message: "Chat created successfully",
        chat: {
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            user: chat.user
        }
    });
}

// Get all chats for the logged-in user
async function getUserChats(req, res) {
    const userId = req.user._id;

    const chats = await chatModel.find({ user: userId }).sort({ lastActivity: -1 });

    res.status(200).json({
        message: "Chats retrieved successfully",
        chats: chats.map(chat => ({
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            createdAt: chat.createdAt
        }))
    });
}

// Get a specific chat by ID
async function getChatById(req, res) {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await chatModel.findOne({ _id: chatId, user: userId });

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        });
    }

    res.status(200).json({
        message: "Chat retrieved successfully",
        chat: {
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            createdAt: chat.createdAt
        }
    });
}

module.exports = { createChat, getUserChats, getChatById };