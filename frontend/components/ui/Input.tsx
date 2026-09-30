'use client';

import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-xs font-semibold text-on-surface block">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[18px]">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`w-full ${icon ? 'pl-10' : 'pl-3'} pr-3 py-2.5 text-sm bg-surface-container-low border rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-outline ${
              error ? 'border-error' : 'border-outline-variant/30'
            } ${className}`}
            {...props}
          />
        </div>
        {error && (
          <p className="text-[11px] text-error flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">error</span>
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
