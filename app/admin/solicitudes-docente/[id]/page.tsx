'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { instructorRequests } from '@/lib/mockData';
import { StatusBadge } from '@/components/admin/StatusBadge';

export default function AdminSolicitudDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [requests, setRequests] = useState(instructorRequests);
  const [showReject, setShowReject] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const request = requests.find((r) => r.id === id);

  if (!request) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <span className="material-symbols-outlined text-outline text-[48px] mb-3">error</span>
        <p className="text-on-surface-variant">Solicitud no encontrada</p>
      </div>
    );
  }

  const handleApprove = () => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'approved' as const } : r))
    );
    router.push('/admin/solicitudes-docente');
  };

  const handleReject = () => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: 'rejected' as const, rejectionReason } : r
      )
    );
    router.push('/admin/solicitudes-docente');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1.5 text-sm text-on-surface-variant hover:text-on-surface mb-6 transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Volver
      </button>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-on-surface">Detalle de solicitud</h1>
          <StatusBadge status={request.status} />
        </div>

        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-outline-variant/20">
          <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center shrink-0">
            <span className="text-xl font-bold text-primary-container">
              {request.name.charAt(0)}
            </span>
          </div>
          <div>
            <p className="text-lg font-semibold text-on-surface">{request.name}</p>
            <p className="text-sm text-on-surface-variant">{request.email}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-surface-container-low rounded-xl p-4">
            <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1.5">Área / Especialidad</p>
            <p className="text-sm font-medium text-on-surface">{request.specialty}</p>
          </div>
          <div className="bg-surface-container-low rounded-xl p-4">
            <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1.5">Experiencia</p>
            <p className="text-sm text-on-surface">{request.experience}</p>
          </div>
          <div className="bg-surface-container-low rounded-xl p-4">
            <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1.5">Fecha de solicitud</p>
            <p className="text-sm font-medium text-on-surface">{request.requestDate}</p>
          </div>
          {request.rejectionReason && (
            <div className="bg-error-container/20 rounded-xl p-4 border border-error/10">
              <p className="text-[10px] font-bold text-error uppercase tracking-wider mb-1.5">Motivo del rechazo</p>
              <p className="text-sm text-on-surface">{request.rejectionReason}</p>
            </div>
          )}
        </div>

        {request.status === 'pending' && !showReject && (
          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 transition-colors cursor-pointer"
            >
              Aprobar solicitud
            </button>
            <button
              onClick={() => setShowReject(true)}
              className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-error-container text-on-error-container hover:bg-error-container/80 transition-colors cursor-pointer"
            >
              Rechazar solicitud
            </button>
          </div>
        )}

        {showReject && (
          <div className="bg-error-container/10 rounded-xl p-5 border border-error/10">
            <label className="text-xs font-semibold text-on-surface block mb-2">
              Motivo del rechazo
            </label>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              rows={3}
              placeholder="Indica el motivo del rechazo..."
              className="w-full px-3 py-2.5 text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg focus:outline-none focus:border-error focus:ring-1 focus:ring-error/20 transition-all placeholder:text-outline resize-none"
            />
            <div className="flex gap-2 mt-3">
              <button
                onClick={handleReject}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-error-container text-on-error-container hover:bg-error-container/80 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirmar rechazo
              </button>
              <button
                onClick={() => {
                  setShowReject(false);
                  setRejectionReason('');
                }}
                className="px-4 py-2.5 rounded-lg text-xs font-semibold bg-surface-container-high text-on-surface hover:bg-surface-container-high/80 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {request.status !== 'pending' && (
          <div className="text-center py-4">
            <p className="text-sm text-on-surface-variant">
              Esta solicitud ya fue {request.status === 'approved' ? 'aprobada' : 'rechazada'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
