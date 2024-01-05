require('dotenv').config()
const qs = require('querystring');
const axios = require('axios');

const resource = 'https://orgdc8d1d06.crm4.dynamics.com/';
const contactsEndpoint = `${resource}api/data/v9.2/contacts`;
const accountsEndpoint = `${resource}api/data/v9.2/accounts`;
const tokenEndpoint = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/token`;
const accessToken = process.env.ACCESS_TOKEN;

const requestBody = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  grant_type: 'client_credentials',
  resource: resource 
};

const getAccounts = async () => {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: contactsEndpoint,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      };
  
      const response = await axios.request(config);
  
      response.data.value.forEach(account => {
        console.log('Account ID', account.accountid)
        console.log('Account Name:', account.name);
        console.log('Telephone:', account.telephone1);
        console.log('Website:', account.websiteurl);
        console.log('Description:', account.description);
        console.log('--------------------');
      });
  
      return response.data.value;
    } catch (error) {
      console.error('Error fetching accounts:', error.message);
    }
  };

getAccounts();