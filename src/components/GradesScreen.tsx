import React, { useState } from 'react';
import { Course, Assignment, RubricCriterion, UserRole } from '../types';

interface GradesScreenProps {
  courses: Course[];
  role: UserRole;
  selectedAssignmentFromCourse?: Assignment | null;
}

export const GradesScreen: React.FC<GradesScreenProps> = ({
  courses,
  role,
  selectedAssignmentFromCourse
}) => {
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0]?.id || 'inf-402');
  const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];

  // Active rubric assignment for interactive viewer
  const [activeAssignment, setActiveAssignment] = useState<Assignment>(() => {
    if (selectedAssignmentFromCourse) return selectedAssignmentFromCourse;
    return currentCourse.assignments[0];
  });

  // Local state for interactive rubric scoring (teachers can grade, students can explore criteria)
  const [rubricScores, setRubricScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    if (activeAssignment.rubric) {
      activeAssignment.rubric.forEach((crit) => {
        initial[crit.id] = crit.selectedLevelIndex ?? 0;
      });
    }
    return initial;
  });

  // Switch assignment
  const handleSelectAssignment = (asg: Assignment) => {
    setActiveAssignment(asg);
    if (asg.rubric) {
      const updated: Record<string, number> = {};
      asg.rubric.forEach((crit) => {
        updated[crit.id] = crit.selectedLevelIndex ?? 0;
      });
      setRubricScores(updated);
    }
  };

  const handleSelectRubricLevel = (criterionId: string, levelIndex: number) => {
    setRubricScores((prev) => ({
      ...prev,
      [criterionId]: levelIndex
    }));
  };

  // Calculate live rubric score
  const calculatedTotal = activeAssignment.rubric
    ? activeAssignment.rubric.reduce((acc, crit) => {
        const levelIdx = rubricScores[crit.id] ?? 0;
        const pts = crit.levels[levelIdx]?.points || 0;
        return acc + pts;
      }, 0)
    : activeAssignment.score || 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Course Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
            Calificaciones & Rúbricas Académicas
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
            Registro ponderado, rúbricas analíticas por competencias y actas oficiales
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="course-select" className="text-xs text-outline font-semibold">
            Asignatura:
          </label>
          <select
            id="course-select"
            value={selectedCourseId}
            onChange={(e) => {
              const newId = e.target.value;
              setSelectedCourseId(newId);
              const found = courses.find((c) => c.id === newId);
              if (found && found.assignments[0]) {
                handleSelectAssignment(found.assignments[0]);
              }
            }}
            className="text-xs font-semibold bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-on-surface shadow-2xs focus:outline-none focus:border-primary"
          >
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Course Grade Summary KPI */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-5 shadow-2xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-[#E2E8F0]">
          <div className="sm:pr-4">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-1">
              Promedio Actual
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-primary">
                {currentCourse.currentAverage || 18.2}
              </span>
              <span className="text-xs text-outline">/ 20.0</span>
            </div>
            <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-600">
              Aprobado • Rango Sobresaliente
            </span>
          </div>

          <div className="pt-3 sm:pt-0 sm:px-4">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-1">
              Evaluaciones Completadas
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface">
                {currentCourse.assignments.filter((a) => a.status === 'calificado').length}
              </span>
              <span className="text-xs text-outline">/ {currentCourse.assignments.length}</span>
            </div>
            <p className="text-[11px] text-on-surface-variant mt-1">40% de ponderación evaluada</p>
          </div>

          <div className="pt-3 sm:pt-0 sm:px-4">
            <span className="text-[11px] font-bold text-outline uppercase tracking-wider block mb-1">
              Nota Mínima Requerida
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-on-surface">11.0</span>
              <span className="text-xs text-outline">Puntaje mínimo</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold mt-1">
              Condición: Cumpliendo holgadamente
            </p>
          </div>

          <div className="pt-3 sm:pt-0 sm:pl-4 flex flex-col justify-center">
            <button
              type="button"
              onClick={() => alert('Generando Boleta de Notas Oficial con firma digital...')}
              className="w-full py-2.5 px-3 rounded-lg bg-surface-container-low hover:bg-surface-container border border-[#E2E8F0] text-primary font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">print</span>
              <span>Descargar Boleta de Notas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gradebook Table adhering to specs:
          "Table rows feature alternate micro-hover states (#F8FAFC). Row height set to 52px. Dividers strictly use #E2E8F0. Header labels in label-sm with #64748B." */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider">
              Desglose Ponderado de Evaluaciones
            </h2>
            <p className="text-xs text-on-surface-variant">
              Haz clic en cualquier evaluación para inspeccionar su rúbrica detallada
            </p>
          </div>
          <span className="text-xs text-outline font-semibold">Sistema Vigesimal (0 - 20)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-surface-container-low">
                <th className="py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider">
                  Evaluación
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider">
                  Tipo
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider">
                  Peso
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider">
                  Fecha
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider">
                  Estado
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider text-right">
                  Nota / Máximo
                </th>
                <th className="py-3 px-4 text-xs font-semibold text-[#64748B] tracking-wider text-center">
                  Rúbrica
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-xs">
              {currentCourse.assignments.map((asg) => {
                const isSelected = activeAssignment.id === asg.id;
                return (
                  <tr
                    key={asg.id}
                    onClick={() => handleSelectAssignment(asg)}
                    className={`h-[52px] transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#EFF6FF]'
                        : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <td className="py-3 px-4 font-bold text-on-surface">
                      <div className="flex items-center gap-2">
                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
                        )}
                        <span>{asg.title}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 uppercase text-[11px] font-semibold text-outline">
                      {asg.type}
                    </td>
                    <td className="py-3 px-4 font-semibold text-on-surface">
                      {asg.weightPercent}%
                    </td>
                    <td className="py-3 px-4 text-on-surface-variant">
                      {asg.dueDate}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          asg.status === 'calificado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : asg.status === 'entregado'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {asg.status === 'calificado' ? 'Calificado' : asg.status === 'entregado' ? 'Entregado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-sm">
                      {asg.score !== undefined ? (
                        <span className="text-primary">{asg.score} <span className="text-outline text-xs font-normal">/ {asg.maxScore}</span></span>
                      ) : (
                        <span className="text-outline font-normal">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="material-symbols-outlined text-[18px] text-primary">
                        rule
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Rubric Section - Implements the specific requirement:
          "Rubric score selector: Segmented card controls with 1px #E2E8F0 borders that fill to #EFF6FF with a #2563EB border when selected" */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 sm:p-6 shadow-2xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E2E8F0] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary-fixed text-primary uppercase">
                Rúbrica Analítica de Evaluación
              </span>
              <span className="text-xs text-outline">• {activeAssignment.title}</span>
            </div>
            <h3 className="text-base font-bold text-on-surface mt-1">
              Criterios de Calificación y Desempeño
            </h3>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <div className="text-right">
              <span className="text-[11px] text-outline font-medium block">Puntaje Obtenido</span>
              <span className="text-2xl font-bold text-primary">{calculatedTotal}</span>
              <span className="text-xs text-outline"> / {activeAssignment.maxScore}</span>
            </div>
          </div>
        </div>

        {activeAssignment.rubric && activeAssignment.rubric.length > 0 ? (
          <div className="space-y-6">
            {activeAssignment.rubric.map((criterion: RubricCriterion) => {
              const selectedLevel = rubricScores[criterion.id] ?? 0;
              return (
                <div key={criterion.id} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-on-surface">
                        {criterion.name}
                      </h4>
                      <span className="text-[11px] text-outline">
                        Ponderación de criterio: {criterion.weightPercent}% (Máx. {criterion.maxPoints} pts)
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-surface-container font-bold text-xs text-primary">
                      {criterion.levels[selectedLevel]?.points || 0} pts asignados
                    </span>
                  </div>

                  {/* Segmented card controls with 1px #E2E8F0 borders that fill to #EFF6FF with a #2563EB border when selected */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {criterion.levels.map((lvl, index) => {
                      const isSelected = selectedLevel === index;
                      return (
                        <div
                          key={index}
                          onClick={() => handleSelectRubricLevel(criterion.id, index)}
                          className={`p-3.5 rounded-lg transition-all cursor-pointer flex flex-col justify-between ${
                            isSelected
                              ? 'bg-[#EFF6FF] border border-[#2563EB] shadow-xs'
                              : 'bg-white border border-[#E2E8F0] hover:border-slate-300 hover:bg-[#F8FAFC]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className={`text-xs font-bold ${isSelected ? 'text-[#2563EB]' : 'text-on-surface'}`}>
                                {lvl.label}
                              </span>
                              <span className={`text-xs font-mono font-bold px-1.5 py-0.5 rounded ${
                                isSelected ? 'bg-blue-200 text-blue-900' : 'bg-surface-container text-outline'
                              }`}>
                                {lvl.points} pts
                              </span>
                            </div>
                            <p className="text-[11px] text-on-surface-variant leading-relaxed">
                              {lvl.description}
                            </p>
                          </div>

                          <div className="mt-3 pt-2 border-t border-slate-200/50 flex items-center justify-between">
                            <span className="text-[10px] text-outline">
                              {isSelected ? 'Criterio Seleccionado' : 'Seleccionar nivel'}
                            </span>
                            <span className={`material-symbols-outlined text-[16px] ${isSelected ? 'text-[#2563EB]' : 'text-slate-300'}`}>
                              {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {role === 'faculty' && (
              <div className="pt-4 border-t border-[#E2E8F0] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => alert('Nota y rúbrica guardadas y sincronizadas con el Acta Oficial.')}
                  className="px-4 py-2.5 rounded-lg bg-primary-container hover:bg-secondary text-white font-semibold text-xs flex items-center gap-2 shadow-2xs transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">save</span>
                  <span>Guardar Calificación en Acta de Notas</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-6 text-center text-outline text-xs bg-surface-container-low rounded-xl">
            Esta evaluación cuenta con calificación cuantitativa directa sin rúbrica matricial.
          </div>
        )}
      </div>
    </div>
  );
};
