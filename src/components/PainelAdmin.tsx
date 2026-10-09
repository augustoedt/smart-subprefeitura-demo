import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Chamado, StatusChamado, CategoriaChamado, PrioridadeChamado, PainelAdminTab } from '../types';
import { subprefeituras } from '../data';
import { UserSession } from '../LoginTypes';
import { 
  ExternalLink, AlertTriangle, CheckCircle2, Clock, Check, MoreHorizontal, 
  Camera, MessageCircle, X, Star, Smartphone, FileText, Download, Printer,
  TreeDeciduous, Droplets, User, Megaphone, Hammer, ShieldAlert, Truck,
  MapPin, Eye, AlertCircle, Search, Filter, RotateCcw, XCircle, GitCompare,
  BarChart3, Building2, TrendingUp, ShieldCheck, Activity, Flame, ChevronDown, ChevronUp
} from 'lucide-react';
import CanalWhatsApp from './CanalWhatsApp';
import { AnimatedCounter } from './AnimatedCounter';
import { LiveIndicator } from './LiveIndicator';
import CockpitDecisaoBairros from './CockpitDecisaoBairros';
import { BAIRROS_SUB_VILA_MARIANA } from '../data';
import BrasaoSaoPaulo from './BrasaoSaoPaulo';
import { useApp } from '../context/AppContext';

interface PainelAdminProps {
  chamados: Chamado[];
  setChamados: React.Dispatch<React.SetStateAction<Chamado[]>>;
  activeTab: PainelAdminTab;
  onActiveTabChange: (tab: PainelAdminTab) => void;
}

const DISTANCE_THRESHOLD = 0.0009; // approx 100 meters in degrees

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  return Math.sqrt(Math.pow(lat1 - lat2, 2) + Math.pow(lon1 - lon2, 2));
}

// Mapeamento dos ícones da Sala de Situação e design da categoria
const CATEGORY_CONFIG: Record<CategoriaChamado, {
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  bgLight: string;
  textColor: string;
  borderColor: string;
}> = {
  ARVORE_CAIDA: {
    label: 'Árvore Caída',
    icon: TreeDeciduous,
    bgLight: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
  },
  BUEIRO: {
    label: 'Bueiro / Drenagem',
    icon: Droplets,
    bgLight: 'bg-sky-50',
    textColor: 'text-sky-700',
    borderColor: 'border-sky-200',
  },
  MORADOR_RUA: {
    label: 'Acolhimento Social',
    icon: User,
    bgLight: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
  },
  BARULHO_PSIU: {
    label: 'Barulho (PSIU)',
    icon: Megaphone,
    bgLight: 'bg-rose-50',
    textColor: 'text-rose-700',
    borderColor: 'border-rose-200',
  },
  CALCADA: {
    label: 'Calçada Irregular',
    icon: Hammer,
    bgLight: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
  },
  TAPA_BURACO: {
    label: 'Tapa-Buraco',
    icon: Hammer,
    bgLight: 'bg-amber-50',
    textColor: 'text-amber-700',
    borderColor: 'border-amber-200',
  },
  FISCALIZACAO_POSTURA: {
    label: 'Fiscalização de Postura',
    icon: ShieldAlert,
    bgLight: 'bg-indigo-50',
    textColor: 'text-indigo-700',
    borderColor: 'border-indigo-200',
  },
  DESFAZIMENTO: {
    label: 'Desfazimento',
    icon: Truck,
    bgLight: 'bg-slate-100',
    textColor: 'text-slate-700',
    borderColor: 'border-slate-200',
  },
};

// Selos de Prioridade com cores definidas no projeto
const PRIORITY_CONFIG: Record<PrioridadeChamado, {
  label: string;
  badgeStyle: string;
}> = {
  URGENTE: {
    label: 'Urgente',
    badgeStyle: 'bg-red-50 text-red-700 border-red-200 font-bold',
  },
  ALTA: {
    label: 'Alta',
    badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200 font-bold',
  },
  MEDIA: {
    label: 'Média',
    badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
  },
  BAIXA: {
    label: 'Baixa',
    badgeStyle: 'bg-slate-100 text-slate-600 border-slate-200 font-medium',
  },
};

// Prazos de SLA por categoria (em horas)
const SLA_HORAS_POR_CATEGORIA: Record<CategoriaChamado, number> = {
  TAPA_BURACO: 24,
  MORADOR_RUA: 24,
  ARVORE_CAIDA: 48,
  BARULHO_PSIU: 48,
  BUEIRO: 72,
  FISCALIZACAO_POSTURA: 72,
  DESFAZIMENTO: 96,
  CALCADA: 120,
};

const FOTO_EVIDENCIA_ANTES = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800&h=600';
const FOTO_EVIDENCIA_DEPOIS = 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800&h=600';

// Formatação do tempo em aberto (ex.: "há 2 dias", "há 5 horas")
function formatTempoAberto(dataAbertura: string): string {
  const agora = Date.now();
  const abertura = new Date(dataAbertura).getTime();
  const diffMs = Math.max(0, agora - abertura);
  const diffMin = Math.floor(diffMs / (1000 * 60));
  const diffHoras = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDias = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias > 1) return `há ${diffDias} dias`;
  if (diffDias === 1) return `há 1 dia`;
  if (diffHoras > 1) return `há ${diffHoras} horas`;
  if (diffHoras === 1) return `há 1 hora`;
  if (diffMin > 1) return `há ${diffMin} min`;
  return 'há instantes';
}

// Cálculo do progresso do SLA com regra de cores
// (verde até 70% do prazo, amarelo até 100%, vermelho acima do prazo)
function getSlaProgress(chamado: Chamado) {
  const slaHoras = SLA_HORAS_POR_CATEGORIA[chamado.categoria] || 48;
  const slaMs = slaHoras * 60 * 60 * 1000;
  const agora = Date.now();
  const abertura = new Date(chamado.dataAbertura).getTime();
  const tempoDecorridoMs = Math.max(0, agora - abertura);

  let pctConsumido = Math.round((tempoDecorridoMs / slaMs) * 100);
  if (chamado.isAtrasado && pctConsumido < 100) {
    pctConsumido = 115;
  }

  let barColor = 'bg-emerald-500';
  let textColor = 'text-emerald-700';
  let statusText = `${pctConsumido}% do prazo`;

  if (pctConsumido > 100 || chamado.isAtrasado) {
    barColor = 'bg-red-500';
    textColor = 'text-red-700 font-semibold';
    statusText = `SLA Estourado (${pctConsumido}%)`;
  } else if (pctConsumido > 70) {
    barColor = 'bg-amber-500';
    textColor = 'text-amber-700 font-medium';
    statusText = `${pctConsumido}% do prazo`;
  }

  const barWidth = Math.min(100, Math.max(4, pctConsumido));

  return {
    slaHoras,
    pctConsumido,
    barColor,
    textColor,
    statusText,
    barWidth,
  };
}

export default function PainelAdmin({ chamados, setChamados, session, activeTab, onActiveTabChange }: PainelAdminProps & { session: UserSession }) {
  const { addNotification } = useApp();
  const [whatsappPreview, setWhatsappPreview] = useState<Chamado | null>(null);
  const [showPdfReport, setShowPdfReport] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; etapa: 'ANTES' | 'DEPOIS' } | null>(null);
  const [selectedKanbanChamadoId, setSelectedKanbanChamadoId] = useState<string | null>(null);
  const selectedKanbanChamado = chamados.find((chamado) => chamado.id === selectedKanbanChamadoId) ?? null;


  useEffect(() => {
    if (!selectedKanbanChamadoId && !previewPhoto) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      if (previewPhoto) {
        setPreviewPhoto(null);
      } else {
        setSelectedKanbanChamadoId(null);
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [selectedKanbanChamadoId, previewPhoto]);

  // Estados de Filtros e Busca no Kanban por Bairro / Distrito
  const [searchProtocolo, setSearchProtocolo] = useState('');
  const [filterCategoria, setFilterCategoria] = useState<string>('TODAS');
  const [filterPrioridade, setFilterPrioridade] = useState<string>('TODAS');
  const [filterDistrito, setFilterDistrito] = useState<string>('TODOS');
  const [filterBairro, setFilterBairro] = useState<string>('TODOS');
  const [toastNotification, setToastNotification] = useState<{ message: string; type: 'success' | 'amber' } | null>(null);

  // Simulação de atualização em tempo real (dados vivos a cada 15-20 segundos)
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [deltaAbertos, setDeltaAbertos] = useState(0);
  const [deltaConcluidos, setDeltaConcluidos] = useState(0);
  const [deltaPct, setDeltaPct] = useState(0);
  const [slaArvore, setSlaArvore] = useState(48);
  const [slaBuraco, setSlaBuraco] = useState(24);
  const [mobileColumnFilter, setMobileColumnFilter] = useState<StatusChamado | 'TODAS'>('TODAS');
  const nextIntervalRef = useRef(17);

  const triggerLiveUpdate = () => {
    setIsUpdating(true);
    setSecondsAgo(0);
    // Próximo intervalo aleatório entre 15 e 20 segundos
    nextIntervalRef.current = Math.floor(Math.random() * 6) + 15;

    // Variações discretas (+1 ou -1) sem mudar a narrativa geral
    setDeltaAbertos(prev => {
      const step = Math.random() > 0.5 ? 1 : -1;
      return Math.max(-2, Math.min(2, prev + step));
    });

    setDeltaConcluidos(prev => {
      const shouldAdvance = Math.random() > 0.6;
      return shouldAdvance ? Math.min(prev + 1, 4) : prev;
    });

    setDeltaPct(prev => {
      const step = Math.random() > 0.5 ? 1 : -1;
      return Math.max(-2, Math.min(2, prev + step));
    });

    setSlaArvore(() => 48 + (Math.floor(Math.random() * 3) - 1));
    setSlaBuraco(() => 24 + (Math.floor(Math.random() * 3) - 1));

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

  const displayChamados = session?.role === 'GESTOR' && session?.subprefeituraId 
    ? chamados.filter(c => c.subprefeituraId === session.subprefeituraId) 
    : chamados;

  // Chamados filtrados pela barra de busca e filtros do Kanban
  const filteredChamados = useMemo(() => {
    let list = displayChamados;

    return list.filter(chamado => {
      // 1. Busca por número de protocolo
      if (searchProtocolo.trim()) {
        const query = searchProtocolo.trim().toLowerCase();
        if (!chamado.protocolo.toLowerCase().includes(query)) {
          return false;
        }
      }

      // 2. Filtro por Categoria
      if (filterCategoria !== 'TODAS' && chamado.categoria !== filterCategoria) {
        return false;
      }

      // 3. Filtro por Prioridade
      if (filterPrioridade !== 'TODAS' && chamado.prioridade !== filterPrioridade) {
        return false;
      }

      // 4. Filtro por Distrito
      if (filterDistrito !== 'TODOS') {
        const matchDist = chamado.distrito === filterDistrito || (chamado.endereco && chamado.endereco.includes(filterDistrito));
        if (!matchDist) return false;
      }

      // 5. Filtro por Bairro
      if (filterBairro !== 'TODOS') {
        const matchBairro = chamado.bairro === filterBairro || (chamado.endereco && chamado.endereco.includes(filterBairro));
        if (!matchBairro) return false;
      }

      return true;
    });
  }, [displayChamados, searchProtocolo, filterCategoria, filterPrioridade, filterDistrito, filterBairro]);

  const hasActiveFilters = Boolean(
    searchProtocolo.trim() || 
    filterCategoria !== 'TODAS' || 
    filterPrioridade !== 'TODAS' || 
    filterDistrito !== 'TODOS' ||
    filterBairro !== 'TODOS'
  );

  const handleClearFilters = () => {
    setSearchProtocolo('');
    setFilterCategoria('TODAS');
    setFilterPrioridade('TODAS');
    setFilterDistrito('TODOS');
    setFilterBairro('TODOS');
  };

  // KPIs Executivos Expandidos
  const totalAbertos = chamados.filter(c => c.status !== 'CONCLUIDO').length;
  const totalConcluidos = chamados.filter(c => c.status === 'CONCLUIDO').length;
  const noPrazo = chamados.filter(c => !c.isAtrasado).length;
  const pctNoPrazo = Math.round((noPrazo / (chamados.length || 1)) * 100) || 0;
  const taxaResolucao = Math.round((totalConcluidos / (chamados.length || 1)) * 100) || 0;
  // Reincidência no raio de influência (<150m) com mesma categoria
  const reincidentes = useMemo(() => {
    return chamados.filter(c => 
      chamados.some(other => other.id !== c.id && other.categoria === c.categoria && getDistance(c.lat, c.lng, other.lat, other.lng) < DISTANCE_THRESHOLD)
    ).length;
  }, [chamados]);
  const pctReincidente = Math.round((reincidentes / (chamados.length || 1)) * 100) || 0;
  const urgentesOuCriticos = chamados.filter(c => c.prioridade === 'URGENTE' && c.status !== 'CONCLUIDO').length;
  const conformidadeChecklist = Math.round((chamados.filter(c => c.status === 'CONCLUIDO' || Boolean(c.fotoDepois)).length / (chamados.length || 1)) * 100) || 0;
  const indiceEficiencia = Math.min(100, Math.round((pctNoPrazo * 0.4) + (taxaResolucao * 0.35) + ((100 - pctReincidente) * 0.15) + (conformidadeChecklist * 0.1)));
  
  const [showExpandedKpis, setShowExpandedKpis] = useState(false);

  // Kanban Columns
  const columns: { id: StatusChamado; title: string; color: string }[] = [
    { id: 'NOVO', title: 'Novo', color: 'bg-amber-100 text-amber-800 border-amber-200' },
    { id: 'ENCAMINHADO', title: 'Encaminhado', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
    { id: 'EM_EXECUCAO', title: 'Em execução', color: 'bg-blue-100 text-blue-800 border-blue-200' },
    { id: 'AGUARDANDO_APROVACAO', title: 'Aguardando aprovação', color: 'bg-orange-100 text-orange-800 border-orange-200' },
    { id: 'CONCLUIDO', title: 'Concluído', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  ];

  const handleAprovar = (id: string) => {
    const chamadoAprovado = chamados.find(c => c.id === id);
    setChamados(prev => prev.map(c => c.id === id ? { ...c, status: 'CONCLUIDO', isAtrasado: false } : c));
    if (chamadoAprovado) {
      setWhatsappPreview(chamadoAprovado);
      setToastNotification({
        message: `Chamado ${chamadoAprovado.protocolo} aprovado e encerrado com sucesso!`,
        type: 'success',
      });
      addNotification({
        titulo: 'Chamado Aprovado e Concluído',
        mensagem: `Protocolo ${chamadoAprovado.protocolo} foi homologado pela supervisão. Munícipe notificado via WhatsApp SP156 com foto do DEPOIS.`,
        tipo: 'sucesso',
        linkSection: session.role === 'CENTRAL' ? 'simulacao_zap' : undefined,
        protocolo: chamadoAprovado.protocolo
      });
      setTimeout(() => setToastNotification(null), 4000);
    }
  };

  const handleRejeitar = (id: string) => {
    const chamadoRejeitado = chamados.find(c => c.id === id);
    setChamados(prev => prev.map(c => c.id === id ? { ...c, status: 'EM_EXECUCAO' } : c));
    if (chamadoRejeitado) {
      setToastNotification({
        message: `Comprovação rejeitada: chamado ${chamadoRejeitado.protocolo} retornado para "Em execução".`,
        type: 'amber',
      });
      addNotification({
        titulo: 'Vistoria Devolvida para Reparo',
        mensagem: `OS ${chamadoRejeitado.protocolo} retornou para a equipe de campo devido a inconformidade fotográfica ou checklist pendente.`,
        tipo: 'alerta',
        linkSection: session.role === 'CENTRAL' ? 'app_campo' : undefined,
        protocolo: chamadoRejeitado.protocolo
      });
      setTimeout(() => setToastNotification(null), 4000);
    }
  };

  const handleProtocoloExterno = (id: string) => {
    alert("Protocolo externo (simulado) aberto junto à Prefeitura/Estado com sucesso. O chamado sairá da fila local.");
    setChamados(prev => prev.map(c => c.id === id ? { ...c, status: 'CONCLUIDO' } : c));
  };

  const handleAgrupar = (ids: string[]) => {
    setChamados(prev => prev.map(c => ids.includes(c.id) ? { ...c, status: 'CONCLUIDO', isAtrasado: false } : c));
    alert("Chamados agrupados e encerrados em lote com sucesso!");
  };

  // Find duplicates logic
  const findDuplicatesFor = (chamado: Chamado) => {
    if (chamado.status === 'CONCLUIDO') return [];
    return chamados.filter(other => 
      other.id !== chamado.id &&
      other.status !== 'CONCLUIDO' &&
      other.categoria === chamado.categoria &&
      getDistance(chamado.lat, chamado.lng, other.lat, other.lng) < DISTANCE_THRESHOLD
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative">
      
      {/* Tab Header - Focado no Gestor da Subprefeitura (Sem redundâncias) */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 flex items-center justify-between shrink-0 overflow-x-auto scrollbar-none gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => onActiveTabChange('COCKPIT')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap min-h-[34px] ${
              activeTab === 'COCKPIT' 
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-semibold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-slate-700" />
            <span>Cockpit de Decisão por Bairros</span>
            <span className="text-[10px] bg-slate-200/70 text-slate-700 px-1.5 py-0.5 rounded font-mono font-medium">
              SUB-VM
            </span>
          </button>

          <button
            onClick={() => onActiveTabChange('KANBAN')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap min-h-[34px] ${
              activeTab === 'KANBAN' 
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-semibold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-slate-700" />
            <span>Triagem Operacional / Kanban</span>
            {filterDistrito !== 'TODOS' && (
              <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-medium">
                {filterDistrito}
              </span>
            )}
          </button>

          <button
            onClick={() => onActiveTabChange('WHATSAPP')}
            className={`px-3 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-all flex items-center gap-2 whitespace-nowrap min-h-[34px] ${
              activeTab === 'WHATSAPP' 
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-semibold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Smartphone className="w-4 h-4 text-emerald-600" />
            <span>Canal WhatsApp Integrado</span>
          </button>
        </div>
        
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={() => setShowPdfReport(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-xs font-medium shadow-xs transition-colors print:hidden whitespace-nowrap min-h-[34px]"
          >
            <FileText className="w-3.5 h-3.5 text-slate-300" />
            <span className="hidden xs:inline sm:inline">Exportar Relatório Oficial (PDF / SEI)</span>
            <span className="xs:hidden sm:hidden">Relatório</span>
          </button>
        </div>
      </div>

      {activeTab === 'WHATSAPP' ? (
        <div className="flex-1 min-h-0 p-6 overflow-hidden">
           <div className="h-full w-full max-w-4xl mx-auto shadow-sm rounded-xl overflow-hidden border border-slate-200">
             <CanalWhatsApp chamados={chamados} setChamados={setChamados} />
           </div>
        </div>
      ) : activeTab === 'COCKPIT' ? (
        <div className="flex-1 min-h-0 overflow-y-auto bg-slate-50">
          <CockpitDecisaoBairros 
            chamados={chamados}
            onFiltrarNoKanban={(distrito) => {
              setFilterDistrito(distrito);
              onActiveTabChange('KANBAN');
            }}
            onExportarRelatorio={() => setShowPdfReport(true)}
          />
        </div>
      ) : (
        <div className="flex-1 min-h-0 flex flex-col overflow-y-auto">

      {/* KPI Header */}
      <div className="p-4 sm:p-6 shrink-0 border-b border-slate-200 bg-white">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
              Visão Executiva & Metas Operacionais
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <LiveIndicator 
              secondsAgo={secondsAgo}
              isUpdating={isUpdating}
              onRefresh={triggerLiveUpdate}
            />
          </div>
        </div>

        {/* Grade de 4 ou 8 KPIs Executivos */}
        <div className="grid grid-flow-col auto-cols-[minmax(170px,1fr)] grid-rows-1 gap-2.5 overflow-x-auto pb-1 scrollbar-none sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4 sm:gap-3.5">
          {/* KPI 1: Backlog Ativo */}
          <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs relative">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Abertos / Andamento</span>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight">
              <AnimatedCounter value={Math.max(0, totalAbertos + deltaAbertos)} />
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-medium text-[11px]">
                {urgentesOuCriticos} urgentes
              </span>
              <span>na fila</span>
            </div>
          </div>

          {/* KPI 2: Concluídos */}
          <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs relative">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Concluídos (Mês)</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight">
              <AnimatedCounter value={totalConcluidos + deltaConcluidos} />
            </p>
            <div className="mt-1 flex items-center gap-1 text-xs text-slate-600 font-medium">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              <span>Taxa Resolução: {taxaResolucao}%</span>
            </div>
          </div>

          {/* KPI 3: SLA Médio */}
          <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs relative">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">SLA Médio por Tipo</span>
              <Activity className="w-4 h-4 text-sky-600" />
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-xs sm:text-sm font-semibold font-mono text-slate-800">
                Árvores: <AnimatedCounter value={slaArvore} suffix="h" />
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-xs sm:text-sm font-semibold font-mono text-slate-800">
                Buracos: <AnimatedCounter value={slaBuraco} suffix="h" />
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500 truncate">
              Meta SP156: 48h / 24h
            </p>
          </div>

          {/* KPI 4: Dentro do Prazo */}
          <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs relative">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Dentro do Prazo</span>
              <ShieldCheck className="w-4 h-4 text-slate-600" />
            </div>
            <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight">
              <AnimatedCounter value={Math.min(100, Math.max(0, pctNoPrazo + deltaPct))} suffix="%" />
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {noPrazo} de {chamados.length} ordens no prazo
            </p>
          </div>

          {/* KPIs Expandidos (Linha 2 - Visão de Inteligência Operacional) */}
          {showExpandedKpis && (
            <>
              {/* KPI 5: Taxa de Resolução Global */}
              <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs relative">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Taxa de Resolução</span>
                  <BarChart3 className="w-4 h-4 text-slate-600" />
                </div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight">
                  <AnimatedCounter value={taxaResolucao} suffix="%" />
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {totalConcluidos} ordens finalizadas
                </p>
              </div>

              {/* KPI 6: Reincidência Territorial */}
              <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs relative">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Reincidência (&lt;150m)</span>
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight">
                  <AnimatedCounter value={pctReincidente} suffix="%" />
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {reincidentes} chamados no mesmo local
                </p>
              </div>

              {/* KPI 7: Conformidade de Evidências */}
              <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs relative">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Conformidade Campo</span>
                  <Camera className="w-4 h-4 text-slate-600" />
                </div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight">
                  <AnimatedCounter value={conformidadeChecklist} suffix="%" />
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Com foto antes/depois & GPS
                </p>
              </div>

              {/* KPI 8: Índice de Eficiência de Zeladoria (IEZ) */}
              <div className="bg-white rounded-lg p-3.5 border border-slate-200 shadow-2xs relative">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Score IEZ Geral</span>
                  <Flame className="w-4 h-4 text-slate-600" />
                </div>
                <p className="text-xl sm:text-2xl font-bold font-mono text-slate-900 tracking-tight">
                  <AnimatedCounter value={indiceEficiencia} suffix="/100" />
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Qualidade, SLA e Resolução
                </p>
              </div>
            </>
          )}
        </div>

        {/* Botão de Toggle para alternar entre 4 ou 8 KPIs */}
        <div className="mt-2.5 flex justify-center">
          <button
            onClick={() => setShowExpandedKpis(!showExpandedKpis)}
            className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 py-0.5 px-2 rounded hover:bg-slate-100 transition-colors"
          >
            {showExpandedKpis ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Ocultar indicadores analíticos adicionais</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Exibir todos os 8 indicadores analíticos de gestão</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
      {/* Barra de Filtros e Busca acima do Kanban */}
      <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 sm:py-3 shrink-0 flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Campo de Busca por Protocolo */}
        <div className="relative flex-1 min-w-[170px] max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input 
            type="text"
            value={searchProtocolo}
            onChange={e => setSearchProtocolo(e.target.value)}
            placeholder="Buscar protocolo..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all min-h-[36px]"
          />
          {searchProtocolo && (
            <button 
              onClick={() => setSearchProtocolo('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded min-h-[28px] min-w-[28px] flex items-center justify-center"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        {/* Filtro por Categoria */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="filter-categoria" className="text-xs font-semibold text-slate-500 hidden sm:flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            Categoria:
          </label>
          <select
            id="filter-categoria"
            value={filterCategoria}
            onChange={e => setFilterCategoria(e.target.value)}
            className="text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer min-h-[36px] max-w-[140px] sm:max-w-none truncate"
          >
            <option value="TODAS">Todas categorias</option>
            <option value="ARVORE_CAIDA">Árvore Caída</option>
            <option value="BUEIRO">Bueiro / Drenagem</option>
            <option value="MORADOR_RUA">Acolhimento Social</option>
            <option value="BARULHO_PSIU">Barulho (PSIU)</option>
            <option value="CALCADA">Calçada Irregular</option>
            <option value="TAPA_BURACO">Tapa-Buraco</option>
            <option value="FISCALIZACAO_POSTURA">Fiscalização de Postura</option>
            <option value="DESFAZIMENTO">Desfazimento</option>
          </select>
        </div>

        {/* Filtro por Prioridade */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="filter-prioridade" className="text-xs font-semibold text-slate-500 hidden sm:block">
            Prioridade:
          </label>
          <select
            id="filter-prioridade"
            value={filterPrioridade}
            onChange={e => setFilterPrioridade(e.target.value)}
            className="text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer min-h-[36px]"
          >
            <option value="TODAS">Prioridade</option>
            <option value="URGENTE">Urgente</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Média</option>
            <option value="BAIXA">Baixa</option>
          </select>
        </div>

        {/* Filtro por Distrito da Subprefeitura */}
        <div className="flex items-center gap-1.5">
          <label htmlFor="filter-distrito" className="text-xs font-semibold text-slate-500 hidden sm:block">
            Distrito:
          </label>
          <select
            id="filter-distrito"
            value={filterDistrito}
            onChange={e => {
              setFilterDistrito(e.target.value);
              setFilterBairro('TODOS');
            }}
            className="text-xs bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer max-w-[150px] sm:max-w-[170px] truncate min-h-[36px]"
          >
            <option value="TODOS">Todos os Distritos</option>
            <option value="Vila Mariana">Distrito Vila Mariana</option>
            <option value="Moema">Distrito Moema</option>
            <option value="Saúde">Distrito Saúde</option>
          </select>
        </div>

        {/* Chips de Acesso Rápido por Bairro */}
        <div className="hidden lg:flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          {(['TODOS', 'Vila Mariana', 'Moema', 'Saúde'] as const).map((dist) => (
            <button
              key={dist}
              type="button"
              onClick={() => {
                setFilterDistrito(dist);
                setFilterBairro('TODOS');
              }}
              className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all ${
                filterDistrito === dist 
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {dist === 'TODOS' ? 'Todos os Bairros' : dist}
            </button>
          ))}
        </div>

        {/* Limpar Filtros */}
        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 min-h-[36px]"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span className="hidden sm:inline">Limpar filtros</span>
          </button>
        )}

        {/* Feedback visual ou Contagem */}
        <div className="ml-auto text-xs font-medium text-slate-500 flex items-center gap-2">
          {toastNotification && (
            <span className={`text-xs px-2.5 py-0.5 rounded-md font-semibold border ${
              toastNotification.type === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {toastNotification.message}
            </span>
          )}
          <span className="hidden sm:inline">Exibindo <strong>{filteredChamados.length}</strong> de {displayChamados.length} chamados</span>
          <span className="sm:hidden font-mono font-bold text-slate-700">{filteredChamados.length}/{displayChamados.length}</span>
        </div>
      </div>

      {/* Mobile Column Quick Selector */}
      <div className="sm:hidden flex items-center gap-1.5 px-3 py-2 bg-slate-100 border-b border-slate-200 overflow-x-auto scrollbar-none shrink-0">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-0.5">
          Coluna:
        </span>
        <button
          onClick={() => setMobileColumnFilter('TODAS')}
          className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
            mobileColumnFilter === 'TODAS'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 border border-slate-200'
          }`}
        >
          Todas ({filteredChamados.length})
        </button>
        {columns.map(col => {
          const count = filteredChamados.filter(c => c.status === col.id).length;
          const isSelected = mobileColumnFilter === col.id;
          return (
            <button
              key={col.id}
              onClick={() => setMobileColumnFilter(col.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200'
              }`}
            >
              <span>{col.title}</span>
              <span className={`text-[10px] px-1.5 rounded-full font-bold ${
                isSelected ? 'bg-blue-800 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Kanban Board */}
      <div className="flex-1 min-h-[28rem] shrink-0 overflow-x-auto p-3 sm:p-6 scrollbar-none">
        <div className="flex gap-4 sm:gap-6 h-full pb-4 snap-x snap-mandatory items-stretch">
          {columns
            .filter(col => mobileColumnFilter === 'TODAS' || mobileColumnFilter === col.id)
            .map(col => {
            const colChamados = filteredChamados.filter(c => c.status === col.id);
            
            return (
              <div 
                key={col.id} 
                className={`${
                  mobileColumnFilter !== 'TODAS' ? 'w-[calc(100vw-24px)]' : 'w-[84vw] max-w-[340px] sm:w-[320px] sm:min-w-[300px] lg:min-w-[320px] lg:flex-1'
                } flex flex-col h-full max-h-full bg-slate-100 rounded-xl border border-slate-200 overflow-hidden shrink-0 snap-center`}
              >
                <div className={`px-4 py-3 border-b flex items-center justify-between ${col.color}`}>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{col.title}</h3>
                    <span className="bg-white/70 text-slate-800 text-xs font-bold px-2 py-0.5 rounded-full shadow-2xs">
                      {colChamados.length}
                    </span>
                  </div>
                  {hasActiveFilters && colChamados.length !== displayChamados.filter(c => c.status === col.id).length && (
                    <span className="text-[11px] text-slate-500 font-medium">
                      de {displayChamados.filter(c => c.status === col.id).length}
                    </span>
                  )}
                </div>
                
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                  {colChamados.map(chamado => {
                    const isForaAlcada = ['TAPA_BURACO', 'RECAPEAMENTO', 'SABESP'].includes(chamado.categoria);
                    const isPendente2Dias = col.id === 'AGUARDANDO_APROVACAO' && (new Date().getTime() - new Date(chamado.dataAbertura).getTime() > 48 * 60 * 60 * 1000);
                    const duplicates = col.id !== 'CONCLUIDO' ? findDuplicatesFor(chamado) : [];
                    
                    const category = CATEGORY_CONFIG[chamado.categoria] || {
                      label: chamado.categoria.replace(/_/g, ' '),
                      icon: AlertTriangle,
                      bgLight: 'bg-slate-100',
                      textColor: 'text-slate-700',
                      borderColor: 'border-slate-200',
                    };
                    const CategoryIcon = category.icon;
                    const priority = PRIORITY_CONFIG[chamado.prioridade] || {
                      label: chamado.prioridade,
                      badgeStyle: 'bg-slate-100 text-slate-700 border-slate-200',
                    };
                    const subNome = subprefeituras.find(s => s.id === chamado.subprefeituraId)?.nome || 'Subprefeitura';
                    const tempoAberto = formatTempoAberto(chamado.dataAbertura);
                    const sla = getSlaProgress(chamado);

                    // Miniatura da foto Depois:
                    const deveExibirEvidencias = col.id === 'AGUARDANDO_APROVACAO' || col.id === 'CONCLUIDO';
                    const fotoDepoisUrl = chamado.fotoDepois || (deveExibirEvidencias ? FOTO_EVIDENCIA_DEPOIS : undefined);

                    return (
                      <div
                        key={chamado.id}
                        onClick={(event) => {
                          if ((event.target as HTMLElement).closest('button, [data-prevent-card-modal]')) return;
                          setSelectedKanbanChamadoId(chamado.id);
                        }}
                        className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-xl p-3.5 shadow-xs hover:shadow-md transition-all flex flex-col gap-2.5 relative group/card cursor-pointer"
                      >
                        {/* Linha Superior: Ícone da Categoria + Título + Protocolo e Selo de Prioridade */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${category.borderColor} ${category.bgLight} ${category.textColor} shadow-xs`}>
                              <CategoryIcon size={16} />
                            </div>
                            <div className="min-w-0">
                              <h4 className="text-sm font-bold text-slate-900 leading-tight truncate" title={category.label}>
                                {category.label}
                              </h4>
                              <span className="text-[11px] font-mono font-medium text-slate-500">
                                {chamado.protocolo}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${priority.badgeStyle}`}>
                              {priority.label}
                            </span>
                            {chamado.isAtrasado && col.id !== 'CONCLUIDO' && (
                              <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                Atrasado
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={() => setSelectedKanbanChamadoId(chamado.id)}
                              className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              aria-label={`Abrir detalhes do chamado ${chamado.protocolo}`}
                              title="Abrir detalhes"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Linha Intermediária: Bairro / Distrito e Contador de Tempo Aberto */}
                        <div className="flex flex-col gap-0.5 pt-1 border-t border-slate-100">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-1.5 text-slate-800 font-bold truncate max-w-[65%]" title={chamado.bairro ? `${chamado.bairro} (${chamado.distrito})` : subNome}>
                              <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                              <span className="truncate">{chamado.bairro ? `${chamado.bairro} • ${chamado.distrito}` : subNome}</span>
                            </span>
                            <span className="flex items-center gap-1 text-slate-500 font-medium shrink-0" title={`Aberto em ${new Date(chamado.dataAbertura).toLocaleDateString('pt-BR')}`}>
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              <span>{tempoAberto}</span>
                            </span>
                          </div>
                          {chamado.endereco && (
                            <span className="text-[11px] text-slate-500 truncate pl-5" title={chamado.endereco}>
                              {chamado.endereco}
                            </span>
                          )}
                        </div>

                        {/* Miniatura da Foto "Depois" anexada (quando houver) */}
                        {fotoDepoisUrl && (
                          <div className="flex flex-col gap-2 pt-0.5">
                            <div
                              data-prevent-card-modal
                              role="button"
                              tabIndex={0}
                              aria-label={`Ampliar foto depois do chamado ${chamado.protocolo}`}
                              onClick={() => setPreviewPhoto({ url: fotoDepoisUrl, etapa: 'DEPOIS' })}
                              onKeyDown={(event) => {
                                if (event.key === 'Enter' || event.key === ' ') {
                                  event.preventDefault();
                                  setPreviewPhoto({ url: fotoDepoisUrl, etapa: 'DEPOIS' });
                                }
                              }}
                              className="w-full h-24 rounded-lg overflow-hidden relative border border-slate-200 cursor-pointer group/thumb shadow-inner bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              title="Clique para ampliar a foto comprobatória"
                            >
                              <img 
                                src={fotoDepoisUrl} 
                                alt={`Comprovação do chamado ${chamado.protocolo}`}
                                className="w-full h-full object-cover group-hover/thumb:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-black/10 group-hover/thumb:bg-black/30 transition-colors flex items-center justify-center">
                                <div className="opacity-0 group-hover/thumb:opacity-100 transition-opacity bg-slate-900/80 text-white text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1.5 font-medium shadow-sm">
                                  <Eye className="w-3.5 h-3.5" /> Ampliar foto
                                </div>
                              </div>
                              <span className="absolute bottom-1.5 left-1.5 bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                                <Camera className="w-3 h-3 text-emerald-400" /> Foto Depois {!chamado.fotoDepois && '• Demo'}
                              </span>
                            </div>

                            {/* Ações rápidas diretamente no card na etapa AGUARDANDO_APROVACAO */}
                            {col.id === 'AGUARDANDO_APROVACAO' && (
                              <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                                <button 
                                  onClick={() => handleRejeitar(chamado.id)}
                                  className="w-full sm:flex-1 bg-white hover:bg-rose-50 active:bg-rose-100 text-rose-700 hover:text-rose-800 border border-rose-200 text-xs font-semibold py-2 px-2.5 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                                  title="Rejeitar comprovação e retornar para Em Execução"
                                >
                                  <XCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                  Rejeitar
                                </button>
                                <button 
                                  onClick={() => handleAprovar(chamado.id)}
                                  className="w-full sm:flex-1 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-semibold py-2 px-2.5 rounded-lg shadow-2xs transition-colors flex items-center justify-center gap-1.5"
                                  title="Aprovar encerramento e notificar munícipe no WhatsApp"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                                  Aprovar
                                </button>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Regra de Lembrete 48h */}
                        {isPendente2Dias && (
                          <div className="bg-red-50 border border-red-200 p-2.5 rounded-lg flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-red-700">
                              <Clock className="w-3.5 h-3.5" />
                              Pendente há mais de 48h
                            </div>
                            <p className="text-[10px] text-red-600 leading-tight">Lembrete automático enviado no chat de IA para a equipe responsável.</p>
                          </div>
                        )}

                        {/* Regra de Fora da Alçada */}
                        {session.role !== 'CENTRAL' && isForaAlcada && col.id !== 'CONCLUIDO' && (
                          <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg flex flex-col gap-2">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                              Fora da alçada municipal local
                            </div>
                            <button 
                              onClick={() => handleProtocoloExterno(chamado.id)}
                              className="text-xs w-full bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium py-1.5 rounded-md flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Encaminhar à PMSP/Estado
                            </button>
                          </div>
                        )}

                        {/* Regra de Duplicidade */}
                        {session.role !== 'CENTRAL' && duplicates.length > 0 && (
                          <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-lg flex flex-col gap-2">
                            <p className="text-[11px] font-medium text-amber-800 leading-tight">
                              Possível duplicidade identificada: {duplicates.length} ocorrência(s) próxima(s) (100m).
                            </p>
                            <button 
                              onClick={() => handleAgrupar([chamado.id, ...duplicates.map(d => d.id)])}
                              className="text-xs w-full bg-amber-500 hover:bg-amber-600 text-white font-medium py-1.5 rounded-md transition-colors"
                            >
                              Agrupar e encerrar em lote
                            </button>
                          </div>
                        )}

                        {/* Barra de Progresso Fina no Rodapé (Tempo Consumido do SLA) */}
                        <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5 mt-auto">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-slate-500 font-medium">
                              SLA: <strong className="text-slate-700 font-semibold">{sla.slaHoras}h</strong>
                            </span>
                            <span className={sla.textColor}>
                              {sla.statusText}
                            </span>
                          </div>
                          {/* Barra de progresso fina */}
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${sla.barColor}`}
                              style={{ width: `${sla.barWidth}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
      </div>
      )}

      
      {/* Modal de detalhes do cartão do Kanban */}
      {selectedKanbanChamado && (() => {
        const category = CATEGORY_CONFIG[selectedKanbanChamado.categoria] || CATEGORY_CONFIG.ARVORE_CAIDA;
        const CategoryIcon = category.icon;
        const priority = PRIORITY_CONFIG[selectedKanbanChamado.prioridade] || PRIORITY_CONFIG.MEDIA;
        const status = columns.find((column) => column.id === selectedKanbanChamado.status);
        const sla = getSlaProgress(selectedKanbanChamado);
        const subNome = subprefeituras.find((sub) => sub.id === selectedKanbanChamado.subprefeituraId)?.nome || 'Vila Mariana';
        const deveExibirEvidencias = selectedKanbanChamado.status === 'AGUARDANDO_APROVACAO' || selectedKanbanChamado.status === 'CONCLUIDO';
        const fotoAntesUrl = selectedKanbanChamado.fotoAntes || (deveExibirEvidencias ? FOTO_EVIDENCIA_ANTES : undefined);
        const fotoDepoisUrl = selectedKanbanChamado.fotoDepois || (deveExibirEvidencias ? FOTO_EVIDENCIA_DEPOIS : undefined);

        return (
          <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-sm sm:p-6"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedKanbanChamadoId(null);
            }}
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="kanban-task-modal-title"
              className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4 border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
                <div className="flex min-w-0 items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${category.borderColor} ${category.bgLight} ${category.textColor}`}>
                    <CategoryIcon size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-mono text-xs font-semibold text-slate-500">{selectedKanbanChamado.protocolo}</p>
                    <h2 id="kanban-task-modal-title" className="truncate text-lg font-bold text-slate-950">
                      {category.label}
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  autoFocus
                  onClick={() => setSelectedKanbanChamadoId(null)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Fechar detalhes do chamado"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="overflow-y-auto p-4 sm:p-6">
                <div className="mb-5 flex flex-wrap items-center gap-2">
                  <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${status?.color || 'border-slate-200 bg-slate-100 text-slate-700'}`}>
                    {status?.title || selectedKanbanChamado.status.replace(/_/g, ' ')}
                  </span>
                  <span className={`rounded-full border px-2.5 py-1 text-xs ${priority.badgeStyle}`}>
                    {priority.label}
                  </span>
                  {selectedKanbanChamado.isAtrasado && selectedKanbanChamado.status !== 'CONCLUIDO' && (
                    <span className="rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
                      SLA atrasado
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <section className="rounded-lg border border-slate-200 p-4 sm:col-span-2">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Localização</h3>
                    <p className="flex items-start gap-2 text-sm font-semibold text-slate-900">
                      <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" />
                      <span>{selectedKanbanChamado.endereco || 'Endereço não informado'}</span>
                    </p>
                    <p className="mt-2 pl-6 text-xs text-slate-500">
                      {selectedKanbanChamado.bairro || 'Bairro não informado'} • {selectedKanbanChamado.distrito || subNome}
                    </p>
                  </section>

                  <section className="rounded-lg border border-slate-200 p-4">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Abertura</h3>
                    <p className="text-sm font-semibold text-slate-900">
                      {new Date(selectedKanbanChamado.dataAbertura).toLocaleString('pt-BR')}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">Origem: {(selectedKanbanChamado.origem || 'SP156_WEB').replace(/_/g, ' ')}</p>
                  </section>

                  <section className="rounded-lg border border-slate-200 p-4">
                    <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500">Prazo operacional</h3>
                    <div className="flex items-center justify-between gap-3 text-sm">
                      <span className="font-semibold text-slate-900">SLA: {sla.slaHoras}h</span>
                      <span className={sla.textColor}>{sla.statusText}</span>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${sla.barColor}`} style={{ width: `${sla.barWidth}%` }} />
                    </div>
                  </section>

                  <section className="rounded-lg border border-slate-200 p-4 sm:col-span-2">
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">Referência territorial</h3>
                    <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                      <div>
                        <span className="block text-xs text-slate-500">Subprefeitura</span>
                        <strong className="text-slate-900">{subNome}</strong>
                      </div>
                      <div>
                        <span className="block text-xs text-slate-500">Distrito</span>
                        <strong className="text-slate-900">{selectedKanbanChamado.distrito || 'Não informado'}</strong>
                      </div>
                      <div>
                        <span className="block text-xs text-slate-500">Coordenadas</span>
                        <strong className="font-mono text-xs text-slate-900">
                          {selectedKanbanChamado.lat.toFixed(5)}, {selectedKanbanChamado.lng.toFixed(5)}
                        </strong>
                      </div>
                    </div>
                  </section>

                  {(fotoAntesUrl || fotoDepoisUrl) && (
                    <section className="rounded-lg border border-slate-200 p-4 sm:col-span-2">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Evidências de campo</h3>
                        {(!selectedKanbanChamado.fotoAntes || !selectedKanbanChamado.fotoDepois) && deveExibirEvidencias && (
                          <span className="text-[10px] font-medium text-slate-400">Imagens demonstrativas</span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {fotoAntesUrl && (
                          <button
                            type="button"
                            onClick={() => setPreviewPhoto({ url: fotoAntesUrl, etapa: 'ANTES' })}
                            className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 text-left transition-colors hover:border-slate-400"
                          >
                            <img
                              src={fotoAntesUrl}
                              alt={`Foto antes da execução do chamado ${selectedKanbanChamado.protocolo}`}
                              className="h-44 w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <span className="block border-t border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">ANTES</span>
                          </button>
                        )}
                        {fotoDepoisUrl && (
                          <button
                            type="button"
                            onClick={() => setPreviewPhoto({ url: fotoDepoisUrl, etapa: 'DEPOIS' })}
                            className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 text-left transition-colors hover:border-slate-400"
                          >
                            <img
                              src={fotoDepoisUrl}
                              alt={`Foto depois da execução do chamado ${selectedKanbanChamado.protocolo}`}
                              className="h-44 w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <span className="block border-t border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">DEPOIS</span>
                          </button>
                        )}
                      </div>
                    </section>
                  )}
                </div>
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={() => setSelectedKanbanChamadoId(null)}
                  className="min-h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                >
                  Fechar
                </button>
                {selectedKanbanChamado.status === 'AGUARDANDO_APROVACAO' && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        handleRejeitar(selectedKanbanChamado.id);
                        setSelectedKanbanChamadoId(null);
                      }}
                      className="min-h-10 rounded-lg border border-rose-200 bg-white px-4 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50"
                    >
                      Rejeitar vistoria
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        handleAprovar(selectedKanbanChamado.id);
                        setSelectedKanbanChamadoId(null);
                      }}
                      className="min-h-10 rounded-lg bg-emerald-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-emerald-800"
                    >
                      Aprovar e concluir
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* PDF Report Modal */}
      {showPdfReport && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-8 overflow-y-auto print:p-0 print:bg-white print:block">
          <div className="bg-white w-full max-w-4xl min-h-[800px] shadow-2xl rounded-xl relative flex flex-col print:shadow-none print:rounded-none print:w-full print:max-w-none print:border-none my-auto">
            {/* Action Bar (hidden in print) */}
            <div className="bg-slate-100 border-b border-slate-200 p-4 flex items-center justify-between rounded-t-xl print:hidden sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-slate-600" />
                <h3 className="font-bold text-slate-800">Visualização de Impressão (PDF)</h3>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition-colors shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir / Salvar PDF
                </button>
                <button 
                  onClick={() => setShowPdfReport(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Document Content (A4 style) */}
            <div className="p-10 sm:p-14 flex-1 bg-white" id="pdf-content">
              {/* Header Oficial PMSP / SMSUB / SUB-VM */}
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-6 mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 border border-slate-200 rounded-xl bg-slate-50">
                    <BrasaoSaoPaulo size={56} />
                  </div>
                  <div>
                    <span className="text-[11px] font-extrabold tracking-widest text-slate-500 uppercase block">
                      Prefeitura da Cidade de São Paulo
                    </span>
                    <span className="text-xs font-bold text-slate-700 uppercase block">
                      Secretaria Municipal das Subprefeituras — SMSUB
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight mt-0.5">
                      Subprefeitura Vila Mariana
                    </h1>
                    <p className="text-[11px] font-medium text-slate-500">
                      Supervisão Técnica de Limpeza e Obras • SUB-VM
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block bg-[#0A192F] text-amber-300 font-bold px-3 py-1 rounded text-xs mb-1 border border-amber-500/40">
                    RELATÓRIO OFICIAL SP156
                  </div>
                  <p className="text-xs font-semibold text-slate-700">
                    Jurisdição: Subprefeitura Vila Mariana • Vila Mariana, Moema e Saúde
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Emissão: {new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR')}
                  </p>
                </div>
              </div>

              {/* Faixa Institucional de Jurisdição */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-6 flex flex-wrap items-center justify-between text-xs text-slate-600">
                <div>
                  <strong className="text-slate-900">Distritos Abrangidos:</strong> Vila Mariana • Moema • Saúde
                </div>
                <div>
                  <strong className="text-slate-900">Sede Administrativa:</strong> Rua José de Magalhães, 500
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-xl">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total de Ocorrências</p>
                  <p className="text-3xl font-black text-slate-900">{displayChamados.length}</p>
                  <p className="text-[10px] text-slate-400 mt-1">Ordens de Serviço ativas</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-xl">
                  <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Dentro do Prazo</p>
                  <p className="text-3xl font-black text-emerald-800">{Math.round((displayChamados.filter(c => !c.isAtrasado).length / (displayChamados.length || 1)) * 100)}%</p>
                  <p className="text-[10px] text-emerald-600 mt-1">Conformidade com SLA da Carta de Serviços</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl">
                  <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-1">Tempo Médio Resolu.</p>
                  <p className="text-3xl font-black text-blue-800">3.2<span className="text-lg font-bold ml-1">dias</span></p>
                  <p className="text-[10px] text-blue-600 mt-1">Ciclo total abertura-baixa</p>
                </div>
              </div>

              {/* Breakdown */}
              <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2 mb-6 uppercase tracking-wider">Detalhamento por Status</h3>
              <div className="space-y-4 mb-12">
                {columns.map(col => {
                  const count = displayChamados.filter(c => c.status === col.id).length;
                  const pct = Math.round((count / (displayChamados.length || 1)) * 100);
                  return (
                    <div key={col.id} className="flex items-center gap-4">
                      <div className="w-48 font-semibold text-slate-700 text-sm">{col.title}</div>
                      <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-800 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="w-16 text-right font-bold text-slate-900">{count}</div>
                    </div>
                  );
                })}
              </div>

              {/* Bloco de Assinaturas Institucionais */}
              <div className="grid grid-cols-2 gap-8 my-8 pt-6 border-t border-slate-200">
                <div className="text-center">
                  <div className="w-48 h-px bg-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800 uppercase">Subprefeito(a) Regional</p>
                  <p className="text-[11px] text-slate-500">Subprefeitura Vila Mariana • SUB-VM</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Assinado digitalmente via SEI-PMSP</p>
                </div>
                <div className="text-center">
                  <div className="w-48 h-px bg-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800 uppercase">Supervisão Técnica de Obras e Limpeza</p>
                  <p className="text-[11px] text-slate-500">Coordenadoria de Manutenção Urbana</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">Certificado ICP-Brasil PMSP</p>
                </div>
              </div>

              {/* Footer Note Institucional */}
              <div className="mt-auto pt-6 border-t border-slate-200 text-center space-y-1">
                <p className="text-xs font-medium text-slate-500">
                  Prefeitura da Cidade de São Paulo • Secretaria Municipal das Subprefeituras • Subprefeitura Vila Mariana
                </p>
                <p className="text-[11px] text-slate-400 font-mono">
                  Validação de Autenticidade PMSP-SEI: SHA256-VM-{Math.random().toString(36).substring(2, 10).toUpperCase()} • Canal SP156 Integrado
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* WhatsApp Preview Overlay */}
      {whatsappPreview && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm bg-[#efeae2] rounded-[24px] overflow-hidden shadow-2xl relative border-8 border-slate-800 animate-in zoom-in-95 duration-200">
            {/* iOS Status Bar Mock */}
            <div className="bg-[#00a884] h-6 w-full absolute top-0 left-0 z-10 flex justify-center">
              <div className="w-32 h-4 bg-slate-800 rounded-b-xl"></div>
            </div>

            {/* WhatsApp Header */}
            <div className="bg-[#00a884] text-white px-4 pb-3 pt-8 flex items-center gap-3 relative z-0">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-[15px] leading-tight flex items-center gap-1">
                  Prefeitura SP - 156
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-200 fill-blue-500" />
                </h4>
                <p className="text-[11px] text-white/80">Conta comercial oficial</p>
              </div>
              <button onClick={() => setWhatsappPreview(null)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* WhatsApp Body */}
            <div className="p-4 space-y-3 min-h-[400px] flex flex-col bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-contain">
              {/* Message Bubble */}
              <div className="bg-white rounded-2xl rounded-tl-none p-2 shadow-sm max-w-[92%] relative">
                <div className="w-full h-36 bg-slate-200 rounded-xl mb-2 overflow-hidden relative border border-slate-100">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=400&h=300')] bg-cover bg-center opacity-90 mix-blend-multiply" />
                  <div className="absolute bottom-1 right-1 bg-black/60 text-white text-[8px] px-1 py-0.5 rounded backdrop-blur-sm">
                    {new Date().toLocaleDateString('pt-BR')} {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div className="px-1 pb-4">
                  <p className="text-[13.5px] text-slate-800 leading-snug">
                    🟢 *ORDEM DE SERVIÇO CONCLUÍDA*<br/><br/>
                    *Protocolo:* {whatsappPreview.protocolo}<br/>
                    *Tipo:* {whatsappPreview.categoria.replace('_', ' ')}<br/><br/>
                    Olá! Seu chamado aberto no portal 156 foi finalizado com sucesso pelas nossas equipes na região de *{subprefeituras.find(s => s.id === whatsappPreview.subprefeituraId)?.nome}*.<br/><br/>
                    Confira a foto de comprovação do local acima. Como você avalia o serviço executado?
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 absolute bottom-1.5 right-2.5 flex items-center gap-1">
                  {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  <Check className="w-3.5 h-3.5 text-blue-500" />
                </span>
              </div>

              {/* Action Buttons (Simulated WhatsApp Interactive Buttons) */}
              <div className="flex gap-2 w-[92%]">
                <button className="flex-1 bg-white text-[#00a884] font-semibold text-[13px] py-2.5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center gap-1.5 active:bg-slate-50 transition-colors">
                  <Star className="w-4 h-4 fill-current" /> Avaliar
                </button>
                <button className="flex-1 bg-white text-[#00a884] font-semibold text-[13px] py-2.5 rounded-xl shadow-sm border border-slate-100 active:bg-slate-50 transition-colors">
                  Novo Chamado
                </button>
              </div>

              <div className="mt-auto pt-4 text-center">
                <span className="bg-[#e1f3fb] text-slate-600 text-[11px] px-3 py-1 rounded-full shadow-sm border border-slate-200/50 font-medium">
                  Pré-visualização do disparo (Mock)
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox das evidências fotográficas ANTES/DEPOIS */}
      {previewPhoto && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/70 p-4 backdrop-blur-xs"
          onClick={() => setPreviewPhoto(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Foto ${previewPhoto.etapa.toLowerCase()} da execução`}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl bg-white p-4 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                <Camera className="h-4 w-4 text-emerald-600" />
                Comprovação fotográfica — {previewPhoto.etapa}
              </h4>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                aria-label="Fechar foto ampliada"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex max-h-[65vh] items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
              <img
                src={previewPhoto.url}
                alt={`Foto ${previewPhoto.etapa.toLowerCase()} da execução`}
                className="h-auto max-h-[65vh] w-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="mt-3 flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-600">
              <span>Evidência da etapa {previewPhoto.etapa}</span>
              <span className="flex items-center gap-1 font-semibold text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" /> Registrada no chamado
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
