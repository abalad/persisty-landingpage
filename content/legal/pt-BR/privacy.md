---
title: Política de privacidade
description: Que dados o site, o app e o Persisty Cloud guardam, onde ficam, para quê e como apagar a conta.
updated: 2026-11-19
---

O Persisty foi feito para guardar o mínimo. O app funciona sem conta e sem internet, e o que você faz nele fica na sua máquina.

## No app

Projetos, sessões, histórico de terminal, notas e uso de IA ficam num banco local no seu computador. O Persisty não envia código, saída de terminal nem prompts para lugar nenhum, fora os commits que você mesmo manda enviar ao remoto dos seus repositórios git, e não tem telemetria.

O app só fala com fora para:

- ler a quota do Claude Code, com a credencial que o Claude Code já guarda;
- entrar na conta do Persisty Cloud e renovar a licença;
- falar com o GitHub, o GitLab ou o Bitbucket, nas integrações que você conectar;
- ler as issues do Linear, do Jira, do ClickUp e do GitHub, nas integrações de tarefas que você conectar, e, quando você conclui uma tarefa e confirma, escrever na issue o comentário que você revisou e o novo status;
- clonar, buscar, puxar e enviar commits no remoto dos seus repositórios git. Para mostrar o que falta puxar e enviar, a busca também acontece sozinha ao abrir e a cada 5 minutos com o app na tela;
- baixar um servidor de linguagem que o editor precisa e que não está no seu computador, de `nodejs.org`, de `registry.npmjs.org` ou do GitHub;
- baixar o modelo de voz do ditado, de `huggingface.co`, quando você pede;
- buscar servidores no registro oficial de MCP (`registry.modelcontextprotocol.io`) e testar os servidores remotos que você configurar;
- procurar versões novas do app (veja abaixo).

Nos downloads de servidores de linguagem e do modelo de voz, o serviço de origem vê o endereço IP do seu computador; nenhum dado da sua conta ou dos seus projetos vai junto.

Cada chamada aparece em **Configurações › Privacidade e rede**, com destino, motivo, tamanho e resultado.

### Procura de versões novas

Para saber se saiu uma versão nova, o app baixa do GitHub um arquivo público que só diz qual é a versão mais recente (`github.com/abalad/persisty-releases`). O GitHub vê o endereço IP do seu computador e o nome do componente que faz a consulta; a versão do app não vai no pedido. Nenhum dado da sua conta ou dos seus projetos vai junto.

A procura acontece ao abrir o app, a cada 6 horas com ele aberto e quando você clica em **Procurar atualizações**. Para desligar a procura automática, use **Configurações › Sobre**; o botão continua funcionando. Quando você pede para instalar, o app baixa a versão nova do mesmo lugar.

## No site

O site usa o Google Analytics só se você aceitar no aviso de cookies. Sem essa resposta, ou se você recusar, nada do Google carrega.

Com o seu aceite, o Google Analytics mede:

- as páginas vistas e de onde a visita veio (o site anterior e a campanha, quando houver);
- aparelho, navegador e região aproximada;
- como você usa a página: rolagem, cliques em links para outros sites, downloads de arquivos e uso de formulários (sem o que você digita);
- cinco ações: baixar o app, criar conta, entrar na conta, começar uma assinatura e concluir uma assinatura.

O endereço da página vai ao Google sem os parâmetros que podem ter dado pessoal. Seu e-mail, seu nome e o que você digita nunca vão. O Google Analytics guarda os cookies `_ga` e `_ga_<id>` por até 13 meses, e os dados ficam 14 meses na nossa conta. O Google trata esses dados como operador, e eles podem ser transferidos para os Estados Unidos.

Para mudar de ideia, use **Cookies** no rodapé de qualquer página. Se você recusar depois de ter aceitado, o site para de enviar dados e apaga os cookies do Google.

Além desses, o site guarda três cookies necessários para funcionar:

- o idioma que você escolheu;
- a sessão da sua conta, quando você entra;
- a sua resposta ao aviso de cookies (`persisty_consent`, por 12 meses).

O site é hospedado pela Vercel, que recebe os dados normais de qualquer acesso a um site (endereço IP, navegador, página pedida).

## Na conta do Persisty Cloud

Quando você cria uma conta, guardamos:

- seu e-mail e um nome de exibição tirado dele;
- sua organização pessoal e, se houver, as organizações de time das quais participa;
- os aparelhos conectados: nome, sistema, versão do app e último acesso;
- seu plano e, quando existirem, os dados da assinatura;
- se você cancelar um plano pago em Minha conta: o motivo que escolher, o texto que escrever (se escrever) e o que fez com as ofertas para ficar;
- as preferências que você marcar, como o e-mail de versões novas (e o idioma em que ele chega) e os interesses que você registrar.

Esses dados ficam no Supabase, na região de São Paulo. Usamos para manter a conta, emitir a licença, mandar os avisos que você pediu e entender por que as pessoas cancelam. Não vendemos dados e não usamos para publicidade.

O pagamento é processado pela Stripe; o Persisty não vê nem guarda dados de cartão.

## Seus direitos

Pela LGPD, você pode pedir acesso aos seus dados e a correção deles. A conta você mesmo exclui, a qualquer momento, em Minha conta: os dados pessoais são apagados na hora, e ficam só os registros de pagamento que a lei manda guardar, no Stripe, e números agregados que não identificam ninguém. Consultamos esses registros só para saber se uma compra é a primeira, por causa do reembolso dos 7 dias. Excluir a conta do dono de um Time apaga também o Time e as contas de quem participa só dele; essas pessoas recebem um aviso por e-mail.

{{contact}}

## Mudanças

Se esta política mudar, a data no topo muda junto, e mudanças que afetem o que guardamos são avisadas por e-mail a quem tem conta.
