const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
    },
    phone: {
        type: Number,
        required: true,
        unique: true,
    },
    pubgUsername: String,  
    referralCode: { 
        type: String, 
        required: true,
        unique: true,
    },
    referralCount: {
        type: Number,
        default: 0,
    },
    OTP: Number,
    OTPValidTill: {
        type: Date,
    },
    isRegistered: {
        type: Boolean,
        default: false,
    },
    role: {
        type: String,
        default: 'user',
    },
});

module.exports = model('User', userSchema);