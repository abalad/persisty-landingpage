---
title: Editor, alterações e notas
description: O editor ao lado do terminal, com sugestões e erros do projeto, a aba de alterações do git, a busca no projeto e as notas.
group: work
order: 3
---

As ferramentas da sessão ficam numa barra fina na borda direita: **Código**, **Busca** e **Notas** no topo, depois **Alterações**, **Pontos de restauração** e **Fila**, e por fim **Detalhes**. Um clique abre o painel da ferramenta ao lado da barra, e o mesmo clique fecha; <kbd>⌘</kbd> <kbd>&#92;</kbd> também abre e fecha. Com o painel fechado, Alterações mostra quantos arquivos mudaram e a Fila quantos pedidos esperam. A divisória entre o terminal e o painel é arrastável.

## Código

O editor abre a pasta da sessão, em árvore. Arquivos ignorados pelo git aparecem esmaecidos. A lista de Arquivos muda de largura: arraste a divisória, ou use as setas com ela em foco; um clique duplo volta ao padrão. O botão direito num arquivo ou pasta tem **Mostrar no Finder**.

- <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd> busca em todos os arquivos, <kbd>⌘</kbd> <kbd>F</kbd> busca e substitui no arquivo aberto e <kbd>⌘</kbd> <kbd>S</kbd> salva. Para abrir um arquivo pelo nome, use <kbd>⌘</kbd> <kbd>P</kbd> fora do código, ou a tecla do seu mapa dentro dele (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> no WebStorm).
- Destaque por linguagem, carregado sob demanda, no mesmo tema do terminal.
- Marcas do git na margem e diff contra o HEAD.
- Se o arquivo mudar no disco (o agente editou), o Persisty avisa: recarregar ou manter a sua versão. Abas sem alteração recarregam sozinhas.
- Imagens abrem no editor (PNG, JPG, GIF, WebP, BMP e ICO), ajustadas ao painel, com as dimensões e o tamanho; um clique mostra no tamanho real. Um SVG abre como código e ganha a pré-visualização, como o Markdown (o botão de olho, ou <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>V</kbd>), desenhada como imagem e sem rodar script.

Outros arquivos binários e arquivos acima de 5 MB não abrem.

## Sugestões, documentação e erros

Em TypeScript, JavaScript e Rust, o editor conversa com o servidor da linguagem. As sugestões vêm do projeto, com o tipo e a documentação de cada uma, e escolher uma função de outro arquivo já escreve o `import`. Parar o mouse sobre um nome mostra a documentação dele, abrir o `(` de uma chamada mostra os parâmetros, e os erros aparecem sublinhados. Em Rust, os erros do `cargo check` se atualizam a cada vez que você salva.

Quando o servidor da linguagem não está no computador, o app baixa sozinho. A barra de status mostra o estado dele (baixando, indexando, pronto ou parou) e quantos erros e avisos o arquivo tem; clicar ali reinicia o servidor ou mostra o log.

Ir à definição funciona também em outro arquivo. Uma definição na biblioteca padrão ou numa dependência fora do projeto abre como somente leitura, com um cadeado na aba e "Fora do projeto · somente leitura" na barra de status: dá para navegar e ler, mas nada é editado. Em Rust, a biblioteca padrão precisa do código-fonte dela no seu toolchain (`rustup component add rust-src`); o app nunca muda o toolchain sozinho.

## Mapa de teclas

Em **Configurações › Editor › Mapa de teclas**, escolha **WebStorm** (padrão), **WebStorm (macOS)** ou **VS Code**. O mapa vale dentro do código; as teclas de abas e de localizar ação valem no app todo. Cada tecla faz a ação de verdade, e quando a ação não se aplica ali, a tecla segue para o app. **Configurações › Atalhos** lista todas as teclas do mapa escolhido e as do Persisty, com busca.

No WebStorm (padrão):

| Ação | Tecla |
| --- | --- |
| Ir à definição | <kbd>⌘</kbd> <kbd>B</kbd> ou <kbd>⌘</kbd> + clique |
| Parâmetros da chamada | <kbd>⌘</kbd> <kbd>P</kbd> |
| Documentação | <kbd>⌃</kbd> <kbd>J</kbd> |
| Voltar e avançar pelos lugares visitados | <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>←</kbd> e <kbd>⌘</kbd> <kbd>⌥</kbd> <kbd>→</kbd> |
| Próximo erro e anterior | <kbd>F2</kbd> e <kbd>⇧</kbd> <kbd>F2</kbd> |
| Abrir arquivo pelo nome | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> |
| Duplicar a linha | <kbd>⌘</kbd> <kbd>D</kbd> |
| Apagar a linha | <kbd>⌘</kbd> <kbd>Y</kbd> |
| Ir para uma linha | <kbd>⌘</kbd> <kbd>G</kbd> |
| Início e fim do bloco | <kbd>⌘</kbd> <kbd>[</kbd> e <kbd>⌘</kbd> <kbd>]</kbd> |
| Mover a instrução, com os comentários acima dela | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>↑</kbd> e <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>↓</kbd> |
| Localizar ação | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>A</kbd> |

O mapa do VS Code mantém as teclas dele, como <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>P</kbd> para localizar ação e <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>T</kbd> para reabrir a última aba fechada. Em qualquer mapa, <kbd>⌃</kbd> <kbd>Tab</kbd> abre o alternador de abas, pela ordem em que você as usou, e <kbd>⌘</kbd> <kbd>K</kbd> lista também as ações do editor. No Windows e no Linux, as mesmas ações ficam no <kbd>Ctrl</kbd>.

## Alterações

A aba **Alterações** (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd>) mostra os arquivos mudados com as letras de estado do git. Prepare ou remova por arquivo ou tudo, escreva a mensagem e faça o commit com <kbd>⌘</kbd> <kbd>↵</kbd>, ou use **Commit e enviar**. O histórico mostra o que ainda não foi enviado e os arquivos de cada commit.

Descartar alterações e resolver conflitos ficam no terminal ao lado. Se o git pedir senha para enviar, o Persisty mostra a recusa como o git escreveu.

## Notas

Cada projeto tem notas em markdown, salvas sozinhas no banco local do Persisty. As notas mantêm as teclas de antes, sem mapa.
