---
title: Editor, alterações e notas
description: O editor ao lado do terminal, com a árvore de arquivos, sugestões e erros do projeto, a aba de alterações do git, a busca no projeto e as notas.
group: code
order: 1
---

As ferramentas da sessão ficam numa barra fina na borda direita: **Código**, **Busca** e **Notas** no topo, depois **Alterações**, **Pontos de restauração** e **Fila de pedidos**, e por fim **Detalhes**. Um clique abre o painel da ferramenta ao lado da barra, e o mesmo clique fecha; <kbd>⌘</kbd> <kbd>&#92;</kbd> também abre e fecha. Com o painel aberto ou fechado, Alterações mostra quantos arquivos mudaram e, nas sessões com agente, a Fila de pedidos mostra quantos pedidos esperam. A divisória entre o terminal e o painel é arrastável.

## Código

O editor abre a pasta da sessão, em árvore. Arquivos ignorados pelo git aparecem esmaecidos. A lista de Arquivos muda de largura: arraste a divisória, ou use as setas com ela em foco; um clique duplo volta ao padrão. A árvore cria, renomeia, move, copia e exclui arquivos; veja [Arquivos](#arquivos).

- <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd> busca em todos os arquivos, <kbd>⌘</kbd> <kbd>F</kbd> busca e substitui no arquivo aberto e <kbd>⌘</kbd> <kbd>S</kbd> salva. Para abrir um arquivo pelo nome, use <kbd>⌘</kbd> <kbd>P</kbd> fora do código, ou a tecla do seu mapa dentro dele (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> no WebStorm).
- Destaque por linguagem, carregado sob demanda, no mesmo tema do terminal.
- Marcas do git na margem e diff contra o HEAD. Quem mudou cada linha e o histórico do arquivo estão em [Git no arquivo](#git-no-arquivo).
- Se o arquivo mudar no disco (o agente editou), o Persisty avisa: recarregar ou manter a sua versão. Abas sem alteração recarregam sozinhas.
- Imagens abrem no editor (PNG, JPG, GIF, WebP, BMP e ICO), ajustadas ao painel, com as dimensões e o tamanho; um clique mostra no tamanho real. Um SVG abre como código e ganha a pré-visualização, como o Markdown (o botão de olho, ou <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>V</kbd>), desenhada como imagem e sem rodar script.

Outros arquivos binários e arquivos acima de 5 MB não abrem.

## Arquivos

O botão direito num arquivo ou numa pasta abre o menu de arquivos; com a árvore em foco, <kbd>⇧</kbd> <kbd>F10</kbd> também abre. <kbd>⌘</kbd> + clique e <kbd>⇧</kbd> + clique selecionam vários itens, as setas andam pela árvore e <kbd>↵</kbd> abre o arquivo.

**Novo** cria um arquivo ou uma pasta. Arquivos TypeScript, JavaScript, HTML, CSS, JSON, Markdown, Dockerfile e EditorConfig já nascem com o modelo mínimo. **Renomear** edita o nome na própria linha, e as abas abertas seguem o arquivo com o texto não gravado e o desfazer. **Mover para…** e **Copiar para…** escolhem a pasta numa lista com busca. Arrastar um item sobre uma pasta também move, e com <kbd>⌥</kbd> copia. Com a árvore em foco, <kbd>⌘</kbd> <kbd>X</kbd>, <kbd>⌘</kbd> <kbd>C</kbd> e <kbd>⌘</kbd> <kbd>V</kbd> recortam, copiam e colam arquivos, inclusive de e para o Finder.

**Excluir** sempre pede confirmação e manda para a Lixeira. Por 10 segundos, **Desfazer** no aviso ou <kbd>⌘</kbd> <kbd>Z</kbd> traz o arquivo de volta. Quando o nome já existe no destino, o Persisty pergunta uma vez só: renomear, substituir (o antigo vai para a Lixeira) ou pular, e pode fazer o mesmo para os próximos. Um arquivo com alterações não gravadas nunca é substituído sem você confirmar. Cópias grandes mostram o andamento e podem ser canceladas sem deixar nada pela metade. Se mover ou copiar parar no meio, o que já foi fica, e o aviso diz qual item falhou.

**Abrir em** leva o arquivo ao Finder, a um terminal na pasta, ao app padrão, ao navegador, à IDE na linha atual ou à página dele no GitHub, GitLab ou Bitbucket. A IDE é a que você escolhe em **Configurações › Workspace › IDE padrão**. **Copiar caminho** dá o caminho absoluto, o caminho a partir do projeto ou da raiz do repositório, o nome, a referência `arquivo:linha` e o link do arquivo na forja. **Recarregar do disco** lê de novo o que mudou fora do editor. **Trocar tipo do arquivo** lê um arquivo como outra linguagem, por exemplo um `.env` como Shell, e a escolha segue o arquivo quando ele é movido.

O botão direito na aba do editor tem todas as formas de fechar: a aba, as outras, todas, as não modificadas, e as que estão à esquerda ou à direita. Só as abas com alterações não gravadas pedem confirmação, numa pergunta só. O mesmo menu renomeia o arquivo, troca o tipo, copia o caminho, abre em outro lugar e recarrega do disco.

Nos mapas WebStorm, as teclas são as da IDE: <kbd>⇧</kbd> <kbd>F6</kbd> renomeia, <kbd>F6</kbd> move, <kbd>F5</kbd> copia para outra pasta, <kbd>⌫</kbd> exclui, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> copia o caminho, <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>C</kbd> copia a referência e <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>Y</kbd> sincroniza a árvore com a pasta. No mapa do VS Code, essas ações ficam no menu. **Configurações › Atalhos** tem o grupo **Arquivos**, com onde cada tecla vale: na árvore, na aba ou no editor.

No Windows e no Linux, <kbd>Ctrl</kbd> e <kbd>Alt</kbd> fazem o papel de <kbd>⌘</kbd> e <kbd>⌥</kbd>, e <kbd>Delete</kbd> exclui. Colar arquivos de e para o sistema e o Desfazer da exclusão ainda estão sendo conferidos em uso nessas plataformas.

## Abas e grupos

O editor se divide em até quatro grupos, lado a lado ou empilhados, cada um com as suas abas. **Dividir à direita** e **Dividir embaixo** estão no botão direito da aba e na paleta (<kbd>⌘</kbd> <kbd>K</kbd>). Arrastar uma aba muda a ordem, leva a aba a outro grupo ou, solta na borda de um grupo, cria um novo. O mesmo arquivo pode ficar aberto em dois grupos: o texto acompanha e cada lado tem o seu desfazer, mas só um deles mostra as sugestões e os erros do servidor da linguagem. **Maximizar o editor** esconde o terminal para caber mais, e o mesmo comando volta ao tamanho de antes.

**Fixar aba**, no botão direito da aba, põe a aba à esquerda, com um alfinete. Uma aba fixada não fecha com **Fechar as outras abas**, **Fechar todas as abas** nem pelo limite de abas. Com a aba em foco, <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>←</kbd> e <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>→</kbd> mudam a aba de lugar, e **Mover a aba para o próximo grupo** está na paleta.

Em **Configurações › Editor › Abas**, escolha o limite de abas (20 por padrão; abrir uma a mais fecha a menos usada, e as fixadas e as não gravadas ficam), para onde ir ao fechar (a aba usada antes ou a vizinha), onde abrir a aba nova (no fim ou logo depois da atual), se a pasta aparece em nomes repetidos e como marcar a aba não gravada (ponto ou nome em itálico). A **Aba de prévia**, desligada por padrão, faz o clique na árvore abrir uma aba que o próximo clique troca; editar, ou clicar duas vezes na aba, a mantém. **Configurar as abas**, no botão direito da aba, leva direto a essa tela.

Nos mapas WebStorm, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F12</kbd> maximiza o editor, <kbd>⌥</kbd> <kbd>Tab</kbd> e <kbd>⌥</kbd> <kbd>⇧</kbd> <kbd>Tab</kbd> vão ao próximo grupo e ao anterior, e <kbd>⇧</kbd> <kbd>↵</kbd> na árvore abre o arquivo à direita. No mapa do VS Code, essas ações ficam na paleta e no menu da aba. No Windows e no Linux, mover a aba é <kbd>Alt</kbd> <kbd>⇧</kbd> com as setas, maximizar é <kbd>Ctrl</kbd> <kbd>⇧</kbd> <kbd>F12</kbd>, e trocar de grupo fica na paleta.

## Git no arquivo

No fim da linha do cursor, depois de um instante parado, o editor mostra quem mudou a linha, quando e com que mensagem. Passar o ponteiro abre o cartão do commit, com **Copiar hash**, **Mostrar o commit** e **Abrir na forja**; pelo teclado, use **Mostrar o cartão do commit da linha**, na paleta. Em **Configurações › Editor**, **Autor da linha (git blame)** desliga a informação, escolhe o que aparece (autor, data, mensagem) e quanto tempo esperar.

**Anotar com o git blame** põe na margem o autor e a data de cada linha, com a cor pela idade do commit. O menu da anotação mostra o diff do commit, anota a revisão anterior ou fecha a anotação. Arquivos com mais de 20 mil linhas não são anotados.

O submenu **Git**, no botão direito da árvore e da aba, tem **Mostrar diff**, **Mostrar histórico**, **Mostrar histórico da seleção** (com as linhas selecionadas no código), **Comparar com branch…**, **Comparar com commit…**, **Preparar**, **Tirar da preparação**, **Descartar alterações** e **Anotar com o git blame**. Os diffs e o histórico abrem em abas só de leitura. Todas essas ações estão também na paleta.

**Descartar alterações** pergunta antes e grava um ponto de restauração, "Antes de descartar alterações". Para trazer o arquivo de volta, use o painel **Pontos de restauração**; isso vale também no plano grátis.

## Sugestões, documentação e erros

Em TypeScript, JavaScript e Rust, o editor conversa com o servidor da linguagem. As sugestões vêm do projeto, com o tipo e a documentação de cada uma, e escolher uma função de outro arquivo já escreve o `import`. Para pedir as sugestões, use **Completar código**: <kbd>⌃</kbd> <kbd>Espaço</kbd> em qualquer mapa, ou <kbd>⌥</kbd> <kbd>Esc</kbd> no Mac. O macOS usa <kbd>⌃</kbd> <kbd>Espaço</kbd> para trocar o teclado por padrão; nesse caso, **Configurações › Atalhos** avisa e diz onde desligar. Parar o mouse sobre um nome mostra a documentação dele, abrir o `(` de uma chamada mostra os parâmetros, e os erros aparecem sublinhados. Em Rust, os erros do `cargo check` se atualizam a cada vez que você salva.

Quando o servidor da linguagem não está no computador, o app baixa sozinho. Esse primeiro download precisa de internet; sem conexão, a barra de status diz "sem servidor: sem conexão". A barra de status mostra o estado do servidor (baixando, indexando, pronto ou parou) e quantos erros e avisos o arquivo tem; clicar ali reinicia o servidor ou mostra o log.

Arquivos com mais de 2 MB ou de 50 mil linhas, e arquivos minificados, ficam fora do servidor: a barra de status diz "arquivo grande demais para o servidor", e o arquivo abre sem sugestões nem erros. Para o mesmo arquivo aberto em dois grupos, veja [Abas e grupos](#abas-e-grupos).

**Ir para a declaração** funciona também em outro arquivo. Uma definição na biblioteca padrão ou numa dependência fora do projeto abre como somente leitura, com um cadeado na aba e "Fora do projeto · somente leitura" na barra de status: dá para navegar e ler, mas nada é editado. Em Rust, a biblioteca padrão precisa do código-fonte dela no seu toolchain (`rustup component add rust-src`); o app nunca muda o toolchain sozinho.

## Mapa de teclas

Em **Configurações › Editor › Mapa de teclas**, escolha **WebStorm** (padrão), **WebStorm (macOS)** ou **VS Code**. O mapa vale dentro do código; as teclas de abas e de localizar ação valem no app todo, e no terminal só as que o shell não usa. Cada tecla faz a ação de verdade, e quando a ação não se aplica ali, a tecla segue para o app. **Configurações › Atalhos** lista todas as teclas do mapa escolhido e as do Persisty, com busca, pelos mesmos nomes da tabela abaixo.

As teclas dos dois mapas WebStorm no Mac:

| Ação | WebStorm | WebStorm (macOS) |
| --- | --- | --- |
| Ir para a declaração | <kbd>⌘</kbd> <kbd>B</kbd> ou <kbd>⌘</kbd> + clique | <kbd>⌘</kbd> <kbd>B</kbd> ou <kbd>⌘</kbd> + clique |
| Informações do parâmetro | <kbd>⌘</kbd> <kbd>P</kbd> | <kbd>⌘</kbd> <kbd>P</kbd> |
| Documentação rápida | <kbd>⌃</kbd> <kbd>J</kbd> | <kbd>F1</kbd> ou <kbd>⌃</kbd> <kbd>J</kbd> |
| Voltar / Avançar | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>←</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>→</kbd> | <kbd>⌘</kbd> <kbd>[</kbd> / <kbd>⌘</kbd> <kbd>]</kbd>, ou <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>←</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>→</kbd> |
| Próximo erro / Erro anterior | <kbd>F2</kbd> / <kbd>⇧</kbd> <kbd>F2</kbd> | <kbd>F2</kbd> / <kbd>⇧</kbd> <kbd>F2</kbd> |
| Ir para o arquivo | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> |
| Duplicar linha ou seleção | <kbd>⌘</kbd> <kbd>D</kbd> | <kbd>⌘</kbd> <kbd>D</kbd> |
| Apagar linha | <kbd>⌘</kbd> <kbd>Y</kbd> | <kbd>⌘</kbd> <kbd>⌫</kbd> |
| Ir para a linha | <kbd>⌘</kbd> <kbd>G</kbd> | <kbd>⌘</kbd> <kbd>L</kbd> |
| Ir para o início / o fim do bloco de código | <kbd>⌘</kbd> <kbd>[</kbd> / <kbd>⌘</kbd> <kbd>]</kbd> | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>[</kbd> / <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>]</kbd> |
| Mover instrução para cima / para baixo, com os comentários acima dela | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>↑</kbd> / <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>↑</kbd> / <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> |
| Localizar ação | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>A</kbd> | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>A</kbd> |

O mapa do VS Code mantém as teclas dele, como <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd> para localizar ação e <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>T</kbd> para reabrir a última aba fechada. Em qualquer mapa, <kbd>⌃</kbd> <kbd>Tab</kbd> faz **Alternar entre abas**, pela ordem em que você as usou, e <kbd>⌘</kbd> <kbd>K</kbd> lista também as ações do editor. No Windows e no Linux, <kbd>Ctrl</kbd> e <kbd>Alt</kbd> fazem o papel de <kbd>⌘</kbd> e <kbd>⌥</kbd>, e os dois mapas WebStorm usam as teclas da coluna WebStorm, com uma diferença: **Documentação rápida** é <kbd>Ctrl</kbd> <kbd>Q</kbd>.

## Alterações

A aba **Alterações** (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd>) mostra os arquivos mudados com as letras de estado do git, e um clique mostra o diff; **Abrir no editor** leva ao arquivo. Prepare ou remova por arquivo ou tudo, escreva a mensagem e faça o commit com <kbd>⌘</kbd> <kbd>↵</kbd>, ou use **Commit e enviar**. Sem nada preparado, **Commit de tudo** prepara todas as alterações e faz o commit. Em **Mais ações de commit**, **Corrigir último commit** junta o que está preparado ao último commit, e **Desfazer último commit** tira o commit e devolve as alterações, preparadas, com a mensagem na caixa. Se esse commit já foi enviado, o Persisty avisa que o próximo envio vai precisar ser forçado.

O botão direito num arquivo descarta as alterações, com um ponto de restauração antes, como no editor. Ali também dá para ignorar o arquivo, a pasta ou tudo com o mesmo nome (o Persisty escreve no `.gitignore`), copiar o caminho e mostrar no Finder.

O painel mostra se a branch está em dia com o remoto e oferece puxar ou enviar o que falta, **Publicar branch** quando ela ainda não existe lá e **Buscar do remoto**. Em **Mais ações de sincronização** ficam **Puxar com rebase**, **Puxar com merge** e **Enviar forçado**, que só substitui o remoto se ninguém tiver enviado nada desde a última busca. Quando os dois lados têm commits novos, o Persisty pergunta como juntar: merge ou rebase.

Durante um merge, rebase, cherry-pick ou reversão, o painel mostra a operação e os arquivos em conflito. Em cada um, escolha **Aceitar a versão atual** ou **Aceitar a versão que chega**, ou edite e use **Marcar como resolvido**. Depois, **Continuar** conclui, e **Abortar** volta tudo a como estava antes de começar.

O histórico mostra o que ainda não foi enviado e os arquivos de cada commit. Se o git pedir senha para enviar, o Persisty mostra a recusa como o git escreveu.

## Notas

Cada projeto tem notas em markdown, salvas sozinhas no banco local do Persisty. Todas as sessões do projeto abrem as mesmas notas, e o cabeçalho mostra **Notas ·** com o nome do projeto. As notas mantêm as teclas de antes, sem mapa.
