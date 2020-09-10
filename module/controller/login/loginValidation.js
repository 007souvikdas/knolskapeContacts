const joi = require('joi');
const underscore = require('underscore');

exports.validateFormLogin = (req, res, next) => {
    const schema = joi.object().keys({
        body: joi.object().keys({
            userName: joi.string().regex(/\S+@\S+\.\S+/),
            password: joi.string().min(6).max(20).required(),
        }),
    });

    let result = joi.validate({
        body: req.body,
    }, schema, {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
        language: {
            any: {
                required: "{{label}} is required"
            },
        },
    });

    underscore.extend(req, result.value);

    return result.error ?
        res.status(400).send(result.error.details[0].message)
        : next();
};