const mongoose = require("mongoose");

const loanSchema = new mongoose.Schema({
  loanId: {
    type: String,
    required: true,
    unique: true
  },

  customerId: {
    type: String,
    required: true
  },

  loanAmount: {
    type: Number,
    required: true
  },

  outstandingAmount: {
    type: Number,
    required: true
  },

  goldDetails: String,

  weight: Number,

  interestRate: {
    type: Number,
    default: 2.0
  },

  documentCharge: {
    type: Number,
    default: 0
  },

  status: {
    type: String,
    enum: ["ACTIVE", "CLOSED"],
    default: "ACTIVE"
  },

  issuedDate: {
    type: Date,
    default: Date.now
  },

  closedDate: Date
});

module.exports = mongoose.model("Loan", loanSchema);
