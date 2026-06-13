import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Pulls the token we saved during login

  const testProtected = async () => {
    const res = await fetch("http://127.0.0.1:8000/protected", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    console.log(data);
    alert(JSON.stringify(data));
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/"); // Redirect back to login screen
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Welcome to your Dashboard workspace</h1>
      <button onClick={testProtected}>Test Protected Route</button>
      <button onClick={logout} style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}>Logout</button>
    </div>
  );
}

export default Dashboard;