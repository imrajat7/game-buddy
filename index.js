const express = require('express');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();

app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})