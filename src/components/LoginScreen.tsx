import React, { useState } from 'react';
import { HelpModal } from './HelpModal';
import { ForgotPasswordModal } from './ForgotPasswordModal';
import { RegisterModal } from './RegisterModal';

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
  lang: 'ES' | 'EN';
  onToggleLang: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess, lang, onToggleLang }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Modals
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      let response: Response;
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || '';
        response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      } catch {
        throw new Error('No se pudo conectar con el servidor. Verifica que esté corriendo.');
      }

      let data: any;
      try {
        data = await response.json();
      } catch {
        throw new Error('El servidor devolvió una respuesta inválida.');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Credenciales inválidas');
      }

      // Store token and user
      localStorage.setItem('educore_token', data.token);
      localStorage.setItem('educore_user', JSON.stringify(data.user));

      setIsSuccess(true);
      setTimeout(() => {
        onLoginSuccess(data.user);
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      setIsLoading(false);
    }
  };

  const handleSSOLogin = (provider: 'google') => {
    setIsLoading(true);
    setError('');
    // Simulated Google login - in production this would redirect to OAuth
    setTimeout(() => {
      setIsLoading(false);
      setError('Google OAuth no está configurado aún. Usa email y contraseña.');
    }, 800);
  };

  return (
    <div className="w-full max-w-md mx-auto px-4 py-4 sm:py-6 flex flex-col justify-center min-h-[85vh]">
      {/* Top Navigation & Support Utility */}
      <div className="flex items-center justify-between py-2 w-full mb-2">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-white text-[24px] fill">school</span>
          </div>
          <div className="flex items-baseline">
            <span className="text-xl text-on-surface tracking-tight font-bold">Edu</span>
            <span className="text-xl text-primary-container tracking-tight font-bold">Core</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant text-xs font-semibold shadow-xs active:scale-95 transition-transform hover:bg-surface-container-high cursor-pointer"
            title="Cambiar idioma / Switch language"
          >
            <span className="material-symbols-outlined text-[16px]">language</span>
            <span>{lang}</span>
            <span className="material-symbols-outlined text-[14px]">expand_more</span>
          </button>
          <button
            type="button"
            onClick={() => setIsHelpOpen(true)}
            aria-label="Centro de Ayuda"
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant shadow-xs active:scale-95 transition-transform hover:bg-surface-container-high cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">help_outline</span>
          </button>
        </div>
      </div>

      {/* Welcome Banner */}
      <div className="mt-1 mb-3 p-3 rounded-xl bg-surface-container-low flex items-center gap-3 shadow-xs border border-primary-fixed/40">
        <div className="w-8 h-8 rounded-lg bg-surface-container-highest flex items-center justify-center text-primary shrink-0">
          <span className="material-symbols-outlined text-[18px]">school</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-on-surface font-semibold truncate">
            {lang === 'ES' ? 'Aprende sin límites' : 'Learn without limits'}
          </p>
          <p className="text-[11px] text-on-surface-variant truncate">
            {lang === 'ES' ? 'Plataforma abierta de cursos en línea' : 'Open online course platform'}
          </p>
        </div>
        <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse" title="Online"></span>
      </div>

      {/* Primary Authentication Surface Card */}
      <div className="w-full bg-surface-container-lowest rounded-2xl shadow-md p-4 sm:p-5 flex flex-col border border-[#E2E8F0]">
        {/* Header Section */}
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
            {lang === 'ES' ? 'Bienvenido' : 'Welcome'}
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            {lang === 'ES' ? 'Inicia sesión para continuar aprendiendo' : 'Sign in to continue learning'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-3 p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
            <span className="material-symbols-outlined text-red-500 text-[18px] shrink-0">error</span>
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        {/* Interactive Authentication Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Email Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs text-on-surface font-semibold flex items-center justify-between" htmlFor="email">
              <span>
                {lang === 'ES' ? 'Correo electrónico' : 'Email address'}
              </span>
              <span className="text-[11px] text-outline font-normal">
                {lang === 'ES' ? 'Requerido' : 'Required'}
              </span>
            </label>
            <div className="relative flex items-center rounded-lg bg-surface-container-low border border-[#E2E8F0] focus-within:bg-surface-container-lowest focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="material-symbols-outlined text-outline pl-3 text-[18px] pointer-events-none">mail</span>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={lang === 'ES' ? 'tu@email.com' : 'you@email.com'}
                className="w-full bg-transparent px-2.5 py-2.5 text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none"
              />
            </div>
          </div>

          {/* Password Input with Toggle */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs text-on-surface font-semibold" htmlFor="password">
                {lang === 'ES' ? 'Contraseña' : 'Password'}
              </label>
              <button
                type="button"
                onClick={() => setIsForgotOpen(true)}
                className="text-xs text-primary font-medium hover:underline transition-all cursor-pointer"
              >
                {lang === 'ES' ? '¿Olvidaste tu contraseña?' : 'Forgot password?'}
              </button>
            </div>
            <div className="relative flex items-center rounded-lg bg-surface-container-low border border-[#E2E8F0] focus-within:bg-surface-container-lowest focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <span className="material-symbols-outlined text-outline pl-3 text-[18px] pointer-events-none">lock</span>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-transparent px-2.5 py-2.5 text-xs sm:text-sm text-on-surface placeholder:text-outline focus:outline-none tracking-wider"
              />
              <button
                type="button"
                aria-label="Mostrar u ocultar contraseña"
                onClick={() => setShowPassword(!showPassword)}
                className="pr-3 text-outline hover:text-on-surface focus:outline-none transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Remember device checkbox */}
          <div className="flex items-start gap-2 pt-0.5">
            <label className="relative flex items-center cursor-pointer pt-0.5">
              <input
                id="remember-device"
                type="checkbox"
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-4 h-4 rounded bg-surface-container-highest peer-checked:bg-primary-container flex items-center justify-center transition-colors">
                <span className={`material-symbols-outlined text-white text-[14px] font-bold ${rememberDevice ? 'opacity-100' : 'opacity-0'}`}>
                  check
                </span>
              </div>
            </label>
            <label htmlFor="remember-device" className="text-xs text-on-surface-variant cursor-pointer select-none">
              {lang === 'ES'
                ? 'Recordar esta sesión en este dispositivo personal'
                : 'Remember this session on this personal device'}
            </label>
          </div>

          {/* Main Action CTA */}
          <button
            id="submit-btn"
            type="submit"
            disabled={isLoading}
            className={`w-full mt-1 py-3 px-4 rounded-lg font-semibold text-xs sm:text-sm text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              isSuccess
                ? 'bg-tertiary-container'
                : 'bg-primary-container hover:bg-secondary active:scale-[0.99]'
            }`}
          >
            {isLoading ? (
              <>
                <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                <span>{lang === 'ES' ? 'Validando credenciales...' : 'Authenticating...'}</span>
              </>
            ) : isSuccess ? (
              <>
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                <span>{lang === 'ES' ? 'Autenticado con éxito' : 'Authentication Successful'}</span>
              </>
            ) : (
              <>
                <span>{lang === 'ES' ? 'Iniciar Sesión' : 'Sign In'}</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Register link inside card */}
        <div className="mt-3 text-center">
          <p className="text-xs text-on-surface-variant">
            {lang === 'ES' ? '¿No tienes una cuenta?' : "Don't have an account?"}{' '}
            <button
              type="button"
              onClick={() => setIsRegisterOpen(true)}
              className="text-primary font-semibold hover:underline cursor-pointer"
            >
              {lang === 'ES' ? 'Crear cuenta' : 'Sign up'}
            </button>
          </p>
        </div>

        {/* SSO Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="w-full h-px bg-[#E2E8F0]"></div>
          <span className="absolute bg-surface-container-lowest px-2.5 text-[11px] text-outline font-medium">
            {lang === 'ES' ? 'O continúa con' : 'Or continue with'}
          </span>
        </div>

        {/* SSO Buttons Group */}
        <div className="flex flex-col gap-2">
          {/* Google Login */}
          <button
            type="button"
            onClick={() => handleSSOLogin('google')}
            className="w-full py-2.5 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container border border-[#E2E8F0] text-on-surface text-xs font-semibold shadow-xs transition-all flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-surface-container-lowest flex items-center justify-center shadow-xs">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"></path>
                </svg>
              </div>
              <span className="text-left truncate">Google</span>
            </div>
            <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Course Platform Visual */}
      <div className="mt-3.5 w-full rounded-xl overflow-hidden shadow-sm relative bg-surface-container border border-[#E2E8F0]">
        <div
          className="bg-cover bg-center w-full h-24 sm:h-28 transition-transform duration-500 hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80')`
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/40 to-transparent p-3 flex items-end justify-between">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-bold text-white tracking-tight">
              {lang === 'ES' ? 'Miles de cursos disponibles' : 'Thousands of courses available'}
            </p>
            <p className="text-[11px] text-slate-200 truncate">
              {lang === 'ES' ? 'Aprende con expertos de la industria' : 'Learn from industry experts'}
            </p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-emerald-400 text-slate-900 text-[10px] font-bold shrink-0 shadow-xs">
            {lang === 'ES' ? 'Gratis' : 'Free'}
          </span>
        </div>
      </div>

      {/* Modals */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <ForgotPasswordModal isOpen={isForgotOpen} onClose={() => setIsForgotOpen(false)} />
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccessQuickLogin={(user) => onLoginSuccess(user)}
      />
    </div>
  );
};
