---
title: Segurança
description: Como o Persisty protege seus terminais, suas credenciais e sua conta, e o que ainda está por vir.
updated: 2026-10-29
---

O Persisty roda comandos com as suas permissões e abre agentes que usam ferramentas na sua máquina. Por isso cada decisão de segurança é tomada para não criar um caminho novo até o seu código.

## Na sua máquina

- **Sessões só suas.** Os terminais ficam num diretório só seu, acessível apenas pelo seu usuário. Não há porta de rede aberta.
- **Nada de shell montado com texto.** Comandos e caminhos são passados como argumentos, nunca como uma linha de shell, e a pasta é conferida antes de lançar.
- **Suas configurações intactas.** Os hooks do Claude Code entram por um arquivo próprio do Persisty, passado com `--settings`. O seu `~/.claude/settings.json` nunca é lido nem alterado, e o Persisty não edita os hooks do Codex.
- **Permissões dos agentes respeitadas.** O Persisty nunca passa opções que pulem os pedidos de permissão dos agentes.
- **Credenciais onde já estavam.** O login das contas de IA é feito pelo próprio Claude Code; a credencial fica com ele. O token usado para ler a quota não é gravado nem aparece em log, e só vai para `api.anthropic.com`.
- **Eventos não executam nada.** O que os agentes escrevem nos eventos só muda o estado mostrado na tela.
- **App e atualizações assinados.** No Mac, o app é assinado e notarizado pela Apple. Uma versão nova só é instalada se a assinatura dela conferir com a chave do Persisty que vem dentro do app.

## Na nuvem

- **Metadados, nunca código.** O Persisty Cloud não recebe código, saída de terminal nem prompts.
- **Acesso por linha.** Todas as tabelas têm regras de acesso por usuário (RLS), com testes que provam o que um membro, um administrador e um estranho conseguem ler e escrever.
- **Licença assinada.** A licença é assinada com Ed25519 e conferida pelo app sem rede. A chave privada nunca sai do servidor.
- **Registro de rede.** Cada chamada que o app faz aparece em **Configurações › Privacidade e rede**, sem cabeçalhos nem conteúdo.

## Em desenvolvimento e planejado

| Item | Situação |
| --- | --- |
| Instalador assinado no Windows | Planejado |
| Auditoria de dependências e vulnerabilidades no CI | Planejado |
| Auditoria de segurança externa antes do primeiro cliente grande | Planejado |
| Código-fonte disponível para auditoria no Enterprise, sob confidencialidade | Planejado |

## Encontrou um problema?

{{contact}}
