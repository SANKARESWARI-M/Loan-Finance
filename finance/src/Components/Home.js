import { useNavigate } from "react-router-dom";
import "../Styles/Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      {/* Header */}
      <div className="home-header">
        <h1>SM Finance</h1>
        <p>Manage customers, loans, and payments efficiently</p>
      </div>

      {/* Action Cards */}
      <div className="home-actions">
        <div className="action-card" onClick={() => navigate("/new-user")}>
          <h3>New User</h3>
          <p>Create and manage customer profiles</p>
        </div>

        <div className="action-card" onClick={() => navigate("/new-loan")}>
          <h3>New Loan</h3>
          <p>Issue loans and record loan details</p>
        </div>

        <div className="action-card" onClick={() => navigate("/payment")}>
          <h3>Payment</h3>
          <p>Track repayments and loan status</p>
        </div>
        <div className="action-card" onClick={() => navigate("/daily-log")}>
          <h3>DailyLog</h3>
          <p>Track daily entries</p>
        </div>
        

      </div>
    </div>
  );
}

export default Home;
