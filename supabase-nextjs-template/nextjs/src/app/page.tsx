import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import AuthAwareButtons from '@/components/AuthAwareButtons';

export default function Home() {
  const productName = "Kellun Finance 🏒";

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Simple */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <span className="text-2xl font-black text-primary-600 tracking-tighter">
              {productName}
            </span>
            <AuthAwareButtons variant="nav" />
          </div>
        </div>
      </nav>

      {/* Hero Sección */}
      <section className="relative pt-48 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6">
            Gestiona tus cuotas <br />
            <span className="text-primary-600">sin complicaciones.</span>
          </h1>
          <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto mb-10">
            Bienvenido al portal oficial de socios. Paga tus cuotas mensuales de forma rápida y segura desde cualquier dispositivo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/auth/login"
              className="px-8 py-4 bg-primary-600 text-white rounded-full font-bold text-lg hover:bg-primary-700 transition-all flex items-center shadow-lg shadow-primary-200"
            >
              Ingresar al Portal
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-slate-100">
        <div className="text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} Kellun Finance. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
}