function HorarioVisual({ semana, reservas, horarios }) {
  const diasSemana = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

  // Generar 48 intervalos de 30 minutos
  const generarHoras = () => {
    const horas = [];
    for (let h = 0; h < 24; h++) {
      horas.push(`${String(h).padStart(2, "0")}:00`);
      horas.push(`${String(h).padStart(2, "0")}:30`);
    }
    return horas;
  };

  const franjas = generarHoras();

  // Convertir hora string a minutos
  const horaAminutos = (horaStr) => {
    const [h, m] = horaStr.split(":").map(Number);
    return h * 60 + m;
  };

  const getColor = (dia, hora) => {
    const horario = horarios.find(h => h.dia_semana === dia);
    if (!horario) return "bg-gray-200";

    const minutos = horaAminutos(hora);
    const inicio = horaAminutos(horario.hora_inicio);
    const fin = horaAminutos(horario.hora_fin);

    if (minutos < inicio || minutos >= fin) return "bg-gray-100";

    // Calcular fecha real del día
    const fechaBase = new Date(semana.fecha_inicio);
    const index = diasSemana.indexOf(dia);
    fechaBase.setDate(fechaBase.getDate() + index);
    const fechaStr = fechaBase.toISOString().split("T")[0];

    // Buscar reserva activa en esa franja
    const reserva = reservas.find(r => {
      if (r.fecha !== fechaStr) return false;
      const inicioR = horaAminutos(r.hora_inicio);
      const finR = horaAminutos(r.hora_fin);
      return minutos >= inicioR && minutos < finR;
    });

    if (reserva?.estado === "aceptada") return "bg-red-400";
    if (reserva?.estado === "pendiente") return "bg-yellow-300";

    return "bg-white";
  };

  return (
    <div className="overflow-x-auto border rounded">
      <table className="table-fixed border-collapse w-full min-w-[800px] text-xs">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th className="w-20 border p-1 text-left">Hora</th>
            {diasSemana.map(dia => (
              <th key={dia} className="border p-1 capitalize text-center">
                {dia}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {franjas.map(hora => (
            <tr key={hora}>
              <td className="border p-1 text-center font-mono">{hora}</td>
              {diasSemana.map(dia => (
                <td
                  key={dia + hora}
                  className={`border h-6 text-center transition ${getColor(dia, hora)}`}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HorarioVisual;
