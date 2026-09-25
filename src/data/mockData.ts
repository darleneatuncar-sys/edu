import { Course, CampusNotice, ServiceRequest, UserProfile } from '../types';

export const mockStudentProfile: UserProfile = {
  id: 'stu-001',
  name: 'Valeria Mendoza',
  email: 'valeria@email.com',
  role: 'student',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  faculty: '',
  program: '',
  academicPeriod: '',
  gpa: 0,
  completedCredits: 0,
  totalCredits: 0,
  academicStanding: ''
};

export const mockFacultyProfile: UserProfile = {
  id: 'fac-001',
  name: 'Carlos Arrieta',
  email: 'carlos@email.com',
  role: 'faculty',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  faculty: '',
  program: '',
  academicPeriod: '',
  academicStanding: ''
};

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    code: 'SW-101',
    name: 'Desarrollo Web Full Stack',
    professor: 'Carlos Arrieta',
    professorEmail: 'carlos@email.com',
    credits: 0,
    schedule: '',
    classroom: 'En línea',
    virtualMeetingUrl: '#',
    progressPercent: 68,
    color: '#2563eb',
    bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    modules: [
      {
        id: 'mod-1',
        week: 1,
        title: 'Módulo 1: Fundamentos de HTML y CSS',
        description: 'Aprende los fundamentos del desarrollo web con HTML5 y CSS3.',
        resources: [
          { title: 'Guía de HTML5 (PDF)', type: 'pdf', durationOrSize: '2.5 MB' },
          { title: 'Video: Introducción a CSS', type: 'video', durationOrSize: '45 min' },
          { title: 'Práctica: Tu primera página web', type: 'link' }
        ]
      },
      {
        id: 'mod-2',
        week: 2,
        title: 'Módulo 2: JavaScript Moderno',
        description: 'Domina ES6+, async/await y programación funcional.',
        resources: [
          { title: 'Manual JavaScript (PDF)', type: 'pdf', durationOrSize: '4.2 MB' },
          { title: 'Repositorio de ejercicios (GitHub)', type: 'code', durationOrSize: 'JavaScript' },
          { title: 'Video: Async/Await', type: 'video', durationOrSize: '1h 10min' }
        ]
      },
      {
        id: 'mod-3',
        week: 3,
        title: 'Módulo 3: React y Componentes',
        description: 'Construye interfaces modernas con React y hooks.',
        resources: [
          { title: 'Guía de React (PDF)', type: 'pdf', durationOrSize: '3.8 MB' },
          { title: 'Proyecto: CRUD con React', type: 'code', durationOrSize: 'React / TypeScript' }
        ]
      }
    ],
    assignments: [
      {
        id: 'asg-1',
        courseId: 'course-1',
        title: 'Proyecto: Página Web Personal',
        dueDate: '20 de Septiembre',
        type: 'tarea',
        weightPercent: 30,
        score: 18,
        maxScore: 20,
        status: 'calificado',
        submittedAt: '18 de Septiembre',
        feedback: 'Excelente diseño y estructura.',
        instructions: 'Crea una página web personal utilizando HTML5, CSS3 y JavaScript.',
        rubric: [
          {
            id: 'crit-1',
            name: 'Diseño y Estructura',
            weightPercent: 50,
            maxPoints: 10,
            selectedLevelIndex: 0,
            levels: [
              { points: 10, label: 'Excelente', description: 'Diseño moderno y responsive.' },
              { points: 7, label: 'Bueno', description: 'Buen diseño con mejoras menores.' },
              { points: 5, label: 'Aceptable', description: 'Cumple lo básico.' },
              { points: 2, label: 'Mejorable', description: 'Necesita mejoras significativas.' }
            ]
          },
          {
            id: 'crit-2',
            name: 'Funcionalidad JavaScript',
            weightPercent: 50,
            maxPoints: 10,
            selectedLevelIndex: 0,
            levels: [
              { points: 10, label: 'Excelente', description: 'Interactividad completa.' },
              { points: 7, label: 'Bueno', description: 'Funcional con algunos errores.' },
              { points: 5, label: 'Aceptable', description: 'Funcionalidad básica.' },
              { points: 2, label: 'Mejorable', description: 'Funcionalidad limitada.' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'course-2',
    code: 'PY-201',
    name: 'Python para Ciencia de Datos',
    professor: 'María López',
    professorEmail: 'maria@email.com',
    credits: 0,
    schedule: '',
    classroom: 'En línea',
    virtualMeetingUrl: '#',
    progressPercent: 45,
    color: '#006242',
    bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    modules: [
      {
        id: 'mod-py-1',
        week: 1,
        title: 'Módulo 1: Fundamentos de Python',
        description: 'Variables, bucles, funciones y estructuras de datos.',
        resources: [
          { title: 'Manual Python Básico (PDF)', type: 'pdf', durationOrSize: '3.1 MB' },
          { title: 'Video: Primeros pasos', type: 'video', durationOrSize: '1h' }
        ]
      }
    ],
    assignments: []
  },
  {
    id: 'course-3',
    code: 'UX-301',
    name: 'Diseño UX/UI Profesional',
    professor: 'Ana García',
    professorEmail: 'ana@email.com',
    credits: 0,
    schedule: '',
    classroom: 'En línea',
    virtualMeetingUrl: '#',
    progressPercent: 72,
    color: '#4069f2',
    bannerImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format&fit=crop&q=80',
    modules: [],
    assignments: []
  },
  {
    id: 'course-4',
    code: 'DB-401',
    name: 'Bases de Datos y SQL',
    professor: 'Roberto Sánchez',
    professorEmail: 'roberto@email.com',
    credits: 0,
    schedule: '',
    classroom: 'En línea',
    virtualMeetingUrl: '#',
    progressPercent: 60,
    color: '#007d55',
    bannerImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
    modules: [],
    assignments: []
  }
];

export const mockNotices: CampusNotice[] = [
  {
    id: 'not-1',
    title: 'Nuevos cursos disponibles este mes',
    date: 'Hoy',
    category: 'Plataforma',
    summary: 'Se han agregado 5 cursos nuevos en tecnología y diseño.',
    important: true
  },
  {
    id: 'not-2',
    title: 'Actualización del sistema',
    date: 'Ayer',
    category: 'Sistema',
    summary: 'Mejoras en la velocidad y experiencia de usuario.',
    important: false
  },
  {
    id: 'not-3',
    title: 'Certificados de finalización',
    date: '10 de Septiembre',
    category: 'Logros',
    summary: 'Ya puedes descargar tus certificados al completar un curso.',
    important: false
  }
];

export const mockServiceRequests: ServiceRequest[] = [
  {
    id: 'req-1',
    type: 'Curso completado',
    date: '11/09/2025',
    status: 'Aprobado',
    trackingCode: 'CERT-001',
    documentName: 'Certificado_HTML_CSS.pdf'
  },
  {
    id: 'req-2',
    type: 'Solicitud de reembolso',
    date: '13/09/2025',
    status: 'En Proceso',
    trackingCode: 'REF-002'
  }
];
