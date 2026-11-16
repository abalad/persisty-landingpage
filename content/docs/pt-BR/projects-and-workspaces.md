---
title: Projetos e workspaces
description: Como o Persisty organiza produtos, pastas, sessões e agentes numa só janela.
group: start
order: 2
---

O Persisty organiza o trabalho em três níveis, do maior para o menor.

| Nível | O que é | Onde aparece |
| --- | --- | --- |
| Projeto | Um produto, cliente ou negócio seu | Barra de projetos, à esquerda |
| Workspace | Uma pasta daquele projeto, com ou sem git | Cartões na faixa de baixo |
| Sessão | Um terminal: um agente ou um shell | Abas no topo |

## Barra de projetos

Cada projeto é um bloco com as duas primeiras letras do nome. Em **Ajustes do projeto**, você troca por outras iniciais, um símbolo ou uma imagem.

Um ponto no canto do bloco diz como está o projeto: amarelo quando um agente terminou e espera você ou pede permissão, azul quando um agente está trabalhando, verde quando há sessões rodando, e um anel vazado quando há sessões a restaurar. O ponto mostra o mais urgente, e passar o mouse diz o mesmo em palavras, como "2 aguardando você".

Aperte <kbd>⌘</kbd> <kbd>B</kbd> para expandir a barra. Expandida, ela mostra o nome e o estado de cada projeto e a lista de **Agentes**, com o estado e o workspace de cada um. O filtro alterna entre os agentes do projeto atual e os de todos.

Troque de projeto com <kbd>⌘</kbd> <kbd>1</kbd> a <kbd>⌘</kbd> <kbd>9</kbd>. Para mudar a ordem, arraste um projeto, ou use <kbd>⌥</kbd> <kbd>↑</kbd> e <kbd>⌥</kbd> <kbd>↓</kbd> com ele em foco.

Com o botão direito num projeto, você abre **Ajustes do projeto**, com o nome, a descrição e o ícone, ou **Dados do projeto**, com os números do projeto e o gasto estimado com IA no mês.

## Arquivar e excluir projetos

**Arquivar projeto**, em **Ajustes do projeto**, tira o projeto da barra lateral; as sessões e os workspaces continuam registrados. Se houver sessões abertas, você escolhe entre **Arquivar e manter abertas** e **Encerrar e arquivar**.

Os arquivados ficam em **Projetos arquivados**, que abre pelo contador abaixo da lista de projetos, com a barra expandida, ou pela paleta (<kbd>⌘</kbd> <kbd>K</kbd>). Ali, **Restaurar** devolve o projeto à barra, com os workspaces e as sessões, e **Excluir** tira o projeto do Persisty de vez, encerrando as sessões que ainda estiverem rodando. A exclusão pergunta o que fazer com as pastas: **Excluir só do Persisty** deixa tudo no computador, e **Excluir e apagar as pastas** mostra quais vão para a Lixeira antes de confirmar. Uma pasta que outro projeto usa, a sua pasta pessoal e a raiz do disco ficam onde estão.

## Workspaces

Cada cartão da faixa de baixo é uma pasta do projeto. Quando a pasta é um repositório git, o cartão mostra o branch e quantos arquivos mudaram. Dentro do cartão ficam as sessões daquele workspace, cada uma com o estado em palavras.

Para adicionar outro, use o cartão **Adicionar workspace**, no fim da faixa: ele aceita uma pasta do computador ou clona um repositório remoto. Arraste os cartões para mudar a ordem, ou use <kbd>⌥</kbd> <kbd>←</kbd> e <kbd>⌥</kbd> <kbd>→</kbd> com o cartão em foco. Para tirar um workspace do projeto, use **Remover do projeto** no painel **Detalhes**, ou **Remover workspace** na tela de um workspace sem sessões. Os arquivos da pasta não mudam.

O cartão **Avulsas** guarda sessões que não pertencem a nenhum workspace. <kbd>⌘</kbd> <kbd>J</kbd> recolhe a faixa em ícones quando você quer mais espaço para o terminal.

## Sessões

As abas do topo são as sessões do workspace selecionado. O **+** abre um terminal novo ali mesmo; <kbd>⌘</kbd> <kbd>←</kbd> e <kbd>⌘</kbd> <kbd>→</kbd> passam para a sessão anterior ou a próxima. Arraste uma aba para mudar a ordem, ou use <kbd>⌥</kbd> <kbd>←</kbd> e <kbd>⌥</kbd> <kbd>→</kbd> com ela em foco.

O cabeçalho da sessão mostra o nome, o estado e o branch da pasta. O branch acompanha trocas feitas pelo terminal, e clicar nele abre um seletor com busca para trocar ou criar branches.

## Comandos do workspace

O seletor de comandos, ao lado das abas, lista o que o Persisty encontra na pasta: os scripts do `package.json` (com o gerenciador que o lockfile indica), o Cargo, os alvos do Makefile, Gradle, Maven, Go, Python e Docker Compose. Ele só lê os arquivos; nada roda para descobrir. Comandos que você roda sempre e que não aparecem ali entram por **Adicionar comando…** e ficam em **Meus comandos**.

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> executa o comando escolhido, ou para o que está rodando, e <kbd>⌘</kbd> <kbd>E</kbd> abre e recolhe a **Saída do comando**. Cada execução vira uma aba ali, com o estado escrito: **Executando**, **Concluído**, **Falhou · código N**, **Parado** ou **Encerrado**. Parar um comando manda Ctrl-C como no terminal e mantém a saída; se ele não parar em 5 segundos, é encerrado.
