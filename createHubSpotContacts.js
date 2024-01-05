require("dotenv").config();
const qs = require("querystring");
const axios = require("axios");

const resource = 'https://orgd851762.api.crm4.dynamics.com/';
const contactsEndpoint = `${resource}api/data/v9.2/contacts`;
const accessToken = process.env.DYNAMICS_ACCESS_TOKEN;

const hubspotApiKey = process.env.HUBSPOT_API_KEY;
const hubspotBaseUrl = "https://api.hubapi.com";

const requestBody = {
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  grant_type: "client_credentials",
  resource: resource,
};

const getContacts = async () => {
    try {
      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: contactsEndpoint,
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      };
  
      const response = await axios.request(config);
  
      if (response.status === 200) {
        let allContacts = response.data.value;
  
        return allContacts;
      } else {
        throw new Error(`Dynamics 365 API returned status code ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error.message);
    }
  };
  


const filterContactsByDynamicsId = async (dynamicsId) => {
  let filteredContacts = [];

  let next = null;

  do {
    let url = `${hubspotBaseUrl}/crm/v3/objects/contacts`;

    if (next) {
      url = next;
    }

    let response = await axios.get(url, {
      params: {
        hapikey: hubspotApiKey,
        filter: JSON.stringify({
          propertyName: "dynamicsid", 
          operator: "EQ", 
          value: dynamicsId, 
        }),
      },
    });

    let { results, paging } = response.data;

    filteredContacts = filteredContacts.concat(results);

    next = paging ? paging.next.link : null;
  } while (next);

  return filteredContacts;
};

const createHubspotContact = async (contact) => {
    let url = `${hubspotBaseUrl}/crm/v3/objects/contacts`;
  
    let payload = {
      "properties": {
        "firstname": contact.firstname,
        "lastname": contact.lastname,
        "email": contact.emailaddress1,
        "phone": contact.telephone1,
        "dynamicsid": contact.contactid // Store the Dynamics 365 contact ID as a custom property
      }
    };
  
    let response = await axios.post(url, payload, {
      params: {
        hapikey: hubspotApiKey
      }
    });
  
    let contactId = response.data.id;
  
    return contactId;
  };
  
  const syncContacts = async () => {
    let dynamicsContacts = await getContacts();

    for (let contact of dynamicsContacts) {
      let hubSpotContacts = await filterContactsByDynamicsId(contact.contactid);

      if (hubSpotContacts.length === 0) {
        let hubSpotContactId = await createHubspotContact(contact);

        console.log(`Created contact ${hubSpotContactId} in HubSpot`);
      }
    }
  };
  

  syncContacts();
  