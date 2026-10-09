import { Chamado, FonteDadosPublica, HotspotCruzamento, ResumoCruzamentoCamadas, CategoriaChamado, IdFonteDadosPublica } from '../types';

/**
 * Calcula a distância ortodrômica em metros entre duas coordenadas geográficas (WGS84) via fórmula Haversine.
 */
export function calcularDistanciaMetros(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Raio médio da Terra em metros
  const radLat1 = (lat1 * Math.PI) / 180;
  const radLat2 = (lat2 * Math.PI) / 180;
  const deltaLat = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export interface ConfiguracaoCruzamento {
  raioMetros: number;
  categoriaInterna: CategoriaChamado | 'TODAS';
  fonteExternaId: IdFonteDadosPublica | 'TODAS';
  apenasAtivas: boolean;
}

/**
 * Gera um diagnóstico semântico e recomendação operacional baseado na categoria do chamado e na fonte externa.
 */
function gerarDiagnosticoCruzado(
  chamado: Chamado,
  fonte: FonteDadosPublica,
  pontoTitulo: string,
  pontoMetrica: string,
  distanciaMetros: number
): { grauRisco: 'CRITICO' | 'ALTO' | 'MODERADO'; diagnostico: string; recomendacao: string } {
  // Caso 1: Bueiro entupido / drenagem com CET (Lentidão / Alagamento viário)
  if (chamado.categoria === 'BUEIRO' && fonte.id === 'CET') {
    return {
      grauRisco: 'CRITICO',
      diagnostico: `Bueiro ou galeria com obstrução a apenas ${distanciaMetros}m de gargalo viário monitorado pela CET (${pontoTitulo} — ${pontoMetrica}). Risco iminente de alagamento da via pública sob chuva torrencial.`,
      recomendacao: 'Despacho prioritário de caminhão hidro-vácuo de desobstrução e articulação com agentes de trânsito CET.'
    };
  }

  // Caso 2: Árvore caída / galhos com CET (Interferência em corredor viário)
  if (chamado.categoria === 'ARVORE_CAIDA' && fonte.id === 'CET') {
    return {
      grauRisco: 'CRITICO',
      diagnostico: `Vegetação de grande porte caída ou com risco iminente a ${distanciaMetros}m de fluxo viário sensível (${pontoTitulo}). Potencial de interdição de faixas e bloqueio de transporte coletivo.`,
      recomendacao: 'Envio imediato da equipe de poda e remoção arbórea com motosserra em comboio com batedores da CET.'
    };
  }

  // Caso 3: Árvore caída ou Falta de Iluminação / Fiscalização com SSP-SP (Segurança Pública)
  if (chamado.categoria === 'ARVORE_CAIDA' && fonte.id === 'SSP_SP') {
    return {
      grauRisco: 'ALTO',
      diagnostico: `Queda arbórea em trecho de alta incidência de ocorrências patrimoniais (${pontoTitulo} — ${pontoMetrica}). Interrupção de iluminação ou visibilidade amplia vulnerabilidade da via.`,
      recomendacao: 'Priorização de desobstrução e acionamento de ronda de apoio da GCM / Polícia Militar no local.'
    };
  }

  // Caso 4: Morador de rua / Acolhimento Social com IBGE (Densidade demográfica e carência social)
  if (chamado.categoria === 'MORADOR_RUA' && fonte.id === 'IBGE') {
    return {
      grauRisco: 'ALTO',
      diagnostico: `Demanda de acolhimento social em distrito de altíssima densidade urbana (${pontoTitulo} — ${pontoMetrica}). Pressão sobre equipamentos públicos e necessidade de assistência humanizada continuada.`,
      recomendacao: 'Acionar equipe do SEAS (Serviço Especializado em Abordagem Social) com van de acolhimento e oferta de vagas em Centro de Acolhida.'
    };
  }

  // Caso 5: Barulho PSIU com SSP-SP
  if (chamado.categoria === 'BARULHO_PSIU' && fonte.id === 'SSP_SP') {
    return {
      grauRisco: 'ALTO',
      diagnostico: `Perturbação do sossego (PSIU) reincidente em raio de ${distanciaMetros}m de foco de patrulhamento da SSP (${pontoTitulo}). Conflito entre estabelecimentos comerciais e moradores locais.`,
      recomendacao: 'Operação conjunta de fiscalização de postura, medição de decibéis por sonômetro e apoio ostensivo da Guarda Civil.'
    };
  }

  // Caso 6: Tapa-Buraco ou Calçada com CET
  if ((chamado.categoria === 'TAPA_BURACO' || chamado.categoria === 'CALCADA') && fonte.id === 'CET') {
    return {
      grauRisco: 'ALTO',
      diagnostico: `Defeito na pista ou calçada em corredor com velocidade reduzida (${pontoTitulo} — ${pontoMetrica}). Risco de frenagens bruscas, acidentes com motociclistas e retenção em cadeia.`,
      recomendacao: 'Inclusão na escala emergencial de massa asfáltica a quente na madrugada com sinalização tática.'
    };
  }

  // Caso 7: Qualquer chamado com Histórico SP156 (Reincidência crônica)
  if (fonte.id === 'SP156_HISTORICO') {
    return {
      grauRisco: chamado.prioridade === 'URGENTE' || chamado.isAtrasado ? 'CRITICO' : 'ALTO',
      diagnostico: `Reincidência crônica detectada: local a ${distanciaMetros}m de polo histórico de solicitações (${pontoTitulo} — ${pontoMetrica}). Solução paliativa anterior demonstrou esgotamento.`,
      recomendacao: 'Encaminhamento para engenharia da Subprefeitura para vistoria estrutural e intervenção definitiva.'
    };
  }

  // Caso 8: Demais correlações espaciais
  const grau = (chamado.prioridade === 'URGENTE' || distanciaMetros < 250) ? 'ALTO' : 'MODERADO';
  return {
    grauRisco: grau,
    diagnostico: `Sobreposição territorial direta a ${distanciaMetros}m do indicador público ${fonte.sigla} (${pontoTitulo} — ${pontoMetrica}).`,
    recomendacao: 'Verificação em campo e monitoramento dos reflexos urbanos combinados.'
  };
}

/**
 * Executa o motor de cruzamento geoespacial entre chamados internos e camadas de dados públicos.
 */
export function executarCruzamentoCamadas(
  chamados: Chamado[],
  fontesPublicas: FonteDadosPublica[],
  config: ConfiguracaoCruzamento,
  subprefeituraNome?: string
): { hotspots: HotspotCruzamento[]; resumo: ResumoCruzamentoCamadas } {
  const hotspots: HotspotCruzamento[] = [];

  const fontesElegiveis = fontesPublicas.filter(f => {
    if (config.apenasAtivas && !f.ativa) return false;
    if (config.fonteExternaId !== 'TODAS' && f.id !== config.fonteExternaId) return false;
    return true;
  });

  const chamadosFiltrados = chamados.filter(c => {
    if (c.status === 'CONCLUIDO') return false; // Foco em pendências abertas/operacionais
    if (config.categoriaInterna !== 'TODAS' && c.categoria !== config.categoriaInterna) return false;
    return true;
  });

  for (const chamado of chamadosFiltrados) {
    for (const fonte of fontesElegiveis) {
      for (const ponto of fonte.pontos) {
        const distancia = calcularDistanciaMetros(chamado.lat, chamado.lng, ponto.lat, ponto.lng);

        if (distancia <= config.raioMetros) {
          const { grauRisco, diagnostico, recomendacao } = gerarDiagnosticoCruzado(
            chamado,
            fonte,
            ponto.titulo,
            ponto.metricaPrincipal,
            distancia
          );

          hotspots.push({
            id: `cross-${chamado.id}-${ponto.id}`,
            chamadoId: chamado.id,
            chamadoProtocolo: chamado.protocolo,
            chamadoCategoria: chamado.categoria,
            chamadoEndereco: chamado.endereco,
            chamadoLat: chamado.lat,
            chamadoLng: chamado.lng,
            chamadoPrioridade: chamado.prioridade,
            chamadoStatus: chamado.status,
            pontoPublicoId: ponto.id,
            fonteId: fonte.id,
            fonteSigla: fonte.sigla,
            fonteNome: fonte.nome,
            pontoTitulo: ponto.titulo,
            pontoMetrica: ponto.metricaPrincipal,
            pontoLat: ponto.lat,
            pontoLng: ponto.lng,
            distanciaMetros: distancia,
            grauRisco,
            diagnosticoCruzado: diagnostico,
            recomendacaoOperacional: recomendacao,
            subprefeituraNome: ponto.subprefeituraNome || subprefeituraNome || 'São Paulo'
          });
        }
      }
    }
  }

  // Ordena por criticidade (CRITICO > ALTO > MODERADO) e proximidade em metros
  const pesoRisco = { CRITICO: 3, ALTO: 2, MODERADO: 1 };
  hotspots.sort((a, b) => {
    const diffRisco = pesoRisco[b.grauRisco] - pesoRisco[a.grauRisco];
    if (diffRisco !== 0) return diffRisco;
    return a.distanciaMetros - b.distanciaMetros;
  });

  // Cálculo do Resumo Estatístico
  const criticos = hotspots.filter(h => h.grauRisco === 'CRITICO').length;
  const altos = hotspots.filter(h => h.grauRisco === 'ALTO').length;
  const moderados = hotspots.filter(h => h.grauRisco === 'MODERADO').length;
  const distanciaMediaMetros = hotspots.length > 0
    ? Math.round(hotspots.reduce((acc, h) => acc + h.distanciaMetros, 0) / hotspots.length)
    : 0;

  // Encontrar distrito mais afetado
  const contagemDistritos: Record<string, number> = {};
  hotspots.forEach(h => {
    contagemDistritos[h.subprefeituraNome] = (contagemDistritos[h.subprefeituraNome] || 0) + 1;
  });
  let distritoMaisAfetado = 'Sé';
  let maiorContagem = 0;
  for (const [distrito, qtd] of Object.entries(contagemDistritos)) {
    if (qtd > maiorContagem) {
      maiorContagem = qtd;
      distritoMaisAfetado = distrito;
    }
  }

  // Correlações agrupadas
  const correlacoesMap: Record<string, { categoria: CategoriaChamado; fonte: IdFonteDadosPublica; quantidade: number }> = {};
  hotspots.forEach(h => {
    const key = `${h.chamadoCategoria}__${h.fonteId}`;
    if (!correlacoesMap[key]) {
      correlacoesMap[key] = {
        categoria: h.chamadoCategoria,
        fonte: h.fonteId,
        quantidade: 0
      };
    }
    correlacoesMap[key].quantidade++;
  });

  const principaisCorrelacoes = Object.values(correlacoesMap)
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 5);

  const resumo: ResumoCruzamentoCamadas = {
    totalHotspots: hotspots.length,
    criticos,
    altos,
    moderados,
    distanciaMediaMetros,
    distritoMaisAfetado,
    principaisCorrelacoes
  };

  return { hotspots, resumo };
}
