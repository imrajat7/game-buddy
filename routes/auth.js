const router = require('express').Router();

const User = require('../models/user');
const sendOTP = require('../config/otpService');

router.post('/sendOTP', (req, res) => {

    const { phone } = req.body;
    const OTP = Math.floor(100000 + Math.random() * 900000);

    sendOTP(phone, OTP)
        .then(deliveryDetails => User.findOne({ phone }))
        .then(user => {
            if (!user) {
                // User dosn't exist; create new user
                const newUser = new User({
                    phone,
                    OTP,
                    referral: phone, // TODO: Fix it
                    OTPValidTill: Date.now() + (5 * 60 * 1000), //For 5 minutes in the future
                });
                return newUser.save();
            } else {
                // User exists, updating user
                return User.updateOne({ phone }, {
                    OTP,
                    OTPValidTill: Date.now() + (5 * 60 * 1000), //For 5 minutes in the future
                })
            }
        })
        .then(user => res.status(200).send(user))
        .catch(err => res.status(400).send({ error: err }));
});

router.post('/verifyOTP', (req, res) => {
    const { phone, OTP } = req.body;

    User.findOne({ phone, OTP, OTPValidTill: { $gte: Date.now() } })
    .then(user => {
        if(!user) {
            return res.send('OTP Expired');
        }
        return user.isRegistered ? res.send('Dashboard') : res.send('Get more details');
    })
});

module.exports = router;