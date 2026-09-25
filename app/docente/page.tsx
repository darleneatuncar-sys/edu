'use client';

import Link from 'next/link';
import { instructorUser, instructorCourses } from '@/lib/mockData';
import { CourseStatusBadge } from '@/components/instructor/CourseStatusBadge';

export default function DocenteInicioPage() {
  const published = instructorCourses.filter((c) => c.status === 'published');
  const drafts = instructorCourses.filter((c) => c.status === 'draft');
  const pending = instructorCourses.filter((c) => c.status === 'pending_review');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
          Hola, {instructorUser.name} 👋
        </h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Gestiona tus cursos y continúa creando contenido para tus estudiantes.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="flex items-center gap-3 p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
          <div className="w-10 h-10 rounded-lg bg-primary-container/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px] text-primary-container">school</span>
          </div>
          <div>
            <p className="text-lg font-bold text-on-surface">{instructorCourses.length}</p>
            <p className="text-[11px] text-on-surface-variant">Cursos creados</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
          <div className="w-10 h-10 rounded-lg bg-success-bg flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px] text-success">check_circle</span>
          </div>
          <div>
            <p className="text-lg font-bold text-on-surface">{published.length}</p>
            <p className="text-[11px] text-on-surface-variant">Publicados</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20">
          <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px] text-on-surface-variant">edit</span>
          </div>
          <div>
            <p className="text-lg font-bold text-on-surface">{drafts.length + pending.length}</p>
            <p className="text-[11px] text-on-surface-variant">Borradores / En revisión</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">
            Últimos cursos
          </h2>
          <Link
            href="/docente/mis-cursos"
            className="text-xs font-semibold text-primary hover:underline"
          >
            Ver todos
          </Link>
        </div>

        <div className="space-y-3">
          {instructorCourses.slice(0, 3).map((course) => (
            <div
              key={course.id}
              className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-on-surface truncate">{course.title}</h3>
                  <CourseStatusBadge status={course.status} />
                </div>
                <p className="text-[11px] text-on-surface-variant">
                  {course.totalModules} módulos · {course.totalLessons} lecciones · {course.enrolledCount} inscritos
                </p>
              </div>
              <Link
                href={`/docente/cursos/${course.id}/editar`}
                className="ml-4 shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-surface-container-low text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">edit</span>
                Editar
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
