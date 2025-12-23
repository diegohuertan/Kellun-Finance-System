"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, FileText, Shield, RefreshCw } from 'lucide-react';

// Menú lateral traducido
const legalDocuments = [
    {
        id: 'privacy', // Mantenemos el ID en inglés para que coincida con la URL
        title: 'Política de Privacidad',
        icon: Shield,
        description: 'Cómo protegemos tus datos'
    },
    {
        id: 'terms',
        title: 'Términos y Condiciones',
        icon: FileText,
        description: 'Reglas de uso del servicio'
    },
    {
        id: 'refund',
        title: 'Política de Devoluciones',
        icon: RefreshCw,
        description: 'Reembolsos y cancelaciones'
    }
];

export default function LegalLayout({ children } : { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Botón Volver Traducido */}
                <div className="py-6">
                    <button
                        onClick={() => router.push('/')} // Te lleva al Home
                        className="inline-flex items-center text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al Inicio
                    </button>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Lateral */}
                    <div className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
                            <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                                <h2 className="text-lg font-black text-slate-800">Centro Legal</h2>
                                <p className="text-xs text-slate-500 mt-1">Información importante</p>
                            </div>
                            <nav className="p-2 space-y-1">
                                {legalDocuments.map((doc) => {
                                    // Detectamos si el link está activo
                                    const isActive = pathname?.includes(doc.id);
                                    return (
                                        <Link
                                            key={doc.id}
                                            href={`/legal/${doc.id}`}
                                            className={`group flex items-center p-3 rounded-lg transition-all ${
                                                isActive 
                                                ? 'bg-slate-900 text-white shadow-md' 
                                                : 'hover:bg-slate-50 text-slate-600'
                                            }`}
                                        >
                                            <doc.icon className={`w-5 h-5 flex-shrink-0 mr-3 ${isActive ? 'text-slate-300' : 'text-slate-400 group-hover:text-blue-500'}`} />
                                            <div>
                                                <div className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-700'}`}>
                                                    {doc.title}
                                                </div>
                                                <div className={`text-[10px] leading-tight ${isActive ? 'text-slate-400' : 'text-slate-400'}`}>
                                                    {doc.description}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </div>
                    </div>

                    {/* Contenido Principal */}
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}