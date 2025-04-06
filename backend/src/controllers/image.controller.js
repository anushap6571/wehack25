const axios = require('axios');
require('dotenv').config();

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

async function getCompanyImage(req, res) {
  try {
    const { name, industry, sector } = req.body;

    if (!name || !industry || !sector) {
      return res.status(400).json({ error: 'Missing required fields: name, industry, sector' });
    }

    // Build the search query
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

    if (!imageUrl) {
      return res.status(404).json({ error: 'No image found' });
    }

    return res.status(200).json({ imageUrl });

  } catch (error) {
    console.error('Unsplash API error:', error.message);
    return res.status(500).json({ error: 'Failed to fetch image from Unsplash' });
  }
}

module.exports = {
  getCompanyImage
};
