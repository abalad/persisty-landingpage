---
title: Privacidade e registro de rede
description: O que fica na sua máquina, o que vai para fora, e como conferir cada chamada de rede do Persisty.
group: account
order: 2
---

O Persisty é local: projetos, sessões, histórico, notas e uso ficam num banco SQLite na sua máquina. Não há telemetria.

## O que nunca sai

Código, saída de terminal e prompts nunca saem da sua máquina pelo Persisty. Os agentes falam com os provedores deles como fariam sem o Persisty.

## O que sai, e por quê

O app só fala com fora para:

- ler a quota do Claude Code (`api.anthropic.com`), com a credencial que o Claude Code já guarda; o token não é gravado nem registrado;
- entrar na conta do Persisty Cloud e renovar a licença;
- falar com o GitHub, o GitLab ou o Bitbucket, nas integrações que você conectar;
- clonar, buscar, puxar e enviar commits no remoto dos seus repositórios git (a busca também acontece sozinha ao abrir e a cada 5 minutos com o app na tela, para mostrar o que falta puxar e enviar);
- procurar versões novas no GitHub, ao abrir, a cada 6 horas e quando você pede. Dá para desligar a procura automática em **Configurações › Sobre**.

## Registro de rede

Em **Configurações › Privacidade e rede**, cada chamada que o app fez desde que abriu aparece com destino, motivo, tamanho, resultado e hora. Cabeçalhos, corpo e parâmetros nunca são mostrados nem guardados. O registro zera ao fechar o app.

Mais detalhes em [Segurança](/security) e na [Política de privacidade](/privacy).
