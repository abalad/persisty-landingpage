---
title: Comandos do workspace
description: Os comandos que o Persisty encontra na pasta do workspace e os seus, para rodar com uma tecla e ver a saída de cada um numa aba abaixo do terminal.
group: code
order: 11
---

Cada workspace tem os seus comandos, como `pnpm dev` ou `cargo test`, num seletor ao lado das abas das sessões. Um comando roda num terminal à parte, na pasta do workspace, e a saída fica numa aba abaixo do terminal da sessão.

## Escolher o comando

O seletor mostra o nome do comando escolhido, ou **Sem comandos**. Um clique abre a lista do que o Persisty encontra na raiz da pasta: os scripts do `package.json` (com o pnpm, o yarn, o bun ou o npm, conforme o lockfile), o Cargo, os alvos do Makefile, o Gradle, o Maven, o Go, o Python (o `manage.py` do Django ou o `pytest`) e o Docker Compose. Ele só lê os arquivos; nada roda para descobrir.

Comandos que não aparecem ali entram por **Adicionar comando…**: escreva o **Comando** e, se quiser, um **Nome**; vazio, o nome é o próprio comando. Eles ficam em **Meus comandos**, e a lixeira ao lado de cada um o remove.

## Executar

O botão de play ao lado do seletor, ou <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>E</kbd> fora do código, executa o comando escolhido e abre a saída. Enquanto ele roda, o mesmo botão e a mesma tecla param o comando.

Ao lado do seletor, o estado aparece escrito: **Executando**, **Concluído**, **Falhou · código N**, **Parado** ou **Encerrado**. Um clique nele abre ou recolhe a saída.

## A saída do comando

![No menu de comandos do workspace, test e depois dev são executados; cada um ganha uma aba na Saída do comando, abaixo do terminal, e a aba de test termina com Falhou · código 1 e Executar de novo.](/docs-media/commands/comandos.mp4)

A **Saída do comando** fica abaixo do terminal da sessão, com uma aba por comando executado e um ponto com o estado de cada um. <kbd>⌘</kbd> <kbd>E</kbd> fora do código, ou a seta no canto, abre e recolhe a saída; recolhida, ela continua mostrando as abas.

Enquanto o comando roda, a aba mostra o terminal dele, ao vivo. Depois que ele termina, a aba mostra as últimas 400 linhas, com **Executar de novo**. Executar o mesmo comando outra vez troca a aba antiga pela nova, e o **×** de uma aba terminada a fecha.

## Parar

**Parar** manda Ctrl-C ao comando, como no terminal, e mantém a saída. Se ele não parar em 5 segundos, é encerrado, e o que ele escreveu até ali fica guardado. Um comando parado por você aparece como **Parado**, nunca como **Falhou**.

## Plano e limites

Os comandos do workspace são do plano grátis. **Verificar ao terminar com** e o nome do comando, no mesmo seletor, é do [Pro](/docs/pro); veja [Verificar ao terminar](/docs/verify).

O Persisty só procura comandos na raiz da pasta do workspace, não em subpastas. No Windows e no Linux, que estão em prévia, use <kbd>Ctrl</kbd> no lugar de <kbd>⌘</kbd>.
