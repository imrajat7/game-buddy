const Room = require('../models/room');

const router = require('express').Router();

router.get('/', (req, res) => {
    console.log(req.user);
    Room.find()
        .then(rooms => res.render('matchSchedule', { rooms, user: req.user }))
        .catch(err => res.status(400).send({ err }))
});

module.exports = router;