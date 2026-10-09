# 16. Consolidação do Cockpit Executivo por Bairros e Eliminação de Redundâncias na SUB-VM

Data: 2026-09-15  
Status: **Aceita**  
Contexto: Solicitação do gestor da Subprefeitura Vila Mariana para eliminar áreas redundantes (infográficos, comparativos de 32 subprefeituras e telas repetitivas), unificando os dados em um cockpit executivo profissional por **bairro/distrito** (Vila Mariana, Moema e Saúde) para embasamento técnico de tomada de decisão.

---

## Contexto e Motivação

Anteriormente, o sistema contava com múltiplas abas no Painel Administrativo (`Infográfico Executivo`, `Comparativo Regiões - 32 Subs`, `Evolução Temporal`, `Triagem / Kanban`). Essa fragmentação gerava:
1. **Redundância de Informações**: Métricas de SLA, tempo médio de atendimento e volume de chamados eram recalculadas e reapresentadas em 3 telas separadas.
2. **Escopo Genérico de Capital (32 Subs)**: O software foi desenhado para ser implantado na **Subprefeitura Vila Mariana (SUB-VM)**, de modo que comparativos genéricos com Parelheiros, Itaquera ou Freguesia do Ó não agregavam valor ao despacho operacional diário do gestor regional.
3. **Falta de Matriz Decisória por Bairro**: O gestor precisava correlacionar mentalmente quais distritos (Moema, Saúde, Vila Mariana) estavam com SLA em risco, quais logradouros eram reincidentes e para onde deslocar equipes de poda, tapa-buraco ou acolhimento social.

---

## Decisão de Arquitetura

1. **Substituição da Gestão Inter-Subprefeituras por Gestão Intra-Distrital**:
   - O modelo de dados foi expandido em `src/types.ts` com os campos `distrito` ('Vila Mariana' | 'Moema' | 'Saúde') e `bairro` (ex.: Moema Pássaros, Moema Índios, Vila Clementino, Paraíso, Mirandópolis, Planalto Paulista).
   - Gerador de dados (`src/data.ts`) enriquecido com logradouros reais (Av. Ibirapuera, R. Domingos de Morais, Av. Jabaquara, R. Vergueiro, Av. Rubem Berta, Alameda dos Maracatins, Av. Indianópolis).

2. **Criação do Componente Unificado `CockpitDecisaoBairros.tsx`**:
   - **Cabeçalho Executivo com Filtro Territorial Integrado**: Seletor de visualização (Consolidado SUB-VM vs. Distrito específico: Vila Mariana, Moema, Saúde).
   - **Matriz de Ação e Decisão Tática Imediata**: 3 cards dinâmicos para intervenção rápida:
     - *Distrito Crítico em SLA*: Indicação visual e botão de despacho imediato.
     - *Gargalo Categorial*: Apontamento da zeladoria prioritária com maior volume reprimido.
     - *Reincidência Operacional*: Logradouro com múltiplos chamados abertos nos últimos 15 dias.
   - **Painel Comparativo dos 3 Distritos**: Grid comparando Volume Ativo, Taxa de Resolução, Conformidade com SLA e Eficiência Operacional.
   - **Evolução Temporal & Distribuição Categorial Agrupadas**: Gráficos Recharts unificados (Área de tendência 7 dias e Barras com meta de 48h da Carta de Serviços PMSP).
   - **Tabela de Reincidência em Logradouros**: Relação de vias com maior concentração de chamados, categoria predominante, status de alerta e botão de ação para vistoria preventiva.
   - **Conexão Direta com a Triagem**: Botão "Filtrar OSs no Kanban" que aplica o filtro territorial do bairro e alterna instantaneamente para a visão Kanban.

3. **Simplificação da Barra de Abas do `PainelAdmin.tsx`**:
   - Redução de 5 para 3 abas essenciais, sem redundâncias:
     - `Cockpit de Decisão por Bairros` (Visualização padrão)
     - `Triagem Operacional / Kanban` (Com seletor de Distrito e chips rápidos de bairro)
     - `Canal WhatsApp Integrado` (Simulação bidirecional SP156)
   - Botão superior permanente para emissão de Relatório Oficial PMSP/SEI.

---

## Consequências

- **Positivas**:
  - Eliminação completa de cliques desnecessários e telas repetitivas.
  - O gestor regional visualiza em segundos o panorama territorial dos 3 distritos sob sua responsabilidade.
  - Tomada de decisão fundamentada tecnicamente em dados de SLA e reincidência por via pública.
  - Integração fluida entre análise executiva (Cockpit) e execução operacional (Kanban).
- **Compatibilidade**:
  - O Kanban mantém todos os recursos operacionais avançados (validação com fotos ANTES/DEPOIS, cálculo de SLA e bloqueio de risco), agora complementados por endereço e bairro em cada cartão.
