# Google Analytics no site, só com o consentimento da pessoa

Data: 2026-11-16. Decidido com o usuário nesta conversa.

## Intenção

O usuário quer medir o site (persisty.app) no Google Analytics: quantas pessoas chegam, de onde vêm e quantas baixam, criam conta e assinam. Hoje o site não mede nada, e a política de privacidade diz isso nos três idiomas ("o site não usa analytics nem cookies de rastreamento").

## Decisões do usuário

1. **Só o site e só o Google Analytics.** O app desktop e o PostHog ficam fora "por hora". O app continua sem telemetria, e o que a política e as docs dizem sobre ele não muda.
2. **Aviso de cookies para todo mundo (opção 2).** O GA só funciona depois que a pessoa clica em "Aceitar". O usuário pediu o "termo padrão".
3. **Eu crio a conta e a propriedade no GA**, pelo Chrome, na conta Google em que estão Eu Aqui, Kora etc. (`authuser=1`).

## Abordagens consideradas

| | Como funciona | Troca | |
|---|---|---|---|
| 1. Sem aviso | GA para todos, por legítimo interesse (como Kora e Meevia) | Mais dados e menos trabalho, mas risco legal com quem vem da Europa | descartada |
| **2. Aviso para todos** | Nada do Google carrega antes do "Aceitar" | Mais seguro e coerente com o discurso de privacidade do Persisty; perde as visitas de quem recusa ou ignora | **escolhida** |
| 3. Aviso só na Europa | País pela Vercel e região do Consent Mode | Quase todos os dados sem o risco, mas mais peças | descartada |

## Objetivos

- Visitas, origem (UTM, referenciador) e páginas no GA, de quem aceitou.
- Quatro eventos principais marcados como key events: **baixar**, **criar conta**, **começar assinatura** e **assinatura concluída**.
- A política de privacidade diz a verdade nos três idiomas, e a pessoa pode mudar de ideia a qualquer momento.

## Não-objetivos

- App desktop, PostHog, Google Ads, pixel da Meta, Tag Manager.
- Dados de receita (valor, moeda) no GA.
- Medir quem recusou ou não respondeu, nem por pings sem cookie.

## Anti-objetivos (falha mesmo que "funcione")

- **Qualquer requisição ao Google antes do "Aceitar"**, inclusive o download do `gtag.js`. (Por isso o Consent Mode "avançado", que manda pings sem cookie com o consentimento negado, não serve.)
- **"Recusar" mais difícil ou menos visível que "Aceitar".**
- **Aviso que volta a cada página ou a cada visita** depois que a pessoa escolheu.
- **E-mail, código de login ou outro dado pessoal num envio ao Google.**
- **GA medindo `next dev`, prévias da Vercel ou os testes.**
- **Queda no PageSpeed** ou layout que pula por causa do aviso.

## Restrições

- Next 16 com `next-intl` e páginas estáticas (`generateStaticParams`). O aviso não pode tornar as páginas dinâmicas: nada de `headers()` ou `cookies()` no servidor. A escolha é lida no navegador.
- Site só escuro. Os componentes seguem o `DESIGN.md`: pílulas, painel elevado com linha fina e Lucide.
- Ler o guia `node_modules/next/dist/docs/01-app/02-guides/third-party-libraries.md` antes de mexer em `next/script` (AGENTS.md).
- Textos em `messages/{pt-BR,en,es}` e `content/legal/{pt-BR,en,es}/privacy.md`. `tests/copy.test.ts` vale para eles.

## Como fica

### Conta no Google Analytics (feito por mim, no navegador)

- Conta **"Persisty"**. Compartilhamento de dados: só "Suporte técnico" ligado, os outros desligados.
- Propriedade **"Persisty Site"**, fuso America/Sao_Paulo, moeda BRL.
- Fluxo web **"Persisty Web"**, `https://persisty.app`. Na medição otimizada, "Alterações de página com base no histórico do navegador" fica desligada, porque a troca de página sai do código, com o endereço limpo (como no Kora).
- Retenção dos dados em 14 meses (o padrão é 2). Google Signals desligado.
- Key events: `download`, `sign_up`, `begin_checkout`, `checkout_done`. São criados pelo nome em "Eventos principais › Novo evento principal", antes do primeiro envio.
- O ID `G-…` é público e fica no código (`src/lib/site.ts`, como `GOOGLE_ANALYTICS_ID`), igual no site do Kora.

### O aviso

Uma barra presa ao pé da tela, no painel elevado (fundo night elevado, linha fina, canto de 14px), com largura máxima do container. Uma linha de texto, o link da política e dois botões **iguais** (pílula grafite, mesmo tamanho), lado a lado. Sem mascote: é um aviso de passagem, não um fluxo.

```
┌────────────────────────────────────────────────────────────────────────────┐
│ (c) Usamos o Google Analytics para saber como o site é usado, só se você      │
│     permitir. Política de privacidade                  [ Recusar ] [ Aceitar ]│
└────────────────────────────────────────────────────────────────────────────┘
```

(`(c)` = ícone `Cookie` do Lucide; nada de emoji.) No celular, o texto fica em cima e os dois botões embaixo, cada um com metade da largura.

| | pt-BR | en | es |
|---|---|---|---|
| Texto | Usamos o Google Analytics para saber como o site é usado, só se você permitir. | We use Google Analytics to see how the site is used, only if you allow it. | Usamos Google Analytics para saber cómo se usa el sitio, solo si lo permites. |
| Link | Política de privacidade | Privacy policy | Política de privacidad |
| Botões | Recusar · Aceitar | Decline · Accept | Rechazar · Aceptar |
| Rodapé | Cookies | Cookies | Cookies |

- Aparece só depois da hidratação, e só quando não há escolha salva. Por ser fixo, não empurra nada (CLS zero).
- Não bloqueia a página nem prende o foco. A navegação por teclado chega a ele. Ele tem `role="region"` com rótulo, e a animação de entrada respeita o movimento reduzido.
- **"Cookies" no rodapé** (coluna "Aprender", depois de "Privacidade") reabre o aviso a qualquer momento.

### A escolha

- Cookie `persisty_consent` com o valor `granted` ou `denied`, por 12 meses, `path=/`, `SameSite=Lax`, `Secure` em https. Ele entra na política como o terceiro cookie necessário.
- **Aceitar:** grava `granted` e carrega o GA na hora, sem recarregar a página.
- **Recusar:** grava `denied` e não carrega nada.
- **Mudar de "aceitar" para "recusar":** liga `window['ga-disable-G-…'] = true`, apaga os cookies `_ga` e `_ga_<id>` (no host e em `.persisty.app`) e não envia mais nada.
- Visitas seguintes com `granted` carregam o GA depois do `load` (`lazyOnload`, como no Kora), para não disputar a primeira pintura.

### O GA

- Só carrega quando estas três condições valem: `VERCEL_ENV === "production"` (lido no build, no servidor), o ID existe e a escolha é `granted`. Fora da produção, o aviso também não aparece.
- `gtag('config', ID, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 34128000 /* 13 meses */ })`.
- **Página vista:** um `page_view` por endereço, disparado pelo código na troca de rota do App Router. O endereço vai com a origem e o caminho, mais só os parâmetros liberados: `utm_*`, `gclid`, `gbraid`, `wbraid`, `fbclid`, `ref`. Esse mesmo endereço limpo vai como `page_location` de todo evento. `page_referrer` leva só a origem do site anterior.
- **Eventos:**
  - `download` com `platform` (`mac`, `windows`, `linux`), `kind` (`dmg`, `nsis`, `appimage`, `deb`) e `version`, no clique dos links que baixam o instalador. No site, esses links apontam direto para o arquivo no GitHub (`…/persisty-releases/releases/download/v<versão>/<arquivo>`).
  - `sign_up` (conta nova) ou `login` (conta existente), com `method: "email"`, depois do `verifyOtp` que deu certo. Conta nova = `created_at` do usuário nos últimos 10 minutos.
  - `begin_checkout` com `plan`, quando o `SubscribeButton` começa o checkout.
  - `checkout_done` com `plan` (quando der para saber), quando Minha conta abre com `?checkout=done`. Só uma vez por chegada.
- Nenhum evento leva e-mail, nome, id de usuário ou texto digitado. Antes do "Aceitar", os eventos são descartados, sem fila.

### Política de privacidade (três idiomas)

A seção "No site" passa a dizer:

- o site usa o Google Analytics **só se você aceitar** no aviso;
- o que ele mede: páginas vistas, de onde a visita veio, aparelho, navegador e região aproximada; e os quatro eventos;
- o que nunca vai ao Google: e-mail, nome e o que você digita;
- os cookies `_ga` e `_ga_<id>` duram até 13 meses, e os dados ficam 14 meses no GA;
- o Google atua como operador, com transferência para os EUA;
- como mudar de ideia: o link "Cookies" no rodapé;
- os cookies necessários passam a ser três: idioma, sessão da conta e a sua escolha sobre cookies.

A data de atualização da política muda. O usuário decide se manda o aviso por e-mail, como no cancelamento.

## Verificação

- Testes unitários (vitest) cobrem:
  - leitura e gravação da escolha;
  - o filtro do endereço;
  - nada carrega sem `granted`;
  - a revogação apaga os cookies.
- Prova no navegador com o build de produção servido localmente (`VERCEL_ENV=production`), interceptando `googletagmanager.com` e `*/g/collect` (respondendo 204, nunca abortando):
  1. sem escolha: zero requisições ao Google;
  2. "Recusar": continua zero;
  3. "Aceitar": `gtag.js` baixado e `page_view` com o endereço limpo;
  4. navegação pelo App Router: um `page_view` por página;
  5. "Cookies" → "Recusar": envios param e `_ga` some.
- Depois do deploy, aceito o aviso no persisty.app e confiro o Tempo real do GA.

## Fica para quem constrói

- O nome dos arquivos (sugestão: `src/lib/consent.ts`, `src/lib/analytics.ts`, `src/components/site/CookieNotice.tsx` + `.module.css`, `src/components/site/GoogleAnalytics.tsx`).
- Como reabrir o aviso pelo rodapé, que é componente de servidor (por exemplo, um botão cliente pequeno que dispara um evento de janela).
- Detalhes de animação dentro das regras do `DESIGN.md`.
