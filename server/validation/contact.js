const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validateContactInputs(data) {
    let errors = {}
    data.cont_name = !isEmpty(data.cont_name) ? data.cont_name : '';
    data.number_1 = !isEmpty(data.number_1) ? data.number_1 : '';
    data.userId = !isEmpty(data.userId) ? data.userId : '';

    if (!Validator.isMobilePhone(data.number_1)) {
        errors.number_1 = 'Phone number is invalid'
    }

    if (Validator.isEmpty(data.number_1)) {
        errors.number_1 = 'Phone number is required'
    }

    if (Validator.isEmpty(data.cont_name)) {
        errors.cont_name = 'Contact name is required'
    }

    if (!Validator.isLength(data.cont_name, { min: 3, max: 30 })) {
        errors.cont_name = 'Contact name must have 3 chars';
    }

    if (Validator.isEmpty(data.userId)) {
        errors.userId = 'Not a user';
    }
    if (!Validator.isMongoId(data.userId)) {
        errors.userId = 'Not a mongo id'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}