const express = require('express');
const router = express.Router();
const userauth = require('../middleware/userauth');
const { check, validationResult } = require('express-validator');
const NotificationEmail = require('../models/notificationEmail');
var bodyParser = require('body-parser');
router.use(bodyParser.json());

router.get('/getEmails', (req, res) => {
	NotificationEmail.find()
		.then((allEmails) => {
			res.send(allEmails);
		})
		.catch((err) => {
			res.send(err);
		});
});

router.post('/createEmail', async (req, res) => {
	// console.log(req.body);
	if (req.body === null) res.status(400).send('Bad Request');

	let emailFound = await NotificationEmail.findOne({ email: req.body.email });
	if (emailFound) {
		res.status(400).send('Email already exist');
	} else {
		let newEmail = new NotificationEmail({
			email: req.body.email,
		});

		// console.log('Shift created as: ' + newEmail);
		newEmail
			.save()
			.then((newEmail) => res.send(newEmail))
			.catch((err) => console.log(err));
	}
});

router.put('/updateEmail/:id', async (req, res) => {
	// console.log(req.body);
	if (req.params.id === null) res.status(400).send('Bad Request');

	let emailAlreadyFound = await NotificationEmail.findOne({ email: req.body.email });
	if (emailAlreadyFound) {
		res.status(400).send('Email already exist');
	}
	let emailFound = await NotificationEmail.findOne({ _id: req.params.id });
	if (emailFound) {
		emailFound.email = req.body.newData.email;
		emailFound
			.save()
			.then((emailFound) => res.send(emailFound))
			.catch((err) => console.log(err));
	} else {
		res.send('Email not found');
	}
});

router.delete('/deleteEmail/:id', async (req, res) => {
	// console.log(req.body);
	if (req.params.id === null) res.status(400).send('Bad Request');
	NotificationEmail.findByIdAndDelete(req.params.id)
		.then((resp) => {
			res.send('Email Deleted Successfully');
		})
		.catch((err) => {
			res.send(err);
		});
});

module.exports = router;
