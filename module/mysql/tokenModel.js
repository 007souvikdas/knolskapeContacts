/* eslint-disable no-param-reassign */
const underscore = require('underscore');
const moment = require('moment');
const { v4: uuIdv4 } = require('uuid');
const exception = require('../../util/exception').default;
const BaseModel = require('./baseModel');

class TokenModel extends BaseModel {
    constructor() {
        super();
        this.table = {
            tokenTable: 'token',
        };
    }

    async getToken(conditions = {}) {
        const _this = this;

        conditions['token.isActive'] = 1;

        const token = await _this.mysqlSelect(
            _this.table.tokenTable,
            conditions,
            {},
        );
        return token;
    }

    /**
     * @description add a token into the system
     */
    addToken(data) {
        const _this = this;
        // add uuid in the data
        if (!underscore.has(data, 'tokenId')) {
            data.tokenId = uuIdv4();
        }
        return _this.mysqlInsert(
            _this.table.tokenTable,
            data,
        );
    }

    /**
     * @description update the token Info
     */
    async updateToken(data, conditions = {}) {
        const _this = this;
        try {
            await _this.mysqlUpdate(this.table.tokenTable, data, conditions);
        } catch (err) {
            console.log('[tokenModel][updateToken] error in update token details: ', err);
            throw new exception.DatabaseException();
        }
    }
}
module.exports = TokenModel;
