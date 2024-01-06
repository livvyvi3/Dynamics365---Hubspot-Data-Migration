/* The code below is to create a contact in Microsoft Dynamics 365*/

require('dotenv').config()
const qs = require('querystring');
const axios = require('axios');

const resource = `${process.env.RESOURCE}`;
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

const contact = {
  firstname: 'John',
  lastname: 'Doe',
  emailaddress1: 'john.doe@example.com',
  'parentcustomerid_account@odata.bind': '/accounts(12345678-1234-1234-1234-123456789012)'
};

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: contactsEndpoint,
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  data: contact
};

axios.request(config)
  .then(response => {
    console.log('Contact created:', response.data);
  })
  .catch(error => {
    console.error('Error creating contact:', error.message);
  });
