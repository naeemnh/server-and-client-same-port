const express = require("express"),
	app = express(),
	mongoose = require("mongoose"),
	cookieSession = require("cookie-session"),
	passport = require("passport"),
	keys = require("./config/keys"),
	bodyParser = require("body-parser");

require("./models/User");
require("./models/Survey");
require("./services/passport");

mongoose.connect(keys.mongoURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
});

app.use(bodyParser.json());

app.use(
	cookieSession({
		maxAge: 1000 * 60 * 60 * 24 * 30,
		keys: [keys.cookieKey],
	})
);

app.use(passport.initialize());
app.use(passport.session());

require("./routes/authRoutes")(app);
require("./routes/billingRoutes")(app);
require("./routes/surveyRoutes")(app);

if (process.env.NODE_ENV === "production") {
	// Express will serve up production assets
	// like our main.js file, main.css file
	app.use(express.static("client/build"));

	// Express  will serve up the index.html file
	// if it doesn't recognize the route
	const path = require("path");
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
