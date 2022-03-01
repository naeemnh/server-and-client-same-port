const sendgrid = require('sendgrid'),
	helper = sendgrid.mail,
	keys = require('../config/keys');

class Mailer extends helper.Mail {
	constructor({ subject, recipients }, content) {
		super();

		this.sgApi = sendgrid(keys.sendGridKey);
		this.fom_email = new helper.Email('no-reply@emaily.com');
		this.subject = subject;
		this.body = new helper.Content('text/html', content);
		this.recipients = this.formatAddresses(recipients);

		this.addContent(this.body);
		this.addClickTracking();
		this.addRecipients();
	}

	// formatting the email address from string to particular email objs
	formatAddresses(recipients) {
		return recipients.map(({ email }) => {
			return new helper.Email(email);
		});
	}

	addClickTracking() {
		const trackingSettings = new helper.TrackingSettings();
		const clickTracking = new helper.ClickTracking(true, true);

		trackingSettings.setClickTracking(clickTracking);
		this.addTrackingSettings(trackingSettings);
	}

	addRecipients() {
		const personalize = new helper.Personalization();
		this.recipients.forEach((recipient) => {
			personalize.addTo(recipient);
		});
		this.addPersonalization(personalize);
	}

	async send() {
		const request = this.sgApi.emptyRequest({
			methosd: 'POST',
			path: '/v3/mail/send',
			body: this.toJSON(),
		});

		const response = this.sgApi.API(request);
		return response;
	}
}

module.exports = Mailer;