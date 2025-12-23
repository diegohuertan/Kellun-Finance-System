'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useState, useEffect } from 'react'; // <--- Agregamos useEffect
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Definimos el tipo para TypeScript (opcional pero recomendado)
type Serie = {
  id: number;
  nombre_serie: string;
};

export default function RegisterPage() {
    // Estado para las series cargadas desde la DB
    const [series, setSeries] = useState<Serie[]>([]);

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        telefono: '',
        serie_id: '', // <--- Nuevo campo importante
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // --- CARGAR SERIES AL INICIAR ---
    useEffect(() => {
        const fetchSeries = async () => {
            // Vamos a buscar id y nombre a la tabla que ya creaste
            const { data, error } = await supabase
                .from('series')
                .select('id, nombre_serie')
                .order('id', { ascending: true }); // Ordenadito

            if (error) {
                console.error('Error cargando series:', error);
            } else if (data) {
                setSeries(data);
            }
        };

        fetchSeries();
    }, []);

    // Manejador genérico para inputs y selects
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        if (!formData.serie_id) {
            setError("Por favor selecciona una categoría/serie.");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.signUp({
                email: formData.email,
                password: formData.password,
                options: {
                    // Aquí enviamos la data que el Trigger SQL capturará
                    data: {
                        nombre: formData.nombre,
                        apellido: formData.apellido,
                        telefono: formData.telefono,
                        serie_id: parseInt(formData.serie_id) // Enviamos el ID de la serie
                    }
                }
            });

            if (error) throw error;
            router.push('/auth/verify-email'); 
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error al registrarse.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white py-10 px-8 shadow-xl rounded-3xl border border-slate-100 max-w-md mx-auto">
             <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 italic">
                    Únete al Club 🏒
                </h1>
                <p className="text-slate-500 font-medium italic">Crea tu cuenta de socio</p>
            </div>

            {error && (
                <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl flex items-center italic">
                    ⚠️ {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Nombre</label>
                        <input name="nombre" type="text" required value={formData.nombre} onChange={handleChange} className="w-full rounded-xl border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:ring-primary-500 border" placeholder="Diego" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Apellido</label>
                        <input name="apellido" type="text" required value={formData.apellido} onChange={handleChange} className="w-full rounded-xl border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:ring-primary-500 border" placeholder="Huerta" />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Teléfono</label>
                    <input name="telefono" type="tel" required value={formData.telefono} onChange={handleChange} className="w-full rounded-xl border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:ring-primary-500 border" placeholder="+56 9..." />
                </div>

                {/* --- AQUÍ ESTÁ EL SELECTOR NUEVO --- */}
                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Categoría / Serie</label>
                    <select
                        name="serie_id"
                        required
                        value={formData.serie_id}
                        onChange={handleChange}
                        className="w-full rounded-xl border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:ring-primary-500 border bg-white"
                    >
                        <option value="">Selecciona tu serie...</option>
                        {series.map((serie) => (
                            <option key={serie.id} value={serie.id}>
                                {serie.nombre_serie}
                            </option>
                        ))}
                    </select>
                </div>
                {/* ----------------------------------- */}

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Correo Electrónico</label>
                    <input name="email" type="email" required value={formData.email} onChange={handleChange} className="w-full rounded-xl border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:ring-primary-500 border" placeholder="tu@correo.com" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Contraseña</label>
                    <input name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full rounded-xl border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:ring-primary-500 border" placeholder="••••••••" />
                </div>

                <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Confirmar Contraseña</label>
                    <input name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="w-full rounded-xl border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:ring-primary-500 border" placeholder="••••••••" />
                </div>

                <button type="submit" disabled={loading} className="w-full rounded-xl bg-sky-600 py-4 text-sm font-black text-white shadow-lg shadow-sky-100 hover:bg-sky-700 transition-all uppercase tracking-widest mt-4">
                    {loading ? 'Registrando...' : 'CREAR CUENTA'}
                </button>
            </form>

            <div className="mt-8 text-center">
                <p className="text-sm text-slate-500 italic">
                    ¿Ya tienes cuenta? <Link href="/auth/login" className="font-bold text-sky-600 hover:underline">Ingresa aquí</Link>
                </p>
            </div>
        </div>
    );
}