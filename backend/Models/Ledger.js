const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
  loanId: { type: String, required: true },      // link to specific loan
  date: { type: Date, default: Date.now },       // transaction date
  type: { type: String, enum: ["CREDIT", "DEBIT","INTEREST"], required: true }, // CREDIT = loan disbursed, DEBIT = payment
  amount: { type: Number, required: true },
  balance: { type: Number, required: true },     // remaining balance after this transaction
  note: { type: String }                         // optional note
});

module.exports = mongoose.model("Ledger", ledgerSchema);
