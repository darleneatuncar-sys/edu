// ==================== NEW TYPES (Backend) ====================

export type BackendRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: BackendRole;
  avatarUrl: string | null;
  createdAt: string;
}

// ==================== LEGACY TYPES (to be phased out) ====================

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
  label: string;
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
  category: string;
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

export type ActiveScreen = 'login' | 'dashboard' | 'course-detail' | 'course-editor' | 'grades' | 'services' | 'explore' | 'my-courses' | 'progress' | 'certificates' | 'profile';

// ==================== HELPER ====================

export function mapBackendRoleToLegacy(role: BackendRole): UserRole {
  return role === 'INSTRUCTOR' ? 'faculty' : 'student';
}

export function mapAuthToProfile(user: AuthUser): UserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: mapBackendRoleToLegacy(user.role),
    avatarUrl: user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    faculty: '',
    program: '',
    academicPeriod: '',
  };
}
