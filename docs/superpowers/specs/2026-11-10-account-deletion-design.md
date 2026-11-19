# Excluir a conta em Minha conta

Data: 2026-11-10. Decidido com o usuário nesta conversa. O esboço aprovado está no companheiro visual, em `.superpowers/brainstorm/88429-1794258937/content/delete-flow-v8.html`. A pasta não vai para o git, e todos os textos e estados do esboço estão neste documento.

## Intenção

Hoje não dá para excluir a conta pelo site. A Política de Privacidade diz que a pessoa pode "pedir" a exclusão, mas não existe botão para isso. A Apple exige que um app com contas permita excluir a conta, e o Persisty Remote (o app de celular, em beta interno) não pode ir para a revisão da App Store sem isso. O app do celular vai levar a pessoa direto a uma página do site onde a exclusão acontece.

O usuário quer uma exclusão:
- imediata e irreversível, com um aviso claro;
- que trate o dinheiro como o cancelamento trata;
- num modal "a um nível extremamente profissional", sem cara de feito por IA, com o mascote na coluna como no cancelamento.

## Decisões do usuário

1. **Imediata e irreversível.** Não há prazo para desistir nem como desfazer. O aviso diz isso antes de confirmar.
2. **O dono de um Time leva o Time junto.** Excluir a conta do dono apaga o Time e as contas de quem participa só dele.
3. **Quem tem outro vínculo só sai do Time.** Quem paga o próprio Pro ou está em outro Time continua com a conta e perde só este Time.
4. **O dinheiro segue a regra do cancelamento.** Dentro de 7 dias da primeira cobrança, o valor pago volta inteiro. Depois disso, o resto do período não é reembolsado. A tela diz qual dos dois casos vale antes de confirmar.
5. **Sem dados do Time no modal.** Não aparecem lista de pessoas, e-mails nem contagem de membros.
6. **O mascote fica**, na coluna do modal com o balão, como no cancelamento. Só o conteúdo precisava ficar mais sóbrio.
7. **Direção visual aprovada (v8):**
   - consequências em dois grupos, "É excluído" e "Continua com você";
   - o atalho "Só quer parar de pagar? Cancele a assinatura";
   - confirmação por código de e-mail com o mesmo campo único do login;
   - estados de código errado, excluindo e falha;
   - página própria depois da exclusão, fora de Minha conta;
   - folha de baixo no celular.
8. **Dois e-mails, pelo Resend.**
   - Os e-mails são:
     - um aviso para cada pessoa cuja conta é apagada junto com o Time;
     - uma confirmação para quem excluiu.
   - O primeiro "sem e-mails" do usuário veio de um engano meu. Eu tinha dito que não havia serviço de envio, mas os códigos de login já saem pelo Resend (SMTP do Supabase, remetente "Persisty <oi@persisty.app>", desde 2026-10-22; veja `persist-application/docs/LIMITATIONS.md`). Corrigido o engano, o usuário concordou com os dois e-mails.
   - Falta só guardar a chave da API do Resend como segredo da função.
9. **O reembolso dos 7 dias vale uma vez por e-mail.** Quem exclui a conta e cria outra com o mesmo e-mail não tem o reembolso de novo.
   - A conferência usa o histórico que o Stripe já guarda por lei, sem guardar nada a mais do nosso lado.
   - A mesma regra passa a valer no cancelamento.
10. **Um login recente por código já confirma.** Se a pessoa entrou com código de e-mail nos últimos 10 minutos, o passo 2 não pede outro código. Isso evita esperar o limite de um código por minuto do Supabase, justo no caminho que vem do celular e que o revisor da Apple vai seguir.

## Objetivos

- **Exclusão rápida:** quem tem conta exclui pelo site em dois passos, a partir de Minha conta ou do endereço direto `/account/delete`.
- **Nada escondido:** antes de confirmar, a pessoa vê o que é excluído, o que acontece com o dinheiro e o que continua com ela (o app grátis e os dados no computador).
- **Fim limpo:**
  - nenhuma cobrança acontece depois da exclusão;
  - a conta, os computadores, os celulares, as sessões de login e os Times de que a pessoa é dona deixam de existir;
  - as contas que dependiam só desses Times também.
- **Prova de que é a pessoa:** só um login por código de e-mail feito nos últimos 10 minutos libera a exclusão no servidor.
- **Ninguém fica sem saber:** quem exclui recebe a confirmação por e-mail, e quem perde a conta junto com o Time recebe um aviso.
- **Um reembolso só:** o reembolso dos 7 dias não se repete para um e-mail que já teve assinatura.
- **Falha segura:** se algo falha, a conta continua, e tentar de novo termina o que faltou.
- **Pronto para a Apple:** o app do celular pode apontar para `/account/delete`.

## Não objetivos

- **Outros e-mails:** só os dois da decisão 8. Não entram aviso ao dono antes da exclusão, lembretes nem e-mail de convite.
- **Exportar os dados** antes de excluir.
- **Prazo para desistir** ou exclusão agendada.
- **Passar o Time para outro dono** antes de excluir.
- **Excluir de dentro do app do computador ou do celular.** Os apps só levam ao endereço do site, e cada um é trabalho da sessão do app.
- **Mostrar celulares no site.** O Remote ainda está planejado (veja "Celulares" abaixo).

## Anti-objetivos (fracasso mesmo funcionando)

- **Cobrança ou reembolso errados:** alguém é cobrado depois de excluir, ou recebe um reembolso que não devia (ou deixa de receber um devido).
- **Conta errada apagada:** some a conta de quem paga o próprio Pro ou está em outro Time.
- **Falha que mente:** a tela diz que deu certo e a conta continua, ou diz que falhou e a conta sumiu.
- **Apagar por clique sem querer:** um clique solto ou uma sessão antiga aberta num computador emprestado basta para apagar a conta.
- **Visual com cara de IA.** Ficam de fora:
  - palavra colorida no título e borda decorativa vermelha;
  - fonte mono como fantasia em e-mail e nome de computador;
  - ícones em cada linha e selo colorido do plano;
  - faixa de resumo com bolinhas;
  - código em 6 caixinhas;
  - risco animado e frases feitas no balão.
- **Modal com rolagem por dentro**, área vazia ou mascote triste no fim.

## Constraints

- **Site:**
  - Next.js 16 (ler `node_modules/next/dist/docs/` antes de escrever código);
  - next-intl em pt-BR, en e es com as mesmas chaves (`tests/messages.test.ts`) e as regras de copy (`tests/copy.test.ts`);
  - CSS Modules com os tokens de `src/styles/tokens.css` e `DESIGN.md`;
  - sem prettier.
- **Backend:**
  - função Deno nova em `persist-application/supabase/functions`, no padrão de `retention`: `handler.ts` com dependências injetadas, `handler_test.ts` e `index.ts`;
  - Stripe por HTTP via `_shared/stripe.ts`, sem SDK;
  - trabalho num git worktree do app, em branch a partir de `origin/main`, sem tocar na pasta de trabalho das sessões do app;
  - se precisar de migração, o timestamp vem depois da última migração em `origin/main` do app no momento. Hoje é `20261104090000`, e as sessões do app podem ter criado outras.
- **Deploy, migração em produção, o segredo do Resend e qualquer mudança no Stripe live só com ok explícito do usuário no momento.** Push no `main` do site, idem.
- **Limites do Resend:** o plano gratuito manda até 100 e-mails por dia, e esse limite é dividido com os códigos de login. Os e-mails de auth do Supabase têm ainda o limite de 25 por hora.
- **Antes de publicar:** comparação antes e depois, mais as capturas do modal (desktop e celular, cada passo e cada estado), com os textos nos três idiomas, para o usuário aprovar.
- O Stripe de produção cobra de verdade. Os testes de ponta a ponta usam só a chave de teste, num Supabase local, como no cancelamento (seção 7 de `2026-11-02-cancel-flow-design.md`).

## As partes

### 1. Onde fica

- **Na página inicial de Minha conta** (`Overview.tsx`), no fim, depois de todo o resto, entra uma seção curta:
  - título "Excluir conta";
  - a frase "Apaga a conta e encerra a assinatura. O Persisty continua grátis no seu computador.";
  - o botão de contorno coral "Excluir conta".

  Para quem não tem assinatura, a frase perde "e encerra a assinatura".
- **No endereço direto `/account/delete`:** abre Minha conta com o modal já aberto. Sem login, a pessoa entra primeiro com o código de e-mail de sempre, e então o modal abre. Esse é o endereço que o app do celular usa.

### 2. Passo 1, o que muda

O frame é o do cancelamento: modal de 840 por 488, coluna do mascote com o balão, "1 de 2" e o X. No celular vira uma folha de baixo, com a faixa do mascote e o balão.

- **Topo:**
  - balão "Antes de ir, veja o que muda.";
  - título "Excluir sua conta";
  - linha de abertura "É imediato e não dá para desfazer."
- **Grupo "É excluído":** as linhas aparecem conforme o caso, sem ícones.
  - **A conta:**
    - "A conta **{e-mail}** e o acesso nos {n} computadores";
    - com 1 computador, "e o acesso no computador";
    - sem computador, só "A conta **{e-mail}**".
  - **Uma assinatura que a pessoa paga** (Pro pessoal, ou Team de um Time de que ela é dona), uma linha por assinatura:
    - fora dos 7 dias: "A assinatura {Pro|Team}, encerrada hoje, sem reembolso do período restante";
    - dentro dos 7 dias da primeira cobrança: "A assinatura {Pro|Team}, encerrada hoje, com os {valor} pagos de volta no cartão". O valor e a moeda vêm do Stripe, como o cancelamento já mostra.
  - **Um Time de que a pessoa é dona:**
    - "O Time **{nome}** e as contas de quem participa só dele";
    - com mais de um Time, "Os Times **{A}** e **{B}** e as contas de quem participa só deles".
  - **Um Time em que a pessoa é membro ou admin:** "Sua participação no Time **{nome}**".
- **Grupo "Continua com você":** "Projetos, sessões e histórico ficam no seu computador. O Persisty segue no plano grátis, sem conta."
- **Rodapé:**
  - à esquerda, o link "Só quer parar de pagar? Cancele a assinatura". Ele fecha este modal e abre o de cancelamento que já existe. Aparece só para quem gerencia uma assinatura que ainda não está marcada para terminar;
  - à direita, o botão de contorno coral "Continuar". Ele passa ao passo 2 e só manda um código se o login da pessoa tiver mais de 10 minutos.

### 3. Passo 2, o código

O passo 2 tem duas formas. Para escolher, o site lê o horário do login do token, o mesmo `amr` que o servidor confere.

**Com login por código nos últimos 10 minutos** (o caminho de quem chega pelo celular):
- balão "Falta só confirmar.";
- título "Confirme a exclusão";
- linha de abertura "Você entrou com um código agora há pouco, então não precisa de outro.";
- a mesma última linha e o mesmo rodapé de baixo, com o botão "Excluir conta" já ativo.

Se os 10 minutos passarem com o modal aberto, o servidor recusa, e o passo 2 troca para a forma com código, já mandando um.

**Com login mais antigo:**

- **Topo:**
  - balão "Falta só o código.";
  - título "Confirme que é você";
  - linha de abertura "Mandamos um código para **{e-mail}**. Ele vale por 10 minutos."
- **Campo:** rótulo "Código" e o mesmo campo único do login, com estas características:
  - `autoComplete="one-time-code"`;
  - aceita colar;
  - fonte mono só nos dígitos, espaçados como em `SignInForm`.
- **Reenvio:** abaixo do campo, "Mandar outro em {s} s", que vira o link "Mandar outro" quando o tempo acaba.
- **Última linha antes do rodapé:** "Ao confirmar, **{o que sai}** {é excluída | são excluídos} na hora."
  - Exemplos: "a conta", "a conta e a assinatura Pro", "a conta, a assinatura Team e o Time Acme".
  - Lista só nomes e planos, nunca pessoas.
- **Rodapé:**
  - "Voltar";
  - o botão coral sólido "Excluir conta". Ele fica desativado até ter 6 dígitos.
- **Estados:**
  - **Código errado:** campo em vermelho e "Esse código não confere. Use o último que chegou." Para código vencido, usa a mensagem que o login já tem.
  - **Excluindo:**
    - o botão vira "Excluindo…" com o indicador de carga;
    - o X some, e Esc e o clique fora não fecham;
    - o balão diz "Só um instante.".
  - **Falhou:** "Não deu para terminar agora. Sua conta continua aqui. Tente de novo em instantes." O botão volta a funcionar com o mesmo código, se ainda valer; senão, pede outro.

    (O esboço v8 dizia "Nada foi apagado". Mudei porque o Stripe pode já ter encerrado uma assinatura antes da falha. Veja a seção 5.)

### 4. Depois

- **Onde fica:** uma página própria, fora do layout de Minha conta, porque a pessoa já saiu da conta. É `noindex` e fica fora do sitemap.
- **O que mostra:**
  - o mascote calmo, sem balão;
  - o título "Sua conta foi excluída";
  - a frase "A confirmação foi para **{e-mail}**. No seu computador, o Persisty continua funcionando no plano grátis.";
  - o botão lima "Ir para o início".

  Se o envio da confirmação falhar, a página não diz que ela foi enviada. A função responde se o e-mail saiu, e a página mostra a frase sem a primeira parte.
- **Antes de chegar aqui,** o site encerra a sessão local: os cookies e o cliente do Supabase.

### 5. O que a exclusão faz, no servidor

Uma função nova, que neste documento chamo de `delete-account`, faz tudo com a chave de serviço, nesta ordem:

1. **Confere quem pede.** Exige uma sessão cujo login por código de e-mail aconteceu nos últimos 10 minutos. `_shared/license.ts` já lê o horário do login, em `sessionSignedInAt` (pelo `amr`, que a renovação do token mantém).
   - Sessão antiga é recusada com um erro próprio, para o site trocar para a forma com código.
   - Sessão de celular (`phoneSessionRefusal`) também é recusada.
2. **Calcula o que sai:**
   - os Times de que a pessoa é dona (`org_members.role = 'owner'` em `orgs.kind = 'team'`);
   - em cada um, os membros que ficam sem nenhum outro vínculo. "Outro vínculo" é ser membro de qualquer outro Time, ou ter uma assinatura pessoal no Stripe que ainda pode cobrar: qualquer uma que não esteja `canceled` nem `incomplete_expired` (não paga e pausada contam);
   - as assinaturas a encerrar: a pessoal da pessoa e as dos Times de que ela é dona;
   - os e-mails de quem vai receber o aviso e da própria pessoa, guardados na memória antes de apagar qualquer coisa.
3. **Encerra cada assinatura no Stripe:**
   - antes de tudo, expiram os checkouts ainda abertos dos clientes dessas orgs. Um pagamento que chegue depois mesmo assim (um checkout terminado em outra aba) é devolvido inteiro pelo webhook, que anula as faturas em aberto e encerra a assinatura;
   - na hora, sem cobrança proporcional e sem fatura nova;
   - faturas em aberto dessas assinaturas são anuladas, para nada ser cobrado depois;
   - dentro dos 7 dias da primeira compra, reembolsa como `retention` já faz em `refundOwed`.

   "Primeira compra" agora considera também o e-mail. A compra não é a primeira se outro cliente do Stripe com o mesmo e-mail já teve uma assinatura (por exemplo, numa conta excluída antes). A busca é `GET /v1/customers?email=…`, mais as assinaturas desses clientes. A regra fica em `_shared`, e `retention` passa a usá-la também. Isso muda o cancelamento que já existe e os testes dele.

   **Se o Stripe falha, a função para aqui** e a conta, os Times e os membros continuam. Uma assinatura já encerrada nesta tentativa fica encerrada, e a próxima tentativa a pula.
4. **Avisa e apaga as contas** dos membros sem outro vínculo, um por vez: primeiro manda o aviso (seção 6), depois apaga a conta. Se a função cair no meio, a próxima tentativa pode avisar de novo quem ainda não foi apagado. Isso é melhor do que alguém perder a conta sem aviso.
5. **Apaga os Times da pessoa.** As linhas de `subscriptions`, `billing_customers`, `org_members`, `org_invites` e `retention_events` saem em cascata. O Time não sai sozinho com o dono, porque `orgs.created_by` é `on delete set null`, então a função apaga de propósito. Os Times saem depois dos membros porque, se a função cair entre as duas etapas, a próxima tentativa ainda acha no Time quem falta avisar e apagar.
6. **Apaga a conta da pessoa por último,** para que uma falha antes disso ainda permita tentar de novo. Com ela saem em cascata:
   - `profiles`, a org pessoal e o que ela tem;
   - `org_members`, `devices`, `phones`, `phone_links` e `remote_pairings`;
   - as sessões de login.
7. **Apaga o rastro do login** de todos que saíram (`auth.audit_log_entries` guarda o e-mail e o IP de cada login, e a própria exclusão vira uma linha). Isso acontece uma vez, depois da última conta apagada. Uma falha fica no log e não desfaz a exclusão.
8. **Manda a confirmação** (seção 6) para quem excluiu. Uma falha no envio não desfaz nada nem faz a exclusão parecer falha. A resposta da função diz ao site se a confirmação saiu.

Uma falha em qualquer envio nunca impede a exclusão de seguir.

A função é idempotente. Rodar de novo depois de uma falha termina o que faltou e não reembolsa duas vezes.

**O webhook do Stripe:** os eventos de assinatura encerrada chegam depois, para orgs que já não existem. `stripe-webhook` precisa ignorar esses eventos sem erro (sem gerar novas tentativas) e sem recriar linhas. Quem constrói confere o comportamento de hoje.

**O que fica guardado:** o cliente, as faturas e os pagamentos no Stripe, porque a lei fiscal obriga a guardar o registro de pagamento. A função não apaga nada no Stripe. Esse histórico também é o que a regra do reembolso de uma vez por e-mail consulta (decisão 9).

### 6. Os dois e-mails

- **Como saem:**
  - pela API do Resend, com a chave guardada como segredo das funções do Supabase, do mesmo remetente "Persisty <oi@persisty.app>";
  - em texto curto, no tom do site, sem imagem de marketing.
- **Idioma:**
  - a confirmação vai no idioma em que a pessoa estava no site;
  - o aviso vai no idioma do membro, se o site o conhecer, ou no do dono.
- **Confirmação, para quem excluiu.** Assunto "Sua conta do Persisty foi excluída". O texto diz:
  - o que foi excluído, as mesmas linhas da última frase do passo 2;
  - o que aconteceu com o dinheiro: encerrada sem reembolso, ou o valor que volta para o cartão;
  - que o Persisty segue grátis no computador.
- **Aviso, para cada conta apagada junto com o Time.** Assunto "Sua conta do Persisty foi excluída". O texto diz:
  - que o Time **{nome}** foi excluído pelo dono, e a conta dela com ele, porque ela participava só desse Time;
  - que os projetos e sessões continuam no computador e o Persisty segue grátis;
  - que ela pode criar uma conta nova quando quiser, no mesmo e-mail.

  Não cita o nome nem o e-mail do dono, só o nome do Time. Quem só saiu do Time, porque tem outro vínculo, não recebe e-mail.
- **Antes de publicar:** os textos dos dois e-mails, nos três idiomas, vão ao usuário para aprovar junto com as capturas.

### 7. No computador e no celular

- **Computador:** a licença paga vale 14 dias sem internet (`LICENSE_TTL_SECONDS`, e os Termos dizem isso). Depois da exclusão, a próxima conferência online da licença falha porque o usuário não existe mais. O app do computador precisa tratar isso como "sem conta": volta ao plano grátis na hora e não fica 14 dias no Pro.

  **Quem constrói confirma com a sessão do app** como o app reage hoje a uma conta apagada e, se precisar, pede o ajuste a ela. A frase "O Persisty segue no plano grátis, sem conta" só pode ir ao ar quando isso for verdade.
- **Celular:** a sessão do celular termina com a conta. O link no app do celular para `/account/delete` é trabalho da sessão do app. Avise a ela o endereço quando estiver no ar.
- **Celulares no site:** enquanto o Remote não for lançado, o passo 1 fala só de computadores. Quando o Remote sair, a linha da conta passa a contar computadores e celulares (veja o plano do Remote).

### 8. Textos legais

As mudanças valem nos três idiomas (`content/legal/{pt-BR,en,es}/`), com a data do topo atualizada.

- **Política de Privacidade, linha ~55.** "Você pode pedir … exclusão da conta" passa a dizer quatro coisas:
  - a pessoa exclui a conta em Minha conta, a qualquer momento;
  - os dados pessoais são apagados na hora e ficam só os registros de pagamento que a lei manda guardar, no Stripe, além de números agregados que não identificam ninguém;
  - o Persisty consulta esses registros para saber se uma compra é a primeira, por causa do reembolso dos 7 dias;
  - excluir a conta do dono de um Time apaga também o Time e as contas de quem participa só dele, e essas pessoas recebem um aviso por e-mail.

  O pedido por contato (`{{contact}}`) continua para acesso e correção.
- **Termos, linha ~32.** Ganha uma frase:
  - a exclusão em Minha conta encerra a assinatura na hora, sem reembolso do período em curso, salvo nos 7 dias da primeira compra;
  - que "primeira compra" vale por e-mail, também depois de excluir uma conta;
  - a mesma regra do dono de um Time.
- **A linha 61 da Política** promete avisar por e-mail as mudanças no que guardamos. Com o envio pelo Resend, esse aviso fica possível. Quando e como mandar continua sendo decisão do usuário, e quem constrói só lembra disso ao entregar.

### 9. Escolhas minhas (não do usuário)

- **Onde fica a entrada:** no fim da página inicial de Minha conta, mais o endereço `/account/delete`.
- **A confirmação:**
  - reaproveita o login por código de e-mail;
  - o código chega no mesmo e-mail de "código de login" do Supabase, sem um modelo novo de auth.
- **Os 10 minutos** do login recente.
- **Textos novos que não estavam no esboço:**
  - a frase da seção de entrada;
  - a linha com reembolso dentro dos 7 dias;
  - "Sua participação no Time";
  - o balão "Só um instante.";
  - a forma do passo 2 sem código;
  - o conteúdo dos dois e-mails.
- **Os e-mails:**
  - nenhum para quem só sai do Time;
  - o aviso não cita o dono;
  - a regra do idioma.
- **A regra de uma vez por e-mail** vale só para o reembolso. As ofertas do cancelamento continuam uma vez por org, como hoje.
- **O texto de falha:** "Sua conta continua aqui", no lugar de "Nada foi apagado".
- **"Outro vínculo":** inclui qualquer outro Time, mesmo sem plano pago, e qualquer assinatura pessoal que ainda não terminou.
- **Stripe:** não apagar o cliente nem o histórico.
- **Faturas em aberto:** anular as das assinaturas encerradas.
- **Enterprise:** tratado como Team.

## O que fica com quem constrói

- **Nomes e forma:**
  - os nomes da função e das rotas, incluindo a da página de depois;
  - se a regra do "outro vínculo" fica numa função SQL (migração) ou na função Deno.
- **A confirmação:** como mandar e conferir o código do passo 2 (de novo `signInWithOtp` com `shouldCreateUser: false` e `verifyOtp`, ou o `reauthenticate` do Supabase), desde que o resultado seja um login com `amr` recente.
- **Os e-mails:** o HTML e o texto puro, e onde ficam os modelos.
- **O acabamento:**
  - o desenho fino do modal e das poses do mascote, partindo de `CancelMood`. Minha sugestão: `puzzled` no passo 1, `pleading` no passo 2 e `settled` na página de depois, nunca triste no fim;
  - os textos em en e es;
  - foco e teclado.
- **Testes:**
  - Deno para a função, no padrão de `retention/handler_test.ts`;
  - vitest para a regra de quais linhas aparecem no passo 1;
  - roteiro no navegador para o modal (teclado, Esc, foco, celular, cada estado).

## Pronto quando

- **Testes automáticos:** `deno test` passa no app; `vitest`, `tsc`, `eslint` e `next build` passam no site.
- **De ponta a ponta,** com a chave de teste do Stripe num Supabase local, funcionam estes casos:
  - conta grátis;
  - Pro pessoal fora e dentro dos 7 dias;
  - dono de Team com um membro só do Time (a conta dele some);
  - dono de Team com um membro que tem Pro próprio, e outro que está em outro Time (os dois só saem);
  - membro comum que exclui a própria conta (o Time continua);
  - uma falha forçada do Stripe no meio (a conta continua, e a segunda tentativa termina sem reembolsar duas vezes);
  - login por código há menos de 10 minutos (o passo 2 sem código) e há mais (o passo 2 com código);
  - a pessoa exclui dentro dos 7 dias, cria outra conta com o mesmo e-mail e compra. O cancelamento não oferece o reembolso, e a nova exclusão também não;
  - os dois e-mails chegam com o Resend em modo de teste, ou para endereços de teste. Quem só saiu do Time não recebe nada. Uma falha forçada no envio não desfaz a exclusão.
- **App do computador:** a sessão do app confirmou que ele volta ao grátis quando a conta some.
- **Aprovação:** antes de qualquer deploy, o usuário recebeu estas peças e aprovou:
  - as capturas do modal: desktop e celular, cada passo e estado, as duas formas do passo 2 e a página de depois;
  - os textos nos três idiomas, inclusive os dois e-mails;
  - o antes e depois dos textos legais.
