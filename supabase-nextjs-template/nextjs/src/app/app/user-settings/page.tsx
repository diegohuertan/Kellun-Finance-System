"use client";

import React, { useEffect, useState } from 'react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { createBrowserClient } from '@supabase/ssr';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, User, Phone, Mail, BadgeCheck, ShieldAlert, Trophy, Hash, AlertTriangle } from 'lucide-react';

export default function UserSettings() {
    const { user } = useGlobal();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [debugError, setDebugError] = useState<string>("");

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function loadProfile() {
            if (!user?.id) return;
            
            console.log("🔍 Buscando perfil para el ID de Auth:", user.id);

            // Intentamos traer el perfil y la serie
            const { data, error } = await supabase
                .from('perfiles')
                .select(`
                    *,
                    series (
                        nombre_serie
                    )
                `)
                .eq('id', user.id)
                .single();

            if (error) {
                console.error("❌ Error Supabase:", error);
                setDebugError(`Error: ${error.message} (Código: ${error.code})`);
            } else {
                console.log("✅ Datos encontrados:", data);
                setProfile(data);
            }
            setLoading(false);
        }
        loadProfile();
    }, [user?.id]);

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10 text-primary-600"/></div>;

    // --- PANTALLA DE ERROR VISIBLE ---
    if (!profile) {
        return (
            <div className="p-8 max-w-2xl mx-auto mt-10 bg-white shadow-xl rounded-2xl border border-red-100">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-100 rounded-full text-red-600">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-800">No se puede mostrar el perfil</h2>
                        <p className="text-slate-500 text-sm">El sistema no pudo recuperar tus datos.</p>
                    </div>
                </div>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs space-y-2 text-slate-600">
                    <p><strong>ID Usuario (Auth):</strong> {user?.id}</p>
                    <p><strong>Estado del Error:</strong> {debugError || "No hubo error técnico, pero la consulta devolvió 'null'."}</p>
                </div>

                <div className="mt-6 text-sm text-slate-500">
                    <strong>Posibles causas:</strong>
                    <ul className="list-disc ml-5 mt-2 space-y-1">
                        <li>El ID con el que te logueaste no coincide con el ID en la tabla 'perfiles'.</li>
                        <li>Las reglas de seguridad (RLS) están bloqueando la lectura.</li>
                        <li>La relación con la tabla 'series' está rota (el serie_id {user?.user_metadata?.serie_id || '?'} no existe).</li>
                    </ul>
                </div>
            </div>
        );
    }

    // --- SI TODO SALE BIEN, MOSTRAMOS LA FICHA ---
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500">
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 italic tracking-tighter">Mi Ficha de Jugador 🏒</h1>
                    <p className="text-slate-500 font-medium italic">Información oficial del club</p>
                </div>
                <div className={`px-5 py-2 rounded-full border-2 font-black text-xs uppercase tracking-widest flex items-center gap-2 ${
                    profile.activo ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                }`}>
                    {profile.activo ? <BadgeCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                    {profile.activo ? 'HABILITADO' : 'INACTIVO'}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 bg-gradient-to-br from-sky-600 to-sky-800 text-white rounded-3xl overflow-hidden border-none shadow-xl">
                    <CardContent className="p-8 flex flex-col items-center text-center h-full justify-center space-y-6">
                        <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 text-3xl font-black">
                            {profile.nombre?.charAt(0)}{profile.apellido?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black">{profile.nombre} {profile.apellido}</h2>
                            <p className="text-sky-100 font-medium text-sm">{profile.es_admin ? 'Administrador' : 'Jugador'}</p>
                        </div>
                        <div className="bg-white/10 rounded-xl p-3 w-full border border-white/10">
                            <p className="text-[10px] uppercase tracking-widest text-sky-200 font-bold mb-1">Categoría</p>
                            <div className="flex items-center justify-center gap-2 text-xl font-black">
                                <Trophy className="w-5 h-5 text-yellow-400" />
                                {profile.series?.nombre_serie || 'Sin Categoría'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="md:col-span-2 border-slate-100 shadow-xl bg-white rounded-3xl">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 px-8 py-6">
                        <CardTitle className="text-lg font-bold text-slate-700 flex items-center gap-2">
                            <Hash className="w-5 h-5 text-slate-400" /> Datos de Registro
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 grid md:grid-cols-2 gap-8">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-1">
                                <Mail className="w-3 h-3" /> Email
                            </label>
                            <p className="text-lg font-bold text-slate-800 border-b pb-2">{user?.email}</p>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 mb-1">
                                <Phone className="w-3 h-3" /> Teléfono
                            </label>
                            <p className="text-lg font-bold text-slate-800 border-b pb-2">{profile.telefono}</p>
                        </div>
                        <div className="md:col-span-2 mt-4 bg-sky-50 p-4 rounded-xl border border-sky-100">
                            <p className="text-xs text-sky-800 font-medium flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Para editar estos datos, contacta a tu entrenador o administración.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}