const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config(); // Load the API key from the .env file

class FinanceChatbot {
    constructor() {
        this.anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY
        });
        this.model = "claude-3-7-sonnet-20250219"; // Use a single model for simplicity
    }

    // Function to get the response based on a user’s input message
    async getResponse(message) {
        // Ask the model to provide a response for any general finance-related question
        return this.askModel(message);
    }

    // Function to ask the model for a general finance-related answer
    async askModel(message) {
        try {
            // Make the API call to get a response from the model
            const response = await this.anthropic.messages.create({
                model: this.model,
                max_tokens: 150,
                system: "You are a concise financial assistant providing short and clear answers to general finance questions. Your answers should only be one to two sentences.",
                messages: [{ role: "user", content: message }]
            });

            return response.content[0].text.trim(); // Return the model's response

        } catch (error) {
            console.error('Error during API call:', error.message);
            return "Sorry, I couldn't process your request. Please try again later."; // Return fallback message if error occurs
        }
    }
}

module.exports = new FinanceChatbot();
