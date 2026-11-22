'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const entrar = () => {
    if (pass === 'retailos') {
      localStorage.setItem('retailos_auth', '1');
      router.push('/');
    } else {
      setError('Contraseña incorrecta');
    }
  };

  return (
    <div className="min-h-screen bg-[#070708] flex items-center justify-center text-white">
      <div className="bg-[#0f0f12] border border-neutral-800 rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1">RETAIL OS</h1>
        <p className="text-sm text-neutral-400 mb-6">Centro de Control</p>
        <input
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && entrar()}
          placeholder="Contraseña"
          autoFocus
          className="w-full bg-neutral-900 border border-neutral-700 rounded-xl px-4 py-3 text-sm mb-3 outline-none focus:border-blue-500"
        />
        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
        <button
          onClick={entrar}
          className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-sm font-medium transition-colors"
        >
          Entrar
        </button>
      </div>
    </div>
  );
}