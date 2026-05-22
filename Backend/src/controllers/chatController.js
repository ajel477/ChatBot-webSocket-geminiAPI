const chatModel = require('../models/chat.model');
const messageModel = require('../models/message.model');
const {
    deleteMemory
} = require("../services/vector.service");

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

// Get all messages for a specific chat
async function getChatMessages(req, res) {
    const { chatId } = req.params;
    const userId = req.user._id;

    // Verify chat belongs to user
    const chat = await chatModel.findOne({ _id: chatId, user: userId });

    if (!chat) {
        return res.status(404).json({
            message: "Chat not found"
        });
    }

    // Get all messages for this chat, sorted by creation time (oldest first)
    const messages = await messageModel
        .find({ chat: chatId })
        .sort({ createdAt: 1 })
        .lean();

    res.status(200).json({
        message: "Chat messages retrieved successfully",
        messages: messages.map(msg => ({
            _id: msg._id,
            role: msg.role,
            content: msg.content,
            createdAt: msg.createdAt
        }))
    });
}

// Rename a chat (update title)
async function renameChat(req, res) {
    const { chatId } = req.params;
    const { title } = req.body;
    const userId = req.user._id;

    if (!title || !title.trim()) {
        return res.status(400).json({ message: "Title is required" });
    }

    const chat = await chatModel.findOneAndUpdate(
        { _id: chatId, user: userId },
        { title },
        { new: true }
    );

    if (!chat) {
        return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({
        message: "Chat renamed successfully",
        chat: {
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            createdAt: chat.createdAt
        }
    });
}

// Delete a chat and all associated messages
async function deleteChat(req, res) {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;

        // Find chat ownership
        const chat = await chatModel.findOne({
            _id: chatId,
            user: userId
        });

        if (!chat) {
            return res.status(404).json({
                message: "Chat not found"
            });
        }

        // Get all messages first
        const messages = await messageModel.find({
            chat: chatId
        });

        // Extract message IDs
        const messageIds = messages.map(msg =>
            msg._id.toString()
        );

        console.log("🗑️ Deleting chat:", chatId, "with", messageIds.length, "messages");

        // Delete vectors from Pinecone
        if (messageIds.length > 0) {
            await deleteMemory(messageIds);
        }

        // Delete messages
        await messageModel.deleteMany({
            chat: chatId
        });

        // Delete chat
        await chatModel.findByIdAndDelete(chatId);

        res.status(200).json({
            message: "Chat deleted successfully",
            deletedVectors: messageIds.length
        });
    } catch (error) {
        console.error("❌ Error in deleteChat:", error.message);
        res.status(500).json({
            message: "Failed to delete chat",
            error: error.message
        });
    }
}

module.exports = { createChat, getUserChats, getChatById, getChatMessages, renameChat, deleteChat };