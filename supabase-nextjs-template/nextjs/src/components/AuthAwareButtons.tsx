"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Loader2, LayoutDashboard, LogIn } from 'lucide-react';
import { createSPASassClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

export default function AuthAwareButtons({ variant = 'nav' }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const supabase = await createSPASassClient();
                const { data: { user } } = await supabase.getSupabaseClient().auth.getUser();
                setUser(user);
            } catch (error) {
                console.error('Error checking auth status:', error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    // 1. Estado de Carga (Spinner elegante)
    if (loading) {
        return (
            <div className="flex items-center justify-center px-4 py-2 rounded-full bg-slate-50 border border-slate-100 min-w-[120px]">
                <Loader2 className="w-4 h-4 animate-spin text-slate-400 mr-2" />
                <span className="text-xs font-bold text-slate-400">Cargando...</span>
            </div>
        );
    }

    // 2. Usuario Logueado -> "Ir al Portal"
    if (user) {
        return (
            <Link
                href="/app"
                className={`
                    group relative inline-flex items-center justify-center overflow-hidden rounded-full font-bold transition-all duration-300
                    ${variant === 'hero' 
                        ? 'bg-slate-900 text-white px-8 py-4 text-lg hover:bg-slate-800 shadow-xl shadow-slate-200' 
                        : 'bg-slate-900 text-white px-6 py-2.5 text-sm hover:bg-slate-800 hover:scale-105 shadow-md shadow-slate-200'}
                `}
            >
                <span className="mr-2">Ir al Portal</span>
                <LayoutDashboard className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
        );
    }

    // 3. Usuario NO Logueado -> "Ingresar"
    return (
        <Link
            href="/auth/login"
            className={`
                group relative inline-flex items-center justify-center overflow-hidden rounded-full font-bold transition-all duration-300
                ${variant === 'hero' 
                    ? 'bg-primary-600 text-white px-8 py-4 text-lg hover:bg-primary-700 shadow-xl shadow-primary-200' 
                    : 'bg-primary-600 text-white px-6 py-2.5 text-sm hover:bg-primary-700 hover:scale-105 shadow-md shadow-primary-100'}
            `}
        >
            <span className="mr-2">Ingresar</span>
            <LogIn className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
    );
}