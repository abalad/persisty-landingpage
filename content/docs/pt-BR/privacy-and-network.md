---
title: Privacidade e registro de rede
description: O que fica na sua máquina, o que vai para fora, e como conferir cada chamada de rede do Persisty.
group: account
order: 2
---

O Persisty é local: projetos, sessões, histórico, notas e uso ficam num banco SQLite na sua máquina. Não há telemetria.

## O que nunca sai

Código, saída de terminal e prompts nunca saem da sua máquina pelo Persisty, a não ser os commits que você mesmo manda enviar ao remoto do seu repositório git. Os agentes falam com os provedores deles como fariam sem o Persisty.

## O que sai, e por quê

O app só fala com fora para:

- ler a quota do Claude Code (`api.anthropic.com`), com a credencial que o Claude Code já guarda; o token não é gravado nem registrado;
- entrar na conta do Persisty Cloud e renovar a licença;
- falar com o GitHub, o GitLab ou o Bitbucket, nas integrações que você conectar;
- ler as issues do Linear, do Jira, do ClickUp e do GitHub, nas integrações de tarefas que você conectar; ao **Concluir**, quando você clica em **Enviar**, escrever na issue o comentário que você revisou, se não estiver vazio, e o novo status;
- clonar, buscar, puxar e enviar commits no remoto dos seus repositórios git (a busca também acontece sozinha ao abrir e a cada 5 minutos com o app na tela, para mostrar o que falta puxar e enviar);
- baixar um servidor de linguagem quando o editor precisa de um que não está no projeto nem no sistema: o Node de `nodejs.org`, os pacotes do npm de `registry.npmjs.org` (ou do registro do seu `.npmrc`) e o rust-analyzer do GitHub;
- baixar o modelo de voz do ditado de `huggingface.co`, quando você clica em **Baixar** em **Configurações › Voz**;
- em **Configurações › Servidores MCP**, buscar no registro oficial de MCP (`registry.modelcontextprotocol.io`) o nome que você digita e baixar os ícones dos servidores; em **Testar**, pedir a um servidor remoto que inicie a conexão, com as credenciais que você deu a ele;
- procurar versões novas no GitHub, ao abrir, a cada 6 horas e quando você pede, e baixar a atualização quando você clica em **Instalar e reiniciar**. Dá para desligar a procura automática em **Configurações › Sobre**.

## Registro de rede

Em **Configurações › Privacidade e rede**, cada chamada que o app fez desde que abriu aparece com destino, motivo, bytes enviados e recebidos, resultado e hora. Clonar, buscar, puxar e enviar commits aparecem como `GIT`, com 0 bytes: quem transfere é o próprio git, e o app não mede. Cabeçalhos, corpo e parâmetros nunca são mostrados nem guardados. O registro guarda as 500 chamadas mais recentes e zera ao fechar o app.

Mais detalhes em [Segurança](/security) e na [Política de privacidade](/privacy).
