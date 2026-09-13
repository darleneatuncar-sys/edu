import React, { useState } from 'react';
import { Course, Assignment, UserRole } from '../types';

interface CourseDetailScreenProps {
  course: Course;
  role: UserRole;
  onBack: () => void;
  onOpenRubricForAssignment: (assignment: Assignment) => void;
}

export const CourseDetailScreen: React.FC<CourseDetailScreenProps> = ({
  course,
  role,
  onBack,
  onOpenRubricForAssignment
}) => {
  const [activeTab, setActiveTab] = useState<'syllabus' | 'assignments' | 'forum' | 'participants'>('syllabus');
  const [submittedTasks, setSubmittedTasks] = useState<Record<string, string>>({});
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);

  // Forum posts state
  const [forumPosts, setForumPosts] = useState([
    {
      id: 'post-1',
      author: 'Valeria Mendoza',
      role: 'Estudiante',
      time: 'Hace 4 horas',
      title: 'Consulta sobre el puerto secundario en el patrón hexagonal',
      content: 'Estimado profesor, en el laboratorio 01 ¿podemos emplear PostgreSQL con TypeORM directamente en el adaptador de infraestructura?',
      replies: [
        {
          author: 'Dr. Andrés Valdivia',
          role: 'Docente',
          time: 'Hace 2 horas',
          content: 'Efectivamente Valeria, mientras el núcleo del dominio interactúe estrictamente con la interfaz del repositorio (puerto out), la implementación concreta de persistencia puede usar cualquier ORM.'
        }
      ]
    }
  ]);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionBody, setNewQuestionBody] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, assignmentId: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setSubmittedTasks((prev) => ({
        ...prev,
        [assignmentId]: file.name
      }));
      setUploadSuccessMsg(`Archivo "${file.name}" cargado y registrado en el servidor institucional con sello de tiempo.`);
      setTimeout(() => setUploadSuccessMsg(null), 4000);
    }
  };

  const handlePostQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionTitle.trim() || !newQuestionBody.trim()) return;

    setForumPosts([
      {
        id: `post-${Date.now()}`,
        author: role === 'student' ? 'Valeria Mendoza' : 'Dr. Carlos Arrieta',
        role: role === 'student' ? 'Estudiante' : 'Docente',
        time: 'Justo ahora',
        title: newQuestionTitle,
        content: newQuestionBody,
        replies: []
      },
      ...forumPosts
    ]);
    setNewQuestionTitle('');
    setNewQuestionBody('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Navigation breadcrumb & Course Header */}
      <div className="flex items-center gap-2 text-xs text-outline">
        <button
          onClick={onBack}
          className="hover:text-primary flex items-center gap-1 font-semibold cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Volver a Asignaturas</span>
        </button>
        <span>/</span>
        <span className="text-on-surface font-semibold truncate">{course.name}</span>
      </div>

      {/* Main Course Hero Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="h-36 sm:h-44 relative bg-slate-900">
          <img
            src={course.bannerImage}
            alt={course.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent p-4 sm:p-6 flex flex-col justify-between text-white">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-xs text-slate-900 font-mono text-xs font-bold">
                {course.code}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-blue-600 text-white text-xs font-semibold">
                {course.credits} Créditos Académicos
              </span>
            </div>

            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">{course.name}</h1>
              <p className="text-xs sm:text-sm text-slate-200 mt-1 flex items-center gap-2">
                <span>{course.professor}</span>
                <span>•</span>
                <span>{course.schedule}</span>
                <span>•</span>
                <span>{course.classroom}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="p-4 bg-surface-container-low border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <a
              href={course.virtualMeetingUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-lg bg-primary-container hover:bg-secondary text-white font-semibold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">video_call</span>
              <span>Sala Google Meet / Zoom</span>
            </a>
            <a
              href="#silabo-pdf"
              onClick={(e) => {
                e.preventDefault();
                alert(`Descargando Sílabo Oficial 2025-I (${course.code}).pdf`);
              }}
              className="px-3 py-2 rounded-lg bg-white hover:bg-surface-container border border-[#E2E8F0] text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">download</span>
              <span>Descargar Sílabo</span>
            </a>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-on-surface-variant">Progreso del Ciclo:</span>
            <div className="w-24 h-2 bg-[#E2E8F0] rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-container rounded-full"
                style={{ width: `${course.progressPercent}%` }}
              ></div>
            </div>
            <span className="font-bold text-primary">{course.progressPercent}%</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-t border-[#E2E8F0] px-4 overflow-x-auto no-scrollbar bg-white">
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'syllabus'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">folder</span>
            <span>Unidades y Materiales</span>
          </button>
          <button
            onClick={() => setActiveTab('assignments')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'assignments'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">assignment</span>
            <span>Tareas y Evaluaciones ({course.assignments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('forum')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'forum'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">forum</span>
            <span>Foro de Consultas</span>
          </button>
          <button
            onClick={() => setActiveTab('participants')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'participants'
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">group</span>
            <span>Compañeros y Docentes</span>
          </button>
        </div>
      </div>

      {uploadSuccessMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <span className="material-symbols-outlined text-[20px] text-emerald-600">check_circle</span>
          <span>{uploadSuccessMsg}</span>
        </div>
      )}

      {/* Tab 1: Unidades y Materiales */}
      {activeTab === 'syllabus' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">
              Contenido Temático Semanal
            </h2>
            <span className="text-xs text-outline">{course.modules.length} Semanas planificadas</span>
          </div>

          <div className="space-y-3">
            {course.modules.map((mod) => (
              <div
                key={mod.id}
                className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-2xs space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-surface-container-low text-primary font-bold text-xs flex items-center justify-center border border-[#E2E8F0]">
                      S{mod.week}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">{mod.title}</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">{mod.description}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
                    Completada
                  </span>
                </div>

                <div className="border-t border-[#E2E8F0] pt-3 space-y-2">
                  <p className="text-[11px] font-bold text-outline uppercase tracking-wider">
                    Recursos Académicos de la Sesión
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {mod.resources.map((res, i) => (
                      <div
                        key={i}
                        onClick={() => alert(`Abriendo recurso: ${res.title}`)}
                        className="flex items-center justify-between p-2.5 rounded-lg border border-[#E2E8F0] bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <span className="material-symbols-outlined text-primary text-[18px]">
                            {res.type === 'pdf' ? 'picture_as_pdf' : res.type === 'video' ? 'play_circle' : 'link'}
                          </span>
                          <span className="font-medium text-on-surface truncate">{res.title}</span>
                        </div>
                        {res.durationOrSize && (
                          <span className="text-[10px] text-outline shrink-0 ml-2">
                            {res.durationOrSize}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Tareas y Evaluaciones */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">
              Evaluaciones y Entregables del Curso
            </h2>
            <span className="text-xs text-outline">Ponderación Oficial en Rúbrica</span>
          </div>

          <div className="space-y-4">
            {course.assignments.map((asg) => {
              const isTurnedIn = submittedTasks[asg.id] || asg.status === 'entregado' || asg.status === 'calificado';
              return (
                <div
                  key={asg.id}
                  className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-2xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                          {asg.type}
                        </span>
                        <span className="text-xs text-outline font-medium">Peso: {asg.weightPercent}%</span>
                      </div>
                      <h3 className="text-sm sm:text-base font-bold text-on-surface">{asg.title}</h3>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto">
                      {asg.score !== undefined ? (
                        <div className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">verified</span>
                          <span>Calificación: {asg.score} / {asg.maxScore}</span>
                        </div>
                      ) : (
                        <div className="px-3 py-1 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px]">schedule</span>
                          <span>Vence: {asg.dueDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-on-surface leading-relaxed">
                    {asg.instructions}
                  </p>

                  {/* Feedback if graded */}
                  {asg.feedback && (
                    <div className="p-3 bg-surface-container-low rounded-xl border border-primary-fixed text-xs space-y-1">
                      <p className="font-semibold text-primary flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">comment</span>
                        Retroalimentación del Catedrático
                      </p>
                      <p className="text-on-surface-variant">{asg.feedback}</p>
                    </div>
                  )}

                  {/* Dropzone & Rubric Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => onOpenRubricForAssignment(asg)}
                      className="px-3 py-2 rounded-lg bg-surface-container-low hover:bg-surface-container border border-[#E2E8F0] text-primary font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">rule</span>
                      <span>Ver Rúbrica de Calificación Oficial</span>
                    </button>

                    {/* Submission state */}
                    {asg.status !== 'calificado' && (
                      <div className="flex items-center gap-2">
                        {isTurnedIn ? (
                          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold border border-emerald-200">
                            <span className="material-symbols-outlined text-[16px]">check_circle</span>
                            <span>Entregado: {submittedTasks[asg.id] || 'Archivo_Final_v1.zip'}</span>
                          </div>
                        ) : (
                          <label className="px-4 py-2 rounded-lg bg-primary-container hover:bg-secondary text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs">
                            <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                            <span>Cargar y Entregar Trabajo</span>
                            <input
                              type="file"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e, asg.id)}
                            />
                          </label>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Foro de Consultas */}
      {activeTab === 'forum' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-2xs space-y-3">
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Publicar Nueva Pregunta al Docente o Compañeros
            </h3>
            <form onSubmit={handlePostQuestion} className="space-y-3">
              <input
                type="text"
                required
                value={newQuestionTitle}
                onChange={(e) => setNewQuestionTitle(e.target.value)}
                placeholder="Título del tema o pregunta técnica..."
                className="w-full text-xs bg-surface-container-low border border-[#E2E8F0] rounded-lg px-3 py-2 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
              />
              <textarea
                rows={3}
                required
                value={newQuestionBody}
                onChange={(e) => setNewQuestionBody(e.target.value)}
                placeholder="Describe tu duda detalladamente para que el profesor o ayudante de cátedra responda..."
                className="w-full text-xs bg-surface-container-low border border-[#E2E8F0] rounded-lg px-3 py-2 text-on-surface placeholder:text-outline focus:outline-none focus:border-primary"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-primary-container hover:bg-secondary text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Publicar en el Foro</span>
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-3">
            {forumPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary-fixed text-primary font-bold text-[10px] flex items-center justify-center">
                      {post.author.charAt(0)}
                    </span>
                    <span className="font-semibold text-on-surface">{post.author}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-on-surface-variant">
                      {post.role}
                    </span>
                  </div>
                  <span className="text-[11px] text-outline">{post.time}</span>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-on-surface">{post.title}</h4>
                  <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{post.content}</p>
                </div>

                {post.replies.map((reply, i) => (
                  <div
                    key={i}
                    className="p-3 bg-surface-container-low rounded-xl border-l-2 border-primary space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-semibold text-primary">
                        <span className="material-symbols-outlined text-[16px]">reply</span>
                        <span>{reply.author}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-blue-100 text-blue-800">
                          {reply.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-outline">{reply.time}</span>
                    </div>
                    <p className="text-on-surface-variant leading-relaxed pl-5">{reply.content}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Participantes */}
      {activeTab === 'participants' && (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">
              Nómina del Curso • Sección 01
            </h2>
            <span className="text-xs text-outline">28 Estudiantes Matriculados</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg border border-primary-fixed bg-surface-container-low flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Profesor"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-on-surface">{course.professor}</p>
                  <p className="text-[11px] text-primary font-medium">Profesor Principal de Cátedra</p>
                </div>
              </div>
              <a
                href={`mailto:${course.professorEmail}`}
                className="w-8 h-8 rounded-lg bg-white border border-[#E2E8F0] text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                title="Contactar al Catedrático"
              >
                <span className="material-symbols-outlined text-[16px]">mail</span>
              </a>
            </div>

            <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                  alt="Valeria"
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <p className="text-xs font-bold text-on-surface">Valeria Mendoza Arriaga</p>
                  <p className="text-[11px] text-on-surface-variant">Estudiante (Tú) • Código 20210452</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                Activa
              </span>
            </div>

            <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-surface-container-highest text-primary font-bold flex items-center justify-center text-xs">
                  JA
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Jorge Alarcón Palacios</p>
                  <p className="text-[11px] text-on-surface-variant">Estudiante • Código 20210891</p>
                </div>
              </div>
              <span className="text-[11px] text-outline">Delegado</span>
            </div>

            <div className="p-3 rounded-lg border border-[#E2E8F0] bg-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-surface-container-highest text-primary font-bold flex items-center justify-center text-xs">
                  CS
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Camila Silva Gutiérrez</p>
                  <p className="text-[11px] text-on-surface-variant">Estudiante • Código 20220314</p>
                </div>
              </div>
              <span className="text-[11px] text-outline">Compañera</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
