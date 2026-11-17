---
title: Agentes y estados
description: Cómo reconoce Persisty a Claude Code y a Codex y muestra quién está trabajando, quién te espera y quién pide permiso.
group: agents
order: 1
---

Persisty reconoce agentes de dos formas: cuando abres la sesión como Claude Code o Codex CLI, y cuando escribes `claude` en una terminal común abierta por Persisty. En los dos casos la sesión recibe el ícono del agente. El estado y el costo vienen de Claude Code; lo que funciona y lo que todavía no funciona en Codex está en [Codex CLI](#codex-cli).

## Los estados

| Estado | Qué quiere decir |
| --- | --- |
| Trabajando (*Working*) | El agente recibió un pedido y todavía no terminó, incluido lo que dejó en marcha en segundo plano, como subagentes. |
| Concluido (*Done*) | Terminó su turno y espera el próximo pedido. |
| Permiso pendiente (*Permission pending*) | Quiere ejecutar algo y espera tu "sí" en la terminal. |
| Inactivo (*Idle*) | Abierto, sin ningún pedido en curso, o con el estado todavía desconocido. |
| Terminado (*Ended*) | La conversación terminó. |

La palabra aparece en el encabezado de la sesión, en la línea de la sesión en la tarjeta del workspace, en la lista de **Agentes** (*Agents*) de la barra de proyectos expandida y en el panel **Detalles** (*Details*). La pestaña muestra el ícono del agente y un punto de color; la palabra está en la sugerencia que aparece al pasar el puntero. Contraída, la barra de proyectos muestra un punto por proyecto, explicado en [Barra de proyectos](/docs/projects-and-workspaces#barra-de-proyectos). El Tablero separa las sesiones en columnas.

En una terminal común, la sesión muestra **Ejecutando** (*Running*), con el nombre del comando, mientras algo corre, e **Inactivo** (*Idle*) de vuelta en el prompt. Una sesión sin proceso muestra el estado del proceso, como **Interrumpida** (*Interrupted*), **Terminada** (*Exited*) o **Falló** (*Failed*).

## Notificaciones

Cuando un agente termina su turno o pide permiso, Persisty te avisa, a menos que ya estés mirando esa sesión. Con la ventana de Persisty en foco, aparece una alerta en la esquina, con el botón **Ver** (*View*); con otra ventana delante, llega la notificación del sistema. Las dos vienen con un sonido corto. Los avisos y el sonido vienen encendidos. Para cambiarlos, usa **Configuración › Notificaciones** (*Settings › Notifications*), donde **Enviar prueba** (*Send a test*) muestra cómo se ven.

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

Si Claude Code muestra el aviso de confianza de la carpeta ("Yes, I trust this folder"), este aparece antes de cualquier hook. Persisty no se salta ese aviso: el estado queda desconocido hasta que respondes en la terminal. Mientras tanto, la sesión aparece como **Inactivo** (*Idle*), y el Tablero dice **Sin noticias del agente** (*No word from the agent*).

## Codex CLI

Codex CLI se abre y persiste como cualquier sesión: tiene pestaña y línea en la tarjeta del workspace, y Persisty reconecta la terminal cuando vuelves a abrir la app con él todavía en marcha.

Dos cosas todavía no funcionan. La primera es el estado: Persisty no modifica la configuración de Codex y no recibe sus eventos, así que la sesión aparece como **Inactivo** (*Idle*) mientras corre y no envía notificaciones. La segunda es retomar la conversación: después de un reinicio de la computadora, la sesión vuelve como una terminal común en su carpeta, sin Codex, y el informe de restauración dice **Relanzada** (*Relaunched*). En **Configuración › Agentes** (*Settings › Agents*), Codex CLI aparece con la retomada y el estado marcados como **No verificado** (*Not verified*).

## Modelo por sesión

En Claude Code, la barra inferior de la sesión tiene un selector de modelo. La elección queda guardada y se pasa con `--model` en cada lanzamiento y en cada retomada. En una sesión ya abierta, Persisty escribe `/model` por ti. En Codex CLI, la barra inferior solo muestra el nombre del agente, sin selector.

## Agente por defecto

<kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> abre directamente una sesión con el agente por defecto en el workspace actual, y en <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> ya viene elegido. El predeterminado es Claude Code; cámbialo en **Configuración › Agentes › Agente por defecto** (*Settings › Agents › Default agent*). Si el elegido no está instalado, se usa el primer agente instalado.

## Herramientas para los agentes

**Herramientas de Persisty en los agentes** (*Persisty tools in agents*), en **Configuración › Agentes** (*Settings › Agents*), da a las sesiones de Claude Code herramientas que leen el proyecto, sus sesiones y la salida de los comandos del workspace. Ninguna escribe en otra terminal. Viene apagado y vale para las sesiones que empiecen o se reinicien después de encenderlo; **Verificar instalación** (*Check installation*) prueba que funciona. Para Codex CLI, la misma pantalla muestra un comando para que lo ejecutes una vez en la terminal, porque Persisty no modifica la configuración de Codex; ese camino está marcado como **No verificado** (*Not verified*).

Otros servidores MCP, como GitHub, Sentry o Supabase, se instalan en **Configuración › Servidores MCP** (*Settings › MCP servers*) y se encienden por proyecto en **Ajustes del proyecto › Servidores MCP** (*Project settings › MCP servers*). Valen solo para las sesiones de Claude Code que empiecen o se reinicien después.
