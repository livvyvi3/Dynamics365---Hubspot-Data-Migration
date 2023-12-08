require('dotenv').config()
const qs = require('querystring');
const axios = require('axios');

const resource = 'ADD_YOUR_RESOURCE';
const ordersEndpoint = `${resource}api/data/v9.2/salesorders`;
const tokenEndpoint = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/token`;
const accessToken = process.env.ACCESS_TOKEN;

const requestBody = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  grant_type: 'client_credentials',
  resource: resource 
};

const getOrders = async () => {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: ordersEndpoint,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      };
  
      const response = await axios.request(config);
  
      response.data.value.forEach(order => {
        console.log('Order ID:', order.salesorderid);
        console.log('Name:', order.name);
        console.log('Date Fulfilled:', order.datefulfilled);
        console.log('Total Amount:', order.totalamount);
        console.log('--------------------');
      });
  
      return response.data.value;
    } catch (error) {
      console.error('Error fetching contacts:', error.message);
    }
  };
  

getOrders();