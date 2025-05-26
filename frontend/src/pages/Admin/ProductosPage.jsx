import { useEffect, useState } from 'react';
import axios from '../../services/axiosInstance';

function ProductosPage() {
  const [productos, setProductos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('/productos')
      .then(res => setProductos(res.data))
      .catch(err => setError('Error al cargar productos'));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inventario</h1>

      {error && <p className="text-red-500">{error}</p>}

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {productos.map(producto => (
          <li key={producto.id} className="bg-white p-4 shadow rounded">
            <h2 className="font-semibold">{producto.nombre}</h2>
            <p>{producto.descripcion}</p>
            <p className="text-sm text-gray-600">Cantidad: {producto.cantidad}</p>
            <p className="text-sm text-gray-600">Categoría: {producto.categoria}</p>
            {producto.imagen && (
              <img
                src={`http://127.0.0.1:8000/storage/${producto.imagen}`}
                alt={producto.nombre}
                className="mt-2 rounded w-full h-40 object-cover"
              />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductosPage;
