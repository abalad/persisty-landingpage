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

La palabra aparece en el encabezado de la sesión, en la línea de la sesión en la tarjeta del workspace, en la lista de **Agentes** (*Agents*) de la barra de proyectos expandida y en el panel **Detalles** (*Details*). La pestaña muestra el ícono del agente y un punto de color; la palabra está en la sugerencia que aparece al pasar el puntero. Contraída, la barra de proyectos muestra un punto por proyecto, explicado en [Barra de proyectos](/docs/projects-and-workspaces#barra-de-proyectos). El [Tablero](/docs/board) reúne las sesiones de agente de todos los proyectos en columnas, y las [notificaciones](/docs/notifications) avisan cuando una termina o pide permiso.

En una terminal común, la sesión muestra **Ejecutando** (*Running*), con el nombre del comando, mientras algo corre, e **Inactivo** de vuelta en el prompt. Una sesión sin proceso muestra el estado del proceso, como **Interrumpida** (*Interrupted*), **Terminada** (*Exited*) o **Falló** (*Failed*).

## Trabajo en segundo plano

Cuando Claude Code termina la respuesta pero deja un subagente o un comando en segundo plano, la sesión se queda en **Trabajando** hasta que ese trabajo acaba. La cola de pedidos, el aviso de concluido y la verificación al terminar esperan ese mismo final.

Un subagente cuenta como trabajo mientras da señales de vida, hasta 2 horas sin noticias suyas. Un comando en segundo plano, como un servidor de desarrollo, no da noticias: cuenta durante 10 minutos después de que termina la respuesta. Pasado ese tiempo, la sesión muestra el estado en que se quedó Claude Code.

## Claude Code

Cada sesión de Claude Code se abre con un id de conversación que elige Persisty (`--session-id`). Con él, Persisty retoma la misma conversación, con `--resume`, cuando la sesión vuelve después de un reinicio; mira [Volver después de un cuelgue](/docs/sessions-and-recovery).

El estado viene de los **hooks** del propio Claude: eventos que dispara al empezar, al recibir un pedido, al detenerse y al pedir permiso. Persisty inyecta esos hooks en cada sesión con `--settings`, en un archivo solo suyo. Tu `~/.claude/settings.json` nunca se modifica. El `claude` que escribes en una terminal común recibe los mismos hooks; si pasas tu propio `--settings`, vale el tuyo y el estado de esa sesión queda desconocido.

Si Claude Code muestra el aviso de confianza de la carpeta ("Yes, I trust this folder"), este aparece antes de cualquier hook. Persisty no se salta ese aviso: el estado queda desconocido hasta que respondes en la terminal. Mientras tanto, la sesión aparece como **Inactivo**, y el Tablero dice **Sin noticias del agente** (*No word from the agent*).

## Codex CLI

Codex CLI se abre y persiste como cualquier sesión: tiene pestaña y línea en la tarjeta del workspace, y Persisty reconecta la terminal cuando vuelves a abrir la app con él todavía en marcha.

Dos cosas todavía no funcionan. La primera es el estado: Persisty no modifica la configuración de Codex y no recibe sus eventos, así que la sesión aparece como **Inactivo** mientras corre y no envía notificaciones. La segunda es retomar la conversación: después de un reinicio de la computadora, la sesión vuelve como una terminal común en su carpeta, sin Codex, y el informe de restauración dice **Relanzada** (*Relaunched*).

## Modelo por sesión

En Claude Code, la barra inferior de la sesión tiene un selector de modelo. La elección queda guardada y se pasa con `--model` en cada lanzamiento y en cada retomada. En una sesión ya abierta, Persisty escribe `/model` por ti. En Codex CLI, la barra inferior solo muestra el nombre del agente, sin selector.

## Agente por defecto

<kbd>⌥</kbd> <kbd>⌘</kbd> <kbd>N</kbd> abre directamente una sesión con el agente por defecto en el workspace actual, y en <kbd>⌘</kbd> <kbd>⇧</kbd> <kbd>N</kbd> ya viene elegido. En **Configuración › Agentes › Agente por defecto** (*Settings › Agents › Default agent*), elige entre **Claude Code**, que es el predeterminado, **Codex CLI** y **Terminal**. Un agente que no está en la computadora aparece con "(no instalado)" (*not installed*) junto al nombre. Si es el elegido, se usa Claude Code o, sin él, Codex CLI; sin ninguno de los dos, se abre una terminal.

## Agentes detectados

En la misma pantalla, **Agentes detectados** (*Detected agents*) muestra Claude Code y Codex CLI tal como Persisty los encontró en esta computadora: la versión, o **no instalado**, y dónde está el programa, en **Instalado en …** (*Installed at …*) o **No encontrado en el PATH** (*Not found on PATH*). Debajo, una línea dice qué puede hacer Persisty con cada uno. En Claude Code son identidad de sesión, retomada y estado por hooks, con uso/tokens marcado como **No verificado** (*Not verified*). En Codex CLI, las cuatro cosas aparecen como **No verificado**.

## Herramientas para los agentes

**Herramientas de Persisty en los agentes** (*Persisty tools in agents*), en **Configuración › Agentes**, da a las sesiones de Claude Code herramientas que leen el proyecto, sus sesiones y la salida de los comandos del workspace. Ninguna escribe en otra terminal. Viene apagado y vale para las sesiones que empiecen o se reinicien después de encenderlo; **Verificar instalación** (*Check installation*) prueba que funciona. Para Codex CLI, la misma pantalla muestra un comando para que lo ejecutes una vez en la terminal, porque Persisty no modifica la configuración de Codex; ese camino está marcado como **No verificado**.

Otros servidores MCP, como GitHub, Sentry o Supabase, se instalan en **Configuración › Servidores MCP** (*Settings › MCP servers*) y se encienden por proyecto en **Ajustes del proyecto › Servidores MCP** (*Project settings › MCP servers*). Valen solo para las sesiones de Claude Code que empiecen o se reinicien después.
