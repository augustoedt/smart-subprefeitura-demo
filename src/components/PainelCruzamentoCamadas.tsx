import React from 'react';
import { 
  HotspotCruzamento, ResumoCruzamentoCamadas, CategoriaChamado, 
  IdFonteDadosPublica, FonteDadosPublica, Chamado 
} from '../types';
import { 
  Sparkles, AlertTriangle, Shield, Users, Car, History, 
  Sliders, X, CheckCircle2, ArrowRight, MapPin, Target, 
  Compass, Radio, Flame, FileText, ChevronRight
} from 'lucide-react';

interface PainelCruzamentoCamadasProps {
  isOpen: boolean;
  onClose: () => void;
  isActive: boolean;
  onToggleActive: (active: boolean) => void;
  raioMetros: number;
  onChangeRaio: (raio: number) => void;
  categoriaSelecionada: CategoriaChamado | 'TODAS';
  onChangeCategoria: (cat: CategoriaChamado | 'TODAS') => void;
  fonteSelecionada: IdFonteDadosPublica | 'TODAS';
  onChangeFonte: (fonte: IdFonteDadosPublica | 'TODAS') => void;
  fontesDisponiveis: FonteDadosPublica[];
  hotspots: HotspotCruzamento[];
  resumo: ResumoCruzamentoCamadas;
  onSelectHotspot?: (hotspot: HotspotCruzamento) => void;
}

const CATEGORIAS_NOMES: Record<CategoriaChamado, string> = {
  MORADOR_RUA: 'Acolhimento Social',
  ARVORE_CAIDA: 'Árvore Caída',
  BUEIRO: 'Bueiro / Drenagem',
  BARULHO_PSIU: 'Barulho Urbano (PSIU)',
  CALCADA: 'Manutenção de Calçada',
  TAPA_BURACO: 'Tapa-Buraco',
  FISCALIZACAO_POSTURA: 'Fiscalização de Postura',
  DESFAZIMENTO: 'Desfazimento'
};

export default function PainelCruzamentoCamadas({
  isOpen,
  onClose,
  isActive,
  onToggleActive,
  raioMetros,
  onChangeRaio,
  categoriaSelecionada,
  onChangeCategoria,
  fonteSelecionada,
  onChangeFonte,
  fontesDisponiveis,
  hotspots,
  resumo,
  onSelectHotspot
}: PainelCruzamentoCamadasProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop para telas mobile / tablet */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
        onClick={onClose}
      />
      {/* Container: Bottom Sheet deslizante em telas compactas (max-h-[85vh] rounded-t-3xl) e Drawer lateral no desktop (sm:inset-y-0 sm:right-0 sm:w-[480px]) */}
      <div className="fixed inset-x-0 bottom-0 max-h-[85vh] sm:max-h-none sm:inset-y-0 sm:right-0 sm:left-auto w-full sm:w-[480px] bg-slate-900/95 backdrop-blur-xl border-t sm:border-t-0 sm:border-l border-slate-800 rounded-t-3xl sm:rounded-none shadow-2xl z-50 flex flex-col text-slate-100 animate-in slide-in-from-bottom-8 sm:slide-in-from-right duration-300">
        {/* Barra superior de arrasto / indicador tátil de Bottom Sheet para mobile */}
        <div className="w-12 h-1.5 bg-slate-700 rounded-full mx-auto my-2 sm:hidden shrink-0" />
        
        {/* Header do Painel */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-500/50 flex items-center justify-center text-purple-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white leading-tight flex items-center gap-2">
                Cruzamento Geoespacial
                <span className="text-[10px] bg-purple-950 text-purple-300 border border-purple-800 px-1.5 py-0.5 rounded font-mono">
                  Interno × Externo
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                Correlação espacial entre demandas SP156 e dados públicos
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fechar Painel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

      {/* Conteúdo com Rolagem */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Toggle de Ativação do Motor de Cruzamento */}
        <div className="bg-slate-800/80 border border-slate-700/80 p-3.5 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
            <div>
              <p className="font-semibold text-xs text-white">
                {isActive ? 'Motor de Correlação Ativo' : 'Motor de Correlação em Pausa'}
              </p>
              <p className="text-[11px] text-slate-400">
                {isActive ? 'Calculando sobreposição em tempo real' : 'Ative para traçar arcos e halos de risco'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onToggleActive(!isActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md ${
              isActive
                ? 'bg-purple-600 hover:bg-purple-700 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            {isActive ? 'Desativar' : 'Ativar Cruzamento'}
          </button>
        </div>

        {/* Resumo Métrico de Hotspots */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-slate-800/60 border border-slate-700/60 p-2.5 rounded-xl text-center">
            <span className="text-[10px] text-slate-400 font-medium block">Total Hotspots</span>
            <span className="text-xl font-bold text-white font-mono mt-0.5 block">{resumo.totalHotspots}</span>
            <span className="text-[10px] text-purple-400 mt-0.5 block">detectados</span>
          </div>
          <div className="bg-red-950/40 border border-red-900/60 p-2.5 rounded-xl text-center">
            <span className="text-[10px] text-red-300 font-medium block">Risco Crítico</span>
            <span className="text-xl font-bold text-red-400 font-mono mt-0.5 block">{resumo.criticos}</span>
            <span className="text-[10px] text-red-400 mt-0.5 block">ação imediata</span>
          </div>
          <div className="bg-amber-950/40 border border-amber-900/60 p-2.5 rounded-xl text-center">
            <span className="text-[10px] text-amber-300 font-medium block">Distância Média</span>
            <span className="text-xl font-bold text-amber-400 font-mono mt-0.5 block">{resumo.distanciaMediaMetros}m</span>
            <span className="text-[10px] text-amber-300 mt-0.5 block">raio de contiguidade</span>
          </div>
        </div>

        {/* Controles de Parâmetros Geoespaciais */}
        <div className="bg-slate-800/50 border border-slate-700/60 p-3.5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-purple-400" />
              <span>Parâmetros de Cruzamento</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Fórmula Haversine</span>
          </div>

          {/* Raio de Tolerância em Metros */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-slate-400">Raio de Influência Mútua:</span>
              <span className="font-bold text-sky-400 font-mono">{raioMetros} metros</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[300, 500, 800, 1200].map(r => (
                <button
                  key={`r-sel-${r}`}
                  onClick={() => onChangeRaio(r)}
                  className={`min-h-[44px] rounded-xl text-xs font-mono font-bold transition-colors flex items-center justify-center ${
                    raioMetros === r ? 'bg-purple-600 text-white shadow-md' : 'bg-slate-700/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {r}m
                </button>
              ))}
            </div>
          </div>

          {/* Fonte Externa a Cruzar */}
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Camada Externa de Referência:</label>
            <select
              value={fonteSelecionada}
              onChange={(e) => onChangeFonte(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-purple-500"
            >
              <option value="TODAS">Todas as Fontes Públicas Ativas</option>
              {fontesDisponiveis.map(f => (
                <option key={f.id} value={f.id}>
                  {f.sigla} — {f.nome}
                </option>
              ))}
            </select>
          </div>

          {/* Categoria Interna a Cruzar */}
          <div>
            <label className="text-xs text-slate-400 block mb-1.5">Categoria do Chamado SP156:</label>
            <select
              value={categoriaSelecionada}
              onChange={(e) => onChangeCategoria(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-purple-500"
            >
              <option value="TODAS">Todas as Categorias Municipais</option>
              {Object.entries(CATEGORIAS_NOMES).map(([catKey, catNome]) => (
                <option key={catKey} value={catKey}>
                  {catNome}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Lista de Hotspots de Risco Duplo */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-300 px-1">
            <span>Pontos de Maior Criticidade</span>
            <span className="text-[11px] text-slate-400 font-mono">
              {hotspots.length} correlações
            </span>
          </div>

          {hotspots.length === 0 ? (
            <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-6 text-center text-slate-500 text-xs">
              <Radio className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              <p>Nenhuma correlação identificada com os filtros atuais.</p>
              <p className="text-[10px] text-slate-500 mt-1">Experimente expandir o raio ou selecionar outra fonte externa.</p>
            </div>
          ) : (
            hotspots.slice(0, 10).map((h, index) => (
              <div
                key={h.id}
                onClick={() => onSelectHotspot && onSelectHotspot(h)}
                className="bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 hover:border-purple-500/60 p-3 rounded-xl transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2.5 h-2.5 rounded-full ${
                      h.grauRisco === 'CRITICO' ? 'bg-red-500 shadow-xs shadow-red-500/50' :
                      h.grauRisco === 'ALTO' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <span className="font-bold text-xs text-white">{h.chamadoProtocolo}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] bg-slate-900/80 text-sky-300 border border-slate-700 px-1.5 py-0.5 rounded font-mono">
                      {h.distanciaMetros}m
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      h.grauRisco === 'CRITICO' ? 'bg-red-950 text-red-300 border border-red-800' :
                      h.grauRisco === 'ALTO' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-blue-950 text-blue-300 border border-blue-800'
                    }`}>
                      {h.grauRisco}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 font-medium mb-1">
                  <span className="text-purple-300">{CATEGORIAS_NOMES[h.chamadoCategoria] || h.chamadoCategoria}</span>
                  <span className="text-slate-500 mx-1">×</span>
                  <span className="text-sky-300">{h.fonteSigla} ({h.pontoTitulo})</span>
                </div>

                <p className="text-[11px] text-slate-400 leading-snug">
                  {h.diagnosticoCruzado}
                </p>

                <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[10px]">
                  <span className="text-emerald-400 font-medium truncate max-w-[280px]">
                    💡 {h.recomendacaoOperacional}
                  </span>
                  <span className="text-slate-500 group-hover:text-purple-400 transition-colors flex items-center">
                    Ver <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </>
  );
}
