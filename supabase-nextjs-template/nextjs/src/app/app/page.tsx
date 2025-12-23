"use client";

import React, { useEffect, useState } from 'react';
import { useGlobal } from '@/lib/context/GlobalContext';
// Usamos la misma librería que el autor usa en su primera línea de unified.ts
import { createBrowserClient } from '@supabase/ssr';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function DashboardHockey() {
    const { loading: authLoading, user } = useGlobal();
    const [cuotas, setCuotas] = useState<any[]>([]);
    const [fetching, setFetching] = useState(true);
    const [isPaying, setIsPaying] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    useEffect(() => {
        async function loadData() {
            if (!user?.id) return; 

            const { data } = await supabase
                .from("cuotas")
                .select("*")
                .eq("socio_id", user.id) 
                .order("mes", { ascending: false });

            if (data) setCuotas(data);
            setFetching(false);
        }

        if (!authLoading) loadData();
    }, [authLoading, user?.id]);

    const handlePayment = async (cuotaId: string) => {
        setIsPaying(cuotaId);
        try {
            const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ cuota_id: cuotaId }),
            });
            const result = await res.json();
            if (result.url) window.location.href = result.url;
        } catch (err) {
            alert("Error de conexión");
        } finally {
            setIsPaying(null);
        }
    };

    if (authLoading || fetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-6xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Kellun Finance 🏒</h1>
                <p className="text-slate-500 font-medium">Socio: {user?.email}</p>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {cuotas.map((cuota) => (
                    <Card key={cuota.id} className={cuota.estado === 'pagado' ? 'bg-green-50/50 border-green-100' : ''}>
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                                <CardTitle className="text-lg">Mes {cuota.mes} / {cuota.anio}</CardTitle>
                                {cuota.estado === 'pagado' ? 
                                    <CheckCircle className="h-5 w-5 text-green-500" /> : 
                                    <AlertCircle className="h-5 w-5 text-orange-500" />
                                }
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold mb-6">${cuota.monto.toLocaleString('es-CL')}</div>
                            
                            {cuota.estado === 'pendiente' ? (
                                <Button 
                                    onClick={() => handlePayment(cuota.id)}
                                    disabled={!!isPaying}
                                    className="w-full bg-primary-600 hover:bg-primary-700 font-bold"
                                >
                                    {isPaying === cuota.id ? <Loader2 className="animate-spin h-4 w-4" /> : 'PAGAR AHORA'}
                                </Button>
                            ) : (
                                <div className="text-center py-2 bg-green-100 text-green-700 rounded-lg font-bold text-xs border border-green-200 uppercase">
                                    Pago Confirmado
                                </div>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}