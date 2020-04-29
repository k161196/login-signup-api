const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");
let jwt = require("jsonwebtoken");
let config = require("../config/index");
const nodemailer = require("nodemailer");

let middleware = require("../middlewares/authMiddleware");

signToken = (user) => {
  return jwt.sign({ user }, config.secret, {
    expiresIn: "24h", // expires in 24 hours
  });
};

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.gmailID,
    pass: process.env.gmailPASS,
  },
});

exports.postLogin = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(req.body);

  const errors = validationResult(req);
  console.log("validator errors:" + errors);
  if (!errors.isEmpty()) {
    return res.status(422).json("Error:" + errors.array()[0].msg);
  }
  User.findOne({ "local.email": email }).then((user) => {
    if (!user) {
      return res.status(400).json("user not exist");
    }
    if (!user.local.isConfirmed) {
      return res.status(400).json("user not confirmed plz confirm email");
    }
    bcrypt
      .compare(password, user.local.password)
      .then((doMatch) => {
        console.log("enter in do match");
        if (doMatch) {
          console.log("pass word match");
          console.log(user.id);
          const token = signToken(user.id);
          // return res.json(user);
          // let token = jwt.sign({user}, config.secret, {
          //   expiresIn: "24h", // expires in 24 hours
          // });
          console.log(token);
          return res.json({
            success: true,
            message: "Authenticated Successfull",
            token: token,
            // user:{
            //   id:user.local._id,
            //     email:user.local.email,
            // }
          });
        }
        return res.status(400).json("invalid pass");
      })
      .catch((err) => {
        return res.status(400).json("Error:" + err);
      });
    // return res.json(user);
  });
};

exports.postSignup = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json("Error:" + errors.array()[0].msg);
  }
  User.findOne({ "local.email": email }).then((user) => {
    if (user) {
      return res.status(400).json("user exist");
    }
    bcrypt
      .hash(password, 12)
      .then((hashedPassword) => {
        const user = new User({
          method: "local",
          "local.email": email,
          "local.password": hashedPassword,
        });
        return user.save();
      })
      .then((result) => {
        let emailToken = jwt.sign({ email: email }, config.secret, {
          expiresIn: "24h", // expires in 24 hours
        });

        const url = `http://localhost:5000/confirmation/${emailToken}`;

        // * use when sending mail

        transporter.sendMail(
          {
            to: email,
            subject: "Confirm Email",
            html: `Please click this email to confirm your email: <a href="${url}">${url}</a>`,
          },
          function (error, info) {
            if (error) {
              console.log(error);
            } else {
              console.log("Email sent: " + info.response);
            }
          }
        );
        return res.json({
          success: true,
          message: "Authenticated Successfull",
          token: emailToken,
          // user:user
        });
      })
      .catch((err) => res.status(400).json("Error:" + err));
  });
};

exports.oauthGoogle = (req, res) => {
  console.log("hi from auth con oauth");
  const token = signToken(req.user.id);
  return res.json({
    success: true,
    message: "Authenticated Successfull",
    token: token,
    // user:user
  });
};

exports.confirmationEmail = (req, res) => {
  console.log("enetr in token check email confirm");
  let token = req.params.token; // Express headers are auto converted to lowercase
  if (!token) {
    return res.json({
      success: false,
      message: "Link expired",
    });
  }
  if (token.startsWith("Bearer ")) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }
  console.log(token);
  //   console.log(req.params.id);
  const payload = jwt.verify(token, config.secret, { ignoreExpiration: true });
  console.log(payload.email);
  User.findOne({ "local.email": payload.email }).then((user) => {
    if (!user) {
      return res.status(400).json("user not exist");
    }
    if (token) {
      jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          return res.json({
            success: false,
            message: "Token is not valid",
          });
        } else {
          user.local.isConfirmed = true;
          user
            .save()
            .then(res.json("user confirmed"))
            .catch((err) => res.status(400).json("err" + err));

          // });
          // if(payload.email===req.params.id){
          // //   console.log("decode:"+decoded)
          // //   req.decoded = decoded;
          // // next();
          // }else{
          //   console.log("token exist but use not exact");
          //   return res.json({
          //     success: false,
          //     message: "Token is valid user does not match"
          //   });
          // }
        }
      });
    }
  });
};
