const router = require('express').Router();

const Room = require('../models/room');

router.get('/', (req, res) => {
    Room.find()
        .then(rooms => res.send(rooms))
        .catch(err => res.status(400).send({ err }))
});

router.post('/', (req, res) => {
    const { name, mode, typeOfSquad, map, password }

    const newRoom = new Room({
        name,
        mode,
        typeOfSquad,
        map,
        password,
    })

    newRoom.save()
        .then(room => res.send(room))
        .catch(err => res.status(400).send({ err }))
})

router.post('/delete', (req, res) => {
    const { id } = req.body;
    Room.deleteOne({ _id: id })
        .then(room => res.send(room))
        .catch(err => res.status(400).send({ err }))
})


router.get('/:id', (req, res) => {
    const { id } = req.params;
    Room.findOne({ _id: id })
        .then(rooms => res.send(rooms))
        .catch(err => res.status(400).send({ err }))
})

module.exports = router;