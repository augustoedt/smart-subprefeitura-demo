import React from 'react';
import { useApp } from '../context/AppContext';
import { MapEngineInfo, MapEngineType } from '../types';
import { 
  X, CheckCircle2, Layers, Globe, Radio, Flame, BarChart3, 
  Sparkles, Compass, ShieldCheck, Cpu, ArrowRight
} from 'lucide-react';

interface ModalMotoresCartograficosProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalMotoresCartograficos({
  isOpen,
  onClose
}: ModalMotoresCartograficosProps) {
  const { activeMapEngine, setActiveMapEngine, availableEngines } = useApp();

  if (!isOpen) return null;

  const getEngineIcon = (id: MapEngineType) => {
    switch (id) {
      case 'LEAFLET':
        return <Layers className="w-5 h-5 text-blue-400" />;
      case 'MAPLIBRE_GL':
        return <Globe className="w-5 h-5 text-sky-400" />;
      case 'SATELITE_ORTOFOTO':
        return <Layers className="w-5 h-5 text-emerald-400" />;
      case 'CHOROPLETH_32_SUBS':
        return <BarChart3 className="w-5 h-5 text-indigo-400" />;
      case 'SERVICE_BUFFERS':
        return <Radio className="w-5 h-5 text-purple-400" />;
      case 'HEATMAP_KERNEL':
        return <Flame className="w-5 h-5 text-amber-400" />;
      default:
        return <Compass className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9995] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-slate-900 text-white rounded-3xl border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header com Design Ergonômico */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Motores Cartográficos de Alta Resolução
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-900/60 text-blue-300 border border-blue-700/50">
                  {availableEngines.length} Motores Ativos
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Alterne instantaneamente o pipeline de renderização geoespacial com preservação de estado e camadas.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            title="Fechar modal de motores"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Grade Ergonômica de Cartões de Motores */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
            {availableEngines.map((engine) => {
              const isSelected = activeMapEngine === engine.id;

              return (
                <div
                  key={engine.id}
                  onClick={() => {
                    setActiveMapEngine(engine.id);
                  }}
                  className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-3 text-left group ${
                    isSelected
                      ? 'border-blue-500 bg-blue-950/40 shadow-lg shadow-blue-900/20 ring-1 ring-blue-400/50'
                      : 'border-slate-800 bg-slate-800/60 hover:bg-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    {/* Top Badges & Status */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-900 text-sky-300 border border-slate-700">
                        {engine.badge}
                      </span>
                      {isSelected ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Ativo
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors">
                          Clique para ativar
                        </span>
                      )}
                    </div>

                    {/* Nome e Ícone */}
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/80 shrink-0">
                        {getEngineIcon(engine.id)}
                      </div>
                      <h4 className="font-bold text-sm sm:text-base text-white group-hover:text-sky-300 transition-colors">
                        {engine.nome}
                      </h4>
                    </div>

                    {/* Especificação da Biblioteca */}
                    <div className="text-[11px] font-mono text-slate-400 mb-2">
                      {engine.biblioteca}
                    </div>

                    {/* Descrição da Finalidade Analítica */}
                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                      {engine.descricao}
                    </p>
                  </div>

                  {/* Botão de Ação Ergonômico (mínimo 44px de altura) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMapEngine(engine.id);
                      onClose();
                    }}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 min-h-[44px] ${
                      isSelected
                        ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
                        : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Motor em Operação</span>
                      </>
                    ) : (
                      <>
                        <span>Alternar e Ver no Mapa</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Rodapé Informativo */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Camadas, filtros e pontos de calor permanecem 100% sincronizados entre todos os motores.</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors min-h-[44px]"
          >
            Retornar ao Mapa
          </button>
        </div>
      </div>
    </div>
  );
}
