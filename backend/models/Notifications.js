const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
	
	to: {
		type: String,
		required: true,
    },
    from: {
		type: String,
		required: true,
    },
    notification: {
		type: String,
		required: true,
	}
	
});

module.exports = mongoose.model("notifications", notificationSchema);
