const axios = require('axios');

const suggestLocation = async (req, res, next) => {
  try {
    const { country, state, area } = req.query;
    
    // Build query string for Nominatim (from most specific to least specific)
    let queryParts = [];
    if (area) queryParts.push(area);
    if (state) queryParts.push(state);
    if (country) queryParts.push(country);
    
    const query = queryParts.join(', ');
    
    if (!query) {
      return res.status(400).json({ error: 'Please provide at least a country' });
    }

    const response = await axios.get(`https://nominatim.openstreetmap.org/search`, {
      params: {
        q: query,
        format: 'json',
        addressdetails: 1,
        limit: 5
      },
      headers: {
        // Nominatim requires a valid User-Agent
        'User-Agent': 'TraveloopAI/1.0 (hackathon-demo)'
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Location Suggest Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch location suggestions' });
  }
};

const reverseGeocode = async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'Missing coordinates' });

    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
      params: {
        lat,
        lon,
        format: 'json',
        addressdetails: 1
      },
      headers: {
        'User-Agent': 'TraveloopAI/1.0 (hackathon-demo)'
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Reverse Geocode Error:', error.message);
    res.status(500).json({ error: 'Failed to reverse geocode' });
  }
}

module.exports = { suggestLocation, reverseGeocode };
