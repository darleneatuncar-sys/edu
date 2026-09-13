import React from 'react';
import { ActiveScreen, UserRole } from '../types';

interface SidebarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  role: UserRole;
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  onNavigate,
  role,
  isMobileMenuOpen,
  onCloseMobileMenu,
  onLogout
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveScreen,
      label: 'Campus Virtual',
      sublabel: 'Panel Principal',
      icon: 'dashboard'
    },
    {
      id: 'course-detail' as ActiveScreen,
      label: role === 'student' ? 'Mis Asignaturas' : 'Cursos a Cargo',
      sublabel: 'Aulas & Sílabos',
      icon: 'menu_book'
    },
    {
      id: 'grades' as ActiveScreen,
      label: 'Calificaciones & Rúbricas',
      sublabel: 'Evaluación y Registro',
      icon: 'grade'
    },
    {
      id: 'services' as ActiveScreen,
      label: 'Trámites & Servicios',
      sublabel: 'Constancias y Reservas',
      icon: 'assignment_turned_in'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobileMenu}
        />
      )}

      {/* 260px Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 z-40 h-[100dvh] lg:h-[calc(100vh-4rem)] w-[260px] bg-white border-r border-[#E2E8F0] flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Mobile Header Inside Drawer */}
          <div className="flex items-center justify-between lg:hidden pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px] fill">school</span>
              </div>
              <span className="font-bold text-on-surface">EduCore Campus</span>
            </div>
            <button
              onClick={onCloseMobileMenu}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* Academic Profile Brief */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-[#E2E8F0] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-surface-container-highest text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">
                {role === 'student' ? 'school' : 'psychology'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-on-surface truncate">
                {role === 'student' ? 'Matrícula Pregrado' : 'Cátedra Universitaria'}
              </p>
              <p className="text-[11px] text-tertiary font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-ping"></span>
                Semestre 2025-I Regular
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <p className="text-[11px] font-bold text-outline uppercase tracking-wider px-2 mb-2">
              Módulos Principales
            </p>
            {navItems.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onCloseMobileMenu();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary-container text-white shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[20px] ${isActive ? 'fill' : ''}`}>
                    {item.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate leading-tight">{item.label}</p>
                    <p className={`text-[10px] truncate ${isActive ? 'text-blue-100' : 'text-outline'}`}>
                      {item.sublabel}
                    </p>
                  </div>
                  {isActive && (
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Institutional External Links */}
          <div className="space-y-1 pt-2 border-t border-[#E2E8F0]">
            <p className="text-[11px] font-bold text-outline uppercase tracking-wider px-2 mb-1">
              Recursos Universitarios
            </p>
            <a
              href="https://ieeexplore.ieee.org"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-primary">local_library</span>
                <span>Biblioteca IEEE Xplore</span>
              </div>
              <span className="material-symbols-outlined text-[14px] text-outline">open_in_new</span>
            </a>
            <a
              href="https://eduroam.org"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-on-surface-variant hover:bg-surface-container-low transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[18px] text-primary">wifi</span>
                <span>Red Wi-Fi Eduroam</span>
              </div>
              <span className="material-symbols-outlined text-[14px] text-outline">open_in_new</span>
            </a>
          </div>
        </div>

        {/* Bottom Safety & Exit Actions */}
        <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
          <button
            onClick={() => onNavigate('login')}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg border border-[#E2E8F0] bg-surface-container-low hover:bg-surface-container text-xs font-semibold text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">lock</span>
            <span>Ver Pantalla de Login</span>
          </button>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-xs font-semibold text-error transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};
