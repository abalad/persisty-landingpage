# Páginas por plano e Minha conta em painel: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Páginas `/free`, `/pro` e `/team` com um trecho por recurso; menu "Funcionalidades" dividido por plano; comparação com a coluna do plano em destaque; Enterprise fora de vista; e Minha conta como painel com menu ao lado e uma visão geral que mostra os recursos do plano.

**Architecture:** O catálogo de recursos em `src/lib/plans.ts` passa a ser a única fonte de verdade: lista por plano, estado, âncora na página do plano e itens do menu. Páginas, menu, tabela e Minha conta leem dele. Os textos ficam em `messages/<locale>/` (um namespace novo `plans` para as páginas e outro `features` para a linha e o lugar no app de cada recurso). Minha conta vira rotas aninhadas em `src/app/[locale]/account/`, com um layout de cliente que carrega a conta uma vez e entrega os dados por contexto.

**Tech Stack:** Next.js 16.4.2 (App Router), React 19.3, next-intl 4.14, CSS Modules, lucide-react, vitest 5 (ambiente node), Supabase JS no navegador.

**Spec:** `docs/superpowers/specs/2026-11-02-plan-pages-and-account-design.md`. Leia o spec antes de qualquer tarefa; este plano argumenta a partir dele.

## Global Constraints

- Antes de escrever código Next, ler o guia relevante em `node_modules/next/dist/docs/` (AGENTS.md). Páginas usam `PageProps<"/[locale]/...">`, layouts usam `LayoutProps<...>`, `params` é Promise (`use(params)` ou `await`), `setRequestLocale(locale)` em toda página. `useSearchParams` em página estática exige `<Suspense>`.
- Três idiomas: pt-BR (sem prefixo), en, es. Toda chave nova entra nos três; `tests/messages.test.ts` exige as mesmas chaves e nenhuma string vazia. Namespace novo entra em `NAMESPACES` (`src/i18n/messages.ts`).
- Copy (`tests/copy.test.ts`): nunca "tmux" nem "supervis*"; nunca prometer agentes trabalhando com o app fechado (as expressões do teste, como "trabalhar sem você", "keeps running" e "work without you", ficam proibidas); Windows e Linux são prévia; planejado nunca aparece como disponível; o Persisty Runner não aparece; a fila "no jeito de chat" (pós-0.9.0) não aparece; a promessa "sem métrica individual de produtividade" continua.
- Preços só por `formatPlanPrice`/`formatPrice` (`src/lib/pricing.ts`); a copy usa `{price}`, nunca o valor escrito.
- Visual segue `DESIGN.md`: escuro só; um lima para o que é vivo ou ação; listas divididas por linhas finas dentro de um painel (nunca grade de cartões soltos); sem degradê, sem ícone em quadradinho colorido, sem rótulo pequeno em maiúsculas acima de título, sem barra colorida grossa num lado, sem sombra em painel; títulos peso 330 a 420; Mona Sans no texto e JetBrains Mono só onde a máquina fala; ícones Lucide. Tarefas de interface carregam a skill `impeccable:impeccable` antes de desenhar.
- Âncoras fixas (o app depende delas): Pro `accounts`, `queue`, `restore-points`, `verify`, `worktree`, `license`; Team `billing`, `privacy`; Grátis `recovery`, `projects`, `states`, `editor`, `privacy`, `usage`, `git`, `notifications`, `voice`, `issues`, `agents`, `offline`; planejados `roadmap`; comparação `compare`.
- Enterprise continua definido em `PLANS`; some porque não está em `SHOWN_PLAN_IDS`. Religar = acrescentar `"enterprise"` ali.
- Sem prettier: editar à mão no estilo vizinho (2 espaços, aspas duplas, ponto e vírgula, linhas longas aceitas).
- Trabalho no branch `feat/plan-pages`, commits locais com a linha `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. **Nunca `git push`.**
- Fatos do app: tag `v0.9.0` do repositório `../persist-application` (`git -C ../persist-application show v0.9.0:<arquivo>`), nunca o `main` dele (tem coisa não lançada).

## Review Focus

1. Chegar por `/pro?tried=queue#queue`: o título do trecho não pode ficar escondido sob o menu fixo e a barra de aviso (`scroll-margin-top` soma as duas alturas). Verificado por captura de tela na Tarefa 6.
2. `tried` com valor desconhecido, vazio, repetido ou em maiúsculas, ou presente em `/free`: nada aparece e nada quebra. Teste em `tests/tried.test.ts` (Tarefa 6).
3. Menu por teclado e toque: Tab chega ao plano aberto e aos seus itens, setas trocam o plano, Esc fecha e devolve o foco ao botão, um toque abre sem depender de hover, o menu fecha ao navegar e ao cruzar 1000px de largura. Verificado na Tarefa 9 por roteiro no navegador sem tela.
4. Entrar sem sessão em `/account/devices` leva ao login e volta para `/account/devices`; a volta do checkout (`/account?checkout=done`) continua esperando o plano. Teste de `signInPath` em `tests/account.test.ts` (Tarefa 10).
5. Contas fora do caso simples: membro de time que não gerencia, Pro pessoal junto com plano de time, dono de time com assinatura vencida. Cada uma mostra as partes certas do menu e o plano certo. Testes de `accountSections`, `unlockedFor` e `subscribeOptions` com esses casos (Tarefas 10 e 11).

---

### Task 1: Catálogo de recursos por plano

**Files:**
- Modify: `src/lib/plans.ts`
- Modify: `messages/{pt-BR,en,es}/pricing.json` (`features`)
- Create: `messages/{pt-BR,en,es}/features.json`
- Modify: `src/i18n/messages.ts` (`NAMESPACES` ganha `"features"`)
- Test: `tests/pricing.test.ts`

**Interfaces:**
- Produces:
  - `type ShownPlanId = Exclude<PlanId, "enterprise">`
  - `const SHOWN_PLAN_IDS: readonly ShownPlanId[]` (`["free", "pro", "team"]`)
  - `const SHOWN_PLANS: Plan[]` (os planos de `SHOWN_PLAN_IDS`, na ordem)
  - `interface PlanFeature { id: string; status: Availability; anchor?: string }`: os disponíveis têm `anchor`; os planejados não têm
  - `function planPath(plan: ShownPlanId): "/free" | "/pro" | "/team"`
  - `function featureHref(plan: ShownPlanId, feature: PlanFeature): string`: `${planPath(plan)}#${feature.anchor ?? "roadmap"}`
  - `function findFeature(id: string): { plan: ShownPlanId; feature: PlanFeature } | undefined`
  - `const MENU_FEATURES: Record<ShownPlanId, string[]>`: até 6 ids por plano, disponíveis primeiro
  - Mensagens: `pricing.features.<id>` (nome curto) para todo recurso; `features.<id>.line` (uma linha) para todo recurso dos planos mostrados; `features.<id>.where` (onde fica no app, com os nomes de menu do app) para todo recurso disponível.

- [ ] **Step 1: Escrever os testes que falham** em `tests/pricing.test.ts`. Troque o teste "lists the plans from smallest to largest" e o de Team/Enterprise pelos abaixo e mantenha os demais.

```ts
describe("plan catalog", () => {
  it("shows Free, Pro and Team; Enterprise stays defined but hidden", () => {
    expect(SHOWN_PLANS.map((p) => p.id)).toEqual(["free", "pro", "team"]);
    expect(PLANS.map((p) => p.id)).toEqual(["free", "pro", "team", "enterprise"]);
    expect(planById("enterprise").billing).toBe("contact");
  });

  it("keeps the anchors the app links to", () => {
    const anchors = (id: ShownPlanId) => planById(id).features.filter((f) => f.status === "available").map((f) => f.anchor);
    expect(anchors("pro")).toEqual(["accounts", "queue", "restore-points", "verify", "worktree", "license"]);
    expect(anchors("team")).toEqual(["billing"]);
    expect(new Set(anchors("free"))).toEqual(new Set(["recovery", "projects", "states", "editor", "git", "usage", "notifications", "voice", "issues", "agents", "privacy", "offline"]));
  });

  it("gives every available feature an anchor and no planned one", () => {
    for (const plan of SHOWN_PLANS) {
      for (const f of plan.features) expect(Boolean(f.anchor), `${plan.id}.${f.id}`).toBe(f.status === "available");
    }
  });

  it("links features to their plan page", () => {
    const queue = planById("pro").features.find((f) => f.id === "requestQueue")!;
    expect(featureHref("pro", queue)).toBe("/pro#queue");
    const remote = planById("pro").features.find((f) => f.id === "remote")!;
    expect(featureHref("pro", remote)).toBe("/pro#roadmap");
    expect(findFeature("teamBilling")?.plan).toBe("team");
  });

  it("sells only what exists: Growth and the Runner are not listed, Team's extras are planned", () => {
    const ids = SHOWN_PLANS.flatMap((p) => p.features.map((f) => f.id));
    expect(ids).not.toContain("growth");
    expect(ids.some((id) => /runner/i.test(id))).toBe(false);
    expect(planById("team").features.filter((f) => f.id !== "teamBilling").every((f) => f.status === "planned")).toBe(true);
    expect(planById("pro").features.filter((f) => f.status === "planned").map((f) => f.id)).toEqual(["remote", "autopilot", "nightShift", "sessionXray"]);
    expect(planById("free").features.filter((f) => f.status === "planned").map((f) => f.id)).toEqual(["issueToSession", "bestOfN", "crossReview"]);
  });

  it("puts at most six of a plan's own features in the menu, available first", () => {
    for (const id of SHOWN_PLAN_IDS) {
      const items = MENU_FEATURES[id].map((f) => planById(id).features.find((x) => x.id === f));
      expect(items.length).toBeLessThanOrEqual(6);
      expect(items.every(Boolean), id).toBe(true);
      const firstPlanned = items.findIndex((f) => f!.status === "planned");
      if (firstPlanned >= 0) expect(items.slice(firstPlanned).every((f) => f!.status === "planned")).toBe(true);
    }
  });

  it("names every shown feature in every language", async () => {
    for (const locale of routing.locales) {
      const m = (await loadMessages(locale)) as { pricing: { features: Record<string, string> }; features: Record<string, { line?: string; where?: string }> };
      for (const plan of SHOWN_PLANS) {
        for (const f of plan.features) {
          expect(m.pricing.features[f.id], `${locale} pricing.features.${f.id}`).toBeTruthy();
          expect(m.features[f.id]?.line, `${locale} features.${f.id}.line`).toBeTruthy();
          if (f.status === "available") expect(m.features[f.id]?.where, `${locale} features.${f.id}.where`).toBeTruthy();
        }
      }
    }
  });
});
```

- [ ] **Step 2: Rodar e ver falhar.** `pnpm vitest run tests/pricing.test.ts`. Esperado: FAIL ("SHOWN_PLANS is not exported", ou import ausente).

- [ ] **Step 3: Implementar o catálogo em `src/lib/plans.ts`.** As listas, na ordem e com as âncoras do spec ("O que existe hoje, por plano"):
  - **Grátis:** `persistentSessions` e `recovery` (ambos `recovery`), `projects`, `agentStates` (`states`), `editorGit` (`editor`), `gitHosting` (`git`), `usage`, `notifications`, `voice`, `trackers` (`issues`), `agentTools` (`agents`), `networkLog` (`privacy`), `noAccount` (`offline`). Planejados: `issueToSession`, `bestOfN`, `crossReview`.
  - **Pro:** `accountRotation` (`accounts`), `requestQueue` (`queue`), `restorePoints` (`restore-points`), `verifyOnFinish` (`verify`), `worktrees` (`worktree`), `offlineLicense` (`license`). Planejados: `remote`, `autopilot`, `nightShift`, `sessionXray`. `growth` sai.
  - **Team:** `teamBilling` (`billing`). Planejados: `teamBoard`, `budgets`, `observability`, `teamMemory`, `policies`. `finops` sai.
  - Enterprise fica como está.
  - `MENU_FEATURES`:
    - free: `recovery`, `projects`, `agentStates`, `editorGit`, `voice`, `trackers`
    - pro: os cinco primeiros disponíveis e depois `remote`
    - team: `teamBilling`, `teamBoard`, `budgets`, `observability`, `teamMemory`, `policies`
  - Um comentário acima de `SHOWN_PLAN_IDS`: "Enterprise fica fora por decisão do usuário (2026-11-02); para religar, acrescente-o aqui".

- [ ] **Step 4: Textos nos três idiomas.**
  - Em `pricing.features`: acrescente os ids novos e tire `growth` e `finops`. `teamBoard` passa a "Painel do time ao vivo" (en "Live team board", es "Panel del equipo en vivo").
  - Crie `features.json`, com `line` e `where` tirados de `persist-application` na tag v0.9.0 (CHANGELOG, `apps/desktop/src/i18n/locales/pt-BR.json` e `en.json`) e de `content/docs/*/pro.md` e `ai-accounts.md`.
  - `observability.line` fala de custo por PR mesclado, por projeto, e de trabalho aceito e abandonado, sem pessoa e sem horas humanas.
  - `remote.line` não promete nada com o app fechado.
  - Acrescente `"features"` a `NAMESPACES`.

- [ ] **Step 5: Rodar.** `pnpm vitest run tests/pricing.test.ts tests/messages.test.ts tests/copy.test.ts`. Esperado: PASS. `pnpm lint` acusa os usos de `growth` e `finops` em outros arquivos: corrija só o que quebrar o tipo, porque a Tarefa 2 mexe nos componentes.

- [ ] **Step 6: Commit.** `git add src/lib/plans.ts src/i18n/messages.ts messages tests/pricing.test.ts && git commit -m "feat(plans): one feature catalog per plan, with anchors and the menu's picks"`

### Task 2: Enterprise fora de vista

**Files:**
- Modify: `src/components/pricing/PlanCards.tsx`, `src/components/pricing/PlanCards.module.css`, `src/components/pricing/CompareTable.tsx`
- Modify: `src/components/home/Companies.tsx`, `messages/*/home.json` (`companies`), `messages/*/pricing.json` (`meta.description`, `body`, FAQ do Enterprise)
- Modify: `src/components/account/AccountView.tsx` (sai a seção Enterprise e o uso de `interests`)
- Modify: `content/legal/{pt-BR,en,es}/security.md` (sai a linha do código-fonte para auditoria no Enterprise), `content/legal/{pt-BR,en,es}/privacy.md` ("e o interesse no Enterprise" vira "e os interesses que você registrar")
- Create: `tests/enterprise.test.ts`

**Interfaces:**
- Consumes: `SHOWN_PLANS` (Task 1).
- Produces: `PlanAction` exportado de `PlanCards.tsx` (`export function PlanAction({ plan, label }: { plan: Plan; label: string })`), usado pelas páginas de plano.

- [ ] **Step 1: Escrever o teste que falha** `tests/enterprise.test.ts`:

```ts
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const files = (dir: string): string[] => readdirSync(dir).flatMap((n) => (statSync(join(dir, n)).isDirectory() ? files(join(dir, n)) : [join(dir, n)]));
// The account's sign-in intent and plan name stay (unreachable, ready to switch back on); the 0.7.0 changelog is history.
const allowed = (path: string) => path.endsWith("auth.json") || path.includes("content/changelog/");

describe("Enterprise is out of sight", () => {
  it("is not named in any page text", () => {
    const hits = [...files("messages"), ...files("content")].filter((p) => !allowed(p)).flatMap((p) => readFileSync(p, "utf8").split("\n").filter((l) => /enterprise/i.test(l)).map((l) => `${p}: ${l.trim()}`));
    expect(hits).toEqual([]);
  });

  it("is not linked from the components", () => {
    const hits = files("src/components").filter((p) => /contactHref\("enterprise"\)/.test(readFileSync(p, "utf8")));
    expect(hits).toEqual([]);
  });
});
```

- [ ] **Step 2: Rodar e ver falhar.** `pnpm vitest run tests/enterprise.test.ts`. Esperado: FAIL, listando `pricing.json`, `home.json` (o item "SSO..." e o botão), `security.md`, `privacy.md` e `Companies.tsx`/`PlanCards.tsx`.

- [ ] **Step 3: Implementar.**
  - `PlanCards` e `CompareTable` percorrem `SHOWN_PLANS`. A grade passa a ter 3 colunas (2 abaixo de 1080px, 1 abaixo de 640px, como hoje). O ramo `enterprise` de `PlanAction` fica, mas sem `contactHref("enterprise")`: usa `"/sign-in"`.
  - `Companies` fica sem o item de SSO. Os planejados ganham os nomes do roteiro ("Painel do time ao vivo", "Orçamento e regras de modelo", "Observabilidade de gestão", "Políticas com auditoria"). O texto de gasto mantém "sem métrica individual de produtividade". O botão vira "Conhecer o Team" (en "See Team", es "Conocer Team"), com `href="/team"`.
  - Em Preços, tire a pergunta do Enterprise e o "Enterprise sob consulta" da descrição.
  - Em `AccountView`, saem a seção `g-enterprise` e as variáveis `interests` e `enterprise`. As chaves `auth.account.enterprise` saem dos três `auth.json`; `auth.account.plan.enterprise` e `auth.signIn.intentEnterprise` ficam.

- [ ] **Step 4: Rodar.** `pnpm vitest run` e `pnpm lint`. Esperado: tudo PASS (inclusive `tests/site.test.ts`, que testa `contactHref` e continua valendo).

- [ ] **Step 5: Commit.** `git commit -am "feat(site): Enterprise out of sight until it comes back"` (inclua `tests/enterprise.test.ts` com `git add`).

### Task 3: Comparação com destaque, também na home, e a ferramenta de captura

**Files:**
- Modify: `src/components/pricing/CompareTable.tsx`, `CompareTable.module.css`
- Modify: `src/app/[locale]/page.tsx` (a seção `pricing` ganha `<CompareTable />` sob os cartões)
- Modify: `messages/*/pricing.json` (`compare.current`: "Este plano" / "This plan" / "Este plan")
- Create: `scripts/shots/pages.mjs`

**Interfaces:**
- Produces: `CompareTable({ highlight }: { highlight?: ShownPlanId })`. A coluna em destaque usa o tratamento "featured" do DESIGN.md (fundo `selected-raised` e o marcador lima no topo do cabeçalho, `box-shadow: inset 0 2px 0`) e um `visually-hidden` com `compare.current` no cabeçalho.
- Produces: `node scripts/shots/pages.mjs <base-url> <out-dir> <path>...` grava `<out-dir>/<slug>-desktop.png` (1280 de largura) e `<slug>-mobile.png` (390, `mobile: true`), em página inteira (`Page.getLayoutMetrics` e depois `captureScreenshot` com `captureBeyondViewport: true`). Usa `openBrowser` de `scripts/e2e/lib.mjs`. Espera 2,5 s por página e rola até o fim e volta antes de capturar, para os elementos que aparecem com a rolagem.

- [ ] **Step 1: Implementar o `highlight`** e a tabela na home. Os planejados continuam com `Badge status="planned"` na linha.
- [ ] **Step 2: Criar `scripts/shots/pages.mjs`.**
- [ ] **Step 3: Verificar.** `pnpm build && pnpm start -p 3200 &` (servidor em segundo plano), depois `node scripts/shots/pages.mjs http://localhost:3200 /private/tmp/claude-501/-Users-maiconwagnerdossantos-Documents-Projetos-Persist-persist-landingpage/776ca16d-ed66-4fd4-9667-ce19883b7b5e/scratchpad/shots/t3 / /pricing`. Abra as imagens: três colunas e nenhum Enterprise. Encerre o servidor.
- [ ] **Step 4: Rodar** `pnpm lint && pnpm vitest run`. Esperado: PASS.
- [ ] **Step 5: Commit.** `git commit -m "feat(pricing): the comparison on the home page, with the current plan's column marked"`

### Task 4: Telas do Pro refeitas a partir da versão 0.9.0

**Files:**
- Create: `src/components/mockups/ProPanels.tsx` (o corpo de cada painel e a janela inteira de cada recurso)
- Modify: `src/components/mockups/ProTabs.tsx` (usa `ProWindow`), `src/components/mockups/AccountsMock.tsx`, `src/components/mockups/extra.module.css`
- Modify: `messages/*/mock.json` (`mock.pro`, `mock.accounts`)
- Modify: `src/app/[locale]/page.tsx` (seção `pro`: o link passa a ser `{ href: "/pro", label: t("pro.link") }`, com "Ver tudo do Pro" / "Everything in Pro" / "Todo lo de Pro")

**Interfaces:**
- Produces:
  - `type ProPanelId = "queue" | "restore" | "verify" | "worktree"`
  - `function ProPanelBody({ panel }: { panel: ProPanelId })`: só o conteúdo do painel lateral
  - `function ProWindow({ panel }: { panel: ProPanelId })`: janela inteira (cabeçalho da sessão, terminal e painel lateral com aquele painel aberto), a mesma que a aba mostra hoje
  - `AccountsMock` mantém o nome e as props

- [ ] **Step 1: Ler o app lançado.** Leia `git -C ../persist-application show v0.9.0:apps/desktop/src/features/panel/{SidePanel,QueuePanel,RestorePanel}.tsx`, `.../features/workspace/VerifyChip.tsx`, `.../features/settings/AiAccountsSection.tsx`, o formulário de nova sessão (procure por `worktree` em `git -C ../persist-application grep -n worktree v0.9.0 -- apps/desktop/src/features/sessions`) e as chaves de `apps/desktop/src/i18n/locales/{pt-BR,en}.json` na mesma tag. Anote rótulos, ordem dos campos, chips e estados.
- [ ] **Step 2: Refazer as telas.** Os painéis e a tela de contas devem bater com o que foi lido: rótulos iguais aos do app, a mesma ordem, o limite escolhido do rodízio e a opção "Automática". Mova os painéis de `ProTabs` para `ProPanels.tsx`. Medidas em `calc(n * var(--u))`, como no restante de `mockups/`. Layout estreito abaixo de 640px do contêiner, como hoje.
- [ ] **Step 3: Verificar.** `pnpm lint && pnpm vitest run && pnpm build`. Esperado: PASS. Depois capture `/` com `scripts/shots/pages.mjs` e compare as abas do Pro com o código lido no Step 1.
- [ ] **Step 4: Commit.** `git commit -m "feat(mockups): Pro screens redrawn from the 0.9.0 app, one window per feature"`

### Task 5: Recortes (pequenas telas) para o menu e Minha conta

**Files:**
- Create: `src/components/plans/Glimpse.tsx`, `src/components/plans/Glimpse.module.css`, `src/components/plans/featureIcons.tsx`
- Modify: `messages/*/mock.json` (`mock.glimpse.*`)

**Interfaces:**
- Produces:
  - `type GlimpseId = "accountRotation" | "requestQueue" | "restorePoints" | "verifyOnFinish" | "worktrees" | "recovery" | "teamBilling"`
  - `function hasGlimpse(id: string): id is GlimpseId`
  - `function Glimpse({ id }: { id: GlimpseId })`: um recorte de interface do app em HTML, de largura fluida e cerca de 112px de altura, com texto real. Usa só `useTranslations`, então funciona no servidor e no cliente. Não usa `Window` nem `--u`; usa os tokens de app (`--color-surface`, `--color-border`, `--color-fg-muted`...) e os componentes `Chip`, `Meter` e `Dot` de `mockups/parts.tsx`. Os conteúdos:
    - **contas:** duas contas com a barra de 5 h e a opção "Automática"
    - **fila:** dois pedidos esperando, com o quando de cada um
    - **pontos:** três pontos de restauração, o primeiro selecionado
    - **verificação:** o chip "Verificação · passou" e o comando
    - **pasta:** o branch `persist/<nome>` e a pasta
    - **recuperação:** três sessões, com o selo restaurado ou não
    - **cobrança do time:** "3 de 5 assentos" e duas pessoas
  - `const FEATURE_ICONS: Record<string, LucideIcon>`: um ícone Lucide para cada id de recurso dos planos mostrados.

- [ ] **Step 1:** Carregue a skill `impeccable:impeccable` e desenhe os recortes no vocabulário do app (13px, chips, linhas finas). Nada de ilustração genérica.
- [ ] **Step 2: Teste** em `tests/pricing.test.ts`: `it("has an icon for every shown feature")`. Para cada recurso de `SHOWN_PLANS`, `FEATURE_ICONS[f.id]` existe. Se importar `lucide-react` no ambiente node falhar, mova o mapa de ids para nomes de ícone para `src/lib/featureIcons.ts` e teste os nomes.
- [ ] **Step 3: Rodar** `pnpm vitest run && pnpm lint`. Esperado: PASS.
- [ ] **Step 4: Commit.** `git commit -m "feat(plans): small app glimpses for the menu and the account"`

### Task 6: Página `/pro`, peças das páginas de plano e o aviso de quem veio do app

**Files:**
- Create: `src/lib/tried.ts`, `tests/tried.test.ts`
- Create, em `src/components/plans/`:
  - `PlanHero.tsx`
  - `PlanSection.tsx`
  - `AlsoList.tsx`
  - `Roadmap.tsx`
  - `PlanCompare.tsx`
  - `PlanClosing.tsx`
  - `TriedBar.tsx`
  - `plans.module.css`
- Create: `src/app/[locale]/pro/page.tsx`
- Create: `messages/{pt-BR,en,es}/plans.json`; `src/i18n/messages.ts` (`NAMESPACES` ganha `"plans"`)
- Modify: `src/app/[locale]/layout.tsx` (`clientMessages` passa `plans.common.tried`, `pricing.features` e `features` ao navegador)

**Interfaces:**
- Consumes: catálogo (Task 1), `PlanAction` (Task 2), `CompareTable({ highlight })` (Task 3), `ProWindow`/`AccountsMock` (Task 4), `FaqSection` e `Feature` da home.
- Produces:
  - `TRIED: readonly ["accounts", "queue", "restore-points", "verify", "worktree"]`, `type Tried = (typeof TRIED)[number]`, `function triedAnchor(value: string | null | undefined): Tried | null`, `function triedFeatureId(anchor: Tried): string` (`accounts`→`accountRotation`, `queue`→`requestQueue`, `restore-points`→`restorePoints`, `verify`→`verifyOnFinish`, `worktree`→`worktrees`)
  - `PlanHero({ plan }: { plan: ShownPlanId })`: nome, preço (Grátis: `formatPrice(locale, 0, currencyFor(locale), { explicit: true })`), "por…", título e frase de `plans.<plan>.hero`, `PlanAction` grande e "Comparar planos" (`#compare`)
  - `PlanSection({ id, plan, title, body, diff, link, narrow, children })`: `Feature` com o selo do plano no `meta` (Pro e Team) e a linha `diff` sob a janela
  - `AlsoList({ title, items }: { title: string; items: { id: string; anchor?: string; name: string; line: string; href?: string; badge?: ReactNode }[] })`: lista com linhas finas, em duas colunas acima de 820px; o `anchor` vira o `id` do item
  - `Roadmap({ plan }: { plan: ShownPlanId })`: `id="roadmap"`, os planejados do plano com `Badge status="planned"`
  - `PlanCompare({ plan })`: `id="compare"`, título e `CompareTable highlight={plan}`
  - `PlanClosing({ plan })`
  - `TriedBar()`: cliente, dentro de `<Suspense>`; lê `useSearchParams().get("tried")`. Com valor válido, mostra a barra fixa logo abaixo do menu, com:
    - "Você tentou usar {feature}. Ele é do Pro."
    - o preço
    - `SubscribeButton plan="pro"`
    - "Já assina? Entre com a mesma conta no app, em Configurações › Conta."
    - o botão fechar
  - Enquanto a barra está aberta, a página ganha `--tried-bar` (altura) e os `h2` de seção usam `scroll-margin-top: calc(var(--nav-height) + var(--tried-bar, 0px) + 24px)`. Sem hash no endereço, a barra rola até `#<anchor>`.
  - Mensagens: `plans.common.{comparePlans, compareTitle, alsoTitle, roadmapTitle, roadmapBody, tried.{text, already, close}}` e `plans.pro.{meta.{title, description}, hero.{title, body}, sections.<anchor>.{title, body, diff, link}, alsoTitle, faq.items[], closing.{title, body}}`.

- [ ] **Step 1: Escrever o teste que falha** `tests/tried.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { triedAnchor, triedFeatureId } from "../src/lib/tried";

describe("arriving from the app", () => {
  it("accepts the five Pro anchors", () => {
    expect(triedAnchor("queue")).toBe("queue");
    expect(triedAnchor("restore-points")).toBe("restore-points");
    expect(triedFeatureId("accounts")).toBe("accountRotation");
    expect(triedFeatureId("worktree")).toBe("worktrees");
  });

  it("ignores anything else", () => {
    for (const v of [null, undefined, "", "QUEUE", " queue", "license", "billing", "growth", "queue,verify", "__proto__", "toString"]) expect(triedAnchor(v), String(v)).toBeNull();
  });
});
```

- [ ] **Step 2: Rodar e ver falhar.** `pnpm vitest run tests/tried.test.ts`. Esperado: FAIL (módulo não existe).
- [ ] **Step 3: Implementar `src/lib/tried.ts`** com comparação exata contra `TRIED`, usando `includes`. Nada de busca em objeto, para `__proto__` não passar.
- [ ] **Step 4: Rodar.** Esperado: PASS.
- [ ] **Step 5: Construir as peças e a página `/pro`.**
  - Carregue `impeccable:impeccable`.
  - Ordem da página: `TriedBar`, `PlanHero`, `PlanSection` × 5 (âncoras `accounts`, `queue`, `restore-points`, `verify`, `worktree`, cada uma com a janela da Tarefa 4 e o link para o trecho do doc em `/docs/pro` ou `/docs/ai-accounts`), `AlsoList` com `license`, `Roadmap`, `PlanCompare`, `FaqSection` (`plans.pro.faq.items`) e `PlanClosing`.
  - `generateMetadata` com `alternatesFor(locale, "/pro")`.
  - Textos nos três idiomas, com o problema antes da solução e o "no grátis / no Pro" em uma linha.
- [ ] **Step 6: Verificar.**
  - `pnpm lint && pnpm vitest run && pnpm build`.
  - Com `pnpm start -p 3200`, capture `/pro`, `/pro?tried=queue#queue`, `/pro?tried=nada` e `/en/pro?tried=verify#verify`.
  - Esperado: o título "Fila de pedidos" visível abaixo da barra, no desktop e no celular. Nenhuma barra com `nada`. Inglês correto.
- [ ] **Step 7: Commit.** `git commit -m "feat(pro): a page for Pro, one section per feature, and a bar for people sent by the app"`

### Task 7: Página `/free`

**Files:**
- Create: `src/app/[locale]/free/page.tsx`
- Modify: `messages/*/plans.json` (`plans.free.*`)

**Interfaces:**
- Consumes: peças da Task 6; janelas `CrashDemo`, `ProjectsWindow`, `StatesWindow`, `EditorWindow` e `NetworkMock` (dentro de `Window`, como na home).

- [ ] **Step 1: Construir a página.**
  - `PlanHero plan="free"` (a ação é baixar).
  - `PlanSection` × 5, nas âncoras `recovery`, `projects`, `states`, `editor` e `privacy`.
  - `AlsoList` "Também no grátis", com `usage`, `git`, `notifications`, `voice`, `issues`, `agents` e `offline`.
  - `Roadmap`, `PlanCompare plan="free"`, perguntas e fecho.
  - Sem `TriedBar`.
  - Textos nos três idiomas. Windows e Linux aparecem como prévia onde forem citados.
- [ ] **Step 2: Verificar.** `pnpm lint && pnpm vitest run && pnpm build`. Capture `/free` e `/es/free` e confira que cada âncora da lista existe: `document.getElementById(a)` para todas as âncoras do Grátis, executado pelo script com `evaluate`.
- [ ] **Step 3: Commit.** `git commit -m "feat(free): a page for the free plan"`

### Task 8: Página `/team` e a réplica do painel do time

**Files:**
- Create: `src/app/[locale]/team/page.tsx`, `src/components/mockups/TeamBillingMock.tsx`
- Modify: `messages/*/plans.json` (`plans.team.*`), `messages/*/mock.json` (`mock.teamBilling.*`)

**Interfaces:**
- Consumes: peças da Task 6; `findFeature`/`featureHref` (Task 1).
- Produces: `TeamBillingMock()`, uma réplica do painel Time de Minha conta (assentos, pessoas com papel, convite por e-mail, "Copiar link do convite") num quadro com o rótulo "persisty.app · Minha conta · Time". Vai dentro de `Window` com `designWidth={860}`.

- [ ] **Step 1: Construir a página.**
  - `PlanHero plan="team"`.
  - Seção "Tudo do Pro para cada pessoa", com `id="pro"`: uma `AlsoList` com os cinco recursos Pro, cada um levando a `featureHref("pro", f)`.
  - `PlanSection id="billing"` com `TeamBillingMock`.
  - `PlanSection id="privacy"`, com o texto "metadados, nunca código" da home e sem janela.
  - `Roadmap plan="team"`, `PlanCompare plan="team"`, perguntas (a de Team que hoje está em Preços, mais assentos e convite) e fecho.
  - A observabilidade de gestão é descrita por projeto e por PR, e a promessa "sem métrica individual de produtividade" aparece.
- [ ] **Step 2: Verificar.** `pnpm lint && pnpm vitest run && pnpm build`. Capture `/team` e `/en/team`. Clique em "Assinar o Team" pelo script: o formulário de nome e assentos tem de aparecer.
- [ ] **Step 3: Commit.** `git commit -m "feat(team): a page for Team, with the team panel it buys"`

### Task 9: Menu "Funcionalidades" por plano

**Files:**
- Create: `src/components/site/FeaturesMenu.tsx`, `src/components/site/FeaturesMenu.module.css`
- Modify: `src/components/site/Nav.tsx`, `Nav.module.css`, `MobileMenu.tsx`, `MobileMenu.module.css`, `src/components/site/Footer.tsx` ("Funcionalidades" → `/pro`, e links para Grátis, Pro e Team)
- Modify: `messages/*/nav.json` (`menu.{free,pro,team}.{line, seeAll, featuredTitle, featuredBody}`), `messages/*/footer.json`

**Interfaces:**
- Consumes: `SHOWN_PLANS`, `MENU_FEATURES`, `featureHref`, `planPath` (Task 1); `Glimpse` e `FEATURE_ICONS` (Task 5).
- Produces:
  - `interface MenuItem { href: string; name: string; line: string; icon: ReactNode; badge?: ReactNode }`
  - `interface MenuPlan { id: ShownPlanId; name: string; line: string; href: string; seeAll: string; items: MenuItem[]; featured: { title: string; body: string; href: string; glimpse: ReactNode } }`
  - `FeaturesMenu({ label, plans }: { label: string; plans: MenuPlan[] })`: cliente, adaptado de `~/Documents/Projetos/KoraPoker/kora-poker-landingpage/src/site/componentes/mega-menu.tsx`, com o mesmo comportamento: tablist vertical, uma parada de Tab, setas, Home e End, hover troca, Esc fecha e devolve o foco, clique fora fecha. Acrescenta: fecha quando `usePathname()` muda e quando a janela cai abaixo de 1000px. Os links usam `Link` de `@/i18n/navigation`. O HTML de todos os planos vai pronto do servidor (`hidden` nos inativos).
  - `MobileMenu` ganha `groups?: { label: string; plans: { name: string; href: string; items: { href: string; label: string }[] }[] }[]`, que vira um grupo "Funcionalidades" com um `<details>` por plano.
  - O destaque de cada plano: Grátis `recovery`, Pro `accountRotation`, Team `teamBilling`.

- [ ] **Step 1:** Carregue `impeccable:impeccable`. Construa o menu com o visual do DESIGN.md (painel com a sombra de popover, porque flutua; linhas finas; o plano selecionado marcado pelo fundo um passo mais claro e pelo texto branco, sem barra lateral colorida; selo "Planejado" nos itens planejados).
- [ ] **Step 2: Verificar.**
  - `pnpm lint && pnpm vitest run && pnpm build`.
  - Com `pnpm start -p 3200`, um roteiro em `scripts/shots/menu.mjs`:
    - clica em "Funcionalidades" e captura
    - manda ArrowDown e confirma `aria-selected` no Pro
    - manda Escape e confirma que o foco voltou ao botão (`document.activeElement`)
    - captura em 390px com o menu do celular aberto e o grupo do Pro expandido
  - Esperado: as quatro verificações passam e as capturas mostram os três planos.
- [ ] **Step 3: Commit.** `git commit -m "feat(nav): the features menu, split by plan"`

### Task 10: Minha conta em painel (estrutura, rotas e partes movidas)

**Files:**
- Create: `src/lib/account.ts`, `tests/account.test.ts`
- Create: `src/components/account/AccountProvider.tsx`, `AccountShell.tsx`, `AccountNav.tsx`
- Create, em `src/components/account/panels/`:
  - `BillingPanel.tsx`
  - `TeamPanel.tsx`
  - `DevicesPanel.tsx`
  - `NotifyPanel.tsx`
- Create: `src/app/[locale]/account/layout.tsx`, e as páginas `billing/page.tsx`, `team/page.tsx`, `devices/page.tsx` e `notifications/page.tsx` dentro de `account/`
- Modify: `src/app/[locale]/account/page.tsx` (visão geral provisória: `BillingPanel` até a Task 11), `src/components/account/account.module.css`
- Delete: `src/components/account/AccountView.tsx`
- Modify: `messages/*/auth.json` (`account.nav.{overview,billing,team,devices,notifications,label}`, `account.team.none`)
- Modify: `scripts/e2e/account.mjs`, `scripts/e2e/billing.mjs` (caminhos e textos novos)

**Interfaces:**
- Produces:
  - `type AccountSection = "overview" | "billing" | "team" | "devices" | "notifications"`
  - `const SECTION_PATH: Record<AccountSection, string>`: `/account`, `/account/billing`, `/account/team`, `/account/devices`, `/account/notifications`
  - `function accountSections(billing: BillingState | null): AccountSection[]`: `team` só com `teams.length > 0 || lapsedTeams.length > 0`
  - `function subscribeOptions(plan: PlanId): PaidPlan[]`: free → `["pro", "team"]`, pro → `["team"]`, team e enterprise → `[]`
  - `function signInPath(pathname: string, intentQuery: string): string`: `/sign-in?next=<pathname codificado>` mais `&` e o intent sem `?`. `pathname` vem sem o prefixo de idioma (`usePathname` de `@/i18n/navigation`).
  - `useAccount(): AccountContext`, em que `AccountContext = { user: User; meta: Record<string, unknown>; billing: BillingState | null; devices: Device[]; notice: CheckoutNotice | null; loadFailed: boolean; status: { ok: boolean; text: string } | null; setStatus; save(next: Record<string, unknown>): Promise<void>; reloadBilling(): Promise<void>; manage(which: "plan" | "personal"): Promise<void>; opening: "plan" | "personal" | null; removeDevice(id: string): Promise<void>; signOut(): Promise<void> }`. Toda a lógica de carregar, aplicar o intent, esperar o plano depois do checkout, abrir o portal e voltar do bfcache sai de `AccountView` sem mudar de comportamento.

- [ ] **Step 1: Escrever o teste que falha** `tests/account.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { accountSections, signInPath, subscribeOptions } from "../src/lib/account";
import { FREE, type BillingState, type Team } from "../src/lib/billing";

const state = (over: Partial<BillingState> = {}): BillingState => ({ entitlement: FREE, subscription: null, manages: false, personal: null, teams: [], lapsedTeams: [], failed: false, ...over });
const team = { id: "t1", name: "Produto", role: "member", portal: false, seats: null, members: [], invites: [], subscription: { org_id: "t1", plan: "team", status: "active", seats: 3, current_period_end: null, cancel_at_period_end: false, stripe_subscription_id: "sub_1" } } as Team;

describe("account panel", () => {
  it("shows Time only to people with a team, current or lapsed", () => {
    expect(accountSections(state())).toEqual(["overview", "billing", "devices", "notifications"]);
    expect(accountSections(state({ teams: [team] }))).toContain("team");
    expect(accountSections(state({ lapsedTeams: [{ id: "t2", name: "Antigo", members: 2 }] }))).toContain("team");
    expect(accountSections(null)).toEqual(["overview", "billing", "devices", "notifications"]);
  });

  it("never offers the plan you already have", () => {
    expect(subscribeOptions("free")).toEqual(["pro", "team"]);
    expect(subscribeOptions("pro")).toEqual(["team"]);
    expect(subscribeOptions("team")).toEqual([]);
  });

  it("comes back to the part of the account you asked for", () => {
    expect(signInPath("/account/devices", "")).toBe("/sign-in?next=%2Faccount%2Fdevices");
    expect(signInPath("/account", "?notify=mac")).toBe("/sign-in?next=%2Faccount&notify=mac");
  });
});
```

- [ ] **Step 2: Rodar e ver falhar.** `pnpm vitest run tests/account.test.ts`. Esperado: FAIL (módulo não existe).
- [ ] **Step 3: Implementar `src/lib/account.ts`.** Rodar de novo. Esperado: PASS.
- [ ] **Step 4: Montar o painel.**
  - `layout.tsx` (servidor): o contêiner, depois `<Suspense>`, depois `<AccountProvider><AccountShell>{children}</AccountShell></AccountProvider>`.
  - `AccountShell`: cabeçalho (título, e-mail, Sair), avisos (erro, checkout), `AccountNav` e o conteúdo, em duas colunas acima de 900px (menu de cerca de 220px). Abaixo de 900px, o menu vira abas no topo que rolam de lado.
  - `AccountNav`: `Link` com `aria-current="page"` no item atual e "n de 5" em Dispositivos.
  - Partes:
    - `BillingPanel`: o bloco Plano de hoje, a assinatura pessoal e o assinar, com os botões de `subscribeOptions`.
    - `TeamPanel`: Times de hoje, ou, sem time, `account.team.none` com link para `/team`.
    - `DevicesPanel` e `NotifyPanel`: como hoje.
  - As páginas são servidor, com `generateMetadata` (`robots: { index: false }`) e o painel cliente dentro.
  - `safeNext` já aceita `/account/...`: confira em `tests/auth.test.ts` e acrescente `expect(safeNext("/account/devices")).toBe("/account/devices")`.
  - Atualize os scripts e2e para os caminhos novos. Eles só rodam com `SECRET`, então rodar fica para a Tarefa 13.
- [ ] **Step 5: Verificar.** `pnpm lint && pnpm vitest run && pnpm build`. A build lista `/[locale]/account/{billing,team,devices,notifications}`.
- [ ] **Step 6: Commit.** `git commit -m "feat(account): a panel with its own address for each part"`

### Task 11: Visão geral de Minha conta

**Files:**
- Create: `src/components/account/panels/Overview.tsx`, `src/components/account/panels/overview.module.css`
- Modify: `src/lib/account.ts`, `tests/account.test.ts`, `src/app/[locale]/account/page.tsx`
- Modify: `messages/*/auth.json` (`account.overview.*`)

**Interfaces:**
- Consumes: `useAccount()` (Task 10); catálogo (Task 1); `Glimpse`/`hasGlimpse`/`FEATURE_ICONS` (Task 5); `SubscribeButton`; `formatPlanPrice`.
- Produces:
  - `function unlockedFor(plan: PlanId): { plan: ShownPlanId; features: PlanFeature[] }[]`: só os disponíveis. free → `[]`; pro → `[{ plan: "pro", … }]`; team → `[{ plan: "pro" }, { plan: "team" }]`; enterprise → como team.
  - `function upsellFor(plan: PlanId): "pro" | "team" | null`: free → `"pro"`, pro → `"team"`, os demais → `null`.

- [ ] **Step 1: Escrever os testes que falham** (acrescentar a `tests/account.test.ts`):

```ts
it("unlocks what the plan pays for, never Growth", () => {
  expect(unlockedFor("free")).toEqual([]);
  expect(unlockedFor("pro").map((g) => g.plan)).toEqual(["pro"]);
  expect(unlockedFor("pro")[0].features.map((f) => f.id)).toEqual(["accountRotation", "requestQueue", "restorePoints", "verifyOnFinish", "worktrees", "offlineLicense"]);
  expect(unlockedFor("team").map((g) => g.plan)).toEqual(["pro", "team"]);
  expect(unlockedFor("team").flatMap((g) => g.features).some((f) => f.status !== "available" || f.id === "growth")).toBe(false);
});

it("invites one step up", () => {
  expect(upsellFor("free")).toBe("pro");
  expect(upsellFor("pro")).toBe("team");
  expect(upsellFor("team")).toBeNull();
});
```

- [ ] **Step 2: Rodar e ver falhar.** Implementar. Rodar de novo. Esperado: PASS.
- [ ] **Step 3: Construir a visão geral.**
  - Carregue `impeccable:impeccable` e releia os anti-objetivos do spec ("parecer feito por IA").
  - Ordem:
    1. **O plano:** nome no tamanho de título de página; estado com Badge e palavra (ativo, termina em, pagamento pendente); preço; data; "Gerenciar assinatura" ou "Ver planos". Num painel raso, sem degradê.
    2. **O que o seu plano libera:** um painel com linhas finas e uma linha por recurso de `unlockedFor`. Cada linha tem o `Glimpse` à esquerda quando `hasGlimpse`, senão o ícone; depois nome, `features.<id>.line` e `features.<id>.where`; e "Como usar ›" com `featureHref`.
    3. **Vem aí no {plano}:** os planejados, com o selo.
    4. **Convite:**
       - grátis: as linhas dos recursos Pro como "O que você ganha com o Pro" e `SubscribeButton plan="pro"` com o preço
       - Pro: o que o Team acrescenta, o preço por pessoa e "Conhecer o Team" (`/team`)
       - Team: nada
  - Membro de time que não gerencia vê o plano do time, sem botão de gerenciar, como hoje.
- [ ] **Step 4: Verificar.**
  - `pnpm lint && pnpm vitest run && pnpm build`.
  - Para ver o painel com sessão: se `supabase projects api-keys --project-ref ytmpopebhdtnucdznfsz --reveal` funcionar neste computador, rode `SECRET=<chave> node scripts/e2e/account.mjs http://localhost:3200 <scratchpad>/shots/t11` (o script cria e apaga uma conta descartável) e confira as capturas.
  - Se não funcionar, registre que a verificação com sessão ficou pendente e peça a chave ao usuário na entrega. Nunca escreva a chave em arquivo.
- [ ] **Step 5: Commit.** `git commit -m "feat(account): an overview that shows what the plan unlocks"`

### Task 12: Endereços, documentos do projeto e limpeza

**Files:**
- Modify: `src/app/sitemap.ts` (`PAGES` ganha `"/free"`, `"/pro"`, `"/team"`)
- Modify: `PRODUCT.md`:
  - preços US$ 4.90 e US$ 9.90
  - Stripe ligado
  - Enterprise escondido
  - páginas de plano
  - recursos da 0.8.0 e 0.9.0 e o roteiro, com "planejado"
  - Growth como prévia
- Modify: `DESIGN.md` (menu por plano, páginas de plano, barra de quem veio do app, painel de Minha conta, recortes)
- Test: `tests/seo.test.ts`

- [ ] **Step 1: Teste** em `tests/seo.test.ts`: `it("lists the plan pages in the sitemap")`, verificando que `sitemap()` contém `${SITE_URL}/pro`, `${SITE_URL}/en/free` e `${SITE_URL}/es/team`.
- [ ] **Step 2: Rodar e ver falhar. Implementar. Rodar de novo.** Esperado: PASS.
- [ ] **Step 3: Atualizar `PRODUCT.md` e `DESIGN.md`.** Rode `/impeccable document` se a skill pedir para atualizar `.impeccable/design.json`.
- [ ] **Step 4: Commit.** `git commit -m "docs: product and design notes for the plan pages and the account panel"`

### Task 13: Verificação final e comparação antes/depois

**Files:**
- Create: `scripts/shots/compare.mjs` (roda `pages.mjs` contra duas URLs e monta `<out>/index.html`, com as capturas "antes" e "depois" lado a lado por página e largura)

- [ ] **Step 1: Rodar tudo.** `pnpm lint && pnpm vitest run && pnpm build`. Esperado: tudo PASS. Cole a saída resumida na entrega.
- [ ] **Step 2: Montar o "antes".**
  - `git worktree add <scratchpad>/before main` e `pnpm install --frozen-lockfile` nesse worktree.
  - Depois `pnpm build && pnpm start -p 3100` lá, e `pnpm start -p 3200` no branch.
- [ ] **Step 3: Capturar.**
  - Rode `node scripts/shots/compare.mjs http://localhost:3100 http://localhost:3200 <scratchpad>/shots/final` com as páginas:
    - antes e depois: `/`, `/pricing`, `/en/pricing`
    - só depois: `/pro`, `/pro?tried=queue#queue`, `/free`, `/team`
  - Inclua também o menu aberto (`scripts/shots/menu.mjs`) e Minha conta, se houver `SECRET`.
  - Encerre os servidores e remova o worktree (`git worktree remove`).
- [ ] **Step 4: Revisão do branch inteiro** por um revisor novo (superpowers:requesting-code-review). Corrija o que ele bloquear.
- [ ] **Step 5: Entregar ao usuário.** Inclua o caminho completo do `index.html` da comparação, os textos em pt-BR das páginas novas para aprovar, o que ficou pendente (por exemplo, a captura de Minha conta sem `SECRET`) e a pergunta de publicação.
  - Nada de push sem o ok dele.
  - Só depois do ok, mande à sessão do app (SendMessage para `uds:/tmp/cc-socks/96959.sock`) os endereços: `https://persisty.app[/en|/es]/pro?tried=<accounts|queue|restore-points|verify|worktree>#<o mesmo>` e `/account`, `/account/billing`, `/account/team`, `/account/devices` e `/account/notifications`.
