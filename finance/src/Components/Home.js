import { useNavigate } from "react-router-dom";
import "../Styles/Home.css"

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <button onClick={() => navigate("/new-user")}>New User</button>
      <button onClick={() => navigate("/new-loan")}>New Loan</button>
      <button onClick={() => navigate("/payment")}>Payment</button>
    </>
  );
}

export default Home;