const mongoose = require("mongoose");

let transactionSchema = mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  balRemains: {
    type: Number,
  },
  transactionTime: {
    type: Date,
    default: Date.now(),
  },
  transactionType: {
    type: String,
    enum: ["Deposit", "Withdraw"],
  },
  doneBy: {
    type: mongoose.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Transaction", transactionSchema);
