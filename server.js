const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const GooglePlusToken = require("passport-google-plus-token");
const passport = require("passport");

const initializePassport = require("./middlewares/passportConfig");
initializePassport(passport);

require("dotenv").config(); //to use .env

const app = express();
const port = process.env.PORT || 5000;

/* ------------------------------ //middlewares ----------------------------- */

app.use(cors());
app.use(express.json());

/* ----------------- //connecting to mongodb using mongoose ----------------- */

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true, //to get rid of warning
});
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("mongo db connected");
});

/* -------------------------------- //routes -------------------------------- */

const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

app.use("/users", usersRouter);
app.use(authRouter);

/* ---------------------------- starting serer ---------------------------- */

app.listen(port, () => {
  console.log(`server is runing on port : ${port}`);
});
