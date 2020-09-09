const router = require('express').Router({ caseSensitive: true, strict: true });
const controller = require('./loginController');

module.exports = () => {
    router.post('/login', controller.login);
    router.get('/redirect', controller.redirect);
    router.get('/logout', controller.deleteCookie);
    return {
        router,
    };
};
