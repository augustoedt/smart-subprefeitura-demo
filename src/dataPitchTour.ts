import { PitchTourStep } from './types';

export const PITCH_TOUR_STEPS: PitchTourStep[] = [
  {
    id: 1,
    titulo: 'Passo 1: Abertura Direta pelo Cidadão no WhatsApp SP156',
    ator: 'Munícipe no Território (Vila Mariana / Moema / Saúde)',
    moduloAlvo: 'simulacao_zap',
    argumentoVenda: 'Zero barreira de adoção: 100% no WhatsApp sem download de app. IA detecta o problema, captura foto e geolocaliza na malha viária oficial.',
    destaqueFuncional: 'Disparo automático de OS com protocolo, foto e coordenadas GPS em tempo real.',
    acaoSugerida: 'Clique em "Cenário A: Tapa-Buraco na Mooca" ou digite um relato para ver a IA responder e emitir a OS.'
  },
  {
    id: 2,
    titulo: 'Passo 2: Sala de Situação e War Room Geoespacial',
    ator: 'Prefeito, Secretário Municipal (SMSUB) e Subprefeito Regional',
    moduloAlvo: 'sala_situacao',
    argumentoVenda: 'Visão executiva em tempo real com 6 motores cartográficos, mapa de calor térmico, e atalho de um clique para os distritos da Subprefeitura.',
    destaqueFuncional: 'Cruzamento geoespacial de dados da Prefeitura com SSP (segurança), CET (trânsito) e IBGE.',
    acaoSugerida: 'Use o botão "SUB-VM" no HUD para voar até a Vila Mariana e alterne para "Mapa de Calor" ou "MapLibre GL 3D".'
  },
  {
    id: 3,
    titulo: 'Passo 3: Triagem, Despacho e SLA no Painel Administrativo',
    ator: 'Supervisão de Limpeza e Obras Públicas da Subprefeitura',
    moduloAlvo: 'painel_admin',
    argumentoVenda: 'Kanban ágil de 5 fases operacionais com alarme visual de SLA, detecção de duplicidades em 100 metros e distribuição por viatura.',
    destaqueFuncional: 'Despacho de novos chamados diretamente para o operador de campo com cálculo de rota.',
    acaoSugerida: 'Mova um chamado da coluna "Novo" para "Em Execução" para despachar à equipe de campo.'
  },
  {
    id: 4,
    titulo: 'Passo 4: Execução na Ponta e Vistoria no App de Campo',
    ator: 'Técnico Operacional / Motorista da Viatura de Zeladoria',
    moduloAlvo: 'app_campo',
    argumentoVenda: 'Blindagem jurídica e auditoria total: checklist obrigatório de segurança, fotos ANTES/DEPOIS e carimbo d\'água com coordenadas e matrícula.',
    destaqueFuncional: 'Ao concluir a OS no celular, o chamado transita para aprovação e notifica o cidadão automaticamente.',
    acaoSugerida: 'Abra a OS na lista, preencha o checklist de segurança, registre as fotos e clique em "Finalizar OS".'
  },
  {
    id: 5,
    titulo: 'Passo 5: Relatório SEI-PMSP & Prestação de Contas Governamental',
    ator: 'Gabinete do Subprefeito e Tribunal de Contas (TCM-SP)',
    moduloAlvo: 'painel_admin',
    argumentoVenda: 'Geração instantânea de Dossiê Oficial no padrão SEI-PMSP timbrado, com assinaturas de autoridades e QR Code de autenticidade criptográfica.',
    destaqueFuncional: 'Exportação em PDF/Impressão e planilha (.CSV) para auditoria e prestação de contas.',
    acaoSugerida: 'Clique em "Imprimir Dossiê SEI" no topo do Painel Admin para ver a folha de relatório pronta para despacho.'
  }
];
