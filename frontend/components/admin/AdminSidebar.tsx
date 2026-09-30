'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

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

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

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
        className={`fixed top-14 left-0 bottom-0 w-56 bg-surface-container-lowest border-r border-outline-variant/20 z-40 flex flex-col transition-transform duration-200 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex-1 py-3 px-2 overflow-y-auto">
          <p className="px-3 pt-2 pb-2 text-[10px] font-bold text-outline uppercase tracking-wider">
            Admin
          </p>
          <nav className="space-y-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-container text-on-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-6 pt-4 border-t border-outline-variant/20">
            <p className="px-3 pb-2 text-[10px] font-bold text-outline uppercase tracking-wider">
              Cuenta
            </p>
            <nav className="space-y-0.5">
              {accountItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary-container text-on-primary-container'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
