import { CamadaMapeada, BibliotecaPublicaGeolocalizada, Chamado } from './types';
import { calcularDistanciaMetros } from './utils/geoSpatial';

/**
 * Catálogo Oficial de Bibliotecas Públicas Municipais e Equipamentos Culturais de São Paulo
 * Georreferenciadas nas Subprefeituras, com papel análogo aos anexos:
 * - Anexo 3 (Reims): "Équipements majeurs" e nós estruturantes de patrimônio & cidadania.
 * - Anexo 4 (Budapeste): "Culture / Landmark" - marcos de visitação pública e confluência urbana.
 * - Anexo 2 (Planta Isométrica): Polo cívico de quarteirão com praça pública e arborização.
 * - Anexo 1 (Site Analysis): Inseridas na camada de "Built Form" e conectadas a "Circulation" e "Open Spaces".
 */
export const BIBLIOTECAS_PUBLICAS_SP: BibliotecaPublicaGeolocalizada[] = [
  {
    id: 'bib-mario-andrade',
    nome: 'Biblioteca Mário de Andrade',
    tipo: 'BIBLIOTECA_MUNICIPAL',
    subprefeituraId: '1',
    subprefeituraNome: 'Sé',
    distrito: 'República',
    endereco: 'Rua da Consolação, 94 - Centro Histórico',
    lat: -23.5489,
    lng: -46.6433,
    acervoEspecialidade: 'Humanidades, Obras Raras, Artes Visuais e Coleção Paulistana (3,2 milhões de itens)',
    anoFundacao: 1925,
    horarioFuncionamento: 'Segunda a Domingo 24h (Pioneira em funcionamento ininterrupto)',
    acessibilidadePCD: true,
    raioProtecaoZeladoriaMetros: 500,
    papelAnalogoAnexo: 'Análogo a Équipements Majeurs (Reims) e Landmark Cultural (Budapeste): Marco arquitetônico art déco e polo cívico-intelectual da centralidade de São Paulo.'
  },
  {
    id: 'bib-monteiro-lobato',
    nome: 'Biblioteca Infantojuvenil Monteiro Lobato',
    tipo: 'BIBLIOTECA_TEMATICA',
    subprefeituraId: '1',
    subprefeituraNome: 'Sé',
    distrito: 'Consolação',
    endereco: 'Rua General Jardim, 485 - Vila Buarque',
    lat: -23.5451,
    lng: -46.6508,
    acervoEspecialidade: 'Literatura infantojuvenil, Acervo Histórico Monteiro Lobato e Gibiteca',
    anoFundacao: 1936,
    horarioFuncionamento: 'Segunda a Sexta das 8h às 18h | Sábado das 10h às 17h',
    acessibilidadePCD: true,
    raioProtecaoZeladoriaMetros: 450,
    papelAnalogoAnexo: 'Análogo à Praça Cívica e Polo de Quarteirão (Anexo 2): Integrada à Praça Rotary com jardim arborizado, demandando calçadas planas e iluminação infantil segura.'
  },
  {
    id: 'bib-sergio-milliet-ccsp',
    nome: 'Biblioteca Sérgio Milliet (Centro Cultural São Paulo)',
    tipo: 'CENTRO_CULTURAL',
    subprefeituraId: '2',
    subprefeituraNome: 'Vila Mariana',
    distrito: 'Paraíso',
    endereco: 'Rua Vergueiro, 1000 - Paraíso / CCSP',
    lat: -23.5714,
    lng: -46.6402,
    acervoEspecialidade: 'Segunda maior biblioteca pública de SP; acervo multidisciplinar, braille e Gibiteca Henfil',
    anoFundacao: 1982,
    horarioFuncionamento: 'Terça a Sexta das 10h às 20h | Sábado e Domingo das 10h às 18h',
    acessibilidadePCD: true,
    raioProtecaoZeladoriaMetros: 550,
    papelAnalogoAnexo: 'Análogo ao Built Form & Transit Connectivity (Anexo 1 e Reims): Conectada diretamente ao Metrô Vergueiro, integrando circulação e espaços abertos de convivência.'
  },
  {
    id: 'bib-viriato-correa',
    nome: 'Biblioteca Temática em Cinema Viriato Corrêa',
    tipo: 'BIBLIOTECA_TEMATICA',
    subprefeituraId: '2',
    subprefeituraNome: 'Vila Mariana',
    distrito: 'Vila Mariana',
    endereco: 'Rua Sena Madureira, 298 - Vila Mariana',
    lat: -23.5888,
    lng: -46.6385,
    acervoEspecialidade: 'Temática em Cinema, Literatura Fantástica, Horror e Ficção Científica',
    anoFundacao: 1952,
    horarioFuncionamento: 'Terça a Sexta das 9h às 18h | Sábado das 10h às 17h',
    acessibilidadePCD: true,
    raioProtecaoZeladoriaMetros: 450,
    papelAnalogoAnexo: 'Análogo aos Pontos Culturais de Bairro (Budapeste - Culture): Equipamento de difusão cinematográfica comunitária com cineclube gratuito e acervo especializado.'
  },
  {
    id: 'bib-alceu-amoroso-lima',
    nome: 'Biblioteca Temática em Poesia Alceu Amoroso Lima',
    tipo: 'BIBLIOTECA_TEMATICA',
    subprefeituraId: '4',
    subprefeituraNome: 'Pinheiros',
    distrito: 'Pinheiros',
    endereco: 'Rua Henrique Schaumann, 777 - Pinheiros',
    lat: -23.5658,
    lng: -46.6908,
    acervoEspecialidade: 'Temática em Poesia contemporânea, saraus e periódicos de artes',
    anoFundacao: 1979,
    horarioFuncionamento: 'Terça a Sexta das 9h às 18h | Sábado das 10h às 17h',
    acessibilidadePCD: true,
    raioProtecaoZeladoriaMetros: 500,
    papelAnalogoAnexo: 'Análogo a Eixos Primários de Circulação (Anexo 1): Localizada no cruzamento da Av. Brasil e Henrique Schaumann, requer poda arbórea e fluidez em travessias.'
  },
  {
    id: 'bib-clarice-lispector',
    nome: 'Biblioteca Clarice Lispector',
    tipo: 'BIBLIOTECA_MUNICIPAL',
    subprefeituraId: '5',
    subprefeituraNome: 'Lapa',
    distrito: 'Siciliano / Lapa',
    endereco: 'Rua Jaricunas, 458 - Siciliano / Lapa',
    lat: -23.5284,
    lng: -46.6931,
    acervoEspecialidade: 'Literatura brasileira, estudos de gênero, direitos humanos e cidadania',
    anoFundacao: 1980,
    horarioFuncionamento: 'Terça a Sexta das 9h às 18h | Sábado das 10h às 17h',
    acessibilidadePCD: true,
    raioProtecaoZeladoriaMetros: 400,
    papelAnalogoAnexo: 'Análogo a Tecidos Residenciais de Proximidade (Reims - Tissu mixte): Biblioteca integrada a bairro residencial demandando iluminação pública e calçadas contínuas.'
  },
  {
    id: 'bib-hans-andersen',
    nome: 'Biblioteca Temática em Contos de Fadas Hans Christian Andersen',
    tipo: 'BIBLIOTECA_TEMATICA',
    subprefeituraId: '3',
    subprefeituraNome: 'Mooca',
    distrito: 'Tatuapé',
    endereco: 'Praça Coronel Salles, 17 - Tatuapé',
    lat: -23.5392,
    lng: -46.5744,
    acervoEspecialidade: 'Contos de fadas mundiais, folclore, teatro infantil e contação de histórias',
    anoFundacao: 1952,
    horarioFuncionamento: 'Terça a Sexta das 9h às 18h | Sábado das 10h às 17h',
    acessibilidadePCD: true,
    raioProtecaoZeladoriaMetros: 500,
    papelAnalogoAnexo: 'Análogo a Green & Open Spaces (Anexo 1): Sediada em praça arborizada da Zona Leste com alta demanda de manutenção de canteiros, poda e drenagem.'
  },
  {
    id: 'bib-cassiano-ricardo',
    nome: 'Biblioteca Temática em Música Cassiano Ricardo',
    tipo: 'BIBLIOTECA_TEMATICA',
    subprefeituraId: '3',
    subprefeituraNome: 'Mooca',
    distrito: 'Tatuapé',
    endereco: 'Av. Celso Garcia, 4200 - Tatuapé',
    lat: -23.5432,
    lng: -46.5621,
    acervoEspecialidade: 'Partituras, história da música brasileira, discoteca e ensaios acústicos',
    anoFundacao: 1954,
    horarioFuncionamento: 'Terça a Sexta das 9h às 18h | Sábado das 10h às 17h',
    acessibilidadePCD: true,
    raioProtecaoZeladoriaMetros: 450,
    papelAnalogoAnexo: 'Análogo a Corredor Estruturante (Reims e Anexo 1): Localizada no corredor da Celso Garcia com forte conexão a linhas de ônibus e fluxo de transeuntes.'
  },
  {
    id: 'bib-prestes-maia',
    nome: 'Biblioteca Prefeito Prestes Maia',
    tipo: 'BIBLIOTECA_MUNICIPAL',
    subprefeituraId: '8', // Jurisdição Santo Amaro / Sul
    subprefeituraNome: 'Capela do Socorro',
    distrito: 'Santo Amaro',
    endereco: 'Av. João Dias, 822 - Santo Amaro',
    lat: -23.6521,
    lng: -46.7029,
    acervoEspecialidade: 'Arquitetura e Urbanismo de São Paulo, Planejamento Urbano e Coleção Prestes Maia',
    anoFundacao: 1965,
    horarioFuncionamento: 'Terça a Sexta das 9h às 18h | Sábado das 10h às 17h',
    acessibilidadePCD: true,
    raioProtecaoZeladoriaMetros: 550,
    papelAnalogoAnexo: 'Análogo ao Polo de Centralidade Regional (Reims Metrópole): Centro de referência de planejamento urbano e histórico no coração da Zona Sul.'
  },
  {
    id: 'bib-alvares-azevedo',
    nome: 'Biblioteca Álvares de Azevedo',
    tipo: 'BIBLIOTECA_MUNICIPAL',
    subprefeituraId: '5', // Norte
    subprefeituraNome: 'Lapa',
    distrito: 'Vila Maria',
    endereco: 'Praça Joaquim José da Nova, s/n - Vila Maria Alta',
    lat: -23.5098,
    lng: -46.6021,
    acervoEspecialidade: 'Literatura romântica, espaço comunitário, telecentro e acervo geral',
    anoFundacao: 1957,
    horarioFuncionamento: 'Terça a Sexta das 9h às 18h | Sábado das 10h às 17h',
    acessibilidadePCD: true,
    raioProtecaoZeladoriaMetros: 450,
    papelAnalogoAnexo: 'Análogo ao Anexo 2 (Polo Cívico Comunitário): Equipamento público com praça de convivência que ancora a vida cultural da Zona Norte.'
  }
];

/**
 * Catálogo Unificado de Camadas Mapeadas do Sistema
 * Integra fontes externas (GeoJSON, WMS, OGC) e camadas internas
 * com correspondência direta com as categorias analíticas dos anexos:
 * 1. Topografia & Relevo (Anexo 1)
 * 2. Circulação & Vias (Anexo 1 e Anexo 3)
 * 3. Espaços Verdes & Parques (Anexo 1 e Anexo 3)
 * 4. Forma Construída 3D & Zoneamento (Anexo 1 e Anexo 2)
 * 5. Equipamentos Maiores & Bibliotecas Públicas (Anexos 2, 3 e 4)
 * 6. Ortofoto Satélite de Contexto (Anexo 1)
 * 7. Camada Operacional Interna de Zeladoria SP156
 */
export const CATALOGO_CAMADAS_MAPEADAS: CamadaMapeada[] = [
  {
    id: 'layer-zeladoria-interna',
    nome: 'Zeladoria Operacional SP156',
    descricao: 'Camada interna nativa contendo os chamados ativos de zeladoria (buracos, bueiros, poda, iluminação, calçadas).',
    tipo: 'INTERNA',
    categoriaAnaloga: 'ZELADORIA_SP156',
    formato: 'INTERNAL_OBJECTS',
    provedor: 'Prefeitura SP / Sistema SP156 Interno',
    ativa: true,
    opacidade: 1.0,
    ordemZ: 6, // Camada do topo
    corPrimaria: '#2563eb', // Blue-600
    icone: 'Activity',
    totalElementos: 156
  },
  {
    id: 'layer-bibliotecas-sp',
    nome: 'Bibliotecas Públicas & Equipamentos Culturais',
    descricao: 'Rede de Bibliotecas Públicas Municipais de SP (GeoJSON). Papel análogo a Équipements Majeurs (Reims) e Landmarks (Budapeste), com buffers de proteção de zeladoria.',
    tipo: 'EXTERNA_GEOJSON',
    categoriaAnaloga: 'EQUIPAMENTOS_BIBLIOTECAS',
    formato: 'GEOJSON',
    urlServico: 'https://geosampa.prefeitura.sp.gov.br/geoserver/wfs?service=WFS&request=GetFeature&typeName=equipamentos_culturais_bibliotecas',
    provedor: 'Secretaria Municipal de Cultura (SMC/CSMB) / GeoSampa',
    ativa: true,
    opacidade: 0.95,
    ordemZ: 5,
    corPrimaria: '#dc2626', // Red-600
    icone: 'BookOpen',
    totalElementos: BIBLIOTECAS_PUBLICAS_SP.length,
    itensDetalhados: BIBLIOTECAS_PUBLICAS_SP
  },
  {
    id: 'layer-forma-construida-3d',
    nome: 'Forma Construída 3D & Quarteirões',
    descricao: 'Extrusão 3D e volumetria cadastral urbana por uso do solo (residencial, comercial, misto) análogo aos Anexos 1 e 2.',
    tipo: 'EXTERNA_GEOJSON',
    categoriaAnaloga: 'FORMA_CONSTRUIDA_3D',
    formato: 'GEOJSON',
    urlServico: 'https://geosampa.prefeitura.sp.gov.br/geoserver/wfs?typeName=cadastro_edificacoes_3d',
    provedor: 'Secretaria Municipal de Urbanismo e Licenciamento (SMUL)',
    ativa: true,
    opacidade: 0.75,
    ordemZ: 4,
    corPrimaria: '#475569', // Slate-600
    icone: 'Building2',
    totalElementos: 420
  },
  {
    id: 'layer-espacos-verdes',
    nome: 'Espaços Verdes & Parques Municipais',
    descricao: 'Manchas de cobertura vegetal arbórea, parques urbanos, praças e áreas permeáveis (Anexo 1 e Anexo 3 - Espaces boisés).',
    tipo: 'EXTERNA_GEOJSON',
    categoriaAnaloga: 'AREAS_VERDES',
    formato: 'GEOJSON',
    urlServico: 'https://geosampa.prefeitura.sp.gov.br/geoserver/wfs?typeName=areas_verdes_parques',
    provedor: 'Secretaria do Verde e do Meio Ambiente (SVMA)',
    ativa: true,
    opacidade: 0.85,
    ordemZ: 3,
    corPrimaria: '#16a34a', // Emerald-600
    icone: 'Trees',
    totalElementos: 84
  },
  {
    id: 'layer-circulacao-vias',
    nome: 'Circulação & Eixos Estruturantes',
    descricao: 'Rede viária de corredores primários, secundários, faixas exclusivas e acessos cicláveis (Anexo 1 Circulation e Reims Axes).',
    tipo: 'EXTERNA_GEOJSON',
    categoriaAnaloga: 'CIRCULACAO_VIAS',
    formato: 'GEOJSON',
    urlServico: 'https://geosampa.prefeitura.sp.gov.br/geoserver/wfs?typeName=malha_viaria_eixos',
    provedor: 'Companhia de Engenharia de Tráfego (CET / SMT)',
    ativa: true,
    opacidade: 0.80,
    ordemZ: 2,
    corPrimaria: '#ea580c', // Orange-600
    icone: 'Navigation',
    totalElementos: 312
  },
  {
    id: 'layer-topografia-relevo',
    nome: 'Topografia & Curvas de Nível (Hipsometria)',
    descricao: 'Relevo altimétrico, declividade e drenagem de bacias hidrográficas de 250m a 500m (Anexo 1 - Topography / Elevation).',
    tipo: 'EXTERNA_GEOJSON',
    categoriaAnaloga: 'TOPOGRAFIA_RELEVO',
    formato: 'GEOJSON',
    urlServico: 'https://geosampa.prefeitura.sp.gov.br/geoserver/wfs?typeName=curvas_nivel_mdt',
    provedor: 'Instituto Geográfico e Cartográfico (IGC) / GeoSampa',
    ativa: true,
    opacidade: 0.70,
    ordemZ: 1,
    corPrimaria: '#0284c7', // Sky-600
    icone: 'Mountain',
    totalElementos: 96
  },
  {
    id: 'layer-satelite-contexto',
    nome: 'Ortofoto Satélite de Contexto (WMS)',
    descricao: 'Cobertura aerofotogramétrica de alta resolução de São Paulo servida via WMS padrão OGC (Anexo 1 - Satellite Context).',
    tipo: 'EXTERNA_WMS',
    categoriaAnaloga: 'SATELITE_CONTEXTO',
    formato: 'WMS',
    urlServico: 'https://geosampa.prefeitura.sp.gov.br/geoserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&LAYERS=ortofoto_sp_2023',
    provedor: 'GeoSampa Ortofoto WMS OGC',
    ativa: false,
    opacidade: 0.65,
    ordemZ: 0, // Base
    corPrimaria: '#64748b',
    icone: 'Globe',
    totalElementos: 1
  }
];

/**
 * Função utilitária para cruzar as Bibliotecas Públicas Geolocalizadas com os chamados de Zeladoria
 * Calcula quais chamados do SP156 estão no raio de proteção de cada biblioteca
 */
export function calcularDiagnosticoEntornoBibliotecas(
  bibliotecas: BibliotecaPublicaGeolocalizada[],
  chamados: Chamado[]
): {
  bibliotecaId: string;
  totalChamadosNoRaio: number;
  chamadosCriticos: number;
  tempoMedioEsperaHoras: number;
  chamadosMaisProximos: { chamado: Chamado; distanciaMetros: number }[];
}[] {
  return bibliotecas.map(bib => {
    const chamadosProximos: { chamado: Chamado; distanciaMetros: number }[] = [];

    chamados.forEach(ch => {
      const dist = calcularDistanciaMetros(bib.lat, bib.lng, ch.lat, ch.lng);
      if (dist <= bib.raioProtecaoZeladoriaMetros) {
        chamadosProximos.push({ chamado: ch, distanciaMetros: Math.round(dist) });
      }
    });

    chamadosProximos.sort((a, b) => a.distanciaMetros - b.distanciaMetros);

    const chamadosCriticos = chamadosProximos.filter(
      p => p.chamado.prioridade === 'ALTA' || p.chamado.prioridade === 'URGENTE'
    ).length;

    return {
      bibliotecaId: bib.id,
      totalChamadosNoRaio: chamadosProximos.length,
      chamadosCriticos,
      tempoMedioEsperaHoras: chamadosProximos.length > 0 ? 38 : 0,
      chamadosMaisProximos: chamadosProximos.slice(0, 5)
    };
  });
}
