---
title: Mascota
description: La mascota en la esquina de la terminal sigue al agente de la sesión; en macOS también sale de la app y te avisa encima de tus ventanas.
group: agents
order: 3
---

La mascota está en la esquina de la terminal de la sesión y reacciona a lo que hace el agente. En macOS también puede salir de la app y quedarse de pie sobre tus ventanas, para avisarte cuando una sesión te necesita.

![La mascota camina por el borde superior de una ventana y llega a su orilla.](/changelog/0.10.0/mascote.mp4)

## En la terminal

La mascota sigue a la sesión en foco: sube cuando hay algo pendiente, como un pedido de permiso, celebra cuando termina un turno y se lamenta cuando falla el proceso de la sesión. Sigue el puntero con la cabeza y salta cuando le haces clic. Con el [dictado por voz](/docs/voice) encendido, la mascota de la terminal que va a recibir el texto sostiene un micrófono mientras hablas y celebra cuando el texto entra.

En una terminal de Persisty, el comando `persisty` hace reaccionar a la mascota de esa terminal: `persisty celebrate`, `persisty oops`, `persisty wave`, `persisty think` o `persisty say` seguido de un texto de hasta 80 caracteres. Un script puede usarlo para avisar que terminó.

Viene encendida. Para quitarla, apaga [**Configuración › Apariencia › Mascota en la terminal**](/docs/settings#apariencia) (*Settings › Appearance › Mascot in the terminal*), o haz clic derecho sobre ella y elige **Ocultar mascota** (*Hide mascot*).

## Fuera de la app

En macOS, la mascota puede salir de la esquina de la terminal y quedarse de pie sobre tus ventanas, encima de cualquier app. Así te avisa mientras estás en el editor o en el navegador. Viene apagada: enciéndela en **Configuración › Apariencia › Mascota fuera de la app** (*Mascot outside the app*), o con **Mostrar la mascota fuera de la app** (*Show the mascot outside the app*) en la paleta de comandos. Con la mascota fuera de la app, la de la terminal desaparece.

Se queda en lo alto de la ventana de delante, va con ella cuando se mueve y se cae cuando desaparece; cuando no pasa nada, se sienta y dormita. Arrástrala a cualquier lugar, en cualquier monitor, y recuerda dónde quedó. Hacer clic en la mascota o arrastrarla no le quita el foco a la app en la que estás.

**La mascota camina sobre tus ventanas** (*The mascot walks on your windows*), en la misma pantalla, viene encendida. Apagada, la mascota se queda solo donde la dejes.

## Avisos y globo

Cuando una sesión te necesita y Persisty no está en foco, la mascota sube, muestra cuántas están esperando y dice cuál, como "checkout pide permiso" o "api hizo una pregunta". También avisa cuando una sesión termina. Un clic en lo que dice abre la sesión.

Un clic en la mascota abre un globo. En **Te necesita** (*Needs you*) están las sesiones que esperan, de la espera más antigua a la más nueva, con lo que pidieron, desde hace cuánto y el botón **Abrir** (*Open*); las que no caben van al [Tablero](/docs/board), en un elemento como **+2 en el Tablero** (*+2 on the Board*). En **Avisos** (*Notices*) están las sesiones que terminaron o dieron error, con **Ok** para quitar una y **Limpiar** (*Clear*) para quitarlas todas.

Arriba del globo están **Abrir el Tablero** (*Open the Board*), la campana y **Ocultar mascota**, que apaga la mascota fuera de la app. La campana enciende **No molestar** (*Do not disturb*): la mascota deja de subir y de hablar, pero la cuenta sigue. **Volver a avisar** (*Notify me again*), en la misma campana, lo deshace.

## Plan y límites

La mascota es del plan gratis. Fuera de la app, existe solo en macOS y solo con Persisty abierto: cerrar Persisty cierra la mascota. Como el Tablero, solo abre sesiones y nunca responde por ti.
