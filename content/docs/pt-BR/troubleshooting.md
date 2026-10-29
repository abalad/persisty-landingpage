---
title: Problemas e limitações
description: Situações conhecidas, o que fazer em cada uma e o que o Persisty ainda não faz.
group: reference
order: 2
---

## O estado do agente aparece como desconhecido

O Claude Code mostra o aviso de confiança da pasta antes de qualquer hook. Responda no terminal e o estado aparece. No Codex, aprove os hooks com `/hooks` dentro dele.

## Digitei `claude` num terminal e a sessão não virou agente

Terminais abertos antes de uma atualização do Persisty não têm o atalho que adota o Claude Code. Abra um terminal novo.

## A quota aparece como indisponível

O Persisty lê a quota com a credencial que o Claude Code guarda. Se ela venceu, as barras usam os números da própria sessão até o Claude Code renová-la. Contas conectadas pelo Persisty precisam do item que o Claude Code cria no Keychain ao concluir o login.

## A fila não enviou o pedido

A fila só envia com o Persisty aberto e com o agente esperando o próximo pedido. Pedidos nunca vão durante um trabalho nem por cima de um pedido de permissão.

## O que o Persisty ainda não faz

- Trocar a conta de uma sessão no meio de um turno. Com o rodízio ligado, a troca acontece quando o turno termina.
- Integrações com ferramentas de analytics.
- Divisão do terminal em painéis lado a lado.
- No editor: autocompletar inteligente, "ir para definição", renomear ou apagar arquivos.
- Instalador assinado no Windows, e Windows e Linux testados em máquinas reais.
