import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosInstance';

function InventarioAdminPage() {
  const [productos, setProductos] = useState([]);
  const [actualizando, setActualizando] = useState(false);
  const [inputValores, setInputValores] = useState({});
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', cantidad: '', categoria: '', descripcion: '', imagen: null });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [categoriaFiltro, setCategoriaFiltro] = useState('');
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = () => {
    axios.get('/productos')
      .then(res => {
        let data = [];
        if (Array.isArray(res.data)) {
          data = res.data;
        } else if (Array.isArray(res.data.data)) {
          data = res.data.data;
        }
        setProductos(data);
        const categoriasUnicas = [...new Set(data.map(p => p.categoria))];
        setCategorias(categoriasUnicas);
      })
      .catch(err => console.error(err));
  };

  const actualizarCantidad = (id, cantidad) => {
    const delta = parseInt(cantidad, 10);
    if (isNaN(delta)) return;

    setActualizando(true);
    axios.patch(`/productos/${id}`, { cantidad: delta })
      .then(() => fetchProductos())
      .catch(err => console.error(err))
      .finally(() => setActualizando(false));
  };

  const eliminarProducto = (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;

    axios.delete(`/productos/${id}`)
      .then(() => fetchProductos())
      .catch(err => console.error(err));
  };

  const handleNuevoProducto = () => {
  // Verificar si la categoría es válida
  if (!categorias.includes(nuevoProducto.categoria)) {
    alert('La categoría introducida no es válida. Elige una categoría existente o asegúrate de escribirla correctamente.');
    return;
  }

  const formData = new FormData();
  formData.append('nombre', nuevoProducto.nombre);
  formData.append('cantidad', nuevoProducto.cantidad);
  formData.append('categoria', nuevoProducto.categoria);
  formData.append('descripcion', nuevoProducto.descripcion);
  if (nuevoProducto.imagen) {
    formData.append('imagen', nuevoProducto.imagen);
  }

  axios.post('/productos', formData)
    .then(() => {
      fetchProductos();
      setNuevoProducto({ nombre: '', cantidad: '', categoria: '', descripcion: '', imagen: null });
      setMostrarFormulario(false);
    })
    .catch(err => console.error(err));
};


  const productosFiltrados = categoriaFiltro
    ? productos.filter(p => p.categoria === categoriaFiltro)
    : productos;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Inventario</h1>
        <button
          onClick={() => navigate('/admin')}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Volver atrás
        </button>
      </div>

      <div className="mb-4">
        <select
          value={categoriaFiltro}
          onChange={e => setCategoriaFiltro(e.target.value)}
          className="border p-2 rounded w-full max-w-xs"
        >
          <option value="">Todas las categorías</option>
          {categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <button
          onClick={() => setMostrarFormulario(prev => !prev)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {mostrarFormulario ? 'Ocultar formulario' : 'Añadir nuevo producto'}
        </button>
      </div>

      {mostrarFormulario && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Nuevo Producto</h2>
          <div className="grid gap-2 md:grid-cols-2">
            <input type="text" placeholder="Nombre" value={nuevoProducto.nombre} onChange={e => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })} className="border p-2 rounded" />
            <input type="number" placeholder="Cantidad" value={nuevoProducto.cantidad} onChange={e => setNuevoProducto({ ...nuevoProducto, cantidad: e.target.value })} className="border p-2 rounded" />
            <input type="text" placeholder="Categoría" value={nuevoProducto.categoria} onChange={e => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })} className="border p-2 rounded" />
            <input type="text" placeholder="Descripción" value={nuevoProducto.descripcion} onChange={e => setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })} className="border p-2 rounded" />
            <input type="file" onChange={e => setNuevoProducto({ ...nuevoProducto, imagen: e.target.files[0] })} className="col-span-2" />
          </div>
          <button onClick={handleNuevoProducto} className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Guardar</button>
        </div>
      )}

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {productosFiltrados.map(producto => (
          <div key={producto.id} className="bg-white p-4 rounded shadow hover:shadow-md transition">
            {producto.imagen && (
              <img src={`http://localhost:8000/storage/${producto.imagen}`} alt={producto.nombre} className="w-full h-48 object-cover rounded mb-3" />
            )}
            <h2 className="text-lg font-bold mb-1">{producto.nombre}</h2>
            <p className="text-sm text-gray-600 mb-1">Categoría: {producto.categoria}</p>
            <p className="text-sm text-gray-700 mb-2">{producto.descripcion}</p>
            <p className="font-medium mb-2">Cantidad: {producto.cantidad}</p>
            <div className="flex items-center gap-2 mb-2">
              <button onClick={() => actualizarCantidad(producto.id, -1)} className="bg-red-500 text-white px-2 py-1 rounded">-1</button>
              <button onClick={() => actualizarCantidad(producto.id, 1)} className="bg-blue-500 text-white px-2 py-1 rounded">+1</button>
              <input type="number" placeholder="Cantidad" min="1" value={inputValores[producto.id] || ''} className="border px-2 py-1 rounded w-20" onChange={e => setInputValores(prev => ({ ...prev, [producto.id]: e.target.value }))} onKeyDown={e => {
                if (e.key === 'Enter') {
                  const value = parseInt(inputValores[producto.id], 10);
                  if (!isNaN(value)) {
                    actualizarCantidad(producto.id, value);
                    setInputValores(prev => ({ ...prev, [producto.id]: '' }));
                  }
                }
              }} />
            </div>
            <button onClick={() => eliminarProducto(producto.id)} className="text-sm text-red-600 hover:underline">Eliminar</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InventarioAdminPage;
