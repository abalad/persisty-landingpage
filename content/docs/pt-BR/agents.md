---
title: Agentes e estados
description: Como o Persisty reconhece o Claude Code e o Codex e mostra quem está trabalhando, quem espera você e quem pede permissão.
group: agents
order: 1
---

O Persisty reconhece agentes de duas formas: quando você abre a sessão como Claude Code ou Codex CLI, e quando você digita `claude` num terminal comum aberto pelo Persisty. Nos dois casos a sessão ganha o ícone do agente. O estado e o custo vêm do Claude Code; o que funciona e o que ainda não funciona no Codex está em [Codex CLI](#codex-cli).

## Os estados

| Estado | Quer dizer |
| --- | --- |
| Trabalhando | O agente recebeu um pedido e ainda não terminou, inclusive o que ele deixou rodando em segundo plano, como subagentes. |
| Concluído | Terminou o turno e espera o próximo pedido. |
| Permissão pendente | Quer rodar algo e espera o seu "sim" no terminal. |
| Parado | Aberto, sem pedido em andamento, ou com o estado ainda desconhecido. |
| Encerrado | A conversa terminou. |

A palavra aparece no cabeçalho da sessão, na linha da sessão no cartão do workspace, na lista de **Agentes** da barra de projetos expandida e no painel **Detalhes**. A aba mostra o ícone do agente e um ponto colorido; a palavra fica na dica, ao passar o mouse. Recolhida, a barra de projetos mostra um ponto por projeto, explicado em [Barra de projetos](/docs/projects-and-workspaces#barra-de-projetos). O [Quadro](/docs/board) junta as sessões de agente de todos os projetos em colunas, e as [notificações](/docs/notifications) avisam quando uma termina ou pede permissão.

Num terminal comum, a sessão mostra **Executando**, com o nome do comando, enquanto algo roda, e **Parado** de volta no prompt. Uma sessão sem processo mostra o estado do processo, como **Interrompida**, **Encerrada** ou **Falhou**.

## Trabalho em segundo plano

Quando o Claude Code termina a resposta mas deixa um subagente ou um comando em segundo plano, a sessão fica em **Trabalhando** até esse trabalho acabar. A fila de pedidos, o aviso de concluído e a verificação ao terminar esperam o mesmo fim.

Um subagente conta como trabalho enquanto dá sinal de vida, até 2 horas sem notícias dele. Um comando em segundo plano, como um servidor de desenvolvimento, não dá notícias: conta por 10 minutos depois do fim da resposta. Passado esse tempo, a sessão mostra o estado em que o Claude Code parou.

## Claude Code

Cada sessão do Claude Code abre com um id de conversa escolhido pelo Persisty (`--session-id`). É com ele que o Persisty retoma a mesma conversa, com `--resume`, quando a sessão volta depois de um reinício; veja [Voltar depois de travar](/docs/sessions-and-recovery).

O estado vem dos **hooks** do próprio Claude: eventos que ele dispara ao começar, ao receber um pedido, ao parar e ao pedir permissão. O Persisty injeta esses hooks em cada sessão com `--settings`, num arquivo só dele. O seu `~/.claude/settings.json` nunca é alterado. O `claude` digitado num terminal comum recebe os mesmos hooks; se você mesmo passar um `--settings`, vale o seu, e o estado daquela sessão fica desconhecido.

Se o Claude Code mostrar o aviso de confiança da pasta ("Yes, I trust this folder"), ele aparece antes de qualquer hook. O Persisty não pula esse aviso: o estado fica desconhecido até você responder no terminal. Enquanto isso, a sessão aparece como **Parado**, e o Quadro diz **Sem notícias do agente**.

## Codex CLI

O Codex CLI abre e persiste como qualquer sessão: ganha aba e linha no cartão do workspace, e o Persisty reanexa o terminal quando você reabre o app com ele ainda rodando.

Duas coisas ainda não funcionam. A primeira é o estado: o Persisty não altera a configuração do Codex e não recebe os eventos dele, então a sessão aparece como **Parado** enquanto roda e não gera notificações. A segunda é retomar a conversa: depois de um reinício do computador, a sessão volta como um terminal comum na pasta dela, sem o Codex, e o relatório de restauração diz **Relançada**.

## Modelo por sessão

No Claude Code, o rodapé da sessão tem um seletor de modelo. A escolha fica guardada e é passada com `--model` em cada lançamento e retomada. Numa sessão já aberta, o Persisty digita `/model` por você. No Codex CLI, o rodapé mostra só o nome do agente, sem seletor.

## Agente padrão

<kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> abre direto uma sessão com o agente padrão no workspace atual, e em <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> ele já vem escolhido. Em **Configurações › Agentes › Agente padrão**, escolha entre **Claude Code**, que é o padrão, **Codex CLI** e **Terminal**. Um agente que não está no computador aparece com "(não instalado)" ao lado do nome. Se for ele o escolhido, vale o Claude Code ou, sem ele, o Codex CLI; sem nenhum dos dois, abre um terminal.

## Agentes detectados

Na mesma tela, **Agentes detectados** mostra o Claude Code e o Codex CLI como o Persisty os encontrou neste computador: a versão, ou **não instalado**, e onde está o programa, em **Instalado em …** ou **Não encontrado no PATH**. Embaixo, uma linha diz o que o Persisty consegue fazer com cada um. No Claude Code são identidade de sessão, retomada e status por hooks, com uso/tokens marcado como **Não verificado**. No Codex CLI, as quatro coisas aparecem como **Não verificado**.

## Ferramentas para os agentes

**Ferramentas do Persisty nos agentes**, em **Configurações › Agentes**, dá às sessões do Claude Code ferramentas que leem o projeto, as sessões dele e a saída dos comandos do workspace. Nenhuma delas digita em outro terminal. Vem desligado e vale para as sessões que começarem ou reiniciarem depois de ligar; **Verificar instalação** testa se funciona. Para o Codex CLI, a mesma tela mostra um comando para você rodar uma vez no terminal, porque o Persisty não altera a configuração do Codex; esse caminho está marcado como **Não verificado**.

Outros servidores MCP, como GitHub, Sentry ou Supabase, você instala em **Configurações › Servidores MCP** e liga por projeto em **Ajustes do projeto › Servidores MCP**. Eles valem só para as sessões do Claude Code que começarem ou reiniciarem depois.
