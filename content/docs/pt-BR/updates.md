---
title: Atualizações
description: Como o Persisty procura e instala versões novas, o que acontece com as sessões abertas e onde baixar cada versão.
group: account
order: 4
---

O Persisty procura versões novas sozinho e instala a nova quando você clica. A procura e o download vêm do repositório de versões do Persisty no GitHub, e cada um aparece em [Privacidade e rede](/docs/privacy-and-network).

## Atualizar no app

A procura automática roda meio minuto depois de o app abrir e, depois, a cada 6 horas com ele aberto. Quando há uma versão nova, um aviso aparece no canto de baixo, à direita, com o número dela, como "Persisty 0.13.0 disponível", e a versão que você usa. **Novidades** abre no navegador o que mudou nessa versão. **Instalar e reiniciar** baixa a atualização mostrando o progresso, confere a assinatura do arquivo, instala e abre o Persisty na versão nova.

Para procurar na hora, clique em **Procurar atualizações** em [**Configurações › Sobre**](/docs/settings#sobre). A linha passa a dizer "Procurando…" e depois "Você está na versão mais recente" ou a versão nova, com **Instalar e reiniciar** ao lado. Se não der para procurar, ela diz "Não deu para procurar agora". A procura automática que falha não mostra nada e tenta de novo na próxima vez.

O botão de fechar do aviso, **Dispensar esta versão**, esconde o aviso daquela versão; o da seguinte aparece normalmente. A versão dispensada continua em **Configurações › Sobre**, para instalar quando você quiser.

Se o download passar 30 segundos sem receber nada, ele desiste. Quando a instalação falha, o aviso mostra **Não deu para instalar:** com o motivo e troca o botão por **Baixar**, que abre a [página de download](/download).

## As sessões abertas

No Mac, o app instala e reinicia sem perguntar nada, e os processos das sessões abertas não são encerrados: ao abrir, o Persisty reanexa o terminal de cada uma ao processo dela, como em [Voltar depois de travar](/docs/sessions-and-recovery#ao-abrir-o-persisty).

No Windows e no Linux, que estão em prévia, instalar pode encerrar as sessões abertas. Com alguma aberta, o app pergunta antes: **Instalar a nova versão agora?** diz quantas sessões podem ser encerradas, e **Instalar mesmo assim** segue. Ao abrir, as que caíram voltam conforme a [regra de cada uma](/docs/sessions-and-recovery#quando-relançar).

## Desligar a procura automática

**Procurar atualizações automaticamente**, em **Configurações › Sobre**, vem ligado. Desligado, o app só procura quando você clica em **Procurar atualizações**. Cada procura e cada download aparecem no [registro de rede](/docs/privacy-and-network#registro-de-rede), com uma linha para cada servidor por onde passaram.

## Windows e Linux

Windows e Linux estão em prévia: o app sai sem assinatura e ainda não foi testado em máquinas reais. No Windows, o instalador da atualização roda sem fazer perguntas e fecha o Persisty sozinho para trocar os arquivos.

No Linux, só o AppImage se atualiza pelo app. Instalado pelo pacote `.deb`, o aviso e **Configurações › Sobre** mostram **Baixar** no lugar de **Instalar e reiniciar**, e a versão nova vem da página de download. O `.deb` instala ao lado dos programas que o sistema já tem, sem conflito de nomes.

## Baixar

A [página de download](/download) oferece a versão mais recente de cada sistema: no Mac, um DMG universal, para Apple Silicon e Intel, assinado e notarizado pela Apple; no Windows, um instalador `.exe` (x64); no Linux, o AppImage e o pacote `.deb` (x64).

[Todas as versões](/download/versions) lista cada versão, da mais nova para a mais antiga, com a data, o tamanho e o SHA-256 de cada arquivo. Para conferir um download, compare o SHA-256 com o que mostra `shasum -a 256 nome-do-arquivo` no Mac e no Linux, ou `Get-FileHash nome-do-arquivo` no PowerShell do Windows.

## Novidades e aviso por e-mail

O [changelog](/changelog) diz o que mudou em cada versão e tem um feed RSS em cada idioma. Em **Configurações › Sobre**, **Abrir**, na linha **Novidades**, abre essa página. Para receber um e-mail quando sair uma versão nova, ligue o aviso em [Minha conta](/account), em **Avisos de versão**.

## Plano e limites

Atualizar é do plano grátis e não pede conta. A procura e a instalação só acontecem com o Persisty aberto, e nada se instala sem você clicar. O app pede macOS 12 ou mais novo; foi testado em Apple Silicon e, no Intel, deve funcionar.
