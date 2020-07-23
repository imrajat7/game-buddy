const { isUserLoggedIn } = require('../utils/ensureAuth');
const User = require('../models/user');
const user = require('../models/user');

const router = require('express').Router();

router.get('/moreDetails', isUserLoggedIn, (req, res) => {
    if (req.user.isRegistered) {
        return res.redirect('/dashboard');
    }
    return res.render('getMoreDetails', {user: req.user});
});

router.post('/moreDetails', isUserLoggedIn, (req, res) => {
    const { name, pubgUsername, referral } = req.body;
    
    const role = [917889608162,
        919468344399,
        917006903831,
        917018633907,
        916005637691,
        919821457141].includes(req.user.phone) ? 'admin' : 'user';

    User.findOneAndUpdate({ _id: req.user._id, isRegistered: false },
        { name, pubgUsername, isRegistered: true, role })
        .then(currUser => User.findOneAndUpdate({ referralCode: referral }, { $inc: { referralCount: 1 } }))
        .then(user => res.redirect('/'))
        .catch(err => res.status(400).send({ err }))
});

module.exports = router;