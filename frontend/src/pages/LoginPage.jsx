import { useState } from "react";
import axios from "../services/axiosInstance";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post("/login", form);
      localStorage.setItem("auth_token", res.data.token);
      navigate("/admin");
    } catch (err) {
      setError("Credenciales incorrectas o error en el servidor.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-full max-w-sm space-y-4">
        <h2 className="text-xl font-bold text-center">Acceso administrador</h2>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <input
          type="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="w-full border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}

export default LoginPage;
