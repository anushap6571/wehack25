// Service to map user interests to stock sectors and industries
class InterestMapperService {
    // Map of interests to sectors
    static interestToSectors = {
        'technology': ['Technology', 'Communication Services'],
        'healthcare': ['Healthcare', 'Biotechnology'],
        'finance': ['Financial Services', 'Banks', 'Insurance'],
        'energy': ['Energy', 'Utilities'],
        'consumer': ['Consumer Staples', 'Consumer Cyclical'],
        'industrial': ['Industrials', 'Manufacturing'],
        'real estate': ['Real Estate', 'REITs'],
        'materials': ['Materials', 'Mining'],
        'food': ['Consumer Staples'],
        'clothes': ['Consumer Cyclical'],
        'travel': ['Industrials'],
        'sports': ['Consumer Cyclical', 'Communication Services']
    };

    // Map of interests to industries
    static interestToIndustries = {
        'technology': ['Software', 'Semiconductors', 'Internet', 'Hardware', 'Cloud Computing', 'AI', 'Robotics'],
        'healthcare': ['Pharmaceuticals', 'Medical Devices', 'Healthcare Services', 'Biotech', 'Hospitals'],
        'finance': ['Banks', 'Investment Banking', 'Insurance', 'Asset Management', 'FinTech'],
        'energy': ['Oil & Gas', 'Renewable Energy', 'Utilities', 'Power Generation'],
        'consumer': ['Retail', 'Food & Beverage', 'Consumer Products', 'E-commerce'],
        'industrial': ['Manufacturing', 'Aerospace', 'Defense', 'Construction', 'Transportation'],
        'real estate': ['Real Estate', 'Property Management', 'REITs', 'Commercial Real Estate'],
        'materials': ['Mining', 'Chemicals', 'Construction Materials', 'Metals'],
        'food': ['Restaurants', 'Food Processing', 'Beverages', 'Agriculture'],
        'clothes': ['Apparel', 'Fashion', 'Retail', 'Textiles'],
        'travel': ['Airlines', 'Hotels', 'Tourism', 'Cruise Lines'],
        'sports': ['Entertainment', 'Media', 'Sports Equipment', 'Gaming']
    };

    // Map user interests to sectors
    static mapInterestsToSectors(interests) {
        if (!interests || !Array.isArray(interests)) {
            console.log('No interests provided or interests is not an array');
            return [];
        }
        
        const sectors = new Set();
        
        interests.forEach(interest => {
            const interestLower = interest.toLowerCase();
            const mappedSectors = this.interestToSectors[interestLower] || [];
            mappedSectors.forEach(sector => sectors.add(sector));
        });
        
        return Array.from(sectors);
    }

    // Map user interests to industries
    static mapInterestsToIndustries(interests) {
        if (!interests || !Array.isArray(interests)) {
            console.log('No interests provided or interests is not an array');
            return [];
        }
        
        const industries = new Set();
        
        interests.forEach(interest => {
            const interestLower = interest.toLowerCase();
            const mappedIndustries = this.interestToIndustries[interestLower] || [];
            mappedIndustries.forEach(industry => industries.add(industry));
        });
        
        return Array.from(industries);
    }
}

module.exports = InterestMapperService; 