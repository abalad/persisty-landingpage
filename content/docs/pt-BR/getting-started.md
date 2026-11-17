---
title: Primeiros passos
description: O que é o Persisty, como instalar e como abrir o primeiro projeto com uma sessão de agente.
group: start
order: 1
---

O Persisty é um app de desktop para quem mantém vários produtos de software e trabalha com agentes de IA no terminal, como o Claude Code e o Codex. Ele organiza os terminais por projeto, mostra o estado e a quota de cada agente e traz as sessões de volta depois de um travamento ou de um reinício.

O plano grátis não pede conta: a conta do Persisty só existe para os planos pagos. Tudo o que esta página mostra é do plano grátis.

## Instalar

1. Baixe a versão do seu sistema na [página de download](/download).
2. Instale:
   - **Mac**: abra o DMG e arraste o Persisty para a pasta Aplicativos. O app é assinado e notarizado pela Apple.
   - **Windows** (prévia, sem assinatura): rode o instalador. Se o SmartScreen avisar, clique em **Mais informações › Executar assim mesmo**.
   - **Linux** (prévia, sem assinatura): use o AppImage ou o pacote `.deb`. O AppImage precisa de permissão de execução: `chmod +x Persisty_*.AppImage`.
3. Abra o Persisty. O que ele usa para manter as sessões já vem dentro do app, sem nada para instalar à parte.
4. Para usar agentes, tenha o [Claude Code](https://docs.claude.com/en/docs/claude-code) instalado e com login feito. Terminais comuns funcionam sem ele. Os recursos de git, como o branch, as alterações e clonar um repositório, usam o git do computador.

Na primeira tela, **Nesta máquina** mostra o que o Persisty encontrou: **Sessões persistentes**, com **pronto** quando as sessões podem ser mantidas, e o Claude Code e o Codex CLI, com a versão de cada um ou **não encontrado**. Um agente instalado depois só aparece quando você reabre o Persisty.

### Versões novas

O app procura versões novas ao abrir e a cada 6 horas. Quando sai uma, aparece um aviso com o número dela, **Novidades** e **Instalar e reiniciar**; **Dispensar esta versão** esconde só aquela. No Mac, o app baixa, instala e reinicia sem perguntar nada, e as sessões abertas voltam com ele. No Windows e no Linux, se houver sessões abertas, ele avisa antes que elas podem ser encerradas. Pelo `.deb` do Linux, o aviso leva à página de download. Em **Configurações › Sobre**, você procura na hora ou desliga **Procurar atualizações automaticamente**.

## Criar o primeiro projeto

Um **projeto** é um produto ou cliente seu, não uma pasta. Dentro dele ficam os **workspaces**: as pastas e repositórios daquele produto.

1. Clique em **Criar primeiro projeto**, na tela que aparece na primeira vez que você abre o Persisty, ou no **+** da barra de projetos, à esquerda. Em **Novo projeto**, dê um nome e clique em **Criar projeto**.
2. O projeto abre vazio. Arraste uma pasta do Finder para **Adicionar workspace**, ou clique e escolha. Ela vira o primeiro workspace; se for um repositório git, o Persisty mostra o branch e as alterações. Para um repositório que ainda não está no computador, use **Clonar repositório**: ele baixa do GitHub, do GitLab, do Bitbucket ou de qualquer link git e adiciona como workspace.
3. Os outros repositórios do mesmo produto (API, app, site) entram pelo cartão **Adicionar workspace**, no fim da faixa de baixo, que também clona. A área de arrastar só aparece com o projeto vazio.

Na primeira tela, **Como funciona** abre um guia de um minuto sobre como o Persisty organiza o trabalho. Depois, o guia fica em **Primeiros passos**, embaixo na barra de projetos.

## Abrir uma sessão

Com o workspace selecionado, aperte <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd>. Em **Nova sessão**, escolha o que abrir e clique em **Criar e abrir**:

- **Claude Code** ou **Codex CLI**, para uma sessão de agente;
- **Terminal**, para um shell comum (servidor de desenvolvimento, testes, o que quiser).

O agente padrão já vem escolhido. Sem passar pela janela, <kbd>⌘</kbd> <kbd>N</kbd> abre um terminal e <kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> abre o agente padrão, os dois no workspace atual. Num workspace sem sessões, a tela lista `terminal`, `claude` e `codex`, e as teclas <kbd>1</kbd>, <kbd>2</kbd> e <kbd>3</kbd> abrem cada um. No Windows e no Linux, use <kbd>Ctrl</kbd> no lugar de <kbd>⌘</kbd>.

A sessão aparece como aba no topo e como linha no cartão do workspace, embaixo. A aba mostra o estado do agente num ponto colorido, com a palavra na dica, ao passar o mouse: **Trabalhando**, **Concluído**, **Permissão pendente**, **Parado** ou **Encerrado**. O cabeçalho da sessão e o cartão do workspace mostram a palavra direto.

## Próximos passos

- [Projetos e workspaces](/docs/projects-and-workspaces): como o Persisty organiza o trabalho.
- [Sessões e terminais](/docs/sessions): abrir, nomear e fechar sessões, e o painel lateral de cada uma.
- [Voltar depois de travar](/docs/sessions-and-recovery): o que acontece depois de um travamento ou de um reinício.
- [Agentes e estados](/docs/agents): como saber qual agente precisa de você.
- [O que o Persisty ainda não faz](/docs/troubleshooting#o-que-o-persisty-ainda-não-faz): os limites de hoje, para não procurar o que ainda não existe.
