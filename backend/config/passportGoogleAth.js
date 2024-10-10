const express = require("express");
const mongoose = require('mongoose');
const app  = express();
const Admin = require('../models/coreModel/admin.js'); // Adjust the path as necessary
var cors = require('cors');
const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth20').Strategy;


  // Passport setup
passport.use(
    new GoogleStrategy(
      {
        clientID:  process.env.clientID,
        clientSecret:  process.env.clientSecret,
        callbackURL: '/auth/google/callback',
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        console.log(profile)
        // Find or create the user
        const user = await Admin.findOne({ email: profile.emails[0].value });
        if (user) {
          return done(null, user);
        } else {
          const newUser = new Admin({
            name: profile.displayName,
            email: profile.emails[0].value,
            enabled : true,
          });
          await newUser.save();
          done(null, newUser);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  
  passport.deserializeUser(async (id, done) => {
    const user = await Admin.findById(id);
    done(null, user);
  });

  module.exports = app;