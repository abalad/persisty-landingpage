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
| Pré-visualizar Markdown (no editor) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>V</kbd> |
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

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd> é a tecla padrão de **Ditar**. Ela muda em **Configurações › Voz**, e só aparece em **Configurações › Atalhos** com o **Ditado por voz** ligado; veja [Atalho do ditado](/docs/voice#atalho).

## Dentro do código

As teclas do mapa escolhido vêm primeiro; quando a ação do mapa não se aplica ali, a tecla segue para o app. No WebStorm, <kbd>⌘</kbd> <kbd>B</kbd> sobre um nome vai à declaração e <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> abre um arquivo pelo nome. No WebStorm (macOS), quem abre um arquivo pelo nome é <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd>, no lugar do Quadro de sessões. Nos dois mapas WebStorm, <kbd>⌘</kbd> <kbd>D</kbd> duplica a linha, e <kbd>⌃</kbd> <kbd>G</kbd> adiciona à seleção a próxima ocorrência.

No WebStorm (macOS) e no VS Code, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> é **Localizar anterior** depois de uma busca no arquivo; sem busca, a tecla abre as **Alterações do git**. No Mac, em qualquer mapa, <kbd>⌘</kbd> <kbd>←</kbd> e <kbd>⌘</kbd> <kbd>→</kbd> levam o cursor ao início e ao fim da linha; fora do código, trocam de sessão.

A tabela das teclas de cada mapa está em [Mapa de teclas](/docs/editor#mapa-de-teclas).

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
| Desfazer a exclusão (enquanto o aviso aparece) | <kbd>⌘</kbd> <kbd>Z</kbd> |
| Copiar caminho (também na aba e no código) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> |
| Copiar referência (também na aba e no código) | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> |
| Sincronizar a árvore com a pasta | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>Y</kbd> |

## Abas e grupos

<kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd> e <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd> valem em qualquer mapa, com a aba em foco. As outras teclas são dos mapas WebStorm; no mapa do VS Code, essas ações ficam na paleta e no menu da aba. Veja [Abas e grupos](/docs/tabs-and-groups#teclas).

| Ação | Atalho |
| --- | --- |
| Mover a aba para a esquerda ou a direita | <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd> |
| Maximizar o editor | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F12</kbd> |
| Próximo grupo e grupo anterior | <kbd>⌥</kbd> <kbd>Tab</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>Tab</kbd> |
| Abrir o arquivo à direita (na árvore) | <kbd>⇧</kbd> <kbd>↵</kbd> |

## Lista completa

**Configurações › Atalhos** mostra todas as teclas do mapa escolhido e as do Persisty, por extenso, em grupos como **Navegação**, **Abas**, **Arquivos** e **Git**; as teclas do app ficam no grupo **Persisty**. A busca acha uma ação pelo nome ou pelas teclas por extenso, como `command shift o`, sem ligar para acentos.

Cada linha diz onde a tecla vale, como "na árvore, na aba e no editor". Quando uma tecla do app faz outra coisa no código, a linha diz as duas, como no WebStorm: "No código: Ir para a declaração · Fora do código: Barra de projetos". Ações sem tecla própria, como as do submenu Git e as de grupos, aparecem com o lugar onde ficam: o menu da árvore, o da aba ou a paleta.

No topo, um aviso aparece para cada tecla do mapa ou do app que o macOS usa, como <kbd>⌃</kbd> <kbd>Espaço</kbd> para trocar o teclado, com o caminho em Ajustes do Sistema › Teclado › Atalhos de Teclado para desligá-la e, quando existe, a outra tecla da mesma ação.

## Quando uma tecla não vale ali

Na árvore de arquivos e na aba, uma tecla do mapa cuja ação não pode rodar ali mostra o motivo num aviso, em vez de não fazer nada: "esta tecla não vale aqui", "só no texto de um arquivo", "o arquivo não tem análise de código" ou "o arquivo é somente leitura".

## Windows e Linux

No Windows e no Linux, que estão em prévia, os atalhos do app usam <kbd>Ctrl</kbd> no lugar de <kbd>⌘</kbd>, e o ditado é <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>D</kbd>. No código, em qualquer mapa, <kbd>Ctrl</kbd> <kbd>←</kbd> e <kbd>Ctrl</kbd> <kbd>→</kbd> andam de palavra em palavra, e <kbd>Home</kbd> e <kbd>End</kbd> levam ao início e ao fim da linha. No terminal, <kbd>Ctrl</kbd> <kbd>←</kbd> e <kbd>Ctrl</kbd> <kbd>→</kbd> ficam com o shell. Nos mapas do editor, <kbd>Ctrl</kbd> e <kbd>Alt</kbd> fazem o papel de <kbd>⌘</kbd> e <kbd>⌥</kbd>; veja [Mapa de teclas](/docs/editor#mapa-de-teclas). Na árvore, nos mapas WebStorm, excluir é <kbd>Delete</kbd> ou <kbd>Alt</kbd> <kbd>Delete</kbd>, e trocar de grupo não tem tecla.
