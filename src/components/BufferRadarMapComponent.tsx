import React, { useState, useRef, useEffect, useMemo } from 'react';
import { 
  Chamado, Subprefeitura, FonteDadosPublica, HotspotCruzamento, 
  CategoriaChamado 
} from '../types';
import { 
  Radar, Radio, AlertTriangle, Shield, Users, Car, History, 
  MapPin, Sliders, Eye, Target, Crosshair, ChevronRight, Sparkles
} from 'lucide-react';
import { calcularDistanciaMetros } from '../utils/geoSpatial';

interface BufferRadarMapComponentProps {
  chamados: Chamado[];
  subprefeituras: Subprefeitura[];
  fontesPublicas: FonteDadosPublica[];
  selectedSubId: string | null;
  onSelectChamado?: (chamado: Chamado) => void;
  highContrast: boolean;
  crossAnalysisActive: boolean;
  hotspotsCruzamento?: HotspotCruzamento[];
}

export default function BufferRadarMapComponent({
  chamados,
  subprefeituras,
  fontesPublicas,
  selectedSubId,
  onSelectChamado,
  highContrast,
  crossAnalysisActive,
  hotspotsCruzamento = []
}: BufferRadarMapComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [bufferRadiusMeters, setBufferRadiusMeters] = useState<number>(600);
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotCruzamento | null>(null);
  const [radarPulseActive, setRadarPulseActive] = useState<boolean>(true);
  const [hoveredNode, setHoveredNode] = useState<any>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Responsividade
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
          setDimensions({
            width: Math.max(400, entry.contentRect.width),
            height: Math.max(400, entry.contentRect.height)
          });
        }
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Limites geográficos
  const bounds = useMemo(() => ({
    minLng: -46.78,
    maxLng: -46.56,
    minLat: -23.74,
    maxLat: -23.48
  }), []);

  // Projeção Cartesiana em pixels
  const project = (lng: number, lat: number) => {
    const pad = 60;
    const normX = (lng - bounds.minLng) / (bounds.maxLng - bounds.minLng);
    const normY = (lat - bounds.minLat) / (bounds.maxLat - bounds.minLat);
    const x = pad + normX * (dimensions.width - pad * 2);
    const y = dimensions.height - pad - normY * (dimensions.height - pad * 2);
    return [x, y];
  };

  // Escala de conversão metros -> pixels na tela
  const metersToPixels = useMemo(() => {
    const distRealSP = 28000; // aprox 28km da extensão leste-oeste
    const pxExtensao = dimensions.width - 120;
    return (pxExtensao / distRealSP);
  }, [dimensions.width]);

  const bufferRadiusPx = Math.max(15, Math.min(120, bufferRadiusMeters * metersToPixels));

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none ${
        highContrast ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-100'
      }`}
    >
      {/* Barra Superior do Motor de Radar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 rounded-xl shadow-2xl">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-950/60 border border-emerald-800/80 rounded-lg text-xs font-semibold text-emerald-300">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span>Radar de Proximidade & Buffers</span>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        {/* Seletor do Raio de Buffer */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400">Raio de Influência:</span>
          <div className="flex gap-1">
            {[300, 600, 1000, 1500].map(r => (
              <button
                key={`r-${r}`}
                onClick={() => setBufferRadiusMeters(r)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                  bufferRadiusMeters === r ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {r >= 1000 ? `${r / 1000} km` : `${r}m`}
              </button>
            ))}
          </div>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        {/* Alternar Varredura Animada */}
        <button
          onClick={() => setRadarPulseActive(!radarPulseActive)}
          className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
            radarPulseActive ? 'bg-slate-800 text-emerald-300 border border-emerald-900/50' : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Sparkles className="w-3 h-3" />
          {radarPulseActive ? 'Varredura Ativa' : 'Varredura Pausada'}
        </button>
      </div>

      {/* Painel Lateral Direito de Hotspots Detectados */}
      <div className="absolute top-4 right-4 z-20 w-80 max-h-[calc(100%-2rem)] flex flex-col bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-3 border-b border-slate-800 bg-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-xs text-white">Intersecções Detectadas</h4>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
            {hotspotsCruzamento.length} pares
          </span>
        </div>

        <div className="overflow-y-auto p-2 space-y-2 flex-1 max-h-96">
          {hotspotsCruzamento.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-xs">
              <Radio className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-50" />
              <p>Nenhuma sobreposição detectada para o raio de {bufferRadiusMeters}m.</p>
              <p className="text-[10px] text-slate-600 mt-1">Aumente o raio do buffer na barra superior.</p>
            </div>
          ) : (
            hotspotsCruzamento.slice(0, 15).map(h => {
              const isSelected = selectedHotspot?.id === h.id;
              return (
                <div
                  key={`radar-h-${h.id}`}
                  onClick={() => setSelectedHotspot(isSelected ? null : h)}
                  className={`p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-emerald-950/70 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                      : 'bg-slate-800/60 border-slate-700/70 hover:bg-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-white flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        h.grauRisco === 'CRITICO' ? 'bg-red-500 animate-ping' :
                        h.grauRisco === 'ALTO' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} />
                      {h.chamadoProtocolo}
                    </span>
                    <span className="text-[10px] font-mono font-semibold text-emerald-400 bg-emerald-950/50 px-1.5 py-0.5 rounded">
                      {h.distanciaMetros}m
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 font-medium line-clamp-1">
                    {h.chamadoCategoria} ↔ {h.pontoTitulo}
                  </p>

                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                    {h.diagnosticoCruzado}
                  </p>

                  {isSelected && (
                    <div className="mt-2 pt-2 border-t border-slate-700 text-[10px] text-emerald-300 bg-emerald-950/40 p-1.5 rounded">
                      <span className="font-bold block mb-0.5">Recomendação Operacional:</span>
                      {h.recomendacaoOperacional}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SVG Canvas do Radar de Buffers */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full"
      >
        <defs>
          {/* Gradiente do Pulso de Varredura */}
          <radialGradient id="radar-sweep-grad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#10b981" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </radialGradient>

          {/* Filtro de Halo Fluorescente */}
          <filter id="radar-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Grade de Radar Náutico / Círculos de Coordenadas Centrais */}
        <g opacity="0.25">
          <circle cx={dimensions.width / 2} cy={dimensions.height / 2} r={120} fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="3,3" />
          <circle cx={dimensions.width / 2} cy={dimensions.height / 2} r={220} fill="none" stroke="#10b981" strokeWidth="1" strokeDasharray="4,4" />
          <circle cx={dimensions.width / 2} cy={dimensions.height / 2} r={320} fill="none" stroke="#10b981" strokeWidth="1" />
          <line x1={0} y1={dimensions.height / 2} x2={dimensions.width} y2={dimensions.height / 2} stroke="#10b981" strokeWidth="0.5" />
          <line x1={dimensions.width / 2} y1={0} x2={dimensions.width / 2} y2={dimensions.height} stroke="#10b981" strokeWidth="0.5" />
        </g>

        {/* Efeito de Varredura Giratória do Radar */}
        {radarPulseActive && (
          <g transform={`translate(${dimensions.width / 2}, ${dimensions.height / 2})`}>
            <circle r={350} fill="url(#radar-sweep-grad)">
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0"
                to="360"
                dur="8s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        )}

        {/* Conexões Vetoriais entre Chamados e Pontos de Fontes Públicas */}
        <g id="radar-vector-lines">
          {hotspotsCruzamento.map((h, i) => {
            const [x1, y1] = project(h.chamadoLng, h.chamadoLat);
            const [x2, y2] = project(h.pontoLng, h.pontoLat);
            const isSelected = selectedHotspot?.id === h.id;

            return (
              <g key={`radar-link-${h.id}-${i}`}>
                {/* Linha de Conexão com Animação */}
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={isSelected ? '#34d399' : h.grauRisco === 'CRITICO' ? '#ef4444' : '#f59e0b'}
                  strokeWidth={isSelected ? 3 : 1.5}
                  strokeDasharray={isSelected ? 'none' : '4,3'}
                  strokeOpacity={isSelected ? 1 : 0.75}
                  filter={isSelected ? 'url(#radar-glow)' : undefined}
                />
              </g>
            );
          })}
        </g>

        {/* Anéis de Buffer em torno dos Pontos Públicos Ativos */}
        <g id="public-buffers">
          {fontesPublicas.filter(f => f.ativa).flatMap(f => f.pontos).map(p => {
            const [px, py] = project(p.lng, p.lat);
            return (
              <g key={`pub-buf-${p.id}`}>
                <circle
                  cx={px}
                  cy={py}
                  r={bufferRadiusPx}
                  fill="#8b5cf6"
                  fillOpacity="0.08"
                  stroke="#a855f7"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
                <circle cx={px} cy={py} r={6} fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
              </g>
            );
          })}
        </g>

        {/* Anéis de Buffer e Marcadores dos Chamados Municipais */}
        <g id="chamados-buffers">
          {chamados.map(c => {
            const [cx, cy] = project(c.lng, c.lat);
            const hasHotspot = hotspotsCruzamento.some(h => h.chamadoId === c.id);
            const isUrgent = c.prioridade === 'URGENTE';

            return (
              <g
                key={`cham-buf-${c.id}`}
                className="cursor-pointer"
                onClick={() => onSelectChamado && onSelectChamado(c)}
                onMouseEnter={(e) => {
                  setHoveredNode({ type: 'CHAMADO', data: c });
                  setTooltipPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Anel do Buffer com Pulso se tiver cruzamento ativo */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={bufferRadiusPx}
                  fill={hasHotspot ? '#ef4444' : '#3b82f6'}
                  fillOpacity={hasHotspot ? '0.12' : '0.04'}
                  stroke={hasHotspot ? '#ef4444' : '#3b82f6'}
                  strokeWidth={hasHotspot ? 1.5 : 0.8}
                >
                  {hasHotspot && (
                    <animate
                      attributeName="r"
                      values={`${bufferRadiusPx * 0.9};${bufferRadiusPx * 1.1};${bufferRadiusPx * 0.9}`}
                      dur="2.5s"
                      repeatCount="indefinite"
                    />
                  )}
                </circle>

                {/* Marcador Central */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isUrgent ? 6 : 4.5}
                  fill={hasHotspot ? '#ef4444' : isUrgent ? '#f59e0b' : '#38bdf8'}
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  className="transition-transform hover:scale-150"
                />
              </g>
            );
          })}
        </g>
      </svg>

      {/* Tooltip Dinâmico */}
      {hoveredNode && (
        <div
          className="fixed pointer-events-none z-50 bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs text-white max-w-xs backdrop-blur-md animate-in fade-in-50 duration-150"
          style={{
            left: `${tooltipPos.x + 15}px`,
            top: `${tooltipPos.y + 15}px`
          }}
        >
          <div className="flex items-center justify-between font-bold text-emerald-400 border-b border-slate-800 pb-1 mb-1.5">
            <span>{hoveredNode.data.protocolo}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
              {hoveredNode.data.prioridade}
            </span>
          </div>
          <p className="font-semibold text-slate-200">{hoveredNode.data.categoria}</p>
          <p className="text-slate-400 text-[10px] mt-0.5">Status: {hoveredNode.data.status}</p>
          {hoveredNode.data.endereco && (
            <p className="text-slate-400 text-[10px] mt-1 truncate">{hoveredNode.data.endereco}</p>
          )}
        </div>
      )}
    </div>
  );
}
