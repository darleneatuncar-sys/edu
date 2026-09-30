'use client';

import Link from 'next/link';
import { adminUser, adminUsers, instructorRequests, adminCourses } from '@/lib/mockData';

const stats = [
  {
    label: 'Usuarios registrados',
    value: adminUsers.length,
    icon: 'group',
    href: '/admin/usuarios',
  },
  {
    label: 'Docentes activos',
    value: adminUsers.filter((u) => u.role === 'instructor' && u.status === 'active').length,
    icon: 'co_present',
    href: '/admin/usuarios',
  },
  {
    label: 'Cursos publicados',
    value: adminCourses.filter((c) => c.status === 'published').length,
    icon: 'check_circle',
    href: '/admin/cursos',
  },
  {
    label: 'Cursos en revisión',
    value: adminCourses.filter((c) => c.status === 'pending_review').length,
    icon: 'pending',
    href: '/admin/cursos',
  },
];

const pendingCourses = adminCourses.filter((c) => c.status === 'pending_review');
const pendingRequests = instructorRequests.filter((r) => r.status === 'pending');

export default function AdminDashboard() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface">Hola, {adminUser.name}</h1>
        <p className="text-sm text-on-surface-variant mt-1">Administración de EduCore</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4 sm:p-5 hover:shadow-sm transition-shadow"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-container/15 flex items-center justify-center mb-3">
              <span className="material-symbols-outlined text-primary-container text-[22px]">{stat.icon}</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-on-surface">{stat.value}</p>
            <p className="text-xs text-on-surface-variant mt-1">{stat.label}</p>
          </Link>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-bold text-on-surface mb-4">Pendientes de atención</h2>
        <div className="space-y-3">
          {pendingCourses.length > 0 && (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-tertiary-container/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">menu_book</span>
                </div>
                <p className="text-sm font-medium text-on-surface">
                  {pendingCourses.length} curso{pendingCourses.length > 1 ? 's' : ''} esperan revisión
                </p>
              </div>
              <Link
                href="/admin/cursos"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shrink-0"
              >
                Revisar cursos
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          )}

          {pendingRequests.length > 0 && (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-tertiary-container/30 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-on-tertiary-container text-[20px]">assignment</span>
                </div>
                <p className="text-sm font-medium text-on-surface">
                  {pendingRequests.length} solicitud{pendingRequests.length > 1 ? 'es' : ''} de docentes
                </p>
              </div>
              <Link
                href="/admin/solicitudes-docente"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors shrink-0"
              >
                Ver solicitudes
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </Link>
            </div>
          )}

          {pendingCourses.length === 0 && pendingRequests.length === 0 && (
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-8 text-center">
              <span className="material-symbols-outlined text-outline text-[40px] mb-2">check_circle</span>
              <p className="text-sm text-on-surface-variant">No hay pendientes en este momento</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
