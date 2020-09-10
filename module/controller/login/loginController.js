/* eslint-disable no-console */
const { google } = require('googleapis');
const { v4: uuIdv4 } = require('uuid');

const config = require('../../../config/configuration');

const SCOPES = ['https://www.googleapis.com/auth/contacts.readonly',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/userinfo.email'];
const clientSecret = config.get('security:client_secret');
const clientId = config.get('security:clientId');
const redirectUris = config.get('security:redirectUrl');
const util = require('../../../util/utility');
const UserModel = require('../../mysql/userModel');
const TokenModel = require('../../mysql/tokenModel');

function authorizeUrl(userState) {

    const oAuth2Client = new google.auth.OAuth2(
        clientId, clientSecret, redirectUris,
    );
    return oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        state: `${userState}`,
    });
}

exports.login = (req, res, next) => {
    const { userName, password } = req.body;
    const apiResponse = {};
    res.clearCookie('token');
    const hash = util.createHash(password);
    // check if user is present and its hash matching
    const userModel = new UserModel();
    const conditions = {
        userName,
    };
    return userModel.getUser(conditions).then((users) => {
        // check the password
        // if not macthes return authentication failed
        if (users && users.length > 0) {
            // user found
            const user = users[0];
            if (hash !== user.password) {
                console.log('User authentication failed');
                return res.status(401).send('Authentication failed');
            }
            // url = contact page

            apiResponse.url = '/knol/pages/contacts';
            const token = util.createState(user.userId);
            res.cookie('token', token, { maxAge: 900000, httpOnly: true });
            console.log('User already exists, redirecting to list person contacts API');
            return res.status(200).send(apiResponse);
        }

        const data = {
            userId: uuIdv4(),
            userName,
            password: hash,
            isActive: 0,
        };
        // TODO set the userame and password
        return userModel.addUser(data).then(() => {
            console.log('user created');
            const state = util.createState(data.userId);
            apiResponse.url = authorizeUrl(state);
            console.log('User Auth url created , redirecting there...');
            return res.status(200).send(apiResponse);
        }).catch((err) => {
            console.log('Error durig login', err);
            res.status(500).send('failed to create user');
        });
    }).catch((err) => {
        console.log('Unwanted error crept in!. Detailed error:', err);
        res.status(500).send('general Error');
    });
};

exports.redirect = (req, res, next) => {
    // TODO handle the failure case also i.e consent is rejected

    const { code, state } = req.query;
    console.log(req.query);
    const decodedUserId = util.decodeState(state);
    const userModel = new UserModel();
    const tokenModel = new TokenModel();

    if (!decodedUserId) {
        console.log('Invalid state param, unabel to decrypt it');
        return res.status(400).send('Invalid state');
    }
    const oAuth2Client = new google.auth.OAuth2(
        clientId, clientSecret, redirectUris,
    );

    return oAuth2Client.getToken(code, (err, token) => {
        if (err) {
            console.error('Error retrieving access token', err);
            return res.status(400).send('Bad request');
        }
        oAuth2Client.setCredentials(token);
        // const TOKEN_PATH = './tokens/test.json';
        // Store the token to disk for later program executions
        const data = {
            isActive: 1,
        };
        const conditions = {
            userId: decodedUserId,
        };
        return userModel.updateUser(data, conditions)
            .then(() => {
                const tokenData = {
                    userId: decodedUserId,
                    access_token: token.access_token,
                    refresh_token: token.refresh_token || ' ',
                    scope: token.scope,
                    token_type: token.token_type,
                    expiry_date: token.expiry_date,
                };
                console.log('User Active status updated');
                return tokenModel.addToken(tokenData);
            }).then(() => {
                console.log('access token added in Db');
                const apiResponse = { url: '/knol/pages/contacts' };
                res.cookie('token', state, { maxAge: 900000, httpOnly: true });
                // set the cookie with some encrypted value
                return res.status(200).send(apiResponse);
            }).catch((err) => res.status(500).send('DB op failed'));
    });
};

exports.deleteCookie = (req, res, next) => {
    // delete the cookies
    res.clearCookie('token');
    console.log('Cookie removed');
    res.status(200).send('Cookie cleared');
};
