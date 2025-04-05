const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const chatbot = require('./chatbot');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Chatbot endpoint to handle general finance-related questions
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body; // Extract the message from the request body
        if (!message) {
            return res.status(400).json({ error: 'Message is required' }); // Return an error if no message is provided
        }
        
        // Get the response from the chatbot
        const response = await chatbot.getResponse(message); // Call the chatbot's getResponse method
        res.json({ response }); // Return the response as JSON
    } catch (error) {
        console.error('Chat error:', error);
        res.status(500).json({ error: 'Internal server error' }); // Return an error if something goes wrong
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});