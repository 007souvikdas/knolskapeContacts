const router = require('express').Router({ caseSensitive: true, strict: true });
const controller = require('./contactsController');

module.exports = () => {
    router.get('/', controller.getContacts);
    return {
        router,
    };
};
