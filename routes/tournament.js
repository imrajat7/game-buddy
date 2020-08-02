const router = require('express').Router();

const Tournament = require('../models/tournament');
const User = require('../models/user');
const { isAdminLoggedIn, isUserLoggedIn } = require('../utils/ensureAuth');
const { sendText } = require('../config/otpService');

router.get('/create', isAdminLoggedIn, (req, res) => {
    res.render('createTournament', { user: req.user });
})

router.post('/create', isAdminLoggedIn, (req, res) => {
    const { name, typeOfSquad, map, numberOfMatches, prizePool, matchType, maxKillReward, note, datetime, entryFee, killReward, firstReward, secondReward, thirdReward, fourthReward, fifthReward } = req.body;
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

    const newTournament = new Tournament({
        name,
        typeOfSquad,
        numberOfMatches,
        map,
        matchType,
        datetime,
        prizePool,
        entryFee,
        firstReward,
        secondReward,
        thirdReward,
        fourthReward,
        fifthReward,
        maxKillReward,
        killReward,
        note,
        teams,
    })

    newTournament.save()
        .then(tournament => res.redirect('/'))
        .catch(err => res.status(400).send({ err }))
})

router.get('/sendMessage/:id', isAdminLoggedIn, (req, res) => {
    const { id } = req.params;
    Tournament.findOne({ _id: id })
        .then(tournament => {
            if (!tournament) { }
            else {
                return res.render('sendMessage', { user: req.user, tournament })
            }
        })
        .catch(err => res.status(400).send({ err }))
    // TODO: FIX IT
});

router.post('/sendMessage/:id', isAdminLoggedIn, (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    Tournament.findOneAndUpdate({ _id: id }, { $push: { messages: message } }, { new: true })
        .then(tournament => {
            if (!tournament) { }
            else {
                return User.find({ _id: { $in: tournament.players } })
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
    Tournament.findOne({ _id: id })
        .then(tournament => {
            if (!tournament) { }
            else {
                return User.find({ _id: { $in: tournament.players } })
            }
        })
        .then(users => {
            if (users) {
                return res.render('players', { users, user: req.user, tournamentId: id });
            } else {
                return res.redirect('/')
            }
        })
        .catch(err => res.status(400).send({ err }))
    // TODO: FIX IT
});

router.get('/phoneCSV/:id', isAdminLoggedIn, (req, res) => {
    const { id } = req.params;
    Tournament.findOne({ _id: id })
        .then(tournament => {
            if (!tournament) { }
            else {
                return User.find({ _id: { $in: tournament.players } }, 'phone -_id')
            }
        })
        .then(users => {
            if (users) {
                return res.render( 'phoneCSV' ,{ users });
            } else {
                return res.redirect('/')
            }
        })
        .catch(err => res.status(400).send({ err }))
    // TODO: FIX IT
});

router.post('/addPlayer/:id', isAdminLoggedIn, (req, res) => {
    const { phone } = req.body;
    const { id } = req.params;
    User.findOne({ phone: `91${phone}` })
        .then(user => {
            if (!user) {
                return res.send('No user');
            } else {
                return Tournament.findByIdAndUpdate(id, { $push: { players: user._id }, $inc: { teamsJoined: 1 } }, { new: true })
            }
        })
        .then(doc => res.redirect(`/tournament/viewPlayers/${id}`))
        .catch(err => res.status(400).send({ err }))
});

router.get('/:id', isUserLoggedIn, isUserVerified, (req, res) => {
    const { id } = req.params;
    Tournament.findOne({ _id: id })
        .then(tournament => res.render('tournamentDet', { tournament, user: req.user }))
        .catch(err => res.status(400).send({ err }))
});

router.get('/viewSlots/:id', isUserLoggedIn, (req, res) => {
    const { id } = req.params;
    Tournament.findOne({ _id: id })
        .then(tournament => {
            if (!tournament) { }
            else {
                return User.find({ _id: { $in: tournament.players } })
            }
        })
        .then(users => {
            if (users) {
                return res.render('slots', { users, user: req.user });
            } else {
                return res.redirect('/')
            }
        })
        .catch(err => res.status(400).send({ err }))
})

module.exports = router;