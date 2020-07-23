var AWS = require('aws-sdk');

const sendOtp = (phone, OTP) => {
    console.log(phone, OTP)
    let params = {
        Message: `Your GameBuddy OTP is ${OTP}`,
        PhoneNumber: phone,
        MessageAttributes: {
            'AWS.SNS.SMS.SMSType': {
                DataType: 'String',
                StringValue: 'Transactional'
            },
            'AWS.SNS.SMS.SenderID': {
                'DataType': 'String',
                'StringValue': 'GAMEBUDDY'
            }
        }
    };

    return new AWS.SNS().publish(params).promise();
}

module.exports = sendOtp;