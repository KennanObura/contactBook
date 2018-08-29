const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            trim: true
        },

        cont_name: {
            type: String,
            require: true
        },
        cont_prefix: {
            type: String
        },
        cont_family_name: {
            type: String
        },


        number_1: {
            type: String
        },
        number_2: {
            type: String

        },
        location: {
            type: String
        },
        profession: {
            type: String
        },
        company_address: {
            type: String
        }

    }

)

const Contact = mongoose.model('contacts', ContactSchema);
module.exports = Contact;