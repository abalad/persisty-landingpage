---
title: Uso, custo e quota
description: Gasto por sessão, contexto usado e as janelas de 5 horas e 7 dias, com o que cada número quer dizer.
group: work
order: 4
---

O rodapé de cada sessão de agente mostra o modelo, o gasto, o contexto usado e as janelas de 5 h e 7 d. Numa sessão do Claude Code, o modelo do rodapé é um seletor; veja [Modelo por sessão](/docs/agents#modelo-por-sessão).

O painel **Detalhes** (<kbd>⌘</kbd> <kbd>I</kbd>) mostra esses números da sessão em foco e o gasto do projeto no mês, em **IA no mês**. **Uso detalhado**, no mesmo painel, abre a página de uso do projeto: gasto e tokens de **Hoje** e **Este mês**, as sessões do Claude Code e as tabelas **Por sessão**, **Por modelo** e **Por provedor**. Com **Todos os projetos**, a página junta tudo e mostra **Por projeto** no lugar de **Por sessão**.

## Gasto

O gasto vem dos registros locais do Claude Code e da status line que ele mesmo calcula. Estimativas por tokens usam preço de lista com data e origem, e **não são a fatura** do provedor.

Em **Configurações › Uso de IA**, **Alerta diário (USD)** e **Alerta mensal (USD)** põem um aviso no topo do workspace quando a estimativa do dia ou do mês, somando todos os projetos, chega ao valor. Vazio ou 0 desliga. A mesma tela mostra as fontes de dados e tem **Abrir uso detalhado**.

## Quota

As janelas de 5 horas e 7 dias são percentuais da assinatura, não dinheiro. Elas vêm do mesmo serviço que o `/usage` do Claude Code e são consultadas no máximo uma vez por minuto. Janelas por modelo, quando existem, aparecem no painel de detalhes.

Quando a conta fica sem quota, o cabeçalho da sessão mostra **Sem quota · volta às …** com a hora em que a janela renova. Quando o último turno falha por erro da Anthropic, mostra **O último turno falhou: …** com o motivo. Nos dois casos a fila da sessão espera; veja [Quando a quota acaba](/docs/ai-accounts#quando-a-quota-acaba).

Cada sessão mostra a conta em que roda (e-mail e plano). No rodapé, clicar nela abre as contas conectadas para trocar a da sessão (Pro). Se você tiver várias contas, veja [Contas de IA e rodízio](/docs/ai-accounts).

## Contexto

A porcentagem de contexto é quanto da janela de contexto do modelo a conversa já ocupa, segundo o próprio Claude Code.
