import "./App.css";
import Home from "./pages/home";
import FormEngine from "./pages/form";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Logout from "./pages/logout";
import Dashboard from "./pages/dashboard";
import Responses from "./pages/responses";
import Delete from "./pages/deleteform";
import Password from "./pages/password";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/responses/:identifier" element={<Responses />} />
        <Route path="/new" element={<Home />} />
        <Route path="/delete/:identifier" element={<Delete />} />
        <Route path="/updatepassword" element={<Password />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/form/:identifier" element={<FormEngine />} />
      </Routes>
    </Router>
  );
}

export default App;
