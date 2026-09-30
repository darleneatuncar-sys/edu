export type UserRole = 'student' | 'instructor' | 'admin';

export type CourseStatus = 'draft' | 'pending_review' | 'published' | 'rejected';

// ==================== STUDENT TYPES ====================

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string | null;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  instructorAvatar: string;
  bannerUrl: string;
  progressPercent: number;
  totalLessons: number;
  completedLessons: number;
  lastLesson: string | null;
  status: 'in_progress' | 'completed';
  completedAt?: string;
  category: string;
  enrolledCount: number;
  totalModules: number;
}

export interface ExploreCourse {
  id: string;
  title: string;
  description: string;
  instructor: string;
  bannerUrl: string;
  category: string;
  totalModules: number;
  enrolledCount: number;
  isEnrolled: boolean;
}

// ==================== INSTRUCTOR TYPES ====================

export interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'text' | 'pdf' | 'link';
  content?: string | null;
  duration?: string;
  order: number;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'OPEN_TEXT';
  points: number;
  order: number;
  options: QuizOption[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string | null;
  order: number;
  questions: QuizQuestion[];
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  quizzes?: Quiz[];
}

export interface InstructorCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  bannerUrl: string;
  status: CourseStatus;
  totalModules: number;
  totalLessons: number;
  enrolledCount: number;
  updatedAt: string;
  modules: Module[];
}

// ==================== ADMIN TYPES ====================

export type AdminUserStatus = 'active' | 'suspended';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: AdminUserStatus;
  registeredAt: string;
  avatarUrl: string | null;
}

export type RequestStatus = 'pending' | 'approved' | 'rejected';

export interface InstructorRequest {
  id: string;
  name: string;
  email: string;
  specialty: string;
  experience: string;
  requestDate: string;
  status: RequestStatus;
  rejectionReason?: string;
}

export type AdminCourseStatus = 'draft' | 'pending_review' | 'published' | 'rejected';
