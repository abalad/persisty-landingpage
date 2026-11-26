---
title: Ditado por voz
description: Fale e o texto entra no terminal ou no editor em foco, com o modelo de voz rodando no seu computador.
group: integrations
order: 5
---

Com o ditado ligado, você fala e o texto entra no terminal ou no [editor](/docs/editor) em foco, sem apertar Enter. A transcrição roda no computador, e o áudio não sai dele.

## Ligar o ditado

Em [**Configurações › Voz**](/docs/settings#voz), ligue **Ditado por voz**; ele vem desligado. Antes do primeiro ditado, baixe o modelo de voz: em **Modelo de voz**, clique em **Baixar**, que mostra o tamanho, cerca de 640 MB. O download vem de `huggingface.co` e só acontece quando você pede.

## Ditar

![Com o terminal api em foco, Command, Shift e D começam o ditado, e o indicador mostra Ouvindo; a mesma tecla encerra, o indicador passa a Transcrevendo…, e o texto entra no prompt com o aviso Inserido em terminal api.](/docs-media/voice/voz.mp4)

Clique no terminal ou no editor que deve receber o texto e aperte <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd>. O indicador embaixo da janela mostra **Ouvindo**. Fale e aperte a mesma tecla de novo: o indicador passa a **Transcrevendo…** e depois diz onde o texto entrou, como "Inserido em terminal api". <kbd>Esc</kbd> cancela.

O texto vai para onde estava o foco quando você começou, mesmo que você clique em outro lugar. No terminal, ele é digitado como se fosse você, sem Enter: num agente, fica no prompt esperando você enviar. No editor, entra no cursor. Um arquivo somente leitura, ou coberto pela pré-visualização de Markdown, não recebe ditado. Se o terminal ou o arquivo fechar antes, nada é inserido, e **Copiar texto** copia o que foi transcrito.

Um ditado dura até 2 minutos. Nos últimos 10 segundos, o indicador conta o tempo, e no fim o texto entra sozinho. Se o Persisty sair da frente, o ditado é cancelado. Quando algo falha, o indicador diz o motivo, como "Nenhum microfone encontrado." ou "Não ouvi nada." Enquanto você fala, o [mascote](/docs/mascot#no-terminal) do terminal que vai receber o texto segura um microfone.

## Idioma e substituições

**Idioma do ditado** vem em **Igual ao app** e também pode ser **Português (Brasil)** ou **English**. O modelo entende as duas línguas; a escolha decide como números e termos viram texto. Números falados viram dígitos, "main ponto rs" vira `main.rs`, "traço traço release" vira `--release`, "underline" junta palavras com `_`, "arroba" vira `@`, e "barra" no começo vira um comando, como `/compact`.

Em **Substituições**, **Suas substituições** recebe uma regra por linha, no formato `falado => Substituição`; uma linha que começa com `#` é comentário. As suas regras valem antes das trocas do Persisty. São até 200 regras, de até 200 caracteres cada. **Experimentar** mostra o que uma frase digitada vira, como se fosse falada.

## Modelo de voz

O modelo é o Parakeet TDT 0.6B v3, da NVIDIA (licença CC BY 4.0), convertido pelo projeto sherpa-onnx. Ele vem de `huggingface.co`, é conferido por sha256 e aparece no registro de [Privacidade e rede](/docs/privacy-and-network). Antes de baixar, a linha mostra o espaço livre no disco.

Durante o download, a linha mostra o andamento e **Cancelar** e, depois, **Conferindo os arquivos…**. Um download interrompido fica **Incompleto**, com **Continuar**, que baixa só o que falta, e **Recomeçar**. Com o modelo pronto, a linha mostra o tamanho em disco e **Apagar**, que pede confirmação; sem o modelo, o ditado para até você baixar de novo. Se os arquivos não conferem, a linha diz **Com defeito** e oferece **Baixar de novo**. O modelo fica na pasta de dados do Persisty.

## Microfone

O Persisty usa a entrada padrão do sistema, que aparece em **Entrada**. No Mac, o macOS pede a permissão no primeiro ditado; se ela estiver **Bloqueada**, **Abrir Ajustes** leva à página do microfone nos Ajustes do Sistema. O áudio fica na memória só enquanto você dita e some depois da transcrição: nada é gravado em disco nem enviado.

## Atalho

<kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>D</kbd> é o padrão no Mac. No Windows e no Linux, que estão em prévia, é <kbd>Ctrl</kbd> <kbd>Shift</kbd> <kbd>D</kbd>. Para trocar, clique em **Mudar** na linha **Atalho** e aperte a combinação nova; <kbd>Esc</kbd> desiste, e **Padrão** volta à original.

No Mac, o atalho precisa do <kbd>⌘</kbd> e de uma letra, um número ou uma tecla de função. No Windows e no Linux, precisa de <kbd>Ctrl</kbd> <kbd>Shift</kbd> e de uma tecla, porque <kbd>Ctrl</kbd> com uma letra vai para o terminal. Uma combinação do sistema, como copiar ou colar, ou que o Persisty ou o mapa do editor já usam, é recusada, e a tela diz quem já a usa. Se a tecla gravada passa a ser também uma ação do mapa de teclas ou do Persisty, por exemplo depois de trocar de mapa, a linha **Atalho** avisa: o ditado fica com a tecla, e aquela ação não roda. Para escolher outra, use **Mudar**; a tecla nunca muda sozinha.

O atalho só funciona com o Persisty na frente, e **Ditar** aparece em **Configurações › Atalhos** com o ditado ligado.

## Plano e limites

O ditado é do plano grátis. Ele funciona com o Persisty na frente, num terminal ou no editor, por até 2 minutos de cada vez. As trocas de números e termos existem em português e em inglês.

No Windows e no Linux, a tela não mostra a permissão do microfone; se o microfone não mandar som, confira a entrada nas configurações de som do sistema.
