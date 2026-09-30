import { PrismaClient, Role, LessonType } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Clean existing data
  await prisma.progress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Datos existentes eliminados');

  // Hash password
  const saltRounds = 10;
  const defaultPassword = await bcrypt.hash('123456', saltRounds);

  // ==================== USERS ====================

  const admin = await prisma.user.create({
    data: {
      name: 'Admin EduCore',
      email: 'admin@educore.com',
      password: defaultPassword,
      role: Role.ADMIN,
    },
  });

  const instructor1 = await prisma.user.create({
    data: {
      name: 'Carlos Mendoza',
      email: 'carlos@educore.com',
      password: defaultPassword,
      role: Role.INSTRUCTOR,
    },
  });

  const instructor2 = await prisma.user.create({
    data: {
      name: 'Ana García',
      email: 'ana@educore.com',
      password: defaultPassword,
      role: Role.INSTRUCTOR,
    },
  });

  const instructor3 = await prisma.user.create({
    data: {
      name: 'Roberto Sánchez',
      email: 'roberto@educore.com',
      password: defaultPassword,
      role: Role.INSTRUCTOR,
    },
  });

  const student1 = await prisma.user.create({
    data: {
      name: 'Darlene López',
      email: 'darlene@email.com',
      password: defaultPassword,
      role: Role.STUDENT,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: 'Miguel Torres',
      email: 'miguel@email.com',
      password: defaultPassword,
      role: Role.STUDENT,
    },
  });

  console.log('👤 Usuarios creados');

  // ==================== CATEGORIES ====================

  const techCategory = await prisma.category.create({
    data: {
      name: 'Tecnología',
      slug: 'tecnologia',
      description: 'Cursos de programación, desarrollo web, ciencia de datos y más.',
    },
  });

  const designCategory = await prisma.category.create({
    data: {
      name: 'Diseño',
      slug: 'diseno',
      description: 'Diseño UX/UI, gráfico, branding y creatividad digital.',
    },
  });

  const businessCategory = await prisma.category.create({
    data: {
      name: 'Negocios',
      slug: 'negocios',
      description: 'Emprendimiento, marketing, gestión de proyectos y liderazgo.',
    },
  });

  const personalCategory = await prisma.category.create({
    data: {
      name: 'Desarrollo Personal',
      slug: 'desarrollo-personal',
      description: 'Productividad, comunicación, habilidades blandas y bienestar.',
    },
  });

  console.log('📂 Categorías creadas');

  // ==================== COURSES ====================

  // Course 1: Web Development
  const course1 = await prisma.course.create({
    data: {
      title: 'Desarrollo Web Full Stack',
      description: 'Aprende a crear aplicaciones web completas desde cero con HTML, CSS, JavaScript, React y Node.js. Incluye proyectos prácticos y buenas prácticas de la industria.',
      bannerUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      isPublished: true,
      instructorId: instructor1.id,
      categoryId: techCategory.id,
    },
  });

  // Course 2: Python for Data Science
  const course2 = await prisma.course.create({
    data: {
      title: 'Python para Ciencia de Datos',
      description: 'Domina Python y sus librerías clave (Pandas, NumPy, Matplotlib) para analizar datos, crear visualizaciones y construir modelos de machine learning.',
      bannerUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
      isPublished: true,
      instructorId: instructor2.id,
      categoryId: techCategory.id,
    },
  });

  // Course 3: UX/UI Design
  const course3 = await prisma.course.create({
    data: {
      title: 'Diseño UX/UI Profesional',
      description: 'Conviertete en diseñador de interfaces profesional. Aprende investigación de usuarios, wireframing, prototipado y diseño visual con Figma.',
      bannerUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&auto=format&fit=crop&q=80',
      isPublished: true,
      instructorId: instructor3.id,
      categoryId: designCategory.id,
    },
  });

  // Course 4: SQL Databases
  const course4 = await prisma.course.create({
    data: {
      title: 'Bases de Datos y SQL',
      description: 'Aprende a diseñar, crear y consultar bases de datos relacionales con SQL. Desde fundamentos hasta consultas avanzadas y optimización.',
      bannerUrl: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
      isPublished: true,
      instructorId: instructor1.id,
      categoryId: techCategory.id,
    },
  });

  // Course 5: Digital Marketing
  const course5 = await prisma.course.create({
    data: {
      title: 'Marketing Digital Integral',
      description: 'Estrategias completas de marketing digital: SEO, redes sociales, email marketing, pauta publicitaria y analítica de datos.',
      bannerUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      isPublished: true,
      instructorId: instructor2.id,
      categoryId: businessCategory.id,
    },
  });

  // Course 6: Productivity
  const course6 = await prisma.course.create({
    data: {
      title: 'Productividad y Gestión del Tiempo',
      description: 'Técnicas probadas para gestionar tu tiempo, establecer hábitos productivos y alcanzar tus metas personales y profesionales.',
      bannerUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&auto=format&fit=crop&q=80',
      isPublished: true,
      instructorId: instructor3.id,
      categoryId: personalCategory.id,
    },
  });

  console.log('📚 Cursos creados');

  // ==================== MODULES ====================

  // Modules for Course 1 (Web Development)
  const mod1_1 = await prisma.module.create({
    data: {
      title: 'Fundamentos de HTML y CSS',
      description: 'Aprende los cimientos del desarrollo web con HTML5 semántico y CSS3 moderno.',
      order: 1,
      courseId: course1.id,
    },
  });

  const mod1_2 = await prisma.module.create({
    data: {
      title: 'JavaScript Moderno',
      description: 'Domina ES6+, async/await, programación funcional y manipulación del DOM.',
      order: 2,
      courseId: course1.id,
    },
  });

  const mod1_3 = await prisma.module.create({
    data: {
      title: 'React y Componentes',
      description: 'Construye interfaces modernas y reactivas con React y sus hooks principales.',
      order: 3,
      courseId: course1.id,
    },
  });

  // Modules for Course 2 (Python)
  const mod2_1 = await prisma.module.create({
    data: {
      title: 'Fundamentos de Python',
      description: 'Variables, bucles, funciones, estructuras de datos y programación orientada a objetos.',
      order: 1,
      courseId: course2.id,
    },
  });

  const mod2_2 = await prisma.module.create({
    data: {
      title: 'Análisis de Datos con Pandas',
      description: 'Carga, transforma y analiza datos usando Pandas y NumPy.',
      order: 2,
      courseId: course2.id,
    },
  });

  // Modules for Course 3 (UX/UI)
  const mod3_1 = await prisma.module.create({
    data: {
      title: 'Introducción al Diseño UX',
      description: 'Principios de experiencia de usuario, research y arquitectura de información.',
      order: 1,
      courseId: course3.id,
    },
  });

  const mod3_2 = await prisma.module.create({
    data: {
      title: 'Diseño Visual con Figma',
      description: 'Crea prototipos interactivos y diseños visuales profesionales en Figma.',
      order: 2,
      courseId: course3.id,
    },
  });

  console.log('📦 Módulos creados');

  // ==================== LESSONS ====================

  // Lessons for Module 1.1 (HTML/CSS)
  await prisma.lesson.createMany({
    data: [
      {
        title: 'Introducción al HTML5',
        type: LessonType.VIDEO,
        videoUrl: 'https://example.com/video1',
        duration: 25,
        order: 1,
        moduleId: mod1_1.id,
      },
      {
        title: 'Etiquetas Semánticas',
        type: LessonType.TEXT,
        content: 'HTML5 introduce etiquetas semánticas que dan significado al contenido de tu página web.',
        duration: 15,
        order: 2,
        moduleId: mod1_1.id,
      },
      {
        title: 'CSS Flexbox y Grid',
        type: LessonType.VIDEO,
        videoUrl: 'https://example.com/video2',
        duration: 35,
        order: 3,
        moduleId: mod1_1.id,
      },
      {
        title: 'Práctica: Tu Primera Página',
        type: LessonType.PDF,
        content: 'Guía paso a paso para crear tu primera página web con HTML y CSS.',
        duration: 45,
        order: 4,
        moduleId: mod1_1.id,
      },
    ],
  });

  // Lessons for Module 1.2 (JavaScript)
  await prisma.lesson.createMany({
    data: [
      {
        title: 'Variables y Tipos de Datos',
        type: LessonType.VIDEO,
        videoUrl: 'https://example.com/video3',
        duration: 30,
        order: 1,
        moduleId: mod1_2.id,
      },
      {
        title: 'Funciones y Arrow Functions',
        type: LessonType.VIDEO,
        videoUrl: 'https://example.com/video4',
        duration: 28,
        order: 2,
        moduleId: mod1_2.id,
      },
      {
        title: 'Async/Await y Promesas',
        type: LessonType.TEXT,
        content: 'Las promesas y async/await permiten trabajar con operaciones asíncronas de forma limpia.',
        duration: 20,
        order: 3,
        moduleId: mod1_2.id,
      },
    ],
  });

  // Lessons for Module 2.1 (Python)
  await prisma.lesson.createMany({
    data: [
      {
        title: 'Instalación y Configuración',
        type: LessonType.VIDEO,
        videoUrl: 'https://example.com/video5',
        duration: 15,
        order: 1,
        moduleId: mod2_1.id,
      },
      {
        title: 'Variables y Estructuras de Datos',
        type: LessonType.VIDEO,
        videoUrl: 'https://example.com/video6',
        duration: 35,
        order: 2,
        moduleId: mod2_1.id,
      },
      {
        title: 'Funciones y Lambdas',
        type: LessonType.TEXT,
        content: 'Python permite definir funciones con def y funciones anónimas con lambda.',
        duration: 20,
        order: 3,
        moduleId: mod2_1.id,
      },
    ],
  });

  // Lessons for Module 3.1 (UX)
  await prisma.lesson.createMany({
    data: [
      {
        title: '¿Qué es el Diseño UX?',
        type: LessonType.VIDEO,
        videoUrl: 'https://example.com/video7',
        duration: 20,
        order: 1,
        moduleId: mod3_1.id,
      },
      {
        title: 'Investigación de Usuarios',
        type: LessonType.TEXT,
        content: 'La investigación de usuarios es el proceso de entender las necesidades, comportamientos y motivaciones de tus usuarios.',
        duration: 25,
        order: 2,
        moduleId: mod3_1.id,
      },
    ],
  });

  console.log('📄 Lecciones creadas');

  // ==================== ENROLLMENTS ====================

  await prisma.enrollment.createMany({
    data: [
      { userId: student1.id, courseId: course1.id },
      { userId: student1.id, courseId: course3.id },
      { userId: student2.id, courseId: course1.id },
      { userId: student2.id, courseId: course2.id },
    ],
  });

  console.log('📝 Inscripciones creadas');

  // ==================== PROGRESS ====================

  // Get some lessons for progress
  const lessons = await prisma.lesson.findMany({
    where: {
      module: {
        courseId: course1.id,
      },
    },
    take: 4,
  });

  if (lessons.length >= 4) {
    await prisma.progress.createMany({
      data: [
        { userId: student1.id, lessonId: lessons[0].id, completed: true, completedAt: new Date() },
        { userId: student1.id, lessonId: lessons[1].id, completed: true, completedAt: new Date() },
        { userId: student1.id, lessonId: lessons[2].id, completed: false },
        { userId: student2.id, lessonId: lessons[0].id, completed: true, completedAt: new Date() },
      ],
    });
  }

  console.log('📊 Progreso creado');

  console.log('');
  console.log('✅ Seed completado exitosamente!');
  console.log('');
  console.log('📧 Usuarios de prueba:');
  console.log('   Admin:      admin@educore.com / 123456');
  console.log('   Instructor: carlos@educore.com / 123456');
  console.log('   Instructor: ana@educore.com / 123456');
  console.log('   Instructor: roberto@educore.com / 123456');
  console.log('   Estudiante: darlene@email.com / 123456');
  console.log('   Estudiante: miguel@email.com / 123456');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
