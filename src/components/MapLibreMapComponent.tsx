import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Chamado, Subprefeitura, FonteDadosPublica, HotspotCruzamento, CamadaMapeada, BibliotecaPublicaGeolocalizada } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Globe, Compass, Layers, Eye, ShieldAlert, BookOpen, 
  RotateCcw, Sparkles, Building2, MapPin, ZoomIn, ZoomOut,
  Navigation, Maximize2
} from 'lucide-react';

interface MapLibreMapComponentProps {
  chamados: Chamado[];
  subprefeituras: Subprefeitura[];
  fontesPublicas: FonteDadosPublica[];
  selectedSubId: string | null;
  onSelectChamado?: (chamado: Chamado) => void;
  onSelectBiblioteca?: (biblioteca: BibliotecaPublicaGeolocalizada) => void;
  highContrast: boolean;
  crossAnalysisActive: boolean;
  hotspotsCruzamento?: HotspotCruzamento[];
}

export default function MapLibreMapComponent({
  chamados,
  subprefeituras,
  fontesPublicas,
  selectedSubId,
  onSelectChamado,
  onSelectBiblioteca,
  highContrast,
  crossAnalysisActive,
  hotspotsCruzamento = []
}: MapLibreMapComponentProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const prevSubIdRef = useRef<string | null>(null);
  const { camadasMapeadas, bibliotecasPublicas, isCamadaAtiva } = useApp();

  const [pitch, setPitch] = useState<number>(45);
  const [bearing, setBearing] = useState<number>(-15);
  const [is3DMode, setIs3DMode] = useState<boolean>(true);
  const [styleMode, setStyleMode] = useState<'STANDARD' | 'DARK' | 'CADASTRO'>('STANDARD');
  const [activePopupInfo, setActivePopupInfo] = useState<{
    tipo: 'CHAMADO' | 'BIBLIOTECA' | 'HOTSPOT';
    item: any;
  } | null>(null);

  // Determinar centro do mapa baseado na subprefeitura selecionada
  const centerCoords = useMemo<[number, number]>(() => {
    if (selectedSubId) {
      const sub = subprefeituras.find(s => s.id === selectedSubId);
      if (sub && typeof sub.lat === 'number' && typeof sub.lng === 'number') {
        return [sub.lng, sub.lat]; // [lng, lat]
      }
    }
    return [-46.6323, -23.5855]; // Centro da jurisdição SUB-VM [lng, lat]
  }, [selectedSubId, subprefeituras]);

  // Tiles humanitários OSM gratuitos e sem chave de API para o motor MapLibre.
  const mapStyle = useMemo(() => {
    const isDarkStyle = highContrast || styleMode === 'DARK';
    const paint = isDarkStyle
      ? {
          'raster-brightness-max': 0.45,
          'raster-contrast': 0.25,
          'raster-saturation': -0.7,
        }
      : styleMode === 'CADASTRO'
        ? {
            'raster-contrast': 0.12,
            'raster-saturation': -0.35,
          }
        : {};

    return {
      version: 8 as const,
      sources: {
        'osm-humanitarian': {
          type: 'raster' as const,
          tiles: [
            'https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
          ],
          tileSize: 256,
          attribution: '© OpenStreetMap contributors, Tiles style by Humanitarian OpenStreetMap Team',
        },
      },
      layers: [
        {
          id: 'osm-humanitarian-layer',
          type: 'raster' as const,
          source: 'osm-humanitarian',
          minzoom: 0,
          maxzoom: 19,
          paint,
        },
      ],
    };
  }, [highContrast, styleMode]);

  // Inicializar o mapa MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: mapStyle,
        center: centerCoords,
        zoom: 13.5,
        pitch: is3DMode ? pitch : 0,
        bearing: is3DMode ? bearing : 0,
        attributionControl: false
      });

      map.addControl(new maplibregl.NavigationControl({ showCompass: true, showZoom: true }), 'top-right');

      map.on('rotateend', () => {
        setBearing(Math.round(map.getBearing()));
      });
      map.on('pitchend', () => {
        setPitch(Math.round(map.getPitch()));
      });

      mapRef.current = map;

      const ro = new ResizeObserver(() => {
        try {
          map.resize();
        } catch (_) {}
      });
      if (mapContainerRef.current) ro.observe(mapContainerRef.current);

      return () => {
        ro.disconnect();
        map.remove();
        mapRef.current = null;
      };
    } catch (err) {
      console.warn('MapLibre GL initialization error, falling back gracefully:', err);
    }
  }, [mapStyle]);

  // Atualizar centro e rotação APENAS quando a subprefeitura mudar deliberadamente
  useEffect(() => {
    if (!mapRef.current) return;
    if (prevSubIdRef.current === selectedSubId) return;
    prevSubIdRef.current = selectedSubId;

    // Evita manter o motor em estado contínuo de zoom durante atualizações frequentes.
    mapRef.current.jumpTo({
      center: centerCoords,
      zoom: 13.5,
      pitch: is3DMode ? 45 : 0
    });
  }, [centerCoords, selectedSubId, is3DMode]);

  // Sincronizar Marcadores de Camadas Ativas no MapLibre GL
  useEffect(() => {
    if (!mapRef.current) return;

    // Limpar marcadores anteriores
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    const map = mapRef.current;

    // 1. CAMADA DE ZELADORIA (se ativa no contexto global)
    if (isCamadaAtiva('layer-zeladoria-interna')) {
      chamados.forEach(c => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer transform hover:scale-125 transition-transform';
        
        let bgColor = '#3b82f6';
        if (c.prioridade === 'URGENTE') bgColor = '#ef4444';
        else if (c.prioridade === 'ALTA') bgColor = '#f97316';
        else if (c.status === 'CONCLUIDO') bgColor = '#10b981';

        el.innerHTML = `
          <div style="
            width: 14px; 
            height: 14px; 
            background: ${bgColor}; 
            border: 2px solid white; 
            border-radius: 50%; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>
        `;

        el.onclick = () => {
          if (onSelectChamado) onSelectChamado(c);
          setActivePopupInfo({ tipo: 'CHAMADO', item: c });
        };

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([c.lng, c.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 2. CAMADA DE BIBLIOTECAS PÚBLICAS & EQUIPAMENTOS CULTURAIS (Anexos 2, 3 e 4)
    if (isCamadaAtiva('layer-bibliotecas-sp')) {
      bibliotecasPublicas.forEach(bib => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer transform hover:scale-130 transition-transform z-30';
        el.innerHTML = `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 28px;
            height: 28px;
            background: #dc2626;
            color: white;
            border: 2px solid white;
            border-radius: 8px;
            box-shadow: 0 3px 6px rgba(220,38,38,0.4);
            font-size: 14px;
          ">
            📖
          </div>
        `;

        el.onclick = () => {
          if (onSelectBiblioteca) onSelectBiblioteca(bib);
          setActivePopupInfo({ tipo: 'BIBLIOTECA', item: bib });
        };

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([bib.lng, bib.lat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

    // 3. HOTSPOTS DE CRUZAMENTO (se análise cruzada ativa)
    if (crossAnalysisActive && hotspotsCruzamento.length > 0) {
      hotspotsCruzamento.forEach(hot => {
        const el = document.createElement('div');
        el.className = 'cursor-pointer animate-pulse z-40';
        el.innerHTML = `
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 32px;
            height: 32px;
            background: rgba(147, 51, 234, 0.9);
            color: white;
            border: 2px dashed #facc15;
            border-radius: 50%;
            box-shadow: 0 0 12px rgba(234, 179, 8, 0.6);
            font-size: 14px;
          ">
            ⚡
          </div>
        `;

        el.onclick = () => {
          setActivePopupInfo({ tipo: 'HOTSPOT', item: hot });
        };

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([hot.chamadoLng, hot.chamadoLat])
          .addTo(map);

        markersRef.current.push(marker);
      });
    }

  }, [chamados, bibliotecasPublicas, isCamadaAtiva, crossAnalysisActive, hotspotsCruzamento]);

  const togglePerspective = () => {
    if (!mapRef.current) return;
    const nextMode = !is3DMode;
    setIs3DMode(nextMode);
    mapRef.current.easeTo({
      pitch: nextMode ? 50 : 0,
      bearing: nextMode ? -20 : 0,
      duration: 800
    });
  };

  const resetOrientation = () => {
    if (!mapRef.current) return;
    mapRef.current.easeTo({
      pitch: 0,
      bearing: 0,
      duration: 500
    });
    setIs3DMode(false);
  };

  return (
    <div className="relative w-full h-full overflow-hidden flex flex-col bg-slate-900">
      {/* Barra Superior Esquerda: Modos Cartográficos MapLibre GL */}
      <div className="absolute top-3 left-3 z-30 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700/80 shadow-lg text-xs text-white">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-sky-950 text-sky-300 font-bold rounded-lg border border-sky-800">
          <Globe className="w-3.5 h-3.5 text-sky-400 animate-spin-slow" />
          <span>MapLibre GL 3D</span>
        </div>

        {/* Toggle 3D Pitch / 2D Planar */}
        <button
          onClick={togglePerspective}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-all border ${
            is3DMode 
              ? 'bg-blue-600 text-white border-blue-400 shadow-sm' 
              : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
          }`}
          title="Alternar entre projeção plana 2D e perspectiva isométrica 3D com pitch"
        >
          <Compass className={`w-3.5 h-3.5 ${is3DMode ? 'rotate-45 text-amber-300' : ''}`} />
          <span>{is3DMode ? `Perspectiva 3D (${pitch}°)` : 'Planta 2D'}</span>
        </button>

        {/* Seletor de estilos raster gratuitos baseados no OpenStreetMap. */}
        <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
          <button
            onClick={() => setStyleMode('STANDARD')}
            className={`px-2 py-1 rounded text-[11px] font-bold ${
              styleMode === 'STANDARD' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            OSM HOT
          </button>
          <button
            onClick={() => setStyleMode('CADASTRO')}
            className={`px-2 py-1 rounded text-[11px] font-bold ${
              styleMode === 'CADASTRO' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Estilo vetorial claro inspirado na planta cadastral (Anexos 2 e 3)"
          >
            Cadastral
          </button>
          <button
            onClick={() => setStyleMode('DARK')}
            className={`px-2 py-1 rounded text-[11px] font-bold ${
              styleMode === 'DARK' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dark
          </button>
        </div>

        <button
          onClick={resetOrientation}
          className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          title="Restaurar orientação Norte / 0°"
        >
          <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
        </button>
      </div>


      {/* Container WebGL do MapLibre */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Pop-up Flutuante de Inspeção Rápida */}
      {activePopupInfo && (
        <div className="absolute bottom-4 left-4 z-40 max-w-sm bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-2xl p-4 animate-in slide-in-from-bottom-2 text-slate-800">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              {activePopupInfo.tipo === 'BIBLIOTECA' ? (
                <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                  <BookOpen className="w-4 h-4" />
                </div>
              ) : activePopupInfo.tipo === 'HOTSPOT' ? (
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Sparkles className="w-4 h-4" />
                </div>
              ) : (
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <MapPin className="w-4 h-4" />
                </div>
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {activePopupInfo.tipo === 'BIBLIOTECA' ? 'Equipamento Cultural (Anexos 3 e 4)' : activePopupInfo.tipo}
                </span>
                <h4 className="font-bold text-sm text-slate-900 leading-tight">
                  {activePopupInfo.tipo === 'BIBLIOTECA' ? activePopupInfo.item.nome : activePopupInfo.item.titulo || activePopupInfo.item.protocolo}
                </h4>
              </div>
            </div>
            <button
              onClick={() => setActivePopupInfo(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              ✕
            </button>
          </div>

          {activePopupInfo.tipo === 'BIBLIOTECA' && (
            <div className="space-y-2 text-xs text-slate-600">
              <p className="font-medium text-slate-700">{activePopupInfo.item.endereco}</p>
              <div className="p-2 bg-red-50 text-red-800 rounded-lg border border-red-100 text-[11px]">
                <strong>Papel no Território:</strong> {activePopupInfo.item.papelAnalogoAnexo}
              </div>
              <p className="text-[11px] text-slate-500">
                <strong>Acervo:</strong> {activePopupInfo.item.acervoEspecialidade}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                <span className="text-slate-500">Buffer de Proteção: {activePopupInfo.item.raioProtecaoZeladoriaMetros}m</span>
                <button
                  onClick={() => {
                    if (onSelectBiblioteca) onSelectBiblioteca(activePopupInfo.item);
                  }}
                  className="font-bold text-red-600 hover:text-red-700 underline"
                >
                  Abrir Prontuário →
                </button>
              </div>
            </div>
          )}

          {activePopupInfo.tipo === 'CHAMADO' && (
            <div className="space-y-1 text-xs text-slate-600">
              <p><strong>Logradouro:</strong> {activePopupInfo.item.endereco}</p>
              <p><strong>Status:</strong> {activePopupInfo.item.status} | <strong>Prioridade:</strong> {activePopupInfo.item.prioridade}</p>
              <p className="text-slate-500 line-clamp-2">{activePopupInfo.item.descricao}</p>
            </div>
          )}

          {activePopupInfo.tipo === 'HOTSPOT' && (
            <div className="space-y-1 text-xs text-purple-900">
              <p><strong>Diagnóstico:</strong> {activePopupInfo.item.diagnosticoCruzado}</p>
              <p className="text-[11px] text-purple-700"><strong>Recomendação:</strong> {activePopupInfo.item.recomendacaoOperacional}</p>
            </div>
          )}
        </div>
      )}

      {/* Legenda de Camadas Persistidas no Canto Inferior Direito */}
      <div className="absolute bottom-4 right-4 z-30 bg-slate-900/90 backdrop-blur-md p-2.5 rounded-xl border border-slate-700 shadow-xl text-xs text-slate-200 flex flex-col gap-1.5 max-w-[200px]">
        <div className="flex items-center gap-1.5 font-bold text-slate-100 border-b border-slate-800 pb-1">
          <Layers className="w-3.5 h-3.5 text-blue-400" />
          <span>Camadas no MapLibre</span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
            Zeladoria SP156
          </span>
          <span className={`font-mono text-[10px] ${isCamadaAtiva('layer-zeladoria-interna') ? 'text-emerald-400' : 'text-slate-500'}`}>
            {isCamadaAtiva('layer-zeladoria-interna') ? 'Ativa' : 'Off'}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-red-600 inline-block"></span>
            Bibliotecas SP
          </span>
          <span className={`font-mono text-[10px] ${isCamadaAtiva('layer-bibliotecas-sp') ? 'text-emerald-400' : 'text-slate-500'}`}>
            {isCamadaAtiva('layer-bibliotecas-sp') ? 'Ativa' : 'Off'}
          </span>
        </div>
        <div className="flex items-center justify-between text-[11px]">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-sm bg-emerald-500 inline-block"></span>
            Espaços Verdes
          </span>
          <span className={`font-mono text-[10px] ${isCamadaAtiva('layer-espacos-verdes') ? 'text-emerald-400' : 'text-slate-500'}`}>
            {isCamadaAtiva('layer-espacos-verdes') ? 'Ativa' : 'Off'}
          </span>
        </div>
      </div>
    </div>
  );
}
