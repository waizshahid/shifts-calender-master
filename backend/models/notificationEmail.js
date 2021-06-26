const mongoose = require('mongoose');

const notificationEmailSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model('notificationEmail', notificationEmailSchema);
