const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const validateRegisterInput = require('../../validation/register');
const validateLoginInputs = require('../../validation/login');
const ObjectId = require('mongodb').ObjectId;

const User = require('../../models/users/model-user');

router.post('/register', function (req, res) {

    const { errors, isValid } = validateRegisterInput(req.body);

    if (!isValid) {
        return res.status(400).json(errors);
    }

    User.findOne({
        email: req.body.email
    }).then(function (user) {
        if (user) {
            return res.status(400).json({
                email: 'Email already exist'
            })
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200',
                r: 'pg',
                d: 'mm'
            })
            const newUserObject = {
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: req.body.password,
                avatar
            }
            newUser = new User(newUserObject);

            bcrypt.genSalt(10, function (err, salt) {
                if (err)
                    console.error('There was an error', err);
                else {
                    bcrypt.hash(newUser.password, salt, function (err, hash) {
                        if (err) {
                            console.error('There was an error', err)
                        } else {
                            newUser.password = hash;
                            newUser.save().then(user => {
                                res.json(user)
                            })
                        }
                    })
                }
            })

        }
    })

})

router.post('/login', function (req, res) {
    const { errors, isValid } = validateLoginInputs(req.body);

    if (!isValid) {
        return res.status(400).json(errors)
    }
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email }).then(user => {
        if (!user) {
            errors.email = 'User not found'
            return res.status(404).json(errors);
        }
        bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch) {


                    const payload = {
                        id: user.id,
                        name: user.last_name,
                        avatar: user.avatar
                    }

                    jwt.sign(payload, 'secret', {
                        expiresIn: 3600
                    }, (err, token) => {
                        if (err)
                            console.error('There is error in Token', err);
                        else {
                            res.json({
                                success: true,
                                token: `Bearer ${token}`
                            });
                        }
                    })

                } else {
                    errors.password = 'Incorrecr Password';
                    return res.status(400).json(errors);
                }

            })
    })
})


router.post('/user', function (req, res) {
    let id = req.body.id;
    // res.send(userId)
    const userId = new ObjectId(id);

    User.findOne({ _id: userId })
        .then(user => {
            if (!user)
                return res.status(404).json({})
            else {
                return res.json(user)
            }
        })
})

router.get('/me', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    });
});

module.exports = router;