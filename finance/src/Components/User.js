import React, { useState } from "react";
import axios from "axios";
import "../Styles/user.css";
import { useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL; 



function NewUser() {
  const navigate = useNavigate();
  
  const [user, setUser] = useState({
    name: "",
    address: "",
    phone: ""
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
  if (!user.name || !user.address || !user.phone) {
    alert("All fields are required");
    return;
  }

  try {
    const res = await axios.post(
      `${API_URL}/api/users`,
      user
    );

    alert(`User created!\nCustomer ID: ${res.data.customerId}`);
    setUser({ name: "", address: "", phone: "" });

  } catch (err) {
    console.error(err);
    alert(err.response?.data?.error || "Failed to create user");
  }
};

  return (
    <><button className="print-btn" onClick={() => navigate("/")}>⬅ Back</button>
  <div className="gold-form-container">
    <h2>New User</h2>

    <input
      name="name"
      placeholder="Name"
      value={user.name}
      onChange={handleChange}
    /><br /><br />

    <textarea
      name="address"
      placeholder="Address"
      value={user.address}
      onChange={handleChange}
    /><br /><br />

    <input
      name="phone"
      placeholder="Phone"
      value={user.phone}
      onChange={handleChange}
    /><br /><br />

    <button onClick={handleSubmit}>Save User</button>
  </div>
  </>
);

}

export default NewUser;
