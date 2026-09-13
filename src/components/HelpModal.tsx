interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal = ({ isOpen, onClose }: HelpModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-container text-white flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">help_outline</span>
            </div>
            <div>
              <h3 className="font-bold text-on-surface text-base">Centro de Ayuda y Soporte</h3>
              <p className="text-xs text-on-surface-variant">Dirección de Tecnologías de Información (DTI)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container-highest text-on-surface-variant flex items-center justify-center transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-primary-fixed flex items-start gap-3">
            <span className="material-symbols-outlined text-primary-container text-[22px] mt-0.5">info</span>
            <div className="text-xs text-on-surface">
              <p className="font-semibold text-primary">Credenciales de Acceso Unificado</p>
              <p className="mt-0.5 text-on-surface-variant leading-relaxed">
                Su usuario corresponde al código de alumno o docente seguido de @universidad.edu. El acceso SSO sincroniza automáticamente con el correo institucional y Eduroam.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Canales Directos</h4>
            
            <a 
              href="mailto:soporte.campus@universidad.edu"
              className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] hover:bg-surface-container-low transition-colors text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-[20px]">mail</span>
                <div>
                  <p className="font-semibold text-on-surface">Mesa de Ayuda DTI</p>
                  <p className="text-on-surface-variant">soporte.campus@universidad.edu</p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline text-[16px]">chevron_right</span>
            </a>

            <div className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] bg-surface-container-lowest text-xs">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-[20px]">call</span>
                <div>
                  <p className="font-semibold text-on-surface">Central Telefónica Campus</p>
                  <p className="text-on-surface-variant">+51 (1) 619-7000 Anexo 4410</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-tertiary-fixed text-on-tertiary-fixed">
                Lun-Sáb 08:00-20:00
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl border border-[#E2E8F0] bg-surface-container-lowest text-xs">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-primary text-[20px]">wifi_protected_setup</span>
                <div>
                  <p className="font-semibold text-on-surface">Red Eduroam Mundial</p>
                  <p className="text-on-surface-variant">Conéctate en más de 10,000 universidades con tu cuenta</p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-lg bg-primary-container hover:bg-secondary text-white font-semibold text-xs shadow-xs transition-colors"
            >
              Entendido, volver al portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
