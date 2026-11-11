---
title: Agentes e estados
description: Como o Persisty reconhece o Claude Code e o Codex e mostra quem está trabalhando, quem espera você e quem pede permissão.
group: start
order: 4
---

O Persisty reconhece agentes de duas formas: quando você abre a sessão como Claude Code ou Codex, e quando você digita `claude` num terminal comum aberto pelo Persisty. Nos dois casos a sessão ganha o ícone do agente, o estado e o custo.

## Os estados

| Estado | Quer dizer |
| --- | --- |
| Trabalhando | O agente recebeu um pedido e ainda não terminou. |
| Aguardando você | Terminou o turno e espera o próximo pedido. |
| Permissão pendente | Quer rodar algo e espera o seu "sim" no terminal. |
| Ocioso | Aberto, sem pedido em andamento. |
| Encerrada | A conversa terminou. |

Os estados aparecem na aba, no cartão do workspace, na barra de projetos, na lista de agentes e no Quadro. Eles sempre vêm com ícone e palavra, nunca só com cor.

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

Se o Claude Code mostrar o aviso de confiança da pasta ("Yes, I trust this folder"), ele aparece antes de qualquer hook. O Persisty não pula esse aviso: o estado fica desconhecido até você responder no terminal.

## Codex

O Codex abre e persiste como qualquer sessão. Os hooks dele precisam ser aprovados por você dentro do próprio Codex (`/hooks`). Sem essa aprovação, o estado fica desconhecido. A retomada depois de um reinício ainda não foi confirmada, e o Persisty marca isso.

## Modelo por sessão

O rodapé da sessão tem um seletor de modelo. A escolha fica guardada e é passada com `--model` em cada lançamento e retomada. Numa sessão já aberta, o Persisty digita `/model` por você.
