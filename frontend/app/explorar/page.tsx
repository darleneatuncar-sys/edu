'use client';

import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Button } from '@/components/ui/Button';
import { currentUser, exploreCourses } from '@/lib/mockData';

const studentNavItems = [
  { href: '/mis-cursos', label: 'Mis cursos', icon: 'school' },
  { href: '/explorar', label: 'Explorar cursos', icon: 'explore' },
];

const studentAccountItems = [
  { href: '/perfil', label: 'Mi perfil', icon: 'person' },
];

export default function ExplorarPage() {
  return (
    <div className="min-h-screen bg-surface">
      <Header homeHref="/mis-cursos" user={currentUser} />
      <Sidebar navItems={studentNavItems} accountItems={studentAccountItems} />
      <main className="lg:ml-[72px] pt-14">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
              Explorar cursos
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Descubre cursos para aprender algo nuevo
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sidebar-shift">
            {exploreCourses.map((course, index) => (
              <div
                key={course.id}
                className="flex flex-col bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="relative h-36 overflow-hidden bg-surface-container-high">
                  <Image
                    src={course.bannerUrl}
                    alt={course.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                    priority={index < 3}
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-primary">
                    {course.category}
                  </span>
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-on-surface line-clamp-1 mb-1">
                    {course.title}
                  </h3>
                  <p className="text-[11px] text-on-surface-variant mb-2">{course.instructor}</p>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2 flex-1">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/20 text-[11px] text-outline">
                    <span>{course.totalModules} módulos</span>
                    <span>{course.enrolledCount} inscritos</span>
                  </div>

                  <div className="mt-3">
                    {course.isEnrolled ? (
                      <Button variant="primary" className="w-full">
                        Ir al curso
                        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                      </Button>
                    ) : (
                      <Button variant="secondary" className="w-full">
                        <span className="material-symbols-outlined text-[14px]">add_circle</span>
                        Inscribirse
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
