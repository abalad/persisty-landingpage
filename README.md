# Site do Persisty

Site público do [Persisty](https://github.com/abalad/persist): Home, Preços, Download, Docs, Changelog, conta do Persisty Cloud e páginas de privacidade, segurança e termos, em português (padrão), inglês e espanhol.

Next.js 16 (App Router) com `next-intl`, publicado na Vercel. As páginas são estáticas; a conta roda no navegador contra o Supabase do Persisty Cloud.

## Desenvolvimento

```bash
pnpm install
pnpm dev        # http://localhost:3000
pnpm test       # Vitest: mensagens, preços, conta, conteúdo, rotas de idioma
pnpm lint       # ESLint + TypeScript
pnpm build
```

O `pnpm dev` só enxerga arquivos de mensagens que existiam quando ele subiu: ao criar um namespace novo em `messages/<idioma>/`, reinicie o servidor.

## Onde mexer

| O quê | Onde |
| --- | --- |
| Textos da interface (3 idiomas) | `messages/<idioma>/<namespace>.json`, lista em `src/i18n/messages.ts` |
| Docs | `content/docs/<idioma>/<slug>.md` (mesmos slugs nos 3 idiomas) |
| Changelog | `content/changelog/<idioma>/<data>-<id>.md` |
| Privacidade, segurança, termos | `content/legal/<idioma>/*.md` (`{{contact}}` vira o e-mail de contato) |
| Planos e preços | `src/lib/plans.ts` |
| Liberar um download | `src/lib/releases.ts` (`status: "available"`, `url`, `version`) |
| Assinatura (Stripe) | `subscribe()` em `src/lib/site.ts`, hoje sem ação |
| Tokens visuais | `src/styles/tokens.css`, copiados de `packages/design-tokens` do app |

Os testes garantem que os três idiomas têm as mesmas chaves, as mesmas Docs e as mesmas entradas de Changelog.

## Variáveis de ambiente

Veja `.env.example`. Sem nenhuma variável o site funciona com os valores públicos do Persisty Cloud.

## Teste de ponta a ponta da conta

`scripts/e2e/account.mjs` entra pelo formulário real do site com uma conta descartável do Persisty Cloud e apaga a conta no fim. O envio do e-mail é o único passo simulado (o código vem da API admin). Precisa da chave secreta do projeto só no ambiente:

```bash
SECRET=$(supabase projects api-keys --project-ref ytmpopebhdtnucdznfsz --reveal -o json | …) \
  node scripts/e2e/account.mjs http://localhost:3000 /tmp
```

## Antes de divulgar

O e-mail do código de acesso sai pelo Resend ("Persisty <oi@persisty.app>", domínio verificado na região de São Paulo), configurado no Supabase pela integração do Resend em 2026-10-22. No plano gratuito do Resend o teto é de 100 e-mails por dia; o Supabase limita a 25 por hora.


- **E-mail de contato** em `NEXT_PUBLIC_CONTACT_EMAIL`.
- **Versões para baixar** em `src/data/releases.json`, escrito pelo passo "publicar" do app (`scripts/release/publish.mjs`), nunca à mão. Download, Todas as versões e `/download/latest/<mac|windows|linux>` saem dele.
