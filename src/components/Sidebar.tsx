import React from 'react';
import { ActiveScreen } from '../types';

interface SidebarProps {
  activeScreen: ActiveScreen;
  onNavigate: (screen: ActiveScreen) => void;
  userRole: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  isMobileMenuOpen: boolean;
  onCloseMobileMenu: () => void;
  onLogout: () => void;
  userName: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeScreen,
  onNavigate,
  userRole,
  isMobileMenuOpen,
  onCloseMobileMenu,
  onLogout,
  userName,
}) => {
  const isStudent = userRole === 'STUDENT';

  const navItems = [
    {
      id: 'dashboard' as ActiveScreen,
      label: 'Dashboard',
      sublabel: 'Panel principal',
      icon: 'dashboard',
    },
    {
      id: 'explore' as ActiveScreen,
      label: 'Explorar Cursos',
      sublabel: 'Descubre cursos',
      icon: 'explore',
    },
    {
      id: 'my-courses' as ActiveScreen,
      label: 'Mis Cursos',
      sublabel: 'Continúa aprendiendo',
      icon: 'menu_book',
    },
    {
      id: 'grades' as ActiveScreen,
      label: 'Mi Progreso',
      sublabel: 'Seguimiento',
      icon: 'trending_up',
    },
    {
      id: 'services' as ActiveScreen,
      label: 'Certificados',
      sublabel: 'Logros obtenidos',
      icon: 'emoji_events',
    },
{
      id: 'services' as ActiveScreen,
      label: 'Certificados',
      sublabel: 'Logros obtenidos',
      icon: 'emoji_events',
    },
    {
      id: 'course-editor' as ActiveScreen,
      label: 'Editor de Cursos',
      sublabel: 'Crear y editar cursos',
      icon: 'folder_open',
    },
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
              <span className="font-bold text-on-surface">EduCore</span>
            </div>
            <button
              onClick={onCloseMobileMenu}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-outline hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          {/* User Profile Brief */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-[#E2E8F0] flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary-container text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[20px]">
                {isStudent ? 'person' : 'co_present'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-on-surface truncate">
                {userName || 'Mi cuenta'}
              </p>
              <p className="text-[11px] text-tertiary font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-tertiary-container animate-ping"></span>
                {isStudent ? 'Estudiante' : 'Instructor'}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <p className="text-[11px] font-bold text-outline uppercase tracking-wider px-2 mb-2">
              Navegación
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
        </div>

        {/* Bottom Exit Actions */}
        <div className="pt-4 border-t border-[#E2E8F0] space-y-2">
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
