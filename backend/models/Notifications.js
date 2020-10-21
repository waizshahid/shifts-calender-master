const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
	currentUserId: {
		type: String
	},
	adminresponse: {
		type:String,  
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
	shiftName:{
		type: String
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
		required: true
	},
	messageFrom: {
		type: String
	},
	requestStatus: {
		type: String
	}
	
});

module.exports = mongoose.model("notifications", notificationSchema);
