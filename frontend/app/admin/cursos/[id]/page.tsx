'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { adminCourses } from '@/lib/mockData';
import { StatusBadge } from '@/components/admin/StatusBadge';

export default function AdminCursoReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [courses, setCourses] = useState(adminCourses);
  const [showReject, setShowReject] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <div className="max-w-3xl mx-auto text-center py-16">
        <span className="material-symbols-outlined text-outline text-[48px] mb-3">error</span>
        <p className="text-on-surface-variant">Curso no encontrado</p>
      </div>
    );
  }

  const handleApprove = () => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'published' as const } : c))
    );
    router.push('/admin/cursos');
  };

  const handleReject = () => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'rejected' as const } : c))
    );
    router.push('/admin/cursos');
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

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 sm:p-8 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-on-surface">Revisión de curso</h1>
          <StatusBadge status={course.status} />
        </div>

        <div className="w-full h-40 rounded-xl bg-surface-container-high overflow-hidden mb-6">
          <img src={course.bannerUrl} alt={course.title} className="w-full h-full object-cover" />
        </div>

        <h2 className="text-lg font-bold text-on-surface mb-4">{course.title}</h2>

        <div className="space-y-3 mb-6">
          <div className="bg-surface-container-low rounded-xl p-4">
            <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1.5">Descripción</p>
            <p className="text-sm text-on-surface">{course.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-container-low rounded-xl p-4">
              <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Categoría</p>
              <p className="text-sm font-medium text-on-surface">{course.category}</p>
            </div>
            <div className="bg-surface-container-low rounded-xl p-4">
              <p className="text-[10px] font-bold text-outline uppercase tracking-wider mb-1">Nivel</p>
              <p className="text-sm font-medium text-on-surface">{course.level}</p>
            </div>
          </div>
        </div>

        {course.modules.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-on-surface mb-3">Contenido del curso</h3>
            <div className="space-y-2">
              {course.modules.map((mod, i) => (
                <div key={mod.id} className="bg-surface-container-low rounded-xl p-4">
                  <p className="text-sm font-semibold text-on-surface mb-2">
                    Módulo {i + 1}: {mod.title}
                  </p>
                  <ul className="space-y-1.5 ml-4">
                    {mod.lessons.map((lesson) => (
                      <li key={lesson.id} className="flex items-center gap-2 text-xs text-on-surface-variant">
                        <span className="material-symbols-outlined text-[14px] text-outline">
                          {lesson.type === 'video' ? 'play_circle' : lesson.type === 'pdf' ? 'description' : lesson.type === 'link' ? 'link' : 'article'}
                        </span>
                        {lesson.title}
                        {lesson.duration && <span className="text-outline">({lesson.duration})</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {course.modules.length === 0 && (
          <div className="bg-surface-container-low rounded-xl p-6 text-center">
            <span className="material-symbols-outlined text-outline text-[32px] mb-2">folder_open</span>
            <p className="text-sm text-on-surface-variant">No hay contenido disponible para revisar</p>
          </div>
        )}
      </div>

      {course.status === 'pending_review' && !showReject && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 sm:p-8">
          <h3 className="text-sm font-bold text-on-surface mb-4">Acciones de revisión</h3>
          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-secondary-container text-on-secondary-container hover:bg-secondary-container/80 transition-colors cursor-pointer"
            >
              Aprobar y publicar
            </button>
            <button
              onClick={() => setShowReject(true)}
              className="flex-1 py-2.5 rounded-lg text-xs font-semibold bg-error-container text-on-error-container hover:bg-error-container/80 transition-colors cursor-pointer"
            >
              Rechazar
            </button>
          </div>
        </div>
      )}

      {showReject && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 sm:p-8">
          <h3 className="text-sm font-bold text-on-surface mb-4">Motivo del rechazo</h3>
          <textarea
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
            rows={4}
            placeholder="Indica el motivo del rechazo..."
            className="w-full px-3 py-2.5 text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg focus:outline-none focus:border-error focus:ring-1 focus:ring-error/20 transition-all placeholder:text-outline resize-none"
          />
          <div className="flex gap-2 mt-4">
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

      {course.status !== 'pending_review' && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/20 p-6 text-center">
          <p className="text-sm text-on-surface-variant">
            Este curso ya fue {course.status === 'published' ? 'publicado' : 'rechazado'}
          </p>
        </div>
      )}
    </div>
  );
}
