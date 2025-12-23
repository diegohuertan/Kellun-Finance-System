import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Zap, History, Globe, HelpCircle } from 'lucide-react';
import AuthAwareButtons from '@/components/AuthAwareButtons';

export default function Home() {
  const productName = "Kellun Finance";

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-primary-100 selection:text-primary-900">
      
      {/* --- NAVBAR PREMIUM --- */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl z-50 border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            
            {/* Logo Interactivo */}
            <Link href="/" className="flex items-center gap-2 group">
                <div className="bg-slate-900 text-white p-2 rounded-xl group-hover:scale-105 transition-transform duration-200 shadow-lg shadow-slate-200">
                    <Globe className="w-5 h-5" />
                </div>
                <span className="text-xl font-black text-slate-900 tracking-tight italic group-hover:opacity-80 transition-opacity">
                {productName}
                </span>
            </Link>

            {/* Zona Derecha: Ayuda + Botón de Acción */}
            <div className="flex items-center gap-6">
                 {/* Link discreto de Ayuda (visible en escritorio) */}
                 <a href="mailto:contacto@kellun.cl" className="hidden md:flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-wider">
                    <HelpCircle className="w-4 h-4" />
                    Ayuda
                 </a>

                 {/* Separador Vertical */}
                 <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

                 {/* El Botón Dinámico (Go to Dashboard / Login) */}
                 <div className="transform hover:scale-105 transition-transform duration-200">
                    <AuthAwareButtons variant="nav" />
                 </div>
            </div>

          </div>
        </div>
      </nav>

      {/* Hero Section con Gradiente */}
      <section className="relative pt-44 pb-20 lg:pt-56 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 text-slate-600 text-sm font-bold mb-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Sistema Oficial de Pagos
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-tight">
            Apoya a tu club <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-500">
              sin complicaciones.
            </span>
          </h1>
          
          <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed">
            La forma más segura y rápida de mantener tus cuotas al día. 
            Olvídate del efectivo y las transferencias manuales.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/login"
              className="group px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg hover:bg-slate-800 transition-all flex items-center shadow-xl shadow-slate-200 hover:-translate-y-1"
            >
              Ingresar al Portal
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
                href="/legal/terms"
                className="px-8 py-4 bg-white text-slate-600 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all"
            >
                Ver Términos
            </Link>
          </div>
        </div>
      </section>

      {/* Grid de Características */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl font-black text-slate-900 mb-4">Todo lo que necesitas</h2>
                <p className="text-slate-500">Diseñado para simplificar la vida del socio y del club.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Card 1 */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group">
                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                        <Zap className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Pagos Instantáneos</h3>
                    <p className="text-slate-500 leading-relaxed">
                        Paga tu mensualidad en segundos usando Webpay. Tus pagos se reflejan automáticamente en el sistema.
                    </p>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group">
                    <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:scale-110 transition-transform">
                        <ShieldCheck className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Seguridad Total</h3>
                    <p className="text-slate-500 leading-relaxed">
                        Procesamos los pagos a través de Flow, cumpliendo con los más altos estándares de seguridad bancaria.
                    </p>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-shadow group">
                    <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:scale-110 transition-transform">
                        <History className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">Historial Transparente</h3>
                    <p className="text-slate-500 leading-relaxed">
                        Accede a tu perfil para ver todas tus cuotas pasadas, descargar comprobantes y revisar tu estado.
                    </p>
                </div>
            </div>
        </div>
      </section>

      {/* Footer Legal */}
      <footer className="py-12 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div className="col-span-1 md:col-span-2">
                    <span className="text-xl font-black text-slate-900 tracking-tight italic mb-4 block">
                        {productName}
                    </span>
                    <p className="text-slate-500 text-sm max-w-xs leading-relaxed">
                        Plataforma de gestión financiera deportiva. Simplificamos la administración para que tú solo te preocupes de jugar.
                    </p>
                </div>
                
                <div>
                    <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
                    <ul className="space-y-3 text-sm text-slate-500">
                        <li><Link href="/legal/terms" className="hover:text-primary-600 hover:underline">Términos y Condiciones</Link></li>
                        <li><Link href="/legal/privacy" className="hover:text-primary-600 hover:underline">Política de Privacidad</Link></li>
                        <li><Link href="/legal/refund" className="hover:text-primary-600 hover:underline">Política de Devoluciones</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold text-slate-900 mb-4">Soporte</h4>
                    <ul className="space-y-3 text-sm text-slate-500">
                        <li><a href="mailto:contacto@kellun.cl" className="hover:text-primary-600 hover:underline">Contacto</a></li>
                        <li><Link href="/auth/login" className="hover:text-primary-600 hover:underline">Portal de Socios</Link></li>
                    </ul>
                </div>
            </div>
            
            <div className="pt-8 border-t border-slate-100 text-center text-slate-400 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <p>© {new Date().getFullYear()} Kellun Finance. Todos los derechos reservados.</p>
                <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="font-medium text-slate-600">Sistemas Operativos</span>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}