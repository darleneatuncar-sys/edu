'use client';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { instructorUser } from '@/lib/mockData';

const instructorNavItems = [
  { href: '/docente', label: 'Inicio', icon: 'home' },
  { href: '/docente/mis-cursos', label: 'Mis cursos', icon: 'school' },
  { href: '/docente/crear-curso', label: 'Crear curso', icon: 'add_circle' },
];

const instructorAccountItems = [
  { href: '/docente/perfil', label: 'Mi perfil', icon: 'person' },
];

export default function DocenteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface">
      <Header homeHref="/docente" user={instructorUser} profileHref="/docente/perfil" />
      <Sidebar
        navSectionLabel="Cursos"
        navItems={instructorNavItems}
        accountSectionLabel="Cuenta"
        accountItems={instructorAccountItems}
      />
      <main className="lg:ml-56 pt-14">
        {children}
      </main>
    </div>
  );
}
