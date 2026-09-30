'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

interface NavItem {
  href: string;
  label: string;
  icon: string;
}

interface SidebarProps {
  navSectionLabel?: string;
  navItems: NavItem[];
  accountSectionLabel?: string;
  accountItems: NavItem[];
}

export function Sidebar({
  navSectionLabel = 'Cursos',
  navItems,
  accountSectionLabel = 'Cuenta',
  accountItems,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-2.5 left-3.5 z-50 lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container-lowest border border-outline-variant/20 shadow-sm hover:bg-surface-container-low transition-colors"
        aria-label="Abrir menú"
      >
        <span className="material-symbols-outlined text-[20px]">menu</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-56 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <nav className="flex-1 p-3 space-y-1">
          <p className="text-[10px] font-semibold text-outline uppercase tracking-wider px-3 mb-2">
            {navSectionLabel}
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-container/10 text-primary-container'
                    : 'text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                <span className={`material-symbols-outlined text-[20px] ${isActive ? 'fill' : ''}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4">
            <p className="text-[10px] font-semibold text-outline uppercase tracking-wider px-3 mb-2">
              {accountSectionLabel}
            </p>
            {accountItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-container/10 text-primary-container'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${isActive ? 'fill' : ''}`}>
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
}
