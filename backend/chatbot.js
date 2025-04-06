const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

class FinanceChatbot {
    constructor() {
        this.anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY
        });
        this.userPreferences = {};
        this.availableModels = [
            "claude-3-sonnet-20240229-v1",
            "claude-3-opus-20240229",
            "claude-3-haiku-20240307"
        ];
        this.currentModelIndex = 0;
        this.financialTerms = {
            // Basic Investment Terms
            'stock': 'A stock represents ownership in a company. When you buy a stock, you become a shareholder and own a piece of that company.',
            'dividend': 'A dividend is a payment made by a company to its shareholders, usually from its profits. It\'s like a reward for owning the stock.',
            'portfolio': 'A portfolio is a collection of investments owned by an individual or organization.',
            'risk': 'In investing, risk refers to the possibility of losing money on an investment. Different investments carry different levels of risk.',
            'diversification': 'Diversification means spreading your investments across different types of assets to reduce risk.',
            'market cap': 'Market capitalization is the total value of a company\'s shares. It\'s calculated by multiplying the stock price by the number of shares.',
            'PE ratio': 'Price-to-Earnings ratio measures a stock\'s price relative to its earnings per share. It helps determine if a stock is over or undervalued.',
            'ETF': 'Exchange-Traded Fund - a type of investment fund that tracks an index, sector, or other assets and can be traded like a stock.',
            'volatility': 'Volatility measures how much a stock\'s price moves up and down. Higher volatility means higher risk but potentially higher returns.',
            'blue chip': 'Blue chip stocks are shares in large, well-established companies with a history of stable earnings and dividends.',
            
            // Advanced Investment Terms
            'beta': 'Beta measures a stock\'s volatility compared to the overall market. A beta of 1 means the stock moves with the market, while a beta greater than 1 means it\'s more volatile.',
            'ROI': 'Return on Investment - a measure of how much money you make relative to how much you invest. Calculated as (Gain from Investment - Cost of Investment) / Cost of Investment.',
            'margin': 'Margin trading allows you to borrow money from a broker to buy stocks. While it can increase potential gains, it also increases potential losses.',
            'short selling': 'Short selling is when you borrow shares to sell them, hoping to buy them back later at a lower price. It\'s a way to profit from falling stock prices.',
            'options': 'Options are contracts that give you the right to buy or sell a stock at a specific price by a certain date. They can be used for hedging or speculation.',
            'mutual fund': 'A mutual fund pools money from many investors to buy a diversified portfolio of stocks, bonds, or other securities.',
            'index fund': 'An index fund is a type of mutual fund or ETF that tracks a specific market index, like the S&P 500.',
            'bull market': 'A bull market is when stock prices are rising, typically by 20% or more from recent lows.',
            'bear market': 'A bear market is when stock prices are falling, typically by 20% or more from recent highs.',
            
            // Risk Management Terms
            'asset allocation': 'Asset allocation is how you divide your investments among different asset classes like stocks, bonds, and cash.',
            'rebalancing': 'Rebalancing is adjusting your portfolio back to your target asset allocation by buying or selling investments.',
            'stop loss': 'A stop-loss order automatically sells a stock when it reaches a certain price, helping to limit potential losses.',
            'hedging': 'Hedging is using investments to reduce the risk of adverse price movements in another investment.',
            
            // Market Analysis Terms
            'technical analysis': 'Technical analysis uses historical price and volume data to predict future price movements.',
            'fundamental analysis': 'Fundamental analysis evaluates a company\'s financial health and performance to determine its value.',
            'market order': 'A market order buys or sells a stock immediately at the current market price.',
            'limit order': 'A limit order buys or sells a stock only at a specific price or better.',
            
            // Company Financial Terms
            'earnings per share': 'EPS is a company\'s profit divided by its number of shares. It shows how much money a company makes per share.',
            'dividend yield': 'Dividend yield is the annual dividend payment divided by the stock price, showing the return on investment from dividends.',
            'book value': 'Book value is a company\'s total assets minus its liabilities, showing what the company would be worth if it were liquidated.',
            'cash flow': 'Cash flow is the money moving in and out of a business. Positive cash flow means more money is coming in than going out.',
            
            // Investment Strategy Terms
            'dollar cost averaging': 'Dollar cost averaging is investing a fixed amount of money at regular intervals, regardless of the stock price.',
            'value investing': 'Value investing is buying stocks that appear to be trading for less than their intrinsic value.',
            'growth investing': 'Growth investing focuses on companies expected to grow at an above-average rate compared to the market.',
            'income investing': 'Income investing focuses on generating regular income through dividends or interest payments.',
            
            // Economic Terms
            'inflation': 'Inflation is the rate at which prices for goods and services rise, reducing the purchasing power of money.',
            'interest rate': 'Interest rate is the cost of borrowing money or the return on lending money.',
            'recession': 'A recession is a significant decline in economic activity lasting more than a few months.',
            'GDP': 'Gross Domestic Product - the total value of goods and services produced in a country.',
            
            // Personal Finance Terms
            'emergency fund': 'An emergency fund is money set aside for unexpected expenses or financial emergencies.',
            'retirement account': 'A retirement account is a special investment account with tax advantages for saving for retirement.',
            'compound interest': 'Compound interest is interest earned on both the initial principal and the accumulated interest from previous periods.',
            'net worth': 'Net worth is the total value of your assets minus your liabilities.'
        };
        this.isHealthy = false;
        this.rateLimit = {
            requests: 0,
            lastReset: Date.now(),
            maxRequests: 50, // Adjust based on your API limits
            resetInterval: 60000 // 1 minute
        };
    }

    async checkHealth() {
        try {
            console.log('Checking API health...');
            const response = await this.anthropic.messages.create({
                model: this.availableModels[0],
                max_tokens: 5,
                system: "You are a test assistant.",
                messages: [
                    {
                        role: "user",
                        content: "Hello"
                    }
                ]
            });
            this.isHealthy = true;
            console.log('API is healthy');
            return true;
        } catch (error) {
            console.error('API health check failed:', error.message);
            this.isHealthy = false;
            return false;
        }
    }

    async checkRateLimit() {
        const now = Date.now();
        if (now - this.rateLimit.lastReset > this.rateLimit.resetInterval) {
            this.rateLimit.requests = 0;
            this.rateLimit.lastReset = now;
        }
        return this.rateLimit.requests < this.rateLimit.maxRequests;
    }

    async makeAPICall(params, maxRetries = 3) {
        let lastError = null;
        for (let i = 0; i < maxRetries; i++) {
            try {
                if (!await this.checkRateLimit()) {
                    throw new Error('Rate limit exceeded');
                }

                const response = await this.anthropic.messages.create(params);
                this.rateLimit.requests++;
                return response;
            } catch (error) {
                lastError = error;
                if (error.message.includes('rate_limit')) {
                    // Wait before retrying
                    await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                    continue;
                }
                throw error;
            }
        }
        throw lastError;
    }

    async processMessage(message) {
        if (!this.isHealthy) {
            console.log('API not healthy, attempting recovery...');
            const recovered = await this.checkHealth();
            if (!recovered) {
                return "I apologize, but our service is currently unavailable. Please try again later.";
            }
        }

        try {
            console.log('Processing message:', message);
            console.log('API Key exists:', !!process.env.ANTHROPIC_API_KEY);

            const term = this.checkForFinancialTerm(message);
            if (term) {
                console.log('Found term in dictionary:', term);
                return this.financialTerms[term];
            }

            this.updateUserPreferences(message);
            console.log('Updated user preferences:', this.userPreferences);

            const systemPrompt = `You are a financial advisor chatbot specializing in stock investments and financial education. 
            Your role is to:
            1. Help users understand basic financial concepts and terms
            2. Provide personalized stock recommendations based on user interests and risk tolerance
            3. Explain investment risks in clear, understandable terms
            4. Guide users in making informed financial decisions
            
            Current user preferences: ${JSON.stringify(this.userPreferences)}
            
            Always:
            - Use simple, clear language
            - Provide real-world examples
            - Explain risks and potential rewards
            - Suggest diversified investment strategies
            - Encourage responsible investing practices`;

            let lastError = null;
            for (let i = 0; i < this.availableModels.length; i++) {
                try {
                    console.log(`Trying model: ${this.availableModels[i]}`);
                    const response = await this.makeAPICall({
                        model: this.availableModels[i],
                        max_tokens: 1000,
                        system: systemPrompt,
                        messages: [
                            {
                                role: "user",
                                content: message
                            }
                        ]
                    });

                    console.log('Received response from API');
                    this.currentModelIndex = i;
                    return response.content[0].text;
                } catch (error) {
                    console.error(`Failed with model ${this.availableModels[i]}:`, error.message);
                    lastError = error;
                }
            }

            throw lastError;

        } catch (error) {
            console.error('Detailed error:', {
                message: error.message,
                code: error.code,
                type: error.type,
                stack: error.stack
            });

            if (error.message.includes('rate_limit')) {
                return "I apologize, but we're currently experiencing high demand. Please try again in a few moments.";
            } else if (error.type === 'not_found_error') {
                return "I apologize, but there seems to be an issue with the AI model. Please try again later.";
            } else if (error.type === 'authentication_error') {
                return "I apologize, but there's an authentication issue. Please contact support.";
            } else {
                return "I apologize, but I'm having trouble processing your request at the moment. Please try again later.";
            }
        }
    }

    checkForFinancialTerm(message) {
        const lowerMessage = message.toLowerCase();
        for (const term of Object.keys(this.financialTerms)) {
            if (lowerMessage.includes(`what is ${term}`) || 
                lowerMessage.includes(`define ${term}`) || 
                lowerMessage.includes(`explain ${term}`)) {
                return term;
            }
        }
        return null;
    }

    updateUserPreferences(message) {
        const lowerMessage = message.toLowerCase();
        
        // Detect interest in specific sectors
        const sectors = ['technology', 'healthcare', 'finance', 'energy', 'consumer', 'real estate'];
        for (const sector of sectors) {
            if (lowerMessage.includes(sector)) {
                this.userPreferences.sector = sector;
            }
        }

        // Detect risk tolerance
        if (lowerMessage.includes('safe') || lowerMessage.includes('conservative')) {
            this.userPreferences.riskTolerance = 'low';
        } else if (lowerMessage.includes('moderate') || lowerMessage.includes('balanced')) {
            this.userPreferences.riskTolerance = 'medium';
        } else if (lowerMessage.includes('aggressive') || lowerMessage.includes('high risk')) {
            this.userPreferences.riskTolerance = 'high';
        }

        // Detect investment goals
        if (lowerMessage.includes('growth') || lowerMessage.includes('capital appreciation')) {
            this.userPreferences.goal = 'growth';
        } else if (lowerMessage.includes('income') || lowerMessage.includes('dividend')) {
            this.userPreferences.goal = 'income';
        } else if (lowerMessage.includes('balanced') || lowerMessage.includes('both')) {
            this.userPreferences.goal = 'balanced';
        }
    }

    calculateSimpleInterest(principal, rate, time) {
        return (principal * rate * time) / 100;
    }

    calculateCompoundInterest(principal, rate, time, frequency = 1) {
        return principal * Math.pow((1 + rate / (100 * frequency)), frequency * time) - principal;
    }

    assessRiskProfile(answers) {
        let riskScore = 0;
        
        if (answers.age < 30) riskScore += 2;
        else if (answers.age < 50) riskScore += 1;
        
        if (answers.investmentHorizon > 10) riskScore += 2;
        else if (answers.investmentHorizon > 5) riskScore += 1;
        
        if (answers.riskTolerance === 'high') riskScore += 3;
        else if (answers.riskTolerance === 'medium') riskScore += 2;
        else riskScore += 1;

        return {
            score: riskScore,
            level: riskScore >= 5 ? 'High' : riskScore >= 3 ? 'Medium' : 'Low',
            recommendations: this.getRiskBasedRecommendations(riskScore)
        };
    }

    getRiskBasedRecommendations(riskScore) {
        const recommendations = {
            low: [
                'Blue-chip stocks',
                'Dividend-paying stocks',
                'Index funds',
                'Government bonds',
                'High-quality corporate bonds'
            ],
            medium: [
                'Growth stocks',
                'Sector ETFs',
                'Real estate investment trusts (REITs)',
                'Balanced mutual funds',
                'Corporate bonds'
            ],
            high: [
                'Small-cap stocks',
                'Technology stocks',
                'Emerging market investments',
                'Cryptocurrencies',
                'High-yield bonds'
            ]
        };

        return riskScore >= 5 ? recommendations.high : 
               riskScore >= 3 ? recommendations.medium : 
               recommendations.low;
    }
}

module.exports = new FinanceChatbot(); 