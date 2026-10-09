# Plano de Trabalho — Evolução da Plataforma GovTech

> **Status:** Documento Vivo (WIP)  
> **Última Atualização:** 2026-09-12

---

## 1. Objetivo do Plano
Mapear as frentes de evolução técnica e funcional da plataforma **Remix Smart Subprefeituras**, consolidando a transição de um protótipo de alta fidelidade para um sistema de produção integrado aos canais oficiais da Prefeitura de São Paulo (SP156, PRODAM e Defesa Civil).

---

## 2. Frentes de Trabalho

### Frente A: Persistência Durável em Banco de Dados Nuvem
- [ ] Provisão de banco de dados Firestore para persistência remota contínua.
- [ ] Implementação de regras de segurança no Firestore (`firestore.rules`) espelhando as regras de RBAC por `subprefeituraId` e papel do usuário.
- [ ] Sincronização em tempo real via listeners `onSnapshot` para atualização simultânea de painéis nas subprefeituras.

### Frente B: Inteligência Artificial com Gemini API
- [ ] Triagem automática de chamados de texto e áudio recebidos via WhatsApp.
- [ ] Reconhecimento visual de gravidade por imagem (ex.: detectar risco iminente de queda de árvore a partir da foto do munícipe).
- [ ] Geração automatizada de resumos executivos diários para o Gabinete do Prefeito e Secretários Regionais.

### Frente C: Integração de Campo e Geolocalização Contínua
- [ ] Cache local avançado via IndexedDB/Service Worker para operações sem internet por longos períodos nas periferias.
- [ ] Algoritmo de roteirização ótima de ordens de serviço por proximidade viária (TSP - Traveling Salesperson Problem) integrando API de rotas.
- [ ] Assinatura digital do encarregado e do cidadão requerente após a conclusão da vistoria.

### Frente D: Conexão com Dados Abertos e Benchmark Externo
- [ ] Consumo de dados abertos de portais de transparência de outras prefeituras (Curitiba, Rio de Janeiro, Belo Horizonte) para preencher a área reservada de benchmark.
- [ ] Comparação automatizada de TMA intermunicipal por categoria de serviço.
