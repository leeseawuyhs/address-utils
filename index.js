const axios = require('axios');

const API_KEY = 'YOUR_GOOGLE_API_KEY'; // Replace with your Google API key

/**
 * Validate an address using Google Maps API.
 * @param {string} address - The address to validate.
 * @returns {Promise<Object>} - The validation result.
 */
async function validateAddress(address) {
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
                address,
                key: API_KEY
            }
        });
        if (response.data.status === 'OK') {
            return response.data.results[0];
        } else {
            throw new Error(`Geocoding error: ${response.data.status}`);
        }
    } catch (error) {
        throw new Error(`Error validating address: ${error.message}`);
    }
}

/**
 * Find address information from a city or state.
 * @param {string} location - The city or state to find information for.
 * @returns {Promise<Object>} - The address information.
 */
async function findAddressInfo(location) {
    try {
        const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
            params: {
                address: location,
                key: API_KEY
            }
        });
        if (response.data.status === 'OK') {
            const result = response.data.results[0];
            const { city, state, country } = parseAddressComponents(result.address_components);
            return { city, state, country };
        } else {
            throw new Error(`Geocoding error: ${response.data.status}`);
        }
    } catch (error) {
        throw new Error(`Error finding address info: ${error.message}`);
    }
}

/**
 * Parse address components from Google Maps API response.
 * @param {Array} components - The address components.
 * @returns {Object} - The parsed components.
 */
function parseAddressComponents(components) {
    const address = {};
    for (const component of components) {
        if (component.types.includes('locality')) {
            address.city = component.long_name;
        } else if (component.types.includes('administrative_area_level_1')) {
            address.state = component.short_name;
        } else if (component.types.includes('country')) {
            address.country = component.long_name;
        }
    }
    return address;
}

module.exports = {
    validateAddress,
    findAddressInfo
};
