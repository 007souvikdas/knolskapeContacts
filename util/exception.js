/* eslint-disable no-console */
/* eslint-disable max-classes-per-file */
const NodeException = require('node-exceptions');
const underscore = require('underscore');
const config = require('../config/configuration');

// Services Exception
class ApplicationException extends NodeException.LogicalException {
    constructor(errorKey = 'ERROR_SERVER_ERROR', messageVariables = {}) {
        super();

        const error = config.get(`APP_MESSAGES:${errorKey}`);

        this.message = underscore.template(error.message)(messageVariables);
        this.status = error.statusCode;
        this.code = error.errorCode;
        this.response = this.response || {};
    }
}

class AuthException extends ApplicationException {
    constructor() {
        super('ERROR_AUTHENTICATION');
    }
}

class MethodNotImplemented extends ApplicationException {
    constructor() {
        super('METHOD_NOT_IMPLEMENTED');
    }
}

class InvalidCredentialsException extends ApplicationException {
    constructor() {
        super('ERROR_INVALID_CREDENTIALS');
    }
}

class UnsupportedServiceActionException extends ApplicationException {
    constructor() {
        super('ERROR_UNSUPPORTED_SERVICE');
    }
}

class UnsupportedServiceAdapterException extends ApplicationException {
    constructor() {
        super('ERROR_UNSUPPORTED_ADAPTER');
    }
}

class DataNotFoundException extends ApplicationException {
    constructor() {
        super('ERROR_DATA_NOT_FOUND');
    }
}

class ClientConnectionTimeout extends ApplicationException {
    constructor() {
        super('ERROR_CONNECTION_TIMEOUT');
    }
}

class CacheConnectionException extends ApplicationException {
    constructor() {
        super('ERROR_CACHE_CONNECTION');
    }
}

class ClientResponseTimeout extends ApplicationException {
    constructor() {
        super('ERROR_CONNECTION_TIMEOUT');
    }
}

class InvalidSiteException extends ApplicationException {
    constructor() {
        super('ERROR_INVALID_SITE');
    }
}

class SystemErrorException extends ApplicationException {
    constructor(response = {}) {
        super('ERROR_SYSTEM_API');

        this.response = response;
    }
}

class ValidationErrorException extends ApplicationException {
    constructor(response = {}) {
        super('ERROR_VALIDATION');

        this.response = response;
    }
}

class DatabaseException extends ApplicationException {
    constructor(response = {}) {
        super('ERROR_DATABASE_ERROR');

        this.response = response;
    }
}

class DatabaseWhereConditionsNotFoundException extends ApplicationException {
    constructor() {
        super('DATABASE_WHERE_CONDITIONS_NOT_FOUND');
    }
}

class AlreadyExistsException extends ApplicationException {
    constructor() {
        super('ERROR_ALREADY_EXISTS');
    }
}

class NotApplicableForVoucherException extends ApplicationException {
    constructor() {
        super('ERROR_NOT_APPLICABLE_FOR_VOUCHER');
    }
}

class InvalidEncryptionTokenException extends ApplicationException {
    constructor() {
        super('INVALID_TOKEN');
    }
}

class InvalidScopeException extends ApplicationException {
    constructor() {
        super('INVALID_SCOPE');
    }
}

class InvalidQcKeyException extends ApplicationException {
    constructor() {
        super('ERROR_INVALID_QC_KEY');
    }
}

class InvalidClientException extends ApplicationException {
    constructor(errorMessage = false) {
        super('INVALID_CLIENT');
        this.message = errorMessage || this.message;
    }
}

class InvalidClientSecretException extends ApplicationException {
    constructor() {
        super('INVALID_CLIENT_SECRET');
    }
}

class UnauthorizedAuthTypeException extends ApplicationException {
    constructor() {
        super('ERROR_UNAUTHORIZED_AUTHTYPE');
    }
}

class UnauthorizedGlssTokenException extends ApplicationException {
    constructor() {
        super('ERROR_UNAUTHORIZED_GLSS_TOKEN');
    }
}

class CustomerNotFoundException extends ApplicationException {
    constructor() {
        super('CUSTOMER_NOT_EXISTS');
    }
}

class InvalidGrantErrorException extends ApplicationException {
    constructor(message) {
        super('ERROR_INVALID_GRANT');
        this.message = message;
    }
}

class OtpLimitExceeded extends ApplicationException {
    constructor(message) {
        super('OTP_LIMIT_EXCEEDED');

        if (message) {
            this.message = message;
        }
    }
}

class CaptchaRequiredException extends ApplicationException {
    constructor() {
        super('ERROR_CAPTCHA_REQUIRED');
    }
}

class InvalidSsoAuthException extends ApplicationException {
    constructor() {
        super('ERROR_AUTHENTICATION');
    }
}

/*
 * Error Handler
 */
const errorHandler = (err, req, res) => {
    const errResponse = {
        status: false,
        statusMessage: err.message,
        statusCode: err.code,
        response: err.response,
    };
    console.error(err);

    return res.status(err.status || 500).json(errResponse);
};

class ModuleApiErrorException extends NodeException.LogicalException {
    constructor(result = {}) {
        super();
        this.message = result.body.statusMessage;
        this.status = result.statusCode;
        this.code = result.body.statusCode;
        this.response = result.body.response || {};
    }
}

/*
 * Error Handler
 */
const unknownRouteHandler = (req, res, next) => next(new UnsupportedServiceActionException());

module.exports = {
    UnauthorizedAuthTypeException,
    InvalidClientException,
    InvalidClientSecretException,
    InvalidEncryptionTokenException,
    InvalidGrantErrorException,
    InvalidScopeException,
    InvalidQcKeyException,
    NotApplicableForVoucherException,
    AlreadyExistsException,
    InvalidCredentialsException,
    ModuleApiErrorException,
    DatabaseException,
    DataNotFoundException,
    UnsupportedServiceAdapterException,
    UnsupportedServiceActionException,
    ClientConnectionTimeout,
    ClientResponseTimeout,
    ValidationErrorException,
    DatabaseWhereConditionsNotFoundException,
    AuthException,
    SystemErrorException,
    InvalidSiteException,
    OtpLimitExceeded,
    CacheConnectionException,
    UnauthorizedGlssTokenException,
    CaptchaRequiredException,
    CustomerNotFoundException,
    errorHandler,
    unknownRouteHandler,
    InvalidSsoAuthException,
    MethodNotImplemented,
};
