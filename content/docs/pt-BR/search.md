---
title: Busca
description: Buscar texto em todos os arquivos da pasta da sessão, abrir um arquivo pelo nome e localizar e substituir no arquivo aberto.
group: code
order: 6
---

A **Busca** procura um texto em todos os arquivos da pasta da sessão e leva você à linha onde ele está. Esta página mostra também como abrir um arquivo pelo nome e como buscar só no arquivo aberto.

## Buscar nos arquivos

Abra a **Busca** pelo ícone dela, na barra de ferramentas da borda direita da sessão, ou com <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd>, que leva o cursor ao campo **Buscar em todos os arquivos**. A busca começa com 2 caracteres, logo que você para de digitar.

Ao lado do campo ficam **Diferenciar maiúsculas**, **Palavra inteira** e **Expressão regular**. Os resultados vêm agrupados por arquivo, com a pasta, quantas vezes o texto aparece e cada linha com o trecho destacado; o resumo diz, por exemplo, "12 resultados em 3 arquivos". Um clique numa linha abre o arquivo no painel **Código**, naquela linha.

## O que fica de fora

A busca pula o que o git ignora, a pasta `.git`, os padrões de **Ocultar arquivos** ([Esconder arquivos](/docs/files#esconder-arquivos)), arquivos acima de 2 MB e arquivos binários. Arquivos e pastas que começam com ponto entram, desde que o git não os ignore.

Ela para em 2.000 resultados, e o resumo diz "lista parcial". Uma expressão regular inválida mostra o erro no lugar do resumo.

## Abrir arquivo pelo nome

**Abrir arquivo** acha um arquivo da pasta da sessão pelo nome e o abre no editor. Fora do código, use <kbd>⌘</kbd> <kbd>P</kbd> em qualquer mapa de teclas. Com o cursor no código, use a tecla do seu mapa: <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> no WebStorm, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> no WebStorm (macOS) e <kbd>⌘</kbd> <kbd>P</kbd> no VS Code; nos mapas WebStorm, <kbd>⌘</kbd> <kbd>P</kbd> ali mostra os parâmetros.

Basta digitar as letras do nome na ordem, sem precisar que estejam juntas; o que casa com o nome do arquivo tem preferência sobre o que casa só com a pasta. As setas escolhem, <kbd>↵</kbd> abre, e <kbd>Esc</kbd> fecha. A lista mostra até 50 arquivos e deixa de fora o que o git ignora, o `.git` e os padrões de **Ocultar arquivos**. Numa pasta com mais de 20 mil arquivos, ela avisa que é parcial.

## Buscar no arquivo aberto

Com o cursor no código, <kbd>⌘</kbd> <kbd>F</kbd> abre **Localizar** no topo do editor, em qualquer mapa. **Substituir** é <kbd>⌘</kbd> <kbd>R</kbd> nos mapas WebStorm e <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>F</kbd> no VS Code. Com o campo aberto, <kbd>F3</kbd> e <kbd>⌘</kbd> <kbd>G</kbd> vão ao próximo resultado, e com <kbd>⇧</kbd> ao anterior; <kbd>Esc</kbd> fecha.

## Teclas

| Ação | Tecla |
| --- | --- |
| Buscar em todos os arquivos | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd>, em qualquer lugar; no WebStorm, fora do terminal, também <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>F</kbd> |
| Abrir arquivo pelo nome | <kbd>⌘</kbd> <kbd>P</kbd> fora do código, ou a tecla do mapa no código |
| Localizar no arquivo | <kbd>⌘</kbd> <kbd>F</kbd> |
| Substituir no arquivo | <kbd>⌘</kbd> <kbd>R</kbd> (WebStorm) ou <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>F</kbd> (VS Code) |

No Windows e no Linux, que estão em prévia, use <kbd>Ctrl</kbd> no lugar de <kbd>⌘</kbd>; no mapa do VS Code, **Substituir** é <kbd>Ctrl</kbd> <kbd>H</kbd>.

## Plano e limites

A busca, **Abrir arquivo** e a busca no arquivo são do plano grátis.

A busca procura só dentro da pasta da sessão, nunca em outras sessões ou workspaces. Ela lê o texto puro: um arquivo que não está em UTF-8 fica de fora.
