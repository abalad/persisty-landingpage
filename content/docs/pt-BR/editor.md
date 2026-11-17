---
title: Editor
description: O editor de cada sessão, ao lado do terminal, com destaque por linguagem, pré-visualização de Markdown e imagens, sugestões e erros do projeto e o mapa de teclas que você escolhe.
group: code
order: 1
---

O painel **Código** é o editor da sessão: a pasta dela em árvore, à esquerda, e os arquivos abertos em abas, ao lado do terminal. Ele abre pelo ícone **Código**, na barra de ferramentas da borda direita da sessão. A árvore, as abas e o Git de cada arquivo têm páginas próprias: [Arquivos](/docs/files), [Abas e grupos](/docs/tabs-and-groups) e [Git no editor](/docs/git-in-the-editor).

## Abrir e salvar

Um clique num arquivo da árvore abre o arquivo numa aba, e <kbd>⌘</kbd> <kbd>S</kbd> salva. Para abrir um arquivo pelo nome, veja [Abrir arquivo pelo nome](/docs/search#abrir-arquivo-pelo-nome).

A barra embaixo do código mostra o caminho do arquivo, a linha e a coluna, a linguagem, o estado do servidor da linguagem e o fim de linha, LF ou CRLF. Num arquivo que não está no último commit, como um arquivo novo ou fora de um repositório, ela diz **fora do git**.

Arquivos de texto abrem até 5 MB, e imagens até 10 MB. Outros arquivos binários não abrem no editor.

A fonte, a tabulação, a quebra de linha, os números de linha e o modificador do multicursor ficam em [Configurações › Editor](/docs/settings#editor), com o padrão de cada um.

## Salvar automaticamente

**Salvar automaticamente**, em **Configurações › Workspace**, vem desligado. Ligado, o editor grava 1 segundo depois da última edição, nunca por cima de uma mudança feita fora do editor, e fechar uma aba com alterações grava sem perguntar.

Desligado, fechar uma aba com alterações não gravadas pede confirmação, e **Descartar** fecha sem gravar. Ao fechar várias abas de uma vez, uma pergunta só oferece **Gravar todas** ou **Descartar todas**.

## Quando o arquivo muda no disco

Com o app à vista, o editor confere os arquivos abertos a cada 2 segundos. Uma aba sem alterações recarrega sozinha, e é assim que as edições do agente aparecem no editor.

Se você já tinha mudado o texto, a aba avisa: "Este arquivo mudou no disco depois que você começou a editar." **Recarregar** traz a versão do disco, e **Manter a minha** grava a sua por cima.

## Destaque por linguagem

O destaque de cada linguagem carrega quando o primeiro arquivo dela abre, nas cores do tema do app, claro ou escuro. A linguagem vem da extensão. Para ler um arquivo como outra linguagem, como um `.env` como Shell, use [Trocar o tipo do arquivo](/docs/files#trocar-o-tipo-do-arquivo).

## Markdown e imagens

Num arquivo `.md`, o botão de olho, na barra das abas, ou <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>V</kbd> alterna entre o código e a pré-visualização, que já mostra o que você ainda não gravou. A pré-visualização tem tabelas, listas de tarefas e blocos de código. Um link para um site abre no navegador, um link para um arquivo da pasta abre o arquivo no editor, e um link `#` leva ao título.

Nada carrega na pré-visualização: HTML aparece como texto, e uma imagem da web vira um link para abrir no navegador. Acima de 300 mil caracteres, o arquivo não é pré-visualizado. Em **Configurações › Editor**, **Abrir arquivos .md em** escolhe como um `.md` abre: **Código**, o padrão, ou **Pré-visualização**.

Imagens PNG, JPG, GIF, WebP, BMP e ICO abrem numa aba, ajustadas ao painel, com as dimensões e o tamanho do arquivo; um clique mostra a imagem no tamanho real, e outro volta. Um SVG abre como código e tem a mesma pré-visualização do Markdown, desenhada como imagem, sem rodar script.

## Contexto fixo e minimapa

**Contexto fixo ao rolar**, em **Configurações › Editor**, vem desligado. Ligado, o início da função, da classe ou do título em que você está fica no topo do editor, em até 5 linhas, e sai quando a linha que fecha o bloco chega ao topo. Um clique numa dessas linhas leva até ela.

O **Minimapa** desenha o arquivo inteiro numa faixa à direita do código; clique ou arraste nela para ir a outro trecho. **Mostrar o minimapa** vem desligado. Ligado, ele tem **Desenho**, em **Caracteres** (padrão) ou **Blocos**, **Escala** de 1 a 3, **Área visível**, que marca a parte na tela **Sempre** ou **Ao passar o mouse** (padrão), e **Esconder até passar o mouse**, desligado.

## Sugestões, documentação e erros

Em TypeScript, JavaScript e Rust, o editor conversa com o servidor da linguagem. As sugestões vêm do projeto, com o tipo e a documentação de cada uma, e escolher uma função de outro arquivo já escreve o `import`. Para pedir as sugestões, use **Completar código**: <kbd>⌃</kbd> <kbd>Espaço</kbd> em qualquer mapa, ou <kbd>⌥</kbd> <kbd>Esc</kbd> no Mac. O macOS usa <kbd>⌃</kbd> <kbd>Espaço</kbd> para trocar o teclado por padrão; nesse caso, [**Configurações › Atalhos**](/docs/shortcuts) avisa e diz onde desligar.

Parar o mouse sobre um nome mostra a documentação dele, abrir o `(` de uma chamada mostra os parâmetros, e os erros aparecem sublinhados. Em Rust, os erros do `cargo check` se atualizam a cada vez que você salva.

Arquivos com mais de 2 MB ou de 50 mil linhas, e arquivos minificados, com uma das primeiras 50 linhas acima de 5 mil caracteres, ficam fora do servidor: a barra de status diz "arquivo grande demais para o servidor", e o arquivo abre sem sugestões nem erros. O mesmo arquivo aberto em dois grupos tem sugestões e erros num grupo só; veja [Dividir o editor](/docs/tabs-and-groups#dividir-o-editor).

## O servidor da linguagem

Quando o servidor da linguagem não está no computador, o app baixa sozinho. Esse primeiro download precisa de internet; sem conexão, a barra de status diz "sem servidor: sem conexão".

A barra de status mostra o estado do servidor (baixando, indexando, pronto ou parou) e quantos erros e avisos o arquivo tem. Clicar ali reinicia o servidor ou mostra o log. Um servidor que passa 5 minutos sem nenhuma aba da linguagem dele à vista para sozinho e volta quando você abre um arquivo dela. Se ele cair, o app o reinicia até três vezes seguidas; depois disso, ele fica parado até você reiniciar pela barra de status.

## Ir para a declaração

**Ir para a declaração** funciona também em outro arquivo, e <kbd>⌘</kbd> + clique num nome faz o mesmo. Uma definição na biblioteca padrão ou numa dependência fora do projeto abre como somente leitura, com um cadeado na aba e "Fora do projeto · somente leitura" na barra de status: dá para navegar e ler, mas nada é editado.

Em Rust, a biblioteca padrão precisa do código-fonte dela no seu toolchain (`rustup component add rust-src`); o app nunca muda o toolchain sozinho.

## Acessibilidade

Com **Reduzir movimento** ligado nos ajustes de acessibilidade do sistema, o app tira as transições; no editor, os números de linha continuam alinhados ao código, e um resultado da busca leva à linha certa. A árvore, as abas e os menus funcionam pelo teclado, e um leitor de tela ouve quando uma aba não foi gravada, está em prévia ou foi fixada.

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

O mapa do VS Code mantém as teclas dele, como <kbd>F12</kbd> para ir à declaração e <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd> para localizar ação. <kbd>⌘</kbd> <kbd>K</kbd> abre a paleta, que lista também as ações do editor. No mapa do VS Code, com o cursor no código, <kbd>⌘</kbd> <kbd>K</kbd> começa as teclas de duas partes dele, como <kbd>⌘</kbd> <kbd>K</kbd> <kbd>⌘</kbd> <kbd>C</kbd>, que comenta a linha; ali, as ações do editor ficam em <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd>.

No Windows e no Linux, que estão em prévia, <kbd>Ctrl</kbd> e <kbd>Alt</kbd> fazem o papel de <kbd>⌘</kbd> e <kbd>⌥</kbd>, e os dois mapas WebStorm usam as teclas da coluna WebStorm, com uma diferença: **Documentação rápida** é <kbd>Ctrl</kbd> <kbd>Q</kbd>.

## Plano e limites

O editor é do plano grátis, com tudo desta página.

Sugestões, documentação, erros e **Ir para a declaração** existem só em TypeScript, JavaScript e Rust; nas outras linguagens, o editor tem o destaque. O primeiro download de cada servidor precisa de internet. Arquivos de texto acima de 5 MB e imagens acima de 10 MB não abrem.
