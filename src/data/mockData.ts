import { Course, CampusNotice, ServiceRequest, UserProfile } from '../types';

export const mockStudentProfile: UserProfile = {
  id: 'stu-20210452',
  name: 'Valeria Mendoza Arriaga',
  email: 'vmendoza@universidad.edu',
  role: 'student',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  faculty: 'Facultad de Ingeniería y Arquitectura',
  program: 'Ingeniería de Software y Sistemas',
  studentCode: '20210452',
  academicPeriod: 'Período 2025-I',
  gpa: 17.65,
  completedCredits: 168,
  totalCredits: 210,
  academicStanding: 'Décimo Superior (Top 5%)'
};

export const mockFacultyProfile: UserProfile = {
  id: 'fac-98214',
  name: 'Dr. Carlos Arrieta Morales',
  email: 'carrieta@facultad.edu',
  role: 'faculty',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  faculty: 'Facultad de Ciencias e Ingeniería',
  program: 'Departamento Académico de Computación',
  facultyCode: 'DOC-98214',
  academicPeriod: 'Período 2025-I',
  academicStanding: 'Profesor Principal e Investigador RENACYT'
};

export const mockCourses: Course[] = [
  {
    id: 'inf-402',
    code: 'INF-402',
    name: 'Arquitectura de Software y Sistemas Distribuidos',
    professor: 'Dr. Andrés Valdivia',
    professorEmail: 'avaldivia@universidad.edu',
    credits: 4,
    schedule: 'Mar y Jue 08:00 - 10:00',
    classroom: 'Pabellón B - Aula 402',
    virtualMeetingUrl: 'https://meet.google.com/edu-core-inf402',
    progressPercent: 68,
    currentAverage: 18.2,
    color: '#2563eb',
    bannerImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    modules: [
      {
        id: 'mod-1',
        week: 1,
        title: 'Semana 01: Fundamentos y Drivers Arquitectónicos',
        description: 'Atributos de calidad (ISO 25010), escenarios de arquitectura y diseño orientado a escalabilidad.',
        resources: [
          { title: 'Diapositivas de la Sesión (PDF)', type: 'pdf', durationOrSize: '4.2 MB' },
          { title: 'Grabación de la Cátedra Virtual', type: 'video', durationOrSize: '1h 45m' },
          { title: 'Lectura: Bass, Clements & Kazman Cap. 2 y 4', type: 'link' }
        ]
      },
      {
        id: 'mod-2',
        week: 2,
        title: 'Semana 02: Patrones Arquitectónicos y Microservicios',
        description: 'Clean Architecture, Hexagonal, Event-Driven Architecture y comunicación asíncrona mediante colas.',
        resources: [
          { title: 'Patrones Microservicios y DDD (PDF)', type: 'pdf', durationOrSize: '6.8 MB' },
          { title: 'Repositorio Base de Laboratorio (GitHub)', type: 'code', durationOrSize: 'Kotlin / TypeScript' },
          { title: 'Grabación Sesión Práctica en Vivo', type: 'video', durationOrSize: '1h 30m' }
        ]
      },
      {
        id: 'mod-3',
        week: 3,
        title: 'Semana 03: Despliegue en Cloud y Orquestación con Kubernetes',
        description: 'Contenedores Docker, manifiestos K8s, ingress controllers y observabilidad con Prometheus.',
        resources: [
          { title: 'Guía de Despliegue en Cloud (PDF)', type: 'pdf', durationOrSize: '3.1 MB' },
          { title: 'Laboratorio Evaluado 02 - Instrucciones', type: 'pdf', durationOrSize: '1.5 MB' }
        ]
      }
    ],
    assignments: [
      {
        id: 'asg-1',
        courseId: 'inf-402',
        title: 'Laboratorio 01: Implementación de Patrón Hexagonal',
        dueDate: '14 de Septiembre, 23:59',
        type: 'laboratorio',
        weightPercent: 15,
        score: 19,
        maxScore: 20,
        status: 'calificado',
        submittedAt: '13 de Septiembre, 21:14',
        feedback: 'Excelente separación de capas en el núcleo de dominio y adaptadores de infraestructura.',
        instructions: 'Desarrollar una API REST desacoplada implementando puertos y adaptadores con pruebas unitarias que cubran al menos el 85% de cobertura de código.',
        rubric: [
          {
            id: 'crit-1',
            name: 'Modularidad y Dominio Hexagonal',
            weightPercent: 40,
            maxPoints: 8,
            selectedLevelIndex: 0,
            levels: [
              { points: 8, label: 'Sobresaliente', description: 'Entidades y Casos de Uso totalmente independientes de frameworks y BD.' },
              { points: 6, label: 'Notable', description: 'Leve acoplamiento en un puerto secundario pero con correcta abstracción.' },
              { points: 4, label: 'Aceptable', description: 'Arquitectura por capas básica pero no cumple plenamente hexagonal.' },
              { points: 1, label: 'Insuficiente', description: 'Lógica de negocio mezclada con controladores y modelos de BD.' }
            ]
          },
          {
            id: 'crit-2',
            name: 'Pruebas Unitarias y Cobertura',
            weightPercent: 35,
            maxPoints: 7,
            selectedLevelIndex: 0,
            levels: [
              { points: 7, label: 'Sobresaliente', description: 'Cobertura superior al 85% con mocks y aserciones rigurosas.' },
              { points: 5, label: 'Notable', description: 'Cobertura entre 70% y 84% con pruebas funcionales.' },
              { points: 3, label: 'Aceptable', description: 'Pruebas básicas con cobertura inferior al 60%.' },
              { points: 0, label: 'Insuficiente', description: 'Sin pruebas automatizadas en la entrega.' }
            ]
          },
          {
            id: 'crit-3',
            name: 'Documentación y Diagramas C4',
            weightPercent: 25,
            maxPoints: 5,
            selectedLevelIndex: 1,
            levels: [
              { points: 5, label: 'Sobresaliente', description: 'Diagramas Contexto, Contenedor y Componentes completos en PlantUML.' },
              { points: 4, label: 'Notable', description: 'Diagramas claros con leves omisiones en puertos de integración.' },
              { points: 2, label: 'Aceptable', description: 'Diagrama de bloques genérico sin estándar formal.' },
              { points: 0, label: 'Insuficiente', description: 'Sin documentación arquitectónica.' }
            ]
          }
        ]
      },
      {
        id: 'asg-2',
        courseId: 'inf-402',
        title: 'Proyecto Parcial: Plataforma de Microservicios con Kafka',
        dueDate: '20 de Septiembre, 23:59',
        type: 'parcial',
        weightPercent: 25,
        maxScore: 20,
        status: 'pendiente',
        instructions: 'Entrega grupal (máximo 3 integrantes). Configurar arquitectura EDA (Event-Driven) con Apache Kafka, motor de autenticación JWT y persistencia políglota.',
        rubric: [
          {
            id: 'crit-p1',
            name: 'Diseño Event-Driven & Consistencia Eventual',
            weightPercent: 40,
            maxPoints: 8,
            selectedLevelIndex: 0,
            levels: [
              { points: 8, label: 'Sobresaliente', description: 'Tópicos bien segmentados, particionamiento idóneo y manejo de idempotencia.' },
              { points: 6, label: 'Notable', description: 'Arquitectura EDA funcional con manejo básico de fallos en colas.' },
              { points: 3, label: 'Aceptable', description: 'Productor y consumidor básicos sin garantía de orden ni reintentos.' },
              { points: 0, label: 'Insuficiente', description: 'No utiliza eventos asíncronos reales.' }
            ]
          },
          {
            id: 'crit-p2',
            name: 'Containerización e Infraestructura Cloud',
            weightPercent: 35,
            maxPoints: 7,
            selectedLevelIndex: 0,
            levels: [
              { points: 7, label: 'Sobresaliente', description: 'Docker Compose y manifiestos Helm listos para producción.' },
              { points: 5, label: 'Notable', description: 'Contenedores funcionales con variables de entorno parametrizadas.' },
              { points: 2, label: 'Aceptable', description: 'Imágenes pesadas o sin multistage build.' },
              { points: 0, label: 'Insuficiente', description: 'Falla al compilar o levantar contenedores.' }
            ]
          },
          {
            id: 'crit-p3',
            name: 'Sustentación y Calidad de Código',
            weightPercent: 25,
            maxPoints: 5,
            selectedLevelIndex: 0,
            levels: [
              { points: 5, label: 'Sobresaliente', description: 'Defensa sólida de decisiones de arquitectura y métricas de latencia.' },
              { points: 4, label: 'Notable', description: 'Buena sustentación con dudas puntuales en tolerancia a fallos.' },
              { points: 2, label: 'Aceptable', description: 'Respuestas vagas sobre escalabilidad.' },
              { points: 0, label: 'Insuficiente', description: 'No demuestra dominio del código presentado.' }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'inv-301',
    code: 'INV-301',
    name: 'Metodología de la Investigación Científica',
    professor: 'Dra. Elena Ramos',
    professorEmail: 'eramos@universidad.edu',
    credits: 3,
    schedule: 'Mié 14:00 - 17:00',
    classroom: 'Pabellón A - Laboratorio 201',
    virtualMeetingUrl: 'https://meet.google.com/edu-core-inv301',
    progressPercent: 55,
    currentAverage: 17.5,
    color: '#006242',
    bannerImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&auto=format&fit=crop&q=80',
    modules: [
      {
        id: 'mod-inv-1',
        week: 1,
        title: 'Semana 01: El Problema de Investigación y Estado del Arte',
        description: 'Búsqueda sistemática en IEEE Xplore, Scopus y Web of Science. Declaración de preguntas e hipótesis.',
        resources: [
          { title: 'Matriz de Consistencia Científica (XLSX)', type: 'link' },
          { title: 'Guía de Redacción Estilo IEEE / APA (PDF)', type: 'pdf', durationOrSize: '2.5 MB' }
        ]
      }
    ],
    assignments: [
      {
        id: 'asg-inv-1',
        courseId: 'inv-301',
        title: 'Entrega 01: Revisión Sistemática de Literatura (SLR)',
        dueDate: '22 de Septiembre, 18:00',
        type: 'tarea',
        weightPercent: 20,
        score: 18,
        maxScore: 20,
        status: 'calificado',
        instructions: 'Presentación formal de la matriz PRISMA y selección de 25 artículos indexados Q1/Q2.',
        feedback: 'Excelente selección de fuentes indexadas y síntesis crítica de los hallazgos.'
      }
    ]
  },
  {
    id: 'ia-505',
    code: 'IA-505',
    name: 'Inteligencia Artificial y Redes Neuronales Profundas',
    professor: 'Mg. Roberto Huamán',
    professorEmail: 'rhuaman@universidad.edu',
    credits: 4,
    schedule: 'Lun y Mié 10:00 - 12:00',
    classroom: 'Pabellón C - Centro de Cómputo 03',
    virtualMeetingUrl: 'https://meet.google.com/edu-core-ia505',
    progressPercent: 72,
    currentAverage: 19.0,
    color: '#4069f2',
    bannerImage: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&auto=format&fit=crop&q=80',
    modules: [],
    assignments: []
  },
  {
    id: 'seg-410',
    code: 'SEG-410',
    name: 'Ciberseguridad y Auditoría de Sistemas',
    professor: 'Ing. Sofía Benavides',
    professorEmail: 'sbenavides@universidad.edu',
    credits: 3,
    schedule: 'Vie 15:00 - 19:00',
    classroom: 'Pabellón B - Aula Magna 101',
    virtualMeetingUrl: 'https://meet.google.com/edu-core-seg410',
    progressPercent: 60,
    currentAverage: 16.8,
    color: '#007d55',
    bannerImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    modules: [],
    assignments: []
  },
  {
    id: 'ges-350',
    code: 'GES-350',
    name: 'Gestión de Proyectos Tecnológicos y Scrum',
    professor: 'Lic. Marco Antonio Cárdenas',
    professorEmail: 'mcardenas@universidad.edu',
    credits: 3,
    schedule: 'Jue 16:00 - 19:00',
    classroom: 'Pabellón A - Aula 304',
    virtualMeetingUrl: 'https://meet.google.com/edu-core-ges350',
    progressPercent: 80,
    currentAverage: 18.0,
    color: '#2563eb',
    bannerImage: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&auto=format&fit=crop&q=80',
    modules: [],
    assignments: []
  }
];

export const mockNotices: CampusNotice[] = [
  {
    id: 'not-1',
    title: 'Convocatoria a Movilidad Académica Internacional 2025-II',
    date: 'Hace 2 horas',
    category: 'Decanato',
    summary: 'Se encuentran abiertas las postulaciones para intercambio estudiantil en universidades de la Red Alianza del Pacífico y Europa.',
    important: true
  },
  {
    id: 'not-2',
    title: 'Acceso Remoto a Bases de Datos IEEE Xplore y ScienceDirect',
    date: 'Ayer',
    category: 'Biblioteca',
    summary: 'La autenticación mediante el correo institucional permite descarga ilimitada de papers científicos desde cualquier red.',
    important: false
  },
  {
    id: 'not-3',
    title: 'Talleres de Asesoría en Tesis y Normas de Publicación',
    date: '10 de Septiembre',
    category: 'Investigación',
    summary: 'Seminario híbrido para tesistas de pregrado y maestría sobre estructuración de manuscritos para revistas Q1/Q2.',
    important: false
  }
];

export const mockServiceRequests: ServiceRequest[] = [
  {
    id: 'req-1',
    type: 'Constancia de Matrícula Digital Oficial',
    date: '11/09/2025',
    status: 'Aprobado',
    trackingCode: 'EXP-2025-08492',
    documentName: 'Constancia_Matricula_2025-1_Firmada.pdf'
  },
  {
    id: 'req-2',
    type: 'Reserva de Cubículo de Estudio Grupal (Biblioteca)',
    date: '13/09/2025',
    status: 'Aprobado',
    trackingCode: 'BIB-RES-4410',
    documentName: 'Pabellón Central - Sala 4B (14:00 - 16:00)'
  },
  {
    id: 'req-3',
    type: 'Renovación de Carné Universitario Digital',
    date: '08/09/2025',
    status: 'En Proceso',
    trackingCode: 'SEC-CARNE-9912'
  }
];
