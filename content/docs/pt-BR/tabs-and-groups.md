---
title: Abas e grupos
description: As abas do editor, como trocar, fechar, fixar e reordenar, e o editor dividido em até quatro grupos lado a lado ou empilhados.
group: code
order: 5
---

Cada arquivo aberto no [editor](/docs/editor) ganha uma aba. O editor pode se dividir em até quatro grupos, lado a lado ou empilhados, cada um com as suas abas, e o mesmo arquivo pode estar aberto em mais de um grupo.

## O menu da aba

O botão direito numa aba, ou <kbd>⇧</kbd> <kbd>F10</kbd> com a aba em foco, abre o menu dela. Nele ficam todas as formas de fechar, **Copiar caminho**, [**Mostrar na árvore**](/docs/code-navigation#mostrar-na-árvore), o submenu [**Favoritos**](/docs/code-navigation#favoritos), as divisões do editor, **Fixar aba**, **Configurar as abas**, **Maximizar o editor**, **Trocar tipo do arquivo…**, **Abrir em**, os submenus [**Histórico local**](/docs/local-history) e [**Git**](/docs/git-in-the-editor#o-submenu-git), **Renomear arquivo…** e **Recarregar do disco**. Uma aba de fora da pasta da sessão não tem **Mostrar na árvore** nem **Favoritos**. Um item que não vale para aquela aba fica apagado e diz por quê, como "é a única aba". As abas de diff e de histórico do Git têm só as formas de fechar.

## Trocar de aba

<kbd>⌃</kbd> <kbd>Tab</kbd>, **Alternar entre abas**, abre a lista das abas abertas, das usadas há pouco para as mais antigas. Ele vale em qualquer mapa de teclas, também com o foco no terminal. Com <kbd>⌃</kbd> pressionado, <kbd>Tab</kbd> e <kbd>⇧</kbd> <kbd>Tab</kbd> andam na lista; soltar o <kbd>⌃</kbd> abre a aba, e <kbd>Esc</kbd> cancela.

Para ir à próxima aba ou à anterior, use <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>]</kbd> e <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>[</kbd> no Mac, ou as teclas do mapa: <kbd>⌃</kbd> <kbd>→</kbd> e <kbd>⌃</kbd> <kbd>←</kbd> nos mapas WebStorm (o macOS usa essas duas para trocar de espaço, por padrão), <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>→</kbd> e <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>←</kbd> no VS Code. **Reabrir aba fechada** traz de volta a última aba fechada: <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>T</kbd> no mapa do VS Code, e pela paleta (<kbd>⌘</kbd> <kbd>K</kbd>) nos outros.

## Fechar abas

O **×** da aba fecha a aba. No painel **Código**, fora do texto, <kbd>⌘</kbd> <kbd>W</kbd> fecha a aba do editor em qualquer mapa, e nunca a janela. Dentro do texto, <kbd>⌘</kbd> <kbd>W</kbd> fecha a aba nos mapas WebStorm (macOS) e VS Code; no WebStorm, ali, ele amplia a seleção, e fechar a aba é <kbd>⌘</kbd> <kbd>F4</kbd>.

O menu da aba tem **Fechar**, **Fechar as outras abas**, **Fechar todas as abas**, **Fechar as não modificadas**, **Fechar as abas à esquerda** e **Fechar as abas à direita**. Só as abas com alterações não gravadas pedem confirmação, numa pergunta só: **Gravar todas** ou **Descartar todas**. Com [Salvar automaticamente](/docs/editor#salvar-automaticamente) ligado, elas são gravadas sem pergunta.

Se, ao gravar, uma aba esbarra num arquivo que mudou no disco, só essa aba fica aberta, com o aviso de conflito, e as outras fecham. Um aviso diz quais abas ficaram.

## Fixar uma aba

**Fixar aba**, no menu da aba, põe a aba à esquerda, com um alfinete. Uma aba fixada não fecha com **Fechar as outras abas**, **Fechar todas as abas** nem pelo limite de abas. O mesmo item, marcado, desfaz a fixação.

## Mudar a ordem

Arraste uma aba para mudar a ordem ou para levá-la a outro grupo. Soltar na borda direita ou de baixo de um grupo cria um grupo novo com a aba. <kbd>Esc</kbd> cancela o arraste.

Pelo teclado, com a aba em foco, <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd> e <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd> mudam a aba de lugar, em qualquer mapa; as fixadas ficam sempre antes das outras. **Mover a aba para o próximo grupo** está na paleta.

## Dividir o editor

![Com o editor maximizado, a paleta de comandos acha Dividir à direita, e o App.tsx abre num grupo novo à direita; a barra de status do grupo da esquerda passa a dizer no outro grupo.](/docs-media/tabs-and-groups/dividir.mp4)

**Dividir à direita** e **Dividir embaixo**, no menu da aba e na paleta, abrem o mesmo arquivo num grupo novo. **Dividir e mover à direita** e **Dividir e mover embaixo** levam a aba para o grupo novo. São até quatro grupos; sem espaço no painel, o item diz para maximizar o editor. A divisória entre dois grupos se arrasta, ou anda pelas setas com ela em foco.

Na [árvore](/docs/files), **Abrir no lado direito** abre o arquivo num grupo à direita. **Fechar o grupo** e as ações de focar o grupo à esquerda, à direita, de cima ou de baixo estão na paleta.

O mesmo arquivo em dois grupos tem o texto em sincronia, e cada lado tem o seu desfazer. Só um deles conversa com o servidor da linguagem: o outro fica sem sugestões nem erros, e a barra de status diz "no outro grupo".

## Maximizar

**Maximizar o editor**, no botão da barra das abas, no menu da aba e na paleta, esconde o terminal para caber mais código. O mesmo botão, então com a dica **Voltar ao tamanho de antes**, ou o mesmo comando, devolve a divisão de antes.

## Opções das abas

Em [**Configurações › Editor › Abas**](/docs/settings#editor), o **Limite de abas** vem em 20, e pode ser 10, 30, 50 ou **Sem limite**. Abrir uma aba a mais fecha a menos usada; as fixadas e as não gravadas ficam, e baixar o limite não fecha nada na hora. **Ao fechar, ir para** escolhe entre **A aba usada antes**, o padrão, e **A aba vizinha**. **Abrir aba nova** põe a aba **No fim**, o padrão, ou **Logo depois da atual**. **Mostrar a pasta em nomes repetidos** vem ligado, e **Marcar abas não gravadas** usa um **Ponto** ou o **Nome em itálico**.

A **Aba de prévia** vem desligada. Ligada, o clique na árvore abre uma aba que o próximo clique troca; editar, ou clicar duas vezes na aba, a mantém. **Configurar as abas**, no menu da aba, leva direto a essa tela.

## Teclas

<kbd>⌃</kbd> <kbd>Tab</kbd>, <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd> e <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd> valem em qualquer mapa. Estas são dos dois mapas WebStorm:

| Ação | Tecla |
| --- | --- |
| Maximizar o editor | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F12</kbd> |
| Próximo grupo e grupo anterior | <kbd>⌥</kbd> <kbd>Tab</kbd> e <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>Tab</kbd> |
| Abrir no lado direito (na árvore) | <kbd>⇧</kbd> <kbd>↵</kbd> |

No mapa do VS Code, essas ações ficam na paleta e no menu da aba. No Windows e no Linux, que estão em prévia, mover a aba é <kbd>Alt</kbd> <kbd>Shift</kbd> com as setas, maximizar é <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>F12</kbd>, e trocar de grupo fica na paleta.

## Plano e limites

Abas e grupos são do plano grátis.

São no máximo quatro grupos. As abas de diff e de histórico do Git não se fixam.
