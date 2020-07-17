const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const sendOTP = require('../config/otpService');

const { isUserLoggedIn } = require('../utils/ensureAuth');

router.post('/sendOTP', (req, res) => {

    const { phone } = req.body;
    const OTP = Math.floor(100000 + Math.random() * 900000); // 6 digits

    sendOTP(phone, OTP)
        .then(deliveryDetails => User.findOne({ phone }))
        .then(user => {
            if (!user) {
                // User dosn't exist; create new user
                const newUser = new User({
                    phone,
                    OTP,
                    referralCode: phone, // TODO: Fix it
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
        .then(user => res.status(200).send(user))
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
                expire: Date.now() + 1000 * 60 * 60 * 24
            });
            return USER.isRegistered ? res.send('Dashboard') : res.send('Get more details');
        })
        .catch(err => console.log(err));
});

router.get('/logout', isUserLoggedIn, (req, res) => {
    // res.clearCookie('userId');
    return res.send('Logged Out');
});

module.exports = router;