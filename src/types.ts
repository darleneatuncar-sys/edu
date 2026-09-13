export type UserRole = 'student' | 'faculty';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  faculty: string;
  program: string;
  studentCode?: string;
  facultyCode?: string;
  academicPeriod: string;
  gpa?: number;
  completedCredits?: number;
  totalCredits?: number;
  academicStanding?: string;
}

export interface RubricLevel {
  points: number;
  label: string; // e.g., "Sobresaliente", "Notable", "Aceptable", "Insuficiente"
  description: string;
}

export interface RubricCriterion {
  id: string;
  name: string;
  weightPercent: number;
  maxPoints: number;
  selectedLevelIndex?: number;
  levels: RubricLevel[];
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  dueDate: string;
  type: 'tarea' | 'laboratorio' | 'parcial' | 'final' | 'foro';
  weightPercent: number;
  score?: number;
  maxScore: number;
  status: 'pendiente' | 'entregado' | 'calificado';
  submittedAt?: string;
  rubric?: RubricCriterion[];
  instructions: string;
  feedback?: string;
}

export interface CourseModule {
  id: string;
  week: number;
  title: string;
  description: string;
  resources: {
    title: string;
    type: 'pdf' | 'video' | 'link' | 'code';
    durationOrSize?: string;
    url?: string;
  }[];
}

export interface Course {
  id: string;
  code: string;
  name: string;
  professor: string;
  professorEmail: string;
  credits: number;
  schedule: string;
  classroom: string;
  virtualMeetingUrl: string;
  progressPercent: number;
  currentAverage?: number;
  color: string;
  bannerImage: string;
  modules: CourseModule[];
  assignments: Assignment[];
}

export interface CampusNotice {
  id: string;
  title: string;
  date: string;
  category: 'Decanato' | 'Biblioteca' | 'Investigación' | 'Bienestar';
  summary: string;
  important?: boolean;
}

export interface ServiceRequest {
  id: string;
  type: string;
  date: string;
  status: 'Aprobado' | 'En Proceso' | 'Pendiente';
  trackingCode: string;
  documentName?: string;
}

export type ActiveScreen = 'login' | 'dashboard' | 'course-detail' | 'grades' | 'services';
