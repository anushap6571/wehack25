const axios = require('axios');
require('dotenv').config();

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

/**
 * Generates a background image URL from Unsplash based on the company info.
 * @param {string} name - Company name
 * @param {string} industry - Industry the company belongs to
 * @param {string} sector - Sector the company belongs to
 * @returns {Promise<string|null>} - Image URL or null if not found
 */
async function generateCompanyImage(name, industry, sector) {
  if (!name || !industry || !sector) {
    throw new Error('Missing required fields: name, industry, sector');
  }

  const query = `${name} ${industry} ${sector}`;

  const response = await axios.get('https://api.unsplash.com/photos/random', {
    params: {
      query,
      orientation: 'landscape',
      content_filter: 'high'
    },
    headers: {
      Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`
    }
  });

  const imageUrl = response.data?.urls?.regular || null;
  return imageUrl;
}

module.exports = {
  generateCompanyImage
};
