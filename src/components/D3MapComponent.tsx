import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as d3 from 'd3';
import { 
  Chamado, Subprefeitura, FonteDadosPublica, HotspotCruzamento, 
  CategoriaChamado 
} from '../types';
import { 
  ZoomIn, ZoomOut, RotateCcw, BarChart3, Layers, 
  MapPin, Shield, Users, Car, History, Sparkles, AlertTriangle
} from 'lucide-react';

interface D3MapComponentProps {
  chamados: Chamado[];
  subprefeituras: Subprefeitura[];
  fontesPublicas: FonteDadosPublica[];
  selectedSubId: string | null;
  onSelectChamado?: (chamado: Chamado) => void;
  onSelectSubprefeitura?: (sub: Subprefeitura) => void;
  highContrast: boolean;
  crossAnalysisActive: boolean;
  hotspotsCruzamento?: HotspotCruzamento[];
}

export default function D3MapComponent({
  chamados,
  subprefeituras,
  fontesPublicas,
  selectedSubId,
  onSelectChamado,
  onSelectSubprefeitura,
  highContrast,
  crossAnalysisActive,
  hotspotsCruzamento = []
}: D3MapComponentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [hoveredEntity, setHoveredEntity] = useState<any>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [colorMetric, setColorMetric] = useState<'VOLUME' | 'CRITICIDADE' | 'CRUZAMENTO'>('VOLUME');

  // Ajusta dimensões responsivas via ResizeObserver
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

  // Coordenadas limítrofes da Grande São Paulo
  const bounds = useMemo(() => ({
    minLng: -46.80,
    maxLng: -46.54,
    minLat: -23.76,
    maxLat: -23.46
  }), []);

  // Escalas de Projeção D3 (Lng -> X, Lat -> Y invertido)
  const projection = useMemo(() => {
    const padding = 50;
    const xScale = d3.scaleLinear()
      .domain([bounds.minLng, bounds.maxLng])
      .range([padding, dimensions.width - padding]);

    const yScale = d3.scaleLinear()
      .domain([bounds.minLat, bounds.maxLat])
      .range([dimensions.height - padding, padding]);

    return {
      project: (lng: number, lat: number) => [xScale(lng), yScale(lat)] as [number, number],
      xScale,
      yScale
    };
  }, [bounds, dimensions]);

  // Agrupamento de dados por Subprefeitura
  const subStats = useMemo(() => {
    return subprefeituras.map(sub => {
      const subChamados = chamados.filter(c => c.subprefeituraId === sub.id);
      const pendentes = subChamados.filter(c => c.status !== 'CONCLUIDO').length;
      const atrasados = subChamados.filter(c => c.isAtrasado).length;
      const urgentes = subChamados.filter(c => c.prioridade === 'URGENTE').length;
      const correlacoes = hotspotsCruzamento.filter(h => h.subprefeituraNome.toLowerCase() === sub.nome.toLowerCase()).length;

      return {
        ...sub,
        total: subChamados.length,
        pendentes,
        atrasados,
        urgentes,
        correlacoes,
        coords: projection.project(sub.lng, sub.lat)
      };
    });
  }, [subprefeituras, chamados, hotspotsCruzamento, projection]);

  // Escala Cromática D3
  const maxVolume = useMemo(() => {
    const val = d3.max(subStats, (s: { total: number }) => s.total);
    return Math.max(1, typeof val === 'number' ? val : 1);
  }, [subStats]);

  const maxCorrelacoes = useMemo(() => {
    const val = d3.max(subStats, (s: { correlacoes: number }) => s.correlacoes);
    return Math.max(1, typeof val === 'number' ? val : 1);
  }, [subStats]);

  const colorScale = useMemo(() => {
    if (colorMetric === 'CRUZAMENTO') {
      return d3.scaleSequential(d3.interpolateInferno).domain([0, maxCorrelacoes]);
    }
    if (colorMetric === 'CRITICIDADE') {
      return d3.scaleSequential(d3.interpolateYlOrRd).domain([0, maxVolume]);
    }
    return d3.scaleSequential(highContrast ? d3.interpolatePlasma : d3.interpolateBlues).domain([0, maxVolume]);
  }, [colorMetric, maxVolume, maxCorrelacoes, highContrast]);

  // Setup D3 Zoom & Pan
  const zoomBehaviorRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    const g = svg.select<SVGGElement>('#d3-zoom-layer');

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.7, 5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform.toString());
      });

    svg.call(zoom);
    zoomBehaviorRef.current = zoom;
  }, []);

  const handleZoomIn = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 1.3);
  };

  const handleZoomOut = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehaviorRef.current.scaleBy, 0.7);
  };

  const handleResetZoom = () => {
    if (!svgRef.current || !zoomBehaviorRef.current) return;
    d3.select(svgRef.current).transition().duration(400).call(zoomBehaviorRef.current.transform, d3.zoomIdentity);
  };

  // Pontos de dados públicos ativos
  const activePublicPoints = useMemo(() => {
    const list: Array<{
      id: string;
      fonteId: string;
      sigla: string;
      corHex: string;
      titulo: string;
      metrica: string;
      detalhe: string;
      x: number;
      y: number;
    }> = [];

    fontesPublicas.filter(f => f.ativa).forEach(fonte => {
      fonte.pontos.forEach(ponto => {
        const [x, y] = projection.project(ponto.lng, ponto.lat);
        list.push({
          id: ponto.id,
          fonteId: fonte.id,
          sigla: fonte.sigla,
          corHex: fonte.corHex,
          titulo: ponto.titulo,
          metrica: ponto.metricaPrincipal,
          detalhe: ponto.detalhe,
          x,
          y
        });
      });
    });

    return list;
  }, [fontesPublicas, projection]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full overflow-hidden select-none ${
        highContrast ? 'bg-slate-950 text-slate-100' : 'bg-slate-900 text-slate-50'
      }`}
    >
      {/* Barra de Controle de Parâmetros D3 */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-2 rounded-xl shadow-2xl">
        <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 rounded-lg text-xs font-semibold text-sky-400">
          <BarChart3 className="w-4 h-4" />
          <span>D3.js Geo-Scales</span>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        <div className="flex items-center gap-1 text-xs">
          <span className="text-slate-400 font-medium">Gradiente:</span>
          <button
            onClick={() => setColorMetric('VOLUME')}
            className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
              colorMetric === 'VOLUME' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Volume Total
          </button>
          <button
            onClick={() => setColorMetric('CRITICIDADE')}
            className={`px-2 py-1 rounded-md text-xs font-medium transition-colors ${
              colorMetric === 'CRITICIDADE' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            Criticidade
          </button>
          {crossAnalysisActive && (
            <button
              onClick={() => setColorMetric('CRUZAMENTO')}
              className={`px-2 py-1 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                colorMetric === 'CRUZAMENTO' ? 'bg-purple-600 text-white shadow-xs' : 'text-purple-300 hover:bg-purple-950/40'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              Cruzamentos
            </button>
          )}
        </div>
      </div>

      {/* Controles Flutuantes de Zoom D3 */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-xl shadow-xl">
        <button
          onClick={handleZoomIn}
          title="Aumentar Zoom D3"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          title="Diminuir Zoom D3"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-200 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          title="Resetar Projeção"
          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Legenda D3 em Gradiente Contínuo */}
      <div className="absolute bottom-6 left-6 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-xl shadow-xl max-w-xs text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-semibold text-slate-300">
            {colorMetric === 'CRUZAMENTO' ? 'Densidade de Cruzamentos' : colorMetric === 'CRITICIDADE' ? 'Criticidade / Atrasos' : 'Volume de Chamados SP156'}
          </span>
          <span className="font-bold text-sky-400">
            0 a {colorMetric === 'CRUZAMENTO' ? maxCorrelacoes : maxVolume}
          </span>
        </div>
        <div 
          className="h-2.5 w-full rounded-full border border-slate-700 shadow-inner"
          style={{
            background: colorMetric === 'CRUZAMENTO'
              ? 'linear-gradient(to right, #000004, #57106e, #bb3754, #f98e09, #fcffa4)'
              : colorMetric === 'CRITICIDADE'
              ? 'linear-gradient(to right, #ffffb2, #fecc5c, #fd8d3c, #f03b20, #bd0026)'
              : highContrast
              ? 'linear-gradient(to right, #0d0887, #6a00a8, #b12a90, #e16462, #fca636, #f0f921)'
              : 'linear-gradient(to right, #f7fbff, #c6dbef, #6baed6, #2171b5, #08306b)'
          }}
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>Mínimo</span>
          <span>Médio</span>
          <span>Máximo</span>
        </div>
      </div>

      {/* SVG Canvas Principal D3 */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <defs>
          {/* Marcador de seta para arcos de fluxo D3 */}
          <marker
            id="d3-arrow"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1 L 10 5 L 0 9 z" fill="#c084fc" />
          </marker>

          {/* Filtro de brilho para conexões de camadas cruzadas */}
          <filter id="glow-purple" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Camada com suporte a D3 Zoom/Pan */}
        <g id="d3-zoom-layer">
          {/* Grade de coordenadas náuticas/cartográficas de referência */}
          <g opacity="0.15" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="4,4">
            {d3.range(bounds.minLng, bounds.maxLng, 0.05).map((lng, i) => {
              const x = projection.xScale(lng);
              return <line key={`grid-x-${i}`} x1={x} y1={0} x2={x} y2={dimensions.height} />;
            })}
            {d3.range(bounds.minLat, bounds.maxLat, 0.05).map((lat, i) => {
              const y = projection.yScale(lat);
              return <line key={`grid-y-${i}`} x1={0} y1={y} x2={dimensions.width} y2={y} />;
            })}
          </g>

          {/* Polígonos das Subprefeituras (Voronoi/Áreas de Influência D3) */}
          <g id="subprefeitura-regions">
            {subStats.map(sub => {
              const [cx, cy] = sub.coords;
              const isSelected = selectedSubId === sub.id;
              const radius = Math.max(35, Math.min(80, 25 + sub.total * 2.2));
              const fillColor = colorMetric === 'CRUZAMENTO'
                ? colorScale(sub.correlacoes)
                : colorMetric === 'CRITICIDADE'
                ? colorScale(sub.urgentes + sub.atrasados)
                : colorScale(sub.total);

              return (
                <g 
                  key={`sub-${sub.id}`}
                  className="cursor-pointer transition-all duration-300"
                  onClick={() => onSelectSubprefeitura && onSelectSubprefeitura(sub)}
                  onMouseEnter={(e) => {
                    setHoveredEntity({ type: 'SUB', data: sub });
                    setTooltipPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setHoveredEntity(null)}
                >
                  {/* Halo territorial */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill={fillColor}
                    fillOpacity={isSelected ? 0.6 : 0.35}
                    stroke={isSelected ? '#38bdf8' : '#64748b'}
                    strokeWidth={isSelected ? 3 : 1.5}
                    strokeDasharray={isSelected ? 'none' : '6,3'}
                    className="hover:fill-opacity-50 transition-all"
                  />

                  {/* Núcleo central da Subprefeitura */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 10 : 7}
                    fill={isSelected ? '#38bdf8' : '#ffffff'}
                    stroke="#0f172a"
                    strokeWidth={2}
                    className="shadow-lg"
                  />

                  {/* Rótulo da Subprefeitura */}
                  <text
                    x={cx}
                    y={cy - radius - 6}
                    textAnchor="middle"
                    fill={isSelected ? '#38bdf8' : '#e2e8f0'}
                    fontSize={isSelected ? '12px' : '11px'}
                    fontWeight={isSelected ? '700' : '600'}
                    filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
                  >
                    Sub. {sub.nome}
                  </text>
                  <text
                    x={cx}
                    y={cy + 4}
                    textAnchor="middle"
                    fill="#0f172a"
                    fontSize="9px"
                    fontWeight="800"
                  >
                    {sub.total}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Arcos de Cruzamento Geoespacial (Conectando Chamado Interno -> Ponto Externo) */}
          {crossAnalysisActive && hotspotsCruzamento.length > 0 && (
            <g id="cross-layer-arcs">
              {hotspotsCruzamento.slice(0, 40).map((h, i) => {
                const [x1, y1] = projection.project(h.chamadoLng, h.chamadoLat);
                const [x2, y2] = projection.project(h.pontoLng, h.pontoLat);
                const dx = x2 - x1;
                const dy = y2 - y1;
                const cx = (x1 + x2) / 2 - dy * 0.2;
                const cy = (y1 + y2) / 2 + dx * 0.2;

                const pathData = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
                const strokeColor = h.grauRisco === 'CRITICO' ? '#ef4444' : h.grauRisco === 'ALTO' ? '#f59e0b' : '#c084fc';

                return (
                  <g key={`cross-arc-${h.id}-${i}`}>
                    {/* Linha de onda */}
                    <path
                      d={pathData}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth={h.grauRisco === 'CRITICO' ? 2.5 : 1.5}
                      strokeDasharray="4,3"
                      strokeOpacity={0.8}
                      filter="url(#glow-purple)"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="20"
                        to="0"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </path>

                    {/* Ponto de impacto central */}
                    <circle
                      cx={(x1 + x2) / 2}
                      cy={(y1 + y2) / 2}
                      r={3}
                      fill={strokeColor}
                    />
                  </g>
                );
              })}
            </g>
          )}

          {/* Pontos das Fontes Públicas Ativas (SSP, IBGE, CET, SP156) */}
          <g id="public-data-nodes">
            {activePublicPoints.map(ponto => (
              <g
                key={`pub-${ponto.id}`}
                className="cursor-pointer transition-transform hover:scale-125"
                onMouseEnter={(e) => {
                  setHoveredEntity({ type: 'PUBLIC', data: ponto });
                  setTooltipPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHoveredEntity(null)}
              >
                {/* Halo de pulso */}
                <circle
                  cx={ponto.x}
                  cy={ponto.y}
                  r={12}
                  fill={ponto.corHex}
                  fillOpacity={0.25}
                />
                <circle
                  cx={ponto.x}
                  cy={ponto.y}
                  r={6}
                  fill={ponto.corHex}
                  stroke="#ffffff"
                  strokeWidth={1.5}
                />
              </g>
            ))}
          </g>

          {/* Chamados Internos (Dispersão Georreferenciada) */}
          <g id="internal-tickets-nodes">
            {chamados.map(c => {
              const [x, y] = projection.project(c.lng, c.lat);
              const isUrgent = c.prioridade === 'URGENTE';
              const isLate = c.isAtrasado;
              const isDone = c.status === 'CONCLUIDO';
              
              let fill = '#3b82f6';
              if (isDone) fill = '#10b981';
              else if (isLate) fill = '#ef4444';
              else if (isUrgent) fill = '#f59e0b';

              return (
                <circle
                  key={`chamado-${c.id}`}
                  cx={x}
                  cy={y}
                  r={isUrgent ? 5.5 : 4}
                  fill={fill}
                  stroke="#ffffff"
                  strokeWidth={1.2}
                  className="cursor-pointer transition-transform hover:scale-150"
                  onClick={() => onSelectChamado && onSelectChamado(c)}
                  onMouseEnter={(e) => {
                    setHoveredEntity({ type: 'CHAMADO', data: c });
                    setTooltipPos({ x: e.clientX, y: e.clientY });
                  }}
                  onMouseLeave={() => setHoveredEntity(null)}
                />
              );
            })}
          </g>
        </g>
      </svg>

      {/* Tooltip Flutuante D3 */}
      {hoveredEntity && (
        <div
          className="fixed pointer-events-none z-50 bg-slate-900/95 border border-slate-700 p-3 rounded-xl shadow-2xl text-xs text-white max-w-xs backdrop-blur-md animate-in fade-in-50 duration-150"
          style={{
            left: `${tooltipPos.x + 15}px`,
            top: `${tooltipPos.y + 15}px`
          }}
        >
          {hoveredEntity.type === 'SUB' && (
            <div>
              <div className="flex items-center justify-between font-bold text-sky-400 border-b border-slate-800 pb-1 mb-1.5">
                <span>Subprefeitura {hoveredEntity.data.nome}</span>
                <span className="text-[10px] bg-sky-950/60 border border-sky-800 px-1.5 py-0.5 rounded text-sky-300">
                  ID: {hoveredEntity.data.id}
                </span>
              </div>
              <div className="space-y-1 text-slate-300">
                <div className="flex justify-between">
                  <span>Total de Chamados:</span>
                  <span className="font-bold text-white">{hoveredEntity.data.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Demandas Pendentes:</span>
                  <span className="font-semibold text-amber-400">{hoveredEntity.data.pendentes}</span>
                </div>
                <div className="flex justify-between">
                  <span>Chamados Atrasados (SLA):</span>
                  <span className="font-semibold text-red-400">{hoveredEntity.data.atrasados}</span>
                </div>
                {crossAnalysisActive && (
                  <div className="flex justify-between border-t border-slate-800 pt-1 text-purple-300">
                    <span>Hotspots de Cruzamento:</span>
                    <span className="font-bold">{hoveredEntity.data.correlacoes}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {hoveredEntity.type === 'PUBLIC' && (
            <div>
              <div className="flex items-center gap-1.5 font-bold text-white border-b border-slate-800 pb-1 mb-1.5">
                <span 
                  className="w-2.5 h-2.5 rounded-full" 
                  style={{ backgroundColor: hoveredEntity.data.corHex }} 
                />
                <span>{hoveredEntity.data.sigla}</span>
              </div>
              <p className="font-semibold text-slate-200">{hoveredEntity.data.titulo}</p>
              <p className="text-sky-300 font-mono text-[11px] mt-0.5">{hoveredEntity.data.metrica}</p>
              <p className="text-slate-400 text-[10px] mt-1">{hoveredEntity.data.detalhe}</p>
            </div>
          )}

          {hoveredEntity.type === 'CHAMADO' && (
            <div>
              <div className="flex items-center justify-between font-bold text-white border-b border-slate-800 pb-1 mb-1.5">
                <span>{hoveredEntity.data.protocolo}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                  hoveredEntity.data.prioridade === 'URGENTE' ? 'bg-red-950 text-red-300 border border-red-800' : 'bg-slate-800 text-slate-300'
                }`}>
                  {hoveredEntity.data.prioridade}
                </span>
              </div>
              <p className="font-medium text-slate-300">Categoria: <span className="text-white">{hoveredEntity.data.categoria}</span></p>
              <p className="text-slate-400 text-[10px] mt-0.5">Status: {hoveredEntity.data.status}</p>
              {hoveredEntity.data.endereco && (
                <p className="text-slate-400 text-[10px] truncate max-w-[200px] mt-0.5">
                  {hoveredEntity.data.endereco}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
