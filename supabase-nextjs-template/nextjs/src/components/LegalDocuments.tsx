'use client';
import React from "react";
import {FileText, RefreshCw, Shield} from "lucide-react";
import Link from "next/link";

type LegalDocumentsParams = {
    minimalist: boolean;
}

export default function LegalDocuments({ minimalist }: LegalDocumentsParams) {
    if (minimalist) {
        return (
            <>
                <div className="mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary-600"/>
                    <span className="text-sm font-bold text-slate-900">Documentos Legales</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <Link
                        href={`/legal/privacy`}
                        className="flex items-center justify-center px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
                    >
                        <span className="text-xs font-medium text-slate-600 hover:text-primary-600">Política de Privacidad</span>
                    </Link>
                    <Link
                        href={`/legal/terms`}
                        className="flex items-center justify-center px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
                    >
                        <span className="text-xs font-medium text-slate-600 hover:text-primary-600">Términos y Condiciones</span>
                    </Link>
                    <Link
                        href={`/legal/refund`}
                        className="flex items-center justify-center px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100"
                    >
                        <span className="text-xs font-medium text-slate-600 hover:text-primary-600">Política de Devoluciones</span>
                    </Link>
                </div>
            </>
        )
    }
    return (
        <>
            <div className="flex items-center gap-2 mb-4 justify-center">
                <FileText className="w-5 h-5 text-primary-600"/>
                <span className="text-lg font-black text-slate-900">Documentación Legal</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link
                    href={`/legal/privacy`}
                    className="flex flex-col items-center justify-center gap-2 px-4 py-6 bg-white rounded-xl border border-slate-200 hover:border-primary-500 hover:shadow-md transition-all group"
                >
                    <Shield className="w-6 h-6 text-slate-400 group-hover:text-primary-600 transition-colors"/>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-primary-700">Política de Privacidad</span>
                </Link>
                <Link
                    href={`/legal/terms`}
                    className="flex flex-col items-center justify-center gap-2 px-4 py-6 bg-white rounded-xl border border-slate-200 hover:border-primary-500 hover:shadow-md transition-all group"
                >
                    <FileText className="w-6 h-6 text-slate-400 group-hover:text-primary-600 transition-colors"/>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-primary-700">Términos y Condiciones</span>
                </Link>
                <Link
                    href={`/legal/refund`}
                    className="flex flex-col items-center justify-center gap-2 px-4 py-6 bg-white rounded-xl border border-slate-200 hover:border-primary-500 hover:shadow-md transition-all group"
                >
                    <RefreshCw className="w-6 h-6 text-slate-400 group-hover:text-primary-600 transition-colors"/>
                    <span className="text-sm font-bold text-slate-700 group-hover:text-primary-700">Política de Devoluciones</span>
                </Link>
            </div>
        </>
    )
}