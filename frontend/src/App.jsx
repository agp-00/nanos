import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ReservarPage from "./pages/ReservarPage";
import LoginPage from "./pages/LoginPage";
import ProductosPage from "./pages/Admin/ProductosPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/reservar" element={<ReservarPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin/productos" element={<ProductosPage />} />
      </Routes>
    </Router>
  );
}

export default App;
