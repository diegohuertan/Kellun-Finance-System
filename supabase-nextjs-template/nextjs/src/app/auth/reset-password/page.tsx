'use client';

import { useState, useEffect } from 'react';
import { createSPASassClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { CheckCircle, Key, Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkSession = async () => {
            try {
                const supabase = await createSPASassClient();
                const { data: { user }, error } = await supabase.getSupabaseClient().auth.getUser();

                if (error || !user) {
                    setError('El enlace es inválido o ha expirado. Solicita uno nuevo.');
                }
            } catch {
                setError('No pudimos verificar tu sesión.');
            }
        };

        checkSession();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError("Las contraseñas no coinciden ❌");
            return;
        }

        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);

        try {
            const supabase = await createSPASassClient();
            const { error } = await supabase.getSupabaseClient().auth.updateUser({
                password: newPassword
            });

            if (error) throw error;

            setSuccess(true);
            // Redirigir después de 3 segundos
            setTimeout(() => {
                router.push('/app');
            }, 3000);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Error al actualizar contraseña');
            }
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="bg-white py-8 px-4 shadow-xl border border-slate-100 sm:rounded-2xl sm:px-10 max-w-md mx-auto mt-10">
                <div className="text-center">
                    <div className="flex justify-center mb-4 bg-emerald-50 w-20 h-20 rounded-full items-center mx-auto animate-bounce">
                        <CheckCircle className="h-10 w-10 text-emerald-500" />
                    </div>

                    <h2 className="text-2xl font-black text-slate-900 mb-2">
                        ¡Contraseña Actualizada!
                    </h2>

                    <p className="text-slate-500 mb-8">
                        Has recuperado el acceso exitosamente.
                        <br/>
                        <span className="text-sm font-bold text-emerald-600">Te redirigiremos al portal en un momento...</span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white py-8 px-4 shadow-xl border border-slate-100 sm:rounded-2xl sm:px-10 max-w-md mx-auto mt-10">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-4 bg-purple-50 w-16 h-16 rounded-full items-center mx-auto">
                    <Key className="h-8 w-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-black text-center text-slate-900 mb-8">
                    Crea tu nueva clave
                </h2>
            </div>

            {error && (
                <div className="mb-6 p-4 text-sm text-red-700 bg-red-50 rounded-xl border border-red-100 text-center font-bold">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="new-password" className="block text-sm font-bold text-slate-700 mb-1">
                        Nueva Contraseña
                    </label>
                    <div className="mt-1">
                        <input
                            id="new-password"
                            name="new-password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="block w-full appearance-none rounded-xl border border-slate-200 px-4 py-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="confirm-password" className="block text-sm font-bold text-slate-700 mb-1">
                        Confirmar Contraseña
                    </label>
                    <div className="mt-1">
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            autoComplete="new-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="block w-full appearance-none rounded-xl border border-slate-200 px-4 py-3 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all font-medium"
                        />
                    </div>
                    <p className="mt-2 text-xs text-slate-400 font-medium">
                        Mínimo 6 caracteres
                    </p>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex w-full justify-center rounded-xl border border-transparent bg-purple-600 py-3.5 px-4 text-sm font-bold text-white shadow-lg shadow-purple-200 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 transition-all hover:-translate-y-0.5"
                    >
                        {loading ? <Loader2 className="animate-spin w-5 h-5"/> : 'Actualizar y Entrar'}
                    </button>
                </div>
            </form>
        </div>
    );
}