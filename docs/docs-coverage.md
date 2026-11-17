# Inventário de cobertura das docs

Mapa de tudo o que o Persisty entregou (changelog do site, versões 0.1.0 a 0.13.0) e de cada aba e opção de Configurações (app v0.13.0) para a página e a seção das docs que o cobrem. Fonte do design: `docs/superpowers/specs/2026-11-16-docs-per-feature-design.md`.

Como ler:
- **Item:** o item como está em `content/changelog/pt-BR/<versão>.md`, ou a opção de Configurações no formato `Aba › Opção`.
- **Página:** `slug#ancora` em pt-BR, ou `—` quando não há doc. A âncora é a proposta para a seção; quem escrever a página pode ajustá-la e corrige aqui.
- **Situação:** `a escrever` (nenhuma página cobre ainda), `coberto` ou `sem doc: <motivo>`.
- Fora do inventário, por decisão do design: as opções do Persisty Remote que ficam atrás de um sinalizador de prévia.

## Páginas

Lista final: 34 páginas em seis grupos. Parte da lista da spec; o inventário acrescentou `agent-access` (ver o relatório da Tarefa 1).

| Slug | Grupo | Título pt-BR |
|---|---|---|
| `getting-started` | `start` | Primeiros passos |
| `projects-and-workspaces` | `start` | Projetos e workspaces |
| `sessions` | `start` | Sessões e terminais |
| `sessions-and-recovery` | `start` | Voltar depois de travar |
| `agents` | `agents` | Agentes e estados |
| `board` | `agents` | Quadro |
| `mascot` | `agents` | Mascote |
| `notifications` | `agents` | Notificações |
| `ai-accounts` | `agents` | Contas de IA e rodízio |
| `usage-and-quota` | `agents` | Uso, custo e quota |
| `queue` | `agents` | Fila de pedidos |
| `restore-points` | `agents` | Pontos de restauração |
| `worktrees` | `agents` | Pasta própria |
| `verify` | `agents` | Verificar ao terminar |
| `editor` | `code` | Editor |
| `files` | `code` | Arquivos |
| `tabs-and-groups` | `code` | Abas e grupos |
| `git-in-the-editor` | `code` | Git no editor |
| `changes` | `code` | Alterações e commits |
| `search` | `code` | Busca |
| `notes` | `code` | Notas |
| `commands` | `code` | Comandos do workspace |
| `issues` | `integrations` | Issues: Linear, Jira, ClickUp e GitHub |
| `forges` | `integrations` | GitHub, GitLab e Bitbucket |
| `mcp-servers` | `integrations` | Servidores MCP |
| `agent-access` | `integrations` | Agentes que leem o Persisty |
| `voice` | `integrations` | Ditado por voz |
| `pro` | `account` | Planos e recursos do Pro |
| `account-and-license` | `account` | Conta e licença |
| `privacy-and-network` | `account` | Privacidade e rede |
| `updates` | `account` | Atualizações |
| `shortcuts` | `reference` | Atalhos |
| `settings` | `reference` | Configurações, tela por tela |
| `troubleshooting` | `reference` | Problemas e limitações |

## 0.1.0

| Item | Página | Situação |
|---|---|---|
| Projetos com vários workspaces, mostrando branch e alterações de cada pasta | projects-and-workspaces#workspaces | coberto |
| Sessões persistentes em abas, cada uma com o histórico do terminal | sessions#sessões-e-abas | coberto |
| Restaurar tudo depois de reiniciar o computador, com relatório do que voltou, do que falhou e por quê | sessions-and-recovery#restaurar-tudo | coberto |
| Rodar a restauração duas vezes não duplica sessões | sessions-and-recovery#restaurar-tudo | coberto |
| Claude Code com id de sessão escolhido pelo Persisty, estados pelos hooks e retomada com --resume | agents#claude-code | coberto |
| Uso de IA: gasto estimado por sessão, projeto, modelo e dia, rotulado como estimativa | usage-and-quota#gasto-estimado | coberto |

## 0.2.0

| Item | Página | Situação |
|---|---|---|
| Painel lateral da sessão (⌘\) com Alterações, Código, Busca, Notas e Detalhes e divisória arrastável | sessions#painel-lateral | coberto |
| Editor: árvore da pasta da sessão, abas e ⌘S | editor#abrir-e-salvar | a escrever |
| Editor: aviso quando o arquivo muda no disco | editor#arquivo-mudou-no-disco | a escrever |
| Editor: destaque por linguagem | editor#destaque-por-linguagem | a escrever |
| Editor: ⌘P (abrir arquivo pelo nome) | search#abrir-arquivo-pelo-nome | a escrever |
| Editor: ⌘⇧F (busca em todos os arquivos) | search#buscar-nos-arquivos | a escrever |
| Editor: marcas do git na margem | git-in-the-editor#marcas-na-margem | a escrever |
| Alterações: preparar e remover por arquivo | changes#preparar-e-remover | a escrever |
| Alterações: commit com ⌘↵ e Commit e enviar | changes#commit | a escrever |
| Alterações: diff por arquivo | changes#diff | a escrever |
| Alterações: histórico do que não foi enviado | changes#historico | a escrever |
| Branch no cabeçalho da sessão, com busca, branches locais e remotos e Criar branch | changes#branches | a escrever |
| Gaveta de comandos: cada comando do workspace vira uma aba com o estado escrito | commands#gaveta | a escrever |
| Parar um comando manda Ctrl-C e mantém a saída | commands#parar | a escrever |

## 0.3.0

| Item | Página | Situação |
|---|---|---|
| Configurações › Conta: entrada por código enviado por e-mail, com a conta criada no primeiro acesso | account-and-license#entrar | a escrever |
| Plano e recursos vêm de uma licença assinada que funciona 14 dias sem internet | account-and-license#licenca | a escrever |
| Configurações › Rede: cada chamada que o app faz para fora, sem cabeçalhos, corpo ou parâmetros | privacy-and-network#registro-de-rede | a escrever |
| Janelas de 5 h e 7 d do rodapé ao vivo, do mesmo lugar que o /usage do Claude Code | usage-and-quota#janelas-de-5-h-e-7-d | coberto |

## 0.4.0

| Item | Página | Situação |
|---|---|---|
| Fila de pedidos: o pedido vai quando o agente ficar livre, quando a janela de 5 h renovar ou a partir de um horário | queue#quando-cada-pedido-sai | coberto |
| Fila de pedidos: um por vez, nunca durante um trabalho nem sobre um pedido de permissão | queue#como-os-pedidos-chegam-ao-agente | coberto |
| Pontos de restauração: cada pedido grava o estado da pasta antes de o agente começar | restore-points#o-que-é-gravado | coberto |
| Restaurar mostra antes o que volta e o que é apagado, e guarda o estado atual como um ponto novo | restore-points#restaurar | coberto |
| Verificação ao terminar: um comando do workspace roda quando o agente para depois de mudar arquivos | verify#quando-roda | coberto |
| O cabeçalho diz se a verificação passou ou falhou | verify#o-resultado | coberto |
| Pasta própria por sessão: branch persist/nome numa pasta só dela, em pastas git | worktrees#criar-a-pasta | coberto |
| O branch da pasta própria nunca é apagado | worktrees#fechar-a-sessão | coberto |

## 0.5.0

| Item | Página | Situação |
|---|---|---|
| Configurações › Contas de IA lista a conta deste computador e as conectadas, com organização, plano e janelas de 5 h e 7 d | ai-accounts#contas-conectadas | coberto |
| Conectar conta abre o login do Claude Code no navegador; Desconectar faz o logout | ai-accounts#conectar-uma-conta | coberto |
| Rodízio (Pro): cada sessão nova vai para a conta com mais folga; contas acima de 90% ficam de fora | ai-accounts#rodízio | coberto |
| Opção Automática no formulário de nova sessão | ai-accounts#rodízio | coberto |
| Ajustes e instruções são compartilhados entre as contas; login e histórico, nunca | ai-accounts#o-que-as-contas-compartilham | coberto |

## 0.6.0

| Item | Página | Situação |
|---|---|---|
| Tudo de que o Persisty precisa vai dentro do app, sem instalar nada à parte | getting-started#instalar | coberto |
| No Windows, os agentes funcionam sem shell POSIX | troubleshooting#windows-e-linux | a escrever |
| Instalador para Windows e pacotes .deb e AppImage para Linux, como prévia | updates#sistemas-e-instaladores | a escrever |
| Corrigido: eventos dos agentes podiam se perder quando uma linha era lida no meio da escrita | — | sem doc: correção interna, sem efeito a descrever |

## 0.7.0

| Item | Página | Situação |
|---|---|---|
| Site em português, inglês e espanhol com planos, download e a conta do Persisty Cloud | account-and-license#conta-no-site | a escrever |
| Conta pelo site: entrada por código, plano, aparelhos conectados (revogar um), aviso de lançamento, interesse no Enterprise | account-and-license#conta-no-site | a escrever |
| Docs com o que o app faz hoje e o que ainda não faz | getting-started#próximos-passos | coberto |
| Changelog com feed RSS em cada idioma | updates#novidades-e-feed | a escrever |

## 0.8.0

| Item | Página | Situação |
|---|---|---|
| Instalador: Mac assinado e notarizado; Windows e Linux como prévia | updates#sistemas-e-instaladores | a escrever |
| Página de download e Todas as versões, com data, tamanho e SHA-256 | updates#baixar | a escrever |
| O app procura versões novas ao abrir e a cada 6 horas, e instala com um clique | updates#atualizar-no-app | a escrever |
| Desligar a procura em Configurações › Sobre; cada consulta em Privacidade e rede | updates#desligar-a-procura | a escrever |
| No Windows e no Linux, aviso antes de instalar com sessões abertas | updates#windows-e-linux | a escrever |
| Configurações › Integrações com GitHub, GitLab (gitlab.com ou da empresa) e Bitbucket, várias contas | forges#conectar-contas | a escrever |
| Adicionar workspace a partir de um repositório remoto, com progresso e cancelamento | projects-and-workspaces#clonar-um-repositório | coberto |
| Setas ↓ e ↑ ao lado do branch; buscar, puxar, enviar e publicar o branch | changes#sincronizar | a escrever |
| Descartar alterações, commit de tudo quando nada foi preparado, emendar e desfazer o último commit | changes#commit | a escrever |
| Branches no painel: trocar, criar, mesclar, renomear e apagar | changes#branches | a escrever |
| Stash para guardar alterações e trazê-las de volta | changes#stash | a escrever |
| Conflitos e operações paradas no meio mostram como seguir ou desistir | changes#conflitos | a escrever |
| Aba Aparência | settings#aparencia | a escrever |
| Aba Sobre | settings#sobre | a escrever |
| Aba Terminal (fonte, cursor, exibição e teclado) | settings#terminal | a escrever |
| Aba Editor (fonte, indentação, quebra de linha, números de linha, vários cursores) | settings#editor | a escrever |
| Aba Arquivos (esconder arquivos por padrão na árvore, na busca e no ⌘P) | files#esconder-arquivos | a escrever |
| Aba Workspace: salvar sozinho depois de uma pausa e onde ficam as pastas próprias | settings#workspace | a escrever |
| IDE padrão, com Abrir no IDE na aba, na paleta e no projeto | files#abrir-em | a escrever |
| Aba Notificações | notifications#configurar | coberto |
| Agente padrão, já escolhido no ⌘⇧N e aberto direto no ⌘⌥N | agents#agente-padrão | coberto |
| Aviso no app, com som, e notificação do sistema quando um agente espera ou pede permissão | notifications#quando-o-persisty-avisa | coberto |
| Botão de teste e onde olhar quando a notificação do sistema não aparece | notifications#enviar-um-teste | coberto |
| Depois de reiniciar, o Claude Code volta na conversa, no mesmo modo de permissão e na pasta própria | sessions-and-recovery#reiniciar-ou-travar-o-computador | coberto |
| Uma sessão relançada não aparece mais como encerrada por engano | sessions-and-recovery#reiniciar-ou-travar-o-computador | coberto |
| Arquivar um projeto pergunta o que fazer com as sessões abertas; tela dos arquivados, ⌘K, apagar de vez | projects-and-workspaces#arquivar-e-excluir-projetos | coberto |
| Projetos, abas de sessão e repositórios na ordem em que você os arrasta | projects-and-workspaces#mudar-a-ordem | coberto |
| A aba de uma sessão do Claude Code ganha o nome da conversa | sessions#sessões-e-abas | coberto |
| Rodízio (Pro): escolher em que ponto da quota uma conta sai do rodízio | ai-accounts#rodízio | coberto |
| Rodízio (Pro): ao fim do turno no limite, a sessão passa para a conta com mais folga e retoma a conversa | ai-accounts#rodízio | coberto |
| Entrar no Persisty Cloud em dois passos, numa janela própria | account-and-license#entrar | a escrever |
| Uma segunda conta pode entrar no mesmo computador; um computador removido volta ao entrar de novo | account-and-license#computadores | a escrever |
| ⌘ ou Ctrl + clique abre no navegador um link do terminal | sessions#links-no-terminal | coberto |
| Criar arquivos e pastas pela lista de arquivos do editor | files#novo | a escrever |
| Um mascote no canto do terminal acompanha o estado do agente | mascot#no-terminal | coberto |

## 0.9.0

| Item | Página | Situação |
|---|---|---|
| Ditado por voz em Configurações › Voz, desligado por padrão, com ⌘⇧D | voice#ditar | a escrever |
| Tudo roda no computador; o modelo de voz (640 MB) só é baixado quando você pede e pode ser apagado | voice#modelo-de-voz | a escrever |
| Números falados viram dígitos, termos de programação viram símbolos, substituições próprias | voice#substituicoes | a escrever |
| O mascote do terminal que recebe o texto pega um microfone | mascot#no-terminal | coberto |
| Configurações › Integrações ganhou Linear, Jira Cloud e ClickUp, e as issues do GitHub vêm da conta já conectada | issues#conectar | a escrever |
| Cada projeto escolhe o serviço em Ajustes do projeto › Tarefas | issues#escolher-o-servico | a escrever |
| Começar de uma issue, na Nova sessão | issues#comecar-de-uma-issue | a escrever |
| Concluir na issue: comentário sugerido e novo status, nada escrito sem você enviar | issues#concluir | a escrever |
| Configurações › Agentes: ferramentas que leem o projeto, as outras sessões e a saída das tarefas | agent-access#ativar | a escrever |
| Verificar instalação testa a conexão de verdade | agent-access#verificar | a escrever |
| Pré-visualização de Markdown, com ⌘⇧V e a opção de abrir os .md nela | editor#markdown | a escrever |
| Contexto fixo ao rolar | editor#contexto-fixo | a escrever |
| Minimapa, em caracteres ou blocos, com escala e visibilidade ajustáveis | editor#minimapa | a escrever |
| Mudou no Mac: os programas das sessões não usam mais as permissões de privacidade dadas ao Persisty | privacy-and-network#permissoes-do-macos | a escrever |
| Mudou no Mac: até o Mac reiniciar, as sessões continuam usando as permissões do Persisty | privacy-and-network#permissoes-do-macos | a escrever |
| Corrigido: o uso de 5 h e 7 d de cada sessão é o da conta em que ela roda, ao vivo | usage-and-quota#janelas-de-5-h-e-7-d | coberto |
| Corrigido: com Reduzir movimento, os números de linha ficam alinhados e a busca leva à linha certa | editor#acessibilidade | a escrever |
| Corrigido: uma atualização parada no download desiste depois de 30 s; Privacidade e rede mostra cada servidor | updates#atualizar-no-app | a escrever |
| Corrigido: no Linux, o pacote .deb instala ao lado dos programas do sistema | updates#windows-e-linux | a escrever |
| Windows e Linux continuam como prévia, sem assinatura | updates#windows-e-linux | a escrever |

## 0.9.1

| Item | Página | Situação |
|---|---|---|
| Corrigido: Adicionar workspace aceita a pasta escolhida no Windows (C:\...) | projects-and-workspaces#adicionar-workspace | coberto |
| Corrigido: Nova sessão num workspace do Windows é criada normalmente | sessions#nova-sessão | coberto |

## 0.9.2

| Item | Página | Situação |
|---|---|---|
| Corrigido: no Windows e no Linux, a barra do topo começa na borda da janela | troubleshooting#windows-e-linux | a escrever |

## 0.9.3

| Item | Página | Situação |
|---|---|---|
| Sessões voltam sozinhas ao abrir, com Relançar se tiver caído e Relançar sempre | sessions-and-recovery#ao-abrir-o-persisty | coberto |
| Sessões com Só reanexar se estiver viva continuam esperando você pedir | sessions-and-recovery#quando-relançar | coberto |
| O relatório de restauração abre sozinho depois dessa volta e depois de Restaurar tudo (⌘⇧R) | sessions-and-recovery#o-relatório-de-restauração | coberto |
| A paleta de comandos abre de novo o último relatório | sessions-and-recovery#o-relatório-de-restauração | coberto |

## 0.9.4

| Item | Página | Situação |
|---|---|---|
| Corrigido: o terminal das sessões não embaralha mais o texto no Windows com a tela em 125% ou 150% | troubleshooting#windows-e-linux | a escrever |

## 0.10.0

| Item | Página | Situação |
|---|---|---|
| O Quadro abre as sessões de todos os projetos, ou só do atual, com ⌘⇧O ou o botão ao lado das abas | board#abrir-o-quadro | coberto |
| Quatro colunas: Precisa de você, Trabalhando, Respondeu e Erro | board#as-colunas | coberto |
| Cada cartão diz o que a sessão quer, há quanto tempo espera e se você já viu | board#os-cartões | coberto |
| A tecla A abre a sessão que espera há mais tempo | board#teclas | coberto |
| Mascote fora do app (macOS), por cima de tudo, em pé no topo da janela da frente | mascot#fora-do-app | coberto |
| O mascote sobe e avisa quando uma sessão precisa de você; clicar na fala abre a sessão | mascot#avisos-e-balão | coberto |
| Um clique no mascote abre um balão com quem espera, atalhos para a sessão e o Quadro, e o Não perturbe | mascot#avisos-e-balão | coberto |
| Clicar ou arrastar o mascote não tira o foco do app em que você está | mascot#fora-do-app | coberto |
| Desligar O mascote anda sobre as janelas, em Configurações › Aparência | mascot#fora-do-app | coberto |
| Inteligência de código em TypeScript, JavaScript e Rust: sugestões, documentação, import, parâmetros e erros | editor#inteligencia-de-codigo | a escrever |
| Em Rust, os erros do cargo check se atualizam a cada salvamento | editor#inteligencia-de-codigo | a escrever |
| O app baixa o servidor da linguagem; a barra de status mostra o estado e os erros do arquivo | editor#servidor-da-linguagem | a escrever |
| Ir à definição, com leitura somente na biblioteca padrão e em dependências, e rust-src no toolchain | editor#ir-a-definicao | a escrever |
| Configurações › Editor › Mapa de teclas: WebStorm (padrão), WebStorm (macOS) ou VS Code | editor#mapa-de-teclas | a escrever |
| Teclas do WebStorm: definição, parâmetros, documentação, voltar e avançar, próximo erro, abrir pelo nome | shortcuts#mapa-webstorm | a escrever |
| Abas do editor: ⌘⇧T reabre a última aba fechada (VS Code) e ⌃Tab abre o alternador de abas | tabs-and-groups#alternador | a escrever |
| A paleta de comandos (⌘K) lista as ações do editor; Localizar ação abre só elas | shortcuts#paleta-de-comandos | a escrever |
| Configurações › Atalhos lista todas as teclas do mapa e do Persisty, com busca | shortcuts#lista-completa | a escrever |
| Teclas que mudaram em relação à 0.9.4 no mapa do WebStorm | shortcuts#mudancas-da-0-10-0 | a escrever |
| ⌘W não fecha mais a janela: fecha a aba do editor no painel Código | tabs-and-groups#fechar-abas | a escrever |
| No código de uma sessão, ⌘← e ⌘→ levam ao início e ao fim da linha | shortcuts#mudancas-da-0-10-0 | a escrever |
| No Mac, os atalhos do app respondem só ao ⌘, não ao ⌃ | shortcuts#mudancas-da-0-10-0 | a escrever |
| Sem quota, a sessão espera (Pro): cabeçalho com a hora da volta e Soltar a fila agora | ai-accounts#quando-a-quota-acaba | coberto |
| Continua sozinha quando a janela renova (Pro), com Continuar a tarefa cortada pelo limite | ai-accounts#continuar-a-tarefa-cortada | coberto |
| Trocar a conta de uma sessão pelo rodapé (Pro) | ai-accounts#trocar-a-conta-de-uma-sessão | coberto |
| Um projeto preso a uma conta (Pro), em Conta do Claude nas configurações do projeto | ai-accounts#uma-conta-para-um-projeto | coberto |
| Uma conta reservada aos projetos fixados nela (Pro) | ai-accounts#uma-conta-para-um-projeto | coberto |
| Todas as contas usam a mesma pasta de conversas e memória, com backup do que diferia | ai-accounts#o-que-as-contas-compartilham | coberto |
| Fila no jeito de um chat: cabeçalho com o que o agente faz, Pausar fila, pedidos numerados | queue#pôr-um-pedido-na-fila | coberto |
| Arrastar para mudar a ordem, editar um pedido, enviar um a seguir e tirar da fila | queue#mudar-a-ordem-e-editar | coberto |
| A caixa de escrever aceita imagens (até 8 por pedido, 10 MB cada) | queue#imagens | coberto |
| No plano grátis, pausar, reordenar, enviar a seguir e tirar da fila também valem | queue#plano-e-limites | coberto |
| Barra fina de ferramentas da sessão na borda direita, com contagem em Alterações e Fila | sessions#ferramentas-da-sessão | coberto |
| Servidores MCP em Configurações: 16 servidores oficiais, busca no registro e teste antes de instalar | mcp-servers#catalogo | a escrever |
| Cada projeto liga os seus servidores MCP em Ajustes do projeto; tokens no Keychain | mcp-servers#por-projeto | a escrever |
| A lista de Arquivos muda de largura | files#arvore | a escrever |
| Botão direito num arquivo ou pasta: Mostrar no Finder | files#abrir-em | a escrever |
| Imagens abrem no editor, e um SVG ganha a pré-visualização | editor#imagens | a escrever |
| No terminal, caminhos que existem no disco e endereços www. viram links | sessions#links-no-terminal | coberto |
| Pro e Team se assinam no site; no plano grátis, Configurações › Conta tem Ver planos | pro#assinar | a escrever |
| Corrigido: a troca de conta espera um subagente ou comando terminar | ai-accounts#trocar-a-conta-de-uma-sessão | coberto |
| Corrigido: Quando a janela de 5 h renovar usa o horário da conta da própria sessão | queue#quando-cada-pedido-sai | coberto |
| Corrigido: pedidos da fila e o continue automático ficavam como rascunho no Claude Code | queue#como-os-pedidos-chegam-ao-agente | coberto |
| Corrigido: pedido muito longo na fila (cerca de 16 mil caracteres) não saía, e um ; no fim sumia | queue#como-os-pedidos-chegam-ao-agente | coberto |
| Corrigido: Contas de IA avisa quando duas contas entraram com o mesmo e-mail | ai-accounts#conectar-uma-conta | coberto |
| Corrigido: o contexto fixo ao rolar não mostra um bloco que a linha logo abaixo já fecha | editor#contexto-fixo | a escrever |

## 0.11.0

| Item | Página | Situação |
|---|---|---|
| Novo cria arquivos TypeScript, JavaScript, HTML, CSS, JSON, Markdown, Dockerfile e EditorConfig com modelo | files#novo | a escrever |
| Abrir em, na árvore e na aba: Finder, terminal, app padrão, navegador, IDE e a página no GitHub, GitLab ou Bitbucket | files#abrir-em | a escrever |
| Copiar caminho e Copiar referência, com os atalhos ⌘⇧C e ⌥⌘⇧C | files#copiar-caminho | a escrever |
| Recarregar do disco, e ⌥⌘Y para sincronizar a árvore | files#recarregar | a escrever |
| ⌘ + clique e ⇧ + clique selecionam vários itens; o teclado navega pela árvore e abre o menu (⇧F10) | files#selecao-e-teclado | a escrever |
| Botão direito na aba do editor: fechar a aba, as outras, todas, as não modificadas, à esquerda ou à direita | tabs-and-groups#fechar-abas | a escrever |
| Só as abas com alterações não gravadas pedem confirmação, numa pergunta só | tabs-and-groups#fechar-abas | a escrever |
| Configurações › Atalhos ganhou o grupo Arquivos, com onde cada tecla vale | shortcuts#arquivos | a escrever |
| Corrigido: a fila esperava a renovação seguinte antes de digitar continue | ai-accounts#continuar-a-tarefa-cortada | coberto |
| Corrigido: com o salvamento automático, fechar uma aba grava sem perguntar; com ele desligado, Descartar não grava | editor#salvar | a escrever |

## 0.12.0

| Item | Página | Situação |
|---|---|---|
| Renomear arquivos e pastas pela árvore e pela aba (Shift + F6) | files#renomear | a escrever |
| Mover e copiar para outra pasta (F6 e F5), e o submenu Refatorar | files#mover-e-copiar | a escrever |
| Arrastar na árvore para mover; com Option (Alt), copia | files#arrastar | a escrever |
| Recortar, copiar e colar arquivos e pastas na árvore, inclusive de e para o Finder | files#recortar-copiar-colar | a escrever |
| Excluir para a Lixeira, com Desfazer por 10 segundos | files#excluir | a escrever |
| Uma pergunta só quando o nome já existe: renomear, substituir ou pular | files#nome-que-ja-existe | a escrever |
| Cópias grandes mostram o andamento e podem ser canceladas | files#copias-grandes | a escrever |
| Trocar o tipo de um arquivo, pela árvore, pela aba ou pela paleta | files#tipo-do-arquivo | a escrever |
| Se mover ou copiar parar no meio, o que já foi fica e o Persisty diz qual item falhou | files#quando-algo-falha | a escrever |
| No Windows e no Linux, colar com o sistema e o Desfazer da exclusão ainda estão sendo conferidos | troubleshooting#windows-e-linux | a escrever |

## 0.13.0

| Item | Página | Situação |
|---|---|---|
| Quem mudou cada linha: autor, data e mensagem no fim da linha, cartão do commit com Copiar hash, Mostrar o commit e Abrir na forja | git-in-the-editor#autor-da-linha | a escrever |
| Anotar com o git blame: autor e data na margem, cor pela idade do commit | git-in-the-editor#anotar | a escrever |
| Submenu Git na árvore e na aba: diff, histórico, comparar, preparar, tirar da preparação, descartar, anotar | git-in-the-editor#submenu-git | a escrever |
| Diffs e histórico abrem em abas só de leitura | git-in-the-editor#abas-de-leitura | a escrever |
| Descartar guarda antes um ponto de restauração | restore-points#antes-de-descartar | coberto |
| Dividir o editor à direita e embaixo, em até quatro grupos | tabs-and-groups#dividir | a escrever |
| Maximizar o editor esconde o terminal | tabs-and-groups#maximizar | a escrever |
| Arrastar abas para mudar a ordem, levar a outro grupo ou criar outro; Shift + Enter abre à direita | tabs-and-groups#arrastar-abas | a escrever |
| Mover a aba pelo teclado e Mover a aba para o próximo grupo pela paleta | tabs-and-groups#mover-pelo-teclado | a escrever |
| Fixar aba: fica à esquerda, com um alfinete, e não fecha com Fechar as outras nem pelo limite | tabs-and-groups#fixar | a escrever |
| Configurações › Editor › Abas: limite, para onde ir ao fechar, onde abrir, pasta, marca de não gravada, aba de prévia | tabs-and-groups#opcoes-das-abas | a escrever |
| Arrastar na árvore mostra o que vai e para onde | files#arrastar | a escrever |
| Corrigido: sessão com trabalho em segundo plano continua como Trabalhando até acabar | agents#trabalho-em-segundo-plano | coberto |
| Corrigido: a fila e o aviso de concluído esperam o fim do trabalho em segundo plano | queue#como-os-pedidos-chegam-ao-agente | coberto |
| Corrigido: ao trocar de sessão, o que se digita vai para o terminal, nunca para o arquivo do painel Código | sessions#sessões-e-abas | coberto |
| Corrigido: fechar várias abas não para num conflito, e um aviso diz quais ficaram | tabs-and-groups#fechar-abas | a escrever |
| Corrigido: um Substituir que falha diz qual item não foi colocado e que a versão antiga foi para a Lixeira | files#quando-algo-falha | a escrever |
| Corrigido: copiar caminho com muitos arquivos pergunta ao Git uma vez; Abrir no GitHub numa branch não enviada aponta para o commit | files#copiar-caminho | a escrever |
| Corrigido: arrastar numa árvore grande ficou bem mais leve | — | sem doc: desempenho, sem comportamento a descrever |
| Corrigido: uma tecla que não vale naquele lugar diz o motivo | shortcuts#tecla-que-nao-vale | a escrever |
| Corrigido: detalhes do menu de clique direito, das abas, do histórico do arquivo e da leitura de tela | tabs-and-groups#menu-de-clique-direito | a escrever |
| No Windows, o Desfazer da Lixeira e os avisos de arquivo em uso ainda estão sendo conferidos | troubleshooting#windows-e-linux | a escrever |

## Configurações

As abas, na ordem do app: Interface (Aparência, Workspace, Notificações), Código (Editor, Terminal, Arquivos), Agentes (Agentes, Contas de IA, Voz), Conexões (Integrações, Servidores MCP, Uso de IA, Privacidade e rede), Persisty (Atalhos, Conta, Sobre). A aba Conta só aparece com a sessão iniciada.

| Item | Página | Situação |
|---|---|---|
| Aparência › Tema (Sistema, claro ou escuro) | settings#aparencia | a escrever |
| Aparência › Idioma | settings#aparencia | a escrever |
| Aparência › Mascote no terminal | mascot#no-terminal | coberto |
| Aparência › Mascote fora do app | mascot#fora-do-app | coberto |
| Aparência › O mascote anda sobre as janelas | mascot#fora-do-app | coberto |
| Workspace › Salvar automaticamente | editor#salvar | a escrever |
| Workspace › IDE padrão | files#abrir-em | a escrever |
| Workspace › Pasta dos worktrees | worktrees#onde-ficam | coberto |
| Workspace › Tamanho dos painéis (Redefinir) | settings#workspace | a escrever |
| Notificações › Alertas dentro do app | notifications#configurar | coberto |
| Notificações › Tocar som | notifications#configurar | coberto |
| Notificações › Silenciar com o Persisty em foco | notifications#configurar | coberto |
| Notificações › Enviar teste | notifications#enviar-um-teste | coberto |
| Notificações › Bloqueadas no sistema | notifications#enviar-um-teste | coberto |
| Editor › Fonte (família, tamanho, peso, altura da linha, ligaduras) | settings#editor | a escrever |
| Editor › Comportamento (largura da tabulação, inserir espaços, quebrar linhas, números de linha) | settings#editor | a escrever |
| Editor › Modificador do multicursor | settings#editor | a escrever |
| Editor › Mapa de teclas | editor#mapa-de-teclas | a escrever |
| Editor › Contexto fixo ao rolar | editor#contexto-fixo | a escrever |
| Editor › Minimapa (mostrar, desenho, escala, área visível, esconder até passar o mouse) | editor#minimapa | a escrever |
| Editor › Markdown (abrir arquivos .md em) | editor#markdown | a escrever |
| Editor › Autor da linha (git blame): mostrar, atraso, autor, data, mensagem | git-in-the-editor#autor-da-linha | a escrever |
| Editor › Abas: limite, ao fechar ir para, abrir aba nova, pasta em nomes repetidos, marca de não gravada, aba de prévia | tabs-and-groups#opcoes-das-abas | a escrever |
| Terminal › Fonte (família, tamanho, peso, peso do negrito, altura da linha) | settings#terminal | a escrever |
| Terminal › Cursor (estilo, piscar) | settings#terminal | a escrever |
| Terminal › Exibição (renderizador WebGL ou DOM, linhas de histórico, espaçamento interno) | settings#terminal | a escrever |
| Terminal › Teclado (Option como Meta) | settings#terminal | a escrever |
| Arquivos › Ocultar arquivos (padrões; o .git fica sempre oculto) | files#esconder-arquivos | a escrever |
| Agentes › Terminais (se os terminais podem abrir) | settings#agentes | a escrever |
| Agentes › Agentes detectados | agents#agentes-detectados | coberto |
| Agentes › Agente padrão | agents#agente-padrão | coberto |
| Agentes › Ferramentas do Persisty nos agentes | agent-access#ativar | a escrever |
| Agentes › Verificar instalação | agent-access#verificar | a escrever |
| Agentes › Comando do Codex CLI | agent-access#codex | a escrever |
| Contas de IA › Lista de contas (este computador e conectadas, com quota de 5 h e 7 d) | ai-accounts#contas-conectadas | coberto |
| Contas de IA › Conectar conta (e-mail opcional, código do navegador) | ai-accounts#conectar-uma-conta | coberto |
| Contas de IA › Desconectar | ai-accounts#conectar-uma-conta | coberto |
| Contas de IA › Rodízio entre contas | ai-accounts#rodízio | coberto |
| Contas de IA › Trocar de conta ao chegar em | ai-accounts#rodízio | coberto |
| Contas de IA › Continuar a tarefa cortada pelo limite | ai-accounts#continuar-a-tarefa-cortada | coberto |
| Contas de IA › Usar só nos projetos fixados nela | ai-accounts#uma-conta-para-um-projeto | coberto |
| Contas de IA › Aviso de contas com o mesmo e-mail | ai-accounts#conectar-uma-conta | coberto |
| Voz › Ditado por voz (liga e desliga) | voice#ditar | a escrever |
| Voz › Atalho | voice#ditar | a escrever |
| Voz › Idioma do ditado | voice#idioma | a escrever |
| Voz › Microfone (permissão e entrada) | voice#microfone | a escrever |
| Voz › Modelo de voz (baixar, apagar, recomeçar) | voice#modelo-de-voz | a escrever |
| Voz › Substituições (e Experimentar) | voice#substituicoes | a escrever |
| Integrações › GitHub | forges#github | a escrever |
| Integrações › GitLab | forges#gitlab | a escrever |
| Integrações › Bitbucket | forges#bitbucket | a escrever |
| Integrações › Linear | issues#linear | a escrever |
| Integrações › Jira Cloud | issues#jira | a escrever |
| Integrações › ClickUp | issues#clickup | a escrever |
| Servidores MCP › Instalados e Disponíveis (seleção de servidores oficiais) | mcp-servers#catalogo | a escrever |
| Servidores MCP › Buscar no registro oficial | mcp-servers#registro | a escrever |
| Servidores MCP › Adicionar manualmente | mcp-servers#manual | a escrever |
| Servidores MCP › Instalar, token e estado de cada servidor | mcp-servers#instalar | a escrever |
| Uso de IA › Alertas (gasto diário e mensal em USD) | usage-and-quota#alertas-de-gasto | coberto |
| Uso de IA › Fontes de uso | usage-and-quota#fontes-de-dados | coberto |
| Uso de IA › Abrir uso (a página Uso de IA) | usage-and-quota#gasto-estimado | coberto |
| Privacidade e rede › Privacidade (dados das sessões, integrações externas, telemetria) | privacy-and-network#privacidade | a escrever |
| Privacidade e rede › Chamadas de rede desde que o app abriu (Atualizar) | privacy-and-network#registro-de-rede | a escrever |
| Atalhos › Lista de todas as teclas, com busca | shortcuts#lista-completa | a escrever |
| Conta › Entrar, criar conta e sair | account-and-license#entrar | a escrever |
| Conta › E-mail, plano, assinatura e recursos do plano | account-and-license#plano-e-recursos | a escrever |
| Conta › Licença (validade, Atualizar licença) | account-and-license#licenca | a escrever |
| Conta › Ver planos | pro#assinar | a escrever |
| Sobre › Versão e sistema | settings#sobre | a escrever |
| Sobre › Pasta de dados (Mostrar no Finder) | settings#sobre | a escrever |
| Sobre › Procurar atualizações | updates#atualizar-no-app | a escrever |
| Sobre › Procurar atualizações automaticamente | updates#desligar-a-procura | a escrever |

## Mídia para a entrega 2

Vídeos de `public/changelog/` conferidos contra a interface da v0.13.0 e deixados de fora da entrega 1. Cada um precisa ser regravado para a página indicada.

| Vídeo | Página | Motivo |
|---|---|---|
| `0.1.0/projetos.mp4` | `projects-and-workspaces` | Gravado na interface da 0.9: a sessão não tem a barra de ferramentas da borda direita (0.10.0), o cabeçalho ainda tem o botão de abrir o painel, que saiu, e no lugar do botão do Quadro está o do Estúdio do projeto, da 0.9. |
| `0.1.0/restaurar.mp4` | `sessions-and-recovery` | Mesma interface da 0.9 atrás do relatório: sem a barra de ferramentas da sessão, com o botão de painel no cabeçalho e o botão do Estúdio do projeto no lugar do Quadro. O relatório em si bate com a 0.13.0. |
| `0.2.0/painel.mp4` | `sessions` | O painel lateral mudou na 0.10.0: as ferramentas eram abas no topo do painel e hoje ficam na barra vertical da borda direita, e o painel abria por um botão no cabeçalho que não existe mais. |
| `0.8.0/workspace-remoto.mp4` | `projects-and-workspaces` | A janela **Adicionar workspace** bate com a 0.13.0, mas o fundo mostra a sessão da 0.9 (sem a barra de ferramentas, com o botão de painel no cabeçalho) e o botão do Estúdio do projeto no lugar do Quadro. Basta regravar a mesma cena. |
| `0.1.0/uso.mp4` | `usage-and-quota` | Começa na sessão da 0.9 (sem a barra de ferramentas da borda direita, com o botão de painel no cabeçalho e o botão do Estúdio do projeto no lugar do Quadro) antes de abrir a página **Uso de IA**. A página em si bate com a 0.13.0; basta regravar a abertura. |
| `0.4.0/fila.mp4` | `queue` | A fila aparece no painel da 0.9: as ferramentas são abas no topo do painel, não a barra vertical da borda direita, o cabeçalho tem o botão de painel e a barra do topo tem o botão do Estúdio do projeto no lugar do Quadro. A fila em si (cabeçalho, **Próximos**, caixa com **Pôr na fila**) bate com a 0.13.0. |
| `0.4.0/pontos.mp4` | `restore-points` | Mesmo painel da 0.9 do vídeo da fila: abas no topo do painel em vez da barra da borda direita, botão de painel no cabeçalho e botão do Estúdio do projeto no lugar do Quadro. A lista de pontos bate com a 0.13.0. |
| `0.4.0/pasta-propria.mp4` | `worktrees` | Sessão da 0.9: sem a barra de ferramentas da borda direita, com o botão de painel no cabeçalho e o botão do Estúdio do projeto no lugar do Quadro. A marca `worktree` e a pasta em `~/.persist/worktrees` batem com a 0.13.0. |
| `0.5.0/contas.mp4` | `ai-accounts` | Atrás de Configurações, a sessão da 0.9 (botão de painel no cabeçalho, sem a barra da borda direita, botão do Estúdio do projeto). A tela **Contas de IA** também está desatualizada: com o rodízio desligado, falta a linha **Continuar a tarefa cortada pelo limite**, que na 0.13.0 aparece com ou sem rodízio. |
| `0.5.0/rodizio.mp4` | `ai-accounts` | A janela **Nova sessão** aparece sobre a sessão da 0.9 (botão de painel no cabeçalho, sem a barra da borda direita, botão do Estúdio do projeto). O campo **Conta do Claude** com **Automática · rodízio** bate com a 0.13.0; basta regravar a mesma cena. |
