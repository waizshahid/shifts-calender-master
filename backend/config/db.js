const mongoose = require("mongoose");

var conn = mongoose
  .connect("mongodb://localhost/shifts-calender", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to mongoDB!"))
  .catch((err) => console.log("Could not connect to mongoDB... \n", err));

module.exports = conn;
