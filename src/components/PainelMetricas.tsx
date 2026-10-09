import React from 'react';
import { 
  BarChart3, X, ChevronDown, ChevronUp, AlertTriangle, 
  CheckCircle2, Clock, MapPin, Database, TrendingUp, Sparkles, Filter
} from 'lucide-react';
import { Subprefeitura, FonteDadosPublica, Chamado } from '../types';
import { AnimatedCounter } from './AnimatedCounter';
import { LiveIndicator } from './LiveIndicator';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface PainelMetricasProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSubId: string;
  selectedSubprefeitura?: Subprefeitura;
  chamados: Chamado[];
  activePublicSources: FonteDadosPublica[];
  highContrastMode: boolean;
  secondsAgo: number;
  isUpdating: boolean;
  onRefresh: () => void;
  deltaTotal: number;
  deltaAtrasados: number;
  deltaConcluidos: number;
  deltaEmAndamento: number;
  deltaNovos: number;
  categoryChartData: Array<{ nome: string; quantidade: number }>;
}

export default function PainelMetricas({
  isOpen,
  onClose,
  selectedSubId,
  selectedSubprefeitura,
  chamados,
  activePublicSources,
  highContrastMode,
  secondsAgo,
  isUpdating,
  onRefresh,
  deltaTotal,
  deltaAtrasados,
  deltaConcluidos,
  deltaEmAndamento,
  deltaNovos,
  categoryChartData
}: PainelMetricasProps) {
  if (!isOpen) return null;

  const total = Math.max(0, chamados.length + deltaTotal);
  const atrasados = Math.max(0, chamados.filter(c => c.isAtrasado).length + deltaAtrasados);
  const concluidos = Math.max(0, chamados.filter(c => c.status === 'CONCLUIDO').length + deltaConcluidos);
  const emAndamento = Math.max(0, chamados.filter(c => c.status === 'EM_EXECUCAO').length + deltaEmAndamento);
  const novos = Math.max(0, chamados.filter(c => c.status === 'NOVO').length + deltaNovos);

  const slaPercent = total > 0 ? Math.round(((total - atrasados) / total) * 100) : 100;

  return (
    <>
      {/* Backdrop para mobile (fecha ao clicar fora em telas compactas) */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-xs z-35 sm:hidden"
        onClick={onClose}
      />

      {/* Painel: Bottom Sheet em smartphones, Cartão Flutuante Ergonômico em Desktop/Tablet */}
      <div 
        className={`fixed inset-x-0 bottom-0 max-h-[85vh] sm:max-h-none sm:inset-auto sm:top-20 sm:right-4 sm:bottom-16 w-full sm:w-96 rounded-t-3xl sm:rounded-2xl border shadow-2xl flex flex-col shrink-0 overflow-hidden z-40 pointer-events-auto backdrop-blur-xl animate-in slide-in-from-bottom-8 sm:slide-in-from-right-6 duration-300 ${
          highContrastMode 
            ? 'bg-slate-900/95 border-slate-700 text-white' 
            : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-900/20'
        }`}
      >
        {/* Barra superior tátil de arraste para mobile */}
        <div className="w-12 h-1.5 bg-slate-400 dark:bg-slate-600 rounded-full mx-auto my-2 sm:hidden shrink-0" />

        {/* Header do Painel de Métricas */}
        <div className={`px-4 py-3 border-b flex items-center justify-between gap-2 shrink-0 ${
          highContrastMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50/80 border-slate-100'
        }`}>
          <div className="flex items-center gap-2 truncate">
            <div className="p-2 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div className="truncate">
              <h3 className="font-bold text-sm truncate">
                {selectedSubId === 'ALL' ? 'Análise Geral da Capital' : `Análise: ${selectedSubprefeitura?.nome}`}
              </h3>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-none truncate">
                Painel analítico da Sala de Situação
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <LiveIndicator secondsAgo={secondsAgo} isUpdating={isUpdating} onRefresh={onRefresh} />
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              title="Recolher painel de métricas (modo imersivo)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo com rolagem suave */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto space-y-4 sm:space-y-5">
          {/* Grid Principal de KPIs */}
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            <div className={`p-3.5 rounded-2xl border ${
              highContrastMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-100'
            }`}>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">Total Demandas</span>
              <p className="text-2xl font-black text-slate-900 dark:text-white">
                <AnimatedCounter value={total} />
              </p>
              <span className="text-[10px] text-slate-500 mt-0.5 block">em monitoramento</span>
            </div>

            <div className={`p-3.5 rounded-2xl border ${
              highContrastMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-100'
            }`}>
              <span className="text-[10px] text-red-400 font-bold uppercase tracking-wider block mb-1">Atrasados (SLA)</span>
              <p className="text-2xl font-black text-red-500">
                <AnimatedCounter value={atrasados} />
              </p>
              <span className="text-[10px] text-red-400 font-semibold mt-0.5 block">
                {slaPercent}% no prazo
              </span>
            </div>
          </div>

          {/* Sub-estatísticas operacionais */}
          <div className="grid grid-cols-3 gap-2">
            <div className={`p-2.5 rounded-xl border text-center ${
              highContrastMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-100'
            }`}>
              <span className="text-[10px] text-slate-400 block font-medium">Novos</span>
              <span className="text-base font-bold text-blue-500 font-mono mt-0.5 block">
                <AnimatedCounter value={novos} />
              </span>
            </div>
            <div className={`p-2.5 rounded-xl border text-center ${
              highContrastMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-100'
            }`}>
              <span className="text-[10px] text-slate-400 block font-medium">Em Andamento</span>
              <span className="text-base font-bold text-amber-500 font-mono mt-0.5 block">
                <AnimatedCounter value={emAndamento} />
              </span>
            </div>
            <div className={`p-2.5 rounded-xl border text-center ${
              highContrastMode ? 'bg-slate-800/60 border-slate-700' : 'bg-slate-50 border-slate-100'
            }`}>
              <span className="text-[10px] text-slate-400 block font-medium">Concluídos</span>
              <span className="text-base font-bold text-emerald-500 font-mono mt-0.5 block">
                <AnimatedCounter value={concluidos} />
              </span>
            </div>
          </div>

          {/* Seção das Fontes Públicas Conectadas */}
          {activePublicSources.length > 0 && (
            <div className={`p-3.5 rounded-2xl border ${
              highContrastMode ? 'bg-purple-950/40 border-purple-900' : 'bg-purple-50/70 border-purple-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                  <span className="text-xs font-bold text-purple-900 dark:text-purple-200">
                    Fontes Públicas Ativas
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-200 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-mono">
                  {activePublicSources.length} camadas
                </span>
              </div>
              <div className="space-y-1.5">
                {activePublicSources.map(s => (
                  <div key={s.id} className="flex items-center justify-between text-[11px] py-0.5">
                    <span className="text-slate-600 dark:text-slate-300 font-medium truncate pr-2">
                      {s.sigla} — {s.nome}
                    </span>
                    <span className="font-bold text-purple-600 dark:text-purple-400 shrink-0 font-mono">
                      {s.pontos.length} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Gráfico de Distribuição por Categoria Recharts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Distribuição por Categoria
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Volume SP156</span>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryChartData} layout="vertical" margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis type="category" dataKey="nome" width={100} tick={{ fontSize: 10, fill: highContrastMode ? '#94a3b8' : '#64748b' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: highContrastMode ? '#0f172a' : '#ffffff', 
                      borderRadius: '12px',
                      border: highContrastMode ? '1px solid #334155' : '1px solid #e2e8f0',
                      fontSize: '11px'
                    }} 
                  />
                  <Bar dataKey="quantidade" fill={highContrastMode ? '#38bdf8' : '#2563eb'} radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Rodapé do Painel com Ação Rápida */}
        <div className={`p-3 border-t flex items-center justify-between text-xs shrink-0 ${
          highContrastMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50 border-slate-100'
        }`}>
          <span className="text-[11px] text-slate-400 font-medium">Modo Imersivo Disponível</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all min-h-[36px] flex items-center gap-1"
          >
            <span>Ocultar Painel</span>
          </button>
        </div>
      </div>
    </>
  );
}
