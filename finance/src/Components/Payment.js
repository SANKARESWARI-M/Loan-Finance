import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Styles/ledger.css";
const API_URL = process.env.REACT_APP_API_URL; 

function Payment() {
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState("");
  const [loanSearchId, setLoanSearchId] = useState("");
  const [loans, setLoans] = useState([]);

  // Search by Customer ID
  // http://localhost:5000
  const searchByCustomer = async () => {
    if (!customerId) return alert("Enter Customer ID");

    try {
      const res = await axios.get(
        `${API_URL}/api/loans/by-customer/${customerId.trim()}`
      );
      setLoans(res.data);
    } catch (err) {
      alert(err.response?.data?.error || "Customer not found");
      setLoans([]);
    }
  };

  // Search by Loan ID
  const searchByLoanId = async () => {
    if (!loanSearchId) return alert("Enter Loan ID");

    try {
      const res = await axios.get(
        `${API_URL}/api/loans/by-loan/${loanSearchId.trim()}`
      );
      setLoans([res.data]); // wrap single loan into array
    } catch (err) {
      alert("Loan not found");
      setLoans([]);
    }
  };

  return (
    <div className="ledger-container">
      <button className="back-btn" onClick={() => navigate("/")}>Back</button>
      <h2>Loan Search</h2>

      <div className="search-section">
        <div className="search-box">
          <h4>Search by Customer ID</h4>
          <input value={customerId} onChange={e => setCustomerId(e.target.value)} />
          <button onClick={searchByCustomer}>Search</button>
        </div>

        <div className="search-box">
          <h4>Search by Loan ID</h4>
          <input value={loanSearchId} onChange={e => setLoanSearchId(e.target.value)} />
          <button onClick={searchByLoanId}>Search</button>
        </div>
      </div>

      {loans.length > 0 && (
        <>
          <h3>Select Loan</h3>
          <ul className="loan-list">
            {loans.map(loan => (
              <li key={loan.loanId}>
                <button onClick={() => navigate(`/ledger/${loan.loanId}`)}>
                  {loan.loanId} — ₹{loan.loanAmount}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Payment;
