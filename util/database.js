/* eslint-disable no-prototype-builtins */
/* eslint-disable no-console */
const mysql = require('mysql');
const async = require('async');
const config = require('../config/configuration');

const _instance = false;

/** Class representing a database object */
class Database {
    /**
     * Create a Database Object.
     * @function constructor
     * @param {object} instance - The object instance.
     */
    constructor(instance) {
        if (_instance !== instance) {
            throw new Error('Cannot construct class directly');
        }

        this.pool = null;

        this.connectionDetails = {
            MASTER: config.get('database:mysqlMaster'),
            READSLAVE: config.get('database:mysqlReadSlave'),
        };

        this._createPoolConnection();
    }

    /**
     * Create an instance of Database class and return if already initiated
     * @function getInstance
     * @return {Database} A Database object.
     */

    static getInstance() {
        if (!this[_instance]) { // If no instance then make one
            this[_instance] = (new Database(_instance));
        }

        return this[_instance];
    }

    /*
     * Create pool connection
     * @function _createPoolConnection
     * @return {void}
     */
    _createPoolConnection() {
        this.pool = {
            MASTER: mysql.createPool(this.connectionDetails.MASTER),
            READSLAVE: mysql.createPool(this.connectionDetails.READSLAVE),
        };
    }

    /*
     * Set Connection attributes
     * @function _setConnectionAttributes
     * @param {object} connection object of pool
     * @param {object} options
     * @return {void}
     */
    _setConnectionAttributes(connection, options) {
        if (options.hasOwnProperty('queryFormat')) {
            switch (options.queryFormat) {
            case 'namedParameters':
                connection.config.queryFormat = function (query, values) {
                    if (!values) {
                        return query;
                    }

                    return query.replace(/\:(\w+)/g, (txt, key) => {
                        if (values.hasOwnProperty(key)) {
                            return this.escape(values[key]);
                        }

                        return txt;
                    });
                };
                break;
            default:
                connection.config.queryFormat = null;
                break;
            }
        } else {
            connection.config.queryFormat = null;
        }
    }

    /*
     * This function performs database query
     * @function query
     * @param {String} connectionName - MASTER | READSLAVE
     * @param {Object} queryObject    - Query object containing sql query and mappd values
     * @param {requestCallback}       - queryCallback - The callback that handles the response.
     * @param {Object}                - options - Additional parameters for query {queryFormat : namedParameters}
     */

    query(connectionName, queryObject, queryCallback, options = {}) {
        const classObj = this;
        const connectionPoolObj = this.pool[connectionName];

        async.waterfall([
            function (callback) {
                connectionPoolObj.getConnection((err, connection) => {
                    if (err) {
                        queryCallback(err);
                        return callback(err);
                    }
                    classObj._setConnectionAttributes(connection, options);
                    return callback(null, connection);
                });
            },

            // eslint-disable-next-line func-names
            function (connection, callback) {
                connection.query(queryObject, (error, results, fields) => {
                    connection.release();
                    queryCallback(error, results, fields);

                    if (error) {
                        return callback(error, 'done');
                    }

                    return callback(null, 'done');
                });
            },
        ], (error) => {
            if (error) {
                console.log(`${error.message}\n${error.stack}`);
            }
        });
    }
}

module.exports = Database;
