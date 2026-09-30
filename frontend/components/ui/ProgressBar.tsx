interface ProgressBarProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md';
  showLabel?: boolean;
  label?: string;
}

export function ProgressBar({ value, max = 100, size = 'sm', showLabel = false, label }: ProgressBarProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100);
  const heights = { sm: 'h-1.5', md: 'h-2.5' };

  return (
    <div className="w-full">
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-on-surface-variant">{label || 'Progreso'}</span>
          <span className="text-xs font-semibold text-primary">{percent}%</span>
        </div>
      )}
      <div className={`w-full bg-surface-container-high rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className="h-full bg-primary-container rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
