const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");

const stripe = require("stripe")("sk_test_51H5oBzGGRkVJlDCl2lf2c4An9AVcSvDlTSRwk3fYOx3RE5zGREhIeYVmWhUhDD8TA0okmNbRBIvfHSEh54VYYz9W00XmlgWOll");

require('dotenv').config();

const app = express();

app.set('view engine', 'hbs');
app.use(cookieParser());
app.use(express.static('static'));

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




app.use('/auth', require('./routes/auth'));
app.use('/room', require('./routes/room'));

app.post("/create-payment-intent", async (req, res) => {
    const { items } = req.body;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: "1000",
      currency: "inr"
    });
    console.log(paymentIntent);
    res.send({
      clientSecret: paymentIntent.client_secret
    });
  });

app.get('/', (req, res) => {
    // Test for rendering pages
    res.render('checkout');
})

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Listening on ${PORT}`)
})