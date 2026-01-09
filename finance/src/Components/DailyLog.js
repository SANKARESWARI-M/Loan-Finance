import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/ledger.css";

const API = "http://localhost:5000/api/daily-logs";

function DailyLog() {
  const [logs, setLogs] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    type: "EXPENSE", // EXPENSE / INVESTMENT
    name: "",
    amount: "",
    note: ""
  });

  /* ---------------- FETCH LOGS ---------------- */
  const fetchLogs = async () => {
    try {
      const res = await axios.get(API);
      setLogs(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load daily logs");
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  /* ---------------- ADD ENTRY ---------------- */
  const addEntry = async () => {
    if (!form.name || !form.amount) {
      return alert("All fields required");
    }

    try {
      const url =
        form.type === "EXPENSE"
          ? `${API}/add-expense`
          : `${API}/add-investment`;

      await axios.post(url, {
        name: form.name,
        amount: Number(form.amount),
        note: form.note
      });

      setForm({ type: "EXPENSE", name: "", amount: "", note: "" });
      setShowForm(false);
      fetchLogs();
    } catch (err) {
      console.error(err);
      alert("Failed to add entry");
    }
  };

  return (
    <div className="ledger-container">
      <h2>📒 Daily Log</h2>

      <button className="add-btn" onClick={() => setShowForm(!showForm)}>
        ➕ Add Entry
      </button>

      {/* ---------------- ADD FORM ---------------- */}
      {showForm && (
        <div className="transaction-form">
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
          >
            <option value="EXPENSE">Expense</option>
            <option value="INVESTMENT">Investment</option>
          </select>

          <input
            placeholder={
              form.type === "EXPENSE" ? "Expense Name" : "Investor Name"
            }
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />

          <input
            placeholder="Note"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
          />

          <button onClick={addEntry}>Save</button>
        </div>
      )}

      {/* ---------------- TABLE ---------------- */}
      <table className="ledger-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Type</th>
            <th>Name</th>
            <th>Debit (−)</th>
            <th>Credit (+)</th>
            <th>Balance</th>
            <th>Note</th>
          </tr>
        </thead>

        <tbody>
          {logs.map((log, i) => (
            <tr key={i}>
              <td>{new Date(log.date).toLocaleDateString()}</td>
              <td>{log.type}</td>
              <td>{log.name}</td>
              <td className="debit">
                {log.debit ? `₹${log.debit}` : "-"}
              </td>
              <td className="credit">
                {log.credit ? `₹${log.credit}` : "-"}
              </td>
              <td>₹{log.balance}</td>
              <td>{log.note || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DailyLog;
