'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { currentUser, myCourses } from '@/lib/mockData';

const studentNavItems = [
  { href: '/mis-cursos', label: 'Mis cursos', icon: 'school' },
  { href: '/explorar', label: 'Explorar cursos', icon: 'explore' },
];

const studentAccountItems = [
  { href: '/perfil', label: 'Mi perfil', icon: 'person' },
];

export default function CursoDetailPage() {
  const params = useParams();
  const course = myCourses.find((c) => c.id === params.id);

  if (!course) {
    return (
      <div className="min-h-screen bg-surface">
        <Header homeHref="/mis-cursos" user={currentUser} />
        <Sidebar navItems={studentNavItems} accountItems={studentAccountItems} />
        <main className="lg:ml-[72px] pt-14">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="material-symbols-outlined text-[48px] text-outline mb-3">error_outline</span>
              <h2 className="text-lg font-bold text-on-surface mb-1">Curso no encontrado</h2>
              <p className="text-sm text-on-surface-variant mb-4">El curso que buscas no existe.</p>
              <Link href="/mis-cursos" className="text-sm text-primary font-semibold hover:underline">
                Volver a mis cursos
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      <Header homeHref="/mis-cursos" user={currentUser} />
      <Sidebar navItems={studentNavItems} accountItems={studentAccountItems} />
      <main className="lg:ml-[72px] pt-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/mis-cursos"
            className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface transition-colors mb-4"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Mis cursos
          </Link>

          <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden mb-6">
            <Image
              src={course.bannerUrl}
              alt={course.title}
              fill
              sizes="(max-width: 1280px) 100vw, 1024px"
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/30 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2 ${
                course.status === 'completed'
                  ? 'bg-success-bg text-success border border-success-border'
                  : 'bg-white/20 text-white'
              }`}>
                {course.status === 'completed' && (
                  <span className="material-symbols-outlined text-[12px]">check</span>
                )}
                {course.status === 'completed' ? 'Completado' : 'En progreso'}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-white">{course.title}</h1>
              <p className="text-sm text-slate-200 mt-1">{course.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5">
                <h2 className="text-sm font-bold text-on-surface mb-4">Progreso del curso</h2>
                <ProgressBar
                  value={course.progressPercent}
                  size="md"
                  showLabel
                  label={`${course.completedLessons} de ${course.totalLessons} clases completadas`}
                />
              </div>

              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5">
                <h2 className="text-sm font-bold text-on-surface mb-4">Contenido del curso</h2>
                <div className="space-y-3">
                  {Array.from({ length: course.totalModules }, (_, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-3 rounded-lg bg-surface-container-low"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[16px] text-primary-container">
                          {i < Math.floor(course.totalModules * course.progressPercent / 100) ? 'check_circle' : 'play_circle'}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-on-surface">Módulo {i + 1}</p>
                        <p className="text-[11px] text-on-surface-variant">
                          {i < Math.floor(course.totalModules * course.progressPercent / 100)
                            ? 'Completado'
                            : i === Math.floor(course.totalModules * course.progressPercent / 100)
                            ? 'En progreso'
                            : 'Pendiente'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5">
                <h2 className="text-sm font-bold text-on-surface mb-3">Docente</h2>
                <div className="flex items-center gap-3">
                  <Avatar name={course.instructor} src={course.instructorAvatar} size="md" />
                  <div>
                    <p className="text-xs font-semibold text-on-surface">{course.instructor}</p>
                    <p className="text-[11px] text-on-surface-variant">{course.category}</p>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5">
                <h2 className="text-sm font-bold text-on-surface mb-3">Información</h2>
                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Categoría</span>
                    <span className="font-medium text-on-surface">{course.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Módulos</span>
                    <span className="font-medium text-on-surface">{course.totalModules}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Clases</span>
                    <span className="font-medium text-on-surface">{course.totalLessons}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Inscritos</span>
                    <span className="font-medium text-on-surface">{course.enrolledCount}</span>
                  </div>
                </div>
              </div>

              {course.status === 'in_progress' && (
                <Button className="w-full">
                  Continuar curso
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
