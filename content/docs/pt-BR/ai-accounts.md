---
title: Contas de IA e rodízio
description: Conecte várias contas do Claude Code, acompanhe a quota de cada uma ao vivo, escolha a conta de cada sessão e deixe a fila esperar quando a quota acaba.
group: agents
order: 5
---

Em **Configurações › Contas de IA** ficam as contas do Claude Code deste computador: a que já estava logada e as que você conectar pelo Persisty. Sessões em contas diferentes rodam ao mesmo tempo, cada uma gastando a quota da sua conta.

## Contas conectadas

Cada conta aparece com o e-mail, a organização, o plano do Claude, quantas sessões estão abertas nela e as janelas de **5 h** e **7 d**. A conta que já estava no computador tem a marca **Este computador**. O mesmo e-mail em duas organizações aparece como duas contas. Uma conta sem login mostra **Sem login**, e uma quota que não deu para ler, **Quota indisponível**.

As barras vêm do mesmo lugar que o `/usage` do Claude Code, com a credencial que ele já guarda na máquina. O Persisty consulta no máximo uma vez por minuto por conta (o serviço recusa consultas mais frequentes) e mantém os últimos números na tela entre uma consulta e outra. Ver as contas e as quotas é do plano grátis.

## Conectar uma conta

Conectar outra conta é do Pro. Sem ele, **Conectar conta** fica desligado e você usa a conta deste computador.

1. Na linha **Outra conta**, clique em **Conectar conta**. Se quiser, escreva o e-mail em **E-mail da conta (opcional)**: ele só vem preenchido na tela de login. Depois clique em **Entrar pelo navegador**.
2. O Persisty roda o login do próprio Claude Code (`claude auth login`) para uma pasta só daquela conta, e o navegador abre.
3. Conclua o login no navegador. A conta aparece sozinha. Se o navegador mostrar um código em vez de voltar ao app, cole-o em **Código do navegador** e clique em **Enviar código**.

O Persisty nunca vê a sua senha nem guarda a credencial: quem guarda é o Claude Code.

Para tirar uma conta, use o botão de desconectar na linha dela e confirme em **Desconectar**. O Persisty roda o logout do Claude Code e apaga a pasta daquela conta; as sessões já abertas com ela seguem até você fechá-las.

Contas de IA avisa quando duas contas conectadas entraram com o mesmo e-mail. Isso acontece quando um `/login` feito dentro de uma sessão troca a conta sem o Persisty saber. Desconecte a repetida e conecte de novo a conta que ela tinha.

## O que as contas compartilham

O login e o histórico de prompts ficam separados por conta. Ajustes (`settings.json`), instruções (`CLAUDE.md`), agentes, comandos, skills, estilos de saída e plugins são os da conta deste computador, compartilhados com as outras.

As conversas e a memória de cada projeto também ficam numa pasta só, a `~/.claude/projects` da conta deste computador. Por isso uma sessão que troca de conta não perde nada, e o `/resume` de qualquer conta acha a conversa inteira. Uma conta que tinha uma pasta de conversas só dela foi juntada a essa uma vez, sem apagar nada: quando os dois lados tinham um arquivo diferente com o mesmo nome, um ficou e o outro foi para uma pasta de backup.

## Rodízio

Com o **Rodízio entre contas** ligado, cada sessão nova do Claude Code vai para a conta com mais folga, e a lista marca qual é a **Próxima no rodízio**. Na **Nova sessão**, o campo **Conta do Claude** vem com **Automática · rodízio**; escolha uma conta ali para abrir aquela sessão nela.

Em **Trocar de conta ao chegar em**, que aparece com o rodízio ligado, você escolhe o limite: 80%, 90% (o padrão), 95% ou **100% · só no limite**. Conta a janela mais cheia, a de 5 horas ou a de 7 dias. Uma conta nesse ponto fica de fora das sessões novas até renovar; se todas estiverem nele, vai a que renova primeiro.

Quando uma sessão chega ao limite que você escolheu, ela passa para outra conta com folga assim que a resposta termina e segue na mesma conversa. Se a sessão deixou um subagente ou um comando rodando, a troca espera esse trabalho terminar. O rodízio é do Pro.

## Trocar a conta de uma sessão

No Pro, clique no e-mail da conta, no rodapé da sessão, para ver as contas conectadas, cada uma com a janela de quota mais cheia, e escolher outra. Com o agente respondendo, o rodapé mostra **troca ao terminar a resposta** e a troca acontece quando a resposta termina. Como no rodízio, um subagente ou um comando deixado rodando faz a troca esperar. Num terminal comum, o próximo `claude` já abre na conta escolhida. No fim do menu, **Gerenciar contas…** leva a Contas de IA; com uma conta só, o item é **Conectar outra conta…**.

## Uma conta para um projeto

No Pro, nos ajustes do projeto, em **Conta do Claude**, prenda o projeto a uma conta, por exemplo a da empresa. As sessões dele só abrem nessa conta, nunca trocam para outra e, no limite, esperam a janela dela renovar. **Qualquer conta** solta o projeto.

Em **Configurações › Contas de IA**, **Usar só nos projetos fixados nela** reserva uma conta para os projetos presos a ela: o rodízio e os outros projetos deixam essa conta de lado. No menu do rodapé, uma conta que a sessão não pode usar aparece fechada, e passar o mouse diz por quê, como **Reservada para os projetos fixados nela**. A conta deste computador não pode ser reservada.

## Quando a quota acaba

Se a conta chega ao limite e não há outra com folga, o cabeçalho da sessão mostra "Sem quota · volta às 19:14 na conta …", e a fila de pedidos espera em todas as sessões daquela conta, mesmo com o app reaberto. Um turno que falha por erro do servidor da Anthropic também segura a fila daquela sessão, com **O último turno falhou:** e o motivo no cabeçalho. **Soltar a fila agora**, no topo da fila, deixa os pedidos daquela sessão andarem. Isso vale em qualquer plano, e um aviso diz quando a conta fica sem quota e quantas sessões esperam.

## Continuar a tarefa cortada

No Pro, com **Continuar a tarefa cortada pelo limite** ligado (em Contas de IA, com ou sem rodízio; vem ligado), a conversa cortada pelo limite continua sozinha. O Persisty digita "continue" depois de passar a sessão para outra conta ou, com o app aberto, quando a janela renova, uma vez por renovação, e as filas da conta voltam a andar. Se a hora passou com o app fechado, a retomada vem logo que ele abre. Um aviso diz quando cada sessão retoma; se você digitar antes, a retomada fica com você.

## Sobre usar várias contas

O Persisty não cria contas nem mexe em limites. Ele usa as contas que você já tem, como a pessoal e a da empresa, com o login do próprio Claude Code. Seguir os termos de cada conta continua com você.
