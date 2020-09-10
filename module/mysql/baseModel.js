/* eslint-disable class-methods-use-this */
const underscore = require('underscore');
const promise = require('bluebird');
const database = require('../../util/database');
const exception = require('../../util/exception').default;

class BaseModel {
    constructor() {
        this.databaseObj = database.getInstance();
    }

    get CONNECTIONNAME() {
        return {
            READSLAVE: 'READSLAVE',
            MASTER: 'MASTER',
        };
    }

    /*
     * @description Generic Select from mysql
     *
     * @example
     * let params = {
            join:[
                {table: 'roleUser', type: 'left', conditions: 'roleUser.userId = users.id'}
            ],
            limit: 70,
            orderBy: 'email DESC',
        };
        let conditions = {
            'users.id': 2,
            'users.email': ['abc@gmail.com', 'bcd@gmail.com'],
        };

        model.mysqlSelect('users', conditions, params, function (err, results) {
            //Do something with result and error
        });

        #Query
        SELECT * FROM users LEFT JOIN roleUser ON roleUser.userId = users.id
            WHERE 1 AND users.id = 2 AND users.email IN ('abc@gmail.com', 'bcd@gmail.com')
            ORDER BY email DESC limit 70
     */
    mysqlSelect(table, conditions = {}, params = {}) {
        const queryValues = [];

        params.fields = params.fields || '*';

        let sql = `
            SELECT 
                ${params.fields}
            FROM 
                ${table} `;

        if (params.join) {
            underscore.each(params.join, (value) => {
                value.type = value.type || 'FULL';

                sql += `
                    ${value.type} JOIN 
                        ${value.table} 
                    ON 
                        ${value.conditions}
                    `;
            });
        }

        sql += ' WHERE 1 ';

        if (underscore.isEmpty(conditions) === false) {
            underscore.each(conditions, (value, index) => {
                if (underscore.isArray(value)) {
                    sql += ` AND ${index} IN (?) `;
                    queryValues.push(value);
                } else if (underscore.isObject(value)) {
                    sql += underscore.isArray(value.value) ? ` AND ${index} ${value.sign} (?) ` : ` AND ${index} ${value.sign} ? `;
                    queryValues.push(value.value);
                } else {
                    sql += ` AND ${index} = ? `;
                    queryValues.push(value);
                }
            });
        }

        // Adding  Order By if exist
        sql += params.groupBy ? ` GROUP BY ${params.groupBy} ` : '';
        sql += params.orderBy ? ` ORDER BY ${params.orderBy} ` : '';

        // Adding Limit
        sql += params.limit ? ` LIMIT ${params.limit} ` : '';

        // Adding skip
        sql += params.limit && params.skip ? `OFFSET ${params.skip} ` : '';
        const _this = this;

        return new promise((resolve, reject) => _this.databaseObj.query(_this.CONNECTIONNAME.READSLAVE, {
            sql,
            values: queryValues,
        }, (error, result) => (error ? reject(error) : resolve(result))));
    }

    /*
     * @description Generic Insert for mysql
     *
     * @example
        let data = {
            'id': 2,
            'email': abc@gmail.com,
        };

        model.mysqlInsert('users', data, function (err, results) {
            //Do something with result and error
        });

        #Query
        Insert into users SET id = 2, email=abc@gmail.com
     */
    mysqlInsert(table, data = {}) {
        const _this = this;
        const sql = `
            INSERT INTO
                ${table}
            SET ?
        `;
        return new promise((resolve, reject) => _this.databaseObj.query(_this.CONNECTIONNAME.MASTER, {
            sql,
            values: data,
        }, (error, result) => (error ? reject(error) : resolve(result))));
    }

    /*
     * @description Generic Multiple Insert for mysql
     *
     * @example
        let data = {
            'id': 2,
            'email': abc@gmail.com,
        };

        model.mysqlInsert('users', data, function (err, results) {
            //Do something with result and error
        });

        #Query
        Insert into users SET id = 2, email=abc@gmail.com
     */
    mysqlMultiInsert(table, data = {}, options = { ignoreDuplicates: false }) {
        const _this = this;
        const sql = `
            INSERT ${options.ignoreDuplicates === true ? ' IGNORE ' : ''}INTO
                ${table} 
                (${underscore.keys(underscore.first(data))})
            VALUES
                ?
        `;

        const prepareData = underscore.map(data, (value) => underscore.values(value));

        return new promise((resolve, reject) => _this.databaseObj.query(_this.CONNECTIONNAME.MASTER, {
            sql,
            values: [prepareData],
        }, (error, result) => (error ? reject(error) : resolve(result))));
    }

    /*
     * @description Generic update for mysql
     * @example:
         let date ={
           isActive: 0
         }
        let conditions={
            userId: 'some Id',
            email : 'some Email Id'
        }
         model.mysqlUpdate('users', data, function (err, results) {
            //Do something with result and error
         });

        #Query
        update userEmail SET isActive = 0 WHERE userId ='some Id' AND email = 'some Email Id'
    */
    mysqlUpdate(table, data, conditions) {
        const _this = this;
        let sql = `
        UPDATE
           ${table}
        SET                 
    `;
        const queryValues = [];
        if (underscore.isEmpty(data) === false) {
            underscore.each(data, (value, index) => {
                sql += ` ${index} = ? ,`;
                queryValues.push(value);
            });
            // remove the last ','
            sql = sql.slice(0, -1);
        }

        sql += ' WHERE 1 ';
        if (underscore.isEmpty(conditions) === false) {
            underscore.each(conditions, (value, index) => {
                if (underscore.isArray(value)) {
                    sql += ` AND ${index} IN (?) `;
                    queryValues.push(value);
                } else if (underscore.isObject(value)) {
                    sql += underscore.isArray(value.value) ? ` AND ${index} ${value.sign} (?) ` : ` AND ${index} ${value.sign} ? `;
                    queryValues.push(value.value);
                } else {
                    sql += ` AND ${index} = ? `;
                    queryValues.push(value);
                }
            });
        }

        return new promise((resolve, reject) => {
            if (underscore.isEmpty(conditions)) {
                return reject(new exception.UpdateConditionsNotFoundException());
            }
            return _this.databaseObj.query(_this.CONNECTIONNAME.MASTER, {
                sql,
                values: queryValues,

            }, (error, result) => (error ? reject(error) : resolve(result)));
        });
    }
}

module.exports = BaseModel;
