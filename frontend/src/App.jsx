import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";

function App() {
  return (
    <Routes>
      {/* The base URL loads your login page template */}
      <Route path="/" element={<Login />} />
      
      {/* After a successful login, the user is navigated here */}
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* Your chat panel interface workspace */}
      <Route path="/chat" element={<Chat />} />
    </Routes>
  );
}

export default App;