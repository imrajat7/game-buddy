const router = require('express').Router();

const Razorpay = require('razorpay');

const instance = new Razorpay({
    key_id: process.env.RAZOR_KEY_ID,
    key_secret: process.env.RAZOR_KEY_SECRET,
})

router.get('/', (req, res) => {
    console.log('yaya')
    res.render('checkout');
});

router.post('/order', (req, res) => {
    console.log(req.body);
    params = req.body;
    instance.orders.create(params)
        .then((data) => { console.log(data); res.json({ "sub": data, "status": "success" }) })
        .catch((error) => res.send({ "sub": error, "status": "failed" }));
});

router.post("/verify", (req, res) => {
    body = req.body.razorpay_order_id + "|" + req.body.razorpay_payment_id;
    var crypto = require("crypto");
    var expectedSignature = crypto.createHmac('sha256', '<your secret>')
        .update(body.toString())
        .digest('hex');
    console.log("sig" + req.body.razorpay_signature);
    console.log("sig" + expectedSignature);
    var response = { "status": "failure" }
    if (expectedSignature === req.body.razorpay_signature)
        response = { "status": "success" }
    res.send(response);
});

module.exports = router;