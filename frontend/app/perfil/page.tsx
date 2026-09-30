'use client';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Avatar } from '@/components/ui/Avatar';
import { currentUser } from '@/lib/mockData';

const studentNavItems = [
  { href: '/mis-cursos', label: 'Mis cursos', icon: 'school' },
  { href: '/explorar', label: 'Explorar cursos', icon: 'explore' },
];

const studentAccountItems = [
  { href: '/perfil', label: 'Mi perfil', icon: 'person' },
];

export default function PerfilPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Header homeHref="/mis-cursos" user={currentUser} />
      <Sidebar navItems={studentNavItems} accountItems={studentAccountItems} />
      <main className="lg:ml-56 pt-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-on-surface mb-6">Mi perfil</h1>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-6">
            <div className="flex items-center gap-4 mb-6">
              <Avatar name={currentUser.name} src={currentUser.avatarUrl} size="lg" />
              <div>
                <h2 className="text-lg font-bold text-on-surface">{currentUser.name}</h2>
                <p className="text-sm text-on-surface-variant">{currentUser.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-outline-variant/20">
                <span className="text-sm text-on-surface-variant">Nombre</span>
                <span className="text-sm font-medium text-on-surface">{currentUser.name}</span>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-outline-variant/20">
                <span className="text-sm text-on-surface-variant">Correo electrónico</span>
                <span className="text-sm font-medium text-on-surface">{currentUser.email}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-on-surface-variant">Rol</span>
                <span className="text-sm font-medium text-on-surface">Estudiante</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
