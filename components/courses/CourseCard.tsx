import Image from 'next/image';
import Link from 'next/link';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Course } from '@/lib/types';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <Link
      href={`/curso/${course.id}`}
      className="group flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden hover:shadow-md transition-all"
    >
      <div className="relative h-36 overflow-hidden bg-surface-container-high">
        <Image
          src={course.bannerUrl}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="text-sm font-bold text-white line-clamp-1">{course.title}</h3>
          <p className="text-[11px] text-slate-200">{course.instructor}</p>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <ProgressBar value={course.progressPercent} showLabel label="Progreso" />

        <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
          <span>{course.completedLessons} de {course.totalLessons} clases</span>
          {course.lastLesson && (
            <span className="truncate ml-2">Última: {course.lastLesson}</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
            course.status === 'completed'
              ? 'bg-success-bg text-success border border-success-border'
              : 'bg-primary-container/10 text-primary-container'
          }`}>
            {course.status === 'completed' && (
              <span className="material-symbols-outlined text-[12px]">check</span>
            )}
            {course.status === 'completed' ? 'Completado' : 'En progreso'}
          </span>
        </div>

        <button className="w-full py-2.5 rounded-lg bg-primary-container text-white text-xs font-semibold hover:bg-secondary transition-colors flex items-center justify-center gap-1.5">
          <span>{course.status === 'completed' ? 'Ver curso' : 'Continuar'}</span>
          <span className="material-symbols-outlined text-[14px]">
            {course.status === 'completed' ? 'visibility' : 'arrow_forward'}
          </span>
        </button>
      </div>
    </Link>
  );
}
