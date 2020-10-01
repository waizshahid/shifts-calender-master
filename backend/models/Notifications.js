const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
	shiftTo:{
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'shiftAssigned'
	},
	shiftFrom:{
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'shiftAssigned'
	},	
	to: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'users'
    },
    from: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: 'users'
    },
    message: {
		type: String,
		required: true,
	}
	
});

module.exports = mongoose.model("notifications", notificationSchema);
