# Deploy e verificação na Railway

> **Verificado em:** 2026-10-09 — produção do projeto `subprefeitura` acompanhando `main`.

## Quando

Publicar a aplicação deste diretório na Railway e verificar se o deploy está saudável e acessível publicamente.

## Premissas

- CLI Railway instalada e autenticada na conta com acesso ao projeto `subprefeitura`.
- Projeto e serviço de aplicação chamados `subprefeitura`, no ambiente `production`.
- Serviço conectado ao repositório `augustoedt/smart-subprefeitura-demo`, acompanhando a branch `main`.
- O servidor Express em `server.ts` escuta em `0.0.0.0:3000`; a porta pública do serviço deve encaminhar para `3000`.
- `npm run build` gera os artefatos de produção e `npm start` inicia `dist/server.cjs`.
- A integração de análise de imagem depende de `GEMINI_API_KEY`, configurada em **Railway → serviço `subprefeitura` → Variables**. Não registre o valor do segredo neste documento.

## Passos

1. No diretório raiz do projeto, valide tipos e compilação:

   ```bash
   npm run lint
   npm run build
   ```

2. Confira o contexto Railway. Se necessário, vincule o projeto e selecione o serviço:

   ```bash
   railway link --project subprefeitura
   railway service link subprefeitura
   railway status --json
   ```

3. Publique a branch acompanhada pelo serviço. O push dispara o deployment automaticamente:

   ```bash
   git push origin main
   ```

   Para uma publicação manual excepcional, ainda é possível usar `railway up --service subprefeitura --environment production --detach -m "Resumo da publicação"`.

4. Tanto o push quanto o modo `--detach` apenas iniciam o processo. Acompanhe o deploy e só considere a publicação concluída quando o deployment correspondente estiver `SUCCESS`:

   ```bash
   railway deployment list --service subprefeitura --environment production --json
   ```

   Se falhar, use o ID do deployment para consultar os logs de build e execução:

   ```bash
   railway logs <DEPLOYMENT_ID> --build --lines 100
   railway logs <DEPLOYMENT_ID> --lines 100
   ```

5. Consulte o domínio do serviço e verifique a resposta HTTP:

   ```bash
   railway domain list --service subprefeitura --environment production --json
   curl -fsSI https://subprefeitura-production.up.railway.app
   ```

## Verificação

Em 2026-10-09, `npm run lint` e `npm run build` passaram, a Railway foi migrada para `main`, o deployment `7884e1c1-a863-4a7a-a26a-f640efe9c37b` atingiu `SUCCESS` e a URL pública retornou HTTP 200. A integração `/api/analyze-image` permanece configurada com `gemini-3.1-flash-lite`. Isso valida a publicação e a integração Gemini; não substitui a homologação dos fluxos completos dos módulos.

## Não fazer

- Não alterar a porta 3000 nem o bind `0.0.0.0` sem revisar as instruções do projeto.
- Não afirmar sucesso com base apenas no push ou upload; confirmar o status `SUCCESS` do deployment correspondente.
- Não registrar `GEMINI_API_KEY` ou outros segredos em arquivos versionados ou logs.
