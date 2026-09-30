'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import * as api from '@/src/api';
import { InstructorCourseItem } from '@/components/instructor/InstructorCourseItem';

type FilterStatus = 'all' | 'published' | 'draft' | 'pending_review';

interface CourseData {
  id: string;
  title: string;
  description: string | null;
  isPublished: boolean;
  totalModules: number;
  totalLessons: number;
  enrolledCount: number;
  updatedAt: string;
  bannerUrl: string | null;
  status: 'published' | 'draft' | 'pending_review' | 'rejected';
  instructor: { id: string; name: string };
  category: { id: string; name: string } | null;
}

export default function DocenteMisCursosPage() {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getInstructorCourses()
      .then((data: any[]) => {
        const mapped = data.map((c) => ({
          ...c,
          status: c.isPublished ? 'published' : 'draft' as FilterStatus,
        }));
        setCourses(mapped);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'all'
    ? courses
    : courses.filter((c) => c.status === filter);

  const filters: { value: FilterStatus; label: string; count: number }[] = [
    { value: 'all', label: 'Todos', count: courses.length },
    { value: 'published', label: 'Publicados', count: courses.filter((c) => c.status === 'published').length },
    { value: 'draft', label: 'Borradores', count: courses.filter((c) => c.status === 'draft').length },
    { value: 'pending_review', label: 'En revisión', count: courses.filter((c) => c.status === 'pending_review').length },
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center py-16">
          <span className="material-symbols-outlined animate-spin text-[32px] text-primary-container">progress_activity</span>
          <span className="ml-3 text-sm text-on-surface-variant">Cargando cursos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">Mis cursos</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Administra el contenido de tus cursos
          </p>
        </div>
        <Link
          href="/docente/crear-curso"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary-container text-white text-xs font-semibold hover:bg-secondary transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Crear curso
        </Link>
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === f.value
                ? 'bg-primary-container text-white'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container'
            }`}
          >
            {f.label}
            <span className="ml-1.5 text-[10px] opacity-70">({f.count})</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-[32px] text-outline">school</span>
          </div>
          <h3 className="text-base font-bold text-on-surface mb-1">
            No hay cursos para mostrar
          </h3>
          <p className="text-sm text-on-surface-variant mb-4">
            Crea tu primer curso para comenzar a enseñar.
          </p>
          <Link
            href="/docente/crear-curso"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary-container text-white text-xs font-semibold hover:bg-secondary transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            Crear curso
          </Link>
        </div>
      ) : (
        <div className="space-y-3 sidebar-shift">
          {filtered.map((course) => (
            <InstructorCourseItem key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
