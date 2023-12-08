require('dotenv').config()
const qs = require('querystring');
const axios = require('axios');

const resource = 'ADD_YOUR_RESOURCE';
const productsEndpoint = `${resource}api/data/v9.2/products`;
const tokenEndpoint = `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/token`;
const accessToken = process.env.ACCESS_TOKEN;

const requestBody = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  grant_type: 'client_credentials',
  resource: resource 
};

const getProducts = async () => {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: productsEndpoint,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      };
  
      const response = await axios.request(config);
  
      response.data.value.forEach(product => {
        console.log('Product ID:', product.productid);
        console.log('Product Name:', product.name)
        console.log('Cost:', product.currentcost);
        console.log('Available:', product.quantityonhand);
        console.log('Product Number:', product.productnumber);
        console.log('Description:', product.description);
        console.log('--------------------');
      });
  
      return response.data.value;
    } catch (error) {
      console.error('Error fetching contacts:', error.message);
    }
  };
  
getProducts();