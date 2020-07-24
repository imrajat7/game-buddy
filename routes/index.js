const Room = require('../models/room');

const router = require('express').Router();

router.get('/', (req, res) => {
    console.log(req.user);
    Room.find({ datetime: { $gte: Date.now() } })
        .then(rooms => res.render('matchSchedule', { rooms, user: req.user }))
        .catch(err => res.status(400).send({ err }))
});

router.get('/privacyPolicy', (req, res) => {
    res.render('privacyPolicy');
});

module.exports = router;