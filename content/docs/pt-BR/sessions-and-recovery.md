---
title: Sessões e recuperação
description: Como o Persisty traz as sessões de volta depois de um travamento ou de um reinício, e como ele diz o que não voltou.
group: start
order: 3
---

O Persisty guarda o que precisa para trazer cada sessão de volta: pasta, comando, agente e o id da conversa. Ao abrir, ele confere esse registro sessão por sessão e decide o que fazer com cada uma.

## Ao abrir o Persisty

Se a sessão ainda estiver rodando, o Persisty **reanexa** o terminal, com as últimas linhas do histórico. Nada é relançado nesse caso.

## Reiniciar ou travar o computador

Depois de um reinício, **nenhum processo sobrevive**, em nenhum app. O que o Persisty faz é relançar cada sessão a partir do que guardou sobre ela: pasta, comando, agente e o id da conversa.

- Sessões do **Claude Code** voltam com `claude --resume` na mesma conversa. Quando o próprio Claude Code confirma a retomada, o relatório diz **Agente retomado**.
- Sessões do **Codex** são relançadas, mas a retomada ainda não é confirmada; o relatório diz isso.
- **Terminais** com um comando inicial (por exemplo `pnpm dev`) são relançados com o mesmo comando.

## Quando relançar

Cada sessão tem uma regra, escolhida ao criá-la:

| Regra | O que acontece depois de um reinício |
| --- | --- |
| Relançar se tiver caído | Relança quando você abre o Persisty. É o padrão. |
| Só reanexar se estiver viva | Não relança sozinho; espera você pedir. |
| Relançar sempre | Relança sempre que a sessão puder voltar, inclusive depois de encerrar com erro. |

Para relançar na hora o que ficou para trás, use **Restaurar tudo** (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd>). Rodar duas vezes não duplica sessões.

## O relatório de restauração

Toda restauração termina num relatório com uma linha por sessão: reanexada, relançada, agente retomado, ignorada ou falhou, com o motivo quando houver. O resumo diz quantas voltaram, quantas falharam e quantas foram ignoradas. O relatório abre sozinho quando o Persisty relança as sessões ao abrir e depois de **Restaurar tudo**. A paleta de comandos abre de novo o último.

O Persisty nunca diz que uma sessão voltou sem ter voltado. "Agente retomado" sem confirmação quer dizer só que o comando de retomada foi executado.

## Histórico do terminal

Ao reanexar, as últimas 5 000 linhas acima da tela aparecem no terminal antes do conteúdo ao vivo. Cada sessão guarda até 20 000 linhas.
