'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const router = useRouter();
  const [area, setArea] = useState<'student' | 'instructor'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data: any;
      try {
        data = await response.json();
      } catch {
        throw new Error('El servidor devolvió una respuesta inválida.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Credenciales inválidas');
      }

      localStorage.setItem('educore_token', data.token);
      localStorage.setItem('educore_user', JSON.stringify(data.user));

      const role = data.user?.role;
      if (role === 'ADMIN') {
        router.push('/admin');
      } else if (role === 'INSTRUCTOR') {
        router.push('/docente');
      } else {
        router.push('/mis-cursos');
      }
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-on-surface">Bienvenido</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          {area === 'student'
            ? 'Inicia sesión para continuar aprendiendo'
            : 'Ingresa para gestionar tus cursos'}
        </p>
      </div>

      <div className="flex bg-surface-container-low rounded-lg p-1 mb-5">
        <button
          type="button"
          onClick={() => setArea('student')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            area === 'student'
              ? 'bg-primary-container text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">school</span>
          Estudiante
        </button>
        <button
          type="button"
          onClick={() => setArea('instructor')}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
            area === 'instructor'
              ? 'bg-primary-container text-white shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">co_present</span>
          Docente
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-error-container/30 border border-error/20 flex items-start gap-2">
          <span className="material-symbols-outlined text-error text-[18px] shrink-0">error</span>
          <p className="text-xs text-error">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-on-surface block mb-1.5" htmlFor="email">
            Correo electrónico
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              mail
            </span>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full pl-10 pr-3 py-2.5 text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-outline"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-on-surface" htmlFor="password">
              Contraseña
            </label>
            <button
              type="button"
              className="text-xs text-primary font-medium hover:underline"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              lock
            </span>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-outline tracking-wider"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              <span className="material-symbols-outlined text-[18px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
        </div>

        <Button type="submit" loading={isLoading} className="w-full">
          Iniciar Sesión
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-xs text-on-surface-variant">
          ¿No tienes una cuenta?{' '}
          <button className="text-primary font-semibold hover:underline">
            Crear cuenta
          </button>
        </p>
      </div>
    </div>
  );
}
