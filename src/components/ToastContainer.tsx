import React, { useEffect, useRef } from 'react';
import { 
  CheckCircle2, AlertCircle, Info, AlertTriangle, X, ArrowRight
} from 'lucide-react';
import { SystemNotification } from '../types';

interface ToastContainerProps {
  notifications: SystemNotification[];
  onDismiss: (id: string) => void;
  onNavigate?: (section: 'sala_situacao' | 'painel_admin' | 'app_campo' | 'simulacao_zap' | 'modulo_social') => void;
}

export default function ToastContainer({ notifications, onDismiss, onNavigate }: ToastContainerProps) {
  const onDismissRef = useRef(onDismiss);
  const hasWelcomeToast = notifications.some((notification) => notification.id === 'notif-welcome');

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!hasWelcomeToast) return;

    const welcomeToastTimer = window.setTimeout(() => {
      onDismissRef.current('notif-welcome');
    }, 4000);

    return () => window.clearTimeout(welcomeToastTimer);
  }, [hasWelcomeToast]);

  if (!notifications || notifications.length === 0) return null;

  return (
    <div className="fixed top-12 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {notifications.map((n) => {
        const isSucesso = n.tipo === 'sucesso';
        const isUrgente = n.tipo === 'urgente';
        const isAlerta = n.tipo === 'alerta';

        const bgClass = isSucesso 
          ? 'bg-emerald-950/95 border-emerald-500/80 text-emerald-100 shadow-emerald-950/40'
          : isUrgente
          ? 'bg-rose-950/95 border-rose-500/80 text-rose-100 shadow-rose-950/40'
          : isAlerta
          ? 'bg-amber-950/95 border-amber-500/80 text-amber-100 shadow-amber-950/40'
          : 'bg-slate-900/95 border-blue-500/80 text-blue-100 shadow-slate-950/40';

        const IconComponent = isSucesso 
          ? CheckCircle2 
          : isUrgente 
          ? AlertTriangle 
          : isAlerta 
          ? AlertCircle 
          : Info;

        const iconColor = isSucesso 
          ? 'text-emerald-400' 
          : isUrgente 
          ? 'text-rose-400' 
          : isAlerta 
          ? 'text-amber-400' 
          : 'text-blue-400';

        return (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border backdrop-blur-md shadow-xl transition-all animate-in slide-in-from-top-2 duration-200 ${bgClass}`}
          >
            <IconComponent className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1 mb-0.5">
                <h4 className="text-xs font-bold truncate text-white">{n.titulo}</h4>
                <span className="text-[10px] text-slate-400 shrink-0">{n.timestamp}</span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">{n.mensagem}</p>
              
              {n.linkSection && onNavigate && (
                <button
                  onClick={() => {
                    onNavigate(n.linkSection!);
                    onDismiss(n.id);
                  }}
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 hover:text-amber-200 uppercase tracking-wider underline hover:no-underline transition-colors"
                >
                  <span>Visualizar no Módulo</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>

            <button
              onClick={() => onDismiss(n.id)}
              className="text-slate-400 hover:text-white p-1 rounded transition-colors shrink-0 -mr-1 -mt-1"
              title="Fechar notificação"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
