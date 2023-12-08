require('dotenv').config()
const qs = require('querystring');
const axios = require('axios');

const resource = 'ADD_YOUR_RESOURCE/';
const leadsEndpoint = `${resource}api/data/v9.2/leads`;
const tokenEndpoint = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/token`;
const accessToken = process.env.ACCESS_TOKEN;

const requestBody = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  grant_type: 'client_credentials',
  resource: resource 
};

const getLeads = async () => {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: leadsEndpoint,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      };
  
      const response = await axios.request(config);
  
      response.data.value.forEach(lead => {
        console.log('Lead ID:', lead.leadid);
        console.log('Company Name:', lead.companyname);
        console.log('Lead Name:', lead.fullname)
        console.log('Email:', lead.emailaddress1);
        console.log('Job Title:', lead.jobtitle);
        console.log('Subject:', lead.subject);
        console.log('Address:', lead.address1_composite);
        console.log('Phone Number:', lead.mobilephone);
        console.log('--------------------');
      });
  
      return response.data.value;
    } catch (error) {
      console.error('Error fetching contacts:', error.message);
    }
  };
  
getLeads();