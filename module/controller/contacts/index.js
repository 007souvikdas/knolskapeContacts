const router = require('express').Router({ caseSensitive: true, strict: true });
const controller = require('./contactsController');

module.exports = () => {
    router.get('/', controller.getContacts);
    // router.get('/getConfiguredPackages', security.verifyToken, security.checkAccess(constants.roles.AGENT), controller.getConfiguredPackages);
    // router.get('/checkerPage',           security.verifyToken, security.checkAccess(constants.roles.AGENT_CHECKER), controller.getCheckerPage);

    return {
        router,
    };
};
