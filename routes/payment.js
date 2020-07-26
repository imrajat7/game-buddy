const router = require('express').Router();
const Razorpay = require('razorpay');
const { isUserLoggedIn } = require('../utils/ensureAuth');
const Room = require('../models/room');

const shortid = require('shortid');

const instance = new Razorpay({
    key_id: process.env.RAZOR_KEY_ID,
    key_secret: process.env.RAZOR_KEY_SECRET,
})

router.post('/join/:id', isUserLoggedIn, (req, res) => {
    Room.findOne({ _id: req.params.id })
        .then(room => {
            if (!room) {
                res.status(400).send({ err })
            } else {
                if (room.teamsJoined == room.teams) {
                    return res.status(400).send('Room Full');
                }

                else {

                    instance.orders.create({
                        amount: room.entryFee * 100,
                        currency: "INR",
                        receipt: shortid.generate(),
                        payment_capture: '1'
                    })
                        .then((data) => {
                            console.log(data);
                            res.json({ data, "status": "success" })
                        })
                        .catch((error) => res.send({ "sub": error, "status": "failed" }));
                }
            }
        })
        .catch(err => res.status(400).send({ err }));
});

// // TESTING
// router.post('/order', (req, res) => {
//     console.log(req.body);
//     params = req.body;
//     instance.orders.create(params)
//         .then((data) => { console.log(data); res.json({ "sub": data, "status": "success" }) })
//         .catch((error) => res.send({ "sub": error, "status": "failed" }));
// });

router.post("/verify", (req, res) => {
    const roomId = req.headers.referer.split('/').pop();
    body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    var crypto = require("crypto");
    var expectedSignature = crypto.createHmac('sha256', process.env.RAZOR_KEY_SECRET)
        .update(body.toString())
        .digest('hex');
    if (expectedSignature === req.body.razorpay_signature) {

        Room.findByIdAndUpdate(roomId, { $push: { players: req.user._id }, $inc: { teamsJoined: 1 } }, { new: true })
            .then(user => res.status(200).send('Payment successful!'))
            .catch(err => res.status(400).send({ err: 'ERR' }));

    } else {
        res.status(400).send({ err: 'ERR' })
    }
});

module.exports = router;