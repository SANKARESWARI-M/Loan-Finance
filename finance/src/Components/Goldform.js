import React, { useState } from "react";
import axios from "axios";
import "../Styles/GoldForm.css";
import { useNavigate } from "react-router-dom";


function GoldLoanForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    loanId: "",
    customerId: "",
    name: "",
    phone: "",
    address: "",
    loanAmount: "",
    amountInWords: "",
    goldDetails: "",
    weight: ""
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validate customer ID & fetch user info
  const validateCustomerId = async () => {
    if (!formData.customerId.trim()) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/users/${formData.customerId}`
      );

      setFormData(prev => ({
        ...prev,
        name: res.data.name,
        phone: res.data.phone,
        address: res.data.address
      }));
    } catch (err) {
      alert("Customer ID not found");
      setFormData(prev => ({
        ...prev,
        name: "",
        phone: "",
        address: ""
      }));
    }
  };

  // Save loan & print
  const handleSubmit = async () => {
    if (!formData.customerId || !formData.loanAmount) {
      alert("Customer ID & Loan Amount required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/loans/create",
        {
          customerId: formData.customerId,
          loanAmount: formData.loanAmount,
          goldDetails: formData.goldDetails,
          weight: formData.weight
        }
      );

      const newLoanId = res.data.loanId;

      setFormData(prev => ({ ...prev, loanId: newLoanId }));

      setTimeout(() => window.print(), 100);

      alert(`Loan Created Successfully! Loan No: ${newLoanId}`);

      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          loanId: "",
          loanAmount: "",
          amountInWords: "",
          goldDetails: "",
          weight: ""
        }));
      }, 500);

    } catch (err) {
      alert(err.response?.data?.error || "Error saving loan");
    }
  };

  return (
    <>
      <button className="print-btn" onClick={() => navigate("/")}>⬅ Back</button>


      <div className="form-container">
        <h2>Gold Loan Entry</h2>

        <div className="form-group">
          <label>Customer ID</label>
          <input
            type="text"
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
            onBlur={validateCustomerId}
            placeholder="CUS-1"
          />
        </div>

        <div className="form-group">
          <label>Name</label>
          <input type="text" value={formData.name} readOnly />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input type="text" value={formData.phone} readOnly />
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea value={formData.address} readOnly />
        </div>

        <div className="form-group">
          <label>Loan Number</label>
          <input
            type="text"
            value={formData.loanId}
            readOnly
            placeholder="Generated on save"
          />
        </div>

        <div className="form-group">
          <label>Loan Amount</label>
          <input
            type="number"
            name="loanAmount"
            value={formData.loanAmount}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Amount (in Words)</label>
          <input
            type="text"
            name="amountInWords"
            value={formData.amountInWords}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Gold Details</label>
          <input
            type="text"
            name="goldDetails"
            value={formData.goldDetails}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Weight (grams)</label>
          <input
            type="number"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
          />
        </div>

        <button className="print-btn" onClick={handleSubmit}>
          Save & Print
        </button>
      </div>

      {/* PRINT RECEIPT */}
      <div className="print-container">
        <h1 className="print-title">GOLD LOAN RECEIPT</h1>
        <hr />
        <div className="print-details">
        <p><b>Loan No:</b> {formData.loanId}</p>
        <p><b>Customer ID:</b> {formData.customerId}</p>
        <p><b>Name:</b> {formData.name}</p>
        <p><b>Phone:</b> {formData.phone}</p>
        <p><b>Address:</b> {formData.address}</p>
        <p><b>Loan Amount:</b> ₹{formData.loanAmount}</p>
        <p><b>Amount (Words):</b> {formData.amountInWords}</p>
        <p><b>Gold:</b> {formData.goldDetails}</p>
        <p><b>Weight:</b> {formData.weight} g</p>
        </div>

        <div className="signature-section">
          <div className="signature-box">
            <div className="signature-line"></div>
            Customer Signature
          </div>
          <div className="signature-box">
            <div className="signature-line"></div>
            Authorized Signature
          </div>
        </div>
      </div>
    </>
  );
}

export default GoldLoanForm;
