# Remix Smart Subprefeituras (SP156 GovTech)

Plataforma integrada de comando, triagem administrativa e operação de campo para a gestão de zeladoria urbana das 32 Subprefeituras da Cidade de São Paulo.

---

## Módulos do Sistema

1. **Sala de Situação**: Painel geoespacial em tempo real com marcadores, mapa de calor (*heatmap*), métricas consolidadas e visão territorial por Subprefeitura.
2. **Painel Administrativo (Kanban & Comparativo)**:
   - Triagem e fluxo de chamados com contadores e barras de consumo de SLA.
   - Comunicação com o munícipe via canal simulado de WhatsApp.
   - Geração e impressão de Relatórios Operacionais em PDF.
   - Bloco analítico de **Comparação de Desempenho** (análise de períodos temporais com deltas semânticos e comparação territorial A vs. B com travas de perfil).
3. **Módulo de Acolhimento Social**: Atendimento humanizado e especializado para chamados de pessoas em situação de rua com histórico de intervenções e encaminhamento integrado à rede socioassistencial.
4. **App de Campo (Mobile)**: Aplicação com suporte a operação offline para equipes em viaturas, ordenação automática por prioridade e rota, captura de evidências fotográficas ANTES e DEPOIS com carimbo georreferenciado e checklist de segurança obrigatório com trava de risco e escalonamento para supervisão.

---

## Documentação Completa

Toda a documentação técnica, decisões de arquitetura e planos de evolução estão centralizados na pasta [`/docs`](docs/README.md):

- [Índice Geral de Documentação (`docs/README.md`)](docs/README.md)
- [Checkpoint Autoritativo do Projeto (`docs/checkpoints/project-state.md`)](docs/checkpoints/project-state.md)
- [Registros de Decisão de Arquitetura (`docs/decisions/`)](docs/decisions/)
- [Planos de Evolução (`docs/plans/`)](docs/plans/)
- [Auditorias e Revisões (`docs/reviews/`)](docs/reviews/)

---

## Como Executar

```bash
# Instalação de dependências
npm install

# Inicialização em modo de desenvolvimento
npm run dev

# Compilação e verificação de tipos
npm run lint
npm run build
```
