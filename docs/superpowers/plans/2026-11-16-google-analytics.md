# Google Analytics com consentimento — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** medir o persisty.app no Google Analytics só depois de a pessoa clicar em "Aceitar" num aviso de cookies.

**Architecture:**
- **Dois módulos puros e testáveis:**
  - `src/lib/consent.ts`: a escolha e os cookies;
  - `src/lib/analytics.ts`: o endereço limpo, os eventos e o gtag sobre uma janela injetável.
- **Um componente cliente no layout** (`Analytics`). Ele:
  - mostra o aviso;
  - carrega o gtag só com a escolha `granted`;
  - manda um `page_view` por endereço;
  - escuta os cliques de download.
- **Os outros eventos** saem dos componentes que já existem: login, assinatura e Minha conta.

**Tech Stack:** Next 16 (App Router, páginas estáticas), next-intl 4, React 19, vitest (ambiente `node`, só `tests/**/*.test.ts`), CSS Modules, Lucide.

**Spec:** `docs/superpowers/specs/2026-11-16-google-analytics-design.md`

## Global Constraints

- **Nenhuma requisição ao Google antes do "Aceitar"**, nem o download do `gtag.js`. Nada de Consent Mode "avançado".
- **"Recusar" e "Aceitar" iguais:** `buttonClass("secondary", "md")` nos dois, lado a lado.
- **Cookie da escolha:** `persisty_consent` = `granted` | `denied`, `max-age=31536000`, `path=/`, `SameSite=Lax`, `Secure` só em https.
- **`gtag('config')`:** `{ send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 34128000 }`.
- **Parâmetros liberados no endereço:** `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `utm_id`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `ref`. Sem hash. `page_referrer` leva só a origem.
- **Só mede em produção:** `VERCEL_ENV === "production"` (lido no build) e o ID existe. Fora disso, nem aviso nem link "Cookies".
- **Eventos:**
  - `download` `{platform, kind, version}`;
  - `sign_up` | `login` `{method: "email"}`;
  - `begin_checkout` `{plan}`;
  - `checkout_done` `{plan?}`.
  - Nunca e-mail, nome, id de usuário ou texto digitado.
- **Nenhuma página fica dinâmica:** nada de `headers()` ou `cookies()` no servidor.
- **Textos:** `messages/{pt-BR,en,es}` e `content/legal/{pt-BR,en,es}/privacy.md`. `tests/messages.test.ts` e `tests/copy.test.ts` continuam verdes. Copy curta e direta.
- **`DESIGN.md`:** site só escuro, Lucide (sem emoji), 180ms `cubic-bezier(0.16, 1, 0.3, 1)`, movimento reduzido respeitado.
- **Antes de usar `next/script`,** ler `node_modules/next/dist/docs/01-app/02-guides/third-party-libraries.md` e `…/01-app/03-api-reference/02-components/script.md` (AGENTS.md).
- **Ferramentas:**
  - `export PATH="$HOME/.nvm/versions/node/v24.18.0/bin:$PATH"`;
  - rodar `node_modules/.bin/{vitest,tsc,eslint,next}` (pnpm não funciona nesta máquina);
  - trabalhar só no worktree `.superpowers/worktrees/google-analytics`, branch `feat/google-analytics`.
- **Commits** terminam com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Cookie `persisty_consent` com valor estranho** (versão antiga, editado à mão) → conta como "sem escolha", e o aviso aparece. Teste na Task 2.
2. **Revogar em `www.persisty.app` ou em `localhost`** → apaga `_ga`/`_ga_*` sem atributo de domínio e com `domain=.persisty.app`. Em `localhost` e IP, sem domínio. Teste na Task 2.
3. **`replaceState` do `?checkout=done`, hash de docs ou troca só de parâmetro não liberado** → nenhum `page_view` repetido (dedupe pelo endereço limpo). Teste na Task 3.
4. **Bloqueador de anúncios derruba o `gtag.js`** → `track` e `pageView` não lançam erro, o aviso continua funcionando. Teste na Task 3.
5. **Aceitar → Recusar → Aceitar na mesma página** → a flag `ga-disable-<ID>` vai a `true` e volta a `false`, e o `page_view` volta a sair. Teste na Task 3.

---

### Task 0: Preparar o worktree

- [ ] **Step 1:** clonar as dependências do checkout principal (mesmo `package.json` e lockfile): `cp -cR ../../../node_modules .` a partir do worktree.
- [ ] **Step 2:** linha de base: `node_modules/.bin/vitest run`. Esperado: tudo verde. Anotar o total de testes.

### Task 1: Conta no Google Analytics e o ID no código

**Files:**
- Modify: `src/lib/site.ts`
- Test: `tests/site.test.ts`

**Interfaces:**
- Produces: `GOOGLE_ANALYTICS_ID: string` (o `G-…` real) e `analyticsEnabled(env?: string, id?: string): boolean`, com os padrões `process.env.VERCEL_ENV` e `GOOGLE_ANALYTICS_ID`.

- [ ] **Step 1: criar no GA pelo Chrome** (skill `claude-in-chrome`, aba nova, `analytics.google.com/analytics/web/?authuser=1`):
  - [ ] **Conta "Persisty".** No compartilhamento de dados, só "Suporte técnico" fica marcado.
  - [ ] **Propriedade "Persisty Site".** Fuso (GMT-03:00) São Paulo, moeda Real (BRL). Detalhes do negócio: tecnologia, pequena empresa. Objetivo: tráfego e leads.
  - [ ] **Fluxo web "Persisty Web",** `https://persisty.app`. Em Medição otimizada › engrenagem, desligar só "Alterações de página com base no histórico do navegador".
  - [ ] **Retenção de dados:** 14 meses.
  - [ ] **Google Signals:** desligado.
  - [ ] **Eventos principais › Novo evento principal:** `download`, `sign_up`, `begin_checkout`, `checkout_done`.
  - [ ] **Anotar** o ID `G-…` e os números da conta e da propriedade.
- [ ] **Step 2: escrever os testes que falham** em `tests/site.test.ts`:

```ts
describe("analyticsEnabled", () => {
  it("only in Vercel production with an ID", () => {
    expect(analyticsEnabled("production", "G-ABC123")).toBe(true);
    expect(analyticsEnabled("preview", "G-ABC123")).toBe(false);
    expect(analyticsEnabled(undefined, "G-ABC123")).toBe(false);
    expect(analyticsEnabled("production", "")).toBe(false);
  });
  it("has the Persisty Site measurement ID", () => {
    expect(GOOGLE_ANALYTICS_ID).toMatch(/^G-[A-Z0-9]{6,}$/);
  });
});
```

- [ ] **Step 3:** rodar `node_modules/.bin/vitest run tests/site.test.ts`. Esperado: FAIL (`analyticsEnabled` não existe).
- [ ] **Step 4: implementar em `src/lib/site.ts`.** `GOOGLE_ANALYTICS_ID` leva um comentário com conta, propriedade e fluxo, como o Eu Aqui e o Kora fazem. A função é `analyticsEnabled(env = process.env.VERCEL_ENV, id = GOOGLE_ANALYTICS_ID)`.
- [ ] **Step 5:** rodar o mesmo teste. Esperado: PASS.
- [ ] **Step 6: commit:** `feat(analytics): Persisty Site measurement ID, production only`.

### Task 2: A escolha e os cookies (`src/lib/consent.ts`)

**Files:**
- Create: `src/lib/consent.ts`
- Test: `tests/consent.test.ts`

**Interfaces:**
- Produces:
  - `CONSENT_COOKIE = "persisty_consent"`
  - `OPEN_NOTICE_EVENT = "persisty:cookies"`
  - `type Consent = "granted" | "denied"`
  - `readConsent(cookies: string): Consent | null`
  - `consentCookie(value: Consent, https: boolean): string` (a string para o `document.cookie`)
  - `analyticsCookieNames(cookies: string, measurementId: string): string[]`
  - `expiredCookies(names: string[], host: string): string[]`

- [ ] **Step 1: escrever os testes que falham:**

```ts
it("reads the saved choice", () => {
  expect(readConsent("a=1; persisty_consent=granted")).toBe("granted");
  expect(readConsent("persisty_consent=denied; b=2")).toBe("denied");
});
it("treats a missing or unknown value as no choice", () => {
  expect(readConsent("")).toBeNull();
  expect(readConsent("persisty_consent=maybe")).toBeNull();
  expect(readConsent("xpersisty_consent=granted")).toBeNull();
});
it("keeps the choice a year, Secure only on https", () => {
  expect(consentCookie("granted", true)).toBe("persisty_consent=granted; path=/; max-age=31536000; SameSite=Lax; Secure");
  expect(consentCookie("denied", false)).toBe("persisty_consent=denied; path=/; max-age=31536000; SameSite=Lax");
});
it("finds Google's cookies for this property only", () => {
  expect(analyticsCookieNames("_ga=GA1.1.x; _ga_ABC123=GS1; _ga_OTHER=1; lang=en", "G-ABC123")).toEqual(["_ga", "_ga_ABC123"]);
});
it("expires on the host and on the parent domain", () => {
  expect(expiredCookies(["_ga"], "www.persisty.app")).toEqual([
    "_ga=; path=/; max-age=0",
    "_ga=; path=/; max-age=0; domain=.persisty.app",
  ]);
  expect(expiredCookies(["_ga"], "localhost")).toEqual(["_ga=; path=/; max-age=0"]);
  expect(expiredCookies(["_ga"], "127.0.0.1")).toEqual(["_ga=; path=/; max-age=0"]);
});
```

- [ ] **Step 2:** rodar `node_modules/.bin/vitest run tests/consent.test.ts`. Esperado: FAIL (módulo não existe).
- [ ] **Step 3: implementar.** O domínio pai são os dois últimos rótulos do host. Host sem ponto ou só com números e pontos não leva domínio.
- [ ] **Step 4:** rodar o mesmo teste. Esperado: PASS.
- [ ] **Step 5: commit:** `feat(analytics): the cookie choice and how to clear Google's cookies`.

### Task 3: Endereço limpo, eventos e gtag (`src/lib/analytics.ts`)

**Files:**
- Create: `src/lib/analytics.ts`
- Test: `tests/analytics.test.ts`

**Interfaces:**
- Consumes: `DesktopPlatform` e `FileKind` de `@/lib/releases`.
- Produces:
  - `ALLOWED_PARAMS: readonly string[]` (lista das Global Constraints)
  - `cleanLocation(href: string): string`: origem + caminho + só os parâmetros liberados, na ordem em que vieram, sem hash
  - `cleanReferrer(referrer: string): string`: só a origem; `""` se vazio ou inválido
  - `downloadOf(href: string): { platform: DesktopPlatform; kind: FileKind; version: string } | null`
  - `isNewAccount(createdAt: string | undefined, now?: number): boolean`: criada há 10 minutos ou menos
  - `type AnalyticsEvent`: `{ name: "download"; params: { platform; kind; version } }` | `{ name: "sign_up" | "login"; params: { method: "email" } }` | `{ name: "begin_checkout"; params: { plan: string } }` | `{ name: "checkout_done"; params: { plan?: string } }`
  - `type GtagWindow`: `{ dataLayer?: unknown[]; gtag?: (...a: unknown[]) => void; location: { href: string }; document: { referrer: string }; [flag: string]: unknown }`
  - `startAnalytics(id: string, win?: GtagWindow): void`. Idempotente: cria `dataLayer` e `gtag`, chama `gtag('js', …)` e `gtag('config', id, CONFIG)` uma vez só, e põe `win["ga-disable-"+id] = false`.
  - `stopAnalytics(id: string, win?: GtagWindow): void`: põe `win["ga-disable-"+id] = true` e esquece o último endereço enviado.
  - `pageView(win?: GtagWindow): void`: manda `page_view` com `page_location` e `page_referrer` limpos, só se o endereço limpo mudou desde o último envio.
  - `track(event: AnalyticsEvent, win?: GtagWindow): void`: só com `win.gtag` definido; o `page_location` limpo vai junto.
  - O `win` padrão é `window` quando existe.

- [ ] **Step 1: escrever os testes que falham.** Use uma janela falsa: `{ location: { href }, document: { referrer } }`, com `gtag` que grava as chamadas.

```ts
it("keeps only campaign parameters and drops the hash", () => {
  expect(cleanLocation("https://persisty.app/en/docs/x?utm_source=a&next=%2Faccount&gclid=g#h")).toBe("https://persisty.app/en/docs/x?utm_source=a&gclid=g");
  expect(cleanLocation("https://persisty.app/sign-in?next=%2Faccount&interest=enterprise")).toBe("https://persisty.app/sign-in");
});
it("sends only the referrer's origin", () => {
  expect(cleanReferrer("https://www.google.com/search?q=persisty")).toBe("https://www.google.com");
  expect(cleanReferrer("")).toBe("");
});
it("knows each installer from its URL", () => {
  const base = "https://github.com/abalad/persisty-releases/releases/download/v0.13.0/";
  expect(downloadOf(base + "Persisty_0.13.0_universal.dmg")).toEqual({ platform: "mac", kind: "dmg", version: "0.13.0" });
  expect(downloadOf(base + "Persisty_0.13.0_x64-setup.exe")).toEqual({ platform: "windows", kind: "nsis", version: "0.13.0" });
  expect(downloadOf(base + "Persisty_0.13.0_amd64.AppImage")).toEqual({ platform: "linux", kind: "appimage", version: "0.13.0" });
  expect(downloadOf(base + "Persisty_0.13.0_amd64.deb")).toEqual({ platform: "linux", kind: "deb", version: "0.13.0" });
  expect(downloadOf("https://persisty.app/download")).toBeNull();
});
it("calls an account new for ten minutes", () => {
  const now = Date.parse("2026-11-16T12:00:00Z");
  expect(isNewAccount("2026-11-16T11:55:00Z", now)).toBe(true);
  expect(isNewAccount("2026-11-16T11:49:00Z", now)).toBe(false);
  expect(isNewAccount(undefined, now)).toBe(false);
});
it("configures gtag once, without signals and without the automatic page view", () => { /* startAnalytics twice → one 'config' with exactly the CONFIG of Global Constraints */ });
it("one page_view per clean address", () => { /* pageView; same href with ?checkout=done → no new call; another path → new call; page_location is clean */ });
it("does nothing and never throws before consent or when gtag.js was blocked", () => { /* track/pageView on a window without gtag → no throw, no dataLayer */ });
it("stop then start again turns the disable flag off and sends the next page view", () => { /* stopAnalytics → flag true; startAnalytics → false; pageView sends again for the same address */ });
it("events carry their params and the clean location, never anything else", () => { /* track begin_checkout {plan:"pro"} → gtag('event','begin_checkout',{plan:'pro',page_location:clean}) */ });
```

- [ ] **Step 2:** rodar `node_modules/.bin/vitest run tests/analytics.test.ts`. Esperado: FAIL.
- [ ] **Step 3: implementar.** `downloadOf` lê `/releases/download/v<versão>/<arquivo>` e decide pela terminação:
  - `.dmg` → mac/dmg;
  - `-setup.exe` → windows/nsis;
  - `.AppImage` → linux/appimage;
  - `.deb` → linux/deb.
  - O último endereço enviado fica numa variável do módulo, guardada por janela, num `WeakMap`.
- [ ] **Step 4:** rodar o mesmo teste. Esperado: PASS.
- [ ] **Step 5: commit:** `feat(analytics): clean addresses, events and the gtag behind consent`.

### Task 4: Textos do aviso e do rodapé

**Files:**
- Create: `messages/{pt-BR,en,es}/consent.json`
- Modify:
  - `messages/{pt-BR,en,es}/footer.json` (chave `cookies`)
  - `src/i18n/messages.ts` (`"consent"` em `NAMESPACES`)
  - `src/app/[locale]/layout.tsx` (`clientMessages` passa `consent`)
- Test: `tests/messages.test.ts` (já cobre paridade e arquivos)

**Interfaces:**
- Produces: as chaves do namespace `consent`:
  - `label` ("Aviso de cookies" / "Cookie notice" / "Aviso de cookies");
  - `text`, `privacy`, `decline` e `accept`, com o texto exato da tabela do spec;
  - mais `footer.cookies` = "Cookies".

- [ ] **Step 1:** criar os três `consent.json` e a chave `footer.cookies`. Registrar o namespace e passá-lo ao cliente.
- [ ] **Step 2:** rodar `node_modules/.bin/vitest run tests/messages.test.ts tests/copy.test.ts`. Esperado: PASS.
- [ ] **Step 3: commit:** `copy(analytics): the cookie notice in three languages`.

### Task 5: O aviso, o GA no layout e o "Cookies" no rodapé

**Files:**
- Create:
  - `src/components/site/Analytics.tsx` (cliente)
  - `src/components/site/CookieNotice.tsx` + `CookieNotice.module.css`
  - `src/components/site/CookieSettingsButton.tsx` (cliente)
- Modify:
  - `src/components/site/Footer.tsx` + `Footer.module.css`
  - `src/app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: Tasks 1 a 4.
- Produces:
  - `<Analytics measurementId={string} />`, montado pelo layout só quando `analyticsEnabled()`;
  - `<Footer analytics={boolean} />`;
  - `<CookieSettingsButton label={string} className?={string} />`, que dispara `OPEN_NOTICE_EVENT` na `window`.

- [ ] **Step 1: ler os dois guias do Next** listados nas Global Constraints.
- [ ] **Step 2: `CookieNotice`** recebe `{ onChoice(c: Consent): void }` e segue o esboço do spec:
  - região fixa no pé, `role="region"` com `aria-label={t("label")}`, ícone `Cookie` do Lucide;
  - o texto mais o `Link` para `/privacy`;
  - "Recusar" e depois "Aceitar", os dois `buttonClass("secondary","md")`;
  - abaixo de 640px, os botões dividem a largura;
  - sobe em 180ms com a curva do DESIGN; sem animação com movimento reduzido;
  - painel elevado com linha fina, canto de 14px e a largura do `.container`, sem sombra de página.
- [ ] **Step 3: `Analytics`** guarda o estado `"unknown" | Consent | null`:
  - **ao montar:** lê `readConsent(document.cookie)` e escuta `OPEN_NOTICE_EVENT`, que volta o estado a `null`.
  - **com `null`:** mostra o `CookieNotice`.
  - **na escolha:** grava `consentCookie(c, location.protocol === "https:")`.
    - Se `denied` vier depois de `granted`: `stopAnalytics(id)` e grava cada `expiredCookies(analyticsCookieNames(document.cookie, id), location.hostname)`.
  - **com `granted`:**
    - renderiza `<Script src={"https://www.googletagmanager.com/gtag/js?id="+id} strategy="lazyOnload" />`;
    - monta `<PageViews id={id} />` dentro de `<Suspense fallback={null}>`. O `PageViews` lê `usePathname()` e `useSearchParams()`, e num efeito chama `startAnalytics(id)` e depois `pageView()`.
- [ ] **Step 4: rodapé.** O `Footer` recebe `analytics`. Com `true`, a coluna "Aprender" ganha, depois de "Privacidade", um `<li>` com `CookieSettingsButton` (`label={t("cookies")}`). O CSS do botão imita `.col a`: sem fundo, sem borda e a mesma fonte. O layout passa `analyticsEnabled()` ao `Footer` e monta `<Analytics measurementId={GOOGLE_ANALYTICS_ID} />` quando for `true`.
- [ ] **Step 5: verificar:**
  - `node_modules/.bin/tsc --noEmit`;
  - `node_modules/.bin/eslint src`;
  - `node_modules/.bin/next build`: as páginas `[locale]` continuam `●` (SSG) na tabela final.
  - Esperado: os três sem erro.
- [ ] **Step 6: commit:** `feat(analytics): the cookie notice, Google Analytics after Accept, Cookies in the footer`.

### Task 6: Os eventos

**Files:**
- Modify:
  - `src/components/site/Analytics.tsx` (download)
  - `src/components/account/SignInForm.tsx:64-75` (sign_up/login)
  - `src/components/site/SubscribeButton.tsx:56-70` (begin_checkout)
  - `src/components/account/AccountProvider.tsx:135-150` (checkout_done)

**Interfaces:**
- Consumes: `track`, `downloadOf` e `isNewAccount` (Task 3).

- [ ] **Step 1: download.** No `Analytics` com `granted`, um ouvinte de `click` em `document` (fase de captura). Ele pega `(e.target as Element).closest("a[href]")` e, se `downloadOf(a.href)` der certo, chama `track({ name: "download", params })`. O ouvinte sai quando o estado muda.
- [ ] **Step 2: login.** No `verify`, usar `const { data, error: err } = await …verifyOtp(…)`. Sem erro, `track({ name: isNewAccount(data.user?.created_at) ? "sign_up" : "login", params: { method: "email" } })` antes do `router.replace`.
- [ ] **Step 3: checkout.** No `start`, quando `result === "checkout"`: `track({ name: "begin_checkout", params: { plan } })`.
- [ ] **Step 4: assinatura concluída.** No bloco de `?checkout=done`, depois do laço de espera, uma vez só: `track({ name: "checkout_done", params: latest.entitlement.plan !== "free" ? { plan: latest.entitlement.plan } : {} })`.
- [ ] **Step 5: verificar:** `node_modules/.bin/vitest run`, `tsc --noEmit` e `eslint src`. Esperado: tudo verde.
- [ ] **Step 6: commit:** `feat(analytics): download, sign-up, checkout and subscription events`.

### Task 7: Política de privacidade

**Files:**
- Modify: `content/legal/{pt-BR,en,es}/privacy.md` (`updated: 2026-11-16` e a seção "No site" / "On the website" / "En el sitio")
- Test: `tests/copy.test.ts`

- [ ] **Step 1: escrever o teste que falha:**

```ts
it("the privacy policy says Google Analytics runs only after Accept, and how to change it", () => {
  const consent = { "pt-BR": /só se você aceitar/, en: /only if you accept/, es: /solo si aceptas/ } as const;
  for (const locale of routing.locales) {
    const text = readFileSync(`content/legal/${locale}/privacy.md`, "utf8");
    expect(text, locale).toMatch(/Google Analytics/);
    expect(text, locale).toMatch(consent[locale]);
    expect(text, locale).toMatch(/persisty_consent/);
    expect(text, locale).toMatch(/_ga/);
    expect(text, locale).not.toMatch(/não usa analytics|uses no analytics|no usa analítica/);
  }
});
```

- [ ] **Step 2:** rodar `node_modules/.bin/vitest run tests/copy.test.ts`. Esperado: FAIL.
- [ ] **Step 3: reescrever a seção** nos três idiomas com os pontos do spec ("Política de privacidade (três idiomas)"):
  - só com "Aceitar";
  - o que mede e o que nunca vai;
  - `_ga`/`_ga_<id>` por até 13 meses, retenção de 14 meses;
  - Google como operador e transferência para os EUA;
  - "Cookies" no rodapé para mudar de ideia;
  - três cookies necessários, incluindo `persisty_consent`.
  - Frases curtas, no tom da página.
- [ ] **Step 4:** rodar `node_modules/.bin/vitest run`. Esperado: tudo verde.
- [ ] **Step 5: commit:** `docs(privacy): Google Analytics only after Accept`.

### Task 8: Prova no navegador e imagens do aviso

**Files:**
- Create: `scripts/e2e/analytics.mjs`. Usa `openBrowser` de `scripts/e2e/lib.mjs`, com `Fetch.enable` nos padrões `*googletagmanager.com*` (continua) e `*google-analytics.com/g/collect*` (responde 204, nunca aborta). Grava a URL e o `postData` de cada pedido.

- [ ] **Step 1: build de produção local.** `VERCEL_ENV=production node_modules/.bin/next build`, depois `lsof -ti tcp:3100 | xargs kill` e `node_modules/.bin/next start -p 3100`.
- [ ] **Step 2: rodar o script em `http://localhost:3100/`.** Esperado: PASS nas cinco provas do spec:
  1. sem escolha → 0 pedidos ao Google e o aviso visível;
  2. "Recusar" → 0 pedidos, mesmo depois de navegar;
  3. "Aceitar" → `gtag/js` baixado e um `page_view` com `dl` limpo. Com `?utm_source=t&next=/x`, o `dl` leva `utm_source` e não leva `next`;
  4. navegar pelo menu → um `page_view` por página, sem repetir;
  5. "Cookies" → "Recusar" → nenhum envio novo depois do clique, e `document.cookie` sem `_ga`.
  - E mais: clicar num link de instalador em `/download` manda `en=download` com `ep.platform`.
- [ ] **Step 3: imagens.** Tirar print do aviso no desktop (1280) e no celular (390) para o usuário, pelo `shot` do `lib.mjs`, gravado no scratchpad.
- [ ] **Step 4: commit:** `test(analytics): browser proof that nothing reaches Google before Accept`.

### Task 9: Publicar (só com o OK do usuário)

- [ ] **Step 1:** mostrar ao usuário as imagens, os textos e o resultado da Task 8, e pedir o OK.
- [ ] **Step 2:** com o OK, fazer `fetch` e avançar a `main` local. Depois, `git merge --no-ff feat/google-analytics` na `main` e push com o token `abalad`, como no `publishing-the-site`.
- [ ] **Step 3:** `vercel inspect <deployment-url> --wait`. Esperado: Ready.
- [ ] **Step 4: conferir no persisty.app pelo Chrome:**
  - o aviso aparece;
  - depois de "Aceitar", a visita surge no Tempo real do GA;
  - um clique de download aparece como `download`.
  - Depois, apagar a escolha desse navegador.
