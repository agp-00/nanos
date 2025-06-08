import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="p-8 max-w-xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-6">Panel de Administración</h1>

      <div className="grid gap-4">
        <button
          onClick={() => navigate('/admin/inventario')}
          className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
        >
          Gestionar Inventario
        </button>

        <button
          onClick={() => navigate('/admin/reservas')}
          className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
        >
          Gestionar Reservas
        </button>
      </div>
    </div>
  );
}

export default AdminDashboard;