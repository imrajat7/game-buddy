const router = require('express').Router();

const Room = require('../models/room');
const { isAdminLoggedIn, isUserLoggedIn } = require('../utils/ensureAuth');

router.get('/', (req, res) => {
    Room.find()
        .then(rooms => res.send(rooms, { user: req.user }))
        .catch(err => res.status(400).send({ err }))
});

router.get('/create', isAdminLoggedIn, (req, res) => {
    res.render('createRoom', { user: req.user });
})

router.post('/create', isAdminLoggedIn, (req, res) => {
    const { name, typeOfSquad, map, matchType, datetime, entryFee, killReward, firstReward, secondReward } = req.body;
    console.log(req.body);

    const newRoom = new Room({
        name,
        typeOfSquad,
        map,
        matchType,
        datetime,
        entryFee,
        firstReward,
        secondReward,
        killReward,
    })

    newRoom.save()
        .then(room => res.redirect('/'))
        .catch(err => res.status(400).send({ err }))
})

router.get('/delete/:id', isAdminLoggedIn, (req, res) => {
    const { id } = req.params;
    // Room.deleteOne({ _id: id })
    // TODO: FIX IT
    // .then(room => res.redirect('/'))
    // .catch(err => res.status(400).send({ err }))
})


router.get('/:id', isUserLoggedIn, (req, res) => {
    const { id } = req.params;
    Room.findOne({ _id: id })
        .then(room => res.render('tournamentDet', { room, user: req.user }))
        .catch(err => res.status(400).send({ err }))
})

module.exports = router;