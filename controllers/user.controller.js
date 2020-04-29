const User = require("../models/user.model");
const Booking = require("../models/booking.model");

exports.getUsers = (req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error:" + err));
};

exports.patchUpdateUser = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (req.body.name) {
        user.details.name = req.body.name;
      }
      if (req.body.address) {
        user.details.address = req.body.address;
      }
      if (req.body.phone) {
        user.details.phone = req.body.phone;
      }

      user
        .save()
        .then(() => {
          res.json("user added" + user);
        })
        .catch((err) => res.status(400).json("error:" + err));
    })
    .catch((err) => res.status(400).json("error:" + err));
};
