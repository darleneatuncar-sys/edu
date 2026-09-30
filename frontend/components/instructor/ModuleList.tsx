'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import * as api from '@/src/api';

interface ModuleData {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: api.Lesson[];
  quizzes: api.Quiz[];
}

interface ModuleListProps {
  courseId: string;
  modules: ModuleData[];
  onRefresh: () => void;
}

export function ModuleList({ courseId, modules, onRefresh }: ModuleListProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(modules.map((m) => m.id))
  );
  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [moduleForm, setModuleForm] = useState({ title: '', description: '' });
  const [showNewModule, setShowNewModule] = useState(false);
  const [newModuleForm, setNewModuleForm] = useState({ title: '', description: '' });
  const [saving, setSaving] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null);
  const [lessonForm, setLessonForm] = useState({ title: '', content: '' });
  const [showNewLesson, setShowNewLesson] = useState<string | null>(null);
  const [newLessonForm, setNewLessonForm] = useState({ title: '', content: '' });
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [quizForm, setQuizForm] = useState({ title: '', description: '' });
  const [showNewQuiz, setShowNewQuiz] = useState<string | null>(null);
  const [newQuizForm, setNewQuizForm] = useState({ title: '', description: '' });
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionForm, setQuestionForm] = useState({ question: '', points: 1 });
  const [showNewQuestion, setShowNewQuestion] = useState<string | null>(null);
  const [newQuestionForm, setNewQuestionForm] = useState({ question: '', points: 1 });
  const [editingOptionId, setEditingOptionId] = useState<string | null>(null);
  const [optionForm, setOptionForm] = useState({ text: '' });
  const [showNewOption, setShowNewOption] = useState<string | null>(null);
  const [newOptionForm, setNewOptionForm] = useState({ text: '' });

  const toggleModule = (id: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ==================== MODULE ACTIONS ====================

  const handleCreateModule = async () => {
    if (!newModuleForm.title.trim()) return;
    setSaving(true);
    try {
      await api.createModule(courseId, {
        title: newModuleForm.title.trim(),
        description: newModuleForm.description.trim() || undefined,
      });
      setNewModuleForm({ title: '', description: '' });
      setShowNewModule(false);
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Error al crear módulo');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateModule = async (moduleId: string) => {
    if (!moduleForm.title.trim()) return;
    setSaving(true);
    try {
      await api.updateModule(moduleId, {
        title: moduleForm.title.trim(),
        description: moduleForm.description.trim() || undefined,
      });
      setEditingModuleId(null);
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Error al actualizar módulo');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('¿Eliminar este módulo y todo su contenido?')) return;
    setSaving(true);
    try {
      await api.deleteModule(moduleId);
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Error al eliminar módulo');
    } finally {
      setSaving(false);
    }
  };

  const handleMoveModule = async (moduleId: string, direction: 'up' | 'down') => {
    const idx = modules.findIndex((m) => m.id === moduleId);
    if (idx === -1) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= modules.length) return;

    const newOrder = modules.map((m) => m.id);
    [newOrder[idx], newOrder[newIdx]] = [newOrder[newIdx], newOrder[idx]];

    setSaving(true);
    try {
      await api.reorderModules(courseId, newOrder);
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Error al reordenar');
    } finally {
      setSaving(false);
    }
  };

  // ==================== LESSON ACTIONS ====================

  const handleCreateLesson = async (moduleId: string) => {
    if (!newLessonForm.title.trim()) return;
    setSaving(true);
    try {
      await api.createLesson(moduleId, {
        title: newLessonForm.title.trim(),
        type: 'TEXT',
        content: newLessonForm.content.trim() || undefined,
      });
      setNewLessonForm({ title: '', content: '' });
      setShowNewLesson(null);
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Error al crear lección');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateLesson = async (lessonId: string) => {
    if (!lessonForm.title.trim()) return;
    setSaving(true);
    try {
      await api.updateLesson(lessonId, {
        title: lessonForm.title.trim(),
        content: lessonForm.content.trim() || undefined,
      });
      setEditingLessonId(null);
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Error al actualizar lección');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm('¿Eliminar esta lección?')) return;
    setSaving(true);
    try {
      await api.deleteLesson(lessonId);
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Error al eliminar lección');
    } finally {
      setSaving(false);
    }
  };

  const handleMoveLesson = async (lessons: api.Lesson[], lessonId: string, direction: 'up' | 'down') => {
    const idx = lessons.findIndex((l) => l.id === lessonId);
    if (idx === -1) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= lessons.length) return;

    const lessonA = lessons[idx];
    const lessonB = lessons[newIdx];

    setSaving(true);
    try {
      await api.updateLesson(lessonA.id, { order: lessonB.order });
      await api.updateLesson(lessonB.id, { order: lessonA.order });
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Error al reordenar');
    } finally {
      setSaving(false);
    }
  };

  // ==================== QUIZ ACTIONS ====================

  const handleCreateQuiz = async (moduleId: string) => {
    if (!newQuizForm.title.trim()) return;
    setSaving(true);
    try {
      await api.createQuiz(moduleId, {
        title: newQuizForm.title.trim(),
        description: newQuizForm.description.trim() || undefined,
      });
      setNewQuizForm({ title: '', description: '' });
      setShowNewQuiz(null);
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Error al crear quiz');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateQuiz = async (quizId: string) => {
    if (!quizForm.title.trim()) return;
    setSaving(true);
    try {
      await api.updateQuiz(quizId, {
        title: quizForm.title.trim(),
        description: quizForm.description.trim() || undefined,
      });
      setEditingQuizId(null);
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Error al actualizar quiz');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuiz = async (quizId: string) => {
    if (!confirm('¿Eliminar este quiz y todas sus preguntas?')) return;
    setSaving(true);
    try {
      await api.deleteQuiz(quizId);
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Error al eliminar quiz');
    } finally {
      setSaving(false);
    }
  };

  // ==================== QUESTION ACTIONS ====================

  const handleCreateQuestion = async (quizId: string) => {
    if (!newQuestionForm.question.trim()) return;
    setSaving(true);
    try {
      await api.createQuestion(quizId, {
        question: newQuestionForm.question.trim(),
        type: 'SINGLE_CHOICE',
        points: newQuestionForm.points,
      });
      setNewQuestionForm({ question: '', points: 1 });
      setShowNewQuestion(null);
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Error al crear pregunta');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateQuestion = async (questionId: string) => {
    if (!questionForm.question.trim()) return;
    setSaving(true);
    try {
      await api.updateQuestion(questionId, {
        question: questionForm.question.trim(),
        points: questionForm.points,
      });
      setEditingQuestionId(null);
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Error al actualizar pregunta');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (!confirm('¿Eliminar esta pregunta y sus opciones?')) return;
    setSaving(true);
    try {
      await api.deleteQuestion(questionId);
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Error al eliminar pregunta');
    } finally {
      setSaving(false);
    }
  };

  // ==================== OPTION ACTIONS ====================

  const handleCreateOption = async (questionId: string, isCorrect: boolean = false) => {
    if (!newOptionForm.text.trim()) return;
    setSaving(true);
    try {
      await api.createOption(questionId, {
        text: newOptionForm.text.trim(),
        isCorrect,
      });
      setNewOptionForm({ text: '' });
      setShowNewOption(null);
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Error al crear opción');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateOption = async (optionId: string) => {
    if (!optionForm.text.trim()) return;
    setSaving(true);
    try {
      await api.updateOption(optionId, { text: optionForm.text.trim() });
      setEditingOptionId(null);
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Error al actualizar opción');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteOption = async (optionId: string) => {
    if (!confirm('¿Eliminar esta opción?')) return;
    setSaving(true);
    try {
      await api.deleteOption(optionId);
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Error al eliminar opción');
    } finally {
      setSaving(false);
    }
  };

  const handleSetCorrectOption = async (questionId: string, optionId: string) => {
    setSaving(true);
    try {
      await api.updateOption(optionId, { isCorrect: true });
      onRefresh();
    } catch (e: any) {
      alert(e.message || 'Error al marcar respuesta correcta');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-3">
      {modules.map((mod, modIdx) => {
        const isExpanded = expandedModules.has(mod.id);
        const isEditing = editingModuleId === mod.id;

        return (
          <div
            key={mod.id}
            className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden"
          >
            {/* Module Header */}
            <div className="flex items-center justify-between p-4 hover:bg-surface-container-low/50 transition-colors">
              <button
                onClick={() => toggleModule(mod.id)}
                className="flex items-center gap-3 min-w-0 flex-1 text-left"
              >
                <div className="w-8 h-8 rounded-lg bg-primary-container/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-primary-container">
                    {isExpanded ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
                <div className="min-w-0">
                  {isEditing ? (
                    <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                      <Input
                        value={moduleForm.title}
                        onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                        placeholder="Título del módulo"
                      />
                      <Input
                        value={moduleForm.description}
                        onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                        placeholder="Descripción (opcional)"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdateModule(mod.id)} loading={saving}>
                          Guardar
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => setEditingModuleId(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-semibold text-on-surface truncate">
                        Módulo {modIdx + 1} — {mod.title}
                      </p>
                      <p className="text-[11px] text-on-surface-variant">
                        {mod.lessons.length} lecciones · {mod.quizzes.length} quizzes
                      </p>
                    </>
                  )}
                </div>
              </button>

              {!isEditing && (
                <div className="flex items-center gap-1 ml-2 shrink-0">
                  <button
                    onClick={() => handleMoveModule(mod.id, 'up')}
                    disabled={modIdx === 0 || saving}
                    className="p-1 rounded hover:bg-surface-container-high transition-colors disabled:opacity-30"
                    title="Subir"
                  >
                    <span className="material-symbols-outlined text-[16px] text-outline">arrow_upward</span>
                  </button>
                  <button
                    onClick={() => handleMoveModule(mod.id, 'down')}
                    disabled={modIdx === modules.length - 1 || saving}
                    className="p-1 rounded hover:bg-surface-container-high transition-colors disabled:opacity-30"
                    title="Bajar"
                  >
                    <span className="material-symbols-outlined text-[16px] text-outline">arrow_downward</span>
                  </button>
                  <button
                    onClick={() => {
                      setEditingModuleId(mod.id);
                      setModuleForm({ title: mod.title, description: mod.description || '' });
                    }}
                    className="p-1 rounded hover:bg-surface-container-high transition-colors"
                    title="Editar"
                  >
                    <span className="material-symbols-outlined text-[16px] text-outline">edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteModule(mod.id)}
                    disabled={saving}
                    className="p-1 rounded hover:bg-error-container/20 transition-colors"
                    title="Eliminar"
                  >
                    <span className="material-symbols-outlined text-[16px] text-error">delete</span>
                  </button>
                </div>
              )}
            </div>

            {/* Module Content */}
            {isExpanded && !isEditing && (
              <div className="border-t border-outline-variant/20">
                {/* Lessons */}
                {mod.lessons.length > 0 && (
                  <div className="px-4 pt-3">
                    <p className="text-[10px] font-semibold text-outline uppercase tracking-wider mb-2">Lecciones</p>
                  </div>
                )}
                {mod.lessons.map((lesson, lessonIdx) => {
                  const isLessonEditing = editingLessonId === lesson.id;
                  const typeIcons: Record<string, string> = {
                    video: 'play_circle',
                    text: 'article',
                    pdf: 'picture_as_pdf',
                    link: 'link',
                  };
                  const typeLabels: Record<string, string> = {
                    video: 'Video',
                    text: 'Texto',
                    pdf: 'PDF',
                    link: 'Enlace',
                  };

                  return (
                    <div
                      key={lesson.id}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-low/30 transition-colors border-b border-outline-variant/10 last:border-b-0"
                    >
                      <span className="material-symbols-outlined text-[14px] text-outline shrink-0">drag_indicator</span>
                      <span className="material-symbols-outlined text-[18px] text-outline">
                        {typeIcons[lesson.type] || 'article'}
                      </span>

                      {isLessonEditing ? (
                        <div className="flex-1 space-y-2" onClick={(e) => e.stopPropagation()}>
                          <Input
                            value={lessonForm.title}
                            onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                            placeholder="Título de la lección"
                          />
                          <textarea
                            value={lessonForm.content}
                            onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                            rows={4}
                            placeholder="Contenido de la lección (soporta texto estructurado)"
                            className="w-full px-3 py-2.5 text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-outline resize-none"
                          />
                          <p className="text-[10px] text-outline">
                            Soporta: **negrita**, *cursiva*, listas con guiones, títulos con #
                          </p>
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleUpdateLesson(lesson.id)} loading={saving}>
                              Guardar
                            </Button>
                            <Button size="sm" variant="secondary" onClick={() => setEditingLessonId(null)}>
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-on-surface truncate">{lesson.title}</p>
                            <p className="text-[10px] text-outline">{typeLabels[lesson.type] || 'Texto'}</p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => handleMoveLesson(mod.lessons, lesson.id, 'up')}
                              disabled={lessonIdx === 0 || saving}
                              className="p-0.5 rounded hover:bg-surface-container-high disabled:opacity-30"
                              title="Subir"
                            >
                              <span className="material-symbols-outlined text-[14px] text-outline">arrow_upward</span>
                            </button>
                            <button
                              onClick={() => handleMoveLesson(mod.lessons, lesson.id, 'down')}
                              disabled={lessonIdx === mod.lessons.length - 1 || saving}
                              className="p-0.5 rounded hover:bg-surface-container-high disabled:opacity-30"
                              title="Bajar"
                            >
                              <span className="material-symbols-outlined text-[14px] text-outline">arrow_downward</span>
                            </button>
                            <button
                              onClick={() => {
                                setEditingLessonId(lesson.id);
                                setLessonForm({ title: lesson.title, content: lesson.content || '' });
                              }}
                              className="p-0.5 rounded hover:bg-surface-container-high"
                              title="Editar"
                            >
                              <span className="material-symbols-outlined text-[14px] text-outline">edit</span>
                            </button>
                            <button
                              onClick={() => handleDeleteLesson(lesson.id)}
                              disabled={saving}
                              className="p-0.5 rounded hover:bg-error-container/20"
                              title="Eliminar"
                            >
                              <span className="material-symbols-outlined text-[14px] text-error">delete</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}

                {/* Quizzes */}
                {mod.quizzes.length > 0 && (
                  <div className="px-4 pt-3">
                    <p className="text-[10px] font-semibold text-outline uppercase tracking-wider mb-2">Evaluaciones</p>
                  </div>
                )}
                {mod.quizzes.map((quiz) => {
                  const isQuizEditing = editingQuizId === quiz.id;

                  return (
                    <div key={quiz.id} className="px-4 py-2.5 border-b border-outline-variant/10 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[18px] text-primary-container">quiz</span>

                        {isQuizEditing ? (
                          <div className="flex-1 space-y-2" onClick={(e) => e.stopPropagation()}>
                            <Input
                              value={quizForm.title}
                              onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                              placeholder="Título del quiz"
                            />
                            <Input
                              value={quizForm.description}
                              onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                              placeholder="Descripción (opcional)"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={() => handleUpdateQuiz(quiz.id)} loading={saving}>
                                Guardar
                              </Button>
                              <Button size="sm" variant="secondary" onClick={() => setEditingQuizId(null)}>
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-on-surface">{quiz.title}</p>
                              <p className="text-[10px] text-outline">{quiz.questions.length} preguntas</p>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => {
                                  setEditingQuizId(quiz.id);
                                  setQuizForm({ title: quiz.title, description: quiz.description || '' });
                                }}
                                className="p-0.5 rounded hover:bg-surface-container-high"
                                title="Editar"
                              >
                                <span className="material-symbols-outlined text-[14px] text-outline">edit</span>
                              </button>
                              <button
                                onClick={() => handleDeleteQuiz(quiz.id)}
                                disabled={saving}
                                className="p-0.5 rounded hover:bg-error-container/20"
                                title="Eliminar"
                              >
                                <span className="material-symbols-outlined text-[14px] text-error">delete</span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Questions */}
                      {!isQuizEditing && (
                        <div className="ml-8 mt-2 space-y-2">
                          {quiz.questions.map((q, qIdx) => {
                            const isQuestionEditing = editingQuestionId === q.id;

                            return (
                              <div key={q.id} className="bg-surface-container-low/50 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                  <span className="text-[10px] font-bold text-outline mt-0.5">{qIdx + 1}.</span>

                                  {isQuestionEditing ? (
                                    <div className="flex-1 space-y-2" onClick={(e) => e.stopPropagation()}>
                                      <Input
                                        value={questionForm.question}
                                        onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                                        placeholder="Texto de la pregunta"
                                      />
                                      <Input
                                        type="number"
                                        value={questionForm.points}
                                        onChange={(e) => setQuestionForm({ ...questionForm, points: parseInt(e.target.value) || 1 })}
                                        label="Puntaje"
                                        min={1}
                                      />
                                      <div className="flex gap-2">
                                        <Button size="sm" onClick={() => handleUpdateQuestion(q.id)} loading={saving}>
                                          Guardar
                                        </Button>
                                        <Button size="sm" variant="secondary" onClick={() => setEditingQuestionId(null)}>
                                          Cancelar
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-on-surface">{q.question}</p>
                                        <p className="text-[10px] text-outline mt-0.5">
                                          {q.points} punto{q.points !== 1 ? 's' : ''} · Selección única
                                        </p>

                                        {/* Options */}
                                        <div className="mt-2 space-y-1">
                                          {q.options.map((opt) => (
                                            <div key={opt.id} className="flex items-center gap-2 group">
                                              <button
                                                onClick={() => !opt.isCorrect && handleSetCorrectOption(q.id, opt.id)}
                                                className={`w-3.5 h-3.5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                                                  opt.isCorrect
                                                    ? 'border-primary bg-primary'
                                                    : 'border-outline-variant hover:border-primary/50'
                                                }`}
                                                title={opt.isCorrect ? 'Respuesta correcta' : 'Marcar como correcta'}
                                              >
                                                {opt.isCorrect && (
                                                  <span className="material-symbols-outlined text-[10px] text-white">check</span>
                                                )}
                                              </button>
                                              {editingOptionId === opt.id ? (
                                                <div className="flex-1 flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                                                  <Input
                                                    value={optionForm.text}
                                                    onChange={(e) => setOptionForm({ text: e.target.value })}
                                                    className="flex-1"
                                                  />
                                                  <Button size="sm" onClick={() => handleUpdateOption(opt.id)} loading={saving}>
                                                    OK
                                                  </Button>
                                                  <Button size="sm" variant="ghost" onClick={() => setEditingOptionId(null)}>
                                                    ✕
                                                  </Button>
                                                </div>
                                              ) : (
                                                <>
                                                  <span className={`text-xs flex-1 ${opt.isCorrect ? 'font-semibold text-primary' : 'text-on-surface'}`}>
                                                    {opt.text}
                                                  </span>
                                                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                      onClick={() => {
                                                        setEditingOptionId(opt.id);
                                                        setOptionForm({ text: opt.text });
                                                      }}
                                                      className="p-0.5 rounded hover:bg-surface-container-high"
                                                    >
                                                      <span className="material-symbols-outlined text-[12px] text-outline">edit</span>
                                                    </button>
                                                    <button
                                                      onClick={() => handleDeleteOption(opt.id)}
                                                      className="p-0.5 rounded hover:bg-error-container/20"
                                                    >
                                                      <span className="material-symbols-outlined text-[12px] text-error">delete</span>
                                                    </button>
                                                  </div>
                                                </>
                                              )}
                                            </div>
                                          ))}

                                          {/* Add option */}
                                          {showNewOption === q.id ? (
                                            <div className="flex items-center gap-2 mt-1" onClick={(e) => e.stopPropagation()}>
                                              <Input
                                                value={newOptionForm.text}
                                                onChange={(e) => setNewOptionForm({ text: e.target.value })}
                                                placeholder="Texto de la opción"
                                                className="flex-1"
                                                onKeyDown={(e) => {
                                                  if (e.key === 'Enter') handleCreateOption(q.id, false);
                                                }}
                                              />
                                              <Button size="sm" onClick={() => handleCreateOption(q.id, false)} loading={saving}>
                                                Agregar
                                              </Button>
                                              <Button size="sm" variant="ghost" onClick={() => setShowNewOption(null)}>
                                                ✕
                                              </Button>
                                            </div>
                                          ) : (
                                            q.options.length < 6 && (
                                              <button
                                                onClick={() => setShowNewOption(q.id)}
                                                className="inline-flex items-center gap-1 text-[10px] font-semibold text-primary hover:text-secondary transition-colors mt-1"
                                              >
                                                <span className="material-symbols-outlined text-[12px]">add</span>
                                                Agregar opción
                                              </button>
                                            )
                                          )}
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-1 shrink-0">
                                        <button
                                          onClick={() => {
                                            setEditingQuestionId(q.id);
                                            setQuestionForm({ question: q.question, points: q.points });
                                          }}
                                          className="p-0.5 rounded hover:bg-surface-container-high"
                                          title="Editar"
                                        >
                                          <span className="material-symbols-outlined text-[14px] text-outline">edit</span>
                                        </button>
                                        <button
                                          onClick={() => handleDeleteQuestion(q.id)}
                                          disabled={saving}
                                          className="p-0.5 rounded hover:bg-error-container/20"
                                          title="Eliminar"
                                        >
                                          <span className="material-symbols-outlined text-[14px] text-error">delete</span>
                                        </button>
                                      </div>
                                    </>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {/* Add question */}
                          {showNewQuestion === quiz.id ? (
                            <div className="bg-surface-container-low/30 rounded-lg p-3 space-y-2" onClick={(e) => e.stopPropagation()}>
                              <Input
                                value={newQuestionForm.question}
                                onChange={(e) => setNewQuestionForm({ ...newQuestionForm, question: e.target.value })}
                                placeholder="Texto de la pregunta"
                              />
                              <Input
                                type="number"
                                value={newQuestionForm.points}
                                onChange={(e) => setNewQuestionForm({ ...newQuestionForm, points: parseInt(e.target.value) || 1 })}
                                label="Puntaje"
                                min={1}
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleCreateQuestion(quiz.id)} loading={saving}>
                                  Crear pregunta
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => setShowNewQuestion(null)}>
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setShowNewQuestion(quiz.id)}
                              className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:text-secondary transition-colors ml-2"
                            >
                              <span className="material-symbols-outlined text-[14px]">add</span>
                              Agregar pregunta
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Action buttons */}
                <div className="flex items-center gap-2 px-4 py-3">
                  {showNewLesson === mod.id ? (
                    <div className="flex-1 space-y-2" onClick={(e) => e.stopPropagation()}>
                      <Input
                        value={newLessonForm.title}
                        onChange={(e) => setNewLessonForm({ ...newLessonForm, title: e.target.value })}
                        placeholder="Título de la lección"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCreateLesson(mod.id);
                        }}
                      />
                      <textarea
                        value={newLessonForm.content}
                        onChange={(e) => setNewLessonForm({ ...newLessonForm, content: e.target.value })}
                        rows={3}
                        placeholder="Contenido (opcional - puedes editarlo después)"
                        className="w-full px-3 py-2.5 text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-outline resize-none"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleCreateLesson(mod.id)} loading={saving}>
                          Crear lección
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => setShowNewLesson(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : showNewQuiz === mod.id ? (
                    <div className="flex-1 space-y-2" onClick={(e) => e.stopPropagation()}>
                      <Input
                        value={newQuizForm.title}
                        onChange={(e) => setNewQuizForm({ ...newQuizForm, title: e.target.value })}
                        placeholder="Título del quiz"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCreateQuiz(mod.id);
                        }}
                      />
                      <Input
                        value={newQuizForm.description}
                        onChange={(e) => setNewQuizForm({ ...newQuizForm, description: e.target.value })}
                        placeholder="Descripción (opcional)"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleCreateQuiz(mod.id)} loading={saving}>
                          Crear quiz
                        </Button>
                        <Button size="sm" variant="secondary" onClick={() => setShowNewQuiz(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowNewLesson(mod.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-secondary transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">add</span>
                        Agregar lección
                      </button>
                      <button
                        onClick={() => setShowNewQuiz(mod.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-container hover:text-secondary transition-colors"
                      >
                        <span className="material-symbols-outlined text-[16px]">quiz</span>
                        Agregar quiz
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* New module form */}
      {showNewModule ? (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-4 space-y-3">
          <p className="text-xs font-semibold text-on-surface">Nuevo módulo</p>
          <Input
            value={newModuleForm.title}
            onChange={(e) => setNewModuleForm({ ...newModuleForm, title: e.target.value })}
            placeholder="Título del módulo"
          />
          <Input
            value={newModuleForm.description}
            onChange={(e) => setNewModuleForm({ ...newModuleForm, description: e.target.value })}
            placeholder="Descripción (opcional)"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleCreateModule} loading={saving}>
              Crear módulo
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setShowNewModule(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowNewModule(true)}
          className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-outline-variant/30 text-sm font-semibold text-on-surface-variant hover:border-primary/30 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Agregar módulo
        </button>
      )}
    </div>
  );
}
