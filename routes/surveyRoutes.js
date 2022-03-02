const mongoose = require("mongoose"),
	Survey = mongoose.model("surveys"),
	Mailer = require("../services/Mailer"),
	requireLogin = require("../middlewares/requireLogin"),
	requireCredits = require("../middlewares/requireCredits"),
	surveyTemplate = require("../services/emailTemplates/surveyTemplate");

module.exports = (app) => {
	app.post("/api/surveys", requireLogin, requireCredits, (req, res) => {
		const { title, subject, body, recipients } = req.body;

		const survey = new Survey({
			title,
			subject,
			body,
			recipients: recipients.split(",").map((email) => ({ email })),
			_user: req.user._id,
			dateSent: Date.now(),
		});

		// Sending an email
		const mailer = new Mailer(survey, surveyTemplate(survey));
		mailer.send();
	});
};
