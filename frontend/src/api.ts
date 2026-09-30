const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

// ==================== TYPES ====================

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  avatarUrl: string | null;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
}

export interface Course {
  id: string;
  title: string;
  description: string | null;
  bannerUrl: string | null;
  isPublished: boolean;
  instructor: { id: string; name: string; email: string };
  category: { id: string; name: string; slug: string } | null;
  categoryId: string | null;
  modules: Module[];
  enrolledCount: number;
  totalModules: number;
  totalLessons: number;
  createdAt: string;
}

export interface CourseDetail extends Course {
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: Lesson[];
  quizzes?: Quiz[];
}

export interface Lesson {
  id: string;
  title: string;
  type: 'VIDEO' | 'TEXT' | 'PDF' | 'LINK';
  content: string | null;
  videoUrl: string | null;
  duration: number | null;
  order: number;
}

export interface MyCourse extends Course {
  enrolledAt: string;
  completedLessons: number;
  progressPercent: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  _count: { courses: number };
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
  moduleId: string;
  questions: QuizQuestion[];
}

// ==================== API CLIENT ====================

function getToken(): string | null {
  return localStorage.getItem('educore_token');
}

function setToken(token: string): void {
  localStorage.setItem('educore_token', token);
}

function removeToken(): void {
  localStorage.removeItem('educore_token');
  localStorage.removeItem('educore_user');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica que el servidor esté corriendo.');
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new Error('El servidor devolvió una respuesta inválida.');
  }

  if (!response.ok) {
    throw new Error(data.error || 'Error en la solicitud');
  }

  return data as T;
}

// ==================== AUTH API ====================

export async function register(name: string, email: string, password: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  setToken(data.token);
  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

export async function getMe(): Promise<AuthUser> {
  return request<AuthUser>('/api/auth/me');
}

export function logout(): void {
  removeToken();
}

export function isAuthenticated(): boolean {
  return getToken() !== null;
}

// ==================== COURSES API ====================

export async function getCourses(): Promise<Course[]> {
  return request<Course[]>('/api/courses');
}

export async function getCourseById(id: string): Promise<CourseDetail> {
  return request<CourseDetail>(`/api/courses/${id}`);
}

export async function enrollInCourse(courseId: string): Promise<any> {
  return request(`/api/courses/${courseId}/enroll`, { method: 'POST' });
}

export async function getMyCourses(): Promise<MyCourse[]> {
  return request<MyCourse[]>('/api/my-courses');
}

// ==================== PROGRESS API ====================

export async function markLessonCompleted(lessonId: string): Promise<any> {
  return request(`/api/progress/${lessonId}`, { method: 'PUT' });
}

export async function getCourseProgress(courseId: string): Promise<any[]> {
  return request(`/api/progress/course/${courseId}`);
}

// ==================== CATEGORIES API ====================

export async function getCategories(): Promise<Category[]> {
  return request<Category[]>('/api/categories');
}

// ==================== INSTRUCTOR COURSES API ====================

export async function getInstructorCourses(): Promise<Course[]> {
  return request<Course[]>('/api/instructor/courses');
}

// ==================== COURSE CRUD API ====================

export async function createCourse(data: { title: string; description?: string; categoryId?: string }): Promise<Course> {
  return request<Course>('/api/courses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateCourse(id: string, data: { title?: string; description?: string; categoryId?: string; isPublished?: boolean }): Promise<Course> {
  return request<Course>(`/api/courses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function getCourseForEdit(id: string): Promise<CourseDetail> {
  return request<CourseDetail>(`/api/courses/${id}/edit`);
}

// ==================== MODULE API ====================

export async function createModule(courseId: string, data: { title: string; description?: string }): Promise<any> {
  return request<any>(`/api/courses/${courseId}/modules`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateModule(moduleId: string, data: { title?: string; description?: string; order?: number }): Promise<any> {
  return request<any>(`/api/modules/${moduleId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteModule(moduleId: string): Promise<any> {
  return request<any>(`/api/modules/${moduleId}`, { method: 'DELETE' });
}

export async function reorderModules(courseId: string, moduleIds: string[]): Promise<any> {
  return request<any>(`/api/courses/${courseId}/modules/reorder`, {
    method: 'PUT',
    body: JSON.stringify({ moduleIds }),
  });
}

// ==================== LESSON API ====================

export async function createLesson(moduleId: string, data: { title: string; type?: string; content?: string; videoUrl?: string; duration?: number }): Promise<any> {
  return request<any>(`/api/modules/${moduleId}/lessons`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateLesson(lessonId: string, data: { title?: string; type?: string; content?: string; videoUrl?: string; duration?: number; order?: number }): Promise<any> {
  return request<any>(`/api/lessons/${lessonId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteLesson(lessonId: string): Promise<any> {
  return request<any>(`/api/lessons/${lessonId}`, { method: 'DELETE' });
}

// ==================== QUIZ API ====================

export async function createQuiz(moduleId: string, data: { title: string; description?: string }): Promise<any> {
  return request<any>(`/api/modules/${moduleId}/quizzes`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getModuleQuizzes(moduleId: string): Promise<any[]> {
  return request<any[]>(`/api/modules/${moduleId}/quizzes`);
}

export async function updateQuiz(quizId: string, data: { title?: string; description?: string }): Promise<any> {
  return request<any>(`/api/quizzes/${quizId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteQuiz(quizId: string): Promise<any> {
  return request<any>(`/api/quizzes/${quizId}`, { method: 'DELETE' });
}

// ==================== QUIZ QUESTION API ====================

export async function createQuestion(quizId: string, data: { question: string; type?: string; points?: number }): Promise<any> {
  return request<any>(`/api/quizzes/${quizId}/questions`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateQuestion(questionId: string, data: { question?: string; type?: string; points?: number; order?: number }): Promise<any> {
  return request<any>(`/api/questions/${questionId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteQuestion(questionId: string): Promise<any> {
  return request<any>(`/api/questions/${questionId}`, { method: 'DELETE' });
}

// ==================== QUIZ OPTION API ====================

export async function createOption(questionId: string, data: { text: string; isCorrect?: boolean }): Promise<any> {
  return request<any>(`/api/questions/${questionId}/options`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateOption(optionId: string, data: { text?: string; isCorrect?: boolean }): Promise<any> {
  return request<any>(`/api/options/${optionId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deleteOption(optionId: string): Promise<any> {
  return request<any>(`/api/options/${optionId}`, { method: 'DELETE' });
}
