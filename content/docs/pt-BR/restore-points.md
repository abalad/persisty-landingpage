---
title: Pontos de restauração
description: Cada pedido ao agente grava o estado da pasta antes de ele começar, e descartar alterações também; veja o que mudaria e volte a qualquer ponto.
group: agents
order: 8
---

Um ponto de restauração é o estado dos arquivos da pasta da sessão num momento. O Persisty grava um antes de cada pedido ao agente e outro antes de você descartar alterações, e deixa você voltar a qualquer um. Os pontos ficam em **Pontos de restauração**, na barra da borda direita da sessão.

## O que é gravado

Cada pedido ao Claude Code grava o estado da pasta antes de o agente começar, com a primeira linha do pedido como nome. Se nada mudou desde o último ponto, nenhum ponto novo é gravado, e isso vale também para os pontos de antes de restaurar e de antes de descartar. A lista mostra os pontos do mais novo para o mais antigo, cada um com há quanto tempo foi gravado.

O ponto guarda os arquivos rastreados e os novos; o que o `.gitignore` ignora fica de fora. Ele fica como um commit em `refs/persist/checkpoints/`, que um `git push` comum não envia. Branch, HEAD e índice do git não mudam.

## Restaurar

![Em Pontos de restauração, um clique num ponto mostra os arquivos que voltam; Restaurar este ponto pede confirmação, e o estado de antes vira o ponto Antes de restaurar, no topo da lista.](/docs-media/restore-points/pontos.mp4)

Clique num ponto para ver o que muda ao restaurar: quantos arquivos voltam e quantos criados depois são apagados, com a lista deles. **Restaurar este ponto** pede confirmação e põe os arquivos como estavam antes daquele pedido. Se o agente estiver trabalhando na pasta, a confirmação avisa para pará-lo antes, porque ele pode reescrever arquivos durante a restauração.

Restaurar guarda antes o estado de agora como um ponto novo, **Antes de restaurar**, para você poder desfazer. Só os arquivos da pasta voltam: commits feitos pelo agente continuam no branch.

## Antes de descartar

Descartar alterações, no painel [**Alterações**](/docs/changes#preparar-e-descartar) ou no submenu [**Git**](/docs/git-in-the-editor#o-submenu-git) da árvore e da aba do editor, guarda antes um ponto chamado **Antes de descartar alterações**. Se esse ponto não puder ser gravado, nada é descartado. Para desfazer um descarte, restaure esse ponto.

## Plano e limites

Gravar um ponto a cada pedido é do [Pro](/docs/pro). O ponto antes de descartar é gravado em qualquer plano, e a lista mostra e restaura os pontos guardados em qualquer plano, também depois que o Pro acaba.

Os pontos só existem em pastas git. Os pontos por pedido dependem do hook do Claude Code que avisa o pedido; por padrão, o Codex CLI não grava. São 50 por sessão, e os mais antigos saem. Fechar a sessão apaga os pontos dela.
