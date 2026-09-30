'use client';

import { useState } from 'react';
import { adminUsers as initialUsers } from '@/lib/mockData';
import { AdminUser } from '@/lib/types';
import { StatusBadge } from '@/components/admin/StatusBadge';

const roleLabels: Record<string, string> = {
  student: 'Estudiante',
  instructor: 'Docente',
  admin: 'Administrador',
};

export default function AdminUsuariosPage() {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const filtered = roleFilter === 'all' ? users : users.filter((u) => u.role === roleFilter);

  const handleToggleStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' }
          : u
      )
    );
    setSelectedUser(null);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Usuarios</h1>
        <p className="text-sm text-on-surface-variant mt-1">Gestiona los usuarios de la plataforma</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {['all', 'student', 'instructor', 'admin'].map((r) => (
          <button
            key={r}
            onClick={() => setRoleFilter(r)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              roleFilter === r
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {r === 'all' ? 'Todos' : roleLabels[r]}
          </button>
        ))}
      </div>

      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
        <div className="hidden sm:grid grid-cols-5 gap-4 px-5 py-3 border-b border-outline-variant/20 text-[11px] font-bold text-outline uppercase tracking-wider">
          <span>Nombre</span>
          <span>Correo</span>
          <span>Rol</span>
          <span>Estado</span>
          <span>Registro</span>
        </div>

        <div className="divide-y divide-outline-variant/10">
          {filtered.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-1 sm:grid-cols-5 gap-2 sm:gap-4 px-5 py-3.5 hover:bg-surface-container-low/50 transition-colors items-center"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary-container">
                    {user.name.charAt(0)}
                  </span>
                </div>
                <span className="text-sm font-medium text-on-surface truncate">{user.name}</span>
              </div>
              <span className="text-sm text-on-surface-variant truncate">{user.email}</span>
              <span className="text-sm text-on-surface-variant">{roleLabels[user.role]}</span>
              <StatusBadge status={user.status} />
              <div className="flex items-center justify-between sm:justify-start gap-2">
                <span className="text-xs text-on-surface-variant">{user.registeredAt}</span>
                <button
                  onClick={() => setSelectedUser(user)}
                  className="text-xs text-primary font-semibold hover:underline cursor-pointer"
                >
                  Ver
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm text-on-surface-variant">No se encontraron usuarios</p>
          </div>
        )}
      </div>

      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-on-surface">Detalle de usuario</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-1 rounded-lg hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px] text-on-surface-variant">close</span>
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-primary-container/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-primary-container">
                    {selectedUser.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-base font-semibold text-on-surface">{selectedUser.name}</p>
                  <p className="text-sm text-on-surface-variant">{selectedUser.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-container-low rounded-lg p-3">
                  <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Rol</p>
                  <p className="text-sm font-medium text-on-surface">{roleLabels[selectedUser.role]}</p>
                </div>
                <div className="bg-surface-container-low rounded-lg p-3">
                  <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Estado</p>
                  <StatusBadge status={selectedUser.status} />
                </div>
                <div className="bg-surface-container-low rounded-lg p-3 col-span-2">
                  <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Registro</p>
                  <p className="text-sm font-medium text-on-surface">{selectedUser.registeredAt}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {selectedUser.role !== 'admin' && (
                <button
                  onClick={() => handleToggleStatus(selectedUser.id)}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedUser.status === 'active'
                      ? 'bg-error-container text-on-error-container hover:bg-error-container/80'
                      : 'bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80'
                  }`}
                >
                  {selectedUser.status === 'active' ? 'Suspender usuario' : 'Reactivar usuario'}
                </button>
              )}
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-surface-container-high text-on-surface hover:bg-surface-container-high/80 transition-colors cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
