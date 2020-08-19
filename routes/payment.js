const router = require('express').Router();
const Razorpay = require('razorpay');
const { isUserLoggedIn } = require('../utils/ensureAuth');
const Tournament = require('../models/tournament');

const shortid = require('shortid');

const instance = new Razorpay({
    key_id: process.env.RAZOR_KEY_ID,
    key_secret: process.env.RAZOR_KEY_SECRET,
})

router.post('/join/:id', isUserLoggedIn, (req, res) => {
    Tournament.findOne({ _id: req.params.id })
        .then(tournament => {
            if (!tournament) {
                res.status(400).send({ err })
            } else {
                if (tournament.teamsJoined == tournament.teams) {
                    return res.status(400).send('Tournament Full');
                }

                else {

                    instance.orders.create({
                        amount: tournament.entryFee * 100,
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

router.post("/verify", (req, res) => {
    const tournamentId = req.headers.referer.split('/').pop();
    body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    var crypto = require("crypto");
    var expectedSignature = crypto.createHmac('sha256', process.env.RAZOR_KEY_SECRET)
        .update(body.toString())
        .digest('hex');
    if (expectedSignature === req.body.razorpay_signature) {
        Tournament.findByIdAndUpdate(tournamentId, { $push: { players: req.user._id }, $inc: { teamsJoined: 1 } }, { new: true })
            .then(tournament => res.status(200).send('Payment successful!'))
            .catch(err => res.status(400).send({ err: 'ERR' }));

    } else {
        res.status(400).send({ err: 'ERR' })
    }
});

router.post("/freeJoin/:id", (req, res) => {
    Tournament.findByIdAndUpdate(req.params.id, { $push: { players: req.user._id }, $inc: { teamsJoined: 1 } }, { new: true })
        .then(tournament => res.status(200).send('Registration Successful!'))
        .catch(err => res.status(400).send({ err: 'ERR' }));
});

module.exports = router;