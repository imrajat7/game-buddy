const router = require('express').Router();
const jwt = require('jsonwebtoken');
const shortid = require('shortid');

const User = require('../models/user');
const { sendOTP } = require('../config/otpService');

const { isUserLoggedIn } = require('../utils/ensureAuth');

router.get('/sendOTP', (req, res) => {
    if (req.user) {
        return res.redirect('/');
    }
    res.render('sendOTP', { user: req.user });
});

router.post('/sendOTP', (req, res) => {

    if (req.user) {
        return res.redirect('/');
    }

    let { phone } = req.body;
    const OTP = Math.floor(100000 + Math.random() * 900000); // 6 digits

    phone = `91${phone}`; // Only indian nums for now

    // TODO : Check if number is invalid

    sendOTP(`+${phone}`, OTP)
        .then(deliveryDetails => User.findOne({ phone }))
        .then(user => {
            if (!user) {
                // User dosn't exist; create new user
                const newUser = new User({
                    phone,
                    OTP,
                    referralCode: shortid.generate(),
                    OTPValidTill: Date.now() + (5 * 60 * 1000), //For 5 minutes in the future
                });
                return newUser.save();
            } else {
                // User exists, updating user
                return User.findOneAndUpdate({ phone }, {
                    $set: {
                        OTP,
                        OTPValidTill: Date.now() + (5 * 60 * 1000), //For 5 minutes in the future
                    }
                }, { returnOriginal: false })
            }
        })
        .then(user => res.render('verifyOTP', { phone, user: req.user }))
        .catch(err => res.status(400).send({ error: err }));
});

router.post('/verifyOTP', (req, res) => {
    const { phone, OTP } = req.body;

    let USER;

    User.findOne({ phone, OTP, OTPValidTill: { $gte: Date.now() } })
        .then(user => {
            if (!user) {
                return res.send('OTP Expired');
            }

            USER = user;
            const payload = {
                id: user._id,
                phone: user.phone,
            };

            // Sign token
            return jwt.sign(payload, process.env.SECRET, {
                expiresIn: 1000 * 60 * 60 * 24 * 365, // 1 year in seconds
            })
        })
        .then(token => {
            res.cookie('userId', token, {
                maxAge: 1000 * 60 * 60 * 24
            });
            return USER.isRegistered ? res.redirect('/') : res.redirect('/user/moreDetails');
        })
        .catch(err => console.log(err));
});

router.get('/logout', isUserLoggedIn, (req, res) => {
    res.clearCookie('userId');
    return res.redirect('/');
});

module.exports = router;