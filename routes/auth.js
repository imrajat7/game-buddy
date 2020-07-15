const router = require('express').Router();

const User = require('../models/user');
const sendOTP = require('../config/otpService');

router.post('/sendOTP', (req, res) => {

    const { phone } = req.body;
    const OTP = Math.floor(100000 + Math.random() * 900000);

    sendOTP(phone, OTP)
        .then(data => {
            User.findOne({ phone })
                .then(user => {
                    if (!user) {
                        // User dosn't exist; create new user
                        const newUser = new User({
                            phone,
                            OTP,
                            OTPValidTill: Date.now() + (5 * 60 * 1000), //For 5 minutes in the future
                        });
                        return newUser.save();
                    } else {
                        // User exists, updating user
                        user = {...user,
                            OTP,
                            OTPValidTill: Date.now() + (5 * 60 * 1000),
                        }
                        return user.save();
                    }
                })
                .then(user => res.status(200).send(user))
                .catch(err => console.error(err));
        })
        .catch(err => res.send({ error: err }));
});

module.exports = router;