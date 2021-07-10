const app = require('express')(),
	mongoose = require('mongoose'),
	cookieSession = require('cookie-session'),
	passport = require('passport'),
	keys = require('./config/keys');
require('./models/User');
require('./services/passport');

mongoose.connect(keys.localMongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
});

app.use(
	cookieSession({
		maxAge: 1000 * 60 * 60 * 24 * 30,
		keys: [keys.cookieKey],
	})
);

app.use(passport.initialize());
app.use(passport.session());

require('./routes/authRoutes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT);
