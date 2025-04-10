const express = require('express');
const router = express.Router();
const chatbot = require('../controllers/chatbot');
const auth = require('../middleware/auth');

// Apply auth middleware to all routes
router.use(auth);

// Send a message and get response
router.post('/', async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.user.userId;
        console.log(userId);

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        const response = await chatbot.getResponse(message, userId);
        console.log(response);
        res.json(response);
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get conversation history
router.get('/history', async (req, res) => {
    try {
        const userId = req.user.userId;
        const history = await chatbot.getConversationHistory(userId);
        res.json(history);
    } catch (error) {
        console.error('Error getting conversation history:', error);
        res.status(500).json({ error: 'Failed to get conversation history' });
    }
});

// Clear conversation history
router.delete('/history', async (req, res) => {
    try {
        const userId = req.user.userId;
        await chatbot.clearConversation(userId);
        res.json({ success: true });
    } catch (error) {
        console.error('Error clearing conversation history:', error);
        res.status(500).json({ error: 'Failed to clear conversation history' });
    }
});

module.exports = router; 