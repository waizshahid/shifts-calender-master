const mongoose = require("mongoose");

const ShiftSchema = new mongoose.Schema({
	shiftname: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		required: true,
	},
});

module.exports = mongoose.model("shifts", ShiftSchema);
