import React, { useState } from 'react';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ForgotPasswordModal = ({ isOpen, onClose }: ForgotPasswordModalProps) => {
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsSent(true);
  };

  const resetAndClose = () => {
    setIsSent(false);
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">lock_reset</span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-base">Restablecer Contraseña</h3>
              <p className="text-xs text-on-surface-variant">Protocolo de Recuperación Institucional</p>
            </div>
          </div>
          <button 
            onClick={resetAndClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container-highest text-on-surface-variant flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-5">
          {!isSent ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Ingresa tu correo institucional registrado o ID universitario. Te enviaremos un enlace seguro con vigencia de 15 minutos para restablecer tu clave.
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-on-surface" htmlFor="recover-email">
                  Correo institucional o ID universitario
                </label>
                <div className="relative flex items-center rounded-lg bg-surface-container-low border border-[#E2E8F0] focus-within:border-primary focus-within:bg-surface-container-lowest">
                  <span className="material-symbols-outlined text-outline pl-3 text-[18px]">mail</span>
                  <input
                    id="recover-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@universidad.edu"
                    className="w-full bg-transparent px-3 py-2.5 text-xs text-on-surface placeholder:text-outline focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={resetAndClose}
                  className="flex-1 py-2.5 rounded-lg border border-[#E2E8F0] text-on-surface font-semibold text-xs hover:bg-surface-container-low transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-lg bg-primary-container hover:bg-secondary text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Enviar Enlace</span>
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mx-auto">
                <span className="material-symbols-outlined text-[24px]">mark_email_read</span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-sm">Enlace de verificación enviado</h4>
                <p className="text-xs text-on-surface-variant mt-1">
                  Hemos enviado las instrucciones a <span className="font-semibold text-primary">{email}</span>. Revisa tu bandeja de entrada o carpeta de spam institucional.
                </p>
              </div>
              <button
                type="button"
                onClick={resetAndClose}
                className="w-full py-2.5 rounded-lg bg-primary-container text-white font-semibold text-xs hover:bg-secondary transition-colors"
              >
                Volver al inicio de sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
