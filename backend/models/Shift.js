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
	editable: {
		type: String,
		required: true,
	},
	priority: {
		type: Number,
		required: true,
		unique: true
	}
	
});

module.exports = mongoose.model("shifts", ShiftSchema);
