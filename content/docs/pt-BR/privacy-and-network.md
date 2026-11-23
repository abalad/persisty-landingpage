---
title: Privacidade e rede
description: O que fica na sua máquina, o que vai para fora e por quê, e como conferir cada chamada de rede do Persisty.
group: account
order: 3
---

O Persisty é local: [projetos](/docs/projects-and-workspaces), [sessões](/docs/sessions), histórico, [notas](/docs/notes) e [uso](/docs/usage-and-quota) ficam num banco SQLite na sua máquina. Não há telemetria. Em [**Configurações › Privacidade e rede**](/docs/settings#privacidade-e-rede), você confere isso e vê cada chamada que o app fez para fora.

## Privacidade

No topo da tela, o grupo **Privacidade** diz que a **Telemetria** está desligada, que os **Dados das sessões** ficam nesta máquina e que as **Integrações externas** são opcionais.

Código, saída de terminal e prompts nunca saem da sua máquina pelo Persisty, a não ser os commits que você mesmo manda enviar ao remoto do seu repositório git. Os agentes falam com os provedores deles, e com os [servidores MCP](/docs/mcp-servers) que você ligar ao projeto, como fariam sem o Persisty. O [ditado por voz](/docs/voice) roda no computador, e o áudio não sai dele.

O site persisty.app usa o Google Analytics só depois que você clica em **Aceitar** no aviso de cookies. Isso vale para o site, não para o app. Mais detalhes em [Segurança](/security) e na [Política de privacidade](/privacy).

## O que sai, e por quê

O app só fala com fora para:

- ler a quota do Claude Code (`api.anthropic.com`), com a credencial que o Claude Code já guarda; o token não é gravado nem registrado;
- entrar na conta do Persisty Cloud e renovar a [licença](/docs/account-and-license#licença), no servidor do Persisty Cloud, um endereço `supabase.co`;
- falar com o GitHub, o GitLab ou o Bitbucket, nas [contas que você conectar](/docs/forges);
- ler as [issues](/docs/issues) do Linear, do Jira, do ClickUp e do GitHub, nas integrações de tarefas que você conectar; ao **Concluir**, quando você clica em **Enviar**, escrever na issue o comentário que você revisou, se não estiver vazio, e o novo status;
- clonar, buscar, puxar e enviar commits no remoto dos seus repositórios git (a busca também acontece sozinha ao abrir e a cada 5 minutos com o app na tela, para mostrar o que falta puxar e enviar);
- baixar um [servidor de linguagem](/docs/editor#o-servidor-da-linguagem) quando o editor precisa de um que não está no projeto nem no sistema: o Node de `nodejs.org`, os pacotes do npm de `registry.npmjs.org` (ou do registro do seu `.npmrc`) e o rust-analyzer do GitHub;
- baixar o [modelo de voz](/docs/voice#modelo-de-voz) do ditado de `huggingface.co`, quando você clica em **Baixar** em **Configurações › Voz**;
- em **Configurações › Servidores MCP**, [buscar no registro oficial de MCP](/docs/mcp-servers#buscar-no-registro-oficial) (`registry.modelcontextprotocol.io`) o nome que você digita e baixar os ícones dos servidores; em **Testar**, pedir a um servidor remoto que inicie a conexão, com as credenciais que você deu a ele;
- [procurar versões novas](/docs/updates) no GitHub, ao abrir, a cada 6 horas e quando você pede, e baixar a atualização quando você clica em **Instalar e reiniciar**. Dá para desligar a procura automática em [**Configurações › Sobre**](/docs/settings#sobre).

Um recurso em prévia que você ligar pode fazer outras chamadas, e elas também aparecem no [registro de rede](#registro-de-rede).

## Registro de rede

![Em Configurações, Entrar e Continuar com e-mail pedem o código de acesso; em Privacidade e rede, a lista de chamadas de rede mostra esse pedido, um POST, com o destino, o motivo, os bytes enviados e recebidos, a hora e o resultado.](/docs-media/privacy-and-network/rede.mp4)

Embaixo, **Chamadas de rede desde que o app abriu** lista cada chamada com destino, motivo, bytes enviados e recebidos, resultado e hora. Clonar, buscar, puxar e enviar commits aparecem como `GIT`, com 0 bytes: quem transfere é o próprio git, e o app não mede. Uma chamada redirecionada, como a procura e o download de uma atualização, ganha uma linha para cada servidor por onde passou. Cabeçalhos, corpo e parâmetros nunca são mostrados nem guardados. A lista não se atualiza sozinha: **Atualizar** lê de novo.

## Permissões do macOS

No Mac, os programas que rodam nas sessões não usam as permissões de privacidade dadas ao Persisty, como microfone, pastas e acessibilidade: o macOS decide por eles e pergunta quando precisar. Por isso, a primeira sessão numa pasta protegida, como Documentos, Mesa ou Downloads, pode pedir acesso a ela.

Se você atualizou de uma versão anterior à 0.9.0, as sessões, inclusive as novas, continuam usando as permissões do Persisty até o Mac reiniciar.

## Plano e limites

Tudo nesta página vale em qualquer plano, sem conta. O registro guarda as 500 chamadas mais recentes e zera quando você fecha o app. A separação de permissões das sessões existe só no macOS.
