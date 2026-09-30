'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const navItems = [
  { label: 'Inicio', href: '/admin', icon: 'home' },
  { label: 'Usuarios', href: '/admin/usuarios', icon: 'group' },
  { label: 'Solicitudes docentes', href: '/admin/solicitudes-docente', icon: 'assignment' },
  { label: 'Cursos', href: '/admin/cursos', icon: 'menu_book' },
];

const accountItems = [
  { label: 'Mi perfil', href: '/admin/perfil', icon: 'person' },
  { label: 'Cerrar sesión', href: '/login', icon: 'logout' },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const labelsHidden = !hovered;

  const setExpanded = (value: boolean) => {
    setHovered(value);
    document.documentElement.dataset.sidebarExpanded = String(value);
  };

  useEffect(() => {
    return () => {
      delete document.documentElement.dataset.sidebarExpanded;
    };
  }, []);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  const renderItem = (item: { label: string; href: string; icon: string }) => (
    <Link
      key={item.href}
      href={item.href}
      onClick={() => setMobileOpen(false)}
      aria-label={item.label}
      title={labelsHidden ? item.label : undefined}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        labelsHidden ? 'lg:px-0 lg:justify-center' : ''
      } ${
        isActive(item.href)
          ? 'bg-primary-container text-on-primary-container'
          : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
      }`}
    >
      <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
      <span className={`whitespace-nowrap ${labelsHidden ? 'lg:hidden' : ''}`}>{item.label}</span>
    </Link>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-3.5 left-4 z-50 p-2 rounded-lg hover:bg-surface-container-high transition-colors"
        aria-label="Menú"
      >
        <span className="material-symbols-outlined text-[22px] text-on-surface">
          {mobileOpen ? 'close' : 'menu'}
        </span>
      </button>

      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={`fixed top-14 left-0 bottom-0 w-56 bg-surface-container-lowest border-r border-outline-variant/20 z-40 flex flex-col overflow-hidden transition-[width,transform,box-shadow] duration-200 ease-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${hovered ? 'lg:w-56 shadow-xl lg:shadow-2xl lg:z-50' : 'lg:w-[72px]'}`}
      >
        <div
          className={`flex-1 flex flex-col py-3 px-2 overflow-y-auto ${labelsHidden ? 'lg:px-0' : ''}`}
        >
          <div className="space-y-0.5">
            <p
              className={`px-3 pt-2 pb-2 text-[10px] font-bold text-outline uppercase tracking-wider whitespace-nowrap ${
                labelsHidden ? 'lg:hidden' : ''
              }`}
            >
              Admin
            </p>
            {navItems.map(renderItem)}
          </div>

          <div className="mt-auto space-y-0.5 pt-4 border-t border-outline-variant/20">
            <p
              className={`px-3 pb-2 pt-3 text-[10px] font-bold text-outline uppercase tracking-wider whitespace-nowrap ${
                labelsHidden ? 'lg:hidden' : ''
              }`}
            >
              Cuenta
            </p>
            {accountItems.map(renderItem)}
          </div>
        </div>
      </aside>
    </>
  );
}
