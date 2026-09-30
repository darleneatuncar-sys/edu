'use client';

import { useState } from 'react';
import Link from 'next/link';
import { adminCourses as initialCourses } from '@/lib/mockData';
import { InstructorCourse, CourseStatus } from '@/lib/types';
import { StatusBadge } from '@/components/admin/StatusBadge';

const tabFilters: { key: string; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'pending_review', label: 'En revisión' },
  { key: 'published', label: 'Publicados' },
  { key: 'rejected', label: 'Rechazados' },
];

export default function AdminCursosPage() {
  const [courses, setCourses] = useState<InstructorCourse[]>(initialCourses);
  const [tab, setTab] = useState('all');

  const filtered = tab === 'all' ? courses : courses.filter((c) => c.status === tab);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Cursos</h1>
        <p className="text-sm text-on-surface-variant mt-1">Gestiona todos los cursos de la plataforma</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {tabFilters.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              tab === t.key
                ? 'bg-primary-container text-on-primary-container'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((course) => (
          <div
            key={course.id}
            className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4 sm:p-5 hover:shadow-sm transition-shadow"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-32 h-20 rounded-lg bg-surface-container-high overflow-hidden shrink-0">
                <img
                  src={course.bannerUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="text-sm font-semibold text-on-surface truncate">{course.title}</h3>
                  <StatusBadge status={course.status} />
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-on-surface-variant">
                  <span>{course.category}</span>
                  <span>{course.level}</span>
                  <span>{course.totalModules} módulos</span>
                  <span>{course.totalLessons} lecciones</span>
                  {course.enrolledCount > 0 && <span>{course.enrolledCount} inscritos</span>}
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-on-surface-variant">Actualizado: {course.updatedAt}</span>
                  {course.status === 'pending_review' && (
                    <Link
                      href={`/admin/cursos/${course.id}`}
                      className="text-xs text-primary font-semibold hover:underline"
                    >
                      Revisar
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-8 text-center">
            <span className="material-symbols-outlined text-outline text-[40px] mb-2">menu_book</span>
            <p className="text-sm text-on-surface-variant">No hay cursos en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}
