import { useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  const getMessage = async () => {
    const response = await fetch("http://127.0.0.1:8000/");
    const data = await response.json();

    setMessage(data.message);
  };

  return (
    <div>
      <h1>TutorGPT</h1>

      <button onClick={getMessage}>
        Connect Backend
      </button>

      <h2>{message}</h2>
    </div>
  );
}

export default App;