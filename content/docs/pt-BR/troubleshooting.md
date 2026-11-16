---
title: Problemas e limitações
description: Situações conhecidas, o que fazer em cada uma e o que o Persisty ainda não faz.
group: reference
order: 2
---

## O estado do agente aparece como desconhecido

O Claude Code mostra o aviso de confiança da pasta antes de qualquer hook. Responda no terminal e o estado aparece.

O Persisty ainda não lê o estado do Codex. Ele não escreve o `~/.codex/hooks.json` nem mostra o que pôr nele, então a sessão do Codex fica como **Parado**, o cabeçalho da fila diz **Estado do agente desconhecido** e a fila não envia pedidos para ela.

## Digitei `claude` num terminal e a sessão não virou agente

Os terminais do Persisty põem na frente do `PATH` um `claude` do próprio app, que abre o seu Claude Code com os hooks do Persisty. O app atualiza esse `claude` a cada abertura, também nos terminais que continuaram abertos. A sessão vira agente no primeiro hook, que só chega depois do aviso de confiança da pasta: responda a ele antes.

Se ainda assim nada mudar, o `claude` que você digitou não passou pelo do Persisty. Isso acontece com um alias ou uma função com esse nome na configuração do seu shell, com o caminho completo do programa, ou com um shell que não é zsh nem bash e muda a ordem do `PATH` ao abrir. `type claude` mostra qual está valendo. Só o Claude Code é adotado assim; um `codex` digitado à mão deixa a sessão como terminal.

## A quota aparece como indisponível

O Persisty lê a quota com a credencial que o Claude Code guarda. Se ela venceu, as barras usam os números da própria sessão até o Claude Code renová-la. Contas conectadas pelo Persisty precisam do item que o Claude Code cria no Keychain ao concluir o login.

## A fila não enviou o pedido

A fila só envia com o Persisty aberto e com o agente esperando o próximo pedido. Pedidos nunca vão durante um trabalho nem por cima de um pedido de permissão.

Se o cabeçalho da sessão diz "Sem quota", a fila está esperando a conta renovar. Se diz "O último turno falhou", ela espera até um turno terminar bem. Nos dois casos, **Soltar a fila agora**, no topo da fila, deixa os pedidos andarem.

Os pedidos saem pela ordem, e os de baixo mostram "esperando o nº 1". Se o nº 1 foi marcado para **A partir de um horário** ou **Quando a janela de 5 h renovar**, a fila toda espera essa hora. Ela também espera enquanto você edita um pedido ("Editando o nº 2: a fila espera"; depois de 15 minutos sem mexer, volta a andar) e enquanto uma troca de conta aguarda (o rodapé diz **troca ao terminar a resposta**). Numa sessão de projeto fixado numa conta, nada sai enquanto a sessão roda em outra conta, e **Soltar a fila agora** não muda isso. Confira também se a fila não está pausada.

## O que o Persisty ainda não faz

- Trocar a conta de uma sessão no meio de um turno. A troca, pelo rodízio ou à mão pelo rodapé, espera a resposta terminar e também o que ela deixou rodando em segundo plano, como subagentes e comandos.
- Integrações com ferramentas de analytics.
- Divisão do terminal em painéis lado a lado.
- Instalador assinado no Windows, e Windows e Linux testados em máquinas reais.
