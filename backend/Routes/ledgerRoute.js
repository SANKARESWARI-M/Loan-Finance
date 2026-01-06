const express = require("express");
const router = express.Router();
const Ledger = require("../Models/Ledger");

// ✅ ADD ENTRY (STATIC ROUTE FIRST)
router.post("/add", async (req, res) => {
  try {
    const { loanId, type, amount, note } = req.body;

    if (!loanId || !type || !amount) {
      return res.status(400).json({ error: "Loan ID, type, and amount are required" });
    }

    const lastEntry = await Ledger.find({ loanId }).sort({ date: -1 }).limit(1);
    let balance = lastEntry.length ? lastEntry[0].balance : 0;

    if (type === "DEBIT") balance += amount;
    if (type === "CREDIT") balance -= amount;

    const entry = await Ledger.create({
      loanId,
      type,
      amount,
      balance,
      note,
      date: new Date()
    });

    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ GET LEDGER (DYNAMIC ROUTE LAST)
router.get("/:loanId", async (req, res) => {
  try {
    const ledger = await Ledger.find({ loanId: req.params.loanId }).sort({ date: 1 });
    res.json(ledger);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
