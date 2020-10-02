const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
	currentUserId: {
		type: String
	},
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
	},
	regDate: {
		type: String,
		required: true,
	},
	requesterType: {
		type: String,
	},
	messageFrom: {
		type: String
	},
	requestStatus: {
		type: String
	}
	
});

module.exports = mongoose.model("notifications", notificationSchema);
