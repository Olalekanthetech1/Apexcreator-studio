import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-slide-up">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl backdrop-blur-md transition-all ${
          isSuccess
            ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200'
            : isError
            ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
            : 'bg-blue-950/90 border-blue-500/40 text-blue-200'
        }`}
      >
        {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-400 shrink-0" />}
        <span className="text-sm font-medium leading-snug">{toast.message}</span>
      </div>
    </div>
  );
};
