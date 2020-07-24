const router = require('express').Router();

const Room = require('../models/room');
const User = require('../models/user');
const { isAdminLoggedIn, isUserLoggedIn } = require('../utils/ensureAuth');
const { sendText } = require('../config/otpService');

router.get('/', (req, res) => {
    Room.find()
        .then(rooms => res.send(rooms, { user: req.user }))
        .catch(err => res.status(400).send({ err }))
});

router.get('/create', isAdminLoggedIn, (req, res) => {
    res.render('createRoom', { user: req.user });
})

router.post('/create', isAdminLoggedIn, (req, res) => {
    const { name, typeOfSquad, map, matchType, minKills, datetime, entryFee, killReward, firstReward, secondReward } = req.body;
    console.log(req.body);

    const teamObj = {
        "Solo": 100,
        "Duo": 50,
        "Squad": 25,
    }

    let teams = teamObj[typeOfSquad];

    if (matchType == 'TDM') {
        teams = 2;
    }

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
        minKills,
        teams,
    })

    newRoom.save()
        .then(room => res.redirect('/'))
        .catch(err => res.status(400).send({ err }))
})

router.get('/sendMessage/:id', isAdminLoggedIn, (req, res) => {
    const { id } = req.params;
    Room.findOne({ _id: id })
        .then(room => {
            if (!room) { }
            else {
                return res.render('sendMessage', { user: req.user, room })
            }
        })
        .catch(err => res.status(400).send({ err }))
    // TODO: FIX IT
});

router.post('/sendMessage/:id', isAdminLoggedIn, (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    Room.findOne({ _id: id })
        .then(room => {
            if (!room) { }
            else {
                return User.find({ _id: { $in: room.players } })
            }
        })
        .then(users => {
            if (users) {
                users.forEach(user => {
                    console.log(user);
                    sendText(`+${user.phone}`, message)
                        .then(data => console.log(data));
                });
            } else {
                return res.redirect('/', { user: req.user })
            }
        })
        .catch(err => res.status(400).send({ err }))
    // TODO: FIX IT
});

router.get('/viewPlayers/:id', isAdminLoggedIn, (req, res) => {
    const { id } = req.params;
    Room.findOne({ _id: id })
        .then(room => {
            if (!room) { }
            else {
                return User.find({ _id: { $in: room.players } })
            }
        })
        .then(users => {
            if (users) {
                return res.render('players', { users, user: req.user });
            } else {
                return res.redirect('/')
            }
        })
        .catch(err => res.status(400).send({ err }))
    // TODO: FIX IT
})


router.get('/:id', isUserLoggedIn, isUserVerified, (req, res) => {
    const { id } = req.params;
    Room.findOne({ _id: id })
        .then(room => res.render('tournamentDet', { room, user: req.user }))
        .catch(err => res.status(400).send({ err }))
})

module.exports = router;