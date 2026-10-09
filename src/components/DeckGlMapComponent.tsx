import React, { useState, useMemo } from 'react';
import { Chamado, Subprefeitura, FonteDadosPublica, HotspotCruzamento, BibliotecaPublicaGeolocalizada } from '../types';
import { useApp } from '../context/AppContext';
import { 
  Layers, Mountain, Navigation, Trees, Building2, Globe, 
  Eye, EyeOff, Maximize2, Sparkles, BookOpen, Sliders, 
  MapPin, Compass, ShieldCheck, Activity
} from 'lucide-react';

interface DeckGlMapComponentProps {
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

export default function DeckGlMapComponent({
  chamados,
  subprefeituras,
  fontesPublicas,
  selectedSubId,
  onSelectChamado,
  onSelectBiblioteca,
  highContrast,
  crossAnalysisActive,
  hotspotsCruzamento = []
}: DeckGlMapComponentProps) {
  const { 
    camadasMapeadas, 
    toggleCamada, 
    isCamadaAtiva, 
    bibliotecasPublicas, 
    setSelectedBiblioteca 
  } = useApp();

  // Estados de manipulação do diagrama axonométrico 3D do Anexo 1
  const [explodedSpacing, setExplodedSpacing] = useState<number>(75); // Espaçamento vertical entre camadas (px)
  const [viewAngle, setViewAngle] = useState<'ISOMETRIC_3D' | 'PERSPECTIVE' | 'TOP_DOWN'>('ISOMETRIC_3D');
  const [activeLayerHighlight, setActiveLayerHighlight] = useState<string | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<any | null>(null);

  // Subprefeitura ativa
  const subAtual = useMemo(() => {
    return subprefeituras.find(s => s.id === selectedSubId) || null;
  }, [selectedSubId, subprefeituras]);

  // Bibliotecas filtradas
  const bibliotecasNaArea = useMemo(() => {
    if (!selectedSubId || selectedSubId === 'ALL') return bibliotecasPublicas;
    return bibliotecasPublicas.filter(b => b.subprefeituraId === selectedSubId);
  }, [bibliotecasPublicas, selectedSubId]);

  // Transformações CSS para a perspectiva axonométrica
  const getTransformStyle = () => {
    if (viewAngle === 'TOP_DOWN') {
      return 'rotateX(0deg) rotateZ(0deg)';
    }
    if (viewAngle === 'PERSPECTIVE') {
      return 'rotateX(55deg) rotateZ(-30deg)';
    }
    // ISOMETRIC_3D (Fiel ao Anexo 1 SITE ANALYSIS AIRlab)
    return 'rotateX(60deg) rotateZ(-45deg)';
  };

  return (
    <div className={`relative w-full h-full overflow-hidden flex flex-col ${
      highContrast ? 'bg-slate-950 text-white' : 'bg-[#0f172a] text-slate-100'
    }`}>
      {/* Barra de Título e Controles Axonométricos Inspirados no Anexo 1 */}
      <div className="absolute top-3 left-3 z-40 flex flex-wrap items-center gap-2.5 bg-slate-900/90 backdrop-blur-md p-2 rounded-2xl border border-slate-700/80 shadow-2xl">
        <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-purple-900/80 to-indigo-900/80 rounded-xl border border-purple-500/40">
          <Layers className="w-4 h-4 text-purple-300" />
          <div className="flex flex-col">
            <span className="text-[10px] font-mono tracking-widest text-purple-300 uppercase font-bold">Deck.gl Visual Engine</span>
            <span className="text-xs font-black tracking-wider text-white">SITE ANALYSIS • EXPLODED LAYERS</span>
          </div>
        </div>

        {/* Alternador de Ângulo de Projeção */}
        <div className="flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700">
          <button
            onClick={() => setViewAngle('ISOMETRIC_3D')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              viewAngle === 'ISOMETRIC_3D'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
            title="Projeção Axonométrica Isométrica idêntica ao Anexo 1"
          >
            Axonométrico 3D
          </button>
          <button
            onClick={() => setViewAngle('PERSPECTIVE')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              viewAngle === 'PERSPECTIVE'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Perspectiva
          </button>
          <button
            onClick={() => setViewAngle('TOP_DOWN')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              viewAngle === 'TOP_DOWN'
                ? 'bg-purple-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ortogonal
          </button>
        </div>

        {/* Controle Deslizante de Exploded Spacing (Espaçamento entre as fatias 3D) */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-800/80 rounded-xl border border-slate-700 text-xs">
          <Sliders className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-[11px] text-slate-300 font-medium">Explosão:</span>
          <input
            type="range"
            min="10"
            max="130"
            value={explodedSpacing}
            onChange={(e) => setExplodedSpacing(Number(e.target.value))}
            className="w-20 accent-purple-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
          />
          <span className="font-mono text-[11px] text-purple-300 font-bold w-7 text-right">
            {explodedSpacing}px
          </span>
        </div>
      </div>

      {/* Painel Lateral Direito: Lista de Camadas Mapeadas do Anexo 1 */}
      <div className="absolute top-3 right-3 z-40 max-w-[260px] bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700/80 shadow-2xl hidden md:flex flex-col gap-2 text-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
          <span className="font-bold text-slate-200 uppercase tracking-wider text-[10px]">Estratos Analíticos (Anexo 1)</span>
          <span className="text-[10px] font-mono text-purple-400 font-bold">5 Fatias 3D</span>
        </div>

        {/* Camada 1: Topografia */}
        <div 
          onClick={() => toggleCamada('layer-topografia-relevo')}
          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
            isCamadaAtiva('layer-topografia-relevo')
              ? 'bg-sky-950/70 border-sky-600 text-sky-200'
              : 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60'
          }`}
        >
          <div className="flex items-center gap-2">
            <Mountain className="w-3.5 h-3.5 text-sky-400" />
            <div className="flex flex-col">
              <span className="font-bold text-[11px]">1. Topography</span>
              <span className="text-[9px] text-slate-400">Elevation 256.5m - 500m</span>
            </div>
          </div>
          {isCamadaAtiva('layer-topografia-relevo') ? <Eye className="w-3.5 h-3.5 text-sky-400" /> : <EyeOff className="w-3.5 h-3.5" />}
        </div>

        {/* Camada 2: Circulação */}
        <div 
          onClick={() => toggleCamada('layer-circulacao-vias')}
          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
            isCamadaAtiva('layer-circulacao-vias')
              ? 'bg-amber-950/70 border-amber-600 text-amber-200'
              : 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60'
          }`}
        >
          <div className="flex items-center gap-2">
            <Navigation className="w-3.5 h-3.5 text-amber-400" />
            <div className="flex flex-col">
              <span className="font-bold text-[11px]">2. Circulation</span>
              <span className="text-[9px] text-slate-400">Primary, Secondary & Transit</span>
            </div>
          </div>
          {isCamadaAtiva('layer-circulacao-vias') ? <Eye className="w-3.5 h-3.5 text-amber-400" /> : <EyeOff className="w-3.5 h-3.5" />}
        </div>

        {/* Camada 3: Espaços Verdes */}
        <div 
          onClick={() => toggleCamada('layer-espacos-verdes')}
          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
            isCamadaAtiva('layer-espacos-verdes')
              ? 'bg-emerald-950/70 border-emerald-600 text-emerald-200'
              : 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60'
          }`}
        >
          <div className="flex items-center gap-2">
            <Trees className="w-3.5 h-3.5 text-emerald-400" />
            <div className="flex flex-col">
              <span className="font-bold text-[11px]">3. Green & Open Spaces</span>
              <span className="text-[9px] text-slate-400">Parques & Cobertura Vegetal</span>
            </div>
          </div>
          {isCamadaAtiva('layer-espacos-verdes') ? <Eye className="w-3.5 h-3.5 text-emerald-400" /> : <EyeOff className="w-3.5 h-3.5" />}
        </div>

        {/* Camada 4: Forma Construída 3D e Bibliotecas */}
        <div 
          onClick={() => toggleCamada('layer-forma-construida-3d')}
          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
            isCamadaAtiva('layer-forma-construida-3d')
              ? 'bg-indigo-950/70 border-indigo-600 text-indigo-200'
              : 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60'
          }`}
        >
          <div className="flex items-center gap-2">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <div className="flex flex-col">
              <span className="font-bold text-[11px]">4. Built Form & Landmarks</span>
              <span className="text-[9px] text-slate-400">Quarteirões 3D & Bibliotecas SP</span>
            </div>
          </div>
          {isCamadaAtiva('layer-forma-construida-3d') ? <Eye className="w-3.5 h-3.5 text-indigo-400" /> : <EyeOff className="w-3.5 h-3.5" />}
        </div>

        {/* Camada 5: Contexto Satélite */}
        <div 
          onClick={() => toggleCamada('layer-satelite-contexto')}
          className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
            isCamadaAtiva('layer-satelite-contexto')
              ? 'bg-slate-800 border-slate-500 text-slate-200'
              : 'bg-slate-800/40 border-slate-800 text-slate-500 opacity-60'
          }`}
        >
          <div className="flex items-center gap-2">
            <Globe className="w-3.5 h-3.5 text-slate-400" />
            <div className="flex flex-col">
              <span className="font-bold text-[11px]">5. Satellite Context</span>
              <span className="text-[9px] text-slate-400">Base Ortofoto & Conexões</span>
            </div>
          </div>
          {isCamadaAtiva('layer-satelite-contexto') ? <Eye className="w-3.5 h-3.5 text-slate-400" /> : <EyeOff className="w-3.5 h-3.5" />}
        </div>
      </div>

      {/* Palco 3D Axonométrico com Perspectiva Explodida */}
      <div className="flex-1 w-full h-full flex items-center justify-center relative perspective-[1400px] overflow-hidden p-6">
        <div 
          className="relative transition-transform duration-700 ease-out transform-style-3d cursor-grab active:cursor-grabbing"
          style={{
            transform: getTransformStyle(),
            width: '680px',
            height: '460px'
          }}
        >
          {/* ========================================================================= */}
          {/* CAMADA 5: SATELLITE CONTEXT / BASE ORTOFOTO (Z-Index Mais Baixo) */}
          {/* ========================================================================= */}
          {isCamadaAtiva('layer-satelite-contexto') && (
            <div 
              className="absolute inset-0 rounded-3xl border-2 border-slate-700/60 shadow-2xl transition-all duration-500 overflow-hidden bg-slate-900/90"
              style={{
                transform: `translateZ(0px)`,
                boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.8)'
              }}
            >
              {/* Grid de Malha Territorial e Conexões */}
              <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-slate-950/80 px-3 py-1 rounded-lg border border-slate-700 text-[10px] font-bold text-slate-300">
                <Globe className="w-3 h-3 text-slate-400" />
                <span>5. SATELLITE CONTEXT & METROPOLITAN TRANSIT</span>
              </div>
              
              {/* Arcos de Conectividade Territorial */}
              <svg className="w-full h-full absolute inset-0 pointer-events-none opacity-50">
                <circle cx="340" cy="230" r="140" fill="none" stroke="#475569" strokeDasharray="4 4" strokeWidth="1.5" />
                <circle cx="340" cy="230" r="220" fill="none" stroke="#334155" strokeDasharray="6 6" strokeWidth="1" />
                <line x1="120" y1="90" x2="560" y2="370" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
                <line x1="100" y1="360" x2="580" y2="100" stroke="#64748b" strokeWidth="1" strokeDasharray="2 2" />
              </svg>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CAMADA 4: BUILT FORM & LANDMARKS (Quarteirões 3D e Bibliotecas de SP) */}
          {/* ========================================================================= */}
          {isCamadaAtiva('layer-forma-construida-3d') && (
            <div 
              className="absolute inset-0 rounded-3xl border-2 border-indigo-500/40 shadow-2xl transition-all duration-500 overflow-hidden bg-indigo-950/20 backdrop-blur-[1px]"
              style={{
                transform: `translateZ(${explodedSpacing * 1}px)`,
                boxShadow: '0 20px 40px -10px rgba(99, 102, 241, 0.2)'
              }}
            >
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-indigo-950/80 px-3 py-1 rounded-lg border border-indigo-700 text-[10px] font-bold text-indigo-300">
                <Building2 className="w-3 h-3 text-indigo-400" />
                <span>4. BUILT FORM & CIVIC LANDMARKS</span>
              </div>

              {/* Quarteirões Urbanos com Extrusão Isométrica (Anexo 1 e Anexo 2) */}
              <div className="absolute inset-0 p-12 grid grid-cols-6 grid-rows-4 gap-4 pointer-events-none">
                {Array.from({ length: 24 }).map((_, idx) => {
                  const isTall = idx % 5 === 0;
                  const isMedium = idx % 3 === 0;
                  return (
                    <div 
                      key={idx} 
                      className={`rounded-lg transition-transform ${
                        isTall 
                          ? 'bg-indigo-600/30 border border-indigo-400/50 shadow-lg translate-y-[-8px]' 
                          : isMedium 
                          ? 'bg-indigo-800/25 border border-indigo-500/30 translate-y-[-4px]' 
                          : 'bg-slate-700/20 border border-slate-600/30'
                      }`}
                    />
                  );
                })}
              </div>

              {/* MARCADORES DAS BIBLIOTECAS PÚBLICAS DE SÃO PAULO (Papel Análogo aos Anexos) */}
              {isCamadaAtiva('layer-bibliotecas-sp') && (
                <div className="absolute inset-0 pointer-events-auto">
                  {bibliotecasNaArea.map((bib, idx) => {
                    // Posições estéticas espalhadas na área do palco
                    const left = 18 + (idx * 23) % 70;
                    const top = 22 + (idx * 31) % 65;

                    return (
                      <div
                        key={bib.id}
                        onClick={() => {
                          setSelectedEntity({ tipo: 'BIBLIOTECA', data: bib });
                          if (onSelectBiblioteca) onSelectBiblioteca(bib);
                          if (setSelectedBiblioteca) setSelectedBiblioteca(bib);
                        }}
                        style={{ left: `${left}%`, top: `${top}%` }}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-30"
                      >
                        {/* Halo do Raio de Proteção da Biblioteca (Buffer 500m) */}
                        <div className="absolute -inset-6 rounded-full border border-red-500/30 bg-red-500/10 animate-ping opacity-75" />
                        <div className="absolute -inset-4 rounded-full border border-red-500/40 bg-red-500/5" />

                        {/* Pin 3D da Biblioteca */}
                        <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-red-700 to-rose-500 text-white font-bold border-2 border-white shadow-xl transform group-hover:scale-125 transition-transform">
                          <BookOpen className="w-4 h-4" />
                        </div>

                        {/* Etiqueta Flutuante Estilo Anexo 4 (Budapest Landmark) */}
                        <div className="absolute left-10 top-0 whitespace-nowrap bg-slate-900/95 backdrop-blur-md px-2.5 py-1 rounded-lg border border-red-500/50 shadow-lg text-[10px] text-white opacity-90 group-hover:opacity-100 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                          <span className="font-bold">{bib.nome}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* CAMADA 3: GREEN & OPEN SPACES (Parques e Áreas Verdes) */}
          {/* ========================================================================= */}
          {isCamadaAtiva('layer-espacos-verdes') && (
            <div 
              className="absolute inset-0 rounded-3xl border-2 border-emerald-500/40 shadow-2xl transition-all duration-500 overflow-hidden bg-emerald-950/20 backdrop-blur-[1px]"
              style={{
                transform: `translateZ(${explodedSpacing * 2}px)`,
                boxShadow: '0 20px 40px -10px rgba(16, 185, 129, 0.2)'
              }}
            >
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-700 text-[10px] font-bold text-emerald-300">
                <Trees className="w-3 h-3 text-emerald-400" />
                <span>3. GREEN & OPEN SPACES (PARQUES & COBERTURA ARBÓREA)</span>
              </div>

              {/* Polígonos de Parques e Jardins inspirados no Anexo 1 */}
              <svg className="w-full h-full absolute inset-0 pointer-events-none">
                <path d="M 80 120 Q 140 80, 200 130 T 260 220 T 160 260 Z" fill="rgba(16, 185, 129, 0.35)" stroke="#10b981" strokeWidth="1.5" />
                <path d="M 400 180 Q 480 140, 540 190 T 580 300 T 450 320 Z" fill="rgba(16, 185, 129, 0.30)" stroke="#10b981" strokeWidth="1.5" />
                <circle cx="340" cy="110" r="35" fill="rgba(52, 211, 153, 0.35)" stroke="#34d399" strokeWidth="1.5" />
              </svg>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CAMADA 2: CIRCULATION (Eixos Viários e Corredores de Mobilidade) */}
          {/* ========================================================================= */}
          {isCamadaAtiva('layer-circulacao-vias') && (
            <div 
              className="absolute inset-0 rounded-3xl border-2 border-amber-500/40 shadow-2xl transition-all duration-500 overflow-hidden bg-amber-950/20 backdrop-blur-[1px]"
              style={{
                transform: `translateZ(${explodedSpacing * 3}px)`,
                boxShadow: '0 20px 40px -10px rgba(245, 158, 11, 0.2)'
              }}
            >
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-amber-950/80 px-3 py-1 rounded-lg border border-amber-700 text-[10px] font-bold text-amber-300">
                <Navigation className="w-3 h-3 text-amber-400" />
                <span>2. CIRCULATION (PRIMARY, SECONDARY & BUS CORRIDORS)</span>
              </div>

              {/* Linhas Viárias Estruturantes e Flechas de Direção (Anexo 1) */}
              <svg className="w-full h-full absolute inset-0 pointer-events-none">
                {/* Eixo Primário (Vermelho/Magenta) */}
                <path d="M 40 260 L 640 190" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" opacity="0.85" />
                {/* Eixo Secundário (Laranja) */}
                <path d="M 220 40 L 420 420" stroke="#f97316" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />
                {/* Corredor de Conexão Transversal */}
                <path d="M 120 100 Q 320 280, 560 360" stroke="#eab308" strokeWidth="2.5" strokeDasharray="6 4" opacity="0.8" />
              </svg>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CAMADA 1: TOPOGRAPHY (Curvas de Nível e Hipsometria do Anexo 1) */}
          {/* ========================================================================= */}
          {isCamadaAtiva('layer-topografia-relevo') && (
            <div 
              className="absolute inset-0 rounded-3xl border-2 border-sky-500/40 shadow-2xl transition-all duration-500 overflow-hidden bg-sky-950/20 backdrop-blur-[1px]"
              style={{
                transform: `translateZ(${explodedSpacing * 4}px)`,
                boxShadow: '0 20px 40px -10px rgba(14, 165, 233, 0.3)'
              }}
            >
              <div className="absolute top-4 left-4 flex items-center gap-2 bg-sky-950/80 px-3 py-1 rounded-lg border border-sky-700 text-[10px] font-bold text-sky-300">
                <Mountain className="w-3 h-3 text-sky-400" />
                <span>1. TOPOGRAPHY (ELEVATION 256.5m - 500m)</span>
              </div>

              {/* Curvas de Nível Hipsométricas idênticas ao Anexo 1 */}
              <svg className="w-full h-full absolute inset-0 pointer-events-none">
                <path d="M 40 180 Q 200 90, 440 120 T 640 80" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />
                <path d="M 40 240 Q 220 150, 480 180 T 640 140" fill="none" stroke="#0ea5e9" strokeWidth="2.5" opacity="0.85" />
                <path d="M 60 300 Q 260 210, 510 240 T 640 200" fill="none" stroke="#0284c7" strokeWidth="2" opacity="0.75" />
                <path d="M 80 360 Q 280 270, 540 300 T 640 260" fill="none" stroke="#0369a1" strokeWidth="1.5" opacity="0.7" />

                {/* Marcadores de Altimetria idênticos ao Anexo 1 */}
                <text x="70" y="235" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">256.5m</text>
                <text x="320" y="165" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">380.0m</text>
                <text x="560" y="130" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">500.0m</text>
              </svg>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CAMADA INTERNA SP156 ZELADORIA (Projetada no Topo da Pilha 3D) */}
          {/* ========================================================================= */}
          {isCamadaAtiva('layer-zeladoria-interna') && (
            <div 
              className="absolute inset-0 pointer-events-auto"
              style={{
                transform: `translateZ(${explodedSpacing * 4 + 20}px)`
              }}
            >
              {chamados.slice(0, 35).map((c, idx) => {
                const left = 12 + (idx * 17) % 76;
                const top = 15 + (idx * 23) % 70;
                let dotColor = '#3b82f6';
                if (c.prioridade === 'URGENTE') dotColor = '#ef4444';
                else if (c.prioridade === 'ALTA') dotColor = '#f97316';

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedEntity({ tipo: 'CHAMADO', data: c });
                      if (onSelectChamado) onSelectChamado(c);
                    }}
                    style={{ left: `${left}%`, top: `${top}%` }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-150 transition-transform z-50 group"
                  >
                    <div 
                      className="w-3.5 h-3.5 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: dotColor }}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Drawer / Card Flutuante de Inspeção de Detalhes da Entidade Clicada */}
      {selectedEntity && (
        <div className="absolute bottom-4 left-4 z-50 max-w-md bg-slate-900/95 backdrop-blur-lg rounded-2xl border border-slate-700 shadow-2xl p-4 text-white animate-in slide-in-from-bottom-3">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2.5">
              {selectedEntity.tipo === 'BIBLIOTECA' ? (
                <div className="p-2.5 bg-red-900/60 text-red-300 rounded-xl border border-red-700">
                  <BookOpen className="w-5 h-5" />
                </div>
              ) : (
                <div className="p-2.5 bg-blue-900/60 text-blue-300 rounded-xl border border-blue-700">
                  <Activity className="w-5 h-5" />
                </div>
              )}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-bold">
                  {selectedEntity.tipo === 'BIBLIOTECA' ? 'Equipamento Cultural (Anexos 3 e 4)' : 'Chamado Operacional SP156'}
                </span>
                <h4 className="font-bold text-sm text-white">
                  {selectedEntity.tipo === 'BIBLIOTECA' ? selectedEntity.data.nome : selectedEntity.data.protocolo}
                </h4>
              </div>
            </div>
            <button 
              onClick={() => setSelectedEntity(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              ✕
            </button>
          </div>

          {selectedEntity.tipo === 'BIBLIOTECA' ? (
            <div className="space-y-2 text-xs text-slate-300">
              <p className="text-slate-200 font-medium">{selectedEntity.data.endereco}</p>
              <div className="p-2.5 bg-red-950/60 border border-red-800/80 rounded-xl text-[11px] text-red-200">
                <strong>Papel no Território:</strong> {selectedEntity.data.papelAnalogoAnexo}
              </div>
              <p className="text-[11px] text-slate-400">
                <strong>Acervo:</strong> {selectedEntity.data.acervoEspecialidade}
              </p>
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                <span className="text-slate-400">Raio de Acessibilidade: {selectedEntity.data.raioProtecaoZeladoriaMetros}m</span>
                <button
                  onClick={() => {
                    if (onSelectBiblioteca) onSelectBiblioteca(selectedEntity.data);
                  }}
                  className="px-3 py-1 bg-red-600 hover:bg-red-500 font-bold text-white rounded-lg transition-colors"
                >
                  Abrir Prontuário Completo
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1.5 text-xs text-slate-300">
              <p><strong>Logradouro:</strong> {selectedEntity.data.endereco}</p>
              <p><strong>Categoria:</strong> {selectedEntity.data.categoria} | <strong>Prioridade:</strong> {selectedEntity.data.prioridade}</p>
              <p className="text-slate-400 line-clamp-2">{selectedEntity.data.descricao}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
