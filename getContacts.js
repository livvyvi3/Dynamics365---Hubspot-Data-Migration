
require('dotenv').config()
const qs = require('querystring');
const axios = require('axios');

const resource = 'https://orgbc2d8ecd.crm4.dynamics.com/';
const contactsEndpoint = `${resource}api/data/v9.2/contacts`;
const accountsEndpoint = `${resource}api/data/v9.2/accounts`;
const tokenEndpoint = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/token`;
const accessToken = process.env.DYNAMICS_ACCESS_TOKEN;

const requestBody = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  grant_type: 'client_credentials',
  resource: resource 
};

/*
const getToken = async () => {
  try {
    const response = await axios.post(tokenEndpoint, qs.stringify(requestBody), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    console.log('Token:', response.data.access_token);

    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching token:', error.message);
  }
};
*/

  const createContact = async () => {
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
  
      response.data.value.forEach(contact => {
        console.log('Contact ID:', contact.contactid);
        console.log('First Name:', contact.firstname);
        console.log('Last Name:', contact.lastname);
        console.log('Mobile Phone:', contact.mobilephone);
        console.log('Email Address:', contact.emailaddress1);
        console.log('--------------------');
      });
  
      return response.data.value;
    } catch (error) {
      console.error('Error fetching contacts:', error.message);
    }
  };
  
createContact();



