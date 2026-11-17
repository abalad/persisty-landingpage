---
title: Mascote
description: O mascote no canto do terminal acompanha o agente da sessão; no macOS, ele também sai do app e avisa por cima das suas janelas.
group: agents
order: 3
---

O mascote fica no canto do terminal da sessão e reage ao que o agente faz. No macOS, ele também pode sair do app e ficar em pé sobre as suas janelas, para avisar quando uma sessão precisa de você.

![O mascote anda sobre o topo de uma janela e chega à borda dela.](/changelog/0.10.0/mascote.mp4)

## No terminal

O mascote acompanha a sessão em foco: sobe quando há algo pendente, como um pedido de permissão, comemora quando um turno termina e lamenta quando o processo da sessão falha. Ele segue o ponteiro com a cabeça e pula quando você clica nele. Com o ditado por voz ligado, o mascote do terminal que vai receber o texto segura um microfone enquanto você fala e comemora quando o texto entra.

Num terminal do Persisty, o comando `persisty` faz o mascote daquele terminal reagir: `persisty celebrate`, `persisty oops`, `persisty wave`, `persisty think` ou `persisty say` seguido de um texto de até 80 caracteres. Um script pode usar isso para avisar que terminou.

Ele vem ligado. Para tirar, desligue **Configurações › Aparência › Mascote no terminal**, ou clique nele com o botão direito e escolha **Esconder mascote**.

## Fora do app

No macOS, o mascote pode sair do canto do terminal e ficar em pé sobre as suas janelas, por cima de qualquer app. Assim ele avisa enquanto você está no editor ou no navegador. Ele vem desligado: ligue em **Configurações › Aparência › Mascote fora do app**, ou com **Mostrar o mascote fora do app**, na paleta de comandos. Com o mascote fora do app, o do terminal some.

Ele fica no topo da janela da frente, vai junto quando ela se mexe e cai quando ela some; quando nada acontece, senta e cochila. Arraste-o para qualquer lugar, em qualquer monitor, e ele lembra a posição. Clicar ou arrastar o mascote não tira o foco do app em que você está.

**O mascote anda sobre as janelas**, na mesma tela, vem ligado. Desligado, o mascote fica só onde você deixar.

## Avisos e balão

Quando uma sessão pede você e o Persisty não está em foco, o mascote sobe, mostra quantas estão esperando e diz qual, como "checkout pede permissão" ou "api fez uma pergunta". Ele também avisa quando uma sessão termina. Clicar na fala abre a sessão.

Um clique no mascote abre um balão. Em **Precisa de você** ficam as sessões que esperam, da espera mais antiga para a mais nova, com o que pediram, há quanto tempo e o botão **Abrir**; as que não cabem vão para **+2 no Quadro**, por exemplo. Em **Avisos** ficam as sessões que terminaram ou deram erro, com **Ok** para tirar uma e **Limpar** para tirar todas.

No topo do balão estão **Abrir o Quadro**, o sino e **Esconder mascote**, que desliga o mascote fora do app. O sino liga o **Não perturbe**: o mascote para de subir e de falar, mas a contagem continua. **Voltar a avisar**, no mesmo sino, desfaz.

## Plano e limites

O mascote é do plano grátis. Fora do app, ele existe só no macOS e só com o Persisty aberto: fechar o Persisty fecha o mascote. Como o Quadro, ele só abre sessões e nunca responde por você.
