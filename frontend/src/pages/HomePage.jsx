import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-4">Bienvenido a Nanos</h1>
      <p className="text-gray-700 mb-6">Reserva tu espacio en nuestro parque infantil</p>
      
      <div className="flex gap-4">
        <Link
          to="/reservar"
          className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Reservar ahora
        </Link>

        <Link
          to="/login"
          className="px-6 py-3 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 transition"
        >
          Acceso admin
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
