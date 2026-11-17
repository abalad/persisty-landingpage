---
title: Notificações
description: Quando e como o Persisty avisa que um agente terminou ou pede permissão, com alerta no app, notificação do sistema e som.
group: agents
order: 4
---

Quando um agente termina o turno ou pede permissão, o Persisty avisa, a menos que você já esteja olhando aquela sessão. O aviso pode ser um alerta no canto da janela, a notificação do sistema e um som curto.

## Quando o Persisty avisa

Com a janela do Persisty em foco, aparece um alerta no canto com o nome da sessão, **Terminou e espera você** ou **Pede permissão**, e o botão **Ver**, que abre a sessão. O alerta some sozinho depois de 10 segundos, e ficam no máximo três ao mesmo tempo. Com outra janela na frente, vem a notificação do sistema. Os dois vêm com dois tons curtos e baixos. Se a sessão já está na sua frente, com o Persisty em foco, nada aparece.

Uma resposta que deixou trabalho em segundo plano só avisa quando esse trabalho acaba; veja [Trabalho em segundo plano](/docs/agents#trabalho-em-segundo-plano). Pelo mesmo caminho chegam os avisos de quota: quando uma conta fica sem quota, com quantas sessões esperam, e quando cada sessão retoma a tarefa; veja [Quando a quota acaba](/docs/ai-accounts#quando-a-quota-acaba).

## Configurar

Em [**Configurações › Notificações**](/docs/settings#notificações) ficam três chaves, todas ligadas de início. **Alertas dentro do app** liga o alerta do canto, e **Tocar som** liga os dois tons. **Silenciar com o Persisty em foco** deixa de fora a notificação do sistema enquanto a janela está em foco; desligada, você recebe o alerta e a notificação ao mesmo tempo.

## Enviar um teste

**Enviar teste**, na mesma tela, dispara o alerta, o som e a notificação do sistema de uma vez, sem olhar foco nem silêncio, para você ver como ficam.

Se a notificação do sistema não aparecer, confira se o Persisty está liberado nos ajustes de notificações do sistema. Quando o sistema conta que bloqueou, a tela mostra **Bloqueadas no sistema**; libere o Persisty lá e envie o teste de novo. Nem sempre o sistema conta, por isso a dica de onde olhar fica sempre na tela.

## Plano e limites

As notificações são do plano grátis e saem com o Persisty aberto. Elas dependem dos hooks do Claude Code: por padrão, o Codex CLI não manda o estado ao Persisty e não gera avisos.
