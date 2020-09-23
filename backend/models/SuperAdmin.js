const mongoose = require("mongoose");

const SuperAdminSchema = new mongoose.Schema({
	username: {
		type: String,
		required: true,
	},
	first_name: {
		type: String,
		required: true,
	},
	last_name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	pass: {
		type: String,
		required: true,
	},
	avatar: {
		type: String,
	},
	regDate: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("superAdmins", SuperAdminSchema);
