const Anthropic = require('@anthropic-ai/sdk');
const Conversation = require('../models/Conversation');
require('dotenv').config(); // Load the API key from the .env file

class FinanceChatbot {
    constructor() {
        this.anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY
        });
        this.model = "claude-3-7-sonnet-20250219"; // Use a single model for simplicity
    }

    // Function to get the response based on a user's input message
    async getResponse(message, userId) {
        try {
            // Get or create conversation for the user
            let conversation = await Conversation.findOne({ userId });
            
            if (!conversation) {
                conversation = new Conversation({ userId, messages: [] });
            }

            // Add user message to conversation
            conversation.messages.push({
                role: 'user',
                content: message
            });

            // Get the last 10 messages for context
            const recentMessages = conversation.messages.slice(-10).map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            // Make the API call to get a response from the model
            const response = await this.anthropic.messages.create({
                model: this.model,
                max_tokens: 150,
                system: "You are a concise financial assistant providing short and clear answers to general finance questions. Your answers should only be one to two sentences.",
                messages: recentMessages
            });

            const assistantResponse = response.content[0].text.trim();

            // Add assistant response to conversation
            conversation.messages.push({
                role: 'assistant',
                content: assistantResponse
            });

            // Save the updated conversation
            await conversation.save();

            return {
                response: assistantResponse,
                conversationId: conversation._id
            };

        } catch (error) {
            console.error('Error during API call:', error.message);
            return {
                response: "Sorry, I couldn't process your request. Please try again later.",
                error: error.message
            };
        }
    }

    async getConversationHistory(userId) {
        try {
            const conversation = await Conversation.findOne({ userId })
                .select('messages')
                .sort({ 'messages.timestamp': -1 });

            if (!conversation) {
                return { messages: [] };
            }

            return { messages: conversation.messages };
        } catch (error) {
            console.error('Error getting conversation history:', error);
            throw error;
        }
    }

    async clearConversation(userId) {
        try {
            await Conversation.findOneAndDelete({ userId });
            return { success: true };
        } catch (error) {
            console.error('Error clearing conversation:', error);
            throw error;
        }
    }
}

module.exports = new FinanceChatbot();
