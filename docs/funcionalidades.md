# Catálogo de Funcionalidades — Smart Subprefeituras

> **Escopo verificado em 2026-10-09.** Este documento descreve as funcionalidades disponíveis na interface ativa do projeto. Para o estado operacional e os próximos passos, consulte o [checkpoint autoritativo](checkpoints/project-state.md).

## 1. Visão geral

O **Smart Subprefeituras** é uma demonstração GovTech de gestão territorial, triagem, despacho, execução em campo e acompanhamento de demandas urbanas. A versão atual é especializada na **Subprefeitura Vila Mariana (SUB-VM)** e abrange os distritos:

- Vila Mariana;
- Moema;
- Saúde.

A solução reúne quatro módulos operacionais — Sala de Situação, Painel Administrativo, App de Campo e Módulo Social — além da simulação do canal WhatsApp SP156. Todos compartilham o mesmo conjunto de chamados durante a sessão.

### Natureza da demonstração

| Classificação | Significado |
|---|---|
| **Funcional** | Recurso implementado e utilizável na aplicação atual. |
| **Simulado** | Fluxo funcional alimentado por dados locais ou respostas demonstrativas. |
| **Integração externa** | Recurso que chama um serviço externo real e depende de configuração de ambiente. |

A aplicação não é, nesta fase, um sistema transacional de produção: autenticação, chamados, fontes públicas, acolhimento social e sincronização em tempo real são simulados. A classificação de imagens pelo Gemini é a integração externa ativa.

---

## 2. Perfis e permissões

O acesso é selecionado na tela inicial. Não há validação real de identidade; os perfis demonstram a segregação de acesso pretendida.

| Perfil de negócio | Identificador interno | Acesso principal |
|---|---|---|
| Administração central | `CENTRAL` | Todos os módulos e ações administrativas. |
| Gestor da Subprefeitura | `GESTOR` | Sala de Situação e Painel Administrativo, restritos à SUB-VM. |
| Técnico de campo | `FUNCIONARIO` | App de Campo e Simulação Zap operacional. |
| Assistente social | `ASSISTENTE_SOCIAL` | Módulo Social. |

### Regras de acesso

- O gestor visualiza somente chamados da sua jurisdição territorial.
- O técnico de campo entra diretamente no App de Campo e utiliza matrícula demonstrativa.
- O assistente social entra diretamente no Módulo Social.
- A administração central pode navegar por todas as áreas.
- Ações administrativas especiais do Kanban, como tratamento de duplicidade ou demanda fora da alçada, são reservadas ao perfil central.
- Toda navegação entre módulos passa por uma guarda central de perfil; atalhos, toasts e o roteiro guiado não contornam o RBAC.
- Quando um atalho aponta para uma área sem permissão, a ação permanece no módulo atual e informa a restrição quando aplicável.
- O botão **Trocar Perfil** encerra a sessão simulada e retorna à seleção de acesso.

---

## 3. Sala de Situação

A Sala de Situação é o ambiente cartográfico e analítico para monitoramento territorial da SUB-VM.

### 3.1 Mapa e navegação

- Mapa em tela cheia com zoom e arraste nativos.
- Enquadramento inicial na Subprefeitura Vila Mariana.
- Contorno territorial oficial carregado a partir de `vila-mariana.geojson`.
- Marcadores de chamados e pontos de fontes públicas.
- Seleção de chamados e equipamentos para abrir painéis de detalhes.
- Legenda e camadas em painel recolhível.
- Alto contraste para telões e ambientes de apresentação.
- Modo foco para reduzir elementos secundários da interface.

### 3.2 Megamenu cartográfico

Os controles do mapa são consolidados em quatro grupos:

- **Filtros:** camada temática e distrito;
- **Mapa:** representação de ocorrências, pontos cegos e painéis;
- **Motor:** seleção do motor cartográfico e controles compatíveis;
- **Ações:** fontes públicas, cruzamento espacial, camadas mapeadas, bibliotecas e indicador de atualização.

No desktop, a barra superior e cada popover horizontal se ajustam à largura de seus itens, sem ocupar toda a extensão do mapa. No mobile, os controles são apresentados verticalmente por um único botão.

### 3.3 Filtros e representações

- Filtro por distrito: Vila Mariana, Moema e Saúde.
- Filtro temático: todos, zeladoria, infraestrutura e social.
- Exibição de ocorrências em modo normal ou agrupado, conforme a capacidade do motor.
- Ativação de pontos cegos quando suportada pelo motor selecionado.
- Lista sincronizada com até 50 ocorrências.
- Painel estatístico com indicadores e gráficos.

### 3.4 Seis modos cartográficos ativos

| Modo | Função principal |
|---|---|
| **Leaflet / OpenStreetMap** | Mapa 2D operacional com ocorrências e agrupamentos. |
| **MapLibre GL** | Mapa vetorial WebGL com rotação, inclinação 3D e estilos visual, técnico e escuro. |
| **Satélite Esri** | Inspeção territorial sobre imagem aérea. |
| **Coroplético SUB-VM** | Leitura temática do território por indicador de eficiência/SLA. |
| **Buffers de serviço** | Análise de áreas de influência em torno de equipamentos públicos. |
| **Heatmap Kernel** | Visualização da densidade espacial das ocorrências. |

Os controles são habilitados conforme a capacidade do modo ativo. Opções incompatíveis permanecem indisponíveis em vez de alterar silenciosamente o motor.

### 3.5 Cruzamento geoespacial

- Correlação entre chamados e pontos das fontes públicas.
- Cálculo de proximidade por fórmula de Haversine.
- Raio configurável entre 300 e 1.500 metros.
- Filtros por categoria de chamado e fonte.
- Classificação dos resultados por criticidade e distância.
- Diagnósticos demonstrativos conforme a combinação de ocorrência e fonte.
- Abertura direta do chamado relacionado a partir do resultado.

### 3.6 Fontes e camadas

- Catálogo demonstrativo de SSP-SP, IBGE, CET e histórico SP156.
- Identificação explícita dos dados como ilustrativos e compatíveis com o formato de fontes reais.
- Ativação individual ou em lote das fontes.
- Catálogo de camadas internas, GeoJSON e WMS.
- Controle de visibilidade e opacidade das camadas mapeadas.
- Equipamentos públicos georreferenciados, com foco em bibliotecas da área da SUB-VM.
- Diagnóstico de chamados no entorno de equipamentos públicos.

### 3.7 Atualização e painéis

- Indicador de atualização em tempo real simulada.
- Pequenas variações periódicas nos dados para demonstração operacional.
- Painel de detalhes do chamado.
- Painel de detalhes de ponto público ou biblioteca.
- Painéis laterais no desktop e formato de bottom sheet no mobile.

---

## 4. Painel Administrativo

O Painel Administrativo concentra análise executiva, triagem de demandas e comunicação com o cidadão.

### 4.1 Cockpit de decisão por bairros

- Comparação entre Vila Mariana, Moema e Saúde.
- Volume de chamados, taxa de resolução e conformidade de SLA por distrito.
- Matriz de decisão tática com prioridades sugeridas.
- Evolução temporal em períodos de 7, 15 e 30 dias.
- Distribuição de SLA por categoria e linha de meta operacional.
- Ranking de reincidência por logradouro.
- Cross-filtering: uma decisão do cockpit pode abrir o Kanban já filtrado.

### 4.2 Indicadores executivos

O painel apresenta oito grupos de indicadores:

1. backlog aberto e demandas em andamento;
2. chamados concluídos;
3. SLA médio;
4. percentual dentro do prazo;
5. taxa de resolução;
6. reincidência em raio crítico;
7. conformidade das evidências de campo;
8. Índice de Eficiência de Zeladoria (IEZ).

O painel abre com os quatro KPIs principais e permite expandir para os oito indicadores. Em smartphones, os cards ficam em uma única faixa horizontal rolável. A área das colunas mantém altura mínima e rolagem própria para impedir que os cartões sejam comprimidos pelos indicadores ou filtros.

### 4.3 Kanban operacional

Fluxo de cinco etapas:

1. **Novo**;
2. **Encaminhado**;
3. **Em execução**;
4. **Aguardando aprovação**;
5. **Concluído**.

Funcionalidades disponíveis:

- busca por protocolo;
- filtros por categoria, prioridade, distrito e bairro;
- chips rápidos de Vila Mariana, Moema e Saúde;
- cartões com protocolo, categoria, prioridade, endereço, bairro e SLA;
- abertura do cartão em modal detalhado, com localização, status, prioridade, origem, SLA, coordenadas e fotos ANTES/DEPOIS; evidências ausentes nos dados legados usam imagens demonstrativas identificadas;
- aprovação ou rejeição diretamente no modal quando a tarefa aguarda validação;
- movimentação de chamados entre etapas do fluxo;
- aprovação ou rejeição de vistorias;
- identificação demonstrativa de duplicidades por proximidade;
- registro de protocolo externo;
- alerta para itens aguardando aprovação por mais de 48 horas;
- geração de notificações para mudanças relevantes de status.

### 4.4 Canal WhatsApp no painel

- Conversa demonstrativa com o cidadão.
- Seleção de localização em mapa.
- Recebimento de fotografia.
- Classificação de imagem por IA quando a integração Gemini está disponível.
- Lembretes automáticos demonstrativos para chamados parados na aprovação.
- Comunicação de aprovação, rejeição ou conclusão.

### 4.5 Relatório oficial

- Relatório para impressão no padrão visual SEI-PMSP.
- Cabeçalho institucional e identificação territorial.
- Métricas consolidadas e distribuição dos chamados por status.
- Área de assinaturas responsáveis.
- Código visual de autenticidade demonstrativo.
- Impressão ou geração de PDF pelo navegador.

---

## 5. App de Campo

O App de Campo simula a rotina móvel das equipes operacionais.

### 5.1 Acesso e ordens do dia

- Login de turno com matrícula demonstrativa.
- Visualização em moldura de smartphone ou tela cheia.
- Lista de até dez ordens priorizadas por urgência e proximidade simulada.
- Indicação de protocolo, endereço, prioridade, categoria e SLA.
- Banner de sincronização offline simulada.

### 5.2 Execução da ordem de serviço

Fluxo obrigatório:

1. registrar foto **antes**;
2. registrar foto **depois**;
3. preencher checklist técnico da categoria;
4. finalizar a ordem ou encaminhar risco à supervisão.

### 5.3 Evidências e segurança

- Marca d'água técnica com coordenadas, data, protocolo e operador.
- Checklists específicos por categoria de serviço.
- Bloqueio de finalização quando faltam fotos ou respostas obrigatórias.
- Bloqueio de risco quando o checklist detecta condição não resolvida.
- Escalonamento para supervisão, com reclassificação da prioridade para urgente.
- Sincronização do novo status com o Kanban durante a sessão.
- Após finalizar uma vistoria, usuários com acesso administrativo são direcionados diretamente à aba Triagem/Kanban; técnicos permanecem no módulo de campo por restrição de perfil e recebem a confirmação da operação.

---

## 6. Módulo Social

O Módulo Social simula o acompanhamento socioassistencial na região da Vila Mariana.

### 6.1 Base de pessoas e abordagens

- Base demonstrativa de prontuários SISRUA.
- Busca e filtros por status e alerta.
- Cadastro de nova abordagem.
- Geração de protocolo social demonstrativo.
- Histórico de atendimentos e encaminhamentos.
- Prontuário detalhado em painel lateral ou bottom sheet.

### 6.2 Vagas e acolhimento

- Rede demonstrativa de unidades de acolhimento.
- Consulta de capacidade e disponibilidade.
- Reserva simulada de vaga.
- Geração de protocolo SISRUA.
- Atualização da disponibilidade durante a sessão.

### 6.3 Mapa e indicadores sociais

- Mapa territorial em Leaflet/OpenStreetMap.
- Visualização de pessoas abordadas e unidades de acolhimento.
- Indicadores de abordagens, encaminhamentos, alertas e ocupação.
- Gráficos de acompanhamento social.
- Exportação dos dados demonstrativos em CSV.

### 6.4 Dossiê socioassistencial

- Dossiê individual para impressão.
- Histórico de abordagens e encaminhamentos.
- Identificação institucional SAS/SEAS.
- Avisos de tratamento de dados alinhados à LGPD e ao SUAS.

---

## 7. Simulação WhatsApp SP156

A aplicação contém dois fluxos conversacionais demonstrativos.

### 7.1 Jornada do cidadão

- Registro textual da ocorrência.
- Detecção semântica local da categoria.
- Coleta de localização e fotografia.
- Criação de chamado com protocolo SP156 simulado.
- Inclusão imediata no conjunto de chamados da sessão.
- Mensagens de acompanhamento e confirmação.
- Notificação quando a ordem é concluída em campo.
- Ações rápidas e toasts relacionados ao Kanban abrem diretamente a aba Triagem/Kanban para perfis autorizados.

### 7.2 Jornada do trabalhador

- Consulta das ordens disponíveis.
- Início da execução.
- Envio de foto antes e depois.
- Checklist operacional demonstrativo.
- Encaminhamento para aprovação.
- Escalonamento de risco para prioridade urgente.

### 7.3 Modos de apresentação

- Moldura de smartphone.
- Visualização expandida.
- Respostas rápidas.
- Feedback sonoro gerado pelo navegador.

---

## 8. Funcionalidades transversais

### 8.1 Estado compartilhado

- Chamados compartilhados entre Sala de Situação, Painel Administrativo, App de Campo e Simulação Zap.
- Atualizações imutáveis propagadas durante a sessão.
- Recorte defensivo para impedir que chamados externos à SUB-VM entrem na interface ativa.
- Preferências cartográficas e camadas mantidas no contexto global da aplicação.

### 8.2 Notificações

- Toasts institucionais não bloqueantes.
- Avisos de criação, andamento, aprovação, rejeição e conclusão.
- Ações de notificação capazes de direcionar ao módulo e, quando aplicável, diretamente à aba Triagem/Kanban relacionada.
- Links de notificação são exibidos apenas para destinos permitidos pelo perfil e só são descartados após navegação aceita.
- Toast inicial de conexão com desaparecimento automático.

### 8.3 Briefing executivo

- Tour guiado de cinco etapas.
- Navegação entre abertura do chamado, mapa, triagem, execução em campo e relatório.
- Uso voltado a demonstrações para gestores, auditores e equipes técnicas.

### 8.4 Modal “Sobre o projeto”

- Visão geral da solução.
- Catálogo de fontes de dados.
- Descrição dos motores cartográficos.
- Changelog demonstrativo.

---

## 9. Fluxo integrado de ponta a ponta

1. O cidadão abre uma ocorrência pela Simulação WhatsApp SP156.
2. O chamado entra no estado compartilhado e aparece na Sala de Situação e no Kanban.
3. O gestor analisa território, criticidade, SLA e possíveis correlações geoespaciais.
4. A demanda é encaminhada para execução.
5. O técnico registra fotos e checklist no App de Campo.
6. Uma condição de risco impede a conclusão e pode ser escalada para supervisão.
7. Uma execução válida segue para aprovação; quando o operador possui acesso administrativo, a interface abre diretamente a aba Triagem/Kanban.
8. A aprovação conclui o chamado e gera comunicação demonstrativa ao cidadão.
9. O Painel Administrativo consolida indicadores e produz o relatório para impressão.

Demandas sociais podem ser direcionadas ao fluxo próprio do Módulo Social, com abordagem, vaga, encaminhamento e dossiê.

---

## 10. Dados, indicadores e regras operacionais

### 10.1 Categorias de chamados

- pessoa em situação de rua;
- árvore caída;
- bueiro;
- barulho/PSIU;
- calçada;
- tapa-buraco;
- fiscalização de postura;
- desfazimento.

### 10.2 Prioridades e SLA demonstrativo

| Categoria | Prazo de referência |
|---|---:|
| Tapa-buraco | 24 horas |
| Pessoa em situação de rua | 24 horas |
| Árvore caída | 48 horas |
| Barulho/PSIU | 48 horas |
| Bueiro | 72 horas |
| Fiscalização de postura | 72 horas |
| Desfazimento | 96 horas |
| Calçada | 120 horas |

A aplicação calcula progresso de SLA, atraso e indicadores agregados a partir desses valores demonstrativos.

### 10.3 Contornos territoriais

- Os 32 GeoJSONs de subprefeituras permanecem armazenados em `public/data/subprefeituras/`.
- Somente `vila-mariana.geojson` é carregado pela demonstração atual.
- Dados e filtros ativos permanecem limitados a Vila Mariana, Moema e Saúde.

---

## 11. Integrações e operação técnica

### 11.1 Gemini

A rota `POST /api/analyze-image`:

- recebe uma imagem em base64;
- utiliza o modelo `gemini-3.1-flash-lite`;
- classifica a imagem em uma das categorias suportadas;
- exige `GEMINI_API_KEY` no ambiente;
- aplica limite de tempo e resposta de fallback controlada.

Essa integração é usada pelo canal WhatsApp do Painel Administrativo. Nenhum segredo é armazenado na documentação ou no repositório.

### 11.2 Provedores cartográficos

- OpenStreetMap para mapas Leaflet;
- HOT/OpenStreetMap para o modo MapLibre;
- Esri World Imagery para satélite.

Os provedores ativos não exigem chaves registradas no projeto.

### 11.3 Execução e publicação

- SPA React/TypeScript com servidor Express.
- Ambiente local e produção servidos em `0.0.0.0:3000`.
- Produção publicada na Railway a partir da branch `main`.
- Procedimento operacional documentado no [runbook Railway](runbooks/deploy-railway.md).

---

## 12. Responsividade e acessibilidade

- Navegação lateral no desktop e drawer no mobile.
- Barra inferior móvel filtrada pelo perfil do usuário.
- Alvos de toque dimensionados para uso em smartphones.
- Kanban com altura mínima protegida e rolagem vertical do painel; no mobile, oferece seleção de coluna e KPIs em faixa horizontal rolável.
- Painéis laterais convertidos em bottom sheets em telas pequenas.
- Controles cartográficos horizontais no desktop e verticais no mobile.
- Idioma da página definido como português do Brasil.
- Tipografia de leitura em Plus Jakarta Sans.
- Dados numéricos, protocolos e SLA em JetBrains Mono com números tabulares.
- Rótulos, títulos e atributos de acessibilidade nos controles principais.
- Modo de alto contraste para apresentação em telões.

---

## 13. Limites atuais

- Os dados de chamados são locais e reiniciados ao recarregar a aplicação.
- Não há banco de dados nem API de negócio persistente.
- Login e matrículas não possuem autenticação real.
- Não existe conexão operacional com SP156, SSP-SP, IBGE, CET, SISRUA, SEI ou unidades de acolhimento.
- As fontes públicas e os indicadores sociais são ilustrativos.
- “Tempo real” e “modo offline” representam comportamentos simulados.
- A impressão SEI e o código de autenticidade são demonstrativos, não documentos oficiais assinados.
- A integração Gemini depende da disponibilidade do serviço externo e da chave configurada.
- Componentes históricos que não fazem parte da navegação ativa não são considerados funcionalidades disponíveis.

---

## 14. Rastreabilidade

### Documentos relacionados

- [Checkpoint do projeto](checkpoints/project-state.md) — estado atual, pendências e armadilhas.
- [Índice da documentação](README.md) — acesso a planos, decisões, revisões e runbooks.
- [ADR 0002 — perfis e segregação de acesso](decisions/0002-hierarquia-de-perfis-e-segregacao-de-acesso.md).
- [ADR 0010 — arquitetura cartográfica e cruzamento geoespacial](decisions/0010-arquitetura-multi-motor-cartografico-e-cruzamento-geoespacial.md).
- [ADR 0018 — provedores cartográficos](decisions/0018-provedores-cartograficos-sem-chave-e-remocao-carto.md).
- [ADR 0019 — recorte territorial SUB-VM](decisions/0019-recorte-territorial-exclusivo-sub-vm.md).
- [Metas de SLA](benchmarks/metas-sla-e-tempos-medios-atendimento.md).

### Principais fontes no código

- `src/App.tsx` — navegação, sessão e estado compartilhado;
- `src/LoginTypes.ts` e `src/components/Sidebar.tsx` — perfis e permissões;
- `src/components/SalaSituacao.tsx` — Sala de Situação;
- `src/components/PainelAdmin.tsx` — cockpit, Kanban e relatório;
- `src/components/AppCampo.tsx` — operação de campo;
- `src/components/ModuloSocial.tsx` — fluxo socioassistencial;
- `src/components/SimulacaoZap.tsx` — jornadas WhatsApp;
- `src/context/AppContext.tsx` — estado transversal, motores e notificações;
- `src/subprefeituraBoundaries.ts` — carregamento territorial;
- `server.ts` — servidor e integração Gemini.
