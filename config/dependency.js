/* eslint-disable global-require */
// const express = require('express');
const cookieParser = require('cookie-parser');

module.exports = (app) => {
    // app.use(security.check);
    app.use(cookieParser());

    // Registring Controller Modules
    app.use('/knol/api/v1/login/', require('../module/controller/login')(app).router);
    app.use('/knol/api/v1/contacts/', require('../module/controller/contacts')(app).router);
};
