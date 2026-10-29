---
title: Primeiros passos
description: O que é o Persisty, como instalar e atualizar e como abrir o primeiro projeto com uma sessão de agente.
group: start
order: 1
---

O Persisty é um app de desktop para quem mantém vários produtos de software e trabalha com agentes de IA no terminal, como o Claude Code e o Codex. Ele organiza os terminais por projeto, acompanha o estado e a quota de cada agente e traz as sessões de volta depois de um travamento.

Nada do que você faz no Persisty depende de conta ou de internet. A conta só existe para os planos pagos.

## Instalar e atualizar

1. Baixe a versão do seu sistema na [página de download](/download).
2. Instale:
   - **Mac**: abra o DMG e arraste o Persisty para a pasta Aplicativos. O app é assinado e notarizado pela Apple.
   - **Windows** (prévia, sem assinatura): rode o instalador. Se o SmartScreen avisar, clique em **Mais informações › Executar assim mesmo**.
   - **Linux** (prévia, sem assinatura): use o AppImage ou o pacote `.deb`. O AppImage precisa de permissão de execução: `chmod +x Persisty_*.AppImage`.
3. Abra o Persisty. Tudo de que ele precisa já vem dentro do app; não é preciso instalar nenhuma outra dependência.
4. Para usar agentes, tenha o [Claude Code](https://docs.claude.com/en/docs/claude-code) instalado e com login feito. Terminais comuns funcionam sem ele.

### Versões novas

O app procura versões novas ao abrir e a cada 6 horas. Quando sai uma, aparece um aviso com o número dela, um link para as novidades e **Instalar e reiniciar**. Fechar o aviso esconde só aquela versão. Em **Configurações › Sobre** você procura na hora ou desliga a procura automática.

- **Mac**: instalar não pergunta nada. O app baixa, instala e reinicia, e as sessões abertas voltam com ele.
- **Windows e Linux**: se houver sessões abertas, o app avisa antes que elas podem ser encerradas, e você instala agora ou deixa para depois.
- **Linux pelo `.deb`**: o app não instala sozinho. O aviso leva à página de download para você baixar o pacote novo.

## Criar o primeiro projeto

Um **projeto** é um produto ou cliente seu, não uma pasta. Dentro dele ficam os **workspaces**: as pastas e repositórios daquele produto.

1. Clique no **+** da barra de projetos, à esquerda, e dê um nome.
2. Arraste uma pasta do Finder para a área indicada, ou clique e escolha. Ela vira o primeiro workspace. Se for um repositório git, o Persisty mostra o branch e as alterações.
3. Repita para os outros repositórios do mesmo produto (API, app, site).

## Abrir uma sessão

Com o workspace selecionado, aperte <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> e escolha o que abrir:

- **Claude Code** ou **Codex**, para uma sessão de agente;
- **Terminal**, para um shell comum (servidor de desenvolvimento, testes, o que quiser).

A sessão aparece como aba no topo e como linha no cartão do workspace, embaixo. O estado do agente aparece na aba: trabalhando, aguardando você, pedindo permissão ou parado.

## Próximos passos

- [Projetos e workspaces](/docs/projects-and-workspaces): como o Persisty organiza o trabalho.
- [Sessões e recuperação](/docs/sessions-and-recovery): o que acontece depois de um travamento ou de um reinício.
- [Agentes e estados](/docs/agents): como saber qual agente precisa de você.
