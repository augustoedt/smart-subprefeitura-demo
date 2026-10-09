# ADR 0011: Otimização de Responsividade e Design High-End Baseada no Taste Skill Framework

- **Status**: Aprovado
- **Data**: 2026-09-12
- **Contexto**: Solicitação do usuário para aplicar as diretrizes do framework `taste-skill` (`design-taste-frontend`, `high-end-visual-design` e `redesign-existing-projects` de `https://github.com/leonxlnx/taste-skill`) a todas as páginas da aplicação Remix Smart Subprefeituras, corrigindo quebras de responsividade em telas móveis e elevando a consistência visual em mapas e dashboards.

---

## Contexto e Desafio

A plataforma possuía uma rica coleção de funcionalidades e painéis operacionais, porém apresentava pontos de atrito em telas menores:
1. **Mapas e Controles Geoespaciais (`SalaSituacao.tsx`)**: Painéis de detalhes de chamados e pontos de fontes públicas ocupavam largura fixa absoluta e bloqueavam a visualização do mapa no mobile. O painel de cruzamento de camadas sofria com sobreposição sem backdrop ergonômico.
2. **Dashboard e Kanban (`PainelAdmin.tsx`)**: O Kanban possuía 5 colunas com rolagem horizontal obrigatória sem opção de foco individual; abas e pílulas de filtros sofriam com quebra de linha visual indesejada em telas de smartphone; métricas de KPI possuíam tamanhos estáticos.
3. **Infográfico Executivo & Matriz Comparativa (`InfograficoExecutivo.tsx` e `ComparativoRegioes.tsx`)**: Os grandes cartões e seletores de período quebravam layout em telas menores que 640px; a tabela comparativa não possuía largura mínima adequada em rolagem horizontal de toque.
4. **Módulo Social (`ModuloSocial.tsx`)**: Invocava chamadas nativas de `alert()`, contraindicadas em ambiente iFrame, e o prontuário histórico lateral ocupava a tela de forma rígida.

---

## Decisões Tomadas

1. **Adoção Integrada das 3 Skills do Framework Taste**:
   - **`design-taste-frontend`**: Foco em densidade de layout controlada, eliminação de clichês visuais de IA, tipografia proporcional com rítmica refinada, micro-interações táteis e neutralidade estética contemporânea (`slate-50` / `slate-100` / `white` com sombras sutis `shadow-xs`).
   - **`high-end-visual-design`**: Uso de *bottom sheets* móveis com backdrop translúcido em vez de caixas flutuantes que colidem com elementos do mapa; touch targets mínimos de 36-44px; consistência de raios de borda (`rounded-xl sm:rounded-2xl`).
   - **`redesign-existing-projects`**: Refatoração cirúrgica sem quebra de regras de negócio, preservando o modo de Alto Contraste (`highContrastMode`), o controle de acesso por papéis (`UserSession`) e os 4 motores cartográficos.

2. **Sala de Situação**:
   - Painéis de detalhes (`selectedChamado`, `selectedPublicPoint`) transformados em *bottom sheets* deslizantes inferiores no mobile (`fixed inset-x-0 bottom-0 rounded-t-2xl max-h-[80vh]`), mantendo o formato flutuante lateral elegante em telas `lg:`.
   - Backdrop móvel (`fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden`) adicionado ao fechar com toque externo.
   - Botões de seleção de motores e camadas otimizados com `overflow-x-auto scrollbar-none`.

3. **Painel Administrativo & Kanban**:
   - Seletor rápido de coluna móvel (`mobileColumnFilter` com opções: *Todas as Colunas*, *Novos*, *Encaminhados*, *Em Execução*, *Aguardando*, *Concluídos*), permitindo inspecionar cada estágio sem atrito de scroll horizontal excessivo.
   - Rolagem com *snap points* (`snap-x snap-mandatory`) mantida para navegação por arrasto contínuo.
   - Pílulas de filtro e KPIs com tamanhos responsivos e espaçamentos matematicamente calculados.

4. **Infográfico Executivo & Comparativo de Regiões**:
   - Resumo Executivo adaptado para `grid-cols-2 lg:grid-cols-4` com tipografia que se ajusta de `text-2xl` para `text-3xl`.
   - Seletor de períodos dinâmicos com rolagem horizontal suave e rótulos compactados (`7d`, `15d`, etc.) em telas ultra-compactas.
   - Tabelas analíticas com `overflow-x-auto scrollbar-thin` e `min-w-[650px]` evitando compressão de colunas em smartphones.

5. **Módulo Social**:
   - Remoção de `alert()` e introdução de toast de feedback acessível com timeout automático e fechamento manual.
   - Prontuário de histórico transformado em *bottom sheet* responsivo no mobile.

---

## Consequências

### Positivas
- Navegação ergonômica em smartphones, tablets e desktops ultrawide.
- Redução drástica da sobreposição de UI sobre os mapas interativos e gráficos.
- Estética governamental moderna, polida e livre de vícios visuais artificiais.
- Zero regressões funcionais; 100% dos testes e tipagens TypeScript compilando com sucesso.
