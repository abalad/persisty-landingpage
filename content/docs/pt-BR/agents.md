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

A palavra aparece no cabeçalho da sessão, na linha da sessão no cartão do workspace, na lista de **Agentes** da barra de projetos expandida e no painel **Detalhes**. A aba mostra o ícone do agente e um ponto colorido; a palavra fica na dica, ao passar o mouse. Recolhida, a barra de projetos mostra um ponto por projeto, explicado em [Barra de projetos](/docs/projects-and-workspaces#barra-de-projetos). O Quadro separa as sessões em colunas.

Num terminal comum, a sessão mostra **Executando**, com o nome do comando, enquanto algo roda, e **Parado** de volta no prompt. Uma sessão sem processo mostra o estado do processo, como **Interrompida**, **Encerrada** ou **Falhou**.

## Notificações

Quando um agente termina o turno ou pede permissão, o Persisty avisa, a menos que você já esteja olhando aquela sessão. Com a janela do Persisty em foco, aparece um alerta no canto, com o botão **Ver**; com outra janela na frente, vem a notificação do sistema. Os dois vêm com um som curto. Avisos e som vêm ligados. Para mudar, use **Configurações › Notificações**, onde **Enviar teste** mostra como fica.

## O Quadro

Com várias sessões rodando, o Quadro responde quem está esperando por você, há quanto tempo e o que ela quer. Ele mostra as sessões de agente de todos os projetos em quatro colunas: **Precisa de você**, **Trabalhando**, **Respondeu** e **Erro**. Abra pelo botão ao lado das abas ou com <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd>.

Cada cartão diz em uma linha o que a sessão quer: o comando que espera permissão, a pergunta que o agente fez, o fim da resposta ou o erro, como "Limite de uso atingido". Uma resposta que termina em pergunta vai para **Precisa de você**, e uma permissão que você aprovou no próprio terminal sai da coluna sozinha em poucos segundos. Respostas e erros que você ainda não abriu aparecem em negrito, com um ponto.

A sessão que espera há mais tempo ganha a moldura âmbar, e a tecla <kbd>A</kbd> abre essa. Clicar num cartão abre a sessão, e <kbd>Esc</kbd> volta ao terminal. No topo, dá para trocar **Todos os projetos** por **Este projeto**.

No Windows e no Linux, o atalho é Ctrl+Shift+O. Com o mapa de teclas **WebStorm (macOS)**, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> com o cursor no código abre um arquivo pelo nome; ali, use o botão.

## O mascote fora do app

No macOS, o mascote pode sair do canto do terminal e ficar em pé sobre as suas janelas, por cima de qualquer app. Assim ele avisa enquanto você está no editor ou no navegador, sem que você precise olhar para o Persisty. Ele vem desligado: ligue em **Configurações › Aparência › Mascote fora do app**.

Quando uma sessão pede você, ele sobe, mostra quantas estão esperando e diz qual, como "checkout pede permissão". Clicar na fala abre a sessão. Um clique nele abre um balão com quem espera, há quanto tempo e o que pediu, com atalhos para a sessão e para o Quadro. Clicar ou arrastar o mascote não tira o foco do app em que você está.

Ele fica no topo da janela da frente, vai junto quando ela se mexe e cai quando ela some; quando nada acontece, senta e cochila. Arraste-o para qualquer lugar, em qualquer monitor, e ele lembra a posição. Para ele ficar só onde você deixar, desligue **O mascote anda sobre as janelas**, na mesma tela. No balão, **Não perturbe** faz ele parar de subir e de falar, mas a contagem continua.

Com o mascote fora do app, o do terminal some. Fechar o Persisty fecha o mascote.

## De onde vem o estado

No Claude Code, o estado vem dos **hooks** do próprio Claude: eventos que ele dispara ao começar, ao receber um pedido, ao parar e ao pedir permissão. O Persisty injeta esses hooks em cada sessão com `--settings`, num arquivo só dele. O seu `~/.claude/settings.json` nunca é alterado.

Se o Claude Code mostrar o aviso de confiança da pasta ("Yes, I trust this folder"), ele aparece antes de qualquer hook. O Persisty não pula esse aviso: o estado fica desconhecido até você responder no terminal. Enquanto isso, a sessão aparece como **Parado**, e o Quadro diz **Sem notícias do agente**.

## Codex CLI

O Codex CLI abre e persiste como qualquer sessão: ganha aba e linha no cartão do workspace, e o Persisty reanexa o terminal quando você reabre o app com ele ainda rodando.

Duas coisas ainda não funcionam. A primeira é o estado: o Persisty não altera a configuração do Codex e não recebe os eventos dele, então a sessão aparece como **Parado** enquanto roda e não gera notificações. A segunda é retomar a conversa: depois de um reinício do computador, a sessão volta como um terminal comum na pasta dela, sem o Codex, e o relatório de restauração diz **Relançada**. Em **Configurações › Agentes**, o Codex CLI aparece com a retomada e o status marcados como **Não verificado**.

## Modelo por sessão

No Claude Code, o rodapé da sessão tem um seletor de modelo. A escolha fica guardada e é passada com `--model` em cada lançamento e retomada. Numa sessão já aberta, o Persisty digita `/model` por você. No Codex CLI, o rodapé mostra só o nome do agente, sem seletor.

## Agente padrão

<kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> abre direto uma sessão com o agente padrão no workspace atual, e em <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> ele já vem escolhido. O padrão é o Claude Code; troque em **Configurações › Agentes › Agente padrão**. Se o escolhido não estiver instalado, vale o primeiro agente instalado.

## Ferramentas para os agentes

**Ferramentas do Persisty nos agentes**, em **Configurações › Agentes**, dá às sessões do Claude Code ferramentas que leem o projeto, as sessões dele e a saída dos comandos do workspace. Nenhuma delas digita em outro terminal. Vem desligado e vale para as sessões que começarem ou reiniciarem depois de ligar; **Verificar instalação** testa se funciona. Para o Codex CLI, a mesma tela mostra um comando para você rodar uma vez no terminal, porque o Persisty não altera a configuração do Codex; esse caminho está marcado como **Não verificado**.

Outros servidores MCP, como GitHub, Sentry ou Supabase, você instala em **Configurações › Servidores MCP** e liga por projeto em **Ajustes do projeto › Servidores MCP**. Eles valem só para as sessões do Claude Code que começarem ou reiniciarem depois.
