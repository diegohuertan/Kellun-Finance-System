"use client";
import React, { useState, useEffect } from 'react'; // Agregamos useEffect
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
    LayoutDashboard, // Ícono para Resumen
    CreditCard,      // Ícono para Mis Pagos
    UserCircle,      // Ícono para Mi Perfil
    ShieldCheck,     // ✅ ÍCONO NUEVO PARA ADMIN
    Menu,
    X,
    ChevronDown,
    LogOut,
    Key,
} from 'lucide-react';
import { useGlobal } from "@/lib/context/GlobalContext";
import { createSPASassClient } from "@/lib/supabase/client";
import { createBrowserClient } from '@supabase/ssr'; // Necesario para consultar permisos

export default function AppLayout({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [isUserDropdownOpen, setUserDropdownOpen] = useState(false);
    
    // Estado para saber si es admin
    const [isAdmin, setIsAdmin] = useState(false);

    const pathname = usePathname();
    const router = useRouter();
    const { user } = useGlobal();

    // Cliente Supabase para verificar permisos
    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // --- EFECTO PARA VERIFICAR SI ES ADMIN ---
    useEffect(() => {
        const checkAdminStatus = async () => {
            if (!user?.id) return;

            const { data } = await supabase
                .from('perfiles')
                .select('es_admin')
                .eq('id', user.id)
                .single();

            if (data?.es_admin) {
                setIsAdmin(true);
            }
        };

        checkAdminStatus();
    }, [user?.id]); // Se ejecuta cuando carga el usuario

    const handleLogout = async () => {
        try {
            const client = await createSPASassClient();
            await client.logout();
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const handleChangePassword = async () => {
        router.push('/app/user-settings');
    };

    const getInitials = (email: string) => {
        const parts = email.split('@')[0].split(/[._-]/);
        return parts.length > 1
            ? (parts[0][0] + parts[1][0]).toUpperCase()
            : parts[0].slice(0, 2).toUpperCase();
    };

    const productName = "Kellun Finance 🏒";

    // ✅ Navegación Dinámica
    const navigation = [
        { name: 'Resumen', href: '/app/pagos', icon: LayoutDashboard },
        { name: 'Mis Pagos', href: '/app', icon: CreditCard },
        { name: 'Mi Perfil', href: '/app/user-settings', icon: UserCircle },
    ];

    // Si es admin, agregamos el botón extra al principio o final
if (isAdmin) {
        navigation.push({ 
            name: 'Zona Administrador', 
            href: '/app/admin', // <--- AQUÍ ESTABA EL ERROR (Faltaba el /app)
            icon: ShieldCheck 
        });
    }

    const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen bg-slate-50">
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-slate-900 bg-opacity-50 z-20 lg:hidden backdrop-blur-sm"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-200 ease-in-out z-30 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 border-r border-slate-100`}>

                <div className="h-20 flex items-center justify-between px-6 border-b border-slate-50">
                    <span className="text-xl font-black text-primary-600 tracking-tighter italic">
                        {productName}
                    </span>
                    <button onClick={toggleSidebar} className="lg:hidden text-slate-500">
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Navegación Principal */}
                <nav className="mt-6 px-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        // Estilo especial para el botón de Admin
                        const isAdminButton = item.name === 'Admin Zone';
                        
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-4 py-3 text-sm font-bold rounded-xl transition-all ${
                                    isActive
                                        ? 'bg-primary-600 text-white shadow-lg shadow-primary-100'
                                        : isAdminButton 
                                            ? 'text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200' // Estilo distinto para Admin
                                            : 'text-slate-500 hover:bg-slate-50 hover:text-primary-600'
                                }`}
                            >
                                <item.icon
                                    className={`mr-3 h-5 w-5 ${
                                        isActive ? 'text-white' : isAdminButton ? 'text-slate-700' : 'text-slate-400 group-hover:text-primary-500'
                                    }`}
                                />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            <div className="lg:pl-64">
                <header className="sticky top-0 z-10 flex items-center justify-between h-20 bg-white/80 backdrop-blur-md px-8 border-b border-slate-100">
                    <button onClick={toggleSidebar} className="lg:hidden text-slate-500">
                        <Menu className="h-6 w-6"/>
                    </button>

                    <div className="relative ml-auto">
                        <button
                            onClick={() => setUserDropdownOpen(!isUserDropdownOpen)}
                            className="flex items-center space-x-3 group"
                        >
                            <div className="flex flex-col text-right hidden sm:block">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                    {isAdmin ? 'ADMINISTRADOR' : 'SOCIO'}
                                </p>
                                <p className="text-sm font-black text-slate-700 truncate max-w-[150px]">
                                    {user?.email}
                                </p>
                            </div>
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                                isAdmin 
                                ? 'bg-slate-900 border-slate-700 text-white' 
                                : 'bg-primary-50 border-primary-100 text-primary-700 group-hover:bg-primary-100'
                            }`}>
                                <span className="font-black text-xs">
                                    {user ? getInitials(user.email) : '??'}
                                </span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-slate-400"/>
                        </button>

                        {isUserDropdownOpen && (
                            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
                                <div className="p-4 border-b border-slate-50 bg-slate-50/50">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sesión iniciada</p>
                                    <p className="text-sm font-bold text-slate-700 truncate">
                                        {user?.email}
                                    </p>
                                </div>
                                <div className="p-2">
                                    <button
                                        onClick={() => { setUserDropdownOpen(false); handleChangePassword(); }}
                                        className="w-full flex items-center px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                                    >
                                        <Key className="mr-3 h-4 w-4 text-slate-400"/>
                                        Cambiar Contraseña
                                    </button>
                                    <button
                                        onClick={() => { handleLogout(); setUserDropdownOpen(false); }}
                                        className="w-full flex items-center px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <LogOut className="mr-3 h-4 w-4 text-red-400"/>
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </header>

                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}