
const express = require("express");
const router = express.Router();
const Ledger = require("../Models/Ledger");
const Loan = require("../Models/Loan");
const DailyLog = require("../Models/DailyLog");
const Customer = require("../Models/customer");

// Add ledger transaction
router.post("/add", async (req, res) => {
  try {
    const { loanId, type, amount, note } = req.body;

    if (!loanId || !type || !amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const loan = await Loan.findOne({ loanId: req.params.loanId, status: "ACTIVE" });


    // const loan = await Loan.findOne({ loanId });
    if (!loan) return res.status(404).json({ error: "Loan not found" });

    // Calculate balance
    let lastLedger = await Ledger.findOne({ loanId }).sort({ date: -1 });
    let balance = lastLedger ? lastLedger.balance : 0;

    if (type === "DEBIT") balance -= amount;
    else if (type === "CREDIT") balance += amount;
    // INTEREST does not affect balance

    const ledger = await Ledger.create({
      loanId,
      type,
      amount,
      balance: type === "INTEREST" ? lastLedger?.balance || 0 : balance,
      note
    });

    // ---------------- SYNC TO DAILY LOG ----------------
    const customer = await Customer.findOne({ customerId: loan.customerId });

    let dailyType = "";
    let debit = 0,
      credit = 0;

    if (type === "DEBIT" || type === "CREDIT") {
      dailyType = "LOAN";
      debit = type === "DEBIT" ? amount : 0;
      credit = type === "CREDIT" ? amount : 0;
    } else if (type === "INTEREST") {
      dailyType = "INTEREST";
      credit = amount;
      debit = 0;
    }

    // Get last daily log balance (exclude interest)
    let lastDailyLog = await DailyLog.findOne({ type: { $ne: "INTEREST" } }).sort({ date: -1 });
    let dailyBalance = lastDailyLog ? lastDailyLog.balance : 0;
    dailyBalance = dailyType === "LOAN" ? dailyBalance + credit - debit : dailyBalance;

    await DailyLog.create({
      date: new Date(),
      type: dailyType,
      customerId: loan.customerId,
      customerName: customer?.name || "Unknown",
      debit,
      credit,
      balance: dailyBalance,
      note
    });

    res.status(201).json(ledger);
  } catch (err) {
    console.error("Ledger Add Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Edit loan status
router.patch("/update-loan-status/:loanId", async (req, res) => {
  try {
    const { status } = req.body;
    if (!["ACTIVE", "CLOSED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const loan = await Loan.findOneAndUpdate(
      { loanId: req.params.loanId },
      { status },
      { new: true }
    );

    if (!loan) return res.status(404).json({ error: "Loan not found" });
    res.json(loan);
  } catch (err) {
    console.error("Update Loan Status Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get ledger by loanId (only for ACTIVE loans)
// Get ledger by loanId (only for ACTIVE loans)
router.get("/:loanId", async (req, res) => {
  try {
    const loan = await Loan.findOne({ loanId: req.params.loanId, status: "ACTIVE" });
    if (!loan) return res.status(404).json({ error: "Loan not found or closed" });

    const ledger = await Ledger.find({ loanId: req.params.loanId }).sort({ date: 1 });
    res.json(ledger);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;


// const express = require("express");
// const router = express.Router();
// const Ledger = require("../Models/Ledger");
// const Loan=require("../Models/Loan");
// const Customer=require("../Models/customer");
// const DailyLog=require("../Models/DailyLog");


// router.post("/add", async (req, res) => {
//   try {
//     const { loanId, type, amount, note } = req.body;

//     const loan = await Loan.findOne({ loanId });
//     if (!loan) return res.status(404).json({ error: "Loan not found" });

//     const customer = await Customer.findOne({ customerId: loan.customerId });

//     /* ---------- LEDGER BALANCE ---------- */
//     let newBalance = loan.outstandingAmount;

//     if (type === "DEBIT") newBalance -= amount;
//     if (type === "CREDIT" || type === "INTEREST") newBalance += amount;

//     const ledger = await Ledger.create({
//       loanId,
//       type,
//       amount,
//       balance: newBalance,
//       note
//     });

//     loan.outstandingAmount = newBalance;
//     await loan.save();

//     /* ---------- DAILY LOG AUTO ENTRY ---------- */
//     const lastLog = await DailyLog.findOne().sort({ date: -1 });
//     const prevBalance = lastLog ? lastLog.balance : 0;

//     let dailyType = "LOAN";
//     let debit = 0;
//     let credit = 0;

//     if (type === "CREDIT") {
//       dailyType = "LOAN";
//       debit = amount;        // money given out
//     }

//     if (type === "DEBIT") {
//       dailyType = "LOAN";
//       credit = amount;       // money received
//     }

//     if (type === "INTEREST") {
//       dailyType = "INTEREST";
//       credit = amount;
//     }

//     const balance = prevBalance + credit - debit;

//     await DailyLog.create({
//       type: dailyType,
//       name: customer?.name || "Unknown",
//       debit,
//       credit,
//       balance,
//       referenceId: loanId,
//       note
//     });

//     res.status(201).json(ledger);

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;


// // ✅ GET LEDGER (DYNAMIC ROUTE LAST)
// router.get("/:loanId", async (req, res) => {
//   try {
//     const ledger = await Ledger.find({ loanId: req.params.loanId }).sort({ date: 1 });
//     res.json(ledger);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;
