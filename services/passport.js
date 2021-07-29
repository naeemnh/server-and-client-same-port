const passport = require('passport'),
	GoogleStrategy = require('passport-google-oauth20').Strategy,
	mongoose = require('mongoose'),
	keys = require('../config/keys');

const User = mongoose.model('users');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => done(null, user));
});

passport.use(
	new GoogleStrategy(
		{
			clientID: keys.googleClientID,
			clientSecret: keys.googleClientSecret,
			callbackURL: '/auth/google/callback',
			proxy: true,
		},
		async (accessToken, refreshToken, profile, done) => {
			// user information is available in database
			const existingUser = await User.findOne({ googleId: profile.id });
			if (existingUser) return done(null, existingUser);

			// user logging in or signing up for the first time
			const newUser = await new User({ googleId: profile.id }).save();
			done(null, newUser);
		}
	)
);
