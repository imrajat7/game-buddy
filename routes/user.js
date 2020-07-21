const { isUserLoggedIn } = require('../utils/ensureAuth');
const User = require('../models/user');

const router = require('express').Router();

router.get('/moreDetails', isUserLoggedIn, (req, res) => {
    console.log(req.user);
    res.render('getMoreDetails');
});

router.post('/moreDetails', isUserLoggedIn, (req, res) => {
    const { name, pubgUsername, referral } = req.body;
    User.findOneAndUpdate({ _id: req.user._id, isRegistered: false },
        { name, pubgUsername, isRegistered: true })
        .then(currUser => User.findOneAndUpdate({ referralCode: referral }, { $inc: { referralCount: 1 } }))
        .then(user => res.redirect('/'))
        .catch(err => res.status(400).send({ err }))
});

module.exports = router;