import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap, ZoomControl, Circle, Tooltip, Polyline, Polygon } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';
import { renderToString } from 'react-dom/server';
import { 
  TreeDeciduous, Droplets, User, Megaphone, Hammer, ShieldAlert, Truck, AlertTriangle,
  Shield, Users as UsersIcon, Car, History, Clock, MapPin, AlertCircle, Info, BookOpen,
  Building2, Radio, CheckCircle2, Flame, BarChart3, Layers, Compass, Crosshair,
  RotateCcw, Navigation, Maximize2, Sparkles, ChevronDown
} from 'lucide-react';
import { Chamado, Subprefeitura, FonteDadosPublica, PontoFontePublica, HotspotCruzamento, MapEngineType, BibliotecaPublicaGeolocalizada } from '../types';
import { subprefeituras } from '../data';
import { METRICAS_SUBPREFEITURAS_SP } from '../dataRegioes';
import { loadSubprefeituraPolygons, SubprefeituraPolygons } from '../subprefeituraBoundaries';
import { BIBLIOTECAS_PUBLICAS_SP } from '../dataLayerMapping';

// Presets de Articulação e Navegação Rápida da Cidade de São Paulo
export interface CameraPreset {
  id: string;
  nome: string;
  sigla: string;
  center: [number, number];
  zoom: number;
}

export const SP_CAMERA_PRESETS: CameraPreset[] = [
  { id: 'sub-vm', nome: 'Subprefeitura Vila Mariana (SUB-VM)', sigla: '★ Vila Mariana', center: [-23.5855, -46.6323], zoom: 14 },
  { id: 'sp-geral', nome: 'Geral SP (Metrópole)', sigla: 'Geral SP', center: [-23.5505, -46.6333], zoom: 11 },
  { id: 'centro', nome: 'Centro Histórico (Sé / República)', sigla: 'Centro', center: [-23.5489, -46.6388], zoom: 14.5 },
  { id: 'paulista', nome: 'Av. Paulista / Jardins', sigla: 'Paulista', center: [-23.5617, -46.6560], zoom: 14.5 },
  { id: 'zona-sul', nome: 'Zona Sul (Santo Amaro / Socorro)', sigla: 'Z. Sul', center: [-23.6528, -46.7088], zoom: 12.5 },
  { id: 'zona-leste', nome: 'Zona Leste (Itaquera / Mooca)', sigla: 'Z. Leste', center: [-23.5325, -46.5411], zoom: 12.5 },
  { id: 'zona-oeste', nome: 'Zona Oeste (Pinheiros / Butantã)', sigla: 'Z. Oeste', center: [-23.5670, -46.7011], zoom: 13 },
  { id: 'zona-norte', nome: 'Zona Norte (Santana / Cantareira)', sigla: 'Z. Norte', center: [-23.4988, -46.6267], zoom: 12.5 },
];

// Custom icon para chamados de zeladoria
const createCustomIcon = (chamado: Chamado, highContrast: boolean = false) => {
  let bgColor = 'bg-amber-500'; // Default NOVO / Urgente
  if (chamado.isAtrasado) bgColor = 'bg-red-500';
  else if (chamado.status === 'CONCLUIDO') bgColor = 'bg-emerald-500';
  else if (['ENCAMINHADO', 'EM_EXECUCAO', 'AGUARDANDO_APROVACAO'].includes(chamado.status)) bgColor = 'bg-blue-500';

  let IconComponent = AlertTriangle;
  if (chamado.categoria === 'ARVORE_CAIDA') IconComponent = TreeDeciduous;
  if (chamado.categoria === 'BUEIRO') IconComponent = Droplets;
  if (chamado.categoria === 'MORADOR_RUA') IconComponent = User;
  if (chamado.categoria === 'BARULHO_PSIU') IconComponent = Megaphone;
  if (chamado.categoria === 'CALCADA' || chamado.categoria === 'TAPA_BURACO') IconComponent = Hammer;
  if (chamado.categoria === 'FISCALIZACAO_POSTURA') IconComponent = ShieldAlert;
  if (chamado.categoria === 'DESFAZIMENTO') IconComponent = Truck;

  const sizeClass = highContrast ? 'w-9 h-9 border-[3px] border-white ring-2 ring-slate-900 shadow-xl' : 'w-8 h-8 border-2 border-white shadow-md';
  const iconSize = highContrast ? 18 : 16;

  const html = renderToString(
    <div className={`${sizeClass} rounded-full flex items-center justify-center ${bgColor} text-white font-bold transition-transform hover:scale-110`}>
      <IconComponent size={iconSize} />
    </div>
  );

  const dim = highContrast ? 36 : 32;
  return L.divIcon({
    className: 'custom-leaflet-icon',
    html,
    iconSize: [dim, dim],
    iconAnchor: [dim / 2, dim / 2],
  });
};

// Custom icon para pontos de fontes públicas de dados (SSP, IBGE, CET, SP156 Histórico)
const createPublicPointIcon = (sourceId: string, highContrast: boolean = false) => {
  let bgColor = 'bg-purple-600';
  let IconComponent = Shield;

  if (sourceId === 'SSP_SP') {
    bgColor = 'bg-purple-600';
    IconComponent = Shield;
  } else if (sourceId === 'IBGE') {
    bgColor = 'bg-cyan-600';
    IconComponent = UsersIcon;
  } else if (sourceId === 'CET') {
    bgColor = 'bg-amber-600';
    IconComponent = Car;
  } else if (sourceId === 'SP156_HISTORICO') {
    bgColor = 'bg-emerald-600';
    IconComponent = History;
  }

  const sizeClass = highContrast 
    ? 'w-8 h-8 border-[3px] border-white ring-2 ring-black shadow-xl' 
    : 'w-7 h-7 border-2 border-white shadow-md';
  const iconSize = highContrast ? 16 : 14;

  const html = renderToString(
    <div className={`${sizeClass} rounded-full flex items-center justify-center ${bgColor} text-white transition-transform hover:scale-110`}>
      <IconComponent size={iconSize} />
    </div>
  );

  const dim = highContrast ? 32 : 28;
  return L.divIcon({
    className: 'custom-public-icon',
    html,
    iconSize: [dim, dim],
    iconAnchor: [dim / 2, dim / 2],
  });
};

// Custom icon para equipamentos cívicos e bibliotecas públicas
const createCivicPointIcon = (highContrast: boolean = false) => {
  const sizeClass = highContrast
    ? 'w-9 h-9 border-[3px] border-white ring-2 ring-rose-950 shadow-xl bg-rose-600'
    : 'w-8 h-8 border-2 border-white shadow-md bg-rose-500';
  const html = renderToString(
    <div className={`${sizeClass} rounded-full flex items-center justify-center text-white transition-transform hover:scale-110`}>
      <BookOpen size={highContrast ? 17 : 15} />
    </div>
  );
  const dim = highContrast ? 36 : 32;
  return L.divIcon({
    className: 'custom-civic-icon',
    html,
    iconSize: [dim, dim],
    iconAnchor: [dim / 2, dim / 2],
  });
};

// Heatmap Layer com suporte a gradiente específico e múltiplos canais
export function HeatmapLayer({ 
  points, 
  show, 
  gradient,
  radius = 22,
  blur = 15,
  minOpacity = 0.35
}: { 
  points: [number, number, number][]; 
  show: boolean; 
  gradient?: Record<number, string>;
  radius?: number;
  blur?: number;
  minOpacity?: number;
  key?: React.Key;
}) {
  const map = useMap();
  const layerRef = useRef<any>(null);

  useEffect(() => {
    if (!show || points.length === 0) {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
      return;
    }

    if (!layerRef.current && (L as any).heatLayer) {
      layerRef.current = (L as any).heatLayer(points, {
        radius,
        blur,
        minOpacity,
        maxZoom: 13,
        gradient: gradient || { 
          0.4: '#3b82f6', 
          0.6: '#22c55e', 
          0.8: '#eab308', 
          1.0: '#ef4444' 
        }
      }).addTo(map);
    } else if (layerRef.current) {
      layerRef.current.setLatLngs(points);
    }

    return () => {
      if (layerRef.current) {
        map.removeLayer(layerRef.current);
        layerRef.current = null;
      }
    };
  }, [map, points, show, gradient, radius, blur, minOpacity]);

  return null;
}

function MapController({ 
  selectedChamadoId,
  selectedChamadoCoords,
  selectedSubId,
  selectedSubCoords,
  presetTrigger
}: { 
  selectedChamadoId?: string;
  selectedChamadoCoords?: [number, number];
  selectedSubId?: string;
  selectedSubCoords?: [number, number];
  presetTrigger?: { center: [number, number]; zoom: number; timestamp: number } | null;
}) {
  const map = useMap();
  const lastTargetKeyRef = useRef<string>('init');
  const lastPresetTimestampRef = useRef<number>(0);

  // Resize handler para garantir fluidez ao colapsar/expandir painéis
  useEffect(() => {
    const invalidate = () => {
      try {
        map.invalidateSize();
      } catch (_) {}
    };
    invalidate();
    const timer = setTimeout(invalidate, 200);
    window.addEventListener('resize', invalidate);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', invalidate);
    };
  }, [map]);

  useEffect(() => {
    // 1. Disparo explícito de preset de câmera
    if (presetTrigger && presetTrigger.timestamp !== lastPresetTimestampRef.current) {
      lastPresetTimestampRef.current = presetTrigger.timestamp;
      lastTargetKeyRef.current = `preset-${presetTrigger.timestamp}`;
      map.flyTo(presetTrigger.center, presetTrigger.zoom, { animate: true, duration: 1.1 });
      return;
    }

    // 2. Seleção de chamado individual
    if (selectedChamadoId && selectedChamadoCoords) {
      const key = `chamado-${selectedChamadoId}`;
      if (lastTargetKeyRef.current !== key) {
        lastTargetKeyRef.current = key;
        map.flyTo(selectedChamadoCoords, 16, { animate: true, duration: 0.9 });
      }
      return;
    }

    // 3. Seleção de subprefeitura
    if (selectedSubId && selectedSubCoords) {
      const key = `sub-${selectedSubId}`;
      if (lastTargetKeyRef.current !== key) {
        lastTargetKeyRef.current = key;
        map.flyTo(selectedSubCoords, 13.5, { animate: true, duration: 0.9 });
      }
      return;
    }

    // 4. Retorno ao geral se ambos forem desmarcados
    if (!selectedChamadoId && !selectedSubId && lastTargetKeyRef.current !== 'default-sp' && lastTargetKeyRef.current !== 'init') {
      lastTargetKeyRef.current = 'default-sp';
      map.flyTo([-23.5505, -46.6333], 11, { animate: true, duration: 0.9 });
    }
  }, [selectedChamadoId, selectedChamadoCoords, selectedSubId, selectedSubCoords, presetTrigger, map]);

  return null;
}

interface MapComponentProps {
  chamados: Chamado[];
  viewMode: 'HEATMAP' | 'CLUSTER' | 'NORMAL' | 'LISTA' | 'COMPARACAO';
  mapEngineMode?: MapEngineType;
  onMarkerClick: (chamado: Chamado) => void;
  selectedSubprefeitura: Subprefeitura | null;
  selectedChamado?: Chamado | null;
  showPontosCegos: boolean;
  heatmapType?: 'DENSIDADE' | 'CRITICIDADE';
  activePublicSources?: FonteDadosPublica[];
  highContrastMode?: boolean;
  onPublicPointClick?: (point: PontoFontePublica, source: FonteDadosPublica) => void;
  onSelectSubprefeitura?: (sub: Subprefeitura) => void;
  onSelectBiblioteca?: (biblioteca: BibliotecaPublicaGeolocalizada) => void;
  crossAnalysisActive?: boolean;
  hotspotsCruzamento?: HotspotCruzamento[];
}

export default function MapComponent({ 
  chamados, 
  viewMode, 
  mapEngineMode = 'LEAFLET',
  onMarkerClick, 
  selectedSubprefeitura, 
  showPontosCegos, 
  selectedChamado, 
  heatmapType = 'DENSIDADE',
  activePublicSources = [],
  highContrastMode = false,
  onPublicPointClick,
  onSelectSubprefeitura,
  onSelectBiblioteca,
  crossAnalysisActive = false,
  hotspotsCruzamento = []
}: MapComponentProps) {
  // Preset de navegação ativo
  const [activePreset, setActivePreset] = useState<string>('sp-geral');
  const [presetTrigger, setPresetTrigger] = useState<{ center: [number, number]; zoom: number; timestamp: number } | null>(null);

  const handleApplyPreset = (preset: CameraPreset) => {
    setActivePreset(preset.id);
    setPresetTrigger({
      center: preset.center,
      zoom: preset.zoom,
      timestamp: Date.now()
    });
  };

  const handleRecenter = () => {
    handleApplyPreset(SP_CAMERA_PRESETS[0]);
  };

  const selectedChamadoCoords = useMemo<[number, number] | undefined>(() => {
    return selectedChamado ? [selectedChamado.lat, selectedChamado.lng] : undefined;
  }, [selectedChamado?.lat, selectedChamado?.lng]);

  const selectedSubCoords = useMemo<[number, number] | undefined>(() => {
    return selectedSubprefeitura ? [selectedSubprefeitura.lat, selectedSubprefeitura.lng] : undefined;
  }, [selectedSubprefeitura?.lat, selectedSubprefeitura?.lng]);

  // Pontos de calor dos chamados operacionais
  const heatPoints = useMemo(() => {
    if (heatmapType === 'DENSIDADE') {
      return chamados.map((c) => [c.lat, c.lng, 1] as [number, number, number]);
    } else {
      // Criticidade: tempo de espera
      const now = new Date().getTime();
      return chamados.map((c) => {
        const waitMs = now - new Date(c.dataAbertura).getTime();
        const waitDays = waitMs / (1000 * 60 * 60 * 24);
        const intensity = Math.min(waitDays / 30, 1.0); 
        return [c.lat, c.lng, intensity] as [number, number, number];
      });
    }
  }, [chamados, heatmapType]);

  // Gradiente clássico para chamados operacionais (calibrado para não colidir com fontes públicas)
  const chamadosGradient = useMemo(() => {
    if (heatmapType === 'CRITICIDADE') {
      return { 0.4: '#fde047', 0.6: '#fb923c', 0.8: '#ef4444', 1.0: '#7f1d1d' };
    }
    return { 0.3: '#60a5fa', 0.5: '#34d399', 0.75: '#facc15', 1.0: '#dc2626' };
  }, [heatmapType]);

  // Pontos cegos operacionais
  const delayedChamados = useMemo(() => {
    return chamados.filter(c => c.isAtrasado);
  }, [chamados]);

  // Marcadores de chamados com Tooltip em Hover (sem exigir clique)
  const markers = chamados.map((chamado) => (
    <Marker
      key={chamado.id}
      position={[chamado.lat, chamado.lng]}
      icon={createCustomIcon(chamado, highContrastMode)}
      eventHandlers={{
        click: () => onMarkerClick(chamado),
      }}
    >
      <Tooltip direction="top" offset={[0, highContrastMode ? -18 : -14]} opacity={0.96} className="govtech-leaflet-tooltip">
        <div className="p-1 min-w-[200px] max-w-[260px] text-left">
          <div className="flex items-center justify-between gap-2 mb-1 border-b border-slate-100 pb-1">
            <span className="text-[10px] font-mono font-bold text-slate-500">{chamado.protocolo}</span>
            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
              chamado.isAtrasado 
                ? 'bg-red-100 text-red-700' 
                : chamado.status === 'CONCLUIDO' 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {chamado.isAtrasado ? 'Atrasado' : chamado.status.replace(/_/g, ' ')}
            </span>
          </div>
          <p className="text-xs font-bold text-slate-800 line-clamp-1 mb-0.5">
            {chamado.categoria.replace('_', ' ')}
          </p>
          {chamado.endereco && (
            <p className="text-[11px] text-slate-600 line-clamp-1 mb-1">
              📍 {chamado.endereco}
            </p>
          )}
          <div className="flex items-center justify-between text-[10px] text-slate-500 pt-0.5 border-t border-slate-100 mt-1">
            <span>Prioridade: <strong className="capitalize">{chamado.prioridade.toLowerCase()}</strong></span>
            <span className="text-blue-600 font-semibold">Clique p/ ver</span>
          </div>
        </div>
      </Tooltip>
    </Marker>
  ));

  // Marcadores das fontes públicas ativas com Tooltip em Hover
  const publicMarkers = activePublicSources.flatMap((source) =>
    source.pontos.map((ponto) => (
      <Marker
        key={`${source.id}-${ponto.id}`}
        position={[ponto.lat, ponto.lng]}
        icon={createPublicPointIcon(source.id, highContrastMode)}
        eventHandlers={{
          click: () => onPublicPointClick?.(ponto, source),
        }}
      >
        <Tooltip direction="top" offset={[0, highContrastMode ? -16 : -12]} opacity={0.96} className="govtech-leaflet-tooltip">
          <div className="p-1.5 min-w-[220px] max-w-[280px] text-left">
            <div className="flex items-center justify-between gap-1.5 mb-1">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${source.corPrimaria}`}>
                {source.sigla}
              </span>
              <span className="text-[9px] text-slate-400 font-medium">
                {source.atualizacao}
              </span>
            </div>
            <h5 className="text-xs font-bold text-slate-900 leading-tight mb-1">
              {ponto.titulo}
            </h5>
            <div className="bg-slate-50 p-1.5 rounded border border-slate-100 mb-1.5">
              <span className="text-[10px] text-slate-500 uppercase block font-semibold">Métrica</span>
              <span className="text-xs font-extrabold text-slate-800">
                {ponto.metricaPrincipal}
              </span>
            </div>
            <p className="text-[10px] text-slate-600 line-clamp-2 mb-1.5">
              {ponto.detalhe}
            </p>
            <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400">
              <span className="italic">{source.rotuloFixo}</span>
            </div>
          </div>
        </Tooltip>
      </Marker>
    ))
  );

  // Tiles sem chave: OSM nos mapas operacionais e Esri no modo satélite híbrido.
  const isSatelliteMode = mapEngineMode === 'SATELITE_ORTOFOTO';
  const tileUrl = isSatelliteMode
    ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
    : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

  const labelsTileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}';

  // Dicionário rápido de métricas por subprefeitura ID
  const metricasPorSubId = useMemo(() => {
    const map = new Map<string, typeof METRICAS_SUBPREFEITURAS_SP[0]>();
    METRICAS_SUBPREFEITURAS_SP.forEach(m => map.set(m.subprefeituraId, m));
    return map;
  }, []);

  // Cores dinâmicas para polígonos das 32 Subprefeituras
  const getSubprefeituraColor = (subId: string) => {
    const met = metricasPorSubId.get(subId);
    if (!met) return '#64748b';
    if (met.slaCumpridoPercentual >= 90) return '#10b981'; // Excelente
    if (met.slaCumpridoPercentual >= 85) return '#3b82f6'; // Bom
    if (met.slaCumpridoPercentual >= 80) return '#f59e0b'; // Alerta
    return '#ef4444'; // Crítico
  };

  const isChoroplethMode = mapEngineMode === 'CHOROPLETH_32_SUBS';
  const isBuffersMode = mapEngineMode === 'SERVICE_BUFFERS';
  const isHeatmapEngine = mapEngineMode === 'HEATMAP_KERNEL';
  const [subprefeituraPolygons, setSubprefeituraPolygons] = useState<SubprefeituraPolygons>({});
  const [boundaryLoadState, setBoundaryLoadState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');

  useEffect(() => {
    if (!isChoroplethMode) return;

    const controller = new AbortController();
    setBoundaryLoadState('loading');

    loadSubprefeituraPolygons(controller.signal)
      .then((polygons) => {
        setSubprefeituraPolygons(polygons);
        setBoundaryLoadState('loaded');
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        console.error('Falha ao carregar os contornos das subprefeituras:', error);
        setBoundaryLoadState('error');
      });

    return () => controller.abort();
  }, [isChoroplethMode]);

  return (
    <div className={`w-full h-full rounded-xl overflow-hidden border shadow-sm relative z-0 ${
      highContrastMode ? 'border-slate-800 bg-slate-950' : 'border-slate-200 bg-slate-100'
    }`}>
      <MapContainer
        center={[-23.5505, -46.6333]}
        zoom={11}
        style={{ width: '100%', height: '100%', zIndex: 0 }}
        zoomControl={false}
        preferCanvas={true}
        fadeAnimation={false}
      >
        <TileLayer
          attribution={isSatelliteMode
            ? 'Tiles &copy; Esri &mdash; Source: Esri and the GIS User Community'
            : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}
          url={tileUrl}
          maxZoom={19}
        />

        {/* Camada transparente de referências cartográficas no satélite híbrido. */}
        {isSatelliteMode && (
          <TileLayer
            attribution='Reference &copy; Esri'
            url={labelsTileUrl}
            pane="overlayPane"
            opacity={0.9}
            maxZoom={19}
          />
        )}

        <ZoomControl position="bottomright" />
        
        <MapController 
          selectedChamadoId={selectedChamado?.id}
          selectedChamadoCoords={selectedChamadoCoords}
          selectedSubId={selectedSubprefeitura?.id}
          selectedSubCoords={selectedSubCoords}
          presetTrigger={presetTrigger}
        />
        
        {/* ============================================================ */}
        {/* MOTOR 4: POLÍGONOS COROPLÉTICOS DAS 32 SUBPREFEITURAS DE SP */}
        {/* ============================================================ */}
        {isChoroplethMode && Object.entries(subprefeituraPolygons).map(([subId, coords]) => {
          const met = metricasPorSubId.get(subId);
          const subObj = subprefeituras.find(s => s.id === subId);
          const cor = getSubprefeituraColor(subId);
          const isSelected = selectedSubprefeitura?.id === subId;

          return (
            <Polygon
              key={`choropleth-poly-${subId}`}
              positions={coords}
              pathOptions={{
                color: isSelected ? '#ffffff' : highContrastMode ? '#cbd5e1' : '#334155',
                weight: isSelected ? 3 : 1.5,
                fillColor: cor,
                fillOpacity: isSelected ? 0.75 : 0.35,
                dashArray: isSelected ? '6, 6' : '4, 4',
                lineCap: 'round',
                lineJoin: 'round'
              }}
              eventHandlers={{
                click: () => {
                  if (subObj && onSelectSubprefeitura) {
                    onSelectSubprefeitura(subObj);
                  }
                }
              }}
            >
              <Tooltip direction="center" sticky opacity={0.97} className="govtech-choropleth-tooltip">
                <div className="p-2 text-left min-w-[210px] font-sans">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-1 mb-1.5">
                    <span className="font-bold text-xs text-slate-900">{met?.nome || subObj?.nome || `Sub ${subId}`}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-slate-100 text-slate-700">
                      {met?.zona || 'SP'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] mb-1.5">
                    <div>
                      <span className="text-slate-500 text-[10px] block">Cumprimento SLA</span>
                      <span className="font-bold text-emerald-700">{met?.slaCumpridoPercentual.toFixed(1)}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Tempo Médio (TMA)</span>
                      <span className="font-bold text-slate-800">{met?.tmaHoras.toFixed(1)}h</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Demandas Abertas</span>
                      <span className="font-bold text-amber-700">{met?.chamadosAbertos} ordens</span>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[10px] block">Taxa Resolução</span>
                      <span className="font-bold text-blue-700">{met?.taxaResolucaoPercentual.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="text-[9px] text-slate-500 pt-1 border-t border-slate-100 flex items-center justify-between">
                    <span>População: {met?.populacao ? met.populacao.toLocaleString('pt-BR') : 'N/D'}</span>
                    <span className="text-purple-600 font-bold">Clique p/ filtrar</span>
                  </div>
                </div>
              </Tooltip>
            </Polygon>
          );
        })}

        {/* ============================================================ */}
        {/* MOTOR 5: BUFFERS CONCÊNTRICOS & POLOS CÍVICOS (BIBLIOTECAS)  */}
        {/* ============================================================ */}
        {isBuffersMode && BIBLIOTECAS_PUBLICAS_SP.map((bib) => {
          // Contagem de chamados abrangidos pelo buffer de 500m
          const chamadosNoRaio = chamados.filter(c => {
            const dLat = (c.lat - bib.lat) * 111320;
            const dLng = (c.lng - bib.lng) * 111320 * Math.cos(bib.lat * (Math.PI / 180));
            const dist = Math.sqrt(dLat * dLat + dLng * dLng);
            return dist <= 500;
          }).length;

          return (
            <React.Fragment key={`buffer-bib-${bib.id}`}>
              {/* Buffer Pedonal Primário de 500 metros */}
              <Circle
                center={[bib.lat, bib.lng]}
                radius={500}
                pathOptions={{
                  color: '#9333ea',
                  fillColor: '#a855f7',
                  fillOpacity: 0.16,
                  weight: 2,
                  dashArray: '5, 5'
                }}
              />
              {/* Buffer de Atendimento Rápido / Viatura de 1.500 metros */}
              <Circle
                center={[bib.lat, bib.lng]}
                radius={1500}
                pathOptions={{
                  color: '#3b82f6',
                  fillColor: '#60a5fa',
                  fillOpacity: 0.06,
                  weight: 1.5,
                  dashArray: '8, 8'
                }}
              />
              {/* Marcador Cívico da Biblioteca */}
              <Marker
                position={[bib.lat, bib.lng]}
                icon={createCivicPointIcon(highContrastMode)}
                eventHandlers={{
                  click: () => onSelectBiblioteca?.(bib)
                }}
              >
                <Tooltip direction="top" offset={[0, -18]} opacity={0.96}>
                  <div className="p-1.5 text-left max-w-[240px]">
                    <div className="flex items-center gap-1 text-[10px] text-rose-600 font-bold uppercase mb-0.5">
                      <BookOpen size={12} />
                      <span>{bib.tipo.replace('_', ' ')}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 leading-tight mb-1">{bib.nome}</p>
                    <p className="text-[11px] text-slate-600 mb-1.5 line-clamp-1">{bib.endereco}</p>
                    <div className="p-1.5 rounded bg-purple-50 border border-purple-100 text-[10px] text-purple-900 flex items-center justify-between">
                      <span className="font-semibold">Demandas no raio 500m:</span>
                      <span className="font-bold px-1.5 py-0.5 bg-purple-200 text-purple-950 rounded-full font-mono">
                        {chamadosNoRaio}
                      </span>
                    </div>
                  </div>
                </Tooltip>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* Heatmap principal dos chamados de zeladoria (quando em modo HEATMAP ou motor HEATMAP_KERNEL) */}
        {(viewMode === 'HEATMAP' || isHeatmapEngine) && (
          <HeatmapLayer 
            key={`heat-chamados-${heatmapType}`} 
            points={heatPoints} 
            show={true} 
            gradient={chamadosGradient}
            radius={highContrastMode ? 26 : 22}
            minOpacity={0.4}
          />
        )}

        {/* Camadas independentes de Heatmap para fontes de dados públicas ativas */}
        {(viewMode === 'HEATMAP' || isHeatmapEngine) && activePublicSources.map((source) => {
          const sourcePoints = source.pontos.map(p => [p.lat, p.lng, p.intensidade] as [number, number, number]);
          return (
            <HeatmapLayer
              key={`heat-source-${source.id}`}
              points={sourcePoints}
              show={true}
              gradient={source.gradienteHeatmap}
              radius={highContrastMode ? 28 : 24}
              blur={16}
              minOpacity={0.45}
            />
          );
        })}

        {/* Modo Cluster com Markers dos chamados */}
        {(viewMode === 'CLUSTER' && !isChoroplethMode && !isBuffersMode && !isHeatmapEngine) && (
          <MarkerClusterGroup chunkedLoading>
            {markers}
          </MarkerClusterGroup>
        )}

        {/* Modo Normal / Satélite / Buffers com marcadores operacionais */}
        {((viewMode !== 'HEATMAP' && viewMode !== 'CLUSTER' && !isChoroplethMode && !isHeatmapEngine) || isSatelliteMode || isBuffersMode) && markers}

        {/* Marcadores individuais das fontes públicas */}
        {!isHeatmapEngine && viewMode !== 'HEATMAP' && publicMarkers}

        {/* Círculos de Pontos Cegos Operacionais (Chamados atrasados > 15 dias) */}
        {showPontosCegos && delayedChamados.map(c => (
          <Circle
            key={`blind-${c.id}`}
            center={[c.lat, c.lng]}
            radius={850}
            pathOptions={{ 
              color: highContrastMode ? '#f87171' : '#dc2626', 
              dashArray: '6, 8', 
              fillOpacity: highContrastMode ? 0.18 : 0.12, 
              weight: highContrastMode ? 3.5 : 2.5 
            }}
          />
        ))}

        {/* Vetores e Halos do Cruzamento de Camadas (Interno x Externo) */}
        {crossAnalysisActive && hotspotsCruzamento.map(h => (
          <React.Fragment key={`leaflet-cross-${h.id}`}>
            <Polyline
              positions={[
                [h.chamadoLat, h.chamadoLng],
                [h.pontoLat, h.pontoLng]
              ]}
              pathOptions={{
                color: h.grauRisco === 'CRITICO' ? '#ef4444' : h.grauRisco === 'ALTO' ? '#f59e0b' : '#a855f7',
                weight: h.grauRisco === 'CRITICO' ? 3 : 2,
                dashArray: '6, 6',
                opacity: 0.85
              }}
            />
            <Circle
              center={[h.chamadoLat, h.chamadoLng]}
              radius={h.distanciaMetros}
              pathOptions={{
                color: h.grauRisco === 'CRITICO' ? '#ef4444' : '#a855f7',
                fillColor: h.grauRisco === 'CRITICO' ? '#ef4444' : '#c084fc',
                fillOpacity: 0.12,
                weight: 1.5,
                dashArray: '3, 4'
              }}
            />
          </React.Fragment>
        ))}
      </MapContainer>

      {/* HUD Cartográfico Profissional Flutuante */}
      <div className="absolute top-3 left-3 z-[400] flex flex-col gap-2 pointer-events-none max-w-[320px]">
        {/* Card do Motor Ativo */}
        <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md text-white border border-slate-700/80 rounded-xl px-3 py-2 shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${
              isChoroplethMode ? 'bg-indigo-600' :
              isBuffersMode ? 'bg-purple-600' :
              isSatelliteMode ? 'bg-emerald-600' :
              isHeatmapEngine ? 'bg-amber-600' : 'bg-blue-600'
            }`}>
              {isChoroplethMode ? <BarChart3 className="w-4 h-4 text-white" /> :
               isBuffersMode ? <Radio className="w-4 h-4 text-white" /> :
               isSatelliteMode ? <Layers className="w-4 h-4 text-white" /> :
               isHeatmapEngine ? <Flame className="w-4 h-4 text-white" /> :
               <MapPin className="w-4 h-4 text-white" />}
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">
                {isChoroplethMode ? 'Coroplético 32 Subprefeituras' :
                 isBuffersMode ? 'Buffers & Polos Cívicos' :
                 isSatelliteMode ? 'Satélite & Ortofoto Híbrida' :
                 isHeatmapEngine ? 'Heatmap Kernel KDE' :
                 'Leaflet GovTech SP156'}
              </div>
              <div className="text-[10px] text-slate-400">
                {isChoroplethMode
                  ? boundaryLoadState === 'loading'
                    ? 'Carregando 32 limites territoriais…'
                    : boundaryLoadState === 'error'
                      ? 'Falha ao carregar limites territoriais'
                      : `${Object.keys(subprefeituraPolygons).length} polígonos territoriais oficiais`
                  : isBuffersMode ? `${BIBLIOTECAS_PUBLICAS_SP.length} bibliotecas municipais` :
                 isSatelliteMode ? 'Esri World Imagery + Esri Referências' :
                 isHeatmapEngine ? `${heatPoints.length} pontos de calor` :
                 `${chamados.length} ordens georreferenciadas`}
              </div>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
            {mapEngineMode}
          </span>
        </div>

        {/* Legenda Dinâmica Especializada por Motor */}
        {isChoroplethMode && (
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md text-slate-900 border border-slate-200 rounded-xl p-2.5 shadow-md text-xs space-y-1.5">
            <div className="flex items-center justify-between font-bold text-[11px] text-slate-700 pb-1 border-b border-slate-100">
              <span>Eficiência de SLA (IEZ)</span>
              <span className="text-[10px] text-slate-400">32 Subs</span>
            </div>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#10b981]"></span>
                <span>≥ 90% (Excelente)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#3b82f6]"></span>
                <span>85–89% (Meta)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#f59e0b]"></span>
                <span>80–84% (Atenção)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-[#ef4444]"></span>
                <span>&lt; 80% (Crítico)</span>
              </div>
            </div>
            {selectedSubprefeitura && (
              <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px]">
                <span className="text-purple-700 font-bold">Filtro: {selectedSubprefeitura.nome}</span>
                {onSelectSubprefeitura && (
                  <button 
                    onClick={() => onSelectSubprefeitura(null as any)}
                    className="text-slate-500 hover:text-slate-800 underline font-semibold"
                  >
                    Limpar
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {isBuffersMode && (
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md text-slate-900 border border-slate-200 rounded-xl p-2.5 shadow-md text-xs space-y-1.5">
            <div className="flex items-center justify-between font-bold text-[11px] text-slate-700 pb-1 border-b border-slate-100">
              <span>Raios de Cobertura Cívica</span>
              <span className="text-[10px] text-purple-700 font-bold">SP156</span>
            </div>
            <div className="space-y-1 text-[10px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-purple-600 bg-purple-200/50"></span>
                <span><strong>500m</strong> — Caminhabilidade pedonal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-blue-500 bg-blue-100/40"></span>
                <span><strong>1.500m</strong> — Deslocamento viário / viatura</span>
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <span className="w-3 h-3 rounded-full bg-rose-500"></span>
                <span>Biblioteca Municipal / Marco Cívico</span>
              </div>
            </div>
          </div>
        )}

        {isSatelliteMode && (
          <div className="pointer-events-auto bg-slate-900/90 backdrop-blur-md text-white border border-slate-800 rounded-xl p-2.5 shadow-md text-[11px] space-y-1">
            <div className="flex items-center justify-between font-bold text-slate-300">
              <span>Camada Ortofoto Híbrida</span>
              <span className="text-[9px] text-emerald-400 font-mono">Alta Precisão</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Mosaico aéreo de alta resolução Esri combinado com a camada Esri de limites e nomes de logradouros para inspeção territorial de vias e calçadas.
            </p>
          </div>
        )}

        {isHeatmapEngine && (
          <div className="pointer-events-auto bg-white/95 backdrop-blur-md text-slate-900 border border-slate-200 rounded-xl p-2.5 shadow-md text-xs space-y-1.5">
            <div className="flex items-center justify-between font-bold text-[11px] text-slate-700 pb-1 border-b border-slate-100">
              <span>Densidade Kernel de Ocorrências</span>
              <span className="text-[10px] text-amber-600 font-bold">{heatPoints.length} pts</span>
            </div>
            <div className="h-2 rounded-full w-full bg-gradient-to-r from-blue-500 via-emerald-500 via-amber-500 to-red-500"></div>
            <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
              <span>Baixa Concentração</span>
              <span>Hotspot Crítico</span>
            </div>
          </div>
        )}
      </div>

      {/* Dock Flutuante de Articulação e Presets de Navegação Rápida (Topo Central / Direito) */}
      <div className="absolute top-3 right-3 z-[400] flex items-center gap-1.5 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-xl text-xs text-white">
          <div className="flex items-center gap-1 px-2 py-1 text-[11px] font-bold text-slate-300 border-r border-slate-700/80 hidden md:flex">
            <Compass className="w-3.5 h-3.5 text-sky-400" />
            <span>Vistas</span>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto max-w-[420px] scrollbar-none py-0.5 px-0.5">
            {SP_CAMERA_PRESETS.map((preset) => {
              const isActive = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400 font-bold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                  title={`Navegar suavemente para: ${preset.nome}`}
                >
                  {preset.sigla}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleRecenter}
            className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg border-l border-slate-700/80 transition-colors ml-0.5"
            title="Recentralizar para São Paulo (Visão Geral)"
          >
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
          </button>
        </div>
      </div>
    </div>
  );
}
