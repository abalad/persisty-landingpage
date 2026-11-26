---
title: Atalhos de teclado
description: As teclas do Persisty no Mac, as do mapa do editor dentro do código e onde ver a lista completa no app.
group: reference
order: 1
---

As teclas do app valem em todo o Persisty; dentro do código, as do mapa do editor vêm primeiro. A lista completa, com as teclas do mapa que você escolheu, fica em [**Configurações › Atalhos**](/docs/settings#atalhos), com busca.

## Teclas do app

No Mac, os atalhos do app sempre levam o <kbd>⌘</kbd>; o <kbd>⌃</kbd> fica para o terminal e para o mapa do editor.

| Ação | Atalho |
| --- | --- |
| Buscar | <kbd>⌘</kbd> <kbd>K</kbd> |
| Barra de projetos | <kbd>⌘</kbd> <kbd>B</kbd> |
| [Quadro de sessões](/docs/board) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> |
| Mostrar ou esconder o painel lateral | <kbd>⌘</kbd> <kbd>&#92;</kbd> |
| Abrir arquivo pelo nome (fora do código) | <kbd>⌘</kbd> <kbd>P</kbd> |
| [Buscar em todos os arquivos](/docs/search) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd> |
| [Alterações do git](/docs/changes) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> |
| Salvar arquivo | <kbd>⌘</kbd> <kbd>S</kbd> |
| Pré-visualizar Markdown (no editor; nos mapas WebStorm, fora do código) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>V</kbd> |
| Novo terminal no workspace atual | <kbd>⌘</kbd> <kbd>N</kbd> |
| Escolher o que abrir | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> |
| Nova sessão com o agente padrão | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> |
| Ditar (com o ditado ligado) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd> |
| [Restaurar tudo](/docs/sessions-and-recovery#restaurar-tudo) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> |
| Detalhes | <kbd>⌘</kbd> <kbd>I</kbd> |
| Recolher workspaces | <kbd>⌘</kbd> <kbd>J</kbd> |
| [Executar / parar comando](/docs/commands) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> |
| Saída do comando | <kbd>⌘</kbd> <kbd>E</kbd> |
| Sessão anterior / próxima (fora do código) | <kbd>⌘</kbd> <kbd>←</kbd> <kbd>⌘</kbd> <kbd>→</kbd> |
| Fechar a aba do editor (no painel Código, fora do texto) | <kbd>⌘</kbd> <kbd>W</kbd> |
| Alternar entre abas | <kbd>⌃</kbd> <kbd>Tab</kbd>; <kbd>⇧</kbd> <kbd>Tab</kbd> volta |
| Projeto 1–9 | <kbd>⌘</kbd> <kbd>1</kbd> … <kbd>⌘</kbd> <kbd>9</kbd> |
| Configurações | <kbd>⌘</kbd> <kbd>,</kbd> |

Algumas dessas teclas fazem outra coisa com o cursor no código; veja [Dentro do código](#dentro-do-código).

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd> é a tecla padrão de **Ditar**. Ela muda em **Configurações › Voz**, e só aparece em **Configurações › Atalhos** com o **Ditado por voz** ligado; veja [Atalho do ditado](/docs/voice#atalho).

## Dentro do código

As teclas do mapa escolhido vêm primeiro; quando a ação do mapa não se aplica ali, a tecla segue para o app. No WebStorm, <kbd>⌘</kbd> <kbd>B</kbd> sobre um nome vai à declaração e <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> abre um arquivo pelo nome. No WebStorm (macOS), quem abre um arquivo pelo nome é <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd>, no lugar do Quadro de sessões. Nos dois mapas WebStorm, <kbd>⌘</kbd> <kbd>D</kbd> duplica a linha, e <kbd>⌃</kbd> <kbd>G</kbd> adiciona à seleção a próxima ocorrência.

No WebStorm (macOS) e no VS Code, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> é **Localizar anterior** depois de uma busca no arquivo; sem busca, a tecla abre as **Alterações do git**. No Mac, em qualquer mapa, <kbd>⌘</kbd> <kbd>←</kbd> e <kbd>⌘</kbd> <kbd>→</kbd> levam o cursor ao início e ao fim da linha; fora do código, trocam de sessão.

Estas teclas do app mudam de sentido só com o cursor no código, como no WebStorm. Algumas mudam sempre; as marcadas "com o servidor" mudam só quando o servidor da linguagem oferece a ação, e sem ele fazem o que fazem no app.

| Tecla | No código | Fora do código |
| --- | --- | --- |
| <kbd>⌘</kbd> <kbd>E</kbd> | **Arquivos recentes**, nos mapas WebStorm | Saída do comando |
| <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> | **Lugares recentes**, nos mapas WebStorm | Executar / parar comando |
| <kbd>⌘</kbd> <kbd>3</kbd> e <kbd>⌘</kbd> <kbd>6</kbd> | **Usos** e **Problemas** do painel de baixo, nos mapas WebStorm | Projeto 3 e projeto 6 |
| <kbd>⌘</kbd> <kbd>N</kbd> | **Ir para classe**, no WebStorm, com o servidor | Novo terminal no workspace atual |
| <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>I</kbd> | **Definição rápida**, no WebStorm, com o servidor | Detalhes |
| <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> | **Embutir**, nos mapas WebStorm, com o servidor | Nova sessão com o agente padrão |
| <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> | **Substituir nos arquivos**, no WebStorm (macOS) | Restaurar tudo |
| <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>V</kbd> | **Colar do histórico**, nos mapas WebStorm | Pré-visualizar Markdown |
| <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> | **Ir para o arquivo**, no WebStorm; **Novo arquivo de rascunho**, no WebStorm (macOS) | Escolher o que abrir |
| <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> | **Ir para o arquivo**, no WebStorm (macOS); **Estrutura do arquivo**, no VS Code, com o servidor | Quadro de sessões |
| <kbd>⌘</kbd> <kbd>B</kbd> | **Ir para a declaração**, nos mapas WebStorm, com o servidor | Barra de projetos |

[**Configurações › Atalhos**](#lista-completa) mostra os dois sentidos na linha de cada uma. A tabela das teclas de cada mapa está em [Mapa de teclas](/docs/editor#mapa-de-teclas).

## Paleta de comandos

<kbd>⌘</kbd> <kbd>K</kbd> abre a paleta, que busca sessões, projetos e ações. Com um arquivo aberto no editor, ela lista também as ações do editor que valem ali, com as teclas do mapa escolhido. **Localizar ação** abre a paleta só com essas ações: <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>A</kbd> nos mapas WebStorm, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd> ou <kbd>F1</kbd> no VS Code. Sem arquivo aberto, ela abre a paleta inteira.

No mapa do VS Code, com o cursor no código, <kbd>⌘</kbd> <kbd>K</kbd> começa as teclas de duas partes dele, como <kbd>⌘</kbd> <kbd>K</kbd> <kbd>⌘</kbd> <kbd>C</kbd>, que comenta a linha; ali, as ações do editor ficam em <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd>.

## Arquivos

Estas teclas valem com a árvore de arquivos em foco. Abrir o menu, recortar, copiar, colar e desfazer funcionam em qualquer mapa; as outras são dos mapas WebStorm, e no mapa do VS Code essas ações ficam no menu do botão direito. Veja [Arquivos](/docs/files#teclas).

| Ação | Atalho |
| --- | --- |
| Abrir o menu de arquivos | <kbd>⇧</kbd> <kbd>F10</kbd> |
| Renomear | <kbd>⇧</kbd> <kbd>F6</kbd> |
| Mover para outra pasta | <kbd>F6</kbd> |
| Copiar para outra pasta | <kbd>F5</kbd> |
| Recortar, copiar e colar arquivos | <kbd>⌘</kbd> <kbd>X</kbd> <kbd>⌘</kbd> <kbd>C</kbd> <kbd>⌘</kbd> <kbd>V</kbd> |
| Excluir para a Lixeira | <kbd>⌫</kbd> |
| Encontrar usos do arquivo (também na aba) | <kbd>⌥</kbd> <kbd>F7</kbd> |
| Desfazer a exclusão (enquanto o aviso aparece) | <kbd>⌘</kbd> <kbd>Z</kbd> |
| Copiar caminho (também na aba e no código) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> |
| Copiar referência (também na aba e no código) | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> |
| Sincronizar a árvore com a pasta | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>Y</kbd> |

**Novo arquivo de rascunho** é <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>N</kbd> no WebStorm e <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> no WebStorm (macOS), com o cursor no código; veja [Arquivos de rascunho](/docs/files#arquivos-de-rascunho).

## Abas e grupos

<kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd> e <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd> valem em qualquer mapa, com a aba em foco. As outras teclas são dos mapas WebStorm; no mapa do VS Code, essas ações ficam na paleta e no menu da aba. Veja [Abas e grupos](/docs/tabs-and-groups#teclas).

| Ação | Atalho |
| --- | --- |
| Mover a aba para a esquerda ou a direita | <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd> |
| Maximizar o editor | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F12</kbd> |
| Próximo grupo e grupo anterior | <kbd>⌥</kbd> <kbd>Tab</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>Tab</kbd> |
| Abrir o arquivo à direita (na árvore) | <kbd>⇧</kbd> <kbd>↵</kbd> |

## Navegar, usos e refatoração

As teclas do código para andar por ele e mudá-lo pelo servidor da linguagem, no mapa WebStorm no Mac. As dos outros mapas e as do Windows e do Linux estão em [Navegar pelo código](/docs/code-navigation#teclas), [Usos, renomear e refatorar](/docs/usages-and-refactoring#teclas) e [Editor](/docs/editor#painel-de-baixo).

| Ação | Atalho |
| --- | --- |
| Arquivos recentes / Lugares recentes | <kbd>⌘</kbd> <kbd>E</kbd> / <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> |
| Ir para o último lugar editado | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>⌫</kbd> |
| Estrutura do arquivo | <kbd>⌘</kbd> <kbd>F12</kbd> |
| Ir para símbolo / Ir para classe | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>N</kbd> / <kbd>⌘</kbd> <kbd>N</kbd> |
| Próximo método / Método anterior | <kbd>⌃</kbd> <kbd>↓</kbd> / <kbd>⌃</kbd> <kbd>↑</kbd>, ou <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> / <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↑</kbd> |
| Definição rápida | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>I</kbd> |
| Mostrar na árvore | <kbd>⌥</kbd> <kbd>F1</kbd> |
| Marcar ou desmarcar favorito / Mostrar favoritos | <kbd>F11</kbd> / <kbd>⇧</kbd> <kbd>F11</kbd> |
| Buscar em tudo | <kbd>⇧</kbd> duas vezes |
| Encontrar usos / Próximo uso | <kbd>⌥</kbd> <kbd>F7</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↓</kbd> |
| Ir para a implementação / Ir para a declaração do tipo | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>B</kbd> / <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>B</kbd> |
| Destacar usos no arquivo | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F7</kbd> |
| Renomear símbolo | <kbd>⇧</kbd> <kbd>F6</kbd> |
| Mostrar correções rápidas e ações | <kbd>⌥</kbd> <kbd>↵</kbd> |
| Extrair variável, constante, função / Embutir | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>V</kbd>, <kbd>C</kbd>, <kbd>M</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>N</kbd> |
| Refatorar… | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>T</kbd> |
| Reformatar código / Organizar imports | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>L</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>O</kbd> |
| Usos / Problemas, no painel de baixo | <kbd>⌘</kbd> <kbd>3</kbd> / <kbd>⌘</kbd> <kbd>6</kbd> |
| Substituir nos arquivos | <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>R</kbd> |
| Modo de seleção em coluna | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>8</kbd> |
| Adicionar cursor acima / abaixo | <kbd>⌥</kbd> duas vezes e segurar, com <kbd>↑</kbd> / <kbd>↓</kbd> |

No WebStorm (macOS), mudam estas: **Ir para símbolo** é <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>O</kbd>, **Ir para classe** é <kbd>⌘</kbd> <kbd>O</kbd>, **Definição rápida** é <kbd>⌘</kbd> <kbd>Y</kbd>, os favoritos são <kbd>F3</kbd> e <kbd>⌘</kbd> <kbd>F3</kbd>, próximo e anterior método são <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> e <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>↑</kbd>, **Refatorar…** é <kbd>⌃</kbd> <kbd>T</kbd>, **Organizar imports** é <kbd>⌃</kbd> <kbd>⌥</kbd> <kbd>O</kbd>, **Ir para a declaração do tipo** também é <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>B</kbd>, e **Substituir nos arquivos** é <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd>, só no código. Como <kbd>F3</kbd> marca um favorito nesse mapa, **Localizar próxima** fica em <kbd>⌘</kbd> <kbd>G</kbd>.

## Lista completa

**Configurações › Atalhos** mostra todas as teclas do mapa escolhido e as do Persisty, por extenso, em grupos como **Navegação**, **Abas**, **Arquivos** e **Git**; as teclas do app ficam no grupo **Persisty**. A busca acha uma ação pelo nome ou pelas teclas por extenso, como `command shift o`, sem ligar para acentos.

Os gestos aparecem por extenso: **Buscar em tudo** com "Shift duas vezes", e **Adicionar cursor acima** com "Option duas vezes e segurar + seta para cima". Cada linha diz onde a tecla vale, como "na árvore, na aba e no editor". Quando uma tecla do app faz outra coisa no código, a linha diz as duas, como no WebStorm: "No código: Ir para a declaração · Fora do código: Barra de projetos". Ações sem tecla própria, como as do submenu Git e as de grupos, aparecem com o lugar onde ficam: o menu da árvore, o da aba ou a paleta.

No topo, um aviso aparece para cada tecla do mapa ou do app que o macOS usa, como <kbd>⌃</kbd> <kbd>Espaço</kbd> para trocar o teclado, com o caminho em Ajustes do Sistema › Teclado › Atalhos de Teclado para desligá-la e, quando existe, a outra tecla da mesma ação.

## Quando uma tecla não vale ali

Na árvore de arquivos e na aba, uma tecla do mapa cuja ação não pode rodar ali mostra o motivo num aviso, em vez de não fazer nada: "esta tecla não vale aqui", "só no texto de um arquivo", "o arquivo não tem análise de código" ou "o arquivo é somente leitura".

## Windows e Linux

No Windows e no Linux, que estão em prévia, os atalhos do app usam <kbd>Ctrl</kbd> no lugar de <kbd>⌘</kbd>, e o ditado é <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>D</kbd>. No código, em qualquer mapa, <kbd>Ctrl</kbd> <kbd>←</kbd> e <kbd>Ctrl</kbd> <kbd>→</kbd> andam de palavra em palavra, e <kbd>Home</kbd> e <kbd>End</kbd> levam ao início e ao fim da linha. No terminal, <kbd>Ctrl</kbd> <kbd>←</kbd> e <kbd>Ctrl</kbd> <kbd>→</kbd> ficam com o shell. Nos mapas do editor, <kbd>Ctrl</kbd> e <kbd>Alt</kbd> fazem o papel de <kbd>⌘</kbd> e <kbd>⌥</kbd>; veja [Mapa de teclas](/docs/editor#mapa-de-teclas). Nos mapas WebStorm, **Colar do histórico** é <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>V</kbd>, e **Novo arquivo de rascunho**, <kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>Insert</kbd>. Na árvore, nos mapas WebStorm, excluir é <kbd>Delete</kbd> ou <kbd>Alt</kbd> <kbd>Delete</kbd>, e trocar de grupo não tem tecla.

No código, nos mapas WebStorm, <kbd>Ctrl</kbd> <kbd>E</kbd>, <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>E</kbd>, <kbd>Ctrl</kbd> <kbd>N</kbd> e <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> mudam de sentido como no Mac. <kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>N</kbd> embute, com o servidor, e <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>R</kbd> é **Substituir nos arquivos**, no lugar de nova sessão com o agente padrão e de **Restaurar tudo**. O painel de baixo usa <kbd>Alt</kbd> <kbd>3</kbd> e <kbd>Alt</kbd> <kbd>6</kbd>, que não tiram <kbd>Ctrl</kbd> <kbd>3</kbd> e <kbd>Ctrl</kbd> <kbd>6</kbd> dos projetos. No mapa do VS Code, com o servidor, <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>O</kbd> abre a estrutura do arquivo, <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>R</kbd> abre **Refatorar…** e, no Linux, <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> formata. **Buscar em tudo** é <kbd>Shift</kbd> duas vezes, e adicionar cursor com o gesto usa <kbd>Ctrl</kbd> duas vezes.
