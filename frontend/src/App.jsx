import { useState } from "react";

function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(""); // Saves your logged-in JWT session

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

    // FIX 1: Returned the login response parsing logic back to its correct block
    const data = await response.json();
    if (data.error) {
      setMessage(`Error: ${data.error}`);
    } else {
      setMessage("Logged in successfully!");
      setToken(data.access_token);
    }
  };
  
  // FIX 2: Extracted testProtected safely into its own clean function block
  const testProtected = async () => {
    const res = await fetch("http://127.0.0.1:8000/protected", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    console.log(data);
    
    if (data.message) {
      setMessage(`Protected Response: ${data.message}`);
    } else {
      setMessage(JSON.stringify(data));
    }
  };
  

  return (
    <div>
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
      
      <button onClick={testProtected} style={{ marginLeft: "10px" }}>
        Test Protected Route
      </button>

      <h2>{message}</h2>

      {token && <p style={{ wordBreak: "break-all" }}><strong>Token:</strong> {token}</p>}
    </div>
  );
}

export default App;