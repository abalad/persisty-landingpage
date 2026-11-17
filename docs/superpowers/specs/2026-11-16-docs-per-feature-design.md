# Documentação completa, uma página por recurso

Data: 2026-11-16. Decidido com o usuário nesta conversa.

## Intenção

O usuário pediu "a documentação completa de todas as versões que subimos, pois tem muita coisa não documentada, se possível adicionando imagens/gifs".

Situação hoje (site main 629c6c4):
- As docs em persisty.app/docs têm 12 páginas. Uma auditoria de 2026-11-16 corrigiu o que estava escrito contra o app 0.13.0, mas não fez um levantamento do que falta: muita coisa que saiu não tem doc.
- O CHANGELOG.md do app tem 194 itens, da 0.1.0 à 0.13.0.
- As docs não têm nenhuma imagem.

Quem lê são pessoas que usam o Persisty e querem saber como uma coisa funciona, onde ela fica e se é do grátis ou do Pro.

## Decisões do usuário

1. **Uma página por recurso**, cerca de 30, no lugar de ampliar as 12 atuais.
2. **Duas entregas (caminho 2):**
   - **Entrega 1:** o inventário, o texto de todas as páginas e os vídeos que já existem.
   - **Entrega 2:** os vídeos e imagens novos, gravados do app.
3. **Vídeos no mesmo padrão do changelog:** uma gravação por cena, com o app em português, usada nas páginas dos três idiomas. Só a descrição para leitores de tela (alt) é escrita nos três idiomas. Num vídeo em português, uma página em inglês cita os rótulos em inglês; isso é aceito e não conta como desencontro com a interface.
4. Como sempre, os três idiomas (pt-BR, en, es). Cada publicação mostra o antes e depois ao usuário e só sai com o ok dele.

## Abordagens consideradas

| | Como | Troca | |
|---|---|---|---|
| 1. Tudo de uma vez | Inventário, texto e todos os vídeos, numa publicação só | Mais completo, mas o usuário só vê resultado no fim | descartada |
| **2. Duas entregas** | Texto e vídeos existentes primeiro, gravações novas depois | O texto chega antes, e a gravação, a parte mais incerta, não segura o resto | **escolhida** |
| 3. A partir do changelog | Reescrever os itens do changelog em páginas, sem conferir no código | Rápido, mas repete os erros que a auditoria de 16/11 achou | descartada |

Ampliar as 12 páginas também foi considerado e descartado. É menos trabalho e preserva os links, mas as páginas ficam longas demais (a do editor já tem oito seções), e fica difícil ver o que falta.

## Objetivos

- **Todo recurso visível ao usuário** que saiu da 0.1.0 à 0.13.0 tem lugar numa página. A página diz:
  - o que ele faz;
  - como usar;
  - onde fica no app, com os nomes exatos da interface;
  - as teclas, por mapa de teclas e por plataforma, quando diferem;
  - se é grátis ou Pro;
  - os limites.
- **Toda tela de Configurações** e cada opção dela estão documentadas, com o padrão.
- **Um inventário versionado** liga cada item do changelog do app e cada tela de configurações à página e seção que o cobre. É ele que torna "completa" verificável, e cada versão nova o atualiza (veja a regra de lançamento no fim).
- **Cada afirmação é conferida no código do app na tag v0.13.0.** Se sair outra versão durante o trabalho, a base passa a ser a tag mais nova publicada.
- **Imagens e vídeos:**
  - entrega 1: os 24 vídeos do changelog que ainda batem com a interface da 0.13.0;
  - entrega 2: gravações novas onde o movimento explica (arrastar, fila andando, restaurar) e imagens paradas onde basta ver a tela (configurações).

## Não-objetivos

- **Docs por versão.** O changelog já faz isso.
- **Recurso planejado ou não lançado.** O Persisty Remote e o app de celular ficam fora, e qualquer outro item que não esteja numa versão publicada.
- **Mudar o app.** Bugs do app achados no caminho viram uma lista para o usuário, como `editor.openIn.noIde`, que aponta para "Configurações › Geral".
- **Reescrever as páginas de venda** (home, /free, /pro). Mudam só os links delas que apontam para docs que trocaram de endereço.

## Anti-objetivos

O trabalho falha, mesmo pronto, se:
- uma página prometer o que o app não faz, ou copiar o changelog sem conferir no código;
- as páginas virarem listas de rótulos em negrito ou texto genérico, sem os nomes reais da interface;
- um vídeo mostrar uma interface que não é a da 0.13.0. Os vídeos antigos (0.1.0…) podem mostrar telas que mudaram;
- um link existente para as docs quebrar: buscadores, as páginas do site ou o próprio app.

## Regras de texto

Valem as do site:
- nunca prometer que agentes, a fila, o mascote ou o Quadro funcionam com o app fechado;
- nunca citar tmux nem supervisor, AgentDeck, Tina nem GitToolBox;
- Remote e o app de celular são planejados e ficam fora;
- Windows e Linux são prévia, e o mascote fora do app é só macOS;
- planejado não é disponível.

Estilo:
- prosa curta e direta;
- rótulos do app em negrito, exatamente como aparecem: pt-BR do `pt-BR.json`, en do `en.json`. O app não tem espanhol: em es, o nome em espanhol vai em negrito com o rótulo em inglês em itálico entre parênteses, como as páginas já fazem;
- inglês britânico;
- teclas em `<kbd>`.

## Estrutura proposta

Seis grupos e cerca de 32 páginas. O construtor ajusta depois do inventário: juntar páginas pequenas, dividir uma que crescer demais.

| Grupo | Páginas (slug) |
|---|---|
| Começar (`start`) | Primeiros passos (`getting-started`) · Projetos e workspaces (`projects-and-workspaces`) · Sessões e terminais (`sessions`) · Voltar depois de travar (`sessions-and-recovery`) |
| Agentes (`agents`) | Agentes e estados (`agents`) · Quadro (`board`) · Mascote (`mascot`) · Notificações (`notifications`) · Contas de IA e rodízio (`ai-accounts`) · Uso, custo e quota (`usage-and-quota`) · Fila de pedidos (`queue`) · Pontos de restauração (`restore-points`) · Pasta própria (`worktrees`) · Verificar ao terminar (`verify`) |
| Código (`code`) | Editor (`editor`) · Arquivos (`files`) · Abas e grupos (`tabs-and-groups`) · Git no editor (`git-in-the-editor`) · Alterações e commits (`changes`) · Busca (`search`) · Notas (`notes`) · Comandos do workspace (`commands`) |
| Integrações (`integrations`) | Issues: Linear, Jira, ClickUp e GitHub (`issues`) · GitHub, GitLab e Bitbucket (`forges`) · Servidores MCP (`mcp-servers`) · Ditado por voz (`voice`) |
| Conta (`account`) | Planos e recursos do Pro (`pro`) · Conta e licença (`account-and-license`) · Privacidade e rede (`privacy-and-network`) · Atualizações (`updates`) |
| Referência (`reference`) | Atalhos (`shortcuts`) · Configurações, tela por tela (`settings`) · Problemas e limitações (`troubleshooting`) |

`pro` vira um índice curto dos recursos do Pro, com link para a página de cada um. A única página antiga que muda de endereço é `editor-and-git`, que passa a ser `editor`. Âncoras antigas, como `#mapa-de-teclas`, não sobrevivem a um redirecionamento; os links internos que as usam são atualizados.

Cada página segue a mesma ordem: o que é (uma ou duas frases), como usar, onde fica e as opções, as teclas, grátis ou Pro, e os limites. Um vídeo ou imagem vem logo depois da abertura, quando houver.

## Como o site funciona hoje (o que o trabalho toca)

- **Páginas:** `content/docs/<locale>/<slug>.md`, com frontmatter `title`, `description`, `group` e `order`. Os grupos são `DOC_GROUPS` em `src/lib/content.ts` (hoje `start`, `work`, `account`, `reference`), com os nomes em `messages/<locale>/docs.json` › `groups`.
- **Vídeos e imagens:**
  - um `![descrição](/caminho/x.mp4)` sozinho no parágrafo vira um vídeo mudo em loop sobre a capa `x.jpg` ao lado (`rehypeClips`);
  - um `.jpg` ou `.webp` vira imagem comum. Conferir que o CSS das docs dá a ela o mesmo acabamento dos vídeos.
- **Redirecionamentos:** `next.config.ts` não tem nenhum. Acrescentar `redirects()` para `editor-and-git` → `editor` nos três prefixos de idioma (`/docs/…`, `/en/docs/…`, `/es/docs/…`).
- **Sitemap e navegação:** vêm de `listDocs` sozinhos.
- **Testes** (`tests/content.test.ts`): a primeira página é `getting-started`, os grupos pertencem a `DOC_GROUPS` e os três idiomas têm as mesmas páginas. Atualizar o que mudar.
- **Links para as docs:** procurar e corrigir em `content/docs`, `content/changelog`, `messages/*` e `src/`. Procurar também no app (`git -C ../persist-application grep persisty.app/docs v0.13.0`): um link do app para uma âncora ou página que muda precisa de redirecionamento, ou fica numa lista para o usuário.

## Mídia

- **Vídeos existentes:** `public/changelog/<versão>/<nome>.mp4` + `.jpg`, 24 no total (0.1.0 a 0.5.0, 0.8.0, 0.9.0 e 0.10.0). Cada um é conferido contra a interface da 0.13.0 antes de entrar numa página. Um vídeo desatualizado fica de fora na entrega 1 e é regravado na entrega 2.
- **Gravações novas (entrega 2):**
  - **Ferramenta:** o gravador do próprio app, `scripts/media/record.mjs`, conduz o modo demonstração (`ipc.mock`, dados inventados), desenha o cursor e as teclas e grava MP4 com capa JPG.
  - **Onde rodar:** num worktree do app na tag v0.13.0, para que a interface seja a lançada, com o servidor de desenvolvimento do desktop rodando.
  - **Comando:** `node scripts/media/record.mjs --clips <módulo> --out <site>/public/docs`.
  - **Onde ficam as cenas:** as descrições das cenas moram no repositório do site, em `scripts/docs-media/`, versionadas com as docs. Nada é commitado no repositório do app.
  - **Imagem parada:** a capa de uma gravação curta.
  - **Cena que o modo demonstração não monta:** vira imagem parada ou fica sem mídia, e entra numa lista para o usuário. Não se muda o app para isso.
- **Mascote fora do app:** só se grava num Mac real. Usar o vídeo aprovado `public/changelog/0.10.0/mascote.mp4` e a imagem `public/art/mascot-asking.webp`, sem dizer que as janelas são telas reais.
- **Idioma:** como no changelog, cada cena é gravada uma vez, com o app em português, e serve às páginas dos três idiomas (decisão 3).
- **Acessibilidade e tamanho:**
  - todo vídeo tem descrição (alt) nos três idiomas;
  - o vídeo segue as regras do `ClipPlayer`: respeita quem reduz movimento, toca quando visível e mantém tamanho e duração parecidos com os do changelog (6 a 12 s).

## Entregas

**Entrega 1: texto completo**
1. **Inventário** (`docs/docs-coverage.md`, versionado):
   - cada item do CHANGELOG do app de 0.1.0 a 0.13.0 e cada tela e opção de Configurações, com a página e a seção que o cobrem;
   - itens sem efeito visível ao usuário marcados como "sem doc" e o motivo.
2. **Grupos e navegação:** os seis grupos, `DOC_GROUPS`, os nomes nos três idiomas, o redirecionamento e os links atualizados.
3. **Páginas:**
   - todas as páginas em pt-BR, en e es, escritas a partir do código da v0.13.0, aproveitando o texto já corrigido das páginas atuais;
   - os vídeos existentes que ainda batem com a interface.
4. **Revisão independente:** um revisor só de leitura por grupo compara cada página com o código, como na auditoria de 16/11. O que ele achar é corrigido.
5. **Publicação:**
   - testes, checagem de tipos, todas as páginas abrindo nos três idiomas e os redirecionamentos funcionando;
   - antes e depois para o usuário (a lista de páginas e algumas páginas de exemplo) e publicação com o ok dele.

**Entrega 2: mídia nova**
1. Um plano de mídia por página: vídeo, imagem parada ou nada, e por quê.
2. Gravar no worktree do app na v0.13.0.
3. Conferir cada vídeo, pôr nas páginas nos três idiomas e conferir o peso das páginas.
4. Antes e depois, e publicação com o ok do usuário.

## Regra de lançamento depois disto

A cada versão, no mesmo envio do changelog:
- o inventário ganha os itens novos;
- as páginas afetadas são atualizadas nos três idiomas;
- uma gravação nova entra quando o recurso pede.

Isso está registrado na memória `release-updates-docs`.

## Decisões tomadas por mim (o usuário pode corrigir)

- **Pro e Team:** os recursos pagos são os mesmos no Pro e no Team. As páginas dizem "Pro", e a página `pro` explica que o Team inclui tudo.
- **Remote:** as opções do Persisty Remote ficam escondidas atrás de uma prévia no app e ficam fora de "Configurações, tela por tela".
- **Links do app:** o app só aponta para a raiz `/docs`, então o único redirecionamento necessário é o de `editor-and-git`.
- **Vídeos em vez de GIF:** MP4 em loop, porque fica menor, tem capa e respeita quem reduz movimento.

## O que fica para quem constrói

- Os limites exatos de cada página depois do inventário, os títulos e a ordem dentro dos grupos.
- Quais vídeos existentes servem.
- As cenas das gravações.
- O texto das descrições dos grupos.
- Dividir o trabalho entre agentes. Cada agente escreve só nos seus arquivos, no worktree `docs-per-feature`, e confere no código pela tag (`git show v0.13.0:…`), nunca pela pasta principal do site, que fica em outro branch.
