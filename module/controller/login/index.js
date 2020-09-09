const router = require('express').Router({ caseSensitive: true, strict: true });
const controller = require('./loginController');

module.exports = () => {
    router.post('/', controller.login);
    router.get('/redirect', controller.redirect);
    // router.get('/checkerPage',           security.verifyToken, security.checkAccess(constants.roles.AGENT_CHECKER), controller.getCheckerPage);

    return {
        router,
    };
};
