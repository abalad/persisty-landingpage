---
title: Projetos e workspaces
description: Como o Persisty organiza produtos e pastas, e como criar, ajustar, ordenar, arquivar e excluir projetos e workspaces.
group: start
order: 2
---

O Persisty organiza o trabalho em três níveis, do maior para o menor.

| Nível | O que é | Onde aparece |
| --- | --- | --- |
| Projeto | Um produto, cliente ou negócio seu | Barra de projetos, à esquerda |
| Workspace | Uma pasta daquele projeto, com ou sem git | Cartões na faixa de baixo |
| Sessão | Um terminal: um agente ou um shell | Abas no topo |

As sessões têm página própria, [Sessões e terminais](/docs/sessions). Projetos e workspaces são do plano grátis.

## Barra de projetos

![Troca da aba da sessão api para a web, depois para o workspace atlas-site, na lista de workspaces, e por fim do projeto Atlas para o Nimbus, na barra de projetos à esquerda.](/docs-media/projects-and-workspaces/projetos.mp4)

Cada projeto é um bloco com as duas primeiras letras do nome. Um ponto no canto do bloco diz como está o projeto: amarelo quando um agente terminou e espera você ou pede permissão, azul quando um agente está trabalhando, verde quando há sessões rodando, e um anel vazado quando há sessões a restaurar. O ponto mostra o mais urgente, e passar o mouse diz o mesmo em palavras, como "2 aguardando você".

Aperte <kbd>⌘</kbd> <kbd>B</kbd> para expandir a barra. Expandida, ela mostra o nome e o estado de cada projeto e a lista de **Agentes**, com o estado e o workspace de cada um; o filtro alterna entre **Projeto** e **Todos**. Troque de projeto com <kbd>⌘</kbd> <kbd>1</kbd> a <kbd>⌘</kbd> <kbd>9</kbd>. No Windows e no Linux, que estão em prévia, use <kbd>Ctrl</kbd> no lugar de <kbd>⌘</kbd>.

Para criar um projeto, use o **+** da barra. Em **Novo projeto**, dê um **Nome** e, se quiser, uma **Descrição**, e clique em **Criar projeto**. O **Identificador** sai do nome e não muda depois.

## Ajustes do projeto

O botão direito num projeto abre **Ajustes do projeto** ou **Dados do projeto**, duas partes da mesma janela.

Em **Geral** ficam o nome, a descrição e o ícone, que pode ser outras iniciais (até dois caracteres), um símbolo da lista ou uma imagem PNG, JPG, WebP ou SVG de até 5 MB; essas mudanças valem quando você clica em **Salvar**. Ali também estão a **Conta do Claude** do projeto, que é do [Pro](/docs/pro) (veja [Contas de IA e rodízio](/docs/ai-accounts)), e **Arquivar projeto**.

**Visão geral** mostra os números do projeto, como workspaces, sessões ativas e sessões a restaurar, e o [gasto estimado com IA](/docs/usage-and-quota) no mês, com **Abrir uso detalhado**. **Workspaces** e **Sessões** listam as pastas e os terminais do projeto. **Tarefas** escolhe de onde vêm as [issues](/docs/issues#ligar-ao-projeto) para começar sessões, e **Servidores MCP**, quais [servidores MCP](/docs/mcp-servers#ligar-num-projeto) as sessões de agente do projeto recebem.

## Arquivar e excluir projetos

**Arquivar projeto**, em **Ajustes do projeto**, tira o projeto da barra lateral; as sessões e os workspaces continuam registrados. Se houver sessões abertas, você escolhe entre **Arquivar e manter abertas** e **Encerrar e arquivar**.

Os arquivados ficam em **Projetos arquivados**, que abre pelo contador abaixo da lista de projetos, com a barra expandida, ou pela paleta (<kbd>⌘</kbd> <kbd>K</kbd>), quando há algum. Ali, **Restaurar** devolve o projeto à barra, com os workspaces e as sessões. Na paleta, escolher um projeto arquivado também o restaura e abre.

Só um projeto arquivado pode ser excluído: **Excluir**, na linha dele em **Projetos arquivados**, tira o projeto do Persisty de vez, com as sessões, os workspaces e os comandos, e encerra as sessões que ainda estiverem rodando. A exclusão pergunta o que fazer com as pastas: **Excluir só do Persisty** deixa tudo no computador, e **Excluir e apagar as pastas** mostra quais vão para a Lixeira antes de confirmar. Uma pasta que outro projeto usa, a sua pasta pessoal, a raiz do disco e os dados do Persisty ficam onde estão.

## Workspaces

Cada cartão da faixa de baixo é uma pasta do projeto. Quando a pasta é um repositório git, o cartão mostra o branch e quantos arquivos mudaram. Dentro do cartão aparecem até três sessões daquele workspace, cada uma com o estado em palavras, e um clique numa delas abre a sessão. No rodapé do cartão ficam quantas sessões estão ativas e há quanto tempo houve atividade.

Um workspace sem sessões mostra o caminho da pasta e os atalhos para abrir uma; veja [Nova sessão](/docs/sessions#nova-sessão). Cada workspace tem também os seus [comandos](/docs/commands), no seletor ao lado das abas.

O cartão **Avulsas** guarda as sessões que não pertencem a nenhum workspace, abertas numa pasta qualquer, e aparece quando há uma delas ou quando o projeto ainda não tem workspaces. <kbd>⌘</kbd> <kbd>J</kbd> recolhe a faixa em ícones quando você quer mais espaço para o terminal.

Para tirar um workspace do projeto, use **Remover do projeto** no painel **Detalhes**, ou **Remover workspace** na tela de um workspace sem sessões. Os arquivos da pasta não mudam.

## Adicionar workspace

O cartão **Adicionar workspace**, no fim da faixa, abre a janela de mesmo nome com duas origens: **Pasta do computador** e **Repositório remoto**. Num projeto ainda vazio, a tela do projeto também aceita uma pasta arrastada do Finder; ali, <kbd>1</kbd> escolhe uma pasta, <kbd>4</kbd> vai direto ao repositório remoto, e <kbd>2</kbd> e <kbd>3</kbd> abrem a **Nova sessão** para um terminal ou um agente avulso.

Com **Pasta do computador**, escreva o caminho completo ou clique em **Escolher pasta…**. No Windows, o caminho começa pela letra do disco, como `C:\`. O Persisty lê a pasta e mostra o que encontrou: **Repositório git** ou **Pasta comum**, o branch e o remoto. O **Nome** é o que aparece nos cartões e nas abas, e **Adicionar workspace** conclui.

## Clonar um repositório

![Em Adicionar workspace, Repositório remoto lista os repositórios da conta conectada; escolhido o atlas-landing, aparecem o repositório, o branch padrão e a pasta de destino, e Clonar e adicionar baixa o repositório e abre o workspace novo.](/docs-media/projects-and-workspaces/workspace-remoto.mp4)

Com **Repositório remoto**, cole o link do repositório; qualquer endereço git funciona. Sem conta conectada, o campo se chama **Link**, e **Seus repositórios** oferece conectar o GitHub ou o GitLab ali mesmo; o Bitbucket e o GitLab da empresa ficam em [**Configurações › Integrações**](/docs/settings#integrações); veja [GitHub, GitLab e Bitbucket](/docs/forges). Com uma conta conectada, o campo vira **Link ou busca** e lista os seus repositórios, com um filtro por serviço, e os privados também podem ser clonados.

O Persisty mostra o repositório, o branch padrão e a conta que vai clonar. O destino sugerido fica ao lado do último workspace do projeto. Num projeto sem workspaces, é a **Pasta padrão para clones**, que vem como `~/Documents/GitHub` e muda em **Configurações › Integrações**. Se a pasta de destino já tiver esse repositório, ele é só adicionado; se tiver outra coisa, mude o nome ou o lugar.

**Clonar e adicionar** baixa o repositório e mostra o andamento, fase por fase. **Cancelar**, ou fechar a janela, interrompe o clone. No fim, a pasta vira um workspace do projeto. Clonar usa o git do computador; sem ele, o Persisty pede para instalar o git.

## Mudar a ordem

Projetos, workspaces e abas de sessão ficam na ordem em que você os deixa. Arraste para mudar, ou use o teclado com o item em foco: <kbd>⌥</kbd> <kbd>↑</kbd> e <kbd>⌥</kbd> <kbd>↓</kbd> na barra de projetos, <kbd>⌥</kbd> <kbd>←</kbd> e <kbd>⌥</kbd> <kbd>→</kbd> nos cartões de workspace e nas abas. O botão direito numa aba também tem **Mover para a esquerda** e **Mover para a direita**. Durante o arraste, <kbd>Esc</kbd> devolve o item ao lugar. O cartão **Avulsas** fica sempre por último.
