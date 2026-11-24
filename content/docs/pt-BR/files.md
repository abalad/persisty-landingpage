---
title: Arquivos
description: A árvore da pasta da sessão no painel Código, para criar, renomear, mover, copiar e excluir arquivos, abrir em outro app e copiar caminhos.
group: code
order: 4
---

A lista **Arquivos**, à esquerda do [editor](/docs/editor), mostra a pasta da sessão em árvore. Ela cria, renomeia, move, copia e exclui arquivos e pastas sem sair do Persisty. O botão direito num item abre o menu de arquivos; num espaço vazio da lista, o menu tem **Novo**, **Colar** e **Histórico local** para a pasta da sessão.

## A árvore

Arquivos que o git ignora aparecem esmaecidos, e o `.git` nunca aparece. No topo da lista, **Novo arquivo**, **Nova pasta** e **Atualizar** agem na pasta da sessão. A lista muda de largura: arraste a divisória, ou use <kbd>←</kbd> e <kbd>→</kbd> com ela em foco; um clique duplo volta à largura padrão.

<kbd>⌘</kbd> + clique e <kbd>⇧</kbd> + clique selecionam vários itens, e <kbd>⌘</kbd> <kbd>A</kbd> seleciona todos os visíveis. Com a árvore em foco, as setas andam pelos itens, <kbd>→</kbd> e <kbd>←</kbd> abrem e fecham uma pasta, <kbd>↵</kbd> abre o arquivo, e digitar o começo de um nome pula até ele. <kbd>⇧</kbd> <kbd>F10</kbd>, ou a tecla de menu, abre o menu do item em foco.

## Criar arquivos e pastas

![Novo arquivo, no topo da árvore, abre o campo do nome na própria árvore; com o nome checkout.ts e Enter, o arquivo aparece na lista e abre numa aba.](/docs-media/files/arquivos.mp4)

**Novo**, no menu, cria um **Arquivo** ou uma **Pasta** dentro da pasta do item. O mesmo submenu cria arquivos TypeScript, JavaScript, HTML, CSS, JSON, Markdown, Dockerfile e EditorConfig já com o modelo mínimo. O nome é escrito na própria árvore, e um nome que já existe é recusado com o motivo.

## Renomear, mover e copiar

**Renomear…** edita o nome na própria linha, e as abas abertas seguem o arquivo com o texto não gravado e o desfazer. Na [aba do editor](/docs/tabs-and-groups#o-menu-da-aba), o mesmo fica em **Renomear arquivo…**.

**Refatorar › Mover…** e **Refatorar › Copiar…** escolhem a pasta de destino numa lista com busca. Arrastar itens sobre uma pasta também move, e com <kbd>⌥</kbd> pressionado copia. Durante o arraste, o nome do item vai junto ao ponteiro, a pasta de destino fica destacada, e uma pasta fechada abre se o ponteiro parar sobre ela. Onde não dá para soltar, a árvore diz por quê, como "já está aqui". <kbd>Esc</kbd> cancela o arraste.

Com a árvore em foco, <kbd>⌘</kbd> <kbd>X</kbd>, <kbd>⌘</kbd> <kbd>C</kbd> e <kbd>⌘</kbd> <kbd>V</kbd> recortam, copiam e colam arquivos, também de e para o Finder; **Recortar**, **Copiar** e **Colar** estão no menu. Colar põe os itens na pasta clicada, ou na pasta do arquivo clicado.

## Excluir

**Excluir…** sempre pede confirmação e manda os itens para a Lixeira. Por 10 segundos, **Desfazer** no aviso, ou <kbd>⌘</kbd> <kbd>Z</kbd> com a árvore em foco, traz tudo de volta. Se um arquivo aberto tem alterações não gravadas, o Persisty pergunta antes se grava ou descarta; com **Salvar automaticamente** ligado, ele grava sem perguntar.

## Quando o nome já existe

Ao mover, copiar ou colar, se o nome já existe no destino, o Persisty pergunta uma vez só: **Renomear**, **Substituir** ou **Pular**. **Fazer o mesmo para os próximos** vale para os outros nomes repetidos da mesma operação. Substituir manda o item antigo para a Lixeira, e as alterações não gravadas de um arquivo aberto nunca se perdem sem você responder.

## Cópias grandes e falhas

Cópias e movimentos grandes mostram o andamento embaixo da árvore e podem ser cancelados com **Cancelar**, sem deixar nada pela metade. Se uma operação parar no meio, o que já foi fica, e o aviso diz qual item falhou. Quando um **Substituir** falha, o aviso diz qual item não foi colocado e que a versão antiga foi para a Lixeira; as abas fechadas para a operação voltam ao mesmo grupo e à mesma posição.

## Abrir em

**Abrir em**, na árvore e na aba, leva o item a outro lugar: **Mostrar no Finder**, **Terminal na pasta**, que abre uma sessão de terminal nova na pasta do item, **Abrir com o app padrão**, **Abrir no navegador** (só HTML, HTM e SVG), a sua IDE na linha do cursor e a [página do arquivo](/docs/forges#abrir-na-forja) no GitHub, GitLab ou Bitbucket. Numa branch que nunca foi enviada, a página da forja é a do commit atual.

A IDE é a que você escolhe em [**Configurações › Workspace › IDE padrão**](/docs/settings#workspace), entre as que o Persisty encontra no computador; o padrão é **Nenhum**. A mesma IDE abre a pasta da sessão pelo menu da aba da sessão, pela paleta e pelo projeto.

## Copiar caminho

**Copiar caminho** dá o **Caminho absoluto**, o **Caminho a partir do projeto**, o **Caminho a partir da raiz do repositório**, o **Nome do arquivo**, a **Referência** e o **Link no GitHub** (ou GitLab, ou Bitbucket), no commit atual. A referência é `arquivo:linha`, ou `arquivo:início-fim` com linhas selecionadas na aba. Com vários itens selecionados, cada um vai numa linha.

## Favoritos e histórico local

O submenu **Favoritos** tem **Adicionar aos favoritos**, para os itens selecionados, ou **Tirar dos favoritos**, quando todos eles já estão lá. Os favoritos seguem o arquivo ou a pasta renomeados e movidos, e a lista deles abre pela tecla; veja [Favoritos](/docs/code-navigation#favoritos).

O submenu **Histórico local** tem **Mostrar histórico**, que num arquivo lista as versões guardadas e numa pasta mostra o que mudou nela, com o que foi excluído, e **Colocar rótulo…**. No espaço vazio da lista, o mesmo submenu vale para a pasta inteira da sessão. Veja [Histórico local](/docs/local-history).

## Recarregar do disco

**Recarregar do disco** lê de novo o que mudou fora do editor. Num arquivo aberto com alterações não gravadas, ele pergunta antes, porque essas alterações se perdem. Numa pasta, lista de novo o conteúdo dela. Para listar de novo a árvore inteira, use **Atualizar**, no topo da lista. **Sincronizar a árvore**, <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>Y</kbd> nos mapas WebStorm, faz o mesmo e ainda confere na hora se os arquivos abertos mudaram no disco.

## Trocar o tipo do arquivo

**Trocar tipo do arquivo…**, na árvore, na aba ou na paleta (<kbd>⌘</kbd> <kbd>K</kbd>), lê um arquivo como outra linguagem, por exemplo um `.env` como Shell. A escolha vale para esse arquivo nesta pasta e segue o arquivo quando ele é movido. **Voltar ao automático** devolve a linguagem pela extensão.

## Esconder arquivos

Em **Configurações › Arquivos**, **Ocultar arquivos** lista padrões como `**/node_modules`. O que casa com um padrão some da árvore, da [busca](/docs/search) e de **Abrir arquivo**. O padrão de fábrica é `**/.DS_Store`. Cada padrão tem um interruptor para ligar e desligar e um botão para remover; um novo entra por **Novo padrão** e **Adicionar**. O `.git` fica sempre oculto.

## Teclas

<kbd>⌘</kbd> <kbd>X</kbd>, <kbd>⌘</kbd> <kbd>C</kbd>, <kbd>⌘</kbd> <kbd>V</kbd>, <kbd>⌘</kbd> <kbd>Z</kbd> e <kbd>⇧</kbd> <kbd>F10</kbd> valem na árvore em qualquer mapa de teclas. As outras são dos dois mapas WebStorm:

| Ação | Tecla |
| --- | --- |
| Novo | <kbd>⌃</kbd> <kbd>N</kbd> ou <kbd>⌃</kbd> <kbd>↵</kbd>; no WebStorm (macOS), <kbd>⌘</kbd> <kbd>N</kbd> ou <kbd>⌃</kbd> <kbd>↵</kbd> |
| Renomear | <kbd>⇧</kbd> <kbd>F6</kbd> |
| Mover para outra pasta | <kbd>F6</kbd> |
| Copiar para outra pasta | <kbd>F5</kbd> |
| Excluir | <kbd>⌫</kbd> ou <kbd>⌘</kbd> <kbd>⌫</kbd> |
| Copiar caminho (também na aba e no código) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> |
| Copiar referência (também na aba e no código) | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> |
| Sincronizar a árvore | <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>Y</kbd> |

No mapa do VS Code, essas ações ficam no menu. <kbd>⌘</kbd> <kbd>N</kbd> do WebStorm (macOS) abre o **Novo** só com o foco na árvore; fora dela, abre um terminal novo. [**Configurações › Atalhos**](/docs/shortcuts#arquivos) tem o grupo **Arquivos**, com onde cada tecla vale: na árvore, na aba ou no editor.

No Windows e no Linux, que estão em prévia, <kbd>Ctrl</kbd> e <kbd>Alt</kbd> fazem o papel de <kbd>⌘</kbd> e <kbd>⌥</kbd>, <kbd>Delete</kbd> exclui, e **Novo** é <kbd>Alt</kbd> <kbd>Insert</kbd>. O Finder dá lugar ao Explorador de Arquivos ou ao gerenciador de arquivos.

## Plano e limites

A árvore e todas as operações de arquivo são do plano grátis.

A árvore só mostra e altera o que está dentro da pasta da sessão. No Windows e no Linux, colar arquivos de e para o sistema e o Desfazer da exclusão ainda estão sendo conferidos em uso.
