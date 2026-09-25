import { CourseStatus } from '@/lib/types';

const statusConfig: Record<CourseStatus, { label: string; className: string }> = {
  draft: {
    label: 'Borrador',
    className: 'bg-surface-container-high text-on-surface-variant',
  },
  pending_review: {
    label: 'En revisión',
    className: 'bg-amber-50 text-amber-700 border border-amber-200',
  },
  published: {
    label: 'Publicado',
    className: 'bg-success-bg text-success border border-success-border',
  },
  rejected: {
    label: 'Rechazado',
    className: 'bg-error-container/30 text-error border border-error/20',
  },
};

interface CourseStatusBadgeProps {
  status: CourseStatus;
}

export function CourseStatusBadge({ status }: CourseStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.className}`}>
      {status === 'published' && (
        <span className="material-symbols-outlined text-[12px]">check</span>
      )}
      {status === 'draft' && (
        <span className="material-symbols-outlined text-[12px]">edit</span>
      )}
      {status === 'pending_review' && (
        <span className="material-symbols-outlined text-[12px]">schedule</span>
      )}
      {status === 'rejected' && (
        <span className="material-symbols-outlined text-[12px]">close</span>
      )}
      {config.label}
    </span>
  );
}
