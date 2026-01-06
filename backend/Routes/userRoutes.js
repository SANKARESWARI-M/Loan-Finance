const express = require("express");
const router = express.Router();
const User = require("../Models/customer");
const Counter = require("../Models/counter");

router.post("/", async (req, res) => {
  try {
    const { name, address, phone } = req.body;

    // ✅ Validation (IMPORTANT)
    if (!name || !address || !phone) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Auto-increment Customer ID
    const counter = await Counter.findOneAndUpdate(
      { name: "customer" },
      { $inc: { value: 1 } },
      { new: true, upsert: true }
    );

    const customerId = `CUS-${counter.value}`;

    const user = new User({
      customerId,
      name,
      address,
      phone
    });

    await user.save();
    res.status(201).json(user);

  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get by customerId
router.get("/:customerId", async (req, res) => {
  try {
    const user = await User.findOne({
      customerId: req.params.customerId
    });

    if (!user) return res.status(404).json({ error: "Customer not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
