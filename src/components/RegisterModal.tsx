import React, { useState } from 'react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessQuickLogin: (user: any) => void;
}

export const RegisterModal = ({ isOpen, onClose, onSuccessQuickLogin }: RegisterModalProps) => {
  const [fullName, setFullName] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }

    setPasswordError('');
    setApiError('');
    setIsLoading(true);

    try {
      let response: Response;
      try {
        response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: fullName,
            email: personalEmail,
            password,
          }),
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
        throw new Error(data.error || 'Error al crear la cuenta');
      }

      // Store token
      localStorage.setItem('educore_token', data.token);

      setSubmitted(true);
    } catch (err: any) {
      setApiError(err.message || 'Error al crear la cuenta');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinish = () => {
    setSubmitted(false);
    onClose();
    onSuccessQuickLogin({
      id: '',
      name: fullName,
      email: personalEmail,
      role: 'STUDENT',
      avatarUrl: null,
    });
  };

  const handleGoogleRegister = () => {
    setApiError('Google OAuth no está configurado aún. Usa el formulario de registro.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div
        className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">person_add</span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-base">Crear tu cuenta</h3>
              <p className="text-xs text-on-surface-variant">Únete y comienza a aprender a tu ritmo.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container-highest text-on-surface-variant flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-5 max-h-[80vh] overflow-y-auto">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* API Error */}
              {apiError && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                  <span className="material-symbols-outlined text-red-500 text-[18px] shrink-0">error</span>
                  <p className="text-xs text-red-700">{apiError}</p>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Tu nombre completo"
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    required
                    value={personalEmail}
                    onChange={(e) => setPersonalEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-3 py-2 pr-10 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {showPassword ? 'visibility_off' : 'visibility'}
                      </span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Confirmar contraseña
                  </label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setPasswordError(''); }}
                    placeholder="••••••••"
                    className={`w-full bg-surface-container-low border rounded-lg px-3 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary ${
                      passwordError ? 'border-red-400' : 'border-[#E2E8F0]'
                    }`}
                  />
                  {passwordError && (
                    <p className="text-[11px] text-red-500 mt-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">error</span>
                      {passwordError}
                    </p>
                  )}
                </div>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl text-[11px] text-on-surface-variant flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">info</span>
                <span>
                  Al registrarte, aceptas nuestros términos de servicio y política de privacidad. Tu cuenta será activada inmediatamente.
                </span>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-lg border border-[#E2E8F0] text-on-surface font-semibold text-xs hover:bg-surface-container-low transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-2.5 rounded-lg bg-primary-container hover:bg-secondary text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                      <span>Creando...</span>
                    </>
                  ) : (
                    <>
                      <span>Crear cuenta</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-center py-3">
              <div className="w-14 h-14 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mx-auto shadow-sm">
                <span className="material-symbols-outlined text-[28px]">check_circle</span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-base">¡Cuenta creada!</h4>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Tu cuenta ha sido creada exitosamente. Ya puedes empezar a aprender.
                </p>
              </div>
              <div className="p-3.5 bg-surface-container-low rounded-xl border border-[#E2E8F0] text-left text-xs space-y-1">
                <p><span className="text-on-surface-variant">Nombre:</span> <span className="font-semibold text-on-surface">{fullName}</span></p>
                <p><span className="text-on-surface-variant">Email:</span> <span className="font-semibold text-on-surface">{personalEmail}</span></p>
              </div>
              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3 rounded-lg bg-primary-container text-white font-semibold text-xs hover:bg-secondary transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Empezar ahora</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </div>
          )}

          {/* Divider before Google */}
          {!submitted && (
            <>
              <div className="relative my-4 flex items-center justify-center">
                <div className="w-full h-px bg-[#E2E8F0]"></div>
                <span className="absolute bg-surface-container-lowest px-2.5 text-[11px] text-outline font-medium">
                  O continúa con
                </span>
              </div>

              {/* Google Register */}
              <button
                type="button"
                onClick={handleGoogleRegister}
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
                  <span className="text-left truncate">Continuar con Google</span>
                </div>
                <span className="material-symbols-outlined text-outline text-[18px]">chevron_right</span>
              </button>

              {/* Login link */}
              <div className="mt-4 text-center">
                <p className="text-xs text-on-surface-variant">
                  ¿Ya tienes una cuenta?{' '}
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-primary font-semibold hover:underline cursor-pointer"
                  >
                    Iniciar sesión
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
