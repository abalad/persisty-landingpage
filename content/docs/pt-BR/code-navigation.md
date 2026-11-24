---
title: Navegar pelo código
description: Arquivos e lugares recentes, a última edição, a estrutura do arquivo, ir para símbolo e classe, a definição rápida, os favoritos e Buscar em tudo, com as teclas de cada mapa.
group: code
order: 2
---

Estas ações levam você a outro ponto do código sem procurar na árvore. Quase todas valem com o cursor no código do [editor](/docs/editor), e todas aparecem também na paleta (<kbd>⌘</kbd> <kbd>K</kbd>) e em [**Configurações › Atalhos**](/docs/shortcuts#lista-completa). A estrutura do arquivo, ir para símbolo e classe, o próximo método e a definição rápida dependem do servidor da linguagem, que hoje existe para TypeScript, JavaScript e Rust; sem ele, a tecla segue para o app. As teclas citadas no texto são as do mapa WebStorm no Mac, e as de cada mapa estão em [Teclas](#teclas).

## Arquivos e lugares recentes

![No App.tsx, Command e E abrem Arquivos recentes, com store.ts e release.md marcados como abertos; a seta para baixo e Enter levam ao release.md.](/docs-media/code-navigation/recentes.mp4)

**Arquivos recentes** (<kbd>⌘</kbd> <kbd>E</kbd>) lista os últimos 50 arquivos abertos na sessão, do mais recente para o mais antigo, mesmo os de abas já fechadas. O arquivo à vista fica de fora, e os que têm aba aberta levam a marca **aberta**. A lista continua depois de fechar o app e acompanha os arquivos renomeados, movidos e excluídos. Com ela aberta, a mesma tecla mostra só os **Arquivos editados nesta sessão**.

**Lugares recentes** (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd>) lista por onde o cursor passou e o que foi editado, marcados como **visitado** ou **editado**, cada lugar com o arquivo, a linha e 3 linhas de código. Apertar a tecla de novo deixa só os **Lugares editados**.

**Ir para o último lugar editado** (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>⌫</kbd>) leva o cursor à última edição, e cada vez que você aperta de novo, à edição anterior. O lugar de onde você saiu fica em **Voltar**, como depois de **Ir para a declaração**. Os lugares visitados e editados ficam só enquanto o app está aberto.

## Estrutura do arquivo e métodos

**Estrutura do arquivo** (<kbd>⌘</kbd> <kbd>F12</kbd>) abre os símbolos do arquivo numa lista com recuo, já no símbolo em que o cursor está. Digitar filtra a lista e mantém os pais de cada símbolo que casa. <kbd>↵</kbd> leva ao símbolo, e o lugar de partida fica em **Voltar**.

**Próximo método** e **Método anterior** levam o cursor à próxima ou à anterior função, método, construtor ou classe; no primeiro e no último, nada acontece. No mapa WebStorm, as teclas são <kbd>⌃</kbd> <kbd>↓</kbd> e <kbd>⌃</kbd> <kbd>↑</kbd>, que o macOS usa no Mission Control por padrão, e por isso também <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> e <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↑</kbd>. **Configurações › Atalhos** avisa quando o macOS usa uma tecla do mapa.

## Ir para símbolo e classe

**Ir para símbolo** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>N</kbd>) e **Ir para classe** (<kbd>⌘</kbd> <kbd>N</kbd>) buscam em todo o projeto enquanto você digita, a partir do primeiro caractere. A lista mostra até 200 resultados, cada um com o tipo, como **Classe** ou **Função**, onde ele está declarado e o caminho. Com uma seleção de uma linha no código, a busca já começa com esse texto.

Enquanto o servidor indexa, a lista avisa "O servidor ainda está indexando". Um símbolo de fora da pasta, como o de uma biblioteca, abre numa aba somente leitura. Sem o servidor, <kbd>⌘</kbd> <kbd>N</kbd> abre um terminal novo, como fora do código. O mapa do VS Code não tem **Ir para classe**.

## Definição rápida

**Definição rápida** (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>I</kbd>) mostra a declaração do nome do cursor num popup ao lado dele, com o destaque da linguagem, somente leitura e com até 30 linhas. Com vários destinos, o topo diz "1 de N", e <kbd>←</kbd> e <kbd>→</kbd> trocam de um para outro. <kbd>↵</kbd> abre o lugar e deixa o de partida em **Voltar**; <kbd>Esc</kbd>, editar, rolar ou clicar fora fecham o popup. Uma definição de fora da pasta também aparece.

No mapa WebStorm (macOS), a tecla que funciona é <kbd>⌘</kbd> <kbd>Y</kbd>: a outra do mapa, <kbd>⌥</kbd> <kbd>Espaço</kbd>, digita um espaço no Mac. Sem o servidor, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>I</kbd> abre os **Detalhes**, como fora do código.

## Mostrar na árvore

**Mostrar na árvore** (<kbd>⌥</kbd> <kbd>F1</kbd>) leva ao arquivo da aba na [árvore](/docs/files): abre o painel **Código** e as pastas até o arquivo, seleciona a linha dele e rola até ela. O mesmo item está no [menu da aba](/docs/tabs-and-groups#o-menu-da-aba). Um arquivo de fora da pasta da sessão não está na árvore e não tem esse item.

## Favoritos

Os favoritos marcam linhas, arquivos e pastas, e ficam guardados por pasta: duas sessões na mesma pasta veem os mesmos.

**Marcar ou desmarcar favorito** (<kbd>F11</kbd>) marca a linha do cursor, ou desmarca. Uma marca aparece na margem dos números e acompanha a linha quando o texto muda. **Mostrar favoritos** (<kbd>⇧</kbd> <kbd>F11</kbd>) abre a lista, separada em **Linhas**, **Arquivos** e **Pastas**: <kbd>↵</kbd> leva ao lugar, ou mostra a pasta na árvore, e <kbd>⌦</kbd> (<kbd>fn</kbd> <kbd>⌫</kbd> no teclado do Mac) tira o favorito.

Arquivos e pastas entram pelo submenu **Favoritos** da árvore e da aba: **Adicionar aos favoritos**, ou **Tirar dos favoritos** quando os itens já estão lá. Os favoritos seguem o arquivo ou a pasta quando são renomeados ou movidos, e saem com eles quando são excluídos. Um arquivo de fora da pasta da sessão não tem favoritos.

No mapa WebStorm (macOS), marcar é <kbd>F3</kbd> e a lista é <kbd>⌘</kbd> <kbd>F3</kbd>, como no WebStorm; por isso **Localizar próxima** fica em <kbd>⌘</kbd> <kbd>G</kbd> (veja [Buscar no arquivo aberto](/docs/search#buscar-no-arquivo-aberto)). No mapa WebStorm, o macOS usa <kbd>F11</kbd> para mostrar a mesa, e **Configurações › Atalhos** avisa onde desligar.

## Buscar em tudo

Aperte <kbd>⇧</kbd> duas vezes para abrir **Buscar em tudo**: arquivos, símbolos e ações numa lista só, com as abas **Tudo**, **Arquivos**, **Símbolos** e **Ações**. <kbd>Tab</kbd> e <kbd>⇧</kbd> <kbd>Tab</kbd> trocam de aba. **Tudo** mostra até 8 resultados de cada tipo. Escolher abre o arquivo, vai ao símbolo ou roda a ação.

Os arquivos e as ações funcionam sem servidor da linguagem. A aba **Símbolos** só aparece com um servidor rodando na sessão que liste os símbolos do projeto; em **Tudo**, os símbolos entram na lista quando ele responde.

O gesto vale na sessão, também fora do código, mas não no terminal nem num campo de texto. Digitar maiúsculas, segurar o <kbd>⇧</kbd>, um clique ou a roda do mouse entre os dois toques não abrem a lista, e ela também não abre nas páginas de Configurações e de uso nem com uma janela aberta. O mapa do VS Code não tem o gesto.

## Teclas

As teclas no Mac. Onde a tabela mostra —, o mapa não tem tecla para a ação, e ela fica na paleta.

| Ação | WebStorm | WebStorm (macOS) | VS Code |
| --- | --- | --- | --- |
| Arquivos recentes | <kbd>⌘</kbd> <kbd>E</kbd> | <kbd>⌘</kbd> <kbd>E</kbd> | — |
| Lugares recentes | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> | — |
| Ir para o último lugar editado | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>⌫</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>⌫</kbd> | <kbd>⌘</kbd> <kbd>K</kbd> <kbd>⌘</kbd> <kbd>Q</kbd> |
| Estrutura do arquivo | <kbd>⌘</kbd> <kbd>F12</kbd> | <kbd>⌘</kbd> <kbd>F12</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> |
| Próximo método / Método anterior | <kbd>⌃</kbd> <kbd>↓</kbd> / <kbd>⌃</kbd> <kbd>↑</kbd>, ou <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> / <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↑</kbd> | <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> / <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↑</kbd> | — |
| Ir para símbolo | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>N</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>O</kbd> | <kbd>⌘</kbd> <kbd>T</kbd> |
| Ir para classe | <kbd>⌘</kbd> <kbd>N</kbd> | <kbd>⌘</kbd> <kbd>O</kbd> | — |
| Definição rápida | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>I</kbd> | <kbd>⌘</kbd> <kbd>Y</kbd> | <kbd>⌥</kbd> <kbd>F12</kbd> |
| Mostrar na árvore | <kbd>⌥</kbd> <kbd>F1</kbd> | <kbd>⌥</kbd> <kbd>F1</kbd> | — |
| Marcar ou desmarcar favorito | <kbd>F11</kbd> | <kbd>F3</kbd> | — |
| Mostrar favoritos | <kbd>⇧</kbd> <kbd>F11</kbd> | <kbd>⌘</kbd> <kbd>F3</kbd> | — |
| Buscar em tudo | <kbd>⇧</kbd> duas vezes | <kbd>⇧</kbd> duas vezes | — |

No VS Code, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> abre a estrutura só com um servidor que liste os símbolos; sem ele, a tecla abre o [Quadro](/docs/board), como fora do código.

No Windows e no Linux, que estão em prévia, <kbd>Ctrl</kbd> e <kbd>Alt</kbd> fazem o papel de <kbd>⌘</kbd> e <kbd>⌥</kbd>, e os dois mapas WebStorm usam as teclas da coluna WebStorm, com uma diferença: **Próximo método** e **Método anterior** são <kbd>Alt</kbd> <kbd>↓</kbd> e <kbd>Alt</kbd> <kbd>↑</kbd>. No mapa do VS Code, **Definição rápida** é <kbd>Alt</kbd> <kbd>F12</kbd> no Windows e <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>F10</kbd> no Linux.

## Plano e limites

Tudo nesta página é do plano grátis.

A estrutura do arquivo, ir para símbolo e classe, o próximo método, a definição rápida e a aba **Símbolos** de **Buscar em tudo** existem só em TypeScript, JavaScript e Rust, com o servidor da linguagem rodando. Os lugares recentes e a última edição duram enquanto o app está aberto.
