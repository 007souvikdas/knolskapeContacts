/* eslint-disable no-console */
const fs = require('fs');
const { google } = require('googleapis');
const config = require('../../../config/configuration');
const uuIdv4 = require('uuid/v4');
const SCOPES = ['https://www.googleapis.com/auth/contacts.readonly'];

const client_secret = config.get('security:client_secret');
const client_id = config.get('security:clientId');
const redirect_uris = config.get('security:redirectUrl');
const util = require('../../../util/utility');
const exception = require('../../../util/exception');
const UserModel = require('../../mysql/userModel');
const TokenModel = require('../../mysql/tokenModel');

exports.login = (req, res, next) => {
    const { userName, password } = req.body;
    let apiResponse = {};
    console.log(userName, 'and ', password);
    const hash = util.createHash(password);
    // check if user is present and its hash matching
    const userModel = new UserModel();
    const conditions = {
        userName,
    };
    userModel.getUser(conditions).then((users) => {
        // check the password
        // if not macthes return authentication failed
        if (users && users.length > 0) {
            // user found
            let user = users[0];
            if (hash !== user.password) {
                return res.status(401).send("Authentication failed");
            }
            //url = contact page
            apiResponse['url'] = '/knol/api/v1/contacts/';
            let token = util.createState(user.userId);
            res.cookie('token', token, { maxAge: 900000, httpOnly: true });

            return res.status(200).send(apiResponse);
        }
        let data = {
            userId: uuIdv4(),
            userName,
            password: hash,
            isActive: 0,
        };
        // TODO set the userame and password
        userModel.addUser(data).then(() => {
            console.log('user created');
            const state = util.createState(data.userId);
            apiResponse['url'] = authorizeUrl(state);
            console.log('auth genearted');
            return res.status(200).send(apiResponse);
        }).catch(err => {
            return res.status(500).send("failed to create user");
        });
    }).catch((err) => {
        console.log(err);
        res.status(500).send("general Error");
    });
};

function authorizeUrl(userState) {
    console.log('clientId:', client_id, 'client_secret:', client_secret);

    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris,
    );
    return oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        state: `${userState}`,
    });
}

exports.redirect = (req, res, next) => {
    // save the code
    const { code, state } = req.query;
    console.log(req.query);
    const decodedUserId = util.decodeState(state);
    const userModel = new UserModel();
    const tokenModel = new TokenModel();

    if (!decodedUserId) {
        return res.status(400).send("Invalid state");
    }
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris,
    );

    oAuth2Client.getToken(code, (err, token) => {
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
        userModel.updateUser(data, conditions)
            .then(() => {
                const tokenData = {
                    userId: decodedUserId,
                    access_token: token.access_token,
                    refresh_token: token.refresh_token || " ",
                    scope: token.scope,
                    token_type: token.token_type,
                    expiry_date: token.expiry_date,
                };

                return tokenModel.addToken(tokenData);
            }).then(() => {
                console.log("access token added in Db");
                const apiResponse = { url: '/knol/api/v1/contacts/' };
                res.cookie('token', state, { maxAge: 900000, httpOnly: true });
                // set the cookie with some encrypted value
                return res.status(200).send(apiResponse);
            }).catch(err => {
                return res.status(500).send("DB op failed");
            });
    });
};
