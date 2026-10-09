import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MapEngineType, CamadaMapeada, BibliotecaPublicaGeolocalizada } from '../types';
import { 
  Layers, Map, Globe, Mountain, Navigation, Trees, 
  Building2, BookOpen, Eye, EyeOff, Sliders, CheckCircle2,
  ExternalLink, Sparkles, X, ChevronRight, Filter, Info
} from 'lucide-react';

interface PainelCamadasMapeadasProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBiblioteca?: (b: BibliotecaPublicaGeolocalizada) => void;
}

export default function PainelCamadasMapeadas({
  isOpen,
  onClose,
  onSelectBiblioteca
}: PainelCamadasMapeadasProps) {
  const { 
    activeMapEngine, 
    setActiveMapEngine, 
    availableEngines,
    camadasMapeadas,
    toggleCamada,
    setOpacidadeCamada,
    isCamadaAtiva,
    bibliotecasPublicas,
    selectedBiblioteca,
    setSelectedBiblioteca
  } = useApp();

  const [activeTab, setActiveTab] = useState<'CAMADAS' | 'BIBLIOTECAS' | 'MOTORES'>('CAMADAS');
  const [termoBusca, setTermoBusca] = useState('');

  if (!isOpen) return null;

  const bibliotecasFiltradas = bibliotecasPublicas.filter(b => 
    b.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
    b.distrito.toLowerCase().includes(termoBusca.toLowerCase()) ||
    b.subprefeituraNome.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[9990] flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho do Painel */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-300 rounded-2xl border border-purple-200 dark:border-purple-800">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Sistema Global de Mapeamento de Camadas & Motores
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Gerencie fontes GeoJSON/WMS, bibliotecas geolocalizadas e persistência entre motores (Leaflet, MapLibre, Deck.gl)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Abas de Navegação */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-5 pt-2 text-xs font-bold gap-2">
          <button
            onClick={() => setActiveTab('CAMADAS')}
            className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 ${
              activeTab === 'CAMADAS'
                ? 'border-purple-600 text-purple-600 dark:text-purple-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Mapeamento de Camadas ({camadasMapeadas.filter(c => c.ativa).length}/{camadasMapeadas.length} ativas)
          </button>
          <button
            onClick={() => setActiveTab('BIBLIOTECAS')}
            className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 flex items-center gap-1.5 ${
              activeTab === 'BIBLIOTECAS'
                ? 'border-red-600 text-red-600 dark:text-red-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Bibliotecas SP & Equipamentos ({bibliotecasPublicas.length})
          </button>
          <button
            onClick={() => setActiveTab('MOTORES')}
            className={`px-4 py-2.5 rounded-t-xl transition-all border-b-2 ${
              activeTab === 'MOTORES'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-white dark:bg-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            Motores de Renderização ({availableEngines.length})
          </button>
        </div>

        {/* Conteúdo da Aba Ativa */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* ========================================================================= */}
          {/* ABA 1: MAPEAMENTO DE CAMADAS (GEOJSON, WMS, INTERNAS) */}
          {/* ========================================================================= */}
          {activeTab === 'CAMADAS' && (
            <div className="space-y-3">
              <div className="p-3 bg-purple-50 dark:bg-purple-950/30 rounded-2xl border border-purple-200 dark:border-purple-900 text-purple-900 dark:text-purple-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="text-[11px] font-medium leading-relaxed">
                  As camadas ativas abaixo são <strong>persistidas globalmente</strong>: ao trocar entre Leaflet, MapLibre GL ou Deck.gl, todas as camadas habilitadas continuam ativas no novo motor.
                </span>
              </div>

              <div className="space-y-2.5">
                {camadasMapeadas.map((camada) => {
                  const ativa = isCamadaAtiva(camada.id);

                  return (
                    <div 
                      key={camada.id}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        ativa 
                          ? 'bg-white dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 shadow-sm' 
                          : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div 
                            className="p-2.5 rounded-xl text-white shadow-sm shrink-0"
                            style={{ backgroundColor: camada.corPrimaria }}
                          >
                            <Layers className="w-4 h-4" />
                          </div>
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-bold text-slate-900 dark:text-white text-sm">
                                {camada.nome}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                                {camada.formato}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                                {camada.categoriaAnaloga}
                              </span>
                            </div>
                            <p className="text-slate-500 dark:text-slate-400 text-xs">
                              {camada.descricao}
                            </p>
                            <span className="text-[10px] text-slate-400 block font-medium">
                              Provedor: {camada.provedor} • Ordem Z: #{camada.ordemZ}
                            </span>
                          </div>
                        </div>

                        {/* Botão de Ativação / Desativação */}
                        <div className="flex flex-col items-end gap-2 shrink-0">
                          <button
                            onClick={() => toggleCamada(camada.id)}
                            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs ${
                              ativa
                                ? 'bg-purple-600 text-white shadow-md hover:bg-purple-700'
                                : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300'
                            }`}
                          >
                            {ativa ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            <span>{ativa ? 'Ativa' : 'Inativa'}</span>
                          </button>

                          {ativa && (
                            <div className="flex items-center gap-1 text-[10px] text-slate-500">
                              <span>Opacidade:</span>
                              <input 
                                type="range" 
                                min="0.2" 
                                max="1.0" 
                                step="0.1" 
                                value={camada.opacidade} 
                                onChange={(e) => setOpacidadeCamada(camada.id, parseFloat(e.target.value))}
                                className="w-14 accent-purple-600 h-1 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                              />
                              <span className="font-mono">{Math.round(camada.opacidade * 100)}%</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ABA 2: BIBLIOTECAS PÚBLICAS & EQUIPAMENTOS CULTURAIS GEOLOCALIZADOS */}
          {/* ========================================================================= */}
          {activeTab === 'BIBLIOTECAS' && (
            <div className="space-y-3">
              <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-2xl border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-[11px] font-medium leading-relaxed">
                  As <strong>Bibliotecas Públicas Municipais de São Paulo</strong> exercem o papel análogo aos anexos: 
                  <strong>"Équipements majeurs"</strong> (Reims), <strong>"Landmarks Culturais"</strong> (Budapeste) e <strong>"Polos Cívicos"</strong> (Masterplan). Cada uma conta com um buffer de proteção de 500m de zeladoria.
                </span>
              </div>

              {/* Barra de Busca de Bibliotecas */}
              <input
                type="text"
                placeholder="Buscar por nome da biblioteca, distrito ou subprefeitura..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs outline-none focus:border-red-500"
              />

              <div className="space-y-2">
                {bibliotecasFiltradas.map((bib) => (
                  <div
                    key={bib.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-red-400 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-300 rounded-lg">
                          <BookOpen className="w-3.5 h-3.5" />
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                          {bib.nome}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                          {bib.distrito} • Sub {bib.subprefeituraNome}
                        </span>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">
                        {bib.endereco}
                      </p>
                      <div className="text-[10px] text-red-700 dark:text-red-300 font-medium bg-red-50 dark:bg-red-950/40 p-1.5 rounded-lg border border-red-100 dark:border-red-900/40">
                        <strong>Papel Análogo:</strong> {bib.papelAnalogoAnexo}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (onSelectBiblioteca) onSelectBiblioteca(bib);
                        if (setSelectedBiblioteca) setSelectedBiblioteca(bib);
                        onClose();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shrink-0 flex items-center justify-center gap-1.5 shadow-sm transition-all"
                    >
                      <span>Abrir Prontuário</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* ABA 3: MOTORES DE RENDERIZAÇÃO CARTOGRÁFICA */}
          {/* ========================================================================= */}
          {activeTab === 'MOTORES' && (
            <div className="space-y-3">
              <p className="text-slate-500 dark:text-slate-400 text-xs">
                Selecione o motor de visualização geoespacial desejado. As camadas mapeadas permanecem idênticas em qualquer motor selecionado.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableEngines.map((engine) => {
                  const isSelected = activeMapEngine === engine.id;

                  return (
                    <div
                      key={engine.id}
                      onClick={() => setActiveMapEngine(engine.id)}
                      className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-md'
                          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                            {engine.badge}
                          </span>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Ativo
                            </span>
                          )}
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {engine.nome}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-400 block mb-1">
                          {engine.biblioteca}
                        </span>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          {engine.descricao}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMapEngine(engine.id);
                          onClose();
                        }}
                        className={`w-full py-1.5 rounded-xl font-bold text-xs transition-all ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                        }`}
                      >
                        {isSelected ? 'Motor em Execução' : 'Alternar para este Motor'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Rodapé */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between text-xs text-slate-500">
          <span>Camadas Persistidas no Contexto Global</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors"
          >
            Concluir e Voltar ao Mapa
          </button>
        </div>
      </div>
    </div>
  );
}
