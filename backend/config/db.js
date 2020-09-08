const mongoose = require("mongoose");

var conn = mongoose
	.connect("mongodb+srv://haru:haru%23123@cluster0-wbquy.mongodb.net/shiftCalender?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log("Connected to mongoDB!"))
	.catch((err) => console.log("Could not connect to mongoDB... \n", err));

module.exports = conn;
