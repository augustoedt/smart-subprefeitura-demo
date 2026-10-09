# ADR 0015: Dupla Simulação no WhatsApp (Morador vs. Trabalhador) e Refinamento do Módulo Social (SUAS/SMADS)

## Contexto e Problema

Na zeladoria urbana real da Cidade de São Paulo, o canal WhatsApp já é a ferramenta mais difundida tanto entre munícipes (para abertura e consulta pelo SP156) quanto entre encarregados e trabalhadores de campo das subprefeituras (para envio de confirmações e fotos das intervenções). No entanto, o envio informal de fotos por mensagens soltas no WhatsApp gerava falta de auditoria, perda de coordenadas e desencontro com o sistema central de zeladoria.

Por outro lado, exigir que todo trabalhador em campo utilize exclusivamente um novo aplicativo mobile pode gerar resistência operacional inicial. A solução ideal consiste em fornecer **duas possibilidades integradas**:
1. **Usar o App de Campo dedicado**: para equipes equipadas com smartphone e interface completa.
2. **Usar o próprio WhatsApp com bot oficial PMSP**: permitindo ao trabalhador executar as mesmas ações essenciais do app (listar OSs, iniciar atendimento com mudança de status no Kanban para `EM_EXECUCAO`, registrar fotos do ANTES e DEPOIS com carimbo de tempo/GPS, responder checklist de segurança e homologar o serviço para `AGUARDANDO_APROVACAO`).

Além disso, o **Módulo Social** necessitava de um refinamento substancial para atender às diretrizes do Sistema Único de Assistência Social (SUAS) e da Secretaria Municipal de Assistência e Desenvolvimento Social (SMADS), integrando prontuários individuais, acompanhamento da rede de acolhimento (CTAs, Centros Especializados) com contagem de vagas em tempo real e capacidade de emissão de Dossiê Oficial para impressão e prestação de contas.

## Decisão

1. **Dupla Perspectiva no Módulo WhatsApp (`SimulacaoZap.tsx`)**:
   - Seletor no topo da tela permitindo alternar instantaneamente entre:
     - **👤 Visão Morador (SP156 Cidadão)**: abertura com IA de triagem, localização GPS, fotos de queixas e consulta de protocolos.
     - **👷 Visão Trabalhador (Zeladoria em Campo)**: consulta de ordens designadas para a viatura (ex.: V-04 Vila Mariana), início de atendimento, envio de foto do ANTES, resposta ao checklist de segurança/EPIs, envio de foto do DEPOIS e encerramento com transição reativa do status da OS no sistema central.
   - Painel esquerdo dinâmico com botões de cenários com 1-clique adaptados ao perfil selecionado.
   - Disparo de notificações institucionais (`addNotification`) ao iniciar OS, concluir serviço ou escalar risco em via pública.

2. **Refinamento Integral do Módulo Social (`ModuloSocial.tsx`)**:
   - **4 Sub-abas Especializadas**:
     - `📋 Base de Pessoas & Prontuários (SUAS)`: busca ativa, filtros por status, alertas de segurança e formulário completo de registro de nova abordagem.
     - `🏠 Rede de Acolhimento & Vagas (Tempo Real)`: monitoramento de capacidade, leitos livres e vagas para animais de estimação (Vaga Pet) com modal de reserva direta via SISRUA.
     - `🗺️ Mapa Territorial de Vulnerabilidade`: visualização georreferenciada de pontos quentes de permanência e localização dos centros de acolhida (CTAs).
     - `📊 Indicadores & Comparativo Semanal`: gráficos analíticos de adesão e distribuição percentual dos desfechos de atendimento.
   - **Dossiê Socioassistencial Oficial**: modal formatado com timbragem oficial da PMSP, identificação ética, histórico auditável de abordagens e botão de impressão direta (`window.print()`).

## Consequências

- **Adesão Operacional Máxima**: Atende à realidade de campo das subprefeituras sem impor barreiras de adoção tecnológica; encarregados podem atuar via WhatsApp ou App de Campo mantendo a mesma esteira de auditoria.
- **Rastreabilidade e Compliance**: Fotos do Antes/Depois e checklists enviados pelo WhatsApp atualizam o Kanban do gestor e notificam o cidadão solicitante de forma síncrona.
- **Humanização e Ética no Módulo Social**: O acolhimento passa a contar com dados estruturados de rede, histórico seguro respeitando o sigilo do cidadão (LGPD/SUAS) e gestão de vagas em tempo real nos equipamentos municipais.
