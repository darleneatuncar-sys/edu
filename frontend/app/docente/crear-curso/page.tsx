'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import * as api from '@/src/api';

export default function CrearCursoPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [level, setLevel] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<api.Category[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('El título es requerido');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      const course = await api.createCourse({
        title: title.trim(),
        description: description.trim() || undefined,
        categoryId: categoryId || undefined,
      });
      router.push(`/docente/cursos/${course.id}/contenido`);
    } catch (e: any) {
      setError(e.message || 'Error al crear el curso');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-on-surface">Crear nuevo curso</h1>
        <p className="text-sm text-on-surface-variant mt-1">
          Completa la información básica para crear tu curso
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded-lg bg-error-container/20 border border-error/20 text-sm text-error flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">error</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 p-5 space-y-4">
          <h2 className="text-sm font-bold text-on-surface">Información del curso</h2>

          <Input
            label="Título del curso"
            placeholder="Ej: Desarrollo Web Full Stack"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-on-surface block">Descripción</label>
            <textarea
              placeholder="Describe de qué trata tu curso..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-3 py-2.5 text-sm bg-surface-container-low border border-outline-variant/30 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-outline resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Categoría"
              placeholder="Seleccionar categoría"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              options={categories.map((c) => ({ value: c.id, label: c.name }))}
            />

            <Select
              label="Nivel"
              placeholder="Seleccionar nivel"
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
          <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-outline-variant/30 rounded-lg hover:border-primary/30 transition-colors cursor-pointer">
            <div className="text-center">
              <span className="material-symbols-outlined text-[28px] text-outline mb-1">cloud_upload</span>
              <p className="text-xs text-on-surface-variant">
                Arrastra una imagen o haz clic para seleccionar
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
          >
            Cancelar
          </Button>
          <Button type="submit" loading={isLoading}>
            Guardar como borrador
          </Button>
        </div>
      </form>
    </div>
  );
}
