'use client';

import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { CourseCard } from '@/components/courses/CourseCard';
import { EmptyState } from '@/components/courses/EmptyState';
import { currentUser, myCourses } from '@/lib/mockData';

const studentNavItems = [
  { href: '/mis-cursos', label: 'Mis cursos', icon: 'school' },
  { href: '/explorar', label: 'Explorar cursos', icon: 'explore' },
];

const studentAccountItems = [
  { href: '/perfil', label: 'Mi perfil', icon: 'person' },
];

export default function MisCursosPage() {
  const inProgress = myCourses.filter((c) => c.status === 'in_progress');
  const completed = myCourses.filter((c) => c.status === 'completed');

  return (
    <div className="min-h-screen bg-surface">
      <Header homeHref="/mis-cursos" user={currentUser} />
      <Sidebar navItems={studentNavItems} accountItems={studentAccountItems} />
      <main className="lg:ml-56 pt-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface">
              Hola, {currentUser.name} 👋
            </h1>
            <p className="text-sm text-on-surface-variant mt-1">
              Continúa aprendiendo desde donde lo dejaste.
            </p>
          </div>

          {myCourses.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-8">
              {inProgress.length > 0 && (
                <section>
                  <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-4">
                    En progreso
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {inProgress.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </section>
              )}

              {completed.length > 0 && (
                <section>
                  <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-4">
                    Completados
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {completed.map((course) => (
                      <CourseCard key={course.id} course={course} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
