const router = require('express').Router({ caseSensitive: true, strict: true });
const controller = require('./loginController');
const validation = require('./loginValidation');

module.exports = () => {
    router.post('/login', validation.validateFormLogin, controller.login);
    router.get('/redirect', controller.redirect);
    router.get('/logout', controller.deleteCookie);
    return {
        router,
    };
};
