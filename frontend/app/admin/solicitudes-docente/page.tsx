'use client';

import { useState } from 'react';
import Link from 'next/link';
import { instructorRequests as initialRequests } from '@/lib/mockData';
import { InstructorRequest } from '@/lib/types';
import { StatusBadge } from '@/components/admin/StatusBadge';

export default function AdminSolicitudesPage() {
  const [requests, setRequests] = useState<InstructorRequest[]>(initialRequests);
  const [tabFilter, setTabFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  const filtered = tabFilter === 'all' ? requests : requests.filter((r) => r.status === tabFilter);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Solicitudes de docentes</h1>
        <p className="text-sm text-on-surface-variant mt-1">Revisa las solicitudes de personas que quieren ser docentes</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setTabFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              tabFilter === tab
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {tab === 'all' ? 'Todas' : tab === 'pending' ? 'Pendientes' : tab === 'approved' ? 'Aprobadas' : 'Rechazadas'}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((req) => (
          <div
            key={req.id}
            className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4 sm:p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary-container">
                    {req.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-on-surface">{req.name}</p>
                  <p className="text-xs text-on-surface-variant">{req.specialty}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-13 sm:ml-0">
                <StatusBadge status={req.status} />
                <Link
                  href={`/admin/solicitudes-docente/${req.id}`}
                  className="text-xs text-primary font-semibold hover:underline shrink-0"
                >
                  Revisar
                </Link>
              </div>
            </div>
            <div className="mt-3 ml-13 sm:ml-[52px] flex flex-wrap gap-x-4 gap-y-1 text-xs text-on-surface-variant">
              <span>{req.email}</span>
              <span>Solicitado: {req.requestDate}</span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-8 text-center">
            <span className="material-symbols-outlined text-outline text-[40px] mb-2">inbox</span>
            <p className="text-sm text-on-surface-variant">No hay solicitudes en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}
