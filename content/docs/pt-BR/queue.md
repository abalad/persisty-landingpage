---
title: Fila de pedidos
description: Escreva agora o próximo pedido ao agente e escolha quando ele vai, assim que o agente ficar livre, quando a janela de 5 h renovar ou a partir de um horário.
group: agents
order: 7
---

A fila guarda os próximos pedidos a um agente e entrega um por vez, quando chega a hora e o agente está livre. Ela fica em **Fila de pedidos**, na barra da borda direita da sessão, e funciona como um chat: o que sai primeiro fica em cima, e a caixa de escrever, embaixo.

## Pôr um pedido na fila

Escreva o pedido na caixa, escolha quando ele sai e clique em **Pôr na fila**, ou use <kbd>⌘</kbd> <kbd>↵</kbd>. No Windows e no Linux, que estão em prévia, as teclas desta página usam <kbd>Ctrl</kbd> no lugar de <kbd>⌘</kbd> e <kbd>Alt</kbd> no lugar de <kbd>⌥</kbd>.

O cabeçalho da fila diz o que o agente está fazendo, como **Trabalhando**, **Terminou, pronto para o próximo** ou **Pedindo permissão**. Os pedidos que esperam aparecem numerados em **Próximos**, na ordem em que vão sair, com quando sai cada um e por que os de baixo esperam, como "esperando o nº 1". O primeiro tem a marca **próximo**. Os enviados ficam recolhidos embaixo, em **Enviados**. Na barra da sessão, o ícone da fila mostra quantos pedidos esperam, também com o painel fechado.

## Quando cada pedido sai

Ao lado da caixa, escolha quando o pedido vai: **Assim que o agente ficar livre**, **Quando a janela de 5 h renovar** ou **A partir de um horário**, que você marca. A [janela de 5 h](/docs/usage-and-quota#janelas-de-5-h-e-7-d) usa o horário lido da quota ao vivo da conta da própria sessão; enquanto esse horário não é conhecido, a opção fica desligada.

A hora marcada é só o mais cedo: o pedido ainda espera o agente ficar livre e os pedidos de cima saírem.

## Mudar a ordem e editar

Arraste um pedido pela alça para mudar a ordem ou, com ele em foco, use <kbd>⌥</kbd> <kbd>↑</kbd> e <kbd>⌥</kbd> <kbd>↓</kbd>. Cada pedido tem botões para editar, enviar a seguir e tirar da fila. Enviar a seguir põe o pedido no topo e tira a hora marcada: ele sai assim que o agente ficar livre.

Editar leva o texto de volta à caixa, e a fila espera enquanto você edita. Se você passar 15 minutos sem mexer, a fila volta a andar. **Pausar fila** segura tudo, também com o app reaberto, até você clicar em **Retomar fila**.

## Imagens

A caixa aceita imagens: <kbd>⌘</kbd> <kbd>V</kbd>, arrastar para a caixa ou o clipe, **Anexar imagens**. São até 8 por pedido, de até 10 MB cada, em PNG, JPEG, GIF ou WebP. Elas ficam neste computador, e o agente recebe os caminhos no fim do pedido, numa linha que começa com `Imagens:`, ou `Images:` com o app em inglês. Se uma imagem sumir do disco antes da hora, o pedido não sai, e **Enviados** diz por quê. No Codex CLI, as imagens ainda não foram verificadas.

## Como os pedidos chegam ao agente

Os pedidos vão um por vez, na ordem da fila, e só quando o agente está esperando o próximo pedido. Nunca saem no meio de um trabalho, nem enquanto a resposta deixou um subagente ou um comando em segundo plano, nem por cima de um pedido de permissão. Entre um pedido e o seguinte, a fila espera pelo menos 20 segundos.

Cada pedido vai exatamente como foi escrito, numa colagem só, e o Persisty aperta Enter logo depois, para o Claude Code enviar em vez de guardar como rascunho. Quebras de linha dentro do pedido não mandam nada antes da hora, e um pedido longo vai inteiro.

Quando a conta fica sem quota, a fila espera a janela renovar; veja [Quando a quota acaba](/docs/ai-accounts#quando-a-quota-acaba).

## Plano e limites

Só escrever, editar e anexar imagens são do [Pro](/docs/pro). No plano grátis, os pedidos que já estão na fila continuam saindo e podem ser pausados, retomados, reordenados, enviados a seguir ou tirados, e **Soltar a fila agora** também funciona.

A fila é conferida a cada 10 segundos com o Persisty aberto. Com o app fechado, nada é enviado. A fila é só para sessões de agente. Se a sessão termina, os pedidos que esperavam saem da fila com a nota **a sessão terminou antes**. Por padrão, o Persisty não recebe o estado do Codex CLI, então não sabe quando ele está livre, e os pedidos não saem.
