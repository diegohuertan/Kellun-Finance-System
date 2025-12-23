"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";

function SimuladorContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const id = searchParams.get("id"); // El ID que viene de tu Cloud Function

    const confirmarPago = async () => {
        try {
            // Llamamos a tu función con action: 'confirmar_pago'
            await fetch(process.env.NEXT_PUBLIC_API_URL!, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    action: "confirmar_pago", 
                    cuota_id: id 
                }),
            });
            // Si sale bien, volvemos al dashboard
            router.push("/app");
        } catch (error) {
            alert("Error al confirmar el pago en la base de datos");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="p-10 bg-white rounded-3xl shadow-2xl text-center border border-slate-200 max-w-sm">
                <h2 className="text-2xl font-black mb-2 text-slate-900 italic">Simulador Kellun 🏒</h2>
                <p className="text-slate-500 mb-6 text-sm">
                    ID Transacción:<br/>
                    <span className="font-mono text-xs bg-slate-100 p-1 rounded">{id}</span>
                </p>
                <Button 
                    onClick={confirmarPago} 
                    className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-bold"
                >
                    Confirmar Pago Exitoso
                </Button>
            </div>
        </div>
    );
}

export default function SimuladorPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Iniciando pasarela...</div>}>
            <SimuladorContent />
        </Suspense>
    );
}