# Docs por recurso: entrega 1, plano de execução

> **Para agentes:** SUB-SKILL OBRIGATÓRIA: use superpowers:subagent-driven-development (recomendado) ou superpowers:executing-plans para executar este plano tarefa por tarefa. Os passos usam caixas de seleção (`- [ ]`).

**Objetivo:** trocar as 12 páginas de docs por cerca de 32 páginas, uma por recurso, em pt-BR, en e es. Elas cobrem tudo o que saiu da 0.1.0 à 0.13.0, com um inventário que prova a cobertura e os vídeos existentes que ainda batem com a interface.

**Arquitetura:** o conteúdo continua em `content/docs/<locale>/<slug>.md`, renderizado por `src/lib/content.ts`. Muda o seguinte:
- os grupos de navegação passam a ser seis;
- `editor-and-git` vira `editor`, com redirecionamento;
- um inventário em Markdown (`docs/docs-coverage.md`) liga cada item a uma página;
- dois testes novos travam a cobertura e os links internos.

O texto de cada página sai do código do app na tag v0.13.0.

**Stack:** Next.js 16 (App Router, next-intl), Markdown com unified/remark/rehype (`rehype-slug`, `rehypeClips`) e Vitest.

**Spec:** `docs/superpowers/specs/2026-11-16-docs-per-feature-design.md`. Quem executa lê os dois.

A entrega 2 (gravações novas) terá um plano próprio, depois que esta for publicada.

## Restrições globais

- **Trabalho:** só no worktree `/Users/maiconwagnerdossantos/Documents/Projetos/Persist/persist-landingpage/.superpowers/worktrees/docs-per-feature` (branch `docs/per-feature`). Nunca use a pasta principal do site, que está em outro branch.
- **Fonte da verdade:** o app na tag v0.13.0.
  - Repositório: `/Users/maiconwagnerdossantos/Documents/Projetos/Persist/persist-application`.
  - Leia só pela tag: `git -C <app> show v0.13.0:<path>` e `git -C <app> grep -n <padrão> v0.13.0 -- <paths>`.
  - Strings: `apps/desktop/src/i18n/locales/pt-BR.json` e `en.json`.
  - No zsh, escreva `${t}` antes de `:caminho`.
- **Afirmações:** toda afirmação de uma página é conferida no código. O que não der para conferir fica de fora e vai para a lista do relatório.
- **Regras de texto:**
  - nunca prometer que agentes, fila, mascote ou Quadro funcionam com o app fechado;
  - nunca citar tmux, supervisor, AgentDeck, Tina nem GitToolBox;
  - Remote e o app de celular ficam fora;
  - Windows e Linux são prévia, e o mascote fora do app é só macOS.
- **Estilo:**
  - prosa curta e direta, sem listas de rótulos em negrito;
  - rótulos do app em negrito, exatos (pt-BR do `pt-BR.json`, en do `en.json`);
  - es com o nome em espanhol em negrito e o rótulo em inglês em itálico entre parênteses, na primeira vez;
  - inglês britânico;
  - teclas em `<kbd>…</kbd>`, separadas por espaço.
- **Ordem de cada página:** o que é (1–2 frases), vídeo se houver, como usar, onde fica e opções (com padrões), teclas (por mapa e plataforma quando diferem), grátis ou Pro, limites.
- **Pro:** as páginas dizem "Pro"; a página `pro` explica que o Team inclui tudo.
- **Vídeos:**
  - só os 24 de `public/changelog/<versão>/<nome>.mp4`, cada um conferido contra a interface da 0.13.0 antes de entrar;
  - o mesmo arquivo serve os três idiomas, com o `alt` traduzido;
  - formato: `![alt](/changelog/0.4.0/fila.mp4)`, sozinho no parágrafo.
- **Ferramentas:**
  - `export PATH="$HOME/.nvm/versions/node/v24.18.0/bin:$PATH"`;
  - testes: `node_modules/.bin/vitest run --testTimeout=60000`;
  - tipos: `node_modules/.bin/next typegen && node_modules/.bin/tsc --noEmit -p .`.
- **Commits:** terminam com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Nada de push sem o ok do usuário, perguntado diretamente.

## Foco da revisão

1. **Link antigo vindo de fora** (`/docs/editor-and-git`, `/en/docs/editor-and-git`, `/es/docs/editor-and-git`): precisa levar à página `editor` do mesmo idioma, com redirecionamento permanente. É testado na Tarefa 2.
2. **Âncora com acento ou ñ** (`#pestañas-y-grupos`, `#alterações`): o link interno tem de usar o id que o `rehype-slug` gera, senão aponta para o nada. O teste de links da Tarefa 2 calcula os ids a partir da página renderizada.
3. **Seção esquecida num idioma:** uma página em en ou es com menos seções que a pt-BR. O teste da Tarefa 2 compara o número de títulos `##` entre os idiomas.
4. **Vídeo de versão antiga mostrando tela que mudou:** cada vídeo usado é conferido pela capa `.jpg` contra a interface da v0.13.0, em cada tarefa de páginas, no passo de mídia. Os rejeitados vão para a lista da entrega 2.
5. **Navegação com 32 páginas no celular:** `MobileDocsNav` e o índice `/docs` com seis grupos precisam caber e ser usáveis em 390 px. A Tarefa 9 faz a captura a 390 px.

---

### Tarefa 1: inventário de cobertura

**Arquivos:**
- Criar: `docs/docs-coverage.md`
- Criar: `tests/docs-coverage.test.ts`

**Interfaces:**
- **Produz:** `docs/docs-coverage.md`, com uma tabela por versão (título `## <versão>`, de `0.1.0` a `0.13.0`, as mesmas de `content/changelog/pt-BR/*.md`) e uma tabela `## Configurações`. Cada linha:
  - colunas: `| Item | Página | Situação |`;
  - **Item:** o item como está no changelog do site (pt-BR) ou a opção de Configurações (`Aba › Opção`);
  - **Página:** `slug#ancora` em pt-BR, ou `—`;
  - **Situação:** `a escrever`, `coberto` ou `sem doc: <motivo>`.
- **Produz também:** a lista final de slugs e grupos, no topo do arquivo, numa tabela `| Slug | Grupo | Título pt-BR |`. As Tarefas 2–8 usam essa lista.

- [ ] **Passo 1: escrever o teste**

`tests/docs-coverage.test.ts`, sobre `docs/docs-coverage.md`:
- `it("has a section for every released version")`: os títulos `## x.y.z` são exatamente as versões de `listChangelog("pt-BR")`.
- `it("has a settings section listing every settings tab")`: `## Configurações` tem pelo menos uma linha para cada uma das 16 abas:
  - Agentes, Uso de IA, Atalhos, Conta, Contas de IA, Sobre, Integrações, Aparência, Privacidade e rede, Terminal, Arquivos, Editor, Workspace, Notificações, Voz, Servidores MCP.
  - Fonte: `settings.tab.*` em pt-BR.json v0.13.0.
- `it("gives every row a page or a reason")`: toda linha tem `Situação` em `coberto`, `a escrever` ou `sem doc: …`, e as linhas que não são `sem doc` têm `Página` no formato `slug` ou `slug#ancora`.
- `it("only points to pages in the page list")`: o slug de cada linha está na tabela de slugs do topo.

- [ ] **Passo 2: rodar e ver falhar**

Rodar `node_modules/.bin/vitest run tests/docs-coverage.test.ts --testTimeout=60000`. Esperado: FAIL, arquivo inexistente.

- [ ] **Passo 3: escrever `docs/docs-coverage.md`**

Fontes:
- `content/changelog/pt-BR/*.md` (os itens);
- `git -C <app> show v0.13.0:CHANGELOG.md` (detalhe, quando o item do site resume demais);
- `git -C <app> show v0.13.0:apps/desktop/src/features/settings/SettingsDialog.tsx` e as seções que ele importa (as opções de cada aba).

Regras:
- Use a lista de páginas da spec, ajustando onde o inventário mostrar.
- Todas as linhas começam como `a escrever`. As Tarefas 3–8 passam para `coberto`.
- `sem doc` só para correção interna sem efeito visível, ou para recurso que depois foi removido ou substituído. O motivo vai na linha, por exemplo `sem doc: substituído pelo Quadro na 0.10.0`.

- [ ] **Passo 4: rodar e ver passar**

Mesmo comando. Esperado: PASS.

- [ ] **Passo 5: commit**

`git add docs/docs-coverage.md tests/docs-coverage.test.ts && git commit -m "docs: coverage inventory of every released item and settings tab"`

---

### Tarefa 2: grupos, redirecionamento e testes de links

**Arquivos:**
- Modificar: `src/lib/content.ts` (`DOC_GROUPS`)
- Modificar: `messages/{pt-BR,en,es}/docs.json` (`groups`)
- Modificar: `next.config.ts` (`redirects`)
- Mover: `content/docs/{pt-BR,en,es}/editor-and-git.md` → `editor.md`
- Modificar: o frontmatter `group` das 12 páginas atuais
- Criar: `tests/docs-links.test.ts`
- Modificar: `tests/content.test.ts`

**Interfaces:**
- **Consome:** a tabela de slugs e grupos da Tarefa 1.
- **Produz:**
  - `DOC_GROUPS = ["start", "agents", "code", "integrations", "account", "reference"] as const`;
  - os nomes dos grupos:
    - pt-BR: Começar, Agentes, Código, Integrações, Conta, Referência;
    - en: Getting started, Agents, Code, Integrations, Account, Reference;
    - es: Empezar, Agentes, Código, Integraciones, Cuenta, Referencia;
  - redirecionamento permanente de `/docs/editor-and-git` → `/docs/editor`, `/en/docs/editor-and-git` → `/en/docs/editor` e `/es/docs/editor-and-git` → `/es/docs/editor`.

- [ ] **Passo 1: escrever os testes**

`tests/docs-links.test.ts`:
- `it("every internal docs link points to an existing page and heading")`:
  - para cada locale, renderize todas as docs com `getDoc` e junte os `id` dos títulos;
  - procure links `/docs/<slug>` e `/docs/<slug>#<ancora>` em `content/docs/**`, `content/changelog/**`, `content/legal/**` e `messages/**`, e links `#<ancora>` dentro da própria página;
  - verifique que o slug existe naquele idioma e que a âncora (decodificada) está entre os ids;
  - o idioma de um arquivo de `messages` ou `content` vem da pasta.
- `it("redirects the old editor-and-git address in every language")`: importe a config de `next.config.ts` e espere que `await config.redirects()` contenha as três regras acima, com `permanent: true`.

`tests/content.test.ts`:
- `it("have the same sections in every language")`: para cada slug, o número de títulos `##` (`doc.headings` com `depth === 2`) é igual nos três idiomas.

- [ ] **Passo 2: rodar e ver falhar**

Rodar `node_modules/.bin/vitest run tests/docs-links.test.ts tests/content.test.ts --testTimeout=60000`. Esperado: FAIL. Não há redirecionamento, e talvez haja links quebrados para âncoras.

- [ ] **Passo 3: implementar**

- **Redirecionamento:** antes de escrever `redirects()`, leia o guia de redirecionamentos desta versão do Next em `node_modules/next/dist/docs/`.
- Atualize `DOC_GROUPS` e os nomes dos grupos.
- Remapeie o `group` de cada página atual conforme a tabela da Tarefa 1.
- Renomeie `editor-and-git.md` para `editor.md` nos três idiomas.
- Corrija todo link que apontava para `editor-and-git` ou para uma âncora que deixou de existir.

- [ ] **Passo 4: rodar todos os testes e tipos**

Rodar `node_modules/.bin/vitest run --testTimeout=60000` e depois `node_modules/.bin/next typegen && node_modules/.bin/tsc --noEmit -p .`. Esperado: PASS e nenhum erro de tipo.

- [ ] **Passo 5: commit**

`git commit -am "docs: six groups, editor-and-git becomes editor, link and section tests"` (com os arquivos novos adicionados).

---

### Tarefas 3 a 8: páginas por grupo

Cada uma das seis tarefas segue o mesmo molde e cobre um grupo. Elas são independentes entre si, mas mexem em arquivos diferentes. Duas tarefas não editam a mesma página. Quando uma página antiga é dividida (por exemplo `agents` perde Quadro, mascote e notificações), a tarefa dona da página antiga remove a seção, e a tarefa da página nova a recebe. Por isso **rode as Tarefas 3–8 nesta ordem**, cada uma partindo do commit da anterior.

| Tarefa | Grupo | Páginas (slugs) | Texto que já existe e vem para cá |
|---|---|---|---|
| 3 | Começar | `getting-started`, `projects-and-workspaces`, `sessions` (nova), `sessions-and-recovery` | `getting-started`, `projects-and-workspaces` (os comandos saem para `commands`), `sessions-and-recovery` |
| 4 | Agentes | `agents`, `board`, `mascot`, `notifications`, `ai-accounts`, `usage-and-quota`, `queue`, `restore-points`, `worktrees`, `verify` | `agents` (Quadro, mascote, notificações e MCP saem), `ai-accounts`, `usage-and-quota`, e de `pro` a fila, os pontos, o worktree e a verificação |
| 5 | Código | `editor`, `files`, `tabs-and-groups`, `git-in-the-editor`, `changes`, `search` (nova), `notes`, `commands` | as seções de `editor` (ex-`editor-and-git`) e os comandos de `projects-and-workspaces` |
| 6 | Integrações | `issues`, `forges`, `mcp-servers`, `voice` (todas novas) | o trecho de MCP de `agents`, o de rede de `privacy-and-network` (só os links) |
| 7 | Conta | `pro` (vira índice), `account-and-license`, `privacy-and-network`, `updates` (nova) | as três páginas atuais |
| 8 | Referência | `shortcuts`, `settings` (nova), `troubleshooting` | as páginas atuais |

**Arquivos (por tarefa):** `content/docs/{pt-BR,en,es}/<slug>.md` de cada página do grupo e as linhas do grupo em `docs/docs-coverage.md`.

**Interfaces:**
- **Consome:** os slugs, grupos e âncoras da Tarefa 1, os `DOC_GROUPS` da Tarefa 2, e os testes de links e seções da Tarefa 2.
- **Produz:**
  - páginas com `title`, `description`, `group` e `order`, sendo `order` a posição dentro do grupo, a partir de 1;
  - as linhas do inventário do grupo como `coberto`, com `Página` apontando para a âncora real.

- [ ] **Passo 1: listar o que o grupo cobre**

Em `docs/docs-coverage.md`, separe as linhas `a escrever` cuja página é deste grupo. Essa é a lista de trabalho.

- [ ] **Passo 2: escrever as páginas em pt-BR**

Para cada página:
- confira cada recurso no código da v0.13.0: o rótulo exato, onde fica, o padrão, as teclas por mapa (`keymaps/presets/webstorm.generated.ts` classic/macos, `vscode.ts`, `presets/index.ts`) e se é Pro (`useFeature`, `require_feature`);
- escreva seguindo a ordem e o estilo das Restrições globais;
- aproveite o texto já corrigido das páginas atuais.

- [ ] **Passo 3: mídia existente**

Para cada vídeo de `public/changelog/*/` que trate de um recurso do grupo:
- abra a capa `.jpg` e compare com a tela da v0.13.0 (os rótulos e o layout de `git show v0.13.0:` dos componentes envolvidos);
- se bate, insira na página, depois da abertura, com o `alt` traduzido;
- se não bate, anote na seção `## Mídia para a entrega 2` de `docs/docs-coverage.md`, com o nome e o motivo.

- [ ] **Passo 4: traduzir para en e es**

Mesmas seções e mesma ordem: o teste de seções exige o mesmo número de `##`. Use os rótulos do `en.json` em en e a regra do espanhol em es.

- [ ] **Passo 5: atualizar o inventário**

Marque `coberto` nas linhas do grupo, com `slug#ancora` real (pt-BR). Uma linha que se mostrou sem efeito visível vira `sem doc: <motivo>`.

- [ ] **Passo 6: rodar testes e tipos**

Rodar `node_modules/.bin/vitest run --testTimeout=60000`. Esperado: PASS, inclusive `docs-coverage`, `docs-links` e o teste de seções.

- [ ] **Passo 7: commit**

`git add content/docs docs/docs-coverage.md && git commit -m "docs: <grupo> pages, one per feature"`

---

### Tarefa 9: revisão independente e conferência visual

**Arquivos:** os de `content/docs/**` que a revisão mandar corrigir.

**Interfaces:**
- **Consome:** todas as páginas e o inventário.
- **Produz:** o relatório de cada revisor, com os achados resolvidos ou justificados.

- [ ] **Passo 1: revisão só de leitura, um revisor por grupo**

Cada revisor recebe:
- o caminho do worktree;
- as páginas pt-BR do grupo;
- a tag v0.13.0;
- as Restrições globais.

Ele compara cada afirmação com o código e devolve três listas: as falsas, as que faltam pelo inventário e os rótulos errados, cada item com evidência. Rode os seis em paralelo, só de leitura.

- [ ] **Passo 2: corrigir os achados nos três idiomas**

Releia o código antes de cada correção, para não aceitar um achado errado. Depois rode os testes. Esperado: PASS.

- [ ] **Passo 3: conferência visual**

- Suba `node_modules/.bin/next dev -p 3219` no worktree.
- Confira que as ~32 páginas respondem 200 nos três idiomas e que os três endereços antigos de `editor-and-git` redirecionam (`curl -s -o /dev/null -w "%{http_code} %{redirect_url}"`).
- Capture `/docs`, uma página com vídeo e a navegação no celular a 1280 e a 390 px com `section-shots.mjs`, no scratchpad da sessão.
- Corrija o que estiver quebrado.

- [ ] **Passo 4: commit**

`git commit -am "docs: fixes from the independent review"`

---

### Tarefa 10: publicar a entrega 1

**Arquivos:**
- Modificar: `PRODUCT.md`, uma linha: as docs passam a ser por recurso, com inventário em `docs/docs-coverage.md`.
- A memória `release-updates-docs`, fora do repositório: a regra de lançamento passa a incluir o inventário.

- [ ] **Passo 1: antes e depois para o usuário**

Mostre:
- a lista de páginas por grupo;
- o número de itens do inventário cobertos, sem doc e com motivo;
- os vídeos usados e os que ficaram para a entrega 2;
- as capturas da Tarefa 9.

Pergunte com AskUserQuestion se pode publicar.

- [ ] **Passo 2: só com o ok, juntar e enviar**

No worktree:
1. `git fetch origin`
2. `git checkout main && git merge --ff-only origin/main`
3. `git merge --no-ff docs/per-feature`
4. Testes de novo.
5. Push com o token abalad, como em `publishing-the-site`.
6. `git checkout docs/per-feature`

- [ ] **Passo 3: conferir no ar**

- `vercel inspect <url> --wait --scope mw-tecnologia-projects`, com node v20.
- Script headless no scratchpad confirma, nos três idiomas:
  - 5 páginas novas com um texto característico cada;
  - o redirecionamento de `editor-and-git`;
  - `/docs` com os seis grupos.
- Nunca use curl em persisty.app.

- [ ] **Passo 4: registrar e limpar**

- Atualize a memória com o commit da main e a lista da entrega 2.
- Apague o worktree e o branch só depois de a entrega 2 ter o seu.
