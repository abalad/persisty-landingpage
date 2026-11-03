# Cancelar o plano em Minha conta, com motivo e duas ofertas para ficar

Data: 2026-11-02. Decidido com o usuário nesta conversa (esboços no companheiro visual: `cancelar-fluxo`, `mascote-no-modal`).

## Intenção

Hoje quem paga cancela pelo portal do Stripe ("Gerenciar assinatura"), sem dizer por quê e sem que o Persisty tente nada. O usuário quer um cancelamento **nosso**, em Minha conta, que pergunte o motivo e se esforce para a pessoa desistir de cancelar: "dar ênfase para a pessoa não cancelar". O esforço vem de duas ofertas e do mascote do app, triste ou sem entender, animado, numa coluna do modal. O mascote ajuda a pessoa a desistir sem atrapalhar.

(Observação do levantamento: a conta do usuário no print não tem "Gerenciar assinatura" porque o plano dele foi liberado à mão por `scripts/cloud/grant-plan.sh`, sem assinatura no Stripe; não há o que cancelar ali.)

## Decisões do usuário

1. **Fluxo:** motivo (lista + campo opcional) → oferta de desconto → se recusar, oferta de 30 dias grátis → confirmar o cancelamento. "Seria isso."
2. **Desconto:** 25% por 60 dias.
3. **Segunda oferta:** mais 30 dias grátis no plano atual.
4. **Mascote:** em corpo inteiro, numa coluna própria do modal (opção C), triste ou equivocado conforme o passo, animado como os demais (3D), fazendo parte sem atrapalhar.
5. **Modal "realmente bem profissional".**
6. **Quem faz:** este trabalho também cobre a parte de cobrança no repositório do app (`persist-application/supabase`), feita aqui, não pela sessão do app.
7. **Reembolso automático nos 7 dias** (depois da revisão): dentro de 7 dias da primeira compra, cancelar devolve o valor pelo Stripe e encerra o plano na hora.
8. **Política de privacidade atualizada** (depois da revisão): o motivo e o texto opcional entram na lista do que guardamos, nos três idiomas; o usuário decide quando mandar o aviso por e-mail.
9. **O Stripe já cobra de verdade** (chave live com clientes reais); existe também a chave de teste. Testes de ponta a ponta usam só a de teste.

## Objetivos

- Quem gerencia uma assinatura paga no Stripe consegue cancelar em Minha conta em no máximo quatro passos, com o motivo registrado.
- Antes de cancelar, a pessoa vê o que perde e recebe as duas ofertas, cada uma no máximo uma vez.
- Quem aceita uma oferta continua no plano e vê na conta o que mudou (desconto ativo até tal data; próxima cobrança grátis).
- Quem cancela continua no plano até o fim do período pago e pode "Desfazer cancelamento" até lá.
- Os motivos, o texto opcional e o que a pessoa fez com cada oferta ficam guardados para o usuário ler.

## Não objetivos

- Painel para ler os motivos (o usuário lê pela tabela no Supabase).
- Mudar preços, planos, checkout ou o portal do Stripe além do necessário.
- Reembolso fora da janela de 7 dias da primeira compra, ou reembolso parcial.
- Cancelamento pelo app de desktop (o app abre Minha conta).

## Anti-objetivos (fracasso mesmo funcionando)

- **Dificultar a saída:** esconder o cancelar, pedir mais de quatro passos, exigir o motivo ou o texto, frase que culpe a pessoa ("Não, prefiro perder tudo"), contagem regressiva falsa, oferta que não existe. A regra brasileira de atendimento (Decreto 11.034/2022) pede que o cancelamento seja fácil e valha na hora pedida. Pode-se oferecer, não condicionar. (Cautela de quem constrói, não parecer jurídico.)
- **Mascote que irrita:** cobrindo botões, som, movimento que não para, tristeza exagerada. Ele expressa, o texto fica neutro.
- **Prometer o que o plano grátis não tira:** o texto do que se perde segue o produto (pontos gravados continuam restauráveis, pedidos na fila continuam valendo).
- **Parecer feito por IA:** vale o DESIGN.md (grafite, linhas finas, um lima, nada de degradê ou ilustração genérica).

## Constraints

- Site: Next.js 16 (ler `node_modules/next/dist/docs/` antes), next-intl em pt-BR/en/es com as mesmas chaves (`tests/messages.test.ts`), regras de copy (`tests/copy.test.ts`), sem prettier, `PRODUCT.md`/`DESIGN.md` atualizados.
- Cobrança: funções Deno em `persist-application/supabase/functions`, no padrão existente (`handler.ts` com dependências injetadas + `handler_test.ts` + `index.ts` com `serveBilling`; Stripe por HTTP em `_shared/stripe.ts`, sem SDK). Migração nova em `supabase/migrations`. Trabalho num git worktree do app (branch `feat/cancel-flow` a partir de `origin/main`), sem tocar na pasta de trabalho da sessão do app.
- **Deploy de função, migração e mudanças no Stripe (cupons) só com ok explícito do usuário no momento.** Push no `main` do site idem. Antes de publicar, comparação antes/depois e textos para o usuário aprovar.
- O webhook `stripe-webhook` já copia `cancel_at_period_end` e `current_period_end` para `subscriptions`; o site lê de lá.

## As partes

### 1. Quem vê "Cancelar assinatura"

- Em **Plano e cobrança**, sob o cartão do plano, um link discreto "Cancelar assinatura" para quem gerencia uma assinatura do Stripe que ainda não está marcada para terminar (`manages` e `stripe_subscription_id`). Para a assinatura pessoal paralela à de um time, o link fica na linha dela.
- Plano liberado à mão, membro de time que não gerencia: nada.
- Assinatura já marcada para terminar: no lugar, "Desfazer cancelamento" (volta a renovar), sem passar pelo fluxo.
- Dono de time: o mesmo fluxo, aplicado à assinatura do time (todos os assentos). O texto diz que o time inteiro volta ao grátis no fim do período.

### 2. O modal

- **Desktop:** duas colunas. À esquerda, o mascote 3D em corpo inteiro num painel um tom acima do fundo do modal; à direita, o passo. Largura em torno de 760px, altura que não muda entre os passos (o conteúdo troca sem o modal pular).
- **Celular:** a coluna vira uma faixa no topo com o mascote menor; os botões nunca saem da tela.
- **Acessibilidade:** `role="dialog"`, `aria-modal`, título ligado ao diálogo, foco preso dentro enquanto aberto, Esc fecha mantendo o plano, foco volta ao link que abriu. O mascote é decorativo (`aria-hidden`); cada passo diz em texto o que é. Com "reduzir movimento", o mascote fica parado em cada expressão e a troca de passo é instantânea.
- **Botões:** a ação de ficar ("Manter o Pro", "Aceitar o desconto", "Quero os 30 dias") é o pill lima; a de seguir cancelando é um link de texto sempre visível. Na confirmação, "Confirmar cancelamento" é um botão secundário (grafite), não escondido.
- **Indicador de passo** discreto (por exemplo "1 de 4"), sem números enormes.

### 3. Os passos e o mascote

1. **Motivo.** Título "Por que você quer cancelar?". Opções (uma só, nenhuma obrigatória):
   - está caro;
   - não uso o bastante;
   - faltou um recurso;
   - tive problemas com o app;
   - vou usar outra ferramenta;
   - outro motivo.

   Abaixo, um campo de texto livre opcional (até 1000 caracteres). Mascote: cabeça baixa, olhos meio fechados, a antena apagando.
2. **Desconto.** "25% por 60 dias": o preço novo calculado no idioma da pessoa (no Pro em reais, R$ 7,42 por mês nas duas próximas cobranças, depois volta a R$ 9,90), e uma lista curta do que ela perderia (três recursos do plano, com os nomes do catálogo). Mascote: levanta a cabeça, a antena acende.
3. **30 dias grátis.** "Mais 30 dias no Pro, sem pagar": a próxima cobrança não acontece. Se cancelar mesmo, continua a um clique. Mascote: mãos juntas, olhando para a pessoa.
4. **Confirmar.** O plano vale até a data do fim do período, depois volta ao grátis. Nada do que foi gravado se perde. Dá para desfazer até essa data. Mascote: triste, acena devagar.
   - **Dentro de 7 dias da primeira compra** (a primeira assinatura paga daquela organização, com o primeiro pagamento feito há menos de 7 dias): a confirmação muda. "Cancelar e receber o reembolso de {valor}" encerra o plano na hora e devolve o valor pago pelo Stripe. O texto diz quando o dinheiro volta ao cartão, conforme o prazo do Stripe, e que o plano termina agora. Não há "desfazer" depois disso. As ofertas continuam aparecendo antes, como para todos.
- **Ficar (em qualquer passo) ou aceitar uma oferta:** o mascote pula com os braços para cima (a comemoração que já existe) e o modal mostra a confirmação ("Pronto: 25% de desconto até 2 de janeiro"), depois fecha.
- **Ofertas já usadas:** uma oferta conta como usada quando é **aceita**, e vale uma vez por quem paga (a organização pessoal ou a do time), para sempre, mesmo que a pessoa assine de novo depois. Recusar ou fechar o modal não gasta a oferta: quem volta a tentar cancelar vê de novo as que não aceitou. Com as duas usadas, o fluxo vai do motivo direto para a confirmação. *(Decisão de quem constrói, depois da revisão: "uma vez" protege contra cancelar todo mês para ganhar desconto; contar só o aceite evita gravar a cada tela mostrada.)*
- **Assinatura pessoal paga junto com o plano de um time:** cancelar essa não tira nada enquanto o time durar. O fluxo pula a lista do que se perde e as duas ofertas, e vai do motivo para a confirmação, com o texto "Seu plano continua pelo time {nome}". *(Decisão de quem constrói: oferecer desconto para manter uma assinatura duplicada iria contra os anti-objetivos.)*

### 4. O mascote no modal

- O corpo inteiro do mascote 3D do app, com as cinco expressões acima: triste, esperançoso, pedindo, despedida e comemoração. Hoje o site tem o mascote espiando (`studio/buddy.ts`, do app) e o de corpo inteiro do estúdio (`studio/mascot.ts`). As poses novas são do site; se ficarem boas, a sessão do app pode levá-las para o app.
- Carrega só quando o modal abre (three.js sob demanda), dorme quando fecha. Sem WebGL, Save-Data ou aparelho fraco: uma imagem parada do mascote de corpo inteiro.

### 5. A cobrança (repositório do app)

- **Função nova** (nome a cargo de quem constrói), chamada pelo site com a sessão da pessoa, que confere se ela gerencia a assinatura (dono ou admin; pessoal = a própria). Ações:
  - **Situação:** quais ofertas ainda valem, a data do fim do período, se a primeira compra tem menos de 7 dias.
  - **Aceitar o desconto:** aplica à assinatura um cupom de 25% por 2 meses.
  - **Aceitar os 30 dias:** aplica um cupom de 100% por uma cobrança, ou outro meio equivalente do Stripe que dê 30 dias sem cobrar.
  - **Cancelar:** `cancel_at_period_end=true`, com o motivo também em `cancellation_details` do Stripe.
  - **Cancelar com reembolso** (só dentro dos 7 dias da primeira compra, conferido no servidor, nunca pelo que o site manda): cancela a assinatura na hora e reembolsa o pagamento dela pelo Stripe. A tabela registra o reembolso. O webhook já trata `customer.subscription.deleted`, e o plano sai do app na próxima conferência da licença.
  - **Desfazer:** `cancel_at_period_end=false`.
- **Tabela nova** com cada passagem pelo fluxo: quem, qual assinatura, plano, motivo, texto, ofertas mostradas, oferta aceita (ou cancelou), quando. A RLS não deixa clientes lerem nem escreverem nela diretamente. Ela também é a fonte de "oferta já usada".
- **Cupons** criados de forma idempotente em `scripts/cloud/stripe-setup.mjs` (como os preços), com os ids indo para os segredos da função.
- O portal do Stripe continua permitindo cancelar (fim do período): o caminho principal é o nosso, e o portal fica como saída simples. *(Decisão de quem constrói: a regra de cancelamento fácil pesa contra fechar a saída do portal.)*

### 6. Textos legais

- **Termos:** a cláusula que hoje manda pedir o reembolso dos 7 dias em suporte@persisty.app e cancelar no portal passa a dizer que se cancela em Minha conta e que, dentro de 7 dias da primeira compra, o reembolso é automático ao cancelar. Isso vale nos três idiomas, com a data de atualização nova.
- **Privacidade:** o motivo do cancelamento e o texto opcional entram na lista do que guardamos, com a finalidade de entender por que as pessoas saem. Vale nos três idiomas, com data nova. O e-mail de aviso às contas não sai por este trabalho: o usuário decide quando enviar.
- Os dois textos vão ao usuário para aprovar, junto com as capturas, antes de publicar.

### 7. Como testar sem cobrar ninguém

O projeto Supabase de produção usa a chave live do Stripe. Os testes de ponta a ponta rodam com a chave de **teste** (Keychain "Persisty Stripe secret key"), nunca contra a produção: Supabase local (`supabase start`, `supabase functions serve`) e Stripe em modo de teste, com os cupons de teste criados por `stripe-setup.mjs` sem `--live`. Se a chave restrita de teste não tiver permissão de escrever assinaturas, cupons e reembolsos, quem constrói avisa o usuário, que libera no painel do Stripe. Os cupons live só são criados com `--live` e com ok do usuário, no momento do deploy.

## O que fica com quem constrói

- Nomes da função, das ações, da tabela e das colunas; a forma exata de dar os 30 dias no Stripe.
- O desenho fino do modal e das poses (DESIGN.md e a skill impeccable), os textos nos três idiomas, a ordem dos motivos.
- Como o site mostra uma oferta aceita na conta (linha no cartão do plano).
- Testes: Deno para a função (como `create-checkout/handler_test.ts`), vitest para as regras do site, roteiro no navegador para o modal (teclado, Esc, foco, celular).

## Pronto quando

- `deno test` das funções passa no repositório do app; `vitest`, `tsc`, `eslint` e `next build` passam no site.
- O fluxo funciona de ponta a ponta com a chave de teste do Stripe, num Supabase local: desconto, 30 dias, cancelar, desfazer e cancelar com reembolso dentro dos 7 dias.
- O usuário recebeu capturas do modal (desktop e celular, cada passo, com o mascote) e os textos para aprovar antes de qualquer deploy.
