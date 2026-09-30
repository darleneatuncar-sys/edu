'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ModuleList } from '@/components/instructor/ModuleList';
import { CourseStatusBadge } from '@/components/instructor/CourseStatusBadge';
import * as api from '@/src/api';

export default function ContenidoCursoPage() {
  const params = useParams();
  const courseId = params.id as string;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCourse = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getCourseForEdit(courseId);
      setCourse(data);
    } catch (e: any) {
      setError(e.message || 'Error al cargar el curso');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center py-16">
          <span className="material-symbols-outlined animate-spin text-[32px] text-primary-container">progress_activity</span>
          <span className="ml-3 text-sm text-on-surface-variant">Cargando contenido...</span>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="material-symbols-outlined text-[48px] text-outline mb-3">error_outline</span>
          <h2 className="text-lg font-bold text-on-surface mb-1">{error || 'Curso no encontrado'}</h2>
          <Link href="/docente/mis-cursos" className="text-sm text-primary font-semibold hover:underline">
            Volver a mis cursos
          </Link>
        </div>
      </div>
    );
  }

  const status = course.isPublished ? 'published' : 'draft';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Link
        href="/docente/mis-cursos"
        className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface transition-colors mb-4"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Mis cursos
      </Link>

      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-2xl font-bold text-on-surface">{course.title}</h1>
        <CourseStatusBadge status={status} />
      </div>
      <p className="text-sm text-on-surface-variant mb-6">
        Gestiona los módulos, lecciones y evaluaciones de tu curso
      </p>

      <div className="flex items-center gap-2 mb-6">
        <Link
          href={`/docente/cursos/${courseId}/editar`}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          Información
        </Link>
        <Link
          href={`/docente/cursos/${courseId}/contenido`}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-container text-white"
        >
          Contenido
        </Link>
      </div>

      <div className="mb-4">
        <h2 className="text-sm font-bold text-on-surface">Contenido del curso</h2>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Construye el contenido de tu curso agregando módulos, lecciones y evaluaciones.
        </p>
      </div>

      <ModuleList
        courseId={courseId}
        modules={course.modules || []}
        onRefresh={fetchCourse}
      />
    </div>
  );
}
