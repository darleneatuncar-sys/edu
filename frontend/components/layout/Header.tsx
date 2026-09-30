'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Avatar } from '@/components/ui/Avatar';

interface HeaderProps {
  homeHref?: string;
  user: {
    name: string;
    avatarUrl: string | null;
  };
  profileHref?: string;
}

export function Header({ homeHref = '/mis-cursos', user, profileHref = '/perfil' }: HeaderProps) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('educore_token');
    localStorage.removeItem('educore_user');
    setIsProfileOpen(false);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-surface-container-lowest/80 backdrop-blur-md border-b border-outline-variant/20">
      <div className="flex items-center justify-between h-14 px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <Link href={homeHref} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[18px]">school</span>
            </div>
            <span className="text-lg font-bold tracking-tight hidden sm:block">
              <span className="text-on-surface">Edu</span>
              <span className="text-primary-container">Core</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative hidden sm:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              search
            </span>
            <input
              type="text"
              placeholder="Buscar cursos..."
              className="w-56 lg:w-72 pl-9 pr-3 py-2 text-xs bg-surface-container-low border border-outline-variant/30 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-outline"
            />
          </div>

          <button
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-surface-container-low transition-colors relative"
            aria-label="Notificaciones"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
          </button>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 py-1.5 px-2 rounded-lg hover:bg-surface-container-low transition-colors"
            >
              <Avatar name={user.name} src={user.avatarUrl} size="sm" />
              <span className="text-xs font-medium text-on-surface hidden sm:block">
                {user.name}
              </span>
              <span className="material-symbols-outlined text-[16px] text-outline hidden sm:block">
                expand_more
              </span>
            </button>

            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 top-full mt-1 w-48 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/20 py-1 z-50">
                  <Link
                    href={profileHref}
                    onClick={() => setIsProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-xs text-on-surface hover:bg-surface-container-low transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    Mi perfil
                  </Link>
                  <hr className="border-outline-variant/20 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 text-xs text-error hover:bg-error-container/30 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Cerrar sesión
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
