import React, { useState } from "react";
import axios from "axios";
import "../Styles/GoldForm.css";

function NewUser() {
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
      "http://localhost:5000/api/users",
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
    <div style={{ padding: "30px" }}>
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
  );
}

export default NewUser;
