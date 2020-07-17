const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");

require('dotenv').config();

const app = express();

app.set("view engine", "hbs");
app.use(cookieParser());
app.use(express.static("static"));

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

app.use(bodyParser.json());

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

app.get('/', (req, res) => {
    // Test for rendering pages
    res.render('home');
})

app.use('/auth', require('./routes/auth'));
app.use('/room', require('./routes/room'));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})