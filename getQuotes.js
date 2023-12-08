require('dotenv').config()
const qs = require('querystring');
const axios = require('axios');

const resource = 'ADD_YOUR_RESOURCE';
const quotesEndpoint = `${resource}api/data/v9.2/quotes`;
const tokenEndpoint = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/token`;
const accessToken = process.env.ACCESS_TOKEN;

const requestBody = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  grant_type: 'client_credentials',
  resource: resource 
};

const getQuotes = async () => {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: quotesEndpoint,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      };
  
      const response = await axios.request(config);
  
      //no values in quotes
  
      return response.data.value;
    } catch (error) {
      console.error('Error fetching contacts:', error.message);
    }
  };
  
getQuotes();