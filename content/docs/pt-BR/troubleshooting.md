---
title: Problemas e limitações
description: Situações conhecidas, o que fazer em cada uma, o que muda no Windows e no Linux e o que o Persisty ainda não faz.
group: reference
order: 3
---

Situações conhecidas e o que fazer em cada uma. No fim, o que muda no Windows e no Linux, que estão em prévia, e o que o Persisty ainda não faz.

## O estado do agente aparece como desconhecido

O Claude Code mostra o aviso de confiança da pasta antes de qualquer hook. Responda no terminal e o estado aparece; veja [Claude Code](/docs/agents#claude-code).

Por padrão, o Persisty não recebe o estado do Codex: ele não escreve o `~/.codex/hooks.json` nem mostra o que pôr nele. Então a sessão do Codex fica como **Parado**, o cabeçalho da [fila](/docs/queue) diz **Estado do agente desconhecido** e a fila não envia pedidos para ela; veja [Codex CLI](/docs/agents#codex-cli).

## Digitei `claude` num terminal e a sessão não virou agente

Os terminais do Persisty põem na frente do `PATH` um `claude` do próprio app, que abre o seu Claude Code com os hooks do Persisty. O app atualiza esse `claude` a cada abertura, também nos terminais que continuaram abertos. A sessão vira agente no primeiro hook, que só chega depois do aviso de confiança da pasta: responda a ele antes.

Se ainda assim nada mudar, o `claude` que você digitou não passou pelo do Persisty. Isso acontece com um alias ou uma função com esse nome na configuração do seu shell, com o caminho completo do programa, ou com um shell que não é zsh nem bash e muda a ordem do `PATH` ao abrir. `type claude` mostra qual está valendo. Só o Claude Code é adotado assim; por padrão, um `codex` digitado à mão deixa a sessão como terminal.

## A quota aparece como indisponível

O Persisty lê a [quota](/docs/usage-and-quota) com a credencial que o Claude Code guarda. Se ela venceu, as barras usam os números da própria sessão até o Claude Code renová-la. No Mac, as contas conectadas pelo Persisty precisam do item que o Claude Code cria no Keychain ao concluir o login; veja [Contas conectadas](/docs/ai-accounts#contas-conectadas).

## A fila não enviou o pedido

A fila só envia com o Persisty aberto e com o agente esperando o próximo pedido. Pedidos nunca vão durante um trabalho nem por cima de um pedido de permissão.

Se o cabeçalho da sessão diz "Sem quota", a fila está esperando a conta renovar. Se diz "O último turno falhou", ela espera até um turno terminar bem. Nos dois casos, **Soltar a fila agora**, no topo da fila, deixa os pedidos andarem; veja [Quando a quota acaba](/docs/ai-accounts#quando-a-quota-acaba).

Os pedidos saem pela ordem, e os de baixo mostram "esperando o nº 1". Se o nº 1 foi marcado para **A partir de um horário** ou **Quando a janela de 5 h renovar**, a fila toda espera essa hora. Ela também espera enquanto você edita um pedido ("Editando o nº 2: a fila espera"; depois de 15 minutos sem mexer, volta a andar) e enquanto uma troca de conta aguarda (o rodapé diz **troca ao terminar a resposta**). Numa sessão de projeto fixado numa conta, nada sai enquanto a sessão roda em outra conta, e **Soltar a fila agora** não muda isso. Confira também se a fila não está pausada. Mais em [Quando cada pedido sai](/docs/queue#quando-cada-pedido-sai).

## Windows e Linux

Windows e Linux estão em prévia: o app sai sem assinatura e ainda não foi testado em máquinas reais. Para as teclas, veja [Atalhos](/docs/shortcuts#windows-e-linux), e para atualizar, [Atualizações](/docs/updates#windows-e-linux).

No Windows, os agentes não precisam de um shell POSIX: os hooks do Claude Code chamam um executável nativo do Persisty.

No Windows e no Linux, a barra do topo começa na borda da janela, sem o espaço que o macOS reserva para os botões da janela, e os botões da barra de projetos e da busca ficam no canto. Se a sua mostra um espaço vazio à esquerda, atualize o Persisty: a correção veio na 0.9.2.

No Windows, com a tela em escala de 125% ou 150%, o terminal das sessões podia ficar com mais colunas do que a sessão sabia: linhas começavam do lado direito e pedaços de telas antigas não sumiam. Desde a 0.9.4, o terminal e a sessão ficam do mesmo tamanho; se o texto embaralhar, atualize o Persisty.

[**Adicionar workspace**](/docs/projects-and-workspaces#adicionar-workspace) aceita a pasta escolhida no Windows, como `C:\...`, e uma [**Nova sessão**](/docs/sessions#nova-sessão) num workspace do Windows abre normalmente desde a 0.9.1.

Ainda estão sendo conferidos em uso: no Windows e no Linux, colar arquivos de e para o sistema e o **Desfazer** da [exclusão](/docs/files#excluir); no Windows, o **Desfazer** da Lixeira e os avisos de arquivo em uso. O [mascote fora do app](/docs/mascot#fora-do-app) existe só no macOS.

## O que o Persisty ainda não faz

- Trocar a conta de uma sessão no meio de um turno. A troca, pelo rodízio ou à mão pelo rodapé, espera a resposta terminar e também o que ela deixou rodando em segundo plano, como subagentes e comandos; veja [Trocar a conta de uma sessão](/docs/ai-accounts#trocar-a-conta-de-uma-sessão).
- Integrações com ferramentas de analytics.
- Divisão do terminal em painéis lado a lado.
- No editor, renomear ou aplicar uma ação de código que crie, renomeie ou apague arquivos, e mover código para outro arquivo; veja [Usos, renomear e refatorar](/docs/usages-and-refactoring#plano-e-limites).
- Instalador assinado no Windows, e Windows e Linux testados em máquinas reais.
