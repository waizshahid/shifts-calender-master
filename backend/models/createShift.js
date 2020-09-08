const mongoose = require("mongoose");

const createShift = new mongoose.Schema({

  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },

  color: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("shiftAssigned", createShift);
