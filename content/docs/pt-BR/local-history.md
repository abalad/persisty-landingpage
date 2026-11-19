---
title: Histórico local
description: As versões que o editor guarda de cada arquivo, só neste computador, para ver o que mudou, voltar uma versão ou um trecho e recuperar um arquivo excluído.
group: code
order: 6
---

O editor guarda as versões de cada arquivo de texto da pasta da sessão, só neste computador. Com elas você vê quem mudou um arquivo e quando, compara com o texto de agora, volta uma versão inteira ou só um trecho e recupera um arquivo excluído, inclusive o que nunca entrou num commit.

## O que fica guardado

Uma versão nova entra quando você grava, quando um arquivo aberto muda fora do editor, como numa edição do agente, e antes de o Persisty renomear, mover, substituir, excluir ou descartar um arquivo. Também entra antes de **Renomear símbolo**, de uma ação de código ou de [**Substituir nos arquivos**](/docs/search#substituir-nos-arquivos) gravarem um arquivo fechado. **Descartar**, ao fechar uma aba, e **Recarregar** guardam antes o texto que não foi gravado.

Ficam de fora arquivos acima de 1 MB, arquivos que não são texto e o que está em `.git`, `node_modules`, `target`, `dist`, `build` e `.next`. O histórico nunca sai deste computador. Excluir um projeto apaga o histórico das pastas dele.

## Ver as versões de um arquivo

**Histórico local › Mostrar histórico**, no menu da [árvore](/docs/files#favoritos-e-histórico-local) ou da [aba](/docs/tabs-and-groups#o-menu-da-aba), abre uma aba com as versões do arquivo, da mais nova para a mais antiga. Cada linha diz quando a versão entrou e de onde veio: **Você, no editor**, **Fora do Persisty**, **Ao abrir**, ou o que o Persisty ia fazer, como **Antes de renomear** ou **Texto não gravado (Fechar)**. A lista traz também o **Último commit** do arquivo e os [pontos de restauração](/docs/restore-points) das sessões que o mudaram. As setas andam pela lista, e o diff mostra a versão escolhida contra o texto de agora.

Uma mudança feita por um agente vem com o nome da sessão quando o Persisty recebe os eventos dele, como no Claude Code. Sem esses eventos, como no Codex CLI por padrão, ela aparece como **Fora do Persisty**.

## Voltar uma versão ou um trecho

**Voltar a esta versão** troca o arquivo pela versão escolhida. O texto de agora é guardado antes, e um arquivo que mudou no disco nesse meio-tempo não é sobrescrito: o aviso diz que nada foi sobrescrito. Numa aba com alterações não gravadas, o editor pergunta antes e guarda essas alterações no histórico.

Cada trecho alterado do diff tem **Voltar este trecho**, que volta só aquele trecho e mantém o resto do texto de agora. **Próximo trecho** e **Trecho anterior** andam de um trecho a outro.

## Seleção e rótulos

Com linhas selecionadas no código, **Mostrar histórico da seleção**, no submenu da aba ou na paleta, lista só as versões em que essas linhas mudaram, lendo até as 200 versões mais novas.

**Colocar rótulo…** marca um momento com o nome que você der, e o rótulo aparece entre as versões. Ele vale para um arquivo, para uma pasta ou, pelo menu do espaço vazio da árvore, para o projeto inteiro.

## Recuperar um arquivo excluído

Numa pasta, **Mostrar histórico** lista o que mudou dentro dela no prazo guardado, com cada arquivo marcado como **Criado**, **Alterado** ou **Excluído**. Um clique num arquivo abre o histórico dele, e **Recuperar** traz de volta um arquivo excluído e o abre. Se outro arquivo já ocupa o nome, nada é substituído.

## Prazo e espaço

Em [**Configurações › Editor › Histórico local**](/docs/settings#editor), **Guardar por (dias)** vem em 5, de 1 a 30, e **Limite por pasta (MB)** vem em 200, de 50 a 2.000. Passando do limite, as versões mais antigas da pasta são apagadas. **Limpar o histórico local** apaga, depois de confirmar, as versões guardadas de todas as pastas; os arquivos em si não mudam, e isso não se desfaz.

## Plano e limites

O histórico local é do plano grátis.

Ele guarda só arquivos de texto de até 1 MB, dentro da pasta da sessão; numa aba de fora da pasta, o submenu diz "este arquivo está fora da pasta da sessão". As ações não têm tecla em nenhum mapa: ficam nos menus, na paleta e no grupo **Histórico local** de [**Configurações › Atalhos**](/docs/shortcuts#lista-completa).
