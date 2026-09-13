import React, { useState } from 'react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessQuickLogin: (role: 'student' | 'faculty') => void;
}

export const RegisterModal = ({ isOpen, onClose, onSuccessQuickLogin }: RegisterModalProps) => {
  const [role, setRole] = useState<'student' | 'faculty'>('student');
  const [fullName, setFullName] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [program, setProgram] = useState('Ingeniería de Software y Sistemas');
  const [personalEmail, setPersonalEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleFinish = () => {
    setSubmitted(false);
    onClose();
    onSuccessQuickLogin(role);
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
              <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-base">Solicitud de Acceso Institucional</h3>
              <p className="text-xs text-on-surface-variant">Admisión y Credenciales Campus Virtual</p>
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
              <div className="p-1 bg-surface-container-low rounded-lg flex items-center border border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
                    role === 'student'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">school</span>
                  Nuevo Estudiante
                </button>
                <button
                  type="button"
                  onClick={() => setRole('faculty')}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
                    role === 'faculty'
                      ? 'bg-surface-container-lowest text-primary shadow-xs'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">badge</span>
                  Docente / Investigador
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Nombres y Apellidos Completos
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Valeria Sofía Mendoza Arriaga"
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-on-surface block mb-1">
                      Documento de Identidad (DNI / Pasaporte)
                    </label>
                    <input
                      type="text"
                      required
                      value={documentId}
                      onChange={(e) => setDocumentId(e.target.value)}
                      placeholder="74819203"
                      className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-on-surface block mb-1">
                      Correo Electrónico Personal
                    </label>
                    <input
                      type="email"
                      required
                      value={personalEmail}
                      onChange={(e) => setPersonalEmail(e.target.value)}
                      placeholder="valeria@gmail.com"
                      className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-on-surface block mb-1">
                    Facultad / Programa Académico
                  </label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full bg-surface-container-low border border-[#E2E8F0] rounded-lg px-3 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  >
                    <option value="Ingeniería de Software y Sistemas">Ingeniería de Software y Sistemas</option>
                    <option value="Ciencia de la Computación">Ciencia de la Computación</option>
                    <option value="Ingeniería Industrial">Ingeniería Industrial</option>
                    <option value="Medicina Humana">Medicina Humana</option>
                    <option value="Derecho y Ciencias Políticas">Derecho y Ciencias Políticas</option>
                    <option value="Administración y Negocios Internacionales">Administración y Negocios Internacionales</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-surface-container-low rounded-xl text-[11px] text-on-surface-variant flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                <span>
                  Al solicitar el acceso, la Dirección de Registro Académico validará tu condición de matrícula con la base de datos universitaria institucional.
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
                  className="flex-1 py-2.5 rounded-lg bg-primary-container hover:bg-secondary text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Registrar Solicitud</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-center py-3">
              <div className="w-14 h-14 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center mx-auto shadow-sm">
                <span className="material-symbols-outlined text-[28px]">verified_user</span>
              </div>
              <div>
                <h4 className="font-bold text-on-surface text-base">¡Registro Académico Habilitado!</h4>
                <p className="text-xs text-on-surface-variant mt-1.5 leading-relaxed">
                  Se ha generado tu cuenta institucional con el usuario provisional <span className="font-bold text-primary">{documentId || 'estudiante'}@universidad.edu</span> para el <span className="font-semibold text-on-surface">Período Académico 2025-I</span>.
                </p>
              </div>
              <div className="p-3.5 bg-surface-container-low rounded-xl border border-[#E2E8F0] text-left text-xs space-y-1">
                <p><span className="text-on-surface-variant">Rol activado:</span> <span className="font-semibold text-on-surface capitalize">{role === 'student' ? 'Estudiante Regular' : 'Cátedra Docente'}</span></p>
                <p><span className="text-on-surface-variant">Programa:</span> <span className="font-semibold text-on-surface">{program}</span></p>
                <p><span className="text-on-surface-variant">Protocolo:</span> <span className="font-semibold text-tertiary">Activo e integrado a Eduroam</span></p>
              </div>
              <button
                type="button"
                onClick={handleFinish}
                className="w-full py-3 rounded-lg bg-primary-container text-white font-semibold text-xs hover:bg-secondary transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <span>Acceder Directamente al Campus Virtual</span>
                <span className="material-symbols-outlined text-[18px]">login</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
