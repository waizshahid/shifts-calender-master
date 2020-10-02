const mongoose = require("mongoose");

const createShift = new mongoose.Schema({
  userId: {
		type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'users'
  },
  shiftTypeId: {
		type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'shifts'
  },
  offApprovalStatus: {
    type: String,
  },
  requestApprovalStatus: {
      type: String,
  },
  swapable:{
    type: String,
    required: true,
  },
 
  start: {
    type: String,
    required: true,
  },
  end: {
    type: String,
    required: true,
  },
   
  comment: {
    type: String,
  }
});

module.exports = mongoose.model("shiftAssigned", createShift);
