'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';  // HARUS dari next/navigation

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Contoh request ke API login
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, password }),
    });

    if (res.ok) {
      router.push('/admin');  // redirect ke admin kalau login sukses
    } else {
      alert('Kode atau password salah');
    }
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg p-8 w-full max-w-sm"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Admin Login</h2>
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Kode Admin"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
            >
              {showPassword ? (
                <h1 className="text-blue-500 font-semibold">Hide</h1>
              ) : (
                <h1 className="text-blue-500 font-semibold">Show</h1>
              )}
            </button>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
