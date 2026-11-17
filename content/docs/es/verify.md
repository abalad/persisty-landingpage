---
title: Verificar al terminar
description: Un comando del workspace, como los tests, corre solo cuando el agente se detiene después de cambiar archivos, y el encabezado de la sesión muestra si pasó.
group: agents
order: 10
---

La verificación al terminar ejecuta un comando del workspace, como `pnpm test`, cuando el agente termina un turno en el que cambió archivos. El resultado aparece en el encabezado de la sesión.

## Elegir el comando

En el selector de comandos del workspace, junto a las pestañas, elige el comando, por ejemplo `pnpm test`. Abre el selector de nuevo: debajo de la lista aparece **Verificar al terminar con** (*Check on finish with*) seguido de su nombre. Un clic lo activa, con la marca de selección, y otro lo desactiva. El comando vale para todo el workspace: todas sus sesiones de agente usan el mismo. Si ya hay otro comando elegido, el menú muestra **Ahora:** (*Now:*) con él.

## Cuándo corre

Persisty anota el estado de los archivos cuando el agente recibe un pedido. Cuando termina el turno, si algún archivo cambió, el comando corre solo en la carpeta de la sesión. Un turno que no cambió nada no dispara la verificación. Si la respuesta dejó un subagente o un comando en segundo plano, la verificación espera a que ese trabajo acabe.

## El resultado

El encabezado de la sesión muestra **Verificación** (*Check*) con el resultado: **corriendo** (*running*), **pasó** (*passed*), **falló** (*failed*) con el código de salida, o **interrumpida** (*stopped*). Al hacer clic se abre la salida de la verificación en **Salida del comando** (*Command output*). El resultado no se envía al agente: lo lees tú.

## Plan y límites

La verificación es Pro; sin él, el elemento del menú aparece con la marca **Pro**. Vale para sesiones de Claude Code dentro de un workspace, en carpetas git, porque depende de los hooks que avisan el pedido y el fin del turno. Codex CLI no dispara la verificación.
