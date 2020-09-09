const nconf = require('nconf');

const nodeEnv = process.env.NODE_ENV || 'development';

nconf.argv().env();
nconf.file('config', `./config/config.${nodeEnv}.json`);

module.exports = nconf;
