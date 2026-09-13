import React from 'react';
import { CampusNotice } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notices: CampusNotice[];
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({ isOpen, onClose, notices }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6 bg-slate-900/30 backdrop-blur-xs animate-in fade-in">
      <div 
        className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] overflow-hidden mt-14"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">notifications_active</span>
            <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">
              Notificaciones Institucionales
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-outline hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-3 divide-y divide-[#E2E8F0] max-h-[70vh] overflow-y-auto">
          {notices.map((n) => (
            <div key={n.id} className="py-3 first:pt-1 last:pb-1 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 rounded bg-blue-50">
                  {n.category}
                </span>
                <span className="text-[10px] text-outline">{n.date}</span>
              </div>
              <h4 className="text-xs font-bold text-on-surface leading-snug">{n.title}</h4>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">{n.summary}</p>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-[#E2E8F0] bg-surface-container-low text-center">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-primary hover:underline"
          >
            Marcar todas como leídas
          </button>
        </div>
      </div>
    </div>
  );
};
