import React from 'react';
import BrasaoSaoPaulo from './BrasaoSaoPaulo';
import { MapPin, Phone, Building, CheckCircle2 } from 'lucide-react';

interface SubprefeituraHeaderBadgeProps {
  variant?: 'light' | 'dark' | 'compact' | 'official-seal';
  className?: string;
  showJurisdicao?: boolean;
  showEndereco?: boolean;
}

export default function SubprefeituraHeaderBadge({
  variant = 'light',
  className = '',
  showJurisdicao = true,
  showEndereco = false
}: SubprefeituraHeaderBadgeProps) {
  const isDark = variant === 'dark';

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <BrasaoSaoPaulo size={28} />
        <div className="flex flex-col">
          <span className={`text-[9px] font-bold tracking-wider uppercase leading-none ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            PMSP • SMSUB
          </span>
          <span className={`text-xs font-black tracking-tight leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Subprefeitura Vila Mariana
          </span>
        </div>
      </div>
    );
  }

  if (variant === 'official-seal') {
    return (
      <div className={`p-4 rounded-xl border-2 flex items-center gap-4 ${
        isDark 
          ? 'bg-slate-900/90 border-amber-500/40 text-white' 
          : 'bg-white border-blue-900/20 text-slate-900 shadow-sm'
      } ${className}`}>
        <BrasaoSaoPaulo size={52} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
              Expediente Oficial
            </span>
            <span className="text-[10px] text-slate-400 font-mono">SUB-VM/SMSUB/2026</span>
          </div>
          <h2 className="text-base font-black tracking-tight mt-0.5">
            PREFEITURA DA CIDADE DE SÃO PAULO
          </h2>
          <p className="text-xs font-bold text-blue-700">
            SUBPREFEITURA VILA MARIANA — JURISDIÇÃO OFICIAL
          </p>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
            <span>Vila Mariana</span> • <span>Moema</span> • <span>Saúde</span>
            <span className="text-slate-300">|</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" /> Sede: R. José de Magalhães, 500</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <BrasaoSaoPaulo size={36} />
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-extrabold tracking-widest uppercase ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
            Cidade de São Paulo
          </span>
          <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
            isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
          }`}>
            SMSUB
          </span>
        </div>

        <h1 className={`text-sm sm:text-base font-black tracking-tight leading-tight flex items-center gap-2 ${
          isDark ? 'text-white' : 'text-slate-900'
        }`}>
          Subprefeitura Vila Mariana
          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-blue-900 text-white shadow-2xs">
            SUB-VM
          </span>
        </h1>

        {showJurisdicao && (
          <p className={`text-[11px] font-medium leading-none mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-500'}`}>
            Distritos: <strong className={isDark ? 'text-white' : 'text-slate-700'}>Vila Mariana</strong> • <strong className={isDark ? 'text-white' : 'text-slate-700'}>Moema</strong> • <strong className={isDark ? 'text-white' : 'text-slate-700'}>Saúde</strong>
          </p>
        )}

        {showEndereco && (
          <p className={`text-[10px] mt-1 flex items-center gap-2 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Rua José de Magalhães, 500
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Phone className="w-3 h-3" /> SP156 / (11) 3397-4100
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
