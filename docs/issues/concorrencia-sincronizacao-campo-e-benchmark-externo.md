# Problemas Conhecidos e Pontos de Atenção (Issues em Aberto)

> **Status:** Aberto  
> **Classificação:** Arquitetura e Integrações Externas

---

## Issue 001: Gestão de Concorrência e Sincronização em Modo Offline
- **Contexto:** No App de Campo, as ordens de serviço podem ser atendidas em locais de sombra celular (túneis, fundos de vale ou periferias sem 4G/5G).
- **Problema:** Se dois técnicos alterarem ou atenderem a mesma OS simultaneamente sem sinal, o conflito de merge de fotos ou status precisará de política determinística (ex.: *last-write-wins* ou fila com carimbo UTC confiável).
- **Ação Planejada:** Estruturar fila local no IndexedDB com chave idempotente por número de protocolo e timestamp da foto.

---

## Issue 002: Disponibilidade de APIs para Benchmark Externo
- **Contexto:** A tela de comparativo possui espaço reservado para benchmark externo com outras capitais brasileiras.
- **Problema:** Nem todas as prefeituras disponibilizam APIs REST públicas em tempo real para dados de zeladoria urbana com formatos padronizados (Open311).
- **Ação Planejada:** Criar camada de ingestão de dados abertos via cron periódica com fallback para dados estatísticos históricos consolidados.
