const Tournament = require('../models/tournament');

const router = require('express').Router();

router.get('/', (req, res) => {
    console.log(req.user);
    Tournament.find({ datetime: { $gte: Date.now() } }).sort({datetime: 1})
        .then(tournaments => res.render('matchSchedule', { tournaments, user: req.user }))
        .catch(err => res.status(400).send({ err }))
});

router.get('/terms-conditions', function (req, res) {
    res.render('terms-conditions', { user: req.user });
});

router.get('/leaderboard', function (req, res) {
    res.render('leaderboard', { user: req.user });
});
    
router.get('/rules', function (req, res) {
    res.render('rules', { user: req.user });
});

module.exports = router;