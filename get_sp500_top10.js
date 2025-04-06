const yahooFinance = require('yahoo-finance2').default;

async function getTop10SP500() {
    try {
        // Get S&P 500 components directly from Yahoo Finance
        const sp500 = await yahooFinance.sp500();
        
        // Get market caps for all companies
        const companies = [];
        
        // Process in batches to avoid rate limiting
        const batchSize = 50;
        for (let i = 0; i < sp500.length; i += batchSize) {
            const batch = sp500.slice(i, i + batchSize);
            const symbols = batch.map(company => company.symbol);
            
            try {
                const quotes = await yahooFinance.quote(symbols);
                quotes.forEach((quote, index) => {
                    if (quote && quote.marketCap) {
                        companies.push({
                            symbol: batch[index].symbol,
                            name: batch[index].name,
                            marketCap: quote.marketCap
                        });
                    }
                });
            } catch (error) {
                console.error(`Error processing batch ${i/batchSize + 1}:`, error.message);
            }
            
            // Add a small delay between batches to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        // Sort by market cap and get top 10
        const top10 = companies
            .sort((a, b) => b.marketCap - a.marketCap)
            .slice(0, 10);

        // Format the output
        console.log('\nTop 10 Companies in S&P 500 by Market Cap:');
        console.log('----------------------------------------');
        top10.forEach((company, index) => {
            const marketCapB = (company.marketCap / 1e9).toFixed(2);
            console.log(`${index + 1}. ${company.symbol} - ${company.name} ($${marketCapB}B)`);
        });

    } catch (error) {
        console.error('Error:', error.message);
    }
}

getTop10SP500(); 