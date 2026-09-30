import type { ReactNode } from 'react';
import Link from 'next/link';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <header className="fixed top-0 left-0 right-0 h-14 bg-surface-container-lowest border-b border-outline-variant/20 z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2.5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center">
              <span className="material-symbols-outlined text-white text-[18px]">admin_panel_settings</span>
            </div>
            <div>
              <span className="text-lg font-bold text-on-surface tracking-tight">Edu</span>
              <span className="text-lg font-bold text-primary-container tracking-tight">Core</span>
              <span className="ml-2 text-[10px] font-bold text-primary-container bg-primary-container/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Admin
              </span>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-on-surface-variant hidden sm:block">admin@educore.com</span>
          <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary-container text-[18px]">person</span>
          </div>
        </div>
      </header>

      <AdminSidebar />

      <main className="pt-14 lg:ml-56 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
