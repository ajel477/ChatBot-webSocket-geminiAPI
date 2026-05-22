const express = require('express');
const authMiddleware = require('../middlewares/auth.middleware');
const chatController = require('../controllers/chatController');

const router = express.Router();

// Create a new chat
router.post("/", authMiddleware.authUser, chatController.createChat);

// Get all chats for the logged-in user
router.get("/", authMiddleware.authUser, chatController.getUserChats);

// Get a specific chat by ID
router.get("/:chatId", authMiddleware.authUser, chatController.getChatById);

// Get all messages for a specific chat
router.get("/:chatId/messages", authMiddleware.authUser, chatController.getChatMessages);

// Rename a chat
router.patch("/:chatId", authMiddleware.authUser, chatController.renameChat);

// Delete a chat and its messages
router.delete("/:chatId", authMiddleware.authUser, chatController.deleteChat);

module.exports = router;