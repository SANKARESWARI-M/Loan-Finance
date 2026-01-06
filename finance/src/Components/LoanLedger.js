import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../Styles/ledger.css";

function Ledger() {
  const { loanId } = useParams();
  const navigate = useNavigate();

  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [loanDetails, setLoanDetails] = useState(null);

  // Form state
  const [newTransaction, setNewTransaction] = useState({
    type: "DEBIT",
    amount: "",
    note: ""
  });

  // Fetch ledger + loan details
  useEffect(() => {
    const fetchLedger = async () => {
      try {
        const resLedger = await axios.get(`http://localhost:5000/api/ledger/${loanId}`);
        setLedgerEntries(resLedger.data);

        const resLoan = await axios.get(`http://localhost:5000/api/loans/by-loan/${loanId}`);
        setLoanDetails(resLoan.data);
      } catch (err) {
        console.error(err);
        setLedgerEntries([]);
        setLoanDetails(null);
      }
    };
    fetchLedger();
  }, [loanId]);

  // Add transaction
  const handleAddTransaction = async () => {
    if (!newTransaction.amount || !newTransaction.type) {
      return alert("Amount and type are required");
    }

    try {
      const res = await axios.post("http://localhost:5000/api/ledger/add", {
        loanId,
        type: newTransaction.type,
        amount: Number(newTransaction.amount),
        note: newTransaction.note
      });

      setLedgerEntries(prev => [...prev, res.data]);
      setNewTransaction({ type: "DEBIT", amount: "", note: "" });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || "Failed to add transaction");
    }
  };

  // Calculate running balance and total interest
  let runningBalance = 0;
  let runningInterest = 0;

  const ledgerWithColumns = ledgerEntries.map(entry => {
    let debit = 0, credit = 0, interest = 0;

    if (entry.type === "DEBIT") debit = entry.amount;
    else if (entry.type === "CREDIT") credit = entry.amount;
    else if (entry.type === "INTEREST") {
      interest = entry.amount;
      runningInterest += interest;
    }

    runningBalance = runningBalance + credit + interest - debit;

    return { ...entry, debit, credit, interest, balance: runningBalance, totalInterest: runningInterest };
  });

  return (
    <div className="ledger-container">
      <button className="back-btn" onClick={() => navigate(-1)}>⬅ Back</button>
      <h2>Ledger for Loan: {loanId}</h2>

      {loanDetails && (
        <div className="loan-info">
          <p><b>Customer ID:</b> {loanDetails.customerId}</p>
          <p><b>Loan Amount:</b> ₹{loanDetails.loanAmount}</p>
          <p><b>Status:</b> {loanDetails.status}</p>
          <p><b>Interest Rate:</b> {loanDetails.interestRate || 2}%</p>
        </div>
      )}

      <h3>Ledger Entries</h3>
      {ledgerEntries.length > 0 ? (
        <table className="ledger-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>DEBIT</th>
              <th>CREDIT</th>
              <th>INTEREST</th>
              <th>Total Interest</th>
              <th>Balance</th>
              <th>Note</th>
            </tr>
          </thead>
          <tbody>
            {ledgerWithColumns.map((entry, i) => (
              <tr key={i}>
                <td>{new Date(entry.date).toLocaleDateString()}</td>
                <td>₹{entry.debit || "-"}</td>
                <td>₹{entry.credit || "-"}</td>
                <td>₹{entry.interest || "-"}</td>
                <td>₹{entry.totalInterest || "-"}</td>
                <td>₹{entry.balance}</td>
                <td>{entry.note || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No ledger entries found</p>
      )}

      <h3>Add Transaction</h3>
      <div className="transaction-form">
        <select
          value={newTransaction.type}
          onChange={e => setNewTransaction(prev => ({ ...prev, type: e.target.value }))}
        >
          <option value="DEBIT">DEBIT (Payment)</option>
          <option value="CREDIT">CREDIT</option>
          <option value="INTEREST">INTEREST</option>
        </select>

        <input
          type="number"
          placeholder="Amount"
          value={newTransaction.amount}
          onChange={e => setNewTransaction(prev => ({ ...prev, amount: e.target.value }))}
        />

        <input
          type="text"
          placeholder="Note (optional)"
          value={newTransaction.note}
          onChange={e => setNewTransaction(prev => ({ ...prev, note: e.target.value }))}
        />

        <button onClick={handleAddTransaction}>Add</button>
      </div>
    </div>
  );
}

export default Ledger;
