import React from 'react';
import { Course, CampusNotice, UserProfile, ActiveScreen } from '../types';

interface DashboardScreenProps {
  user: UserProfile;
  courses: Course[];
  notices: CampusNotice[];
  onSelectCourse: (course: Course) => void;
  onNavigate: (screen: ActiveScreen) => void;
}

export const DashboardScreen: React.FC<DashboardScreenProps> = ({
  user,
  courses,
  notices,
  onSelectCourse,
  onNavigate
}) => {
  const isStudent = user.role === 'student';

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome & Period Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-primary via-secondary to-primary-container p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        {/* Background Subtle Shapes */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs text-xs font-semibold text-blue-100 mb-1 border border-white/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Campus Virtual Oficial • Semestre Académico 2025-I</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              {isStudent ? `¡Hola de nuevo, ${user.name.split(' ')[0]}!` : `Bienvenido, ${user.name}`}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
              {isStudent
                ? `Tienes 2 entregas académicas programadas para esta semana y todas tus aulas virtuales activas.`
                : `Tienes 18 trabajos pendientes de calificación y 4 cátedras en marcha para este período.`}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('grades')}
              className="px-4 py-2.5 rounded-lg bg-white text-primary font-bold text-xs shadow-md hover:bg-blue-50 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">grade</span>
              <span>{isStudent ? 'Ver Calificaciones' : 'Libro de Calificaciones'}</span>
            </button>
            <button
              type="button"
              onClick={() => onNavigate('services')}
              className="px-4 py-2.5 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold text-xs border border-white/30 backdrop-blur-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>Trámites</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {isStudent ? (
          <>
            <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-2xs">
              <div className="flex items-center justify-between text-outline mb-2">
                <span className="text-xs font-medium">Promedio Acumulado</span>
                <span className="material-symbols-outlined text-primary text-[20px]">stars</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-on-surface">{user.gpa}</span>
                <span className="text-xs text-outline">/ 20.0</span>
              </div>
              <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {user.academicStanding}
              </span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-2xs">
              <div className="flex items-center justify-between text-outline mb-2">
                <span className="text-xs font-medium">Créditos Inscritos</span>
                <span className="material-symbols-outlined text-secondary text-[20px]">auto_stories</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-on-surface">21</span>
                <span className="text-xs text-outline">Créditos</span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-2">
                5 Asignaturas Obligatorias
              </p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-2xs">
              <div className="flex items-center justify-between text-outline mb-2">
                <span className="text-xs font-medium">Próxima Entrega</span>
                <span className="material-symbols-outlined text-amber-500 text-[20px]">timer</span>
              </div>
              <div className="text-sm font-bold text-on-surface truncate">
                Laboratorio 01
              </div>
              <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Faltan 2 días (23:59)
              </span>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-2xs">
              <div className="flex items-center justify-between text-outline mb-2">
                <span className="text-xs font-medium">Asistencia Registrada</span>
                <span className="material-symbols-outlined text-tertiary text-[20px]">how_to_reg</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-on-surface">96.8%</span>
                <span className="text-xs text-emerald-600 font-semibold">Óptima</span>
              </div>
              <p className="text-[11px] text-on-surface-variant mt-2">
                Sin riesgo de inhabilitación
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-2xs">
              <div className="flex items-center justify-between text-outline mb-2">
                <span className="text-xs font-medium">Cursos Asignados</span>
                <span className="material-symbols-outlined text-primary text-[20px]">school</span>
              </div>
              <span className="text-2xl font-bold text-on-surface">4 Cursos</span>
              <p className="text-[11px] text-on-surface-variant mt-2">16 horas lectivas/sem</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-2xs">
              <div className="flex items-center justify-between text-outline mb-2">
                <span className="text-xs font-medium">Por Calificar</span>
                <span className="material-symbols-outlined text-amber-500 text-[20px]">rate_review</span>
              </div>
              <span className="text-2xl font-bold text-amber-600">18 Entregas</span>
              <p className="text-[11px] text-on-surface-variant mt-2">Laboratorio 01 y Foros</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-2xs">
              <div className="flex items-center justify-between text-outline mb-2">
                <span className="text-xs font-medium">Total de Alumnos</span>
                <span className="material-symbols-outlined text-secondary text-[20px]">groups</span>
              </div>
              <span className="text-2xl font-bold text-on-surface">142</span>
              <p className="text-[11px] text-on-surface-variant mt-2">En 4 secciones</p>
            </div>

            <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-2xs">
              <div className="flex items-center justify-between text-outline mb-2">
                <span className="text-xs font-medium">Promedio General</span>
                <span className="material-symbols-outlined text-tertiary text-[20px]">analytics</span>
              </div>
              <span className="text-2xl font-bold text-on-surface">16.4</span>
              <p className="text-[11px] text-emerald-600 font-semibold mt-2">89% aprobados</p>
            </div>
          </>
        )}
      </div>

      {/* Main Content Layout: Courses (Left 8 cols) & Side Panel (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Course Cards */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-on-surface">
                {isStudent ? 'Mis Asignaturas Matriculadas' : 'Cursos y Cátedras en Dictado'}
              </h2>
              <p className="text-xs text-on-surface-variant">
                Acceso directo a materiales, clases en vivo y evaluaciones
              </p>
            </div>
            <button
              onClick={() => onNavigate('course-detail')}
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todas</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header with Banner and Code */}
                  <div className="h-28 relative overflow-hidden bg-slate-800">
                    <img
                      src={course.bannerImage}
                      alt={course.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent p-3 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-slate-900 font-mono text-[11px] font-bold shadow-2xs">
                          {course.code}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-600/90 text-white text-[10px] font-semibold">
                          {course.credits} Créditos
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-white text-[11px]">
                        <span className="flex items-center gap-1 truncate font-medium">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {course.schedule.split(' ')[0]} {course.schedule.split(' ')[1]}
                        </span>
                        {course.currentAverage && (
                          <span className="font-bold bg-white/20 px-1.5 py-0.5 rounded text-[11px]">
                            Nota: {course.currentAverage}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="text-sm font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                        {course.name}
                      </h3>
                      <p className="text-xs text-on-surface-variant flex items-center gap-1.5 mt-1">
                        <span className="material-symbols-outlined text-[16px] text-outline">person</span>
                        <span>{course.professor}</span>
                      </p>
                    </div>

                    <div className="text-[11px] text-on-surface-variant flex items-center gap-2">
                      <span className="material-symbols-outlined text-[15px] text-outline">meeting_room</span>
                      <span>{course.classroom}</span>
                    </div>

                    {/* Progress Bar adhering to design system: 6px track height, surface #E2E8F0, fill #2563EB */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-on-surface-variant">Avance del Sílabo</span>
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
                <div className="p-3 bg-surface-container-low border-t border-[#E2E8F0] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectCourse(course)}
                    className="flex-1 py-2 px-3 rounded-lg bg-primary-container hover:bg-secondary text-white text-xs font-semibold shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Ingresar al Aula</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </button>
                  <a
                    href={course.virtualMeetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-9 h-9 rounded-lg bg-white hover:bg-surface-container border border-[#E2E8F0] text-primary flex items-center justify-center shadow-2xs transition-colors"
                    title="Sala Virtual en Vivo (Google Meet)"
                  >
                    <span className="material-symbols-outlined text-[18px]">video_camera_front</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Deadlines, Quick Meet & Campus Notices */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Meeting Shortcut */}
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-2xs">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px]">videocam</span>
              </div>
              <div>
                <h3 className="text-xs font-bold text-on-surface">Próxima Clase Síncrona</h3>
                <p className="text-[11px] text-on-surface-variant">Hoy a las 14:00 hrs</p>
              </div>
            </div>
            <p className="text-xs text-on-surface font-semibold mb-1">
              Metodología de la Investigación (INV-301)
            </p>
            <p className="text-[11px] text-on-surface-variant mb-3">
              Tema: Revisión de la Matriz PRISMA y Citas Scopus
            </p>
            <a
              href="https://meet.google.com/edu-core-inv301"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span>Unirse a la Sala Virtual</span>
            </a>
          </div>

          {/* Upcoming Academic Deadlines */}
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Próximas Evaluaciones
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                2 pendientes
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-2.5 rounded-lg border border-[#E2E8F0] bg-surface-container-low hover:bg-white transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-primary block">INF-402 • Laboratorio</span>
                    <p className="text-xs font-semibold text-on-surface mt-0.5">
                      Implementación de Patrón Hexagonal
                    </p>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 shrink-0">
                    2 días
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-on-surface-variant mt-2">
                  <span>Vence: 14 Septiembre, 23:59</span>
                  <button 
                    onClick={() => onNavigate('course-detail')}
                    className="text-primary font-semibold hover:underline"
                  >
                    Entregar ➔
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded-lg border border-[#E2E8F0] bg-surface-container-low hover:bg-white transition-colors">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-secondary block">INV-301 • Tarea Grupal</span>
                    <p className="text-xs font-semibold text-on-surface mt-0.5">
                      Revisión Sistemática de Literatura (SLR)
                    </p>
                  </div>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 shrink-0">
                    7 días
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-on-surface-variant mt-2">
                  <span>Vence: 22 Septiembre, 18:00</span>
                  <button 
                    onClick={() => onNavigate('course-detail')}
                    className="text-primary font-semibold hover:underline"
                  >
                    Ver detalles ➔
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Campus Notices */}
          <div className="bg-white rounded-xl p-4 border border-[#E2E8F0] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
                Avisos Universitarios
              </h3>
              <span className="material-symbols-outlined text-outline text-[18px]">campaign</span>
            </div>

            <div className="space-y-3">
              {notices.map((notice) => (
                <div key={notice.id} className="border-b border-[#E2E8F0] pb-2.5 last:border-0 last:pb-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      notice.important 
                        ? 'bg-red-50 text-red-700 border border-red-200' 
                        : 'bg-surface-container text-on-surface-variant'
                    }`}>
                      {notice.category}
                    </span>
                    <span className="text-[10px] text-outline">{notice.date}</span>
                  </div>
                  <h4 className="text-xs font-bold text-on-surface hover:text-primary transition-colors cursor-pointer">
                    {notice.title}
                  </h4>
                  <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">
                    {notice.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
