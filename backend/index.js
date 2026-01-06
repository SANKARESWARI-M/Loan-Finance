const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// ✅ MongoDB Atlas connection (NO deprecated options)
mongoose
  .connect(
    "mongodb+srv://mk3207587_db_user:5OJjnoYtNVICoL7D@cluster0.3tj3pyy.mongodb.net/"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// ✅ Routes (use SAME folder name case)
const userRoutes = require("./Routes/userRoutes");
const loanRoutes = require("./Routes/loanRoutes");
const ledgerRoutes= require("./Routes/ledgerRoute");

app.use("/api/users", userRoutes);
app.use("/api/loans", loanRoutes);
app.use("/api/ledger",ledgerRoutes);

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
