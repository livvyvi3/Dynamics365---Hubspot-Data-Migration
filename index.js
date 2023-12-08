// Importing required modules
const axios = require('axios');
const adal = require('adal-node');
require('dotenv').config()

// Defining constants
const clientId = ""; // Your Azure AD Application ID
const clientSecret = ""; // Client secret generated in your App
const authority = "https://login.microsoftonline.com/b057248a-f45a-45dc-9ef4-fac2ab74c679"; // Azure AD App Tenant ID
const resourceUrl = ""; // Your Dynamics 365 Organization URL

// Creating authentication context
const authContext = new adal.AuthenticationContext(authority);

/* Function to get access token
function getAccessToken() {
  return new Promise((resolve, reject) => {
    authContext.acquireTokenWithClientCredentials(resourceUrl, clientId, clientSecret, (err, tokenResponse) => {
      if (err) {
        reject(err);
      } else {
        resolve(tokenResponse.accessToken);
      }
    });
  });
}
*/
// Function to make CRM request
async function crmRequest(httpMethod, requestUri, body = null) {
  // Getting access token
  //const accessToken = await getAccessToken();

  // Creating axios instance
  const client = axios.create({
    baseURL: resourceUrl,
    headers: {
      // OData related headers
      "OData-MaxVersion": "4.0",
      "OData-Version": "4.0",
      "Prefer": "odata.include-annotations=\"*\"",
      // Passing access token in authorization header
      "Authorization": `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  // Making request
  try {
    const response = await client.request({
      method: httpMethod,
      url: requestUri,
      data: body
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

// Main function
async function main() {
  // Getting contacts
  const contacts = await crmRequest("GET", "/api/data/v9.1/contacts");
  console.log(contacts);
  // Similarly you can make POST, PATCH & DELETE requests
}

// Calling main function
main();
