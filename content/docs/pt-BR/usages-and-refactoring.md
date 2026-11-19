---
title: Usos, renomear e refatorar
description: Encontrar usos, ir para a implementação e o tipo, destacar usos, renomear em todos os arquivos, correções rápidas, extrair e embutir, formatar e organizar imports, pelo servidor da linguagem.
group: code
order: 3
---

Estas ações perguntam ao servidor da linguagem sobre o nome do cursor e mudam o código com a resposta. O servidor existe hoje para TypeScript, JavaScript e Rust, e cada ação precisa de um servidor rodando que a ofereça; sem ele, a tecla segue para o app. Nada é pedido ao servidor enquanto você só move o cursor, apenas quando você aperta a tecla ou escolhe a ação na paleta. As teclas citadas no texto são as do mapa WebStorm no Mac, e as de cada mapa estão em [Teclas](#teclas).

## Encontrar usos

**Encontrar usos** (<kbd>⌥</kbd> <kbd>F7</kbd>) lista onde o nome do cursor é usado, junto com a declaração, na aba **Usos** do [painel de baixo](/docs/editor#painel-de-baixo). Os usos vêm por arquivo, a começar pelo arquivo em que você está, cada um com a linha, a coluna e o texto da linha; um clique ou <kbd>↵</kbd> abre o lugar. Com um uso só, o editor vai direto a ele. Se o servidor não responde em 3 segundos, um aviso diz isso.

Com a lista à vista, **Próximo uso** e **Uso anterior** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↓</kbd> e <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↑</kbd>) abrem um uso depois do outro, e do último voltam ao primeiro. Sem a lista, as mesmas teclas adicionam um cursor abaixo ou acima.

## Implementação e tipo

**Ir para a implementação** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>B</kbd>) leva de uma interface ou de um membro abstrato a onde ele é implementado. **Ir para a declaração do tipo** (<kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>B</kbd>) leva à declaração do tipo do valor no cursor. Com um destino só, o editor vai direto; com vários, eles aparecem na aba **Usos**, sob **Implementações de "nome"** ou **Tipos de "nome"**.

## Destacar usos no arquivo

**Destacar usos no arquivo** (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F7</kbd>) marca todas as ocorrências do nome do cursor no arquivo. Os lugares que dão um valor ao nome ficam um pouco mais fortes que as leituras, e a barra de status diz quantos são, como "3 usos neste arquivo". As marcas saem com <kbd>Esc</kbd>, ao editar o texto ou ao apertar a tecla de novo.

## Renomear em todos os arquivos

**Renomear símbolo** (<kbd>⇧</kbd> <kbd>F6</kbd>) abre um campo pequeno sobre o nome: escreva o novo e aperte <kbd>↵</kbd>. A mudança vale em todos os arquivos da sessão. As abas abertas recebem o texto novo com desfazer, e os arquivos fechados são gravados se não mudaram enquanto o servidor respondia; antes, o editor guarda a versão anterior de cada um no [histórico local](/docs/local-history). Um aviso diz em quantos arquivos o nome mudou e quais ficaram de fora, com o motivo, como "mudou durante o pedido".

Uma renomeação que também criaria, renomearia ou apagaria arquivos não é feita, e o aviso diz isso. Na árvore e na aba, <kbd>⇧</kbd> <kbd>F6</kbd> continua renomeando o arquivo; veja [Renomear, mover e copiar](/docs/files#renomear-mover-e-copiar).

## Correções rápidas

**Mostrar correções rápidas e ações** (<kbd>⌥</kbd> <kbd>↵</kbd>) abre, junto do cursor, uma lista do que o servidor oferece ali, como corrigir um erro, refatorar ou organizar, com as preferidas no topo. As setas andam pela lista, <kbd>↵</kbd> aplica, e <kbd>Esc</kbd> fecha e devolve o foco ao código. Editar, rolar ou clicar fora também fecham, e uma letra digitada fecha a lista e entra no código.

A mudança entra no desfazer da aba num passo só. A lista só abre quando você pede, nunca a cada movimento do cursor, e sem nenhuma ação o aviso diz "Nenhuma ação aqui".

## Extrair, embutir e refatorar

**Extrair variável** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>V</kbd>), **Extrair constante** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>C</kbd>), **Extrair função** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>M</kbd>) e **Embutir** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>N</kbd>) perguntam ao servidor pelas refatorações daquele tipo no cursor. Se só uma serve, ela roda direto; se há várias, uma lista abre com as pedidas no topo. **Refatorar…** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>T</kbd>) lista todas as refatorações que o servidor oferece ali.

Cada refatoração entra num passo do desfazer, inclusive o que o servidor manda depois, como ao extrair uma função no TypeScript. Sem nenhuma, o aviso diz "Nenhuma refatoração aqui"; quando só há refatorações que não se aplicam, ele mostra o motivo. Mover código para outro arquivo ainda não aparece na lista.

No código, com um servidor que tem ações de código, <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>N</kbd> embute em vez de abrir uma sessão com o agente padrão; sem ele, a tecla segue para o app.

## Formatar e organizar imports

**Reformatar código** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>L</kbd>) formata o arquivo, ou só a seleção quando há uma, com a largura da tabulação e o recuo da aba, num passo do desfazer. Um servidor que só formata o arquivo inteiro não muda uma seleção, e o aviso explica; sem nada a mudar, ele diz "Nada a formatar".

**Organizar imports** (<kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>O</kbd>) pede ao servidor a ação de organizar os imports do arquivo e aplica a primeira, sem lista, num passo do desfazer. Sem nada a fazer, o aviso diz "Nada a organizar".

## Teclas

As teclas no Mac. Onde a tabela mostra —, o mapa não tem tecla para a ação, e ela fica na paleta.

| Ação | WebStorm | WebStorm (macOS) | VS Code |
| --- | --- | --- | --- |
| Encontrar usos | <kbd>⌥</kbd> <kbd>F7</kbd> | <kbd>⌥</kbd> <kbd>F7</kbd> | <kbd>⇧</kbd> <kbd>F12</kbd> |
| Próximo uso / Uso anterior | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↓</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↑</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↓</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>↑</kbd> | — |
| Ir para a implementação | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>B</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>B</kbd> | <kbd>⌘</kbd> <kbd>F12</kbd> |
| Ir para a declaração do tipo | <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>B</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>B</kbd> ou <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>B</kbd> | — |
| Destacar usos no arquivo | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F7</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F7</kbd> | — |
| Renomear símbolo | <kbd>⇧</kbd> <kbd>F6</kbd> | <kbd>⇧</kbd> <kbd>F6</kbd> | <kbd>F2</kbd> |
| Mostrar correções rápidas e ações | <kbd>⌥</kbd> <kbd>↵</kbd> | <kbd>⌥</kbd> <kbd>↵</kbd> | <kbd>⌘</kbd> <kbd>.</kbd> |
| Extrair variável, constante, função | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>V</kbd>, <kbd>C</kbd>, <kbd>M</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>V</kbd>, <kbd>C</kbd>, <kbd>M</kbd> | — |
| Embutir | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>N</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>N</kbd> | — |
| Refatorar… | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>T</kbd> | <kbd>⌃</kbd> <kbd>T</kbd> | <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>R</kbd> |
| Reformatar código | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>L</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>L</kbd> | <kbd>⇧</kbd> <kbd>⌥</kbd> <kbd>F</kbd> ou <kbd>⌘</kbd> <kbd>K</kbd> <kbd>⌘</kbd> <kbd>F</kbd> |
| Organizar imports | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>O</kbd> | <kbd>⌃</kbd> <kbd>⌥</kbd> <kbd>O</kbd> | <kbd>⇧</kbd> <kbd>⌥</kbd> <kbd>O</kbd> |

As teclas do painel de baixo estão em [Painel de baixo](/docs/editor#painel-de-baixo).

No Windows e no Linux, que estão em prévia, <kbd>Ctrl</kbd> e <kbd>Alt</kbd> fazem o papel de <kbd>⌘</kbd> e <kbd>⌥</kbd>, e os dois mapas WebStorm usam as teclas da coluna WebStorm: **Refatorar…** é <kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>Shift</kbd> <kbd>T</kbd>, e **Organizar imports**, <kbd>Ctrl</kbd> <kbd>Alt</kbd> <kbd>O</kbd>. No mapa do VS Code, **Reformatar código** é <kbd>Shift</kbd> <kbd>Alt</kbd> <kbd>F</kbd> no Windows e <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> no Linux, além de <kbd>Ctrl</kbd> <kbd>K</kbd> <kbd>Ctrl</kbd> <kbd>F</kbd> nos dois, e **Refatorar…** é <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>R</kbd>. Com o servidor, essas teclas vêm antes das do app no código; sem ele, <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>I</kbd> abre os **Detalhes**, e <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>R</kbd>, **Restaurar tudo**.

## Plano e limites

Tudo nesta página é do plano grátis.

As ações existem só em TypeScript, JavaScript e Rust, com o servidor da linguagem rodando, e o que cada uma oferece depende do servidor. O editor ainda não aplica uma mudança que cria, renomeia ou apaga arquivos, e mover código para outro arquivo não aparece nas listas.
