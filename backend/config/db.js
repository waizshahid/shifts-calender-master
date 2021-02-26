const mongoose = require("mongoose");

var conn = mongoose
	.connect("mongodb+srv://USER1:USER1@cluster0.xkczw.mongodb.net/ShiftCalender?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connected to mongoDB!"))
	.catch((err) => console.log("Could not connect to mongoDB... \n", err));

module.exports = conn;
