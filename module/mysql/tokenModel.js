/* eslint-disable no-param-reassign */
const underscore = require('underscore');
const moment = require('moment');
const uuIdv4 = require('uuid/v4');
const exception = require('../../util/exception');
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

    // async getAvailableRoles() {
    //     const _this = this;
    //     const conditions = {
    //         isActive: 1,
    //     };
    //     const params = {
    //         fields: [
    //             'roleId',
    //             'role',
    //         ],
    //     };
    //     const roles = await _this.mysqlSelect(
    //         _this.table.roleTable,
    //         conditions,
    //         params,
    //     );
    //     if (roles.length > 0) {
    //         return roles;
    //     }

    //     throw new exception.DataNotFoundException();
    // }

    // /**
    //  * fetches all the users present in the system
    //  * @param {object} conditions
    //  * @param {object} params
    //  */
    // async getAllUsers(conditions = {}, params = {}) {
    //     const _this = this;
    //     params = {
    //         ...params,
    //         join: [
    //             {
    //                 table: _this.table.roleTable,
    //                 type: 'left',
    //                 conditions: `${_this.table.roleTable}.roleId = ${_this.table.tokenTable}.roleId 
    //                                 AND ${_this.table.roleTable}.isActive = 1`,
    //             },
    //         ],
    //         fields: [
    //             'userEmail',
    //             `${this.table.tokenTable}.isActive`,
    //             `${this.table.tokenTable}.updatedAt`,
    //             'role',
    //         ],
    //     };
    //     const users = await _this.mysqlSelect(
    //         _this.table.tokenTable,
    //         conditions,
    //         params,
    //     );
    //     if (users.length > 0) {
    //         const result = underscore.map(users, (currentObject) => {
    //             currentObject.updatedAt = moment(currentObject.updatedAt).format('DD-MM-YYYY HH:MM:SS');
    //             return currentObject;
    //         });
    //         return result;
    //     }

    //     throw new exception.DataNotFoundException();
    // }

    /**
     * @description add a user into the system
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
