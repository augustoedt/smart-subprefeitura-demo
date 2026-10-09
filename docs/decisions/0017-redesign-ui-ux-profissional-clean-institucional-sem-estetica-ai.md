# ADR 0017 — Redesign de UI/UX Profissional, Clean e Institucional (Eliminação da Estética "AI Generated")

- **Status**: Aceito e Implementado
- **Data**: 2026-09-15
- **Autor**: Equipe de Desenvolvimento Remix Smart Subprefeituras

---

## Contexto

A plataforma possuía uma ampla gama de recursos funcionais (Cockpit de Bairros, Sala de Situação com 6 motores cartográficos, Triagem Kanban com cálculo de SLA, Módulo Social humanizado, App de Campo e simuladores de WhatsApp). No entanto, o acabamento visual continha elementos comuns a protótipos gerados por inteligência artificial ("AI slop"):
1. Gradientes excessivos (`bg-gradient-to-r`, tons neon de amarelo, roxo e ciano sobre fundos escuros).
2. Sombras desproporcionais e cartões aninhados com bordas coloridas pesadas.
3. Fontes genéricas de sistema sem proporção óptica nem distinção tabular para números de chamados e tempos de SLA.
4. Botões promocionais ("supercharge", argumentos em negrito chamativo, badges inflados).

O usuário solicitou expressamente:
> *"quero que deixe o desing e a ui do site muito mais profissional, clean, não quero que fique com cara de AI"*

## Decisão

Implementou-se uma reformulação profunda do Design System em todas as camadas visuais da aplicação:

### 1. Tipografia e Escala Óptica
- **Interface Geral**: Adotou-se **Plus Jakarta Sans** com tracking refinado, alturas de linha equilibradas (1.5–1.6) e pesos estruturados (400 para leitura, 500 para rótulos, 600–700 para títulos institucionais).
- **Métricas, Protocolos e SLAs**: Adotou-se **JetBrains Mono** com suporte nativo a algarismos tabulares (`font-mono tabular-nums`), garantindo alinhamento numérico impecável em painéis executivos e contadores.

### 2. Paleta Neutra Institucional e Remoção de Gradientes
- Remoção completa de fundos degradê artificiais (`bg-gradient-to-r`, gradientes âmbar para azul).
- Adoção de uma base sóbria e sóbria de ardósia técnica (`slate-950` para barras heráldicas superiores e rodapés técnicos, `slate-900` para cabeçalhos e painéis executivos, `slate-50`/`slate-100` para canvas de trabalho e `white` para contêineres de dados).
- Limitação do contraste entre contêineres e o fundo para ≤7% em modo claro, eliminando a fadiga visual.

### 3. Componentes e Controles Refatorados
- **Barra Superior Global (`App.tsx`)**: Brasão de São Paulo com proporções limpas (36px), tipografia institucional nítida em alta autoridade e indicadores discretos de jurisdição e canal SP156.
- **Navegação Lateral (`Sidebar.tsx`)**: Menu vertical em `slate-950` com divisores sutis em `slate-800`, foco ativo em azul-marinho técnico (`bg-sky-600/90 text-white`) e remoção de cards redundantes no rodapé da barra.
- **Cockpit de Decisão por Bairros (`CockpitDecisaoBairros.tsx`)**: Cards de decisão tática e matrizes com bordas refinadas de 1px (`border-slate-200`), tipografia mono em números-chave e paleta institucional em gráficos Recharts.
- **Sala de Situação (`SalaSituacao.tsx`)**: HUDs cartográficos flutuantes simplificados com `backdrop-blur-md bg-slate-900/90 border border-slate-700/80`, botões táteis e controles no formato de ferramentas GIS profissionais (estilo QGIS/ArcGIS Web).
- **Tela de Login (`LoginScreen.tsx`)**: Cartão limpo com bordas cinza neutras, seleção de perfil com indicadores elegantes, remoção de faixas de neon e alinhamento com decretos municipais oficiais.
- **App de Campo (`AppCampo.tsx`) e Módulo Social (`ModuloSocial.tsx`)**: Banner em ardósia sólida, abas segmentadas no padrão iOS/macOS institucional (`bg-slate-100 p-1 rounded-lg`) e cards de indicadores com legibilidade ampliada.
- **Barra de Roteiro Executivo (`PitchModeBar.tsx`)**: Substituição do formato de "pitch comercial chamativo" por um formato de *Briefing Executivo*, com acabamento sóbrio e linguagem técnica para gestores públicos.

## Consequências

- **Positivas**:
  - A aplicação agora tem a aparência e ergonomia de um software governamental de alto nível (GovTech de padrão internacional), compatível com a autoridade institucional da Prefeitura de São Paulo.
  - Eliminação completa de traços de template gerado por IA.
  - Leitura rápida e sem poluição visual por secretários, subprefeitos e encarregados de campo.
  - Compilação limpa e TypeScript 100% verificado (`npm run lint` / `tsc --noEmit`).
