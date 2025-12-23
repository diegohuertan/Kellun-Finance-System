'use client';

import { createSPASassClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showMFAPrompt, setShowMFAPrompt] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const client = await createSPASassClient();
            const { error: signInError } = await client.loginEmail(email, password);

            if (signInError) throw signInError;

            const supabase = client.getSupabaseClient();
            const { data: mfaData, error: mfaError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();

            if (mfaError) throw mfaError;

            if (mfaData.nextLevel === 'aal2' && mfaData.nextLevel !== mfaData.currentLevel) {
                setShowMFAPrompt(true);
            } else {
                router.push('/app');
                return;
            }
        } catch (err) {
            if (err instanceof Error) {
                setError('Credenciales inválidas. Inténtalo de nuevo.');
            } else {
                setError('Ocurrió un error inesperado.');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if(showMFAPrompt) {
            router.push('/auth/2fa');
        }
    }, [showMFAPrompt, router]);

    return (
        <div className="bg-white py-10 px-8 shadow-xl rounded-3xl border border-slate-100">
            {/* Header de Identidad */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2 italic">
                    Kellun Finance 🏒
                </h1>
                <p className="text-slate-500 font-medium italic">Portal de Socios</p>
            </div>

            {error && (
                <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl flex items-center italic">
                    <span className="mr-2">⚠️</span> {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                    <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Correo Electrónico
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="ejemplo@correo.com"
                        className="block w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm transition-all"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="block w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm transition-all"
                    />
                </div>

                <div className="flex justify-end">
                    <Link href="/auth/forgot-password" ml-2 className="text-xs font-bold text-primary-600 hover:text-primary-700 uppercase tracking-tighter">
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full justify-center rounded-xl bg-primary-600 py-4 px-4 text-sm font-black text-white shadow-lg shadow-primary-100 hover:bg-primary-700 focus:outline-none transition-all disabled:opacity-50 uppercase tracking-widest"
                >
                    {loading ? (
                        <span className="flex items-center italic">
                            Cargando...
                        </span>
                    ) : 'Ingresar'}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-50 text-center">
                <p className="text-sm text-slate-500 italic">
                    ¿Aún no eres socio?{' '}
                    <Link href="/auth/register" className="font-bold text-primary-600 hover:underline tracking-tight">
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </div>
    );
}