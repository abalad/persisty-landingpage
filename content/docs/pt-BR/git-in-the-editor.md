---
title: Git no editor
description: O Git de cada arquivo dentro do editor, com marcas na margem, autor de cada linha, anotação do git blame, diffs e histórico, e o submenu Git da árvore e da aba.
group: code
order: 4
---

O [editor](/docs/editor) mostra o Git do arquivo aberto sem você sair dele: o que mudou desde o último commit, quem mudou cada linha e o histórico do arquivo. Para fazer commits, enviar e trocar de branch, use o painel [Alterações](/docs/changes).

## Marcas na margem

Num arquivo de um repositório, a margem marca as linhas adicionadas, alteradas e apagadas desde o último commit, e as marcas acompanham enquanto você digita. O botão **Diferenças desde o último commit**, na barra das abas, mostra no próprio editor o diff do arquivo contra o HEAD. Num arquivo que não está no último commit, como um arquivo novo ou fora de um repositório, o botão fica apagado, e a barra de status diz **fora do git**.

## Autor da linha

No fim da linha do cursor, depois de um instante parado, o editor mostra quem mudou a linha, quando e com que mensagem, como "Ana, há 3 d • Corrige o fuso". Depois de 7 dias, aparecem a data e a hora do commit. Uma linha que ainda não foi commitada diz "Você • não commitado". Passar o ponteiro abre o cartão do commit, com **Copiar hash**, **Mostrar o commit**, que abre o commit no [histórico das Alterações](/docs/changes#histórico), e [**Abrir na forja**](/docs/forges#abrir-na-forja), que abre o arquivo naquele commit, na mesma linha, no GitHub, GitLab ou Bitbucket. Pelo teclado, use **Mostrar o cartão do commit da linha**, na paleta (<kbd>⌘</kbd> <kbd>K</kbd>).

Em [**Configurações › Editor › Autor da linha (git blame)**](/docs/settings#editor), **Mostrar o autor no fim da linha** vem ligado. Com ele ligado, **Autor**, **Data** e **Mensagem** escolhem o que aparece, e **Atraso**, de 300 a 2000 ms, quanto tempo parado antes de aparecer; o padrão é 600 ms.

## Anotar com o git blame

**Anotar com o git blame**, no submenu **Git** ou na paleta, põe na margem o autor e a data de cada linha, com a cor pela idade do commit. Um clique na anotação destaca as linhas do mesmo commit e abre o cartão dele, e o botão direito abre **Mostrar o diff do commit**, **Anotar a revisão anterior**, **Copiar hash** e **Fechar a anotação**. Arquivos com mais de 20 mil linhas não são anotados.

## O submenu Git

O botão direito na [árvore](/docs/files) e na [aba](/docs/tabs-and-groups#o-menu-da-aba) tem o submenu **Git**: **Mostrar diff**, **Mostrar histórico**, **Mostrar histórico da seleção**, **Comparar com branch…**, **Comparar com commit…**, **Preparar**, **Tirar da preparação**, **Descartar alterações** e **Anotar com o git blame**. Todos estão também na paleta.

**Mostrar histórico da seleção** usa as linhas selecionadas no código, por isso vale na aba e na paleta, não na árvore. **Preparar**, **Tirar da preparação** e **Descartar alterações** aceitam vários arquivos e pastas; os outros, um arquivo só. Um item que não vale para o que você escolheu fica apagado e diz por quê, como "arquivo não versionado" ou "sem alterações".

## Diffs e histórico em abas

Os diffs e o histórico abrem em abas só de leitura, ao lado das abas dos arquivos. Um diff contra o arquivo aberto acompanha o texto que você ainda não gravou, e o título da aba diz "não gravado" quando é o caso.

**Mostrar histórico** lista os commits que mudaram o arquivo, do mais novo para o mais antigo, e o diff do commit escolhido aparece embaixo; as setas andam pela lista. **Mostrar no painel** abre o commit nas [Alterações](/docs/changes), e **Copiar hash** copia o hash dele. **Comparar com branch…** e **Comparar com commit…** abrem uma lista com busca para escolher o outro lado.

## Descartar alterações

**Descartar alterações** pergunta antes e grava um ponto de restauração, **Antes de descartar alterações**. O texto que você digitou numa aba aberta é gravado primeiro, para o ponto guardar também isso. Para trazer o arquivo de volta, use o painel [Pontos de restauração](/docs/restore-points#antes-de-descartar).

## Plano e limites

Tudo desta página é do plano grátis, inclusive o ponto de restauração antes de descartar.

Os recursos só aparecem em pastas que são repositórios git. Nada aqui vai à internet, a não ser **Abrir na forja**, que abre o navegador. Arquivos com mais de 20 mil linhas não são anotados, e uma anotação que demora demais é interrompida.
