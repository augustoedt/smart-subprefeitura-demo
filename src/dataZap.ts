import { ZapMessage, ZapChatSession, CategoriaChamado } from './types';

export const FOTOS_SIMULADAS_ZAP = {
  TAPA_BURACO: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
  ARVORE_CAIDA: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&auto=format&fit=crop&q=80',
  BUEIRO: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
  BARULHO_PSIU: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format&fit=crop&q=80',
  CALCADA: 'https://images.unsplash.com/photo-1508873696983-2df57046475b?w=600&auto=format&fit=crop&q=80',
};

export const FOTOS_TRABALHADOR_ZAP = {
  ANTES_TAPA_BURACO: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop&q=80',
  DEPOIS_TAPA_BURACO: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
  ANTES_BUEIRO: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80',
  DEPOIS_BUEIRO: 'https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?w=600&auto=format&fit=crop&q=80',
  ANTES_ARVORE: 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600&auto=format&fit=crop&q=80',
  DEPOIS_ARVORE: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=600&auto=format&fit=crop&q=80',
};

export const MOCK_CONVERSA_INICIAL: ZapChatSession = {
  conversaId: 'zap-sessao-01',
  numeroTelefone: '+55 11 98452-1920',
  nomeCidadao: 'Carlos Eduardo Silveira',
  etapaAtual: 'MENU_PRINCIPAL',
  mensagens: [
    {
      id: 'msg-01',
      remetente: 'BOT_SP156',
      texto: 'Olá, Carlos! 👋 Sou o assistente oficial do canal SP156 WhatsApp da Prefeitura de São Paulo.\n\nComo posso ajudar você hoje?',
      timestamp: '10:14',
      statusEnvio: 'LIDO',
      opcoesRespostaRapida: [
        '🚨 Abrir Novo Chamado',
        '🔍 Consultar Protocolo',
        '⭐ Avaliar Atendimento',
        'ℹ️ Informações de Serviços'
      ]
    },
    {
      id: 'msg-02',
      remetente: 'CIDADAO',
      texto: 'Bom dia! Tem um buraco enorme na pista aqui na Rua da Mooca, altura do número 1200.',
      timestamp: '10:15',
      statusEnvio: 'LIDO',
    },
    {
      id: 'msg-03',
      remetente: 'BOT_SP156',
      texto: 'Entendi perfeitamente! Identifiquei que se trata de uma solicitação de **Tapa-Buraco / Pavimentação Asfáltica** para a **Subprefeitura da Mooca**.\n\nVocê tem uma foto do local para anexar à ordem de serviço?',
      timestamp: '10:15',
      statusEnvio: 'LIDO',
      tipoAnexo: 'BOTAO_ACAO',
      anexoDados: {
        categoria: 'TAPA_BURACO',
        subprefeituraNome: 'Mooca',
        prazoHoras: 24
      },
      opcoesRespostaRapida: [
        '📸 Anexar Foto do Buraco',
        '📍 Confirmar Localização',
        '🔄 Trocar Categoria'
      ]
    }
  ]
};

export const MOCK_CONVERSA_TRABALHADOR_INICIAL: ZapChatSession = {
  conversaId: 'zap-trabalhador-01',
  numeroTelefone: '+55 11 97412-8833',
  nomeCidadao: 'Equipe Operacional V-04 (Marcos Silva)',
  etapaAtual: 'MENU_PRINCIPAL',
  mensagens: [
    {
      id: 'msg-w-01',
      remetente: 'BOT_SP156',
      texto: '👷‍♂️ *Zeladoria Operacional PMSP • Canal de Campo no WhatsApp*\n\nBem-vindo, *Encarregado Marcos Silva* (Matrícula: 849.201-9).\nViatura: *V-04 • Subprefeitura Vila Mariana*\n\nEste canal substitui as fotos avulsas de grupo por um fluxo auditável direto no sistema de Ordens de Serviço.',
      timestamp: '07:45',
      statusEnvio: 'LIDO',
      opcoesRespostaRapida: [
        '📋 Minhas OSs Designadas',
        '🚀 Iniciar Atendimento',
        '📸 Enviar Foto do ANTES',
        '🦺 Checklist de Segurança',
        '🏁 Finalizar com Foto DEPOIS',
        '⚠️ Reportar Risco/Escalar'
      ]
    },
    {
      id: 'msg-w-02',
      remetente: 'CIDADAO',
      texto: '📋 Minhas OSs Designadas',
      timestamp: '07:46',
      statusEnvio: 'LIDO',
    },
    {
      id: 'msg-w-03',
      remetente: 'BOT_SP156',
      texto: '🔎 *3 Ordens de Serviço Prioritárias Atribuídas Hoje à V-04:*\n\n1️⃣ *OS-SP156-2026-90412* — Tapa-Buraco\n📍 Av. Domingos de Morais, 1840 • Vila Mariana\n⏱️ Prazo SLA: Restam 3h (Alta prioridade)\n\n2️⃣ *OS-SP156-2026-77821* — Limpeza de Bueiro\n📍 Alameda dos Maracatins, 450 • Moema\n\n3️⃣ *OS-SP156-2026-65129* — Poda Preventiva\n📍 Rua Domingos de Soto, 210 • Saúde\n\nClique abaixo para iniciar atendimento na OS nº 1.',
      timestamp: '07:46',
      statusEnvio: 'LIDO',
      opcoesRespostaRapida: [
        '🚀 Iniciar Atendimento OS-90412',
        '📸 Enviar Foto do ANTES',
        '🗺️ Ver Rota no GPS'
      ]
    }
  ]
};

export function gerarTimestampAtual(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  return `${h}:${m}`;
}

export function detectarCategoriaPorTexto(texto: string): CategoriaChamado {
  const t = texto.toLowerCase();
  if (t.includes('buraco') || t.includes('asfalto') || t.includes('cratera') || t.includes('pista')) return 'TAPA_BURACO';
  if (t.includes('arvore') || t.includes('árvore') || t.includes('galho') || t.includes('folhagem')) return 'ARVORE_CAIDA';
  if (t.includes('bueiro') || t.includes('alagamento') || t.includes('água') || t.includes('boca de lobo') || t.includes('enchente')) return 'BUEIRO';
  if (t.includes('som') || t.includes('barulho') || t.includes('psiu') || t.includes('musica') || t.includes('festa')) return 'BARULHO_PSIU';
  if (t.includes('morador') || t.includes('rua') || t.includes('acolhimento') || t.includes('desabrigado') || t.includes('assistencia')) return 'MORADOR_RUA';
  if (t.includes('calcada') || t.includes('calçada') || t.includes('guia') || t.includes('piso')) return 'CALCADA';
  if (t.includes('faixa') || t.includes('comercio') || t.includes('ambulante') || t.includes('postura')) return 'FISCALIZACAO_POSTURA';
  return 'DESFAZIMENTO';
}
