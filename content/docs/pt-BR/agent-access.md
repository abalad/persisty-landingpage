---
title: Agentes que leem o Persisty
description: Ferramentas que deixam o Claude Code saber em que sessão está, ver o projeto e as outras sessões e ler a saída dos comandos do workspace.
group: integrations
order: 4
---

Com **Ferramentas do Persisty nos agentes** ligado, as sessões do Claude Code ganham ferramentas que leem o próprio Persisty: a sessão em que o agente está, o projeto, as outras sessões e a saída dos comandos do workspace. Nenhuma delas digita em outro terminal nem muda nada.

## Ligar

Em **Configurações › Agentes**, o grupo **Acesso dos agentes (MCP)** tem **Ferramentas do Persisty nos agentes**, desligado por padrão. A mudança vale para as sessões do Claude Code que começarem ou reiniciarem depois dela; as que já estão abertas continuam como estavam. Cada sessão recebe uma credencial só dela, e as ferramentas só respondem sobre o projeto dessa sessão.

## O que o agente lê

São quatro ferramentas, e o agente chama cada uma quando precisa. `current_session` diz o nome da sessão, o projeto, o workspace com a pasta e o branch padrão, o branch atual e, numa [pasta própria](/docs/worktrees), o branch e a base dela. `list_sessions` lista as sessões do mesmo projeto, com o agente, o estado, a pasta e o branch de cada uma, para o agente não trabalhar no mesmo branch que outro. `get_project` mostra o projeto, os workspaces com o remoto de cada um e os [comandos do workspace](/docs/commands). `read_task_output` lê as últimas linhas que um desses comandos imprimiu, rodando ou já encerrado, com o código de saída: 100 por padrão, até 500. Ela não lê terminais nem agentes.

As ferramentas perguntam ao app. Com o Persisty fechado, elas respondem isso ao agente.

## Verificar instalação

**Verificar instalação** abre o servidor como o Claude Code abriria, faz o aperto de mão do MCP, lista as ferramentas e fala com o app. Cada passo aparece com **ok** ou **falhou**, e o motivo quando falha. Deu certo quando o resumo começa com "Funcionando", seguido da versão do MCP e do número de ferramentas.

## Codex CLI

O Persisty não altera a configuração do Codex. Por isso, na mesma tela, a linha **Codex CLI** mostra um comando para você rodar uma vez no terminal, como `codex mcp add persisty -- '/Applications/Persisty.app/Contents/MacOS/persist-desktop' mcp-server`, com **Copiar** ao lado. Com o interruptor ligado, as sessões do Codex abertas pelo Persisty recebem a credencial delas. Esse caminho está marcado como **Não verificado**.

## Plano e limites

As ferramentas do Persisty são do plano grátis. Elas só leem, só respondem sobre o projeto da sessão e precisam do app aberto. Valem para as sessões abertas como Claude Code; no Codex CLI, dependem do comando acima, ainda não verificado.

Servidores MCP de outros serviços, como GitHub ou Sentry, ficam em [Servidores MCP](/docs/mcp-servers).
