const mongoose = require("mongoose");
const UserModel = require("../models/User");
const CookieStrategy = require("passport-cookie").Strategy;
const jwtDecode = require("jwt-decode");

module.exports = (passport) => {
  passport.use(
    new CookieStrategy(
      {
        cookieName: "UTK",
        passReqToCallback: true,
      },
      function (req, token, done) {
        const payload = jwtDecode(token.slice(7));
        UserModel.findById(payload.id).then((user) => {
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        });
      }
    )
  );
};
