/* eslint-disable no-param-reassign */
const underscore = require('underscore');
const moment = require('moment');
const { v4: uuIdv4 } = require('uuid');
const exception = require('../../util/exception').default;
const BaseModel = require('./baseModel');

class UserModel extends BaseModel {
    constructor() {
        super();
        this.table = {
            userTable: 'user',
        };
    }

    /**
     * @description get a user by condition
     */
    async getUser(conditions = {}) {
        const _this = this;

        conditions['user.isActive'] = 1;

        const user = await _this.mysqlSelect(
            _this.table.userTable,
            conditions,
            {},
        );
        return user;
    }

    /**
     * @description add a user into the system
     */
    addUser(data) {
        const _this = this;
        // add uuid in the data
        if (!underscore.has(data, 'userId')) {
            data.userId = uuIdv4();
        }
        return _this.mysqlInsert(
            _this.table.userTable,
            data,
        );
    }

    /**
     * @description update the user Info
     */
    async updateUser(data, conditions = {}) {
        const _this = this;
        try {
            await _this.mysqlUpdate(this.table.userTable, data, conditions);
        } catch (err) {
            console.log('[userModel][updateUser] error in update user details: ', err);
            throw new exception.DatabaseException();
        }
    }
}
module.exports = UserModel;
