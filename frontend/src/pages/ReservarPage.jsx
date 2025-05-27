import { useEffect, useState } from "react";
import axios from "../services/axiosInstance";
import HorarioVisual from "../components/HorarioVisual";
import { useNavigate } from "react-router-dom";

function ReservarPage() {
  const [semanas, setSemanas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [horarioDia, setHorarioDia] = useState(null);
  const [mostrarHorario, setMostrarHorario] = useState(true);
  const [reservaEnviada, setReservaEnviada] = useState(false);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre_cliente: "",
    telefono: "",
    fecha: "",
    hora_inicio: "",
    hora_fin: "",
    observaciones: ""
  });


  const dias = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

  useEffect(() => {
    axios.get("/semanas").then(res => {
      const hoy = new Date().toISOString().split("T")[0];
      const activas = res.data
        .filter(s => s.fecha_fin >= hoy)
        .sort((a, b) => a.fecha_inicio.localeCompare(b.fecha_inicio));
      setSemanas(activas.slice(0, 2));
    });
  }, []);

  const seleccionarDia = (dia, semana) => {
    const horario = semana.horarios.find(h => h.dia_semana === dia);
    if (horario) {
      setDiaSeleccionado({ dia, semana });
      setHorarioDia(horario);
      setMostrarHorario(true);

      const inicio = new Date(semana.fecha_inicio);
      const index = dias.indexOf(dia);
      inicio.setDate(inicio.getDate() + index);
      const fecha = inicio.toISOString().split("T")[0];

      setForm(f => ({
        ...f,
        fecha
      }));

      axios.get(`/reservas/semana/${semana.id}`).then(res => {
        setReservas(res.data);
      });
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  // Asegurar formato HH:mm:ss
  const pad = (hora) => (hora.length === 5 ? `${hora}:00` : hora);

  const hora_inicio = pad(form.hora_inicio);
  const hora_fin = pad(form.hora_fin);

  if (!form.nombre_cliente || !form.telefono || !form.fecha || !hora_inicio || !hora_fin) {
    alert("Por favor, completa todos los campos requeridos.");
    return;
  }

  if (hora_inicio >= hora_fin) {
    alert("La hora de inicio debe ser anterior a la de fin.");
    return;
  }

  if (hora_inicio < horarioDia.hora_inicio || hora_fin > horarioDia.hora_fin) {
    alert(
      `Las horas deben estar dentro del horario disponible: ${horarioDia.hora_inicio} - ${horarioDia.hora_fin}`
    );
    return;
  }

  try {
    await axios.post("/reservas", {
      nombre_cliente: form.nombre_cliente,
      email_cliente: form.email_cliente || null,
      telefono: form.telefono,
      fecha: form.fecha,
      hora_inicio,
      hora_fin,
      observaciones: form.observaciones || null,
    });

    setReservaEnviada(true);

    setTimeout(() => {
      navigate("/");
    }, 3000);
  } catch (error) {
    console.error("Error al enviar la reserva:", error.response.data);
    if (error.response?.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Ocurrió un error al enviar la reserva.");
    }
  }
};

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Reservar</h1>

      {reservaEnviada && (
        <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-800 rounded">
          ✅ ¡Reserva enviada correctamente! Serás redirigido en unos segundos...
        </div>
      )}
      {semanas.length > 0 && (
        <>
          <p className="mb-2 font-semibold">Selecciona un día:</p>
          {semanas.map((semana, i) => (
            <div key={semana.id} className="mb-4">
              <p className="font-medium mb-1">
                Semana {i + 1}: {semana.fecha_inicio} al {semana.fecha_fin}
              </p>
              <div className="flex flex-wrap gap-2">
                {dias.map(dia => (
                  <button
                    key={dia + semana.id}
                    className={`px-4 py-2 rounded border ${diaSeleccionado?.dia === dia && diaSeleccionado?.semana.id === semana.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100"
                      }`}
                    onClick={() => seleccionarDia(dia, semana)}
                  >
                    {dia}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {diaSeleccionado && (
        <div className="my-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">
              Horario visual — {diaSeleccionado.dia} {form.fecha}
            </h2>
            <button
              onClick={() => setMostrarHorario(prev => !prev)}
              className="text-sm text-blue-600 hover:underline"
            >
              {mostrarHorario ? "Ocultar horario" : "Mostrar horario"}
            </button>
          </div>

          {mostrarHorario && (
            <HorarioVisual
              semana={diaSeleccionado.semana}
              horarios={diaSeleccionado.semana.horarios}
              reservas={reservas}
            />
          )}
        </div>
      )}

      {horarioDia && (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 shadow rounded mt-6">
          <p>
            <strong>Horario disponible:</strong> {horarioDia.hora_inicio} - {horarioDia.hora_fin}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <label>
              Hora inicio:
              <input
                type="time"
                value={form.hora_inicio}
                onChange={e => setForm({ ...form, hora_inicio: e.target.value })}
                className="block w-full border p-1"
                required
              />
            </label>
            <label>
              Hora fin:
              <input
                type="time"
                value={form.hora_fin}
                onChange={e => setForm({ ...form, hora_fin: e.target.value })}
                className="block w-full border p-1"
                required
              />
            </label>
          </div>

          <input
            type="text"
            placeholder="Tu nombre"
            value={form.nombre_cliente}
            onChange={e => setForm({ ...form, nombre_cliente: e.target.value })}
            className="w-full border p-2"
            required
          />

          <input
            type="email"
            placeholder="Correo electrónico (opcional)"
            value={form.email_cliente || ""}
            onChange={e => setForm({ ...form, email_cliente: e.target.value })}
            className="w-full border p-2"
          />

          <div>
            <input
              type="text"
              placeholder="Teléfono (WhatsApp)"
              value={form.telefono}
              onChange={e => setForm({ ...form, telefono: e.target.value })}
              className="w-full border p-2"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Tu número de teléfono solo se almacenará el tiempo necesario para gestionar tu reserva. No se compartirá ni usará con fines comerciales.
            </p>
          </div>

          <textarea
            placeholder="Observaciones (opcional)"
            value={form.observaciones}
            onChange={e => setForm({ ...form, observaciones: e.target.value })}
            className="w-full border p-2"
            rows={3}
          />

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Enviar reserva
          </button>
        </form>

      )}
    </div>
  );
}

export default ReservarPage;
