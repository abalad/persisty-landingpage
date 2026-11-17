---
title: Pasta própria
description: Uma sessão num branch e numa pasta só dela, um git worktree, para dois agentes nunca editarem os mesmos arquivos.
group: agents
order: 9
---

Em pastas git, uma sessão nova pode ganhar um branch `persist/<nome>` numa pasta só dela, um git worktree. Assim dois agentes trabalham no mesmo repositório sem nunca editar os mesmos arquivos.

## Criar a pasta

Na [**Nova sessão**](/docs/sessions#nova-sessão), com uma pasta git, ligue **Pasta própria (worktree)**. A dica mostra o branch novo e de onde ele parte, como "Novo branch persist/pagamento-pix a partir de main, numa pasta só desta sessão." O nome vem do nome da sessão, em minúsculas e sem acentos, e ganha um número se já existir; mude em **Branch novo**. O branch parte do que está em uso na pasta agora.

A sessão abre na pasta nova, na mesma subpasta que você escolheu, e o cabeçalho mostra a marca `worktree`; passar o mouse mostra a pasta e o branch. Vale para qualquer sessão, de agente ou de terminal. A pasta nova só traz o que está no commit de partida: as alterações não commitadas e o que o git ignora, como `node_modules`, `.env` e builds, ficam na pasta original.

## Onde ficam

As pastas ficam em `~/.persist/worktrees`, agrupadas numa pasta por repositório. Para usar outra, clique em **Escolher…** em [**Configurações › Workspace › Pasta dos worktrees**](/docs/settings#workspace); **Usar o padrão** volta à de sempre. A mudança vale para worktrees novos, e os que já existem ficam onde estão.

## Fechar a sessão

Ao fechar uma sessão com pasta própria, o Persisty diz quantos arquivos não commitados a pasta tem e quantos commits o branch tem que a base não tem. Escolha **Manter a pasta**, que deixa a pasta no disco para você abrir depois como workspace, ou **Remover a pasta**. Com arquivos não commitados, remover vira **Descartar e remover**. Se o git recusar remover a pasta, a sessão fica parada e o Persisty mostra o motivo.

O branch continua no repositório em todos os casos: o Persisty nunca apaga o branch.

## Plano e limites

A pasta própria é do [Pro](/docs/pro); sem ele, a opção aparece desligada, com a marca **Pro**. Ela só existe em pastas git.
