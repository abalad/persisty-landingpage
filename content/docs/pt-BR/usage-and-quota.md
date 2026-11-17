---
title: Uso, custo e quota
description: Gasto estimado por sessão, projeto e modelo, alertas de gasto, as janelas de 5 horas e 7 dias e o contexto usado, com o que cada número quer dizer.
group: agents
order: 6
---

O rodapé de cada sessão de agente mostra o modelo, o gasto estimado, o contexto usado e as janelas de 5 h e 7 d da conta em que ela roda. Numa sessão do Claude Code, o modelo do rodapé é um seletor; veja [Modelo por sessão](/docs/agents#modelo-por-sessão).

## Gasto estimado

O painel **Detalhes** (<kbd>⌘</kbd> <kbd>I</kbd>) mostra esses números da sessão em foco e o gasto do projeto no mês, em **IA no mês**. **Uso detalhado**, no mesmo painel, abre a página **Uso de IA** do projeto: requisições, tokens e custo de **Hoje** e **Este mês**, as sessões do Claude Code com custo, contexto e janelas, e as tabelas **Por sessão**, **Por modelo** e **Por provedor**. **Todos os projetos**, no topo, junta tudo e mostra **Por projeto** no lugar de **Por sessão**.

A página também abre por **Uso de IA — todos os projetos**, na paleta de comandos, e por **Abrir uso detalhado**, em **Configurações › Uso de IA**. **Sincronizar** lê os registros de novo, e **Voltar** ou <kbd>Esc</kbd> fecham a página.

O gasto vem dos registros locais do Claude Code e da status line que ele mesmo calcula. Estimativas por tokens usam preço de lista com data e origem, e **não são a fatura** do provedor.

## Alertas de gasto

Em **Configurações › Uso de IA**, **Alerta diário (USD)** e **Alerta mensal (USD)** põem um aviso no topo do workspace quando a estimativa do dia ou do mês, somando todos os projetos, chega ao valor. Vazio ou 0 desliga.

## Fontes de dados

A mesma tela lista as **Fontes de dados** e quando cada uma foi lida pela última vez. Hoje os números vêm de duas: os registros locais do Claude Code e a status line dele. As outras da lista, como o Codex CLI e as APIs da Anthropic e da OpenAI, aparecem como **Não conectado**, e o gasto do Codex ainda não entra na conta.

## Janelas de 5 h e 7 d

As janelas de 5 horas e 7 dias são percentuais da assinatura, não dinheiro. Elas vêm do mesmo serviço que o `/usage` do Claude Code, ao vivo, consultadas no máximo uma vez por minuto por conta. Cada sessão mostra as janelas da conta em que roda, com o e-mail e o plano ao lado; com várias contas, cada sessão tem os seus números. Janelas de 7 dias por modelo, quando a conta tem, aparecem no painel **Detalhes**.

Quando a conta fica sem quota, o cabeçalho da sessão mostra **Sem quota · volta às …** com a hora em que a janela renova. Quando o último turno falha por erro da Anthropic, mostra **O último turno falhou: …** com o motivo. Nos dois casos a fila da sessão espera; veja [Quando a quota acaba](/docs/ai-accounts#quando-a-quota-acaba). No rodapé, clicar na conta abre as contas conectadas para trocar a da sessão (Pro); veja [Contas de IA e rodízio](/docs/ai-accounts).

## Contexto

A porcentagem de contexto é quanto da janela de contexto do modelo a conversa já ocupa, segundo o próprio Claude Code.

Gasto, quota e contexto são do plano grátis.
