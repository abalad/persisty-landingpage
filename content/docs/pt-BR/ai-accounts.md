---
title: Contas de IA e rodízio
description: Conecte várias contas do Claude Code, acompanhe a quota de cada uma ao vivo, escolha a conta de cada sessão e deixe a fila esperar quando a quota acaba.
group: work
order: 1
---

Em **Configurações › Contas de IA** ficam as contas do Claude Code deste computador: a que já estava logada e as que você conectar pelo Persisty. Cada uma mostra organização, plano e as janelas de **5 horas** e **7 dias**. O mesmo e-mail em duas organizações aparece como duas contas, com o nome da organização ao lado.

## Conectar uma conta (Pro)

Conectar outra conta é recurso do plano Pro. Sem ele, **Conectar conta** fica desligado e você usa a conta deste computador.

1. Em Contas de IA, na linha **Outra conta**, clique em **Conectar conta**. Se quiser, escreva o e-mail da conta (é opcional: ele só vem preenchido na tela de login) e clique em **Entrar pelo navegador**.
2. O Persisty roda o login do próprio Claude Code (`claude auth login`) para uma pasta só daquela conta, e o navegador abre.
3. Conclua o login no navegador. A conta aparece sozinha. Se o navegador mostrar um código em vez de voltar ao app, cole-o em **Código do navegador** e clique em **Enviar código**.

O Persisty nunca vê a sua senha nem guarda a credencial: quem guarda é o Claude Code. O login e o histórico de prompts ficam separados por conta. Ajustes (`settings.json`), instruções (`CLAUDE.md`), agentes, comandos, skills, estilos de saída e plugins são compartilhados com a conta deste computador, e as conversas e a memória do projeto também: o `/resume` de qualquer conta acha a conversa inteira.

Para tirar uma conta, use **Desconectar**: o Persisty roda o logout do Claude Code e apaga a pasta daquela conta. Contas de IA avisa quando duas contas conectadas entraram com o mesmo e-mail, o que acontece quando um `/login` é feito dentro de uma sessão.

## Quota ao vivo

As barras de 5 h e 7 d vêm do mesmo lugar que o `/usage` do Claude Code, com a credencial que ele já guarda na máquina. O Persisty consulta no máximo uma vez por minuto por conta (o serviço recusa consultas mais frequentes) e mantém os últimos números na tela entre uma consulta e outra.

## Rodízio (Pro)

Com o **Rodízio entre contas** ligado, cada sessão nova do Claude Code vai para a conta com mais folga. Conta a janela mais cheia, a de 5 horas ou a de 7 dias. Em **Trocar de conta ao chegar em** você escolhe o limite: 80%, 90% (o padrão), 95% ou **100% · só no limite**. Uma conta nesse ponto fica de fora das sessões novas até renovar; se todas estiverem nele, vai a que renova primeiro. Na Nova sessão, o campo **Conta do Claude** vem com **Automática · rodízio**.

Quando uma sessão chega ao limite que você escolheu, ela passa para outra conta com folga assim que a resposta termina e continua a mesma conversa. Se a sessão deixou um subagente ou um comando rodando, a troca espera esse trabalho terminar.

## Trocar a conta de uma sessão (Pro)

Clique no e-mail da conta, no rodapé da sessão, para ver as contas conectadas, cada uma com a janela de quota mais cheia, e escolher outra. Com o agente respondendo, a troca acontece quando a resposta termina. Num terminal comum, o próximo `claude` já abre na conta escolhida.

## Uma conta para um projeto (Pro)

Nas configurações do projeto, em **Conta do Claude**, prenda o projeto a uma conta, por exemplo a da empresa. As sessões dele só abrem nessa conta, nunca trocam para outra e, no limite, esperam a janela dela renovar.

Em **Configurações › Contas de IA**, **Usar só nos projetos fixados nela** reserva uma conta para os projetos presos a ela: o rodízio e os outros projetos deixam essa conta de lado, e o rodapé mostra por quê. A conta deste computador não pode ser reservada.

## Quando a quota acaba

Se a conta chega ao limite e não há outra com folga, o cabeçalho da sessão mostra "Sem quota · volta às 19:14 na conta …", e a fila de pedidos espera em todas as sessões daquela conta, mesmo com o app reaberto. Um turno que falha por erro do servidor da Anthropic também segura a fila daquela sessão, com o motivo no cabeçalho. **Soltar a fila agora**, no topo da fila, deixa os pedidos andarem. Isso vale em qualquer plano.

No Pro, com **Continuar a tarefa cortada pelo limite** ligado (em Contas de IA, com ou sem rodízio; vem ligado), a conversa cortada continua sozinha: o Persisty digita "continue" depois de passar a sessão para outra conta ou, com o app aberto, quando a janela renova, uma vez por renovação, e as filas da conta voltam a andar. Se a hora passou com o app fechado, a retomada vem logo que ele abre. Um aviso diz quando a conta fica sem quota e quando cada sessão retoma; se você digitar antes, a retomada fica com você.

## Sobre usar várias contas

O Persisty não cria contas nem mexe em limites. Ele usa as contas que você já tem, como a pessoal e a da empresa, com o login do próprio Claude Code. Seguir os termos de cada conta continua com você.
