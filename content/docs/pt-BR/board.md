---
title: Quadro
description: As sessões de agente de todos os projetos em quatro colunas, para ver quem espera você, há quanto tempo e o que quer.
group: agents
order: 2
---

Com várias sessões rodando, o Quadro responde quem está esperando por você, há quanto tempo e o que quer. Ele mostra as sessões de agente de todos os projetos em quatro colunas, e um clique num cartão abre a sessão.

![O Quadro com as sessões de todos os projetos em quatro colunas: a tecla A abre a que espera há mais tempo, e ⌘⇧O volta ao Quadro.](/changelog/0.10.0/quadro.mp4)

## Abrir o Quadro

Abra pelo botão ao lado das abas, com <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> ou por **Quadro de sessões**, na paleta de comandos (<kbd>⌘</kbd> <kbd>K</kbd>). O Quadro toma o lugar do terminal. Para voltar, use **Voltar ao terminal**, <kbd>Esc</kbd> ou a mesma tecla.

No topo, troque **Todos os projetos** por **Este projeto** para ver só as sessões do projeto atual. Ao lado ficam três contagens: quantas sessões precisam de você, com a espera mais longa; quantas estão trabalhando; e quantos cartões novos você ainda não abriu, como **2 não lidas**. Clicar na primeira abre a sessão que espera há mais tempo.

## As colunas

**Precisa de você** junta os pedidos de permissão, as perguntas do agente e as respostas que terminam em pergunta, da espera mais antiga para a mais nova. Uma permissão que você aprovou no próprio terminal sai da coluna sozinha em poucos segundos.

**Trabalhando** diz o que cada agente faz agora, como "Editando" ou "Rodando", seguido do arquivo ou do comando. **Respondeu** traz o fim da última resposta; as sessões que só esperam o próximo pedido, sem nada novo para ler, ficam recolhidas embaixo, num grupo como **3 sessões paradas**. **Erro** mostra turnos que falharam, como "Limite de uso atingido", e processos que pararam com erro.

## Os cartões

Cada cartão diz em uma linha o que a sessão quer: o comando que espera permissão, a pergunta que o agente fez, o fim da resposta ou o erro. Uma pergunta longa aparece pelo fim, com a interrogação, e inteira ao parar o ponteiro em cima. Ao lado do nome vem há quanto tempo. Embaixo, o projeto, ou o workspace em **Este projeto**, e o branch, quando não é o principal.

Respostas e erros que você ainda não abriu aparecem em negrito, com um ponto. A sessão que espera há mais tempo ganha a moldura âmbar e a dica <kbd>A</kbd> **abre esta**. Uma sessão de que o Persisty ainda não tem notícias, como um Claude Code parado no aviso de confiança da pasta, diz **Sem notícias do agente**.

## Teclas

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> abre e fecha o Quadro. Com ele aberto, <kbd>A</kbd> abre a sessão que espera há mais tempo e <kbd>Esc</kbd> volta ao terminal. Essas duas não valem enquanto você digita num campo ou com uma janela aberta por cima.

No Windows e no Linux, que estão em prévia, o atalho é <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>O</kbd>. Com o mapa de teclas **WebStorm (macOS)**, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> com o cursor no código abre um arquivo pelo nome; ali, use o botão.

## Plano e limites

O Quadro é do plano grátis. Ele só abre sessões: nunca responde a uma permissão ou a uma pergunta por você, e a resposta continua sendo no terminal da sessão.

Sessões interrompidas, como as que ficam assim depois de reiniciar o computador, e conversas encerradas ficam fora do Quadro; veja [Voltar depois de travar](/docs/sessions-and-recovery).
