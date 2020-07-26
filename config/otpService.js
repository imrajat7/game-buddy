var AWS = require('aws-sdk');

const sendOTP = (phone, OTP) => {
    console.log(phone, OTP);
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

const sendText = (phone, text) => {
    let params = {
        Message: text,
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

module.exports = { sendOTP, sendText };