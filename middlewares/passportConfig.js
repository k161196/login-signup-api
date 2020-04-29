const GooglePlusToken = require("passport-google-plus-token");
const User = require("../models/user.model");
require("dotenv").config();
function initializePassport(passport) {
  passport.use(
    "googleToken",
    new GooglePlusToken(
      {
        clientID: process.env.googleClientID,
        userSecret: process.env.googleUserSecret,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(accessToken);
          console.log(profile);

          //check existing user
          const existingUser = await User.findOne({ "google.id": profile.id });

          if (existingUser) {
            console.log("exist" + existingUser);
            done(null, existingUser);
            // return existingUser;
          }
          console.log;
          const newUser = new User({
            method: "google",
            google: {
              id: profile.id,
              email: profile.emails[0].value,
              displayName: profile.displayName,
              name: {
                familyName: profile.name.familyName,
                givenName: profile.name.givenName,
              },
              image: {
                url: profile.photos[0].value,
              },
            },
          });
          await newUser.save();
          done(null, newUser);
        } catch (err) {
          done(err, false, err.message);
        }
      }
    )
  );
}

module.exports = initializePassport;
