---
title: Recursos do Pro
description: Fila de pedidos, pontos de restauração, verificação ao terminar e pasta própria por sessão.
group: work
order: 2
---

A fila e os pontos de restauração ficam na **barra da borda direita da sessão** (**Fila de pedidos** e **Pontos de restauração**). A pasta própria se escolhe na **Nova sessão**, e a verificação ao terminar, no menu do comando do workspace, à direita das abas. Os recursos do Pro exigem a conta do Persisty com o plano Pro; o que já foi gravado continua utilizável se o plano acabar. As contas do Claude, com rodízio, troca pelo rodapé e conta por projeto, estão em [Contas de IA e rodízio](/docs/ai-accounts).

## Fila de pedidos

A fila funciona como um chat. Escreva o próximo pedido agora e escolha quando ele vai para o agente:

- **assim que o agente ficar livre**;
- **quando a janela de 5 h renovar**, com o horário lido da quota ao vivo da conta da própria sessão;
- **a partir de um horário**.

O cabeçalho da fila diz o que o agente está fazendo. Os próximos pedidos aparecem numerados, na ordem em que vão sair, com quando sai cada um e por que os de baixo esperam. Dá para arrastar para mudar a ordem (ou <kbd>⌥</kbd> <kbd>↑</kbd> e <kbd>⌥</kbd> <kbd>↓</kbd>), editar um pedido que ainda não saiu (a fila espera enquanto você edita), enviar um a seguir e tirar da fila. **Pausar fila** segura tudo, também com o app reaberto. Os enviados ficam recolhidos embaixo.

A caixa de escrever aceita imagens: <kbd>⌘</kbd> <kbd>V</kbd>, arrastar ou o clipe, até 8 por pedido e 10 MB cada (PNG, JPEG, GIF ou WebP). Elas ficam neste computador, e o agente recebe os caminhos no fim do pedido.

Os pedidos vão um por vez, na ordem da fila, e só quando o agente está esperando o próximo pedido; nunca no meio de um trabalho nem por cima de um pedido de permissão. Cada pedido vai exatamente como foi escrito, numa colagem só. Quando a conta fica sem quota, a fila espera a janela renovar; veja [Quando a quota acaba](/docs/ai-accounts#quando-a-quota-acaba).

A fila é conferida a cada 10 segundos com o Persisty aberto. Com o app fechado, nada é enviado. Só escrever, editar e anexar imagens são do Pro. No plano grátis, os pedidos que já estão na fila continuam saindo e podem ser pausados, retomados, reordenados, enviados a seguir ou tirados, e **Soltar a fila agora** também funciona.

## Pontos de restauração

Cada pedido a um agente grava o estado da pasta da sessão antes de ele começar, com a primeira linha do pedido como nome. Na aba **Pontos de restauração** você vê o que voltaria e o que seria apagado antes de confirmar. Restaurar guarda o estado de agora como um ponto novo, para você poder desfazer.

Descartar alterações também guarda um ponto antes, **Antes de descartar alterações**, inclusive no plano grátis. A aba lista e restaura os pontos guardados em qualquer plano; só gravar um ponto a cada pedido é do Pro.

- Funciona em pastas git e com agentes que avisam o pedido por hook (Claude Code).
- Guarda arquivos rastreados e novos; o que o `.gitignore` ignora fica de fora.
- Branch, HEAD e índice do git não mudam; commits feitos pelo agente não são desfeitos.
- Os pontos ficam como commits em `refs/persist/checkpoints/`, que um `git push` comum não envia. São 50 por sessão.

## Verificar ao terminar

No menu do comando do workspace, à direita das abas, escolha um comando (por exemplo `pnpm test`) e clique em **Verificar ao terminar com** seguido do nome dele. Quando o agente para depois de mudar arquivos, o comando roda sozinho na pasta da sessão, e o cabeçalho da sessão mostra **Verificação** com o resultado: rodando, passou, falhou (com o código de saída) ou interrompida. Clicar nele abre a saída.

Vale para sessões de agente dentro de um workspace. O resultado não é enviado ao agente.

## Pasta própria por sessão

Em pastas git, a sessão nova pode ganhar um branch `persist/<nome>` numa pasta só dela (um git worktree), para dois agentes nunca editarem os mesmos arquivos. Na **Nova sessão**, ligue **Pasta própria (worktree)**; o nome do branch pode ser mudado em **Branch novo**.

- A pasta fica em `~/.persist/worktrees`, ou na que você escolher em **Configurações › Workspace › Pasta dos worktrees** (vale para worktrees novos). Ela não traz o que o git ignora (`node_modules`, `.env`, builds).
- Ao fechar a sessão, o Persisty diz quantos arquivos não commitados a pasta tem e quantos commits o branch tem que a base não tem, e oferece **Manter a pasta** e **Remover a pasta**, ou **Descartar e remover** quando há arquivos não commitados.
- O branch nunca é apagado.
