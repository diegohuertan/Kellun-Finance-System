"use client";

import React, { useEffect, useState } from 'react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { createBrowserClient } from '@supabase/ssr';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, User, Phone, Mail, BadgeCheck, ShieldAlert, Trophy, Hash } from 'lucide-react';

// Definimos una interfaz simple para manejar los datos que vienen del join
interface ProfileData {
    nombre: string;
    apellido: string;
    telefono: string;
    email: string;
    activo: boolean;
    es_admin: boolean;
    series: {
        nombre_serie: string;
        precio_mensual?: number;
    } | null;
}

export default function UserSettings() {
    const { user } = useGlobal();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<ProfileData | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function loadProfile() {
            if (!user?.id) return;
            
            // Hacemos un JOIN para traer el nombre de la serie automáticamente
            const { data, error } = await supabase
                .from('perfiles')
                .select(`
                    *,
                    series (
                        nombre_serie,
                        precio_mensual
                    )
                `)
                .eq('id', user.id)
                .single();

            if (data) {
                setProfile({
                    nombre: data.nombre || '',
                    apellido: data.apellido || '',
                    telefono: data.telefono || '',
                    activo: data.es_admin ? true : true, // Asumimos activo por defecto si existe, o usa tu lógica de negocio
                    es_admin: data.es_admin,
                    email: user.email || '',
                    series: data.series // Supabase devuelve esto como objeto gracias a la relación
                });
            }
            setLoading(false);
        }
        loadProfile();
    }, [user?.id]);

    if (loading) {
        return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-sky-600 w-10 h-10" /></div>;
    }

    if (!profile) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Encabezado Principal */}
            <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 italic tracking-tighter">
                        Mi Ficha de Jugador 🏒
                    </h1>
                    <p className="text-slate-500 font-medium italic">Información oficial del club</p>
                </div>
                
                {/* Badge de Estado del Jugador */}
                <div className={`px-5 py-2 rounded-full border-2 font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-sm ${
                    profile.activo 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                    {profile.activo ? <BadgeCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                    {profile.activo ? 'HABILITADO PARA JUGAR' : 'JUGADOR INACTIVO'}
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Columna Izquierda: Tarjeta de Identidad (Visual) */}
                <div className="md:col-span-1">
                    <Card className="h-full border-none shadow-xl bg-gradient-to-b from-sky-600 to-sky-800 text-white rounded-3xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 p-32 bg-white opacity-5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                        <CardContent className="p-8 flex flex-col items-center text-center h-full justify-center space-y-4">
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-inner">
                                <span className="text-3xl font-black">{profile.nombre.charAt(0)}{profile.apellido.charAt(0)}</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black tracking-tight">{profile.nombre} {profile.apellido}</h2>
                                <p className="text-sky-100 font-medium text-sm">{profile.es_admin ? 'Administrador' : 'Socio / Jugador'}</p>
                            </div>
                            
                            {/* Mostrar la Serie Destacada */}
                            <div className="mt-6 bg-white/10 rounded-xl p-4 w-full border border-white/10">
                                <p className="text-xs uppercase tracking-widest text-sky-200 mb-1 font-bold">Categoría</p>
                                <div className="flex items-center justify-center gap-2 text-xl font-black text-white">
                                    <Trophy className="w-5 h-5 text-yellow-400" />
                                    {profile.series?.nombre_serie || 'Sin Categoría'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Columna Derecha: Detalles Técnicos (Read Only) */}
                <Card className="md:col-span-2 border-slate-100 shadow-xl bg-white rounded-3xl overflow-hidden">
                    <CardHeader className="bg-slate-50 border-b border-slate-100 px-8 py-6">
                        <CardTitle className="text-lg font-bold text-slate-700 flex items-center gap-2">
                            <Hash className="w-5 h-5 text-slate-400" />
                            Datos de Contacto y Registro
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                            
                            {/* Bloque: Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 tracking-wider">
                                    <Mail className="w-3 h-3" /> Correo Electrónico
                                </label>
                                <div className="text-slate-800 font-bold text-lg border-b border-slate-100 pb-2">
                                    {profile.email}
                                </div>
                            </div>

                            {/* Bloque: Teléfono */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 tracking-wider">
                                    <Phone className="w-3 h-3" /> Teléfono
                                </label>
                                <div className="text-slate-800 font-bold text-lg border-b border-slate-100 pb-2">
                                    {profile.telefono || 'No registrado'}
                                </div>
                            </div>

                            {/* Bloque: Nombre Completo */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 tracking-wider">
                                    <User className="w-3 h-3" /> Nombre Completo
                                </label>
                                <div className="text-slate-800 font-bold text-lg border-b border-slate-100 pb-2">
                                    {profile.nombre} {profile.apellido}
                                </div>
                            </div>

                            {/* Bloque: ID Interno (Opcional, técnico) */}
                            <div className="space-y-2 opacity-50">
                                <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 tracking-wider">
                                    ID de Sistema
                                </label>
                                <div className="text-slate-600 font-mono text-xs border-b border-slate-100 pb-2 truncate">
                                    {user?.id}
                                </div>
                            </div>

                        </div>

                        {/* Pie de tarjeta con ayuda */}
                        <div className="mt-10 bg-sky-50 rounded-xl p-4 flex items-start gap-3 border border-sky-100">
                            <div className="bg-white p-2 rounded-full shadow-sm text-sky-600">
                                <User className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-sky-900">¿Necesitas actualizar tus datos?</h4>
                                <p className="text-xs text-sky-700 mt-1">
                                    Por seguridad y consistencia en los cobros, los datos sensibles no son editables directamente. 
                                    Contacta a la administración del club para cambios de serie o corrección de datos.
                                </p>
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}