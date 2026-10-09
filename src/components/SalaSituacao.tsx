import React, { useState, useMemo, useEffect, useRef } from 'react';
import { 
  Camera, Map as MapIcon, Layers, Filter, CheckCircle2, AlertTriangle, Clock, Calendar, 
  Hash, MapPin, X, Eye, EyeOff, Activity, BarChart3, List,
  Plus, Database, Shield, Users, Car, History, Sparkles, Info, Check, SlidersHorizontal,
  Radio, Hexagon, Globe, BookOpen, Mountain, ChevronRight, ChevronLeft, ChevronDown, Sliders,
  Maximize2, Minimize2
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { subprefeituras } from '../data';
import { Chamado, Subprefeitura, FonteDadosPublica, PontoFontePublica, HotspotCruzamento, BibliotecaPublicaGeolocalizada, MapEngineType } from '../types';
import { UserSession } from '../LoginTypes';
import MapComponent from './MapComponent';
import MapLibreMapComponent from './MapLibreMapComponent';
import DeckGlMapComponent from './DeckGlMapComponent';
import D3MapComponent from './D3MapComponent';
import HexbinMapComponent from './HexbinMapComponent';
import BufferRadarMapComponent from './BufferRadarMapComponent';
import PainelCruzamentoCamadas from './PainelCruzamentoCamadas';
import PainelCamadasMapeadas from './PainelCamadasMapeadas';
import ModalBibliotecaPublica from './ModalBibliotecaPublica';
import { AnimatedCounter } from './AnimatedCounter';
import { LiveIndicator } from './LiveIndicator';
import { CATALOGO_FONTES_PUBLICAS, ROTULO_FIXO_FONTE } from '../dataPublicSources';
import { useApp } from '../context/AppContext';
import { executarCruzamentoCamadas } from '../utils/geoSpatial';
import ControlDropdown from './ui/ControlDropdown';

type LayerFilter = 'SOCIAL' | 'ZELADORIA' | 'INFRAESTRUTURA' | 'TODOS';
type DistrictFilter = 'TODOS' | 'Vila Mariana' | 'Moema' | 'Saúde';
type OccurrenceViewMode = 'CLUSTER' | 'NORMAL';
type DemoMapEngine = Extract<
  MapEngineType,
  'LEAFLET' | 'MAPLIBRE_GL' | 'SATELITE_ORTOFOTO' | 'CHOROPLETH_32_SUBS' | 'SERVICE_BUFFERS' | 'HEATMAP_KERNEL'
>;

interface MapEngineControlConfig {
  shortLabel: string;
  description: string;
  occurrenceControl: 'CONFIGURABLE' | 'DEFINED_BY_ENGINE';
  blindSpots: boolean;
}

const MAP_ENGINE_CONTROL_CONFIG: Record<DemoMapEngine, MapEngineControlConfig> = {
  LEAFLET: {
    shortLabel: 'OSM',
    description: 'Marcadores e agrupamentos operacionais.',
    occurrenceControl: 'CONFIGURABLE',
    blindSpots: true
  },
  MAPLIBRE_GL: {
    shortLabel: '3D',
    description: 'Mapa vetorial com rotação e perspectiva.',
    occurrenceControl: 'DEFINED_BY_ENGINE',
    blindSpots: false
  },
  SATELITE_ORTOFOTO: {
    shortLabel: 'Satélite',
    description: 'Imagem aérea com vias e logradouros.',
    occurrenceControl: 'DEFINED_BY_ENGINE',
    blindSpots: true
  },
  CHOROPLETH_32_SUBS: {
    shortLabel: 'Territorial',
    description: 'Limite da SUB-VM e indicadores.',
    occurrenceControl: 'DEFINED_BY_ENGINE',
    blindSpots: true
  },
  SERVICE_BUFFERS: {
    shortLabel: 'Buffers',
    description: 'Raios de cobertura de equipamentos.',
    occurrenceControl: 'DEFINED_BY_ENGINE',
    blindSpots: true
  },
  HEATMAP_KERNEL: {
    shortLabel: 'Calor',
    description: 'Densidade espacial de ocorrências.',
    occurrenceControl: 'DEFINED_BY_ENGINE',
    blindSpots: true
  }
};

const FALLBACK_ENGINE_CONFIG: MapEngineControlConfig = {
  shortLabel: 'Mapa',
  description: 'Visualização cartográfica.',
  occurrenceControl: 'DEFINED_BY_ENGINE',
  blindSpots: false
};

const LAYER_MAPPING: Record<LayerFilter, string[]> = {
  SOCIAL: ['MORADOR_RUA', 'DESFAZIMENTO'],
  ZELADORIA: ['ARVORE_CAIDA', 'FISCALIZACAO_POSTURA', 'BARULHO_PSIU'],
  INFRAESTRUTURA: ['BUEIRO', 'CALCADA', 'TAPA_BURACO'],
  TODOS: ['MORADOR_RUA', 'ARVORE_CAIDA', 'BUEIRO', 'BARULHO_PSIU', 'CALCADA', 'TAPA_BURACO', 'FISCALIZACAO_POSTURA', 'DESFAZIMENTO'],
};

export default function SalaSituacao({ chamados, session }: { chamados: Chamado[], session: UserSession }) {
  const [viewMode, setViewMode] = useState<OccurrenceViewMode>('CLUSTER');
  const [showPontosCegos, setShowPontosCegos] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  
  const [activeLayer, setActiveLayer] = useState<LayerFilter>('TODOS');
  const heatmapType = 'DENSIDADE' as const;
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictFilter>('TODOS');
  const selectedSubId = '2';
  const [selectedChamado, setSelectedChamado] = useState<Chamado | null>(null);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState<boolean>(true);
  const [focusMode, setFocusMode] = useState(false);

  // Estado Global via Context API (Fontes Públicas, Motores de Mapa, Camadas e Cruzamento)
  const {
    publicSources,
    togglePublicSource,
    enableAllPublicSources,
    disableAllPublicSources,
    camadasMapeadas,
    camadasAtivasCount,
    bibliotecasPublicas,
    selectedBiblioteca,
    setSelectedBiblioteca,
    activeMapEngine,
    setActiveMapEngine,
    availableEngines,
    crossAnalysisActive,
    setCrossAnalysisActive,
    crossRadiusMeters,
    setCrossRadiusMeters,
    crossSelectedSourceId,
    setCrossSelectedSourceId,
    crossSelectedCategory,
    setCrossSelectedCategory,
    highContrast: highContrastMode,
    setHighContrast: setHighContrastMode
  } = useApp();

  const engineControlConfig =
    MAP_ENGINE_CONTROL_CONFIG[activeMapEngine as DemoMapEngine] || FALLBACK_ENGINE_CONFIG;
  const occurrenceControlDisabled = engineControlConfig.occurrenceControl !== 'CONFIGURABLE';
  const occurrenceSummary = occurrenceControlDisabled
    ? 'Definido pelo mapa'
    : viewMode === 'CLUSTER'
      ? 'Agrupadas'
      : 'Individuais';
  const panelsSummary = isListOpen && isAnalyticsOpen
    ? '2 ativos'
    : isListOpen
      ? 'Lista'
      : isAnalyticsOpen
        ? 'Estatísticas'
        : 'Fechados';
  const activeDisplayCount = Number(showPontosCegos && engineControlConfig.blindSpots) + Number(highContrastMode);
  const displaySummary = activeDisplayCount === 0
    ? 'Padrão'
    : activeDisplayCount === 2
      ? '2 ativos'
      : showPontosCegos && engineControlConfig.blindSpots
        ? 'Pontos cegos'
        : 'Contraste';

  const handleMapEngineSelect = (engine: DemoMapEngine) => {
    setActiveMapEngine(engine);
    if (!MAP_ENGINE_CONTROL_CONFIG[engine].blindSpots) {
      setShowPontosCegos(false);
    }
  };

  const [isAddSourceOpen, setIsAddSourceOpen] = useState(false);
  const [isCrossPanelOpen, setIsCrossPanelOpen] = useState(false);
  const [isCamadasPanelOpen, setIsCamadasPanelOpen] = useState(false);
  const [modalBiblioteca, setModalBiblioteca] = useState<BibliotecaPublicaGeolocalizada | null>(null);
  const [selectedPublicPoint, setSelectedPublicPoint] = useState<{ point: PontoFontePublica; source: FonteDadosPublica } | null>(null);
  const [showMockPhotos, setShowMockPhotos] = useState(false);
  const [isLegendExpanded, setIsLegendExpanded] = useState(false);
  const [isMetricsPanelOpen, setIsMetricsPanelOpen] = useState(true);
  const [isMobileMetricsOpen, setIsMobileMetricsOpen] = useState(false);
  const [isMobileFilterDrawerOpen, setIsMobileFilterDrawerOpen] = useState(false);

  // Cruzamento Geoespacial Contínuo (Interno SP156 x Externo Fontes Públicas)
  const { hotspots: hotspotsCruzamento, resumo: resumoCruzamento } = useMemo(() => {
    return executarCruzamentoCamadas(
      chamados.filter((chamado) => selectedDistrict === 'TODOS' || chamado.distrito === selectedDistrict),
      publicSources,
      {
        raioMetros: crossRadiusMeters,
        categoriaInterna: crossSelectedCategory,
        fonteExternaId: crossSelectedSourceId,
        apenasAtivas: true
      },
      'Vila Mariana'
    );
  }, [chamados, publicSources, crossRadiusMeters, crossSelectedCategory, crossSelectedSourceId, selectedDistrict]);

  // Fontes públicas ativas
  const activePublicSources = useMemo(() => {
    return publicSources.filter(s => s.ativa);
  }, [publicSources]);

  const enableAllSources = enableAllPublicSources;
  const disableAllSources = disableAllPublicSources;

  // Simulação de atualização em tempo real (dados vivos a cada 15-20 segundos)
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [chartDeltas, setChartDeltas] = useState<Record<string, number>>({});
  const [deltaTotal, setDeltaTotal] = useState(0);
  const [deltaAtrasados, setDeltaAtrasados] = useState(0);
  const [deltaConcluidos, setDeltaConcluidos] = useState(0);
  const [deltaEmAndamento, setDeltaEmAndamento] = useState(0);
  const [deltaNovos, setDeltaNovos] = useState(0);
  const nextIntervalRef = useRef(16);

  const triggerLiveUpdate = () => {
    setIsUpdating(true);
    setSecondsAgo(0);
    nextIntervalRef.current = Math.floor(Math.random() * 6) + 15;

    // Variações discretas nos números dos gráficos e KPIs
    setDeltaTotal(prev => Math.max(-2, Math.min(3, prev + (Math.random() > 0.5 ? 1 : -1))));
    setDeltaAtrasados(prev => Math.max(-1, Math.min(2, prev + (Math.random() > 0.6 ? 1 : -1))));
    setDeltaConcluidos(prev => Math.max(0, Math.min(4, prev + (Math.random() > 0.6 ? 1 : 0))));
    setDeltaEmAndamento(prev => Math.max(-2, Math.min(2, prev + (Math.random() > 0.5 ? 1 : -1))));
    setDeltaNovos(prev => Math.max(-1, Math.min(2, prev + (Math.random() > 0.5 ? 1 : -1))));

    // Flutuações discretas por categoria no gráfico Recharts
    setChartDeltas(prev => {
      const updated = { ...prev };
      const categories = ['MORADOR_RUA', 'ARVORE_CAIDA', 'BUEIRO', 'BARULHO_PSIU', 'CALCADA', 'TAPA_BURACO', 'FISCALIZACAO_POSTURA', 'DESFAZIMENTO'];
      const cat1 = categories[Math.floor(Math.random() * categories.length)];
      const cat2 = categories[Math.floor(Math.random() * categories.length)];
      updated[cat1] = Math.max(-2, Math.min(2, (updated[cat1] || 0) + (Math.random() > 0.5 ? 1 : -1)));
      updated[cat2] = Math.max(-2, Math.min(2, (updated[cat2] || 0) + (Math.random() > 0.5 ? 1 : -1)));
      return updated;
    });

    setTimeout(() => {
      setIsUpdating(false);
    }, 900);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo(prev => {
        if (prev + 1 >= nextIntervalRef.current) {
          triggerLiveUpdate();
          return 0;
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const filteredChamados = useMemo(() => {
    return chamados.filter((c) => {
      const matchLayer = LAYER_MAPPING[activeLayer].includes(c.categoria);
      const matchSub = c.subprefeituraId === selectedSubId;
      const matchDistrict = selectedDistrict === 'TODOS' || c.distrito === selectedDistrict;
      return matchLayer && matchSub && matchDistrict;
    });
  }, [activeLayer, selectedDistrict, chamados]);

  // Analytics com suporte a variação em tempo real
  const subprefeituraStats = useMemo(() => {
    const stats: Record<string, number> = {};
    filteredChamados.forEach(c => {
      stats[c.categoria] = (stats[c.categoria] || 0) + 1;
    });
    
    return Object.entries(stats).map(([name, count]) => {
      const delta = chartDeltas[name] || 0;
      return {
        name: name.replace('_', ' ').substring(0, 10),
        count: Math.max(1, count + delta)
      };
    });
  }, [filteredChamados, chartDeltas]);

  const selectedSubprefeitura = subprefeituras[0] || null;

  const handleMarkerClick = (chamado: Chamado) => {
    setSelectedChamado(chamado);
    setSelectedPublicPoint(null);
    setShowMockPhotos(false);
  };

  const handlePublicPointClick = (point: PontoFontePublica, source: FonteDadosPublica) => {
    setSelectedPublicPoint({ point, source });
    setSelectedChamado(null);
  };

  return (
    <div className={`flex flex-col h-full w-full relative overflow-hidden transition-colors ${
      highContrastMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* 1. Canvas do Mapa (100% Imersivo de Borda a Borda) */}
      <div className="flex-1 relative w-full h-full overflow-hidden">
        <div className="w-full h-full relative overflow-hidden">
            {activeMapEngine === 'LEAFLET' && (
              <MapComponent
                chamados={filteredChamados}
                viewMode={viewMode}
                mapEngineMode="LEAFLET"
                showPontosCegos={showPontosCegos}
                onMarkerClick={handleMarkerClick}
                selectedSubprefeitura={selectedSubprefeitura}
                selectedChamado={selectedChamado}
                heatmapType={heatmapType}
                activePublicSources={activePublicSources}
                highContrastMode={highContrastMode}
                onPublicPointClick={handlePublicPointClick}
                crossAnalysisActive={crossAnalysisActive}
                hotspotsCruzamento={hotspotsCruzamento}
              />
            )}

            {activeMapEngine === 'MAPLIBRE_GL' && (
              <MapLibreMapComponent
                chamados={filteredChamados}
                subprefeituras={subprefeituras}
                fontesPublicas={publicSources}
                selectedSubId={selectedSubId}
                onSelectChamado={handleMarkerClick}
                onSelectBiblioteca={(b) => setModalBiblioteca(b)}
                highContrast={highContrastMode}
                crossAnalysisActive={crossAnalysisActive}
                hotspotsCruzamento={hotspotsCruzamento}
              />
            )}

            {activeMapEngine === 'SATELITE_ORTOFOTO' && (
              <MapComponent
                chamados={filteredChamados}
                viewMode="NORMAL"
                mapEngineMode="SATELITE_ORTOFOTO"
                showPontosCegos={showPontosCegos}
                onMarkerClick={handleMarkerClick}
                selectedSubprefeitura={selectedSubprefeitura}
                selectedChamado={selectedChamado}
                heatmapType={heatmapType}
                activePublicSources={activePublicSources}
                highContrastMode={highContrastMode}
                onPublicPointClick={handlePublicPointClick}
                crossAnalysisActive={crossAnalysisActive}
                hotspotsCruzamento={hotspotsCruzamento}
              />
            )}

            {activeMapEngine === 'CHOROPLETH_32_SUBS' && (
              <MapComponent
                chamados={filteredChamados}
                viewMode="NORMAL"
                mapEngineMode="CHOROPLETH_32_SUBS"
                showPontosCegos={showPontosCegos}
                onMarkerClick={handleMarkerClick}
                selectedSubprefeitura={selectedSubprefeitura}
                selectedChamado={selectedChamado}
                heatmapType={heatmapType}
                activePublicSources={activePublicSources}
                highContrastMode={highContrastMode}
                onPublicPointClick={handlePublicPointClick}
                crossAnalysisActive={crossAnalysisActive}
                hotspotsCruzamento={hotspotsCruzamento}
              />
            )}

            {activeMapEngine === 'SERVICE_BUFFERS' && (
              <MapComponent
                chamados={filteredChamados}
                viewMode="NORMAL"
                mapEngineMode="SERVICE_BUFFERS"
                showPontosCegos={showPontosCegos}
                onMarkerClick={handleMarkerClick}
                selectedSubprefeitura={selectedSubprefeitura}
                selectedChamado={selectedChamado}
                heatmapType={heatmapType}
                activePublicSources={activePublicSources}
                highContrastMode={highContrastMode}
                onPublicPointClick={handlePublicPointClick}
                onSelectBiblioteca={(b) => setModalBiblioteca(b)}
                crossAnalysisActive={crossAnalysisActive}
                hotspotsCruzamento={hotspotsCruzamento}
              />
            )}

            {activeMapEngine === 'HEATMAP_KERNEL' && (
              <MapComponent
                chamados={filteredChamados}
                viewMode="HEATMAP"
                mapEngineMode="HEATMAP_KERNEL"
                showPontosCegos={showPontosCegos}
                onMarkerClick={handleMarkerClick}
                selectedSubprefeitura={selectedSubprefeitura}
                selectedChamado={selectedChamado}
                heatmapType={heatmapType}
                activePublicSources={activePublicSources}
                highContrastMode={highContrastMode}
                onPublicPointClick={handlePublicPointClick}
                crossAnalysisActive={crossAnalysisActive}
                hotspotsCruzamento={hotspotsCruzamento}
              />
            )}

            {activeMapEngine === 'DECK_GL' && (
              <DeckGlMapComponent
                chamados={filteredChamados}
                subprefeituras={subprefeituras}
                fontesPublicas={publicSources}
                selectedSubId={selectedSubId}
                onSelectChamado={handleMarkerClick}
                onSelectBiblioteca={(b) => setModalBiblioteca(b)}
                highContrast={highContrastMode}
                crossAnalysisActive={crossAnalysisActive}
                hotspotsCruzamento={hotspotsCruzamento}
              />
            )}

            {activeMapEngine === 'D3_CHOROPLETH' && (
              <D3MapComponent
                chamados={filteredChamados}
                subprefeituras={subprefeituras}
                fontesPublicas={publicSources}
                selectedSubId={selectedSubId}
                onSelectChamado={handleMarkerClick}
                onSelectSubprefeitura={() => undefined}
                highContrast={highContrastMode}
                crossAnalysisActive={crossAnalysisActive}
                hotspotsCruzamento={hotspotsCruzamento}
              />
            )}

            {activeMapEngine === 'DECK_HEXBIN' && (
              <HexbinMapComponent
                chamados={filteredChamados}
                subprefeituras={subprefeituras}
                fontesPublicas={publicSources}
                selectedSubId={selectedSubId}
                onSelectChamado={handleMarkerClick}
                highContrast={highContrastMode}
                crossAnalysisActive={crossAnalysisActive}
                hotspotsCruzamento={hotspotsCruzamento}
              />
            )}

            {activeMapEngine === 'BUFFER_RADAR' && (
              <BufferRadarMapComponent
                chamados={filteredChamados}
                subprefeituras={subprefeituras}
                fontesPublicas={publicSources}
                selectedSubId={selectedSubId}
                onSelectChamado={handleMarkerClick}
                highContrast={highContrastMode}
                crossAnalysisActive={crossAnalysisActive}
                hotspotsCruzamento={hotspotsCruzamento}
              />
            )}
            
            {/* Botão compacto para restaurar a legenda minimizada */}
            {!focusMode && !isLegendExpanded && (
              <div className="absolute bottom-16 left-3 z-[35] sm:left-4">
                <button
                  type="button"
                  onClick={() => setIsLegendExpanded(true)}
                  className={`btn btn-sm btn-square min-h-9 h-9 w-9 border shadow-lg backdrop-blur-md ${
                    highContrastMode
                      ? 'border-slate-700 bg-slate-900/90 text-amber-400 hover:bg-slate-800'
                      : 'border-slate-200 bg-white/95 text-blue-600 hover:bg-slate-50'
                  }`}
                  title="Maximizar Legenda & Camadas"
                  aria-label="Maximizar Legenda & Camadas"
                >
                  <Maximize2 className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Floating Legend com contraste adaptável e suporte a fontes públicas */}
            {!focusMode && isLegendExpanded && (
              <div className={`absolute bottom-16 left-3 sm:left-4 z-[35] px-3.5 py-3 rounded-xl border shadow-lg pointer-events-auto max-w-[280px] sm:max-w-xs transition-all backdrop-blur-md ${
                highContrastMode 
                  ? 'bg-slate-950/90 border-slate-700 text-white shadow-2xl' 
                  : 'bg-white/95 border-slate-200 text-slate-800'
              }`}>
              <div className="flex items-center justify-between gap-3 mb-2 pb-1 border-b border-slate-200/40">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Legenda & Camadas
                </h4>
                <div className="flex items-center gap-1">
                  {highContrastMode && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-extrabold bg-amber-400 text-slate-950 uppercase">
                      Telão
                    </span>
                  )}
                  <button 
                    type="button"
                    onClick={() => setIsLegendExpanded(false)}
                    className="btn btn-ghost btn-xs btn-square text-slate-400 hover:text-slate-600"
                    title="Minimizar Legenda & Camadas"
                    aria-label="Minimizar Legenda & Camadas"
                  >
                    <Minimize2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Status de Chamados */}
              <div className="space-y-1.5 text-xs mb-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-xs" />
                    <span className="font-medium">Concluído</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Zeladoria</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-xs" />
                    <span className="font-medium">Em Andamento</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Zeladoria</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-xs" />
                    <span className="font-medium">Aberto / Urgente</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Zeladoria</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-xs" />
                    <span className="font-medium">Atrasado</span>
                  </div>
                  <span className="text-[10px] text-slate-400">Zeladoria</span>
                </div>
              </div>

              {/* Fontes Públicas Ativas na Legenda com suas respectivas cores */}
              {activePublicSources.length > 0 && (
                <div className="pt-2 border-t border-slate-200/40">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Fontes Conectadas ({activePublicSources.length})</span>
                  </div>
                  <div className="space-y-1">
                    {activePublicSources.map(source => (
                      <div key={source.id} className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: source.corHex }} />
                          <span className="font-bold truncate">{source.sigla}</span>
                        </div>
                        <span className="text-[9px] text-slate-400 shrink-0 ml-2">{source.atualizacao}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-2 pt-1 border-t border-slate-200/40 text-[9px] text-slate-400 italic text-center">
                Passe o mouse p/ detalhes rápidos
              </div>
            </div>
            )}
          </div>

        {/* 2. IN-MAP FLOATING CONTROLS (HUD) */}
        {!focusMode && (
          <>
            {/* Top Control Bar HUD */}
            <div className="absolute top-3 left-3 right-3 sm:left-4 sm:right-4 z-[35] pointer-events-none flex flex-wrap items-center justify-between gap-2.5">
              {/* Left Cluster: Território, Camadas & Fontes */}
              <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md text-white">
                {/* Filtro intraterritorial da SUB-VM */}
                <div className="flex items-center gap-1 px-2 py-1 bg-slate-800/90 rounded-xl border border-slate-700/80">
                  <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <select
                    className="bg-transparent text-xs font-semibold text-white focus:ring-0 cursor-pointer outline-none max-w-[150px] sm:max-w-[190px] truncate"
                    value={selectedDistrict}
                    onChange={(e) => {
                      setSelectedDistrict(e.target.value as DistrictFilter);
                      setSelectedChamado(null);
                      setSelectedPublicPoint(null);
                    }}
                    title="Filtrar chamados por distrito da SUB-VM"
                  >
                    <option value="TODOS" className="bg-slate-800 text-white">SUB-VM • Todos os distritos</option>
                    <option value="Vila Mariana" className="bg-slate-800 text-white">Distrito Vila Mariana</option>
                    <option value="Moema" className="bg-slate-800 text-white">Distrito Moema</option>
                    <option value="Saúde" className="bg-slate-800 text-white">Distrito Saúde</option>
                  </select>
                </div>

            {/* Filtros Rápidos de Categorias */}
            <div className="flex items-center gap-0.5 bg-slate-800/90 p-0.5 rounded-xl border border-slate-700/80">
              {(['TODOS', 'ZELADORIA', 'INFRAESTRUTURA', 'SOCIAL'] as LayerFilter[]).map((layer) => {
                const isActive = activeLayer === layer;
                const label = layer === 'TODOS' ? 'Todos' : layer === 'ZELADORIA' ? 'Zeladoria' : layer === 'INFRAESTRUTURA' ? 'Infra' : 'Social';
                return (
                  <button
                    key={layer}
                    onClick={() => {
                      setActiveLayer(layer);
                      setSelectedChamado(null);
                    }}
                    className={`px-2 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                      isActive
                        ? layer === 'SOCIAL'
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* Botão Fontes Públicas */}
            <button
              onClick={() => setIsAddSourceOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-xl transition-all border whitespace-nowrap ${
                activePublicSources.length > 0
                  ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-500 shadow-md ring-1 ring-purple-400/50'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-purple-300 border-purple-900/60'
              }`}
              title="Adicionar novas fontes públicas de análise territorial"
            >
              <Database className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fontes</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${
                activePublicSources.length > 0
                  ? 'bg-white text-purple-800'
                  : 'bg-purple-900 text-purple-200'
              }`}>
                {activePublicSources.length}
              </span>
            </button>
          </div>

          {/* Right Cluster: quatro grupos de controle com responsabilidades separadas */}
          <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 rounded-2xl border border-slate-700/80 bg-slate-900/90 p-1.5 text-white shadow-2xl backdrop-blur-md">
            <ControlDropdown
              label="Mapa"
              value={engineControlConfig.shortLabel}
              align="start"
              icon={<MapIcon className="h-3.5 w-3.5 shrink-0 text-sky-400" />}
              options={availableEngines.map((engine) => {
                const engineId = engine.id as DemoMapEngine;
                const config = MAP_ENGINE_CONTROL_CONFIG[engineId] || FALLBACK_ENGINE_CONFIG;
                return {
                  id: engine.id,
                  label: config.shortLabel,
                  description: config.description,
                  selected: activeMapEngine === engine.id,
                  onSelect: () => handleMapEngineSelect(engineId)
                };
              })}
            />

            <ControlDropdown
              label="Ocorrências"
              value={occurrenceSummary}
              align="start"
              icon={<Layers className="h-3.5 w-3.5 shrink-0 text-blue-400" />}
              disabled={occurrenceControlDisabled}
              disabledReason={occurrenceControlDisabled ? 'A representação é definida automaticamente pelo mapa selecionado.' : undefined}
              options={[
                {
                  id: 'cluster',
                  label: 'Agrupadas',
                  description: 'Agrupa ocorrências próximas para reduzir sobreposição.',
                  selected: viewMode === 'CLUSTER',
                  onSelect: () => setViewMode('CLUSTER')
                },
                {
                  id: 'normal',
                  label: 'Individuais',
                  description: 'Exibe cada ocorrência como um marcador independente.',
                  selected: viewMode === 'NORMAL',
                  onSelect: () => setViewMode('NORMAL')
                }
              ]}
            />

            <ControlDropdown
              label="Painéis"
              value={panelsSummary}
              align="start"
              icon={<List className="h-3.5 w-3.5 shrink-0 text-violet-400" />}
              selectionMode="multiple"
              options={[
                {
                  id: 'lista',
                  label: 'Lista sincronizada',
                  description: 'Abre a relação de chamados sem alterar a representação do mapa.',
                  selected: isListOpen,
                  onSelect: () => setIsListOpen((open) => !open)
                },
                {
                  id: 'estatisticas',
                  label: 'Estatísticas',
                  description: 'Exibe indicadores e distribuição por categoria.',
                  selected: isAnalyticsOpen,
                  onSelect: () => setIsAnalyticsOpen((open) => !open)
                }
              ]}
            />

            <ControlDropdown
              label="Exibição"
              value={displaySummary}
              icon={<Sliders className="h-3.5 w-3.5 shrink-0 text-amber-400" />}
              selectionMode="multiple"
              options={[
                {
                  id: 'pontos-cegos',
                  label: 'Pontos cegos',
                  description: 'Destaca áreas com acúmulo de chamados atrasados.',
                  disabled: !engineControlConfig.blindSpots,
                  disabledReason: !engineControlConfig.blindSpots ? 'Indisponível no motor 3D.' : undefined,
                  selected: showPontosCegos && engineControlConfig.blindSpots,
                  onSelect: () => setShowPontosCegos((show) => !show)
                },
                {
                  id: 'alto-contraste',
                  label: 'Alto contraste',
                  description: 'Otimiza cores e legibilidade para apresentação em telão.',
                  selected: highContrastMode,
                  onSelect: () => setHighContrastMode((enabled) => !enabled)
                }
              ]}
            />
          </div>
        </div>

        {/* Bottom Operations Floating Dock */}
        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 z-20 pointer-events-none flex flex-wrap items-center gap-2">
          <div className="pointer-events-auto flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-md text-white text-xs">
            {/* Botão Cruzamento de Camadas */}
            <button
              onClick={() => setIsCrossPanelOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-md ${
                crossAnalysisActive
                  ? 'bg-purple-600 hover:bg-purple-700 text-white border-purple-500 ring-2 ring-purple-500/40'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-slate-700'
              }`}
              title="Abrir painel de correlação e cruzamento entre demandas SP156 e fontes públicas"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              <span className="hidden sm:inline">Cruzamento de Camadas</span>
              <span className="sm:hidden">Cruzamento</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-extrabold ${
                crossAnalysisActive ? 'bg-purple-950 text-purple-200 border border-purple-700' : 'bg-slate-900 text-slate-400'
              }`}>
                {hotspotsCruzamento.length}
              </span>
            </button>

            {/* Botão Camadas & Fontes */}
            <button
              onClick={() => setIsCamadasPanelOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border border-slate-700 bg-slate-800/90 hover:bg-slate-700 text-slate-200 transition-all shadow-xs"
              title="Gerenciar mapeamento de camadas externas (GeoJSON/WMS), persistência e bibliotecas"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden md:inline">Camadas & Fontes</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-purple-950 text-purple-300 border border-purple-800">
                {camadasAtivasCount}
              </span>
            </button>

            {/* Botão Bibliotecas SP */}
            <button
              onClick={() => {
                if (bibliotecasPublicas.length > 0) {
                  setModalBiblioteca(bibliotecasPublicas[0]);
                }
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border border-red-900/60 bg-red-950/70 hover:bg-red-900/80 text-rose-200 transition-all shadow-xs"
              title="Ver prontuário e papel análogo das Bibliotecas Públicas de SP"
            >
              <BookOpen className="w-3.5 h-3.5 text-rose-400" />
              <span className="hidden md:inline">Bibliotecas SP</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-red-900 text-rose-200">
                {bibliotecasPublicas.length}
              </span>
            </button>

            {/* Indicador de Atualização em Tempo Real */}
            <div className="hidden lg:block pl-1 border-l border-slate-700">
              <LiveIndicator 
                secondsAgo={secondsAgo}
                isUpdating={isUpdating}
                onRefresh={triggerLiveUpdate}
              />
            </div>
          </div>
        </div>

        {/* Modo Foco / Mapa Limpo Toggle */}
        <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-[999] pointer-events-auto">
          <button
            onClick={() => setFocusMode(true)}
            className="p-2 rounded-xl border bg-slate-900/90 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-800 transition-all shadow-lg backdrop-blur-md"
            title="Ativar Modo Foco (Ocultar HUD)"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        </div>
          </>
        )}

        {/* Toggle para sair do Modo Foco */}
        {focusMode && (
          <div className="absolute top-4 right-4 z-[999] pointer-events-auto animate-in fade-in zoom-in duration-300">
            <button
              onClick={() => setFocusMode(false)}
              className="px-3 py-2 rounded-xl border bg-indigo-600 text-white border-indigo-500 hover:bg-indigo-700 transition-all shadow-2xl flex items-center gap-2 font-bold text-xs"
              title="Sair do Modo Foco"
            >
              <Eye className="w-4 h-4" />
              <span>Sair do Modo Foco</span>
            </button>
          </div>
        )}

        {/* Painéis independentes: empilhados no mobile e lado a lado em telas maiores */}
        {!selectedChamado && !selectedPublicPoint && (isListOpen || isAnalyticsOpen) && !focusMode && (
          <div className="absolute left-4 right-4 top-20 bottom-16 z-30 flex flex-col gap-3 pointer-events-none sm:left-auto sm:flex-row">
        {/* List View Floating Panel */}
        {isListOpen && (
           <div className={`w-full sm:w-80 lg:w-96 min-h-0 flex-1 border rounded-2xl shadow-2xl flex flex-col shrink-0 overflow-hidden pointer-events-auto backdrop-blur-xl ${
             highContrastMode ? 'bg-slate-900/95 border-slate-700 text-white' : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-900/20'
           }`}>
              <div className={`px-5 py-4 border-b flex items-center justify-between ${
                highContrastMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50/70 border-slate-100'
              }`}>
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                  <List className="w-4 h-4 text-blue-500" />
                  Lista Sincronizada
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-mono">{filteredChamados.length} chamados</span>
                  <button
                    type="button"
                    onClick={() => setIsListOpen(false)}
                    className="btn btn-ghost btn-xs btn-square text-slate-400 hover:text-slate-700"
                    aria-label="Fechar lista sincronizada"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                 {filteredChamados.slice(0, 50).map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => handleMarkerClick(c)} 
                      className={`p-3 border rounded-lg cursor-pointer transition-colors shadow-2xs ${
                        highContrastMode 
                          ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' 
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                       <div className="flex items-center justify-between mb-1">
                         <span className="text-[10px] font-mono text-slate-400">{c.protocolo}</span>
                         <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                           c.isAtrasado ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                         }`}>
                           {c.isAtrasado ? 'Atrasado' : c.status}
                         </span>
                       </div>
                       <p className="text-xs font-bold leading-tight">{c.categoria.replace('_', ' ')}</p>
                       <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{c.endereco}</p>
                    </div>
                 ))}
                 {filteredChamados.length > 50 && (
                   <p className="text-xs text-center text-slate-500 mt-2">
                     + {filteredChamados.length - 50} chamados ocultos
                   </p>
                 )}
              </div>
           </div>
        )}

        {/* Region Analysis Floating Panel */}
        {isAnalyticsOpen && (
           <div className={`w-full sm:w-80 lg:w-96 min-h-0 flex-1 border rounded-2xl shadow-2xl flex flex-col shrink-0 overflow-hidden pointer-events-auto backdrop-blur-xl animate-in slide-in-from-right-6 duration-200 ${
             highContrastMode ? 'bg-slate-900/95 border-slate-700 text-white' : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-900/20'
           }`}>
              <div className={`px-4 py-3 border-b flex items-center justify-between gap-2 shrink-0 ${
                highContrastMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50/70 border-slate-100'
              }`}>
                <h3 className="font-semibold flex items-center gap-2 text-sm truncate">
                  <BarChart3 className="w-4 h-4 text-blue-500 shrink-0" />
                  <span className="truncate">
                    {selectedDistrict === 'TODOS' ? 'Análise: SUB-VM' : `Distrito: ${selectedDistrict}`}
                  </span>
                </h3>
                <div className="flex items-center gap-1.5">
                  <LiveIndicator secondsAgo={secondsAgo} isUpdating={isUpdating} onRefresh={triggerLiveUpdate} />
                  <button
                    onClick={() => setIsAnalyticsOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                    title="Minimizar painel de análise"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5 flex-1 overflow-y-auto space-y-6">
                 <div className="grid grid-cols-2 gap-3">
                    <div className={`p-4 rounded-xl border ${
                      highContrastMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'
                    }`}>
                       <p className="text-[11px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Total Chamados</p>
                       <p className="text-2xl font-black">
                         <AnimatedCounter value={Math.max(0, filteredChamados.length + deltaTotal)} />
                       </p>
                    </div>
                    <div className={`p-4 rounded-xl border ${
                      highContrastMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'
                    }`}>
                       <p className="text-[11px] text-red-400 font-bold mb-1 uppercase tracking-wider">Atrasados</p>
                       <p className="text-2xl font-black text-red-500">
                         <AnimatedCounter value={Math.max(0, filteredChamados.filter(c => c.isAtrasado).length + deltaAtrasados)} />
                       </p>
                    </div>
                 </div>

                 {/* Seção das Fontes Públicas Conectadas no Painel Lateral */}
                 {activePublicSources.length > 0 && (
                   <div className={`p-3.5 rounded-xl border ${
                     highContrastMode ? 'bg-purple-950/40 border-purple-900' : 'bg-purple-50/70 border-purple-200'
                   }`}>
                     <div className="flex items-center justify-between mb-2">
                       <span className="text-xs font-bold flex items-center gap-1.5 text-purple-600 dark:text-purple-300">
                         <Database className="w-3.5 h-3.5" />
                         Camadas Públicas Ativas ({activePublicSources.length})
                       </span>
                       <button 
                         onClick={() => setIsAddSourceOpen(true)}
                         className="text-[10px] font-bold text-purple-600 hover:underline"
                       >
                         Gerenciar
                       </button>
                     </div>
                     <div className="space-y-1.5">
                       {activePublicSources.map(source => (
                         <div key={source.id} className="flex items-center justify-between text-xs">
                           <div className="flex items-center gap-2">
                             <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: source.corHex }} />
                             <span className="font-semibold">{source.sigla}</span>
                           </div>
                           <span className="text-[11px] font-mono text-slate-400">{source.pontos.length} pontos</span>
                         </div>
                       ))}
                     </div>
                   </div>
                 )}

                 <div>
                   <div className="flex items-center justify-between mb-3">
                     <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Volume por Categoria</h4>
                     <span className="text-[10px] text-blue-500 font-semibold uppercase">Tempo Real</span>
                   </div>
                   <div className="h-44 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={subprefeituraStats} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" tick={{fontSize: 9, fill: highContrastMode ? '#cbd5e1' : '#64748b'}} interval={0} />
                            <YAxis tick={{fontSize: 9, fill: highContrastMode ? '#cbd5e1' : '#64748b'}} />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: highContrastMode ? '#0f172a' : '#ffffff',
                                borderColor: highContrastMode ? '#334155' : '#e2e8f0',
                                color: highContrastMode ? '#ffffff' : '#0f172a',
                                borderRadius: '8px',
                                fontSize: '11px'
                              }} 
                            />
                            <Bar 
                              dataKey="count" 
                              fill="#3b82f6" 
                              radius={[4, 4, 0, 0]} 
                              isAnimationActive={true}
                              animationDuration={800}
                            />
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                 </div>

                 <div>
                   <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Status Operacional</h4>
                   <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between items-center">
                         <span className="flex items-center gap-2">
                           <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>Concluídos
                         </span>
                         <span className="font-bold">
                           <AnimatedCounter value={Math.max(0, filteredChamados.filter(c => c.status === 'CONCLUIDO').length + deltaConcluidos)} />
                         </span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="flex items-center gap-2">
                           <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>Em Andamento
                         </span>
                         <span className="font-bold">
                           <AnimatedCounter value={Math.max(0, filteredChamados.filter(c => ['ENCAMINHADO', 'EM_EXECUCAO', 'AGUARDANDO_APROVACAO'].includes(c.status)).length + deltaEmAndamento)} />
                         </span>
                      </div>
                      <div className="flex justify-between items-center">
                         <span className="flex items-center gap-2">
                           <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>Novos / Abertos
                         </span>
                         <span className="font-bold">
                           <AnimatedCounter value={Math.max(0, filteredChamados.filter(c => c.status === 'NOVO').length + deltaNovos)} />
                         </span>
                      </div>
                   </div>
                 </div>
              </div>
           </div>
        )}
          </div>
        )}

        {/* Side Panel for Chamado Details */}
        {selectedChamado && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setSelectedChamado(null)} 
            />
            <div className={`fixed inset-x-0 bottom-0 max-h-[85vh] z-50 rounded-t-2xl lg:absolute lg:top-20 lg:right-4 lg:bottom-16 lg:inset-auto lg:w-96 lg:max-h-none lg:rounded-2xl border shadow-2xl flex flex-col shrink-0 overflow-hidden animate-in slide-in-from-bottom-8 lg:slide-in-from-right-8 duration-200 pointer-events-auto backdrop-blur-xl ${
              highContrastMode ? 'bg-slate-900/95 border-slate-700 text-white' : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-900/20'
            }`}>
              <div className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
                highContrastMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50/70 border-slate-100'
              }`}>
                <h3 className="font-semibold flex items-center gap-2 text-sm">
                  <Hash className="w-4 h-4 text-blue-500" />
                  Detalhes do Chamado
                </h3>
                <button
                  onClick={() => setSelectedChamado(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-md transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-6">
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Protocolo 156</p>
                <p className="text-lg font-mono font-bold">{selectedChamado.protocolo}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Categoria</p>
                  <p className={`text-xs font-bold px-2.5 py-1 rounded inline-flex ${
                    highContrastMode ? 'bg-slate-800 text-blue-400' : 'bg-slate-100 text-slate-800'
                  }`}>
                    {selectedChamado.categoria.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Subprefeitura</p>
                  <p className="text-xs font-semibold">
                    {subprefeituras.find(s => s.id === selectedChamado.subprefeituraId)?.nome}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Status</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${
                      selectedChamado.isAtrasado ? 'bg-red-500' :
                      selectedChamado.status === 'CONCLUIDO' ? 'bg-emerald-500' :
                      ['ENCAMINHADO', 'EM_EXECUCAO', 'AGUARDANDO_APROVACAO'].includes(selectedChamado.status) ? 'bg-blue-500' : 'bg-amber-500'
                    }`} />
                    <span className="text-xs font-bold capitalize">
                      {selectedChamado.isAtrasado ? 'Atrasado' : selectedChamado.status.replace(/_/g, ' ').toLowerCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Prioridade</p>
                  <p className={`text-xs font-bold capitalize ${
                    selectedChamado.prioridade === 'URGENTE' || selectedChamado.prioridade === 'ALTA' 
                      ? 'text-amber-500' : 'text-slate-400'
                  }`}>
                    {selectedChamado.prioridade.toLowerCase()}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Data de Abertura</p>
                <div className="flex items-center gap-2 text-xs font-medium">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {new Date(selectedChamado.dataAbertura).toLocaleDateString('pt-BR', { 
                    day: '2-digit', month: 'long', year: 'numeric' 
                  })}
                </div>
              </div>

              <hr className={highContrastMode ? 'border-slate-800' : 'border-slate-100'} />

              <button
                onClick={() => setShowMockPhotos(!showMockPhotos)}
                className={`w-full py-2.5 px-4 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs ${
                  highContrastMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <Camera className="w-4 h-4" />
                Ver Comprovação Fotográfica
              </button>

              {showMockPhotos && (
                <div className="mt-4 space-y-3 animate-in fade-in duration-300">
                  <div className={`p-3 rounded-lg border ${
                    highContrastMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5 text-[10px] font-bold text-slate-400 uppercase">
                      <Clock className="w-3.5 h-3.5" /> Evidência Antes
                    </div>
                    <div className="w-full h-28 bg-slate-200 rounded border border-slate-300 flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400&h=300')] bg-cover bg-center opacity-60 mix-blend-multiply" />
                      <span className="text-slate-800 text-[10px] font-bold z-10 bg-white/90 px-2 py-0.5 rounded shadow-xs">Foto Técnica de Campo</span>
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg border ${
                    highContrastMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'
                  }`}>
                    <div className="flex items-center gap-2 mb-1.5 text-[10px] font-bold text-emerald-500 uppercase">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Evidência Depois
                    </div>
                    <div className="w-full h-28 bg-slate-200 rounded border border-slate-300 flex items-center justify-center relative overflow-hidden">
                       <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=400&h=300')] bg-cover bg-center opacity-70 mix-blend-multiply" />
                      <span className="text-slate-800 text-[10px] font-bold z-10 bg-white/90 px-2 py-0.5 rounded shadow-xs">Serviço Executado</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          </>
        )}

        {/* Side Panel for Public Source Point Details */}
        {selectedPublicPoint && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden"
              onClick={() => setSelectedPublicPoint(null)} 
            />
            <div className={`fixed inset-x-0 bottom-0 max-h-[85vh] z-50 rounded-t-2xl lg:absolute lg:top-20 lg:right-4 lg:bottom-16 lg:inset-auto lg:w-96 lg:max-h-none lg:rounded-2xl border shadow-2xl flex flex-col shrink-0 overflow-hidden animate-in slide-in-from-bottom-8 lg:slide-in-from-right-8 duration-200 pointer-events-auto backdrop-blur-xl ${
              highContrastMode ? 'bg-slate-900/95 border-slate-700 text-white' : 'bg-white/95 border-slate-200 text-slate-900 shadow-slate-900/20'
            }`}>
              <div className={`px-5 py-4 border-b flex items-center justify-between shrink-0 ${
                highContrastMode ? 'bg-slate-800/80 border-slate-700' : 'bg-slate-50/70 border-slate-100'
              }`}>
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-purple-500" />
                  <h3 className="font-bold text-sm truncate">
                    {selectedPublicPoint.source.sigla}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedPublicPoint(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md transition-colors min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

            <div className="p-5 flex-1 overflow-y-auto space-y-5">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${selectedPublicPoint.source.corPrimaria}`}>
                  {selectedPublicPoint.source.orgao}
                </span>
                <h4 className="text-base font-bold mt-2 leading-tight">
                  {selectedPublicPoint.point.titulo}
                </h4>
              </div>

              <div className={`p-4 rounded-xl border ${
                highContrastMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
              }`}>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Métrica Principal
                </span>
                <p className="text-2xl font-black text-purple-500">
                  {selectedPublicPoint.point.metricaPrincipal}
                </p>
                <span className="text-[11px] text-slate-400">
                  Unidade: {selectedPublicPoint.source.unidadeMedida}
                </span>
              </div>

              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Contextualização Territorial</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {selectedPublicPoint.point.detalhe}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Frequência</span>
                  <span className="font-semibold">{selectedPublicPoint.source.atualizacao}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Subprefeitura</span>
                  <span className="font-semibold">{selectedPublicPoint.point.subprefeituraNome || 'Capital'}</span>
                </div>
              </div>

              <div className={`p-3 rounded-lg border text-[11px] ${
                highContrastMode ? 'bg-slate-800/80 border-slate-700 text-slate-300' : 'bg-amber-50/70 border-amber-200 text-amber-900'
              }`}>
                <div className="flex items-center gap-1.5 font-bold mb-0.5">
                  <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  <span>Aviso Institucional</span>
                </div>
                <p className="italic">
                  {selectedPublicPoint.source.rotuloFixo}
                </p>
              </div>
            </div>
          </div>
          </>
        )}
      </div>

      {/* MODAL / PAINEL "ADICIONAR FONTE DE DADOS" */}
      {isAddSourceOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 border ${
            highContrastMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className={`px-6 py-4 border-b flex items-center justify-between ${
              highContrastMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-md">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base leading-none">
                    Catálogo de Fontes de Dados Públicos (Mock)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Ative camadas contextuais para correlacionar zeladoria com segurança, demografia e fluxo viário
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsAddSourceOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[68vh] overflow-y-auto space-y-4">
              <div className="flex items-center justify-between text-xs pb-1">
                <span className="text-slate-400 font-medium">
                  {publicSources.filter(s => s.ativa).length} de {publicSources.length} fontes ativadas no mapa
                </span>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={enableAllSources}
                    className="text-blue-600 hover:underline font-bold"
                  >
                    Ativar Todas
                  </button>
                  <span className="text-slate-300">|</span>
                  <button 
                    onClick={disableAllSources}
                    className="text-slate-500 hover:underline font-bold"
                  >
                    Desativar Todas
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3.5">
                {publicSources.map((source) => (
                  <div 
                    key={source.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                      source.ativa
                        ? highContrastMode
                          ? 'bg-slate-800/90 border-purple-500 shadow-md ring-1 ring-purple-500/50'
                          : 'bg-purple-50/40 border-purple-300 shadow-xs ring-1 ring-purple-400/30'
                        : highContrastMode
                        ? 'bg-slate-800/40 border-slate-700 opacity-80 hover:opacity-100'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="w-3 h-3 rounded-full shrink-0 shadow-2xs" style={{ backgroundColor: source.corHex }} />
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {source.nome}
                        </h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {source.atualizacao}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                        Órgão: <span className="text-slate-700 dark:text-slate-200">{source.orgao}</span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                        {source.descricao}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                          {source.totalRegistros.toLocaleString('pt-BR')} registros simulados
                        </span>
                        <span className="text-[10px] font-bold italic text-amber-600 dark:text-amber-400">
                          {source.rotuloFixo}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0 w-full sm:w-auto flex sm:flex-col items-center justify-between sm:justify-center gap-2">
                      <button
                        onClick={() => togglePublicSource(source.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 w-full sm:w-36 ${
                          source.ativa
                            ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-sm'
                            : highContrastMode
                            ? 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {source.ativa ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Camada Ativa</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Ativar Camada</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={`px-6 py-4 border-t flex items-center justify-between ${
              highContrastMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-100'
            }`}>
              <div className="text-xs text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Camadas sobrepostas utilizam gradientes espectrais com alto contraste</span>
              </div>
              <button
                onClick={() => setIsAddSourceOpen(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                Concluir Seleção
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Painel Lateral / Drawer de Cruzamento e Análise de Camadas */}
      <PainelCruzamentoCamadas
        isOpen={isCrossPanelOpen}
        onClose={() => setIsCrossPanelOpen(false)}
        isActive={crossAnalysisActive}
        onToggleActive={setCrossAnalysisActive}
        raioMetros={crossRadiusMeters}
        onChangeRaio={setCrossRadiusMeters}
        categoriaSelecionada={crossSelectedCategory}
        onChangeCategoria={setCrossSelectedCategory}
        fonteSelecionada={crossSelectedSourceId}
        onChangeFonte={setCrossSelectedSourceId}
        fontesDisponiveis={publicSources}
        hotspots={hotspotsCruzamento}
        resumo={resumoCruzamento}
        onSelectHotspot={(hotspot) => {
          const ch = chamados.find(c => c.id === hotspot.chamadoId);
          if (ch) setSelectedChamado(ch);
          setIsCrossPanelOpen(false);
        }}
      />

      {/* Painel Global de Mapeamento de Camadas (GeoJSON / WMS / Persistência entre Motores) */}
      <PainelCamadasMapeadas
        isOpen={isCamadasPanelOpen}
        onClose={() => setIsCamadasPanelOpen(false)}
        onSelectBiblioteca={(b) => {
          setModalBiblioteca(b);
          setIsCamadasPanelOpen(false);
        }}
      />

      {/* Prontuário & Diagnóstico da Biblioteca Pública Geolocalizada (Papel Análogo aos Anexos) */}
      <ModalBibliotecaPublica
        biblioteca={modalBiblioteca}
        onClose={() => setModalBiblioteca(null)}
        chamados={chamados}
        onPriorizarZeladoria={(bibId, chamadosIds) => {
          console.log(`Zeladoria prioritária acionada para entorno da biblioteca ${bibId}:`, chamadosIds);
        }}
      />
    </div>
  );
}
