'use client';

import { useState } from 'react';
import { createSPASassClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { CheckCircle, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const supabase = await createSPASassClient();
            // IMPORTANTE: Asegúrate de que esta URL sea la correcta en producción
            const { error } = await supabase.getSupabaseClient().auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/auth/reset-password`,
            });

            if (error) throw error;

            setSuccess(true);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocurrió un error desconocido');
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-white py-8 px-4 shadow-xl border border-slate-100 sm:rounded-2xl sm:px-10 max-w-md mx-auto mt-10">
                <div className="text-center">
                    <div className="flex justify-center mb-4 bg-emerald-50 w-20 h-20 rounded-full items-center mx-auto">
                        <CheckCircle className="h-10 w-10 text-emerald-500" />
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 mb-2">
                        ¡Revisa tu correo! 📨
                    </h2>

                    <p className="text-slate-500 mb-8 leading-relaxed">
                        Te hemos enviado un enlace para restablecer tu contraseña.
                        Revisa tu bandeja de entrada (y spam) y sigue las instrucciones.
                    </p>

                    <div className="mt-6 text-center text-sm">
                        <Link href="/auth/login" className="font-bold text-primary-600 hover:text-primary-800 transition-colors">
                            ← Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white py-8 px-4 shadow-xl border border-slate-100 sm:rounded-2xl sm:px-10 max-w-md mx-auto mt-10">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-4 bg-blue-50 w-16 h-16 rounded-full items-center mx-auto">
                    <Mail className="h-8 w-8 text-primary-600" />
                </div>
                <h2 className="text-2xl font-black text-center text-slate-900 mb-2">
                    Recuperar Contraseña
                </h2>
                <p className="text-center text-slate-500 text-sm mb-8">
                    Ingresa tu correo y te enviaremos un enlace mágico.
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-100 text-center font-bold">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-bold text-slate-700 mb-1">
                        Correo Electrónico
                    </label>
                    <div className="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="block w-full appearance-none rounded-xl border border-slate-200 px-4 py-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all font-medium placeholder:text-slate-300"
                            placeholder="tucorreo@ejemplo.com"
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-xl border border-transparent bg-slate-900 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-slate-200 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 disabled:opacity-50 transition-all hover:-translate-y-0.5"
                    >
                        {loading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                    </button>
                </div>
            </form>

            <div className="mt-8 text-center text-sm border-t border-slate-100 pt-6">
                <span className="text-slate-500">¿Ya te acordaste?</span>
                {' '}
                <Link href="/auth/login" className="font-bold text-primary-600 hover:text-primary-800 transition-colors">
                    Inicia Sesión
                </Link>
            </div>
        </div>
    );
}