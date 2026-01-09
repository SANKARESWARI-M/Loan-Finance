const express = require("express");
const router = express.Router();
const DailyLog = require("../Models/DailyLog");
const Ledger = require("../Models/Ledger");
const Loan = require("../Models/Loan");
const Customer = require("../Models/customer");

// ---------------- HELPERS ----------------
const getLastBalance = async () => {
  const last = await DailyLog.findOne().sort({ date: -1 });
  return typeof last?.balance === "number" ? last.balance : 0;
};

// ---------------- GET ALL LOGS ----------------
router.get("/", async (req, res) => {
  try {
    const logs = await DailyLog.find().sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- ADD MANUAL EXPENSE ----------------
router.post("/add-expense", async (req, res) => {
  try {
    let { name, amount, note } = req.body;
    amount = Number(amount);

    if (!name || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid name or amount" });
    }

    const lastBalance = await getLastBalance();
    const newBalance = lastBalance - amount;

    const log = await DailyLog.create({
      type: "EXPENSE",
      name,
      debit: amount,
      credit: 0,
      balance: newBalance,
      note
    });

    res.status(201).json(log);
  } catch (err) {
    console.error("ADD EXPENSE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- ADD MANUAL INVESTMENT ----------------
router.post("/add-investment", async (req, res) => {
  try {
    let { name, amount, note } = req.body;
    amount = Number(amount);

    if (!name || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid name or amount" });
    }

    const lastBalance = await getLastBalance();
    const newBalance = lastBalance + amount;

    const log = await DailyLog.create({
      type: "INVESTMENT",
      name,
      debit: 0,
      credit: amount,
      balance: newBalance,
      note
    });

    res.status(201).json(log);
  } catch (err) {
    console.error("ADD INVESTMENT ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// ---------------- SYNC LEDGER TRANSACTION TO DAILY LOG ----------------
router.post("/ledger-sync/:ledgerId", async (req, res) => {
  try {
    const ledger = await Ledger.findById(req.params.ledgerId);
    if (!ledger) return res.status(404).json({ error: "Ledger not found" });

    let loan = await Loan.findOne({ loanId: ledger.loanId });
    let customerName = loan?.customerId
      ? (await Customer.findOne({ customerId: loan.customerId }))?.name
      : "Unknown";

    const lastBalance = await getLastBalance();
    let debit = 0,
      credit = 0,
      type = "";

    if (ledger.type === "CREDIT" || ledger.type === "DEBIT") {
      // Loan transaction
      type = "LOAN";
      debit = ledger.type === "DEBIT" ? ledger.amount : 0;
      credit = ledger.type === "CREDIT" ? ledger.amount : 0;
    } else if (ledger.type === "INTEREST") {
      type = "INTEREST";
      credit = ledger.amount;
    }

    const newBalance = lastBalance + credit - debit;

    const log = await DailyLog.create({
      type,
      customerId: loan?.customerId,
      customerName: customerName,
      debit,
      credit,
      balance: newBalance,
      note: ledger.note
    });

    res.status(201).json(log);
  } catch (err) {
    console.error("LEDGER SYNC ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
