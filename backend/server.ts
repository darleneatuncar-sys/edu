import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient, Role } from '@prisma/client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'educore-fallback-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Prisma Client
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// ==================== TYPES ====================

interface JwtPayload {
  userId: string;
  role: Role;
}

// ==================== AUTH MIDDLEWARE ====================

function authenticateToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

function requireRole(...roles: Role[]) {
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const user = (req as any).user as JwtPayload;
    if (!roles.includes(user.role)) {
      return res.status(403).json({ error: 'No tienes permiso para realizar esta acción' });
    }
    next();
  };
}

// ==================== AUTH ROUTES ====================

// Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo ya está registrado' });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role.STUDENT,
      },
    });

    // Generate JWT
    const tokenPayload: JwtPayload = { userId: newUser.id, role: newUser.role };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser;
    res.status(201).json({
      message: 'Cuenta creada exitosamente',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Generate JWT
    const tokenPayload: JwtPayload = { userId: user.id, role: user.role };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      message: 'Inicio de sesión exitoso',
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get current user profile (authenticated)
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const { userId } = (req as any).user as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get user profile by ID (public)
app.get('/api/auth/profile/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==================== COURSES ROUTES ====================

// Get all published courses (public)
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      where: { isPublished: true },
      include: {
        instructor: {
          select: { id: true, name: true, email: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        modules: {
          include: {
            lessons: {
              select: { id: true },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { enrollments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to include lesson count
    const coursesWithCount = courses.map((course) => ({
      ...course,
      totalModules: course.modules.length,
      totalLessons: course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0),
      enrolledCount: course._count.enrollments,
    }));

    res.json(coursesWithCount);
  } catch (error) {
    console.error('Courses error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get course by ID (public)
app.get('/api/courses/:id', async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        instructor: {
          select: { id: true, name: true, email: true },
        },
        category: {
          select: { id: true, name: true, slug: true },
        },
        modules: {
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    res.json(course);
  } catch (error) {
    console.error('Course detail error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Enroll in a course (authenticated)
app.post('/api/courses/:id/enroll', authenticateToken, async (req, res) => {
  try {
    const { userId } = (req as any).user as JwtPayload;
    const courseId = req.params.id;

    // Check if course exists
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });

    if (existingEnrollment) {
      return res.status(400).json({ error: 'Ya estás inscrito en este curso' });
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: { userId, courseId },
      include: {
        course: {
          select: { id: true, title: true },
        },
      },
    });

    res.status(201).json({
      message: 'Inscripción exitosa',
      enrollment,
    });
  } catch (error) {
    console.error('Enrollment error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get my courses (authenticated)
app.get('/api/my-courses', authenticateToken, async (req, res) => {
  try {
    const { userId } = (req as any).user as JwtPayload;

    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            instructor: {
              select: { id: true, name: true },
            },
            modules: {
              include: {
                lessons: {
                  select: { id: true },
                },
              },
            },
            _count: {
              select: { enrollments: true },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });

    // Get progress for each course
    const coursesWithProgress = await Promise.all(
      enrollments.map(async (enrollment) => {
        const totalLessons = enrollment.course.modules.reduce(
          (acc, mod) => acc + mod.lessons.length,
          0
        );

        const completedLessons = await prisma.progress.count({
          where: {
            userId,
            completed: true,
            lesson: {
              module: {
                courseId: enrollment.courseId,
              },
            },
          },
        });

        const progressPercent = totalLessons > 0
          ? Math.round((completedLessons / totalLessons) * 100)
          : 0;

        return {
          ...enrollment.course,
          enrolledAt: enrollment.enrolledAt,
          totalLessons,
          completedLessons,
          progressPercent,
        };
      })
    );

    res.json(coursesWithProgress);
  } catch (error) {
    console.error('My courses error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==================== PROGRESS ROUTES ====================

// Mark lesson as completed (authenticated)
app.put('/api/progress/:lessonId', authenticateToken, async (req, res) => {
  try {
    const { userId } = (req as any).user as JwtPayload;
    const { lessonId } = req.params;

    // Check if lesson exists
    const lesson = await prisma.lesson.findUnique({ where: { id: lessonId } });
    if (!lesson) {
      return res.status(404).json({ error: 'Lección no encontrada' });
    }

    // Check if user is enrolled in the course
    const module = await prisma.module.findUnique({
      where: { id: lesson.moduleId },
    });

    if (!module) {
      return res.status(404).json({ error: 'Módulo no encontrado' });
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId: module.courseId } },
    });

    if (!enrollment) {
      return res.status(403).json({ error: 'No estás inscrito en este curso' });
    }

    // Upsert progress
    const progress = await prisma.progress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      update: { completed: true, completedAt: new Date() },
      create: { userId, lessonId, completed: true, completedAt: new Date() },
    });

    res.json({
      message: 'Progreso actualizado',
      progress,
    });
  } catch (error) {
    console.error('Progress error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get progress for a course (authenticated)
app.get('/api/progress/course/:courseId', authenticateToken, async (req, res) => {
  try {
    const { userId } = (req as any).user as JwtPayload;
    const { courseId } = req.params;

    const progress = await prisma.progress.findMany({
      where: {
        userId,
        lesson: {
          module: {
            courseId,
          },
        },
      },
      include: {
        lesson: {
          select: { id: true, title: true, moduleId: true },
        },
      },
    });

    res.json(progress);
  } catch (error) {
    console.error('Progress list error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==================== CATEGORIES ROUTES ====================

// Get all categories (public)
app.get('/api/categories', async (_req, res) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { courses: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    res.json(categories);
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==================== INSTRUCTOR COURSES ====================

// Get instructor's own courses
app.get('/api/instructor/courses', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId, role } = (req as any).user as JwtPayload;

    const where = role === Role.ADMIN ? {} : { instructorId: userId };

    const courses = await prisma.course.findMany({
      where,
      include: {
        instructor: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
        modules: {
          include: {
            lessons: { select: { id: true } },
            quizzes: { select: { id: true } },
          },
          orderBy: { order: 'asc' },
        },
        _count: { select: { enrollments: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    const result = courses.map((c) => ({
      ...c,
      totalModules: c.modules.length,
      totalLessons: c.modules.reduce((acc, m) => acc + m.lessons.length, 0),
      totalQuizzes: c.modules.reduce((acc, m) => acc + m.quizzes.length, 0),
      enrolledCount: c._count.enrollments,
    }));

    res.json(result);
  } catch (error) {
    console.error('Instructor courses error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==================== COURSE CRUD ====================

// Create course (instructor/admin)
app.post('/api/courses', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId } = (req as any).user as JwtPayload;
    const { title, description, categoryId } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'El título es requerido' });
    }

    const course = await prisma.course.create({
      data: {
        title,
        description: description || null,
        categoryId: categoryId || null,
        instructorId: userId,
      },
      include: {
        instructor: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Update course (owner or admin)
app.put('/api/courses/:id', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId, role } = (req as any).user as JwtPayload;
    const { id } = req.params;
    const { title, description, categoryId, isPublished } = req.body;

    const course = await prisma.course.findUnique({ where: { id } });
    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    if (role !== Role.ADMIN && course.instructorId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para modificar este curso' });
    }

    const updated = await prisma.course.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(categoryId !== undefined && { categoryId }),
        ...(isPublished !== undefined && { isPublished }),
      },
      include: {
        instructor: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get course detail with all content (for instructor editing)
app.get('/api/courses/:id/edit', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId, role } = (req as any).user as JwtPayload;
    const { id } = req.params;

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
        modules: {
          include: {
            lessons: { orderBy: { order: 'asc' } },
            quizzes: {
              include: {
                questions: {
                  include: { options: { orderBy: { order: 'asc' } } },
                  orderBy: { order: 'asc' },
                },
              },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    if (role !== Role.ADMIN && course.instructorId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para ver este curso' });
    }

    res.json(course);
  } catch (error) {
    console.error('Get course edit error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==================== MODULE CRUD ====================

// Create module
app.post('/api/courses/:courseId/modules', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId, role } = (req as any).user as JwtPayload;
    const { courseId } = req.params;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'El título es requerido' });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    if (role !== Role.ADMIN && course.instructorId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para modificar este curso' });
    }

    const maxOrder = await prisma.module.aggregate({
      where: { courseId },
      _max: { order: true },
    });

    const module = await prisma.module.create({
      data: {
        title,
        description: description || null,
        order: (maxOrder._max.order ?? -1) + 1,
        courseId,
      },
    });

    res.status(201).json(module);
  } catch (error) {
    console.error('Create module error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Update module
app.put('/api/modules/:moduleId', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId, role } = (req as any).user as JwtPayload;
    const { moduleId } = req.params;
    const { title, description, order } = req.body;

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true },
    });
    if (!module) {
      return res.status(404).json({ error: 'Módulo no encontrado' });
    }

    if (role !== Role.ADMIN && module.course.instructorId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para modificar este módulo' });
    }

    const updated = await prisma.module.update({
      where: { id: moduleId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order }),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update module error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Delete module
app.delete('/api/modules/:moduleId', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId, role } = (req as any).user as JwtPayload;
    const { moduleId } = req.params;

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true },
    });
    if (!module) {
      return res.status(404).json({ error: 'Módulo no encontrado' });
    }

    if (role !== Role.ADMIN && module.course.instructorId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este módulo' });
    }

    await prisma.module.delete({ where: { id: moduleId } });

    // Reorder remaining modules
    const remaining = await prisma.module.findMany({
      where: { courseId: module.courseId },
      orderBy: { order: 'asc' },
    });

    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].order !== i) {
        await prisma.module.update({
          where: { id: remaining[i].id },
          data: { order: i },
        });
      }
    }

    res.json({ message: 'Módulo eliminado' });
  } catch (error) {
    console.error('Delete module error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Reorder modules
app.put('/api/courses/:courseId/modules/reorder', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId, role } = (req as any).user as JwtPayload;
    const { courseId } = req.params;
    const { moduleIds } = req.body;

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ error: 'Curso no encontrado' });
    }

    if (role !== Role.ADMIN && course.instructorId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    for (let i = 0; i < moduleIds.length; i++) {
      await prisma.module.update({
        where: { id: moduleIds[i] },
        data: { order: i },
      });
    }

    res.json({ message: 'Orden actualizado' });
  } catch (error) {
    console.error('Reorder modules error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==================== LESSON CRUD ====================

// Create lesson
app.post('/api/modules/:moduleId/lessons', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId, role } = (req as any).user as JwtPayload;
    const { moduleId } = req.params;
    const { title, type, content, videoUrl, duration } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'El título es requerido' });
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true },
    });
    if (!module) {
      return res.status(404).json({ error: 'Módulo no encontrado' });
    }

    if (role !== Role.ADMIN && module.course.instructorId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para modificar este módulo' });
    }

    const maxOrder = await prisma.lesson.aggregate({
      where: { moduleId },
      _max: { order: true },
    });

    const lesson = await prisma.lesson.create({
      data: {
        title,
        type: type || 'TEXT',
        content: content || null,
        videoUrl: videoUrl || null,
        duration: duration || null,
        order: (maxOrder._max.order ?? -1) + 1,
        moduleId,
      },
    });

    res.status(201).json(lesson);
  } catch (error) {
    console.error('Create lesson error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Update lesson
app.put('/api/lessons/:lessonId', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId, role } = (req as any).user as JwtPayload;
    const { lessonId } = req.params;
    const { title, type, content, videoUrl, duration, order } = req.body;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } },
    });
    if (!lesson) {
      return res.status(404).json({ error: 'Lección no encontrada' });
    }

    if (role !== Role.ADMIN && lesson.module.course.instructorId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para modificar esta lección' });
    }

    const updated = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        ...(title !== undefined && { title }),
        ...(type !== undefined && { type }),
        ...(content !== undefined && { content }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(duration !== undefined && { duration }),
        ...(order !== undefined && { order }),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update lesson error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Delete lesson
app.delete('/api/lessons/:lessonId', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId, role } = (req as any).user as JwtPayload;
    const { lessonId } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } },
    });
    if (!lesson) {
      return res.status(404).json({ error: 'Lección no encontrada' });
    }

    if (role !== Role.ADMIN && lesson.module.course.instructorId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta lección' });
    }

    await prisma.lesson.delete({ where: { id: lessonId } });

    // Reorder remaining lessons
    const remaining = await prisma.lesson.findMany({
      where: { moduleId: lesson.moduleId },
      orderBy: { order: 'asc' },
    });

    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].order !== i) {
        await prisma.lesson.update({
          where: { id: remaining[i].id },
          data: { order: i },
        });
      }
    }

    res.json({ message: 'Lección eliminada' });
  } catch (error) {
    console.error('Delete lesson error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==================== QUIZ CRUD ====================

// Create quiz
app.post('/api/modules/:moduleId/quizzes', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId, role } = (req as any).user as JwtPayload;
    const { moduleId } = req.params;
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'El título es requerido' });
    }

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true },
    });
    if (!module) {
      return res.status(404).json({ error: 'Módulo no encontrado' });
    }

    if (role !== Role.ADMIN && module.course.instructorId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para modificar este módulo' });
    }

    const maxOrder = await prisma.quiz.aggregate({
      where: { moduleId },
      _max: { order: true },
    });

    const quiz = await prisma.quiz.create({
      data: {
        title,
        description: description || null,
        order: (maxOrder._max.order ?? -1) + 1,
        moduleId,
      },
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Get quizzes for a module
app.get('/api/modules/:moduleId/quizzes', authenticateToken, async (req, res) => {
  try {
    const { moduleId } = req.params;

    const quizzes = await prisma.quiz.findMany({
      where: { moduleId },
      include: {
        questions: {
          include: { options: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });

    res.json(quizzes);
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Update quiz
app.put('/api/quizzes/:quizId', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId, role } = (req as any).user as JwtPayload;
    const { quizId } = req.params;
    const { title, description, order } = req.body;

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { module: { include: { course: true } } },
    });
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz no encontrado' });
    }

    if (role !== Role.ADMIN && quiz.module.course.instructorId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para modificar este quiz' });
    }

    const updated = await prisma.quiz.update({
      where: { id: quizId },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order }),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Delete quiz
app.delete('/api/quizzes/:quizId', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId, role } = (req as any).user as JwtPayload;
    const { quizId } = req.params;

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { module: { include: { course: true } } },
    });
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz no encontrado' });
    }

    if (role !== Role.ADMIN && quiz.module.course.instructorId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar este quiz' });
    }

    await prisma.quiz.delete({ where: { id: quizId } });

    res.json({ message: 'Quiz eliminado' });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==================== QUIZ QUESTION CRUD ====================

// Create question
app.post('/api/quizzes/:quizId/questions', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId, role } = (req as any).user as JwtPayload;
    const { quizId } = req.params;
    const { question, type, points } = req.body;

    if (!question) {
      return res.status(400).json({ error: 'El texto de la pregunta es requerido' });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { module: { include: { course: true } } },
    });
    if (!quiz) {
      return res.status(404).json({ error: 'Quiz no encontrado' });
    }

    if (role !== Role.ADMIN && quiz.module.course.instructorId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para modificar este quiz' });
    }

    const maxOrder = await prisma.quizQuestion.aggregate({
      where: { quizId },
      _max: { order: true },
    });

    const created = await prisma.quizQuestion.create({
      data: {
        question,
        type: type || 'SINGLE_CHOICE',
        points: points || 1,
        order: (maxOrder._max.order ?? -1) + 1,
        quizId,
      },
      include: { options: true },
    });

    res.status(201).json(created);
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Update question
app.put('/api/questions/:questionId', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId, role } = (req as any).user as JwtPayload;
    const { questionId } = req.params;
    const { question, type, points, order } = req.body;

    const q = await prisma.quizQuestion.findUnique({
      where: { id: questionId },
      include: { quiz: { include: { module: { include: { course: true } } } } },
    });
    if (!q) {
      return res.status(404).json({ error: 'Pregunta no encontrada' });
    }

    if (role !== Role.ADMIN && q.quiz.module.course.instructorId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para modificar esta pregunta' });
    }

    const updated = await prisma.quizQuestion.update({
      where: { id: questionId },
      data: {
        ...(question !== undefined && { question }),
        ...(type !== undefined && { type }),
        ...(points !== undefined && { points }),
        ...(order !== undefined && { order }),
      },
      include: { options: true },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update question error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Delete question
app.delete('/api/questions/:questionId', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId, role } = (req as any).user as JwtPayload;
    const { questionId } = req.params;

    const q = await prisma.quizQuestion.findUnique({
      where: { id: questionId },
      include: { quiz: { include: { module: { include: { course: true } } } } },
    });
    if (!q) {
      return res.status(404).json({ error: 'Pregunta no encontrada' });
    }

    if (role !== Role.ADMIN && q.quiz.module.course.instructorId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso para eliminar esta pregunta' });
    }

    await prisma.quizQuestion.delete({ where: { id: questionId } });

    // Reorder remaining questions
    const remaining = await prisma.quizQuestion.findMany({
      where: { quizId: q.quizId },
      orderBy: { order: 'asc' },
    });

    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].order !== i) {
        await prisma.quizQuestion.update({
          where: { id: remaining[i].id },
          data: { order: i },
        });
      }
    }

    res.json({ message: 'Pregunta eliminada' });
  } catch (error) {
    console.error('Delete question error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==================== QUIZ OPTION CRUD ====================

// Create option
app.post('/api/questions/:questionId/options', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId, role } = (req as any).user as JwtPayload;
    const { questionId } = req.params;
    const { text, isCorrect } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'El texto de la opción es requerido' });
    }

    const q = await prisma.quizQuestion.findUnique({
      where: { id: questionId },
      include: { quiz: { include: { module: { include: { course: true } } } } },
    });
    if (!q) {
      return res.status(404).json({ error: 'Pregunta no encontrada' });
    }

    if (role !== Role.ADMIN && q.quiz.module.course.instructorId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    // Validate max 6 options
    const optionCount = await prisma.quizOption.count({ where: { questionId } });
    if (optionCount >= 6) {
      return res.status(400).json({ error: 'Máximo 6 opciones por pregunta' });
    }

    // For SINGLE_CHOICE, if this is correct, unmark others
    if (isCorrect && q.type === 'SINGLE_CHOICE') {
      await prisma.quizOption.updateMany({
        where: { questionId, isCorrect: true },
        data: { isCorrect: false },
      });
    }

    const maxOrder = await prisma.quizOption.aggregate({
      where: { questionId },
      _max: { order: true },
    });

    const option = await prisma.quizOption.create({
      data: {
        text,
        isCorrect: isCorrect || false,
        order: (maxOrder._max.order ?? -1) + 1,
        questionId,
      },
    });

    res.status(201).json(option);
  } catch (error) {
    console.error('Create option error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Update option
app.put('/api/options/:optionId', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId, role } = (req as any).user as JwtPayload;
    const { optionId } = req.params;
    const { text, isCorrect, order } = req.body;

    const opt = await prisma.quizOption.findUnique({
      where: { id: optionId },
      include: { question: { include: { quiz: { include: { module: { include: { course: true } } } } } } },
    });
    if (!opt) {
      return res.status(404).json({ error: 'Opción no encontrada' });
    }

    if (role !== Role.ADMIN && opt.question.quiz.module.course.instructorId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    // For SINGLE_CHOICE, if marking as correct, unmark others
    if (isCorrect && opt.question.type === 'SINGLE_CHOICE') {
      await prisma.quizOption.updateMany({
        where: { questionId: opt.questionId, isCorrect: true },
        data: { isCorrect: false },
      });
    }

    const updated = await prisma.quizOption.update({
      where: { id: optionId },
      data: {
        ...(text !== undefined && { text }),
        ...(isCorrect !== undefined && { isCorrect }),
        ...(order !== undefined && { order }),
      },
    });

    res.json(updated);
  } catch (error) {
    console.error('Update option error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Delete option
app.delete('/api/options/:optionId', authenticateToken, requireRole(Role.INSTRUCTOR, Role.ADMIN), async (req, res) => {
  try {
    const { userId, role } = (req as any).user as JwtPayload;
    const { optionId } = req.params;

    const opt = await prisma.quizOption.findUnique({
      where: { id: optionId },
      include: { question: { include: { quiz: { include: { module: { include: { course: true } } } } } } },
    });
    if (!opt) {
      return res.status(404).json({ error: 'Opción no encontrada' });
    }

    if (role !== Role.ADMIN && opt.question.quiz.module.course.instructorId !== userId) {
      return res.status(403).json({ error: 'No tienes permiso' });
    }

    await prisma.quizOption.delete({ where: { id: optionId } });

    // Reorder remaining options
    const remaining = await prisma.quizOption.findMany({
      where: { questionId: opt.questionId },
      orderBy: { order: 'asc' },
    });

    for (let i = 0; i < remaining.length; i++) {
      if (remaining[i].order !== i) {
        await prisma.quizOption.update({
          where: { id: remaining[i].id },
          data: { order: i },
        });
      }
    }

    res.json({ message: 'Opción eliminada' });
  } catch (error) {
    console.error('Delete option error:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// ==================== START SERVER ====================

async function main() {
  try {
    await prisma.$connect();
    console.log('✅ Conectado a PostgreSQL');

    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 API de EduCore lista`);
    });
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos:', error);
    process.exit(1);
  }
}

main();

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
