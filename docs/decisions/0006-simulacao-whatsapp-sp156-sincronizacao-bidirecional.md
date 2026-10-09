# ADR 0006 — Simulação do WhatsApp SP156 com Sincronização Reativa Bidirecional

## Data
2026-09-12

## Status
Aprovada e Implementada

## Contexto
O canal WhatsApp é o principal meio de comunicação direto com o cidadão no município de São Paulo para serviços de zeladoria urbana (SP156). Para demonstrar o impacto operacional da plataforma na ponta do cidadão e permitir testes integrados sem depender de infraestruturas externas de telefonia durante a homologação, foi solicitada uma área interativa de simulação fidedigna do WhatsApp SP156. O desafio consistia em conectar a conversa em tempo real com o Kanban de triagem administrativa e com a Sala de Situação georreferenciada.

## Decisão
1. **Tipagem e Modelagem de Conversas (`ZapMessage` e `ZapChatSession`)**:
   - Modelamos mensagens com remetentes estritos (`BOT_SP156`, `CIDADAO`, `SISTEMA`), timestamps formatados, tipos de anexos (`FOTO`, `LOCALIZACAO`, `PROTOCOLO`) e status de entrega/leitura.
2. **Componente Interativo `SimulacaoZap.tsx`**:
   - Desenvolvemos layout oficial do WhatsApp com cores institucionais (`#075e54`, `#128c7e`, fundo `#e5ddd5`), balões de fala contextuais, botões de resposta rápida (*quick replies*) e micro-interações.
   - Alternância entre **Moldura Mobile** (smartphone com notch, status bar e botões virtuais) e **Tela Cheia Expandida**.
3. **Cenários Guiados de Teste em 1-Clique**:
   - Implementamos gatilhos pré-configurados para os casos de maior impacto:
     - Tapa-buraco na pista (Mooca);
     - Árvore com risco de queda sobre fiação elétrica (Pinheiros);
     - Consulta rápida de status de protocolo existente;
     - Simulação de notificação push ativa pós-conclusão de obra.
4. **Feedback Tátil e Sonoro via Web Audio API**:
   - Síntese de áudio nativa no navegador (sem assets pesados externos) para reproduzir o tom de mensagem recebida e enviada do mensageiro.
5. **Integração Reativa Bidirecional em `App.tsx`**:
   - Chamados abertos via WhatsApp são injetados diretamente no estado raiz `chamados`, refletindo de imediato no Kanban e no Mapa de Calor.
   - Quando qualquer chamado muda seu status para `CONCLUIDO` (no Kanban ou no App de Campo), um interceptador emite automaticamente uma mensagem push com a foto do "DEPOIS" para o munícipe.

## Consequências
- **Positivas**:
  - Demonstração ponta a ponta do ciclo de vida da zeladoria (Abertura no WhatsApp → Triagem no Kanban → Execução no App de Campo → Notificação de volta no WhatsApp).
  - Experiência interativa de alta fidelidade visual e auditiva.
  - Zero dependência de chaves de API pagas ou gateways de mensageria para a simulação funcional.
- **Limitações e Mitigações**:
  - O estado da conversa é mantido na sessão React em memória; caso o usuário queira reiniciar o teste, um botão "Reiniciar" limpa a conversa e restaura o menu inicial com um clique.
