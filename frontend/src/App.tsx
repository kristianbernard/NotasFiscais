import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Relatorio from "./pages/Relatorio";
import Alertas from "./pages/Alertas";
import Estatisticas from "./pages/Estatisticas";
import InsightIA from "./pages/InsightIA";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
         <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/relatorio" element={<Relatorio />} />
        <Route path="/alertas" element={<Alertas />} />
        <Route path="/estatisticas" element={<Estatisticas />} />
        <Route path="/insight" element={<InsightIA />} />
      </Routes>
    </Router>
  );
}

export default App;
