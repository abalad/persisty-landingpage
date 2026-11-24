---
title: GitHub, GitLab e Bitbucket
description: Conecte as suas contas para listar e clonar repositórios, inclusive os privados, e trazer as issues do GitHub.
group: integrations
order: 2
---

Em [**Configurações › Integrações**](/docs/settings#integrações), você conecta contas do GitHub, do GitLab (o gitlab.com ou o da sua empresa) e do Bitbucket Cloud. Com uma conta conectada, [**Adicionar workspace**](/docs/projects-and-workspaces#adicionar-workspace) lista os seus repositórios e clona os privados.

## Conectar contas

A tela **Integrações** mostra primeiro as **Conectadas**, com a conta de cada uma, e depois as **Disponíveis**. Clique num serviço para abrir a página dele: **Conectar conta** faz a primeira conexão, e **Adicionar conta**, as seguintes. Cada serviço aceita várias contas, e cada conta mostra o endereço, se entrou **por código** ou **por token** e desde quando.

O Persisty guarda as contas e os tokens no cofre de senhas do sistema; no Mac, é o item `Persisty Integrations` do Keychain. **Desconectar** faz o Persisty esquecer a conta, mas não revoga o acesso no serviço. O link no pé de cada página leva aonde você revoga: os aplicativos autorizados no GitHub e no gitlab.com, ou os tokens na Atlassian. Num GitLab da empresa, esse link também abre o gitlab.com; apague o token na página de tokens do seu GitLab.

## GitHub

![Em Configurações › Integrações, a página do GitHub mostra que não há conta conectada; Conectar conta abre a janela com o código e espera a confirmação no navegador, e a conta @demo aparece conectada.](/docs-media/forges/integracoes.mp4)

**Conectar conta** abre **Conectar ao GitHub** com um código. Clique em **Abrir o GitHub**, entre na conta que quer conectar, confirme o código e autorize o Persisty. A janela espera a confirmação e fecha sozinha; o Persisty nunca vê a sua senha. O acesso pedido, `repo` e `read:org`, cobre os seus repositórios, inclusive os privados e os das suas organizações, e inclui escrita: o Persisty o usa para listar e clonar e, ao [concluir uma issue](/docs/issues#concluir), para comentar nela e fechá-la. Se os de uma organização não aparecem, ela precisa aprovar o Persisty.

## GitLab

**Onde fica sua conta?** oferece dois caminhos. Com **gitlab.com**, **Continuar no navegador** mostra um código para confirmar no gitlab.com, como no GitHub. Com **GitLab da empresa**, informe o **Endereço do GitLab**, como `gitlab.empresa.com`, e clique em **Criar token no GitLab**: a página abre com o nome e os escopos `read_api` e `read_repository` já marcados. Escolha a validade, crie o token, cole em **Cole o token** e clique em **Conectar**. O GitLab mostra o token uma vez só.

## Bitbucket

O Bitbucket Cloud conecta com um token de API da Atlassian. **Abrir tokens da Atlassian** leva à página; escolha Criar token de API com escopos, selecione o Bitbucket e marque `read:user` e `read:repository`. Volte ao Persisty, informe o **E-mail da conta Atlassian**, cole o token e clique em **Conectar**.

## O que as contas fazem

Em **Adicionar workspace**, com **Repositório remoto**, o campo vira **Link ou busca** e lista os repositórios das contas conectadas, com um filtro por serviço; o passo a passo está em [Clonar um repositório](/docs/projects-and-workspaces#clonar-um-repositório). Um link colado é consultado com as contas daquele serviço, uma a uma, até uma enxergar o repositório; sem conta daquele serviço, a consulta vai sem login, e só um repositório público aparece. Quem clona é o git, direto com o serviço: por HTTPS, com o token dessa conta, só no endereço dela; por SSH, com as suas próprias chaves.

A conta do GitHub também traz as issues dos seus repositórios, para [começar sessões a partir delas](/docs/issues), e serve ao servidor MCP do GitHub; veja [Servidores MCP](/docs/mcp-servers).

## Pasta dos clones

No fim da tela **Integrações**, **Clonagem › Pasta padrão para clones** diz para onde vai o clone quando o projeto ainda não tem workspaces. O padrão é `~/Documents/GitHub`, e **Escolher…** troca a pasta. Num projeto com workspaces, o clone vai ao lado deles. A mesma pasta vale para os três serviços.

## Abrir na forja

Na árvore de arquivos e na aba, o menu **Abrir em** tem **Abrir no GitHub** (ou no GitLab, ou no Bitbucket), que abre a página do arquivo, e **Copiar caminho** tem **Link no GitHub**, que copia o endereço dela. O cartão do [autor da linha](/docs/git-in-the-editor#autor-da-linha) tem **Abrir na forja**. Esses links saem do remoto git da pasta e não precisam de conta conectada. Funcionam no github.com, no gitlab.com e no bitbucket.org; num GitLab da empresa, o item fica indisponível e diz "sem remoto numa forja conhecida". Veja [Abrir em](/docs/files#abrir-em) e [Copiar caminho](/docs/files#copiar-caminho).

## Plano e limites

As integrações com GitHub, GitLab e Bitbucket são do plano grátis. O código no navegador vale para o GitHub e o gitlab.com; o GitLab da empresa e o Bitbucket entram por token. Do Bitbucket, só o Bitbucket Cloud. Das três, só o GitHub traz issues.

Cada chamada feita com as contas aparece em [Privacidade e rede](/docs/privacy-and-network); os clones aparecem como `GIT`.
