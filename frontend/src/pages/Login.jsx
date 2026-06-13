import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Keeps track of page routing transitions

function Login() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  
  const navigate = useNavigate(); // Hook used to dynamically switch router paths

  // 1. Sign Up Function
  const signup = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    );

    const data = await response.json();
    setMessage(data.message);
  };

  // 2. Login Function
  const login = async () => {
    const response = await fetch(
      "http://127.0.0.1:8000/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,    
          password, 
        }),
      }
    );

    const data = await response.json();
    if (data.error) {
      setMessage(`Error: ${data.error}`);
    } else {
      setMessage("Logged in successfully!");
      
      // Save your logged-in JWT session to browser storage so it survives refreshes
      localStorage.setItem("token", data.access_token);
      
      // REDIRECT: Instantly send the user to the Dashboard page!
      navigate("/dashboard");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>TutorGPT</h1>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <br /><br />

      <button onClick={signup}>
        Sign Up
      </button>

      <button onClick={login} style={{ marginLeft: "10px" }}>
        Login
      </button>

      <h2>{message}</h2>
    </div>
  );
}

export default Login;