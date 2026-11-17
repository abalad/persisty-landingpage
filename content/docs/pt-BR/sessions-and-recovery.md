---
title: Voltar depois de travar
description: Como o Persisty traz as sessões de volta ao abrir, depois de um travamento ou de um reinício do computador, e como diz o que não voltou.
group: start
order: 4
---

O Persisty guarda o que precisa para trazer cada sessão de volta: a pasta, o comando, o agente e o id da conversa. Ao abrir, ele confere esse registro sessão por sessão e decide o que fazer com cada uma. Tudo nesta página é do plano grátis.

## Ao abrir o Persisty

Se a sessão ainda estiver rodando, o Persisty **reanexa** o terminal, com as últimas linhas do histórico. Nada é relançado nesse caso.

As sessões que caíram voltam sozinhas quando a regra delas manda: **Relançar se tiver caído**, que é o padrão, e **Relançar sempre**. As que têm **Só reanexar se estiver viva** esperam você pedir. Se havia alguma sessão para relançar, o relatório de restauração abre sozinho no fim.

## Reiniciar ou travar o computador

Depois de um reinício, **nenhum processo sobrevive**, em nenhum app. O que o Persisty faz é relançar cada sessão a partir do que guardou sobre ela.

- Sessões do **Claude Code** voltam com `claude --resume` na mesma conversa, no mesmo modo de permissão e, se o Claude Code estava trabalhando num worktree dele que ainda existe, nesse worktree. Quando o próprio Claude Code confirma a retomada, o relatório diz **Agente retomado**.
- Sessões do **Codex CLI** voltam como um terminal comum na pasta delas, sem o Codex: o Persisty não sabe qual conversa retomar. O relatório diz **Relançada**.
- **Terminais** voltam como um shell na mesma pasta. O comando inicial (por exemplo `pnpm dev`) só é digitado quando a sessão é criada; num relançamento, ele não roda de novo.

Quando o Persisty relança um agente sem sair da sessão, como ao trocar a conta dela, o processo antigo ainda avisa que terminou, às vezes depois. Esse aviso não deixa a sessão nova como encerrada.

## Quando relançar

Cada sessão tem uma regra, escolhida ao criá-la em **Nova sessão › Mais opções › Ao reabrir o Persisty**. Terminais e agentes abertos direto, sem passar por essa janela, ficam com o padrão. O painel **Detalhes** mostra a regra da sessão, sem permitir trocar.

| Regra | O que acontece |
| --- | --- |
| Relançar se tiver caído | Relança quando você abre o Persisty. É o padrão. |
| Só reanexar se estiver viva | Não relança sozinho; espera você pedir. |
| Relançar sempre | Relança ao abrir o Persisty também quando a sessão terminou, com erro ou não, inclusive quando você a parou com **Parar**. |

## Restaurar tudo

Para relançar na hora o que ficou para trás, use o botão **Restaurar N**, ao lado das abas, ou <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> (**Restaurar tudo** na paleta; <kbd>Ctrl</kbd> <kbd>⇧</kbd> <kbd>R</kbd> no Windows e no Linux). Ele relança as sessões que caíram, de todos os projetos, inclusive as de **Só reanexar se estiver viva**, e as que terminaram e têm **Relançar sempre**. Rodar duas vezes não duplica sessões: a que já voltou fica como está.

Uma sessão sem processo mostra **Sessão sem processo.**, com o motivo, e o botão **Tentar de novo**, que relança só ela, qualquer que seja a regra. É assim que volta uma sessão que terminou ou que você parou.

## O relatório de restauração

Toda restauração termina num relatório. No topo, uma linha diz o que o Persisty encontrou ao abrir: quantas sessões ele reanexou, quantas terminaram com o app fechado e quantas foram interrompidas, sem processo. Depois vem o resumo, com quantas voltaram, quantas falharam e quantas foram ignoradas, e uma linha por sessão: **Reanexada**, **Relançada**, **Agente retomado**, **Ignorada** ou **Falhou**, com o motivo quando houver, como **pasta de trabalho ausente** quando a pasta da sessão não existe mais.

O relatório abre sozinho quando o Persisty relança as sessões ao abrir e depois de **Restaurar tudo**. **Relatório de restauração**, na paleta (<kbd>⌘</kbd> <kbd>K</kbd>), abre de novo o último.

O Persisty nunca diz que uma sessão voltou sem ter voltado. **Agente retomado (retomada não confirmada)** quer dizer só que o comando de retomada foi executado. Num projeto preso a uma conta do Claude (Pro), uma sessão cuja conta não está conectada fica parada, e o relatório diz qual conta falta.

## Histórico do terminal

Ao reanexar, as últimas 5 000 linhas acima da tela aparecem no terminal antes do conteúdo ao vivo. Cada sessão guarda até 20 000 linhas.
