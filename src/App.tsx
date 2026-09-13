import React, { useState } from 'react';
import { ActiveScreen, Course, Assignment, UserRole, UserProfile } from './types';
import { mockStudentProfile, mockFacultyProfile, mockCourses, mockNotices, mockServiceRequests } from './data/mockData';
import { LoginScreen } from './components/LoginScreen';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardScreen } from './components/DashboardScreen';
import { CourseDetailScreen } from './components/CourseDetailScreen';
import { GradesScreen } from './components/GradesScreen';
import { ServicesScreen } from './components/ServicesScreen';
import { NotificationsModal } from './components/NotificationsModal';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('login');
  const [role, setRole] = useState<UserRole>('student');
  const [lang, setLang] = useState<'ES' | 'EN'>('ES');
  const [viewMode, setViewMode] = useState<'mobile' | 'responsive'>('mobile');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Selected Course for detail view
  const [selectedCourse, setSelectedCourse] = useState<Course>(mockCourses[0]);
  const [selectedAssignmentForRubric, setSelectedAssignmentForRubric] = useState<Assignment | null>(null);

  // User Profile based on role
  const user: UserProfile = role === 'student' ? mockStudentProfile : mockFacultyProfile;

  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
  };

  const handleLoginSuccess = (loginRole: UserRole) => {
    setRole(loginRole);
    setActiveScreen('dashboard');
  };

  const handleSelectCourse = (course: Course) => {
    setSelectedCourse(course);
    setActiveScreen('course-detail');
  };

  const handleOpenRubric = (asg: Assignment) => {
    setSelectedAssignmentForRubric(asg);
    setActiveScreen('grades');
  };

  const handleToggleLang = () => {
    setLang((prev) => (prev === 'ES' ? 'EN' : 'ES'));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0B1C30] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Experience Control Bar for switching screens and viewports */}
      <header className="sticky top-0 z-50 bg-[#0B1C30] text-white border-b border-slate-700/80 px-3 sm:px-4 py-2 text-xs shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
          {/* Brand & Active Screen indicator */}
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center text-white">
              <span className="material-symbols-outlined text-[14px]">school</span>
            </div>
            <span className="font-bold tracking-tight">EduCore • Selector de Pantallas</span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline px-2 py-0.5 rounded text-[11px] font-semibold bg-blue-900/80 text-blue-200 border border-blue-500/30">
              {activeScreen === 'login'
                ? 'Pantalla 1: Acceso Unificado'
                : activeScreen === 'dashboard'
                ? 'Pantalla 2: Campus Virtual'
                : activeScreen === 'course-detail'
                ? 'Pantalla 3: Aula Virtual'
                : activeScreen === 'grades'
                ? 'Pantalla 4: Calificaciones y Rúbricas'
                : 'Pantalla 5: Trámites y Servicios'}
            </span>
          </div>

          {/* Quick Screen Navigation Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setActiveScreen('login')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                activeScreen === 'login'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
              title="Pantalla exacta del diseño de login"
            >
              1. Login
            </button>
            <button
              onClick={() => setActiveScreen('dashboard')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                activeScreen === 'dashboard'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              2. Campus
            </button>
            <button
              onClick={() => setActiveScreen('course-detail')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                activeScreen === 'course-detail'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              3. Aula Virtual
            </button>
            <button
              onClick={() => setActiveScreen('grades')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                activeScreen === 'grades'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              4. Rúbricas
            </button>
            <button
              onClick={() => setActiveScreen('services')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                activeScreen === 'services'
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              5. Trámites
            </button>
          </div>

          {/* View Mode Toggle: Mobile mockup frame vs responsive fullscreen */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center p-0.5 bg-slate-800 rounded-lg border border-slate-700">
              <button
                onClick={() => setViewMode('mobile')}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'mobile'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Ver formato teléfono celular idéntico a la imagen"
              >
                <span className="material-symbols-outlined text-[14px]">smartphone</span>
                <span className="hidden md:inline">Móvil</span>
              </button>
              <button
                onClick={() => setViewMode('responsive')}
                className={`px-2 py-1 rounded text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === 'responsive'
                    ? 'bg-primary text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Ver formato responsivo de escritorio"
              >
                <span className="material-symbols-outlined text-[14px]">desktop_windows</span>
                <span className="hidden md:inline">Escritorio</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Primary Application Body */}
      <main className="flex-1 flex flex-col items-center justify-start w-full">
        {activeScreen === 'login' ? (
          // LOGIN SCREEN (Exact 1:1 match with user screenshot and HTML)
          viewMode === 'mobile' ? (
            <div className="w-full flex justify-center py-6 px-2 sm:px-4 bg-[#eff4ff]/60 flex-1">
              <div className="w-full max-w-[430px] bg-[#f8f9ff] rounded-3xl shadow-2xl border border-[#d3e4fe] overflow-hidden min-h-[884px] flex flex-col justify-between">
                {/* Mobile Device Status Bar simulation */}
                <div className="h-6 w-full bg-[#f8f9ff] flex items-center justify-between px-6 text-[10px] text-[#434655] font-semibold pt-1">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[13px]">signal_cellular_alt</span>
                    <span className="material-symbols-outlined text-[13px]">wifi</span>
                    <span className="material-symbols-outlined text-[14px]">battery_full</span>
                  </div>
                </div>

                <LoginScreen
                  lang={lang}
                  onToggleLang={handleToggleLang}
                  onLoginSuccess={handleLoginSuccess}
                />

                {/* Mobile Home Bar */}
                <div className="py-2 flex justify-center bg-[#f8f9ff]">
                  <div className="w-32 h-1 bg-slate-300 rounded-full"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full min-h-[90vh] flex items-center justify-center py-8 px-4 bg-[#f8f9ff]">
              <LoginScreen
                lang={lang}
                onToggleLang={handleToggleLang}
                onLoginSuccess={handleLoginSuccess}
              />
            </div>
          )
        ) : (
          // AUTHENTICATED LMS SCREENS (Dashboard, Course Detail, Grades & Rubrics, Services)
          viewMode === 'mobile' ? (
            <div className="w-full flex justify-center py-6 px-2 sm:px-4 bg-[#eff4ff]/60 flex-1">
              <div className="w-full max-w-[440px] bg-[#f8f9ff] rounded-3xl shadow-2xl border border-[#d3e4fe] overflow-hidden min-h-[884px] flex flex-col">
                {/* Mobile Device Status Bar simulation */}
                <div className="h-6 w-full bg-[#f8f9ff] flex items-center justify-between px-6 text-[10px] text-[#434655] font-semibold pt-1">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[13px]">signal_cellular_alt</span>
                    <span className="material-symbols-outlined text-[13px]">wifi</span>
                    <span className="material-symbols-outlined text-[14px]">battery_full</span>
                  </div>
                </div>

                {/* Mobile Header */}
                <div className="bg-white px-4 py-3 border-b border-[#E2E8F0] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-white">
                      <span className="material-symbols-outlined text-[20px] fill">school</span>
                    </div>
                    <div>
                      <span className="font-bold text-on-surface text-sm">EduCore</span>
                      <span className="text-[10px] text-outline block leading-none">2025-I</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRoleSwitch(role === 'student' ? 'faculty' : 'student')}
                      className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-primary"
                    >
                      {role === 'student' ? 'Estudiante' : 'Docente'}
                    </button>
                    <button
                      onClick={() => setActiveScreen('login')}
                      className="w-7 h-7 rounded-lg bg-surface-container-low text-error flex items-center justify-center"
                      title="Cerrar Sesión"
                    >
                      <span className="material-symbols-outlined text-[16px]">logout</span>
                    </button>
                  </div>
                </div>

                {/* Mobile Scrollable Viewport */}
                <div className="p-4 flex-1 overflow-y-auto no-scrollbar">
                  {activeScreen === 'dashboard' && (
                    <DashboardScreen
                      user={user}
                      courses={mockCourses}
                      notices={mockNotices}
                      onSelectCourse={handleSelectCourse}
                      onNavigate={(scr) => setActiveScreen(scr)}
                    />
                  )}
                  {activeScreen === 'course-detail' && (
                    <CourseDetailScreen
                      course={selectedCourse}
                      role={role}
                      onBack={() => setActiveScreen('dashboard')}
                      onOpenRubricForAssignment={handleOpenRubric}
                    />
                  )}
                  {activeScreen === 'grades' && (
                    <GradesScreen
                      courses={mockCourses}
                      role={role}
                      selectedAssignmentFromCourse={selectedAssignmentForRubric}
                    />
                  )}
                  {activeScreen === 'services' && (
                    <ServicesScreen
                      user={user}
                      requests={mockServiceRequests}
                    />
                  )}
                </div>

                {/* Mobile Bottom Tab Bar */}
                <div className="bg-white border-t border-[#E2E8F0] px-3 py-2 flex items-center justify-around">
                  <button
                    onClick={() => setActiveScreen('dashboard')}
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold cursor-pointer ${
                      activeScreen === 'dashboard' ? 'text-primary' : 'text-outline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">dashboard</span>
                    <span>Campus</span>
                  </button>
                  <button
                    onClick={() => setActiveScreen('course-detail')}
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold cursor-pointer ${
                      activeScreen === 'course-detail' ? 'text-primary' : 'text-outline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">menu_book</span>
                    <span>Cursos</span>
                  </button>
                  <button
                    onClick={() => setActiveScreen('grades')}
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold cursor-pointer ${
                      activeScreen === 'grades' ? 'text-primary' : 'text-outline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">grade</span>
                    <span>Notas</span>
                  </button>
                  <button
                    onClick={() => setActiveScreen('services')}
                    className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold cursor-pointer ${
                      activeScreen === 'services' ? 'text-primary' : 'text-outline'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px]">assignment_turned_in</span>
                    <span>Trámites</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Full Desktop Responsive Layout
            <div className="w-full flex flex-col min-h-screen">
              <Navbar
                user={user}
                onSwitchRole={handleRoleSwitch}
                onLogout={() => setActiveScreen('login')}
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
                  role={role}
                  isMobileMenuOpen={isMobileMenuOpen}
                  onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
                  onLogout={() => setActiveScreen('login')}
                />

                {/* Main Screen Content */}
                <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
                  {activeScreen === 'dashboard' && (
                    <DashboardScreen
                      user={user}
                      courses={mockCourses}
                      notices={mockNotices}
                      onSelectCourse={handleSelectCourse}
                      onNavigate={(scr) => setActiveScreen(scr)}
                    />
                  )}
                  {activeScreen === 'course-detail' && (
                    <CourseDetailScreen
                      course={selectedCourse}
                      role={role}
                      onBack={() => setActiveScreen('dashboard')}
                      onOpenRubricForAssignment={handleOpenRubric}
                    />
                  )}
                  {activeScreen === 'grades' && (
                    <GradesScreen
                      courses={mockCourses}
                      role={role}
                      selectedAssignmentFromCourse={selectedAssignmentForRubric}
                    />
                  )}
                  {activeScreen === 'services' && (
                    <ServicesScreen
                      user={user}
                      requests={mockServiceRequests}
                    />
                  )}
                </div>
              </div>
            </div>
          )
        )}
      </main>

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notices={mockNotices}
      />
    </div>
  );
}
