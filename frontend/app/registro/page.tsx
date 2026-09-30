import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-[22px]">school</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-on-surface tracking-tight">Edu</span>
            <span className="text-2xl font-bold text-primary-container tracking-tight">Core</span>
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-6">
          <RegisterForm />
        </div>

        <div className="mt-6 text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline-variant/30" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-surface px-3 text-[11px] text-outline">
                Plataforma abierta de cursos en línea
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
