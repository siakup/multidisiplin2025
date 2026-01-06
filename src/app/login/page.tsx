'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { api } from '@/lib/common/utils/api';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (!role || !password) {
        throw new Error('Harap isi role dan password');
      }

      // Login dengan role dan password
      const response = await api.post<{ accessToken: string; refreshToken: string; user: any }>(
        '/auth/login',
        { role, password }
      );

      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        localStorage.setItem('refreshToken', response.refreshToken);
        // Simpan user info untuk menentukan navbar
        if (response.user) {
          localStorage.setItem('userRole', response.user.role || '');
          localStorage.setItem('userUsername', response.user.username || '');
        }
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Role atau password salah');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white w-full overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
        <section className="flex flex-col justify-center items-center h-full px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 bg-white py-10 sm:py-16">
          <div className="w-full max-w-md mx-auto">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-semibold mb-2 text-left" style={{ color: 'var(--color-12250f)' }}>Selamat Datang!</h1>
              <p className="text-gray-600 text-left text-sm sm:text-base">Silahkan masukkan role dan password anda.</p>
            </div>
            <form onSubmit={onSubmit} className="space-y-5 w-full">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Masukkan role"
                  className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:border-transparent transition-all focus-ring-colorblind"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:border-transparent appearance-none transition-all focus-ring-colorblind"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    aria-label="toggle password"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4-10-7 0-1.12.438-2.286 1.227-3.39m3.112-2.84C7.869 5.27 9.87 5 12 5c5.523 0 10 4 10 7 0 1.167-.46 2.365-1.292 3.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-.88M10.73 5.08A9.99 9.99 0 0112 5c5.523 0 10 4 10 7 0 1.167-.46 2.365-1.292 3.5m-2.617 2.216A9.958 9.958 0 0112 19c-5.523 0-10-4-10-7 0-1.12.438-2.286 1.227-3.39"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg py-2.5 text-white disabled:opacity-60 disabled:cursor-not-allowed transition-colors font-medium text-sm sm:text-base"
                style={{ backgroundColor: 'var(--color-12250f)' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-1a2f15)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-12250f)'}
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>
          </div>
        </section>

        <section 
          className="hidden lg:block relative h-full w-full overflow-hidden bg-white p-0 border-l border-gray-200"
          style={{
            borderTopLeftRadius: '45px',
            borderBottomLeftRadius: '45px'
          }}
        >
          <div className="relative w-full h-full" style={{
            borderTopLeftRadius: '45px',
            borderBottomLeftRadius: '45px',
            overflow: 'hidden'
          }}>
            <Image
              src="/foto-login.png"
              alt="Login Illustration"
              fill
              priority
              className="object-cover object-center"
              sizes="(max-width: 1024px) 0vw, 50vw"
              style={{
                borderTopLeftRadius: '45px',
                borderBottomLeftRadius: '45px'
              }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}


