---
title: Configurações, tela por tela
description: Cada aba de Configurações, na ordem do app, com as opções, o padrão de cada uma e a página que explica o recurso.
group: reference
order: 2
---

**Configurações** abre com <kbd>⌘</kbd> <kbd>,</kbd>. As abas ficam em cinco grupos: **Interface** (Aparência, Workspace, Notificações), **Código** (Editor, Terminal, Arquivos), **Agentes** (Agentes, Contas de IA, Voz), **Conexões** (Integrações, Servidores MCP, Uso de IA, Privacidade e rede) e **Persisty** (Atalhos, Conta, Sobre). Esta página segue essa ordem; o nome de uma opção leva à página que explica o recurso, quando há uma.

## Aparência

Tema, idioma e o mascote.

| Opção | Padrão |
| --- | --- |
| **Tema** | **Escuro**. Também **Claro** ou **Sistema**, que acompanha o modo claro ou escuro do computador |
| **Idioma** | **Português (Brasil)**. Também **English**. Muda os textos da interface |
| [**Mascote no terminal**](/docs/mascot#no-terminal) | ligado. Com o mascote fora do app, o do terminal some |
| [**Mascote fora do app**](/docs/mascot#fora-do-app) | desligado. Só no macOS |
| [**O mascote anda sobre as janelas**](/docs/mascot#fora-do-app) | ligado. Vale com o mascote fora do app |

## Workspace

Salvamento, IDE, divisão dos painéis e onde ficam as pastas próprias.

| Opção | Padrão |
| --- | --- |
| [**Salvar automaticamente**](/docs/editor#salvar-automaticamente) | desligado. Ligado, grava 1 s depois da última edição, nunca por cima de uma mudança feita fora do editor |
| [**IDE padrão**](/docs/files#abrir-em) | **Nenhum**. A lista traz as IDEs que o Persisty encontra no computador |
| [**Tamanho dos painéis**](/docs/sessions#painel-lateral) | **Redefinir** volta o editor e o terminal à divisão padrão em todas as sessões |
| [**Pasta dos worktrees**](/docs/worktrees#onde-ficam) | `~/.persist/worktrees`. **Escolher…** troca, e **Usar o padrão** volta; vale para worktrees novos |

## Notificações

O grupo **Quando um agente precisa de você**.

| Opção | Padrão |
| --- | --- |
| [**Silenciar com o Persisty em foco**](/docs/notifications#configurar) | ligado. Com a janela em foco, não envia a notificação do sistema |
| [**Alertas dentro do app**](/docs/notifications#configurar) | ligado |
| [**Tocar som**](/docs/notifications#configurar) | ligado |
| [**Enviar teste**](/docs/notifications#enviar-um-teste) | dispara o alerta, o som e a notificação do sistema de uma vez |

## Editor

Os grupos, na ordem: **Fonte**, **Comportamento**, **Atalhos**, **Markdown**, **Minimapa**, **Autor da linha (git blame)** e **Abas**. As mudanças valem na hora nos editores abertos.

| Opção | Padrão |
| --- | --- |
| **Família da fonte** | vazio, que usa a pilha padrão: SF Mono, Menlo, Monaco e outras |
| **Tamanho** | 13, de 8 a 32 |
| **Peso** | normal |
| **Altura da linha** | 1,55, de 1 a 2,5 |
| **Ligaduras** | desligado. Só com fontes que as têm, como Fira Code e JetBrains Mono |
| **Largura da tabulação** | 2, de 1 a 8 |
| **Inserir espaços** | ligado. Desligado, a tecla Tab insere um caractere de tabulação |
| **Quebrar linhas** | desligado |
| **Números de linha** | ligado |
| [**Contexto fixo ao rolar**](/docs/editor#contexto-fixo-e-minimapa) | desligado |
| **Modificador do multicursor** | **⌘ (Ctrl)**. Também **⌥ (Alt)** |
| [**Mapa de teclas**](/docs/editor#mapa-de-teclas) | **WebStorm**. Também **WebStorm (macOS)** e **VS Code** |
| [**Abrir arquivos .md em**](/docs/editor#markdown-e-imagens) | **Código**. Também **Pré-visualização** |
| [**Mostrar o minimapa**](/docs/editor#contexto-fixo-e-minimapa) | desligado |
| **Desenho** | **Caracteres**. Também **Blocos** |
| **Escala** | 1. Também 2 e 3 |
| **Área visível** | **Ao passar o mouse**. Também **Sempre** |
| **Esconder até passar o mouse** | desligado |
| [**Mostrar o autor no fim da linha**](/docs/git-in-the-editor#autor-da-linha) | ligado |
| **Autor**, **Data** e **Mensagem** | ligados |
| **Atraso** | 600 ms. Também 300, 1000 e 2000 ms |
| [**Limite de abas**](/docs/tabs-and-groups#opções-das-abas) | 20. Também 10, 30, 50 e **Sem limite** |
| **Ao fechar, ir para** | **A aba usada antes**. Também **A aba vizinha** |
| **Abrir aba nova** | **No fim**. Também **Logo depois da atual** |
| **Mostrar a pasta em nomes repetidos** | ligado |
| **Marcar abas não gravadas** | **Ponto**. Também **Nome em itálico** |
| **Aba de prévia** | desligado |

O **Peso** vai de 100 a 900, além de normal e bold. As opções do minimapa aparecem com ele ligado, e as do autor da linha, com **Mostrar o autor no fim da linha** ligado.

**Modificador do multicursor** é a tecla que, com o clique, adiciona outro cursor. Com **⌘ (Ctrl)**, clicar num nome vai à definição quando o arquivo tem servidor da linguagem; fora de um nome, ou num arquivo sem servidor, o clique adiciona o cursor. Para selecionar em bloco, arraste segurando <kbd>⌥</kbd> com **⌘ (Ctrl)**, ou <kbd>⌥</kbd> <kbd>⌘</kbd> com **⌥ (Alt)**.

## Terminal

Os grupos, na ordem: **Fonte**, **Cursor**, **Exibição** e **Teclado**. As mudanças valem na hora, sem reiniciar as sessões.

| Opção | Padrão |
| --- | --- |
| **Família da fonte** | vazio, que usa a mesma pilha padrão do editor |
| **Tamanho** | 13, de 8 a 32 |
| **Peso** | normal |
| **Peso do negrito** | bold |
| **Altura da linha** | 1,2, de 1 a 2 |
| **Estilo** | **Bloco**. Também **Sublinhado** e **Barra**. Programas podem trocar o formato |
| **Piscar** | ligado |
| **Espaçamento interno (px)** | 8, de 0 a 40 |
| **Renderizador** | **WebGL**. Também **DOM (compatibilidade)**, mais lento, mas funciona em qualquer lugar |
| **Linhas de histórico** | 5 000, de 1 000 a 50 000 |
| **Option como Meta** | ligado. Desligue para digitar símbolos com <kbd>⌥</kbd> |

## Arquivos

**Ocultar arquivos** lista padrões como `**/node_modules`, e o que casa com um deles some da árvore, da busca e de **Abrir arquivo**. O padrão de fábrica é `**/.DS_Store`. Cada padrão tem um interruptor e um botão para remover; **Novo padrão** e **Adicionar** incluem outro. O `.git` fica sempre oculto, e um padrão repetido ou inválido é recusado com o motivo. Veja [Esconder arquivos](/docs/files#esconder-arquivos).

## Agentes

| Opção | Padrão |
| --- | --- |
| **Terminais e agentes** | mostra **pronto** quando os terminais podem abrir neste computador |
| [**Agente padrão**](/docs/agents#agente-padrão) | **Claude Code**. Também **Codex CLI** e **Terminal**; um agente que falta vem com "(não instalado)" |
| [**Ferramentas do Persisty nos agentes**](/docs/agent-access#ligar) | desligado |
| [**Verificar instalação**](/docs/agent-access#verificar-instalação) | testa, passo a passo, o servidor dessas ferramentas |
| [**Codex CLI**](/docs/agent-access#codex-cli) | o comando para rodar uma vez no terminal, com **Copiar** e a marca **Não verificado** |
| [**Agentes detectados**](/docs/agents#agentes-detectados) | a versão e o caminho do Claude Code e do Codex CLI e o que cada um suporta, como **Retomada** e **Status por hooks**, com o que é **Não verificado** ou **Não suporta** |

As três linhas das ferramentas do Persisty ficam no grupo **Acesso dos agentes (MCP)**. Se **Terminais e agentes** mostrar **indisponível**, reabra o Persisty; se continuar, reinstale o app.

## Contas de IA

A lista mostra as contas do Claude Code, com a deste computador marcada como **Este computador** e as janelas de quota de cada uma.

| Opção | Padrão |
| --- | --- |
| [**Outra conta › Conectar conta**](/docs/ai-accounts#conectar-uma-conta) | só a conta deste computador. Pro |
| [**Rodízio entre contas**](/docs/ai-accounts#rodízio) | desligado. Pro |
| [**Trocar de conta ao chegar em**](/docs/ai-accounts#rodízio) | 90%. Também 80%, 95% e **100% · só no limite**. Aparece com o rodízio ligado |
| [**Continuar a tarefa cortada pelo limite**](/docs/ai-accounts#continuar-a-tarefa-cortada) | ligado. Pro |
| [**Usar só nos projetos fixados nela**](/docs/ai-accounts#uma-conta-para-um-projeto) | desligado, em cada conta conectada. Pro |

Cada conta conectada tem um botão para desconectá-la, que pede confirmação em **Desconectar**. Com o rodízio ligado, a conta que vai receber a próxima sessão leva **Próxima no rodízio**.

## Voz

Com **Ditado por voz** desligado, a tela mostra só ele; as outras opções aparecem ao ligar.

| Opção | Padrão |
| --- | --- |
| [**Ditado por voz**](/docs/voice#ligar-o-ditado) | desligado |
| [**Atalho**](/docs/voice#atalho) | <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd>. **Mudar** troca, e **Padrão** volta |
| [**Idioma do ditado**](/docs/voice#idioma-e-substituições) | **Igual ao app**. Também **Português (Brasil)** e **English** |
| [**Modelo de voz**](/docs/voice#modelo-de-voz) | **Não baixado**. **Baixar** traz cerca de 640 MB |
| [**Microfone**](/docs/voice#microfone) | a **Entrada** padrão do sistema e, no Mac, a **Permissão** |
| [**Substituições**](/docs/voice#idioma-e-substituições) | vazio. **Experimentar** mostra o que uma frase vira |

## Integrações

A tela mostra primeiro as **Conectadas** e depois as **Disponíveis**, cada uma com **Conectar** ou, já conectada, a conta ou o número de contas; clique num serviço para abrir a página dele. GitHub, GitLab e Bitbucket conectam contas para listar e clonar os seus repositórios; veja [GitHub, GitLab e Bitbucket](/docs/forges). Linear, Jira e ClickUp trazem issues para começar sessões; veja [Issues](/docs/issues#conectar-o-serviço). No fim, **Clonagem › Pasta padrão para clones** vem em `~/Documents/GitHub`; veja [Pasta dos clones](/docs/forges#pasta-dos-clones).

## Servidores MCP

**Instalados** lista os servidores que você instalou, e **Disponíveis** tem uma seleção de 16 servidores oficiais, com filtro por categoria. A busca também consulta o registro oficial de MCP, e **Adicionar manualmente** instala um servidor fora da lista. Cada projeto escolhe os servidores que as sessões dele recebem, nos ajustes do projeto. Veja [Servidores MCP](/docs/mcp-servers).

## Uso de IA

Os grupos **Alertas de gasto** e **Fontes de dados**.

| Opção | Padrão |
| --- | --- |
| [**Alerta diário (USD)**](/docs/usage-and-quota#alertas-de-gasto) | vazio, que desliga o alerta |
| [**Alerta mensal (USD)**](/docs/usage-and-quota#alertas-de-gasto) | vazio, que desliga o alerta |
| [**Fontes de dados**](/docs/usage-and-quota#fontes-de-dados) | cada fonte, como **Registros locais do Claude Code**, com "Última sincronização" e quando, **Nunca sincronizado** ou **Não conectado** |
| [**Abrir uso detalhado**](/docs/usage-and-quota#gasto-estimado) | abre a página **Uso de IA** |

## Privacidade e rede

No topo, **Privacidade** diz que a **Telemetria** está desligada, que os **Dados das sessões** ficam nesta máquina e que as **Integrações externas** são opcionais; nada disso se configura. Embaixo, **Chamadas de rede desde que o app abriu** lista cada chamada para fora, e **Atualizar** lê a lista de novo. Veja [Privacidade e rede](/docs/privacy-and-network).

## Atalhos

Todas as teclas do mapa do editor e do Persisty, por extenso e com busca. Nada se muda aqui: o mapa fica em **Editor › Mapa de teclas**, e a tecla do ditado, em **Voz › Atalho**. Veja [Lista completa](/docs/shortcuts#lista-completa).

## Conta

Esta aba só aparece com a conta do Persisty Cloud conectada. Ela mostra o **E-mail**, o **Plano**, a **Licença**, que diz **válida** ou **atenção** e até quando funciona sem internet, e os **Recursos do plano**; no plano grátis, a linha **Assinatura** tem **Ver planos**. Embaixo ficam **Atualizar licença** e **Sair da conta**. Com a conta conectada, o rodapé de Configurações mostra o e-mail, o plano e **Gerenciar conta**, que abre esta aba; sem conta, ele tem **Entrar** e **Criar conta grátis**. Veja [Conta e licença](/docs/account-and-license#plano-e-recursos).

## Sobre

Os grupos, na ordem: **Este aplicativo**, **Atualizações** e **Saiba mais**.

| Opção | Padrão |
| --- | --- |
| **Versão** e **Sistema** | a versão do app e o sistema, como "macOS · Apple Silicon" |
| **Pasta de dados** | onde ficam o banco local, os hooks e os registros das sessões, com **Mostrar no Finder** |
| [**Procurar atualizações**](/docs/updates#atualizar-no-app) | procura na hora e diz "Você está na versão mais recente" ou a versão nova |
| [**Procurar atualizações automaticamente**](/docs/updates#desligar-a-procura-automática) | ligado: ao abrir o app e a cada 6 horas |
| **Saiba mais** | **Novidades**, **Documentação**, **Privacidade** e **Termos de uso**, cada um com **Abrir** |

## Plano e limites

Quase tudo em Configurações é do plano grátis. Em **Contas de IA**, são do Pro conectar outra conta, o **Rodízio entre contas**, **Continuar a tarefa cortada pelo limite** e **Usar só nos projetos fixados nela**. Sem o Pro, **Conectar conta** fica desligado, o rodízio e a reserva aparecem com a marca **Pro**, e **Continuar a tarefa cortada pelo limite** não aparece. A **Pasta dos worktrees** é de todos os planos, mas a [pasta própria](/docs/worktrees) que vai para ela é do Pro.

No Windows e no Linux, que estão em prévia, as teclas desta página usam <kbd>Ctrl</kbd> no lugar de <kbd>⌘</kbd>. **O mascote anda sobre as janelas** só aparece no macOS.
