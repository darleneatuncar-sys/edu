'use client';

import { useState } from 'react';
import { adminUser } from '@/lib/mockData';

export default function AdminPerfilPage() {
  const [name, setName] = useState(adminUser.name);
  const [email, setEmail] = useState(adminUser.email);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Mi perfil</h1>
        <p className="text-sm text-on-surface-variant mt-1">Gestiona tu información personal</p>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 sm:p-8">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-outline-variant/20">
          <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center">
            <span className="text-xl font-bold text-primary-container">
              {adminUser.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-lg font-semibold text-on-surface">{adminUser.name}</p>
            <p className="text-sm text-on-surface-variant">{adminUser.email}</p>
            <span className="mt-1 inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold bg-primary-container text-white">
              Administrador
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1.5">Nombre</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-on-surface block mb-1.5">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2.5 text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-primary text-white hover:bg-primary/90 transition-colors cursor-pointer"
          >
            Guardar cambios
          </button>
          {saved && (
            <span className="text-xs text-secondary font-medium flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Guardado
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
