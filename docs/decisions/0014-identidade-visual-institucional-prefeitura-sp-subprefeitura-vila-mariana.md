# 0014. Identidade Visual Institucional Prefeitura de SP e Subprefeitura Vila Mariana

Data: 2026-09-14  
Status: Aceito  

## Contexto

A plataforma **Remix Smart Subprefeituras** operava até então com uma estética genérica de aplicação SaaS, desprovida de identidade governamental autêntica. Para seu uso profissional por gestores da administração pública do Estado e Município de São Paulo — especificamente no âmbito da **Subprefeitura da Vila Mariana (SUB-VM)** vinculada à Secretaria Municipal das Subprefeituras (SMSUB/PMSP) —, era imprescindível reestruturar a identidade visual e o design system.

O usuário solicitou explicitamente:
1. Identidade visual personalizada para o uso profissional de prefeitura no Estado/Município de São Paulo;
2. Especialização e foco territorial na **Subprefeitura da Vila Mariana**;
3. Estruturação de melhorias contínuas, elaboração de um plano formal e atualização integral da documentação do projeto.

## Decisão

1. **Criação do Componente Vetorial do Brasão Oficial da Cidade de São Paulo (`BrasaoSaoPaulo.tsx`)**:
   - Desenho vetorial em SVG nativo de alta precisão com suporte a dimensões flexíveis (`size`, `variant`);
   - Reprodução fiel dos elementos heráldicos do brasão paulistano: coroa mural com ameias, escudo clássico ibérico com braço empunhando a bandeira da Cruz de Cristo, ramos heráldicos floridos e listel com o lema histórico oficial em latim: *"NON DVCOR DVCO"* ("Não sou conduzido, conduzo");
   - Paleta de cores heráldica: Azul Marinho Institucional (`#07162C` / `#0A192F`), Dourado Nobre (`#D4AF37` / `amber-400`), Carmesim e Branco Puro.

2. **Cabeçalho Global e Branding Institucional Unificado**:
   - Implementação de faixa superior institucional oficial no topo de todos os módulos (`App.tsx`), destacando a hierarquia administrativa: *Prefeitura da Cidade de São Paulo* • *Secretaria Municipal das Subprefeituras (SMSUB)* • *Subprefeitura Vila Mariana (SUB-VM)*;
   - Indicador de status em tempo real do canal integrado SP156 e badge dos distritos sob jurisdição da subprefeitura: **Vila Mariana**, **Moema** e **Saúde**;
   - Incorporação do brasão no menu lateral (`Sidebar.tsx`) e modais do sistema.

3. **Padronização Documental no Padrão SEI-PMSP (Sistema Eletrônico de Informações)**:
   - Refatoração do relatório oficial executivo em `PainelAdmin.tsx`:
     - Cabeçalho oficial com brasão municipal e identificação da Coordenadoria de Projetos e Obras (CPO);
     - Bloco de assinaturas de autoridades locais: Subprefeito Regional e Coordenador de Obras;
     - Selo de autenticidade documental com número de protocolo SEI, data/hora de emissão e código verificador de integridade.

4. **Especialização Territorial e Câmera da Vila Mariana na Sala de Situação**:
   - Adição do preset de visualização espacial cinemática `VILA_MARIANA` no `MapComponent.tsx` (latitude -23.5896, longitude -46.6346, zoom 14, pitch 42°, bearing 15°);
   - Botão de atalho rápido territorial "SUB-VM" no HUD do mapa para navegação instantânea com um clique aos limites da subprefeitura;
   - Filtro territorial padrão com foco prioritário nos dados da Vila Mariana, mantendo a capacidade analítica global para perfil de administrador central.

5. **Identidade Estendida aos Módulos Operacionais**:
   - **App de Campo (`AppCampo.tsx`)**: Tela de login com brasão oficial, indicação da sede da SUB-VM (R. José de Magalhães, 500) e cabeçalho das ordens do dia com identificação funcional de turno;
   - **Módulo Social (`ModuloSocial.tsx`)**: Banner institucional da Supervisão de Assistência Social (SAS Vila Mariana) em cooperação com SMADS/SMSUB;
   - **Simulação SP156 WhatsApp (`SimulacaoZap.tsx`)**: Avatar oficial verificado com o brasão e dados de teste localizados nos corredores viários da Vila Mariana.

## Consequências

### Positivas
- **Aderência Governamental Rigorosa**: O sistema transmite sobriedade, legitimidade e autoridade cívica, essencial para apresentações com secretários, subprefeitos e órgãos de controle.
- **Identidade Local Fortalecida**: Os servidores e técnicos da Subprefeitura da Vila Mariana identificam prontamente seus distritos, instalações e normativas locais.
- **Geração de Documentos Válidos**: Relatórios com padrão SEI prontos para anexação em processos administrativos municipais.

### Neutras / Mitigações
- **Flexibilidade Multi-Subprefeitura Preservada**: Embora a Vila Mariana seja o foco customizado de demonstração e homologação, a arquitetura continua permitindo selecionar qualquer uma das 32 subprefeituras de São Paulo via seletor do cabeçalho ou perfil de acesso.
