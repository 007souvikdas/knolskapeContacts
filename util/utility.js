const crypto = require('crypto');
const moment = require('moment');
const underscore = require('underscore');
const config = require('../config/configuration');
const encryptionKey = config.get('security:encryptionKey');
const encryptionIv = config.get('security:encryptionIv');
const expiresIn = config.get('security:encryptionIv');


exports.createHash = (plainText) => crypto.createHash('sha256').update(plainText).digest('hex');

exports.encryptString = (plainText) => {
    const cipher = crypto.createCipheriv('aes-256-cbc', encryptionKey, encryptionIv);
    let encrypted = cipher.update(plainText, 'utf8', 'binary');
    encrypted += cipher.final('binary');
    const hexVal = Buffer.from(encrypted, 'binary');
    return hexVal.toString('base64');
};

exports.decryptString = (encryptedText) => {
    const decipher = crypto.createDecipheriv('aes-256-cbc', encryptionKey, encryptionIv);
    let decrypted = decipher.update(encryptedText, 'base64', 'binary');
    decrypted += decipher.final('binary');
    return decrypted;
};

exports.createState = (plainText) => {
    const currentUnixTime = moment().unix();
    const token = `${currentUnixTime}_${plainText}`;
    return this.encryptString(token);
};

exports.decodeState = (state) => {
    try {
        const decryptedString = this.decryptString(state);
        const [timeStamp, userId] = decryptedString.split('_');

        let parsedTimeStamp = parseInt(timeStamp);
        if (underscore.isNaN(parsedTimeStamp)) {
            console.log('[security]', 'timeStamp is invalid');
            return null;
        }

        // check for token expiry
        const currentTime = moment();
        const generationTime = moment.unix(timeStamp);
        const expiryTime = moment.unix(parsedTimeStamp + expiresIn);

        if (currentTime.isBefore(generationTime) || currentTime.isAfter(expiryTime)) {
            console.log('[security]', 'token expired');
            return null;
        }
        return userId;
    } catch (err) {
        console.log(err);
        return null;
    }
};