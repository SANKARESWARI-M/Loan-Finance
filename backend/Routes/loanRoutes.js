const express = require("express");
const router = express.Router();
const Loan = require("../Models/Loan");
const Counter = require("../Models/counter");
const Ledger = require("../Models/Ledger");


// Create new loan
// router.post("/create", async (req, res) => {
//   try {
//     // Get and increment loan counter
//     const counter = await Counter.findOneAndUpdate(
//       { name: "loan" },
//       { $inc: { value: 1 } },
//       { new: true, upsert: true }
//     );

//     // Start at 500 if first time
//     if (!counter.value || counter.value < 500) {
//       counter.value = 500;
//       await counter.save();
//     }

//     const loanId = `A-${counter.value}`;

//     const loan = new Loan({
//       loanId,
//       ...req.body,
//       outstandingAmount: req.body.loanAmount  // set outstandingAmount = loanAmount

//     });

//     await loan.save();
//     res.status(201).json(loan);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });
router.post("/create", async (req, res) => {
  try {
    // Increment loan counter
    const counter = await Counter.findOneAndUpdate(
      { name: "loan" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    if (!counter.value || counter.value < 500) {
      counter.value = 500;
      await counter.save();
    }

    const loanId = `A-${counter.value}`;

    // Create loan
    const loan = new Loan({
      loanId,
      customerId: req.body.customerId,
      loanAmount: req.body.loanAmount,
      outstandingAmount: req.body.loanAmount,
      goldDetails: req.body.goldDetails,
      weight: req.body.weight,
      status: "ACTIVE",
      issuedDate: new Date()
    });

    await loan.save();

    // ⚡ ADD INITIAL LEDGER ENTRY (NEW FEATURE)
    await Ledger.create({
      loanId: loanId,
      type: "DEBIT",         // Loan given → CREDIT
      amount: loan.loanAmount,
      balance: loan.loanAmount,
      note: "Loan disbursed",
      date: new Date()
    });

    res.status(201).json(loan);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/by-customer/:customerId", async (req, res) => {
  try {
    const loans = await Loan.find({ customerId: req.params.customerId });

    if (!loans.length) {
      return res.status(404).json({ error: "No loans found for this customer" });
    }

    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/by-loan/:loanId", async (req, res) => {
  try {
    const loan = await Loan.findOne({ loanId: req.params.loanId });

    if (!loan) {
      return res.status(404).json({ error: "Loan not found" });
    }

    res.json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
