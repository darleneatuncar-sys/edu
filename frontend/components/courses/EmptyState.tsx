import Link from 'next/link';

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-[32px] text-outline">school</span>
      </div>
      <h3 className="text-base font-bold text-on-surface mb-1">
        Todavía no estás inscrito en ningún curso
      </h3>
      <p className="text-sm text-on-surface-variant mb-6 max-w-sm">
        Explora nuestros cursos disponibles y comienza a aprender algo nuevo hoy.
      </p>
      <Link
        href="/explorar"
        className="px-5 py-2.5 rounded-lg bg-primary-container text-white text-sm font-semibold hover:bg-secondary transition-colors"
      >
        Explorar cursos
      </Link>
    </div>
  );
}
