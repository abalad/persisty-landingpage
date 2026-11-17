---
title: Sessões e terminais
description: Abrir, nomear, fechar e trocar de sessão, o painel lateral com as ferramentas de cada uma e os links no terminal.
group: start
order: 3
---

Uma sessão é um terminal do Persisty: um shell comum ou um agente, como o Claude Code ou o Codex CLI. Ela abre num workspace, ou avulsa no projeto, numa pasta qualquer. Trocar de aba, de workspace ou de projeto não interrompe a sessão.

## Nova sessão

Há três jeitos de abrir uma sessão no workspace selecionado. <kbd>⌘</kbd> <kbd>N</kbd>, ou o **+** ao lado das abas, abre um terminal na hora. <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> abre direto o [agente padrão](/docs/agents#agente-padrão). <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd>, ou o **+** com <kbd>⌥</kbd> ou <kbd>⇧</kbd>, abre a janela **Nova sessão**, com o agente padrão já escolhido. No Windows e no Linux, use <kbd>Ctrl</kbd> no lugar de <kbd>⌘</kbd> em todas as teclas desta página.

Na janela, **Onde** é um workspace do projeto ou **Sessão avulsa**, que pede a **Pasta** onde o terminal abre. **O quê** é **Terminal**, **Claude Code** ou **Codex CLI**; um agente que não está no computador aparece como **não encontrado** e não pode ser escolhido. O **Nome** vem com o agente e o workspace, como `Claude Code · api`, e é o que a aba mostra. **Criar e abrir**, ou <kbd>↵</kbd>, abre a sessão, e <kbd>Esc</kbd> fecha a janela.

Em **Mais opções** ficam o **Modelo**, só no Claude Code (**Padrão** usa o do Claude); o **Comando inicial**, digitado quando o terminal abre, como `pnpm dev`; e **Ao reabrir o Persisty**, a regra explicada em [Quando relançar](/docs/sessions-and-recovery#quando-relançar). Conforme o caso, a janela também mostra a **Conta do Claude** ([Contas de IA e rodízio](/docs/ai-accounts)), **Começar de uma issue** e a **Pasta própria (worktree)**, que é do Pro.

Num workspace sem sessões, a tela mostra o caminho da pasta e uma lista curta: `terminal`, `claude`, `codex` e `opções`. As teclas <kbd>1</kbd>, <kbd>2</kbd> e <kbd>3</kbd> abrem os três primeiros, e `opções` abre a janela **Nova sessão**. Abaixo vêm as sessões dos outros workspaces do projeto, para ir direto a uma delas.

## Sessões e abas

As abas do topo são as sessões do workspace selecionado. Cada aba tem o ícone do agente, o nome e um ponto com o estado; passar o mouse mostra o estado em palavras (veja [Os estados](/docs/agents#os-estados)). Numa sessão do Claude Code, a aba mostra o nome da conversa enquanto a sessão tiver o nome que o Persisty deu. Um nome que você escolheu fica.

Para renomear, dê um clique duplo na aba ou use **Renomear** no botão direito. O mesmo menu tem **Mover para a esquerda**, **Mover para a direita**, **Abrir em** com o IDE padrão, quando há um, **Fechar** e **Fechar todas**. O **×** aparece sobre o ponto ao passar o mouse. Fechar pede confirmação, encerra o processo e remove a sessão; numa sessão com pasta própria, o Persisty pergunta antes o que fazer com a pasta.

<kbd>⌘</kbd> <kbd>←</kbd> e <kbd>⌘</kbd> <kbd>→</kbd> passam para a sessão anterior ou a próxima do workspace, fora do código; no editor, essas teclas andam na linha. <kbd>⌘</kbd> <kbd>K</kbd> encontra qualquer sessão dos projetos da barra pelo nome. Ao trocar de sessão, o que você digita vai para o terminal assim que ele aparece, mesmo antes de ele terminar de conectar, e nunca para o arquivo aberto no painel **Código**.

Cada sessão guarda o histórico do terminal, que volta quando o Persisty reanexa; veja [Histórico do terminal](/docs/sessions-and-recovery#histórico-do-terminal).

## Cabeçalho da sessão

Acima do terminal, o cabeçalho mostra o nome, o estado em palavras e o branch da pasta. O branch acompanha trocas feitas pelo terminal, e clicar nele abre um seletor com busca para trocar ou criar branches. Conforme a sessão, aparecem também o aviso de **Sem quota**, a marca `worktree` de uma pasta própria, o resultado da verificação ao terminar e a issue de origem.

À direita ficam as ações. **Parar** encerra o processo e mantém a sessão, que passa a mostrar **Sessão sem processo.** e **Tentar de novo**. **Renomear** troca o nome, **Histórico** lista as mudanças de estado da sessão, da mais nova para a mais antiga, e **Remover** encerra o processo e tira a sessão.

Na barra de baixo da janela ficam, da sessão em foco, o modelo, o gasto estimado, o contexto, as janelas de 5 h e 7 d, a pasta e o processo; veja [Uso, custo e quota](/docs/usage-and-quota).

## Ferramentas da sessão

Na borda direita de cada sessão fica uma barra fina com as ferramentas dela, em três grupos: **Código**, **Busca** e **Notas**; **Alterações**, **Pontos de restauração** e **Fila de pedidos**; e **Detalhes**. Um clique abre a ferramenta no painel lateral, e o mesmo clique fecha. O ícone de **Alterações** mostra quantos arquivos mudaram, e o da **Fila de pedidos**, nas sessões de agente, quantos pedidos esperam, também com o painel fechado. Passar o mouse mostra o nome, a contagem e o atalho.

**Detalhes** resume a sessão, o workspace e o projeto: o agente, o modelo, o custo estimado, o contexto usado, as janelas de 5 h e 7 d, o processo e a regra **Ao reabrir**; a pasta, o branch e as alterações, com **Remover do projeto**; e o gasto com IA no mês e as sessões ativas, com **Uso detalhado** e **Ajustes do projeto**. As outras ferramentas têm as suas páginas: [Editor](/docs/editor) para Código, Busca, Alterações e Notas, e [Recursos do Pro](/docs/pro) para a fila e os pontos de restauração.

As sessões, o painel e os links são do plano grátis. Na **Fila de pedidos**, escrever pedidos é do Pro; nos **Pontos de restauração**, gravar um ponto a cada pedido também.

## Painel lateral

<kbd>⌘</kbd> <kbd>&#92;</kbd> mostra ou esconde o painel, na última ferramenta usada, e **Recolher painel**, no canto dele, também fecha. Algumas ferramentas têm tecla própria: <kbd>⌘</kbd> <kbd>P</kbd> abre **Código** com a busca de arquivo pelo nome, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>F</kbd> abre a **Busca**, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>G</kbd> abre e fecha **Alterações**, e <kbd>⌘</kbd> <kbd>I</kbd> abre e fecha **Detalhes**. Dentro do código, as teclas do mapa do editor vêm primeiro; veja [Atalhos](/docs/shortcuts).

A divisória entre o terminal e o painel se arrasta. Com ela em foco, <kbd>←</kbd> e <kbd>→</kbd> mudam a largura de 5% em 5%, e <kbd>←</kbd> alarga o painel. O painel começa com 45% da largura e vai de 20% a 80%. Cada sessão guarda se o painel estava aberto, em que ferramenta e com que largura, também depois de reabrir o app. **Redefinir**, em **Configurações › Workspace › Tamanho dos painéis**, volta todas as sessões à divisão padrão.

## Links no terminal

Endereços que começam com `http://`, `https://` ou `www.` viram links. Com <kbd>⌘</kbd> pressionado, um clique abre o endereço no navegador; sem a tecla, o clique continua selecionando texto ou indo para o programa que roda ali. Passar o mouse sobre um link diz qual tecla usar.

Caminhos completos que existem no disco também viram links: os que começam com `/`, com `~/` ou, no Windows, com a letra do disco, como `C:\`. <kbd>⌘</kbd> + clique mostra o caminho no Finder: uma pasta abre, e um arquivo aparece selecionado na pasta dele. Um `:12` ou `:12:5` no fim, como numa mensagem de erro, fica fora do link. Caminhos relativos, como `src/main.ts`, não viram link.

No Windows e no Linux, a tecla é <kbd>Ctrl</kbd>, e o caminho abre no Explorador de Arquivos ou no gerenciador de arquivos.
