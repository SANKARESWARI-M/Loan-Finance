const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// 🔴 IMPORTANT: disable buffering so errors surface immediately
mongoose.set("bufferCommands", false);

const PORT = process.env.PORT || 5000;

// ✅ Connect DB → THEN start server
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("✅ MongoDB connected");

    // Routes (keep as-is)
    const userRoutes = require("./Routes/userRoutes");
    const loanRoutes = require("./Routes/loanRoutes");
    const ledgerRoutes = require("./Routes/ledgerRoute");
    const dailyLogRoutes = require("./Routes/dailyLogRoute");

    app.use("/api/users", userRoutes);
    app.use("/api/loans", loanRoutes);
    app.use("/api/ledger", ledgerRoutes);
    app.use("/api/daily-logs", dailyLogRoutes);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
