const mongoose = require('mongoose'),
	requireLogin = require('../middlewares/requireLogin'),
	requireCredits = require('../middlewares/requireCredits'),
	Survey = mongoose.model('surveys'),
	surveyTemplate = require('../services/emailTemplates/surveyTemplate');

module.exports = (app) => {
	app.post('/api/surveys', requireLogin, requireCredits, (req, res) => {
		const { title, subject, body, recipients } = req.body;

		const survey = new Survey({
			title,
			subject,
			body,
			recipients: recipients.split(',').map((email) => ({ email })),
			_user: req.user._id,
			dateSent: Date.now(),
		});

		// Sending an email
		const mailer = new Mailer(survey, surveyTemplate(survey));
		mailer.send();
	});
};
