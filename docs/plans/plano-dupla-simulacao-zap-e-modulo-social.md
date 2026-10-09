# Plano de Execução: Dupla Simulação no WhatsApp & Refinamento do Módulo Social

> **Status:** Concluído com Sucesso  
> **Data:** 2026-09-14  
> **Módulos Afetados:** WhatsApp SP156 (`SimulacaoZap.tsx`), Módulo Social (`ModuloSocial.tsx`), Camada de Dados (`dataZap.ts`), Gerenciamento Global de Estado (`App.tsx`).

---

## 1. Objetivos Estratégicos

1. **Atender à Realidade Operacional da Zeladoria**:
   - Oferecer duas alternativas sinérgicas para os encarregados de campo:
     - **Opção 1:** Usar o aplicativo dedicado (`AppCampo.tsx`).
     - **Opção 2:** Usar o WhatsApp oficial com bot automatizado da PMSP (`SimulacaoZap.tsx`).
   - Evitar atritos na adesão do time de rua, profissionalizando o fluxo já habitual de confirmação de serviços pelo WhatsApp com auditoria fotográfica e atualização síncrona do Kanban.
2. **Refinamento Integral do Módulo Social (SUAS/SMADS)**:
   - Estruturar a gestão socioassistencial com busca ativa, registro de novas abordagens humanizadas, monitoramento em tempo real de vagas em Centros de Acolhida (CTAs) e emissão de Dossiê Oficial no padrão PMSP.

---

## 2. Etapas Executadas

### Etapa 1: Dupla Simulação no WhatsApp (Morador vs. Trabalhador)
- [x] Criação do repositório de evidências fotográficas do trabalhador em `src/dataZap.ts` (`FOTOS_TRABALHADOR_ZAP`).
- [x] Configuração da sessão inicial do trabalhador com histórico contextual de viatura (`MOCK_CONVERSA_TRABALHADOR_INICIAL`).
- [x] Adição do seletor superior de modo em `SimulacaoZap.tsx`:
  - `👤 Visão Morador (SP156)`: IA de triagem, localização GPS, envio de fotos de queixas e consulta de prazos regulamentares.
  - `👷 Visão Trabalhador (Campo)`: listagem das OSs da viatura, início do atendimento (`EM_EXECUCAO`), fotos do ANTES, checklist de segurança/EPIs, fotos do DEPOIS e finalização da OS (`AGUARDANDO_APROVACAO`).
- [x] Interligação com o estado reativo de chamados (`setChamados`) e envio de notificações institucionais (`addNotification`).
- [x] Atualização dinâmica do painel lateral de cenários rápidos com 1-clique para ambos os perfis.

### Etapa 2: Refinamento Completo do Módulo Social
- [x] Criação de 4 sub-abas de navegação interna em `ModuloSocial.tsx`:
  - `📋 Base de Pessoas & Prontuários (SUAS)`
  - `🏠 Rede de Acolhimento & Vagas (Tempo Real)`
  - `🗺️ Mapa Territorial de Vulnerabilidade`
  - `📊 Indicadores & Comparativo Semanal`
- [x] Implementação de formulário interativo de Nova Abordagem Social com seleção de demandas imediatas (Alimentação, Cobertor, Kit Higiene, Documentação, Vaga Pet) e atualização automática da base.
- [x] Mapeamento dos Centros de Acolhida da PMSP na região (CTA 13 Vila Mariana, Centro Especial Moema, CTA 09 Brigadeiro, CRAS, CREAS, CAPS AD) com contagem em tempo real de leitos disponíveis e vagas para pets.
- [x] Modal de confirmação e emissão de voucher de encaminhamento institucional SISRUA.
- [x] Modal de visualização e impressão direta (`window.print()`) de Dossiê Socioassistencial Oficial no padrão SEI-PMSP.

### Etapa 3: Governança, Verificação e Documentação
- [x] Execução de linting TypeScript (`npm run lint` / `tsc --noEmit`) com zero erros.
- [x] Execução de build de produção (`npm run build`) validado com sucesso.
- [x] Publicação da ADR `0015-dupla-simulacao-whatsapp-trabalhador-morador-e-refinamento-modulo-social.md`.
- [x] Atualização de `docs/checkpoints/project-state.md` e `docs/README.md`.
