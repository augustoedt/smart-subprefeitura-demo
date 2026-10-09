import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Chamado, Subprefeitura, FonteDadosPublica, HotspotCruzamento, 
  CategoriaChamado 
} from '../types';
import { 
  Hexagon, Layers, Eye, Sliders, Sparkles, Filter, 
  Building2, AlertTriangle, Shield, ZoomIn, ZoomOut, RotateCcw
} from 'lucide-react';
import { calcularDistanciaMetros } from '../utils/geoSpatial';

interface HexbinMapComponentProps {
  chamados: Chamado[];
  subprefeituras: Subprefeitura[];
  fontesPublicas: FonteDadosPublica[];
  selectedSubId: string | null;
  onSelectChamado?: (chamado: Chamado) => void;
  highContrast: boolean;
  crossAnalysisActive: boolean;
  hotspotsCruzamento?: HotspotCruzamento[];
}

interface HexCell {
  id: string;
  centerLng: number;
  centerLat: number;
  screenX: number;
  screenY: number;
  chamados: Chamado[];
  pontosPublicos: {
    ponto: any;
    fonte: FonteDadosPublica;
  }[];
  totalChamados: number;
  totalPublicos: number;
  hotspotsCount: number;
  alturaExtrusao: number; // Em pixels
  corPreenchimento: string;
  corBorda: string;
  indiceRisco: 'CRITICO' | 'ALTO' | 'MODERADO' | 'NORMAL';
}

export default function HexbinMapComponent({
  chamados,
  subprefeituras,
  fontesPublicas,
  selectedSubId,
  onSelectChamado,
  highContrast,
  crossAnalysisActive,
  hotspotsCruzamento = []
}: HexbinMapComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hexRadiusPx, setHexRadiusPx] = useState<number>(36); // Raio da célula hexagonal
  const [perspectiveMode, setPerspectiveMode] = useState<'2.5D' | 'TOP_DOWN'>('2.5D');
  const [hoveredHex, setHoveredHex] = useState<HexCell | null>(null);
  const [selectedHex, setSelectedHex] = useState<HexCell | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Responsividade do container
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

  // Bounding box de São Paulo
  const bounds = useMemo(() => ({
    minLng: -46.78,
    maxLng: -46.56,
    minLat: -23.74,
    maxLat: -23.48
  }), []);

  // Projeção Cartesiana Simples
  const project = (lng: number, lat: number) => {
    const pad = 60;
    const normX = (lng - bounds.minLng) / (bounds.maxLng - bounds.minLng);
    const normY = (lat - bounds.minLat) / (bounds.maxLat - bounds.minLat);
    const x = pad + normX * (dimensions.width - pad * 2);
    const y = dimensions.height - pad - normY * (dimensions.height - pad * 2);
    return [x * zoomLevel + panOffset.x, y * zoomLevel + panOffset.y];
  };

  // Malha Hexagonal Espacial
  const hexGrid = useMemo(() => {
    const cells: HexCell[] = [];
    const r = hexRadiusPx * zoomLevel;
    const h = r * Math.sqrt(3);
    const stepX = 1.5 * r;
    const stepY = h;

    const startX = 40 + panOffset.x;
    const startY = 40 + panOffset.y;
    const cols = Math.ceil(dimensions.width / stepX) + 2;
    const rows = Math.ceil(dimensions.height / stepY) + 2;

    const unproject = (screenX: number, screenY: number) => {
      const pad = 60;
      const actualX = (screenX - panOffset.x) / zoomLevel;
      const actualY = (screenY - panOffset.y) / zoomLevel;
      const normX = (actualX - pad) / (dimensions.width - pad * 2);
      const normY = (dimensions.height - pad - actualY) / (dimensions.height - pad * 2);
      const lng = bounds.minLng + normX * (bounds.maxLng - bounds.minLng);
      const lat = bounds.minLat + normY * (bounds.maxLat - bounds.minLat);
      return { lng, lat };
    };

    let cellCounter = 0;
    for (let c = -1; c < cols; c++) {
      for (let row = -1; row < rows; row++) {
        const cx = startX + c * stepX;
        const cy = startY + row * stepY + (c % 2 === 0 ? 0 : h / 2);

        const { lng: centerLng, lat: centerLat } = unproject(cx, cy);

        // Apenas hexágonos dentro ou limítrofes à malha de SP
        if (
          centerLng >= bounds.minLng - 0.05 && centerLng <= bounds.maxLng + 0.05 &&
          centerLat >= bounds.minLat - 0.05 && centerLat <= bounds.maxLat + 0.05
        ) {
          // Raio geográfico estimado em metros baseado no tamanho do hexágono em pixels
          const cellRadiusMeters = (hexRadiusPx / 36) * 1200;

          // Agrega chamados internos dentro do raio
          const cellChamados = chamados.filter(ch => {
            const dist = calcularDistanciaMetros(centerLat, centerLng, ch.lat, ch.lng);
            return dist <= cellRadiusMeters;
          });

          // Agrega pontos públicos ativos dentro do raio
          const cellPublicos: Array<{ ponto: any; fonte: FonteDadosPublica }> = [];
          fontesPublicas.filter(f => f.ativa).forEach(fonte => {
            fonte.pontos.forEach(p => {
              const dist = calcularDistanciaMetros(centerLat, centerLng, p.lat, p.lng);
              if (dist <= cellRadiusMeters) {
                cellPublicos.push({ ponto: p, fonte });
              }
            });
          });

          // Agrega hotspots de cruzamento
          const cellHotspots = hotspotsCruzamento.filter(h => {
            const dist = calcularDistanciaMetros(centerLat, centerLng, h.chamadoLat, h.chamadoLng);
            return dist <= cellRadiusMeters;
          });

          const totalChamados = cellChamados.length;
          const totalPublicos = cellPublicos.length;
          const totalGeral = totalChamados + totalPublicos * 1.5;

          if (totalGeral > 0) {
            // Determina criticidade e cores
            let indiceRisco: 'CRITICO' | 'ALTO' | 'MODERADO' | 'NORMAL' = 'NORMAL';
            let corPreenchimento = '#1e293b';
            let corBorda = '#334155';

            if (cellHotspots.some(h => h.grauRisco === 'CRITICO') || (totalChamados >= 5 && totalPublicos >= 2)) {
              indiceRisco = 'CRITICO';
              corPreenchimento = '#ef4444';
              corBorda = '#b91c1c';
            } else if (cellHotspots.some(h => h.grauRisco === 'ALTO') || totalChamados >= 4 || totalPublicos >= 2) {
              indiceRisco = 'ALTO';
              corPreenchimento = '#f59e0b';
              corBorda = '#d97706';
            } else if (totalGeral >= 2) {
              indiceRisco = 'MODERADO';
              corPreenchimento = '#3b82f6';
              corBorda = '#2563eb';
            } else {
              corPreenchimento = '#0ea5e9';
              corBorda = '#0284c7';
            }

            // Altura da extrusão 2.5D (entre 6px e 38px)
            const alturaExtrusao = perspectiveMode === '2.5D' 
              ? Math.min(38, Math.max(6, Math.round(totalGeral * 4))) 
              : 0;

            cells.push({
              id: `hex-${cellCounter++}`,
              centerLng,
              centerLat,
              screenX: cx,
              screenY: cy,
              chamados: cellChamados,
              pontosPublicos: cellPublicos,
              totalChamados,
              totalPublicos,
              hotspotsCount: cellHotspots.length,
              alturaExtrusao,
              corPreenchimento,
              corBorda,
              indiceRisco
            });
          }
        }
      }
    }

    // Ordenar células de cima para baixo no modo 2.5D para oclusão tridimensional correta
    return cells.sort((a, b) => a.screenY - b.screenY);
  }, [
    dimensions, hexRadiusPx, zoomLevel, panOffset, bounds, 
    chamados, fontesPublicas, hotspotsCruzamento, perspectiveMode
  ]);

  // Função auxiliar para gerar polígono de hexágono regular
  const getHexPoints = (cx: number, cy: number, r: number) => {
    const points: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i - 30);
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return points.join(' ');
  };

  // Funções de Pan por arrasto com mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full overflow-hidden select-none ${
        highContrast ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-100'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Barra de Ferramentas e Configuração do Motor Hexbin */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 rounded-xl shadow-2xl">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-purple-950/60 border border-purple-800/80 rounded-lg text-xs font-semibold text-purple-300">
          <Hexagon className="w-4 h-4 text-purple-400" />
          <span>Deck Hexbin 2.5D</span>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        {/* Alternador de Perspectiva */}
        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 font-medium">Perspectiva:</span>
          <button
            onClick={() => setPerspectiveMode('2.5D')}
            className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
              perspectiveMode === '2.5D' ? 'bg-purple-600 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3 h-3" />
            Extrusão 2.5D
          </button>
          <button
            onClick={() => setPerspectiveMode('TOP_DOWN')}
            className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
              perspectiveMode === 'TOP_DOWN' ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:bg-slate-800'
            }`}
          >
            Plano 2D
          </button>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        {/* Resolução do Hexágono */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400">Tamanho Célula:</span>
          <div className="flex gap-1">
            {[26, 36, 50].map((sz) => (
              <button
                key={`sz-${sz}`}
                onClick={() => setHexRadiusPx(sz)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-mono transition-colors ${
                  hexRadiusPx === sz ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {sz === 26 ? '300m' : sz === 36 ? '600m' : '1.2km'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Controles de Zoom Flutuantes */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-xl shadow-xl">
        <button
          onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 3))}
          title="Aumentar Zoom"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.6))}
          title="Diminuir Zoom"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => { setZoomLevel(1); setPanOffset({ x: 0, y: 0 }); }}
          title="Resetar Posição"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Legenda de Extrusão e Densidade */}
      <div className="absolute bottom-6 left-6 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl shadow-xl text-xs max-w-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-slate-300">Células Hexagonais Agregadas</span>
          <span className="text-purple-400 font-mono font-bold">{hexGrid.length} hex</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-red-500 shadow-xs" />
            <span className="text-slate-300">Risco Crítico / Hotspot</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-amber-500 shadow-xs" />
            <span className="text-slate-300">Alta Densidade</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-blue-500 shadow-xs" />
            <span className="text-slate-300">Moderado</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-sky-500 shadow-xs" />
            <span className="text-slate-300">Demanda Regular</span>
          </div>
        </div>
        {perspectiveMode === '2.5D' && (
          <p className="text-[10px] text-slate-400 mt-2 border-t border-slate-800 pt-1.5">
            Altura da coluna proporcional ao volume combinado de zeladoria e indicadores públicos.
          </p>
        )}
      </div>

      {/* Canvas SVG Hexagonal */}
      <svg
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <defs>
          {/* Sombras de Extrusão 3D */}
          <linearGradient id="extrusion-critico" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#7f1d1d" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="extrusion-alto" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#78350f" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="extrusion-moderado" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.95" />
          </linearGradient>
          <linearGradient id="extrusion-normal" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0369a1" stopOpacity="0.95" />
          </linearGradient>
        </defs>

        {/* Grade de fundo com contornos distritais de referência */}
        <g opacity="0.2">
          {subprefeituras.map(sub => {
            const [x, y] = project(sub.lng, sub.lat);
            return (
              <g key={`sub-ref-${sub.id}`}>
                <circle cx={x} cy={y} r={40 * zoomLevel} fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="4,4" />
                <text x={x} y={y + 5} fill="#94a3b8" fontSize="10px" textAnchor="middle" fontWeight="bold">
                  {sub.nome}
                </text>
              </g>
            );
          })}
        </g>

        {/* Renderização das Células Hexagonais 2.5D */}
        <g id="hex-cells-group">
          {hexGrid.map((hex) => {
            const r = hexRadiusPx * zoomLevel;
            const isHovered = hoveredHex?.id === hex.id;
            const isSelected = selectedHex?.id === hex.id;
            const h3d = hex.alturaExtrusao;

            const basePoints = getHexPoints(hex.screenX, hex.screenY, r);
            const topPoints = getHexPoints(hex.screenX, hex.screenY - h3d, r);

            let gradientId = 'extrusion-normal';
            if (hex.indiceRisco === 'CRITICO') gradientId = 'extrusion-critico';
            else if (hex.indiceRisco === 'ALTO') gradientId = 'extrusion-alto';
            else if (hex.indiceRisco === 'MODERADO') gradientId = 'extrusion-moderado';

            return (
              <g
                key={hex.id}
                className="cursor-pointer transition-all duration-200"
                onClick={() => setSelectedHex(hex)}
                onMouseEnter={(e) => {
                  setHoveredHex(hex);
                  setTooltipPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHoveredHex(null)}
              >
                {/* Corpo extrudado 3D (paredes laterais do prisma) */}
                {perspectiveMode === '2.5D' && h3d > 0 && (
                  <g opacity={isHovered ? 1 : 0.85}>
                    {/* Face frontal esquerda */}
                    <polygon
                      points={`${hex.screenX - r * 0.866},${hex.screenY - r * 0.5} ${hex.screenX - r * 0.866},${hex.screenY - r * 0.5 - h3d} ${hex.screenX},${hex.screenY - r - h3d} ${hex.screenX},${hex.screenY - r}`}
                      fill={`url(#${gradientId})`}
                      filter="brightness(0.7)"
                    />
                    {/* Face frontal direita */}
                    <polygon
                      points={`${hex.screenX},${hex.screenY + r} ${hex.screenX},${hex.screenY + r - h3d} ${hex.screenX + r * 0.866},${hex.screenY + r * 0.5 - h3d} ${hex.screenX + r * 0.866},${hex.screenY + r * 0.5}`}
                      fill={`url(#${gradientId})`}
                      filter="brightness(0.85)"
                    />
                    {/* Face frontal inferior */}
                    <polygon
                      points={`${hex.screenX - r * 0.866},${hex.screenY + r * 0.5} ${hex.screenX - r * 0.866},${hex.screenY + r * 0.5 - h3d} ${hex.screenX},${hex.screenY + r - h3d} ${hex.screenX},${hex.screenY + r}`}
                      fill={`url(#${gradientId})`}
                      filter="brightness(0.65)"
                    />
                  </g>
                )}

                {/* Face superior do hexágono (tampa do prisma 2.5D) */}
                <polygon
                  points={topPoints}
                  fill={hex.corPreenchimento}
                  fillOpacity={isHovered ? 0.95 : 0.8}
                  stroke={isSelected ? '#ffffff' : hex.corBorda}
                  strokeWidth={isSelected ? 2.5 : 1}
                  className="transition-all"
                />

                {/* Indicador numérico de contagem na tampa */}
                {(hex.totalChamados > 0 || hex.totalPublicos > 0) && (
                  <text
                    x={hex.screenX}
                    y={hex.screenY - h3d + 4}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={r > 30 ? '11px' : '9px'}
                    fontWeight="800"
                    filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))"
                  >
                    {hex.totalChamados + hex.totalPublicos}
                  </text>
                )}

                {/* Símbolo de alerta em hotspots de risco crítico */}
                {hex.hotspotsCount > 0 && (
                  <circle
                    cx={hex.screenX + r * 0.5}
                    cy={hex.screenY - h3d - r * 0.5}
                    r={5}
                    fill="#ef4444"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Tooltip Dinâmico da Célula Hexagonal */}
      {hoveredHex && (
        <div
          className="fixed pointer-events-none z-50 bg-slate-900/95 border border-slate-700 p-3.5 rounded-xl shadow-2xl text-xs text-white max-w-sm backdrop-blur-md animate-in fade-in-50 duration-150"
          style={{
            left: `${tooltipPos.x + 15}px`,
            top: `${tooltipPos.y + 15}px`
          }}
        >
          <div className="flex items-center justify-between font-bold border-b border-slate-800 pb-1.5 mb-2">
            <div className="flex items-center gap-1.5">
              <Hexagon className="w-4 h-4 text-purple-400" />
              <span>Célula Hexagonal Espacial</span>
            </div>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
              hoveredHex.indiceRisco === 'CRITICO' ? 'bg-red-950 text-red-300 border border-red-800' :
              hoveredHex.indiceRisco === 'ALTO' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
              'bg-blue-950 text-blue-300 border border-blue-800'
            }`}>
              Risco {hoveredHex.indiceRisco}
            </span>
          </div>

          <div className="space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span>Chamados de Zeladoria Internos:</span>
              <span className="font-bold text-white">{hoveredHex.totalChamados}</span>
            </div>
            <div className="flex justify-between">
              <span>Indicadores Públicos (SSP/IBGE/CET):</span>
              <span className="font-bold text-sky-400">{hoveredHex.totalPublicos}</span>
            </div>
            {hoveredHex.hotspotsCount > 0 && (
              <div className="flex justify-between text-red-300 font-semibold border-t border-slate-800 pt-1">
                <span>Cruzamentos de Risco Duplo:</span>
                <span>{hoveredHex.hotspotsCount}</span>
              </div>
            )}
          </div>

          {/* Amostra dos chamados presentes no hexágono */}
          {hoveredHex.chamados.length > 0 && (
            <div className="mt-2.5 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Chamados na Célula:
              </span>
              <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                {hoveredHex.chamados.slice(0, 3).map(c => (
                  <div key={c.id} className="bg-slate-800/80 p-1.5 rounded text-[11px] flex items-center justify-between">
                    <span className="font-medium text-slate-200">{c.protocolo}</span>
                    <span className="text-[10px] text-slate-400">{c.categoria}</span>
                  </div>
                ))}
                {hoveredHex.chamados.length > 3 && (
                  <p className="text-[10px] text-slate-500 italic text-center">
                    + {hoveredHex.chamados.length - 3} outros chamados nesta área
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
