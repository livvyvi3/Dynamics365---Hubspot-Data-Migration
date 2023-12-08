
const axios = require("axios");
require("dotenv").config();

const hubspotApiKey = process.env.HUBSPOT_API_KEY;
const hubspotBaseUrl = "https://api.hubapi.com";

const dynamicsAccessToken = process.env.DYNAMICS_ACCESS_TOKEN;
const dynamicsBaseUrl = "https://ADD_YOUR_RESOURCE/api/data/v9.0";

const dynamicsHeaders = {
  "Authorization": `Bearer ${dynamicsAccessToken}`,
  "Content-Type": "application/json",
  "OData-MaxVersion": "4.0",
  "OData-Version": "4.0"
};

const getHubspotContacts = async () => {
  let allContacts = [];

  let next = null;

  do {
    let url = `${hubspotBaseUrl}/crm/v3/objects/contacts`;

   
    if (next) {
      url = next;
    }

    let response = await axios.get(url, {
        headers: {
            accept: "application/json",
            authorization: `Bearer ${hubspotApiKey}`,
          },
    });

    let { results, paging } = response.data;

    allContacts = allContacts.concat(results);

    next = paging ? paging.next.link : null;
  } while (next);

  return allContacts;
};

const checkDynamicsContact = async (hubSpotContactId) => {
  let url = `${dynamicsBaseUrl}/contacts`;

  let response = await axios.get(url, {
    params: {
      $filter: `new_hubspotid eq '${hubSpotContactId}'` // Use the custom attribute new_hubspotid to store the HubSpot contact ID
    },
    headers: dynamicsHeaders
  });

  let { value } = response.data;

  return value.length > 0;
};

const createDynamicsContact = async (contact) => {
  let url = `${dynamicsBaseUrl}/contacts`;

  let payload = {
    "fullname": contact.properties.firstname + " " + contact.properties.lastname,
    "lastname": contact.properties.lastname,
    "emailaddress1": contact.properties.email,
    "telephone1": contact.properties.phone,
    "new_hubspotid": contact.id 
  };

  let response = await axios.post(url, payload, {
    headers: dynamicsHeaders
  });

  let contactId = response.data.contactid;

  return contactId;
};

const syncContacts = async () => {
  let hubSpotContacts = await getHubspotContacts();


  for (let contact of hubSpotContacts) {
    let exists = await checkDynamicsContact(contact.id);

    if (!exists) {
      let dynamicsContactId = await createDynamicsContact(contact);

      console.log(`Created contact ${dynamicsContactId} in Dynamics 365`);
    }
  }
};

syncContacts();
