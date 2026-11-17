---
title: Agentes que leen Persisty
description: Herramientas que le dicen a Claude Code en qué sesión está, le muestran el proyecto y las otras sesiones, y leen la salida de los comandos del workspace.
group: integrations
order: 4
---

Con **Herramientas de Persisty en los agentes** (*Persisty tools in agents*) encendido, las sesiones de Claude Code reciben herramientas que leen el propio Persisty: la sesión en la que está el agente, el proyecto, las otras sesiones y la salida de los comandos del workspace. Ninguna escribe en otra terminal ni cambia nada.

## Encender

En [**Configuración › Agentes**](/docs/settings#agentes) (*Settings › Agents*), el grupo **Acceso de los agentes (MCP)** (*Agent access (MCP)*) tiene **Herramientas de Persisty en los agentes**, apagado por defecto. El cambio vale para las sesiones de Claude Code que empiecen o se reinicien después; las que ya están abiertas siguen como estaban. Cada sesión recibe una credencial propia, y las herramientas solo responden sobre el proyecto de esa sesión.

## Qué lee el agente

Son cuatro herramientas, y el agente llama a cada una cuando la necesita. `current_session` dice el nombre de la sesión, el proyecto, el workspace con la carpeta y la rama por defecto, la rama actual y, en una [carpeta propia](/docs/worktrees), su rama y su base. `list_sessions` lista las sesiones del mismo proyecto, también las ejecuciones de los comandos, con el agente, el [estado](/docs/agents#los-estados) (trabajando, esperándote, pidiendo permiso, detenido), la carpeta y la rama de cada una, para que el agente no trabaje en la misma rama que otro. `get_project` muestra el nombre y la descripción del proyecto, los workspaces con el remoto y la rama por defecto de cada uno, y los [comandos del workspace](/docs/commands), los que guardaste y los que Persisty encontró, con el comando de cada uno. `read_task_output` lee las últimas líneas que imprimió uno de esos comandos, en marcha o ya terminado, con el código de salida: 100 por defecto, hasta 500. Recibe el id que `list_sessions` le da a la ejecución, y no lee terminales ni agentes.

Las herramientas le preguntan a la app. Con Persisty cerrado, se lo dicen al agente.

## Verificar instalación

**Verificar instalación** (*Check installation*) abre el servidor como lo abriría Claude Code, hace el saludo inicial de MCP, lista las herramientas y habla con la app. Cada paso aparece con **ok** o **falló** (*failed*), y el motivo cuando falla. Funcionó cuando el resumen empieza con "Working", seguido de la versión de MCP y la cantidad de herramientas.

## Codex CLI

Persisty no modifica la configuración de Codex. Por eso, en la misma pantalla, la fila **Codex CLI** muestra un comando para que lo ejecutes una vez en la terminal, como `codex mcp add persisty -- '/Applications/Persisty.app/Contents/MacOS/persist-desktop' mcp-server`, con **Copiar** (*Copy*) al lado. Con el interruptor encendido, las sesiones de Codex que abre Persisty reciben su credencial. Este camino está marcado como **No verificado** (*Not verified*).

## Plan y límites

Las herramientas de Persisty son del plan gratis. Solo leen, solo responden sobre el proyecto de la sesión y solo hablan con la app en esta computadora, que tiene que estar abierta. Lo que devuelven, como nombres de rama, remotos y la salida de los comandos, entra en la conversación del agente y va adonde ella ya va, al proveedor del agente. Valen para las sesiones abiertas como Claude Code; en Codex CLI, dependen del comando de arriba, todavía no verificado.

Los servidores MCP de otros servicios, como GitHub o Sentry, están en [Servidores MCP](/docs/mcp-servers).
