import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4 md:p-10">
      <div className="w-full max-w-[450px]">
        {children}
      </div>
    </div>
  );
}