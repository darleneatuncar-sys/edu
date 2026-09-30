import { CourseStatus, RequestStatus, AdminUserStatus } from '@/lib/types';

const statusStyles: Record<string, string> = {
  draft: 'bg-outline/10 text-outline',
  pending_review: 'bg-tertiary-container text-on-tertiary-container',
  published: 'bg-secondary-container text-on-secondary-container',
  rejected: 'bg-error-container text-on-error-container',
  pending: 'bg-tertiary-container text-on-tertiary-container',
  approved: 'bg-secondary-container text-on-secondary-container',
  rejected_request: 'bg-error-container text-on-error-container',
  active: 'bg-secondary-container text-on-secondary-container',
  suspended: 'bg-error-container text-on-error-container',
};

const statusLabels: Record<string, string> = {
  draft: 'Borrador',
  pending_review: 'En revisión',
  published: 'Publicado',
  rejected: 'Rechazado',
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected_request: 'Rechazado',
  active: 'Activo',
  suspended: 'Suspendido',
};

interface StatusBadgeProps {
  status: CourseStatus | RequestStatus | AdminUserStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusStyles[status] || ''}`}>
      {statusLabels[status] || status}
    </span>
  );
}
