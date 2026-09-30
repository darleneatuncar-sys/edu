'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
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
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();

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

  const renderItem = (item: NavItem) => {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => setMobileOpen(false)}
        aria-label={item.label}
        title={labelsHidden ? item.label : undefined}
        className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          labelsHidden ? 'lg:px-0 lg:justify-center' : ''
        } ${
          isActive
            ? 'bg-primary-container/10 text-primary-container'
            : 'text-on-surface-variant hover:bg-surface-container-low'
        }`}
      >
        {isActive && (
          <span
            className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[3px] rounded-r-full bg-primary-container"
            aria-hidden="true"
          />
        )}
        <span
          className={`material-symbols-outlined text-[20px] shrink-0 ${isActive ? 'fill' : ''}`}
        >
          {item.icon}
        </span>
        <span className={`whitespace-nowrap ${labelsHidden ? 'lg:hidden' : ''}`}>{item.label}</span>
      </Link>
    );
  };

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed top-2.5 left-3.5 z-50 lg:hidden w-9 h-9 flex items-center justify-center rounded-lg bg-surface-container-lowest border border-outline-variant/20 shadow-sm hover:bg-surface-container-low transition-colors"
        aria-label="Abrir menú"
      >
        <span className="material-symbols-outlined text-[20px]">menu</span>
      </button>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        className={`fixed top-14 left-0 z-40 h-[calc(100vh-3.5rem)] w-56 bg-surface-container-lowest border-r border-outline-variant/20 flex flex-col overflow-hidden transition-[width,transform,box-shadow] duration-200 ease-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${hovered ? 'lg:w-56 shadow-xl lg:shadow-2xl lg:z-50' : 'lg:w-[72px]'}`}
      >
        <div
          className={`flex-1 flex flex-col p-3 overflow-y-auto ${labelsHidden ? 'lg:px-0' : ''}`}
        >
          <div className="space-y-1">
            <p
              className={`text-[10px] font-semibold text-outline uppercase tracking-wider px-3 mb-2 whitespace-nowrap ${
                labelsHidden ? 'lg:hidden' : ''
              }`}
            >
              {navSectionLabel}
            </p>
            {navItems.map(renderItem)}
          </div>

          <div className="mt-auto space-y-1 pt-4 border-t border-outline-variant/20">
            <p
              className={`text-[10px] font-semibold text-outline uppercase tracking-wider px-3 mb-2 whitespace-nowrap ${
                labelsHidden ? 'lg:hidden' : ''
              }`}
            >
              {accountSectionLabel}
            </p>
            {accountItems.map(renderItem)}
          </div>
        </div>
      </aside>
    </>
  );
}
