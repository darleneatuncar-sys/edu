import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';

interface NavbarProps {
  user: UserProfile;
  onSwitchRole: (role: UserRole) => void;
  onLogout: () => void;
  lang: 'ES' | 'EN';
  onToggleLang: () => void;
  onOpenNotifications: () => void;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  onSwitchRole,
  onLogout,
  lang,
  onToggleLang,
  onOpenNotifications,
  unreadCount
}) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-container-lowest border-b border-[#E2E8F0] shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo & Academic Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-container flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined text-white text-[24px] fill">school</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-baseline">
              <span className="text-xl text-on-surface tracking-tight font-bold">Edu</span>
              <span className="text-xl text-primary-container tracking-tight font-bold">Core</span>
            </div>
            <span className="text-[10px] text-on-surface-variant font-medium hidden sm:inline">
              Campus Virtual Académico
            </span>
          </div>

          {/* Academic Period Pill */}
          <div className="hidden md:flex items-center gap-1.5 ml-3 px-2.5 py-1 rounded-full bg-surface-container text-xs font-semibold text-on-surface border border-[#E2E8F0]">
            <span className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse"></span>
            <span>{user.academicPeriod}</span>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar asignaturas, sílabos, rúbricas o trámites... (Ctrl+K)"
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-surface-container-low border border-[#E2E8F0] rounded-lg text-on-surface placeholder:text-outline focus:outline-none focus:border-primary focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right Utility & Profile Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Quick Toggle */}
          <div className="hidden sm:flex items-center p-0.5 bg-surface-container-low rounded-lg border border-[#E2E8F0] text-xs">
            <button
              onClick={() => onSwitchRole('student')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                user.role === 'student'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Vista de Alumno"
            >
              Estudiante
            </button>
            <button
              onClick={() => onSwitchRole('faculty')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all cursor-pointer ${
                user.role === 'faculty'
                  ? 'bg-white text-primary shadow-xs'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
              title="Vista de Docente"
            >
              Docente
            </button>
          </div>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={onToggleLang}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container-low hover:bg-surface-container border border-[#E2E8F0] text-xs font-semibold text-on-surface cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">language</span>
            <span>{lang}</span>
          </button>

          {/* Notifications Button */}
          <button
            type="button"
            onClick={onOpenNotifications}
            className="relative w-9 h-9 rounded-lg bg-surface-container-low hover:bg-surface-container border border-[#E2E8F0] flex items-center justify-center text-on-surface cursor-pointer"
            title="Avisos Académicos"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* User Profile Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 sm:px-2 rounded-lg hover:bg-surface-container-low transition-colors border border-transparent hover:border-[#E2E8F0] cursor-pointer"
            >
              <img
                src={user.avatarUrl}
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-primary/20"
              />
              <div className="hidden xl:flex flex-col text-left">
                <span className="text-xs font-bold text-on-surface leading-tight truncate max-w-[140px]">
                  {user.name}
                </span>
                <span className="text-[10px] text-on-surface-variant capitalize">
                  {user.role === 'student' ? 'Estudiante Regular' : 'Docente Catedrático'}
                </span>
              </div>
              <span className="material-symbols-outlined text-outline text-[16px]">expand_more</span>
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div 
                className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#E2E8F0] p-2 z-50 animate-in fade-in"
                onClick={() => setShowProfileMenu(false)}
              >
                <div className="p-3 border-b border-[#E2E8F0] bg-surface-container-low rounded-lg mb-1.5">
                  <p className="text-xs font-bold text-on-surface">{user.name}</p>
                  <p className="text-[11px] text-on-surface-variant truncate">{user.email}</p>
                  <p className="text-[11px] text-primary font-medium mt-1">
                    {user.studentCode ? `Código: ${user.studentCode}` : `Docente: ${user.facultyCode}`}
                  </p>
                </div>

                <div className="py-1 text-xs">
                  <div className="px-3 py-2 text-on-surface-variant text-[11px]">
                    <p className="font-semibold text-on-surface">{user.faculty}</p>
                    <p>{user.program}</p>
                  </div>
                </div>

                <div className="border-t border-[#E2E8F0] pt-1">
                  <button
                    type="button"
                    onClick={onLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-error hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Cerrar Sesión / Salir al Portal</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
