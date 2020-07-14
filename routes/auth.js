const router = require('express').Router();

var AWS = require('aws-sdk');

router.get('/login', (req, res) => {

    // TODO - Move this code to a controller, and store the OTP for matching (for the next 5 minutes)

    var params = {
        Message: req.query.message,
        PhoneNumber: `+${req.query.number}`,
        MessageAttributes: {
            'AWS.SNS.SMS.SMSType': {
                DataType: 'String',
                StringValue: 'Transactional'
            },
            'AWS.SNS.SMS.SenderID': {
                'DataType': 'String',
                'StringValue': req.query.subject
            }
        }
    };

    var publishTextPromise = new AWS.SNS().publish(params).promise();

    publishTextPromise
        .then(data => res.send({ MessageID: data.MessageId }))
        .catch(err => res.send({ Error: err }));

});

module.exports = router;