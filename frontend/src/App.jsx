import './App.css'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="p-6 bg-white shadow-lg rounded-xl text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">¡Tailwind está funcionando!</h1>
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Haz clic aquí
        </button>
      </div>
    </div>
  );
}

export default App;