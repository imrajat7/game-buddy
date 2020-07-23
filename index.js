const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const ejs = require('ejs');
const helmet = require('helmet');
const room = require('./models/room');
const { authMiddleware } = require('./utils/ensureAuth');
// const csurf = require('csurf');

require('dotenv').config();

const app = express();

app.use(helmet());

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(bodyParser.json());

app.use(cookieParser());

app.set('view engine', 'ejs');
app.use(express.static('public'));

mongoose
    .connect(
        process.env.MONGO_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        }
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

app.use(authMiddleware);

app.use('/auth', require('./routes/auth'));
app.use('/room', require('./routes/room'));
app.use('/payment', require('./routes/payment'));
app.use('/user', require('./routes/user'));
app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})