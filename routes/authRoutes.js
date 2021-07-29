const passport = require('passport');

module.exports = (app) => {
	// beginning of login flow
	app.get(
		'/auth/google',
		passport.authenticate('google', { scope: ['profile', 'email'] })
	);

	// authentication callback
	app.get(
		'/auth/google/callback',
		passport.authenticate('google'),
		(req, res) => {
			res.redirect('/surveys');
		}
	);

	// user logout
	app.get('/api/logout', (req, res) => {
		req.logout();
		res.redirect('/');
	});

	// To retrieve details of the use that is logged in
	app.get('/api/current_user', (req, res) => {
		res.send(req.user);
	});
};

// Note: passport.authenticate() is used for authentication
