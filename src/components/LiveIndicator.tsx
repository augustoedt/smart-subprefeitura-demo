import React from 'react';
import { RefreshCw } from 'lucide-react';

interface LiveIndicatorProps {
  secondsAgo: number;
  onRefresh?: () => void;
  className?: string;
  isUpdating?: boolean;
}

export function LiveIndicator({
  secondsAgo,
  onRefresh,
  className = '',
  isUpdating = false,
}: LiveIndicatorProps) {
  return (
    <div
      className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full text-xs font-medium border bg-white/90 shadow-2xs backdrop-blur-xs transition-all ${
        isUpdating 
          ? 'border-emerald-300 bg-emerald-50/70 text-emerald-800 ring-2 ring-emerald-400/20' 
          : 'border-slate-200 text-slate-600'
      } ${className}`}
      title="Atualização simulada em tempo real a cada 15-20 segundos"
    >
      <span className="relative flex h-2 w-2">
        <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isUpdating ? 'bg-emerald-500 opacity-90' : 'bg-emerald-400 opacity-60'}`}></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>

      <span className="tracking-tight select-none">
        {secondsAgo === 0 ? (
          <span className="font-semibold text-emerald-700">Atualizado agora</span>
        ) : (
          <span>
            Atualizado há <strong className="font-semibold text-slate-800">{secondsAgo}</strong> {secondsAgo === 1 ? 'segundo' : 'segundos'}
          </span>
        )}
      </span>

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="ml-0.5 p-0.5 text-slate-400 hover:text-slate-700 active:scale-90 transition-transform rounded cursor-pointer"
          title="Forçar atualização dos dados agora"
        >
          <RefreshCw className={`w-3 h-3 ${isUpdating ? 'animate-spin text-emerald-600' : ''}`} />
        </button>
      )}
    </div>
  );
}
