---
title: Busca
description: Buscar e substituir texto em todos os arquivos da pasta da sessão, abrir um arquivo pelo nome e localizar e substituir no arquivo aberto.
group: code
order: 9
---

A **Busca** procura um texto em todos os arquivos da pasta da sessão, leva você à linha onde ele está e troca o texto em vários arquivos de uma vez. Esta página mostra também como abrir um arquivo pelo nome e como buscar só no arquivo aberto. Para achar um arquivo, um símbolo ou uma ação numa lista só, veja [Buscar em tudo](/docs/code-navigation#buscar-em-tudo).

## Buscar nos arquivos

Abra a **Busca** pelo ícone dela, na barra de ferramentas da borda direita da sessão, ou com <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd>, que leva o cursor ao campo **Buscar em todos os arquivos**. A busca começa com 2 caracteres, logo que você para de digitar.

Ao lado do campo ficam **Diferenciar maiúsculas**, **Palavra inteira** e **Expressão regular**. Os resultados vêm agrupados por arquivo, com a pasta, quantas vezes o texto aparece e cada linha com o trecho destacado; o resumo diz, por exemplo, "12 resultados em 3 arquivos". Um clique numa linha abre o arquivo no painel [**Código**](/docs/editor), naquela linha.

## O que fica de fora

A busca pula o que o git ignora e o que um arquivo `.ignore` lista, a pasta `.git`, os padrões de **Ocultar arquivos** ([Esconder arquivos](/docs/files#esconder-arquivos)), arquivos acima de 2 MB e arquivos binários. Arquivos e pastas que começam com ponto entram, desde que o git não os ignore.

Ela para em 2.000 resultados, e o resumo diz "lista parcial". Em cada linha, a busca olha só os primeiros 300 caracteres. Uma expressão regular inválida mostra o erro no lugar do resumo.

## Substituir nos arquivos

O botão à esquerda do campo, **Mostrar a linha de substituição**, abre o campo **Substituir por**. A tecla de **Substituir nos arquivos** também abre: <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>R</kbd> no WebStorm, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> no WebStorm (macOS) e <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>H</kbd> no VS Code. Pela tecla, com uma seleção de uma linha no código, o texto selecionado vai para a busca. No WebStorm (macOS), <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> só substitui com o cursor no código; fora dele, continua sendo [**Restaurar tudo**](/docs/sessions-and-recovery#restaurar-tudo).

Cada linha da lista mostra o texto velho riscado e o novo ao lado; numa busca por expressão regular, `$1` e `${nome}` já aparecem trocados. Em cada arquivo, **Substituir neste arquivo** troca só ali, e **Tirar da lista** deixa o arquivo de fora. **Substituir tudo** pergunta antes, com quantas ocorrências e arquivos vão mudar, e fica desligado quando a lista foi cortada: "Resultados demais; refine a busca". Enquanto uma busca nova roda, a lista anterior continua à vista, e os botões esperam a nova chegar.

Uma aba aberta recebe a troca no texto dela, com desfazer. Um arquivo fechado é gravado depois de ir para o [histórico local](/docs/local-history). Um arquivo que mudou depois da busca fica de fora, e o aviso diz qual.

## Abrir arquivo pelo nome

**Abrir arquivo** acha um arquivo da pasta da sessão pelo nome e o abre no editor. Fora do código, use <kbd>⌘</kbd> <kbd>P</kbd> em qualquer mapa de teclas. Com o cursor no código, use a tecla do seu mapa: <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> no WebStorm, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> no WebStorm (macOS) e <kbd>⌘</kbd> <kbd>P</kbd> no VS Code; nos mapas WebStorm, <kbd>⌘</kbd> <kbd>P</kbd> ali mostra os parâmetros.

Basta digitar as letras do nome na ordem, sem precisar que estejam juntas; o que casa com o nome do arquivo tem preferência sobre o que casa só com a pasta. As setas escolhem, <kbd>↵</kbd> abre, e <kbd>Esc</kbd> fecha. A lista mostra até 50 arquivos e deixa de fora o que o git ignora, o `.git` e os padrões de **Ocultar arquivos**. Numa pasta com mais de 20 mil arquivos, ela avisa que é parcial.

## Buscar no arquivo aberto

Com o cursor no código, <kbd>⌘</kbd> <kbd>F</kbd> abre **Localizar** no topo do editor, em qualquer mapa. **Substituir** é <kbd>⌘</kbd> <kbd>R</kbd> nos mapas WebStorm e <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>F</kbd> no VS Code. Com o cursor no campo, <kbd>F3</kbd> e <kbd>⌘</kbd> <kbd>G</kbd> vão ao próximo resultado, e com <kbd>⇧</kbd> ao anterior, em qualquer mapa; <kbd>Esc</kbd> fecha.

De volta ao texto, **Localizar próxima** segue o mapa: <kbd>F3</kbd> ou <kbd>⌃</kbd> <kbd>L</kbd> no WebStorm, <kbd>⌘</kbd> <kbd>G</kbd> no WebStorm (macOS) e <kbd>⌘</kbd> <kbd>G</kbd> ou <kbd>F3</kbd> no VS Code, e com <kbd>⇧</kbd> a anterior. No WebStorm (macOS), <kbd>F3</kbd> marca um [favorito](/docs/code-navigation#favoritos), como no WebStorm. Sem uma busca feita, a tecla abre **Localizar**.

## Teclas

| Ação | Tecla |
| --- | --- |
| Buscar em todos os arquivos | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd>, em qualquer lugar; no WebStorm, fora do terminal, também <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>F</kbd> |
| Abrir arquivo pelo nome | <kbd>⌘</kbd> <kbd>P</kbd> fora do código, ou a tecla do mapa no código |
| Localizar no arquivo | <kbd>⌘</kbd> <kbd>F</kbd> |
| Substituir nos arquivos | <kbd>⌃</kbd> <kbd>⇧</kbd> <kbd>R</kbd> (WebStorm), <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>R</kbd> no código (WebStorm (macOS)) ou <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>H</kbd> (VS Code) |
| Substituir no arquivo | <kbd>⌘</kbd> <kbd>R</kbd> (WebStorm) ou <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>F</kbd> (VS Code) |

No Windows e no Linux, que estão em prévia, use <kbd>Ctrl</kbd> no lugar de <kbd>⌘</kbd>; no mapa do VS Code, **Substituir** é <kbd>Ctrl</kbd> <kbd>H</kbd>. **Substituir nos arquivos** é <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>R</kbd> nos mapas WebStorm, só com o cursor no código (fora dele, a tecla é **Restaurar tudo**), e <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>H</kbd> no VS Code. Nos mapas WebStorm, **Localizar próxima** é <kbd>F3</kbd> ou <kbd>Ctrl</kbd> <kbd>L</kbd>.

## Plano e limites

A busca, a substituição nos arquivos, **Abrir arquivo** e a busca no arquivo são do plano grátis.

A busca procura só dentro da pasta da sessão, nunca em outras sessões ou workspaces. Ela lê o texto puro: um arquivo que não está em UTF-8 fica de fora.
