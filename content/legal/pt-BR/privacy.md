---
title: Política de privacidade
description: Que dados o site, o app e o Persisty Cloud guardam, onde ficam, para quê e como pedir que sejam apagados.
updated: 2026-10-29
---

O Persisty foi feito para guardar o mínimo. O app funciona sem conta e sem internet, e o que você faz nele fica na sua máquina.

## No app

Projetos, sessões, histórico de terminal, notas e uso de IA ficam num banco local no seu computador. O Persisty não envia código, saída de terminal nem prompts para lugar nenhum e não tem telemetria.

O app só fala com fora para:

- ler a quota do Claude Code, com a credencial que o Claude Code já guarda;
- entrar na conta do Persisty Cloud e renovar a licença;
- falar com o GitHub, o GitLab ou o Bitbucket, nas integrações que você conectar;
- clonar, buscar, puxar e enviar commits no remoto dos seus repositórios git. Para mostrar o que falta puxar e enviar, a busca também acontece sozinha ao abrir e a cada 5 minutos com o app na tela;
- procurar versões novas do app (veja abaixo).

Cada chamada aparece em **Configurações › Privacidade e rede**, com destino, motivo, tamanho e resultado.

### Procura de versões novas

Para saber se saiu uma versão nova, o app baixa do GitHub um arquivo público que só diz qual é a versão mais recente (`github.com/abalad/persisty-releases`). O GitHub vê o endereço IP do seu computador e, no cabeçalho do pedido, a versão do app. Nenhum dado da sua conta ou dos seus projetos vai junto.

A procura acontece ao abrir o app, a cada 6 horas com ele aberto e quando você clica em **Procurar atualizações**. Para desligar a procura automática, use **Configurações › Sobre**; o botão continua funcionando. Quando você pede para instalar, o app baixa a versão nova do mesmo lugar.

## No site

O site não usa analytics nem cookies de rastreamento. Ele guarda dois tipos de cookie, os dois necessários para funcionar:

- o idioma que você escolheu;
- a sessão da sua conta, quando você entra.

O site é hospedado pela Vercel, que recebe os dados normais de qualquer acesso a um site (endereço IP, navegador, página pedida).

## Na conta do Persisty Cloud

Quando você cria uma conta, guardamos:

- seu e-mail e um nome de exibição tirado dele;
- sua organização pessoal e, se houver, as organizações de time das quais participa;
- os aparelhos conectados: nome, sistema, versão do app e último acesso;
- seu plano e, quando existirem, os dados da assinatura;
- as preferências que você marcar, como o e-mail de versões novas e o interesse no Enterprise.

Esses dados ficam no Supabase, na região de São Paulo. Usamos para manter a conta, emitir a licença e mandar os avisos que você pediu. Não vendemos dados e não usamos para publicidade.

Quando o pagamento existir, ele será processado pela Stripe; o Persisty não vê nem guarda dados de cartão.

## Seus direitos

Pela LGPD, você pode pedir acesso aos seus dados, correção ou exclusão da conta. Ao excluir a conta, os dados pessoais são apagados; ficam só números agregados que não identificam ninguém.

{{contact}}

## Mudanças

Se esta política mudar, a data no topo muda junto, e mudanças que afetem o que guardamos são avisadas por e-mail a quem tem conta.
