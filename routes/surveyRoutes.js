const mongoose = require("mongoose"),
	Survey = mongoose.model("surveys"),
	Mailer = require("../services/Mailer"),
	requireLogin = require("../middlewares/requireLogin"),
	requireCredits = require("../middlewares/requireCredits"),
	surveyTemplate = require("../services/emailTemplates/surveyTemplate");

module.exports = (app) => {
	app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
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
		try {
			await mailer.send();
			await survey.save();
			req.user.credits -= 1;
			const user = await req.user.save();

			res.send(user);
		} catch (err) {
			res.status(422).send(err);
		}
	});
};
