import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ReservarPage from "./pages/ReservarPage";
import LoginPage from "./pages/LoginPage";
import InventarioAdminPage from "./pages/Admin/InventarioAdminPage";
import AdminDashboard from "./pages/AdminDashboard";
import ReservasAdminPage from "./pages/Admin/ReservasAdminPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reservar" element={<ReservarPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/inventario" element={<InventarioAdminPage />} />
        <Route path="/admin/reservas" element={<ReservasAdminPage />} />
      </Routes>
    </Router>
  );
}

export default App;
