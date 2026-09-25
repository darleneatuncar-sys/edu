import React, { useState, useEffect } from 'react';
import { ActiveScreen, Course, Assignment } from './types';
import { useAuth } from './useAuth';
import * as api from './api';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardScreen } from './components/DashboardScreen';
import { CourseDetailScreen } from './components/CourseDetailScreen';
import { GradesScreen } from './components/GradesScreen';
import { ServicesScreen } from './components/ServicesScreen';
import { NotificationsModal } from './components/NotificationsModal';
import { InstructorCourseEditor } from './components/instructor/InstructorCourseEditor';

// Legacy mock notices for notifications
const mockNotices = [
  { id: 'not-1', title: 'Nuevos cursos disponibles', date: 'Hoy', category: 'Plataforma', summary: 'Se han agregado cursos nuevos.', important: true },
  { id: 'not-2', title: 'Actualización del sistema', date: 'Ayer', category: 'Sistema', summary: 'Mejoras en la plataforma.', important: false },
];

export default function App() {
  const { user, loading, isAuthenticated, logout } = useAuth();

  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('login');
  const [lang, setLang] = useState<'ES' | 'EN'>('ES');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Course state
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [myCourses, setMyCourses] = useState<api.MyCourse[]>([]);
  const [allCourses, setAllCourses] = useState<api.Course[]>([]);
  const [selectedAssignmentForRubric, setSelectedAssignmentForRubric] = useState<any>(null);
  const [enrollingCourseId, setEnrollingCourseId] = useState<string | null>(null);

  // Load courses when authenticated
  useEffect(() => {
    if (isAuthenticated && activeScreen !== 'login') {
      loadCourses();
    }
  }, [isAuthenticated, activeScreen]);

  const loadCourses = async () => {
    try {
      const [my, all] = await Promise.all([
        api.getMyCourses().catch(() => []),
        api.getCourses().catch(() => []),
      ]);
      setMyCourses(my);
      setAllCourses(all);
    } catch (err) {
      console.error('Error loading courses:', err);
    }
  };

  const handleEnroll = async (courseId: string) => {
    setEnrollingCourseId(courseId);
    try {
      await api.enrollInCourse(courseId);
      // Refresh both lists
      await loadCourses();
    } catch (err: any) {
      console.error('Enrollment error:', err);
      alert(err.message || 'Error al inscribirse');
    } finally {
      setEnrollingCourseId(null);
    }
  };

  const handleLoginSuccess = (userData: any) => {
    setActiveScreen('dashboard');
  };

  const handleSelectCourse = (course: any) => {
    setSelectedCourse(course);
    setActiveScreen('course-detail');
  };

  const handleOpenRubric = (asg: any) => {
    setSelectedAssignmentForRubric(asg);
    setActiveScreen('grades');
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ES' ? 'EN' : 'ES'));
  };

  const handleLogout = () => {
    logout();
    setActiveScreen('login');
    setMyCourses([]);
    setAllCourses([]);
    setSelectedCourse(null);
  };

  // Show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <span className="material-symbols-outlined animate-spin text-[32px] text-primary-container">progress_activity</span>
          <p className="text-sm text-on-surface-variant">Cargando...</p>
        </div>
      </div>
    );
  }

  // Map backend role to legacy format for components that still use it
  const legacyRole = user?.role === 'INSTRUCTOR' ? 'faculty' : 'student';

  // Build user profile for components that need it
  const userProfile = user ? {
    id: user.id,
    name: user.name,
    email: user.email,
    role: legacyRole as 'student' | 'faculty',
    avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    faculty: '',
    program: '',
    academicPeriod: '',
  } : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1C30] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-[#0B1C30] text-white border-b border-slate-700/80 px-3 sm:px-4 py-2 text-xs shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[14px]">school</span>
            </div>
            <span className="font-bold tracking-tight">EduCore</span>
          </div>

{/* Quick Screen Navigation */}
  {isAuthenticated && (
    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
      <button
        onClick={() => setActiveScreen('dashboard')}
        className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
          activeScreen === 'dashboard'
            ? 'bg-primary text-white shadow-xs'
            : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
        }`}
      >
        Dashboard
      </button>
      <button
        onClick={() => setActiveScreen('my-courses')}
        className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
          activeScreen === 'my-courses'
            ? 'bg-primary text-white shadow-xs'
            : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
        }`}
      >
        Mis Cursos
      </button>
      {['INSTRUCTOR', 'ADMIN'].includes(user?.role ?? '') && (
        <button
          onClick={() => setActiveScreen('course-editor')}
          className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
            activeScreen === 'course-editor'
              ? 'bg-primary text-white shadow-xs'
              : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
          }`}
        >
          <span className="material-symbols-outlined text-[14px]">folder</span>
          Editor
        </button>
      )}
      <button
        onClick={() => setActiveScreen('explore')}
        className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
          activeScreen === 'explore'
            ? 'bg-primary text-white shadow-xs'
            : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
        }`}
      >
        Explorar
      </button>
</div>
  )}
  </div>
  </header>
      
      {/* Primary Application Body */}
      <main className="flex-1 flex flex-col items-center justify-start w-full">
        {!isAuthenticated ? (
          <div className="w-full min-h-[90vh] flex items-center justify-center py-8 px-4 bg-[#f8f9ff]">
            <LoginScreen
              lang={lang}
              onToggleLang={handleToggleLang}
              onLoginSuccess={handleLoginSuccess}
            />
          </div>
        ) : (
          // AUTHENTICATED LMS SCREENS
          <div className="w-full flex flex-col min-h-screen">
            <Navbar
              user={userProfile!}
              onLogout={handleLogout}
              lang={lang}
              onToggleLang={handleToggleLang}
              onOpenNotifications={() => setIsNotificationsOpen(true)}
              unreadCount={mockNotices.length}
            />

            <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col lg:flex-row">
              {/* 260px Sidebar */}
              <Sidebar
                activeScreen={activeScreen}
                onNavigate={(screen) => setActiveScreen(screen)}
                userRole={user?.role || 'STUDENT'}
                isMobileMenuOpen={isMobileMenuOpen}
                onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
                onLogout={handleLogout}
                userName={user?.name || ''}
              />

              {/* Main Screen Content */}
              <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
                {activeScreen === 'dashboard' && (
                  <DashboardScreen
                    user={userProfile!}
                    myCourses={myCourses}
                    onSelectCourse={handleSelectCourse}
                    onNavigate={(scr) => setActiveScreen(scr)}
                  />
                )}
                {activeScreen === 'my-courses' && (
                  <div className="space-y-6 pb-12">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">Mis Cursos</h1>
                      <p className="text-xs sm:text-sm text-on-surface-variant mt-1">Cursos en los que estás inscrito</p>
                    </div>
                    {myCourses.length === 0 ? (
                      <div className="bg-white rounded-xl p-8 border border-[#E2E8F0] shadow-2xs text-center">
                        <span className="material-symbols-outlined text-[48px] text-outline mb-3">school</span>
                        <h3 className="text-base font-bold text-on-surface mb-1">Todavía no estás inscrito en ningún curso</h3>
                        <p className="text-xs text-on-surface-variant mb-4">Explora nuestros cursos para comenzar a aprender.</p>
                        <button
                          onClick={() => setActiveScreen('explore')}
                          className="px-4 py-2 rounded-lg bg-primary-container text-white text-xs font-semibold hover:bg-secondary transition-colors"
                        >
                          Explorar cursos
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {myCourses.map((course) => (
                          <div
                            key={course.id}
                            className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-2xs hover:shadow-md transition-all cursor-pointer"
                            onClick={() => handleSelectCourse(course)}
                          >
                            <div className="h-32 relative overflow-hidden bg-slate-800">
                              {course.bannerUrl && (
                                <img src={course.bannerUrl} alt={course.title} className="w-full h-full object-cover opacity-80" />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent p-3 flex flex-col justify-end">
                                <h3 className="text-sm font-bold text-white line-clamp-1">{course.title}</h3>
                                <p className="text-[11px] text-slate-200">{course.instructor.name}</p>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between text-[11px] mb-1">
                                <span className="text-on-surface-variant">Progreso</span>
                                <span className="font-bold text-primary">{course.progressPercent}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                                <div className="h-full bg-primary-container rounded-full" style={{ width: `${course.progressPercent}%` }}></div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {activeScreen === 'explore' && (
                  <div className="space-y-6 pb-12">
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">Explorar Cursos</h1>
                      <p className="text-xs sm:text-sm text-on-surface-variant mt-1">Descubre cursos para aprender algo nuevo</p>
                    </div>
                    {allCourses.length === 0 ? (
                      <div className="bg-white rounded-xl p-8 border border-[#E2E8F0] shadow-2xs text-center">
                        <span className="material-symbols-outlined text-[48px] text-outline mb-3">explore</span>
                        <h3 className="text-base font-bold text-on-surface mb-1">No hay cursos disponibles</h3>
                        <p className="text-xs text-on-surface-variant">Vuelve pronto para ver nuevos cursos.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {allCourses.map((course) => {
                          const isEnrolled = myCourses.some(mc => mc.id === course.id);
                          const isEnrolling = enrollingCourseId === course.id;
                          return (
                            <div
                              key={course.id}
                              className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col"
                            >
                              <div className="h-36 relative overflow-hidden bg-slate-800">
                                {course.bannerUrl && (
                                  <img src={course.bannerUrl} alt={course.title} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
                                )}
                                {course.category && (
                                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-white/90 text-[10px] font-bold text-primary">
                                    {course.category.name}
                                  </span>
                                )}
                                {isEnrolled && (
                                  <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[12px]">check</span>
                                    Inscrito
                                  </span>
                                )}
                              </div>
                              <div className="p-4 flex-1 flex flex-col">
                                <h3 className="text-sm font-bold text-on-surface line-clamp-2 mb-1">{course.title}</h3>
                                <p className="text-[11px] text-on-surface-variant mb-2">{course.instructor.name}</p>
                                <p className="text-[11px] text-on-surface-variant line-clamp-2 flex-1">{course.description}</p>
                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E2E8F0]">
                                  <span className="text-[11px] text-outline">{course.totalModules} módulos</span>
                                  <span className="text-[11px] text-outline">{course.enrolledCount} inscritos</span>
                                </div>
                                <div className="mt-3">
                                  {isEnrolled ? (
                                    <button
                                      onClick={() => handleSelectCourse(course)}
                                      className="w-full py-2 px-3 rounded-lg bg-primary-container text-white text-xs font-semibold hover:bg-secondary transition-colors flex items-center justify-center gap-1.5"
                                    >
                                      <span>Ir al curso</span>
                                      <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => handleEnroll(course.id)}
                                      disabled={isEnrolling}
                                      className="w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
                                    >
                                      {isEnrolling ? (
                                        <>
                                          <span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>
                                          <span>Inscribiendo...</span>
                                        </>
                                      ) : (
                                        <>
                                          <span className="material-symbols-outlined text-[14px]">add_circle</span>
                                          <span>Inscribirse</span>
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
                {activeScreen === 'course-detail' && selectedCourse && (
                  <CourseDetailScreen
                    course={selectedCourse}
                    role={legacyRole}
                    onBack={() => setActiveScreen('dashboard')}
                    onOpenRubricForAssignment={handleOpenRubric}
                  />
                )}
                {activeScreen === 'grades' && (
                  <GradesScreen
                    courses={myCourses as any}
                    role={legacyRole}
                    selectedAssignmentFromCourse={selectedAssignmentForRubric}
                  />
                )}
                {activeScreen === 'course-editor' && selectedCourse && (
                  <InstructorCourseEditor
                    initialCourseId={selectedCourse.id}
                  />
                )}
                {activeScreen === 'services' && (
                  <ServicesScreen
                    user={userProfile!}
                    requests={[]}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notices={mockNotices as any}
      />
    </div>
  );
}
