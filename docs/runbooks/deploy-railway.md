# Deploy e verificação na Railway

> **Verificado em:** 2026-10-08 — primeiro deploy em produção do projeto `subprefeitura`.

## Quando

Publicar a aplicação deste diretório na Railway e verificar se o deploy está saudável e acessível publicamente.

## Premissas

- CLI Railway instalada e autenticada na conta com acesso ao projeto `subprefeitura`.
- Projeto e serviço de aplicação chamados `subprefeitura`, no ambiente `production`.
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

3. Envie a versão local para produção:

   ```bash
   railway up --service subprefeitura --environment production --detach -m "Resumo da publicação"
   ```

4. O modo `--detach` confirma o envio, não a conclusão. Acompanhe o deploy e só considere a publicação concluída quando o deployment correspondente estiver `SUCCESS`:

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

Em 2026-10-08, `npm run lint` e `npm run build` passaram, o deployment atingiu `SUCCESS`, a URL pública retornou HTTP 200 e `/api/analyze-image` respondeu HTTP 200 usando `gemini-3.1-flash-lite`. Isso valida a publicação e a integração Gemini; não substitui a homologação dos fluxos completos dos módulos.

## Não fazer

- Não alterar a porta 3000 nem o bind `0.0.0.0` sem revisar as instruções do projeto.
- Não afirmar sucesso com base apenas no upload; confirmar o status `SUCCESS` do deployment enviado.
- Não registrar `GEMINI_API_KEY` ou outros segredos em arquivos versionados ou logs.
