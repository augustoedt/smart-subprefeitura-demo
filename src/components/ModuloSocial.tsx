import React, { useState, useMemo } from 'react';
import { subprefeituras } from '../data';
import { UserSession } from '../LoginTypes';
import { 
  Users, 
  BarChart3, 
  Download, 
  Plus, 
  MapPin, 
  Calendar, 
  Clock, 
  ShieldAlert, 
  FileText, 
  ChevronRight, 
  X,
  UserCircle2,
  CheckCircle2,
  Home,
  HeartHandshake,
  Search,
  Filter,
  Printer,
  Bed,
  Dog,
  ShieldCheck,
  AlertCircle,
  Stethoscope,
  PhoneCall,
  QrCode,
  Sparkles
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import BrasaoSaoPaulo from './BrasaoSaoPaulo';
import { useApp } from '../context/AppContext';

// Tipos Socioassistenciais SUAS / SMADS
export type StatusAbordagem = 'ABORDADO_EM_RUA' | 'ENCAMINHADO_ABRIGO' | 'RECUSOU_ATENDIMENTO' | 'ENCAMINHADO_SAUDE';
export type StatusAntecedente = 'NADA_CONSTA' | 'EM_ABERTO' | 'CUMPRIDO';
export type DemandaImediata = 'ALIMENTACAO' | 'COBERTOR' | 'HIGIENE' | 'DOCUMENTACAO' | 'SAUDE_CAPS' | 'PET';

export interface Abordagem {
  id: string;
  data: string;
  subprefeituraId: string;
  localizacaoTexto: string;
  resultado: StatusAbordagem;
  demandasAtendidas: string[];
  observacao: string;
}

export interface Credenciado {
  codigo: string;
  nomeFicticio: string;
  subprefeituraFrequenteId: string;
  numeroAbordagens: number;
  statusAtual: StatusAbordagem;
  statusCriminal: StatusAntecedente;
  possuiPet: boolean;
  tempoEmSituacaoRua: string;
  historico: Abordagem[];
}

export interface UnidadeAcolhimento {
  id: string;
  nome: string;
  tipo: 'CTA' | 'CENTRO_ACOLHIDA_ESPECIAL' | 'CRAS' | 'CREAS' | 'CAPS_AD';
  endereco: string;
  bairro: string;
  capacidadeTotal: number;
  vagasLivres: number;
  vagasPets: number;
  perfilPublico: string;
  statusPlantao: 'ABERTO_24H' | 'DIURNO';
  telefone: string;
}

// Map Icon
const markerIcon = L.divIcon({
  className: 'custom-leaflet-icon',
  html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-md bg-indigo-600"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const shelterIcon = L.divIcon({
  className: 'custom-leaflet-shelter-icon',
  html: `<div class="w-4 h-4 rounded-full border-2 border-white shadow-md bg-emerald-600"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// Rede Real de Equipamentos Socioassistenciais da PMSP (Vila Mariana / Moema / Saúde / Central)
const UNIDADES_ACOLHIMENTO_MOCK: UnidadeAcolhimento[] = [
  {
    id: 'cta-13-vm',
    nome: 'CTA 13 — Vila Mariana (Centro de Triagem e Acolhimento)',
    tipo: 'CTA',
    endereco: 'Rua Vergueiro, 3185',
    bairro: 'Vila Mariana',
    capacidadeTotal: 120,
    vagasLivres: 19,
    vagasPets: 4,
    perfilPublico: 'Adultos Masculinos • Aceita Animais de Estimação',
    statusPlantao: 'ABERTO_24H',
    telefone: '(11) 5082-1400'
  },
  {
    id: 'cae-moema',
    nome: 'Centro de Acolhida Especial Moema',
    tipo: 'CENTRO_ACOLHIDA_ESPECIAL',
    endereco: 'Alameda dos Maracatins, 110',
    bairro: 'Moema',
    capacidadeTotal: 80,
    vagasLivres: 7,
    vagasPets: 2,
    perfilPublico: 'Famílias com Crianças e Mulheres Vítimas de Violência',
    statusPlantao: 'ABERTO_24H',
    telefone: '(11) 5051-8890'
  },
  {
    id: 'cta-09-brig',
    nome: 'CTA 09 — Brigadeiro / Bela Vista',
    tipo: 'CTA',
    endereco: 'Av. Brigadeiro Luís Antônio, 1200',
    bairro: 'Bela Vista',
    capacidadeTotal: 160,
    vagasLivres: 28,
    vagasPets: 6,
    perfilPublico: 'População Adulta Geral • Acolhimento Humanizado',
    statusPlantao: 'ABERTO_24H',
    telefone: '(11) 3284-9011'
  },
  {
    id: 'cras-vm',
    nome: 'CRAS Vila Mariana — Centro de Referência',
    tipo: 'CRAS',
    endereco: 'Rua França Pinto, 450',
    bairro: 'Vila Mariana',
    capacidadeTotal: 50,
    vagasLivres: 12,
    vagasPets: 0,
    perfilPublico: 'CadÚnico, Bolsa Família, BPC e Inclusão Social',
    statusPlantao: 'DIURNO',
    telefone: '(11) 5573-2210'
  },
  {
    id: 'creas-saude',
    nome: 'CREAS Saúde — Proteção Especial',
    tipo: 'CREAS',
    endereco: 'Rua Domingos de Soto, 142',
    bairro: 'Saúde',
    capacidadeTotal: 40,
    vagasLivres: 9,
    vagasPets: 0,
    perfilPublico: 'Média Complexidade • Violação de Direitos',
    statusPlantao: 'DIURNO',
    telefone: '(11) 5589-4412'
  },
  {
    id: 'caps-ad-vm',
    nome: 'CAPS AD III — Vila Mariana (Saúde Mental e Desintoxicação)',
    tipo: 'CAPS_AD',
    endereco: 'Rua Sena Madureira, 180',
    bairro: 'Vila Mariana',
    capacidadeTotal: 25,
    vagasLivres: 4,
    vagasPets: 0,
    perfilPublico: 'Dependência Química • Retaguarda Clínica 24h',
    statusPlantao: 'ABERTO_24H',
    telefone: '(11) 5084-2399'
  }
];

// Gerador de Histórico Inicial
const generateMockHistorico = (count: number, subId: string): Abordagem[] => {
  const statuses: StatusAbordagem[] = ['ABORDADO_EM_RUA', 'ENCAMINHADO_ABRIGO', 'RECUSOU_ATENDIMENTO', 'ENCAMINHADO_SAUDE'];
  const hist: Abordagem[] = [];
  const now = new Date();
  const locais = [
    'Praça Rosa Alves da Silva', 
    'Viaduto Tutóia x 23 de Maio', 
    'Entorno da Estação Santa Cruz', 
    'Av. Domingos de Morais, 1200', 
    'Alameda dos Maracatins x Moema', 
    'Praça da Árvore / Metrô'
  ];
  
  for (let i = 0; i < count; i++) {
    const daysAgo = Math.floor(Math.random() * 50) + i * 4;
    const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    hist.push({
      id: crypto.randomUUID(),
      data: d.toISOString(),
      subprefeituraId: subId,
      localizacaoTexto: locais[Math.floor(Math.random() * locais.length)],
      resultado: statuses[Math.floor(Math.random() * statuses.length)],
      demandasAtendidas: ['Alimentação (Marmita)', 'Agasalho / Cobertor'],
      observacao: 'Abordagem humanizada pela equipe multidisciplinar do SEAS.',
    });
  }
  return hist.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
};

const INITIAL_CREDENCIADOS: Credenciado[] = [
  {
    codigo: 'SOC-2026-1049',
    nomeFicticio: 'Carlos Eduardo M. (Codinome: Carlinhos)',
    subprefeituraFrequenteId: '2', // Vila Mariana
    numeroAbordagens: 6,
    statusAtual: 'ENCAMINHADO_ABRIGO',
    statusCriminal: 'NADA_CONSTA',
    possuiPet: true,
    tempoEmSituacaoRua: '1 a 2 anos',
    historico: generateMockHistorico(6, '2')
  },
  {
    codigo: 'SOC-2026-2184',
    nomeFicticio: 'Maria das Graças S. (Dona Maria)',
    subprefeituraFrequenteId: '2', // Vila Mariana
    numeroAbordagens: 4,
    statusAtual: 'ABORDADO_EM_RUA',
    statusCriminal: 'NADA_CONSTA',
    possuiPet: false,
    tempoEmSituacaoRua: '6 meses',
    historico: generateMockHistorico(4, '2')
  },
  {
    codigo: 'SOC-2026-3401',
    nomeFicticio: 'Rogério de O. (Paulista)',
    subprefeituraFrequenteId: '2', // Vila Mariana
    numeroAbordagens: 9,
    statusAtual: 'ENCAMINHADO_SAUDE',
    statusCriminal: 'EM_ABERTO',
    possuiPet: false,
    tempoEmSituacaoRua: 'Mais de 3 anos',
    historico: generateMockHistorico(9, '2')
  },
  {
    codigo: 'SOC-2026-4512',
    nomeFicticio: 'Juliana P. e Filho (Menor 4 anos)',
    subprefeituraFrequenteId: '2', // Vila Mariana
    numeroAbordagens: 3,
    statusAtual: 'ENCAMINHADO_ABRIGO',
    statusCriminal: 'NADA_CONSTA',
    possuiPet: false,
    tempoEmSituacaoRua: 'Recém-desalojada (1 mês)',
    historico: generateMockHistorico(3, '2')
  },
  {
    codigo: 'SOC-2026-5890',
    nomeFicticio: 'Fernando A. (Nando)',
    subprefeituraFrequenteId: '3', // Mooca
    numeroAbordagens: 5,
    statusAtual: 'RECUSOU_ATENDIMENTO',
    statusCriminal: 'CUMPRIDO',
    possuiPet: true,
    tempoEmSituacaoRua: '2 anos',
    historico: generateMockHistorico(5, '3')
  },
  {
    codigo: 'SOC-2026-6102',
    nomeFicticio: 'Antônio B. (Maranhão)',
    subprefeituraFrequenteId: '1', // Sé
    numeroAbordagens: 12,
    statusAtual: 'ABORDADO_EM_RUA',
    statusCriminal: 'NADA_CONSTA',
    possuiPet: false,
    tempoEmSituacaoRua: 'Mais de 5 anos',
    historico: generateMockHistorico(12, '1')
  }
];

const statusLabels: Record<StatusAbordagem, { label: string; color: string; badgeBg: string }> = {
  ABORDADO_EM_RUA: { label: 'Abordado em Rua (Permanece)', color: 'bg-amber-100 text-amber-900 border-amber-300', badgeBg: 'bg-amber-500' },
  ENCAMINHADO_ABRIGO: { label: 'Encaminhado ao Acolhimento (CTA)', color: 'bg-emerald-100 text-emerald-900 border-emerald-300', badgeBg: 'bg-emerald-500' },
  RECUSOU_ATENDIMENTO: { label: 'Recusa Qualificada Respeitada', color: 'bg-slate-100 text-slate-700 border-slate-300', badgeBg: 'bg-slate-500' },
  ENCAMINHADO_SAUDE: { label: 'Encaminhado à Saúde / CAPS', color: 'bg-blue-100 text-blue-900 border-blue-300', badgeBg: 'bg-blue-500' },
};

const criminalLabels: Record<StatusAntecedente, { label: string; color: string }> = {
  NADA_CONSTA: { label: 'Nada Consta (SINESP)', color: 'bg-slate-100 text-slate-600 border-slate-200' },
  CUMPRIDO: { label: 'Mandado Extinto/Cumprido', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  EM_ABERTO: { label: 'Alerta de Mandado em Aberto', color: 'bg-red-50 text-red-700 border-red-200 font-bold' }
};

export default function ModuloSocial({ session }: { session: UserSession }) {
  const { addNotification } = useApp();
  
  // Abas de Navegação Interna do Módulo Social
  const [subTab, setSubTab] = useState<'BASE_PESSOAS' | 'VAGAS_ABRIGOS' | 'MAPA_TERRITORIAL' | 'INDICADORES'>('BASE_PESSOAS');
  
  // Estados da Base de Pessoas e Formulário
  const [credenciados, setCredenciados] = useState<Credenciado[]>(INITIAL_CREDENCIADOS);
  const [selectedCredenciado, setSelectedCredenciado] = useState<Credenciado | null>(null);
  const [dossieModalAberto, setDossieModalAberto] = useState(false);
  const [reservaModalUnidade, setReservaModalUnidade] = useState<UnidadeAcolhimento | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<{ tipo: 'sucesso' | 'info'; mensagem: string } | null>(null);

  // Filtros de Pesquisa
  const [filtroTexto, setFiltroTexto] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<string>('TODOS');
  const [filtroAlertaSeguranca, setFiltroAlertaSeguranca] = useState(false);

  // Formulário Nova Abordagem
  const [formSubId, setFormSubId] = useState<string>(session.role === 'GESTOR' ? session.subprefeituraId : '2');
  const [formLocal, setFormLocal] = useState('Viaduto Tutóia x Av. 23 de Maio');
  const [formNomeFicticio, setFormNomeFicticio] = useState('');
  const [formResultado, setFormResultado] = useState<StatusAbordagem>('ENCAMINHADO_ABRIGO');
  const [formDemandas, setFormDemandas] = useState<string[]>(['Alimentação', 'Agasalho/Cobertor']);
  const [formPossuiPet, setFormPossuiPet] = useState(false);
  const [formObservacoes, setFormObservacoes] = useState('');

  // Unidades de Acolhimento Reativas
  const [unidades, setUnidades] = useState<UnidadeAcolhimento[]>(UNIDADES_ACOLHIMENTO_MOCK);

  const showToast = (mensagem: string, tipo: 'sucesso' | 'info' = 'sucesso') => {
    setFeedbackToast({ tipo, mensagem });
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4000);
  };

  // Filtragem da Base de Pessoas
  const credenciadosFiltrados = useMemo(() => {
    return credenciados.filter(c => {
      if (session.role === 'GESTOR' && c.subprefeituraFrequenteId !== session.subprefeituraId) {
        return false;
      }
      if (filtroStatus !== 'TODOS' && c.statusAtual !== filtroStatus) {
        return false;
      }
      if (filtroAlertaSeguranca && c.statusCriminal !== 'EM_ABERTO') {
        return false;
      }
      if (filtroTexto.trim()) {
        const t = filtroTexto.toLowerCase();
        const matchNome = c.nomeFicticio.toLowerCase().includes(t);
        const matchCod = c.codigo.toLowerCase().includes(t);
        if (!matchNome && !matchCod) return false;
      }
      return true;
    });
  }, [credenciados, session, filtroStatus, filtroAlertaSeguranca, filtroTexto]);

  // Submissão do Formulário de Nova Abordagem
  const handleNovaAbordagemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formNomeFicticio.trim()) {
      showToast('Por favor, informe a identificação ética ou nome fictício do cidadão.', 'info');
      return;
    }

    const novoCod = `SOC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const novaAbordagem: Abordagem = {
      id: crypto.randomUUID(),
      data: new Date().toISOString(),
      subprefeituraId: formSubId,
      localizacaoTexto: formLocal,
      resultado: formResultado,
      demandasAtendidas: formDemandas,
      observacao: formObservacoes || 'Atendimento registrado via Plantão de Abordagem Social SUAS.'
    };

    const novoCredenciado: Credenciado = {
      codigo: novoCod,
      nomeFicticio: formNomeFicticio,
      subprefeituraFrequenteId: formSubId,
      numeroAbordagens: 1,
      statusAtual: formResultado,
      statusCriminal: 'NADA_CONSTA',
      possuiPet: formPossuiPet,
      tempoEmSituacaoRua: 'Recém-identificado',
      historico: [novaAbordagem]
    };

    setCredenciados(prev => [novoCredenciado, ...prev]);

    // Se acolheu, reduz 1 vaga livre no CTA Vila Mariana
    if (formResultado === 'ENCAMINHADO_ABRIGO') {
      setUnidades(prev => prev.map(u => 
        u.id === 'cta-13-vm' ? { ...u, vagasLivres: Math.max(0, u.vagasLivres - 1) } : u
      ));
    }

    showToast(`Abordagem ${novoCod} registrada com sucesso. Protocolo SISRUA gerado!`, 'sucesso');
    addNotification({
      titulo: 'Nova Abordagem Social Registrada',
      mensagem: `Cidadão ${formNomeFicticio} atendido em ${formLocal}. Resultado: ${statusLabels[formResultado].label}`,
      tipo: 'sucesso',
      linkSection: 'modulo_social',
      protocolo: novoCod
    });

    // Limpar campos
    setFormNomeFicticio('');
    setFormObservacoes('');
  };

  // Solicitar Reserva de Vaga
  const handleConfirmarReservaVaga = () => {
    if (!reservaModalUnidade) return;

    setUnidades(prev => prev.map(u => 
      u.id === reservaModalUnidade.id 
        ? { ...u, vagasLivres: Math.max(0, u.vagasLivres - 1) } 
        : u
    ));

    const protocoloSIS = `SISRUA-SP-${Math.floor(100000 + Math.random() * 900000)}`;

    showToast(`Vaga reservada com sucesso no ${reservaModalUnidade.nome}!`, 'sucesso');
    addNotification({
      titulo: 'Vaga Reservada via SISRUA',
      mensagem: `Reserva confirmada no ${reservaModalUnidade.nome}. Protocolo: ${protocoloSIS}`,
      tipo: 'sucesso',
      linkSection: 'modulo_social',
      protocolo: protocoloSIS
    });

    setReservaModalUnidade(null);
  };

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Codigo,Nome_Ficticio,Regiao,Abordagens,Status,Antecedente\n" + 
      credenciados.map(c => `${c.codigo},"${c.nomeFicticio}",${c.subprefeituraFrequenteId},${c.numeroAbordagens},${c.statusAtual},${c.statusCriminal}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `relatorio_social_smads_pmsp_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Relatório exportado com sucesso (.CSV oficial da PMSP gerado).', 'sucesso');
  };

  // Métricas do Módulo Social
  const totalAbordados = credenciados.length;
  const totalAcolhidos = credenciados.filter(c => c.statusAtual === 'ENCAMINHADO_ABRIGO').length;
  const totalEmRua = credenciados.filter(c => c.statusAtual === 'ABORDADO_EM_RUA').length;
  const totalVagasLivresRede = unidades.reduce((acc, curr) => acc + curr.vagasLivres, 0);

  const mockDadosGrafico = [
    { name: 'Vila Mariana', semanaAnterior: 32, semanaAtual: 44 },
    { name: 'Moema', semanaAnterior: 18, semanaAtual: 21 },
    { name: 'Saúde', semanaAnterior: 14, semanaAtual: 19 },
    { name: 'Ipiranga', semanaAnterior: 22, semanaAtual: 25 },
    { name: 'Sé', semanaAnterior: 65, semanaAtual: 58 }
  ];

  const toggleDemanda = (item: string) => {
    setFormDemandas(prev => 
      prev.includes(item) ? prev.filter(d => d !== item) : [...prev, item]
    );
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden relative">
      
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="absolute top-4 right-4 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-top-2 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{feedbackToast.mensagem}</span>
          <button 
            onClick={() => setFeedbackToast(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Conteúdo com Scroll */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-5 sm:space-y-6">
        
        {/* Banner Institucional de Assistência Social - SUB-VM */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-xl border border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="shrink-0">
              <BrasaoSaoPaulo size={36} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  SMADS • SMSUB • Prefeitura de São Paulo
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 border border-slate-700 px-1.5 py-0.5 rounded font-mono">
                  SAS VILA MARIANA / SUAS
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                Módulo Integrado de Acolhimento Social e Direitos Humanos
              </h2>
              <p className="text-xs text-slate-400 font-normal">
                Supervisão de Assistência Social • Abrangência Territorial: Vila Mariana, Moema e Saúde
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>SEAS Plantão 24h</span>
            </div>
            <button
              onClick={() => {
                if (credenciados[0]) {
                  setSelectedCredenciado(credenciados[0]);
                  setDossieModalAberto(true);
                }
              }}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-slate-700" />
              <span>Dossiê Modelo PMSP</span>
            </button>
          </div>
        </div>

        {/* 4 Cards de Métricas Executivas da Assistência Social */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold text-slate-600">Pessoas Acompanhadas</span>
              <Users className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900">{totalAbordados}</div>
            <p className="text-[11px] text-slate-400 mt-1">Prontuários ativos no SISRUA</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold text-slate-600">Acolhidos em Abrigos</span>
              <Home className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900">{totalAcolhidos}</div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              {((totalAcolhidos / totalAbordados) * 100).toFixed(0)}% taxa de adesão qualificada
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold text-slate-600">Vagas Livres na Rede</span>
              <Bed className="w-4 h-4 text-sky-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900">{totalVagasLivresRede}</div>
            <p className="text-[11px] text-slate-400 mt-1">Disponíveis nos CTAs da região</p>
          </div>

          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-2xs">
            <div className="flex items-center justify-between text-slate-500 mb-1">
              <span className="text-xs font-semibold text-slate-600">Em Vias Públicas</span>
              <HeartHandshake className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-slate-900">{totalEmRua}</div>
            <p className="text-[11px] text-slate-400 mt-1">Atendimento de rua em andamento</p>
          </div>
        </div>

        {/* Barra de Sub-Navegação do Módulo Social */}
        <div className="bg-slate-100 p-1 rounded-lg flex flex-wrap items-center gap-1 border border-slate-200/60">
          {[
            { id: 'BASE_PESSOAS', label: 'Base de Pessoas & Prontuários (SUAS)', icon: Users },
            { id: 'VAGAS_ABRIGOS', label: 'Vagas em Abrigos & Centros (Tempo Real)', icon: Bed },
            { id: 'MAPA_TERRITORIAL', label: 'Mapa Territorial de Vulnerabilidade', icon: MapPin },
            { id: 'INDICADORES', label: 'Indicadores & Comparativo Semanal', icon: BarChart3 },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = subTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSubTab(tab.id as typeof subTab)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ABA 1: BASE DE PESSOAS E FORMULÁRIO DE NOVA ABORDAGEM */}
        {subTab === 'BASE_PESSOAS' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-start">
            
            {/* Coluna Esquerda: Formulário de Registro de Abordagem */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 rounded-xl shrink-0">
                  <Plus className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">Registrar Nova Abordagem</h3>
                  <p className="text-xs text-slate-500">Busca Ativa e Encaminhamento SUAS</p>
                </div>
              </div>

              <form onSubmit={handleNovaAbordagemSubmit} className="space-y-3 sm:space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subprefeitura da Ação</label>
                  <select 
                    value={formSubId}
                    onChange={(e) => setFormSubId(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-emerald-500"
                    disabled={session.role === 'GESTOR'}
                  >
                    {subprefeituras.map(sub => (
                      <option key={sub.id} value={sub.id}>{sub.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Localização da Abordagem</label>
                  <input
                    type="text"
                    value={formLocal}
                    onChange={(e) => setFormLocal(e.target.value)}
                    placeholder="Ex: Viaduto Tutóia x 23 de Maio"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nome Fictício / Codinome Ético
                  </label>
                  <input
                    type="text"
                    value={formNomeFicticio}
                    onChange={(e) => setFormNomeFicticio(e.target.value)}
                    placeholder="Ex: Roberto S. (ou sem identificação civil)"
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Resultado do Atendimento</label>
                  <select 
                    value={formResultado}
                    onChange={(e) => setFormResultado(e.target.value as StatusAbordagem)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-emerald-500 font-semibold text-slate-800"
                  >
                    <option value="ENCAMINHADO_ABRIGO">🏠 Aceitou Acolhimento no CTA / Abrigo</option>
                    <option value="ABORDADO_EM_RUA">🍲 Abordado em Rua (Recebeu Insumos)</option>
                    <option value="ENCAMINHADO_SAUDE">🚑 Encaminhado para UPA / CAPS AD</option>
                    <option value="RECUSOU_ATENDIMENTO">✋ Recusa Qualificada Respeitada</option>
                  </select>
                </div>

                {/* Demandas Atendidas (Chips) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Demandas Imediatas Atendidas</label>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      'Alimentação',
                      'Agasalho/Cobertor',
                      'Kit Higiene',
                      'Doc. Civil (RG/CadÚnico)',
                      'Acolhimento com Pet',
                      'Saúde Mental / CAPS'
                    ].map(item => {
                      const sel = formDemandas.includes(item);
                      return (
                        <button
                          type="button"
                          key={item}
                          onClick={() => toggleDemanda(item)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                            sel 
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold' 
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {sel ? '✓ ' : '+ '}{item}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Possui Animal de Estimação */}
                <div className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200">
                  <input
                    type="checkbox"
                    id="possuiPetCheck"
                    checked={formPossuiPet}
                    onChange={(e) => setFormPossuiPet(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded"
                  />
                  <label htmlFor="possuiPetCheck" className="text-xs font-semibold text-slate-700 flex items-center gap-1 cursor-pointer">
                    <Dog className="w-3.5 h-3.5 text-amber-600" />
                    <span>Cidadão acompanhado de animal de estimação (Vaga Pet)</span>
                  </label>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Observações do Assistente Social</label>
                  <textarea 
                    rows={2}
                    value={formObservacoes}
                    onChange={(e) => setFormObservacoes(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 bg-slate-50 focus:ring-2 focus:ring-emerald-500 resize-none"
                    placeholder="Relato das condições físicas, emocionais e vínculos familiares..."
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-[#0A192F] hover:bg-slate-800 text-amber-400 font-bold py-2.5 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Salvar Registro de Abordagem</span>
                </button>
              </form>
            </div>

            {/* Coluna Direita: Tabela de Credenciados e Prontuários */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col overflow-hidden">
              
              {/* Barra de Filtro e Busca da Tabela */}
              <div className="p-4 border-b border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={filtroTexto}
                      onChange={(e) => setFiltroTexto(e.target.value)}
                      placeholder="Buscar por nome ou ID..."
                      className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="text-xs bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-700"
                  >
                    <option value="TODOS">Todos os Status</option>
                    <option value="ENCAMINHADO_ABRIGO">Acolhidos no CTA</option>
                    <option value="ABORDADO_EM_RUA">Em Rua</option>
                    <option value="ENCAMINHADO_SAUDE">Encaminhado à Saúde</option>
                    <option value="RECUSOU_ATENDIMENTO">Recusas</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
                  <button
                    onClick={() => setFiltroAlertaSeguranca(!filtroAlertaSeguranca)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                      filtroAlertaSeguranca 
                        ? 'bg-red-50 text-red-700 border-red-300 font-bold' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-red-500" />
                    <span>Alertas SINESP</span>
                  </button>

                  <button
                    onClick={handleExportCSV}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors border border-slate-200 flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CSV</span>
                  </button>
                </div>
              </div>

              {/* Tabela de Prontuários */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Cidadão / ID SISRUA</th>
                      <th className="px-4 py-3">Região / Ponto</th>
                      <th className="px-4 py-3 text-center">Abordagens</th>
                      <th className="px-4 py-3">Status Atual</th>
                      <th className="px-4 py-3">Segurança</th>
                      <th className="px-4 py-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {credenciadosFiltrados.map((cred) => (
                      <tr key={cred.codigo} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold shrink-0">
                              <UserCircle2 className="w-5 h-5 text-indigo-500" />
                            </div>
                            <div>
                              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                                <span>{cred.nomeFicticio}</span>
                                {cred.possuiPet && (
                                  <span title="Acompanhado de cão/gato" className="text-[10px] bg-amber-100 text-amber-800 px-1 rounded">
                                    🐕 Pet
                                  </span>
                                )}
                              </div>
                              <div className="font-mono text-[10px] text-slate-400">{cred.codigo}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-600">
                          {subprefeituras.find(s => s.id === cred.subprefeituraFrequenteId)?.nome}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded-full text-xs">
                            {cred.numeroAbordagens}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusLabels[cred.statusAtual].color}`}>
                            {statusLabels[cred.statusAtual].label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] border inline-flex items-center gap-1 ${criminalLabels[cred.statusCriminal].color}`}>
                            {cred.statusCriminal === 'EM_ABERTO' && <ShieldAlert className="w-3 h-3" />}
                            {criminalLabels[cred.statusCriminal].label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => setSelectedCredenciado(cred)}
                            className="text-indigo-600 hover:text-indigo-900 font-bold text-xs inline-flex items-center gap-1 hover:underline"
                          >
                            <span>Prontuário</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ABA 2: REDE DE ACOLHIMENTO E VAGAS EM TEMPO REAL */}
        {subTab === 'VAGAS_ABRIGOS' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Bed className="w-5 h-5 text-blue-600" />
                  Rede de Centros de Acolhida e Abastecimento de Vagas (SISRUA PMSP)
                </h3>
                <p className="text-xs text-slate-500">
                  Monitoramento da lotação e reserva imediata para a rede socioassistencial na jurisdição.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{totalVagasLivresRede} Vagas Livres Consolidadas</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unidades.map((unidade) => {
                const percOcupacao = Math.round(((unidade.capacidadeTotal - unidade.vagasLivres) / unidade.capacidadeTotal) * 100);
                return (
                  <div 
                    key={unidade.id}
                    className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                          {unidade.tipo}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          unidade.statusPlantao === 'ABERTO_24H' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {unidade.statusPlantao === 'ABERTO_24H' ? 'Plantão 24h' : 'Diurno (08h - 17h)'}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-800 text-sm leading-snug">{unidade.nome}</h4>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {unidade.endereco} • {unidade.bairro}
                      </p>
                    </div>

                    <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Capacidade:</span>
                        <span className="font-bold text-slate-800">{unidade.capacidadeTotal} leitos</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Vagas Livres Agora:</span>
                        <span className="font-bold text-emerald-600 font-mono text-sm">{unidade.vagasLivres}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-600">Vagas Canil / Pets:</span>
                        <span className="font-bold text-amber-700">{unidade.vagasPets} vagas</span>
                      </div>

                      {/* Barra de Progresso de Ocupação */}
                      <div className="pt-1">
                        <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                          <span>Ocupação</span>
                          <span className="font-bold">{percOcupacao}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              percOcupacao > 90 ? 'bg-red-500' : percOcupacao > 75 ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${percOcupacao}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 line-clamp-2">
                      <strong>Perfil:</strong> {unidade.perfilPublico}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
                        <PhoneCall className="w-3 h-3 text-slate-400" />
                        {unidade.telefone}
                      </span>

                      <button
                        onClick={() => setReservaModalUnidade(unidade)}
                        disabled={unidade.vagasLivres <= 0}
                        className="px-3 py-1.5 bg-[#0A192F] hover:bg-slate-800 disabled:opacity-50 text-amber-400 text-xs font-bold rounded-xl transition-colors shadow-xs"
                      >
                        Reservar Vaga
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ABA 3: MAPA TERRITORIAL DE VULNERABILIDADE */}
        {subTab === 'MAPA_TERRITORIAL' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 sm:p-5 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  Mapeamento Georreferenciado de Abordagens na Vila Mariana
                </h3>
                <p className="text-xs text-slate-500">
                  Pontos quentes de permanência em via pública e localização dos equipamentos da rede socioassistencial.
                </p>
              </div>

              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-indigo-600 inline-block"></span>
                  Ponto de Abordagem
                </span>
                <span className="flex items-center gap-1.5 font-medium text-slate-600">
                  <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
                  Centro de Acolhida (CTA)
                </span>
              </div>
            </div>

            <div className="h-[450px] sm:h-[520px] rounded-xl overflow-hidden border border-slate-200 relative shadow-inner">
              <MapContainer 
                center={[-23.5881, -46.6386]} 
                zoom={14} 
                style={{ width: '100%', height: '100%' }}
              >
                <TileLayer
                  url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  maxZoom={19}
                />
                
                {/* Marcadores de Abordagem */}
                <Marker position={[-23.5881, -46.6386]} icon={markerIcon}>
                  <Popup>
                    <div className="p-1 text-xs">
                      <strong>Praça Rosa Alves da Silva</strong><br />
                      3 pessoas acompanhadas pelo SEAS.<br />
                      Status: Abordado com entrega de agasalhos.
                    </div>
                  </Popup>
                </Marker>

                <Marker position={[-23.5780, -46.6450]} icon={markerIcon}>
                  <Popup>
                    <div className="p-1 text-xs">
                      <strong>Viaduto Tutóia x 23 de Maio</strong><br />
                      Ponto de permanência noturna.<br />
                      Ação de convencimento ao CTA 13 em andamento.
                    </div>
                  </Popup>
                </Marker>

                <Marker position={[-23.5990, -46.6370]} icon={markerIcon}>
                  <Popup>
                    <div className="p-1 text-xs">
                      <strong>Metrô Santa Cruz (Entorno)</strong><br />
                      2 pessoas encaminhadas para emissão de RG no CRAS.
                    </div>
                  </Popup>
                </Marker>

                {/* Marcadores dos Abrigos */}
                <Marker position={[-23.5850, -46.6350]} icon={shelterIcon}>
                  <Popup>
                    <div className="p-1 text-xs font-bold text-emerald-800">
                      CTA 13 — Vila Mariana (Rua Vergueiro)<br />
                      19 Vagas Livres no Momento.
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}

        {/* ABA 4: INDICADORES & GRÁFICOS */}
        {subTab === 'INDICADORES' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm sm:text-base">Relatório Semanal de Abordagens</h3>
                  <p className="text-xs text-slate-500">Comparativo territorial por Subprefeitura</p>
                </div>
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors border border-slate-200 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exportar Dados</span>
                </button>
              </div>

              <div className="h-[280px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockDadosGrafico}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ fill: '#f1f5f9' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                    <Bar dataKey="semanaAnterior" name="Semana Anterior" fill="#94a3b8" radius={[4, 4, 0, 0]} maxBarSize={36} />
                    <Bar dataKey="semanaAtual" name="Semana Atual" fill="#0A192F" radius={[4, 4, 0, 0]} maxBarSize={36} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between space-y-4">
              <div>
                <h3 className="font-bold text-slate-800 text-sm sm:text-base">Adesão por Desfecho</h3>
                <p className="text-xs text-slate-500">Distribuição percentual dos atendimentos</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                  <span className="font-semibold text-emerald-900">Acolhimento no CTA</span>
                  <span className="font-bold text-emerald-700 font-mono">48%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-amber-50 rounded-xl border border-amber-100">
                  <span className="font-semibold text-amber-900">Atendido em Rua (Insumos)</span>
                  <span className="font-bold text-amber-700 font-mono">32%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-blue-50 rounded-xl border border-blue-100">
                  <span className="font-semibold text-blue-900">Encaminhado à Saúde / CAPS</span>
                  <span className="font-bold text-blue-700 font-mono">12%</span>
                </div>
                <div className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-700">Recusa Qualificada</span>
                  <span className="font-bold text-slate-600 font-mono">8%</span>
                </div>
              </div>

              <div className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] leading-relaxed">
                🛡️ <strong>Protocolo Ético SUAS:</strong> Toda recusa ao abrigo é respeitada, sendo mantida a entrega de insumos de sobrevivência e nova visita programada para a equipe de busca ativa.
              </div>
            </div>
          </div>
        )}

      </div>

      {/* MODAL / BOTTOM SHEET DE PRONTUÁRIO INDIVIDUAL */}
      {selectedCredenciado && !dossieModalAberto && (
        <>
          <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40" onClick={() => setSelectedCredenciado(null)} />
          <div className="fixed inset-x-0 bottom-0 max-h-[85vh] sm:max-h-full sm:inset-x-auto sm:inset-y-0 sm:right-0 w-full sm:max-w-md bg-white border-t sm:border-t-0 sm:border-l border-slate-200 shadow-2xl z-50 flex flex-col rounded-t-2xl sm:rounded-none animate-in slide-in-from-bottom sm:slide-in-from-right duration-200">
            
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-[#0A192F] text-white rounded-t-2xl sm:rounded-none">
              <div>
                <h3 className="font-bold flex items-center gap-2 text-base">
                  <UserCircle2 className="w-5 h-5 text-amber-400" />
                  Prontuário Social SUAS
                </h3>
                <p className="text-xs text-slate-300">{selectedCredenciado.nomeFicticio}</p>
              </div>
              <button
                onClick={() => setSelectedCredenciado(null)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              
              {/* Card Resumo */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Código SISRUA:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedCredenciado.codigo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-semibold">Tempo em Situação de Rua:</span>
                  <span className="font-bold text-slate-700">{selectedCredenciado.tempoEmSituacaoRua}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Status Atual:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusLabels[selectedCredenciado.statusAtual].color}`}>
                    {statusLabels[selectedCredenciado.statusAtual].label}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Segurança SINESP:</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${criminalLabels[selectedCredenciado.statusCriminal].color}`}>
                    {criminalLabels[selectedCredenciado.statusCriminal].label}
                  </span>
                </div>
              </div>

              {selectedCredenciado.statusCriminal === 'EM_ABERTO' && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <p>
                    <strong>Atenção Operacional:</strong> Mandado judicial em aberto. Abordagem de rua deve ser acompanhada discretamente pela GCM/PM, sem constrangimento público.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" /> Histórico de Abordagens
                </h4>
                <button
                  onClick={() => setDossieModalAberto(true)}
                  className="text-indigo-600 hover:text-indigo-800 font-bold text-xs flex items-center gap-1 hover:underline"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Ver Dossiê Oficial
                </button>
              </div>

              <div className="space-y-3">
                {selectedCredenciado.historico.map((hist) => (
                  <div key={hist.id} className="p-3 bg-white border border-slate-200 rounded-xl text-xs shadow-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{new Date(hist.data).toLocaleDateString('pt-BR')}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${statusLabels[hist.resultado].color}`}>
                        {statusLabels[hist.resultado].label}
                      </span>
                    </div>
                    <p className="text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {hist.localizacaoTexto}
                    </p>
                    <p className="text-slate-500 text-[11px] italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                      "{hist.observacao}"
                    </p>
                  </div>
                ))}
              </div>

            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex gap-2">
              <button
                onClick={() => setDossieModalAberto(true)}
                className="flex-1 py-2.5 bg-[#0A192F] hover:bg-slate-800 text-amber-400 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Emitir Dossiê SEAS / PMSP</span>
              </button>
            </div>

          </div>
        </>
      )}

      {/* MODAL DE DOSSIÊ SOCIOASSISTENCIAL OFICIAL PARA IMPRESSÃO / AUDITORIA */}
      {dossieModalAberto && selectedCredenciado && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-3 sm:p-6 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            {/* Header Oficial do Dossiê */}
            <div className="p-5 bg-[#0A192F] text-white flex items-center justify-between border-b border-amber-500/40">
              <div className="flex items-center gap-3">
                <BrasaoSaoPaulo size={36} />
                <div>
                  <h3 className="font-bold text-sm sm:text-base text-amber-400">
                    Dossiê Socioassistencial Individual Oficial
                  </h3>
                  <p className="text-xs text-slate-300">
                    Prefeitura de São Paulo • SMADS • Subprefeitura Vila Mariana
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-600"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Imprimir</span>
                </button>
                <button
                  onClick={() => setDossieModalAberto(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Corpo do Dossiê Formatado para Laudo */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-slate-800 text-xs sm:text-sm">
              
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Protocolo SISRUA</span>
                  <span className="font-mono font-bold text-slate-900">{selectedCredenciado.codigo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Nome Fictício / Ético</span>
                  <span className="font-bold text-slate-900">{selectedCredenciado.nomeFicticio}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Jurisdição Operacional</span>
                  <span className="font-bold text-slate-900">SAS Vila Mariana</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Tempo em Situação de Rua</span>
                  <span className="text-slate-800">{selectedCredenciado.tempoEmSituacaoRua}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Status Atual</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${statusLabels[selectedCredenciado.statusAtual].color}`}>
                    {statusLabels[selectedCredenciado.statusAtual].label}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold block">Animal de Estimação</span>
                  <span className="font-semibold text-slate-800">{selectedCredenciado.possuiPet ? 'Sim (Vaga Pet Requerida)' : 'Não'}</span>
                </div>
              </div>

              {/* Avaliação Técnica Multidisciplinar */}
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-emerald-600" />
                  Parecer Técnico e Linha de Cuidado
                </h4>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Cidadão acompanhado regularmente pela equipe SEAS da Subprefeitura Vila Mariana. Apresenta boa receptividade ao diálogo, com demanda prioritária por alimentação e acolhimento transitório. Inserção no Cadastro Único (CadÚnico) providenciada para viabilização de benefícios eventuais e moradia assistida.
                </p>
              </div>

              {/* Tabela de Abordagens */}
              <div className="border-t border-slate-200 pt-4 space-y-2">
                <h4 className="font-bold text-slate-900 uppercase text-xs tracking-wider flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  Histórico Auditável de Abordagens em Campo
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="px-3 py-2">Data</th>
                        <th className="px-3 py-2">Local</th>
                        <th className="px-3 py-2">Desfecho</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedCredenciado.historico.map(h => (
                        <tr key={h.id}>
                          <td className="px-3 py-2 font-mono text-[11px]">{new Date(h.data).toLocaleDateString('pt-BR')}</td>
                          <td className="px-3 py-2">{h.localizacaoTexto}</td>
                          <td className="px-3 py-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${statusLabels[h.resultado].color}`}>
                              {statusLabels[h.resultado].label}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Termo de Confidencialidade LGPD e SUAS */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] text-slate-500 leading-relaxed">
                Este dossiê contém dados pessoais protegidos pela Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018) e pelas diretrizes do Sistema Único de Assistência Social (SUAS). O uso destas informações é restrito ao planejamento socioassistencial governamental.
              </div>

            </div>

            {/* Rodapé do Modal */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setDossieModalAberto(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors"
              >
                Fechar
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL DE RESERVA DE VAGA NO CTA / ABRIGO VIA SISRUA */}
      {reservaModalUnidade && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-900 font-bold text-base">
                <Bed className="w-5 h-5 text-indigo-600" />
                <span>Confirmar Reserva de Vaga</span>
              </div>
              <button onClick={() => setReservaModalUnidade(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-2">
              <div>
                <span className="text-slate-500 font-semibold block">Unidade de Destino:</span>
                <span className="font-bold text-slate-800">{reservaModalUnidade.nome}</span>
              </div>
              <div>
                <span className="text-slate-500 font-semibold block">Endereço:</span>
                <span className="text-slate-700">{reservaModalUnidade.endereco} • {reservaModalUnidade.bairro}</span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-slate-200">
                <span className="text-slate-500 font-semibold">Vagas Restantes:</span>
                <span className="font-mono font-bold text-emerald-600">{reservaModalUnidade.vagasLivres}</span>
              </div>
            </div>

            <div className="text-xs text-slate-600 leading-relaxed">
              Ao confirmar, um voucher de encaminhamento institucional (SISRUA) será emitido com prazo de tolerância de <strong>3 horas</strong> para acolhida e recepção do cidadão na unidade.
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setReservaModalUnidade(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmarReservaVaga}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar Reserva</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
