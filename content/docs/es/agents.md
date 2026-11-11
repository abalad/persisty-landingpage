---
title: Agentes y estados
description: Cómo reconoce Persisty a Claude Code y a Codex y muestra quién está trabajando, quién te espera y quién pide permiso.
group: start
order: 4
---

Persisty reconoce agentes de dos formas: cuando abres la sesión como Claude Code o Codex, y cuando escribes `claude` en una terminal común abierta por Persisty. En los dos casos la sesión recibe el ícono del agente, el estado y el costo.

## Los estados

| Estado | Qué quiere decir |
| --- | --- |
| Trabajando | El agente recibió un pedido y todavía no terminó. |
| Esperándote | Terminó su turno y espera el próximo pedido. |
| Permiso pendiente | Quiere ejecutar algo y espera tu "sí" en la terminal. |
| Inactivo | Abierto, sin ningún pedido en curso. |
| Terminada | La conversación terminó. |

Los estados aparecen en la pestaña, en la tarjeta del workspace, en la barra de proyectos, en la lista de agentes y en el Tablero. Siempre vienen con ícono y palabra, nunca solo con color.

## El Tablero

Con varias sesiones en marcha, el Tablero responde quién te está esperando, desde hace cuánto y qué quiere. Muestra las sesiones de agente de todos los proyectos en cuatro columnas: **Te necesita**, **Trabajando**, **Respondió** y **Error**. Ábrelo con el botón junto a las pestañas o con <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd>.

Cada tarjeta dice en una línea qué quiere la sesión: el comando que espera permiso, la pregunta que hizo el agente, el final de la respuesta o el error, como "Límite de uso alcanzado". Una respuesta que termina en pregunta va a **Te necesita**, y un permiso que aprobaste en la propia terminal sale de la columna solo en pocos segundos. Las respuestas y los errores que todavía no abriste aparecen en negrita, con un punto.

La sesión que lleva más tiempo esperando recibe el marco ámbar, y la tecla <kbd>A</kbd> la abre. Un clic en una tarjeta abre la sesión, y <kbd>Esc</kbd> vuelve a la terminal. Arriba puedes cambiar **Todos los proyectos** por **Este proyecto**.

En Windows y Linux, el atajo es Ctrl+Shift+O. Con el mapa de teclas **WebStorm (macOS)**, <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>O</kbd> con el cursor en el código abre un archivo por nombre; ahí, usa el botón.

## La mascota fuera de la app

En macOS, la mascota puede salir de la esquina de la terminal y quedarse de pie sobre tus ventanas, encima de cualquier app. Así te avisa mientras estás en el editor o en el navegador, sin que tengas que mirar Persisty. Viene apagada: enciéndela en **Configuración › Apariencia › Mascota fuera de la app**.

Cuando una sesión te necesita, sube, muestra cuántas están esperando y dice cuál, como "checkout pide permiso". Un clic en lo que dice abre la sesión. Un clic en la mascota abre un globo con quién espera, desde hace cuánto y qué pidió, con atajos a la sesión y al Tablero. Hacer clic en la mascota o arrastrarla no le quita el foco a la app en la que estás.

Se queda en lo alto de la ventana de delante, va con ella cuando se mueve y se cae cuando desaparece; cuando no pasa nada, se sienta y dormita. Arrástrala a cualquier lugar, en cualquier monitor, y recuerda dónde quedó. Para que se quede solo donde la dejes, apaga **La mascota camina sobre tus ventanas** en la misma pantalla. En el globo, **No molestar** hace que deje de subir y de hablar, pero la cuenta sigue.

Con la mascota fuera de la app, la de la terminal desaparece. Cerrar Persisty cierra la mascota.

## De dónde viene el estado

En Claude Code, el estado viene de los **hooks** del propio Claude: eventos que dispara al empezar, al recibir un pedido, al detenerse y al pedir permiso. Persisty inyecta esos hooks en cada sesión con `--settings`, en un archivo solo suyo. Tu `~/.claude/settings.json` nunca se modifica.

Si Claude Code muestra el aviso de confianza de la carpeta ("Yes, I trust this folder"), este aparece antes de cualquier hook. Persisty no se salta ese aviso: el estado queda desconocido hasta que respondes en la terminal.

## Codex

Codex se abre y persiste como cualquier sesión. Tienes que aprobar sus hooks dentro del propio Codex (`/hooks`). Sin esa aprobación, el estado queda desconocido. La retomada después de un reinicio todavía no está confirmada, y Persisty lo marca.

## Modelo por sesión

La barra inferior de la sesión tiene un selector de modelo. La elección queda guardada y se pasa con `--model` en cada lanzamiento y en cada retomada. En una sesión ya abierta, Persisty escribe `/model` por ti.
