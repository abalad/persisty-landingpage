# Cancelar em Minha conta: plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Quem gerencia uma assinatura do Stripe cancela em Minha conta num modal de quatro passos (motivo, 25% por 60 dias, 30 dias grátis, confirmar), com o mascote 3D de corpo inteiro reagindo. Inclui "Desfazer cancelamento", reembolso automático nos 7 dias da primeira compra, e os motivos guardados.

**Architecture:**
- **No app** (`persist-application`, worktree `../persist-application-cancel`, branch `feat/cancel-flow` a partir de `origin/main`):
  - uma função Edge `retention`, no padrão handler, testes e `serveBilling`;
  - uma tabela `retention_events`, só para o service role;
  - dois cupons com id fixo, criados pelo `stripe-setup.mjs`.
- **No site** (branch `feat/cancel-flow` a partir de `main`):
  - um cliente em `src/lib/retention.ts`;
  - o modal `CancelFlow` com o mascote `CancelMascot`;
  - a ligação em `BillingPanel`;
  - Termos e Privacidade atualizados.

**Tech Stack:**
- **Cobrança:** Deno 2.7 (`~/.deno/bin/deno`) e a API HTTP do Stripe.
- **Site:** Next.js 16.4, next-intl, three.js 0.186 e vitest.

**Spec:** `docs/superpowers/specs/2026-11-02-cancel-flow-design.md`

## Global Constraints

- **Ferramentas do site:** rodar de `node_modules/.bin` com node v24 no PATH, porque o pnpm está quebrado aqui. Rodar `next typegen` depois de mudar rotas. Três idiomas com as mesmas chaves. Copy sob `tests/copy.test.ts`: nunca prometer nada com o app fechado. Sem prettier. Seguir o DESIGN.md.
- **Testes do app:** `cd <worktree>/supabase/functions && ~/.deno/bin/deno test --allow-env --allow-net --allow-read`, um arquivo por vez se preciso.
- **Pastas:** nunca tocar na pasta de trabalho `../persist-application` (sessão do app); trabalhar só no worktree.
- **Nada de produção sem ok:** nada de deploy de função, migração ou cupom live, nem push em qualquer `main`, sem ok explícito do usuário no momento. Testes contra o Stripe só com a chave de **teste**, lida do Keychain dentro do comando (`security find-generic-password -a persisty -s "Persisty Stripe secret key" -w`) e nunca impressa.
- **Valores fixos:**
  - **Desconto:** 25% em 2 cobranças mensais. Cupom `persisty_retention_25_2m`: `percent_off=25`, `duration=repeating`, `duration_in_months=2`.
  - **Mês grátis:** cupom `persisty_retention_free_month`: `percent_off=100`, `duration=once`.
  - **Janela de reembolso:** 7 dias da primeira compra.
  - **Texto opcional:** até 1000 caracteres.
- **Motivos:** `too_expensive`, `not_using`, `missing_feature`, `problems`, `other_tool`, `other`. No Stripe, `cancellation_details[feedback]` recebe, na mesma ordem, `too_expensive`, `unused`, `missing_features`, `low_quality`, `switched_service`, `other`.
- **Oferta usada:** existe um evento com `outcome` igual a `discount` ou `free_month` para aquela organização (para sempre).

## Review Focus

1. **Duplo clique em "Aceitar o desconto" ou "Confirmar":** não pode aplicar duas vezes nem registrar dois eventos. O botão fica ocupado e o servidor recusa uma oferta já usada com 409. Teste em `retention/handler_test.ts` (Task 2).
2. **Reembolso pedido fora da janela, ou por quem não paga:** o servidor confere sozinho e responde 403 `not_refundable`, sem chamar o Stripe. Teste na Task 2.
3. **Assinatura liberada à mão, ou já marcada para terminar:** `status` responde 404 `no_subscription` para a primeira. Para a segunda, o site mostra "Desfazer" e não abre o fluxo. Testes nas Tasks 2 e 5.
4. **Fechar o modal com Esc no meio:** o plano não muda, nada é gravado e o foco volta ao link que abriu o modal. Roteiro de teclado na Task 6.
5. **Erro de rede ou 500 do Stripe ao aceitar:** o modal mostra o erro no passo e mantém os botões. Não avança como se tivesse dado certo. Teste do mapeamento de erros em `tests/retention.test.ts` (Task 4).

---

### Task 1: Tabela de eventos e cupons (app)

**Files** (worktree do app):
- Create: `supabase/migrations/20261103120000_retention_events.sql` e `supabase/functions/_shared/retention_coupons.json`
- Modify: `scripts/cloud/stripe-setup.mjs` e `scripts/cloud/stripe-setup.test.mjs`
- Create: `supabase/tests/database/003_retention_events.test.sql`

**Interfaces:**
- Produces:
  - **Tabela `public.retention_events`:**
    - `id uuid pk default gen_random_uuid()`
    - `org_id uuid not null references public.orgs on delete cascade`
    - `user_id uuid not null references auth.users on delete cascade`
    - `subscription_id text not null`
    - `plan text not null check (plan in ('pro','team'))`
    - `reason text check (reason in (...os seis...))`
    - `details text check (char_length(details) <= 1000)`
    - `offers text[] not null default '{}'`: as ofertas mostradas
    - `outcome text not null check (outcome in ('kept','discount','free_month','cancelled','refunded','undone'))`
    - `created_at timestamptz not null default now()`
    - Índice em `(org_id, outcome)`, RLS ligada, sem policy e `revoke all from anon, authenticated`.
  - **`retention_coupons.json`:** `{ "discount": { "id": "persisty_retention_25_2m", "percent_off": 25, "duration": "repeating", "duration_in_months": 2, "name": "25% por 60 dias" }, "free_month": { "id": "persisty_retention_free_month", "percent_off": 100, "duration": "once", "name": "30 dias grátis" } }`
  - **`stripe-setup.mjs`:** cria os dois cupons se não existem (`GET /coupons/{id}`; se der 404, `POST /coupons` com os campos acima). Exporta `couponParams(coupon)`.

- [ ] **Step 1: Teste** em `stripe-setup.test.mjs`. `couponParams` gera `id`, `percent_off`, `duration`, `duration_in_months` (só no `repeating`) e `name` para os dois cupons do JSON. Rodar `node --test scripts/cloud/stripe-setup.test.mjs`: FAIL.
- [ ] **Step 2: Implementar** `couponParams` e o passo idempotente no setup. Rodar de novo: PASS.
- [ ] **Step 3: Escrever a migração e o pgTAP.** O pgTAP confere que a tabela existe, que `authenticated` não lê nem escreve (`throws_ok` num `insert` e `select` vazio por RLS) e que os checks de `outcome` e `details` valem. Não rodar `scripts/cloud/test-db.sh`, que aplica a migração numa transação no projeto de produção: fica para o deploy, com ok do usuário.
- [ ] **Step 4: Commit** no worktree: `feat(billing): a table for cancelling and the two retention coupons`.

### Task 2: Função `retention` (app)

**Files:**
- Create: `supabase/functions/retention/handler.ts`, `handler_test.ts` e `index.ts`
- Modify: `supabase/functions/_shared/billing_deps.ts` (fábrica de dependências da função nova; `serveBilling` passa a aceitar a fábrica)
- Modify: `supabase/functions/_shared/stripe.ts` (o método `"DELETE"` em `stripe()`)

**Interfaces:**
- Produces:
  - `handleRetention(req: Request, deps: RetentionDeps): Promise<Response>`.
  - **Corpo da requisição:** `{ action, org_id?, reason?, details?, locale? }`. Os valores de `action` são `"status" | "keep" | "discount" | "free_month" | "cancel" | "refund" | "undo"`.
  - **`RetentionDeps`:**
    - `user(token)`, `personalOrg(userId)` e `canManage(token, orgId)`, como em `CheckoutDeps`
    - `subscription(orgId)`: `Promise<{ id: string; plan: "pro" | "team"; customer: string; cancelAtPeriodEnd: boolean; periodEnd: string | null } | null>`, só assinatura viva com id do Stripe
    - `offerUsed(orgId, offer: "discount" | "free_month")`: `Promise<boolean>`
    - `hadEarlierSubscription(orgId, subscriptionId)`: `Promise<boolean>`
    - `record(event)`: `Promise<void>`
    - `stripe(path, params, method?)`
    - `now()`: `number` (ms)
  - **Respostas** (JSON):
    - `status`: `{ offers: { discount: boolean; free_month: boolean }, period_end, cancel_at_period_end, refund: { amount: number; currency: string } | null, discount_until: string | null }` (`discount_until` vem de `GET /subscriptions/{id}`: o `end` do desconto ativo, para a conta mostrar "25% até tal data")
    - as demais ações: `{ ok: true, period_end?, until? }`
    - **erros:** `{ error }` com `401 unauthorized`, `400 bad_request`, `403 forbidden`, `404 no_subscription`, `409 offer_used`, `403 not_refundable` e `409 already_cancelling` (para `discount`, `free_month` e `cancel` numa assinatura já marcada).
  - **Elegibilidade do reembolso** (no servidor):
    - `!hadEarlierSubscription`;
    - as faturas pagas da assinatura (`GET /invoices?subscription=…&status=paid`) são exatamente uma;
    - essa fatura foi paga há menos de 7 dias;
    - `amount_paid > 0`.

    O valor é o `amount_paid` dela, e a moeda, a da fatura.
  - **O que cada ação faz no Stripe:**
    - `refund`: lista `GET /charges?customer=…&limit=10`, pega a cobrança `succeeded`, não reembolsada, do valor e da janela, faz `POST /refunds { charge }` e depois `DELETE /subscriptions/{id}` com `cancellation_details[feedback|comment]`.
    - `cancel`: `POST /subscriptions/{id} { cancel_at_period_end: "true", "cancellation_details[feedback]", "cancellation_details[comment]" }`.
    - `undo`: `POST /subscriptions/{id} { cancel_at_period_end: "false" }`.
    - `discount` e `free_month`: `POST /subscriptions/{id} { "discounts[0][coupon]": <id do JSON> }`.
  - **Eventos gravados:**
    - um por ação final: `keep`, `discount`, `free_month`, `cancel`, `refund` ou `undo`, com o `outcome` correspondente;
    - `reason` e `details` como vieram, validados;
    - `offers` com as ofertas que o site diz ter mostrado, filtradas para as duas conhecidas.
    - `status` não grava nada.

- [ ] **Step 1: Escrever os testes** em `handler_test.ts`, com dependências falsas no estilo de `create-checkout/handler_test.ts`:
  - sem token → 401;
  - `org_id` de outra pessoa → 403;
  - plano liberado à mão (`subscription` null) → `status` responde 404;
  - `status` diz quais ofertas valem (com `offerUsed` true para `discount`, o `discount` vem false);
  - `discount` aplica o cupom certo e grava `outcome=discount`;
  - `discount` já usado → 409 `offer_used`, sem chamar o Stripe (Review Focus 1);
  - `cancel` manda `cancel_at_period_end=true`, com o feedback mapeado e o comentário, e grava `cancelled`;
  - `cancel` numa assinatura já marcada → 409;
  - `undo` manda `false` e grava `undone`;
  - `refund` com fatura de 8 dias atrás → 403 `not_refundable`, sem chamada de escrita ao Stripe (Review Focus 2);
  - `refund` dentro da janela → reembolsa a cobrança certa, apaga a assinatura e grava `refunded`;
  - `refund` com `hadEarlierSubscription` true → 403;
  - motivo desconhecido ou `details` com mais de 1000 caracteres → 400;
  - `keep` grava `kept` sem chamar o Stripe.
- [ ] **Step 2: Rodar e ver falhar.** `deno test retention/handler_test.ts`: FAIL (módulo não existe).
- [ ] **Step 3: Implementar `handler.ts`** e as dependências reais em `billing_deps.ts`:
  - `subscription` lê `subscriptions` pelo service role com status vivo e `stripe_subscription_id` não nulo, e o customer por `stripe_customer_of`;
  - `offerUsed`, `hadEarlierSubscription` e `record` usam a tabela nova e `subscriptions`.

  Depois, o `index.ts`.
- [ ] **Step 4: Rodar.** Todos os testes de `supabase/functions` passam (`deno test`).
- [ ] **Step 5: Teste contra o Stripe de teste.** Criar `retention/stripe_test.ts`, que só roda com `STRIPE_TEST_KEY=sk_test_…` no ambiente. Ele:
  1. cria um customer com `pm_card_visa` e uma assinatura do preço `persisty_pro_monthly` de teste;
  2. garante os dois cupons (`couponParams` via JSON);
  3. roda `handleRetention` com dependências reais do Stripe e o banco em memória, cobrindo `discount`, `cancel`, `undo` e `refund`;
  4. confere os campos da assinatura e o reembolso no Stripe;
  5. apaga o customer.

  Rodar com `STRIPE_TEST_KEY=$(security find-generic-password -a persisty -s "Persisty Stripe secret key" -w) ~/.deno/bin/deno test --allow-env --allow-net --allow-read retention/stripe_test.ts`. Esperado: PASS. Se a chave restrita recusar alguma escrita (403 `permission`), parar e pedir ao usuário que libere Subscriptions, Coupons e Refunds no painel.
- [ ] **Step 6: Commit:** `feat(billing): cancelling with a reason, two offers, undo and the 7-day refund`.

### Task 3: Copy, Termos e Privacidade (site)

**Files:**
- Modify: `messages/{pt-BR,en,es}/auth.json` (`account.cancel.*`)
- Modify: `content/legal/{pt-BR,en,es}/terms.md` e `privacy.md` (texto e `updated: 2026-11-03`)
- Test: `tests/copy.test.ts`

**Interfaces:**
- Produces: `auth.account.cancel.{open, undo, undoing, step, close, reasons.{too_expensive,…}, detailsLabel, detailsHint, reasonTitle, reasonBody, keep, continue, discountTitle, discountBody, discountAccept, discountDecline, freeTitle, freeBody, freeAccept, freeDecline, confirmTitle, confirmBody, confirmKeepsNothingLost, confirmUndoHint, confirm, refundTitle, refundBody, refundConfirm, duplicateBody, done.{kept, discount, free_month, cancelled, refunded}, errors.{network, offer_used, not_refundable, unknown}, loses.title}`.

- [ ] **Step 1: Teste** em `tests/copy.test.ts`: "cancelling never blames the person". Nenhuma chave de `auth.account.cancel` pode bater com `/perder tudo|você vai se arrepender|tem certeza que quer desistir|lose everything|regret|perderlo todo|arrepent/i`. Os Termos dos três idiomas não podem mais mandar pedir o reembolso por e-mail, então `terms.md` não pode bater com `/suporte@persisty\.app[^\n]*(reembolso|refund)/i`. Rodar: FAIL na parte dos Termos.
- [ ] **Step 2: Textos.**
  - **Termos:** se cancela em Minha conta; nos 7 dias da primeira compra o reembolso é automático ao cancelar.
  - **Privacidade:** o motivo e o texto opcional, com a finalidade.
  - **Mensagens:** as chaves do modal nos três idiomas, em tom simples, que nunca culpa a pessoa.
- [ ] **Step 3: Rodar** `vitest run`. Esperado: PASS.
- [ ] **Step 4: Commit:** `copy(account): cancelling, the offers, and the terms and privacy that go with them`.

### Task 4: Cliente da função e regras do site

**Files:**
- Create: `src/lib/retention.ts` e `tests/retention.test.ts`
- Modify: `src/lib/billing.ts` (`call` aceita `"retention"` e passa a ser exportado)

**Interfaces:**
- Produces:
  - `type Reason = "too_expensive" | "not_using" | "missing_feature" | "problems" | "other_tool" | "other"` e `const REASONS: readonly Reason[]`
  - `type RetentionAction = "status" | "keep" | "discount" | "free_month" | "cancel" | "refund" | "undo"`
  - `interface RetentionStatus { offers: { discount: boolean; free_month: boolean }; periodEnd: string | null; cancelAtPeriodEnd: boolean; refund: { amount: number; currency: Currency } | null; discountUntil: string | null }`
  - `retention(action, body: { orgId?: string; reason?: Reason; details?: string; offers?: ("discount" | "free_month")[] }): Promise<{ ok: true; data: Record<string, unknown> } | { ok: false; error: RetentionErrorKey }>`
  - `type RetentionErrorKey = "network" | "offer_used" | "not_refundable" | "unknown"`
  - `discountedCents(cents: number): number`: `cents - Math.round(cents * 0.25)` (o arredondamento do Stripe)
  - `steps(status: RetentionStatus, duplicate: boolean): ("reason" | "discount" | "free_month" | "confirm")[]`

- [ ] **Step 1: Teste**:
  - `discountedCents(990) === 742`, `discountedCents(490) === 367`, `discountedCents(1990) === 1492`;
  - `steps` com as duas ofertas → os quatro passos;
  - com `discount` usado → sem `discount`;
  - com `duplicate` → `["reason", "confirm"]`;
  - erro 409 `offer_used` e falha de rede viram as chaves certas, testando o mapeamento puro `retentionErrorKey(status, code)` exportado (Review Focus 5).

  Rodar: FAIL.
- [ ] **Step 2: Implementar.** Rodar: PASS.
- [ ] **Step 3: Commit:** `feat(account): the retention client and the steps of cancelling`.

### Task 5: O mascote do modal e o modal

**Files:**
- Create:
  - `src/components/account/cancel/CancelMascot.tsx`
  - `src/components/account/cancel/mascotScene.ts` (cena three.js com `createMascot`, luzes e câmera de corpo inteiro, e as poses `"sad" | "hopeful" | "pleading" | "goodbye" | "celebrate"`, com transição suave entre poses)
  - `src/components/account/cancel/CancelFlow.tsx` e `cancel.module.css`
- Modify: `src/components/account/panels/BillingPanel.tsx` (link "Cancelar assinatura" ou "Desfazer cancelamento"; a linha da oferta aceita; o cancelar da assinatura pessoal duplicada)

**Interfaces:**
- Consumes: `retention`, `steps` e `discountedCents` (Task 4); `useAccount()` (`reloadBilling`, `setStatus`); `planSummary`; `createMascot` de `src/components/studio/mascot.ts`; `wantsLive3d` e `readStudioEnv`, como em `Buddy.tsx`.
- Produces:
  - `CancelFlow({ orgId, plan, duplicate, onClose }: { orgId?: string; plan: "pro" | "team"; duplicate: boolean; onClose: () => void })`
  - `CancelMascot({ mood }: { mood: "sad" | "hopeful" | "pleading" | "goodbye" | "celebrate" })`

- [ ] **Step 1:** Carregue `impeccable:impeccable`, leia o `craft-floor.md` e desenhe o modal com o mascote.
  - **Desktop:** cerca de 760px, em duas colunas. O mascote de corpo inteiro fica num painel `#11151c` com a borda fina. A altura é fixa entre os passos.
  - **Celular:** a coluna vira uma faixa de 168px no topo.
  - **Movimento:** a troca de passo leva 180ms com o ease-out do DESIGN.md e é instantânea com movimento reduzido.
  - **Mascote:**
    - o three.js carrega só quando o modal abre, e a cena dorme quando ele fecha;
    - sem WebGL, com Save-Data ou em aparelho fraco: uma imagem parada (`/art/wave.webp`; se ela não mostrar o corpo inteiro, uma captura PNG da própria cena feita uma vez e guardada em `public/art/mascot-cancel.webp`);
    - é `aria-hidden`.
- [ ] **Step 2: O modal.**
  - **Acessibilidade:** `role="dialog"`, `aria-modal` e `aria-labelledby` no título do passo; foco preso, Esc fecha (grava `keep` só se a pessoa clicou em "Manter"; Esc não grava nada); o foco volta ao link.
  - **Botões:** a ação de ficar é o pill lima; seguir cancelando é um link de texto. "Confirmar cancelamento" é um botão secundário. Os botões ficam ocupados durante a chamada, contra o duplo clique.
  - **Erros:** aparecem no próprio passo.
  - **Aceite ou cancelamento:** o modal mostra a confirmação, com o mascote em `celebrate` ou `goodbye`, chama `reloadBilling()` e fecha depois de 1,6s ou no clique.
  - **Reembolso:** com `status.refund`, a confirmação vira "Cancelar e receber o reembolso de {valor}", com `formatPrice` na moeda da fatura.
- [ ] **Step 3: BillingPanel.** O link aparece só com `manages`, `stripe_subscription_id` e `!ends`; com `ends`, aparece "Desfazer cancelamento", que chama `retention("undo")` e recarrega. A assinatura pessoal paralela tem o seu link, com `duplicate=true`.
- [ ] **Step 4: Verificar.** Rodar `tsc`, `eslint`, `vitest` e `next build`: PASS.
- [ ] **Step 5: Commit:** `feat(account): cancelling in a dialog, with the mascot`.

### Task 6: Verificação visual e de teclado

**Files:**
- Create: `scripts/shots/cancel.mjs`, que abre a prévia, percorre os passos, testa Tab, Esc e a volta do foco, e captura cada passo no desktop e no celular.

- [ ] **Step 1: Prévia temporária.** Uma prévia fora do repositório, no padrão da `account-preview-page.tsx` do scratchpad, que injeta um `AccountContextProvider` e um `retention` falso, com ofertas, reembolso e duplicado. Ela é copiada para `src/app/[locale]/cancel-preview/` só para o build, e apagada antes de qualquer commit.
- [ ] **Step 2:** Rodar `node scripts/shots/cancel.mjs http://localhost:3200 <scratchpad>/shots/cancel`. Esperado:
  - capturas dos quatro passos, do reembolso, do duplicado e da confirmação;
  - "ok" em: Esc fecha, o foco volta ao link, Tab não sai do modal, e o modal cabe em 390px sem rolagem lateral.
- [ ] **Step 3: Revisão do branch inteiro** dos dois repositórios, por um revisor novo (superpowers:requesting-code-review). Corrigir o que for crítico ou importante, com teste.
- [ ] **Step 4: Entrega ao usuário.**
  - **O que ele recebe:** as capturas, os textos (modal, Termos e Privacidade) e a lista de deploy, nesta ordem e cada passo com o ok dele:
    1. migração (`supabase db push`), depois `test-db.sh`;
    2. `supabase functions deploy retention`;
    3. `node scripts/cloud/stripe-setup.mjs --live` (cupons live);
    4. push do app;
    5. push do site.
  - **E o aviso:** o e-mail da mudança na política de privacidade é decisão dele.
