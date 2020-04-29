const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    method: {
      type: String,
      enum: ["local", "google", "facebook"],
      require,
    },
    local: {
      email: {
        type: String,
        lowercase: true,
      },
      password: {
        type: String,
      },
      isConfirmed:{
        type:Boolean,
        defaultValue: false,
      }
    },
    google: {
      id: {
        type: String,
      },
      email: {
        type: String,
        lowercase: true,
      },
      displayName: {
        type: String,
      },
      name: {
        familyName: {
          type: String,
        },
        givenName: {
          type: String,
        },
      },
      image: {
        url: {
          type: String,
        },
      },
    },
    facebook: {
      id: {
        type: String,
      },
      email: {
        type: String,
        lowercase: true,
      },
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      minlength: 3,
    },
    details: {
      name: {
        type: String,
      },
      address: {
        type: String,
      },
      phone: {
        type: Number,
      },
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
