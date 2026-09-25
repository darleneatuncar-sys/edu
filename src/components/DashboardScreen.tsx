import React from 'react';
import { ActiveScreen, UserProfile } from '../types';

interface DashboardCourse {
  id: string;
  title: string;
  description: string | null;
  bannerUrl: string | null;
  instructor: { id: string; name: string };
  category: { id: string; name: string; slug: string } | null;
  totalModules: number;
  totalLessons: number;
  enrolledCount: number;
  progressPercent: number;
  completedLessons: number;
  enrolledAt: string;
}

interface DashboardScreenProps {
  user: UserProfile;
  myCourses: DashboardCourse[];
  onSelectCourse: (course: any) => void;
  onNavigate: (screen: ActiveScreen) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  myCourses,
  onSelectCourse,
  onNavigate
}) => {
  const isStudent = user.role === 'student';
  const firstName = user.name.split(' ')[0];

  // Calculate real stats
  const totalCourses = myCourses.length;
  const avgProgress = totalCourses > 0
    ? Math.round(myCourses.reduce((acc, c) => acc + c.progressPercent, 0) / totalCourses)
    : 0;
  const totalCompletedLessons = myCourses.reduce((acc, c) => acc + c.completedLessons, 0);
  const totalLessons = myCourses.reduce((acc, c) => acc + c.totalLessons, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary-container p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-blue-100 mb-1 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Mi plataforma de aprendizaje</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              ¡Hola, {firstName}!
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              {totalCourses > 0
                ? `Tienes ${totalCourses} curso${totalCourses > 1 ? 's' : ''} en progreso. ¡Sigue aprendiendo!`
                : 'Comienza a explorar nuestros cursos y aprende algo nuevo hoy.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('explore')}
              className="px-4 py-2.5 rounded-lg bg-white text-primary font-bold text-xs shadow-md hover:bg-blue-50 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">explore</span>
              <span>Explorar Cursos</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-outline mb-2">
            <span className="text-xs font-medium">Cursos Inscritos</span>
            <span className="material-symbols-outlined text-primary text-[20px]">menu_book</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface">{totalCourses}</span>
            <span className="text-xs text-outline">cursos</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-outline mb-2">
            <span className="text-xs font-medium">Progreso General</span>
            <span className="material-symbols-outlined text-secondary text-[20px]">trending_up</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface">{avgProgress}%</span>
            <span className="text-xs text-emerald-600 font-semibold">avance</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-outline mb-2">
            <span className="text-xs font-medium">Lecciones Completadas</span>
            <span className="material-symbols-outlined text-amber-500 text-[20px]">check_circle</span>
          </div>
          <div className="text-sm font-bold text-on-surface truncate">
            {totalCompletedLessons} de {totalLessons}
          </div>
          {totalLessons > totalCompletedLessons && (
            <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
              {totalLessons - totalCompletedLessons} pendientes
            </span>
          )}
        </div>

        <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-2xs">
          <div className="flex items-center justify-between text-outline mb-2">
            <span className="text-xs font-medium">Certificados</span>
            <span className="material-symbols-outlined text-tertiary text-[20px]">emoji_events</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-on-surface">0</span>
            <span className="text-xs text-outline">completados</span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Course Cards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-on-surface">Mis Cursos</h2>
              <p className="text-xs text-on-surface-variant">Continúa desde donde lo dejaste</p>
            </div>
            <button
              onClick={() => onNavigate('my-courses')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todos</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          {myCourses.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-[#E2E8F0] shadow-2xs text-center">
              <span className="material-symbols-outlined text-[48px] text-outline mb-3">school</span>
              <h3 className="text-base font-bold text-on-surface mb-1">Todavía no estás inscrito en ningún curso</h3>
              <p className="text-xs text-on-surface-variant mb-4">Explora nuestros cursos para comenzar a aprender.</p>
              <button
                onClick={() => onNavigate('explore')}
                className="px-4 py-2 rounded-lg bg-primary-container text-white text-xs font-semibold hover:bg-secondary transition-colors"
              >
                Explorar cursos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {myCourses.slice(0, 4).map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Card Header with Banner */}
                    <div className="h-28 relative overflow-hidden bg-slate-800">
                      {course.bannerUrl && (
                        <img
                          src={course.bannerUrl}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent p-3 flex flex-col justify-end">
                        <div className="flex items-center justify-between text-white text-[11px]">
                          <span className="flex items-center gap-1 truncate font-medium">
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            {course.totalModules} módulos
                          </span>
                          {course.progressPercent > 0 && (
                            <span className="font-bold bg-white/20 px-1.5 py-0.5 rounded text-[11px]">
                              {course.progressPercent}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-3">
                      <div>
                        <h3 className="text-sm font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-1">
                          <span className="material-symbols-outlined text-[16px] text-outline">person</span>
                          <span>{course.instructor.name}</span>
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-on-surface-variant">Progreso</span>
                          <span className="font-bold text-primary">{course.progressPercent}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-container rounded-full transition-all duration-700"
                            style={{ width: `${course.progressPercent}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-3 bg-surface-container-low border-t border-[#E2E8F0]">
                    <button
                      type="button"
                      onClick={() => onSelectCourse(course)}
                      className="w-full py-2 px-3 rounded-lg bg-primary-container hover:bg-secondary text-white text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Continuar aprendiendo</span>
                      <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Action */}
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-2xs">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">explore</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-on-surface">Explorar Cursos</h3>
                <p className="text-[11px] text-on-surface-variant">Descubre algo nuevo</p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('explore')}
              className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">search</span>
              <span>Explorar</span>
            </button>
          </div>

          {/* Platform Info */}
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Sobre EduCore
              </h3>
              <span className="material-symbols-outlined text-outline text-[18px]">info</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Plataforma abierta de cursos en línea. Aprende a tu ritmo con cursos creados por expertos de la industria.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-primary font-semibold">
              <span className="material-symbols-outlined text-[14px]">school</span>
              <span>Aprende sin límites</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
