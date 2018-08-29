const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');

// const jwt = require('jsonwebtoken');
// const passport = require('passport');
const validateContactInputs = require('../../validation/contact');
const ObjectId = require('mongodb').ObjectId;

const Contact = require('../../models/contacts/model-contact');

router.post('/contact', (req, res) => {
    const { errors, isValid } = validateContactInputs(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    Contact.findOne({
        number_1: req.body.number_1
    }).then(contact => {
        if (contact) {
            return res.status(400).json({
                number_1: 'Contact already exist'
            })
        }


        else {
            const newContact = new Contact({
                userId: req.body.userId,
                number_1: req.body.number_1,
                cont_name: req.body.cont_name,
                cont_prefix: req.body.cont_prefix ? req.body.cont_prefix : '',
                cont_family_name: req.body.cont_family_name ? req.body.cont_family_name : '',
                location: req.body.location ? req.body.location : '',
                // location: {
                //     location_details: req.body.location_details ? req.body.location_details : ''
                // },
                profession: req.body.profession ? req.body.profession : '',
                company_address: req.body.company_address ? req.body.company_address : ''

            })

            newContact.save()
                .then(contact => {
                    res.json(contact)
                })
        }
    })

})

router.post('/', (req, res) => {
    const userId = req.body.userId;

    Contact.find({
        userId: req.body.userId
    }).then(contacts => {
    
        res.json(contacts)
    })
})

router.post('/sg_contact/', (req, res) => {
    const id = req.body.id;
    const contactId = new ObjectId(id)
    Contact.findOne({
        _id: contactId
    }).then(contact => {
        res.json(contact)
    })
})

module.exports = router;
