# Páginas por plano, menu de funcionalidades e Minha conta em painel

Data: 2026-11-02. Decidido com o usuário nesta conversa (esboços no companheiro visual: `onde-o-pro-vive`, `menu-e-paginas-de-plano`, `minha-conta`).

## Intenção

Quem compra o Pro já usa o grátis e **esbarrou num recurso Pro**: o app barrou e a pessoa quis aquilo. A decisão nasce desse bloqueio, não da home. Por isso o site precisa deixar inconfundível o que é de cada plano, mostrar cada recurso funcionando (a essência do site: "mostrar as funcionalidades de fato", com a janela do app) e convencer a assinar, sem virar página de vendas genérica.

Hoje o Pro cabe numa dobra da home (quatro abas com telas antigas), Minha conta lista recursos como etiquetas soltas (inclusive "Growth", que é só prévia no app) e oferece "Assinar o Team" para quem já é Pro sem explicar nada. O app, quando barra, diz só "Recurso do plano Pro. Entre na conta em Configurações › Conta."

## Decisões do usuário

1. **Enterprise sai do site** por enquanto, com toda referência visível. Volta "em outro momento"; o código fica pronto para religar.
2. **Menu "Funcionalidades" dividido por plano**, no jeito do menu do projeto KoraPoker (imagem que o usuário mandou): à esquerda os planos (Grátis, Pro, Team), no meio os recursos do plano escolhido com uma linha cada e "Ver tudo do <plano>", à direita um cartão com a tela de um recurso em destaque e uma frase.
3. **Uma página por plano** (Grátis, Pro, Team), "para trazer uma experiência mais profissional" e trabalhar melhor cada versão.
4. **A home continua mostrando alguns recursos Pro**, "semelhante ao que temos hoje".
5. **A comparação** existe na home e em cada página de plano; na página de um plano, a coluna dele fica em destaque.
6. **Quando o app barra um recurso, leva a pessoa direto à explicação daquele recurso no site** (o lado do app é feito pela sessão do app; este site define os endereços).
7. **Planejado aparece com o selo "Planejado"** nas páginas e no menu do Grátis, do Pro e do Team, usando o roteiro decidido com a sessão do app (`persist-application/docs/superpowers/specs/2026-11-02-plans-roadmap.md`).
8. **Minha conta vira painel com menu ao lado** (opção A do esboço). Precisa mostrar os recursos do plano e o porquê de assinar (Pro e Team), "mas não deixar perder sua essência que é mostrar as funcionalidades de fato", e ser "bem trabalhada para não parecer criada por IA".
9. A atualização dos docs com as novidades do app (0.8.0 e 0.9.0) é **trabalho separado, depois deste**.

## Objetivos

- Uma pessoa barrada no app chega ao trecho exato do recurso, entende em segundos o que ele faz, vê quanto custa e tem o botão de assinar ao lado.
- Em qualquer lugar do site fica claro de que plano é cada recurso.
- Minha conta mostra, para cada pessoa, o que o plano dela libera (com a tela de cada recurso e onde ele fica no app), o que vem por aí e por que subir de plano; e tem estrutura para receber relatórios de uso depois.

## Não objetivos

- Relatórios e métricas de uso em Minha conta (só a estrutura que os receba).
- Mudar preços, checkout, portal do Stripe ou regras de cobrança.
- Atualizar os docs (`content/docs/*`), salvo o que quebrar por causa de links novos.
- Telas novas (mockups) para os recursos grátis da 0.9.0 (voz, tarefas e issues, agentes que leem o Persisty): entram como itens de lista; mockup próprio fica para depois.
- Mudar o app. As mensagens de bloqueio com link são da sessão do app.

## Anti-objetivos (fracasso mesmo funcionando)

- **Parecer feito por IA.** Nada de degradê no topo, grade de cartões com ícone em quadradinho colorido, rótulo pequeno em maiúsculas acima de título, barra colorida grossa num lado do cartão, frases de efeito vazias, emoji. Vale o DESIGN.md inteiro ("The App on the Desk"): listas divididas por linhas finas dentro de um painel só, a janela do app carregando cada afirmação, um lima só para o que está vivo ou é ação.
- **Prometer o que não existe.** Nada planejado aparece como disponível; a fila nova "no jeito de chat" (no `main` do app, não lançada) não aparece; o **Persisty Runner fica fora do site** (promete sessões rodando sem a pessoa no computador, o que bate na regra de copy).
- **Quebrar a regra de copy:** nunca prometer que os agentes seguem trabalhando com o app fechado, nunca nomear o mecanismo (tmux, supervisor). `tests/copy.test.ts` cobra nos três idiomas. Windows e Linux são prévia.
- **Esconder o essencial atrás de venda:** cada página de plano é, antes de tudo, a demonstração dos recursos.

## Restrições

- Next.js 16 (App Router) com mudanças em relação ao que se conhece: ler o guia em `node_modules/next/dist/docs/` antes de escrever código (AGENTS.md).
- Três idiomas (pt-BR sem prefixo, en, es), textos em `messages/<locale>/*.json`; `tests/messages.test.ts` confere as chaves.
- Sem prettier; editar à mão no estilo vizinho.
- Publicação: mudança visual na home ou em páginas de recursos vai ao usuário com comparação antes/depois e os textos, antes de publicar. Push no `main` (deploy) só com ok explícito dele naquele momento. Este trabalho fica no branch `feat/plan-pages`.
- Fatos do produto (o que existe, em que plano, nomes de tela) vêm do app: `persist-application/CHANGELOG.md`, `apps/desktop/src/i18n/locales/pt-BR.json` e a sessão do app, que pode ser consultada por mensagem.

## O que existe hoje, por plano (fonte da verdade para listas, menu e tabela)

**Grátis, disponível:** projetos com vários workspaces; sessões persistentes; recuperação depois de travar ou reiniciar; estados dos agentes; editor (com pré-visualização de Markdown, contexto fixo, minimapa), alterações do git e notas; painel Git completo e integrações com GitHub, GitLab e Bitbucket; uso por sessão e quota de 5 h e 7 d ao vivo; registro de rede; sem conta e sem internet; notificações; ditado por voz; tarefas e issues (Linear, Jira, ClickUp, GitHub) com começar e concluir na issue; agentes que leem o Persisty (Claude Code).
**Grátis, planejado:** issue vira sessão; melhor de N; revisão cruzada ao terminar.

**Pro, disponível:** várias contas do Claude Code com rodízio (limite escolhido); fila de pedidos (quando o agente ficar livre, quando a janela de 5 h renovar, a partir de um horário); ponto de restauração a cada pedido; verificação ao terminar; pasta própria por sessão (git worktree); licença 14 dias offline em 5 aparelhos.
**Pro, planejado:** Persisty Remote (celular e web); piloto automático com regras; turno da noite; Raio-X da sessão. (Runner fora, ver anti-objetivos.)
**Growth:** prévia no app, sem nada conectado. Sai das listas de recursos liberados; não é anunciado.

**Team, disponível:** tudo do Pro para cada pessoa; cobrança por pessoa numa fatura só; assentos e convites por e-mail em Minha conta (sem e-mail de convite: o dono copia o link).
**Team, planejado:** painel do time ao vivo; orçamento e regras de modelo; observabilidade de gestão; memória do time; políticas com auditoria. Os nomes do roteiro substituem os antigos do site ("Quadro do time", "Gasto de IA por projeto", "Políticas com auditoria").

**Promessa mantida (decisão do usuário, depois da revisão):** o site continua dizendo "sem métrica individual de produtividade". A observabilidade de gestão é descrita por projeto e por PR (custo por PR mesclado, trabalho aceito e abandonado), sem citar medição por pessoa nem horas humanas.

Preços (já no código, `src/lib/pricing.ts`): Pro R$ 9,90 / US$ 4,90 por mês; Team R$ 19,90 / US$ 9,90 por pessoa por mês. `PRODUCT.md` ainda diz US$ 9.90 e "Stripe não ligado": corrigir junto.

## As partes, como foram decididas

### 1. Enterprise escondido

- Some de: cartões de planos e tabela (home e Preços), descrição da página de Preços, FAQ de Preços, seção "Para times e empresas" da home (o item "SSO, SCIM e instalação na empresa" sai e o botão "Fale com a gente" passa a levar à página do Team), Minha conta (bloco de interesse), tabela de planejados da página de Segurança (linha do código-fonte para auditoria no Enterprise).
- Política de privacidade: "e o interesse no Enterprise" vira "e os interesses que você registrar", porque os dados já guardados continuam existindo e precisam continuar descritos.
- Fica como está: a nota da versão 0.7.0 no changelog (registro histórico; o usuário não se opôs) e o código de intenção `interest=enterprise` no login (inalcançável pelo site, pronto para religar).
- No código, o plano continua definido; o que muda é a lista de planos que o site mostra. Religar deve ser trocar um valor.

### 2. Menu "Funcionalidades" por plano

- No desktop, "Funcionalidades" abre um painel grande sob a barra: coluna dos planos à esquerda (nome e uma linha), recursos do plano escolhido no meio (ícone Lucide, nome, uma linha), "Ver tudo do <plano> ›" no topo do meio, e à direita um cartão com a tela de um recurso daquele plano e uma frase.
- Planejados aparecem no meio com o selo "Planejado", depois dos disponíveis, ou ficam só na página do plano se não couberem; o cartão da direita é sempre de algo disponível.
- Cada item leva à página do plano, no trecho do recurso (`/pro#queue`, por exemplo).
- Abre por clique e por teclado (Enter/Espaço, setas entre planos, Esc fecha e devolve o foco); passar o mouse sobre um plano troca o meio. Fecha ao clicar fora e ao navegar.
- No celular (menu já recolhido abaixo de 1000px), "Funcionalidades" vira um grupo que abre com os três planos e os recursos de cada um.
- O menu do KoraPoker (`~/Documents/Projetos/KoraPoker`) é a referência de comportamento; o visual segue o DESIGN.md deste site.

### 3. Páginas de plano: `/free`, `/pro`, `/team`

Ordem de cada página:
1. **Topo:** nome do plano, preço (com "por mês" ou "por pessoa, por mês"), uma frase do que muda no dia, ação principal (Grátis: Baixar; Pro: Assinar o Pro; Team: Assinar o Team, que já abre nome do time e assentos) e ação secundária (Comparar planos, que rola até a tabela).
2. **Aviso de quem veio do app** (Pro): com `?tried=<recurso>` no endereço, a página rola até o trecho do recurso e aparece uma **barra fixa** logo abaixo do menu, que acompanha a rolagem: "Você tentou usar <recurso>. Ele é do Pro." com o preço e o botão Assinar o Pro, mais uma linha para quem já paga: "Já assina? Entre com a mesma conta no app, em Configurações › Conta." A barra pode ser fechada. Sem o parâmetro (ou com valor desconhecido), nada aparece. *(Decisão de quem constrói: a âncora tiraria de vista um aviso no topo; a barra fixa mantém aviso, preço e botão junto do recurso. Quem já paga e foi barrado, por estar sem conta no app, fora do prazo offline ou acima de 5 aparelhos, não é empurrado para uma segunda assinatura.)*
3. **Um trecho por recurso disponível,** no padrão das seções da home: cabeça em duas colunas (título e frase do problema que resolve à esquerda; o que faz, o selo do plano e o link para o doc à direita) sobre a janela do app mostrando o recurso. Cada trecho diz em uma linha o que muda entre o plano de baixo e este (por exemplo: "No grátis: um pedido de cada vez, na mão. No Pro: a fila manda o próximo quando der.").
4. **Vem aí:** lista dividida por linhas finas com os planejados do plano, cada um com o selo "Planejado" e uma frase.
5. **Comparação** dos planos com a coluna deste plano em destaque.
6. **Perguntas** do plano (as de Preços que se aplicam, e as que faltarem).
7. **Fecho** com a ação principal de novo.

**Quanto cada página mostra** *(decisões de quem constrói, depois da revisão)*:
- **`/pro`:** um trecho com janela para cada um dos cinco recursos (contas com rodízio, fila, pontos de restauração, verificação ao terminar, pasta própria). A licença offline entra numa lista curta "Também no Pro".
- **`/free`:** trechos com janela só onde a janela já existe: recuperação (que mostra as sessões persistentes), projetos, estados dos agentes, editor e git, privacidade (registro de rede). O resto entra numa lista dividida por linhas finas, "Também no grátis", cada item com âncora: uso e quota, integrações de git (GitHub, GitLab, Bitbucket), notificações, ditado por voz, tarefas e issues, agentes que leem o Persisty, sem conta e sem internet. Nenhuma janela nova nesta etapa.
- **`/team`:** só o que o Team acrescenta. Abre com "Tudo do Pro para cada pessoa", um resumo dos cinco recursos Pro que leva a `/pro`. Depois vem o trecho da cobrança do time. A cobrança acontece no site, não no app, então a demonstração é uma réplica do painel Time de Minha conta (assentos, pessoas, convite por e-mail), no mesmo estilo das janelas. Em seguida, os planejados e a privacidade do time ("metadados, nunca código", que vem da seção da home).

Âncoras dos recursos (estáveis, as mesmas nos três idiomas, porque o app depende delas):
- `/pro#accounts`, `/pro#queue`, `/pro#restore-points`, `/pro#verify`, `/pro#worktree`, `/pro#license`
- `/team#billing`, `/team#privacy`
- `/free#recovery`, `/free#projects`, `/free#states`, `/free#editor`, `/free#privacy`, `/free#usage`, `/free#git`, `/free#notifications`, `/free#voice`, `/free#issues`, `/free#agents`, `/free#offline`

Valores de `tried`: `accounts`, `queue`, `restore-points`, `verify`, `worktree` (Pro); outro valor é ignorado.

Telas: as janelas são as do site (HTML, texto real, traduzidas), **refeitas para bater com o app lançado (0.9.0)**: as atuais do Pro estão desatualizadas. A fila mostrada é a da 0.9.0; quando a fila nova sair, a tela é trocada.

### 4. Home

- Continua com os recursos Pro que já mostra (contas com rodízio; a seção do Pro com as telas refeitas), agora com o selo Pro e um link "Ver tudo do Pro" para `/pro`.
- Toda seção da home que mostra algo Pro leva o selo.
- A seção de preços da home ganha a tabela de comparação (sem destaque de coluna) além dos cartões, com três planos.
- "Para times e empresas" fica sem o item de SSO e com o botão para `/team`. Os itens planejados passam a usar os nomes do roteiro, e a promessa "sem métrica individual de produtividade" continua.

### 5. Comparação

- Um componente só, usado na home, em Preços e nas três páginas de plano; recebe o plano em destaque (ou nenhum).
- Mostra os três planos. As linhas vêm da lista "o que existe hoje, por plano" acima, com o selo "Planejado" onde couber.

### 6. Minha conta em painel

- **Menu ao lado** (no celular, abas no topo que rolam de lado): Visão geral; Plano e cobrança; Time (só para quem tem ou teve time); Dispositivos (com "n de 5"); Avisos de versão. Cada item tem endereço próprio, para o voltar do navegador e para links (o app pode mandar direto a uma parte).
- **Visão geral:**
  - O plano em destaque: nome, estado (ativo, termina em, pagamento pendente), preço, data, "Gerenciar assinatura" (ou "Ver planos" no grátis).
  - **O que o seu plano libera:** os recursos disponíveis do plano, cada um com uma pequena tela do recurso (recorte da janela do app, não ícone), onde fica no app e "Como usar ›" levando ao trecho da página do plano. Num painel com linhas finas, não numa grade de cartões soltos.
  - **Vem aí no <plano>:** os planejados, com o selo.
  - **O convite para o plano de cima:** no grátis, os recursos do Pro como "o que você ganha" e Assinar o Pro; no Pro, o Team (o que acrescenta, preço por pessoa, Conhecer o Team); no Team, nada a vender.
- **Plano e cobrança:** o que hoje é o bloco Plano (inclusive a assinatura pessoal paralela à do time e o portal de cada uma) e o assinar quando fizer sentido (grátis assina Pro ou Team; Pro pode assinar Team; ninguém vê "Assinar" do próprio plano).
- **Time:** o que hoje é Times (membros, convites, assentos, times com assinatura vencida e "Assinar de novo").
- **Dispositivos** e **Avisos de versão:** o que já existe, no novo lugar.
- Os estados atuais continuam funcionando: carregando, erro ao carregar, volta do checkout com espera pelo plano, volta do portal, pagamento pendente, assinatura que termina, membro de time sem gerenciar, dono de time, assinatura pessoal junto com a do time.
- Relatórios de uso não entram agora; o menu recebe um item novo quando existirem. Para os relatórios, o app teria de mandar números de uso à nuvem do Persisty (não código, saída nem pedidos), e isso tem de aparecer no registro de rede e na política de privacidade: é decisão para quando forem desenhados.

### 7. Ligação com o app

Ao aprovar, a sessão do app recebe os endereços: `https://persisty.app[/en|/es]/pro?tried=<recurso>#<recurso>` para cada mensagem de bloqueio, e `/account` (e suas partes) para "Configurações › Conta". O app escolhe o idioma pelo seu próprio.

## O que fica com quem constrói

- Rotas e estrutura de código das páginas de plano e do painel (layout compartilhado ou outra forma), desde que cada parte de Minha conta tenha endereço próprio e os dados carreguem uma vez.
- O desenho fino (seguindo o DESIGN.md e a skill impeccable), os textos nos três idiomas (no tom do site: simples, específico, honesto), os ícones Lucide de cada item, qual recurso vai no cartão da direita do menu.
- As pequenas telas de cada recurso em Minha conta: recortes das janelas já existentes ou versões reduzidas delas.
- A redação das perguntas de cada plano.
- Atualizar `PRODUCT.md`, `DESIGN.md` e testes conforme o que mudar.
- Sitemap, metadados e imagem de compartilhamento das páginas novas.

## Pronto quando

- `pnpm lint`, `pnpm test` e `pnpm build` passam.
- As páginas `/free`, `/pro`, `/team` existem nos três idiomas, com âncoras e `?tried=` funcionando.
- Nenhum "Enterprise" visível no site fora do changelog histórico.
- Minha conta em painel cobre os estados listados.
- O usuário recebeu a comparação antes/depois (home, Preços, Minha conta, menu) e os textos, para aprovar antes de publicar.
