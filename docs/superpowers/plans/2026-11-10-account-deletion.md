# Excluir a conta — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Quem tem conta exclui a conta pelo site, em Minha conta ou em `/account/delete`, de forma imediata, e com isso:
- encerra as assinaturas, com o reembolso dos 7 dias uma vez por e-mail;
- apaga os Times de que é dona e as contas de quem só participa deles;
- manda os e-mails de aviso e de confirmação pelo Resend.

**Architecture:**
- **Função nova `delete-account`** no repositório do app (Deno, no padrão de `retention`), com duas ações:
  - `preview` diz o que vai ser excluído;
  - `delete` faz a exclusão, na ordem: Stripe → membros → Times → a própria conta → confirmação.
- **Migração:** quem sai junto com o dono é calculado numa função SQL (`account_deletion_scope`). A mesma migração faz o webhook do Stripe ignorar orgs que já não existem.
- **Site:** ganha um modal de dois passos no frame do cancelamento, uma seção no fim da página inicial de Minha conta, a rota `/account/delete` e uma página própria depois da exclusão.

**Tech Stack:**
- **App:** Deno e Supabase Edge Functions, pgTAP, Stripe por HTTP (`_shared/stripe.ts`), API do Resend.
- **Site:** Next.js 16 (App Router), next-intl (pt-BR, en, es), CSS Modules, vitest.

**Spec:** `docs/superpowers/specs/2026-11-10-account-deletion-design.md`. Leia o spec inteiro antes da Task 1: o plano cita as seções dele.

**Onde cada coisa fica:**
- `APP` = `/Users/maiconwagnerdossantos/Documents/Projetos/Persist/persist-application/.claude/worktrees/account-deletion` (worktree criado na Task 1, branch `feat/account-deletion` a partir de `origin/main`).
- `SITE` = `/Users/maiconwagnerdossantos/Documents/Projetos/Persist/persist-landingpage` (branch `feat/account-deletion`, onde o spec já está commitado).

**Ferramentas desta máquina:**
- **Deno:** `~/.deno/bin/deno`.
- **Supabase, psql:** em `/opt/homebrew/bin`, que não está no PATH. Prefixe com `PATH=/opt/homebrew/bin:$PATH`.
- **Node 24:** `export PATH="$HOME/.nvm/versions/node/v24.18.0/bin:$PATH"`.
- **pnpm não funciona aqui.** Use `node_modules/.bin/{vitest,tsc,eslint,next}`.
- **Depois de criar ou remover rota,** rode `node_modules/.bin/next typegen` antes do `tsc`.
- **Git no app:** o remoto pede o token do usuário `abalad`, sempre só dentro do comando. Não troque a conta ativa do `gh`:
  ```bash
  git -c http.https://github.com/.extraheader="AUTHORIZATION: basic $(printf 'x-access-token:%s' "$(/opt/homebrew/bin/gh auth token --user abalad)" | base64)" fetch origin
  ```

## Global Constraints

**Nada em produção sem ok explícito do usuário no momento.**
- Isso vale para deploy de função, migração aplicada no projeto, o segredo `RESEND_API_KEY`, qualquer mudança no Stripe live, push no `main` do site e push no `main` do app.
- Antes de publicar, o usuário recebe capturas, textos nos três idiomas e antes e depois dos textos legais (Task 10).

**Testes:**
- Os testes que tocam o Stripe usam só chave `sk_test_` (Keychain "Persisty Stripe secret key", conta `persisty`). Pare se a chave não começar com `sk_test_`.
- Nenhum teste manda e-mail a uma pessoa real. Use `fetch` falso, ou o endereço de teste do Resend `delivered@resend.dev`.
- Os e-mails dos testes são `@example.test`. O e-mail do usuário nunca vai para serviço nenhum.

**Valores do spec, verbatim:**
- **Login recente:** "nos últimos 10 minutos" (`FRESH_MS = 10 * 60_000`), lido do `amr` do token, que a renovação mantém, e nunca do `iat`.
- **Reembolso:** "dentro de 7 dias da primeira cobrança" (`REFUND_WINDOW_MS = 7 * 86_400_000`). "Primeira compra" vale por e-mail: a compra não é a primeira se outro cliente do Stripe com o mesmo e-mail já teve assinatura.
- **Remetente:** `Persisty <oi@persisty.app>`.
- **Ordem no servidor:** Stripe → membros (aviso, depois a conta) → Times → a própria conta → confirmação. Uma falha em qualquer envio nunca impede a exclusão de seguir.
- **"Outro vínculo"** é estar em qualquer Time que não seja dos que vão ser apagados, ou ter na org pessoal uma assinatura com status `trialing`, `active` ou `past_due`.

**Migração:** o timestamp vem depois da última migração em `origin/main` do app. Hoje é `20261104090000`, e este plano usa `20261110120000`. Confira de novo na Task 2; se houver uma mais nova, use um timestamp maior.

**Site:**
- três idiomas com as mesmas chaves (`tests/messages.test.ts`) e as regras de `tests/copy.test.ts`;
- sem prettier;
- tokens de `src/styles/tokens.css` e `DESIGN.md`. O frame é o do cancelamento (`src/components/account/cancel/cancel.module.css`).

**Regras de copy:**
- nunca dizer que algo segue com o app fechado;
- nunca citar tmux nem supervisor;
- não acrescentar menções a `suporte@persisty.app`;
- o modal não mostra lista de pessoas, e-mails nem contagem de membros do Time.

**Fora do visual** (anti-objetivos do spec):
- palavra colorida no título;
- borda decorativa;
- fonte mono em e-mail e nome de computador (mono só nos dígitos do código);
- ícones nas linhas e selo do plano;
- faixa de resumo com bolinhas;
- código em 6 caixinhas;
- risco animado;
- frases feitas no balão;
- rolagem dentro do modal;
- mascote triste no fim.

## Review Focus

1. **Membro de dois Times da mesma dona.** Um membro que está em dois Times, ambos da pessoa que exclui, não tem outro vínculo, então a conta dele sai. A prova é o teste pgTAP da Task 2.
2. **Admin, mas não dona.** Se a pessoa é admin de um Time sem ser dona, o Time continua. No passo 1 ele aparece como "Sua participação no Time …". A prova é a Task 2 (`member_teams`) e a Task 6 (`goneLines`).
3. **Token renovado, login antigo.** Uma sessão renovada há um minuto, mas com login de horas atrás, não conta como recente. A prova é a Task 6 (`signedInAt` lê o `amr`, não o `iat`) e a Task 4 (`stale_sign_in`).
4. **Nova tentativa depois do Stripe.** Na nova tentativa, o Stripe já encerrou a assinatura e reembolsou, mas o banco ainda diz `active`. O esperado:
   - nenhum `DELETE` de novo e nenhum reembolso de novo;
   - a exclusão termina;
   - a confirmação ainda cita o valor devolvido.

   A prova é a Task 4.
5. **Webhook de um Time já apagado.** Um evento do Stripe para uma org que já não existe responde sem erro e não grava linha. A prova é a Task 2 (`stripe_apply_subscription`).

---

### Task 1: A regra da primeira compra, por e-mail, compartilhada com o cancelamento

**Files:**
- Create: `APP/supabase/functions/_shared/first_purchase.ts`
- Create: `APP/supabase/functions/_shared/first_purchase_test.ts`
- Modify: `APP/supabase/functions/retention/handler.ts`:
  - tirar `REFUND_WINDOW_MS` e `refundOwed`, mais o laço de reembolso do `case "refund"`;
  - reexportar `REFUND_WINDOW_MS`.
- Modify: `APP/supabase/functions/retention/handler_test.ts` (um teste novo)

**Interfaces:**
- Produces:
  ```ts
  export const REFUND_WINDOW_MS = 7 * 86_400_000;
  export type StripeCall = (path: string, params: Record<string, string>, method?: "GET" | "POST" | "DELETE", idempotencyKey?: string) => Promise<Record<string, unknown>>;
  export interface Charged { id: string; customer: string }          // a Stripe subscription and the customer paying it
  export interface Refund { amount: number; currency: string; paidAt: number } // paidAt in seconds
  export function emailHadSubscription(customer: string, stripe: StripeCall): Promise<boolean>;
  export function refundOwed(sub: Charged, earlier: boolean, stripe: StripeCall, now: number): Promise<Refund | null>;
  export function refundPayments(sub: Charged, owed: Refund, orgId: string, stripe: StripeCall): Promise<{ found: number; refunded: number }>;
  ```

- [ ] **Step 1: Crie o worktree do app**

```bash
cd /Users/maiconwagnerdossantos/Documents/Projetos/Persist/persist-application
git -c http.https://github.com/.extraheader="AUTHORIZATION: basic $(printf 'x-access-token:%s' "$(/opt/homebrew/bin/gh auth token --user abalad)" | base64)" fetch origin
git worktree add .claude/worktrees/account-deletion -b feat/account-deletion origin/main
mkdir -p .claude/worktrees/account-deletion/supabase/.temp && cp supabase/.temp/project-ref .claude/worktrees/account-deletion/supabase/.temp/
```
Expected: o worktree existe, em `feat/account-deletion`, e `git -C .claude/worktrees/account-deletion log -1 --oneline` mostra o topo de `origin/main`. Não mexa na pasta principal do app nem nos outros worktrees.

- [ ] **Step 2: Escreva os testes que falham** em `first_purchase_test.ts`. Use um `StripeCall` falso que registra as chamadas e responde por caminho, como `fakes()` em `retention/handler_test.ts`.

```ts
Deno.test("emailHadSubscription: no e-mail on the customer, no earlier purchase", ...);
// GET /customers/cus_1 → {}  ⇒ false, and no GET /customers list was made
Deno.test("emailHadSubscription: only this customer has the e-mail", ...);
// GET /customers/cus_1 → { email: "ana@example.test" }; GET /customers → { data: [{ id: "cus_1" }] } ⇒ false
Deno.test("emailHadSubscription: another customer with the same e-mail had a subscription", ...);
// + GET /subscriptions with params { customer: "cus_0", status: "all", limit: "1" } → { data: [{ id: "sub_0" }] } ⇒ true
// and the /customers list was asked with params { email: "ana@example.test", limit: "100" }
Deno.test("refundOwed: null when the organisation had an earlier subscription, without asking Stripe", ...);
// refundOwed(sub, true, stripe, NOW) === null and calls.length === 0
Deno.test("refundOwed: null when the same e-mail paid before on another customer", ...);
Deno.test("refundOwed: every payment inside the 7 days, summed", ...);
// invoices paid at NOW-2d (990 brl) and NOW-1d (990 brl) ⇒ { amount: 1980, currency: "brl", paidAt: secs(NOW - 2 * DAY) }
Deno.test("refundOwed: null once the first payment is older than 7 days", ...);
Deno.test("refundPayments: refunds what is left of each succeeded charge since the first payment", ...);
// charges: ch_1 succeeded not refunded (990), ch_2 already refunded, ch_3 failed, ch_4 created before paidAt - 3600
// ⇒ { found: 2, refunded: 1 }; one POST /refunds { charge: "ch_1", amount: "990", reason: "requested_by_customer", "metadata[org_id]": ORG } with key "retention-refund-ch_1"
```

- [ ] **Step 3: Rode e confira que falham**

Run: `cd APP && ~/.deno/bin/deno test --allow-env --allow-net --allow-read supabase/functions/_shared/first_purchase_test.ts`
Expected: FAIL (o módulo `first_purchase.ts` não existe).

- [ ] **Step 4: Implemente `first_purchase.ts`**
- **`refundOwed`:** mova para cá o corpo de `refundOwed` de `retention/handler.ts`, com duas mudanças:
  - `earlier` passa a ser um parâmetro;
  - antes de olhar as faturas, chama `emailHadSubscription(sub.customer, stripe)`.
- **`refundPayments`:** é o laço do `case "refund"` de hoje (`GET /charges`, o filtro `status === "succeeded" && created >= paidAt - 3600`, a chave `retention-refund-<charge>`), devolvendo quantas cobranças achou e quantas reembolsou agora.
- **`emailHadSubscription`:** segue os três GETs do teste e devolve `true` na primeira assinatura encontrada.

- [ ] **Step 5: Faça o `retention` usar o módulo**

No handler, troque as chamadas:
- `refundOwed(orgId, sub, deps)` passa a ser `refundOwed(sub, await deps.hadEarlierSubscription(orgId, sub.id), deps.stripe, deps.now())`;
- no `case "refund"`, use `refundPayments`. Com `found === 0`, mantenha a resposta de hoje: `fail(403, "not_refundable", "no payment to refund was found")`.

Acrescente `export { REFUND_WINDOW_MS } from "../_shared/first_purchase.ts";`. Os testes existentes não mudam: o falso responde `{ id: "ok" }`, sem e-mail, a `GET /customers/cus_1`.

Acrescente um teste novo em `retention/handler_test.ts`: "the 7-day refund is not offered when the same e-mail paid before on another customer". O falso responde ao e-mail e à outra assinatura. Assert: `status` devolve `refund: null`.

- [ ] **Step 6: Rode tudo e confira que passa**

Run: `cd APP && ~/.deno/bin/deno test --allow-env --allow-net --allow-read supabase/functions/`
Expected: tudo PASS. Os `stripe_test.ts` não rodam sem `STRIPE_TEST_KEY`.

- [ ] **Step 7: Commit**

```bash
cd APP && git add supabase/functions/_shared/first_purchase.ts supabase/functions/_shared/first_purchase_test.ts supabase/functions/retention/handler.ts supabase/functions/retention/handler_test.ts
git commit -m "feat(billing): the 7-day refund once per e-mail, shared by cancelling and deleting the account"
```

---

### Task 2: Migração — quem sai junto, e o webhook que ignora Times apagados

**Files:**
- Create: `APP/supabase/migrations/20261110120000_account_deletion.sql`
- Create: `APP/supabase/tests/database/005_account_deletion.test.sql`

**Interfaces:**
- Produces:
  - **SQL `public.account_deletion_scope(p_user uuid) returns jsonb`.** Só a `service_role` executa. Devolve:
    ```json
    { "personal_org": "<uuid>",
      "owned_teams":  [{ "id": "<uuid>", "name": "Acme" }],
      "member_teams": [{ "id": "<uuid>", "name": "Beta" }],
      "swept": [{ "id": "<uuid>", "email": "b@example.test", "locale": "en" | null, "team": "Acme" }] }
    ```
    - `owned_teams` são os Times em que `p_user` é `owner`;
    - `member_teams` são os Times em que ele é `admin` ou `member`;
    - `swept` são as outras pessoas desses `owned_teams` sem outro vínculo. `team` é o nome do primeiro Time dela, em ordem alfabética, entre os que saem.
  - **`public.stripe_apply_subscription(p jsonb)`:** mesmo contrato, mas sem efeito quando `p->>'org_id'` não existe em `public.orgs`.

- [ ] **Step 1: Confira o timestamp**

Run: `cd APP && git ls-tree --name-only origin/main supabase/migrations/ | tail -1`
Expected: `supabase/migrations/20261104090000_remote_from_pro.sql`. Se houver uma mais nova, renomeie a desta task para um timestamp maior.

- [ ] **Step 2: Escreva o teste pgTAP que falha** (`005_account_deletion.test.sql`), no estilo de `003_retention_events.test.sql`: transação revertida, usuários inseridos em `auth.users`, orgs e membros inseridos direto como no `002_billing_invites.test.sql`.

O cenário:
- **Pessoas:** A (quem exclui), B, C, D, E e F.
- **Time 1** (dona A): B, C, D e F.
- **Time 3** (dona A): F.
- **Time 2** (dono E): D.
- **Time 4** (dono E): A como `admin`.
- **A org pessoal de C** tem uma linha em `subscriptions` com `plan 'pro'`, `status 'active'`.

`select plan(8);`:
1. `owned_teams` → os nomes `{Time 1, Time 3}`.
2. `member_teams` → os nomes `{Time 4}`.
3. `swept` → os ids `{B, F}`. F está em dois Times de A, então sai. C fica pela assinatura, e D fica pelo Time 2.
4. A entrada de B tem `email` igual ao de B e `team = 'Time 1'`.
5. `personal_org` é a org pessoal de A.
6. Como `authenticated`, `select public.account_deletion_scope(<A>)` → `throws_ok(..., '42501')`.
7. Como `service_role`, `select public.stripe_apply_subscription('{"org_id":"<uuid que não existe>","plan":"team","status":"canceled","seats":"1","stripe_subscription_id":"sub_gone"}')` → `lives_ok`.
8. `select count(*) from public.subscriptions where stripe_subscription_id = 'sub_gone'` → 0.

- [ ] **Step 3: Rode e confira que falha**

Antes de rodar, peça ok ao usuário. O script conecta no projeto ligado (produção), aplica a migração numa transação e reverte tudo no fim.

Run: `cd APP && PATH=/opt/homebrew/bin:$PATH scripts/cloud/test-db.sh supabase/migrations/20261110120000_account_deletion.sql`
Expected: `005` falha (a função não existe; o 7 falha por chave estrangeira).

- [ ] **Step 4: Escreva a migração**

O `stripe_apply_subscription` é o de `20261102120000_billing_invites.sql` com `insert … select … where exists (select 1 from public.orgs o where o.id = (p ->> 'org_id')::uuid) on conflict …`. O `create or replace` mantém os grants que já existem.

A função de escopo:
```sql
create or replace function public.account_deletion_scope(p_user uuid)
returns jsonb language sql stable security definer set search_path = '' as $$
  with owned as (
    select o.id, o.name from public.orgs o join public.org_members m on m.org_id = o.id
    where o.kind = 'team' and m.user_id = p_user and m.role = 'owner'
  ), joined as (
    select o.id, o.name from public.orgs o join public.org_members m on m.org_id = o.id
    where o.kind = 'team' and m.user_id = p_user and m.role <> 'owner'
  ), candidates as (
    select m.user_id, min(ow.name) as team from public.org_members m join owned ow on ow.id = m.org_id
    where m.user_id <> p_user group by m.user_id
  ), swept as (
    select c.user_id, c.team from candidates c
    where not exists (select 1 from public.org_members m join public.orgs o on o.id = m.org_id
                      where m.user_id = c.user_id and o.kind = 'team' and o.id not in (select id from owned))
      and not exists (select 1 from public.orgs p join public.subscriptions s on s.org_id = p.id
                      where p.personal_owner = c.user_id and s.status in ('trialing', 'active', 'past_due'))
  )
  select jsonb_build_object(
    'personal_org', (select id from public.orgs where personal_owner = p_user),
    'owned_teams', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'name', name) order by name) from owned), '[]'::jsonb),
    'member_teams', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'name', name) order by name) from joined), '[]'::jsonb),
    'swept', coalesce((select jsonb_agg(jsonb_build_object('id', u.id, 'email', u.email, 'locale', u.raw_user_meta_data ->> 'locale', 'team', s.team) order by u.email)
                       from swept s join auth.users u on u.id = s.user_id), '[]'::jsonb));
$$;
revoke all on function public.account_deletion_scope(uuid) from public, anon, authenticated;
grant execute on function public.account_deletion_scope(uuid) to service_role;
```
Abra o arquivo com um comentário de duas linhas no estilo das outras migrações: o que ela faz e por quê.

- [ ] **Step 5: Rode e confira que passa**

Run: o mesmo comando do Step 3.
Expected: `001` a `005` com `ok` em todas as linhas e nenhum `not ok`.

- [ ] **Step 6: Commit**

```bash
cd APP && git add supabase/migrations/20261110120000_account_deletion.sql supabase/tests/database/005_account_deletion.test.sql
git commit -m "feat(account): who goes with a team owner's account, and Stripe events for a deleted team ignored"
```

---

### Task 3: O envio pelo Resend e os textos dos dois e-mails

**Files:**
- Create: `APP/supabase/functions/_shared/resend.ts`
- Create: `APP/supabase/functions/_shared/resend_test.ts`
- Create: `APP/supabase/functions/delete-account/emails.ts`
- Create: `APP/supabase/functions/delete-account/emails_test.ts`

**Interfaces:**
- Produces:
  ```ts
  // _shared/resend.ts
  export const FROM = "Persisty <oi@persisty.app>";
  export interface Mail { to: string; subject: string; text: string; html: string }
  export function sendEmail(mail: Mail, key: string, idempotencyKey: string, fetcher?: typeof fetch): Promise<void>; // throws on a non-2xx answer

  // delete-account/emails.ts
  export type MailLocale = "pt-BR" | "en" | "es";
  export function mailLocale(raw: unknown): MailLocale;             // anything else → "pt-BR"
  export interface Gone { plans: ("pro" | "team")[]; teams: string[]; refunds: { amount: number; currency: string }[] }
  export function confirmationMail(to: string, locale: MailLocale, gone: Gone): Mail;
  export function noticeMail(to: string, locale: MailLocale, team: string): Mail;
  ```

- [ ] **Step 1: Escreva os testes que falham**

```ts
// resend_test.ts
Deno.test("sendEmail posts one e-mail from Persisty with the idempotency key", ...);
// fetcher receives "https://api.resend.com/emails", method POST, headers authorization "Bearer re_test",
// "content-type" "application/json", "idempotency-key" "k1"; JSON body { from: FROM, to: ["a@example.test"], subject, text, html }
Deno.test("sendEmail throws when Resend refuses", ...);             // fetcher answers 422 ⇒ assertRejects

// emails_test.ts
Deno.test("mailLocale keeps the three languages and falls back to pt-BR", ...); // "en"→"en", "fr"→"pt-BR", null→"pt-BR"
Deno.test("the subject in each language", ...);
// pt-BR "Sua conta do Persisty foi excluída"; en "Your Persisty account was deleted"; es "Tu cuenta de Persisty fue eliminada" (both mails)
Deno.test("the confirmation lists what went, in one sentence", ...);
// gone { plans: ["team"], teams: ["Acme"], refunds: [] } pt-BR ⇒ text includes "Foram excluídos: a conta, a assinatura Team e o Time Acme."
// and "A assinatura foi encerrada hoje, sem reembolso do período restante."
Deno.test("the confirmation says what goes back to the card", ...);
// refunds [{ amount: 990, currency: "brl" }] pt-BR ⇒ text matches /Os R\$\s9,90 pagos voltam para o cartão\./
Deno.test("an account with nothing paid says nothing about money", ...); // plans [] ⇒ no "assinatura" in text
Deno.test("the notice names the team, never the owner, and escapes it in the HTML", ...);
// noticeMail("b@example.test", "pt-BR", "<Acme>") ⇒ html includes "&lt;Acme&gt;", text includes "O Time <Acme> foi excluído pelo dono"
```

- [ ] **Step 2: Rode e confira que falham**

Run: `cd APP && ~/.deno/bin/deno test --allow-env --allow-net --allow-read supabase/functions/_shared/resend_test.ts supabase/functions/delete-account/emails_test.ts`
Expected: FAIL (os módulos não existem).

- [ ] **Step 3: Implemente `resend.ts`**

O `fetch` vai para `https://api.resend.com/emails`, com os cabeçalhos do teste. O erro diz só o status e nada do corpo.

- [ ] **Step 4: Implemente `emails.ts`**

O texto em pt-BR é este, exato. Cada parágrafo vira um `<p>` no HTML, com o texto escapado. A lista usa `Intl.ListFormat(locale, { type: "conjunction" })`, e os valores usam `Intl.NumberFormat(locale, { style: "currency", currency })` sobre `amount / 100`.

Confirmação:
```
Sua conta do Persisty foi excluída, como você pediu.

Foram excluídos: {a conta[, a assinatura Pro][, a assinatura Team][, o Time X | os Times X e Y]}.
{Os {valor} pagos voltam para o cartão. | A assinatura foi encerrada hoje, sem reembolso do período restante. | (nada, sem assinatura)}

No seu computador, projetos, sessões e histórico continuam onde estavam, e o Persisty segue funcionando no plano grátis, sem conta.

Persisty
```

Aviso:
```
O Time {nome} foi excluído pelo dono, e a sua conta do Persisty foi junto, porque você participava só desse Time.

No seu computador, projetos, sessões e histórico continuam onde estavam, e o Persisty segue funcionando no plano grátis, sem conta.

Se quiser, você pode criar uma conta nova a qualquer momento, com este mesmo e-mail, em persisty.app.

Persisty
```

Para en e es, traduza no mesmo tom. Os textos dos três idiomas vão ao usuário na Task 10. Com mais de um reembolso em moedas diferentes, a frase do dinheiro junta os valores com a mesma `ListFormat`.

- [ ] **Step 5: Rode e confira que passa**

Run: o mesmo do Step 2.
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
cd APP && git add supabase/functions/_shared/resend.ts supabase/functions/_shared/resend_test.ts supabase/functions/delete-account/emails.ts supabase/functions/delete-account/emails_test.ts
git commit -m "feat(account): the deletion's two e-mails, sent through Resend"
```

---

### Task 4: A função `delete-account` (preview e delete)

**Files:**
- Create: `APP/supabase/functions/delete-account/handler.ts`
- Create: `APP/supabase/functions/delete-account/handler_test.ts`

**Interfaces:**
- Consumes:
  - da Task 1: `StripeCall`, `refundOwed` e `refundPayments`;
  - da Task 3: `Mail`, `mailLocale`, `confirmationMail`, `noticeMail` e `Gone`.
- Produces:
  ```ts
  export const FRESH_MS = 10 * 60_000;
  export interface DeletionScope {
    personalOrg: string;
    ownedTeams: { id: string; name: string }[];
    memberTeams: { id: string; name: string }[];
    swept: { id: string; email: string; locale: string | null; team: string }[];
  }
  export interface DeletionSubscription { orgId: string; id: string; plan: "pro" | "team"; customer: string } // enterprise arrives as "team"
  export interface DeletionDeps {
    user: (token: string) => Promise<{ id: string; email: string } | null>;
    isPhoneSession: (token: string) => Promise<boolean>;
    scope: (userId: string) => Promise<DeletionScope>;
    computers: (userId: string) => Promise<number>;              // devices not revoked
    subscriptions: (orgIds: string[]) => Promise<DeletionSubscription[]>; // live Stripe ones, personal first
    hadEarlierSubscription: (orgId: string, subscriptionId: string) => Promise<boolean>;
    deleteOrg: (orgId: string) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;               // a user already gone counts as done
    send: (mail: Mail, idempotencyKey: string) => Promise<boolean>; // false when it did not go out; never throws
    stripe: StripeCall;
    signedInAt: (token: string) => number;                       // seconds, from `amr`
    now: () => number;                                           // ms
  }
  export function handleDeleteAccount(req: Request, deps: DeletionDeps): Promise<Response>;
  ```
- **Contrato HTTP (o site da Task 6 depende dele):**
  - `POST { action: "preview" | "delete", locale?: string }`, com `Authorization: Bearer <token>`.
  - **`preview` → 200:**
    ```json
    { "email": "a@example.test", "computers": 2, "fresh": true,
      "subscriptions": [{ "plan": "team", "team": "Acme", "refund": { "amount": 990, "currency": "brl" } }],
      "owned_teams": ["Acme"], "member_teams": ["Beta"] }
    ```
    `team` é `null` na assinatura pessoal.
  - **`delete` → 200:** `{ "ok": true, "confirmation_sent": boolean }`.
  - **Erros**, como `{ error, message }`:
    - 405 `method_not_allowed`;
    - 401 `unauthorized`;
    - 400 `bad_request`;
    - 403 `forbidden` (sessão de celular);
    - 403 `stale_sign_in` (`delete` sem login nos últimos 10 minutos);
    - uma falha do Stripe sobe como exceção, e o `serveBilling` responde 500 `internal`.

- [ ] **Step 1: Escreva os testes que falham**

Faça um `fakes()` como o de `retention/handler_test.ts`. Ele registra cada efeito numa lista `log: string[]`:
- `stripe:<METHOD> <path>`;
- `send:<to>:<key>`;
- `deleteUser:<id>`;
- `deleteOrg:<id>`.

O cenário padrão:
- `user` = `{ id: "u1", email: "ana@example.test" }`;
- escopo com `personalOrg` P e `ownedTeams` `[{ id: T, name: "Acme" }]`;
- `swept` com `[{ id: "u2", email: "bia@example.test", locale: "en", team: "Acme" }]`;
- assinatura `{ orgId: T, id: "sub_1", plan: "team", customer: "cus_1" }`;
- `GET /subscriptions/sub_1` → `{ status: "active" }`;
- sem faturas em aberto;
- `signedInAt` = `secs(NOW - 9 * 60_000)`.

```ts
Deno.test("without a session nothing happens", ...);                 // 401, log empty
Deno.test("only POST, with a known action", ...);                   // GET ⇒ 405; { action: "x" } ⇒ 400
Deno.test("a phone's session cannot preview nor delete", ...);      // isPhoneSession true ⇒ 403 "forbidden" for both
Deno.test("the preview says what goes, and whether the sign-in is recent", ...);
// ⇒ { email, computers: 2, fresh: true, subscriptions: [{ plan: "team", team: "Acme", refund: null }], owned_teams: ["Acme"], member_teams: [] }
// and with signedInAt = secs(NOW - 11 * 60_000) ⇒ fresh: false; the log has no write
Deno.test("the preview carries the refund still owed", ...);       // invoices paid NOW-1d 990 brl ⇒ refund { amount: 990, currency: "brl" }
Deno.test("deleting needs a sign-in from the last 10 minutes", ...);
// signedInAt = secs(NOW - 11 * 60_000) ⇒ 403 "stale_sign_in"; log has no stripe write, send, deleteUser nor deleteOrg
Deno.test("deleting goes Stripe, members, teams, the account, then the confirmation", ...);
// with one open invoice in_1 ⇒ writes, in order:
// "stripe:POST /invoices/in_1/void", "stripe:DELETE /subscriptions/sub_1",
// "send:bia@example.test:account-deleted-notice-u2", "deleteUser:u2", "deleteOrg:<T>", "deleteUser:u1",
// "send:ana@example.test:account-deleted-u1"; the DELETE had params { invoice_now: "false", prorate: "false" }; 200 { ok: true, confirmation_sent: true }
Deno.test("inside the 7 days the money goes back before the plan ends", ...);
// invoices + one succeeded charge ⇒ "stripe:POST /refunds" comes before "stripe:DELETE /subscriptions/sub_1"
Deno.test("when Stripe fails nothing is deleted and nobody is told", ...);
// DELETE /subscriptions/sub_1 throws ⇒ assertRejects; log has no send, deleteUser nor deleteOrg
Deno.test("a retry after Stripe finished does not end or refund twice and still names the refund", ...);
// GET /subscriptions/sub_1 → { status: "canceled" }; invoices paid NOW-1d 990 brl; charge already refunded ⇒
// no "DELETE /subscriptions", no "POST /refunds", no void; deletions happen; the confirmation mail text matches /R\$\s9,90/ (locale pt-BR)
Deno.test("a confirmation that does not go out does not undo the deletion", ...); // send → false ⇒ 200 { ok: true, confirmation_sent: false }, deleteUser:u1 logged
Deno.test("a refund owed with no card payment to refund is not promised", ...);
// invoices paid NOW-1d 990 brl, GET /charges → { data: [] } ⇒ no POST /refunds, the subscription still ends, deletion goes on,
// and the confirmation text has no "voltam para o cartão"
Deno.test("each person is told in their language, or the owner's", ...);
// swept locale "en" ⇒ notice subject "Your Persisty account was deleted"; locale null with body locale "es" ⇒ "Tu cuenta de Persisty fue eliminada"
Deno.test("someone who only belongs to teams of others keeps them", ...);
// scope with ownedTeams [] and memberTeams [{ id: T4, name: "Beta" }], no subscriptions ⇒ log is exactly ["deleteUser:u1", "send:ana@example.test:account-deleted-u1"]
```

- [ ] **Step 2: Rode e confira que falham**

Run: `cd APP && ~/.deno/bin/deno test --allow-env --allow-net --allow-read supabase/functions/delete-account/handler_test.ts`
Expected: FAIL (`handler.ts` não existe).

- [ ] **Step 3: Implemente `handleDeleteAccount`**

Leia o token, o corpo e os erros como `retention/handler.ts` (`json`, `fail`, `tokenOf`, `readBody`). A ordem do `delete` segue a seção 5 do spec.

Em cada assinatura de `subscriptions([scope.personalOrg, ...scope.ownedTeams.map((t) => t.id)])`:
1. `owed = await refundOwed(sub, await deps.hadEarlierSubscription(sub.orgId, sub.id), deps.stripe, deps.now())`;
2. se houver `owed`, `refundPayments(sub, owed, sub.orgId, deps.stripe)`. O valor só entra em `gone.refunds` se `found > 0`.
   - Com `found === 0`, o pagamento não foi por cartão (marcado como pago fora do Stripe), e não há o que o Stripe devolver sozinho.
   - Nesse caso: `console.error("[delete-account] refund owed without a card payment", sub.id)`, e a confirmação não promete reembolso. É o único caso que precisa de uma pessoa;
3. `GET /subscriptions/<id>`. Se o `status` não for `canceled`:
   - anule cada fatura de `GET /invoices { subscription: <id>, status: "open" }` com `POST /invoices/<id>/void`, chave `delete-void-<invoice>`;
   - depois `DELETE /subscriptions/<id> { invoice_now: "false", prorate: "false" }`.

Depois das assinaturas:
4. para cada pessoa de `swept`: primeiro `send(noticeMail(…), "account-deleted-notice-<id>")`, depois `deleteUser(id)`;
5. `deleteOrg` de cada Time de `ownedTeams`;
6. `deleteUser(user.id)`;
7. `send(confirmationMail(…), "account-deleted-<user.id>")`.

O `gone.plans` é `subs.map((s) => s.plan)`, e o `gone.teams` traz os nomes de `ownedTeams`. No `preview`, o `team` de cada assinatura é o nome do Time de `ownedTeams` com o mesmo `orgId`, ou `null` na org pessoal.

Acrescente no topo um comentário de cabeçalho no estilo do de `retention/handler.ts`.

- [ ] **Step 4: Rode e confira que passa**

Run: `cd APP && ~/.deno/bin/deno test --allow-env --allow-net --allow-read supabase/functions/`
Expected: tudo PASS.

- [ ] **Step 5: Commit**

```bash
cd APP && git add supabase/functions/delete-account/handler.ts supabase/functions/delete-account/handler_test.ts
git commit -m "feat(account): deleting the account, with the team owner's team and the 7-day refund"
```

---

### Task 5: As dependências reais, o `index.ts` e o teste no Stripe de teste

**Files:**
- Modify: `APP/supabase/functions/_shared/billing_deps.ts` (acrescentar `deleteAccountDeps`)
- Create: `APP/supabase/functions/delete-account/index.ts`
- Create: `APP/supabase/functions/delete-account/stripe_test.ts`

**Interfaces:**
- Consumes:
  - da Task 4: `DeletionDeps` e `handleDeleteAccount`;
  - da Task 3: `sendEmail`;
  - de `_shared/license.ts`: `sessionSignedInAt`.
- Produces: `export function deleteAccountDeps(key: string): DeletionDeps;` em `billing_deps.ts`.

- [ ] **Step 1: Escreva o teste no Stripe de teste, que falha**

Use `stripe_test.ts`, no molde de `retention/stripe_test.ts`:
- só roda com `STRIPE_TEST_KEY` começando com `sk_test_`;
- usa a chave de verdade via `stripe()` e deps em memória para o banco;
- apaga tudo o que cria no fim.

Dois testes:
- **"deleting inside the 7 days refunds and ends the subscription"**: um cliente `del-<random>@example.test` paga um preço de teste com o cartão de teste e roda `delete`. Asserts:
  - o charge fica `refunded`;
  - a assinatura fica `canceled`;
  - `deleteUser` foi chamado.
- **"a second customer with the same e-mail gets no refund"**: um segundo cliente com o mesmo e-mail paga, e o `preview` devolve `refund: null`.

- [ ] **Step 2: Rode e confira que falha**

Run:
```bash
cd APP && STRIPE_TEST_KEY=$(security find-generic-password -a persisty -s "Persisty Stripe secret key" -w) ~/.deno/bin/deno test --allow-env --allow-net --allow-read supabase/functions/delete-account/stripe_test.ts
```
Expected: FAIL. Se a chave do Keychain não for de teste, pare e avise o usuário.

- [ ] **Step 3: Implemente `deleteAccountDeps`**

Reaproveite `billingDeps(key)` (`user`, `customerOf`) e `retentionDeps(key)` (`hadEarlierSubscription`, `stripe`). Cada dependência:
- **`isPhoneSession`:** cliente com o token do usuário, `rpc("my_session_is_phone")`, `=== true`. Um erro vira exceção, como em `issue-license/index.ts`.
- **`scope`:** `service.rpc("account_deletion_scope", { p_user })`, convertido para camelCase.
- **`computers`:** `service.from("devices").select("id", { count: "exact", head: true }).eq("user_id", id).is("revoked_at", null)`.
- **`subscriptions`:**
  - `service.from("subscriptions").select("org_id, plan, stripe_subscription_id").in("org_id", orgIds).in("status", LIVE).not("stripe_subscription_id", "is", null)`;
  - o cliente vem de `customerOf`, e linhas sem cliente ficam de fora;
  - `enterprise` vira `"team"`;
  - a ordem segue a de `orgIds`.
- **`deleteOrg`:** `service.from("orgs").delete().eq("id", orgId).eq("kind", "team")`.
- **`deleteUser`:** `service.auth.admin.deleteUser(id)`. Um erro de usuário inexistente (status 404) conta como feito.
- **`send`:**
  - sem `RESEND_API_KEY`, `console.error("[delete-account] RESEND_API_KEY is not set")` e `false`;
  - senão, `sendEmail` dentro de `try`. Uma falha registra só o status e devolve `false`.
- **`signedInAt`:** `sessionSignedInAt`.
- **`now`:** `Date.now`.

Crie o `index.ts`, com duas linhas de comentário de cabeçalho como as de `retention/index.ts`:
```ts
serveBilling("delete-account", handleDeleteAccount, deleteAccountDeps);
```
Não precisa de entrada em `config.toml`: o `verify_jwt` padrão é o mesmo de `retention`.

- [ ] **Step 4: Rode e confira que passa**

Run: o comando do Step 2, e depois `~/.deno/bin/deno test --allow-env --allow-net --allow-read supabase/functions/`.
Expected: PASS nos dois.

- [ ] **Step 5: Commit**

```bash
cd APP && git add supabase/functions/_shared/billing_deps.ts supabase/functions/delete-account/index.ts supabase/functions/delete-account/stripe_test.ts
git commit -m "feat(account): the delete-account function wired to the database, Stripe and Resend"
```

---

### Task 6: As regras do site (`src/lib/deletion.ts`)

**Files:**
- Create: `SITE/src/lib/deletion.ts`
- Create: `SITE/tests/deletion.test.ts`

**Interfaces:**
- Consumes:
  - o contrato HTTP da Task 4;
  - `BillingState` de `src/lib/billing.ts`, `Currency` de `src/lib/pricing.ts`, `AuthErrorKey` e `authErrorKey` de `src/lib/auth.ts`, e `supabase` de `src/lib/supabase.ts`.
- Produces:
  ```ts
  export const FRESH_MS = 10 * 60_000;
  export const DELETED_KEY = "persisty.deleted"; // sessionStorage: { email: string; sent: boolean }
  export type DeletionAction = "preview" | "delete";
  export type DeletionErrorKey = "network" | "stale" | "forbidden" | "unknown";
  export interface DeletionPreview {
    email: string; computers: number; fresh: boolean;
    subscriptions: { plan: "pro" | "team"; team: string | null; refund: { amount: number; currency: Currency } | null }[];
    ownedTeams: string[]; memberTeams: string[];
  }
  export type GoneLine =
    | { kind: "account"; email: string; computers: number }
    | { kind: "subscription"; plan: "pro" | "team"; refund: { amount: number; currency: Currency } | null }
    | { kind: "teams"; names: string[] }
    | { kind: "membership"; name: string };
  export type RecapItem = { kind: "account" } | { kind: "plan"; plan: "pro" | "team" } | { kind: "team"; name: string };
  export interface DeletionAuth {
    accessToken: () => Promise<string | null>;
    sendCode: (email: string) => Promise<AuthErrorKey | null>;
    verifyCode: (email: string, code: string) => Promise<AuthErrorKey | null>;
    signOut: () => Promise<void>;
  }
  export function readPreview(data: Record<string, unknown>): DeletionPreview;
  export function deletionErrorKey(status: number, code: string): DeletionErrorKey;
  export function deletion(action: DeletionAction, locale: Locale): Promise<{ ok: true; data: Record<string, unknown> } | { ok: false; error: DeletionErrorKey }>;
  export function signedInAt(accessToken: string): number;  // seconds, the newest `amr` timestamp; 0 when unreadable
  export function isFresh(accessToken: string, nowMs: number): boolean;
  export function goneLines(p: DeletionPreview): GoneLine[];
  export function recapItems(p: DeletionPreview): RecapItem[];
  export function paysSomething(billing: BillingState): boolean;
  export function cancelTarget(billing: BillingState): { orgId?: string; plan: "pro" | "team"; duplicate: boolean } | null;
  export const supabaseAuth: DeletionAuth;
  ```

- [ ] **Step 1: Escreva os testes que falham** (`tests/deletion.test.ts`)

Para os tokens, monte um JWT falso com `base64url(JSON.stringify(claims))` na parte do meio.

```ts
it("reads the sign-in time from amr, not from when the token was renewed", ...);
// claims { iat: now, amr: [{ method: "otp", timestamp: now - 3 * 3600 }] } ⇒ signedInAt = now - 3*3600; isFresh(token, now*1000) === false
it("counts a code sign-in from 9 minutes ago as recent and 11 as not", ...);
it("an unreadable token is never recent", ...);                     // signedInAt("x.y.z") === 0
it("lists what goes: the account, each plan, the owned teams in one line, then each membership", ...);
// preview { email: "a@example.test", computers: 2, subscriptions: [{ plan: "pro", team: null, refund: null }, { plan: "team", team: "Acme", refund: { amount: 990, currency: "BRL" } }],
//           ownedTeams: ["Acme", "Beta"], memberTeams: ["Gama"] } ⇒
// [{ kind: "account", email: "a@example.test", computers: 2 }, { kind: "subscription", plan: "pro", refund: null },
//  { kind: "subscription", plan: "team", refund: { amount: 990, currency: "BRL" } }, { kind: "teams", names: ["Acme", "Beta"] }, { kind: "membership", name: "Gama" }]
it("a free account with no team only loses the account", ...);    // ⇒ [{ kind: "account", ... }]
it("the recap names the account, the plans and the owned teams, never people", ...);
// same preview ⇒ [{ kind: "account" }, { kind: "plan", plan: "pro" }, { kind: "plan", plan: "team" }, { kind: "team", name: "Acme" }, { kind: "team", name: "Beta" }]
it("reads the preview the function sends", ...);                    // snake_case JSON ⇒ DeletionPreview; currency "brl" ⇒ "BRL"
it("maps the function's errors", ...);                             // (0,"")→"network"; (403,"stale_sign_in")→"stale"; (403,"forbidden")→"forbidden"; (500,"internal")→"unknown"
it("pays something: a managed Stripe plan or a personal Stripe subscription", ...); // a hand-granted plan (stripe_subscription_id null) ⇒ false
it("the cancel shortcut goes to the plan in effect, then to the personal subscription, never to one already ending", ...);
// manages + stripe sub not ending ⇒ { orgId: entitlement.org_id, plan, duplicate: false }; that one ending and a personal one live ⇒ { orgId: personal.org_id, plan: "pro", duplicate: true }; both ending ⇒ null
```

- [ ] **Step 2: Rode e confira que falham**

Run: `cd SITE && export PATH="$HOME/.nvm/versions/node/v24.18.0/bin:$PATH" && node_modules/.bin/vitest run tests/deletion.test.ts`
Expected: FAIL (`src/lib/deletion.ts` não existe).

- [ ] **Step 3: Implemente `src/lib/deletion.ts`**
- **`deletion()`:** segue `retention()` em `src/lib/retention.ts`, com `functions.invoke("delete-account", { body: { action, locale } })` e o mesmo jeito de ler o erro.
- **`cancelTarget`:** usa as mesmas condições do `BillingPanel` (`manages`, `stripe_subscription_id`, `cancel_at_period_end`, `personal`).
- **`supabaseAuth`:**
  - `accessToken` = `(await supabase().auth.getSession()).data.session?.access_token ?? null`;
  - `sendCode` = `signInWithOtp({ email, options: { shouldCreateUser: false } })`;
  - `verifyCode` = `verifyOtp({ email, token: normalizeCode(code), type: "email" })`;
  - nos dois, um erro vira `authErrorKey(err)`;
  - `signOut` = `supabase().auth.signOut()`.

- [ ] **Step 4: Rode e confira que passa**

Run: o comando do Step 2, e depois `node_modules/.bin/vitest run`.
Expected: PASS, e os 243 testes de antes continuam passando.

- [ ] **Step 5: Commit**

```bash
cd SITE && git add src/lib/deletion.ts tests/deletion.test.ts
git commit -m "feat(account): what deleting the account takes, read from the function"
```

---

### Task 7: Os textos e o modal `DeleteFlow`

**Files:**
- Modify: `SITE/messages/{pt-BR,en,es}/auth.json`:
  - acrescentar `account.delete.*`;
  - acrescentar `meta.deleted`, com "Conta excluída", "Account deleted" e "Cuenta eliminada".
- Create: `SITE/src/components/account/delete/DeleteFlow.tsx`
- Create: `SITE/src/components/account/delete/delete.module.css`
- Create: `SITE/scripts/shots/delete.mjs`
- Temporário, sem commit: `SITE/src/app/[locale]/delete-preview/page.tsx` (fixture, como o `/cancel-preview` do cancelamento)

**Interfaces:**
- Consumes:
  - da Task 6: `deletion`, `readPreview`, `goneLines`, `recapItems`, `isFresh`, `DeletionAuth`, `supabaseAuth` e `DELETED_KEY`;
  - `CancelMascot` e `CancelMood` de `src/components/account/cancel/`;
  - `cancel.module.css` (frame, coluna, título, rodapé);
  - `isValidCode` de `src/lib/auth.ts`.
- Produces:
  ```tsx
  export function DeleteFlow(props: {
    onClose: () => void;
    /** Opens the existing cancelling dialog instead; absent when there is nothing to cancel. */
    onCancelInstead?: () => void;
    api?: typeof deletion;     // fixtures pass a stand-in
    auth?: DeletionAuth;       // fixtures pass a stand-in
  }): JSX.Element;
  ```
  Depois de excluir: `sessionStorage[DELETED_KEY] = JSON.stringify({ email, sent })` dentro de `try`, depois `auth.signOut()`, depois `router.replace("/account-deleted")`, com o `useRouter` de `@/i18n/navigation`.

- [ ] **Step 1: Escreva os textos em pt-BR** (`messages/pt-BR/auth.json`, em `account.delete`), exatamente assim:

```json
{
  "sectionTitle": "Excluir conta",
  "sectionBody": "Apaga a conta e encerra a assinatura. O Persisty continua grátis no seu computador.",
  "sectionBodyFree": "Apaga a conta. O Persisty continua grátis no seu computador.",
  "open": "Excluir conta",
  "step": "{n} de 2",
  "close": "Fechar",
  "loading": "Carregando…",
  "say": { "what": "Antes de ir, veja o que muda.", "code": "Falta só o código.", "confirm": "Falta só confirmar.", "busy": "Só um instante." },
  "whatTitle": "Excluir sua conta",
  "whatLead": "É imediato e não dá para desfazer.",
  "goneTitle": "É excluído",
  "gone": {
    "account": "A conta <b>{email}</b> e o acesso nos {count} computadores",
    "accountOne": "A conta <b>{email}</b> e o acesso no computador",
    "accountNone": "A conta <b>{email}</b>",
    "subscription": "A assinatura {plan}, encerrada hoje, sem reembolso do período restante",
    "subscriptionRefund": "A assinatura {plan}, encerrada hoje, com os {amount} pagos de volta no cartão",
    "team": "O Time <b>{name}</b> e as contas de quem participa só dele",
    "teams": "Os Times <b>{names}</b> e as contas de quem participa só deles",
    "membership": "Sua participação no Time <b>{name}</b>"
  },
  "keptTitle": "Continua com você",
  "kept": "Projetos, sessões e histórico ficam no seu computador. O Persisty segue no plano grátis, sem conta.",
  "cancelInstead": "Só quer parar de pagar? Cancele a assinatura",
  "continue": "Continuar",
  "codeTitle": "Confirme que é você",
  "codeLead": "Mandamos um código para <b>{email}</b>. Ele vale por 10 minutos.",
  "codeLabel": "Código",
  "resendIn": "Mandar outro em {seconds} s",
  "resend": "Mandar outro",
  "confirmTitle": "Confirme a exclusão",
  "confirmLead": "Você entrou com um código agora há pouco, então não precisa de outro.",
  "recapOne": "Ao confirmar, <b>{items}</b> é excluída na hora.",
  "recapMany": "Ao confirmar, <b>{items}</b> são excluídos na hora.",
  "recapItem": { "account": "a conta", "plan": "a assinatura {plan}", "team": "o Time {name}" },
  "back": "Voltar",
  "submit": "Excluir conta",
  "busy": "Excluindo…",
  "wrongCode": "Esse código não confere. Use o último que chegou.",
  "failed": "Não deu para terminar agora. Sua conta continua aqui. Tente de novo em instantes.",
  "loadError": "Não deu para carregar agora. Tente de novo em instantes.",
  "deletedTitle": "Sua conta foi excluída",
  "deletedSent": "A confirmação foi para <b>{email}</b>.",
  "deletedFree": "No seu computador, o Persisty continua funcionando no plano grátis.",
  "home": "Ir para o início"
}
```

Traduza as mesmas chaves para en e es, no tom do site. `rateLimited` e `network` reaproveitam `auth.signIn.errors`.

O Supabase responde `otp_expired` tanto para código errado quanto para código vencido. Os dois mostram `wrongCode`, e essa é a decisão deste plano para a frase "Para código vencido, usa a mensagem que o login já tem" do spec.

- [ ] **Step 2: Confira que o catálogo continua igual nos três idiomas**

Run: `cd SITE && node_modules/.bin/vitest run tests/messages.test.ts tests/copy.test.ts`
Expected: PASS.

- [ ] **Step 3: Implemente `DeleteFlow`**

Use o `<dialog>` e o frame do `CancelFlow`: `CancelMascot` à esquerda; "{n} de 2" e o X no topo; o título focado a cada passo; o rodapé com os botões. Os textos de cada passo e estado são os das seções 2 a 4 do spec.

- **Ao abrir:** o modal chama `api("preview", locale)`.
  - Enquanto carrega, mostra `loading`.
  - Se falhar, mostra `loadError` com o X.
- **Passo 1:**
  - as linhas de `goneLines`:
    - a conta usa `account`, `accountOne` ou `accountNone` conforme `computers`;
    - a assinatura usa `subscriptionRefund` quando há `refund`, com `formatPrice(locale, amount, currency, { explicit: true })`;
    - os Times usam `team` com um nome só, e `teams` com mais de um, com os nomes juntados por `Intl.ListFormat(locale, { type: "conjunction" })`;
  - o grupo `kept`;
  - o link `cancelInstead`, só se houver `onCancelInstead`;
  - o botão de contorno coral `continue`, com `buttonClass("danger", "md")`.
- **"Continuar":**
  - lê `auth.accessToken()`;
  - se `isFresh(token, Date.now())`, vai à forma sem código;
  - senão, chama `auth.sendCode(email)`, inicia a contagem de 60 s e vai à forma com código. Um `rateLimited` aparece como erro, e a contagem começa do mesmo jeito.
- **Forma com código:** um campo só, com `autoComplete="one-time-code"`, `inputMode="numeric"`, mono só nos dígitos e o espaçamento de `.code` em `auth.module.css`. O botão "Excluir conta" (coral sólido) fica desativado até `isValidCode(code)`. Abaixo do campo aparece `resendIn` durante a contagem e o link `resend` quando ela acaba. O link manda outro código e reinicia os 60 s.
- **"Excluir conta":**
  - **Com código:** primeiro chama `auth.verifyCode`. `expired` ou `unknown` mostram `wrongCode`; os outros erros usam `auth.signIn.errors`.
  - **Depois:** chama `api("delete", locale)`.
    - `stale` troca para a forma com código e manda um código.
    - Outro erro mostra `failed` e deixa o botão de novo ativo.
    - Sucesso faz o caminho de "Produces".
- **Enquanto exclui (`busy`):**
  - o botão mostra `busy`, com o `Loader2`;
  - o X some;
  - `onCancel` faz `preventDefault()` sem fechar;
  - o clique fora não fecha;
  - o balão mostra `say.busy`.
- **Clique duplo:** use a mesma proteção do `CancelFlow` (`shownAt`), para um clique duplo em "Continuar" não confirmar o passo 2.
- **Humores do mascote:** `puzzled` no passo 1, `pleading` no passo 2.
- **No celular:** folha de baixo, como `cancel.module.css` já faz abaixo do seu ponto de quebra. O passo 1 com quatro linhas cabe sem rolagem em 840 × 488.
- **Estilos:** o `delete.module.css` tem só o que é novo (os dois grupos, o campo, a última linha), com os tokens.

- [ ] **Step 4: Crie a fixture temporária e o roteiro de navegador**

A fixture `src/app/[locale]/delete-preview/page.tsx` não vai para o commit. Ela renderiza `<DeleteFlow>` com stand-ins:
- `api.preview` devolve o caso de dono de Team, com 2 computadores e uma assinatura Team sem reembolso;
- com `?refund=1`, devolve reembolso de 990 BRL;
- `?fresh=1` faz `accessToken` devolver um token com `amr` de agora;
- `verifyCode("000000")` devolve `expired`;
- `api.delete` espera 1,5 s e, com `?fail=1`, devolve `unknown`.

O `scripts/shots/delete.mjs` segue `scripts/shots/cancel.mjs`. Em desktop e no celular, ele:
- abre o modal;
- captura o passo 1, confere que cabe sem rolagem e que não há rolagem lateral;
- clica "Continuar" e captura o passo 2 com código;
- digita `000000` e "Excluir conta", captura o erro e confere o texto de `wrongCode`;
- digita `123456`, clica e captura o estado "Excluindo…". Nesse estado, `Escape` não fecha e o X não existe;
- com `?fail=1`, captura a falha;
- com `?fresh=1`, captura o passo 2 sem código;
- num modal parado, confere que `Escape` fecha e o foco volta.

Run:
```bash
cd SITE && node_modules/.bin/next build && (node_modules/.bin/next start -p 3123 &) && sleep 4 && node scripts/shots/delete.mjs http://localhost:3123 /private/tmp/claude-501/-Users-maiconwagnerdossantos-Documents-Projetos-Persist-persist-landingpage/776ca16d-ed66-4fd4-9667-ce19883b7b5e/scratchpad/delete-shots; lsof -ti tcp:3123 | xargs kill
```
Expected: todas as linhas `ok` e nenhuma `not ok`. Olhe as capturas contra o esboço v8 (`.superpowers/brainstorm/88429-1794258937/content/delete-flow-v8.html`) e os anti-objetivos.

- [ ] **Step 5: Rode lint, tipos e testes**

Run: `cd SITE && node_modules/.bin/next typegen && node_modules/.bin/tsc --noEmit && node_modules/.bin/eslint && node_modules/.bin/vitest run`
Expected: tudo PASS.

- [ ] **Step 6: Commit**, sem a fixture.

```bash
cd SITE && git add messages/pt-BR/auth.json messages/en/auth.json messages/es/auth.json src/components/account/delete/DeleteFlow.tsx src/components/account/delete/delete.module.css scripts/shots/delete.mjs
git status --short   # the delete-preview fixture must still show as untracked, not staged
git commit -m "feat(account): the account deletion dialog, in two steps beside the mascot"
```

---

### Task 8: Onde fica — a seção, `/account/delete` e a página de depois

**Files:**
- Create: `SITE/src/components/account/delete/DeleteSection.tsx`
- Create: `SITE/src/components/account/delete/Deleted.tsx`
- Modify: `SITE/src/components/account/panels/Overview.tsx` (prop `openDelete?: boolean`, e `<DeleteSection open={openDelete} />` como última seção)
- Create: `SITE/src/app/[locale]/account/delete/page.tsx`
- Create: `SITE/src/app/[locale]/account-deleted/page.tsx`
- Modify: `SITE/src/app/robots.ts` (somar `localizedPath(l, "/account-deleted")` a `privatePaths`)

**Interfaces:**
- Consumes:
  - da Task 7: `DeleteFlow`;
  - da Task 6: `paysSomething`, `cancelTarget` e `DELETED_KEY`;
  - `CancelFlow`, `useAccount` e `planSummary`.
- Produces:
  - `export function DeleteSection({ open }: { open?: boolean }): JSX.Element`;
  - `export function Deleted(): JSX.Element`.

- [ ] **Step 1: Implemente `DeleteSection`**

É a última seção da página inicial de Minha conta, no mesmo ritmo das outras seções do `Overview`:
- título `sectionTitle`;
- frase `sectionBody`, ou `sectionBodyFree` quando `!paysSomething(billing)`;
- botão `open` em `buttonClass("danger", "md")`.

O estado do modal começa em `open`.
- **Fechar o `DeleteFlow`:** se a página veio de `/account/delete`, `router.replace("/account")`.
- **O link "Cancele a assinatura":** fecha o `DeleteFlow` e abre o `CancelFlow` com `cancelTarget(billing)` e `teamName = planSummary(billing)?.viaTeam`. Ao fechar o `CancelFlow`, `reloadBilling()` se algo mudou.
- **Sem `cancelTarget`:** `onCancelInstead` fica `undefined`.

- [ ] **Step 2: Crie `/account/delete`**

A página fica igual à de `src/app/[locale]/account/page.tsx` (mesmo `generateMetadata` com `robots: { index: false }`), mas renderiza `<Overview openDelete />`. Sem login, o `AccountProvider` já manda para `/sign-in?next=/account/delete` e volta para cá.

- [ ] **Step 3: Crie a página de depois e `Deleted`**

A página `account-deleted/page.tsx` fica fora do layout de `/account`:
- `generateMetadata` com `t("deleted")` de `auth.meta` e `robots: { index: false }`;
- no corpo, `<Deleted />` dentro de `container`.

O `Deleted` é client:
- lê e remove `sessionStorage[DELETED_KEY]` dentro de `try`;
- mostra `CancelMascot` com `mood="settled"` e `line=""`, mais o título `deletedTitle`;
- mostra `deletedSent` só quando `sent === true` e há `email`, seguido de `deletedFree`;
- tem o botão lima `ButtonLink href="/"` com `home`;
- a página fica fora do sitemap (`PAGES` em `src/app/sitemap.ts` não muda).

- [ ] **Step 4: Verifique no navegador**

Acrescente a `scripts/shots/delete.mjs` duas capturas, em desktop e celular:
- a página `/account-deleted`, com `sessionStorage` preenchido e vazio;
- a seção no fim de `/account`. Use a fixture da Task 7 estendida com um `AccountContextProvider` falso, como as capturas de Minha conta.

Confira que `/account-deleted` responde 200 e tem `<meta name="robots" content="noindex">`.

Run: o mesmo comando da Task 7, Step 4.
Expected: todas as linhas `ok`.

- [ ] **Step 5: Rode lint, tipos e testes**

Run: `cd SITE && node_modules/.bin/next typegen && node_modules/.bin/tsc --noEmit && node_modules/.bin/eslint && node_modules/.bin/vitest run && node_modules/.bin/next build`
Expected: tudo PASS. A tabela de rotas do build mostra `/[locale]/account/delete` e `/[locale]/account-deleted`.

- [ ] **Step 6: Commit**

```bash
cd SITE && git add src/components/account/delete/DeleteSection.tsx src/components/account/delete/Deleted.tsx src/components/account/panels/Overview.tsx "src/app/[locale]/account/delete/page.tsx" "src/app/[locale]/account-deleted/page.tsx" src/app/robots.ts scripts/shots/delete.mjs
git commit -m "feat(account): deleting the account from My account, at /account/delete, and the page after"
```

---

### Task 9: Os textos legais

**Files:**
- Modify: `SITE/content/legal/{pt-BR,en,es}/privacy.md`:
  - `description` (linha 3);
  - o parágrafo da LGPD (linha ~55);
  - `updated`.
- Modify: `SITE/content/legal/{pt-BR,en,es}/terms.md` (o parágrafo da cobrança, linha ~32, e `updated`)

**Interfaces:** nenhuma.

- [ ] **Step 1: Mude a Política de Privacidade em pt-BR**

Na `description`, troque "como pedir que sejam apagados" por "como apagar a conta". O parágrafo da LGPD passa a ser exatamente:

```
Pela LGPD, você pode pedir acesso aos seus dados e a correção deles. A conta você mesmo exclui, a qualquer momento, em Minha conta: os dados pessoais são apagados na hora, e ficam só os registros de pagamento que a lei manda guardar, no Stripe, e números agregados que não identificam ninguém. Consultamos esses registros só para saber se uma compra é a primeira, por causa do reembolso dos 7 dias. Excluir a conta do dono de um Time apaga também o Time e as contas de quem participa só dele; essas pessoas recebem um aviso por e-mail.
```

A linha `{{contact}}` logo abaixo continua.

- [ ] **Step 2: Mude os Termos em pt-BR**

Logo depois de "…o valor pago volta para o cartão e o plano termina na hora.", acrescente:

```
Você também pode excluir a conta em Minha conta: a assinatura termina na hora, e o período em curso não é reembolsado, salvo nos 7 dias da primeira compra. A primeira compra conta por e-mail, também depois de excluir uma conta. Excluir a conta do dono de um Time exclui também o Time e as contas de quem participa só dele.
```

- [ ] **Step 3: Traduza para en e es**

Use o mesmo sentido, frase por frase, no tom dos arquivos de cada idioma. `updated: 2026-11-10` nos seis arquivos, ou a data do dia em que for publicar.

- [ ] **Step 4: Rode os testes de conteúdo e build**

Run: `cd SITE && node_modules/.bin/vitest run tests/content.test.ts tests/copy.test.ts && node_modules/.bin/next build`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
cd SITE && git add content/legal
git commit -m "copy(legal): deleting the account yourself, what stays with Stripe, and the team owner's rule"
```

---

### Task 10: De ponta a ponta, a sessão do app e o pacote para aprovação (sem deploy)

**Files:**
- Create: `APP/scripts/cloud/smoke-delete-account.mjs`

**Interfaces:**
- Consumes: tudo das Tasks 1 a 9.

- [ ] **Step 1: Escreva o teste de ponta a ponta local**

O `smoke-delete-account.mjs` segue `scripts/cloud/smoke-billing.mjs`, mas aponta para o Supabase **local**:
- URL e chaves de `supabase status -o json`;
- Stripe com `sk_test_` do Keychain;
- `RESEND_API_KEY` ausente, para não mandar e-mail.

Ele cria, pela API admin e por inserts com a chave de serviço, os casos de "Pronto quando" do spec e confere cada um:
1. **Conta grátis:** `delete` → 200, e o usuário não existe mais.
2. **Pro pessoal pago agora** (preço de teste, cartão de teste):
   - o `preview` mostra o reembolso;
   - o `delete` reembolsa, encerra a assinatura e apaga.
3. **A mesma pessoa refaz a conta com o mesmo e-mail e compra:**
   - o `preview` diz `refund: null`;
   - o `status` do `retention` também diz `refund: null`.
4. **Dona de Team com três membros:** B só no Time, C com assinatura pessoal ativa, D em outro Time.
   - B some;
   - C e D continuam, sem o Time;
   - o Time some;
   - o webhook de teste (`stripe trigger` ou um evento assinado como em `smoke-billing.mjs`) responde 200.
5. **Membro comum exclui a própria conta:** o Time continua.

**Os tokens de cada pessoa:** `auth.admin.generateLink({ type: "magiclink", email })` dá o `email_otp`, e `verifyOtp({ email, token, type: "email" })` dá uma sessão com `amr` de agora. É o mesmo caminho do código por e-mail.

Dois casos do spec ficam nos testes determinísticos, não neste teste:
- o login com mais de 10 minutos, coberto pela Task 4 (`stale_sign_in`) e pela Task 6 (`amr`);
- a falha do Stripe no meio, com a nova tentativa, coberta pela Task 4.

Forçar os dois contra serviços reais pediria esperar 10 minutos ou derrubar o Stripe no meio de uma chamada.

O fim apaga tudo o que criou, no Stripe de teste e no banco local.

- [ ] **Step 2: Rode localmente**

Abra o Docker.app antes.

Run:
```bash
cd APP && PATH=/opt/homebrew/bin:$PATH supabase start && PATH=/opt/homebrew/bin:$PATH supabase db reset --local && (PATH=/opt/homebrew/bin:$PATH supabase functions serve --env-file <(printf 'STRIPE_SECRET_KEY=%s\n' "$(security find-generic-password -a persisty -s 'Persisty Stripe secret key' -w)") &) && sleep 8 && node scripts/cloud/smoke-delete-account.mjs; PATH=/opt/homebrew/bin:$PATH supabase stop
```
Expected: todas as linhas `ok`, nenhuma `not ok`, e o Stripe de teste sem nada do teste no fim.

Se o Docker não subir, pare e avise o usuário. Não rode o teste contra produção.

- [ ] **Step 3: Commit do teste**

```bash
cd APP && git add scripts/cloud/smoke-delete-account.mjs
git commit -m "test(account): deleting the account end to end on a local Supabase with Stripe's test mode"
```

- [ ] **Step 4: Confirme com a sessão do app** (seção 7 do spec)

Mande para a sessão do app, pela mensagem entre sessões, o texto abaixo, e registre a resposta:

> O site vai ter a exclusão de conta em `https://persisty.app/account/delete` (branch `feat/account-deletion` no app e no site, ainda sem deploy). Duas perguntas:
> 1. Quando a conta do Persisty é apagada, o app do computador volta ao plano grátis na hora, ou fica até 14 dias no Pro pela licença sem internet? A frase "O Persisty segue no plano grátis, sem conta" depende disso.
> 2. O Remote no celular vai abrir esse endereço para a exclusão (o pedido da Apple). Está bom assim?
>
> A função nova é `delete-account`, e a migração `20261110120000_account_deletion.sql` está no worktree `.claude/worktrees/account-deletion`. Nada disso foi aplicado.

Se o app ficar no Pro depois da exclusão, a publicação espera a correção do lado do app. Avise o usuário.

- [ ] **Step 5: Monte o pacote para o usuário aprovar**

O pacote, numa mensagem só:
- as capturas da Task 7 e da Task 8: desktop e celular, cada passo e estado, as duas formas do passo 2, a seção em Minha conta e a página de depois;
- os textos novos do site nos três idiomas;
- os dois e-mails nos três idiomas, gerados por `confirmationMail` e `noticeMail`;
- o antes e depois da Política e dos Termos nos três idiomas;
- a resposta da sessão do app;
- a lembrança da linha 61 da Política (avisar por e-mail mudanças no que guardamos), que é decisão do usuário.

Pergunte se pode publicar. Depois das capturas, apague a fixture `src/app/[locale]/delete-preview/` (ela nunca entrou no git) e rode `node_modules/.bin/next typegen`.

---

### Task 11: Publicar (só depois do ok explícito do usuário, no momento)

**Files:** nenhum novo.

- [ ] **Step 1: Peça ao usuário a chave do Resend**

Peça que ele crie no painel do Resend uma chave de API só de envio ("Sending access", domínio `persisty.app`). Ele mesmo guarda a chave no painel do Supabase, em Edge Functions › Secrets, com o nome `RESEND_API_KEY`, no projeto `ytmpopebhdtnucdznfsz`.

A chave nunca passa por esta conversa nem por um comando com `!`, que deixaria a chave no histórico.

Depois, confirme só que o nome existe: `PATH=/opt/homebrew/bin:$PATH supabase secrets list --project-ref ytmpopebhdtnucdznfsz | grep RESEND_API_KEY`.

- [ ] **Step 2: Aplique a migração e publique as funções**

Faça isso no worktree do app, só com o ok do usuário:
```bash
cd APP && PATH=/opt/homebrew/bin:$PATH supabase db push && PATH=/opt/homebrew/bin:$PATH supabase functions deploy delete-account && PATH=/opt/homebrew/bin:$PATH supabase functions deploy retention
```
Expected: a migração `20261110120000` aplicada e as duas funções publicadas.

- [ ] **Step 3: Junte o app e o site**

- **App:** merge de `feat/account-deletion` em `main` e push com o token inline. Avise a sessão do app.
- **Site:** merge de `feat/account-deletion` em `main` e push com o token inline, como em `publishing-the-site`. Confira o deploy com `vercel inspect`, sem `curl` em `persisty.app`.

- [ ] **Step 4: Prova em produção, sem cobrar ninguém**

Com uma conta grátis de teste criada para isso (`@example.test` não recebe código, então use um endereço do usuário só com o ok dele):
1. abra `/account/delete`;
2. exclua a conta;
3. confira a página de depois;
4. confira que a conta não entra mais.

Conte ao usuário o resultado e o endereço para a sessão do app ligar o Remote.
