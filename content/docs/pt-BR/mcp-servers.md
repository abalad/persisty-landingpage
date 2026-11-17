---
title: Servidores MCP
description: Instale servidores MCP de outros serviços, como GitHub, Sentry ou Supabase, e escolha quais as sessões do Claude Code de cada projeto recebem.
group: integrations
order: 3
---

Um servidor MCP dá ao agente ferramentas de outro serviço, como as issues do GitHub, os erros do Sentry ou as tabelas do Supabase. No Persisty, você instala o servidor uma vez, em [**Configurações › Servidores MCP**](/docs/settings#servidores-mcp), e liga nos projetos que devem recebê-lo. Os servidores valem só para o Claude Code.

## Instalar da seleção

Em **Disponíveis** há uma seleção de 16 servidores, cada um publicado pela própria empresa, com busca e filtro por categoria. Cada cartão diz como o servidor conecta, como **Login no navegador**, **Token** ou **Usa sua conta do GitHub**.

**Instalar** abre a janela do servidor, com quem o publicou, o **Nome desta instalação**, **O que vai rodar** e os campos de **Configuração**, com os obrigatórios marcados. Quando o servidor tem as duas formas, **Como conecta** escolhe entre **Remoto, login no navegador** e **No computador, com token**. O do GitHub pede a **Conta do GitHub**, uma das conectadas em [Integrações](/docs/forges).

**Testar** experimenta antes de instalar: um servidor no computador é aberto e lista as ferramentas, e um remoto responde ao pedido de conexão. Um servidor que pede login no navegador faz esse login na primeira sessão que o usar.

## Buscar no registro oficial

A partir de duas letras, a busca também consulta o registro oficial de MCP, `registry.modelcontextprotocol.io`. O que ele acha aparece em **No registro oficial**: os servidores publicados pela própria empresa com ✔, os outros com o nome do autor. Ao instalar um sem ✔, a janela avisa que o Persisty não revisou o servidor. Os pacotes npm, PyPI e OCI rodam com o `npx`, o `uvx` e o `docker`; outros formatos ainda não podem ser instalados, e o cartão diz por quê.

## Adicionar manualmente

Para um servidor fora da lista, como o da sua empresa ou um de um README, use **Adicionar manualmente**. Dê um **Nome** e escolha **Como ele roda**: **Comando no computador**, com o comando, os argumentos e as **Variáveis de ambiente**, ou **Endereço remoto (URL)**, com os **Cabeçalhos**. Marque **Secreta** nos valores que são tokens. O endereço precisa começar com `https://`; `http://` só vale para `localhost`.

Também dá para colar a configuração: o JSON que o README manda pôr no Claude Code, ou o comando `claude mcp add` (ou `add-json`). O Persisty preenche o formulário, e vários servidores colados entram um depois do outro. **Testar conexão** experimenta, e **Adicionar** instala.

## Ligar num projeto

Instalar não liga o servidor em nenhum projeto. Em [**Ajustes do projeto › Servidores MCP**](/docs/projects-and-workspaces#ajustes-do-projeto), cada servidor instalado tem um interruptor, desligado por padrão. Logo depois de instalar, **Ligar em**, com o nome do projeto em foco, leva direto a essa tela.

A escolha vale para as sessões do Claude Code que começarem ou reiniciarem depois. O `claude` digitado num terminal do Persisty também recebe os servidores do projeto, a não ser que você passe o seu próprio `--mcp-config`.

## Servidores instalados

Em **Instalados**, cada cartão mostra em que projetos o servidor está ligado e o estado dele, como **Pronto**, **Falta o token**, **Falta a conta do GitHub** ou **Precisa do npx**. Só os prontos, e os que mostram **Login no navegador na 1ª sessão**, vão para as sessões. **Configurar** muda a instalação, e **Colocar token** aparece quando falta o token. **Instalar outra vez** cria uma segunda instalação com outro nome, como um banco de dados por projeto. **Remover** tira o servidor de todos os projetos e apaga os segredos dele.

Os tokens ficam no cofre de senhas do sistema, o Keychain no Mac, e só vão para o arquivo de configuração da sessão enquanto o agente roda; o arquivo é apagado quando a sessão para. O Persisty não lê nem altera o seu `~/.claude.json` nem o `.mcp.json`, e os nomes que ele usa terminam em `-persisty`, para não esconder um servidor seu de mesmo nome.

## Plano e limites

Os servidores MCP são do plano grátis. O Persisty só os passa às sessões do Claude Code; o Codex CLI e os terminais comuns não os recebem. Um servidor que roda no computador precisa do programa que o executa, como o `npx`, o `uvx` ou o `docker`, que baixa o pacote do registro dele. Quando um servidor recebe o segredo na linha de comando, a janela avisa que outros programas do computador podem vê-lo enquanto ele roda.

Com um servidor ligado, quem fala com ele é o Claude Code, não o Persisty: o que o agente pede ou manda por uma ferramenta vai para aquele serviço, com o token que você deu ou o da sua conta do GitHub. O próprio Persisty faz só três chamadas, listadas em [Privacidade e rede](/docs/privacy-and-network): a busca no registro, com o que você digita; os ícones, do endereço que cada servidor declara; e o **Testar** de um servidor remoto, com o cabeçalho secreto, se houver.

As ferramentas do próprio Persisty para os agentes ficam em outra tela; veja [Agentes que leem o Persisty](/docs/agent-access).
