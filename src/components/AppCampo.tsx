import React, { useState, useMemo } from 'react';
import { Chamado, CategoriaChamado, PrioridadeChamado } from '../types';
import { UserSession } from '../LoginTypes';
import { 
  WifiOff, 
  Camera, 
  CheckCircle2, 
  ChevronLeft, 
  MapPin, 
  User, 
  ShieldAlert, 
  TreeDeciduous, 
  Droplets, 
  Megaphone, 
  Hammer, 
  Truck, 
  AlertTriangle, 
  Clock, 
  Navigation, 
  AlertCircle,
  XCircle,
  ArrowRight,
  HelpCircle,
  Smartphone,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { subprefeituras } from '../data';
import BrasaoSaoPaulo from './BrasaoSaoPaulo';
import { useApp } from '../context/AppContext';

interface AppCampoProps {
  chamados: Chamado[];
  setChamados: React.Dispatch<React.SetStateAction<Chamado[]>>;
  onNavigateToTriagem?: () => void;
}

// Configuração visual idêntica à Sala de Situação e Kanban do Painel Administrativo
const CATEGORIA_CONFIG: Record<CategoriaChamado, {
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

// Selos de Prioridade com as cores do kanban
const PRIORITY_CONFIG: Record<PrioridadeChamado, {
  label: string;
  badgeStyle: string;
  weight: number;
}> = {
  URGENTE: {
    label: 'Urgente',
    badgeStyle: 'bg-red-50 text-red-700 border-red-200 font-bold',
    weight: 4,
  },
  ALTA: {
    label: 'Alta',
    badgeStyle: 'bg-amber-50 text-amber-700 border-amber-200 font-bold',
    weight: 3,
  },
  MEDIA: {
    label: 'Média',
    badgeStyle: 'bg-blue-50 text-blue-700 border-blue-200 font-semibold',
    weight: 2,
  },
  BAIXA: {
    label: 'Baixa',
    badgeStyle: 'bg-slate-100 text-slate-600 border-slate-200 font-medium',
    weight: 1,
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

const FOTO_CAMPO_ANTES = 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=800&h=600';
const FOTO_CAMPO_DEPOIS = 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=800&h=600';

// Helper de cálculo de SLA unificado com Kanban
function getSlaInfo(chamado: Chamado) {
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
    textColor = 'text-red-700 font-bold';
    statusText = `SLA Estourado (${pctConsumido}%)`;
  } else if (pctConsumido > 70) {
    barColor = 'bg-amber-500';
    textColor = 'text-amber-700 font-semibold';
    statusText = `${pctConsumido}% do prazo`;
  }

  const barWidth = Math.min(100, Math.max(5, pctConsumido));

  return {
    slaHoras,
    pctConsumido,
    barColor,
    textColor,
    statusText,
    barWidth,
  };
}

// Checklist específico por categoria operacional
interface ChecklistPergunta {
  id: string;
  pergunta: string;
}

const CHECKLIST_CATEGORIAS: Record<CategoriaChamado, ChecklistPergunta[]> = {
  ARVORE_CAIDA: [
    { id: 'via_livre', pergunta: 'Via e calçada totalmente desobstruídas para pedestres e veículos?' },
    { id: 'risco_eliminado', pergunta: 'Risco de fiação rompida ou nova queda iminente eliminado?' },
  ],
  BUEIRO: [
    { id: 'desobstruido', pergunta: 'Grade e poço de visita totalmente limpos e desobstruídos?' },
    { id: 'risco_alagamento', pergunta: 'Risco de alagamento imediato da via eliminado?' },
  ],
  TAPA_BURACO: [
    { id: 'nivelamento', pergunta: 'Massa asfáltica compactada, selada e nivelada com a via?' },
    { id: 'risco_acidente', pergunta: 'Risco de danos a veículos e pedestres eliminado?' },
  ],
  MORADOR_RUA: [
    { id: 'escuta_feita', pergunta: 'Abordagem social humanizada e escuta técnica realizadas?' },
    { id: 'risco_atendido', pergunta: 'Encaminhamento para acolhimento ou registro formal concluído?' },
  ],
  BARULHO_PSIU: [
    { id: 'medicao_aferida', pergunta: 'Medição decibélica realizada e termo fiscal preenchido?' },
    { id: 'cessacao_ruido', pergunta: 'Risco de continuidade da infração sonora eliminado/notificado?' },
  ],
  CALCADA: [
    { id: 'reparo_feito', pergunta: 'Reparo de nivelamento concluído com pavimento uniforme?' },
    { id: 'acessibilidade_livre', pergunta: 'Risco de tropeço e obstáculos de acessibilidade eliminados?' },
  ],
  FISCALIZACAO_POSTURA: [
    { id: 'inspecao_concluida', pergunta: 'Auto de vistoria e notificação fiscal emitidos no local?' },
    { id: 'irregularidade_sanada', pergunta: 'Situação de risco ou irregularidade em área pública sanada?' },
  ],
  DESFAZIMENTO: [
    { id: 'recolhimento_feito', pergunta: 'Todo o material inservível/entulho recolhido e carregado?' },
    { id: 'area_limpa', pergunta: 'Área pública totalmente higienizada sem risco de reincidência?' },
  ],
};

// Cálculo de proximidade fictícia baseada em coordenadas
function getDistanciaFicticiaKm(c: Chamado): number {
  const dLat = (c.lat - (-23.5505)) * 110.57;
  const dLng = (c.lng - (-46.6333)) * 102.18;
  const dist = Math.sqrt(dLat * dLat + dLng * dLng);
  return Number(Math.max(0.3, dist).toFixed(1));
}

export default function AppCampo({ chamados, setChamados, session, onNavigateToTriagem }: AppCampoProps & { session: UserSession }) {
  const { addNotification } = useApp();
  const [isLoggedIn, setIsLoggedIn] = useState(!!session?.matricula);
  const [funcionario, setFuncionario] = useState({ 
    nome: session?.matricula ? `Técnico Operacional` : '', 
    matricula: session?.matricula || '' 
  });
  
  const [selectedChamadoId, setSelectedChamadoId] = useState<string | null>(null);
  const [fotoAntes, setFotoAntes] = useState(false);
  const [fotoDepois, setFotoDepois] = useState(false);
  const [modoVisualizacao, setModoVisualizacao] = useState<'MOLDURA' | 'TELA_CHEIA'>('MOLDURA');
  
  // Checklist de respostas (Sim/Não) para a OS ativa
  const [checklistRespostas, setChecklistRespostas] = useState<Record<string, 'SIM' | 'NAO' | undefined>>({});
  const [escaladoSuccess, setEscaladoSuccess] = useState(false);

  // Ordens do Dia: Ordenadas estritamente por PRIORIDADE (Urgente primeiro) e proximidade como desempate
  const minhasOS = useMemo(() => {
    let list = chamados.filter(c => ['ENCAMINHADO', 'EM_EXECUCAO', 'EM_ANDAMENTO'].includes(c.status));
    if (list.length === 0) {
      list = chamados.filter(c => c.status !== 'CONCLUIDO' && c.status !== 'AGUARDANDO_APROVACAO');
    }

    return [...list].sort((a, b) => {
      const pA = PRIORITY_CONFIG[a.prioridade]?.weight || 0;
      const pB = PRIORITY_CONFIG[b.prioridade]?.weight || 0;
      if (pB !== pA) {
        return pB - pA; // Mais urgente sempre no topo
      }
      return getDistanciaFicticiaKm(a) - getDistanciaFicticiaKm(b); // Mais próximo primeiro
    }).slice(0, 10);
  }, [chamados]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (funcionario.nome && funcionario.matricula) {
      setIsLoggedIn(true);
    }
  };

  const selectedChamado = useMemo(() => 
    chamados.find(c => c.id === selectedChamadoId),
    [chamados, selectedChamadoId]
  );

  const selectedSub = useMemo(() => 
    selectedChamado ? subprefeituras.find(s => s.id === selectedChamado.subprefeituraId) : null,
    [selectedChamado]
  );

  const categoriaCfg = selectedChamado 
    ? CATEGORIA_CONFIG[selectedChamado.categoria] || CATEGORIA_CONFIG.ARVORE_CAIDA
    : null;

  const priorityCfg = selectedChamado 
    ? PRIORITY_CONFIG[selectedChamado.prioridade] || PRIORITY_CONFIG.MEDIA
    : null;

  const slaInfo = selectedChamado ? getSlaInfo(selectedChamado) : null;
  const distanciaKm = selectedChamado ? getDistanciaFicticiaKm(selectedChamado) : null;

  // Perguntas do checklist para a categoria selecionada
  const perguntasChecklist = selectedChamado 
    ? CHECKLIST_CATEGORIAS[selectedChamado.categoria] || CHECKLIST_CATEGORIAS.ARVORE_CAIDA
    : [];

  // Verificação de risco não resolvido
  const hasRiscoNaoResolvido = useMemo(() => {
    return perguntasChecklist.some(p => checklistRespostas[p.id] === 'NAO');
  }, [perguntasChecklist, checklistRespostas]);

  // Verificação se todas foram respondidas como SIM
  const isChecklistCompleto = useMemo(() => {
    if (perguntasChecklist.length === 0) return true;
    return perguntasChecklist.every(p => checklistRespostas[p.id] === 'SIM');
  }, [perguntasChecklist, checklistRespostas]);

  // Finalização do chamado com status AGUARDANDO_APROVACAO
  const handleFinalizar = () => {
    if (!selectedChamadoId || hasRiscoNaoResolvido || !isChecklistCompleto || !fotoAntes || !fotoDepois) {
      return;
    }

    const chamadoFinalizado = chamados.find(c => c.id === selectedChamadoId);

    setChamados(prev => prev.map(c => 
      c.id === selectedChamadoId
        ? {
            ...c,
            status: 'AGUARDANDO_APROVACAO',
            fotoAntes: FOTO_CAMPO_ANTES,
            fotoDepois: FOTO_CAMPO_DEPOIS,
          }
        : c
    ));

    if (chamadoFinalizado) {
      const canAccessTriagem = session.role === 'CENTRAL' || session.role === 'GESTOR';

      addNotification({
        titulo: 'Vistoria Concluída no App de Campo',
        mensagem: `OS ${chamadoFinalizado.protocolo} enviada para "Aguardando Aprovação" com fotos antes/depois e checklist 100% conforme.`,
        tipo: 'sucesso',
        linkSection: canAccessTriagem ? 'painel_admin' : undefined,
        linkAdminTab: canAccessTriagem ? 'KANBAN' : undefined,
        protocolo: chamadoFinalizado.protocolo
      });

      if (canAccessTriagem) {
        onNavigateToTriagem?.();
      }
    }

    setSelectedChamadoId(null);
    setFotoAntes(false);
    setFotoDepois(false);
    setChecklistRespostas({});
  };

  // Escalar para Supervisão caso o risco não tenha sido resolvido
  const handleEscalarSupervisao = () => {
    if (selectedChamadoId) {
      const chamadoEscalado = chamados.find(c => c.id === selectedChamadoId);

      setChamados(prev => prev.map(c => 
        c.id === selectedChamadoId 
          ? { 
              ...c, 
              prioridade: 'URGENTE',
              isAtrasado: true,
            } 
          : c
      ));

      if (chamadoEscalado) {
        addNotification({
          titulo: 'Alerta Operacional: OS Escalada para Supervisão',
          mensagem: `OS ${chamadoEscalado.protocolo} marcou risco ativo não resolvido no checklist. Reclassificada como URGENTE.`,
          tipo: 'urgente',
          linkSection: session.role === 'CENTRAL' || session.role === 'GESTOR' ? 'painel_admin' : undefined,
          linkAdminTab: session.role === 'CENTRAL' || session.role === 'GESTOR' ? 'KANBAN' : undefined,
          protocolo: chamadoEscalado.protocolo
        });
      }

      setEscaladoSuccess(true);
      setTimeout(() => {
        setEscaladoSuccess(false);
        setSelectedChamadoId(null);
        setFotoAntes(false);
        setFotoDepois(false);
        setChecklistRespostas({});
      }, 1500);
    }
  };

  const renderWatermark = (chamado: Chamado) => (
    <div className="absolute bottom-2 left-2 right-2 bg-black/75 backdrop-blur-xs p-2 rounded text-[10px] font-mono text-emerald-400 leading-tight border border-emerald-500/20">
      <p>LAT: {chamado.lat.toFixed(6)} • LNG: {chamado.lng.toFixed(6)}</p>
      <p>DATA: {new Date().toLocaleString('pt-BR')}</p>
      <p>OS: {chamado.protocolo} • OP: {funcionario.matricula || '123456-7'}</p>
      <p className="text-white/80">GEORREFERENCIADO PREFEITURA DE SP</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col items-center justify-start p-2 sm:p-6 bg-slate-200/80 overflow-y-auto min-h-full">
      {/* Barra Superior de Alternância de Visualização */}
      <div className="w-full max-w-3xl mb-3 flex items-center justify-between gap-2 px-2 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-600 uppercase tracking-wider hidden sm:inline">Modo de Visualização:</span>
          <div className="inline-flex p-1 bg-white rounded-xl border border-slate-300 shadow-2xs">
            <button
              onClick={() => setModoVisualizacao('MOLDURA')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors min-h-[36px] ${
                modoVisualizacao === 'MOLDURA'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Moldura Smartphone</span>
            </button>
            <button
              onClick={() => setModoVisualizacao('TELA_CHEIA')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors min-h-[36px] ${
                modoVisualizacao === 'TELA_CHEIA'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Tela Cheia Nativa</span>
            </button>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 font-medium hidden md:block">
          Equipe Operacional • Geolocalização Ativa
        </div>
      </div>

      {/* Smartphone Container / Nativo */}
      <div className={`w-full bg-slate-50 overflow-hidden relative flex flex-col transition-all duration-200 ${
        modoVisualizacao === 'MOLDURA'
          ? 'max-w-full sm:max-w-[390px] h-[780px] sm:h-[840px] rounded-2xl sm:rounded-[3rem] border-2 sm:border-[11px] border-slate-900 shadow-2xl shrink-0'
          : 'max-w-3xl min-h-[750px] flex-1 rounded-2xl border border-slate-300 shadow-lg'
      }`}>
        
        {/* Notch simulation (visível apenas na moldura) */}
        {modoVisualizacao === 'MOLDURA' && (
          <div className="hidden sm:block absolute top-0 inset-x-0 h-6 bg-slate-900 rounded-b-xl w-40 mx-auto z-50 pointer-events-none"></div>
        )}

        {!isLoggedIn ? (
          /* LOGIN SCREEN INSTITUCIONAL */
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-8 bg-slate-900 text-white">
            <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl mb-4 shadow-sm flex items-center justify-center">
              <BrasaoSaoPaulo size={44} />
            </div>
            
            <div className="text-center mb-6">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
                Prefeitura de São Paulo • SMSUB
              </span>
              <h1 className="text-white text-lg sm:text-xl font-bold tracking-tight mt-0.5">
                Subprefeitura Vila Mariana
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">
                App de Campo Operacional • CPO / Zeladoria SP156
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-3 max-w-xs">
              <div className="space-y-1">
                <label className="text-slate-300 text-xs font-medium">Nome do Operador</label>
                <input 
                  type="text" 
                  required
                  value={funcionario.nome}
                  onChange={e => setFuncionario({...funcionario, nome: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-500 text-xs"
                  placeholder="Ex: Carlos Mendes"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-300 text-xs font-medium">Matrícula Funcional PMSP</label>
                <input 
                  type="text" 
                  required
                  value={funcionario.matricula}
                  onChange={e => setFuncionario({...funcionario, matricula: e.target.value})}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-white placeholder:text-slate-500 focus:outline-none focus:border-slate-500 text-xs"
                  placeholder="Ex: 847.192-3"
                />
              </div>
              <div className="p-2 bg-slate-800/80 border border-slate-700 rounded-lg text-[11px] text-slate-300 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span>Base SUB-VM: R. José de Magalhães, 500</span>
              </div>
              <button 
                type="submit"
                className="w-full bg-sky-600 hover:bg-sky-500 text-white font-medium py-2.5 rounded-lg mt-2 transition-colors shadow-xs text-xs"
              >
                Iniciar Turno de Campo
              </button>
            </form>
          </div>
        ) : (
          /* APP CONTENT */
          <div className={`flex-1 flex flex-col overflow-hidden bg-slate-50 ${modoVisualizacao === 'MOLDURA' ? 'pt-7' : 'pt-0'}`}>
            
            {/* Offline Indicator */}
            <div className="bg-amber-100 px-4 py-1.5 flex items-center justify-between text-amber-900 text-xs font-medium shrink-0 border-b border-amber-200">
              <div className="flex items-center gap-1.5">
                <WifiOff className="w-3.5 h-3.5 text-amber-700" />
                <span>Modo Campo: Sincronização offline ativa</span>
              </div>
              <span className="font-mono text-[10px] text-amber-700 font-bold">SP156</span>
            </div>

            {selectedChamado ? (
              /* DETALHE DA OS E FLUXO DE EXECUÇÃO */
              <div className="flex-1 flex flex-col overflow-y-auto">
                <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-0 z-20 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => {
                        setSelectedChamadoId(null);
                        setFotoAntes(false);
                        setFotoDepois(false);
                        setChecklistRespostas({});
                      }}
                      className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors -ml-1 text-slate-700"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <div>
                      <h2 className="text-xs font-bold text-slate-900">Atendimento de OS</h2>
                      <p className="text-[11px] text-blue-600 font-mono font-bold">{selectedChamado.protocolo}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityCfg?.badgeStyle}`}>
                    {priorityCfg?.label}
                  </span>
                </div>

                <div className="p-4 space-y-4">
                  
                  {/* Card de Identificação da Categoria & SLA (Padrão Sala de Situação / Kanban) */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${categoriaCfg?.bgLight} ${categoriaCfg?.textColor} ${categoriaCfg?.borderColor}`}>
                          {categoriaCfg && <categoriaCfg.icon className="w-4 h-4" />}
                        </div>
                        <div>
                          <h3 className="text-xs font-bold text-slate-900 leading-tight">
                            {categoriaCfg?.label}
                          </h3>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-medium">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>Subprefeitura {selectedSub?.nome}</span>
                          </div>
                        </div>
                      </div>

                      <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        <Navigation className="w-3 h-3 text-indigo-600" />
                        {distanciaKm} km
                      </span>
                    </div>

                    {/* Contador e barra de SLA como no Kanban */}
                    {slaInfo && (
                      <div className="pt-2 border-t border-slate-100 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-slate-500 flex items-center gap-1 font-medium">
                            <Clock className="w-3 h-3" />
                            SLA Meta: {slaInfo.slaHoras}h
                          </span>
                          <span className={slaInfo.textColor}>{slaInfo.statusText}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${slaInfo.barColor}`}
                            style={{ width: `${slaInfo.barWidth}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Feedback de Chamado Escalado */}
                  {escaladoSuccess && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-3 text-xs flex items-center gap-2 animate-in fade-in">
                      <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                      <div>
                        <p className="font-bold">Chamado Escalado com Sucesso!</p>
                        <p className="text-[11px]">A supervisão técnica da Subprefeitura foi acionada.</p>
                      </div>
                    </div>
                  )}

                  {/* Etapas de Execução */}
                  <div className="space-y-4">
                    
                    {/* ETAPA 1: FOTO ANTES */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            fotoAntes ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>1</span>
                          Registro Fotográfico: ANTES
                        </span>
                        {fotoAntes && (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Registrado
                          </span>
                        )}
                      </div>

                      {!fotoAntes ? (
                        <button 
                          onClick={() => setFotoAntes(true)}
                          className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center justify-center gap-2 text-xs font-bold shadow-xs transition-colors"
                        >
                          <Camera className="w-4 h-4" /> Capturar Foto ANTES
                        </button>
                      ) : (
                        <div className="w-full h-32 bg-slate-200 rounded-lg overflow-hidden relative border border-slate-300">
                          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400&h=300')] bg-cover bg-center" />
                          {renderWatermark(selectedChamado)}
                        </div>
                      )}
                    </div>

                    {/* ETAPA 2: FOTO DEPOIS */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            fotoDepois ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>2</span>
                          Registro Fotográfico: DEPOIS
                        </span>
                        {fotoDepois && (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Registrado
                          </span>
                        )}
                      </div>

                      {!fotoDepois ? (
                        <button 
                          disabled={!fotoAntes}
                          onClick={() => setFotoDepois(true)}
                          className={`w-full py-2.5 rounded-lg flex items-center justify-center gap-2 text-xs font-bold shadow-xs transition-colors ${
                            fotoAntes 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          <Camera className="w-4 h-4" /> Capturar Foto DEPOIS
                        </button>
                      ) : (
                        <div className="w-full h-32 bg-slate-200 rounded-lg overflow-hidden relative border border-slate-300">
                          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80&w=400&h=300')] bg-cover bg-center" />
                          {renderWatermark(selectedChamado)}
                        </div>
                      )}
                    </div>

                    {/* ETAPA 3: CHECKLIST ESPECÍFICO POR CATEGORIA */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isChecklistCompleto ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-700'
                          }`}>3</span>
                          Checklist Operacional ({categoriaCfg?.label})
                        </span>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                          Obrigatório
                        </span>
                      </div>

                      <div className="space-y-3 pt-1">
                        {perguntasChecklist.map((item, index) => {
                          const resposta = checklistRespostas[item.id];
                          return (
                            <div key={item.id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
                              <p className="text-xs font-medium text-slate-800 leading-snug">
                                {index + 1}. {item.pergunta}
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setChecklistRespostas(prev => ({ ...prev, [item.id]: 'SIM' }))}
                                  className={`py-1.5 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                                    resposta === 'SIM'
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-emerald-50'
                                  }`}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  Sim (Resolvido)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setChecklistRespostas(prev => ({ ...prev, [item.id]: 'NAO' }))}
                                  className={`py-1.5 px-3 rounded-md text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                                    resposta === 'NAO'
                                      ? 'bg-rose-600 text-white shadow-xs'
                                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-rose-50'
                                  }`}
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  Não (Risco Pendente)
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Alerta de Risco Não Resolvido com Sugestão de Escalonamento */}
                      {hasRiscoNaoResolvido && (
                        <div className="bg-rose-50 border border-rose-300 rounded-xl p-3 space-y-2.5 animate-in fade-in">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                            <div>
                              <h4 className="text-xs font-bold text-rose-900">Risco Não Resolvido no Local</h4>
                              <p className="text-[11px] text-rose-700 leading-tight mt-0.5">
                                A finalização está bloqueada. Como o risco permanece, esta OS deve ser escalada para a supervisão técnica.
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleEscalarSupervisao}
                            className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                          >
                            <ShieldAlert className="w-4 h-4" />
                            Escalar para Supervisão
                          </button>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* Botão de Finalização Fixo no Rodapé */}
                <div className="p-4 bg-white border-t border-slate-200 mt-auto sticky bottom-0 z-20 space-y-1.5">
                  <button
                    disabled={!fotoAntes || !fotoDepois || hasRiscoNaoResolvido || !isChecklistCompleto}
                    onClick={handleFinalizar}
                    className={`w-full py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                      fotoAntes && fotoDepois && !hasRiscoNaoResolvido && isChecklistCompleto
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Finalizar Chamado (Aguardando Aprovação)
                  </button>
                  
                  {(!fotoAntes || !fotoDepois || !isChecklistCompleto) && !hasRiscoNaoResolvido && (
                    <p className="text-[10px] text-center text-slate-400 font-medium">
                      {!fotoAntes ? 'Capture a foto ANTES' : !fotoDepois ? 'Capture a foto DEPOIS' : 'Responda a todo o checklist de segurança'}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              /* LISTA DE ORDENS DE SERVIÇO DO DIA (ORDENADA POR PRIORIDADE E PROXIMIDADE) */
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="bg-slate-900 text-white px-4 py-2.5 shrink-0 border-b border-amber-500/40 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BrasaoSaoPaulo size={22} />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-xs font-bold text-white">SUB-VM • Ordens do Dia</h2>
                        <span className="text-[9px] bg-amber-400 text-slate-950 font-black px-1.5 py-0.2 rounded">CPO</span>
                      </div>
                      <p className="text-[10px] text-slate-300">
                        {funcionario.nome || 'Equipe Operacional'} • {funcionario.matricula || 'Matrícula PMSP'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs bg-blue-900/80 text-blue-200 border border-blue-700/60 px-2.5 py-1 rounded-full font-bold">
                    <span>{minhasOS.length}</span>
                    <span className="text-[10px] font-normal">rotas</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {minhasOS.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-slate-400 p-6 text-center">
                      <CheckCircle2 className="w-12 h-12 mb-2 text-emerald-400" />
                      <p className="text-xs font-bold text-slate-700">Tudo em dia!</p>
                      <p className="text-[11px] text-slate-500 mt-1">Nenhuma ordem de serviço pendente para a sua equipe no momento.</p>
                    </div>
                  ) : (
                    minhasOS.map(chamado => {
                      const catCfg = CATEGORIA_CONFIG[chamado.categoria] || CATEGORIA_CONFIG.ARVORE_CAIDA;
                      const prioCfg = PRIORITY_CONFIG[chamado.prioridade] || PRIORITY_CONFIG.MEDIA;
                      const sla = getSlaInfo(chamado);
                      const sub = subprefeituras.find(s => s.id === chamado.subprefeituraId);
                      const distKm = getDistanciaFicticiaKm(chamado);

                      return (
                        <button
                          key={chamado.id}
                          onClick={() => {
                            setSelectedChamadoId(chamado.id);
                            setFotoAntes(false);
                            setFotoDepois(false);
                            setChecklistRespostas({});
                          }}
                          className="w-full bg-white p-3 rounded-xl border border-slate-200 shadow-xs text-left hover:border-blue-400 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 space-y-2.5"
                        >
                          {/* Cabeçalho do Card: Protocolo e Selo de Prioridade */}
                          <div className="flex justify-between items-center">
                            <span className="text-[11px] font-mono font-bold text-blue-600">
                              {chamado.protocolo}
                            </span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${prioCfg.badgeStyle}`}>
                              {prioCfg.label}
                            </span>
                          </div>

                          {/* Categoria com o Mesmo Ícone e Cores da Sala de Situação */}
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${catCfg.bgLight} ${catCfg.textColor} ${catCfg.borderColor}`}>
                              <catCfg.icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xs font-bold text-slate-900 truncate">
                                {catCfg.label}
                              </h3>
                              <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium truncate">
                                <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                                <span className="truncate">Subprefeitura {sub?.nome}</span>
                              </div>
                            </div>

                            {/* Proximidade fictícia */}
                            <div className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-200 shrink-0">
                              <Navigation className="w-3 h-3 text-indigo-600" />
                              <span>{distKm} km</span>
                            </div>
                          </div>

                          {/* Contador de SLA Idêntico ao Kanban */}
                          <div className="pt-2 border-t border-slate-100 space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-slate-500 flex items-center gap-1 font-medium">
                                <Clock className="w-3 h-3" />
                                SLA: {sla.slaHoras}h
                              </span>
                              <span className={sla.textColor}>{sla.statusText}</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${sla.barColor}`}
                                style={{ width: `${sla.barWidth}%` }}
                              />
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            )}
            
            {/* Home Indicator */}
            <div className="h-1 bg-slate-900 w-1/3 rounded-full mx-auto my-1.5 shrink-0"></div>
          </div>
        )}
      </div>
    </div>
  );
}

