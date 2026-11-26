---
title: Alterações e commits
description: O painel Alterações da sessão, para preparar, ver o diff, fazer o commit, sincronizar com o remoto, trocar de branch, guardar alterações e resolver conflitos.
group: code
order: 8
---

O painel **Alterações** é o Git da pasta da sessão, como o controle de versão de uma IDE. Ele abre pelo ícone **Alterações**, na barra de ferramentas da borda direita da sessão, ou com <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd>. O ícone mostra quantos arquivos mudaram, também com o painel fechado.

## Preparar e descartar

A lista mostra os arquivos em **Preparadas** e em **Alterações**, com a letra de estado do git: M (modificado), A (novo), D (apagado), R (renomeado), U (não rastreado) ou C (em conflito). O **+** de um arquivo o prepara, e o **−** o tira da preparação; no título de cada grupo, **Preparar tudo** e **Remover tudo da preparação** fazem o mesmo com todos.

O **↺** descarta as alterações de um arquivo, e **Descartar todas as alterações**, no título do grupo, as de todos. O Persisty pergunta antes e grava um [ponto de restauração](/docs/restore-points#antes-de-descartar), como no [editor](/docs/git-in-the-editor#descartar-alterações). Um arquivo novo descartado é apagado.

O botão direito num arquivo, ou <kbd>⇧</kbd> <kbd>F10</kbd> com ele em foco, abre **Abrir arquivo**, **Preparar** ou **Remover da preparação**, **Descartar alterações**, **Copiar caminho**, **Copiar caminho relativo** e **Mostrar no Finder**. Num arquivo não rastreado, o menu também tem **Ignorar este arquivo** (ou **Ignorar esta pasta**) e **Ignorar tudo chamado** com o nome dele; o Persisty escreve a regra no `.gitignore` da raiz do repositório.

## Ver o diff

Um clique num arquivo mostra o diff ao lado da lista, no texto atual, com as linhas removidas em vermelho e as adicionadas em verde. Num arquivo ainda não preparado, **Abrir no editor** leva ao arquivo. O mesmo vale para os arquivos de um commit do histórico e de um grupo de alterações guardadas.

## Fazer o commit

![No painel Alterações, um clique em App.tsx mostra o diff; o arquivo é preparado, a mensagem é escrita na caixa, e Command e Enter fazem o commit, que aparece no topo do Histórico.](/docs-media/changes/commit.mp4)

Escreva a mensagem na caixa e faça o commit com <kbd>⌘</kbd> <kbd>↵</kbd> ou com o botão **Commit**. Sem nada preparado, o botão vira **Commit de tudo**, que prepara todas as alterações e faz o commit.

**Mais ações de commit**, na seta ao lado do botão, tem **Commit e enviar**, **Corrigir último commit**, que junta o que está preparado ao último commit (com a mensagem vazia, mantém a dele), e **Desfazer último commit**, que tira o commit e devolve as alterações, preparadas, com a mensagem na caixa. Se esse commit já foi enviado, o Persisty avisa antes que o próximo envio vai precisar ser forçado.

## Histórico

**Histórico** lista os últimos 30 commits da branch, cada um com a mensagem, o hash curto, o autor e há quanto tempo; os que ainda não foram enviados têm o ponto preenchido e a dica **Não enviado**. Um clique abre os arquivos do commit, e um clique num arquivo mostra o diff dele. O botão direito num commit, ou o **⋯** ao lado, tem **Copiar SHA**, **Copiar mensagem**, **Criar branch a partir daqui** e **Reverter commit**; no mais recente, também **Desfazer último commit**.

**Mostrar o commit**, no cartão do [autor da linha](/docs/git-in-the-editor#autor-da-linha), abre o commit aqui, mesmo quando ele é mais antigo que os 30 da lista.

## Sincronizar com o remoto

![A branch main está 2 commits atrás e 1 à frente do remoto; a seta ↓ pergunta como juntar, Rebase: meus commits por cima traz os commits novos, e a seta ↑ envia o que falta, até o painel dizer Em dia.](/docs-media/changes/git.mp4)

Numa branch com remoto, o topo do painel mostra o nome dela e como está em relação ao remoto: **Em dia**, ↓ com os commits a puxar e ↑ com os commits a enviar. Um clique na seta puxa ou envia. Se os dois lados têm commits novos, o Persisty pergunta como juntar: **Merge: um commit de junção** ou **Rebase: meus commits por cima**. Uma branch que ainda não está no remoto mostra **Publicar branch**, que envia a branch e passa a acompanhá-la.

**Buscar do remoto** traz as novidades na hora. **Mais ações de sincronização** tem **Puxar com rebase**, **Puxar com merge** e **Enviar forçado**, que pergunta antes e só substitui o remoto se ninguém tiver enviado nada desde a última busca.

O cabeçalho da sessão mostra as mesmas setas ao lado do nome da branch. Com o app à vista, o Persisty busca as novidades do remoto sozinho a cada 5 minutos, a não ser que alguém tenha buscado há menos de 3.

## Branches

![Um clique na branch, no cabeçalho da sessão, abre a lista de branches, com o aviso das alterações que vão junto; digitar feat/pagamento-pix oferece Criar branch, e Enter troca o cabeçalho para a branch nova.](/docs-media/changes/branch.mp4)

Um clique na branch, no cabeçalho da sessão, abre **Buscar ou criar branch**: as **Locais**, as **Remotos** e, quando o nome digitado não existe, **Criar branch** com ele. A lista avisa quando há alterações não commitadas que vão junto e quando o agente está trabalhando naquela pasta. O branch do cabeçalho acompanha trocas feitas pelo terminal.

No painel, o grupo **Branches** lista as locais, com a atual marcada e as setas em relação ao remoto, e as que estão **Só no remoto**. Um clique troca de branch, e **Nova branch** cria uma a partir de onde você está. O botão direito numa branch tem **Trocar para esta**, **Mesclar em** a branch atual, **Renomear** e **Excluir**. Excluir pergunta antes; se a branch tem commits que não estão em outra, o Persisty pergunta de novo, com **Excluir mesmo assim**. A branch excluída continua no remoto, se estiver lá.

## Guardar alterações

O grupo **Guardadas** é o stash do git. **Guardar alterações** guarda todas as alterações, arquivos novos inclusive, com um nome se você quiser, e deixa a pasta limpa. Um clique num item mostra os arquivos dele. O botão direito tem **Aplicar**, **Aplicar e remover** e **Descartar**, que pergunta antes.

## Conflitos

Durante um merge, rebase, cherry-pick ou reversão, o painel mostra a operação, como **Merge em andamento**, e os arquivos em **Conflitos**. Em cada arquivo, escolha **Aceitar a versão atual** ou **Aceitar a versão que chega**, ou edite e use **Marcar como resolvido**. Sem conflitos, **Continuar** conclui a operação, e **Abortar** pergunta antes e volta tudo a como estava antes de começar.

## Teclas

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> abre e fecha o painel, <kbd>⌘</kbd> <kbd>↵</kbd> faz o commit e <kbd>⇧</kbd> <kbd>F10</kbd> abre o menu do arquivo em foco. Com o cursor no código, nos mapas WebStorm (macOS) e VS Code, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> é **Localizar anterior** depois de uma busca no arquivo; ali, use o ícone **Alterações**. No Windows e no Linux, que estão em prévia, use <kbd>Ctrl</kbd> no lugar de <kbd>⌘</kbd>.

## Plano e limites

O painel **Alterações** é do plano grátis, inclusive o ponto de restauração antes de descartar.

Ele funciona em pastas que são repositórios git; fora de um, diz "Esta pasta não está num repositório git." O Persisty usa as credenciais que o git já tem no computador, como o Keychain e o agente SSH, e nunca pede senha no terminal: se o git precisar perguntar, a recusa aparece como o git escreveu. Com alterações demais, a lista avisa que é parcial.

O painel **Alterações**, o painel Git e o editor leem o estado do git sem segurar o índice. Desde a 0.16.0, um commit feito no terminal, seu ou do agente, não falha com `index.lock exists` por causa do Persisty.
