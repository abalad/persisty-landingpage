# Docs por recurso, entrega 2 (mídia nova): plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** as páginas de docs ganham vídeos gravados na interface da v0.14.0. São 22 regravações das cenas antigas, que mostram a interface da 0.9, e até 4 cenas novas. Toda página fica com vídeo ou com o motivo de não ter.

**Architecture:**
- **Cenas:** ficam no site, em `scripts/docs-media/<página>.mjs`, no formato dos módulos do gravador do app.
- **Gravação:** o gravador do app (`scripts/media/record.mjs`) roda de uma cópia do app na tag v0.14.0, contra o modo demonstração (`ipc.mock`). Ele grava em `public/docs-media/<página>/<nome>.mp4`, com a capa `.jpg`.
- **Inventário:** `docs/docs-coverage.md` passa a ter a tabela `## Mídia` (vídeo, página, seção) e a tabela `## Páginas sem vídeo`.
- **Testes:** `tests/docs-media.test.ts` amarra o inventário aos arquivos e às páginas.

**Tech Stack:** Next.js 16 + next-intl, unified/remark/rehype (`rehypeClips`), vitest. Para gravar: Vite (o desktop do app), Chrome headless e Swift (`encode.swift`).

**Spec:** `docs/superpowers/specs/2026-11-16-docs-per-feature-design.md`, seções "Imagens e vídeos", "Gravações novas (entrega 2)" e "Entrega 2: mídia nova".

## Restrições globais

- **Base:** a tag v0.14.0 do app, a mais nova publicada. Se sair outra durante o trabalho, a base passa a ser ela, como manda o spec.
- **Nada muda no repositório do app.** A cópia do app é um `git archive` no scratchpad, não um worktree, e nada é commitado lá. Se o modo demonstração não monta uma cena, ela fica sem vídeo e entra na lista para o usuário; o app não é alterado para isso.
- **`public/changelog/` não muda.** O changelog mostra a interface de cada versão, e as docs mostram a atual.
- **Pasta das gravações:** `public/docs-media/<página>/<nome>.{mp4,jpg}`.
  - Isso desvia do spec, que dizia `public/docs`. O motivo: o caminho `/docs/…` ficaria dividido entre as páginas e os arquivos estáticos.
  - O gravador usa o `version` do módulo como nome da pasta, então cada módulo exporta `version = "<página>"`.
- **Padrão do changelog (decisão 3 do spec):**
  - cada cena é gravada uma vez, com o app em português, e serve aos três idiomas;
  - a descrição (alt) é escrita em pt-BR, en e es, diz o que a gravação nova mostra e é diferente em cada idioma.
- **Vídeo:**
  - de 6 a 12 s;
  - tela de 1200×750 desenhada a 2×, saída com 1600 de largura (os padrões do gravador);
  - até 3 MB por vídeo.
- **Cada vídeo mostra a interface da v0.14.0.** Antes de aceitar um vídeo, confira em quadros dele que:
  - a sessão tem a barra vertical de ferramentas na borda direita;
  - a barra do topo tem o botão do Quadro;
  - o cabeçalho da sessão não tem o botão de painel.
- **Regras de texto do site:**
  - nunca prometer que agentes, a fila, o mascote ou o Quadro funcionam com o app fechado;
  - nunca citar tmux, supervisor, AgentDeck, Tina nem GitToolBox;
  - Remote e o app de celular ficam fora;
  - inglês britânico;
  - rótulos do app em negrito, exatamente como em `pt-BR.json` e `en.json`; em es, o rótulo em inglês vai em itálico na primeira menção;
  - teclas em `<kbd>`.
- **Publicação:** só com o ok direto do usuário, depois do antes e depois.

## Ambiente de gravação (usado nas tarefas 2 a 5)

```bash
SCR=/private/tmp/claude-501/-Users-maiconwagnerdossantos-Documents-Projetos-Persist-persist-landingpage/4af6f56e-8ec9-47a5-a056-c06e4f570174/scratchpad
APP=/Users/maiconwagnerdossantos/Documents/Projetos/Persist/persist-application
REC=$SCR/app-v0.14.0
export PATH="$HOME/.nvm/versions/node/v24.18.0/bin:$PATH"
```

- **Cópia do app:** `mkdir -p $REC && git -C $APP archive v0.14.0 | tar -x -C $REC`.
- **node_modules:**
  - primeiro confirme que o checkout do app tem o mesmo lockfile da tag: `git -C $APP diff --quiet v0.14.0 -- pnpm-lock.yaml`;
  - depois clone cada pasta `node_modules` dele, até a profundidade 3, para o mesmo lugar em `$REC`, com `cp -cR`. Fica de fora `.claude/`, que tem os worktrees de outras sessões.
- **Servidor:**
  - `cd $REC/apps/desktop && node_modules/.bin/vite --port 1431`, em segundo plano;
  - a 1420 é do app de outra sessão;
  - pronto quando `curl -s localhost:1431 | grep -q root`.
- **Gravar:** rode a partir do worktree do site:

  ```bash
  node $REC/scripts/media/record.mjs --clips scripts/docs-media/<página>.mjs --out public/docs-media --base http://localhost:1431 --keep [--only <nome>]
  ```

  - O gravador imprime `<página>/<nome>: <s>s, <n> painted frames` e, com `--keep`, `frames kept in <dir>`.
  - Os quadros ficam em `<dir>/<página>-<nome>/fNNNNN.jpg`, a 30 por segundo.
- **Conferir um vídeo:**
  - abra (Read) o primeiro quadro, um do meio e a capa `public/docs-media/<página>/<nome>.jpg`, e confira a interface com as restrições acima;
  - depois apague a pasta de quadros.
- **Formato de um módulo de cenas:** é o dos módulos do app, `git show v0.14.0:scripts/media/clips.mjs`, sem `anchor` e `alt`; a descrição mora no Markdown.

  ```js
  // scripts/docs-media/<página>.mjs
  export const version = "<página>"; // a pasta: public/docs-media/<página>/
  export const clips = [{ name: "<nome>", query: "…", async run(ui) { … } }];
  ```

## Plano de mídia por página

Os vídeos (a seção é o `##` da página em pt-BR, onde o vídeo entra logo abaixo do título):

| Página | Vídeo | Seção | Cena de origem (app v0.14.0) |
|---|---|---|---|
| projects-and-workspaces | projetos | Barra de projetos | `clips/0.1.0.mjs` projetos |
| projects-and-workspaces | workspace-remoto | Clonar um repositório | `clips/0.8.0.mjs` workspace-remoto |
| sessions | painel | Ferramentas da sessão | `clips/0.2.0.mjs` painel |
| sessions-and-recovery | restaurar | Restaurar tudo | `clips/0.1.0.mjs` restaurar |
| usage-and-quota | uso | Gasto estimado | `clips/0.1.0.mjs` uso |
| queue | fila | Pôr um pedido na fila | `clips/0.4.0.mjs` fila |
| restore-points | pontos | Restaurar | `clips/0.4.0.mjs` pontos |
| worktrees | pasta-propria | Criar a pasta | `clips/0.4.0.mjs` pasta-propria |
| ai-accounts | contas | Contas conectadas | `clips/0.5.0.mjs` contas |
| ai-accounts | rodizio | Rodízio | `clips/0.5.0.mjs` rodizio |
| changes | commit | Fazer o commit | `clips/0.2.0.mjs` commit |
| changes | git | Sincronizar com o remoto | `clips/0.8.0.mjs` git |
| changes | branch | Branches | `clips/0.2.0.mjs` branch |
| commands | comandos | A saída do comando | `clips/0.2.0.mjs` comandos |
| editor | markdown | Markdown e imagens | `clips/0.9.0.mjs` markdown |
| editor | contexto-fixo | Contexto fixo e minimapa | `clips/0.9.0.mjs` contexto-fixo |
| forges | integracoes | GitHub | `clips/0.8.0.mjs` integracoes |
| issues | issue | Começar de uma issue | `clips/0.9.0.mjs` issue |
| issues | concluir | Concluir | `clips/0.9.0.mjs` concluir |
| voice | voz | Ditar | `clips/0.9.0.mjs` voz |
| updates | atualizar | Atualizar no app | `clips/0.8.0.mjs` atualizar |
| privacy-and-network | rede | Registro de rede | `clips/0.3.0.mjs` rede |
| files | arquivos | Criar arquivos e pastas | nova |
| tabs-and-groups | dividir | Dividir o editor | nova |
| git-in-the-editor | blame | Anotar com o git blame | nova |
| code-navigation | recentes | Arquivos e lugares recentes | nova |

- **Board e mascot:** continuam com `/changelog/0.10.0/quadro.mp4` e `/changelog/0.10.0/mascote.mp4`, aprovados na entrega 1.
- **Páginas sem vídeo:** as outras 16 entram em `## Páginas sem vídeo`, cada uma com um motivo verdadeiro, conferido no app.
  - **Já sabidos:**
    - **local-history:** o modo demonstração não tem histórico local (`ipc.mock.ts` da v0.14.0 não responde às chamadas do histórico).
    - **usages-and-refactoring:** o servidor de linguagem falso do modo demonstração (`fakeLsp.ts`) não acha usos nem renomeia.
    - **settings:** é uma lista de referência das 16 telas. As telas mais usadas já aparecem nos vídeos de ai-accounts, forges e privacy-and-network, e uma imagem por tela envelheceria a cada versão. Isso desvia do spec, que previa imagens paradas para as configurações: é uma decisão que o usuário pode corrigir.
  - **Os outros motivos** são escritos na tarefa 6.

## Review Focus

1. **Um vídeo novo ainda mostrar dado velho do modo demonstração.**
   - **rede:** as chamadas `GIT` com bytes, quando o app registra 0 bytes.
   - **atualizar:** "0.9.0 disponível".
   - **contas:** sem a linha **Continuar a tarefa cortada pelo limite**.

   A conferência por quadros de cada tarefa cobre isso, e cada caso tem um passo próprio.
2. **Uma página em en ou es com a descrição copiada do pt-BR, ou com o vídeo noutra posição.** Coberto pelo teste "every language shows the same clips…".
3. **Um vídeo gravado mas não usado, ou usado sem estar no inventário.** Coberto pela bijeção entre o disco e a tabela `## Mídia`.
4. **Página pesada.**
   - Os vídeos usam `preload="none"` e a capa é preguiçosa (`tests/clips.test.ts`), então o peso é o do vídeo quando ele toca.
   - O teste limita cada vídeo a 3 MB.
5. **Uma cena que falha no meio, com o texto da interface mudado desde a 0.9.**
   - O gravador para com `not found {…}`.
   - Ajuste o seletor no módulo do site, nunca no app.

---

### Task 1: Teste e inventário da mídia

**Files:**
- Create: `tests/docs-media.test.ts`
- Modify: `docs/docs-coverage.md` (acrescentar `## Mídia` e `## Páginas sem vídeo`, vazias, antes de `## Mídia para a entrega 2`)

**Interfaces:**
- Produces:
  - **`## Mídia`:**
    - cabeçalho `| Vídeo | Página | Seção |`;
    - Vídeo é `<página>/<nome>.mp4`, relativo a `public/docs-media/`;
    - Seção é o texto exato do `##` em `content/docs/pt-BR/<página>.md`.
  - **`## Páginas sem vídeo`:** cabeçalho `| Página | Motivo |`.
  - As tarefas 2 a 6 acrescentam linhas nessas tabelas.

- [ ] **Step 1: Escrever os testes**

`tests/docs-media.test.ts`:
- lê `docs/docs-coverage.md` com o mesmo `cells()`/`sections()` de `tests/docs-coverage.test.ts`;
- usa `listDocs(locale)` e `getDoc(locale, slug)` de `src/lib/content.ts`;
- usa `clipsOf(html)` e a regex de `aria-label` de `tests/clips.test.ts`.

Testes:
- `every docs clip is a docs recording or an approved changelog one`: para cada idioma e página, todo `src` começa com `/docs-media/` ou está em `["/changelog/0.10.0/quadro.mp4", "/changelog/0.10.0/mascote.mp4"]`.
- `every language shows the same clips in the same order, each with its poster and its own description`:
  - en e es têm a mesma lista de `src` do pt-BR, com o vídeo e a `.jpg` em `public/`;
  - os `aria-label` têm mais de 10 caracteres;
  - o `aria-label` de en e o de es são diferentes do pt-BR na mesma posição.
- `the Mídia table and the recordings on disk match, and each sits under its section`:
  - o conjunto das linhas é igual ao conjunto dos `.mp4` em `public/docs-media/**`, e cada um tem `.jpg`;
  - para cada linha, a página em pt-BR, en e es contém `/docs-media/<Vídeo>`;
  - no Markdown pt-BR, o `##` mais próximo acima da linha do vídeo é igual a Seção.
- `every page has a video or says why not`:
  - cada slug de `listDocs("pt-BR")` aparece em `## Mídia`, ou usa um vídeo aprovado do changelog, ou está em `## Páginas sem vídeo` com Motivo de mais de 20 caracteres;
  - nunca nas duas tabelas.
- `every recording stays under 3 MB`: `statSync(...).size < 3_000_000` para cada `.mp4` de `public/docs-media/`.

- [ ] **Step 2: Rodar e ver o que falha**

Run: `node_modules/.bin/vitest run tests/docs-media.test.ts --testTimeout=60000`
Expected: os quatro primeiros passam (as tabelas estão vazias e as docs só usam os dois vídeos aprovados). `every page has a video or says why not` falha, listando as 37 páginas menos board e mascot.

- [ ] **Step 3: Commit (o teste que falha fica marcado `it.todo` até a tarefa 6)**

Troque `it(` por `it.todo(` só nesse teste. Na tarefa 6 ele volta a `it(`.

```bash
git add tests/docs-media.test.ts docs/docs-coverage.md
git commit -m "test(docs): the docs media inventory, tied to the recordings and the pages"
```

### Task 2: Ambiente de gravação e as cenas de Começar e Agentes

**Files:**
- Create:
  - `scripts/docs-media/README.md`: o "Ambiente de gravação" deste plano, para as próximas versões;
  - `scripts/docs-media/projects-and-workspaces.mjs`, `sessions.mjs`, `sessions-and-recovery.mjs`, `usage-and-quota.mjs`, `queue.mjs`, `restore-points.mjs`, `worktrees.mjs`, `ai-accounts.mjs`;
  - `public/docs-media/<página>/<nome>.{mp4,jpg}`, para os 10 vídeos dessas páginas no plano de mídia.
- Modify:
  - `content/docs/{pt-BR,en,es}/` dessas oito páginas;
  - `docs/docs-coverage.md` (`## Mídia`).

**Interfaces:**
- Consumes: as tabelas da tarefa 1.
- Produces: `$REC` montado e o Vite na 1431, usados até a tarefa 5.

- [ ] **Step 1: Montar o ambiente** (seção "Ambiente de gravação")

Expected: `curl -s localhost:1431` devolve o HTML do app.

- [ ] **Step 2: Escrever os módulos.** Copie cada cena de origem para o módulo da página e confira os seletores contra a interface da v0.14.0. Cada nome de rótulo vem de `git show v0.14.0:apps/desktop/src/i18n/pt-BR.json`.

- [ ] **Step 3: Acrescentar as linhas da tabela `## Mídia` e rodar o teste**

Expected: FAIL `the Mídia table and the recordings on disk match…`, porque os vídeos ainda não existem.

- [ ] **Step 4: Gravar e conferir cada vídeo**
  - Duração de 6 a 12 s.
  - A interface conferida nos quadros.
  - **contas:** a linha **Continuar a tarefa cortada pelo limite** aparece.
  - Uma cena que falha tem o seletor ajustado no módulo e é gravada de novo.

- [ ] **Step 5: Pôr os vídeos nas páginas.** Em cada idioma, `![<descrição>](/docs-media/<página>/<nome>.mp4)` num parágrafo próprio, logo abaixo do `##` da seção, na mesma posição nos três idiomas. A descrição diz o que o vídeo mostra, com os rótulos da interface.

- [ ] **Step 6: Rodar os testes**

Run: `node_modules/.bin/vitest run tests/docs-media.test.ts tests/content.test.ts tests/clips.test.ts tests/docs-links.test.ts --testTimeout=60000`
Expected: PASS, menos o `it.todo`.

- [ ] **Step 7: Commit**

```bash
git add scripts/docs-media public/docs-media content/docs docs/docs-coverage.md
git commit -m "docs(media): Getting started and Agents recorded on the 0.14.0 interface"
```

### Task 3: As cenas de Código

**Files:**
- Create: `scripts/docs-media/changes.mjs`, `commands.mjs`, `editor.mjs`, e os 6 vídeos `public/docs-media/{changes,commands,editor}/…`.
- Modify: `content/docs/{pt-BR,en,es}/{changes,commands,editor}.md` e `docs/docs-coverage.md`.

**Interfaces:**
- Consumes: o ambiente da tarefa 2.

- [ ] **Step 1: Escrever os módulos e as linhas de `## Mídia`, e rodar o teste**

Expected: FAIL (vídeos ausentes).

- [ ] **Step 2: Gravar e conferir**
  - O painel **Alterações** e o **Código** abrem pela barra da borda direita.
  - A barra das abas do editor tem o botão **Maximizar o editor**.

- [ ] **Step 3: Pôr nas páginas e rodar os testes da tarefa 2 (step 6)**

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git commit -m "docs(media): Changes, Commands and Editor recorded on the 0.14.0 interface"
```

### Task 4: As cenas de Integrações e Conta

**Files:**
- Create: `scripts/docs-media/forges.mjs`, `issues.mjs`, `voice.mjs`, `updates.mjs`, `privacy-and-network.mjs`, e os 6 vídeos.
- Modify: as páginas `forges`, `issues`, `voice`, `updates`, `privacy-and-network` (3 idiomas) e `docs/docs-coverage.md`.

- [ ] **Step 1: Escrever os módulos e as linhas de `## Mídia`, e rodar o teste**

Expected: FAIL (vídeos ausentes).

- [ ] **Step 2: Dados da demonstração.**
  - **atualizar:** use `query: "update=0.14.0&current=0.13.0"`.
  - **rede:**
    - confira em `ipc.mock.ts` da v0.14.0 quantos bytes as chamadas `GIT` registram;
    - se forem diferentes de 0, a cena não dispara nenhuma chamada `GIT`, e o registro mostra só as outras.

- [ ] **Step 3: Gravar, conferir, pôr nas páginas e rodar os testes**

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git commit -m "docs(media): Integrations and Account recorded on the 0.14.0 interface"
```

### Task 5: Cenas novas: arquivos, editor dividido, blame e recentes

**Files:**
- Create: `scripts/docs-media/files.mjs`, `tabs-and-groups.mjs`, `git-in-the-editor.mjs`, `code-navigation.mjs`, e até 4 vídeos.
- Modify: essas quatro páginas (3 idiomas) e `docs/docs-coverage.md`.

Cenas (6 a 12 s cada, com `query: "open=<arquivo do demo>"` quando começam com o editor aberto):
- **arquivos:** na árvore, **Novo › Arquivo**; digitar o nome; o arquivo abre numa aba.
- **dividir:** com dois arquivos abertos, **Dividir à direita** no menu da aba; os dois grupos lado a lado.
- **blame:** num arquivo do demo, **Anotar com o git blame**; os autores aparecem na margem.
- **recentes:** <kbd>⌘E</kbd> abre os arquivos recentes; escolher um.

Cada rótulo e tecla vem do pt-BR.json e do mapa de teclas padrão da v0.14.0. A tecla mostrada no vídeo é a do mapa padrão no macOS.

- [ ] **Step 1: Escrever os módulos e as linhas de `## Mídia`, e rodar o teste**

Expected: FAIL (vídeos ausentes).

- [ ] **Step 2: Gravar e conferir.**
  - Uma cena que o modo demonstração não monta sai do módulo e da tabela.
  - A página dela vai para `## Páginas sem vídeo` com o motivo, e entra na lista para o usuário.

- [ ] **Step 3: Pôr nas páginas e rodar os testes**

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git commit -m "docs(media): new scenes for files, split editor, blame and recent files"
```

### Task 6: Fechar o inventário

**Files:**
- Modify:
  - `docs/docs-coverage.md`: preencher `## Páginas sem vídeo` e apagar `## Mídia para a entrega 2`;
  - `tests/docs-media.test.ts`: o `it.todo` volta a `it(`;
  - `PRODUCT.md`: a linha das docs por recurso diz que elas têm vídeos da interface atual.

- [ ] **Step 1: Voltar o teste a `it(` e rodar**

Expected: FAIL, listando as páginas sem linha.

- [ ] **Step 2: Escrever um motivo verdadeiro para cada página sem vídeo**, conferido no `ipc.mock.ts` ou no código da v0.14.0 quando o motivo é "o modo demonstração não monta".

- [ ] **Step 3: Rodar tudo**

Run: `node_modules/.bin/vitest run --testTimeout=60000 && node_modules/.bin/next typegen && node_modules/.bin/tsc --noEmit -p .`
Expected: todos os testes passam; tsc sem erros.

- [ ] **Step 4: Commit**

```bash
git commit -m "docs(coverage): every page has its video or the reason it has none"
```

### Task 7: Revisão, antes e depois, publicação

- [ ] **Step 1: Ver as páginas no navegador.**
  - `next dev` no worktree.
  - Capturas, com `section-shots.mjs` do scratchpad, de três páginas com vídeo em pt-BR, en e es.
  - Expected: o vídeo cabe na coluna e toca ao aparecer.
- [ ] **Step 2: Revisor independente** (só leitura, contexto novo), sobre o branch inteiro.
  - **Recebe:** este plano, o spec e o acesso a `git show v0.14.0:` do app.
  - **Confere:** cada descrição contra os quadros do vídeo e os rótulos do app; as regras de texto; o inglês britânico.
  - Corrigir o que ele achar.
- [ ] **Step 3: Antes e depois para o usuário.**
  - Uma folha com a capa antiga (`public/changelog/…`) e a nova (`public/docs-media/…`) de cada um dos 22 vídeos.
  - As 4 capas novas.
  - A lista de páginas sem vídeo, com os motivos.
  - Pedir o ok com AskUserQuestion.
- [ ] **Step 4: Com o ok, publicar.**
  - No worktree: `git checkout main && git merge --ff-only origin/main && git merge --no-ff docs/media`.
  - Rodar os testes.
  - Push com o token abalad.
  - `vercel inspect … --wait`.
  - Conferir no ar, com o Chrome headless, uma página com vídeo nos três idiomas e um `.mp4` respondendo.
- [ ] **Step 5: Limpeza e memória.**
  - Apagar `$REC`, o worktree e o branch.
  - Atualizar a memória `docs-per-feature` (entrega 2 publicada, a pasta `public/docs-media`, o README das cenas).
  - Atualizar `release-updates-docs`: uma versão que muda uma tela com vídeo regrava a cena.
