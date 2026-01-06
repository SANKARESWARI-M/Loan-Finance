import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import NewUser from "./Components/User";
import GoldForm from "./Components/Goldform";
import Payment from "./Components/Payment";
import Ledger from "./Components/LoanLedger";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/new-user" element={<NewUser />} />
      <Route path="/new-loan" element={<GoldForm />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/ledger/:loanId" element={<Ledger />} />
    </Routes>
  );
}

export default App;
