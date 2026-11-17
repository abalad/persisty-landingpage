---
title: Verificar ao terminar
description: Um comando do workspace, como os testes, roda sozinho quando o agente para depois de mudar arquivos, e o cabeçalho da sessão mostra se passou.
group: agents
order: 10
---

A verificação ao terminar roda um comando do workspace, como `pnpm test`, quando o agente termina um turno em que mudou arquivos. O resultado aparece no cabeçalho da sessão.

## Escolher o comando

No seletor de comandos do workspace, ao lado das abas, escolha o comando, por exemplo `pnpm test`. Abra o seletor de novo: embaixo da lista aparece **Verificar ao terminar com** seguido do nome dele. Um clique liga, com a marca de seleção, e outro desliga. O comando vale para o workspace inteiro: todas as sessões de agente dele usam o mesmo. Se outro comando já estiver escolhido, o menu mostra **Agora:** com ele.

## Quando roda

O Persisty anota o estado dos arquivos quando o agente recebe um pedido. Quando ele termina o turno, se algum arquivo mudou, o comando roda sozinho na pasta da sessão. Um turno que não mudou nada não dispara a verificação. Se a resposta deixou um subagente ou um comando em segundo plano, a verificação espera esse trabalho acabar.

## O resultado

O cabeçalho da sessão mostra **Verificação** com o resultado: **rodando**, **passou**, **falhou** com o código de saída, ou **interrompida**. Clicar nele abre a saída da verificação em **Saída do comando**. O resultado não é enviado ao agente: quem lê é você.

## Plano e limites

A verificação é do Pro; sem ele, o item do menu aparece com a marca **Pro**. Ela vale para sessões do Claude Code dentro de um workspace, em pastas git, porque depende dos hooks que avisam o pedido e o fim do turno. O Codex CLI não dispara a verificação.
