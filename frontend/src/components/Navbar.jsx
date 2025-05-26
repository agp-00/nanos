import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white shadow px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="font-bold text-lg">
          <Link to="/">Nanos</Link>
        </div>
        <ul className="flex gap-4 items-center">
          <li><Link to="/" className="hover:underline">Inicio</Link></li>
          <li><Link to="/reservar" className="hover:underline">Reservar</Link></li>

          {!token && (
            <li>
              <Link to="/login" className="hover:underline">
                Iniciar sesión
              </Link>
            </li>
          )}

          {token && (
            <>
              <li><Link to="/admin" className="hover:underline">Admin</Link></li>
              <li>
                <button onClick={handleLogout} className="hover:underline">
                  Cerrar sesión
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
