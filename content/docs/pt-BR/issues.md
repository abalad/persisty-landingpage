---
title: "Issues: Linear, Jira, ClickUp, Azure DevOps e GitHub"
description: Comece uma sessão a partir de uma issue e, no fim, comente nela e mude o status sem sair do Persisty.
group: integrations
order: 1
---

O Persisty lê as issues do Linear, do Jira, do ClickUp, do GitHub e os work items do Azure DevOps. Você escolhe uma ao criar a sessão, o agente recebe o pedido com o título, o link e a descrição, e no fim **Concluir** comenta na issue e muda o status dela.

## Conectar o serviço

As issues do GitHub vêm da conta que você conectou para clonar repositórios; veja [GitHub, GitLab e Bitbucket](/docs/forges). Linear, Jira, ClickUp e Azure DevOps se conectam com um token, em [**Configurações › Integrações**](/docs/settings#integrações): abra o serviço, clique em **Conectar conta** e siga os passos da página.

No Linear, crie uma chave pessoal em Security & access, na seção Personal API keys; **Abrir o Linear** leva até lá. No Jira, informe o **Endereço do Jira**, como `empresa.atlassian.net`, crie um token de API na Atlassian com Create API token, sem escopos, e informe o **E-mail da conta Atlassian** que criou o token. No ClickUp, gere o token pessoal em Settings › Apps, em API Token; ele começa com `pk_`. No Azure DevOps, informe o **Endereço da organização**, como `dev.azure.com/empresa`; o endereço antigo `empresa.visualstudio.com` também vale, e no servidor da empresa (Azure DevOps Server) vai o endereço da coleção, como `ado.empresa.com/DefaultCollection`. **Abrir tokens do Azure DevOps** leva aos tokens pessoais: em New Token, escolha a organização e os escopos Work Items (Read & write) e Project and Team (Read). O token vence na data que você escolher ao criá-lo. Cole a chave ou o token e clique em **Conectar**. O Persisty confere o token com o serviço antes de guardá-lo no cofre de senhas do sistema.

Cada serviço aceita mais de uma conta, e cada uma aparece em **Contas** com **Desconectar**. Desconectar faz o Persisty esquecer o token, mas não o apaga no serviço: para revogá-lo, apague o token lá, ou, no ClickUp, gere outro.

## Ligar ao projeto

Cada projeto tira as issues de um serviço só. Clique com o botão direito no projeto, abra [**Ajustes do projeto › Tarefas**](/docs/projects-and-workspaces#ajustes-do-projeto) e clique em **Ligar um serviço**. Escolha a **Conta** e de onde vêm as issues: o **Repositório** no GitHub, o **Time** no Linear, o **Projeto** no Jira, a **Lista** no ClickUp ou o **Projeto** no Azure DevOps. No GitHub, os repositórios dos workspaces do projeto vêm primeiro, marcados com "workspace deste projeto", e, se houver algum, o primeiro já vem escolhido. **Ligar** salva.

Depois, **Trocar** muda a conta ou o escopo, e **Desligar** desfaz o vínculo. Sem nenhuma conta conectada, a seção mostra **Abrir Integrações**.

## Começar de uma issue

![Na Nova sessão, Escolher issue lista as issues do Linear; a ENG-123 escolhida dá nome à sessão e preenche o Pedido ao agente, e Criar e abrir abre a sessão, com a chave e Concluir no cabeçalho.](/docs-media/issues/issue.mp4)

Na janela [**Nova sessão**](/docs/sessions#nova-sessão) (<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd>), o grupo **Issue** tem **Começar de uma issue**. **Escolher issue** lista as issues abertas do que você ligou ao projeto, as atualizadas mais recentemente primeiro. **Minhas**, o padrão, mostra só as atribuídas a você, e **Todas abertas** mostra todas. A busca filtra por chave ou título o que já chegou, **Carregar mais** traz a próxima página, e **Atualizar** busca a lista de novo. Num projeto ainda sem serviço, **Ligar um serviço** abre a seção **Tarefas** ali mesmo.

A issue escolhida dá nome à sessão, como `ENG-123 Ajustar o login`, e preenche o **Pedido ao agente** com "Resolva a issue ENG-123: Ajustar o login", o link e a descrição. Edite o pedido se quiser: ele entra como o primeiro pedido, assim que o agente estiver pronto. Num **Terminal**, não há pedido, e a issue fica só vinculada à sessão. Antes de criar a sessão, **Trocar** escolhe outra issue, e **Tirar a issue** desfaz a escolha.

Com a **Pasta própria (worktree)** ligada, o **Branch novo** também vem da issue: o nome que o Linear sugere ou, nos outros serviços, a chave e o título em minúsculas, sem acentos e ligados por hífen, como `eng-123-ajustar-o-login`, cortado numa palavra inteira até 60 caracteres. A pasta própria é do Pro; veja [Pasta própria](/docs/worktrees).

## Concluir

![Na sessão da issue ENG-123, Concluir abre a janela de conclusão, com o comentário já escrito; o Novo status passa a In Review, e Enviar comenta na issue e muda o status.](/docs-media/issues/concluir.mp4)

A sessão aberta de uma issue mostra a chave no cabeçalho; clicar nela abre a issue no navegador. Ao lado, **Concluir** abre a janela de conclusão. O **Comentário** já vem escrito, com o agente e o branch atual da pasta, como "Feito com o Claude Code, pelo Persisty." e "Branch: eng-123-ajustar-o-login". Numa sessão de **Terminal**, a primeira linha é só "Feito com o Persisty." Mude o texto à vontade; vazio, nada é comentado.

**Novo status** lista os estados do time no Linear, as transições que a issue oferece agora no Jira, os status da lista no ClickUp e, no Azure DevOps, os estados do tipo do work item. No GitHub, as opções são **Fechar** e **Manter aberta**. O padrão é **Manter como está**, e o status que você enviar vem escolhido na próxima issue do mesmo projeto.

Nada vai para o serviço antes de você clicar em **Enviar**. A janela diz o que deu certo e o que falhou, e **Tentar de novo** manda só a parte que falhou: o comentário nunca sai duas vezes.

## Plano e limites

As integrações de tarefas são do plano grátis. Elas listam só issues abertas, e cada projeto liga um serviço por vez. Do Jira, vale o Jira Cloud. No Azure DevOps, o comentário entra na discussão do work item. A integração com o Azure DevOps chegou na 0.16.0 e ainda está sendo conferida com uma organização real. As issues do GitLab e do Bitbucket não são lidas.

O primeiro pedido sai quando o Persisty sabe que o agente está pronto. No [Codex CLI](/docs/agents#codex-cli), o Persisty não recebe o estado do agente por padrão, e o pedido fica esperando na [fila](/docs/queue) da sessão.

O título, o link e a descrição de uma issue só vão para o agente quando você começa uma sessão a partir dela, no pedido que você pode editar antes. Ler as issues, comentar e mudar o status são chamadas ao serviço, com o seu token, e cada uma aparece em [Privacidade e rede](/docs/privacy-and-network).
