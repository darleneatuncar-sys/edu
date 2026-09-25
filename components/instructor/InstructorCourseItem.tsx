import Link from 'next/link';
import { CourseStatusBadge } from './CourseStatusBadge';

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
  status?: string;
  category?: string | { id: string; name: string } | null;
}

interface InstructorCourseItemProps {
  course: CourseData;
}

export function InstructorCourseItem({ course }: InstructorCourseItemProps) {
  const status = course.status || (course.isPublished ? 'published' : 'draft');
  const categoryName = typeof course.category === 'object' && course.category !== null
    ? course.category.name
    : typeof course.category === 'string'
      ? course.category
      : '';

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-surface-container-lowest rounded-xl border border-outline-variant/20 hover:shadow-sm transition-all">
      <div className="relative w-full sm:w-40 h-32 sm:h-24 rounded-lg overflow-hidden bg-surface-container-high shrink-0">
        {course.bannerUrl ? (
          <img
            src={course.bannerUrl}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="material-symbols-outlined text-[32px] text-outline">image</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-bold text-on-surface truncate">{course.title}</h3>
          <CourseStatusBadge status={status as any} />
        </div>

        <p className="text-[11px] text-on-surface-variant line-clamp-1 mb-2">
          {course.description}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-outline">
          {categoryName && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">category</span>
              {categoryName}
            </span>
          )}
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">stack</span>
            {course.totalModules} módulos
          </span>
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">play_lesson</span>
            {course.totalLessons} lecciones
          </span>
          {course.enrolledCount > 0 && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">group</span>
              {course.enrolledCount} inscritos
            </span>
          )}
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/20">
          <span className="text-[11px] text-outline">
            Actualizado: {course.updatedAt ? new Date(course.updatedAt).toLocaleDateString('es-ES') : '—'}
          </span>

          <div className="flex items-center gap-2">
            <Link
              href={`/docente/cursos/${course.id}/editar`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-surface-container-low text-on-surface-variant border border-outline-variant/30 hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">edit</span>
              Editar
            </Link>
            <Link
              href={`/docente/cursos/${course.id}/contenido`}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-primary-container text-white hover:bg-secondary transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">folder_open</span>
              Contenido
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
