"use client";

import React, { useEffect, useState } from 'react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldAlert, DollarSign, Users, Filter, ArrowLeft } from 'lucide-react';

// Tipos de datos para el reporte
interface ReporteCuota {
    id: string;
    mes: number;
    año: number;
    monto: number;
    estado: string;
    perfiles: {
        nombre: string;
        apellido: string;
        series: {
            nombre_serie: string;
        } | null;
    } | null;
}

export default function AdminDashboard() {
    const { user, loading: authLoading } = useGlobal();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [reporte, setReporte] = useState<ReporteCuota[]>([]);
    const [stats, setStats] = useState({ recaudado: 0, porCobrar: 0, sociosAlDia: 0 });
    
    // Filtros
    const [filtroMes, setFiltroMes] = useState(new Date().getMonth() + 1); // Mes actual por defecto
    const [filtroAnio, setFiltroAnio] = useState(new Date().getFullYear());

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function loadAdminData() {
            if (!user?.id) return;

            // 1. SEGURIDAD: Verificar si es admin realmente (es_admin)
            const { data: perfil } = await supabase
                .from('perfiles')
                .select('es_admin')
                .eq('id', user.id)
                .single();

            // Si no es admin o no existe perfil, lo expulsamos
            if (!perfil || !perfil.es_admin) {
                router.push('/app'); // ¡Fuera de aquí!
                return;
            }

            // 2. DATOS: Traer cuotas del mes seleccionado con toda la info del socio
            const { data, error } = await supabase
                .from('cuotas')
                .select(`
                    id, mes, año, monto, estado,
                    perfiles (
                        nombre, apellido,
                        series ( nombre_serie )
                    )
                `)
                .eq('mes', filtroMes)
                .eq('año', filtroAnio);

            if (data) {
                // Casteamos los datos para TypeScript
                const cuotasData = data as unknown as ReporteCuota[];
                setReporte(cuotasData);

                // Calcular KPIs en tiempo real
                const recaudado = cuotasData
                    .filter(c => c.estado === 'pagado')
                    .reduce((acc, c) => acc + c.monto, 0);
                
                const porCobrar = cuotasData
                    .filter(c => c.estado === 'pendiente')
                    .reduce((acc, c) => acc + c.monto, 0);
                
                const alDia = cuotasData.filter(c => c.estado === 'pagado').length;

                setStats({ recaudado, porCobrar, sociosAlDia: alDia });
            }
            setLoading(false);
        }

        if (!authLoading) loadAdminData();
    }, [user?.id, filtroMes, filtroAnio, authLoading, router]);

    if (loading || authLoading) {
        return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-primary-600 w-10 h-10"/></div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header Admin */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-slate-200 pb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest">Admin Zone</span>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight italic">Tesorería General 🏦</h1>
                        <p className="text-slate-500 font-medium">Gestión financiera y control de socios</p>
                    </div>
                    
                    {/* Filtros de Fecha */}
                    <div className="flex gap-2">
                         <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border shadow-sm">
                            <Filter className="w-4 h-4 text-slate-400" />
                            <select 
                                value={filtroMes} 
                                onChange={(e) => { setLoading(true); setFiltroMes(Number(e.target.value)); }}
                                className="bg-transparent border-none text-sm font-bold text-slate-700 outline-none cursor-pointer"
                            >
                                <option value="1">Enero</option>
                                <option value="2">Febrero</option>
                                <option value="3">Marzo</option>
                                <option value="4">Abril</option>
                                <option value="5">Mayo</option>
                                <option value="6">Junio</option>
                                <option value="7">Julio</option>
                                <option value="8">Agosto</option>
                                <option value="9">Septiembre</option>
                                <option value="10">Octubre</option>
                                <option value="11">Noviembre</option>
                                <option value="12">Diciembre</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border shadow-sm">
                            <span className="text-sm font-bold text-slate-700">{filtroAnio}</span>
                        </div>
                    </div>
                </div>

                {/* KPIs / Tarjetas de Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tarjeta 1: Recaudado (Verde) */}
                    <Card className="border-none shadow-xl bg-emerald-600 text-white overflow-hidden relative rounded-2xl">
                        <div className="absolute right-0 top-0 p-16 bg-white opacity-10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                        <CardHeader className="pb-2 relative z-10">
                            <CardTitle className="text-xs font-bold uppercase opacity-80 flex items-center gap-2 tracking-widest">
                                <DollarSign className="w-4 h-4" /> Recaudado (Mes)
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-4xl font-black">${stats.recaudado.toLocaleString('es-CL')}</div>
                        </CardContent>
                    </Card>

                    {/* Tarjeta 2: Por Cobrar (Rojo) */}
                    <Card className="border-none shadow-xl bg-white overflow-hidden rounded-2xl">
                        <div className="h-1 bg-rose-500 w-full absolute top-0 left-0" />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 tracking-widest">
                                <ShieldAlert className="w-4 h-4 text-rose-500" /> Pendiente de Cobro
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black text-slate-900">${stats.porCobrar.toLocaleString('es-CL')}</div>
                        </CardContent>
                    </Card>

                    {/* Tarjeta 3: Socios al Día (Azul) */}
                    <Card className="border-none shadow-xl bg-white overflow-hidden rounded-2xl">
                         <div className="h-1 bg-blue-500 w-full absolute top-0 left-0" />
                        <CardHeader className="pb-2">
                            <CardTitle className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2 tracking-widest">
                                <Users className="w-4 h-4 text-blue-500" /> Pagos Confirmados
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-black text-slate-900">
                                {stats.sociosAlDia} <span className="text-lg text-slate-300 font-medium">socios</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabla Maestra */}
                <Card className="border-none shadow-xl bg-white rounded-3xl overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                        <h3 className="font-bold text-slate-800 text-lg">Detalle de Transacciones</h3>
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{reporte.length} registros</span>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-400 uppercase bg-white border-b border-slate-100">
                                <tr>
                                    <th className="px-6 py-4 font-bold tracking-wider">Socio</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Serie</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Monto</th>
                                    <th className="px-6 py-4 font-bold tracking-wider">Estado</th>
                                    <th className="px-6 py-4 font-bold tracking-wider text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {reporte.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">
                                            No se encontraron cuotas para este período.
                                        </td>
                                    </tr>
                                ) : (
                                    reporte.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-700">{item.perfiles?.nombre} {item.perfiles?.apellido}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-800">
                                                    {item.perfiles?.series?.nombre_serie || 'Sin Serie'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-900 font-mono font-bold">
                                                ${item.monto.toLocaleString('es-CL')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 ${
                                                    item.estado === 'pagado' 
                                                    ? 'bg-emerald-100 text-emerald-700' 
                                                    : 'bg-rose-50 text-rose-600'
                                                }`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${item.estado === 'pagado' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                                                    {item.estado}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-primary-600 font-bold opacity-0 group-hover:opacity-100 transition-all">
                                                    Gestionar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

                <div className="text-center pb-8">
                     <Button variant="outline" onClick={() => router.push('/app')} className="gap-2 text-slate-400 hover:text-slate-600 border-slate-200">
                        <ArrowLeft className="w-4 h-4" /> Volver al Dashboard Personal
                     </Button>
                </div>

            </div>
        </div>
    );
}