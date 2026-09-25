'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { CourseStatusBadge } from '@/components/instructor/CourseStatusBadge';
import * as api from '@/src/api';

export default function EditarCursoPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;

  const [course, setCourse] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [level, setLevel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<api.Category[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [courseData, cats] = await Promise.all([
          api.getCourseForEdit(courseId),
          api.getCategories(),
        ]);
        setCourse(courseData);
        setTitle(courseData.title);
        setDescription(courseData.description || '');
        setCategoryId(courseData.categoryId || '');
        setCategories(cats);
      } catch (e: any) {
        setError(e.message || 'Error al cargar el curso');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [courseId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('El título es requerido');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await api.updateCourse(courseId, {
        title: title.trim(),
        description: description.trim() || undefined,
        categoryId: categoryId || undefined,
      });
      setCourse({ ...course, title: title.trim(), description: description.trim() });
    } catch (e: any) {
      setError(e.message || 'Error al guardar');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-center py-16">
          <span className="material-symbols-outlined animate-spin text-[32px] text-primary-container">progress_activity</span>
          <span className="ml-3 text-sm text-on-surface-variant">Cargando curso...</span>
        </div>
      </div>
    );
  }

  if (error && !course) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="material-symbols-outlined text-[48px] text-outline mb-3">error_outline</span>
          <h2 className="text-lg font-bold text-on-surface mb-1">{error}</h2>
          <Link href="/docente/mis-cursos" className="text-sm text-primary font-semibold hover:underline">
            Volver a mis cursos
          </Link>
        </div>
      </div>
    );
  }

  const status = course?.isPublished ? 'published' : 'draft';

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Link
        href="/docente/mis-cursos"
        className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-on-surface transition-colors mb-4"
      >
        <span className="material-symbols-outlined text-[16px]">arrow_back</span>
        Mis cursos
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Editar curso</h1>
        <CourseStatusBadge status={status} />
      </div>

      <div className="flex items-center gap-2 mb-6">
        <Link
          href={`/docente/cursos/${courseId}/editar`}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-container text-white"
        >
          Información
        </Link>
        <Link
          href={`/docente/cursos/${courseId}/contenido`}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-surface-container-low text-on-surface-variant hover:bg-surface-container transition-colors"
        >
          Contenido
        </Link>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-error-container/20 border border-error/20 text-sm text-error flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-5">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5 space-y-4">
          <h2 className="text-sm font-bold text-on-surface">Información del curso</h2>

          <Input
            label="Título del curso"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface block">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2.5 text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-outline resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Categoría"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />

            <Select
              label="Nivel"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              options={[
                { value: 'principiante', label: 'Principiante' },
                { value: 'intermedio', label: 'Intermedio' },
                { value: 'avanzado', label: 'Avanzado' },
              ]}
            />
          </div>
        </div>

        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5">
          <h2 className="text-sm font-bold text-on-surface mb-3">Imagen de portada</h2>
          <div className="relative w-full h-40 rounded-lg overflow-hidden bg-surface-container-high">
            {course?.bannerUrl ? (
              <img
                src={course.bannerUrl}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <span className="material-symbols-outlined text-[40px] text-outline">image</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" loading={isLoading}>
            Guardar cambios
          </Button>
        </div>
      </form>
    </div>
  );
}
