"use client";

import React, { useEffect, useState } from 'react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { createBrowserClient } from '@supabase/ssr';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Loader2, User, Phone, Mail, BadgeCheck, ShieldAlert, Trophy, Hash, AlertTriangle, Shield, Key, Save } from 'lucide-react';
import { createSPASassClient } from "@/lib/supabase/client"; // Necesario para update password

export default function UserSettings() {
    const { user } = useGlobal();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [debugError, setDebugError] = useState<string>("");

    // Estados para cambio de contraseña
    const [newPassword, setNewPassword] = useState("");
    const [loadingPass, setLoadingPass] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // 1. Cargar Perfil
    useEffect(() => {
        async function loadProfile() {
            if (!user?.id) return;
            
            const { data, error } = await supabase
                .from('perfiles')
                .select(`*, series ( nombre_serie )`)
                .eq('id', user.id)
                .single();

            if (error) {
                console.error("❌ Error Supabase:", error);
                setDebugError(`Error: ${error.message}`);
            } else {
                setProfile(data);
            }
            setLoading(false);
        }
        loadProfile();
    }, [user?.id]);

    // 2. Función Cambiar Contraseña (Directo)
    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingPass(true);
        setMessage(null);

        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'La contraseña debe tener al menos 6 caracteres' });
            setLoadingPass(false);
            return;
        }

        try {
            const client = await createSPASassClient();
            const { error } = await client.getSupabaseClient().auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setMessage({ type: 'success', text: '¡Contraseña actualizada correctamente!' });
            setNewPassword(""); 
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Error al actualizar' });
        } finally {
            setLoadingPass(false);
        }
    };

    if (loading) return <div className="flex justify-center p-20"><Loader2 className="animate-spin w-10 h-10 text-primary-600"/></div>;

    if (!profile) {
        return (
            <div className="p-8 max-w-2xl mx-auto mt-10 bg-white shadow-xl rounded-2xl border border-red-100">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-red-100 rounded-full text-red-600"><AlertTriangle className="w-8 h-8" /></div>
                    <div><h2 className="text-xl font-black text-slate-800">No se puede mostrar el perfil</h2></div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 font-mono text-xs text-slate-600">
                    <p><strong>Error:</strong> {debugError || "Perfil no encontrado."}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in duration-500 pb-12">
            
            {/* Header */}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                
                {/* 1. Tarjeta de Identidad (Izquierda) */}
                <Card className="md:col-span-1 bg-gradient-to-br from-sky-600 to-sky-900 text-white rounded-3xl overflow-hidden border-none shadow-2xl relative">
                    {/* Efecto de fondo */}
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-3xl"></div>
                    
                    <CardContent className="p-8 flex flex-col items-center text-center h-full justify-center space-y-8 relative z-10">
                        <div className="w-28 h-28 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/20 text-4xl font-black shadow-lg">
                            {profile.nombre?.charAt(0)}{profile.apellido?.charAt(0)}
                        </div>
                        <div>
                            <h2 className="text-2xl font-black">{profile.nombre} {profile.apellido}</h2>
                            <p className="text-sky-200 font-bold text-sm tracking-wide uppercase mt-1">{profile.es_admin ? 'Administrador' : 'Jugador Oficial'}</p>
                        </div>
                        <div className="bg-black/20 rounded-xl p-4 w-full border border-white/5 backdrop-blur-sm">
                            <p className="text-[10px] uppercase tracking-widest text-sky-300 font-bold mb-2">Categoría Actual</p>
                            <div className="flex items-center justify-center gap-2 text-xl font-black text-white">
                                <Trophy className="w-5 h-5 text-yellow-400" />
                                {profile.series?.nombre_serie || 'Sin Categoría'}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Columna Derecha: Datos + Seguridad */}
                <div className="md:col-span-2 space-y-6">
                    
                    {/* 2. Datos de Contacto */}
                    <Card className="border-slate-100 shadow-lg bg-white rounded-3xl overflow-hidden">
                        <CardHeader className="bg-slate-50 border-b border-slate-100 px-8 py-5">
                            <CardTitle className="text-base font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wide">
                                <Hash className="w-4 h-4 text-slate-400" /> Datos de Registro
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 grid md:grid-cols-2 gap-8">
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2 mb-2">
                                    <Mail className="w-3 h-3" /> Email Registrado
                                </label>
                                <div className="text-sm font-bold text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100 truncate">
                                    {user?.email}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2 mb-2">
                                    <Phone className="w-3 h-3" /> Teléfono
                                </label>
                                <div className="text-sm font-bold text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    {profile.telefono || 'No registrado'}
                                </div>
                            </div>
                            <div className="md:col-span-2 bg-sky-50 p-3 rounded-lg border border-sky-100 flex items-center gap-3">
                                <div className="bg-sky-100 p-1.5 rounded-full text-sky-600"><User className="w-4 h-4" /></div>
                                <p className="text-xs text-sky-800 font-medium">
                                    Para editar estos datos sensibles, contacta a administración.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* 3. ZONA DE SEGURIDAD (Cambio de Clave) */}
                    <Card className="border-slate-100 shadow-lg bg-white rounded-3xl overflow-hidden relative">
                        <CardHeader className="bg-white border-b border-slate-100 px-8 py-5">
                            <CardTitle className="text-base font-bold text-slate-700 flex items-center gap-2 uppercase tracking-wide">
                                <Shield className="w-4 h-4 text-slate-400" /> Seguridad de la Cuenta
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8">
                            <form onSubmit={handleUpdatePassword} className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1 w-full">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase mb-2 block">
                                        Nueva Contraseña
                                    </label>
                                    <div className="relative">
                                        <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input 
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Mínimo 6 caracteres"
                                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all font-bold text-sm"
                                        />
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={loadingPass || !newPassword}
                                    className="w-full md:w-auto bg-slate-900 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
                                >
                                    {loadingPass ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Actualizar
                                </button>
                            </form>

                            {/* Mensajes de Feedback */}
                            {message && (
                                <div className={`mt-4 p-3 rounded-lg text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 ${
                                    message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'
                                }`}>
                                    {message.type === 'success' ? <BadgeCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                    {message.text}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                </div>
            </div>
        </div>
    );
}