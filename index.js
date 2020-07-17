const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')

require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/game-buddy", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

const db = mongoose.connection;
db.once("open", () => {
  console.log("DB connected");
});
db.on("error", (err) => {
  console.log("Error occured while connection");
});

app.use("/auth", require("./routes/auth"));
app.use("/room", require("./routes/room"));
app.use("/user", require("./routes/user"));

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
