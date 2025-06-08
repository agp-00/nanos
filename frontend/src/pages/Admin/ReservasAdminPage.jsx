import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosInstance';

function ReservasAdminPage() {
  const [reservas, setReservas] = useState([]);
  const [error, setError] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('/reservas')
      .then(res => setReservas(res.data))
      .catch(err => setError('Error al cargar reservas'));
  }, []);

  const cambiarEstado = (id, nuevoEstado) => {
    const reservaActual = reservas.find(r => r.id === id);

    if (nuevoEstado === 'aceptada') {
      const reservasMismoDia = reservas.filter(r =>
        r.fecha === reservaActual.fecha &&
        r.estado === 'aceptada' &&
        r.id !== reservaActual.id
      );

      const solapan = reservasMismoDia.some(r =>
        (reservaActual.hora_inicio < r.hora_fin && reservaActual.hora_fin > r.hora_inicio)
      );

      if (solapan) {
        setMensaje('Esta reserva se solapa con otra ya aceptada.');
        return;
      }
    }

    axios.patch(`/reservas/${id}/estado`, { estado: nuevoEstado })
      .then(() => {
        setReservas(prev => prev.map(r => r.id === id ? { ...r, estado: nuevoEstado } : r));
        setMensaje(null);
      })
      .catch(err => setError('Error al cambiar el estado de la reserva.'));
  };

  const reservasPorDia = useMemo(() => {
    const agrupadas = {};
    reservas.forEach(reserva => {
      if (!agrupadas[reserva.fecha]) {
        agrupadas[reserva.fecha] = [];
      }
      agrupadas[reserva.fecha].push(reserva);
    });

    Object.keys(agrupadas).forEach(fecha => {
      agrupadas[fecha].sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio));
    });

    return agrupadas;
  }, [reservas]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Reservas</h1>
        <button
          onClick={() => navigate('/admin')}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Volver atrás
        </button>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {mensaje && <p className="text-yellow-600 mb-4 font-medium">{mensaje}</p>}

      {Object.entries(reservasPorDia).map(([fecha, lista]) => (
        <div key={fecha} className="mb-6">
          <h2 className="text-lg font-semibold mb-2">{fecha}</h2>
          <ul className="space-y-2">
            {lista.map(reserva => (
              <li key={reserva.id} className="p-3 bg-white rounded shadow flex justify-between items-center">
                <div>
                  <p className="font-medium">{reserva.hora_inicio} - {reserva.hora_fin}</p>
                  <p className="text-sm text-gray-700">{reserva.nombre_cliente} ({reserva.telefono})</p>
                  {reserva.observaciones && <p className="text-xs text-gray-500">{reserva.observaciones}</p>}
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold capitalize ${
                    reserva.estado === 'pendiente' ? 'text-yellow-600' : reserva.estado === 'aceptada' ? 'text-green-600' : 'text-red-600'
                  }`}>{reserva.estado}</p>
                  <div className="mt-2 space-x-1">
                    <button onClick={() => cambiarEstado(reserva.id, 'aceptada')} className="px-2 py-1 text-xs bg-green-500 text-white rounded">Aceptar</button>
                    <button onClick={() => cambiarEstado(reserva.id, 'rechazada')} className="px-2 py-1 text-xs bg-red-500 text-white rounded">Rechazar</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ReservasAdminPage;
