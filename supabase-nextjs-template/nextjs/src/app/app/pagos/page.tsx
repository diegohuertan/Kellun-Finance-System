"use client";
import React, { useEffect, useState } from 'react';
import { useGlobal } from '@/lib/context/GlobalContext';
import { createBrowserClient } from '@supabase/ssr';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Loader2, TrendingUp, AlertCircle } from 'lucide-react';

export default function ResumenDashboard() {
    const { user, loading: authLoading } = useGlobal();
    const [stats, setStats] = useState({ pagado: 0, pendiente: 0, total: 0 });
    const [fetching, setFetching] = useState(true);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        async function loadStats() {
            if (!user?.id) return;

            // 1. CORRECCIÓN AQUÍ: Pedimos 'monto', NO 'monto_total'
            const { data } = await supabase
                .from("cuotas")
                .select("monto, estado") 
                .eq("socio_id", user.id);

            if (data) {
                // 2. CORRECCIÓN AQUÍ: Usamos c.monto
                const pagado = data
                    .filter(c => c.estado === 'pagado')
                    .reduce((acc, c) => acc + Number(c.monto), 0);
                
                // 3. CORRECCIÓN AQUÍ: Usamos c.monto
                const pendiente = data
                    .filter(c => c.estado === 'pendiente')
                    .reduce((acc, c) => acc + Number(c.monto), 0);
                
                setStats({ pagado, pendiente, total: pagado + pendiente });
            }
            setFetching(false);
        }

        if (!authLoading) loadStats();
    }, [authLoading, user?.id]);

    const dataChart = [
        { name: 'Pagado', value: stats.pagado, color: '#22c55e' },
        { name: 'Pendiente', value: stats.pendiente, color: '#ef4444' }
    ];

    if (authLoading || fetching) {
        return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="h-8 w-8 animate-spin text-primary-600" /></div>;
    }

    return (
        <div className="p-6 space-y-8 max-w-6xl mx-auto">
            <header>
                <h1 className="text-3xl font-black text-slate-900 italic tracking-tighter">Resumen General 🏒</h1>
                <p className="text-slate-500 font-medium italic">Estado financiero actual</p>
            </header>

            {/* Tarjetas de Estadísticas Rápidas */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card className="border-none shadow-lg bg-white overflow-hidden">
                    <div className="h-2 bg-green-500" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Total Pagado</CardTitle>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-900">${stats.pagado.toLocaleString('es-CL')}</div>
                    </CardContent>
                </Card>

                <Card className="border-none shadow-lg bg-white overflow-hidden">
                    <div className="h-2 bg-red-500" />
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-bold text-slate-500 uppercase">Total Pendiente</CardTitle>
                        <AlertCircle className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-black text-slate-900">${stats.pendiente.toLocaleString('es-CL')}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Gráfico de Distribución */}
            <Card className="border-none shadow-lg p-6 bg-white">
                <CardTitle className="text-xl font-bold text-slate-800 mb-8 italic">Balance de Cuotas</CardTitle>
                <div className="h-[350px] w-full">
                    {/* Agregamos protección para no renderizar gráfico vacío */}
                    {stats.total > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dataChart}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {dataChart.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value: number) => `$${value.toLocaleString('es-CL')}`}
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 italic">
                            No hay datos financieros registrados.
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}