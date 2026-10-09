export type StatusChamado = 'NOVO' | 'ENCAMINHADO' | 'EM_EXECUCAO' | 'AGUARDANDO_APROVACAO' | 'CONCLUIDO';
export type PrioridadeChamado = 'BAIXA' | 'MEDIA' | 'ALTA' | 'URGENTE';
export type CategoriaChamado = 
  | 'MORADOR_RUA' 
  | 'ARVORE_CAIDA' 
  | 'BUEIRO' 
  | 'BARULHO_PSIU' 
  | 'CALCADA' 
  | 'TAPA_BURACO' 
  | 'FISCALIZACAO_POSTURA' 
  | 'DESFAZIMENTO';

export interface Subprefeitura {
  id: string;
  nome: string;
  lat: number;
  lng: number;
}

export interface Chamado {
  id: string;
  protocolo: string;
  categoria: CategoriaChamado;
  subprefeituraId: string;
  distrito?: 'Vila Mariana' | 'Moema' | 'Saúde' | string;
  bairro?: string;
  status: StatusChamado;
  prioridade: PrioridadeChamado;
  lat: number;
  lng: number;
  dataAbertura: string; // ISO string
  isAtrasado: boolean;
  endereco?: string;
  fotoAntes?: string;
  fotoDepois?: string;
  origem?: 'SP156_WEB' | 'WHATSAPP_SP156' | 'APP_CAMPO' | 'TELEFONE_156';
  telefoneCidadao?: string;
}

// Tipos da Simulação Zap (WhatsApp SP156)
export type ZapSender = 'CIDADAO' | 'BOT_SP156' | 'SISTEMA';
export type ZapMessageStatus = 'ENVIANDO' | 'ENVIADO' | 'ENTREGUE' | 'LIDO';
export type ZapAttachmentType = 'TEXTO' | 'FOTO' | 'LOCALIZACAO' | 'PROTOCOLO' | 'AVALIACAO' | 'BOTAO_ACAO';

export interface ZapMessage {
  id: string;
  remetente: ZapSender;
  texto: string;
  timestamp: string; // ex: "14:32"
  statusEnvio?: ZapMessageStatus;
  tipoAnexo?: ZapAttachmentType;
  anexoUrl?: string;
  anexoDados?: {
    endereco?: string;
    lat?: number;
    lng?: number;
    protocolo?: string;
    categoria?: CategoriaChamado;
    statusChamado?: StatusChamado;
    prazoHoras?: number;
    avaliacaoEstrelas?: number;
    subprefeituraNome?: string;
    fotoDepois?: string;
  };
  opcoesRespostaRapida?: string[];
}

export type ZapEtapaConversa = 
  | 'INICIAL' 
  | 'MENU_PRINCIPAL'
  | 'AGUARDANDO_DESCRICAO' 
  | 'AGUARDANDO_FOTO' 
  | 'AGUARDANDO_LOCAL' 
  | 'CONFIRMA_ABERTURA' 
  | 'CHAMADO_CRIADO' 
  | 'CONSULTANDO_STATUS' 
  | 'AGUARDANDO_AVALIACAO' 
  | 'FINALIZADO';

export interface ZapChatSession {
  conversaId: string;
  numeroTelefone: string;
  nomeCidadao: string;
  etapaAtual: ZapEtapaConversa;
  categoriaSugerida?: CategoriaChamado;
  descricaoTemp?: string;
  fotoTemp?: string;
  enderecoTemp?: string;
  subprefeituraIdTemp?: string;
  protocoloAtivo?: string;
  mensagens: ZapMessage[];
}

// Tipos do Infográfico Executivo e Métricas Regionais
export interface MetricasRegionais {
  subprefeituraId: string;
  nome: string;
  zona: 'CENTRO' | 'NORTE' | 'SUL' | 'LESTE' | 'OESTE';
  populacao: number;
  totalDemandas: number;
  demandasPor10k: number;
  tmaHoras: number;
  slaCumpridoPercentual: number;
  taxaReincidenciaPercentual: number;
  taxaResolucaoPercentual: number;
  chamadosAbertos: number;
  chamadosConcluidos: number;
  criticidadeAlta: number;
}

export interface FunilAtendimentoItem {
  etapa: string;
  status: StatusChamado;
  total: number;
  percentual: number;
  tempoMedioEtapaHoras: number;
}

export interface InfograficoExecutivoData {
  funil: FunilAtendimentoItem[];
  totalChamados: number;
  taxaResolucaoGeral: number;
  tmaGeralHoras: number;
  slaGeralPercentual: number;
  distribuicaoCriticidade: {
    urgente: number;
    alta: number;
    media: number;
    baixa: number;
  };
  eficienciaPorCategoria: {
    categoria: CategoriaChamado;
    total: number;
    tmaHoras: number;
    slaPercentual: number;
  }[];
}

// Tipos do Catálogo de Fontes de Dados Públicos (Mock)
export type TipoAtualizacaoFonte = 'Mensal' | 'Trimestral' | 'Tempo Real';
export type IdFonteDadosPublica = 'SSP_SP' | 'IBGE' | 'CET' | 'SP156_HISTORICO';

export interface PontoFontePublica {
  id: string;
  lat: number;
  lng: number;
  intensidade: number; // 0.1 a 1.0 para heatmap
  titulo: string;
  metricaPrincipal: string;
  detalhe: string;
  subprefeituraId?: string;
  subprefeituraNome?: string;
}

export interface FonteDadosPublica {
  id: IdFonteDadosPublica;
  sigla: string;
  nome: string;
  orgao: string;
  atualizacao: TipoAtualizacaoFonte;
  rotuloFixo: 'dado ilustrativo — formato compatível com fonte real';
  descricao: string;
  corPrimaria: string; // Tailwind/HEX
  corHex: string;
  gradienteHeatmap: Record<number, string>;
  totalRegistros: number;
  unidadeMedida: string;
  ativa: boolean;
  pontos: PontoFontePublica[];
}

// Tipos de Motores e Visualizações Cartográficas Profissionais
export type MapEngineType = 
  | 'LEAFLET'            // Leaflet GovTech SP156 (Operacional Padrão)
  | 'MAPLIBRE_GL'        // MapLibre GL Vetorial 3D (GPU de Alta Precisão & Quarteirões)
  | 'SATELITE_ORTOFOTO'  // Satélite & Ortofoto Híbrida de Alta Resolução (Esri / GeoSampa)
  | 'CHOROPLETH_32_SUBS' // Análise Territorial da SUB-VM (polígono oficial e indicadores)
  | 'SERVICE_BUFFERS'    // Cobertura Operacional & Buffers de Acessibilidade (Polos Cívicos & Bases)
  | 'HEATMAP_KERNEL'     // Mapa de Calor & Densidade Kernel (KDE Interativo)
  // Legado para compatibilidade retroativa
  | 'DECK_GL' 
  | 'D3_CHOROPLETH' 
  | 'DECK_HEXBIN' 
  | 'BUFFER_RADAR';

export interface MapEngineInfo {
  id: MapEngineType;
  nome: string;
  biblioteca: string;
  descricao: string;
  icone: string;
  badge: string;
}

// Tipos do Sistema de Mapeamento de Camadas (Internas x Externas GeoJSON/WMS)
export type TipoCamadaMapeada = 'INTERNA' | 'EXTERNA_GEOJSON' | 'EXTERNA_WMS';

export type CategoriaAnalogaAnexo = 
  | 'TOPOGRAFIA_RELEVO'        // Anexo 1 - Topography / Elevation 256.5m - 500m
  | 'CIRCULACAO_VIAS'          // Anexo 1 e Anexo 3 - Circulation / Primary / Secondary / Access
  | 'AREAS_VERDES'             // Anexo 1 e Anexo 3 - Green & Open Spaces / Parques / Jardins
  | 'FORMA_CONSTRUIDA_3D'      // Anexo 1 e Anexo 2 - Built Form / Isometric Cadastre / 3D Buildings
  | 'EQUIPAMENTOS_BIBLIOTECAS' // Anexos 2, 3 e 4 - Reims "Équipements majeurs", Budapest "Culture / Landmark" & Bibliotecas de SP
  | 'SATELITE_CONTEXTO'        // Anexo 1 - Satellite Context / Ortofoto WMS
  | 'ZELADORIA_SP156';         // Camada Interna Operacional

export interface BibliotecaPublicaGeolocalizada {
  id: string;
  nome: string;
  tipo: 'BIBLIOTECA_MUNICIPAL' | 'PONTO_DE_LEITURA' | 'CENTRO_CULTURAL' | 'BIBLIOTECA_TEMATICA';
  subprefeituraId: string;
  subprefeituraNome: string;
  distrito: string;
  endereco: string;
  lat: number;
  lng: number;
  acervoEspecialidade: string;
  anoFundacao?: number;
  horarioFuncionamento: string;
  acessibilidadePCD: boolean;
  raioProtecaoZeladoriaMetros: number; // Raio de influência cívica/acessibilidade (ex: 500m)
  papelAnalogoAnexo: string; // Explicitação do papel análogo aos anexos
  chamadosNoEntornoCount?: number;
}

export interface CamadaMapeada {
  id: string;
  nome: string;
  descricao: string;
  tipo: TipoCamadaMapeada;
  categoriaAnaloga: CategoriaAnalogaAnexo;
  formato: 'GEOJSON' | 'WMS' | 'INTERNAL_OBJECTS' | 'VECTOR';
  urlServico?: string;
  provedor: string;
  ativa: boolean;
  opacidade: number; // 0.1 a 1.0
  ordemZ: number; // 1 a 6 (usado no empilhamento 3D axonométrico)
  corPrimaria: string;
  icone: string;
  totalElementos: number;
  dadosGeoJson?: any;
  itensDetalhados?: BibliotecaPublicaGeolocalizada[] | any[];
}

// Tipos do Sistema de Cruzamento de Camadas (Interno x Externo)
export interface HotspotCruzamento {
  id: string;
  chamadoId: string;
  chamadoProtocolo: string;
  chamadoCategoria: CategoriaChamado;
  chamadoEndereco?: string;
  chamadoLat: number;
  chamadoLng: number;
  chamadoPrioridade: PrioridadeChamado;
  chamadoStatus: StatusChamado;
  pontoPublicoId: string;
  fonteId: IdFonteDadosPublica;
  fonteSigla: string;
  fonteNome: string;
  pontoTitulo: string;
  pontoMetrica: string;
  pontoLat: number;
  pontoLng: number;
  distanciaMetros: number;
  grauRisco: 'CRITICO' | 'ALTO' | 'MODERADO';
  diagnosticoCruzado: string;
  recomendacaoOperacional: string;
  subprefeituraNome: string;
}

export interface ResumoCruzamentoCamadas {
  totalHotspots: number;
  criticos: number;
  altos: number;
  moderados: number;
  distanciaMediaMetros: number;
  distritoMaisAfetado: string;
  principaisCorrelacoes: {
    categoria: CategoriaChamado;
    fonte: IdFonteDadosPublica;
    quantidade: number;
  }[];
}

// Tipos do Changelog Centralizado
export interface ChangelogItem {
  fase: string;
  data: string;
  titulo: string;
  resumo: string;
  destaques: string[];
}

export type PainelAdminTab = 'COCKPIT' | 'KANBAN' | 'WHATSAPP';

// Tipos do Sistema Global de Notificações Toast Institucionais
export interface SystemNotification {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'sucesso' | 'info' | 'alerta' | 'urgente';
  timestamp: string;
  linkSection?: 'sala_situacao' | 'painel_admin' | 'app_campo' | 'simulacao_zap' | 'modulo_social';
  linkAdminTab?: PainelAdminTab;
  protocolo?: string;
}

// Tipos do Modo Demonstração Executiva (Pitch / Roteiro de Vendas)
export interface PitchTourStep {
  id: number;
  titulo: string;
  ator: string;
  moduloAlvo: 'simulacao_zap' | 'sala_situacao' | 'painel_admin' | 'app_campo' | 'modulo_social';
  argumentoVenda: string;
  destaqueFuncional: string;
  acaoSugerida: string;
}


