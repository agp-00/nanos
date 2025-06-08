import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../services/axiosInstance';

function SemanasAdminPage() {
    const [form, setForm] = useState({
        fecha_inicio: '',
        fecha_fin: '',
        horarios: Array(7).fill({ hora_inicio: '', hora_fin: '' })
    });

    const diasSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    const navigate = useNavigate();

    const handleChangeHorario = (index, campo, valor) => {
        const nuevosHorarios = [...form.horarios];
        nuevosHorarios[index] = {
            ...nuevosHorarios[index],
            [campo]: valor
        };
        setForm({ ...form, horarios: nuevosHorarios });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const horariosConDias = form.horarios.map((horario, i) => ({
            ...horario,
            dia_semana: diasSemana[i]
        }));

        try {
            await axios.post('/semanas', {
                fecha_inicio: form.fecha_inicio,
                fecha_fin: form.fecha_fin,
                horarios: horariosConDias
            });
            navigate('/admin/reservas');
        } catch (error) {
            console.error('Error al crear semana:', error);
        }
    };


    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Crear Nueva Semana</h1>
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded shadow">
                <div className="grid grid-cols-2 gap-4">
                    <label>
                        Fecha inicio:
                        <input type="date" value={form.fecha_inicio} onChange={e => setForm({ ...form, fecha_inicio: e.target.value })} className="w-full border p-2" required />
                    </label>
                    <label>
                        Fecha fin:
                        <input type="date" value={form.fecha_fin} onChange={e => setForm({ ...form, fecha_fin: e.target.value })} className="w-full border p-2" required />
                    </label>
                </div>

                {diasSemana.map((dia, i) => (
                    <div key={dia} className="grid grid-cols-3 items-center gap-4">
                        <p className="capitalize font-medium">{dia}</p>
                        <input
                            type="time"
                            value={form.horarios[i]?.hora_inicio || ''}
                            onChange={e => handleChangeHorario(i, 'hora_inicio', e.target.value)}
                            className="border p-1"
                            required
                        />
                        <input
                            type="time"
                            value={form.horarios[i]?.hora_fin || ''}
                            onChange={e => handleChangeHorario(i, 'hora_fin', e.target.value)}
                            className="border p-1"
                            required
                        />
                    </div>
                ))}

                <div className="flex justify-between items-center mt-6">
                    <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        Crear semana
                    </button>
                    <button type="button" onClick={() => navigate('/admin/reservas')} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                        Volver
                    </button>
                </div>
            </form>
        </div>
    );
}

export default SemanasAdminPage;
