/* eslint-disable no-console */
const { google } = require('googleapis');
const config = require('../../../config/configuration');

const clientSecret = config.get('security:client_secret');
const clientId = config.get('security:clientId');
const redirectUri = config.get('security:redirectUrl');
const util = require('../../../util/utility');
const TokenModel = require('../../mysql/tokenModel');

function listConnectionNames(auth) {
    const service = google.people({ version: 'v1', auth });
    return service.people.connections.list({
        resourceName: 'people/me',
        personFields: 'names,emailAddresses,phoneNumbers,photos',
    });
}
function getUserProfile(auth) {
    var oauth2 = google.oauth2({ auth: auth, version: 'v2' });
    return oauth2.userinfo.v2.me.get({
        resourceName: 'people/me',
    });
}


function parsePersonDataFromConnections(connections) {
    const personContacts = [];
    connections.forEach((person) => {
        let name = '';
        let phoneNumber = '';
        let photoUrl = '';
        let emailAddress = '';
        if (person.names && person.names.length > 0) {
            name = person.names[0].displayName;
        }
        if (person.phoneNumbers && person.phoneNumbers.length > 0) {
            phoneNumber = person.phoneNumbers[0].value;
        }
        if (person.photos && person.photos.length > 0) {
            photoUrl = person.photos[0].url;
        }
        if (person.emailAddresses && person.emailAddresses.length > 0) {
            emailAddress = person.emailAddresses[0].value;
        }
        const contact = {
            name,
            phoneNumber,
            photoUrl,
            emailAddress,
        };
        personContacts.push(contact);
    });
    return personContacts;
}

exports.getContacts = (req, res, next) => {
    const { token } = req.cookies;
    let apiResponse = {};
    if (!token) {
        return res.status(400).send('Missing token');
    }
    const userId = util.decodeState(token);
    if (!userId) {
        return res.status(400).send('Invalid token');
    }
    // userId is valid and our token was valid

    const oAuth2Client = new google.auth.OAuth2(
        clientId, clientSecret, redirectUri,
    );

    const tokenModel = new TokenModel();
    const condition = {
        isActive: 1,
        userId,
    };
    tokenModel.getToken(condition).then((tokens) => {
        if (!tokens || tokens.length <= 0) {
            return res.status(400).send('Invalid request');
        }
        const tokenFromDB = tokens[0];
        oAuth2Client.setCredentials(tokenFromDB);
        return getUserProfile(oAuth2Client);
    }).then((result) => {
        console.log(result);
        if (!result.data) {
            return res.status(400).send('Bad request');
        }
        const data = result.data;
        apiResponse.userName = data.name;
        apiResponse.userEmail = data.email;
        apiResponse.photoUrl = data.picture;

        return listConnectionNames(oAuth2Client);
    }).then((result) => {
        let personContacts = [];
        if (!result.data) {
            return res.status(400).send('Bad request');
        }
        const { connections } = result.data;
        if (connections) {
            personContacts = parsePersonDataFromConnections(connections);
        }
        apiResponse.contacts = personContacts;
        return res.status(200).send(apiResponse);
    }).catch((err) => {
        console.log('error while fetching the token', err);
        res.status(400).send('Bad request');
    });
};
