import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  MapPin, 
  Camera, 
  CheckCheck, 
  Sparkles, 
  Star, 
  Bot, 
  RotateCcw,
  CheckCircle2,
  Maximize2,
  Smartphone,
  Phone,
  Video,
  MoreVertical,
  Wifi,
  Battery,
  Volume2,
  ArrowRight,
  ShieldCheck,
  Wrench,
  User,
  AlertTriangle,
  ClipboardList,
  HardHat,
  Truck,
  CheckSquare
} from 'lucide-react';
import { Chamado, ZapMessage, ZapChatSession, CategoriaChamado } from '../types';
import { subprefeituras } from '../data';
import { 
  FOTOS_SIMULADAS_ZAP, 
  FOTOS_TRABALHADOR_ZAP, 
  MOCK_CONVERSA_TRABALHADOR_INICIAL,
  gerarTimestampAtual, 
  detectarCategoriaPorTexto 
} from '../dataZap';
import { UserSession } from '../LoginTypes';
import BrasaoSaoPaulo from './BrasaoSaoPaulo';
import { useApp } from '../context/AppContext';

interface SimulacaoZapProps {
  chamados: Chamado[];
  setChamados?: React.Dispatch<React.SetStateAction<Chamado[]>>;
  onCriarChamado: (novoChamado: Chamado) => void;
  zapSession: ZapChatSession;
  setZapSession: React.Dispatch<React.SetStateAction<ZapChatSession>>;
  session: UserSession | null;
  onNavigateToSection?: (section: 'painel_admin' | 'sala_situacao' | 'app_campo') => void;
}

export default function SimulacaoZap({ 
  chamados, 
  setChamados,
  onCriarChamado, 
  zapSession, 
  setZapSession,
  onNavigateToSection
}: SimulacaoZapProps) {
  const { addNotification } = useApp();
  const [modoSimulacao, setModoSimulacao] = useState<'CIDADAO' | 'TRABALHADOR'>('CIDADAO');
  const [workerSession, setWorkerSession] = useState<ZapChatSession>(MOCK_CONVERSA_TRABALHADOR_INICIAL);
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategoria, setSelectedCategoria] = useState<CategoriaChamado>('TAPA_BURACO');
  const [deviceMode, setDeviceMode] = useState<'SMARTPHONE' | 'EXPANDIDO'>('SMARTPHONE');
  const [fotoModalUrl, setFotoModalUrl] = useState<string | null>(null);
  const [somAtivo, setSomAtivo] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determinar qual sessão está ativa com base no modo selecionado
  const activeSession = modoSimulacao === 'CIDADAO' ? zapSession : workerSession;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeSession.mensagens, isTyping, modoSimulacao]);

  const tocarFeedbackVisual = () => {
    if (!somAtivo) return;
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {
      // Navegadores que bloqueiam áudio sem interação direta
    }
  };

  const adicionarMensagem = (msg: Omit<ZapMessage, 'id' | 'timestamp'>) => {
    const novaMsg: ZapMessage = {
      ...msg,
      id: `zap-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: gerarTimestampAtual(),
      statusEnvio: 'LIDO'
    };

    if (modoSimulacao === 'CIDADAO') {
      setZapSession(prev => ({
        ...prev,
        mensagens: [...prev.mensagens, novaMsg]
      }));
    } else {
      setWorkerSession(prev => ({
        ...prev,
        mensagens: [...prev.mensagens, novaMsg]
      }));
    }

    tocarFeedbackVisual();
  };

  const handleEnviarMensagemTexto = (textoManual?: string) => {
    const texto = (textoManual || inputText).trim();
    if (!texto) return;

    adicionarMensagem({
      remetente: 'CIDADAO',
      texto,
      statusEnvio: 'LIDO'
    });
    setInputText('');

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      if (modoSimulacao === 'CIDADAO') {
        processarRespostaBotCidadao(texto);
      } else {
        processarRespostaBotTrabalhador(texto);
      }
    }, 850);
  };

  // ==================== FLUXO MORADOR / CIDADÃO ====================
  const processarRespostaBotCidadao = (textoCidadao: string) => {
    const t = textoCidadao.toLowerCase();

    // Consulta de Protocolo
    if (t.includes('consultar') || t.includes('protocolo') || t.includes('status')) {
      const ultimoChamado = chamados[0];
      const subNome = subprefeituras.find(s => s.id === ultimoChamado.subprefeituraId)?.nome || 'São Paulo';
      
      adicionarMensagem({
        remetente: 'BOT_SP156',
        texto: `🔍 **Consulta de Protocolo SP156**\n\n📋 **Protocolo:** \`${ultimoChamado.protocolo}\`\n🏷️ **Serviço:** ${ultimoChamado.categoria.replace('_', ' ')}\n📍 **Região:** Subprefeitura de ${subNome}\n🚦 **Status Atual:** ${ultimoChamado.status}\n⏱️ **Previsão:** ${ultimoChamado.isAtrasado ? '⚠️ Priorizado pela Central' : 'Dentro do prazo regulamentar'}\n\nA equipe técnica foi despachada para o local. Notificaremos você assim que houver a conclusão do serviço.`,
        tipoAnexo: 'PROTOCOLO',
        anexoDados: {
          protocolo: ultimoChamado.protocolo,
          categoria: ultimoChamado.categoria,
          statusChamado: ultimoChamado.status,
          subprefeituraNome: subNome
        },
        opcoesRespostaRapida: [
          '👀 Ver no Kanban',
          '🗺️ Localizar no Mapa',
          '🚨 Abrir Outro Chamado'
        ]
      });
      return;
    }

    // Avaliação de Atendimento
    if (t.includes('avaliar') || t.includes('avaliação')) {
      adicionarMensagem({
        remetente: 'BOT_SP156',
        texto: 'Por favor, avalie a rapidez e clareza do atendimento do canal oficial SP156:',
        tipoAnexo: 'AVALIACAO',
        opcoesRespostaRapida: ['⭐⭐⭐⭐⭐ Excelente', '⭐⭐⭐⭐ Bom', '⭐⭐⭐ Regular']
      });
      return;
    }

    // Detecção Semântica de Categoria
    const cat = detectarCategoriaPorTexto(textoCidadao);
    setSelectedCategoria(cat);

    adicionarMensagem({
      remetente: 'BOT_SP156',
      texto: `Recebido com sucesso! 🤖\n\nIdentifiquei a categoria: **${cat.replace('_', ' ')}**.\n\nPara que possamos emitir a Ordem de Serviço à equipe de zeladoria, envie a localização e, se possível, anexe uma foto da ocorrência.`,
      tipoAnexo: 'BOTAO_ACAO',
      anexoDados: {
        categoria: cat,
        prazoHoras: 48,
        endereco: 'Av. Moema, 1200 - Moema, São Paulo'
      },
      opcoesRespostaRapida: [
        '📍 Enviar Minha Localização Atual',
        '📸 Anexar Foto da Ocorrência',
        '✅ Confirmar e Gerar Protocolo'
      ]
    });
  };

  const handleSimularLocalizacao = () => {
    adicionarMensagem({
      remetente: 'CIDADAO',
      texto: '📍 Localização GPS compartilhada em tempo real',
      tipoAnexo: 'LOCALIZACAO',
      anexoDados: {
        endereco: 'Av. Moema, 1200 - Moema, São Paulo - SP',
        lat: -23.6030,
        lng: -46.6610
      }
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      adicionarMensagem({
        remetente: 'BOT_SP156',
        texto: '📍 Localização validada com sucesso na malha viária!\nJurisdição operacional: **Subprefeitura Vila Mariana — Distrito Moema**.\n\nDeseja anexar uma foto para guiar a equipe da viatura ou deseja emitir o protocolo agora?',
        opcoesRespostaRapida: [
          '📸 Anexar Foto da Ocorrência',
          '🚀 Emitir Protocolo Oficial SP156'
        ]
      });
    }, 800);
  };

  const handleSimularEnvioFoto = () => {
    if (modoSimulacao === 'TRABALHADOR') {
      handleWorkerEnviarFotoAntes();
      return;
    }

    const fotoUrl = FOTOS_SIMULADAS_ZAP[selectedCategoria] || FOTOS_SIMULADAS_ZAP.TAPA_BURACO;
    adicionarMensagem({
      remetente: 'CIDADAO',
      texto: 'Foto anexada da via:',
      tipoAnexo: 'FOTO',
      anexoUrl: fotoUrl
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      adicionarMensagem({
        remetente: 'BOT_SP156',
        texto: 'Foto recebida e processada pela IA de triagem! Evidência vinculada à solicitação.\n\nPodemos confirmar o envio para a Subprefeitura?',
        opcoesRespostaRapida: [
          '🚀 Confirmar e Gerar Protocolo SP156'
        ]
      });
    }, 800);
  };

  const handleConcluirAberturaChamado = () => {
    const ano = new Date().getFullYear();
    const numeroAleatorio = Math.floor(10000 + Math.random() * 90000);
    const novoProtocolo = `${ano}-SP156-${numeroAleatorio}`;

    const novoChamado: Chamado = {
      id: crypto.randomUUID(),
      protocolo: novoProtocolo,
      categoria: selectedCategoria,
      subprefeituraId: '2',
      distrito: 'Moema',
      bairro: 'Moema (Pássaros)',
      status: 'NOVO',
      prioridade: selectedCategoria === 'ARVORE_CAIDA' || selectedCategoria === 'BUEIRO' ? 'URGENTE' : 'ALTA',
      lat: -23.6030 + (Math.random() - 0.5) * 0.008,
      lng: -46.6610 + (Math.random() - 0.5) * 0.008,
      dataAbertura: new Date().toISOString(),
      isAtrasado: false,
      endereco: 'Av. Moema, 1200 - Moema',
      origem: 'WHATSAPP_SP156',
      telefoneCidadao: zapSession.numeroTelefone
    };

    onCriarChamado(novoChamado);

    addNotification({
      titulo: 'Novo Chamado SP156 Aberto',
      mensagem: `Protocolo ${novoProtocolo} (${selectedCategoria.replace('_', ' ')}) inserido na malha operacional com sucesso.`,
      tipo: 'sucesso',
      linkSection: 'painel_admin',
      protocolo: novoProtocolo
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      adicionarMensagem({
        remetente: 'BOT_SP156',
        texto: `🎉 **Ordem de Serviço Aberta com Sucesso!**\n\n📋 **Protocolo:** \`${novoProtocolo}\`\n🏷️ **Serviço:** ${selectedCategoria.replace('_', ' ')}\n📍 **Endereço:** Av. Moema, 1200\n🏢 **Subprefeitura:** Vila Mariana • Distrito Moema\n⏱️ **Prazo Regulamentar:** 48 horas úteis\n\nO chamado já está visível para os supervisores da SUB-VM. Avisaremos você por aqui em cada etapa do atendimento!`,
        tipoAnexo: 'PROTOCOLO',
        anexoDados: {
          protocolo: novoProtocolo,
          categoria: selectedCategoria,
          statusChamado: 'NOVO',
          subprefeituraNome: 'Vila Mariana',
          prazoHoras: 48
        },
        opcoesRespostaRapida: [
          '👀 Ver no Kanban',
          '🗺️ Ver no Mapa de Calor',
          '⭐ Avaliar este Atendimento'
        ]
      });
    }, 950);
  };

  const handleSimularNotificacaoConclusao = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const chamadoAlvo = chamados[0];
      adicionarMensagem({
        remetente: 'BOT_SP156',
        texto: `🔔 **Serviço Concluído pela Subprefeitura!**\n\nInformamos que os trabalhos do protocolo **${chamadoAlvo.protocolo}** foram finalizados pela equipe de rua.\n\nSegue a comprovação fotográfica com carimbo técnico georreferenciado:`,
        tipoAnexo: 'FOTO',
        anexoUrl: chamadoAlvo.fotoDepois || FOTOS_TRABALHADOR_ZAP.DEPOIS_TAPA_BURACO,
        anexoDados: {
          protocolo: chamadoAlvo.protocolo,
          statusChamado: 'CONCLUIDO'
        },
        opcoesRespostaRapida: [
          '⭐ Avaliar este Atendimento',
          '✅ Confirmar Recebimento',
          '🚨 Reabrir se não resolvido'
        ]
      });
    }, 850);
  };

  const handleAvaliarEstrelas = (num: number) => {
    adicionarMensagem({
      remetente: 'CIDADAO',
      texto: `Nota registrada: ${'⭐'.repeat(num)} (${num}/5 estrelas)`,
      statusEnvio: 'LIDO'
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      adicionarMensagem({
        remetente: 'BOT_SP156',
        texto: `Agradecemos pela avaliação de ${num} estrelas! 🌟\nSeu feedback é fundamental para o aprimoramento dos serviços públicos da Cidade de São Paulo.`,
        opcoesRespostaRapida: [
          '🚨 Abrir Novo Chamado',
          '🔍 Consultar Protocolo'
        ]
      });
    }, 700);
  };

  // ==================== FLUXO TRABALHADOR / OPERACIONAL (ZAP DE CAMPO) ====================
  const handleWorkerListarOS = () => {
    // Buscar OSs pendentes da região
    const ossDisponiveis = chamados.slice(0, 3);
    const osTexto = ossDisponiveis.map((os, idx) => 
      `${idx + 1}️⃣ *${os.protocolo}* — ${os.categoria.replace('_', ' ')}\n📍 ${os.endereco || 'Via Pública'}\n🚦 Status: ${os.status} • Prioridade: ${os.prioridade}`
    ).join('\n\n');

    adicionarMensagem({
      remetente: 'BOT_SP156',
      texto: `📋 *Ordens de Serviço em Aberto para a Viatura V-04 (Vila Mariana):*\n\n${osTexto}\n\nSelecione uma ação rápida para a OS prioritária:`,
      opcoesRespostaRapida: [
        `🚀 Iniciar Atendimento ${ossDisponiveis[0]?.protocolo || 'OS'}`,
        '📸 Enviar Foto do ANTES',
        '🦺 Checklist de Segurança',
        '🏁 Finalizar com Foto DEPOIS'
      ]
    });
  };

  const handleWorkerIniciarAtendimento = (protocoloAlvo?: string) => {
    const targetProt = protocoloAlvo || chamados[0]?.protocolo || '2026-SP156-90412';

    // Atualiza estado do chamado no app para EM_EXECUCAO
    if (setChamados) {
      setChamados(prev => prev.map(c => 
        (c.protocolo === targetProt || c.id === chamados[0]?.id)
          ? { ...c, status: 'EM_EXECUCAO' }
          : c
      ));
    }

    addNotification({
      titulo: 'OS em Atendimento via WhatsApp',
      mensagem: `Viatura V-04 iniciou deslocamento e execução da OS ${targetProt} pelo WhatsApp.`,
      tipo: 'info',
      linkSection: 'painel_admin',
      protocolo: targetProt
    });

    adicionarMensagem({
      remetente: 'BOT_SP156',
      texto: `🚀 *Atendimento Iniciado na OS ${targetProt}!* \n\n⏱️ Cronômetro operacional ativado.\n📊 O status no Kanban da Subprefeitura foi alterado para *EM EXECUÇÃO* em tempo real.\n\n⚠️ *Próximo passo obrigatório:* Envie a foto da via antes da intervenção (*FOTO DO ANTES*).`,
      opcoesRespostaRapida: [
        '📸 Enviar Foto do ANTES',
        '🦺 Checklist de Segurança (EPI e Cones)',
        '⚠️ Reportar Risco/Escalar'
      ]
    });
  };

  const handleWorkerEnviarFotoAntes = () => {
    const fotoAntes = FOTOS_TRABALHADOR_ZAP.ANTES_TAPA_BURACO;

    adicionarMensagem({
      remetente: 'CIDADAO',
      texto: '📸 [FOTO DO ANTES ENVIADA]\nRegistro fotográfico preliminar da pista com GPS: -23.5881, -46.6386 (Precisão: 3m).',
      tipoAnexo: 'FOTO',
      anexoUrl: fotoAntes
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      adicionarMensagem({
        remetente: 'BOT_SP156',
        texto: `✅ *Foto do ANTES homologada com sucesso!*\n\n• Carimbo de Data/Hora: ${gerarTimestampAtual()} • Validação GPS: Av. Domingos de Morais, 1840\n• Metadados gravados no Dossiê SEI-PMSP.\n\nFaça a conferência de segurança da equipe para liberação do asfalto:`,
        opcoesRespostaRapida: [
          '🦺 Registrar Checklist de Segurança',
          '🏁 Finalizar Serviço com Foto DEPOIS'
        ]
      });
    }, 850);
  };

  const handleWorkerChecklist = () => {
    adicionarMensagem({
      remetente: 'CIDADAO',
      texto: '🦺 [CHECKLIST DE SEGURANÇA E CONFORMIDADE]\n✔ EPIs da equipe (botinas, óculos, luvas, coletes reflexivos)\n✔ Sinalização diurna com 8 cones e bandeiras de tráfego\n✔ Área isolada sem risco a pedestres',
      statusEnvio: 'LIDO'
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      adicionarMensagem({
        remetente: 'BOT_SP156',
        texto: '🦺 *Conformidade Técnica Registrada!*\n\nNorma regulamentadora NR-18 e portaria municipal SMSUB/PMSP atendidas. Trabalho autorizado em pista.\n\nQuando finalizar o assentamento da massa ou corte de galhos, envie a *FOTO DO DEPOIS*.',
        opcoesRespostaRapida: [
          '🏁 Enviar Foto do DEPOIS e Finalizar OS',
          '⚠️ Reportar Risco/Interferência'
        ]
      });
    }, 750);
  };

  const handleWorkerFinalizarOS = () => {
    const targetProt = chamados[0]?.protocolo || '2026-SP156-90412';
    const fotoDepois = FOTOS_TRABALHADOR_ZAP.DEPOIS_TAPA_BURACO;

    adicionarMensagem({
      remetente: 'CIDADAO',
      texto: '🏁 [FOTO DO DEPOIS ENVIADA]\nServiço de compactação asfáltica concluído com sucesso. Pista limpa e trânsito liberado.',
      tipoAnexo: 'FOTO',
      anexoUrl: fotoDepois
    });

    // Atualiza status do chamado no App para AGUARDANDO_APROVACAO com a foto do depois
    if (setChamados) {
      setChamados(prev => prev.map(c => 
        (c.protocolo === targetProt || c.id === chamados[0]?.id)
          ? { ...c, status: 'AGUARDANDO_APROVACAO', fotoDepois }
          : c
      ));
    }

    addNotification({
      titulo: 'OS Concluída via WhatsApp pelo Técnico',
      mensagem: `Viatura V-04 finalizou a OS ${targetProt} pelo WhatsApp. Vistoria aguardando aprovação do Gestor no Kanban.`,
      tipo: 'sucesso',
      linkSection: 'painel_admin',
      protocolo: targetProt
    });

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      adicionarMensagem({
        remetente: 'BOT_SP156',
        texto: `🎉 *PARABÉNS, EQUIPE V-04! OS FINALIZADA COM SUCESSO!*\n\n📋 **Protocolo:** \`${targetProt}\`\n🚦 **Novo Status:** *AGUARDANDO APROVAÇÃO*\n\n• A foto do DEPOIS foi anexada ao sistema central.\n• O Gestor da Subprefeitura Vila Mariana recebeu o alerta para validação técnica no Kanban.\n• O morador solicitante foi automaticamente notificado pelo WhatsApp SP156!\n\nPronto para a próxima ordem da rota?`,
        tipoAnexo: 'PROTOCOLO',
        anexoDados: {
          protocolo: targetProt,
          statusChamado: 'AGUARDANDO_APROVACAO',
          subprefeituraNome: 'Vila Mariana'
        },
        opcoesRespostaRapida: [
          '📋 Ver Próxima OS da Rota',
          '👀 Ver no Kanban do Gestor',
          '🏁 Encerrar Turno'
        ]
      });
    }, 1000);
  };

  const handleWorkerEscalarRisco = () => {
    const targetProt = chamados[0]?.protocolo || '2026-SP156-90412';

    if (setChamados) {
      setChamados(prev => prev.map(c => 
        (c.protocolo === targetProt || c.id === chamados[0]?.id)
          ? { ...c, prioridade: 'URGENTE' }
          : c
      ));
    }

    addNotification({
      titulo: '⚠️ Risco Crítico Escalar via WhatsApp',
      mensagem: `Técnico da Viatura V-04 reportou interferência de risco elétrico na OS ${targetProt}. Prioridade elevada para URGENTE.`,
      tipo: 'urgente',
      linkSection: 'sala_situacao',
      protocolo: targetProt
    });

    adicionarMensagem({
      remetente: 'BOT_SP156',
      texto: `⚠️ *INTERCORRÊNCIA CRÍTICA REGISTRADA!*\n\n• Protocolo reclassificado para **URGENTE** na Sala de Situação.\n• Acionamento imediato da Central de Operações da PMSP e concessionária Enel/Sabesp.\n• Mantenha a equipe afastada e aguarde o suporte técnico.`,
      opcoesRespostaRapida: [
        '📋 Ver Próxima OS da Rota',
        '🗺️ Ver na Sala de Situação'
      ]
    });
  };

  const processarRespostaBotTrabalhador = (textoTrabalhador: string) => {
    const t = textoTrabalhador.toLowerCase();

    if (t.includes('listar') || t.includes('minhas') || t.includes('os') || t.includes('ordens') || t.includes('rota')) {
      handleWorkerListarOS();
      return;
    }

    if (t.includes('iniciar') || t.includes('começar') || t.includes('deslocamento')) {
      handleWorkerIniciarAtendimento();
      return;
    }

    if (t.includes('antes') || t.includes('foto antes')) {
      handleWorkerEnviarFotoAntes();
      return;
    }

    if (t.includes('checklist') || t.includes('epi') || t.includes('segurança') || t.includes('cones')) {
      handleWorkerChecklist();
      return;
    }

    if (t.includes('depois') || t.includes('finalizar') || t.includes('concluir') || t.includes('terminar')) {
      handleWorkerFinalizarOS();
      return;
    }

    if (t.includes('risco') || t.includes('escalar') || t.includes('fio') || t.includes('perigo')) {
      handleWorkerEscalarRisco();
      return;
    }

    // Resposta padrão caso digite outra coisa
    adicionarMensagem({
      remetente: 'BOT_SP156',
      texto: `Comando recebido: "${textoTrabalhador}". Como deseja proceder na Ordem de Serviço da V-04?`,
      opcoesRespostaRapida: [
        '📋 Minhas OSs Designadas',
        '🚀 Iniciar Atendimento',
        '📸 Enviar Foto do ANTES',
        '🏁 Finalizar com Foto DEPOIS'
      ]
    });
  };

  const handleOpcaoClick = (opcao: string) => {
    if (modoSimulacao === 'TRABALHADOR') {
      if (opcao.includes('Minhas OSs') || opcao.includes('Próxima OS')) {
        adicionarMensagem({ remetente: 'CIDADAO', texto: opcao });
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          handleWorkerListarOS();
        }, 600);
      } else if (opcao.includes('Iniciar Atendimento')) {
        adicionarMensagem({ remetente: 'CIDADAO', texto: opcao });
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          handleWorkerIniciarAtendimento();
        }, 600);
      } else if (opcao.includes('Foto do ANTES')) {
        handleWorkerEnviarFotoAntes();
      } else if (opcao.includes('Checklist')) {
        handleWorkerChecklist();
      } else if (opcao.includes('Foto DEPOIS') || opcao.includes('Finalizar')) {
        handleWorkerFinalizarOS();
      } else if (opcao.includes('Risco') || opcao.includes('Escalar')) {
        adicionarMensagem({ remetente: 'CIDADAO', texto: '⚠️ Reportar risco iminente na via' });
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          handleWorkerEscalarRisco();
        }, 600);
      } else if (opcao.includes('Kanban')) {
        onNavigateToSection?.('painel_admin');
      } else if (opcao.includes('Sala de Situação') || opcao.includes('Mapa')) {
        onNavigateToSection?.('sala_situacao');
      } else {
        handleEnviarMensagemTexto(opcao);
      }
      return;
    }

    // Modo Cidadão
    if (opcao.includes('Localização')) {
      handleSimularLocalizacao();
    } else if (opcao.includes('Foto')) {
      handleSimularEnvioFoto();
    } else if (opcao.includes('Emitir Protocolo') || opcao.includes('Confirmar e Gerar') || opcao.includes('Confirmar Abertura')) {
      handleConcluirAberturaChamado();
    } else if (opcao.includes('Kanban')) {
      onNavigateToSection?.('painel_admin');
    } else if (opcao.includes('Mapa')) {
      onNavigateToSection?.('sala_situacao');
    } else if (opcao.includes('Excelente')) {
      handleAvaliarEstrelas(5);
    } else if (opcao.includes('Bom')) {
      handleAvaliarEstrelas(4);
    } else if (opcao.includes('Regular')) {
      handleAvaliarEstrelas(3);
    } else if (opcao.includes('Avaliar')) {
      handleEnviarMensagemTexto('Desejo avaliar o atendimento');
    } else {
      handleEnviarMensagemTexto(opcao);
    }
  };

  const reiniciarConversa = () => {
    if (modoSimulacao === 'CIDADAO') {
      setZapSession({
        conversaId: `zap-${Date.now()}`,
        numeroTelefone: '+55 11 98452-1920',
        nomeCidadao: 'Carlos Eduardo Silveira',
        etapaAtual: 'MENU_PRINCIPAL',
        mensagens: [
          {
            id: 'msg-reiniciar',
            remetente: 'BOT_SP156',
            texto: 'Olá, Carlos! 👋 Sou o assistente oficial do canal SP156 WhatsApp da Prefeitura de São Paulo.\n\nComo posso ajudar você hoje?',
            timestamp: gerarTimestampAtual(),
            statusEnvio: 'LIDO',
            opcoesRespostaRapida: [
              '🚨 Abrir Novo Chamado',
              '🔍 Consultar Protocolo',
              '⭐ Avaliar Atendimento'
            ]
          }
        ]
      });
    } else {
      setWorkerSession(MOCK_CONVERSA_TRABALHADOR_INICIAL);
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-7xl mx-auto w-full flex flex-col gap-6">
      
      {/* SELETOR PRINCIPAL DE DUPLA SIMULAÇÃO: MORADOR vs. TRABALHADOR */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
              WhatsApp Oficial de Zeladoria Urbana • PMSP
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Duas possibilidades de operação: Munícipe abre chamados via SP156 ou Trabalhador executa as OSs pelo próprio WhatsApp, sem fricção.
          </p>
        </div>

        {/* Toggle Munícipe vs Trabalhador */}
        <div className="flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-semibold w-full md:w-auto">
          <button
            onClick={() => setModoSimulacao('CIDADAO')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              modoSimulacao === 'CIDADAO'
                ? 'bg-white text-emerald-800 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-emerald-600" />
            <span>👤 Visão Morador (SP156)</span>
          </button>
          <button
            onClick={() => setModoSimulacao('TRABALHADOR')}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-3.5 py-2 rounded-lg transition-all ${
              modoSimulacao === 'TRABALHADOR'
                ? 'bg-[#0A192F] text-amber-400 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HardHat className="w-4 h-4 text-amber-400" />
            <span>👷 Visão Trabalhador (Campo)</span>
          </button>
        </div>
      </div>

      {/* Grid Principal: Painel de Cenários + Chat WhatsApp */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Coluna Esquerda: Cenários e Automações Rápidas */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          
          {/* Banner do Modo Ativo */}
          <div className={`p-4 rounded-2xl border text-xs shadow-xs ${
            modoSimulacao === 'TRABALHADOR'
              ? 'bg-amber-50/90 border-amber-200 text-amber-900'
              : 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
          }`}>
            <div className="flex items-center gap-2 font-bold text-sm mb-1">
              {modoSimulacao === 'TRABALHADOR' ? (
                <>
                  <Wrench className="w-4 h-4 text-amber-600" />
                  <span>Modo Campo: Confirmação de Trabalho pelo Zap</span>
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 text-emerald-600" />
                  <span>Modo Munícipe: Abertura e Consulta SP156</span>
                </>
              )}
            </div>
            <p className="leading-relaxed opacity-90">
              {modoSimulacao === 'TRABALHADOR'
                ? 'Permite ao encarregado no trecho enviar fotos do Antes e Depois, responder checklist de segurança e homologar o serviço sem necessidade do aplicativo, mantendo total auditoria e mudando o Kanban em tempo real.'
                : 'Interface direta com o cidadão paulistano para relato com foto, geolocalização automática e consulta de prazo regulamentar.'}
            </p>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                {modoSimulacao === 'TRABALHADOR' ? 'Ações do Trabalhador no Zap' : 'Cenários Guiados de Teste'}
              </span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                1-Clique
              </span>
            </div>

            {/* CENÁRIOS DO TRABALHADOR */}
            {modoSimulacao === 'TRABALHADOR' ? (
              <div className="space-y-2.5">
                <button
                  onClick={handleWorkerListarOS}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-300 rounded-xl transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-amber-900 flex items-center gap-1.5">
                      <ClipboardList className="w-3.5 h-3.5 text-amber-600" />
                      1. Listar OSs Designadas da V-04
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-700 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    O trabalhador consulta a rota do dia direto no Zap e escolhe a OS prioritária.
                  </p>
                </button>

                <button
                  onClick={() => handleWorkerIniciarAtendimento()}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-900 flex items-center gap-1.5">
                      <Truck className="w-3.5 h-3.5 text-blue-600" />
                      2. Iniciar Deslocamento & OS
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Altera o status da OS para EM EXECUÇÃO no Kanban e avisa a Sala de Situação.
                  </p>
                </button>

                <button
                  onClick={handleWorkerEnviarFotoAntes}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5 text-emerald-600" />
                      3. Enviar Evidência do ANTES
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Foto com carimbo de coordenadas e data/hora para auditoria do serviço inicial.
                  </p>
                </button>

                <button
                  onClick={handleWorkerChecklist}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-900 flex items-center gap-1.5">
                      <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                      4. Responder Checklist de Segurança
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-700 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Confirmação de EPIs e cones de sinalização na via para conformidade com a NR-18.
                  </p>
                </button>

                <button
                  onClick={handleWorkerFinalizarOS}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      5. Enviar Foto do DEPOIS & Finalizar OS
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Avança a OS para AGUARDANDO APROVAÇÃO no Kanban e dispara notificação ao cidadão!
                  </p>
                </button>

                <button
                  onClick={handleWorkerEscalarRisco}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-300 rounded-xl transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-red-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                      6. Reportar Risco/Interferência
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-red-700 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Sinaliza risco elétrico ou interferência grave elevando a prioridade para URGENTE.
                  </p>
                </button>
              </div>
            ) : (
              /* CENÁRIOS DO MORADOR / CIDADÃO */
              <div className="space-y-2.5">
                <button
                  onClick={() => handleEnviarMensagemTexto('Tem um buraco perigoso na pista aqui na Av. Moema, altura do 1200')}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">
                      🕳️ Cenário A: Tapa-Buraco em Moema
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Munícipe relata buraco com risco a motociclistas. O bot sugere prazo de 24h e solicita foto.
                  </p>
                </button>

                <button
                  onClick={() => handleEnviarMensagemTexto('Árvore de grande porte caiu com a tempestade na Praça da Árvore, distrito Saúde, e derrubou fios')}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 rounded-xl transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">
                      🌳 Cenário B: Árvore com Risco Elétrico
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Demanda classificada com prioridade URGENTE e encaminhamento imediato para Defesa Civil.
                  </p>
                </button>

                <button
                  onClick={() => handleEnviarMensagemTexto('Consultar andamento do meu protocolo')}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-blue-900">
                      🔍 Cenário C: Consulta de Protocolo
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-700 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Retorna o status em tempo real do chamado com botão de atalho para o Kanban ou Mapa.
                  </p>
                </button>

                <button
                  onClick={handleSimularNotificacaoConclusao}
                  className="w-full text-left p-3 bg-slate-50 hover:bg-purple-50 border border-slate-200 hover:border-purple-300 rounded-xl transition-all group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800 group-hover:text-purple-900">
                      🔔 Cenário D: Notificação de Conclusão
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-purple-700 transition-transform group-hover:translate-x-0.5" />
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    Dispara a mensagem automática push de conclusão com a foto do DEPOIS e pedido de avaliação.
                  </p>
                </button>
              </div>
            )}
          </div>

          {/* Card Explicativo com Vínculo ao Kanban */}
          <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 border border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Auditoria e Transparência PMSP
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              O trabalhador pode optar por usar o <strong>App de Campo</strong> ou o próprio <strong>WhatsApp</strong>. Ambos alimentam a mesma esteira de auditoria com coordenadas e fotografias antes da aprovação do Gestor.
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Total de Chamados na Rede:</span>
              <span className="font-mono font-bold text-emerald-400">{chamados.length}</span>
            </div>
          </div>
        </div>

        {/* Coluna Direita: Container do Chat com Moldura Mobile Opcional */}
        <div className={`lg:col-span-8 flex justify-center w-full ${deviceMode === 'EXPANDIDO' ? 'w-full' : ''}`}>
          <div 
            className={`w-full transition-all duration-300 ${
              deviceMode === 'SMARTPHONE'
                ? 'max-w-full sm:max-w-[430px] rounded-2xl sm:rounded-[42px] border-2 sm:border-[10px] border-slate-800 shadow-2xl overflow-hidden bg-slate-900'
                : 'max-w-4xl rounded-2xl border border-slate-300 shadow-lg overflow-hidden'
            }`}
          >
            {/* Barra Superior do Smartphone (Status Bar) */}
            {deviceMode === 'SMARTPHONE' && (
              <div className="bg-slate-900 text-white px-6 pt-2 pb-1 flex items-center justify-between text-[11px] font-semibold select-none">
                <span>{gerarTimestampAtual()}</span>
                {/* Notch / Dynamic Island */}
                <div className="w-24 h-4 bg-black rounded-full mx-auto"></div>
                <div className="flex items-center gap-1.5">
                  <Wifi className="w-3.5 h-3.5" />
                  <Battery className="w-4 h-4" />
                </div>
              </div>
            )}

            {/* Cabeçalho Oficial do WhatsApp */}
            <div className={`${modoSimulacao === 'TRABALHADOR' ? 'bg-[#0A192F]' : 'bg-[#075e54]'} text-white px-4 py-3 flex items-center justify-between shrink-0 shadow-md transition-colors`}>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center p-1 border-2 shadow-inner ${
                    modoSimulacao === 'TRABALHADOR' ? 'bg-slate-800 border-amber-400' : 'bg-[#0A192F] border-amber-400'
                  }`}>
                    <BrasaoSaoPaulo size={24} />
                  </div>
                  <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 ${
                    modoSimulacao === 'TRABALHADOR' ? 'bg-amber-400 border-slate-900' : 'bg-emerald-400 border-[#075e54]'
                  }`}></div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm tracking-tight">
                      {modoSimulacao === 'TRABALHADOR' ? 'Zeladoria PMSP • Canal de Campo' : 'SP156 Oficial • São Paulo'}
                    </span>
                    <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white text-[#075e54] text-[9px] font-black" title="Conta Verificada">
                      ✓
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-200">
                    {isTyping 
                      ? 'digitando...' 
                      : (modoSimulacao === 'TRABALHADOR' 
                          ? 'Viatura V-04 (Vila Mariana) • Online no Trecho' 
                          : 'online • Atendimento Oficial')}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-emerald-100">
                {/* Seletor de Modo Smartphone vs Expandido */}
                <button
                  onClick={() => setDeviceMode(deviceMode === 'SMARTPHONE' ? 'EXPANDIDO' : 'SMARTPHONE')}
                  title={deviceMode === 'SMARTPHONE' ? 'Expandir' : 'Modo Celular'}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  {deviceMode === 'SMARTPHONE' ? <Maximize2 className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setSomAtivo(!somAtivo)}
                  title={somAtivo ? 'Desativar som' : 'Ativar som'}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Volume2 className={`w-4 h-4 ${somAtivo ? 'opacity-100' : 'opacity-40'}`} />
                </button>

                <button
                  onClick={reiniciarConversa}
                  title="Reiniciar chat"
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Feed de Mensagens com Textura Oficial */}
            <div 
              className={`p-4 space-y-3 bg-[#e5ddd5] overflow-y-auto ${
                deviceMode === 'SMARTPHONE' ? 'h-[520px]' : 'h-[620px]'
              }`}
              style={{
                backgroundImage: 'radial-gradient(#d4c9bd 1px, transparent 1px)',
                backgroundSize: '16px 16px'
              }}
            >
              {/* Badge de Segurança */}
              <div className="flex justify-center my-1">
                <span className="bg-[#dcf8c6] text-emerald-950 text-[10px] font-medium px-3 py-1 rounded-full shadow-sm border border-emerald-200/80">
                  {modoSimulacao === 'TRABALHADOR' 
                    ? '🔒 Canal de Zeladoria Auditado • Conectado ao Kanban da Subprefeitura' 
                    : '🔒 Mensagens integradas ao SP156 e Secretaria das Subprefeituras'}
                </span>
              </div>

              {activeSession.mensagens.map((msg) => {
                const isUserMsg = msg.remetente === 'CIDADAO';

                return (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col ${isUserMsg ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-3.5 py-2.5 shadow-sm text-sm relative ${
                        isUserMsg 
                          ? 'bg-[#dcf8c6] text-slate-800 rounded-tr-none' 
                          : 'bg-white text-slate-800 rounded-tl-none border border-slate-200/60'
                      }`}
                    >
                      {/* Remetente Bot */}
                      {!isUserMsg && (
                        <div className="flex items-center gap-1 text-[11px] font-bold text-[#075e54] mb-1">
                          {modoSimulacao === 'TRABALHADOR' ? (
                            <>
                              <HardHat className="w-3.5 h-3.5 text-amber-600" />
                              <span>Supervisão de Campo PMSP</span>
                            </>
                          ) : (
                            <>
                              <Bot className="w-3.5 h-3.5 text-emerald-700" />
                              <span>Assistente Virtual SP156</span>
                            </>
                          )}
                        </div>
                      )}

                      {/* Texto com markdown sutil */}
                      <div className="whitespace-pre-line leading-relaxed text-xs sm:text-sm">
                        {msg.texto}
                      </div>

                      {/* Anexo de Foto com Clique para Zoom */}
                      {msg.tipoAnexo === 'FOTO' && msg.anexoUrl && (
                        <div 
                          onClick={() => setFotoModalUrl(msg.anexoUrl || null)}
                          className="mt-2 rounded-xl overflow-hidden border border-slate-200 shadow-sm cursor-pointer relative group"
                        >
                          <img 
                            src={msg.anexoUrl} 
                            alt="Anexo da Ocorrência" 
                            className="w-full h-40 object-cover group-hover:scale-105 transition-transform"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold transition-opacity">
                            Clique para ampliar evidência
                          </div>
                        </div>
                      )}

                      {/* Anexo de Localização */}
                      {msg.tipoAnexo === 'LOCALIZACAO' && msg.anexoDados && (
                        <div className="mt-2 p-2 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div className="text-xs">
                            <div className="font-semibold text-slate-800">Localização Confirmada</div>
                            <div className="text-slate-500 line-clamp-1">{msg.anexoDados.endereco}</div>
                          </div>
                        </div>
                      )}

                      {/* Anexo de Protocolo */}
                      {msg.tipoAnexo === 'PROTOCOLO' && msg.anexoDados && (
                        <div className="mt-2.5 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs space-y-1.5">
                          <div className="flex items-center justify-between font-bold text-emerald-800">
                            <span>Ordem de Serviço SP156</span>
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          </div>
                          <div className="text-slate-600">
                            Protocolo: <span className="font-mono font-bold text-slate-800">{msg.anexoDados.protocolo}</span>
                          </div>
                          <div className="text-slate-600">
                            Subprefeitura: <span className="font-semibold text-slate-800">{msg.anexoDados.subprefeituraNome}</span>
                          </div>
                          <div className="text-slate-600">
                            Status: <span className="font-semibold text-emerald-700">{msg.anexoDados.statusChamado}</span>
                          </div>
                        </div>
                      )}

                      {/* Anexo de Avaliação */}
                      {msg.tipoAnexo === 'AVALIACAO' && (
                        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleAvaliarEstrelas(star)}
                              className="p-1 text-amber-400 hover:scale-125 transition-transform"
                              title={`${star} estrelas`}
                            >
                              <Star className="w-6 h-6 fill-current" />
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Timestamp e Status de Leitura */}
                      <div className="flex items-center justify-end gap-1 mt-1 text-[10px] text-slate-400">
                        <span>{msg.timestamp}</span>
                        {isUserMsg && (
                          <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                        )}
                      </div>
                    </div>

                    {/* Botões de Resposta Rápida */}
                    {msg.opcoesRespostaRapida && msg.opcoesRespostaRapida.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2 max-w-[85%]">
                        {msg.opcoesRespostaRapida.map((opcao, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleOpcaoClick(opcao)}
                            className="text-xs bg-white hover:bg-emerald-50 text-slate-800 font-medium px-3 py-1.5 rounded-full border border-emerald-200 shadow-xs transition-all hover:border-emerald-400 flex items-center gap-1.5 hover:scale-102"
                          >
                            {opcao}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Digitando... */}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-white px-3 py-2 rounded-2xl rounded-tl-none w-fit shadow-sm border border-slate-200">
                  <Bot className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                  <span>{modoSimulacao === 'TRABALHADOR' ? 'Supervisão de Campo digitando...' : 'SP156 digitando...'}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Barra de Entrada de Mensagem */}
            <div className="bg-[#f0f2f5] p-2.5 sm:p-3 border-t border-slate-200 flex items-center gap-2 shrink-0">
              <button 
                onClick={handleSimularEnvioFoto}
                title={modoSimulacao === 'TRABALHADOR' ? "Enviar foto do Antes/Depois" : "Anexar foto da via"}
                className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-200 rounded-full transition-colors"
              >
                <Camera className="w-5 h-5" />
              </button>
              <button 
                onClick={handleSimularLocalizacao}
                title="Enviar localização GPS"
                className="p-2 text-slate-500 hover:text-emerald-700 hover:bg-slate-200 rounded-full transition-colors"
              >
                <MapPin className="w-5 h-5" />
              </button>
              
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEnviarMensagemTexto();
                }}
                placeholder={modoSimulacao === 'TRABALHADOR' ? "Mensagem ou comando da OS..." : "Mensagem para o SP156..."}
                className="flex-1 bg-white border border-slate-300 rounded-full px-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />

              <button
                onClick={() => handleEnviarMensagemTexto()}
                disabled={!inputText.trim()}
                className={`p-2 sm:p-2.5 disabled:opacity-40 text-white rounded-full transition-colors shadow-sm ${
                  modoSimulacao === 'TRABALHADOR' ? 'bg-[#0A192F] hover:bg-slate-800' : 'bg-[#075e54] hover:bg-[#128c7e]'
                }`}
                title="Enviar"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Barra Inferior Virtual de Home do Smartphone */}
            {deviceMode === 'SMARTPHONE' && (
              <div className="bg-slate-900 py-1.5 flex justify-center">
                <div className="w-32 h-1 bg-slate-600 rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Zoom da Foto */}
      {fotoModalUrl && (
        <div 
          onClick={() => setFotoModalUrl(null)}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
        >
          <div className="max-w-xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
            <div className="p-3 bg-slate-800 text-white flex items-center justify-between text-xs">
              <span className="font-semibold">Evidência Fotográfica Georreferenciada</span>
              <button 
                onClick={() => setFotoModalUrl(null)}
                className="px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg"
              >
                Fechar
              </button>
            </div>
            <img 
              src={fotoModalUrl} 
              alt="Ampliação" 
              className="w-full max-h-[70vh] object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="p-3 bg-slate-50 text-xs text-slate-500 flex justify-between items-center">
              <span>Metadados: GPS Validados • Carimbo SP156 / PMSP</span>
              <span className="font-mono text-[11px] text-emerald-700">Auditado pela Central</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
