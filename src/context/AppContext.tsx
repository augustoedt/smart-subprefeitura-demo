import React, { createContext, useContext, useState, ReactNode } from 'react';
import { 
  FonteDadosPublica, IdFonteDadosPublica, MapEngineType, MapEngineInfo, 
  ChangelogItem, CategoriaChamado, CamadaMapeada, BibliotecaPublicaGeolocalizada,
  SystemNotification, PitchTourStep 
} from '../types';
import { CATALOGO_FONTES_PUBLICAS } from '../dataPublicSources';
import { CHANGELOG_DATA_INITIAL } from '../dataChangelog';
import { CATALOGO_CAMADAS_MAPEADAS, BIBLIOTECAS_PUBLICAS_SP } from '../dataLayerMapping';

export const MOTORES_DISPONIVEIS: MapEngineInfo[] = [
  {
    id: 'LEAFLET',
    nome: 'Leaflet GovTech SP156',
    biblioteca: 'Leaflet v1.9 + MarkerCluster',
    descricao: 'Visualização cartográfica padrão com marcadores operacionais, clusters dinâmicos, anéis de SLA e popups técnicos.',
    icone: 'Map',
    badge: 'Operacional Padrão'
  },
  {
    id: 'MAPLIBRE_GL',
    nome: 'MapLibre GL Vetorial 3D',
    biblioteca: 'MapLibre GL JS v5 (WebGL Vector Tiles)',
    descricao: 'Motor vetorial GPU de alta performance com rotação, controle de pitch 3D, tesselação de quarteirões urbanos e estilos alternáveis.',
    icone: 'Globe',
    badge: 'Vetorial GPU 3D'
  },
  {
    id: 'SATELITE_ORTOFOTO',
    nome: 'Satélite & Ortofoto Híbrida',
    biblioteca: 'Esri World Imagery + OpenStreetMap Vias',
    descricao: 'Fotografia de satélite de altíssima definição combinada com sobreposição de vias e logradouros para vistoria pericial no solo.',
    icone: 'Layers',
    badge: 'Foto Alta Definição'
  },
  {
    id: 'CHOROPLETH_32_SUBS',
    nome: 'Análise 32 Subprefeituras',
    biblioteca: 'Polígonos Geográficos & Temas Dinâmicos',
    descricao: 'Mapeamento territorial dos limites reais das 32 subprefeituras com escala de cores por volume, % SLA e tempo de resposta.',
    icone: 'BarChart3',
    badge: 'Territorial 32 Subs'
  },
  {
    id: 'SERVICE_BUFFERS',
    nome: 'Cobertura & Buffers Cívicos',
    biblioteca: 'Service Area Topology & Buffer Analysis',
    descricao: 'Análise espacial de raios de atendimento (500m a 3km) ao redor das 10 Bibliotecas Públicas e bases de zeladoria.',
    icone: 'Radio',
    badge: 'Raios de Cobertura'
  },
  {
    id: 'HEATMAP_KERNEL',
    nome: 'Mapa de Calor & Kernel (KDE)',
    biblioteca: 'Leaflet.heat + Kernel Density Estimation',
    descricao: 'Termografia contínua de alta precisão com alternância entre densidade de chamados e criticidade ponderada de risco.',
    icone: 'Flame',
    badge: 'Calor & Densidade'
  }
];

interface AppContextType {
  // Fontes de Dados Públicos (Legado/Compatibilidade)
  publicSources: FonteDadosPublica[];
  activePublicSourcesCount: number;
  togglePublicSource: (id: IdFonteDadosPublica) => void;
  enableAllPublicSources: () => void;
  disableAllPublicSources: () => void;
  isSourceActive: (id: IdFonteDadosPublica) => boolean;

  // Sistema de Mapeamento de Camadas (Internas x Externas GeoJSON/WMS)
  camadasMapeadas: CamadaMapeada[];
  camadasAtivas: CamadaMapeada[];
  camadasAtivasCount: number;
  toggleCamada: (id: string) => void;
  setOpacidadeCamada: (id: string, opacidade: number) => void;
  setCamadaAtiva: (id: string, ativa: boolean) => void;
  isCamadaAtiva: (id: string) => boolean;
  
  // Bibliotecas Públicas Geolocalizadas (Papel Análogo aos Anexos)
  bibliotecasPublicas: BibliotecaPublicaGeolocalizada[];
  selectedBiblioteca: BibliotecaPublicaGeolocalizada | null;
  setSelectedBiblioteca: (b: BibliotecaPublicaGeolocalizada | null) => void;

  // Motores Cartográficos
  activeMapEngine: MapEngineType;
  setActiveMapEngine: (engine: MapEngineType) => void;
  availableEngines: MapEngineInfo[];

  // Sistema de Cruzamento de Camadas
  crossAnalysisActive: boolean;
  setCrossAnalysisActive: (active: boolean) => void;
  crossRadiusMeters: number;
  setCrossRadiusMeters: (radius: number) => void;
  crossSelectedSourceId: IdFonteDadosPublica | 'TODAS';
  setCrossSelectedSourceId: (id: IdFonteDadosPublica | 'TODAS') => void;
  crossSelectedCategory: CategoriaChamado | 'TODAS';
  setCrossSelectedCategory: (category: CategoriaChamado | 'TODAS') => void;

  // Modo Alto Contraste
  highContrast: boolean;
  setHighContrast: React.Dispatch<React.SetStateAction<boolean>>;

  // Changelog
  changelog: ChangelogItem[];
  addChangelogItem: (item: ChangelogItem) => void;

  // Notificações Toast Institucionais Globais
  notifications: SystemNotification[];
  addNotification: (notification: Omit<SystemNotification, 'id' | 'timestamp'>) => void;
  dismissNotification: (id: string) => void;

  // Modo Pitch / Demonstração Comercial
  isPitchTourOpen: boolean;
  setIsPitchTourOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [publicSources, setPublicSources] = useState<FonteDadosPublica[]>(CATALOGO_FONTES_PUBLICAS);
  const [camadasMapeadas, setCamadasMapeadas] = useState<CamadaMapeada[]>(CATALOGO_CAMADAS_MAPEADAS);
  const [selectedBiblioteca, setSelectedBiblioteca] = useState<BibliotecaPublicaGeolocalizada | null>(null);
  const [activeMapEngine, setActiveMapEngine] = useState<MapEngineType>('LEAFLET');
  const [crossAnalysisActive, setCrossAnalysisActive] = useState<boolean>(false);
  const [crossRadiusMeters, setCrossRadiusMeters] = useState<number>(600);
  const [crossSelectedSourceId, setCrossSelectedSourceId] = useState<IdFonteDadosPublica | 'TODAS'>('TODAS');
  const [crossSelectedCategory, setCrossSelectedCategory] = useState<CategoriaChamado | 'TODAS'>('TODAS');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [changelog, setChangelog] = useState<ChangelogItem[]>(CHANGELOG_DATA_INITIAL);
  const [isPitchTourOpen, setIsPitchTourOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: 'notif-welcome',
      titulo: 'Subprefeitura Vila Mariana Conectada',
      mensagem: 'Rede SP156 e 6 motores cartográficos sincronizados com a jurisdição SUB-VM.',
      tipo: 'info',
      timestamp: 'Agora'
    }
  ]);

  const addNotification = (notif: Omit<SystemNotification, 'id' | 'timestamp'>) => {
    const id = `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    setNotifications(prev => [{ ...notif, id, timestamp }, ...prev.slice(0, 4)]);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Manipuladores de Fontes Públicas
  const togglePublicSource = (id: IdFonteDadosPublica) => {
    setPublicSources(prev =>
      prev.map(f => (f.id === id ? { ...f, ativa: !f.ativa } : f))
    );
  };

  const enableAllPublicSources = () => {
    setPublicSources(prev => prev.map(f => ({ ...f, ativa: true })));
  };

  const disableAllPublicSources = () => {
    setPublicSources(prev => prev.map(f => ({ ...f, ativa: false })));
  };

  const isSourceActive = (id: IdFonteDadosPublica) => {
    return publicSources.some(f => f.id === id && f.ativa);
  };

  const activePublicSourcesCount = publicSources.filter(f => f.ativa).length;

  // Manipuladores do Sistema de Mapeamento de Camadas (Persistidas entre trocas de motor)
  const toggleCamada = (id: string) => {
    setCamadasMapeadas(prev =>
      prev.map(c => (c.id === id ? { ...c, ativa: !c.ativa } : c))
    );
  };

  const setOpacidadeCamada = (id: string, opacidade: number) => {
    setCamadasMapeadas(prev =>
      prev.map(c => (c.id === id ? { ...c, opacidade: Math.max(0.1, Math.min(1.0, opacidade)) } : c))
    );
  };

  const setCamadaAtiva = (id: string, ativa: boolean) => {
    setCamadasMapeadas(prev =>
      prev.map(c => (c.id === id ? { ...c, ativa } : c))
    );
  };

  const isCamadaAtiva = (id: string) => {
    return camadasMapeadas.some(c => c.id === id && c.ativa);
  };

  const camadasAtivas = camadasMapeadas.filter(c => c.ativa);
  const camadasAtivasCount = camadasAtivas.length;

  const addChangelogItem = (item: ChangelogItem) => {
    setChangelog(prev => [item, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        publicSources,
        activePublicSourcesCount,
        togglePublicSource,
        enableAllPublicSources,
        disableAllPublicSources,
        isSourceActive,
        camadasMapeadas,
        camadasAtivas,
        camadasAtivasCount,
        toggleCamada,
        setOpacidadeCamada,
        setCamadaAtiva,
        isCamadaAtiva,
        bibliotecasPublicas: BIBLIOTECAS_PUBLICAS_SP,
        selectedBiblioteca,
        setSelectedBiblioteca,
        activeMapEngine,
        setActiveMapEngine,
        availableEngines: MOTORES_DISPONIVEIS,
        crossAnalysisActive,
        setCrossAnalysisActive,
        crossRadiusMeters,
        setCrossRadiusMeters,
        crossSelectedSourceId,
        setCrossSelectedSourceId,
        crossSelectedCategory,
        setCrossSelectedCategory,
        highContrast,
        setHighContrast,
        changelog,
        addChangelogItem,
        notifications,
        addNotification,
        dismissNotification,
        isPitchTourOpen,
        setIsPitchTourOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser utilizado dentro de um AppProvider');
  }
  return context;
}
