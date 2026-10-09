import { FonteDadosPublica, PontoFontePublica } from './types';

export const ROTULO_FIXO_FONTE = 'dado ilustrativo — formato compatível com fonte real' as const;

// 1. SSP-SP: Segurança Pública, Patrulhamento e Indicadores Criminais
const PONTOS_SSP_SP: PontoFontePublica[] = [
  { id: 'ssp-1', lat: -23.5489, lng: -46.6388, intensidade: 0.85, titulo: 'Índice de Roubos/Furtos - Praça da Sé', metricaPrincipal: '18.4 ocorr./10k hab', detalhe: 'Área comercial com reforço policial preventivo', subprefeituraId: '1', subprefeituraNome: 'Sé' },
  { id: 'ssp-2', lat: -23.5350, lng: -46.6340, intensidade: 0.90, titulo: 'Índice de Furtos - Região da Luz / Bom Retiro', metricaPrincipal: '22.1 ocorr./10k hab', detalhe: 'Monitoramento integrado Smart Sampa', subprefeituraId: '1', subprefeituraNome: 'Sé' },
  { id: 'ssp-3', lat: -23.5532, lng: -46.6560, intensidade: 0.60, titulo: 'Patrulhamento Preventivo - Consolação/Paulista', metricaPrincipal: '11.8 ocorr./10k hab', detalhe: 'Policiamento comunitário e câmeras municipais', subprefeituraId: '1', subprefeituraNome: 'Sé' },
  { id: 'ssp-4', lat: -23.5670, lng: -46.6490, intensidade: 0.45, titulo: 'Indicador de Segurança - Paraíso', metricaPrincipal: '8.2 ocorr./10k hab', detalhe: 'Índice controlado abaixo da média municipal', subprefeituraId: '2', subprefeituraNome: 'Vila Mariana' },
  { id: 'ssp-5', lat: -23.5890, lng: -46.6350, intensidade: 0.50, titulo: 'Monitoramento - Vila Mariana Central', metricaPrincipal: '9.4 ocorr./10k hab', detalhe: 'Rondas periódicas diurnas e noturnas', subprefeituraId: '2', subprefeituraNome: 'Vila Mariana' },
  { id: 'ssp-6', lat: -23.5590, lng: -46.6020, intensidade: 0.70, titulo: 'Índice de Roubos de Veículos - Brás/Mooca', metricaPrincipal: '15.6 ocorr./10k hab', detalhe: 'Policiamento tático em entroncamentos fabris', subprefeituraId: '3', subprefeituraNome: 'Mooca' },
  { id: 'ssp-7', lat: -23.5720, lng: -46.5850, intensidade: 0.55, titulo: 'Ocorrências Patrimoniais - Alto da Mooca', metricaPrincipal: '10.3 ocorr./10k hab', detalhe: 'Estabilidade trimestral registrada no boletim', subprefeituraId: '3', subprefeituraNome: 'Mooca' },
  { id: 'ssp-8', lat: -23.5650, lng: -46.7020, intensidade: 0.65, titulo: 'Furtos a Transeuntes - Eixo Faria Lima/Pinheiros', metricaPrincipal: '14.1 ocorr./10k hab', detalhe: 'Foco em saídas de metrô e polos gastronômicos', subprefeituraId: '4', subprefeituraNome: 'Pinheiros' },
  { id: 'ssp-9', lat: -23.5550, lng: -46.6850, intensidade: 0.40, titulo: 'Indicador Geral - Vila Madalena', metricaPrincipal: '7.8 ocorr./10k hab', detalhe: 'Operação de fiscalização integrada (PSIU e PM)', subprefeituraId: '4', subprefeituraNome: 'Pinheiros' },
  { id: 'ssp-10', lat: -23.5180, lng: -46.7050, intensidade: 0.68, titulo: 'Ocorrências Noturnas - Lapa de Baixo', metricaPrincipal: '13.9 ocorr./10k hab', detalhe: 'Próximo à linha férrea e galpões logísticos', subprefeituraId: '5', subprefeituraNome: 'Lapa' },
  { id: 'ssp-11', lat: -23.5310, lng: -46.6890, intensidade: 0.52, titulo: 'Patrulhamento - Perdizes / Lapa', metricaPrincipal: '9.1 ocorr./10k hab', detalhe: 'Cobertura por viaturas de ronda ostensiva', subprefeituraId: '5', subprefeituraNome: 'Lapa' },
  { id: 'ssp-12', lat: -23.5780, lng: -46.7150, intensidade: 0.58, titulo: 'Indicador de Segurança - Butantã / Corifeu', metricaPrincipal: '11.2 ocorr./10k hab', detalhe: 'Ponto de atenção em passarelas e travessias', subprefeituraId: '6', subprefeituraNome: 'Butantã' },
  { id: 'ssp-13', lat: -23.6490, lng: -46.7650, intensidade: 0.78, titulo: 'Patrulhamento Comunitário - Eixo Campo Limpo', metricaPrincipal: '16.7 ocorr./10k hab', detalhe: 'Operações integradas com GCM e Polícia Militar', subprefeituraId: '7', subprefeituraNome: 'Campo Limpo' },
  { id: 'ssp-14', lat: -23.7420, lng: -46.7190, intensidade: 0.72, titulo: 'Ocorrências Rurais e Urbanas - Capela do Socorro', metricaPrincipal: '15.0 ocorr./10k hab', detalhe: 'Vigilância em áreas de represa e periferias', subprefeituraId: '8', subprefeituraNome: 'Capela do Socorro' },
];

// 2. IBGE: Densidade Populacional e Renda Média Domiciliar
const PONTOS_IBGE: PontoFontePublica[] = [
  { id: 'ibge-1', lat: -23.5475, lng: -46.6361, intensidade: 0.88, titulo: 'Densidade Demográfica - República / Sé', metricaPrincipal: '19.820 hab/km²', detalhe: '431.106 habitantes no distrito censitário', subprefeituraId: '1', subprefeituraNome: 'Sé' },
  { id: 'ibge-2', lat: -23.5600, lng: -46.6530, intensidade: 0.92, titulo: 'Densidade Residencial - Bela Vista', metricaPrincipal: '23.400 hab/km²', detalhe: 'Elevada concentração vertical de moradias', subprefeituraId: '1', subprefeituraNome: 'Sé' },
  { id: 'ibge-3', lat: -23.5870, lng: -46.6400, intensidade: 0.75, titulo: 'Perfil Populacional - Vila Mariana', metricaPrincipal: '13.200 hab/km²', detalhe: 'Renda média: 6.8 salários mínimos (Censo)', subprefeituraId: '2', subprefeituraNome: 'Vila Mariana' },
  { id: 'ibge-4', lat: -23.6020, lng: -46.6210, intensidade: 0.70, titulo: 'Densidade - Saúde / Vila Mariana', metricaPrincipal: '12.450 hab/km²', detalhe: '293.309 habitantes na área administrativa', subprefeituraId: '2', subprefeituraNome: 'Vila Mariana' },
  { id: 'ibge-5', lat: -23.5580, lng: -46.5910, intensidade: 0.82, titulo: 'Perfil Urbano - Mooca Central', metricaPrincipal: '14.800 hab/km²', detalhe: 'População de 350.567 hab com transição fabril', subprefeituraId: '3', subprefeituraNome: 'Mooca' },
  { id: 'ibge-6', lat: -23.5430, lng: -46.5820, intensidade: 0.80, titulo: 'Densidade Domiciliar - Belém / Pari', metricaPrincipal: '16.100 hab/km²', detalhe: 'Grande concentração de habitações coletivas', subprefeituraId: '3', subprefeituraNome: 'Mooca' },
  { id: 'ibge-7', lat: -23.5620, lng: -46.6950, intensidade: 0.65, titulo: 'Censo Demográfico - Pinheiros', metricaPrincipal: '9.800 hab/km²', detalhe: '289.743 habitantes, alta renda per capita', subprefeituraId: '4', subprefeituraNome: 'Pinheiros' },
  { id: 'ibge-8', lat: -23.5750, lng: -46.6800, intensidade: 0.60, titulo: 'Perfil Demográfico - Jardim Paulista', metricaPrincipal: '8.400 hab/km²', detalhe: 'Bairro residencial de baixa verticalização', subprefeituraId: '4', subprefeituraNome: 'Pinheiros' },
  { id: 'ibge-9', lat: -23.5250, lng: -46.7010, intensidade: 0.76, titulo: 'Densidade - Lapa / Leopoldina', metricaPrincipal: '11.700 hab/km²', detalhe: '312.045 habitantes, mistura residencial e comercial', subprefeituraId: '5', subprefeituraNome: 'Lapa' },
  { id: 'ibge-10', lat: -23.5730, lng: -46.7110, intensidade: 0.64, titulo: 'Censo e Demografia - Butantã', metricaPrincipal: '8.900 hab/km²', detalhe: '402.190 habitantes, expansão universitária', subprefeituraId: '6', subprefeituraNome: 'Butantã' },
  { id: 'ibge-11', lat: -23.6460, lng: -46.7640, intensidade: 0.95, titulo: 'Alta Densidade - Campo Limpo / Pirajuçara', metricaPrincipal: '21.500 hab/km²', detalhe: '612.340 habitantes, distrito de grande expansão', subprefeituraId: '7', subprefeituraNome: 'Campo Limpo' },
  { id: 'ibge-12', lat: -23.7390, lng: -46.7180, intensidade: 0.89, titulo: 'Densidade Periférica - Grajaú / Capela do Socorro', metricaPrincipal: '17.300 hab/km²', detalhe: '684.200 habitantes, maior contingente da zona sul', subprefeituraId: '8', subprefeituraNome: 'Capela do Socorro' },
];

// 3. CET: Fluxo Viário, Lentidão e Incidentes de Trânsito em Tempo Real
const PONTOS_CET: PontoFontePublica[] = [
  { id: 'cet-1', lat: -23.5510, lng: -46.6350, intensidade: 0.85, titulo: 'Gargalo Viário - Viaduto do Chá / Líbero Badaró', metricaPrincipal: 'Lentidão: 14 km/h', detalhe: 'Corredor exclusivo de ônibus e tráfego local denso', subprefeituraId: '1', subprefeituraNome: 'Sé' },
  { id: 'cet-2', lat: -23.5410, lng: -46.6300, intensidade: 0.92, titulo: 'Congestionamento - Av. do Estado / Parque Dom Pedro', metricaPrincipal: 'Lentidão: 9 km/h', detalhe: 'Risco de retenção em horários de pico e chuvas', subprefeituraId: '1', subprefeituraNome: 'Sé' },
  { id: 'cet-3', lat: -23.5820, lng: -46.6450, intensidade: 0.80, titulo: 'Fluxo Crítico - Corredor 23 de Maio / Ibirapuera', metricaPrincipal: 'Velocidade: 22 km/h', detalhe: 'Ponto sensível a acidentes e interferências viárias', subprefeituraId: '2', subprefeituraNome: 'Vila Mariana' },
  { id: 'cet-4', lat: -23.5950, lng: -46.6300, intensidade: 0.70, titulo: 'Incidente Semafórico - Av. Domingos de Morais', metricaPrincipal: 'Retenção: 1.8 km', detalhe: 'Manutenção emergencial acionada pela CET', subprefeituraId: '2', subprefeituraNome: 'Vila Mariana' },
  { id: 'cet-5', lat: -23.5480, lng: -46.5980, intensidade: 0.88, titulo: 'Estrangulamento Viário - Radial Leste / Alcântara Machado', metricaPrincipal: 'Lentidão: 11 km/h', detalhe: 'Principal artéria de ligação Centro-Zona Leste', subprefeituraId: '3', subprefeituraNome: 'Mooca' },
  { id: 'cet-6', lat: -23.5640, lng: -46.5900, intensidade: 0.65, titulo: 'Fluxo de Carga - Av. Salim Farah Maluf', metricaPrincipal: 'Fluxo: 4.200 veíc/h', detalhe: 'Tráfego pesado de caminhões e carretas', subprefeituraId: '3', subprefeituraNome: 'Mooca' },
  { id: 'cet-7', lat: -23.5700, lng: -46.6980, intensidade: 0.90, titulo: 'Gargalo Crítico - Marginal Pinheiros / Ponte Eusébio Matoso', metricaPrincipal: 'Lentidão: 8 km/h', detalhe: 'Extensa fila na pista expressa sentido Interlagos', subprefeituraId: '4', subprefeituraNome: 'Pinheiros' },
  { id: 'cet-8', lat: -23.5610, lng: -46.6890, intensidade: 0.75, titulo: 'Corredor Faria Lima - Rebouças', metricaPrincipal: 'Velocidade: 18 km/h', detalhe: 'Intensa circulação de ciclistas, táxis e pedestres', subprefeituraId: '4', subprefeituraNome: 'Pinheiros' },
  { id: 'cet-9', lat: -23.5190, lng: -46.6980, intensidade: 0.93, titulo: 'Congestionamento Marginal Tietê - Ponte dos Remédios / Lapa', metricaPrincipal: 'Lentidão: 7 km/h', detalhe: 'Fila de 6.4 km na pista central e local', subprefeituraId: '5', subprefeituraNome: 'Lapa' },
  { id: 'cet-10', lat: -23.5760, lng: -46.7180, intensidade: 0.82, titulo: 'Estrangulamento - Rodovia Raposo Tavares km 10 / Butantã', metricaPrincipal: 'Lentidão: 12 km/h', detalhe: 'Acesso saturado à Av. Francisco Morato', subprefeituraId: '6', subprefeituraNome: 'Butantã' },
  { id: 'cet-11', lat: -23.6420, lng: -46.7580, intensidade: 0.86, titulo: 'Corredor Estrutural - Estrada de Itapecerica / Campo Limpo', metricaPrincipal: 'Lentidão: 13 km/h', detalhe: 'Gargalo em cruzamentos com faixas de pedestre', subprefeituraId: '7', subprefeituraNome: 'Campo Limpo' },
  { id: 'cet-12', lat: -23.7320, lng: -46.7120, intensidade: 0.78, titulo: 'Avenida Dona Belmira Marin - Capela do Socorro', metricaPrincipal: 'Lentidão: 15 km/h', detalhe: 'Principal via comercial do distrito de Grajaú', subprefeituraId: '8', subprefeituraNome: 'Capela do Socorro' },
];

// 4. Prefeitura / SP156 (Histórico Retroativo de Zeladoria)
const PONTOS_SP156_HISTORICO: PontoFontePublica[] = [
  { id: 'hist-1', lat: -23.5520, lng: -46.6310, intensidade: 0.82, titulo: 'Histórico de Alagamentos Crônicos - Várzea do Tamanduateí', metricaPrincipal: '142 chamados/ano', detalhe: 'Média histórica consolidada do SP156 (2022-2025)', subprefeituraId: '1', subprefeituraNome: 'Sé' },
  { id: 'hist-2', lat: -23.5460, lng: -46.6420, intensidade: 0.74, titulo: 'Recorrência de Poda/Queda Arbórea - República / Higienópolis', metricaPrincipal: '98 chamados/ano', detalhe: 'Árvores de grande porte com monitoramento preventivo', subprefeituraId: '1', subprefeituraNome: 'Sé' },
  { id: 'hist-3', lat: -23.5840, lng: -46.6380, intensidade: 0.65, titulo: 'Histórico de Tapa-Buraco - Vila Mariana', metricaPrincipal: '76 chamados/ano', detalhe: 'Vias com recapeamento prioritário no plano plurianual', subprefeituraId: '2', subprefeituraNome: 'Vila Mariana' },
  { id: 'hist-4', lat: -23.5540, lng: -46.5960, intensidade: 0.88, titulo: 'Reincidência de Descarte Irregular - Mooca / Pari', metricaPrincipal: '210 chamados/ano', detalhe: 'Ecopontos e fiscalização de postura instalados', subprefeituraId: '3', subprefeituraNome: 'Mooca' },
  { id: 'hist-5', lat: -23.5630, lng: -46.6990, intensidade: 0.60, titulo: 'Histórico de Barulho Urbano (PSIU) - Pinheiros / Vila Madalena', metricaPrincipal: '184 chamados/ano', detalhe: 'Concentração sazonal em fins de semana e feriados', subprefeituraId: '4', subprefeituraNome: 'Pinheiros' },
  { id: 'hist-6', lat: -23.5240, lng: -46.7040, intensidade: 0.78, titulo: 'Bueiros e Galerias Pluviais - Lapa / Leopoldina', metricaPrincipal: '115 chamados/ano', detalhe: 'Histórico de manutenção desobstrutiva mecânica', subprefeituraId: '5', subprefeituraNome: 'Lapa' },
  { id: 'hist-7', lat: -23.5700, lng: -46.7130, intensidade: 0.58, titulo: 'Desobstrução e Zeladoria - Butantã / Rio Pequeno', metricaPrincipal: '88 chamados/ano', detalhe: 'Taxa de resolução histórica de 92.4%', subprefeituraId: '6', subprefeituraNome: 'Butantã' },
  { id: 'hist-8', lat: -23.6480, lng: -46.7620, intensidade: 0.84, titulo: 'Manutenção Asfáltica - Campo Limpo', metricaPrincipal: '164 chamados/ano', detalhe: 'Trechos com declive e drenagem reforçada', subprefeituraId: '7', subprefeituraNome: 'Campo Limpo' },
  { id: 'hist-9', lat: -23.7400, lng: -46.7210, intensidade: 0.86, titulo: 'Limpeza de Córregos e Encostas - Capela do Socorro', metricaPrincipal: '195 chamados/ano', detalhe: 'Ações conjuntas da Defesa Civil e Subprefeitura', subprefeituraId: '8', subprefeituraNome: 'Capela do Socorro' },
];

export const CATALOGO_FONTES_PUBLICAS: FonteDadosPublica[] = [
  {
    id: 'SSP_SP',
    sigla: 'SSP-SP',
    nome: 'SSP-SP — Segurança Pública e Ocorrências',
    orgao: 'Secretaria de Segurança Pública do Estado de SP',
    atualizacao: 'Mensal',
    rotuloFixo: ROTULO_FIXO_FONTE,
    descricao: 'Indicadores georreferenciados de criminalidade, policiamento ostensivo, roubos/furtos e patrulhamento preventivo da GCM e PM.',
    corPrimaria: 'text-purple-600 border-purple-300 bg-purple-50',
    corHex: '#8b5cf6',
    gradienteHeatmap: {
      0.3: 'rgba(192, 132, 252, 0.4)',
      0.5: 'rgba(168, 85, 247, 0.7)',
      0.8: 'rgba(139, 92, 246, 0.9)',
      1.0: '#581c87'
    },
    totalRegistros: 14280,
    unidadeMedida: 'ocorrências / 10k hab',
    ativa: false,
    pontos: PONTOS_SSP_SP
  },
  {
    id: 'IBGE',
    sigla: 'IBGE',
    nome: 'IBGE — Demografia e Renda por Distrito',
    orgao: 'Instituto Brasileiro de Geografia e Estatística',
    atualizacao: 'Trimestral',
    rotuloFixo: ROTULO_FIXO_FONTE,
    descricao: 'Concentração demográfica, densidade populacional (hab/km²), contagem de domicílios e estrato de renda média dos distritos paulistanos.',
    corPrimaria: 'text-cyan-600 border-cyan-300 bg-cyan-50',
    corHex: '#06b6d4',
    gradienteHeatmap: {
      0.3: 'rgba(103, 232, 249, 0.4)',
      0.5: 'rgba(6, 182, 212, 0.7)',
      0.8: 'rgba(2, 132, 199, 0.9)',
      1.0: '#0c4a6e'
    },
    totalRegistros: 48920,
    unidadeMedida: 'habitantes / km²',
    ativa: false,
    pontos: PONTOS_IBGE
  },
  {
    id: 'CET',
    sigla: 'CET',
    nome: 'CET — Fluxo Viário e Incidentes de Trânsito',
    orgao: 'Companhia de Engenharia de Tráfego de São Paulo',
    atualizacao: 'Tempo Real',
    rotuloFixo: ROTULO_FIXO_FONTE,
    descricao: 'Monitoramento dinâmico de lentidão em corredores viários, semáforos com defeito, interferências na pista e velocidade média.',
    corPrimaria: 'text-amber-600 border-amber-300 bg-amber-50',
    corHex: '#f59e0b',
    gradienteHeatmap: {
      0.3: 'rgba(253, 230, 138, 0.4)',
      0.5: 'rgba(245, 158, 11, 0.7)',
      0.8: 'rgba(234, 88, 12, 0.9)',
      1.0: '#7c2d12'
    },
    totalRegistros: 8750,
    unidadeMedida: 'km de lentidão / velocidade',
    ativa: false,
    pontos: PONTOS_CET
  },
  {
    id: 'SP156_HISTORICO',
    sigla: 'SP156 Histórico',
    nome: 'Prefeitura/SP156 — Histórico Retroativo de Zeladoria',
    orgao: 'Secretaria Municipal de Gestão e Governo Local (SMG)',
    atualizacao: 'Mensal',
    rotuloFixo: ROTULO_FIXO_FONTE,
    descricao: 'Série histórica plurianual consolidada dos chamados do SP156 para identificação de padrões sazonais de zeladoria e recorrência.',
    corPrimaria: 'text-emerald-600 border-emerald-300 bg-emerald-50',
    corHex: '#10b981',
    gradienteHeatmap: {
      0.3: 'rgba(167, 243, 208, 0.4)',
      0.5: 'rgba(52, 211, 153, 0.7)',
      0.8: 'rgba(16, 185, 129, 0.9)',
      1.0: '#064e3b'
    },
    totalRegistros: 125400,
    unidadeMedida: 'demandas consolidadas / ano',
    ativa: false,
    pontos: PONTOS_SP156_HISTORICO
  }
];
