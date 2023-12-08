require('dotenv').config()
const qs = require('querystring');
const axios = require('axios');

const resource = 'ADD_YOUR_RESOURCE';
const opportunitiesEndpoint = `${resource}api/data/v9.2/opportunities`;
const tokenEndpoint = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/token`;
const accessToken = process.env.ACCESS_TOKEN;

const requestBody = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  grant_type: 'client_credentials',
  resource: resource 
};

const getOpportunities = async () => {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: opportunitiesEndpoint,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      };
  
      const response = await axios.request(config);
  
      response.data.value.forEach(opportunity => {
        console.log('Oppotunity ID:', opportunity.opportunityid);
        console.log('Name:', opportunity.name);
        console.log('Proposed Solution:', opportunity.proposedsolution);
        console.log('Created on: ', opportunity.createdon);
        console.log('Customer need: ', opportunity.customerneed);
        console.log('Situation: ', opportunity.currentsituation);
        console.log('Email Address: ', opportunity.emailaddress);
        console.log('--------------------');
      });
  
      return response.data.value;
    } catch (error) {
      console.error('Error fetching contacts:', error.message);
    }
  };
  
  getOpportunities();