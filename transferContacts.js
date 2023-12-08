require('dotenv').config()
const qs = require('querystring');
const axios = require('axios');


const resource = 'https://orgdc8d1d06.api.crm4.dynamics.com/';
const contactsEndpoint = `${resource}api/data/v9.2/contacts`;

const requestBody = {
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    grant_type: 'client_credentials',
    resource: resource 
  };

const getHubspotContacts = async () => {
  try {
    let allContacts = [];
    let offset = 70;
    let hasMore = true;

    while (hasMore) {
      const response = await axios.get(
        `https://api.hubapi.com/crm/v3/objects/contacts?count=100&limit=100&offset=${offset}`,
        {
          headers: {
            accept: "application/json",
            authorization: `Bearer ${hubspotApiKey}`,
          },
        }
      );

      const contacts = response.data.results;

      allContacts = allContacts.concat(contacts);

      if (contacts.length < 100) {
        console.log(contacts.length)
        hasMore = false;
      } else {
        offset += 100;
      }
    }

    console.log(allContacts);
    
  } catch (error) {
    console.error("Error getting contacts:", error);
  }
};

const doesHubspotIDExistInDynamics = async (hubspotId) => {
    //change thuis script to get contacts from dynamics and if the ID does already exsist in Hubspot
  try {
    const response = await axios.get(
      `https://api.pipedrive.com/v1/persons/find?term=${hubspotId}&api_token=${pipedriveApiKey}`
    );

    const existingContact = response.data;

    return existingContact.length > 0;
  } catch (error) {
    console.error("Error checking HubSpot ID in Dynamics:", error);
    return false;
  }
};

const createContactInDynamics = async (contactData) => {
  try {

    if (await doesHubspotIDExistInPipedrive(hubspotId)) {
      console.log("HubSpot ID already exists in Dynamics for:", hubspotId);
    } else {
      const response = await axios.post(
        //do a post to Dynamics to create the contacts 
        `https://api.pipedrive.com/v1/persons?api_token=${pipedriveApiKey}`,
        contactData
      );

      console.log("Contact created in Dynamics:", response.data);
    }
  }
  catch (error) {
    console.error("Error creating contact in Dynamics:", error);
  }
};

const transferContacts = async () => {
  try {
    let offset = 0;
    let totalContacts = 0;


    while (true) {
      const hubSpotResponse = await axios.get(
        `https://api.hubapi.com/crm/v3/objects/contacts?limit=100&offset=${offset}`,
        {
          headers: {
            accept: "application/json",
            authorization: `Bearer ${hubSpotApiKey}`,
          },
        }
      );
      const hubSpotContacts = hubSpotResponse.data.results;
      const maxContactsToRetrieve = hubSpotContacts.length; 

      if (hubSpotContacts.length === 0 || totalContacts >= maxContactsToRetrieve) {
        break;
      }

      for (const contact of hubSpotContacts) {
        const email = contact.properties.email;
        const phone = contact.properties.phone;
        const hubspotId = contact.properties.hs_object_id;
        const firstname = contact.properties.firstname || "";
        const lastname = contact.properties.lastname || "";

        const pipedriveContactData = {
          name: `${firstname} ${lastname}`,
          first_name: firstname,
          last_name: lastname,
          email: email,
          phone: phone,
          'a45403d925ddb8b89b6c347b1898891d5d7f921c': hubspotId,
        };

        await createContactInDynamics(dynamicsContactData);
        totalContacts++;
      }

      offset += hubSpotContacts.length; 
    }
  } catch (error) {
    console.error("Error fetching data from HubSpot:", error);
  }
  
};

transferContacts();
