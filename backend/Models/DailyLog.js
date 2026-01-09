const mongoose = require("mongoose");

const dailyLogSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },

  type: {
    type: String,
    enum: ["LOAN", "INTEREST", "EXPENSE", "INVESTMENT"],
    required: true
  },

  name: { type: String, required: true },

  debit: { type: Number, default: 0 },   // money out
  credit: { type: Number, default: 0 },  // money in

  balance: { type: Number, required: true },

  note: { type: String }
});

module.exports = mongoose.model("DailyLog", dailyLogSchema);
